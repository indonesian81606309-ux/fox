import express from 'express';
import Service from '../models/Service.js';
import { protect, adminOnly, superAdminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const services = await Service.find();
  res.json(services);
});

router.post('/', protect, superAdminOnly, async (req, res) => {
  const { name, price, description } = req.body;
  const service = await Service.create({ name, price, description, createdBy: req.user._id });
  res.json(service);
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  await Service.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
