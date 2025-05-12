const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';
import { FUAFieldColumn } from './FUAFieldColumn';
import { FUAFieldRow } from './FUAFieldRow';
import { FUAPage } from './FUAPage';

// Base Enity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

export const FUAField = sequelize.define(
    "FUAField",
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
        labelOrientation: {        // Vertical or Horizontal
            type: DataTypes.STRING,
        },
        labelPosition: {        // Up, Down, Left or Right
            type: DataTypes.STRING,
            allowNull: false
        },
        valueType: {        // SHows what type of field is
            type: DataTypes.STRING,
            allowNull: false
        },
        orientation: {     // Vertical or Horizontal   
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
FUAField.belongsTo(FUAPage,  {
    foreignKey: {
      name: 'PageOwner',
    }
});

FUAField.hasMany(FUAFieldColumn);







