const { DataTypes, Model } = require('sequelize');
import { sequelize } from './database';

/*
  User entity is a 'primal' entity, so it doesnt derived from the Base Entity because its need for audit purpouses.
*/

const User = sequelize.define(
  "User",
  // Atributes
  {
    // Id attributes 
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
    // User Atributes
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    salt: {               
      // To prevent rainbow attack, its used in the hash of the password                
      type: DataTypes.STRING,
      allowNull: false
    },
    secretQuestion: {
      type: DataTypes.STRING,
      allowNull: false
    },
    secretAnswer: {
      type: DataTypes.STRING,
      allowNull: false
    },
    // Audit Attributes
    active: { // Consider if its necesaary to put default as true for this 
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    createdBy: {
      type: DataTypes.INTEGER
    },
    inactiveBy: {
      type: DataTypes.INTEGER
    },
    inactiveReason: {
      type: DataTypes.STRING
    },
    inactiveAt: {
      type: DataTypes.DATE
    },
    updatedBy: {
      type: DataTypes.INTEGER
    }
  },
  {
    // Other model options go here
    sequelize,          // We need to pass the connection instance
    timestamps: true,   // Adds createdAt/updatedAt
  },
);

export default User;

