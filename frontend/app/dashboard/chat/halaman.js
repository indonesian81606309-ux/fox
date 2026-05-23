use client';
import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import { initSocket, getSocket } from '@/lib/socket';
import toast from 'react-hot-toast';
import Loading from '@/components/Loading';

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (user) {
      socketRef.current = initSocket(user.id);
      socketRef.current.on('newMessage', (msg) => {
        if (msg.sender === selectedAdmin?._id || msg.receiver === selectedAdmin?._id) {
          setMessages(prev => [...prev, msg]);
        }
      });
      // Fetch list of admins (role != user)
      axios.get('/users/admins').then(res => setAdmins(res.data));
    }
    return () => socketRef.current?.disconnect();
  }, [user, selectedAdmin]);

  useEffect(() => {
    if (selectedAdmin) {
      axios.get(`/chats/conversation/${selectedAdmin._id}`).then(res => setMessages(res.data));
    }
  }, [selectedAdmin]);

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedAdmin) return;
    const msgData = { senderId: user.id, receiverId: selectedAdmin._id, message: newMessage };
    socketRef.current.emit('sendMessage', msgData);
    setNewMessage('');
  };

  if (!selectedAdmin) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Pilih Admin untuk Chat</h1>
        <div className="grid gap-2">
          {admins.map(admin => (
            <button key={admin._id} onClick={() => setSelectedAdmin(admin)} className="glass p-3 rounded-lg text-left hover:bg-blue-500/20">{admin.username}</button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Chat dengan {selectedAdmin.username}</h1>
        <button onClick={() => setSelectedAdmin(null)} className="text-blue-400">Ganti Admin</button>
      </div>
      <div className="flex-1 overflow-y-auto glass p-4 rounded-xl space-y-2" ref={messagesEndRef}>
        {messages.map(msg => (
          <div key={msg._id} className={`flex ${msg.sender === user.id ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs p-3 rounded-lg ${msg.sender === user.id ? 'bg-blue-600' : 'bg-gray-800'}`}>
              {msg.message}
              {msg.fileUrl && (msg.fileType === 'image' ? <img src={msg.fileUrl} className="mt-2 rounded max-h-40" /> : <video src={msg.fileUrl} controls className="mt-2 max-h-40" />)}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-4 flex gap-2">
        <input type="text" value={newMessage} onChange={e=>setNewMessage(e.target.value)} className="flex-1 p-2 bg-black/50 border border-blue-500 rounded-lg" placeholder="Tulis pesan..." onKeyPress={e=>e.key==='Enter' && sendMessage()} />
        <button onClick={sendMessage} className="bg-blue-600 px-4 rounded-lg">Kirim</button>
      </div>
    </div>
  );
      }
