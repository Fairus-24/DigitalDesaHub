import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc, setDoc } from "firebase/firestore";
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

// Update UMKM by doc id
export async function updateUMKM(id: number, data: Partial<Umkm>) {
  // Find the doc with matching id field
  const querySnapshot = await getDocs(collection(db, "umkm"));
  const docRef = querySnapshot.docs.find(d => {
    const dData = d.data();
    return dData.id === id || d.id === String(id);
  });
  if (!docRef) throw new Error("UMKM not found");
  await updateDoc(doc(db, "umkm", docRef.id), data);
}

// Delete UMKM by doc id
export async function deleteUMKM(id: number) {
  const querySnapshot = await getDocs(collection(db, "umkm"));
  const docRef = querySnapshot.docs.find(d => {
    const dData = d.data();
    return dData.id === id || d.id === String(id);
  });
  if (!docRef) throw new Error("UMKM not found");
  await deleteDoc(doc(db, "umkm", docRef.id));
}

// Restore UMKM (add back to collection)
export async function restoreUMKM(data: Umkm) {
  // Use id as doc id for consistency
  await setDoc(doc(db, "umkm", String(data.id)), data);
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
  try {
    console.log('[addKategori] Data to add:', data);
    const result = await addDoc(collection(db, "kategori"), data);
    console.log('[addKategori] Firestore result:', result);
    return result;
  } catch (err) {
    console.error('[addKategori] Firestore error:', err);
    throw err;
  }
}

// Update Category by doc id
export async function updateKategori(id: number, data: Partial<Category>) {
  const querySnapshot = await getDocs(collection(db, "kategori"));
  const docRef = querySnapshot.docs.find(d => {
    const dData = d.data();
    return dData.id === id || d.id === String(id);
  });
  if (!docRef) throw new Error("Category not found");
  await updateDoc(doc(db, "kategori", docRef.id), data);
}

// Delete Category by doc id
export async function deleteKategori(id: number) {
  const querySnapshot = await getDocs(collection(db, "kategori"));
  const docRef = querySnapshot.docs.find(d => {
    const dData = d.data();
    return dData.id === id || d.id === String(id);
  });
  if (!docRef) throw new Error("Category not found");
  await deleteDoc(doc(db, "kategori", docRef.id));
}