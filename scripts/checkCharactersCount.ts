import dotenv from 'dotenv';
dotenv.config();

import { sequelize } from '../src/models';

async function main() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    const [results] = await sequelize.query('SELECT COUNT(*)::int as count FROM "Characters"');
    // results may be array of objects
    // @ts-ignore
    console.log('Characters count:', results[0]?.count ?? results);
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

main();
