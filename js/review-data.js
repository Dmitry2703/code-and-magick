'use strict';

/**
* @param {Object} data
* @constructor
*/
var ReviewData = function(data) {
  this.params = data;
};

// Получение текста отзыва
ReviewData.prototype.getDescription = function() {
  return this.params.description;
};

// Получение рейтинга
ReviewData.prototype.getRating = function() {
  return this.params.rating;
};

// Получение имени автора
ReviewData.prototype.getAuthor = function() {
  return this.params.author.name;
};

// Получение адреса картинки
ReviewData.prototype.getImage = function() {
  return this.params.author.picture;
};

// Получение адреса картинки
ReviewData.prototype.getDate = function() {
  return this.params.date;
};

// Получение оценки полезности отзыва
ReviewData.prototype.getUsefulness = function() {
  return this.params.review_usefulness;
};

module.exports = ReviewData;
