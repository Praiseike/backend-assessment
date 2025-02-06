'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    await queryInterface.bulkInsert('users',[
      {email: 'user1@gmail.com', password: await bcrypt.hash('astrongpassword',10), created_at: new Date(), updated_at: new Date()},
      {email: 'user2@gmail.com', password: await bcrypt.hash('astrongpassword',10), created_at: new Date(), updated_at: new Date()},
    ])
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('users',null, {});
  }
};
