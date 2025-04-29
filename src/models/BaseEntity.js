const {  DataTypes, Model } = require('sequelize');

class BaseEntity extends Model {
  static commonAttributes() {
    return {
      // Base Entity attributes 
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      uuid: {
        type: DataTypes.UUID,
        defaultVlaue: DataTypes.UUIDV1,
        allowNull: false
      },
      dateCreated: {
        type: DataTypes.DATE,
        allowNull: false
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    }    
  }
}

module.exports = BaseEntity;