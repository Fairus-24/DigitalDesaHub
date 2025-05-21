import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Umkm, Category } from "./types";

// Ambil semua data UMKM
export async function getUMKM(): Promise<Umkm[]> {
  const querySnapshot = await getDocs(collection(db, "umkm"));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: typeof data.id === 'number' ? data.id : Number(doc.id),
      name: data.name,
      description: data.description,
      history: data.history,
      currentCondition: data.currentCondition,
      imageUrl: data.imageUrl,
      productImages: data.productImages || [],
      location: data.location,
      address: data.address,
      categoryId: data.categoryId,
      promotionText: data.promotionText,
      coordinates: data.coordinates,
      maps1: data.maps1,
      maps2: data.maps2,
      reviews: data.reviews || [],
    } as Umkm;
  });
}

// Tambah data UMKM
export async function addUMKM(data: Umkm) {
  return await addDoc(collection(db, "umkm"), data);
}

// Ambil semua data kategori
export async function getKategori(): Promise<Category[]> {
  const querySnapshot = await getDocs(collection(db, "kategori"));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: typeof data.id === 'number' ? data.id : Number(doc.id),
      name: data.name,
      slug: data.slug,
    } as Category;
  });
}

// Tambah data kategori
export async function addKategori(data: Category) {
  return await addDoc(collection(db, "kategori"), data);
}