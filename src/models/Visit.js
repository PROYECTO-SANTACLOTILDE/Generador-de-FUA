const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';

// Base Enity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

export const Visit = sequelize.define(
    "Visit",
    {
        //Extending BaseEntity
        ...BaseEntity.commonAttributes(),
        
        // Define FuaFormat atributes
        externalUUID: {
            type: DataTypes.STRING,
            allowNull: false
        },  
        version: {
            type: DataTypes.STRING,
            allowNull: false
        },        
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt
    },
);

// Foreign Keys




