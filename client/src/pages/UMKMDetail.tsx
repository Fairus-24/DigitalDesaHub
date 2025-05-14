
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Umkm } from '@/lib/types';
import { ArrowLeft, MapPin } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export default function UMKMDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: umkm, isLoading } = useQuery<Umkm>({
    queryKey: [`/api/umkms/${id}`],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral py-16">
        <div className="max-w-4xl mx-auto px-4">
          <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-8" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-32 w-full rounded-lg" />
            <Skeleton className="h-32 w-full rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!umkm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>UMKM tidak ditemukan</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral py-16">
      <div className="max-w-4xl mx-auto px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-primary hover:text-secondary transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Kembali
        </button>

        <div className="bg-white rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-[400px]">
            <img
              src={umkm.imageUrl}
              alt={umkm.name}
              className="w-full h-full object-cover"
            />
            {umkm.promotionText && (
              <div className="absolute top-4 right-4 bg-promotion text-white text-sm font-bold px-4 py-2 rounded-lg shadow-md">
                {umkm.promotionText}
              </div>
            )}
          </div>

          <div className="p-8">
            <h1 className="font-heading font-bold text-3xl mb-4 text-primary">
              {umkm.name}
            </h1>
            <p className="text-text-light text-lg mb-8">{umkm.description}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-neutral rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-medium">Lokasi</h3>
                </div>
                <p className="text-text-light">{umkm.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
