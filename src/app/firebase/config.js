import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFKTWw0DnyPj03_THOqxO3xl6Cahcu_hc",
  authDomain: "chat-app-4824a.firebaseapp.com",
  projectId: "chat-app-4824a",
  storageBucket: "chat-app-4824a.firebasestorage.app",
  messagingSenderId: "881034813992",
  appId: "1:881034813992:web:fc5106bf5fc44cea41cb1d",
  measurementId: "G-H13WZ1QHTD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
