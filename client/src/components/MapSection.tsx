import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Umkm, MapMarker } from "@/lib/types";
import { MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface MapSectionProps {
  selectedUmkmId: number | null;
}

export default function MapSection({ selectedUmkmId }: MapSectionProps) {
  const [mapMarkers, setMapMarkers] = useState<MapMarker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null);
  const mapRef = useRef<HTMLIFrameElement>(null);

  const { data: umkms = [], isLoading } = useQuery<Umkm[]>({
    queryKey: ["/api/umkms"],
  });

  useEffect(() => {
    if (umkms.length > 0) {
      const markers: MapMarker[] = umkms.map((umkm) => {
        const [lat, lng] = umkm.coordinates
          .split(",")
          .map((coord) => parseFloat(coord));
        return {
          id: umkm.id,
          name: umkm.name,
          address: umkm.address,
          maps1: umkm.maps1,
          maps2: umkm.maps2,
        };
      });
      setMapMarkers(markers);
    }
  }, [umkms]);

  useEffect(() => {
    if (selectedUmkmId !== null) {
      setSelectedMarkerId(selectedUmkmId);

      const selectedUmkm = umkms.find((u) => u.id === selectedUmkmId);
      if (selectedUmkm && selectedUmkm.maps1) {
        const mapElement = mapRef.current;
        if (mapElement) {
          mapElement.src = selectedUmkm.maps1;
        }
      }
    }
  }, [selectedUmkmId, umkms]);

  const handleLocationClick = (markerId: number) => {
    setSelectedMarkerId(markerId);

    const selectedUmkm = umkms.find((u) => u.id === markerId);
    if (selectedUmkm && selectedUmkm.maps2) {
      // Update map with the UMKM's map URL
      const mapElement = mapRef.current;
      if (mapElement) {
        mapElement.src = selectedUmkm.maps2;
      }
    }
  };

  return (
    <section id="peta" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-primary">
            Peta Lokasi UMKM
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-4 mb-6"></div>
          <p className="text-text-light max-w-3xl mx-auto">
            Temukan lokasi usaha UMKM di Desa Sejahtera dengan mudah melalui
            peta interaktif.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-neutral rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[500px]">
              {isLoading ? (
                <Skeleton className="w-full h-full" />
              ) : (
                <iframe
                  ref={mapRef}
                  src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d3055.714248803245!2d112.6518692!3d-7.151303!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1715575480000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              )}
            </div>
          </div>

          <div className="bg-neutral rounded-xl shadow-lg p-6">
            <h3 className="font-heading font-bold text-xl mb-4">
              Daftar Lokasi UMKM
            </h3>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="bg-white p-4 rounded-lg">
                    <Skeleton className="h-5 w-36 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {mapMarkers.map((marker) => (
                  <button
                    key={marker.id}
                    onClick={() => handleLocationClick(marker.id)}
                    className={`bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer w-full text-left ${
                      selectedMarkerId === marker.id
                        ? "bg-primary/10 border-l-4 border-primary"
                        : ""
                    }`}
                  >
                    <h4 className="font-heading font-medium text-base">
                      {marker.name}
                    </h4>
                    <div className="flex items-center text-text-light text-sm mt-1">
                      <MapPin className="h-3 w-3 text-primary mr-1" />
                      <span>{marker.address}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
            <div className="mt-6">
              <div className="flex items-center">
                <span className="text-primary mr-2 flex-shrink-0">ℹ️</span>
                <p className="text-sm text-text-light">
                  Klik pada nama UMKM untuk melihat lokasi di peta
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
