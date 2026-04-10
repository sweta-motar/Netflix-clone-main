// Import Firebase core
import { initializeApp } from "firebase/app";

// ✅ IMPORT AUTH
import { getAuth } from "firebase/auth";

// (Optional for later)
import { getFirestore } from "firebase/firestore";

// Your config (already correct ✅)
const firebaseConfig = {
  apiKey: "AIzaSyABtuY6fDEtyGbXvxtcdxAxZ3lIprY6it8",
  authDomain: "netflix-clone-789f7.firebaseapp.com",
  projectId: "netflix-clone-789f7",
  storageBucket: "netflix-clone-789f7.firebasestorage.app",
  messagingSenderId: "347846851383",
  appId: "1:347846851383:web:e40a7b84618a596c4ef8b2"
};

// Initialize app
const app = initializeApp(firebaseConfig);

// ✅ EXPORT AUTH (THIS WAS MISSING)
export const auth = getAuth(app);

// ✅ (Optional for later use)
export const db = getFirestore(app);