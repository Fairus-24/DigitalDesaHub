import {
  users,
  type User,
  type InsertUser,
  categories,
  type Category,
  type InsertCategory,
  umkms,
  type Umkm,
  type InsertUmkm,
  villageProfile,
  type VillageProfile,
  type InsertVillageProfile,
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<void>;

  getUmkms(): Promise<Umkm[]>;
  getUmkmById(id: number): Promise<Umkm | undefined>;
  getUmkmsByCategoryId(categoryId: number): Promise<Umkm[]>;
  createUmkm(umkm: InsertUmkm): Promise<Umkm>;
  updateUmkm(id: number, umkm: Partial<InsertUmkm>): Promise<Umkm | undefined>;
  deleteUmkm(id: number): Promise<void>;

  getVillageProfile(): Promise<VillageProfile | undefined>;
  createVillageProfile(profile: InsertVillageProfile): Promise<VillageProfile>;
  updateVillageProfile(
    id: number,
    profile: Partial<InsertVillageProfile>
  ): Promise<VillageProfile | undefined>;
}

export class MemStorage implements IStorage {
  private users = new Map<number, User>();
  private categories = new Map<number, Category>();
  private umkms = new Map<number, Umkm>();
  private villageProfiles = new Map<number, VillageProfile>();

  private currentUserId = 1;
  private currentCategoryId = 1;
  private currentUmkmId = 1;
  private currentVillageProfileId = 1;

  constructor() {
    this.initializeData();
  }

  // User methods
  async getUser(id: number) {
    return this.users.get(id);
  }
  async getUserByUsername(username: string) {
    return Array.from(this.users.values()).find(u => u.username === username);
  }
  async createUser(insertUser: InsertUser) {
    const id = this.currentUserId++;
    const user: User = { id, ...insertUser };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories() {
    return Array.from(this.categories.values());
  }
  async getCategoryById(id: number) {
    return this.categories.get(id);
  }
  async getCategoryBySlug(slug: string) {
    return Array.from(this.categories.values()).find(c => c.slug === slug);
  }
  async createCategory(insertCategory: InsertCategory) {
    const id = this.currentCategoryId++;
    const category: Category = { id, ...insertCategory };
    this.categories.set(id, category);
    return category;
  }
  async updateCategory(id: number, catUpdate: Partial<InsertCategory>) {
    const existing = this.categories.get(id);
    if (!existing) return undefined;
    const updated: Category = { ...existing, ...catUpdate };
    this.categories.set(id, updated);
    return updated;
  }
  async deleteCategory(id: number) {
    this.categories.delete(id);
  }

  // UMKM methods
  async getUmkms() {
    // Parse reviews & productImages to array
    return Array.from(this.umkms.values()).map(umkm => ({
      ...umkm,
      reviews: typeof umkm.reviews === "string" ? JSON.parse(umkm.reviews) : umkm.reviews,
      productImages: typeof umkm.productImages === "string" ? JSON.parse(umkm.productImages) : umkm.productImages,
    }));
  }
  async getUmkmById(id: number) {
    const umkm = this.umkms.get(id);
    if (!umkm) return undefined;
    return {
      ...umkm,
      reviews: typeof umkm.reviews === "string" ? JSON.parse(umkm.reviews) : umkm.reviews,
      productImages: typeof umkm.productImages === "string" ? JSON.parse(umkm.productImages) : umkm.productImages,
    };
  }
  async getUmkmsByCategoryId(categoryId: number) {
    // Parse reviews & productImages to array
    return Array.from(this.umkms.values())
      .filter(u => u.categoryId === categoryId)
      .map(umkm => ({
        ...umkm,
        reviews: typeof umkm.reviews === "string" ? JSON.parse(umkm.reviews) : umkm.reviews,
        productImages: typeof umkm.productImages === "string" ? JSON.parse(umkm.productImages) : umkm.productImages,
      }));
  }
  async createUmkm(insertUmkm: InsertUmkm) {
    const id = this.currentUmkmId++;
    const umkm: Umkm = {
      id,
      ...insertUmkm,
      promotionText: insertUmkm.promotionText ?? null,
      reviews: JSON.stringify(insertUmkm.reviews ?? []),
      productImages: JSON.stringify(insertUmkm.productImages ?? []),
    };
    this.umkms.set(id, umkm);
    return umkm;
  }
  async updateUmkm(id: number, update: Partial<InsertUmkm>) {
    const existing = this.umkms.get(id);
    if (!existing) return undefined;
    const merged = {
      ...existing,
      ...update,
      promotionText: update.promotionText ?? existing.promotionText,
      reviews: update.reviews ? JSON.stringify(update.reviews) : existing.reviews,
      productImages: update.productImages ? JSON.stringify(update.productImages) : existing.productImages,
    } as Umkm;
    this.umkms.set(id, merged);
    return merged;
  }
  async deleteUmkm(id: number) {
    this.umkms.delete(id);
  }

  // Village Profile methods
  async getVillageProfile() {
    const list = Array.from(this.villageProfiles.values());
    return list[0];
  }
  async createVillageProfile(insert: InsertVillageProfile) {
    const id = this.currentVillageProfileId++;
    const profile: VillageProfile = {
      id,
      ...insert,
      mission: JSON.stringify(insert.mission),
    };
    this.villageProfiles.set(id, profile);
    return profile;
  }
  async updateVillageProfile(id: number, update: Partial<InsertVillageProfile>) {
    const existing = this.villageProfiles.get(id);
    if (!existing) return undefined;
    const merged = {
      ...existing,
      ...update,
      mission: update.mission ? JSON.stringify(update.mission) : existing.mission,
    } as VillageProfile;
    this.villageProfiles.set(id, merged);
    return merged;
  }

  // Tambahkan fungsi untuk add data UMKM dari JSON object
  async addUmkmFromJson(json: {
    name: string;
    description: string;
    imageUrl: string;
    location: string;
    address: string;
    categoryId: number;
    promotionText: string;
    coordinates: string;
    maps1: string;
    maps2: string;
    history: string;
    currentCondition: string;
    reviews: string; // JSON.stringify([])
    productImages: string; // JSON.stringify([])
  }) {
    const id = this.currentUmkmId++;
    const umkm: Umkm = {
      id,
      name: json.name,
      description: json.description,
      imageUrl: json.imageUrl,
      location: json.location,
      address: json.address,
      categoryId: json.categoryId,
      promotionText: json.promotionText,
      coordinates: json.coordinates,
      maps1: json.maps1,
      maps2: json.maps2,
      history: json.history,
      currentCondition: json.currentCondition,
      reviews: json.reviews,
      productImages: json.productImages,
    };
    this.umkms.set(id, umkm);
    return umkm;
  }

  // Tambahkan fungsi untuk edit data UMKM dari JSON object (by id)
  async editUmkmFromJson(id: number, json: {
    name?: string;
    description?: string;
    imageUrl?: string;
    location?: string;
    address?: string;
    categoryId?: number;
    promotionText?: string;
    coordinates?: string;
    maps1?: string;
    maps2?: string;
    history?: string;
    currentCondition?: string;
    reviews?: string; // JSON.stringify([])
    productImages?: string; // JSON.stringify([])
  }) {
    const existing = this.umkms.get(id);
    if (!existing) return undefined;
    const updated: Umkm = {
      ...existing,
      ...json,
      id, // ensure id is not changed
    };
    this.umkms.set(id, updated);
    return updated;
  }

  private initializeData() {
    // categories
    const cats: InsertCategory[] = [
      { name: "Kerajinan", slug: "kerajinan" },
      { name: "Makanan", slug: "makanan" },
      { name: "Kedai", slug: "kedai" },
      { name: "Jasa", slug: "jasa" },
    ];
    cats.forEach(c => this.createCategory(c));


    // Create UMKM data
    const umkmsData: InsertUmkm[] = [
      {
        name: "Yayuk Collection",
        description:
          "Memproduksi berbagai kerajinan tangan berupa gelang manik (Crystal kaca) yang elegan dan menawan.",
        imageUrl:
          "https://raw.githubusercontent.com/Fairus-24/DigitalDesaHub/refs/heads/main/client/src/components/Assets/Yayuk%20Collection.png",
        location: "Sindujoyo 21/51",
        address: "Jl. Sindujoyo Gg. XXI No.51",
        categoryId: 1, // Kerajinan
        promotionText: "",
        coordinates: "-7.152391,112.652379",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.65279798679201!3d-7.152348076278058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010066bd5589%3A0x36be09024c3b982a!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sen!2sid!4v1747374768900!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.65279798679201!3d-7.152348076278058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010066bd5589%3A0x36be09024c3b982a!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sen!2sid!4v1747374768900!5m2!1sen!2sid",
        history: "tidak ada sejarah",
        currentCondition: "Aktif",
        reviews: JSON.stringify([
          {
            author: "Siti Aminah",
            rating: 5,
            comment: "Gelang maniknya sangat cantik dan elegan, cocok untuk acara formal!",
            date: "2024-01-15T00:00:00Z",
          },
          {
            author: "Budi Santoso",
            rating: 4,
            comment: "Pelayanannya ramah, produknya berkualitas. Worth it!",
            date: "2024-01-20T00:00:00Z",
          },
          {
            author: "Maya Indah",
            rating: 5,
            comment: "Desainnya unik dan harganya terjangkau. Recommended!",
            date: "2024-02-01T00:00:00Z",
          }
        ]),
        productImages: JSON.stringify([
          "https://down-id.img.susercontent.com/file/id-11134207-7r98z-lnh14d40x6o1c6",
          "https://down-id.img.susercontent.com/file/id-11134207-7r98z-lnh14d40x6o1c7",
          "https://down-id.img.susercontent.com/file/id-11134207-7r98z-lnh14d40x6o1c8"
        ]),
      },
      {
        name: "Yaris Cookies",
        description:
          "Menyajikan berbagai kue kering yang dibuat dari bahan-bahan lokal berkualitas. Spesialisasi kami adalah kue kering tradisional dengan sentuhan modern yang cocok untuk berbagai acara.",
        imageUrl:
          "https://raw.githubusercontent.com/Fairus-24/DigitalDesaHub/refs/heads/main/client/src/components/Assets/Yaris%20Cookies.png",
        location: "Sindujoyo 13/08",
        address: "Jl. Sindujoyo Gg. XIII No.08",
        categoryId: 2, // Makanan
        promotionText: "Diskon 10% Pembelian >50pcs",
        coordinates: "-6.398709,108.284611",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.6511758383209!3d-7.151240098213269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010029cc181d%3A0xfc35848efc1e52e7!2sSedia%20Kue%20Kering%20(Yaris%20Cookies)!5e0!3m2!1sid!2sid!4v1747185507203!5m2!1sid!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.6511758383209!3d-7.151240098213269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010029cc181d%3A0xfc35848efc1e52e7!2sSedia%20Kue%20Kering%20(Yaris%20Cookies)!5e0!3m2!1sid!2sid!4v1747185507203!5m2!1sid!2sid",
        history: "Didirikan pada tahun 2015 oleh Ibu Yaris yang awalnya hanya menerima pesanan dari tetangga. Seiring waktu, kualitas dan cita rasa khas membuat usaha ini berkembang pesat.",
        currentCondition: "Aktif",
        reviews: JSON.stringify([
          {
            author: "Rini Wulandari",
            rating: 5,
            comment: "Kue kering nya enak, renyah dan tidak terlalu manis. Kemasan juga bagus!",
            date: "2024-02-10T00:00:00Z"
          },
          {
            author: "Ahmad Sutrisno",
            rating: 4,
            comment: "Cookies nya enak, tapi harga agak mahal. Tapi worth it sih untuk kualitasnya.",
            date: "2024-02-05T00:00:00Z"
          }
        ]),
        productImages: JSON.stringify([
          "https://2112snackdelight.com/wp-content/uploads/2020/11/products-image-nutella-cookies-04.jpg",
          "https://images.unsplash.com/photo-1499636136210-6f4ee915583e",
          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35"
        ]),
      },
      {
        name: "Warung Kopi Mama Atul",
        description:
          "Menyajikan berbagai minuman kemasan dan kopi khas dari gresik yang kental dan nikmat. Tempat nongkrong favorit warga sekitar dengan suasana yang nyaman dan harga terjangkau.",
        imageUrl:
          "https://raw.githubusercontent.com/Fairus-24/DigitalDesaHub/refs/heads/main/client/src/components/Assets/Warkop%20Mama%20Atul.png",
        location: "KH Hasyim Asyari",
        address: "Jl. K.H. Hasyim Asyari gang pasar",
        categoryId: 3, // Kedai
        promotionText: "Free WiFi",
        coordinates: "",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.65215365357392!3d-7.15248834709858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd80100665e4d91%3A0x3849cac3ba0439b3!2sWarung%20Kopi%20Mama%20Atul!5e0!3m2!1sen!2sid!4v1747380713479!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.65215365357392!3d-7.15248834709858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd80100665e4d91%3A0x3849cac3ba0439b3!2sWarung%20Kopi%20Mama%20Atul!5e0!3m2!1sen!2sid!4v1747380713479!5m2!1sen!2sid",
        history: "Warung Kopi Mama Atul berdiri sejak 2010, dikelola oleh keluarga dan menjadi tempat berkumpul favorit warga sekitar. Awalnya hanya menjual kopi sederhana, kini berkembang dengan berbagai menu minuman dan makanan ringan.",
        currentCondition: "Aktif",
        reviews: JSON.stringify([
          {
            author: "Joko Prasetyo",
            rating: 5,
            comment: "Kopi nya mantap, tempatnya nyaman buat ngobrol. WiFi kenceng!",
            date: "2024-02-15T00:00:00Z"
          },
          {
            author: "Dewi Anggraini",
            rating: 4,
            comment: "Suka banget sama suasananya, pelayanannya ramah",
            date: "2024-02-12T00:00:00Z"
          },
          {
            author: "Rizki Pratama",
            rating: 5,
            comment: "Tempat favorit buat kerja remote, kopinya enak!",
            date: "2024-02-08T00:00:00Z"
          }
        ]),
        productImages: JSON.stringify([
          "https://manual.co.id/wp-content/uploads/2021/11/manual_photo_essay_warkop_web-18-980x719.jpg",
          "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
          "https://images.unsplash.com/photo-1511920170033-f8396924c348"
        ]),
      },
      {
        name: "Farah Craft",
        description:
          "Memproduksi suvenir seperti bucket bunga, jajanan, uang dll, dan juga memproduksi jajanan kue kering. Menghadirkan kreasi handmade berkualitas tinggi dengan design yang unik dan modern.",
        imageUrl:
          "https://raw.githubusercontent.com/Fairus-24/DigitalDesaHub/refs/heads/main/client/src/components/Assets/Farah%20Craft.png",
        location: "Sindujoyo 13/46",
        address: "Jl. Sindujoyo Gg. XIII No.466",
        categoryId: 1, // Kerajinan
        promotionText: "Custom Order Available",
        coordinates: "",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.65063007403916!3d-7.151648470158272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8015ac782bd89%3A0x246274db7820b419!2sFarah%20Craft!5e0!3m2!1sen!2sid!4v1747405737126!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.65063007403916!3d-7.151648470158272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8015ac782bd89%3A0x246274db7820b419!2sFarah%20Craft!5e0!3m2!1sen!2sid!4v1747405737126!5m2!1sen!2sid",
        history: "Farah Craft dimulai dari hobi membuat kerajinan tangan pada tahun 2018. Berawal dari pesanan teman dan kerabat, kini telah berkembang menjadi usaha yang melayani berbagai pesanan custom untuk acara pernikahan, wisuda, dan berbagai celebration.",
        currentCondition: "Aktif",
        reviews: JSON.stringify([
          {
            author: "Linda Kusuma",
            rating: 5,
            comment: "Bucket bunganya cantik banget, packaging rapi dan sesuai request!",
            date: "2024-02-18T00:00:00Z"
          },
          {
            author: "Fariz Abdullah",
            rating: 5,
            comment: "Pesan bucket uang untuk wisuda, hasilnya memuaskan!",
            date: "2024-02-14T00:00:00Z"
          },
          {
            author: "Nadya Putri",
            rating: 4,
            comment: "Desainnya bagus, pengerjaan cepat. Recommended!",
            date: "2024-02-01T00:00:00Z"
          }
        ]),
        productImages: JSON.stringify([
          "https://threebouquets.com/cdn/shop/articles/toko-bunga-terdekat.jpg?v=1659941837",
          "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e",
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf"
        ]),
      },
      {
        name: "Niki Enak",
        description: "Menyediakan berbagai jenis jajanan Khas Gresik dengan cita rasa autentik. Spesialisasi dalam pembuatan jajanan tradisional yang telah dimodernisasi tanpa menghilangkan cita rasa aslinya.",
        imageUrl:
          "https://awsimages.detik.net.id/community/media/visual/2023/03/10/kuliner-di-gresik-3_169.jpeg?w=1200",
        location: "Sindujoyo 117",
        address: "Jl. Sindujoyo No.117",
        categoryId: 2, // Makanan
        promotionText: "Gratis Sampel",
        coordinates: "",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.64761456985576!3d-7.151275654334539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd80058841a183d%3A0xb1ddc26aaf203841!2sNiki%20Enak!5e0!3m2!1sen!2sid!4v1747406003159!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.64761456985576!3d-7.151275654334539!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd80058841a183d%3A0xb1ddc26aaf203841!2sNiki%20Enak!5e0!3m2!1sen!2sid!4v1747406003159!5m2!1sen!2sid",
        history: "Niki Enak didirikan pada tahun 2012 oleh Ibu Niki yang memiliki passion dalam membuat jajanan tradisional. Berawal dari hobi membuat kue untuk keluarga, kini telah berkembang menjadi usaha yang dikenal dengan kualitas dan cita rasa khasnya.",
        currentCondition: "Aktif",
        reviews: JSON.stringify([
          {
            author: "Anita Wijaya",
            rating: 5,
            comment: "Jajanan tradisionalnya enak banget, rasa masih authentic!",
            date: "2024-02-15T00:00:00Z"
          },
          {
            author: "Hendra Kusuma",
            rating: 4,
            comment: "Pelayanannya ramah, harga terjangkau. Worth it!",
            date: "2024-02-10T00:00:00Z"
          },
          {
            author: "Sarah Putri",
            rating: 5,
            comment: "Recommended banget! Rasa konsisten dan packaging rapi",
            date: "2024-02-05T00:00:00Z"
          }
        ]),
        productImages: JSON.stringify([
          "https://awsimages.detik.net.id/community/media/visual/2023/03/10/kuliner-di-gresik-3_169.jpeg?w=1200",
          "https://images.unsplash.com/photo-1555126634-323283e090fa",
          "https://images.unsplash.com/photo-1558961363-fa8fdf82db35"
        ]),
      },
      {
        name: "Otak-otak Bandeng Kang Wahab",
        description:
          "Otak-otak Bandeng Kang Wahab Gresik merupakan UMKM kuliner khas Kabupaten Gresik yang berdiri sejak 1996 dan berlokasi di Jalan Sindujoyo XV/33 Gresik, menghadirkan olahan bandeng premium dalam kemasan 650 ml yang dibakar di atas daun pisang untuk aroma khas smoky.",
        imageUrl:
          "https://smb-padiumkm-images-public-prod.oss-ap-southeast-5.aliyuncs.com/product/image/13092024/631a6566cdc00cf233d35930/66e27ed40e477431d309e28c/c1d5fd169a4a6e8e95f94e95860a38.jpg?x-oss-process=image/resize,m_pad,w_432,h_432/quality,Q_70",
        location: "Sindujoyo 15/33",
        address: "Jl. Sindujoyo XV No. 33",
        categoryId: 2,
        promotionText: "Bundling 3",
        coordinates: "",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.6524837698959!3d-7.151598751712937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd80058603f7c33%3A0xa0e940ac0c5357dd!2sOtak%20-%20Otak%20Bandeng%20Kang%20Wahab!5e0!3m2!1sen!2sid!4v1747406421923!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.6524837698959!3d-7.151598751712937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd80058603f7c33%3A0xa0e940ac0c5357dd!2sOtak%20-%20Otak%20Bandeng%20Kang%20Wahab!5e0!3m2!1sen!2sid!4v1747406421923!5m2!1sen!2sid",
        history: "Usaha ini dirintis oleh Kang Wahab sejak tahun 1996. Bermula dari warisan resep keluarga, otak-otak bandeng ini telah menjadi salah satu kuliner khas Gresik yang terkenal dengan cita rasa autentiknya.",
        currentCondition: "Aktif",
        reviews: JSON.stringify([
          {
            author: "Bambang Sutrisno",
            rating: 5,
            comment: "Otak-otak bandengnya juara! Tekstur lembut dan bumbu meresap",
            date: "2024-02-17T00:00:00Z"
          },
          {
            author: "Diana Puspita",
            rating: 5,
            comment: "Recommended! Packaging aman dan rasa tetap fresh",
            date: "2024-02-12T00:00:00Z"
          },
          {
            author: "Agus Hermawan",
            rating: 4,
            comment: "Enak banget, tapi harga agak mahal. Worth it sih!",
            date: "2024-02-08T00:00:00Z"
          }
        ]),
        productImages: JSON.stringify([
          "https://smb-padiumkm-images-public-prod.oss-ap-southeast-5.aliyuncs.com/product/image/13092024/631a6566cdc00cf233d35930/66e27ed40e477431d309e28c/c1d5fd169a4a6e8e95f94e95860a38.jpg",
          "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
          "https://images.unsplash.com/photo-1555126634-323283e090fa"
        ]),
      },
      {
        name: "Warung Kopi Cak Udin",
        description: "Warkop Cak Udin menyajikan berbagai jenis kopi dan minuman dengan suasana yang nyaman dan harga terjangkau. Tempat favorit untuk nongkrong dan bersantai bagi warga sekitar.",
        imageUrl:
          "https://raw.githubusercontent.com/Fairus-24/DigitalDesaHub/refs/heads/main/client/src/components/Assets/Warkop%20Cak%20Udin.png",
        location: "KH Hasyim Asyari",
        address: "Jl. K.H. Hasyim Asyari No. 1",
        categoryId: 3,
        promotionText: "Free WiFi",
        coordinates: "",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.65017435948572!3d-7.151592872940658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd800f7dc127c1d%3A0x23f8f56e9e90c3f0!2sWarkop%20Cak%20Udin!5e0!3m2!1sen!2sid!4v1747406864064!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.65017435948572!3d-7.151592872940658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd800f7dc127c1d%3A0x23f8f56e9e90c3f0!2sWarkop%20Cak%20Udin!5e0!3m2!1sen!2sid!4v1747406864064!5m2!1sen!2sid",
        history: "Warung Kopi Cak Udin berdiri sejak tahun 2015. Berawal dari warung kopi sederhana, kini telah berkembang menjadi tempat nongkrong favorit dengan fasilitas WiFi dan menu yang beragam.",
        currentCondition: "Aktif",
        reviews: JSON.stringify([
          {
            author: "Andi Pratama",
            rating: 5,
            comment: "Kopi nya enak, tempat nyaman buat kerja. WiFi kenceng!",
            date: "2024-02-16T00:00:00Z"
          },
          {
            author: "Rina Safitri",
            rating: 4,
            comment: "Harga terjangkau, suasana asik buat nongkrong",
            date: "2024-02-11T00:00:00Z"
          },
          {
            author: "Budi Santoso",
            rating: 5,
            comment: "Recommended! Pelayanan ramah dan tempat bersih",
            date: "2024-02-07T00:00:00Z"
          }
        ]),
        productImages: JSON.stringify([
          "https://manual.co.id/wp-content/uploads/2021/11/manual_photo_essay_warkop_web-14-980x719.jpg",
          "https://images.unsplash.com/photo-1442512595331-e89e73853f31",
          "https://images.unsplash.com/photo-1511920170033-f8396924c348"
        ]),
      },
      /* {
        name: "",
        description: "",
        imageUrl: "",
        location: "",
        address: "",
        categoryId: 1,
        promotionText: "",
        coordinates: "",
        maps1: "",
        maps2: "",
        history: "",
        currentCondition: "",
        reviews: JSON.stringify([]),
        productImages: JSON.stringify([]),
      }, */
    ];
    umkmsData.forEach(u => this.createUmkm(u));

    // Create village profile
    // village profile
    const vp: InsertVillageProfile = {
      name: "Kelurahan Sukodono",
      description: "Pusat informasi digital untuk mempromosikan potensi desa dan mendukung UMKM lokal.",
      history: "Kelurahan Sukodono merupakan salah satu kelurahan di Kecamatan Gresik, Kabupaten Gresik, Provinsi Jawa Timur.",
      vision: "Menjadikan Kelurahan Sukodono sebagai desa mandiri dan berkelanjutan melalui pemberdayaan ekonomi lokal dan pelestarian budaya.",
      mission: JSON.stringify([
        "Meningkatkan taraf hidup masyarakat melalui pemberdayaan UMKM",
        "Mengembangkan potensi alam desa secara berkelanjutan",
        "Melestarikan kearifan lokal dan budaya desa",
        "Menciptakan lingkungan desa yang bersih dan sehat",
      ]),
      population: 1220,
      umkmCount: 52,
      hamletCount: 8,
    };
    this.createVillageProfile(vp);
  }
}

export const storage = new MemStorage();
