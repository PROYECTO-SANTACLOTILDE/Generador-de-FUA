const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';

// Base Enity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

export const FUAFormat = sequelize.define(
    "FUAFormat",
    {
        //Extending BaseEntity
        ...BaseEntity.commonAttributes(),
        
        // Define FuaFormat atributes
        body: {
            type: DataTypes.TEXT,
        },
        version: {
            type: DataTypes.STRING
        }
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // updateAt tinmestamp field
    },
);
