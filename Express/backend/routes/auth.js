import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, fullName, password } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) return res.status(400).json({ message: 'Username already exists' });
  const user = await User.create({ username, fullName, password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
  res.status(201).json({ token, user: { id: user._id, username, fullName, role: user.role } });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, user: { id: user._id, username, fullName: user.fullName, role: user.role } });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

export default router;
