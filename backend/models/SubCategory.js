import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const SubCategory = sequelize.define('SubCategory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  hooks: {
    beforeValidate: (subCategory) => {
      if (subCategory.name && !subCategory.slug) {
        subCategory.slug = subCategory.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
    },
  },
});

export default SubCategory;
