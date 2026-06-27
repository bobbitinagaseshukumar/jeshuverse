import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Settings = sequelize.define('Settings', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  whatsappNumber: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: '+919999999999',
  },
  upiId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'merchant@upi',
  },
  merchantName: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'JeshuVerse Store',
  },
  shippingCharges: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 50,
  },
  adminUsername: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'admin',
  },
});

export default Settings;
