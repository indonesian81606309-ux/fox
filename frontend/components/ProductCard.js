'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function ProductCard({ product }) {
  const router = useRouter();
  return (
    <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} className="glass rounded-xl overflow-hidden border border-blue-500/30 hover:neon-border transition-all cursor-pointer" onClick={() => router.push(`/dashboard/product/${product._id}`)}>
      <Image src={product.imageUrl || '/placeholder.jpg'} width={400} height={250} className="w-full h-48 object-cover" alt={product.name} unoptimized />
      <div className="p-4">
        <h3 className="text-xl font-bold">{product.name}</h3>
        <p className="text-blue-400 text-lg">Rp {product.price.toLocaleString()}</p>
        <p className="text-sm text-gray-400">Stok: {product.stock}</p>
        <button className="mt-3 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-500 transition">Beli</button>
      </div>
    </motion.div>
  );
}
