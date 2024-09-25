import sequelize from './db';
import Category from './models/Category';

export const fetchData = async () => {
  await sequelize.sync();

  const categories = await Category.findAll();

  const data = categories.reduce((acc, category) => {
    acc[category.name] = category.content;
    return acc;
  }, {} as { priorityItems: JSON, actionItems: JSON, noteItems: JSON });

  return data;
};
