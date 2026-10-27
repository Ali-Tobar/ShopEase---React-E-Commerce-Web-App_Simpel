import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBdCIJxUWUvOqHjKcbDYo-eCE2mjvVcOwU",
  authDomain: "e-commerce-simpel.firebaseapp.com",
  projectId: "e-commerce-simpel",
  storageBucket: "e-commerce-simpel.firebasestorage.app",
  messagingSenderId: "801632075724",
  appId: "1:801632075724:web:8d48bbe89739a9266fa769",
  measurementId: "G-8KNRM7FKCD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;