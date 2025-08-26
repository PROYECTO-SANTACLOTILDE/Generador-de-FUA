const {  DataTypes, Model } = require('sequelize');
const BaseEntityModel = require('./BaseEntityModel');

/*
  Base Field Form entity that holds atributes for form purpouses.
*/


class BaseFieldFormModel extends Model {
  static commonAttributes() {
    // Base Field Form attributes 
    return {      

      //Extending BaseEntity
      ...BaseEntityModel.commonAttributes(),

      // Should be unique between pages
      codeName: {            
        type: DataTypes.STRING,
        allowNull: false,            
      },
      // String that define version
      versionTag: {        
        type: DataTypes.STRING,
        allowNull: false
      },
      // Version number, should be like a counter that indicates the version
      versionNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1
      }
    }    
  }
}

module.exports = BaseFieldFormModel;