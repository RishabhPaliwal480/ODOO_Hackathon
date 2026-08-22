const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
const { publicUser } = require('../utils/formatters');
const { signToken } = require('../middleware/authMiddleware');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    res.json({
      success: true,
      user: publicUser(user),
      token: signToken(user),
    });
  } catch (err) { next(err); }
};

const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        phone: phone || null,
      },
    });

    res.status(201).json({ success: true, user: publicUser(user), token: signToken(user) });
  } catch (err) { next(err); }
};

const me = (req, res) => {
  res.json({ success: true, user: req.user });
};

module.exports = { login, me, register };
