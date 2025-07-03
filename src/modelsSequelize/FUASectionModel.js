const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';

// Base Entity Inheritance
const BaseEntity = require('./BaseEntityModel');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

const FUASectionModel = sequelize.define(
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
        
        titleHeight: {
            type: DataTypes.FLOAT,       
            allowNull: false
        },
        bodyHeight: {   // If its null, it will wrap its elements
            type: DataTypes.FLOAT,       
            allowNull: false      
        },
        bodyWidth: {   // If its null, it will use all 
            type: DataTypes.FLOAT,       
            allowNull: false      
        },
        top: {   // In mm
            type: DataTypes.FLOAT,       
            allowNull: false      
        },
        left: {   // In mm
            type: DataTypes.FLOAT,       
            allowNull: false      
        },
        extraStyles: {
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt
    },
);


export default FUASectionModel;





