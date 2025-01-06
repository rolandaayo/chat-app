'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { ChatLogo, GoogleIcon } from './Icons';
import { useState } from 'react';

const Navbar = () => {
  const { user, signInWithGoogle, logout, loading, error } = useAuth();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Failed to sign in:', error);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <nav className="bg-[#2AABEE] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 text-white">
              <ChatLogo />
            </div>
            <span className="text-xl font-bold">TeleChat</span>
          </Link>

          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse bg-white/20 rounded-lg px-4 py-2">
                Loading...
              </div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      {user.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <span className="hidden md:inline-block">{user.displayName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                className="flex items-center space-x-2 bg-white text-[#2AABEE] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <GoogleIcon />
                <span>{isSigningIn ? 'Signing in...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {error && (
        <div className="bg-red-500 text-white text-sm py-2 px-4 text-center">
          {error}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
