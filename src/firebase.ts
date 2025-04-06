// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyBOv5mldJeUyaqG-gGLyB8OBdB62kppN5M",
    authDomain: "mvt-prueba.firebaseapp.com",
    projectId: "mvt-prueba",
    storageBucket: "mvt-prueba.firebasestorage.app",
    messagingSenderId: "355225916886",
    appId: "1:355225916886:web:18924fc84b8b92c8a20077"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
