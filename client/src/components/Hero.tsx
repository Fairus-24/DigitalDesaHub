import { VILLAGE_IMAGES } from "@/lib/images";
import { VillageProfile } from "@/lib/types";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  villageProfile: VillageProfile | null;
}

export default function Hero({ villageProfile }: HeroProps) {
  const handleScroll = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="beranda" className="relative overflow-hidden">
      <div
        className="h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: `url(${VILLAGE_IMAGES.HERO})` }}
      >
        <div className="absolute inset-0 bg-primary/40"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
            <h1 className="font-heading font-bold text-3xl md:text-5xl mb-4">
              {villageProfile
                ? `Selamat Datang di ${villageProfile.name}`
                : "Selamat Datang di Kelurahan Sukodono"}
            </h1>
            <p className="text-lg md:text-xl mb-8 max-w-2xl">
              {villageProfile?.description ||
                "Pusat informasi digital untuk mempromosikan potensi desa dan mendukung UMKM lokal."}
            </p>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => handleScroll("umkm")}
                className="bg-accent hover:bg-accent/90 text-text font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center transition-colors"
              >
                <span>Jelajahi UMKM</span>
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
              <button
                onClick={() => handleScroll("profil")}
                className="bg-white/20 hover:bg-white/30 text-white font-medium px-6 py-3 rounded-lg inline-flex items-center justify-center border border-white transition-colors"
              >
                <span>Tentang Desa</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
