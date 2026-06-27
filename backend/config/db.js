import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load env variables prior to Sequelize initialization
dotenv.config();

const dbUrl = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/jeshuverse';
const sequelize = new Sequelize(dbUrl, {
  dialect: 'postgres',
  dialectOptions: process.env.DATABASE_URL ? {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  } : {},
  logging: false,
});

const connectDB = async (retries = 8, delay = 3000) => {
  for (let i = 0; i < retries; i++) {
    try {
      await sequelize.authenticate();
      console.log('PostgreSQL Connected via Sequelize successfully.');
      return;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error.message || error);
      if (i === retries - 1) {
        console.error('All database connection retries failed. Exiting...');
        process.exit(1);
      }
      console.log(`Waiting ${delay / 1000} seconds before next retry...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

export { sequelize, connectDB };
export default connectDB;
