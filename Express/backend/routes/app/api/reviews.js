import express from 'express';
import Review from '../models/Review.js';
import { protect } from '../middleware/auth.js';
const router = express.Router();

router.get('/', async (req, res) => {
  const reviews = await Review.find().populate('user', 'username fullName').sort('-createdAt');
  res.json(reviews);
});

router.post('/', protect, async (req, res) => {
  const { rating, comment } = req.body;
  const review = await Review.create({ user: req.user._id, rating, comment });
  res.status(201).json(review);
});

export default router;
