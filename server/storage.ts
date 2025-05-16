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

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category methods
  getCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // UMKM methods
  getUmkms(): Promise<Umkm[]>;
  getUmkmById(id: number): Promise<Umkm | undefined>;
  getUmkmsByCategoryId(categoryId: number): Promise<Umkm[]>;
  createUmkm(umkm: InsertUmkm): Promise<Umkm>;

  // Village Profile methods
  getVillageProfile(): Promise<VillageProfile | undefined>;
  createVillageProfile(profile: InsertVillageProfile): Promise<VillageProfile>;
  updateVillageProfile(
    id: number,
    profile: Partial<InsertVillageProfile>,
  ): Promise<VillageProfile | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private umkms: Map<number, Umkm>;
  private villageProfiles: Map<number, VillageProfile>;

  private currentUserId: number;
  private currentCategoryId: number;
  private currentUmkmId: number;
  private currentVillageProfileId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.umkms = new Map();
    this.villageProfiles = new Map();

    this.currentUserId = 1;
    this.currentCategoryId = 1;
    this.currentUmkmId = 1;
    this.currentVillageProfileId = 1;

    // Initialize with sample data
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Category methods
  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = { ...insertCategory, id };
    this.categories.set(id, category);
    return category;
  }

  // UMKM methods
  async getUmkms(): Promise<Umkm[]> {
    return Array.from(this.umkms.values());
  }

  async getUmkmById(id: number): Promise<Umkm | undefined> {
    return this.umkms.get(id);
  }

  async getUmkmsByCategoryId(categoryId: number): Promise<Umkm[]> {
    return Array.from(this.umkms.values()).filter(
      (umkm) => umkm.categoryId === categoryId,
    );
  }

  async createUmkm(insertUmkm: InsertUmkm): Promise<Umkm> {
    const id = this.currentUmkmId++;
    const umkm: Umkm = { ...insertUmkm, id };
    this.umkms.set(id, umkm);
    return umkm;
  }

  // Village Profile methods
  async getVillageProfile(): Promise<VillageProfile | undefined> {
    // Return the first village profile (should only be one)
    const profiles = Array.from(this.villageProfiles.values());
    return profiles.length > 0 ? profiles[0] : undefined;
  }

  async createVillageProfile(
    insertProfile: InsertVillageProfile,
  ): Promise<VillageProfile> {
    const id = this.currentVillageProfileId++;
    const profile: VillageProfile = { ...insertProfile, id };
    this.villageProfiles.set(id, profile);
    return profile;
  }

  async updateVillageProfile(
    id: number,
    profileUpdate: Partial<InsertVillageProfile>,
  ): Promise<VillageProfile | undefined> {
    const currentProfile = this.villageProfiles.get(id);

    if (!currentProfile) {
      return undefined;
    }

    const updatedProfile: VillageProfile = {
      ...currentProfile,
      ...profileUpdate,
    };

    this.villageProfiles.set(id, updatedProfile);
    return updatedProfile;
  }

  // Initialize with sample data
  private initializeData() {
    // Create categories
    const categoriesData: InsertCategory[] = [
      { name: "Kerajinan", slug: "kerajinan" },
      { name: "Makanan", slug: "makanan" },
      { name: "Kedai", slug: "kedai" },
      { name: "Jasa", slug: "jasa" },
    ];

    categoriesData.forEach((category) => {
      this.createCategory(category);
    });

    // Create UMKM data
    const umkmsData: InsertUmkm[] = [
      {
        name: "Yayuk Collection",
        description:
          "Memproduksi berbagai kerajinan tangan berupa gelang manik (Crystal kaca) yang elegan dan menawan.",
        imageUrl:
          "https://down-id.img.susercontent.com/file/id-11134207-7r98z-lnh14d40x6o1c6",
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
        reviews: [
          {
            author: "John Doe",
            rating: 5,
            comment: "Produk yang sangat bagus dan berkualitas!",
            date: "2023-01-15T00:00:00Z",
          },
          {
            author: "Jane Smith",
            rating: 4,
            comment: "Cukup baik, saya suka desainnya.",
            date: "2023-01-16T00:00:00Z",
          },
        ],
        productImages: [
          "https://example.com/image1.jpg",
          "https://example.com/image2.jpg",
        ],
      },
      {
        name: "Yaris Cookies",
        description:
          "Menyajikan berbagai kue kering yang dibuat dari bahan-bahan lokal berkualitas.",
        imageUrl:
          "https://2112snackdelight.com/wp-content/uploads/2020/11/products-image-nutella-cookies-04.jpg",
        location: "Sindujoyo 13/08",
        address: "Jl. Sindujoyo Gg. XIII No.08",
        categoryId: 2, // Makanan
        promotionText: "",
        coordinates: "-6.398709,108.284611",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.6511758383209!3d-7.151240098213269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010029cc181d%3A0xfc35848efc1e52e7!2sSedia%20Kue%20Kering%20(Yaris%20Cookies)!5e0!3m2!1sid!2sid!4v1747185507203!5m2!1sid!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.6511758383209!3d-7.151240098213269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010029cc181d%3A0xfc35848efc1e52e7!2sSedia%20Kue%20Kering%20(Yaris%20Cookies)!5e0!3m2!1sid!2sid!4v1747185507203!5m2!1sid!2sid",
      },
      {
        name: "Warung Kopi Mama Atul",
        description:
          "Menyajikan berbagai minuman kemasan dan kopi khas dari gresik yang kental dan nikmat.",
        imageUrl:
          "https://manual.co.id/wp-content/uploads/2021/11/manual_photo_essay_warkop_web-18-980x719.jpg",
        location: "KH Hasyim Asyari",
        address: "Jl. K.H. Hasyim Asyari gang pasar",
        categoryId: 3, // Kedai
        promotionText: "",
        coordinates: "",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.65215365357392!3d-7.15248834709858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd80100665e4d91%3A0x3849cac3ba0439b3!2sWarung%20Kopi%20Mama%20Atul!5e0!3m2!1sen!2sid!4v1747380713479!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.65215365357392!3d-7.15248834709858!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd80100665e4d91%3A0x3849cac3ba0439b3!2sWarung%20Kopi%20Mama%20Atul!5e0!3m2!1sen!2sid!4v1747380713479!5m2!1sen!2sid",
      },
      {
        name: "Farah Craft",
        description:
          "Memproduksi suvenir seperti bucket bunga, jajanan, uang dll, dan juga memproduksi jajanan kue kering",
        imageUrl:
          "https://threebouquets.com/cdn/shop/articles/toko-bunga-terdekat.jpg?v=1659941837",
        location: "Sindujoyo 13/46",
        address: "Jl. Sindujoyo Gg. XIII No.466",
        categoryId: 1, // Kerajinan
        promotionText: "",
        coordinates: "",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.65063007403916!3d-7.151648470158272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8015ac782bd89%3A0x246274db7820b419!2sFarah%20Craft!5e0!3m2!1sen!2sid!4v1747405737126!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.65063007403916!3d-7.151648470158272!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8015ac782bd89%3A0x246274db7820b419!2sFarah%20Craft!5e0!3m2!1sen!2sid!4v1747405737126!5m2!1sen!2sid",
      },
      {
        name: "Niki Enak",
        description: "Menyediakan berbagai jenis jajanan Khas Gresik",
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
      },
      {
        name: "Warung Kopi Cak Udin",
        description: "Warkop cak Udin Menyajikan minuman di tempat",
        imageUrl:
          "https://manual.co.id/wp-content/uploads/2021/11/manual_photo_essay_warkop_web-14-980x719.jpg",
        location: "KH Hasyim Asyari",
        address: "Jl. K.H. Hasyim Asyari No. 1",
        categoryId: 3,
        promotionText: "",
        coordinates: "",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.65017435948572!3d-7.151592872940658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd800f7dc127c1d%3A0x23f8f56e9e90c3f0!2sWarkop%20Cak%20Udin!5e0!3m2!1sen!2sid!4v1747406864064!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.65017435948572!3d-7.151592872940658!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd800f7dc127c1d%3A0x23f8f56e9e90c3f0!2sWarkop%20Cak%20Udin!5e0!3m2!1sen!2sid!4v1747406864064!5m2!1sen!2sid",
      },
    ];

    umkmsData.forEach((umkm) => {
      this.createUmkm(umkm);
    });

    // Create village profile
    const villageProfileData: InsertVillageProfile = {
      name: "Kelurahan Sukodono",
      description:
        "Pusat informasi digital untuk mempromosikan potensi desa dan mendukung UMKM lokal.",
      history:
        "Kelurahan Sukodono memiliki sejarah panjang sejak tahun 1945. Didirikan oleh para pejuang kemerdekaan, desa ini telah berkembang menjadi pusat ekonomi dan budaya di kawasan ini.",
      vision:
        "Menjadikan Kelurahan Sukodono sebagai desa mandiri dan berkelanjutan melalui pemberdayaan ekonomi lokal dan pelestarian budaya.",
      mission: [
        "Meningkatkan taraf hidup masyarakat melalui pemberdayaan UMKM",
        "Mengembangkan potensi alam desa secara berkelanjutan",
        "Melestarikan kearifan lokal dan budaya desa",
        "Menciptakan lingkungan desa yang bersih dan sehat",
      ],
      population: 1220,
      umkmCount: 52,
      hamletCount: 8,
    };

    this.createVillageProfile(villageProfileData);
  }
}

export const storage = new MemStorage();
