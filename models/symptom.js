'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Symptom extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Symptom.belongsToMany(models.Disease, { foreignKey: 'SymptomId', through: models.DiseaseSymptom })
    }
  }
  Symptom.init({
    symptomName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Symptom',
  });
  return Symptom;
};