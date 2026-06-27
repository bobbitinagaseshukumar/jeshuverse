import express from 'express';
import { Op } from 'sequelize';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Product, Category, Review } from '../models/index.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Configure Multer Storage for local product image uploads
const storage = multer.diskStorage({
  destination(req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename(req, file, cb) {
    cb(
      null,
      `product-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`
    );
  }
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only JPG, JPEG, PNG, and WEBP image formats are allowed!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// @desc    Upload product images (up to 5)
// @route   POST /api/products/upload
// @access  Private/Admin
router.post('/upload', protect, admin, upload.array('images', 5), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No image files uploaded' });
    }

    // Build full URL so images work on all devices (phone, laptop, etc.)
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const host = req.headers['x-forwarded-host'] || req.get('host');
    const baseUrl = `${protocol}://${host}`;

    const filePaths = req.files.map(file => `${baseUrl}/uploads/${file.filename}`);
    res.status(200).json({
      message: 'Images uploaded successfully',
      urls: filePaths
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'File upload failed' });
  }
});

// @desc    Get all products with filters & search
// @route   GET /api/products
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, size, priceMin, priceMax, search } = req.query;
    let query = {};

    // 1. Search filter
    if (search) {
      query.name = { [Op.iLike]: `%${search}%` };
    }

    // 2. Category slug / id filter
    if (category) {
      let categoryObj;
      const isUUID = category.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
      if (isUUID) {
        categoryObj = await Category.findByPk(category);
      } else {
        categoryObj = await Category.findOne({ where: { slug: category } });
      }

      if (categoryObj) {
        query.categoryId = categoryObj.id;
      } else {
        return res.json([]);
      }
    }

    // 3. Size filter
    if (size) {
      // In Postgres JSONB containment:
      query.sizes = { [Op.contains]: [size] };
    }

    // 4. Price range filter
    if (priceMin || priceMax) {
      query.price = {};
      if (priceMin) query.price[Op.gte] = Number(priceMin);
      if (priceMax) query.price[Op.lte] = Number(priceMax);
    }

    const products = await Product.findAll({
      where: query,
      include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }],
      order: [['createdAt', 'DESC']],
    });

    const responseData = products.map((prod) => {
      const p = prod.toJSON();
      p._id = p.id;
      if (p.category) {
        p.category._id = p.category.id;
        p.category = p.category.name; // Keep frontend compatibility with category string value
      }
      return p;
    });

    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
router.get('/slug/:slug', async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { slug: req.params.slug },
      include: [
        { model: Category, as: 'category', attributes: ['name', 'slug'] },
        { model: Review, as: 'reviews' },
      ],
    });

    if (product) {
      const p = product.toJSON();
      p._id = p.id;
      if (p.category) {
        p.category._id = p.category.id;
      }
      if (p.reviews) {
        p.reviews = p.reviews.map((r) => {
          r._id = r.id;
          return r;
        });
      }
      res.json(p);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id, {
      include: [
        { model: Category, as: 'category', attributes: ['name', 'slug'] },
        { model: Review, as: 'reviews' },
      ],
    });

    if (product) {
      const p = product.toJSON();
      p._id = p.id;
      if (p.category) {
        p.category._id = p.category.id;
      }
      if (p.reviews) {
        p.reviews = p.reviews.map((r) => {
          r._id = r.id;
          return r;
        });
      }
      res.json(p);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, category, price, images, sizes, stock, stockQuantity, description } = req.body;

  try {
    let categoryId = category;
    const isUUID = category.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
    if (!isUUID) {
      // Try to find existing category by name, or auto-create it
      let categoryObj = await Category.findOne({ where: { name: category } });
      if (!categoryObj) {
        const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        categoryObj = await Category.create({
          name: category,
          slug,
          image: '/placeholder-category.png',
        });
      }
      categoryId = categoryObj.id;
    }

    const product = await Product.create({
      name,
      categoryId,
      price: Number(price),
      images,
      sizes,
      stock: Number(stock || stockQuantity || 0),
      description,
    });

    const val = product.toJSON();
    val._id = val.id;
    res.status(201).json(val);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { name, category, price, images, sizes, stock, description } = req.body;

  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      if (category) {
        let categoryId = category;
        const isUUID = category.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
        if (!isUUID) {
          let categoryObj = await Category.findOne({ where: { name: category } });
          if (!categoryObj) {
            const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
            categoryObj = await Category.create({
              name: category,
              slug,
              image: '/placeholder-category.png',
            });
          }
          categoryId = categoryObj.id;
        }
        product.categoryId = categoryId;
      }

      product.name = name || product.name;
      product.price = price !== undefined ? Number(price) : product.price;
      product.images = images || product.images;
      product.sizes = sizes || product.sizes;
      product.stock = stock !== undefined ? Number(stock) : product.stock;
      product.description = description || product.description;

      await product.save();
      
      const val = product.toJSON();
      val._id = val.id;
      res.json(val);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      await product.destroy();
      res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new product review
// @route   POST /api/products/:id/reviews
// @access  Private
router.post('/:id/reviews', protect, async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const product = await Product.findByPk(req.params.id);

    if (product) {
      const alreadyReviewed = await Review.findOne({
        where: {
          productId: product.id,
          userId: req.user.id,
        },
      });

      if (alreadyReviewed) {
        return res.status(400).json({ message: 'Product already reviewed' });
      }

      await Review.create({
        name: req.user.name,
        rating: Number(rating),
        comment,
        productId: product.id,
        userId: req.user.id,
      });

      // Recalculate average ratings
      const allReviews = await Review.findAll({
        where: { productId: product.id },
      });

      product.numReviews = allReviews.length;
      product.rating =
        allReviews.reduce((acc, item) => item.rating + acc, 0) /
        allReviews.length;

      await product.save();
      res.status(201).json({ message: 'Review added' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
