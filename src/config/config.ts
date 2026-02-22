import dotenv from 'dotenv';
dotenv.config();

const config = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/rickmortydb',
    dialect: 'postgres'
  },
  test: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};

export default config;
