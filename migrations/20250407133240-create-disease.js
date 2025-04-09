'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Diseases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      diseaseName: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      level: {
        type: Sequelize.INTEGER
      },
      PoliId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Polis',
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
    await queryInterface.dropTable('Diseases');
  }
};