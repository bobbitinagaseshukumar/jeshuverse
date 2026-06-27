import User from './User.js';
import Product from './Product.js';
import Category from './Category.js';
import Review from './Review.js';
import Order from './Order.js';
import OrderItem from './OrderItem.js';
import Settings from './Settings.js';

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

export {
  User,
  Product,
  Category,
  Review,
  Order,
  OrderItem,
  Settings,
};
