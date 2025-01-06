import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
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

// Initialize Firebase only if it hasn't been initialized already
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configure Google Auth Provider
provider.setCustomParameters({
  prompt: 'select_account'
});

const db = getFirestore(app);

export { auth, provider, db };
