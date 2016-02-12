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
    switch (rating) {
      case 2:
        element.querySelector('.review-rating').classList.add('review-rating-two');
        break;
      case 3:
        element.querySelector('.review-rating').classList.add('review-rating-three');
        break;
      case 4:
        element.querySelector('.review-rating').classList.add('review-rating-four');
        break;
      case 5:
        element.querySelector('.review-rating').classList.add('review-rating-five');
        break;
    }

    // Загружаем изображения
    var reviewImage = new Image();
    reviewImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      element.querySelector('.review-author').setAttribute('src', reviewImage.src);
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

    // Записываем имя автора в атрибуты alt и title соответствующей картинки
    element.querySelector('.review-author').setAttribute('alt', data.author.name);
    element.querySelector('.review-author').setAttribute('title', data.author.name);

    return element;
  }
})();
