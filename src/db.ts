import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import path from 'path';

require('dotenv').config({ path: ['.env.local', '.env'] });


// Initialize Sequelize with PostgreSQL and SSL configuration
const sequelize = new Sequelize(
  process.env.DB_NAME as string,      // Database name
  process.env.DB_USER as string,      // Username
  process.env.DB_PASS as string,      // Password
  {
    host: process.env.DB_HOST,        // Hostname
    port: Number(process.env.DB_PORT),// Port
    dialect: 'postgres',              // Database dialect
    logging: false,                   
    dialectOptions: {
      ssl: {
        require: true,                // Enforce SSL
        rejectUnauthorized: false,    // Accept self-signed certificates (useful for RDS)
      }
    }
  }
);

sequelize.authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
  })
  .catch((error: any) => {
    console.error('Unable to connect to the database:', error);
  });

export default sequelize;
