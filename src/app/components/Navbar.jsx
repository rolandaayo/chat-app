'use client';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import { ChatLogo, GoogleIcon } from './Icons';

const Navbar = () => {
  const { user, signInWithGoogle, logout } = useAuth();

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
            {user ? (
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
                  onClick={logout}
                  className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="flex items-center space-x-2 bg-white text-[#2AABEE] px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <GoogleIcon />
                <span>Sign in with Google</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
