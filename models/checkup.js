'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Checkup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Checkup.belongsToMany(models.Symptom, { foreignKey: 'CheckupId', through: models.CheckupSymptom })
      Checkup.belongsTo(models.User, { foreignKey: 'UserId' })
    }
  }
  Checkup.init({
    UserId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Checkup',
  });
  return Checkup;
};