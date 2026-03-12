import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Estas variables deben ser configuradas en tu archivo .env
const firebaseConfig = {
    apiKey: 'AIzaSyAsp4NO1C8q14d3--RxGU8VTVaD5LEj8SQ',
    authDomain: 'ciensmart.firebaseapp.com',
    projectId: 'ciensmart',
    storageBucket: 'ciensmart.firebasestorage.app',
    messagingSenderId: '164970912904',
    appId: '1:164970912904:web:ab6ca0fca778fbaec1d33d'
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
