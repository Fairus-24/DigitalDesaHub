import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Category, Umkm } from '@/lib/types';
import UMKMCard from './UMKMCard';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import axios from 'axios';

interface UMKMSectionProps {
  onViewMapClick: (umkmId: number) => void;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function UMKMSection({ onViewMapClick }: UMKMSectionProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [displayedUmkms, setDisplayedUmkms] = useState<Umkm[]>([]);
  const [showAll, setShowAll] = useState(true);
  const [visibleCount, setVisibleCount] = useState(6);

  // Fetch categories
  const { 
    data: categories = [], 
    isLoading: isCategoriesLoading 
  } = useQuery<Category[]>({ 
    queryKey: [`${API_BASE_URL}/api/categories`],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/categories`);
      return res.data;
    }
  });

  // Fetch UMKMs
  const { 
    data: umkms = [], 
    isLoading: isUmkmsLoading 
  } = useQuery<Umkm[]>({ 
    queryKey: [`${API_BASE_URL}/api/umkms`],
    queryFn: async () => {
      const res = await axios.get(`${API_BASE_URL}/api/umkms`);
      return res.data;
    }
  });

  useEffect(() => {
    if (umkms.length > 0) {
      if (selectedCategoryId && !showAll) {
        setDisplayedUmkms(umkms.filter(umkm => umkm.categoryId === selectedCategoryId));
      } else {
        setDisplayedUmkms(umkms);
      }
    }
  }, [umkms, selectedCategoryId, showAll]);

  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId === null) {
      setSelectedCategoryId(null);
      setShowAll(true);
    } else {
      setSelectedCategoryId(categoryId);
      setShowAll(false);
    }
  };

  const handleShowMore = () => {
    if (visibleCount < displayedUmkms.length) {
      setVisibleCount(Math.min(visibleCount + 3, displayedUmkms.length));
    } else {
      setVisibleCount(6); // Reset to show only the first 6 items
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : 'Kategori';
  };

  return (
    <section id="umkm" className="py-16 bg-neutral">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-primary">UMKM Kelurahan Sukodono</h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-4 mb-6"></div>
          <p className="text-text-light max-w-3xl mx-auto">
            Temukan produk-produk berkualitas dari pelaku usaha mikro, kecil, dan menengah yang ada di desa kami.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <button 
              className={`px-4 py-2 rounded-full text-sm transition-colors ${showAll ? 'bg-primary text-white' : 'bg-white text-text hover:bg-primary hover:text-white'}`}
              onClick={() => handleCategoryClick(null)}
            >
              Semua Kategori
            </button>
            
            {isCategoriesLoading ? (
              <div className="flex gap-2">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="h-9 w-24 rounded-full" />
                ))}
              </div>
            ) : (
              categories.map((category) => (
                <button 
                  key={category.id}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${!showAll && selectedCategoryId === category.id ? 'bg-primary text-white' : 'bg-white text-text hover:bg-primary hover:text-white'}`}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  {category.name}
                </button>
              ))
            )}
          </div>
        </div>

        {isUmkmsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-lg">
                <Skeleton className="w-full h-48" />
                <div className="p-6">
                  <Skeleton className="h-7 w-48 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayedUmkms.slice(0, visibleCount).map((umkm) => (
                <UMKMCard 
                  key={umkm.id} 
                  umkm={umkm} 
                  onViewMapClick={onViewMapClick}
                  categoryName={getCategoryName(umkm.categoryId)}
                />
              ))}
            </div>

            {displayedUmkms.length > 0 && (
              <div className="mt-12 text-center">
                <button 
                  onClick={handleShowMore}
                  className="bg-primary hover:bg-secondary text-white font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center transition-colors"
                >
                  <span>
                    {visibleCount < displayedUmkms.length ? 'Lihat Lebih Banyak UMKM' : 'Tampilkan Lebih Sedikit'}
                  </span>
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            )}

            {displayedUmkms.length === 0 && (
              <div className="text-center py-12">
                <p className="text-text-light">Tidak ada UMKM yang ditemukan dalam kategori ini.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
