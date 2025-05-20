const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';
import { FUAFieldRow } from './FUAFieldRow';

// Base Enity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

export const FUAFieldCell = sequelize.define(
    "FUAFieldCell",
    {
        //Extending BaseEntity
        ...BaseEntity.commonAttributes(),
        
        // Define FuaFormat atributes
        label: {
            type: DataTypes.STRING,
            allowNull: false
        },
        showLabel: {
            type: DataTypes.BOOLEAN,
            allowNull: false
        },
        valueType: {        // Shows what type of field is
            type: DataTypes.STRING,
            allowNull: false
        },
        codeName: {     
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
FUAFieldCell.belongsTo(FUAFieldRow);
