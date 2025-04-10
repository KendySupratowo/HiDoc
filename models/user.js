'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasOne(models.Profile, { foreignKey: 'UserId' })
      User.belongsToMany(models.Symptom, { foreignKey: 'UserId', through: models.UserSymptom })
      User.hasMany(models.Checkup, { foreignKey: 'UserId' })
    }
  }
  User.init({
    username: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Email required!'
        },
        notEmpty: {
          msg: 'Email required!'
        }
      }
    },
    password: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(user) {
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};