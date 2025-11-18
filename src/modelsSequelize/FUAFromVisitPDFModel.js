const { DataTypes} = require('sequelize');
import { type } from 'os';
import { sequelize } from './database';
import { generateHMAC } from './utils';


const BaseEntity = require('./BaseEntityModel');


const FUAFromVisitPDFModel = sequelize.define(
    "FUAFromVisitPDF",
    {
        ...BaseEntity.commonAttributes(),

        name :{
            type: DataTypes.STRING,
            allowNull: false
        },
        fileData: {
            type: DataTypes.BLOB('long'), 
            allowNull: false
        },  
        versionTag: {
            type: DataTypes.STRING,
            allowNull: false
        },
        versionCounter: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize,                
        timestamps: true,  
    }
);

export default FUAFromVisitPDFModel;