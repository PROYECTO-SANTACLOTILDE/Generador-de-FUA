const { DataTypes, Model } = require('sequelize');
import BaseFieldFormModel from './BaseFieldFormModel';
import { sequelize } from './database';


/*
  Fua Format entity derived from the Base Field Form for audit purpouses.
*/

const FUAFormatFromSchemaModel = sequelize.define(
    "FUAFormatFromSchema",
    {
        // Extending Base Field Form Entity
        ...BaseFieldFormModel.commonAttributes(),

        name: {
            type: DataTypes.STRING,
            allowNull: false
        }, 
        filename: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        content: {
            type: DataTypes.TEXT('long'), // Store large JSONC content
            allowNull: false,
        },       
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // updateAt timestamp field
    },
);

export default FUAFormatFromSchemaModel;



