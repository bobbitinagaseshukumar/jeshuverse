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

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL Connected via Sequelize.');
  } catch (error) {
    console.error(`Sequelize connection error: ${error.message}`);
    process.exit(1);
  }
};

export { sequelize, connectDB };
export default connectDB;
