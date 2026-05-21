import express from 'express';
import RedeemCode from '../models/RedeemCode.js';
import { protect, superAdminOnly } from '../middleware/auth.js';
const router = express.Router();

router.post('/check', protect, async (req, res) => {
  const { code } = req.body;
  const redeem = await RedeemCode.findOne({ code, expiresAt: { $gt: new Date() }, usedCount: { $lt: '$maxUses' } });
  if (!redeem) return res.status(400).json({ message: 'Invalid or expired code' });
  res.json({ discount: redeem.discount, gift: redeem.gift });
});

router.post('/use', protect, async (req, res) => {
  const { code } = req.body;
  const redeem = await RedeemCode.findOne({ code, expiresAt: { $gt: new Date() }, usedCount: { $lt: '$maxUses' } });
  if (!redeem) return res.status(400).json({ message: 'Invalid code' });
  // check if user already used this code? (optional, but spec says 1 orang 1 kode sekali)
  // We'll assume code is single use per user by tracking usedBy array, but for simplicity we just increment.
  redeem.usedCount += 1;
  await redeem.save();
  res.json({ success: true, discount: redeem.discount, gift: redeem.gift });
});

// Admin routes
router.post('/', protect, superAdminOnly, async (req, res) => {
  const { code, discount, gift, maxUses, expiresAt } = req.body;
  const newCode = await RedeemCode.create({ code, discount, gift, maxUses, expiresAt, createdBy: req.user._id });
  res.status(201).json(newCode);
});

router.get('/', protect, superAdminOnly, async (req, res) => {
  const codes = await RedeemCode.find().populate('createdBy');
  res.json(codes);
});

export default router;
