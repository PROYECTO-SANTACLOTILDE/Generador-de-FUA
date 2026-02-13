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
    uuidEntity: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false
    },
    versionCounter: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hash: {
      type: DataTypes.TEXT,
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


