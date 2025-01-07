'use client';
import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, query, getDocs, orderBy, where } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

const UserSearch = ({ onSelectUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user, userProfile } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('username'));
        const querySnapshot = await getDocs(q);
        
        const fetchedUsers = querySnapshot.docs
          .map(doc => ({
            uid: doc.id,
            ...doc.data(),
            displayName: doc.data().displayName || 'Anonymous',
            username: doc.data().username || doc.data().displayName?.toLowerCase().replace(/\s+/g, '') || 'anonymous',
            photoURL: doc.data().photoURL || null,
          }))
          .filter(u => u.uid !== user.uid); // Exclude current user
        
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user]);

  // Filter users locally based on search term
  const filteredUsers = users.filter(u => {
    const searchLower = searchTerm.toLowerCase();
    return (
      u.username?.toLowerCase().includes(searchLower) ||
      u.displayName?.toLowerCase().includes(searchLower) ||
      u.email?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by username, name, or email..."
          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE] bg-gray-50"
        />
        {loading && (
          <div className="absolute right-3 top-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2AABEE]"></div>
          </div>
        )}
      </div>

      <div className="mt-2 text-sm text-gray-500 flex justify-between items-center">
        <span>{users.length} users available</span>
        {userProfile && (
          <span className="text-[#2AABEE]">Your username: @{userProfile.username}</span>
        )}
      </div>

      {filteredUsers.length > 0 ? (
        <div className="mt-4 bg-white rounded-lg shadow-lg overflow-hidden max-h-[400px] overflow-y-auto">
          {filteredUsers.map((result) => (
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
                  {result.displayName?.[0] || '?'}
                </div>
              )}
              <div className="text-left">
                <div className="font-medium">{result.displayName}</div>
                <div className="text-sm text-gray-500">@{result.username}</div>
                <div className="text-xs text-gray-400">{result.email}</div>
                {result.bio && (
                  <div className="text-sm text-gray-600 mt-1">{result.bio}</div>
                )}
              </div>
            </button>
          ))}
        </div>
      ) : searchTerm ? (
        <div className="mt-4 text-center text-gray-500">
          No users found matching "{searchTerm}"
        </div>
      ) : null}
    </div>
  );
};

export default UserSearch;
