export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Umkm {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  location: string;
  address: string;
  categoryId: number;
  promotionText?: string;
  coordinates: string;
  maps1: string;
  maps2: string;
}

export interface VillageProfile {
  id: number;
  name: string;
  description: string;
  history: string;
  vision: string;
  mission: string[];
  population: number;
  umkmCount: number;
  hamletCount: number;
}



export interface MapMarker {
  id: number;
  name: string;
  position: Coordinates;
  address: string;
}
