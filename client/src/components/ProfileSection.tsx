import { VillageProfile } from '@/lib/types';
import { VILLAGE_IMAGES } from '@/lib/images';

interface ProfileSectionProps {
  villageProfile: VillageProfile | null;
}

export default function ProfileSection({ villageProfile }: ProfileSectionProps) {
  return (
    <section id="profil" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl text-primary">
            {villageProfile ? `Profil ${villageProfile.name}` : 'Profil Kelurahan Sukodono'}
          </h2>
          <div className="w-20 h-1 bg-accent mx-auto mt-4 mb-6"></div>
          <p className="text-text-light max-w-3xl mx-auto">
            Mengenal lebih dekat desa kami dengan berbagai potensi alam dan budaya yang menjadi kebanggaan masyarakat lokal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="rounded-xl overflow-hidden shadow-lg h-full">
            <img 
              src={VILLAGE_IMAGES.TRADITIONAL_VILLAGE} 
              alt="Kelurahan Sukodono" 
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="font-heading font-bold text-xl mb-3">Sejarah Desa</h3>
              <p className="text-text-light mb-4">
                {villageProfile?.history || 
                  'Kelurahan Sukodono memiliki sejarah panjang sejak tahun 1945. Didirikan oleh para pejuang kemerdekaan, desa ini telah berkembang menjadi pusat ekonomi dan budaya di kawasan ini.'}
              </p>
              <p className="text-text-light">
                Wilayah ini dikenal sebagai pusat produksi jajanan khas Gresik, seperti pudak, otak-otak bandeng, jenang jubung, kerupuk ikan Gresik, opak giri, dan aneka makanan khas lainnya.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col md:flex-row">
              <img 
                src={VILLAGE_IMAGES.FOREST} 
                alt="Sumber Daya Alam" 
                className="w-full md:w-1/3 h-48 md:h-auto object-cover"
              />
              <div className="p-6 flex-1">
                <h3 className="font-heading font-bold text-xl mb-2">Produk Umkm</h3>
                <p className="text-text-light">
                  Dengan mempertahankan tradisi kuliner khas dan mengadopsi inovasi dalam produksi serta pemasaran, UMKM di Kelurahan Sukodono berpotensi untuk terus berkembang dan memberikan kontribusi signifikan terhadap perekonomian daerah.
                </p>
              </div>
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg bg-white flex flex-col md:flex-row">
              <img 
                src={VILLAGE_IMAGES.CULTURE} 
                alt="Budaya Lokal" 
                className="w-full md:w-1/3 h-48 md:h-auto object-cover"
              />
              <div className="p-6 flex-1">
                <h3 className="font-heading font-bold text-xl mb-2">Budaya Lokal</h3>
                <p className="text-text-light">
                  Kelurahan Sukodono memainkan peran penting dalam menjaga dan melestarikan budaya lokal Gresik, terutama dalam bidang kuliner dan partisipasi aktif dalam festival budaya. Melalui berbagai kegiatan komunitas dan pelestarian tradisi, Sukodono terus memperkuat identitas budaya lokal dan berkontribusi pada kekayaan budaya Kabupaten Gresik.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-neutral rounded-xl p-8 shadow-md">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-6 md:mb-0 md:mr-6">
              <h3 className="font-heading font-bold text-2xl mb-3">Visi & Misi Desa</h3>
              <p className="text-text-light mb-4">
                {villageProfile?.vision || 'Menjadikan Desa Sejahtera sebagai desa mandiri dan berkelanjutan melalui pemberdayaan ekonomi lokal dan pelestarian budaya.'}
              </p>
              <ul className="list-disc list-inside text-text-light space-y-2">
                {villageProfile?.mission.map((item, index) => (
                  <li key={index}>{item}</li>
                )) || (
                  <>
                    <li>Meningkatkan taraf hidup masyarakat melalui pemberdayaan UMKM</li>
                    <li>Mengembangkan potensi alam desa secara berkelanjutan</li>
                    <li>Melestarikan kearifan lokal dan budaya desa</li>
                    <li>Menciptakan lingkungan desa yang bersih dan sehat</li>
                  </>
                )}
              </ul>
            </div>
            <div className="flex-shrink-0">
              <div className="flex space-x-4 md:space-x-6">
                <div className="bg-white rounded-lg p-4 shadow text-center w-24">
                  <div className="text-primary text-2xl font-bold">
                    {villageProfile?.population.toLocaleString() || '1,220'}
                  </div>
                  <div className="text-text-light text-sm">Penduduk</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center w-24">
                  <div className="text-primary text-2xl font-bold">
                    {villageProfile?.umkmCount || '52'}
                  </div>
                  <div className="text-text-light text-sm">UMKM</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow text-center w-24">
                  <div className="text-primary text-2xl font-bold">
                    {villageProfile?.hamletCount || '8'}
                  </div>
                  <div className="text-text-light text-sm">RT</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
