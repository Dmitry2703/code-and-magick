'use strict';

(function() {
  var loadedReviews = [];
  var filteredReviews = [];
  var currentPage = 0;
  var PAGE_SIZE = 3;

  // Скрытие блока с фильтром отзывов
  var reviewsFilter = document.querySelector('.reviews-filter');
  reviewsFilter.classList.add('invisible');

  // Отображение прелоадера во время загрузки списка отзывов
  var reviewsBlock = document.querySelector('.reviews');
  reviewsBlock.classList.add('reviews-list-loading');

  getReviews();

  /**
   * Загрузка списка отзывов
   */
  function getReviews() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '//o0.github.io/assets/json/reviews.json');
    xhr.timeout = 10000;
    xhr.onload = function(evt) {
      loadedReviews = JSON.parse(evt.target.response);
      renderReviews(loadedReviews, 0);
      filteredReviews = loadedReviews.slice(PAGE_SIZE);
      reviewsBlock.classList.remove('reviews-list-loading');
    };
    xhr.onerror = function() {
      reviewsBlock.classList.remove('reviews-list-loading');
      reviewsBlock.classList.add('reviews-load-failure');
    };
    xhr.ontimeout = function() {
      reviewsBlock.classList.remove('reviews-list-loading');
      reviewsBlock.classList.add('reviews-load-failure');
    };
    xhr.send();
  }

  /**
   * Создание отзыва из шаблона
   * @param {object} data
   * @return {element}
   */
  function getElementFromTemplate(data) {
    var template = document.querySelector('#review-template');
    if ('content' in template) {
      var element = template.content.querySelector('.review').cloneNode(true);
    } else {
      element = template.querySelector('.review').cloneNode(true);
    }

    // Вывод текста отзыва
    element.querySelector('.review-text').textContent = data.description;

    // Вывод рейтинга
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

    // Загрузка изображений
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

    // Запись имени автора в атрибуты alt и title незагрузившейся картинки
    element.querySelector('.review-author').setAttribute('alt', data.author.name);
    element.querySelector('.review-author').setAttribute('title', data.author.name);

    return element;
  }

  /**
   * Отрисовка списка отзывов
   * @param {Array.<Object>} reviews
   */
  function renderReviews(reviews, pageNumber, replace) {
    var reviewsList = document.querySelector('.reviews-list');
    if (replace) {
      reviewsList.innerHTML = '';
    }
    var fragment = document.createDocumentFragment();

    // Постраничное отображение отзывов
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviews.slice(from, to);

    pageReviews.forEach(function(review) {
      var element = getElementFromTemplate(review);

      // Добавление отзывов в фрагмент
      fragment.appendChild(element);
    });

    // Добавление отзывов в блок .reviews-list
    reviewsList.appendChild(fragment);

    // Отображение блока с фильтром отзывов
    reviewsFilter.classList.remove('invisible');

    // Отображение кнопки "Еще отзывы"
    reviewsMoreButton.classList.remove('invisible');
    // Общее количество страниц с отзывами
    var totalPages = Math.round(reviews.length / PAGE_SIZE);
    if (currentPage === totalPages) {
      reviewsMoreButton.classList.add('invisible');
    }
  }

  // Выбор фильтра
  var filters = document.querySelector('.reviews-filter');
  filters.addEventListener('click', function(evt) {
    var clickedElement = evt.target;
    if (clickedElement.hasAttribute('name')) {
      setActiveFilter(clickedElement.id);
    }
  });

  /**
   * Установка выбранного фильтра
   * @param {string} id
   */
  function setActiveFilter(id) {
    filteredReviews = loadedReviews.slice(0);
    switch (id) {
      case 'reviews-all':
        filteredReviews = loadedReviews;
        break;
      case 'reviews-recent':
        filteredReviews = filteredReviews.filter(function(item) {
          return Date.parse(item.date) > (Date.now() - 14 * 24 * 60 * 60 * 1000);
        }).sort(function(a, b) {
          return Date.parse(b.date) - Date.parse(a.date);
        });
        break;
      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(item) {
          return item.rating > 2;
        }).sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(item) {
          return item.rating < 3;
        }).sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.review_usefulness - a.review_usefulness;
        });
        break;
    }
    currentPage = 0;
    renderReviews(filteredReviews, currentPage++, true);
  }

  var reviewsMoreButton = document.querySelector('.reviews-controls-more');
  reviewsMoreButton.addEventListener('click', function() {
    renderReviews(filteredReviews, currentPage++);
  });
})();
