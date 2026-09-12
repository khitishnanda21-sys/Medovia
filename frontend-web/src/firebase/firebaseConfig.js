import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAxKq8jQI4FRrHQH-WFvzeaOEgZfqo9ivI",
  authDomain: "medovia-1e02b.firebaseapp.com",
  projectId: "medovia-1e02b",
  storageBucket: "medovia-1e02b.firebasestorage.app",
  messagingSenderId: "310046243746",
  appId: "1:310046243746:web:7742ff5a01980c700e50fb",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);