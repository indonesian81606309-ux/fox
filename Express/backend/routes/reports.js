import express from 'express';
import Report from '../models/Report.js';
import { protect, superAdminOnly } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';
const router = express.Router();

router.post('/', protect, upload.single('proof'), async (req, res) => {
  const { issue, productName } = req.body;
  const report = await Report.create({
    user: req.user._id,
    issue,
    proofImage: req.file?.path,
    productName,
  });
  res.status(201).json(report);
});

router.get('/admin/all', protect, superAdminOnly, async (req, res) => {
  const reports = await Report.find().populate('user');
  res.json(reports);
});

router.put('/admin/:id/resolve', protect, superAdminOnly, async (req, res) => {
  const { adminResponse } = req.body;
  const report = await Report.findById(req.params.id);
  if (!report) return res.status(404).json({ message: 'Not found' });
  report.status = 'resolved';
  report.adminResponse = adminResponse;
  await report.save();
  res.json(report);
});

export default router;
