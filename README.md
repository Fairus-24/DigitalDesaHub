<h1 align="center">🏡 DigitalDesaHub</h1>
<p align="center">
  A one-stop dashboard for desa empowerment—UMKM mapping, community news, and more.
</p>

<p align="center">
  <a href="https://github.com/Fairus-24/DigitalDesaHub/stargazers">
    <img src="https://img.shields.io/github/stars/Fairus-24/DigitalDesaHub?style=flat-square" alt="GitHub Stars" />
  </a>
  <a href="https://github.com/Fairus-24/DigitalDesaHub/network/members">
    <img src="https://img.shields.io/github/forks/Fairus-24/DigitalDesaHub?style=flat-square" alt="GitHub Forks" />
  </a>
  <img src="https://img.shields.io/badge/TypeScript-4.9.5-blue?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-4.3.9-yellow?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/React-18.2.0-blue?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-4.x-lightgrey?style=flat-square&logo=express" alt="Express.js" />
  <img src="https://img.shields.io/badge/DrizzleORM-1.x-purple?style=flat-square" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-teal?style=flat-square&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="MIT License" />
</p>

---

## 🚀 About  
DigitalDesaHub is a full-stack platform tailored for desa (village) development. It integrates:
- **UMKM Mapping**: Pinpoint local micro–small–medium enterprises on an interactive map.  
- **Community News**: Publish and browse desa announcements or events.  
- **Shared Components**: Reusable UI, business logic, and API layers to accelerate feature development.

---

## 📂 Repo Structure
```

DigitalDesaHub/
├── client/             # Frontend (Vite + React + TypeScript)
│   ├── public/         # Static assets
│   └── src/            # React components, pages, hooks
├── server/             # Backend (Node.js + Express + Drizzle ORM)
│   ├── controllers/    # Route handlers
│   ├── models/         # Drizzle schema & DB migrations
│   └── index.ts        # App entrypoint
├── shared/             # Shared types, utils, and constants
├── drizzle.config.ts   # Drizzle ORM configuration
├── vite.config.ts      # Vite config
├── tailwind.config.ts  # Tailwind setup
├── package.json        # Root scripts & dev-dependencies
└── .replit             # Replit config (if using Repl.it)

````

---

## 🛠️ Features  
- **Responsive UI** powered by React & Tailwind CSS  
- **Fast bundling** with Vite (HMR, lightning-fast dev server)  
- **Type-safe API** using TypeScript end-to-end  
- **Robust data layer** via Drizzle ORM & PostgreSQL/MySQL  
- **Modular shared code** for DRY development  
- **Replit support** (see `.replit`) for zero-config online IDE

---

## ⚙️ Prerequisites  
- **Node.js** v18+  
- **pnpm** or **npm** (we recommend pnpm for consistency)  
- A running **PostgreSQL** or **MySQL** database (for Drizzle)

---

## 🔧 Installation & Setup

1. **Clone the repo**  
   ```bash
   git clone https://github.com/Fairus-24/DigitalDesaHub.git
   cd DigitalDesaHub

2. **Install dependencies**

   ```bash
   # Root (for shared dev scripts)
   npm install

   # Frontend
   cd client && npm install

   # Backend
   cd ../server && npm install
   ```

3. **Configure environment**
   Create a `.env` file in `/server`:

   ```dotenv
   DATABASE_URL="postgres://user:password@localhost:5432/digitaldesa"
   PORT=5000
   JWT_SECRET="your_jwt_secret"
   ```

   And in `/client`, if needed:

   ```dotenv
   VITE_API_BASE_URL="http://localhost:5000"
   ```

4. **Run database migrations**

   ```bash
   cd server
   npx drizzle-kit migrate
   ```

---

## ▶️ Running Locally

### Start backend

```bash
cd server
npm run dev
```

Your API will be live at `http://localhost:5000`.

### Start frontend

```bash
cd client
npm run dev
```

Visit `http://localhost:5173` (or the URL Vite reports) to see the app.

---

## 🔍 Usage

1. **UMKM Mapping**

   * Navigate to **Map** in the sidebar
   * Click **Add UMKM** to drop a new pin
   * Fill in business details and save

2. **Community News**

   * Go to **News**
   * View list of articles or click **New Article**
   * Write content using rich-text editor

3. **Shared Components**

   * Check out `/shared` for types, helpers, and UI elements you can import anywhere

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch: `git checkout -b feature/YourFeature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/YourFeature`
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more details.

---

## 📫 Contact

Fairus – [@Fairus-24](https://github.com/Fairus-24)
Project Link: [https://github.com/Fairus-24/DigitalDesaHub](https://github.com/Fairus-24/DigitalDesaHub)
