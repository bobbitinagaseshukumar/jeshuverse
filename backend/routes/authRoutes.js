import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
  const { name, email, password, mobile, address } = req.body;

  try {
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // By default, first user is admin to make setting up easy, otherwise standard user
    const isFirstUser = (await User.count()) === 0;

    const user = await User.create({
      name,
      email,
      password,
      mobile,
      address,
      isAdmin: isFirstUser, // Auto-admin for the very first registered user
    });

    if (user) {
      res.status(201).json({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.mobile = req.body.mobile || user.mobile;
      user.address = req.body.address || user.address;

      if (req.body.password) {
        user.password = req.body.password;
      }

      await user.save();

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        isAdmin: user.isAdmin,
        token: generateToken(user.id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all users (Admin only)
// @route   GET /api/auth/users
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Admin login
// @route   POST /api/auth/admin-login
// @access  Public
router.post('/admin-login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ where: { email: username } });

    if (user && user.isAdmin && (await user.matchPassword(password))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        address: user.address,
        isAdmin: user.isAdmin,
        role: 'admin',
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid admin credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
