'use client';
import { FaBars, FaBell, FaUser } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  return (
    <div className="fixed top-0 left-0 right-0 bg-black/80 backdrop-blur-md border-b border-blue-500/30 z-40 px-4 py-3 flex justify-between items-center">
      <button onClick={toggleSidebar} className="text-2xl text-blue-400"><FaBars /></button>
      <div className="flex items-center gap-4">
        <FaBell className="text-gray-400 hover:text-blue-400 cursor-pointer" />
        <div className="relative group">
          <button className="flex items-center gap-2"><FaUser /> {user?.username}</button>
          <div className="absolute right-0 mt-2 w-32 bg-black/90 border border-blue-500 rounded-lg hidden group-hover:block">
            <button onClick={logout} className="block w-full text-left px-4 py-2 hover:bg-blue-500/20">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
