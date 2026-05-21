'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaHome, FaTag, FaTicketAlt, FaComments, FaBox, FaCrown, FaCalendarAlt, FaStar, FaChartLine } from 'react-icons/fa';

const menuItems = [
  { name: 'Beranda', path: '/dashboard/home', icon: <FaHome /> },
  { name: 'Tawarkan Admin', path: '/dashboard/offers', icon: <FaTag /> },
  { name: 'Tukar Kode', path: '/dashboard/redeem', icon: <FaTicketAlt /> },
  { name: 'Chat Admin', path: '/dashboard/chat', icon: <FaComments /> },
  { name: 'Pesanan Saya', path: '/dashboard/orders', icon: <FaBox /> },
  { name: 'Jasa Admin', path: '/dashboard/services', icon: <FaCrown /> },
  { name: 'Event', path: '/dashboard/events', icon: <FaCalendarAlt /> },
  { name: 'Review', path: '/dashboard/reviews', icon: <FaStar /> },
];

const adminMenu = [
  { name: 'Admin Panel', path: '/dashboard/admin', icon: <FaChartLine /> },
];

export default function Sidebar({ isOpen, close }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.role !== 'user';

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={close} />}
      <div className={`fixed top-0 left-0 h-full w-64 bg-black/90 backdrop-blur-xl border-r border-blue-500/30 z-50 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-5 text-2xl font-bold text-blue-400 border-b border-blue-500/30">3+ Fox</div>
        <nav className="mt-6">
          {menuItems.map(item => (
            <Link key={item.path} href={item.path} onClick={close} className={`flex items-center gap-4 px-6 py-3 hover:bg-blue-500/20 transition ${pathname === item.path ? 'bg-blue-500/30 text-blue-400 border-r-4 border-blue-400' : 'text-gray-300'}`}>
              {item.icon} {item.name}
            </Link>
          ))}
          {isAdmin && adminMenu.map(item => (
            <Link key={item.path} href={item.path} onClick={close} className={`flex items-center gap-4 px-6 py-3 hover:bg-blue-500/20 transition ${pathname === item.path ? 'bg-blue-500/30 text-blue-400 border-r-4 border-blue-400' : 'text-gray-300'}`}>
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
