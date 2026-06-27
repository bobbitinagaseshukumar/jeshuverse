import express from 'express';
import bcrypt from 'bcryptjs';
import { Product, Order, User, Settings } from '../models/index.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import { sequelize } from '../config/db.js';

const router = express.Router();

// @desc    Get dashboard metrics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
router.get('/dashboard', protect, admin, async (req, res) => {
  try {
    const totalProducts = await Product.count();
    const totalOrders = await Order.count();
    const totalCustomers = await User.count({ where: { isAdmin: false } });

    // Calculate total revenue from paid orders
    const paidOrders = await Order.findAll({ where: { isPaid: true } });
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

    // Get order status counts
    const statusCounts = await Order.findAll({
      attributes: ['orderStatus', [sequelize.fn('COUNT', sequelize.col('orderStatus')), 'count']],
      group: ['orderStatus'],
    });

    const statusObj = {
      Pending: 0,
      Confirmed: 0,
      Shipped: 0,
      Delivered: 0,
    };

    statusCounts.forEach(item => {
      const status = item.getDataValue('orderStatus');
      const count = parseInt(item.getDataValue('count'), 10);
      if (statusObj[status] !== undefined) {
        statusObj[status] = count;
      }
    });

    // Recent 5 orders with user info
    const orders = await Order.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name', 'mobile', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: 5,
    });

    // Format orders for frontend compatibility
    const recentOrders = orders.map(ord => ({
      _id: ord.id,
      orderId: ord.id.substring(0, 8).toUpperCase(),
      user: {
        name: ord.user?.name || 'Guest',
        phone: ord.user?.mobile || '',
      },
      totalAmount: ord.totalPrice,
      paymentStatus: ord.isPaid ? 'Paid' : 'Pending',
      orderStatus: ord.orderStatus,
    }));

    res.status(200).json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue,
      statusBreakdown: statusObj,
      recentOrders,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching admin dashboard statistics' });
  }
});

// @desc    Get store configurations
// @route   GET /api/admin/settings
// @access  Private/Admin
router.get('/settings', protect, admin, async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching store configuration' });
  }
});

// @desc    Update store settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
router.put('/settings', protect, admin, async (req, res) => {
  const {
    whatsappNumber,
    upiId,
    merchantName,
    shippingCharges,
    adminUsername,
    adminPassword,
  } = req.body;

  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    settings.whatsappNumber = whatsappNumber || settings.whatsappNumber;
    settings.upiId = upiId || settings.upiId;
    settings.merchantName = merchantName || settings.merchantName;
    settings.shippingCharges = shippingCharges !== undefined ? shippingCharges : settings.shippingCharges;
    settings.adminUsername = adminUsername || settings.adminUsername;

    await settings.save();

    // If password update is requested, update current logged-in user
    if (adminPassword && adminPassword !== '') {
      const user = await User.findByPk(req.user.id);
      if (user) {
        user.password = adminPassword;
        await user.save();
      }
    }

    res.status(200).json({
      message: 'Store settings updated successfully',
      settings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating store configurations' });
  }
});

// @desc    Promote user to admin role by mobile number
// @route   PUT /api/admin/promote
// @access  Private/Admin
router.put('/promote', protect, admin, async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  try {
    const userToPromote = await User.findOne({ where: { mobile: phone } });
    if (!userToPromote) {
      return res.status(404).json({ message: `User with phone ${phone} not found. They must sign up first.` });
    }

    userToPromote.isAdmin = true;
    await userToPromote.save();

    res.status(200).json({
      message: `User ${userToPromote.name || userToPromote.mobile} successfully promoted to Admin role.`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error promoting user' });
  }
});

export default router;
