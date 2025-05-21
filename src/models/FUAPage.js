const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';
import { FUASection } from './FUASection';


// Base Entity Inheritance
const BaseEntity = require('./BaseEntity');

/*
  Fua Format entity derived from the Base Entity for audit purpouses.
*/

export const FUAPage = sequelize.define(
    "FUAPage",
    {
        //Extending BaseEntity
        ...BaseEntity.commonAttributes(),
        
        // Define FuaFormat atributes
        title: {
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
        pageNumber: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1
            }
        },
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // Adds createdAt/updatedAt
    },
);

// Foreign Keys
FUAPage.hasOne(FUAPage,  {
    foreignKey: {
      name: 'nextPage',
    }
});


FUAPage.hasOne(FUAPage,  {
    foreignKey: {
      name: 'previousPage',
    }
});

FUAPage.hasMany(FUASection, {
    foreignKey: {
        name: 'FuaPageId'
    }
});
FUASection.belongsTo(FUAPage);


