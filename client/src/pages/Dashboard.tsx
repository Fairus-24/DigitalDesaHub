import React, { useState, useEffect, useRef } from 'react';
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
import { getUMKM, addUMKM, getKategori, addKategori, updateUMKM, deleteUMKM, restoreUMKM, updateKategori, deleteKategori } from '@/lib/umkmService';

// Perbaikan: Gunakan tipe yang konsisten antara string[] dan string pada state newUmkm
export default function Dashboard() {
  const queryClient = useQueryClient();
  const { data: umkms = [] } = useQuery({ queryKey: ['firestore-umkms'], queryFn: getUMKM });
  const { data: categories = [] } = useQuery({ queryKey: ['firestore-categories'], queryFn: getKategori });
  const { toast } = useToast();

  // Gunakan tipe yang sesuai dengan Umkm
  const [newUmkm, setNewUmkm] = useState<Partial<Umkm>>({
    name: "",
    description: "",
    history: "",
    currentCondition: "",
    imageUrl: "",
    productImages: [], // string[]
    location: "",
    address: "",
    categoryId: 1,
    promotionText: "",
    coordinates: "",
    maps1: "",
    maps2: "",
    reviews: [], // array of review object
  });
  const [editingUmkm, setEditingUmkm] = useState<Umkm | null>(null);
  const [deletedUmkms, setDeletedUmkms] = useState<Umkm[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [umkmToDelete, setUmkmToDelete] = useState<number | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Tambah UMKM
  const createUmkmMutation = useMutation({
    mutationFn: async (data: Partial<Umkm>) => {
      return await addUMKM(data as Umkm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firestore-umkms'] });
      toast({ title: "Success", description: "UMKM created successfully" });
      setIsAddDialogOpen(false);
      setNewUmkm({});
    }
  });

  // Tambah kategori
  const createCategoryMutation = useMutation({
    mutationFn: async (data: Partial<Category>) => {
      return await addKategori(data as Category);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firestore-categories'] });
      toast({ title: "Success", description: "Category created successfully" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || 'Failed to create category',
        variant: 'destructive',
      });
      console.error('[createCategoryMutation] Error:', error);
    }
  });

  const deleteUmkmMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteUMKM(id);
    },
    onSuccess: (_, id) => {
      const deletedUmkm = umkms.find(u => u.id === id);
      if (deletedUmkm) {
        setDeletedUmkms(prev => [...prev, deletedUmkm]);
      }
      queryClient.invalidateQueries({ queryKey: ['firestore-umkms'] });
      toast({ title: "Success", description: "UMKM moved to recycle bin" });
    }
  });

  const updateUmkmMutation = useMutation({
    mutationFn: async (data: Partial<Umkm> & { id: number }) => {
      await updateUMKM(data.id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firestore-umkms'] });
      toast({ title: "Success", description: "UMKM updated successfully" });
    }
  });

  const restoreUmkmMutation = useMutation({
    mutationFn: async (umkm: Umkm) => {
      await restoreUMKM(umkm);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firestore-umkms'] });
      toast({ title: "Success", description: "UMKM restored" });
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, name, slug }: { id: number, name: string, slug: string }) => {
      await updateKategori(id, { name, slug });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firestore-categories'] });
      toast({ title: "Success", description: "Category updated successfully" });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await deleteKategori(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['firestore-categories'] });
      toast({ title: "Success", description: "Category deleted successfully" });
    }
  });

  // Tambahkan useEffect untuk update categoryId jika categories sudah ada dan newUmkm belum diisi
  useEffect(() => {
    if (categories.length > 0 && !newUmkm.categoryId) {
      setNewUmkm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories]);
  
  // State untuk Add UMKM (per field)
  const [umkmName, setUmkmName] = useState("");
  const [umkmCategoryId, setUmkmCategoryId] = useState(1);
  const [umkmDescription, setUmkmDescription] = useState("");
  const [umkmHistory, setUmkmHistory] = useState("");
  const [umkmCurrentCondition, setUmkmCurrentCondition] = useState("");
  const [umkmImageUrl, setUmkmImageUrl] = useState("");
  const [umkmProductImages, setUmkmProductImages] = useState<string[]>([]);
  const [umkmLocation, setUmkmLocation] = useState("");
  const [umkmAddress, setUmkmAddress] = useState("");
  const [umkmPromotionText, setUmkmPromotionText] = useState("");
  const [umkmCoordinates, setUmkmCoordinates] = useState("");
  const [umkmMaps1, setUmkmMaps1] = useState("");
  const [umkmMaps2, setUmkmMaps2] = useState("");

  // State untuk Edit UMKM (per field)
  const [editUmkmName, setEditUmkmName] = useState("");
  const [editUmkmCategoryId, setEditUmkmCategoryId] = useState(1);
  const [editUmkmDescription, setEditUmkmDescription] = useState("");
  const [editUmkmHistory, setEditUmkmHistory] = useState("");
  const [editUmkmCurrentCondition, setEditUmkmCurrentCondition] = useState("");
  const [editUmkmImageUrl, setEditUmkmImageUrl] = useState("");
  const [editUmkmProductImages, setEditUmkmProductImages] = useState<string[]>([]);
  const [editUmkmLocation, setEditUmkmLocation] = useState("");
  const [editUmkmAddress, setEditUmkmAddress] = useState("");
  const [editUmkmPromotionText, setEditUmkmPromotionText] = useState("");
  const [editUmkmCoordinates, setEditUmkmCoordinates] = useState("");
  const [editUmkmMaps1, setEditUmkmMaps1] = useState("");
  const [editUmkmMaps2, setEditUmkmMaps2] = useState("");

  // Sinkronisasi state edit ketika editingUmkm berubah
  useEffect(() => {
    if (editingUmkm) {
      setEditUmkmName(editingUmkm.name || "");
      setEditUmkmCategoryId(editingUmkm.categoryId ?? 1);
      setEditUmkmDescription(editingUmkm.description || "");
      setEditUmkmHistory(editingUmkm.history || "");
      setEditUmkmCurrentCondition(editingUmkm.currentCondition || "");
      setEditUmkmImageUrl(editingUmkm.imageUrl || "");
      setEditUmkmProductImages(editingUmkm.productImages ?? []);
      setEditUmkmLocation(editingUmkm.location || "");
      setEditUmkmAddress(editingUmkm.address || "");
      setEditUmkmPromotionText(editingUmkm.promotionText || "");
      setEditUmkmCoordinates(editingUmkm.coordinates || "");
      setEditUmkmMaps1(editingUmkm.maps1 || "");
      setEditUmkmMaps2(editingUmkm.maps2 || "");
    }
  }, [editingUmkm]);

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
    restoreUmkmMutation.mutate(umkm);
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

  // Form UMKM (gunakan satu state per field)
  const UmkmForm = ({
    name, setName,
    categoryId, setCategoryId,
    description, setDescription,
    history, setHistory,
    currentCondition, setCurrentCondition,
    imageUrl, setImageUrl,
    productImages, setProductImages,
    location, setLocation,
    address, setAddress,
    promotionText, setPromotionText,
    coordinates, setCoordinates,
    maps1, setMaps1,
    maps2, setMaps2,
  }: {
    name: string;
    setName: (v: string) => void;
    categoryId: number;
    setCategoryId: (v: number) => void;
    description: string;
    setDescription: (v: string) => void;
    history: string;
    setHistory: (v: string) => void;
    currentCondition: string;
    setCurrentCondition: (v: string) => void;
    imageUrl: string;
    setImageUrl: (v: string) => void;
    productImages: string[];
    setProductImages: (v: string[]) => void;
    location: string;
    setLocation: (v: string) => void;
    address: string;
    setAddress: (v: string) => void;
    promotionText: string;
    setPromotionText: (v: string) => void;
    coordinates: string;
    setCoordinates: (v: string) => void;
    maps1: string;
    setMaps1: (v: string) => void;
    maps2: string;
    setMaps2: (v: string) => void;
  }) => (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Category</label>
          <Select value={String(categoryId)} onValueChange={value => setCategoryId(Number(value))}>
            <SelectTrigger className="bg-white">
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
        <Textarea value={description} onChange={e => setDescription(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Location</label>
          <Input value={location} onChange={e => setLocation(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Address</label>
          <Input value={address} onChange={e => setAddress(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Image URL</label>
        <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-2">
          <label className="text-sm font-medium">Current Condition</label>
          <Input value={currentCondition} onChange={e => setCurrentCondition(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <label className="text-sm font-medium">Promotion Text</label>
          <Input value={promotionText} onChange={e => setPromotionText(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">History</label>
        <Textarea value={history} onChange={e => setHistory(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Maps URL 1 (Overview)</label>
        <Input value={maps1} onChange={e => setMaps1(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Maps URL 2 (Detailed)</label>
        <Input value={maps2} onChange={e => setMaps2(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <label className="text-sm font-medium">Product Images (pisahkan dengan koma)</label>
        <Input
          value={Array.isArray(productImages) ? productImages.join(",") : ""}
          onChange={e => setProductImages(e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
          placeholder="https://img1.jpg, https://img2.jpg"
        />
      </div>
    </div>
  );

  // Tambahkan useEffect untuk update categoryId jika categories sudah ada dan newUmkm belum diisi
  useEffect(() => {
    if (categories.length > 0 && !newUmkm.categoryId) {
      setNewUmkm((prev) => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories]);
  
  // State for JSON input dialog
  const [isJsonDialogOpen, setIsJsonDialogOpen] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const [jsonEditId, setJsonEditId] = useState<number | null>(null);
  const jsonTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Handler for Add/Edit UMKM from JSON
  const handleJsonSubmit = async () => {
    try {
      const json = JSON.parse(jsonInput);
      if (jsonEditId) {
        await updateUMKM(jsonEditId, json);
      } else {
        await addUMKM(json);
      }
      setIsJsonDialogOpen(false);
      setJsonInput("");
      setJsonEditId(null);
      queryClient.invalidateQueries({ queryKey: ['firestore-umkms'] });
      toast({ title: "Success", description: jsonEditId ? "UMKM updated from JSON" : "UMKM added from JSON" });
    } catch (e) {
      toast({ title: "Error", description: "Invalid JSON or failed to save" });
    }
  };

  // Handler to open dialog for add
  const openAddJsonDialog = () => {
    setJsonInput(`{
  "name": "",
  "description": "",
  "imageUrl": "",
  "location": "",
  "address": "",
  "categoryId": 1,
  "promotionText": "",
  "coordinates": "",
  "maps1": "",
  "maps2": "",
  "history": "",
  "currentCondition": "",
  "reviews": [],
  "productImages": []
}`);
    setJsonEditId(null);
    setIsJsonDialogOpen(true);
    setTimeout(() => jsonTextareaRef.current?.focus(), 100);
  };

  // Handler to open dialog for edit
  const openEditJsonDialog = (umkm: Umkm) => {
    setJsonInput(JSON.stringify({
      name: umkm.name,
      description: umkm.description,
      imageUrl: umkm.imageUrl,
      location: umkm.location,
      address: umkm.address,
      categoryId: umkm.categoryId,
      promotionText: umkm.promotionText,
      coordinates: umkm.coordinates,
      maps1: umkm.maps1,
      maps2: umkm.maps2,
      history: umkm.history,
      currentCondition: umkm.currentCondition,
      reviews: umkm.reviews,
      productImages: umkm.productImages,
    }, null, 2));
    setJsonEditId(umkm.id);
    setIsJsonDialogOpen(true);
    setTimeout(() => jsonTextareaRef.current?.focus(), 100);
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
                <div className="flex gap-2">
                  <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button><Plus className="w-4 h-4 mr-2" /> Add UMKM</Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
                      <DialogHeader>
                        <DialogTitle>Add New UMKM</DialogTitle>
                      </DialogHeader>
                      <UmkmForm
                        name={umkmName}
                        setName={setUmkmName}
                        categoryId={umkmCategoryId}
                        setCategoryId={setUmkmCategoryId}
                        description={umkmDescription}
                        setDescription={setUmkmDescription}
                        history={umkmHistory}
                        setHistory={setUmkmHistory}
                        currentCondition={umkmCurrentCondition}
                        setCurrentCondition={setUmkmCurrentCondition}
                        imageUrl={umkmImageUrl}
                        setImageUrl={setUmkmImageUrl}
                        productImages={umkmProductImages}
                        setProductImages={setUmkmProductImages}
                        location={umkmLocation}
                        setLocation={setUmkmLocation}
                        address={umkmAddress}
                        setAddress={setUmkmAddress}
                        promotionText={umkmPromotionText}
                        setPromotionText={setUmkmPromotionText}
                        coordinates={umkmCoordinates}
                        setCoordinates={setUmkmCoordinates}
                        maps1={umkmMaps1}
                        setMaps1={setUmkmMaps1}
                        maps2={umkmMaps2}
                        setMaps2={setUmkmMaps2}
                      />
                      <DialogFooter>
                        <Button
                          onClick={() => {
                            createUmkmMutation.mutate({
                              name: umkmName,
                              categoryId: umkmCategoryId,
                              description: umkmDescription,
                              history: umkmHistory,
                              currentCondition: umkmCurrentCondition,
                              imageUrl: umkmImageUrl,
                              productImages: umkmProductImages,
                              location: umkmLocation,
                              address: umkmAddress,
                              promotionText: umkmPromotionText,
                              coordinates: umkmCoordinates,
                              maps1: umkmMaps1,
                              maps2: umkmMaps2,
                              reviews: [],
                            });
                            setUmkmName("");
                            setUmkmCategoryId(1);
                            setUmkmDescription("");
                            setUmkmHistory("");
                            setUmkmCurrentCondition("");
                            setUmkmImageUrl("");
                            setUmkmProductImages([]);
                            setUmkmLocation("");
                            setUmkmAddress("");
                            setUmkmPromotionText("");
                            setUmkmCoordinates("");
                            setUmkmMaps1("");
                            setUmkmMaps2("");
                          }}
                        >
                          Create
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                  {/* Button to open JSON Add dialog */}
                  <Button variant="outline" onClick={openAddJsonDialog}>
                    Add UMKM (JSON)
                  </Button>
                </div>
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
                          <Badge variant={umkm.currentCondition === 'Aktif' ? 'default' : 'destructive'}>
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
                            {/* Button to open JSON Edit dialog */}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditJsonDialog(umkm)}
                              title="Edit as JSON"
                            >
                              {"{"}JSON{"}"}
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
                  <DialogContent className="max-w-md bg-white">
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const name = formData.get('name') as string;
                      const slug = name.toLowerCase().replace(/\s+/g, '-');
                      createCategoryMutation.mutate({ name, slug });
                      (e.target as HTMLFormElement).reset();
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
                                updateCategoryMutation.mutate({ id: category.id, name: newName, slug: newSlug });
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
                                deleteCategoryMutation.mutate(category.id);
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

      {/* AlertDialog for delete confirmation */}
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

      {/* Dialog for editing UMKM */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle>Edit UMKM</DialogTitle>
          </DialogHeader>
          {editingUmkm && (
            <>
              <UmkmForm
                name={editUmkmName}
                setName={setEditUmkmName}
                categoryId={editUmkmCategoryId}
                setCategoryId={setEditUmkmCategoryId}
                description={editUmkmDescription}
                setDescription={setEditUmkmDescription}
                history={editUmkmHistory}
                setHistory={setEditUmkmHistory}
                currentCondition={editUmkmCurrentCondition}
                setCurrentCondition={setEditUmkmCurrentCondition}
                imageUrl={editUmkmImageUrl}
                setImageUrl={setEditUmkmImageUrl}
                productImages={editUmkmProductImages}
                setProductImages={setEditUmkmProductImages}
                location={editUmkmLocation}
                setLocation={setEditUmkmLocation}
                address={editUmkmAddress}
                setAddress={setEditUmkmAddress}
                promotionText={editUmkmPromotionText}
                setPromotionText={setEditUmkmPromotionText}
                coordinates={editUmkmCoordinates}
                setCoordinates={setEditUmkmCoordinates}
                maps1={editUmkmMaps1}
                setMaps1={setEditUmkmMaps1}
                maps2={editUmkmMaps2}
                setMaps2={setEditUmkmMaps2}
              />
              <DialogFooter>
                <Button
                  onClick={() => {
                    updateUmkmMutation.mutate({
                      ...editingUmkm,
                      name: editUmkmName,
                      categoryId: editUmkmCategoryId,
                      description: editUmkmDescription,
                      history: editUmkmHistory,
                      currentCondition: editUmkmCurrentCondition,
                      imageUrl: editUmkmImageUrl,
                      productImages: editUmkmProductImages,
                      location: editUmkmLocation,
                      address: editUmkmAddress,
                      promotionText: editUmkmPromotionText,
                      coordinates: editUmkmCoordinates,
                      maps1: editUmkmMaps1,
                      maps2: editUmkmMaps2,
                    });
                    setIsEditDialogOpen(false);
                    setEditingUmkm(null);
                  }}
                >
                  Save Changes
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog for Add/Edit UMKM via JSON */}
      <Dialog open={isJsonDialogOpen} onOpenChange={setIsJsonDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {jsonEditId ? "Edit UMKM (JSON)" : "Add UMKM (JSON)"}
            </DialogTitle>
          </DialogHeader>
          <div>
            <textarea
              ref={jsonTextareaRef}
              className="w-full h-64 p-2 border rounded font-mono text-xs"
              value={jsonInput}
              onChange={e => setJsonInput(e.target.value)}
              spellCheck={false}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleJsonSubmit}>
              {jsonEditId ? "Save JSON" : "Add JSON"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// PENYEBAB MASALAH:
// Setiap kali Anda mengetik satu huruf di form Add UMKM, seluruh komponen <DialogContent> (dan seluruh form) di-*rerender* ulang dari awal. Ini terjadi karena Anda menggunakan controlled state object (newUmkm) dan mengoper setForm ke child, lalu setiap perubahan field menyebabkan object baru, sehingga React menganggap seluruh subtree berubah dan me-*remount* input (bukan hanya rerender).

// SOLUSI FINAL: Gunakan satu state per field untuk form Add UMKM, jangan gunakan object state untuk seluruh form.
// Ini akan membuat input tidak kehilangan focus/hover setiap mengetik satu huruf, seperti pada Add Category.

// (Duplicate code removed. All necessary state and component definitions are already present inside the Dashboard component above.)
