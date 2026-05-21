import express from 'express';
import Offer from '../models/Offer.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.post('/', protect, upload.single('image'), async (req, res) => {
  const { itemName, game, description } = req.body;
  const offer = await Offer.create({
    user: req.user._id,
    itemName,
    game,
    description,
    imageUrl: req.file?.path,
  });
  res.status(201).json(offer);
});

router.get('/myoffers', protect, async (req, res) => {
  const offers = await Offer.find({ user: req.user._id });
  res.json(offers);
});

router.get('/admin/all', protect, adminOnly, async (req, res) => {
  const offers = await Offer.find().populate('user');
  res.json(offers);
});

router.put('/admin/:id/accept', protect, adminOnly, async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  offer.status = 'accepted';
  await offer.save();
  res.json(offer);
});

router.put('/admin/:id/reject', protect, adminOnly, async (req, res) => {
  const offer = await Offer.findById(req.params.id);
  offer.status = 'rejected';
  await offer.save();
  res.json(offer);
});

export default router;
