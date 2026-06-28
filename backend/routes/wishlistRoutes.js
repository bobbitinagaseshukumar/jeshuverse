import express from 'express';
import { User, Product, Category } from '../models/index.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to get populated products matching user's wishlist IDs
const getPopulatedWishlistProducts = async (wishlistIds) => {
  if (!wishlistIds || !Array.isArray(wishlistIds) || wishlistIds.length === 0) {
    return [];
  }
  const products = await Product.findAll({
    where: {
      id: wishlistIds
    },
    include: [
      { model: Category, as: 'category', attributes: ['name', 'slug'] }
    ]
  });
  return products.map(prod => {
    const p = prod.toJSON();
    p._id = p.id;
    p.stockQuantity = p.stock;
    if (p.category) {
      p.category._id = p.category.id;
      p.category = p.category.name;
    }
    return p;
  });
};

// @desc    Get user wishlist products
// @route   GET /api/wishlist
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const products = await getPopulatedWishlistProducts(user.wishlist || []);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Toggle item in user wishlist
// @route   POST /api/wishlist/toggle
// @access  Private
router.post('/toggle', protect, async (req, res) => {
  const { productId } = req.body;
  if (!productId) {
    return res.status(400).json({ message: 'Product ID is required' });
  }

  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    let currentWishlist = user.wishlist || [];
    if (!Array.isArray(currentWishlist)) {
      currentWishlist = [];
    }

    const index = currentWishlist.indexOf(productId);
    if (index > -1) {
      // Remove product ID
      currentWishlist.splice(index, 1);
    } else {
      // Add product ID
      currentWishlist.push(productId);
    }

    // Assign back and save
    user.wishlist = currentWishlist;
    await user.save();

    const products = await getPopulatedWishlistProducts(user.wishlist);
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
