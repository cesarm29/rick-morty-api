import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../src/models';
import { connect as connectRedis } from '../src/utils/redisClient';

async function test() {
  try {
    console.log('Testing Postgres connection...');
    await sequelize.authenticate();
    console.log('Postgres: OK');
  } catch (err) {
    console.error('Postgres connection failed:', err);
    process.exit(1);
  }

  try {
    console.log('Testing Redis connection...');
    await connectRedis();
    console.log('Redis: OK');
  } catch (err) {
    console.error('Redis connection failed:', err);
    process.exit(1);
  }

  console.log('All connections OK');
  process.exit(0);
}

test();
