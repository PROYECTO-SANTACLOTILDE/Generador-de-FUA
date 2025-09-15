import { sequelize } from './database';
const {  DataTypes, Model } = require('sequelize');


// Base Entity Inheritance
const BaseEntityModel = require('./BaseEntityModel');

/*
  Base Entity entity that holds atributes for audit purpouses.
*/

const BaseEntityVersionModel = sequelize.define(
  "BaseEntityVersion",
  {
    ...BaseEntityModel.commonAttributes(),

    // Base Entity attributes 
    uuidObject: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    nameObject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,          // We need to pass the connection instance,
    timestamps: true,   // Adds createdAt/updatedAt
  },
);

export default BaseEntityVersionModel;


