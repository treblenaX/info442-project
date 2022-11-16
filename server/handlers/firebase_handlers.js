import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, doc, getDoc, query, where, deleteDoc } from "firebase/firestore";

export default class FirebaseHandler {
  static app = null;
  static db = null;

  static initFirebaseApp() {
    if (!FirebaseHandler.app) {
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
      
      console.log('[FIREBASE][APP] Connecting to Firebase app...');
      FirebaseHandler.app = initializeApp(firebaseConfig);
      console.log('[FIREBASE][APP] Connected to Firebase app!');
    
      console.log('[FIREBASE][DB] Connecting to Firebase DB...');
      FirebaseHandler.db = getFirestore(FirebaseHandler.app);
      console.log('[FIREBASE][DB] Connected to Firebase DB!');
      console.log('[FIREBASE] Firebase app connection successful!');
    }
  }

  static async getConditionedDoc(collectionName, conditionsArray) {
    try {
      // Turn condition objects into 'where' clauses
      const wheresArr = conditionsArray.map((condition) => where(condition.attributeName, condition.comparator, condition.attributeValue));
      const ref = collection(FirebaseHandler.db, collectionName);
      const q = query(ref, ...wheresArr);
      const snapshot = await getDocs(q);

      let payload = [];
      snapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        payload.push({
          id: doc.id,
          ...doc.data()
        });
      });

      return payload;
    } catch (e) {
      throw new Error(`Error querying for data: ${e}`);
    }
  }

  /**
   * 
   * @param {string} collectionName 
   * @param {string} refID 
   * @returns 
   */
  static async getSingleDoc(collectionName, refID) {
    try {
      const docRef = doc(FirebaseHandler.db, collectionName, refID);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        return {
          id: snapshot.id,
          ...snapshot.data()
        };
      }
    } catch (e) {
      throw new Error(e);
    }
  }

  /**
   * 
   * @param {string} collectionName 
   * @returns 
   */
  static async getDocCollection(collectionName) {
    try {
      let payload = [];
      const ref = collection(FirebaseHandler.db, collectionName);
      const snapshot = await getDocs(ref);
      snapshot.forEach((doc) => {
        let obj = {
          id: doc.id,
          ...doc.data()
        };
        payload.push(obj);
      });
      return payload;
    } catch (e) {
      throw new Error('Error reading documents: ' + e);
    }
  }

  /**
   * 
   * @param {string} collectionName 
   * @param {object} documentObject 
   * @returns 
   */
  static async addDoc(collectionName, documentObject) {
    try {
      const ref = collection(FirebaseHandler.db, collectionName);
      const docRef = await addDoc(ref, documentObject);
      return docRef.id;
    } catch (e) {
      throw new Error('Error adding document: ' + e);
    }
  }

  static async deleteDoc(collectionName, documentID) {
    try {
      const ref = collection(FirebaseHandler.db, collectionName);
      const docRef = await deleteDoc(ref, documentID);
      return docRef.id;
    } catch (e) {
      throw new Error('Error deleting document: ' + e); 
    }
  }
}