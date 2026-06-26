import express from 'express';
import { Category } from '../models/index.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']],
    });
    // Add _id for frontend compatibility
    const responseData = categories.map((cat) => {
      const val = cat.toJSON();
      val._id = val.id;
      return val;
    });
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get category by slug
// @route   GET /api/categories/:slug
// @access  Public
router.get('/:slug', async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
    });
    if (category) {
      const val = category.toJSON();
      val._id = val.id;
      res.json(val);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a category
// @route   POST /api/categories
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
  const { name, slug, image } = req.body;

  try {
    const generatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const categoryExists = await Category.findOne({
      where: { slug: generatedSlug },
    });

    if (categoryExists) {
      return res.status(400).json({ message: 'Category slug already exists' });
    }

    const category = await Category.create({
      name,
      slug: generatedSlug,
      image,
    });

    const val = category.toJSON();
    val._id = val.id;
    res.status(201).json(val);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a category
// @route   PUT /api/categories/:id
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
  const { name, slug, image } = req.body;

  try {
    const category = await Category.findByPk(req.params.id);

    if (category) {
      category.name = name || category.name;
      if (slug || name) {
        category.slug = slug || (name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : category.slug);
      }
      category.image = image || category.image;

      await category.save();
      const val = category.toJSON();
      val._id = val.id;
      res.json(val);
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (category) {
      await category.destroy();
      res.json({ message: 'Category removed' });
    } else {
      res.status(404).json({ message: 'Category not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
