'use strict'

module.exports = {
  // eslint-disable-next-line
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Categories', [{
        name: 'John Doe',
        isBetaMember: false
      }], {})
    */

    return queryInterface.bulkInsert('Categories', [
      {
        name: 'Clothing',
      }, {
        name: 'Electronics'
      },
      {
        name: 'Miscellaneous'
      }
    ], {})
  },

  // eslint-disable-next-line
  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Categories', null, {})
    */

    return queryInterface.bulkDelete('Categories', null, {})

  }
}
