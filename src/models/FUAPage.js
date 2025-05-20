const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';
import { FUAFormat } from './FuaFormat';
import { FUASection } from './FUASection';

// Base Enity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

export const FUAPage = sequelize.define(
    "FUAPage",
    {
        //Extending BaseEntity
        ...BaseEntity.commonAttributes(),
        
        // Define FuaFormat atributes
        title: {
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
        pageNumber: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt
    },
);

// Foreign Keys
FUAPage.belongsTo(FUAFormat);
FUAPage.hasMany(FUASection);
FUAPage.hasOne(FUAPage,  {
    foreignKey: {
      name: 'nextPage',
    }
});


FUAPage.hasOne(FUAPage,  {
    foreignKey: {
      name: 'previousPage',
    }
});


