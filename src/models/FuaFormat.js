const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';
import { FUAPage } from './FUAPage';

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
        timestamps: true,           // updateAt timestamp field
    },
);

// Foreign Keys
FUAFormat.hasMany(FUAPage, {
    foreignKey: 'FUAFormatId',
});
FUAPage.belongsTo(FUAFormat);


