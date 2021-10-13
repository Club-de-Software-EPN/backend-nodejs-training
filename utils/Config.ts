import dotenv from 'dotenv';
import { Dialect } from 'sequelize';

dotenv.config();

export default {
  db: {
    dialect: process.env.DB_DIALECT as Dialect,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  api: {
    port: process.env.API_PORT,
    secret: process.env.API_SECRET || '',
  },
};
