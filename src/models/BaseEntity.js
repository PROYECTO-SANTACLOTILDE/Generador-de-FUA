const {  DataTypes, Model } = require('sequelize');
const { User } = require('./User');

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
        defaultValue: DataTypes.UUIDV1,
        allowNull: false
      },
      createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: User, 
          key: 'id',
        },
      },
      updatedBy: {
        type: DataTypes.INTEGER,
        references: {
          model: User, 
          key: 'id',
        },
      },
      active: { // Consider if its necessWary to put default as true for this 
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      inactiveBy: {
        type: DataTypes.INTEGER,
        references: {
          model: User, 
          key: 'id',
        },
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