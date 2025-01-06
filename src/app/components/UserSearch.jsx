'use client';
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const UserSearch = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const searchUsers = async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('displayName', '>=', term),
        where('displayName', '<=', term + '\uf8ff')
      );

      const querySnapshot = await getDocs(q);
      const users = querySnapshot.docs
        .map(doc => ({ ...doc.data(), uid: doc.id }))
        .filter(u => u.uid !== user.uid); // Exclude current user

      setSearchResults(users);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchTerm) {
        searchUsers(searchTerm);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm]);

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search users..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE] bg-gray-50"
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2AABEE]"></div>
          </div>
        )}
      </div>

      {searchResults.length > 0 && (
        <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden">
          {searchResults.map((result) => (
            <button
              key={result.uid}
              onClick={() => onSelectUser(result)}
              className="w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
            >
              {result.photoURL ? (
                <img
                  src={result.photoURL}
                  alt={result.displayName}
                  className="w-10 h-10 rounded-full"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#2AABEE] text-white flex items-center justify-center">
                  {result.displayName[0]}
                </div>
              )}
              <div className="text-left">
                <div className="font-medium">{result.displayName}</div>
                <div className="text-sm text-gray-500">{result.email}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
