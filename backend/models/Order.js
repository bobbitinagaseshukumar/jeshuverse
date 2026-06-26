import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  shippingAddress: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Razorpay',
  },
  paymentResult: {
    type: DataTypes.JSONB, // Stores id (payment ID), orderId (Razorpay order ID), status, signature
    allowNull: true,
  },
  totalPrice: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    defaultValue: 0.0,
  },
  isPaid: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  orderStatus: {
    type: DataTypes.ENUM('Pending', 'Confirmed', 'Shipped', 'Delivered'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  deliveredAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

export default Order;
