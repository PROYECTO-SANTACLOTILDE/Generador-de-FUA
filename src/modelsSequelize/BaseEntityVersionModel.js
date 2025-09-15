const {  DataTypes, Model } = require('sequelize');
const BaseEntityModel = require("./BaseEntityModel");
/*
  Base Entity entity that holds atributes for audit purpouses.
*/

class BaseEntityVersionModel extends BaseEntityModel {
  static commonAttributes() {
    return {
      // Base Entity attributes 
      uuidObject: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      hash: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      }
    }    
  }
}

module.exports = BaseEntityVersionModel;