const { DataTypes, Model } = require('sequelize');
import BaseFieldFormModel from './BaseFieldFormModel';
import { sequelize } from './database';


/*
  Fua Page entity derived from the Base Field Form for audit purpouses.
*/

const FUAPageModel = sequelize.define(
    "FUAPage",
    {
        //Extending BaseFieldFormEntity
        ...BaseFieldFormModel.commonAttributes(),
        
        // Define Fua Page atributes
        pageNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
        height: {   
            // If its null, it will use all 
            type: DataTypes.FLOAT,       
            allowNull: false      
        },
        width: {   
            // If its null, it will use all 
            type: DataTypes.FLOAT,       
            allowNull: false      
        },
        extraStyle: {
            // field use for padding
            type: DataTypes.STRING,
        }
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt
    },
);

export default FUAPageModel;

