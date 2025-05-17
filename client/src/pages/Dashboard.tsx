
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Umkm, Category } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

  const generateDummyReviews = () => {
    const dummyNames = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Wilson", "David Brown"];
    const dummyComments = [
      "Pelayanannya sangat baik dan ramah!",
      "Produknya berkualitas, recommended!",
      "Harga terjangkau dan tempat nyaman",
      "Suka banget dengan produknya, akan kembali lagi",
      "Pelayanan cepat dan memuaskan"
    ];
    
    return Array.from({ length: 3 }, (_, i) => ({
      author: dummyNames[Math.floor(Math.random() * dummyNames.length)],
      rating: Math.floor(Math.random() * 2) + 4,
      comment: dummyComments[Math.floor(Math.random() * dummyComments.length)],
      date: new Date().toISOString()
    }));
  };

  const UmkmForm = ({ data, setData, isEdit = false }: { data: Partial<Umkm>, setData: (data: Partial<Umkm>) => void, isEdit?: boolean }) => {
    useEffect(() => {
      if (!isEdit && !data.reviews) {
        const dummyReviews = generateDummyReviews();
        setData({ ...data, reviews: dummyReviews });
      }
    }, [isEdit, data, setData]);
    
    return (
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Name</label>
            <Input value={data.name || ''} onChange={(e) => setData({ ...data, name: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Category</label>
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
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Description</label>
          <Textarea value={data.description || ''} onChange={(e) => setData({ ...data, description: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Location</label>
            <Input value={data.location || ''} onChange={(e) => setData({ ...data, location: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Address</label>
            <Input value={data.address || ''} onChange={(e) => setData({ ...data, address: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Image URL</label>
          <Input value={data.imageUrl || ''} onChange={(e) => setData({ ...data, imageUrl: e.target.value })} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Current Condition</label>
            <Input value={data.currentCondition || ''} onChange={(e) => setData({ ...data, currentCondition: e.target.value })} />
          </div>
          <div className="grid gap-2">
            <label className="text-sm font-medium">Promotion Text</label>
            <Input value={data.promotionText || ''} onChange={(e) => setData({ ...data, promotionText: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">History</label>
          <Textarea value={data.history || ''} onChange={(e) => setData({ ...data, history: e.target.value })} />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Maps URL 1 (Overview)</label>
          <Input value={data.maps1 || ''} onChange={(e) => setData({ ...data, maps1: e.target.value })} />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-medium">Maps URL 2 (Detailed)</label>
          <Input value={data.maps2 || ''} onChange={(e) => setData({ ...data, maps2: e.target.value })} />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="mb-8">
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="umkm" className="space-y-4">
        <TabsList className="bg-white p-1 shadow-sm">
          <TabsTrigger value="umkm">UMKM</TabsTrigger>
          <TabsTrigger value="deleted">Recycle Bin</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="umkm">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">UMKM List</h2>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 mr-2" /> Add UMKM</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deleted">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-6">Deleted UMKM</h2>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Categories</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button><Plus className="w-4 h-4 mr-2" /> Add Category</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const name = formData.get('name') as string;
                      const slug = name.toLowerCase().replace(/\s+/g, '-');
                      
                      fetch('/api/categories', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, slug }),
                      }).then(() => {
                        queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
                        (e.target as HTMLFormElement).reset();
                        toast({ title: "Success", description: "Category created successfully" });
                      });
                    }}>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="name">Name</Label>
                          <Input id="name" name="name" required />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Create</Button>
                      </DialogFooter>
                    </form>
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
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newName = window.prompt('Enter new name:', category.name);
                              if (newName) {
                                const newSlug = newName.toLowerCase().replace(/\s+/g, '-');
                                fetch(`/api/categories/${category.id}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ name: newName, slug: newSlug }),
                                }).then(() => {
                                  queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
                                  toast({ title: "Success", description: "Category updated successfully" });
                                });
                              }
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this category?')) {
                                fetch(`/api/categories/${category.id}`, {
                                  method: 'DELETE',
                                }).then(() => {
                                  queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
                                  toast({ title: "Success", description: "Category deleted successfully" });
                                });
                              }
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
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
