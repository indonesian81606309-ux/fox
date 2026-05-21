import express from 'express';
import PaymentMethod from '../models/PaymentMethod.js';
import { protect, superAdminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const methods = await PaymentMethod.find({ isActive: true });
  res.json(methods);
});

router.post('/', protect, superAdminOnly, upload.single('qrisImage'), async (req, res) => {
  const { name } = req.body;
  const method = await PaymentMethod.create({ name, qrisImage: req.file?.path });
  res.json(method);
});

router.delete('/:id', protect, superAdminOnly, async (req, res) => {
  await PaymentMethod.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
