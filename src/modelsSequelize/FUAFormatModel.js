const { DataTypes, Model } = require('sequelize');
import BaseFieldFormModel from './BaseFieldFormModel';
import { sequelize } from './database';


/*
  Fua Format entity derived from the Base Field Form for audit purpouses.
*/

const FUAFormatModel = sequelize.define(
    "FUAFormat",
    {
        // Extending Base Field Form Entity
        ...BaseFieldFormModel.commonAttributes(),

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },        

    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // updateAt timestamp field
    },
);

export default FUAFormatModel;



