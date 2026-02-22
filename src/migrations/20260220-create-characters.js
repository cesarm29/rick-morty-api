"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Characters', {
      id: { type: Sequelize.INTEGER, primaryKey: true },
      name: { type: Sequelize.STRING },
      status: { type: Sequelize.STRING },
      species: { type: Sequelize.STRING },
      type: { type: Sequelize.STRING },
      gender: { type: Sequelize.STRING },
      origin: { type: Sequelize.STRING },
      image: { type: Sequelize.STRING },
      url: { type: Sequelize.STRING }
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Characters');
  }
};
