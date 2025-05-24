const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';
import { FUAPage } from './FUAPage';

// Base Entity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

const FUASection = sequelize.define(
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
            type: DataTypes.BOOLEAN,
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


export default FUASection;





