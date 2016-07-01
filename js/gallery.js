'use strict';

(function() {
  /**
  * @constructor
  */
  function Gallery() {
    this.element = document.querySelector('.overlay-gallery');
    this._closeButton = this.element.querySelector('.overlay-gallery-close');
    this._leftControl = this.element.querySelector('.overlay-gallery-control-left');
    this._rightControl = this.element.querySelector('.overlay-gallery-control-right');
    this._preview = this.element.querySelector('.overlay-gallery-preview');
    this._currentNumber = this.element.querySelector('.preview-number-current');
    this._totalNumber = this.element.querySelector('.preview-number-total');
    this._currentNumber.innerHTML = 0;
    this._totalNumber.innerHTML = 0;
    this._onCloseClick = this._onCloseClick.bind(this);
    this._onDocumentKeyDown = this._onDocumentKeyDown.bind(this);
    this._onLeftControlClick = this._onLeftControlClick.bind(this);
    this._onRightControlClick = this._onRightControlClick.bind(this);
  }

  Gallery.prototype = {
    /**
    * Показ галереи
    */
    show: function() {
      this.element.classList.remove('invisible');

      // Закрытие галереи по клику на крестик
      this._closeButton.addEventListener('click', this._onCloseClick);

      // Закрытие галереи по нажатию на клавишу ESC
      window.addEventListener('keydown', this._onDocumentKeyDown);

      // Прокрутка влево
      this._leftControl.addEventListener('click', this._onLeftControlClick);

      // Прокрутка вправо
      this._rightControl.addEventListener('click', this._onRightControlClick);
    },

    /**
    * Скрытие галереи
    */
    hide: function() {
      this.element.classList.add('invisible');
      this._closeButton.removeEventListener('click', this._onCloseClick);
      window.removeEventListener('keydown', this._onDocumentKeyDown);
      this._leftControl.removeEventListener('click', this._onLeftControlClick);
      this._rightControl.removeEventListener('click', this._onRightControlClick);
    },

    /**
    * Обработчик клика по крестику
    * @private
    */
    _onCloseClick: function() {
      this.hide();
    },

    /**
    * Обработчик клавиатурных событий
    * @private
    */
    _onDocumentKeyDown: function(evt) {
      // ESC
      if (evt.keyCode === 27) {
        this.hide();
      }
      // стрелка влево
      if (evt.keyCode === 37) {
        this._onLeftControlClick();
      }
      // стрелка вправо
      if (evt.keyCode === 39) {
        this._onRightControlClick();
      }
    },

    /**
    * Обработчик клика по стрелке влево
    * @private
    */
    _onLeftControlClick: function() {
      if (this._currentNumber.innerHTML > 1) {
        this.setCurrentPicture(this._currentNumber.innerHTML - 2);
      }
    },

    /**
    * Обработчик клика по стрелке вправо
    * @private
    */
    _onRightControlClick: function() {
      if (this._currentNumber.innerHTML < this.photo.length) {
        this.setCurrentPicture(this._currentNumber.innerHTML++);
      }
    },

    /**
    * Добавление фотографий в галерею
    */
    setPictures: function(photo) {
      this.photo = photo;
    },

    /*
    * Показ текущей фотографии
    */
    setCurrentPicture: function(number) {
      var photoImage = new Image(302, 302);
      photoImage.src = this.photo[number].src;
      if (this._preview.querySelectorAll('img').length === 0) {
        this._preview.appendChild(photoImage);
      } else {
        this._preview.replaceChild(photoImage, this._preview.querySelector('img'));
      }
      this._currentNumber.innerHTML = number + 1;
      this._totalNumber.innerHTML = this.photo.length;
    }
  };

  window.Gallery = Gallery;
})();
