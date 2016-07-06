/**
 * @fileOverview Валидация формы добавления отзыва
 * @author Dmitry Meshcheryakov
 */

'use strict';

var form = document.querySelector('.review-form');
var formContainer = document.querySelector('.overlay-container');
var formOpenButton = document.querySelector('.reviews-controls-new');
var formCloseButton = document.querySelector('.review-form-close');
var formName = document.querySelector('.review-form-field-name');
var formText = document.querySelector('.review-form-field-text');
var formSubmitButton = document.querySelector('.review-submit');
var formMarkGroup = document.querySelector('.review-form-group-mark');
var formMark = document.querySelectorAll('input[name="review-mark"]');
var formFields = document.querySelector('.review-fields');
var formFieldsName = document.querySelector('.review-fields-name');
var formFieldsText = document.querySelector('.review-fields-text');

/**
 * Открытие формы
 * @param  {MouseEvent} evt
 */
formOpenButton.onclick = function(evt) {
  evt.preventDefault();
  formContainer.classList.remove('invisible');
};

/**
 * Закрытие формы
 * @param  {MouseEvent} evt
 */
formCloseButton.onclick = function(evt) {
  evt.preventDefault();
  formContainer.classList.add('invisible');
};

// Начальные условия
// Подстановка значения поля Имя из cookies
formName.value = docCookies.getItem('name');
// Подстановка значения Оценка из cookies
var formMarkFromCookies = docCookies.getItem('mark');
for (var i = 0; i < formMark.length; i++) {
  if (formMark[i].value === formMarkFromCookies) {
    formMark[i].setAttribute('checked', 'checked');
  }
}
// Ссылка на поле Описание отображается, если оценка ниже 3
formFieldsText.style.display = isReviewRequired() ? '' : 'none';

/**
 * Проверка необходимости заполнения отзыва
 * @return {Boolean}
 */
function isReviewRequired() {
  return document.querySelector('input[name="review-mark"]:checked').value < 3;
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
    if (isReviewRequired()) {
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
    if (!formText.value && isReviewRequired()) {
      formSubmitButton.setAttribute('disabled', 'disabled');
      formFieldsText.style.display = '';
      formFields.style.display = '';
    } else {
      formSubmitButton.removeAttribute('disabled');
      formFieldsText.style.display = 'none';
      formFields.style.display = 'none';
    }
  }
}

// Валидация при открытии формы
checkFormFields();

formName.oninput = checkFormFields;

formText.oninput = checkFormFields;

formMarkGroup.onchange = checkFormFields;

/**
 * Сохранение оценки и имени пользователя в cookies при отправке формы
 * @param  {MouseEvent} evt
 */
form.onsubmit = function(evt) {
  evt.preventDefault();
  // Срок жизни Cookies - количество дней с прошедшего дня рождения
  var lastBirthdayDate = new Date('2015-03-27');
  var todayDate = new Date();
  var lastBirthdayYear = lastBirthdayDate.getFullYear();
  var todayYear = todayDate.getFullYear();
  var deltaYear = todayYear - lastBirthdayYear;
  if (deltaYear === 0) {
    var daysToExpire = Math.round((todayDate - lastBirthdayDate) / 1000 / 60 / 60 / 24);
  } else {
    daysToExpire = Math.round((todayDate - lastBirthdayDate) / 1000 / 60 / 60 / 24 - (deltaYear - 1) * 365);
  }

  var dateToExpire = Date.now() + daysToExpire * 24 * 60 * 60 * 1000;
  docCookies.setItem('name', formName.value, dateToExpire);
  docCookies.setItem('mark', document.querySelector('input[name="review-mark"]:checked').value, dateToExpire);
  form.submit();
};
