'use strict';

(function() {
  var form = document.querySelector('.review-form');
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');
  var formName = document.querySelector('.review-form-field-name');
  var formText = document.querySelector('.review-form-field-text');
  var formSubmitButton = document.querySelector('.review-submit');
  var formMarkGroup = document.querySelector('.review-form-group-mark');
  var formMark = document.querySelectorAll('.review-form-group-mark input');
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
  formSubmitButton.setAttribute('disabled', 'disabled');

  for (var i = 0; i < formMark.length; i++) {
    if (formMark[i].checked) {
      if (formMark[i].value > 2) {
        formFieldsText.style.display = 'none';
      } else {
        formFieldsText.style.display = 'inline';
      }
    }
  }

  form.onsubmit = function(evt) {
    evt.preventDefault();
    // Проверка заполнения поля Имя
    if (!formName.value) {
      formSubmitButton.setAttribute('disabled', 'disabled');
      formFieldsName.style.display = 'inline';
    } else {
      formFieldsName.style.display = 'none';
      // Проверка заполнения поля Описание
      if (!formText.value) {
        for (i = 0; i < formMark.length; i++) {
          if (formMark[i].checked) {
            if (formMark[i].value > 2) {
              formSubmitButton.removeAttribute('disabled');
              formFieldsText.style.display = 'none';
              formFields.style.display = 'none';
              form.submit();
            } else {
              formSubmitButton.setAttribute('disabled', 'disabled');
            }
          }
        }
      } else {
        form.submit();
      }
    }
  };

  formName.oninput = function() {
    if (formName.value) {
      formSubmitButton.removeAttribute('disabled');
      formFieldsName.style.display = 'none';
    } else {
      formFieldsName.style.display = 'inline';
    }
  };

  formText.oninput = function() {
    if (formText.value) {
      formSubmitButton.removeAttribute('disabled');
      formFieldsText.style.display = 'none';
    } else {
      formFieldsText.style.display = 'inline';
    }
  };

  formMarkGroup.onchange = function() {
    for (i = 0; i < formMark.length; i++) {
      if (formMark[i].checked) {
        if (formMark[i].value > 2) {
          formSubmitButton.removeAttribute('disabled');
          formFieldsText.style.display = 'none';
        } else {
          formSubmitButton.setAttribute('disabled', 'disabled');
          formFieldsText.style.display = 'inline';
        }
      }
    }
  };
})();
