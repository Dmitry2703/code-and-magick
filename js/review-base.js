/**
 * @fileoverview Компонента отзыва
 * @author Dmitry Meshcheryakov
 */

'use strict';

/**
 * Конструктор объекта ReviewBase
 * @constructor
 */
var ReviewBase = function() {};

ReviewBase.prototype._data = null;

/**
 * Получение данных
 * @param {Object} data
 */
ReviewBase.prototype.setData = function(data) {
  this._data = data;
};

/**
 * Отрисовка элемента отзыва в списке
 */
ReviewBase.prototype.render = function() {
  var template = document.querySelector('#review-template');
  if ('content' in template) {
    this.element = template.content.querySelector('.review').cloneNode(true);
  } else {
    this.element = template.querySelector('.review').cloneNode(true);
  }

  // Вывод текста отзыва
  this.element.querySelector('.review-text').textContent = this._data.getDescription();

  // Вывод рейтинга
  var rating = this._data.getRating();
  var ratingMark = '';
  switch (rating) {
    case 2:
      ratingMark = 'two';
      break;
    case 3:
      ratingMark = 'three';
      break;
    case 4:
      ratingMark = 'four';
      break;
    case 5:
      ratingMark = 'five';
      break;
  }
  this.element.querySelector('.review-rating').classList.add('review-rating-' + ratingMark);

  // Загрузка изображений
  var reviewImage = new Image(124, 124);
  reviewImage.onload = function() {
    clearTimeout(imageLoadTimeout);
    reviewImage.classList.add('review-author');
    reviewImage.setAttribute('alt', this._data.getAuthor());
    reviewImage.setAttribute('title', this._data.getAuthor());
    this.element.replaceChild(reviewImage, this.element.querySelector('.review-author'));
  }.bind(this);
  reviewImage.onerror = function() {
    this.element.classList.add('review-load-failure');
  }.bind(this);
  reviewImage.src = this._data.getImage();

  /** @const {Number} */
  var IMAGE_TIMEOUT = 10000;

  var imageLoadTimeout = setTimeout(function() {
    this.element.querySelector('.review-author').setAttribute('src', '');
    this.element.classList.add('review-load-failure');
  }, IMAGE_TIMEOUT);

  // Запись имени автора в атрибуты alt и title незагрузившейся картинки
  this.element.querySelector('.review-author').setAttribute('alt', this._data.getAuthor());
  this.element.querySelector('.review-author').setAttribute('title', this._data.getAuthor());
};

module.exports = ReviewBase;
