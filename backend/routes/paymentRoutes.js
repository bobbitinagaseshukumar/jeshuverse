import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to initialize Razorpay instance if keys are available
// Fallback to dummy mock order creator if keys are placeholders to allow testing
const getRazorpayInstance = () => {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  if (!key_id || !key_secret || key_id.includes('placeholder')) {
    console.warn('Razorpay keys not fully configured. Using mock mode.');
    return null;
  }
  return new Razorpay({ key_id, key_secret });
};

// @desc    Create a Razorpay order
// @route   POST /api/payments/order
// @access  Private
router.post('/order', protect, async (req, res) => {
  const { amount } = req.body; // amount in rupees

  if (!amount) {
    return res.status(400).json({ message: 'Amount is required' });
  }

  try {
    const razorpay = getRazorpayInstance();

    if (!razorpay) {
      // Mock mode for local testing without valid credentials
      const mockOrderId = 'order_mock_' + Math.random().toString(36).substring(2, 15);
      return res.json({
        id: mockOrderId,
        currency: 'INR',
        amount: amount * 100,
        mock: true,
      });
    }

    const options = {
      amount: Math.round(amount * 100), // amount in paise
      currency: 'INR',
      receipt: `receipt_order_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      mock: false,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Verify Razorpay payment signature
// @route   POST /api/payments/verify
// @access  Private
router.post('/verify', protect, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, mock } = req.body;

  try {
    if (mock) {
      // Direct success for mock tests
      return res.json({ status: 'success', message: 'Mock payment verified successfully' });
    }

    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    // Standard Razorpay verification hash
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', key_secret)
      .update(body.toString())
      .digest('hex');

    if (expectedSignature === razorpay_signature) {
      res.json({ status: 'success', message: 'Payment verified successfully' });
    } else {
      res.status(400).json({ status: 'failure', message: 'Invalid payment signature' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
