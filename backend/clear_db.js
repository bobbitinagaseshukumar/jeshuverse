import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from './config/db.js';
import { Product, Category, Review, Order, OrderItem } from './models/index.js';

const clearDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database. Clearing all products...');
    
    // Delete items in dependency order
    await Review.destroy({ where: {} });
    await OrderItem.destroy({ where: {} });
    await Order.destroy({ where: {} });
    await Product.destroy({ where: {} });
    
    console.log('Successfully cleared all products, reviews, orders and order items from database.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
};

clearDatabase();
