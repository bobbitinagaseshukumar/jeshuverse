import User from './User.js';
import Product from './Product.js';
import Category from './Category.js';
import Review from './Review.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Settings from './Settings.js';
import SubCategory from './SubCategory.js';

// 1. Category <-> Product (1 to Many)
Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products',
  onDelete: 'RESTRICT',
});
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// 2. Product <-> Review (1 to Many)
Product.hasMany(Review, {
  foreignKey: 'productId',
  as: 'reviews',
  onDelete: 'CASCADE',
});
Review.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

// 3. User <-> Review (1 to Many)
User.hasMany(Review, {
  foreignKey: 'userId',
  as: 'reviews',
  onDelete: 'CASCADE',
});
Review.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// 4. User <-> Order (1 to Many)
User.hasMany(Order, {
  foreignKey: 'userId',
  as: 'orders',
  onDelete: 'RESTRICT',
});
Order.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

// 5. Order <-> OrderItem (1 to Many)
Order.hasMany(OrderItem, {
  foreignKey: 'orderId',
  as: 'orderItems',
  onDelete: 'CASCADE',
});
OrderItem.belongsTo(Order, {
  foreignKey: 'orderId',
  as: 'order',
});

// 6. Product <-> OrderItem (1 to Many)
Product.hasMany(OrderItem, {
  foreignKey: 'productId',
  as: 'orderItems',
  onDelete: 'RESTRICT',
});
OrderItem.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product',
});

// 7. Category <-> SubCategory (1 to Many)
Category.hasMany(SubCategory, {
  foreignKey: 'categoryId',
  as: 'subCategories',
  onDelete: 'CASCADE',
});
SubCategory.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// 8. SubCategory <-> Product (1 to Many)
SubCategory.hasMany(Product, {
  foreignKey: 'subCategoryId',
  as: 'products',
  onDelete: 'SET NULL',
});
Product.belongsTo(SubCategory, {
  foreignKey: 'subCategoryId',
  as: 'subCategory',
});

export {
  User,
  Product,
  Category,
  Review,
  Order,
  OrderItem,
  Settings,
  SubCategory,
};
