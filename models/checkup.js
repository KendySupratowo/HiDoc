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

    static async getUserCheckupHistory(userId) {
      const checkups = await this.findAll({
        where: { UserId: userId },
        include: [
          {
            model: sequelize.models.Symptom
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      // Inject disease, poli, medicine secara manual
      const enriched = await Promise.all(checkups.map(async (checkup) => {
        if (checkup.DiseaseId) {
          const disease = await sequelize.models.Disease.findByPk(checkup.DiseaseId, {
            include: [sequelize.models.Poli, sequelize.models.Medicine]
          });
          checkup.dataValues.Disease = disease;
        }
        return checkup;
      }));

      return enriched;
    }



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