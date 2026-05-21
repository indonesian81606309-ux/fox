import express from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import RedeemCode from '../models/RedeemCode.js';
import { protect, superAdminOnly } from '../middleware/auth.js';
const router = express.Router();

router.get('/stats', protect, superAdminOnly, async (req, res) => {
  const totalRevenue = await Order.aggregate([{ $match: { status: 'accepted' } }, { $group: { _id: null, total: { $sum: '$totalPrice' } } }]);
  const acceptedOrders = await Order.countDocuments({ status: 'accepted' });
  const totalProducts = await Product.countDocuments();
  const totalUsers = await User.countDocuments();
  const redeemedCodes = await RedeemCode.aggregate([{ $group: { _id: null, totalUsed: { $sum: '$usedCount' } } }]);
  res.json({
    totalRevenue: totalRevenue[0]?.total || 0,
    acceptedOrders,
    totalProducts,
    totalUsers,
    redeemedCodes: redeemedCodes[0]?.totalUsed || 0,
  });
});

router.get('/sales-chart', protect, superAdminOnly, async (req, res) => {
  const monthly = await Order.aggregate([
    { $match: { status: 'accepted' } },
    {
      $group: {
        _id: { month: { $month: '$createdAt' }, year: { $year: '$createdAt' } },
        total: { $sum: '$totalPrice' },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);
  res.json(monthly);
});

export default router;
