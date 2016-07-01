/* global Photo, Gallery: true */

'use strict';

(function() {
  var gallery = new Gallery();

  // Сбор фотографий из блока .photogallery в массив
  var photogalleryItems = document.querySelectorAll('.photogallery img');
  photogalleryItems = Array.prototype.slice.call(photogalleryItems);

  var photos = photogalleryItems.map(function(item) {
    return new Photo(item.src);
  });

  // Показ фотогалереи
  photogalleryItems.forEach(function(item, index) {
    item.addEventListener('click', function(evt) {
      evt.preventDefault();
      gallery.show();
      gallery.setPictures(photos);
      gallery.setCurrentPicture(index);
    });
  });
})();
