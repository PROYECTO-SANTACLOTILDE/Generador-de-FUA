const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';

// Base Entity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

const FUAField = sequelize.define(
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
            allowNull: false
        },
        labelPosition: {        // Up, Down, Left or Right
            type: DataTypes.STRING,
            allowNull: false
        },
        valueType: {        // Shows what type of field is
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
        bodyHeight: {   // In mm
            type: DataTypes.FLOAT,       
            allowNull: false      
        },
        bodyWidth: {   // In mm
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
        labelSize: {   // In mm
            type: DataTypes.FLOAT,       
            allowNull: false      
        }
        
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt
    },
);

export default FUAField;
