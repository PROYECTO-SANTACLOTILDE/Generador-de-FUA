const { DataTypes } = require('sequelize');
import { sequelize } from '../../../../modelsSequelize/database';

/*
  User entity is a 'primal' entity, so it doesnt derived from the Base Entity because its need for audit purpouses.
*/

const LogSequelize = sequelize.define(
  "logger_Log",
  // Atributes
  {
    // Id attributes 
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    // Atributes
    timeStamp: {
      type: DataTypes.DATE,
      allowNull: false
    },
    logLevel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    securityLevel: {
      type: DataTypes.STRING,
      allowNull: false
    },
    logType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true
    },
    content: {
      type: DataTypes.STRING,
      allowNull: true
    },
  },
  {
    // Other model options go here
    sequelize,          // We need to pass the connection instance
    timestamps: false,           
  },
);

export default LogSequelize;

