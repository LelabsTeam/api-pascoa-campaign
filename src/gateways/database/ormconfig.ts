import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { EasterUser } from './model/EasterUser.model';
import { EasterCoupon } from './model/EasterCoupon.model';

dotenv.config({ path: process.env.ENVFILE || '.env.local' });

export const databaseConfig = (migrations = false) => {
  const dataBaseConfigProd = {
    entities: [EasterUser, EasterCoupon],
    type: process.env.DATABASE_TYPE,
    username: process.env.DATABASE_USERNAME,
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DB,
    synchronize: true,
    connectTimeoutMS: 5000,
    logging: false,
    migrations: migrations ? ['./src/database/migrations/*.{ts,js}'] : [],
  } as DataSourceOptions;

  const databaseDevConfig = {
    type: 'sqlite',
    database: `${__dirname}/database.sqlite`,
    entities: [EasterUser, EasterCoupon],
    synchronize: true,
    logging: false,
    migrations: migrations ? ['./src/database/migrations/*.{ts,js}'] : [],
  } as DataSourceOptions;

  return process.env.DATABASE_ENV === 'prd'
    ? dataBaseConfigProd : databaseDevConfig;
};

export default new DataSource(databaseConfig());
