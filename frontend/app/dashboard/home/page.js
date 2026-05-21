'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import ProductCard from '@/components/ProductCard';
import Loading from '@/components/Loading';

const games = ['HOK', 'Roblox', 'MLBB', 'PUBG', 'Free Fire', 'Genshin Impact', 'Fish It', 'Steal A Brainrot', 'Grow A Garden'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const res = await axios.get('/products', { params: { game: selectedGame, search } });
      setProducts(res.data);
      setLoading(false);
    };
    fetchProducts();
  }, [selectedGame, search]);

  if (loading) return <Loading />;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2">
        <input type="text" placeholder="Cari produk..." className="bg-black/50 border border-blue-500 rounded-full px-4 py-2 flex-1" value={search} onChange={e=>setSearch(e.target.value)} />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
        <button onClick={() => setSelectedGame('')} className={`px-4 py-2 rounded-full ${selectedGame === '' ? 'bg-blue-600' : 'bg-gray-800'}`}>Semua</button>
        {games.map(game => (
          <button key={game} onClick={() => setSelectedGame(game)} className={`px-4 py-2 rounded-full ${selectedGame === game ? 'bg-blue-600 neon-border' : 'bg-gray-800 hover:bg-gray-700'}`}>
            {game}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => <ProductCard key={product._id} product={product} />)}
      </div>
    </div>
  );
}
