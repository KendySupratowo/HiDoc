'use strict';
const fs = require('fs').promises
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let data = JSON.parse(await fs.readFile('./data/diseases.json', 'utf8')).map(el => {
      delete el.id
      el.diseaseName = el.name
      delete el.name
      el.createdAt = new Date()
      el.updatedAt = new Date()
      return el
    })
    await queryInterface.bulkInsert('Diseases', data, {})
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Diseases', null, {});
  }
};
