import dotenv from 'dotenv';
dotenv.config();
import { sequelize } from './config/db.js';
import { Review, Product } from './models/index.js';

const clearReviews = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to database. Clearing all reviews...');
    
    // Delete all reviews
    await Review.destroy({ where: {} });
    
    // Reset product review stats to 0 rating / 0 numReviews
    await Product.update({ rating: 0.0, numReviews: 0 }, { where: {} });
    
    console.log('Successfully cleared all reviews from database and reset product statistics.');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing reviews:', error);
    process.exit(1);
  }
};

clearReviews();
