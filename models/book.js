'use strict';
const {
  Model, Sequelize
} = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {
    
  };
  Book.init({
    title: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Please provide a title for book entry"
        }
      },
      
    },
    author: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Please provide an author for book entry'
        }
      },
      
    },
    publisher: Sequelize.STRING,
    genre: Sequelize.STRING,
    year: Sequelize.INTEGER
  }, {
    sequelize,
    modelName: 'Book',
  });
  return Book;
};