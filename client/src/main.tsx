import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Helmet, HelmetProvider } from 'react-helmet-async';

createRoot(document.getElementById("root")!).render(
  <HelmetProvider>
    <Helmet>
      <title>Desa Sejahtera - Pusat Informasi dan UMKM Lokal</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1" />
    </Helmet>
    <App />
  </HelmetProvider>
);
