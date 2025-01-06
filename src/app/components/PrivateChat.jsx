'use client';
import { useState, useEffect, useRef } from 'react';
import { db } from '../firebase/config';
import { useAuth } from '../context/AuthContext';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, where } from 'firebase/firestore';
import { SendIcon } from './Icons';

const PrivateChat = ({ selectedUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user || !selectedUser) return;

    // Create a chat room ID that's the same regardless of who started the chat
    const chatRoomId = [user.uid, selectedUser.uid].sort().join('_');

    const q = query(
      collection(db, 'privateMessages'),
      where('chatRoomId', '==', chatRoomId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user, selectedUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedUser) return;

    const chatRoomId = [user.uid, selectedUser.uid].sort().join('_');

    try {
      await addDoc(collection(db, 'privateMessages'), {
        text: newMessage,
        sender: user.displayName,
        senderPhoto: user.photoURL,
        senderId: user.uid,
        receiverId: selectedUser.uid,
        chatRoomId,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[#2AABEE] text-white p-4 flex items-center space-x-3">
        {selectedUser.photoURL ? (
          <img
            src={selectedUser.photoURL}
            alt={selectedUser.displayName}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            {selectedUser.displayName[0]}
          </div>
        )}
        <div>
          <h2 className="font-bold">{selectedUser.displayName}</h2>
          <p className="text-sm opacity-75">{selectedUser.email}</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F4F4F4] space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.senderId === user.uid ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`flex ${message.senderId === user.uid ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
              {message.senderPhoto ? (
                <img
                  src={message.senderPhoto}
                  alt={message.sender}
                  className="w-8 h-8 rounded-full"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                  {message.sender[0]}
                </div>
              )}
              <div
                className={`max-w-xs md:max-w-md ${
                  message.senderId === user.uid
                    ? 'bg-[#2AABEE] text-white rounded-l-lg rounded-tr-lg'
                    : 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg'
                } p-3 shadow-sm`}
              >
                <p className="break-words">{message.text}</p>
                <p className="text-xs opacity-75 mt-1">
                  {message.timestamp?.toDate().toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2AABEE] bg-gray-50"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-[#2AABEE] text-white p-3 rounded-lg hover:bg-[#229ED9] transition-colors disabled:opacity-50 flex items-center justify-center"
          >
            <SendIcon />
          </button>
        </div>
      </form>
    </div>
  );
};

export default PrivateChat;
