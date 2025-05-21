import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProfileSection from "@/components/ProfileSection";
import UMKMSection from "@/components/UMKMSection";
import MapSection from "@/components/MapSection";
import Footer from "@/components/Footer";
import { VillageProfile } from "@/lib/types";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [selectedUmkmId, setSelectedUmkmId] = useState<number | null>(null);
  const { toast } = useToast();

  const {
    data: villageProfile,
    isLoading: isVillageProfileLoading,
    error: villageProfileError,
  } = useQuery<VillageProfile>({
    queryKey: ["/api/village-profile"],
  });

  
  const handleViewMapClick = (umkmId: number) => {
    setSelectedUmkmId(umkmId);

    // Scroll to map section
    const mapSection = document.getElementById("peta");
    if (mapSection) {
      mapSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <>
      <Helmet>
        <title>Kelurahan Sukodono - Pusat Informasi dan UMKM Lokal</title>
        <link rel="icon" href="../assets/favicon.ico" />
        <meta
          name="description"
          content="Website Desa Sejahtera menyediakan informasi desa dan mendukung pemberdayaan UMKM lokal. Temukan produk-produk berkualitas dan lokasi usaha mikro di desa kami."
        />
        <meta
          property="og:title"
          content="Kelurahan Sukodono - Pusat Informasi dan UMKM Lokal"
        />
        <meta
          property="og:description"
          content="Website Kelurahan Sukodono menyediakan informasi desa dan mendukung pemberdayaan UMKM lokal. Temukan produk-produk berkualitas dan lokasi usaha mikro di desa kami."
        />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&family=Poppins:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Hero villageProfile={villageProfile || null} />
          <ProfileSection villageProfile={villageProfile || null} />
          <UMKMSection onViewMapClick={handleViewMapClick} />
          <MapSection selectedUmkmId={selectedUmkmId} />
        </main>
        <Footer />
        <Toaster />
      </div>
    </>
  );
}
