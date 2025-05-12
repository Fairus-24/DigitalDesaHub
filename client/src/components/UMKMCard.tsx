import { Umkm } from '@/lib/types';
import { MapPin, ArrowUpRight } from 'lucide-react';

interface UMKMCardProps {
  umkm: Umkm;
  onViewMapClick: (umkmId: number) => void;
  categoryName: string;
}

export default function UMKMCard({ umkm, onViewMapClick, categoryName }: UMKMCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg relative">
      <img 
        src={umkm.imageUrl} 
        alt={umkm.name} 
        className="w-full h-48 object-cover"
      />
      <div className="absolute top-0 left-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-br-lg">
        {categoryName}
      </div>
      
      {umkm.promotionText && (
        <div className="absolute top-3 right-3 bg-promotion text-white text-xs font-bold px-3 py-1 rounded-lg shadow-md transform rotate-6">
          {umkm.promotionText}
        </div>
      )}
      
      <div className="p-6">
        <h3 className="font-heading font-bold text-xl mb-2">{umkm.name}</h3>
        <p className="text-text-light mb-4">{umkm.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <MapPin className="h-4 w-4 text-primary mr-1" />
            <span className="text-sm text-text-light">{umkm.location}</span>
          </div>
          <button 
            onClick={() => onViewMapClick(umkm.id)}
            className="text-primary hover:text-secondary text-sm font-medium inline-flex items-center"
          >
            <span>Lihat di Peta</span>
            <ArrowUpRight className="ml-1 h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}
