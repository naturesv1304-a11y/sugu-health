import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ ADD THIS

const firebaseConfig = {
  apiKey: "AIzaSyCvzLZaqoUuEs4nBNzDOd4S-vk6HwJC7Zc",
  authDomain: "sugu-health.firebaseapp.com",
  projectId: "sugu-health",
  storageBucket: "sugu-health.firebasestorage.app",
  messagingSenderId: "440868364509",
  appId: "1:440868364509:web:0615d4c7a135ea5c68bb34",
  measurementId: "G-S85Y5EFTKM"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app); // ✅ ADD THIS

export const googleProvider = new GoogleAuthProvider();

export const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
export const logout = () => signOut(auth);