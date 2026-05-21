import express from 'express';
import Giveaway from '../models/Giveaway.js';
import { protect, superAdminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const giveaways = await Giveaway.find({ endDate: { $gt: new Date() } });
  res.json(giveaways);
});

router.post('/', protect, superAdminOnly, upload.single('image'), async (req, res) => {
  const { title, description, prize, winnersCount, game, productType, price, endDate } = req.body;
  const giveaway = await Giveaway.create({
    title,
    description,
    imageUrl: req.file?.path,
    prize,
    winnersCount,
    game,
    productType,
    price,
    endDate,
    createdBy: req.user._id,
  });
  res.status(201).json(giveaway);
});

router.post('/:id/join', protect, async (req, res) => {
  const giveaway = await Giveaway.findById(req.params.id);
  if (!giveaway || giveaway.endDate < new Date()) return res.status(400).json({ message: 'Giveaway ended' });
  if (giveaway.participants.includes(req.user._id)) return res.status(400).json({ message: 'Already joined' });
  giveaway.participants.push(req.user._id);
  await giveaway.save();
  res.json(giveaway);
});

export default router;
