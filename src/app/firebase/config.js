import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDFKTWw0DnyPj03_THOqxO3xl6Cahcu_hc",
  authDomain: "chat-app-4824a.firebaseapp.com",
  projectId: "chat-app-4824a",
  storageBucket: "chat-app-4824a.firebasestorage.app",
  messagingSenderId: "881034813992",
  appId: "1:881034813992:web:fc5106bf5fc44cea41cb1d",
  measurementId: "G-H13WZ1QHTD"
};

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const db = getFirestore(app);

// Configure Google Auth Provider
const provider = new GoogleAuthProvider();
provider.setCustomParameters({
  prompt: 'select_account'
});

// Use emulator in development
if (process.env.NODE_ENV === 'development') {
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
  }
}

export { auth, provider, db };
