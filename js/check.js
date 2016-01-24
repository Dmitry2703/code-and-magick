function getMessage(a, b) {
  var string = '';
  if (typeof a == 'boolean') {
    if (a == true) {
      string = 'Я попал в ' + b;
    } else {
      string = 'Я никуда не попал';
    }
  };
  if (typeof a == 'number') {
    string = 'Я прыгнул на ' + a*100 + ' сантиметр' + makeRightEnding(a*100);
  };
  if (typeof a == 'object') {
    var sum = 0;
    for (var i = 0; i < a.length; i++) {
      sum += a[i];
    }
    string = 'Я прошел ' + sum + ' шаг' + makeRightEnding(sum);
  };
  if ((typeof a == 'object') && (typeof b == 'object')) {
    var length = 0;
    var min = Math.min(a.length, b.length);
    for (i = 0; i < min; i++) {
      length += a[i]*b[i];
    }
    string = 'Я прошел ' + length + ' метр' + makeRightEnding(length);
  }
  return string;
};

function makeRightEnding(num) {
  var string = '';
  if (num%10 == 1) {
    string = '';
  };
  if ((num%10 > 1) && (num%10 < 5)) {
    string = 'а';
  };
  if ((num%10 == 0) || ((num > 4) && (num < 21)) || ((num%10 > 4) && (num%10 < 10))) {
    string = 'ов';
  };
  return string;
}