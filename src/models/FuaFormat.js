import { Model, DataTypes, Optional } from 'sequelize';

// Define FuaFormat atributes
const { DataTypes } = require('sequelize');
const BaseEntity = require('./BaseEntity');

class FuaFormat extends BaseEntity {}

FuaFormat.init(
    {
        //Extending BaseEntity
        ...BaseEntity.commonAttributes(),
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        }
    },
    {
        sequelize,                  // We need to pass the connection instance,
        timestamps: true,           // updateAt tinmestamp field
        createdAt: true,            // createdAt timestamps field
        modelName: 'FuaFormat',     // We need to choose the model name
    },
);

module.exports = FuaFormat;


