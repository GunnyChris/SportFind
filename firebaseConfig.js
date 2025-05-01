// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase, ref } from "firebase/database"; // Realtime DB
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCxbr1lWFSXFayiMOWIb4EezqD6L1DLZMw",
  authDomain: "sportfindapp2.firebaseapp.com",
  projectId: "sportfindapp2",
  storageBucket: "sportfindapp2.appspot.com",
  messagingSenderId: "990247300770",
  appId: "1:990247300770:web:fe8c87da1a5e231deb71fb",
  measurementId: "G-WD45JLBC09"
};

// Initialize Firebase App
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Initialize Firebase services
let auth = null;
let db = null;
let rdb = null;

if (app) {
  try {
    // Auth with AsyncStorage persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage)
    });

    // Firestore
    db = getFirestore(app);

    // ✅ Realtime Database - Use correct regional URL
    rdb = getDatabase(app, 'https://sportfindapp2-default-rtdb.asia-southeast1.firebasedatabase.app');

  } catch (error) {
    console.error("Error initializing Firebase services:", error);
  }
} else {
  console.error("Firebase app initialization failed. Auth and Firestore will not be available.");
}

console.log("Firebase App:", app ? "Initialized" : "Not initialized");
console.log("Firestore (db):", db ? "Initialized" : "Not initialized");
console.log("Realtime DB (rdb):", rdb ? "Initialized" : "Not initialized");

// Export services
export { auth, db, rdb };