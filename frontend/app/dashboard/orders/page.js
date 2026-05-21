'use client';
import { useEffect, useState } from 'react';
import axios from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const res = await axios.get('/orders/myorders');
    setOrders(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, []);

  const uploadProof = async (orderId, file) => {
    const formData = new FormData();
    formData.append('proof', file);
    try {
      await axios.post(`/orders/${orderId}/proof`, formData);
      toast.success('Bukti terupload, menunggu konfirmasi admin');
      fetchOrders();
    } catch (err) { toast.error('Gagal upload'); }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order._id} className="glass p-4 rounded-xl border border-blue-500/30">
            <p><strong>Produk:</strong> {order.product?.name}</p>
            <p><strong>Total:</strong> Rp {order.totalPrice.toLocaleString()}</p>
            <p><strong>Status:</strong> <span className={`${order.status === 'accepted' ? 'text-green-400' : order.status === 'rejected' ? 'text-red-400' : 'text-yellow-400'}`}>{order.status}</span></p>
            {order.status === 'paid' && <p>Menunggu konfirmasi admin</p>}
            {order.status === 'pending' && (
              <div className="mt-2">
                <input type="file" accept="image/*" onChange={(e) => uploadProof(order._id, e.target.files[0])} />
              </div>
            )}
            {order.paymentProof && <img src={order.paymentProof} className="w-32 h-32 object-cover mt-2" />}
          </div>
        ))}
      </div>
    </div>
  );
}
