import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// Load env variables prior to Sequelize initialization
dotenv.config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // Essential for Neon PG connection
    },
  },
  logging: false, // Disable query logging in console for cleaner server outputs
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
