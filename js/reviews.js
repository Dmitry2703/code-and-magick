/* global ReviewBase, ReviewData: true */

'use strict';

(function() {
  var loadedReviews = [];
  var filteredReviews = [];
  var currentPage = 0;
  var PAGE_SIZE = 3;
  var activeFilter = localStorage.getItem('activeFilter') || 'reviews-all';

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
      // массив объектов с данными типа ReviewData
      loadedReviews = loadedReviews.map(function(review) {
        return new ReviewData(review);
      });
      setActiveFilter(activeFilter);
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
      var reviewElement = new ReviewBase(review);
      reviewElement.setData(review);
      reviewElement.render();

      // Добавление отзывов в фрагмент
      fragment.appendChild(reviewElement.element);
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
          return Date.parse(item.getDate()) > (Date.now() - 14 * 24 * 60 * 60 * 1000);
        }).sort(function(a, b) {
          return Date.parse(b.getDate()) - Date.parse(a.getDate());
        });
        break;
      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(item) {
          return item.getRating() > 2;
        }).sort(function(a, b) {
          return b.getRating() - a.getRating();
        });
        break;
      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(item) {
          return item.getRating() < 3;
        }).sort(function(a, b) {
          return a.getRating() - b.getRating();
        });
        break;
      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.getUsefulness() - a.getUsefulness();
        });
        break;
    }

    var filterItems = filters.querySelectorAll('input[name="reviews"]');
    filterItems = Array.prototype.slice.call(filterItems);

    filterItems.forEach(function(item) {
      item.removeAttribute('checked');
      if (item.id === activeFilter) {
        item.setAttribute('checked', 'checked');
      }
    });

    currentPage = 0;
    renderReviews(filteredReviews, currentPage++, true);

    // Скрытие кнопки "Еще отзывы", если фильтрованных отзывов меньше размера страницы PAGE_SIZE
    if (filteredReviews.length < (PAGE_SIZE + 1)) {
      reviewsMoreButton.classList.add('invisible');
    }

    activeFilter = id;
    localStorage.setItem('activeFilter', id);
  }

  var reviewsMoreButton = document.querySelector('.reviews-controls-more');
  reviewsMoreButton.addEventListener('click', function() {
    renderReviews(filteredReviews, currentPage++);
  });
})();
