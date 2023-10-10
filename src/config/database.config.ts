import { registerAs } from '@nestjs/config';

export interface DatabaseConfig {
  database: string;
  host: string;
  port: number;
  username: string;
  password: string;
}

export default registerAs(
  'database',
  (): DatabaseConfig => ({
    database: process.env.DATABASE_NAME || 'todo',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || 'root'
  })
);
