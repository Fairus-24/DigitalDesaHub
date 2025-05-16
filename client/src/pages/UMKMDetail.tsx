
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Umkm } from '@/lib/types';
import { ArrowLeft, MapPin, Star, MessageSquare, User2, Clock } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

export default function UMKMDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
            <h1 className="font-heading font-bold text-3xl mb-4 text-primary">
              {umkm.name}
            </h1>

            <div className="prose max-w-none mb-8">
              <h2 className="text-xl font-medium mb-2">Deskripsi</h2>
              <p className="text-text-light">{umkm.description}</p>
              
              <h2 className="text-xl font-medium mt-6 mb-2"></h2>
              <p className="text-text-light">{umkm.history}</p>
              
              <h2 className="text-xl font-medium mt-6 mb-2">Status</h2>
              <span 
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  umkm.currentCondition === 'Aktif' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {umkm.currentCondition}
              </span>
            </div>

            <div className="bg-neutral rounded-lg p-6 mb-8">
              <div className="flex items-center mb-4">
                <MapPin className="h-5 w-5 text-primary mr-2" />
                <h3 className="font-medium">Lokasi</h3>
              </div>
              <p className="text-text-light">{umkm.address}</p>
            </div>

            {umkm.productImages && umkm.productImages.length > 0 && (
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
            )}

            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center text-primary">
                <MessageSquare className="h-6 w-6 mr-2" />
                Ulasan Pelanggan
              </h2>
              <div className="space-y-6">
                {umkm.reviews.map((review, index) => (
                  <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                    <div className="flex items-start">
                      <div className="bg-primary/10 rounded-full p-3 mr-4">
                        <User2 className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-lg">{review.author}</h3>
                          <div className="flex items-center bg-yellow-50 px-3 py-1 rounded-full">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`h-4 w-4 ${
                                  i < review.rating 
                                    ? 'text-yellow-400 fill-current' 
                                    : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{review.comment}</p>
                        <span className="text-sm text-gray-400 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {format(new Date(review.date), 'dd MMMM yyyy')}
                        </span>
                      </div>
                    </div>
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
