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
      if (evt.keyCode === 27) {
        this.hide();
      }
    },

    /**
    * Обработчик клика по стрелке влево
    * @private
    */
    _onLeftControlClick: function() {
      console.log('Влево!');
    },

    /**
    * Обработчик клика по стрелке вправо
    * @private
    */
    _onRightControlClick: function() {
      console.log('Вправо!');
    }
  };

  window.Gallery = Gallery;
})();
