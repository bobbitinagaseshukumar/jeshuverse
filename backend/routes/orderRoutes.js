import express from 'express';
import { sequelize } from '../config/db.js';
import { Order, OrderItem, Product, User, Settings } from '../models/index.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
router.post('/', protect, async (req, res) => {
  const { orderItems, items, shippingAddress, totalPrice, paymentResult } = req.body;
  const targetItems = orderItems || items;

  if (!targetItems || targetItems.length === 0) {
    return res.status(400).json({ message: 'No order items' });
  }

  // Auto calculate total price on server if not supplied
  let calculatedTotal = totalPrice;
  if (calculatedTotal === undefined || calculatedTotal === null) {
    calculatedTotal = targetItems.reduce((acc, item) => acc + Number(item.price) * Number(item.qty || item.quantity || 1), 0);
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
      totalPrice: Number(calculatedTotal),
      paymentResult, // PhonePe / Razorpay details
      isPaid: paymentResult && paymentResult.id ? true : false,
      paidAt: paymentResult && paymentResult.id ? new Date() : null,
    }, { transaction: t });

    // Save order items and decrement product stocks
    for (const item of targetItems) {
      // Validate product id
      const productId = item.product || item._id || item.productId;
      const itemQty = Number(item.qty || item.quantity || 1);
      
      await OrderItem.create({
        orderId: order.id,
        productId,
        name: item.name,
        qty: itemQty,
        image: item.image,
        price: Number(item.price),
        size: item.size || 'N/A',
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

    // Trigger admin red notification dot
    const settings = await Settings.findOne();
    if (settings) {
      settings.hasNewOrders = true;
      await settings.save();
    }

    const result = order.toJSON();
    result._id = result.id;
    result.orderId = result.id;
    result.orderItems = targetItems;

    res.status(201).json(result);
  } catch (error) {
    // Rollback if any operations fail
    await t.rollback();
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a WhatsApp order inquiry entry in DB
// @route   POST /api/orders/whatsapp
// @access  Public
router.post('/whatsapp', async (req, res) => {
  const { productId, name, qty, image, price, size, color, shippingAddress, userPhone } = req.body;

  try {
    let matchedUser = null;
    if (userPhone) {
      matchedUser = await User.findOne({ where: { mobile: userPhone } });
    }

    const order = await Order.create({
      userId: matchedUser ? matchedUser.id : null,
      shippingAddress: shippingAddress || 'WhatsApp Checkout',
      totalPrice: Number(price) * Number(qty),
      isPaid: false,
      paymentResult: { id: 'whatsapp-' + Date.now(), status: 'WhatsApp Pending' },
      orderStatus: 'Processing',
    });

    await OrderItem.create({
      orderId: order.id,
      productId,
      name,
      qty: Number(qty),
      image,
      price: Number(price),
      size: size || 'N/A',
      color: color || 'N/A',
    });

    // Decrement product stock
    const product = await Product.findByPk(productId);
    if (product) {
      product.stock = Math.max(0, product.stock - Number(qty));
      await product.save();
    }

    // Trigger admin red notification dot
    const settings = await Settings.findOne();
    if (settings) {
      settings.hasNewOrders = true;
      await settings.save();
    }

    res.status(201).json({ success: true, orderId: order.id });
  } catch (error) {
    console.error('Error logging WhatsApp order:', error);
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
