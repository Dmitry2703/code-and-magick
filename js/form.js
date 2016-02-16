'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var formName = document.querySelector('.review-form-field-name');
  var formText = document.querySelector('.review-form-field-text');
  var formSubmitButton = document.querySelector('.review-submit');
  var formMarkGroup = document.querySelector('.review-form-group-mark');
  var formFields = document.querySelector('.review-fields');
  var formFieldsName = document.querySelector('.review-fields-name');
  var formFieldsText = document.querySelector('.review-fields-text');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  // Начальные условия
  // Кнопка отправки формы заблокирована, так как поле Имя не заполнено
  formSubmitButton.setAttribute('disabled', 'disabled');
  // Ссылка на поле Описание отображается, если оценка ниже 3
  if (isReviewRequired() === true) {
    formFieldsText.style.display = '';
  } else {
    formFieldsText.style.display = 'none';
  }

  /**
   * Проверка необходимости заполнения отзыва
  */
  function isReviewRequired() {
    var formMark = document.querySelector('input[name="review-mark"]:checked');
    if (formMark.value < 3) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Проверка заполнения обязательных полей
  */
  function checkFormFields() {
    // Поле Имя не заполнено
    if (!formName.value) {
      formSubmitButton.setAttribute('disabled', 'disabled');
      formFieldsName.style.display = '';
      formFields.style.display = '';
      // Ссылка на поле Описание отображается/скрывается при незаполненном поле Имя
      if (isReviewRequired() === true) {
        formFieldsText.style.display = '';
        // Если оценка ниже 3, но поле Описание заполнено, то ссылка на поле Описание
        // отображается/скрывается при незаполненном поле Имя
        if (formText.value) {
          formFieldsText.style.display = 'none';
        }
      } else {
        formFieldsText.style.display = 'none';
      }
    // Поле Имя заполнено
    } else {
      formFieldsName.style.display = 'none';
      // Поле Описание не заполнено
      if (!formText.value) {
        if (isReviewRequired() === true) {
          formSubmitButton.setAttribute('disabled', 'disabled');
          formFieldsText.style.display = '';
          formFields.style.display = '';
        } else {
          formSubmitButton.removeAttribute('disabled');
          formFieldsText.style.display = 'none';
          formFields.style.display = 'none';
        }
      // Поле Описание заполнено
      } else {
        formSubmitButton.removeAttribute('disabled');
        formFieldsText.style.display = 'none';
        formFields.style.display = 'none';
      }
    }
  }

  formName.oninput = checkFormFields;

  formText.oninput = checkFormFields;

  formMarkGroup.onchange = function() {
    isReviewRequired();
    checkFormFields();
  };
})();
