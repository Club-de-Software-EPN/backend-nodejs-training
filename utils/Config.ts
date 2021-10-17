import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

dotenv.config();

type EnvVariables = {
  db: ConnectionOptions;
  api: {
    port: number;
    secret: string;
  }
}

const env: EnvVariables = {
  db: {
    type: process.env.DB_DIALECT as 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  api: {
    port: Number(process.env.API_PORT),
    secret: process.env.API_SECRET || '',
  },
};

export default env;
