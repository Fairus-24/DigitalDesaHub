import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, X, Leaf } from 'lucide-react';

const navLinks = [
  { name: 'Beranda', href: '#beranda' },
  { name: 'Profil Desa', href: '#profil' },
  { name: 'UMKM', href: '#umkm' },
  { name: 'Peta Lokasi', href: '#peta' },
  { name: 'Kontak', href: '#kontak' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.querySelector(sectionId);
    if (element) {
      window.scrollTo({
        top: element.getBoundingClientRect().top + window.scrollY - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white/95'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Leaf className="h-6 w-6 text-primary mr-2" />
              <span className="font-heading font-bold text-xl text-primary">Desa Sejahtera</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollToSection(link.href)}
                className="text-text-light hover:text-primary font-medium px-3 py-2 rounded-md transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center">
            <Sheet>
              <SheetTrigger asChild>
                <button className="text-gray-500 hover:text-primary">
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="p-0">
                <div className="py-6 px-4">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center">
                      <Leaf className="h-5 w-5 text-primary mr-2" />
                      <span className="font-heading font-semibold text-lg text-primary">Desa Sejahtera</span>
                    </div>
                    <SheetTrigger asChild>
                      <button className="text-gray-500">
                        <X className="h-5 w-5" />
                      </button>
                    </SheetTrigger>
                  </div>
                  <div className="flex flex-col space-y-1">
                    {navLinks.map((link) => (
                      <SheetTrigger asChild key={link.name}>
                        <button
                          onClick={() => scrollToSection(link.href)}
                          className="block text-text-light hover:bg-primary hover:text-white px-3 py-2 rounded-md transition-colors"
                        >
                          {link.name}
                        </button>
                      </SheetTrigger>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
