import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let credentials = undefined;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
} else {
  try {
    const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      credentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    }
  } catch (e) {
    // ignore if file not found
  }
}

if (credentials) {
  initializeApp({
    credential: cert(credentials),
  });
} else {
  initializeApp(); // fallback, tidak error jika credential tidak ada
}

export const adminDb = getFirestore();
