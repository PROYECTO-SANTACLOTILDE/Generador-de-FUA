const { Sequelize } = require('sequelize');

export const sequelize = new Sequelize(
  {
    database: 'fuagenerator',
    username: 'fuagenerator',
    password: 'fuagenerator',
    host: 'localhost',
    port: '5433',
    dialect:'postgres',
  }
);

