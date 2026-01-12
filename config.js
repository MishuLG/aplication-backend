import { config } from 'dotenv';
config();

export const PORT = process.env.PORT || 4000;
export const DB_USER = process.env.DB_USER || 'lendy';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PASSWORD = process.env.DB_PASSWORD || '16420953';
export const DB_DATABASE = process.env.DB_DATABASE || 'db_sistema';
export const DB_PORT = process.env.DB_PORT || 5432;


export const SECRET_KEY = process.env.SECRET_KEY || '16420953A';