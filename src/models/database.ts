const { Sequelize } = require('sequelize');

export const sequelize = new Sequelize(
  {
    database: process.env.PERUHCE_GEN_DB_USER || 'fuagenerator',
    username: process.env.PERUHCE_FUA_GEN_DB || 'fuagenerator',
    password: process.env.PERUHCE_FUA_GEN_DB_PASSWORD || 'fuagenerator',
    host: 'localhost',
    port: '5433',
    dialect:'postgres',
  }
);
