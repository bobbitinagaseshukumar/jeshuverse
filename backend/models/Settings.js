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
    defaultValue: '+919440593110',
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
  storeAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: 'Banumukkala, Nandyal',
  },
  womenCategoryPic: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=500&q=80",
  },
  menCategoryPic: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&w=500&q=80",
  },
  kidsCategoryPic: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&w=500&q=80",
  },
  jewelleryCategoryPic: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=500&q=80",
  },
  slide1Image: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1400&q=80",
  },
  slide2Image: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80",
  },
  slide3Image: {
    type: DataTypes.TEXT,
    allowNull: true,
    defaultValue: "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1400&q=80",
  },
  hasNewOrders: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

export default Settings;
