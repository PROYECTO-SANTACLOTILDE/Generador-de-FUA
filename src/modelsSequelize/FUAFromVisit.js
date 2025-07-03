const { DataTypes} = require('sequelize');
import { sequelize } from './database';
import { generateHMAC } from './utils';



// Base Entity Inheritance
const BaseEntity = require('./BaseEntityModel');

/*
  Fua From Visit entity derived from the Base Entity for audit purpouses.
*/

const FUAFromVisit = sequelize.define(
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
        checksum: {
            type: DataTypes.STRING,
            allowNull: false
        }        
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt
        indexes: [
            {
                unique: true,
                fields: ['uuid']
            },            
        ],
    },
);

FUAFromVisit.addHook('beforeCreate', (auxFUA, option) => {
    auxFUA.checksum = generateHMAC(auxFUA);
});

export default FUAFromVisit;
