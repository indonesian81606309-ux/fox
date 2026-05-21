import express from 'express';
import Product from '../models/Product.js';
import { protect, adminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const { game, type, search } = req.query;
  let filter = {};
  if (game) filter.game = game;
  if (type) filter.type = type;
  if (search) filter.name = { $regex: search, $options: 'i' };
  const products = await Product.find(filter).populate('createdBy', 'username');
  res.json(products);
});

router.get('/:id', async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

router.post('/', protect, adminOnly, async (req, res) => {
  const { name, description, price, stock, game, type, imageUrl } = req.body;
  const product = await Product.create({ name, description, price, stock, game, type, imageUrl, createdBy: req.user._id });
  res.status(201).json(product);
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'superadmin' && product.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Forbidden' });
  Object.assign(product, req.body);
  await product.save();
  res.json(product);
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Not found' });
  if (req.user.role !== 'superadmin' && product.createdBy.toString() !== req.user._id.toString())
    return res.status(403).json({ message: 'Forbidden' });
  await product.deleteOne();
  res.json({ message: 'Deleted' });
});

export default router;
