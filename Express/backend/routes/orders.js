import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import RedeemCode from '../models/RedeemCode.js';
import PaymentMethod from '../models/PaymentMethod.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

// Create order
router.post('/', protect, async (req, res) => {
  const { productId, quantity, paymentMethod, redeemCode } = req.body;
  const product = await Product.findById(productId);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  if (product.stock < quantity) return res.status(400).json({ message: 'Insufficient stock' });

  let discount = 0;
  let giftMessage = '';
  if (redeemCode) {
    const code = await RedeemCode.findOne({ code: redeemCode, expiresAt: { $gt: new Date() }, usedCount: { $lt: '$maxUses' } });
    if (code && code.usedCount < code.maxUses) {
      discount = code.discount;
      giftMessage = code.gift;
      code.usedCount += 1;
      await code.save();
    }
  }
  const tax = 5000;
  const total = (product.price * quantity) + tax - discount;
  const uniqueCode = Math.floor(100000 + Math.random() * 900000).toString();

  const order = await Order.create({
    user: req.user._id,
    product: productId,
    quantity,
    totalPrice: total,
    discount,
    tax,
    paymentMethod,
    uniqueCode,
    status: 'pending',
  });

  // Optionally reduce stock now or after admin accept? According to spec: stok berkurang jika admin terima. So we do not reduce yet.
  res.status(201).json(order);
});

// Get my orders
router.get('/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('product');
  res.json(orders);
});

// Upload payment proof
router.post('/:id/proof', protect, upload.single('proof'), async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.user.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Forbidden' });
  order.paymentProof = req.file.path;
  order.status = 'paid';
  await order.save();
  res.json(order);
});

// Admin routes
router.get('/admin/all', protect, adminOnly, async (req, res) => {
  const orders = await Order.find().populate('user product');
  res.json(orders);
});

router.put('/admin/:id/accept', protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('product');
  if (!order) return res.status(404).json({ message: 'Not found' });
  const product = order.product;
  if (product.stock < order.quantity) return res.status(400).json({ message: 'Out of stock' });
  product.stock -= order.quantity;
  await product.save();
  order.status = 'accepted';
  await order.save();
  res.json(order);
});

router.put('/admin/:id/reject', protect, adminOnly, async (req, res) => {
  const order = await Order.findById(req.params.id);
  order.status = 'rejected';
  await order.save();
  res.json(order);
});

export default router;
