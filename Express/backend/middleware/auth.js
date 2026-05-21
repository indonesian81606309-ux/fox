import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }
  if (!token) res.status(401).json({ message: 'Not authorized, no token' });
};

export const adminOnly = (req, res, next) => {
  if (req.user.role === 'user') return res.status(403).json({ message: 'Admin only' });
  next();
};

export const superAdminOnly = (req, res, next) => {
  if (req.user.role !== 'superadmin') return res.status(403).json({ message: 'Super admin only' });
  next();
};
