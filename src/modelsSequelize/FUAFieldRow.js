const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';

// Base Entity Inheritance
const BaseEntity = require('./BaseEntityModel');

/*
  FUA Field Row entity derived from the Base Entity for audit purpouses.
*/

const FUAFieldRow = sequelize.define(
    "FUAFieldRow",
    {
        // Extending BaseEntity
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
        valueType: {        // SHows what type of field is
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
        rowIndex: { // validate to always be greater than 0
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 0
            }
        }     
        
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt
    },
);

export default FUAFieldRow;


