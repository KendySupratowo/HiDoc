'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    get formattedName() {
      if (this.gender === "Laki-laki") {
        return `Sdra. ${this.name}`;
      } else {
        return `Sdri. ${this.name}`;
      }
    }

    formatAge() {
      return `${this.age} Tahun`
    }

    static associate(models) {
      Profile.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Profile.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Name required!" },
        notEmpty: { msg: "Name required!" },
        len: {
          args: [3],
          msg: "Name at least 3 characters long!"
        }
      }
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "Age required!" },
        notEmpty: { msg: "Age required!" },
        min: {
          args: 1,
          msg: "Age at least 1 year old!"
        }
      }
    }, gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: { msg: "Gender required!" },
        notEmpty: { msg: "Gender required!" }
      }
    },
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Profile',
  });
  return Profile;
};