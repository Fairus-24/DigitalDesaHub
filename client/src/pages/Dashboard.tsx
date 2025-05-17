
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Umkm, Category } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function Dashboard() {
  const { data: umkms = [] } = useQuery<Umkm[]>({ queryKey: ['/api/umkms'] });
  const { data: categories = [] } = useQuery<Category[]>({ queryKey: ['/api/categories'] });

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
            <h2 className="text-xl font-semibold mb-4">UMKM List</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Categories List</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Slug</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>{category.name}</TableCell>
                    <TableCell>{category.slug}</TableCell>
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
