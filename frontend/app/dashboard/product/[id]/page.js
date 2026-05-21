'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState('');
  const [redeemCode, setRedeemCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    axios.get(`/products/${id}`).then(res => setProduct(res.data));
    axios.get('/payments').then(res => setPaymentMethods(res.data));
  }, [id]);

  const checkRedeem = async () => {
    if (!redeemCode) return;
    try {
      const res = await axios.post('/redeem/check', { code: redeemCode });
      setDiscount(res.data.discount);
      toast.success(`Diskon Rp ${res.data.discount}`);
    } catch (err) {
      toast.error('Kode tidak valid');
    }
  };

  const handleOrder = async () => {
    try {
      const res = await axios.post('/orders', {
        productId: id,
        quantity,
        paymentMethod: selectedPayment,
        redeemCode,
      });
      toast.success('Pesanan dibuat, silakan upload bukti bayar');
      router.push('/dashboard/orders');
    } catch (err) {
      toast.error(err.response?.data?.message);
    }
  };

  if (!product) return <Loading />;

  const tax = 5000;
  const subtotal = product.price * quantity;
  const total = subtotal + tax - discount;

  return (
    <div className="max-w-4xl mx-auto glass p-6 rounded-2xl">
      <div className="flex flex-col md:flex-row gap-6">
        <img src={product.imageUrl} className="w-full md:w-1/2 rounded-xl" />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-400 mt-2">{product.description}</p>
          <p className="text-2xl text-blue-400 mt-4">Rp {product.price.toLocaleString()}</p>
          <div className="mt-4">
            <label>Jumlah</label>
            <input type="number" min="1" max={product.stock} value={quantity} onChange={e=>setQuantity(parseInt(e.target.value))} className="w-24 p-2 bg-black/50 border border-blue-500 rounded ml-2" />
          </div>
          <div className="mt-4">
            <label>Metode Pembayaran</label>
            <select className="w-full p-2 bg-black/50 border border-blue-500 rounded" onChange={e=>setSelectedPayment(e.target.value)}>
              <option value="">Pilih</option>
              {paymentMethods.map(p => <option key={p._id} value={p.name}>{p.name}</option>)}
            </select>
          </div>
          <div className="mt-4">
            <label>Kode Redeem (opsional)</label>
            <div className="flex gap-2">
              <input type="text" value={redeemCode} onChange={e=>setRedeemCode(e.target.value)} className="flex-1 p-2 bg-black/50 border border-blue-500 rounded" />
              <button onClick={checkRedeem} className="bg-blue-600 px-4 rounded">Cek</button>
            </div>
          </div>
          <div className="mt-6 border-t border-blue-500/30 pt-4">
            <p>Subtotal: Rp {subtotal.toLocaleString()}</p>
            <p>Pajak: Rp {tax.toLocaleString()}</p>
            <p>Diskon: -Rp {discount.toLocaleString()}</p>
            <p className="text-xl font-bold">Total: Rp {total.toLocaleString()}</p>
          </div>
          <button onClick={handleOrder} className="mt-6 w-full bg-blue-600 py-3 rounded-lg hover:bg-blue-500">Buat Pesanan</button>
        </div>
      </div>
    </div>
  );
}
