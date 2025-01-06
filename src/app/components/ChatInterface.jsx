'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { GroupChatIcon, SendIcon } from './Icons';
import { db } from '../firebase/config';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'messages'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
      scrollToBottom();
    });

    return () => unsubscribe();
  }, [user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      await addDoc(collection(db, 'messages'), {
        text: newMessage,
        sender: user.displayName,
        senderPhoto: user.photoURL,
        userId: user.uid,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)]">
        <div className="text-xl text-gray-600">Please sign in to start chatting</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Chat Header */}
      <div className="bg-[#2AABEE] text-white p-4 flex items-center space-x-3">
        <div className="w-10 h-10 text-white">
          <GroupChatIcon />
        </div>
        <div>
          <h2 className="font-bold">Global Chat</h2>
          <p className="text-sm opacity-75">{messages.length} messages</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F4F4F4] space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.userId === user.uid ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`flex ${message.userId === user.uid ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
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
                  message.userId === user.uid
                    ? 'bg-[#2AABEE] text-white rounded-l-lg rounded-tr-lg'
                    : 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg'
                } p-3 shadow-sm`}
              >
                {message.userId !== user.uid && (
                  <p className="text-xs font-semibold mb-1">{message.sender}</p>
                )}
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

export default ChatInterface;
