import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialise Firebase Admin using either a service account JSON in env
// (FIREBASE_ADMIN_JSON) or Application Default Credentials.
const saJson = process.env.FIREBASE_ADMIN_JSON;
if (!getApps().length) {
  if (saJson) {
    try {
      const sa = JSON.parse(saJson);
      initializeApp({ credential: cert(sa) });
    } catch (e) {
      // Fallback to ADC if JSON is malformed
      initializeApp({ credential: applicationDefault() });
    }
  } else {
    initializeApp({ credential: applicationDefault() });
  }
}

export const db = getFirestore();
