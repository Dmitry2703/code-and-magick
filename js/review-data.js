/**
 * @fileoverview Компонента данных отзыва
 * @author Dmitry Meshcheryakov
 */

'use strict';

/**
 * Конструктор объекта ReviewData
 * @param {Object} data
 * @constructor
 */
var ReviewData = function(data) {
  this.params = data;
};

/**
 * Получение текста отзыва
 * @return {string}
 */
ReviewData.prototype.getDescription = function() {
  return this.params.description;
};

/**
 * Получение рейтинга
 * @return {number}
 */
ReviewData.prototype.getRating = function() {
  return this.params.rating;
};

/**
 * Получение имени автора
 * @return {string}
 */
ReviewData.prototype.getAuthor = function() {
  return this.params.author.name;
};

/**
 * Получение адреса картинки
 * @return {string}
 */
ReviewData.prototype.getImage = function() {
  return this.params.author.picture;
};

/**
 * Получение даты отзыва
 * @return {string}
 */
ReviewData.prototype.getDate = function() {
  return this.params.date;
};

/**
 * Получение оценки полезности отзыва
 * @return {number}
 */
ReviewData.prototype.getUsefulness = function() {
  return this.params.review_usefulness;
};

module.exports = ReviewData;
