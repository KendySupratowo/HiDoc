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
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Username required!" },
        notEmpty: { msg: "Username required!" },
        len: {
          args: [5],
          msg: "Username at least 5 characters long!"
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: { msg: "Email already in use!" },
      validate: {
        notNull: { msg: "Email required!" },
        notEmpty: { msg: "Email required!" }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Password required!" },
        notEmpty: { msg: "Password required!" },
        len: {
          args: [5],
          msg: "Password at least 5 characters long!"
        }
      }
    },
    role: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(user) {
        const salt = bcrypt.genSaltSync(8)
        const hash = bcrypt.hashSync(user.password, salt)
        user.password = hash
        user.role = 'Patient'
      }
    },
    sequelize,
    modelName: 'User',
  });
  return User;
};