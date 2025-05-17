
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Umkm, Category } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { data: umkms = [] } = useQuery<Umkm[]>({ queryKey: ['/api/umkms'] });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ['/api/categories'] });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [newUmkm, setNewUmkm] = useState<Partial<Umkm>>({});
  const [editingUmkm, setEditingUmkm] = useState<Umkm | null>(null);
  const [newCategory, setNewCategory] = useState<Partial<Category>>({});
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const createUmkmMutation = useMutation({
    mutationFn: async (data: Partial<Umkm>) => {
      const response = await fetch('/api/umkms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create UMKM');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/umkms'] });
      toast({ title: "Success", description: "UMKM created successfully" });
    }
  });

  const updateUmkmMutation = useMutation({
    mutationFn: async (data: Umkm) => {
      const response = await fetch(`/api/umkms/${data.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update UMKM');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/umkms'] });
      toast({ title: "Success", description: "UMKM updated successfully" });
    }
  });

  const deleteUmkmMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/umkms/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete UMKM');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/umkms'] });
      toast({ title: "Success", description: "UMKM deleted successfully" });
    }
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: Partial<Category>) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create category');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({ title: "Success", description: "Category created successfully" });
    }
  });

  return (
    <div className="min-h-screen bg-neutral p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="umkm">
        <TabsList>
          <TabsTrigger value="umkm">UMKM</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="umkm">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">UMKM List</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add UMKM</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New UMKM</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder="Name"
                      value={newUmkm.name || ''}
                      onChange={(e) => setNewUmkm({ ...newUmkm, name: e.target.value })}
                    />
                    <Input
                      placeholder="Location"
                      value={newUmkm.location || ''}
                      onChange={(e) => setNewUmkm({ ...newUmkm, location: e.target.value })}
                    />
                    <Button onClick={() => createUmkmMutation.mutate(newUmkm)}>
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {umkms.map((umkm) => (
                  <TableRow key={umkm.id}>
                    <TableCell>{umkm.name}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === umkm.categoryId)?.name}
                    </TableCell>
                    <TableCell>{umkm.location}</TableCell>
                    <TableCell>{umkm.currentCondition}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteUmkmMutation.mutate(umkm.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Categories List</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Add Category</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <Input
                      placeholder="Name"
                      value={newCategory.name || ''}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                    />
                    <Input
                      placeholder="Slug"
                      value={newCategory.slug || ''}
                      onChange={(e) => setNewCategory({ ...newCategory, slug: e.target.value })}
                    />
                    <Button onClick={() => createCategoryMutation.mutate(newCategory)}>
                      Create
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {}}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
