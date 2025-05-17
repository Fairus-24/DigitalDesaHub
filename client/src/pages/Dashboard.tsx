
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Umkm, Category } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Trash2, RefreshCw, Edit, Plus } from 'lucide-react';

export default function Dashboard() {
  const { data: umkms = [] } = useQuery<Umkm[]>({ queryKey: ['/api/umkms'] });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ['/api/categories'] });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [newUmkm, setNewUmkm] = useState<Partial<Umkm>>({});
  const [editingUmkm, setEditingUmkm] = useState<Umkm | null>(null);
  const [deletedUmkms, setDeletedUmkms] = useState<Umkm[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [umkmToDelete, setUmkmToDelete] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

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
      setIsAddDialogOpen(false);
      setNewUmkm({});
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
      setIsEditDialogOpen(false);
      setEditingUmkm(null);
    }
  });

  const deleteUmkmMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/umkms/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete UMKM');
    },
    onSuccess: (_, id) => {
      const deletedUmkm = umkms.find(u => u.id === id);
      if (deletedUmkm) {
        setDeletedUmkms(prev => [...prev, deletedUmkm]);
      }
      queryClient.invalidateQueries({ queryKey: ['/api/umkms'] });
      toast({ title: "Success", description: "UMKM moved to recycle bin" });
    }
  });

  const handleDelete = (id: number) => {
    setUmkmToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (umkmToDelete) {
      deleteUmkmMutation.mutate(umkmToDelete);
      setIsDeleteDialogOpen(false);
      setUmkmToDelete(null);
    }
  };

  const handleRestore = (umkm: Umkm) => {
    createUmkmMutation.mutate(umkm);
    setDeletedUmkms(prev => prev.filter(u => u.id !== umkm.id));
  };

  const handleEdit = (umkm: Umkm) => {
    setEditingUmkm(umkm);
    setIsEditDialogOpen(true);
  };

  const UmkmForm = ({ data, setData, isEdit = false }: { data: Partial<Umkm>, setData: (data: Partial<Umkm>) => void, isEdit?: boolean }) => (
    <div className="grid gap-4 py-4">
      <div className="grid gap-2">
        <label>Name</label>
        <Input value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <label>Description</label>
        <Textarea value={data.description || ''} onChange={(e) => setData({ ...data, description: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <label>Category</label>
        <Select value={String(data.categoryId)} onValueChange={(value) => setData({ ...data, categoryId: Number(value) })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={String(category.id)}>{category.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <label>Location</label>
        <Input value={data.location || ''} onChange={(e) => setData({ ...data, location: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <label>Address</label>
        <Input value={data.address || ''} onChange={(e) => setData({ ...data, address: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <label>Image URL</label>
        <Input value={data.imageUrl || ''} onChange={(e) => setData({ ...data, imageUrl: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <label>Current Condition</label>
        <Input value={data.currentCondition || ''} onChange={(e) => setData({ ...data, currentCondition: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <label>Promotion Text</label>
        <Input value={data.promotionText || ''} onChange={(e) => setData({ ...data, promotionText: e.target.value })} />
      </div>
      <div className="grid gap-2">
        <label>History</label>
        <Textarea value={data.history || ''} onChange={(e) => setData({ ...data, history: e.target.value })} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="umkm" className="space-y-4">
        <TabsList>
          <TabsTrigger value="umkm">UMKM</TabsTrigger>
          <TabsTrigger value="deleted">Recycle Bin</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="umkm">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">UMKM List</h2>
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <Button><Plus className="w-4 h-4 mr-2" /> Add UMKM</Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New UMKM</DialogTitle>
                  </DialogHeader>
                  <UmkmForm data={newUmkm} setData={setNewUmkm} />
                  <DialogFooter>
                    <Button onClick={() => createUmkmMutation.mutate(newUmkm)}>Create</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <div className="overflow-x-auto">
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
                      <TableCell className="font-medium">{umkm.name}</TableCell>
                      <TableCell>
                        {categories.find(c => c.id === umkm.categoryId)?.name}
                      </TableCell>
                      <TableCell>{umkm.location}</TableCell>
                      <TableCell>
                        <Badge variant={umkm.currentCondition === 'Aktif' ? 'success' : 'destructive'}>
                          {umkm.currentCondition}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(umkm)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(umkm.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="deleted">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Deleted UMKM</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deletedUmkms.map((umkm) => (
                  <TableRow key={umkm.id}>
                    <TableCell>{umkm.name}</TableCell>
                    <TableCell>
                      {categories.find(c => c.id === umkm.categoryId)?.name}
                    </TableCell>
                    <TableCell>{umkm.location}</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(umkm)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Restore
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This UMKM will be moved to the recycle bin. You can restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit UMKM</DialogTitle>
          </DialogHeader>
          {editingUmkm && (
            <>
              <UmkmForm
                data={editingUmkm}
                setData={(data) => setEditingUmkm({ ...editingUmkm, ...data })}
                isEdit={true}
              />
              <DialogFooter>
                <Button onClick={() => updateUmkmMutation.mutate(editingUmkm)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
