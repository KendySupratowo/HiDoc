'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Disease extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Disease.belongsTo(models.Poli, { foreignKey: 'PoliId' })
      Disease.hasMany(models.Medicine, { foreignKey: 'DiseaseId' })
      Disease.belongsToMany(models.Symptom, { foreignKey: 'DiseaseId', through: models.DiseaseSymptom })
    }
  }
  Disease.init({
    diseaseName: DataTypes.STRING,
    description: DataTypes.TEXT,
    level: DataTypes.INTEGER,
    PoliId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Disease',
  });
  return Disease;
};