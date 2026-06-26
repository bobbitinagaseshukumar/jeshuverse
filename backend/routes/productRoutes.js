import express from 'express';
import { Op } from 'sequelize';
import { Product, Category, Review } from '../models/index.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

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
        return res.json({ products: [] });
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
      }
      return p;
    });

    res.json({ products: responseData });
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
  const { name, category, price, images, sizes, stock, description } = req.body;

  try {
    let categoryId = category;
    const isUUID = category.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/);
    if (!isUUID) {
      const categoryObj = await Category.findOne({ where: { name: category } });
      if (categoryObj) {
        categoryId = categoryObj.id;
      } else {
        return res.status(400).json({ message: 'Invalid or non-existent category' });
      }
    }

    const product = await Product.create({
      name,
      categoryId,
      price: Number(price),
      images,
      sizes,
      stock: Number(stock),
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
          const categoryObj = await Category.findOne({ where: { name: category } });
          if (categoryObj) {
            categoryId = categoryObj.id;
          } else {
            return res.status(400).json({ message: 'Invalid or non-existent category' });
          }
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
