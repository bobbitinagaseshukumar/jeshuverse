import express from 'express';
import { sequelize } from '../config/db.js';
import { Order, OrderItem, Product, User } from '../models/index.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, shippingAddress, totalPrice, paymentResult } = req.body;

  if (orderItems && orderItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Use a SQL Transaction to ensure atomicity
  const t = await sequelize.transaction();

  try {
    let finalAddress = shippingAddress;
    if (shippingAddress && typeof shippingAddress === 'object') {
      const { street, city, state, zipCode, country } = shippingAddress;
      const parts = [street, city, state, zipCode, country].filter(Boolean);
      finalAddress = parts.length > 0 ? parts.join(', ') : JSON.stringify(shippingAddress);
    }

    const order = await Order.create({
      userId: req.user.id,
      shippingAddress: typeof finalAddress === 'string' ? finalAddress : String(finalAddress || ''),
      totalPrice: Number(totalPrice),
      paymentResult, // Razorpay details
      isPaid: paymentResult && paymentResult.id ? true : false,
      paidAt: paymentResult && paymentResult.id ? new Date() : null,
    }, { transaction: t });

    // Save order items and decrement product stocks
    for (const item of orderItems) {
      // Validate product id
      const productId = item.product || item._id; // fallback
      
      await OrderItem.create({
        orderId: order.id,
        productId,
        name: item.name,
        qty: Number(item.qty),
        image: item.image,
        price: Number(item.price),
        size: item.size,
      }, { transaction: t });

      // Decrement stock
      const product = await Product.findByPk(productId, { transaction: t });
      if (product) {
        product.stock = Math.max(0, product.stock - Number(item.qty));
        await product.save({ transaction: t });
      }
    }

    // Commit Transaction
    await t.commit();

    const result = order.toJSON();
    result._id = result.id;
    result.orderItems = orderItems;

    res.status(201).json(result);
  } catch (error) {
    // Rollback if any operations fail
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
router.get('/myorders', protect, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'orderItems' }],
      order: [['createdAt', 'DESC']],
    });

    const responseData = orders.map((order) => {
      const o = order.toJSON();
      o._id = o.id;
      if (o.orderItems) {
        o.orderItems = o.orderItems.map((item) => {
          item._id = item.id;
          return item;
        });
      }
      return o;
    });

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'mobile'] },
        { model: OrderItem, as: 'orderItems' },
      ],
    });

    if (order) {
      // Check if user is admin or owner
      if (req.user.isAdmin || order.userId === req.user.id) {
        const o = order.toJSON();
        o._id = o.id;
        if (o.user) {
          o.user._id = o.user.id;
        }
        if (o.orderItems) {
          o.orderItems = o.orderItems.map((item) => {
            item._id = item.id;
            return item;
          });
        }
        res.json(o);
      } else {
        res.status(403).json({ message: 'Not authorized to view this order' });
      }
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
        { model: OrderItem, as: 'orderItems' },
      ],
      order: [['createdAt', 'DESC']],
    });

    const responseData = orders.map((order) => {
      const o = order.toJSON();
      o._id = o.id;
      if (o.user) {
        o.user._id = o.user.id;
      }
      if (o.orderItems) {
        o.orderItems = o.orderItems.map((item) => {
          item._id = item.id;
          return item;
        });
      }
      return o;
    });

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
router.put('/:id/status', protect, admin, async (req, res) => {
  const { orderStatus } = req.body;

  try {
    const order = await Order.findByPk(req.params.id);

    if (order) {
      order.orderStatus = orderStatus;
      if (orderStatus === 'Delivered') {
        order.deliveredAt = new Date();
      }

      await order.save();

      const o = order.toJSON();
      o._id = o.id;
      res.json(o);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
