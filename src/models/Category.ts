import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../db';

// Define attributes for the Category
export interface CategoryAttributes {
  id: string;
  name: 'priorityItems' | 'actionItems' | 'noteItems';
  content: JSON; // Stores entire editor content
}

interface CategoryCreationAttributes extends Optional<CategoryAttributes, 'id'> {}

class Category extends Model<CategoryAttributes, CategoryCreationAttributes> implements CategoryAttributes {
  public id!: string;
  public name!: 'priorityItems' | 'actionItems' | 'noteItems';
  public content!: JSON;
}

Category.init({
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.ENUM('priorityItems', 'actionItems', 'noteItems'),
    allowNull: false,
  },
  content: {
    type: DataTypes.JSON,
    allowNull: false,
  },
}, {
  sequelize,
  modelName: 'Category',
});

export default Category;
