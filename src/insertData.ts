import sequelize from './db';
import Category from './models/Category';

export const insertData = async (data: { priorityItems?: JSON, actionItems?: JSON, noteItems?: JSON }) => {
  await sequelize.sync();

  for (const category of Object.keys(data) as ('priorityItems' | 'actionItems' | 'noteItems')[]) {
    const categoryContent = data[category] ?? [];

    // Find or create the category row
    const [existingCategory, created] = await Category.findOrCreate({
      where: { name: category },
      defaults: { name: category, content: categoryContent as JSON }
    });

    if (!created) {
      // If the category already exists, update its content
      await existingCategory.update({ content: categoryContent as JSON });
    }
  }

  console.log('Data inserted successfully');
};
