'use strict';
const {
  Sequelize, Model, DataTypes
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Book extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Book.init({
    title: { 
      type: Sequelize.STRING,
      allowNull: false,
      validate:{
        notEmpty: {
          msg: "Please specify a title for the book to enter"
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false,
      validate:{
        notEmpty: {
          msg: "Please specify an author for the book to enter"
        }
      }
    },
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};