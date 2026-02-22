require('dotenv').config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/rickmortydb',
    dialect: 'postgres'
  },
  test: {
    url: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/rickmortydb_test',
    dialect: 'postgres'
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres'
  }
};
