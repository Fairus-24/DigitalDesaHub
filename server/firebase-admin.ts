import { initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Ganti dengan path ke file service account Anda jika perlu
// import serviceAccount from './serviceAccountKey.json';

initializeApp({
  // credential: cert(serviceAccount),
  credential: applicationDefault(),
});

export const adminDb = getFirestore();
