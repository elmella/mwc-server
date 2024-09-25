// import { DataTypes, Model, Optional } from 'sequelize';
// import sequelize from '../db';

// export interface BlockAttributes {
//   id: string;
//   type: string;
//   textColor: string;
//   textAlignment: string;
//   priority?: string;
//   level?: number;
//   text?: string;
//   parentId?: string;
//   category: 'priorityItems' | 'actionItems' | 'noteItems';
//   props: JSON;
//   content: JSON;
// }

// interface BlockCreationAttributes extends Optional<BlockAttributes, 'id'> {}

// class Block extends Model<BlockAttributes, BlockCreationAttributes> implements BlockAttributes {
//   public id!: string;
//   public type!: string;
//   public textColor!: string;
//   public textAlignment!: string;
//   public priority?: string;
//   public level?: number;
//   public text?: string;
//   public parentId?: string;
//   public category!: 'priorityItems' | 'actionItems' | 'noteItems';
//   public props!: JSON;
//   public content!: JSON;
// }

// Block.init({
//     id: {
//       type: DataTypes.UUID,
//       primaryKey: true,
//       defaultValue: DataTypes.UUIDV4,
//     },
//     type: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     textColor: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     textAlignment: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//     priority: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     level: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     text: {
//       type: DataTypes.TEXT,
//       allowNull: true,
//     },
//     parentId: {
//         type: DataTypes.UUID,
//         allowNull: true,
//       },
//       category: {
//         type: DataTypes.STRING,
//         allowNull: true,
//       },
//       props: {
//         type: DataTypes.JSON,
//         allowNull: true,
//       },
//       content: {
//         type: DataTypes.JSON,
//         allowNull: true,
//       },
//     }, {
//       sequelize,
//       modelName: 'Block',
//     });

// Block.hasMany(Block, { as: 'children', foreignKey: 'parentId' });
// Block.belongsTo(Block, { as: 'parent', foreignKey: 'parentId' });

// export default Block;