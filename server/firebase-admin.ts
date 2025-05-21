import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as fs from 'fs';
import * as path from 'path';

let credentials = undefined;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  // Railway/production: dari env var
  credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
} else {
  // Local development: dari file serviceAccountKey.json jika ada
  try {
    const serviceAccountPath = path.resolve(__dirname, 'serviceAccountKey.json');
    if (fs.existsSync(serviceAccountPath)) {
      credentials = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    }
  } catch (e) {
    // ignore if file not found
  }
}

initializeApp({
  credential: credentials ? cert(credentials) : undefined,
});

export const adminDb = getFirestore();
