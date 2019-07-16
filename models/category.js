'use strict'
module.exports = (sequelize, DataTypes) => {

  const Category = sequelize.define('Category', {
    name: DataTypes.STRING
  }, {})

  // eslint-disable-next-line
  Category.associate = function(models) {
    Category.hasMany(models.Product, {
      foreignKey: 'category_id'
    })
  }

  return Category
}
