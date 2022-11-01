import { initializeApp } from "firebase/app";

var app = null;

export const initFirebaseApp = () => {
  console.log('[FIREBASE] Initializing Firebase connection...');
  const firebaseConfig = {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DATABASE_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID
  };
  
    
  // Initialize Firebase
  app = initializeApp(firebaseConfig);
  console.log('[FIREBASE] Firebase app connection successful!');
  // const database = getDatabase(app);
}
