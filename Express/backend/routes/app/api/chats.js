import express from 'express';
import Chat from '../models/Chat.js';
import { protect, adminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.get('/conversation/:userId', protect, async (req, res) => {
  const chats = await Chat.find({
    $or: [
      { sender: req.user._id, receiver: req.params.userId },
      { sender: req.params.userId, receiver: req.user._id },
    ],
  }).sort('createdAt');
  res.json(chats);
});

router.post('/send', protect, upload.single('file'), async (req, res) => {
  const { receiverId, message } = req.body;
  const chat = await Chat.create({
    sender: req.user._id,
    receiver: receiverId,
    message,
    fileUrl: req.file?.path,
    fileType: req.file?.mimetype?.startsWith('video') ? 'video' : 'image',
  });
  res.status(201).json(chat);
});

// Admin get all chats (for support)
router.get('/admin/conversations', protect, adminOnly, async (req, res) => {
  const chats = await Chat.find().populate('sender receiver').sort('-createdAt');
  res.json(chats);
});

export default router;
