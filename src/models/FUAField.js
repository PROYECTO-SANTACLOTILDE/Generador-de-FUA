const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';
import { FUAFieldCell } from './FUAFieldCell';
import { FUAFieldColumn } from './FUAFieldColumn';
import { FUASection } from './FUASection';

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
        height: {   // In mm
            type: DataTypes.FLOAT,       
            allowNull: false      
        },
        width: {   // In mm
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
