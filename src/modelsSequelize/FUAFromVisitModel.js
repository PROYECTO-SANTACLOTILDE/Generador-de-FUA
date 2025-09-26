const { DataTypes} = require('sequelize');
import { sequelize } from './database';
import { generateHMAC } from './utils';



// Base Entity Inheritance
const BaseEntity = require('./BaseEntityModel');

/*
  Fua From Visit entity derived from the Base Entity for audit purpouses.
*/

const FUAFromVisitModel = sequelize.define(
    "FUAFromVisit",
    {
        //Extending BaseEntity
        ...BaseEntity.commonAttributes(),
        
        // Define FuaFormat atributes
        payload: {        // OpenMRS API payload
            type: DataTypes.STRING,
            allowNull: false
        },
        schemaType: {        // Shows what type of scheme whas use (HL7, API, Etc)
            type: DataTypes.STRING,
            allowNull: false
        },
        outputType: {
            type: DataTypes.STRING,
            allowNull: false
        },
        output: {
            type: DataTypes.BLOB,
            allowNull: false
        }
        
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt       
    },
);

export default FUAFromVisitModel;
