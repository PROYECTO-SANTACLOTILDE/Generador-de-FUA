const { Sequelize, DataTypes, Model } = require('sequelize');

class User extends Model {}
/*
  User entity is a 'primal' entity, so it doesnt derived from the Base Enity because its need froaudit purpouses.
*/

User.init(
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
      defaultVlaue: DataTypes.UUIDV1,
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
    salt: {               // To prevent rainbow attack, its used in the hash of the password                
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
    // Audit attributes
    creatorId: {
      type: DataTypes.INTEGER
    },
    changedById: {
      type: DataTypes.INTEGER
    },
    // Audit Attributes
    active: { // Consider if its necesaary to put default as true for this 
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    deactivatedBy: {
      type: DataTypes.INTEGER,
      defaultValue: true
    },
    deactivationReason: {
      type: DataTypes.STRING
    },
    deactivationDate: {
      type: DataTypes.DATE
    },
    changedBy: {
      type: DataTypes.INTEGER
    },
    changedDate: {
      type: DataTypes.DATE
    }
  },
  {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'User', // We need to choose the model name
  },
);

// the defined model is the class itself
console.log(User === sequelize.models.User); // true