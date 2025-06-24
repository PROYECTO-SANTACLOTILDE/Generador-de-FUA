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
        defaultValue: DataTypes.UUIDV4,
        allowNull: false
      },
      createdBy: {
        // UUID from Open-MRS user or other platform
        type: DataTypes.STRING,
        allowNull: false
      },
      updatedBy: {
        type: DataTypes.STRING,
      },
      active: { // Consider if its necessWary to put default as true for this 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      inactiveBy: {
        type: DataTypes.STRING,
      },
      inactiveAt: {
        type: DataTypes.DATE,        
      },
      inactiveReason: {
        type: DataTypes.STRING
      }
    }    
  }
}

module.exports = BaseEntity;