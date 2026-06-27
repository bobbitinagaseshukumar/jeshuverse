import express from 'express';
import { SubCategory, Category } from '../models/index.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET /api/subcategories — get all subcategories, optionally filter by ?categoryId=
router.get('/', async (req, res) => {
  try {
    const where = {};
    if (req.query.categoryId) {
      where.categoryId = req.query.categoryId;
    }
    const subCategories = await SubCategory.findAll({
      where,
      include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }],
      order: [['name', 'ASC']],
    });
    const responseData = subCategories.map((sc) => {
      const val = sc.toJSON();
      val._id = val.id;
      return val;
    });
    res.json(responseData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/subcategories — create subcategory
router.post('/', protect, admin, async (req, res) => {
  const { name, categoryId } = req.body;
  try {
    if (!name || !categoryId) {
      return res.status(400).json({ message: 'Name and categoryId are required' });
    }
    const category = await Category.findByPk(categoryId);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const subCategory = await SubCategory.create({ name, slug, categoryId });
    const val = subCategory.toJSON();
    val._id = val.id;
    res.status(201).json(val);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/subcategories/:id — update subcategory
router.put('/:id', protect, admin, async (req, res) => {
  const { name } = req.body;
  try {
    const subCategory = await SubCategory.findByPk(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }
    subCategory.name = name || subCategory.name;
    if (name) {
      subCategory.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    await subCategory.save();
    const val = subCategory.toJSON();
    val._id = val.id;
    res.json(val);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/subcategories/:id — delete subcategory
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const subCategory = await SubCategory.findByPk(req.params.id);
    if (!subCategory) {
      return res.status(404).json({ message: 'SubCategory not found' });
    }
    await subCategory.destroy();
    res.json({ message: 'SubCategory removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
