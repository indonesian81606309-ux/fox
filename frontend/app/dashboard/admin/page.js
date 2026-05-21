'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [offers, setOffers] = useState([]);
  const [reports, setReports] = useState([]);
  const [payments, setPayments] = useState([]);
  const [redeemCodes, setRedeemCodes] = useState([]);
  const [giveaways, setGiveaways] = useState([]);
  const [services, setServices] = useState([]);
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState(null);

  const isSuperAdmin = user?.role === 'superadmin';
  const isAdmin = user?.role !== 'user';

  // Fetch data based on active tab
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === 'products') {
          const res = await axios.get('/products');
          setProducts(res.data);
        } else if (activeTab === 'orders') {
          const res = await axios.get('/orders/admin/all');
          setOrders(res.data);
        } else if (activeTab === 'offers') {
          const res = await axios.get('/offers/admin/all');
          setOffers(res.data);
        } else if (activeTab === 'reports' && isSuperAdmin) {
          const res = await axios.get('/reports/admin/all');
          setReports(res.data);
        } else if (activeTab === 'payments' && isSuperAdmin) {
          const res = await axios.get('/payments');
          setPayments(res.data);
        } else if (activeTab === 'redeem' && isSuperAdmin) {
          const res = await axios.get('/redeem');
          setRedeemCodes(res.data);
        } else if (activeTab === 'giveaways' && isSuperAdmin) {
          const res = await axios.get('/giveaway');
          setGiveaways(res.data);
        } else if (activeTab === 'services' && isSuperAdmin) {
          const res = await axios.get('/services');
          setServices(res.data);
        } else if (activeTab === 'stats' && isSuperAdmin) {
          const statsRes = await axios.get('/admin/stats');
          setStats(statsRes.data);
          const chartRes = await axios.get('/admin/sales-chart');
          setSalesData(chartRes.data);
        }
      } catch (err) {
        toast.error('Gagal mengambil data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab, isSuperAdmin]);

  // Product handlers
  const handleCreateProduct = async () => {
    const name = prompt('Nama produk');
    const price = parseInt(prompt('Harga'));
    const stock = parseInt(prompt('Stok'));
    const game = prompt('Game');
    const type = prompt('Tipe produk (akun/joki/sewa/robux/dll)');
    const description = prompt('Deskripsi');
    const imageUrl = prompt('URL gambar') || 'https://picsum.photos/200/150';
    if (!name || !price) return;
    try {
      await axios.post('/products', { name, price, stock, game, type, description, imageUrl });
      toast.success('Produk dibuat');
      const res = await axios.get('/products');
      setProducts(res.data);
    } catch (err) {
      toast.error('Gagal membuat produk');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Yakin hapus produk ini?')) return;
    try {
      await axios.delete(`/products/${id}`);
      toast.success('Produk dihapus');
      setProducts(products.filter(p => p._id !== id));
    } catch (err) {
      toast.error('Gagal hapus');
    }
  };

  // Order handlers
  const handleAcceptOrder = async (orderId) => {
    try {
      await axios.put(`/orders/admin/${orderId}/accept`);
      toast.success('Pesanan diterima, stok berkurang');
      const res = await axios.get('/orders/admin/all');
      setOrders(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal');
    }
  };

  const handleRejectOrder = async (orderId) => {
    try {
      await axios.put(`/orders/admin/${orderId}/reject`);
      toast.success('Pesanan ditolak');
      const res = await axios.get('/orders/admin/all');
      setOrders(res.data);
    } catch (err) {
      toast.error('Gagal');
    }
  };

  // Offer handlers
  const handleAcceptOffer = async (offerId) => {
    try {
      await axios.put(`/offers/admin/${offerId}/accept`);
      toast.success('Penawaran diterima, hubungi user via chat');
      setOffers(offers.map(o => o._id === offerId ? { ...o, status: 'accepted' } : o));
    } catch (err) {
      toast.error('Gagal');
    }
  };

  const handleRejectOffer = async (offerId) => {
    try {
      await axios.put(`/offers/admin/${offerId}/reject`);
      toast.success('Penawaran ditolak');
      setOffers(offers.map(o => o._id === offerId ? { ...o, status: 'rejected' } : o));
    } catch (err) {
      toast.error('Gagal');
    }
  };

  // Report handler (superadmin)
  const handleResolveReport = async (reportId, response) => {
    try {
      await axios.put(`/reports/admin/${reportId}/resolve`, { adminResponse: response });
      toast.success('Laporan resolved');
      const res = await axios.get('/reports/admin/all');
      setReports(res.data);
    } catch (err) {
      toast.error('Gagal');
    }
  };

  // Payment method handler
  const handleAddPayment = async () => {
    const name = prompt('Nama metode (OVO/DANA/GOPAY/QRIS)');
    if (!name) return;
    try {
      await axios.post('/payments', { name });
      const res = await axios.get('/payments');
      setPayments(res.data);
      toast.success('Metode pembayaran ditambahkan');
    } catch (err) {
      toast.error('Gagal');
    }
  };

  const handleDeletePayment = async (id) => {
    if (!confirm('Hapus metode pembayaran?')) return;
    try {
      await axios.delete(`/payments/${id}`);
      setPayments(payments.filter(p => p._id !== id));
      toast.success('Dihapus');
    } catch (err) {
      toast.error('Gagal');
    }
  };

  // Redeem code handler
  const handleCreateRedeemCode = async () => {
    const code = prompt('Kode unik');
    const discount = parseInt(prompt('Diskon (Rp)')) || 0;
    const gift = prompt('Hadiah (jika giveaway)');
    const maxUses = parseInt(prompt('Maksimal penggunaan'));
    const daysValid = parseInt(prompt('Berapa hari berlaku?'));
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + daysValid);
    try {
      await axios.post('/redeem', { code, discount, gift, maxUses, expiresAt });
      toast.success('Kode redeem dibuat');
      const res = await axios.get('/redeem');
      setRedeemCodes(res.data);
    } catch (err) {
      toast.error('Gagal');
    }
  };

  // Giveaway handler
  const handleCreateGiveaway = async () => {
    const title = prompt('Judul giveaway');
    const prize = prompt('Hadiah');
    const winnersCount = parseInt(prompt('Jumlah pemenang'));
    const endDate = prompt('Tanggal berakhir (YYYY-MM-DD)');
    try {
      await axios.post('/giveaway', { title, prize, winnersCount, endDate });
      toast.success('Giveaway dibuat');
      const res = await axios.get('/giveaway');
      setGiveaways(res.data);
    } catch (err) {
      toast.error('Gagal');
    }
  };

  // Service handler
  const handleCreateService = async () => {
    const name = prompt('Nama jasa');
    const price = parseInt(prompt('Harga'));
    const description = prompt('Deskripsi');
    try {
      await axios.post('/services', { name, price, description });
      toast.success('Jasa admin ditambahkan');
      const res = await axios.get('/services');
      setServices(res.data);
    } catch (err) {
      toast.error('Gagal');
    }
  };

  const handleDeleteService = async (id) => {
    if (!confirm('Hapus jasa ini?')) return;
    try {
      await axios.delete(`/services/${id}`);
      setServices(services.filter(s => s._id !== id));
      toast.success('Dihapus');
    } catch (err) {
      toast.error('Gagal');
    }
  };

  if (!isAdmin) return <div className="text-center py-10">Akses ditolak. Hanya admin.</div>;
  if (loading) return <Loading />;

  // Chart data for sales
  const chartData = salesData ? {
    labels: salesData.map(item => `${item._id.month}/${item._id.year}`),
    datasets: [
      {
        label: 'Pendapatan (Rp)',
        data: salesData.map(item => item.total),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    ],
  } : null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-400">Panel Admin</h1>
      <div className="flex flex-wrap gap-2 border-b border-blue-500/30 pb-2">
        <button onClick={() => setActiveTab('products')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Produk</button>
        <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Pesanan</button>
        <button onClick={() => setActiveTab('offers')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'offers' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Penawaran</button>
        {isSuperAdmin && <button onClick={() => setActiveTab('reports')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'reports' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Laporan</button>}
        {isSuperAdmin && <button onClick={() => setActiveTab('payments')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Payment</button>}
        {isSuperAdmin && <button onClick={() => setActiveTab('redeem')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'redeem' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Kode Redeem</button>}
        {isSuperAdmin && <button onClick={() => setActiveTab('giveaways')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'giveaways' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Giveaway</button>}
        {isSuperAdmin && <button onClick={() => setActiveTab('services')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'services' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Jasa Admin</button>}
        {isSuperAdmin && <button onClick={() => setActiveTab('stats')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'stats' ? 'bg-blue-600 text-white' : 'bg-black/50 hover:bg-blue-500/20'}`}>Statistik</button>}
      </div>

      <div className="glass p-4 rounded-xl">
        {/* Products Tab */}
        {activeTab === 'products' && (
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manajemen Produk</h2>
              <button onClick={handleCreateProduct} className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500">+ Tambah Produk</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="border-b border-blue-500/30">
                  <tr><th>Nama</th><th>Harga</th><th>Stok</th><th>Game</th><th>Tipe</th><th>Aksi</th></tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="border-b border-gray-800">
                      <td className="py-2">{p.name}</td><td>Rp {p.price.toLocaleString()}</td><td>{p.stock}</td><td>{p.game}</td><td>{p.type}</td>
                      <td><button onClick={() => handleDeleteProduct(p._id)} className="text-red-400 hover:text-red-300">Hapus</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Pesanan Masuk</h2>
            <div className="space-y-3">
              {orders.map(order => (
                <div key={order._id} className="border border-blue-500/30 p-3 rounded-lg">
                  <p><strong>User:</strong> {order.user?.username}</p>
                  <p><strong>Produk:</strong> {order.product?.name}</p>
                  <p><strong>Total:</strong> Rp {order.totalPrice.toLocaleString()}</p>
                  <p><strong>Status:</strong> {order.status}</p>
                  {order.paymentProof && <img src={order.paymentProof} className="h-20 w-20 object-cover mt-2" />}
                  {order.status === 'paid' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleAcceptOrder(order._id)} className="bg-green-600 px-3 py-1 rounded">Terima</button>
                      <button onClick={() => handleRejectOrder(order._id)} className="bg-red-600 px-3 py-1 rounded">Tolak</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Penawaran dari Pengguna</h2>
            {offers.map(offer => (
              <div key={offer._id} className="border border-blue-500/30 p-3 rounded-lg mb-2">
                <p><strong>User:</strong> {offer.user?.username}</p>
                <p><strong>Item:</strong> {offer.itemName}</p>
                <p><strong>Game:</strong> {offer.game}</p>
                <p><strong>Deskripsi:</strong> {offer.description}</p>
                {offer.imageUrl && <img src={offer.imageUrl} className="h-20 w-20 object-cover" />}
                <div className="flex gap-2 mt-2">
                  {offer.status === 'pending' && (
                    <>
                      <button onClick={() => handleAcceptOffer(offer._id)} className="bg-green-600 px-3 py-1 rounded">Terima & Chat</button>
                      <button onClick={() => handleRejectOffer(offer._id)} className="bg-red-600 px-3 py-1 rounded">Tolak</button>
                    </>
                  )}
                  <span className="text-sm text-gray-400">Status: {offer.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reports Tab (Superadmin) */}
        {activeTab === 'reports' && isSuperAdmin && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Laporan Pengguna</h2>
            {reports.map(report => (
              <div key={report._id} className="border border-blue-500/30 p-3 rounded-lg mb-2">
                <p><strong>Pelapor:</strong> {report.user?.username}</p>
                <p><strong>Kendala:</strong> {report.issue}</p>
                <p><strong>Produk:</strong> {report.productName}</p>
                {report.proofImage && <img src={report.proofImage} className="h-20 w-20 object-cover" />}
                {report.status === 'pending' ? (
                  <button onClick={() => { const resp = prompt('Balasan admin:'); if (resp) handleResolveReport(report._id, resp); }} className="bg-blue-600 px-3 py-1 rounded mt-2">Resolve & Balas</button>
                ) : <p className="text-green-400 mt-2">Resolved: {report.adminResponse}</p>}
              </div>
            ))}
          </div>
        )}

        {/* Payments Tab */}
        {activeTab === 'payments' && isSuperAdmin && (
          <div>
            <div className="flex justify-between mb-4"><h2 className="text-xl font-semibold">Metode Pembayaran</h2><button onClick={handleAddPayment} className="bg-green-600 px-3 py-1 rounded">+ Tambah</button></div>
            <div className="flex flex-wrap gap-3">
              {payments.map(p => (
                <div key={p._id} className="border p-2 rounded-lg flex items-center gap-2"><span>{p.name}</span> {p.qrisImage && <img src={p.qrisImage} className="h-10 w-10" />} <button onClick={() => handleDeletePayment(p._id)} className="text-red-400">Hapus</button></div>
              ))}
            </div>
          </div>
        )}

        {/* Redeem Codes Tab */}
        {activeTab === 'redeem' && isSuperAdmin && (
          <div>
            <div className="flex justify-between mb-4"><h2 className="text-xl font-semibold">Kode Redeem</h2><button onClick={handleCreateRedeemCode} className="bg-green-600 px-3 py-1 rounded">+ Buat Kode</button></div>
            <table className="w-full text-left">
              <thead><tr><th>Kode</th><th>Diskon</th><th>Hadiah</th><th>Max Pakai</th><th>Terpakai</th><th>Expired</th></tr></thead>
              <tbody>
                {redeemCodes.map(r => (
                  <tr key={r._id}><td>{r.code}</td><td>Rp {r.discount}</td><td>{r.gift || '-'}</td><td>{r.maxUses}</td><td>{r.usedCount}</td><td>{new Date(r.expiresAt).toLocaleDateString()}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Giveaways Tab */}
        {activeTab === 'giveaways' && isSuperAdmin && (
          <div>
            <div className="flex justify-between mb-4"><h2 className="text-xl font-semibold">Giveaway</h2><button onClick={handleCreateGiveaway} className="bg-green-600 px-3 py-1 rounded">+ Buat Giveaway</button></div>
            {giveaways.map(g => (
              <div key={g._id} className="border p-3 rounded-lg mb-2"><strong>{g.title}</strong> - Hadiah: {g.prize} - Pemenang: {g.winnersCount} - Berakhir: {new Date(g.endDate).toLocaleDateString()}</div>
            ))}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && isSuperAdmin && (
          <div>
            <div className="flex justify-between mb-4"><h2 className="text-xl font-semibold">Jasa Admin</h2><button onClick={handleCreateService} className="bg-green-600 px-3 py-1 rounded">+ Tambah Jasa</button></div>
            {services.map(s => (
              <div key={s._id} className="border p-3 rounded-lg flex justify-between items-center"><div><strong>{s.name}</strong> - Rp {s.price.toLocaleString()} - {s.description}</div><button onClick={() => handleDeleteService(s._id)} className="text-red-400">Hapus</button></div>
            ))}
          </div>
        )}

        {/* Stats Tab */}
        {activeTab === 'stats' && isSuperAdmin && stats && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Dashboard Penjualan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="glass p-4 rounded-xl text-center"><p className="text-gray-400">Total Pendapatan</p><p className="text-2xl font-bold text-green-400">Rp {stats.totalRevenue.toLocaleString()}</p></div>
              <div className="glass p-4 rounded-xl text-center"><p className="text-gray-400">Pesanan Diterima</p><p className="text-2xl font-bold text-blue-400">{stats.acceptedOrders}</p></div>
              <div className="glass p-4 rounded-xl text-center"><p className="text-gray-400">Kode Ditukar</p><p className="text-2xl font-bold text-purple-400">{stats.redeemedCodes}</p></div>
            </div>
            {chartData && <div className="h-80"><Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false }} /></div>}
            <button onClick={() => { if(confirm('Reset data bulanan?')) toast.success('Data direset (simulasi)'); }} className="mt-4 bg-red-600 px-4 py-2 rounded">Reset Data Bulanan</button>
          </div>
        )}
      </div>
    </div>
  );
            }
