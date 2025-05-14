
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Umkm } from '@/lib/types';
import { ArrowLeft, MapPin, Star, Calendar } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

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

        <article className="bg-white rounded-xl overflow-hidden shadow-lg">
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
            <div className="flex items-center gap-4 text-sm text-text-light mb-4">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {format(new Date(umkm.publishDate), 'dd MMMM yyyy')}
              </div>
            </div>

            <h1 className="font-heading font-bold text-3xl mb-4 text-primary">
              {umkm.name}
            </h1>

            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-medium mb-2">Deskripsi</h2>
              <p className="text-text-light">{umkm.description}</p>
              
              <h2 className="text-xl font-medium mt-6 mb-2">Sejarah</h2>
              <p className="text-text-light">{umkm.history}</p>
              
              <h2 className="text-xl font-medium mt-6 mb-2">Kondisi Sekarang</h2>
              <p className="text-text-light">{umkm.currentCondition}</p>
            </div>

            <div className="bg-neutral rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Lokasi</h3>
              </div>
              <p className="text-text-light">{umkm.address}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-medium mb-4">Galeri Produk</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {umkm.productImages.map((image, index) => (
                  <div key={index} className="aspect-square rounded-lg overflow-hidden">
                    <img src={image} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-medium mb-4">Ulasan</h2>
              <div className="space-y-4">
                {umkm.reviews.map((review, index) => (
                  <div key={index} className="bg-neutral rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{review.author}</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="ml-1">{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-text-light">{review.comment}</p>
                    <span className="text-sm text-text-light mt-2 block">
                      {format(new Date(review.date), 'dd MMM yyyy')}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
