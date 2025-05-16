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
        address: "Jl. Sindujoyo Gg. XXI No.50",
        categoryId: 1, // Kerajinan
        promotionText: "",
        coordinates: "-7.152391,112.652379",
        maps1:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.65279798679201!3d-7.152348076278058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010066bd5589%3A0x36be09024c3b982a!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sen!2sid!4v1747374768900!5m2!1sen!2sid",
        maps2:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.65279798679201!3d-7.152348076278058!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010066bd5589%3A0x36be09024c3b982a!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sen!2sid!4v1747374768900!5m2!1sen!2sid",
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
        maps1: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1000.0!2d112.6511758383209!3d-7.151240098213269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010029cc181d%3A0xfc35848efc1e52e7!2sSedia%20Kue%20Kering%20(Yaris%20Cookies)!5e0!3m2!1sid!2sid!4v1747185507203!5m2!1sid!2sid",
        maps2: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d300.0!2d112.6511758383209!3d-7.151240098213269!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8010029cc181d%3A0xfc35848efc1e52e7!2sSedia%20Kue%20Kering%20(Yaris%20Cookies)!5e0!3m2!1sid!2sid!4v1747185507203!5m2!1sid!2sid",
      },
      {
        name: "Warung Kopi Mama Atul",
        description:
          "Menyajikan berbagai minuman kemasan dan kopi khas dari gresik yang kental dan nikmat.",
        imageUrl:
          "https://manual.co.id/wp-content/uploads/2021/11/manual_photo_essay_warkop_web-18-980x719.jpg",
        location: "KH Hasyim Asyari",
        address: "Jl. Kebun No. 8, Dusun Subur",
        categoryId: 3, // Kedai
        promotionText: "Paket Hemat",
        coordinates: "-6.397709,108.283611",
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.3857754746075!2d112.65176368664429!3d-7.152391898289468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8018bea2f0c1f%3A0xd69264df8de74401!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sid!2sid!4v1747183100084!5m2!1sid!2sid",
      },
      {
        name: "Batik Alami Desa",
        description:
          "Memproduksi kain batik dengan pewarna alami dari tumbuhan lokal dengan motif khas desa.",
        imageUrl:
          "https://pixabay.com/get/gf3689bb6f45fd018d16b64086251e3dc3aa8df4a487dd070a3c62a1f5a833a34b625a5bb13ebba240f441247c256194576bcc2514f03fa43a7e2e722172fc9d6_1280.jpg",
        location: "Dusun Indah",
        address: "Jl. Seni No. 20, Dusun Indah",
        categoryId: 1, // Kerajinan
        promotionText: "Diskon 15%",
        coordinates: "-6.396709,108.285611",
        maps1: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.3857754746075!2d112.65176368664429!3d-7.152391898289468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8018bea2f0c1f%3A0xd69264df8de74401!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sid!2sid!4v1747183100084!5m2!1sid!2sid",
        maps2: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.3857754746075!2d112.65176368664429!3d-7.152391898289468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8018bea2f0c1f%3A0xd69264df8de74401!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sid!2sid!4v1747183100084!5m2!1sid!2sid",
      },
      {
        name: "Kopi Desa Sejahtera",
        description:
          "Menawarkan biji kopi lokal yang ditanam di ketinggian optimal dan diolah dengan metode tradisional.",
        imageUrl:
          "https://pixabay.com/get/g8a03d6b6c36fab89ec7a9efb2df5cf24e9d9418ae670839855c458d99300fe8d8f771601e26ada652e4f3e6b710bda3aa28cbad340a2ffaaee855c3be76d76_1280.jpg",
        location: "Dusun Makmur",
        address: "Jl. Pasar No. 15, Dusun Makmur",
        categoryId: 2, // Makanan
        promotionText: "Gratis Sampel",
        coordinates: "-6.400709,108.281611",
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.3857754746075!2d112.65176368664429!3d-7.152391898289468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8018bea2f0c1f%3A0xd69264df8de74401!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sid!2sid!4v1747183100084!5m2!1sid!2sid",
      },
      {
        name: "Madu Hutan Asli",
        description:
          "Menyediakan madu murni yang diambil langsung dari hutan desa dengan kualitas premium.",
        imageUrl:
          "https://images.unsplash.com/photo-1587049352851-8d4e89133924",
        location: "Dusun Hutan",
        address: "Jl. Hutan No. 5, Dusun Hutan",
        categoryId: 3, // Pertanian
        promotionText: "Bundling 3",
        coordinates: "-6.401709,108.280611",
        maps: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1979.3857754746075!2d112.65176368664429!3d-7.152391898289468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd8018bea2f0c1f%3A0xd69264df8de74401!2sYayuk%20Collection%20%26%20Accessories!5e0!3m2!1sid!2sid!4v1747183100084!5m2!1sid!2sid",
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
