'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DiseaseSymptoms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      DiseaseId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Diseases',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      SymptomId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Symptoms',
          key: 'id'
        },
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DiseaseSymptoms');
  }
};