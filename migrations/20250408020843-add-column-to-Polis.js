'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Polis', 'poliName', Sequelize.STRING)
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Polis', 'poliName')
  }
};
