const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';
import { FUAPage } from './FUAPage';
import { FUAField } from './FUAField';

// Base Enity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

export const FUASection = sequelize.define(
    "FUASection",
    {
        //Extending BaseEntity
        ...BaseEntity.commonAttributes(),
        
        // Define FuaFormat atributes
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        showTitle: {
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
FUASection.belongsTo(FUAPage,  {
    foreignKey: {
      name: 'PageOwner',
    }
});

FUASection.hasMany(FUAField);



