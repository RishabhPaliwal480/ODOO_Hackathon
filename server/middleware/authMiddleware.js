const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { publicUser } = require('../utils/formatters');

const signToken = (user) =>
  jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'development-only-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'development-only-secret');
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid session' });
    }

    req.user = publicUser(user);
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session' });
  }
};

const requireAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required' });
  }
  return next();
};

module.exports = { protect, requireAdmin, signToken };
