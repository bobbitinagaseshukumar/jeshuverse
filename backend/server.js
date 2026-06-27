import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { connectDB, sequelize } from './config/db.js';

// Route Imports
import authRoutes from './routes/authRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import productRoutes from './routes/productRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';

// Model Imports (for seeding)
import { Category, Product, Review, User } from './models/index.js';

// Load Env
dotenv.config();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());

// Seeding Default Data
const seedDefaultData = async () => {
  try {
    const categoryCount = await Category.count();
    if (categoryCount === 0) {
      console.log('No categories found. Seeding default categories in PostgreSQL...');
      
      const categories = [
        {
          name: 'Women',
          slug: 'women',
          image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600'
        },
        {
          name: 'Men',
          slug: 'men',
          image: 'https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?q=80&w=600'
        },
        {
          name: 'Kids',
          slug: 'kids',
          image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600'
        },
        {
          name: 'Jewellery',
          slug: 'jewellery',
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=600'
        }
      ];

      const createdCategories = await Category.bulkCreate(categories);
      console.log('Categories seeded successfully.');

      const productCount = await Product.count();
      if (productCount === 0) {
        console.log('No products found. Seeding default products in PostgreSQL...');
        
        const womenCat = createdCategories.find(c => c.slug === 'women');
        const menCat = createdCategories.find(c => c.slug === 'men');
        const kidsCat = createdCategories.find(c => c.slug === 'kids');
        const jewellCat = createdCategories.find(c => c.slug === 'jewellery');

        const products = [
          {
            name: "Women's Floral Kurti",
            slug: 'womens-floral-kurti',
            categoryId: womenCat.id,
            price: 899,
            images: [
              'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600',
              'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'
            ],
            sizes: ['S', 'M', 'L', 'XL'],
            stock: 15,
            description: 'Premium cotton floral printed kurti. Elegant design with breathable summer fabric. Crafted for casual comfort and stylish outings.',
            rating: 4.5,
            numReviews: 2
          },
          {
            name: "Men's Casual Linen Shirt",
            slug: 'mens-casual-linen-shirt',
            categoryId: menCat.id,
            price: 1299,
            images: [
              'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600',
              'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600'
            ],
            sizes: ['M', 'L', 'XL'],
            stock: 20,
            description: 'Premium linen blend casual shirt. Breathable weave with a modern structured fit. Double chest pockets and buttoned collars.',
            rating: 4.8,
            numReviews: 1
          },
          {
            name: "Kids Cotton Play Set",
            slug: 'kids-cotton-play-set',
            categoryId: kidsCat.id,
            price: 699,
            images: [
              'https://images.unsplash.com/photo-1519457431-44ccd64a579b?q=80&w=600'
            ],
            sizes: ['S', 'M', 'L'],
            stock: 10,
            description: 'Highly durable 100% combed cotton play set for active kids. Extremely soft on skin, hypoallergenic, and includes shorts and tee.',
            rating: 4.2,
            numReviews: 1
          },
          {
            name: "Gold Plated Ring Set",
            slug: 'gold-plated-ring-set',
            categoryId: jewellCat.id,
            price: 2499,
            images: [
              'https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=600',
              'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'
            ],
            sizes: ['One Size'],
            stock: 8,
            description: 'Exquisite set of gold-plated rings embedded with fine zircon stones. Ideal for engagement anniversaries and premium styling.',
            rating: 4.9,
            numReviews: 1
          }
        ];

        const createdProducts = await Product.bulkCreate(products);
        console.log('Products seeded successfully.');

        // Seed reviews pointing to products
        const kurtiProd = createdProducts.find(p => p.slug === 'womens-floral-kurti');
        const shirtProd = createdProducts.find(p => p.slug === 'mens-casual-linen-shirt');
        const kidsProd = createdProducts.find(p => p.slug === 'kids-cotton-play-set');
        const ringProd = createdProducts.find(p => p.slug === 'gold-plated-ring-set');

        const reviews = [
          { name: 'Aditi Sharma', rating: 5, comment: 'Beautiful fabric and pattern. Fits perfectly!', productId: kurtiProd.id },
          { name: 'Priya Patel', rating: 4, comment: 'Very soft cotton, good for daily wear.', productId: kurtiProd.id },
          { name: 'Rohan Mehta', rating: 5, comment: 'Amazing fit and styling. Linen quality is premium.', productId: shirtProd.id },
          { name: 'Sneha Roy', rating: 4, comment: 'Nice and soft. My kid loved it.', productId: kidsProd.id },
          { name: 'Kavita Sen', rating: 5, comment: 'Absolutely gorgeous. Looks expensive!', productId: ringProd.id }
        ];

        await Review.bulkCreate(reviews);
        console.log('Product reviews seeded successfully.');
      }
    }

    // Seed Admin Accounts automatically
    const adminEmails = ['nagaseshukumarbobbiti@gmail.com', 'bobbitinagaseshukumar@gmail.com'];
    for (const email of adminEmails) {
      const adminExists = await User.findOne({ where: { email } });
      if (!adminExists) {
        console.log(`Seeding admin account: ${email}`);
        await User.create({
          name: email === 'nagaseshukumarbobbiti@gmail.com' ? 'Naga Seshu Kumar' : 'Seshu Kumar',
          email: email,
          password: 'seshu@2409',
          mobile: '+919999999999',
          address: 'JeshuVerse Head Office, Mumbai, India',
          isAdmin: true
        });
      }
    }
  } catch (error) {
    console.error('Error seeding initial categories/products/admins:', error.message);
  }
};

// Bind APIs
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('JeshuVerse E-Commerce API is running (PostgreSQL Mode)...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

// Connect DB, Sync models and start server
const startServer = async () => {
  try {
    // 1. Authenticate Database
    await connectDB();

    // 2. Synchronize Schemas (alters existing tables to match changes without drops)
    console.log('Synchronizing database schemas...');
    await sequelize.sync({ alter: true });
    console.log('Database schemas synchronized.');

    // 3. Seed starter data if empty
    await seedDefaultData();

    // 4. Start listening
    app.listen(PORT, () => {
      console.log(`Server running in development mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
