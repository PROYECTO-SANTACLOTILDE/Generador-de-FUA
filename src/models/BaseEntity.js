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
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      active: { // Consider if its necesaary to put default as true for this 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      inactiveBy: {
        type: DataTypes.INTEGER
      },
      inactiveAt: {
        type: DataTypes.DATE
      },
      inactiveReason: {
        type: DataTypes.STRING
      }
    }    
  }
}

module.exports = BaseEntity;