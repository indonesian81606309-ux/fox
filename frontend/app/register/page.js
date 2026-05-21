'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ParticleBackground />
      <motion.div className="glass p-8 rounded-2xl w-96 neon-border z-10">
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">Daftar Akun</h1>
        <input type="text" placeholder="Username" className="w-full p-3 mb-4 bg-black/50 border border-blue-500 rounded-lg" value={username} onChange={e=>setUsername(e.target.value)} />
        <input type="text" placeholder="Nama Lengkap" className="w-full p-3 mb-4 bg-black/50 border border-blue-500 rounded-lg" value={fullName} onChange={e=>setFullName(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full p-3 mb-6 bg-black/50 border border-blue-500 rounded-lg" value={password} onChange={e=>setPassword(e.target.value)} />
        <button onClick={()=>register(username, fullName, password)} className="w-full bg-blue-600 hover:bg-blue-500 py-3 rounded-lg font-bold">Daftar</button>
        <p className="text-center mt-4">Sudah punya akun? <Link href="/login" className="text-blue-400">Login</Link></p>
      </motion.div>
    </div>
  );
}
