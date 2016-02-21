'use strict';

(function() {
  /* global reviews */

  // Скрываем блок с фильтром отзывов
  var reviewsFilter = document.querySelector('.reviews-filter');
  reviewsFilter.classList.add('invisible');

  reviews.forEach(function(review) {
    var reviewsList = document.querySelector('.reviews-list');
    var element = getElementFromTemplate(review);

    // Добавляем отзывы в блок reviewsList
    reviewsList.appendChild(element);

    // Показываем блок с фильтром отзывов
    reviewsFilter.classList.remove('invisible');
  });

  function getElementFromTemplate(data) {
    var template = document.querySelector('#review-template');
    if ('content' in template) {
      var element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    // Выводим текст отзыва
    element.querySelector('.review-text').textContent = data.description;

    // Выводим рейтинг
    var rating = data.rating;
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
    element.querySelector('.review-rating').classList.add('review-rating-' + ratingMark);

    // Загружаем изображения
    var reviewImage = new Image(124, 124);
    reviewImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      reviewImage.classList.add('review-author');
      reviewImage.setAttribute('alt', data.author.name);
      reviewImage.setAttribute('title', data.author.name);
      element.replaceChild(reviewImage, element.querySelector('.review-author'));
    };
    reviewImage.onerror = function() {
      element.classList.add('review-load-failure');
    };
    reviewImage.src = data.author.picture;

    var IMAGE_TIMEOUT = 10000;
    var imageLoadTimeout = setTimeout(function() {
      element.querySelector('.review-author').setAttribute('src', '');
      element.classList.add('review-load-failure');
    }, IMAGE_TIMEOUT);

    // Записываем имя автора в атрибуты alt и title незагрузившейся картинки
    element.querySelector('.review-author').setAttribute('alt', data.author.name);
    element.querySelector('.review-author').setAttribute('title', data.author.name);

    return element;
  }
})();
