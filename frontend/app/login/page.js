'use client';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { motion } from 'framer-motion';
import ParticleBackground from '@/components/ParticleBackground';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      <ParticleBackground />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-8 rounded-2xl w-96 neon-border z-10"
      >
        <h1 className="text-3xl font-bold text-center text-blue-400 mb-6">3+ Fox Market</h1>
        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 mb-4 bg-black/50 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 mb-6 bg-black/50 border border-blue-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={() => login(username, password)}
          className="w-full bg-blue-600 hover:bg-blue-500 transition-all py-3 rounded-lg font-bold"
        >
          Login
        </button>
        <p className="text-center mt-4 text-gray-300">
          Belum punya akun?{' '}
          <Link href="/register" className="text-blue-400 hover:underline">
            Daftar
          </Link>
        </p>
      </motion.div>
    </div>
  );
            }
