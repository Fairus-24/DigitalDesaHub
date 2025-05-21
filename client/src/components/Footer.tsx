import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer id="kontak" className="bg-primary text-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
          <div>
            <div className="flex items-center mb-4">
              <Leaf className="h-6 w-6 text-accent mr-2" />
              <span className="font-heading font-bold text-xl">
                Kelurahan Sukodono
              </span>
            </div>
            <p className="mb-4">
              Website resmi Kelurahan Sukodono yang menyediakan informasi desa
              dan mendukung pemberdayaan UMKM lokal.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-white hover:text-accent transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/kelurahan.sukodono2022"
                className="text-white hover:text-accent transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white hover:text-accent transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-white hover:text-accent transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">Halaman</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection("#beranda")}
                  className="text-white hover:text-accent transition-colors"
                >
                  Beranda
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#profil")}
                  className="text-white hover:text-accent transition-colors"
                >
                  Profil Desa
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#umkm")}
                  className="text-white hover:text-accent transition-colors"
                >
                  UMKM
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#peta")}
                  className="text-white hover:text-accent transition-colors"
                >
                  Peta Lokasi
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#kontak")}
                  className="text-white hover:text-accent transition-colors"
                >
                  Kontak
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4">
              Hubungi Kami
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mt-1 mr-3 text-accent flex-shrink-0" />
                <span>
                  Jl. Sindujoyo Gg. XIII No.9, Kebungson, Kemuteran, Kec.
                  Gresik, Kabupaten Gresik, Jawa Timur 61116
                </span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                <span>031 3970961</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                <span>info@kelurahansukodono.desa.id</span>
              </li>
              <li className="flex items-center">
                <Clock className="h-5 w-5 mr-3 text-accent flex-shrink-0" />
                <span>Senin - Jumat: 08.00 - 15.00</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white border-opacity-20 pt-6 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} KKN Narotama 2025. Hak Cipta
            Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
