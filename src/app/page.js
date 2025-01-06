'use client';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import UserSearch from './components/UserSearch';
import PrivateChat from './components/PrivateChat';
import { useAuth } from './context/AuthContext';
import { db } from './firebase/config';
import { doc, setDoc } from 'firebase/firestore';

export default function Page() {
  const [selectedUser, setSelectedUser] = useState(null);
  const { user } = useAuth();

  // Save user data to Firestore when they log in
  useEffect(() => {
    if (user) {
      const userRef = doc(db, 'users', user.uid);
      setDoc(userRef, {
        displayName: user.displayName,
        email: user.email,
        photoURL: user.photoURL,
        lastSeen: new Date(),
      }, { merge: true });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto py-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Welcome to TeleChat</h1>
            <p className="text-gray-600">Please sign in to start chatting</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Search Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-xl font-bold mb-4">Find Users</h2>
              <UserSearch onSelectUser={setSelectedUser} />
            </div>
          </div>

          {/* Chat Section */}
          <div className="md:col-span-2 h-[calc(100vh-16rem)]">
            <PrivateChat selectedUser={selectedUser} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
