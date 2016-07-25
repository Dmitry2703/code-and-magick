/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);
	__webpack_require__(2);
	__webpack_require__(4);
	__webpack_require__(7);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * @const
	 * @type {number}
	 */
	var HEIGHT = 300;

	/**
	 * @const
	 * @type {number}
	 */
	var WIDTH = 700;

	/**
	 * ID уровней.
	 * @enum {number}
	 */
	var Level = {
	  'INTRO': 0,
	  'MOVE_LEFT': 1,
	  'MOVE_RIGHT': 2,
	  'LEVITATE': 3,
	  'HIT_THE_MARK': 4
	};

	/**
	 * Порядок прохождения уровней.
	 * @type {Array.<Level>}
	 */
	var LevelSequence = [
	  Level.INTRO
	];

	/**
	 * Начальный уровень.
	 * @type {Level}
	 */
	var INITIAL_LEVEL = LevelSequence[0];

	/**
	 * Допустимые виды объектов на карте.
	 * @enum {number}
	 */
	var ObjectType = {
	  'ME': 0,
	  'FIREBALL': 1
	};

	/**
	 * Допустимые состояния объектов.
	 * @enum {number}
	 */
	var ObjectState = {
	  'OK': 0,
	  'DISPOSED': 1
	};

	/**
	 * Коды направлений.
	 * @enum {number}
	 */
	var Direction = {
	  NULL: 0,
	  LEFT: 1,
	  RIGHT: 2,
	  UP: 4,
	  DOWN: 8
	};

	/**
	 * Правила перерисовки объектов в зависимости от состояния игры.
	 * @type {Object.<ObjectType, function(Object, Object, number): Object>}
	 */
	var ObjectsBehaviour = {};

	/**
	 * Обновление движения мага. Движение мага зависит от нажатых в данный момент
	 * стрелок. Маг может двигаться одновременно по горизонтали и по вертикали.
	 * На движение мага влияет его пересечение с препятствиями.
	 * @param {Object} object
	 * @param {Object} state
	 * @param {number} timeframe
	 */
	ObjectsBehaviour[ObjectType.ME] = function(object, state, timeframe) {
	  // Пока зажата стрелка вверх, маг сначала поднимается, а потом левитирует
	  // в воздухе на определенной высоте.
	  // NB! Сложность заключается в том, что поведение описано в координатах
	  // канваса, а не координатах, относительно нижней границы игры.
	  if (state.keysPressed.UP && object.y > 0) {
	    object.direction = object.direction & ~Direction.DOWN;
	    object.direction = object.direction | Direction.UP;
	    object.y -= object.speed * timeframe * 2;

	    if (object.y < 0) {
	      object.y = 0;
	    }
	  }

	  // Если стрелка вверх не зажата, а маг находится в воздухе, он плавно
	  // опускается на землю.
	  if (!state.keysPressed.UP) {
	    if (object.y < HEIGHT - object.height) {
	      object.direction = object.direction & ~Direction.UP;
	      object.direction = object.direction | Direction.DOWN;
	      object.y += object.speed * timeframe / 3;
	    } else {
	      object.Direction = object.direction & ~Direction.DOWN;
	    }
	  }

	  // Если зажата стрелка влево, маг перемещается влево.
	  if (state.keysPressed.LEFT) {
	    object.direction = object.direction & ~Direction.RIGHT;
	    object.direction = object.direction | Direction.LEFT;
	    object.x -= object.speed * timeframe;
	  }

	  // Если зажата стрелка вправо, маг перемещается вправо.
	  if (state.keysPressed.RIGHT) {
	    object.direction = object.direction & ~Direction.LEFT;
	    object.direction = object.direction | Direction.RIGHT;
	    object.x += object.speed * timeframe;
	  }

	  // Ограничения по перемещению по полю. Маг не может выйти за пределы поля.
	  if (object.y < 0) {
	    object.y = 0;
	    object.Direction = object.direction & ~Direction.DOWN;
	    object.Direction = object.direction & ~Direction.UP;
	  }

	  if (object.y > HEIGHT - object.height) {
	    object.y = HEIGHT - object.height;
	    object.Direction = object.direction & ~Direction.DOWN;
	    object.Direction = object.direction & ~Direction.UP;
	  }

	  if (object.x < 0) {
	    object.x = 0;
	  }

	  if (object.x > WIDTH - object.width) {
	    object.x = WIDTH - object.width;
	  }
	};

	/**
	 * Обновление движения файрбола. Файрбол выпускается в определенном направлении
	 * и после этого неуправляемо движется по прямой в заданном направлении. Если
	 * он пролетает весь экран насквозь, он исчезает.
	 * @param {Object} object
	 * @param {Object} state
	 * @param {number} timeframe
	 */
	ObjectsBehaviour[ObjectType.FIREBALL] = function(object, state, timeframe) {
	  if (object.direction & Direction.LEFT) {
	    object.x -= object.speed * timeframe;
	  }

	  if (object.direction & Direction.RIGHT) {
	    object.x += object.speed * timeframe;
	  }

	  if (object.x < 0 || object.x > WIDTH) {
	    object.state = ObjectState.DISPOSED;
	  }
	};

	/**
	 * ID возможных ответов функций, проверяющих успех прохождения уровня.
	 * CONTINUE говорит о том, что раунд не закончен и игру нужно продолжать,
	 * WIN о том, что раунд выигран, FAIL — о поражении. PAUSE о том, что игру
	 * нужно прервать.
	 * @enum {number}
	 */
	var Verdict = {
	  'CONTINUE': 0,
	  'WIN': 1,
	  'FAIL': 2,
	  'PAUSE': 3,
	  'INTRO': 4
	};

	/**
	 * Правила завершения уровня. Ключами служат ID уровней, значениями функции
	 * принимающие на вход состояние уровня и возвращающие true, если раунд
	 * можно завершать или false если нет.
	 * @type {Object.<Level, function(Object):boolean>}
	 */
	var LevelsRules = {};

	/**
	 * Уровень считается пройденным, если был выпущен файлболл и он улетел
	 * за экран.
	 * @param {Object} state
	 * @return {Verdict}
	 */
	LevelsRules[Level.INTRO] = function(state) {
	  var fireballs = state.garbage.filter(function(object) {
	    return object.type === ObjectType.FIREBALL;
	  });

	  return fireballs.length ? Verdict.WIN : Verdict.CONTINUE;
	};

	/**
	 * Начальные условия для уровней.
	 * @enum {Object.<Level, function>}
	 */
	var LevelsInitialize = {};

	/**
	 * Первый уровень.
	 * @param {Object} state
	 * @return {Object}
	 */
	LevelsInitialize[Level.INTRO] = function(state) {
	  state.objects.push(
	    // Установка персонажа в начальное положение. Он стоит в крайнем левом
	    // углу экрана, глядя вправо. Скорость перемещения персонажа на этом
	    // уровне равна 2px за кадр.
	    {
	      direction: Direction.RIGHT,
	      height: 84,
	      speed: 2,
	      sprite: 'img/wizard.gif',
	      spriteReversed: 'img/wizard-reversed.gif',
	      state: ObjectState.OK,
	      type: ObjectType.ME,
	      width: 61,
	      x: WIDTH / 3,
	      y: HEIGHT - 100
	    }
	  );

	  return state;
	};

	/**
	 * Конструктор объекта Game. Создает canvas, добавляет обработчики событий
	 * и показывает приветственный экран.
	 * @param {Element} container
	 * @constructor
	 */
	var Game = function(container) {
	  this.container = container;
	  this.canvas = document.createElement('canvas');
	  this.canvas.width = container.clientWidth;
	  this.canvas.height = container.clientHeight;
	  this.container.appendChild(this.canvas);

	  this.ctx = this.canvas.getContext('2d');

	  this._onKeyDown = this._onKeyDown.bind(this);
	  this._onKeyUp = this._onKeyUp.bind(this);
	  this._pauseListener = this._pauseListener.bind(this);
	};

	Game.prototype = {
	  /**
	   * Текущий уровень игры.
	   * @type {Level}
	   */
	  level: INITIAL_LEVEL,

	  /**
	   * Состояние игры. Описывает местоположение всех объектов на игровой карте
	   * и время проведенное на уровне и в игре.
	   * @return {Object}
	   */
	  getInitialState: function() {
	    return {
	      // Статус игры. Если CONTINUE, то игра продолжается.
	      currentStatus: Verdict.CONTINUE,

	      // Объекты, удаленные на последнем кадре.
	      garbage: [],

	      // Время с момента отрисовки предыдущего кадра.
	      lastUpdated: null,

	      // Состояние нажатых клавиш.
	      keysPressed: {
	        ESC: false,
	        LEFT: false,
	        RIGHT: false,
	        SPACE: false,
	        UP: false
	      },

	      // Время начала прохождения уровня.
	      levelStartTime: null,

	      // Все объекты на карте.
	      objects: [],

	      // Время начала прохождения игры.
	      startTime: null
	    };
	  },

	  /**
	   * Начальные проверки и запуск текущего уровня.
	   * @param {Level=} level
	   * @param {boolean=} restart
	   */
	  initializeLevelAndStart: function(level, restart) {
	    level = typeof level === 'undefined' ? this.level : level;
	    restart = typeof restart === 'undefined' ? true : restart;

	    if (restart || !this.state) {
	      // При перезапуске уровня, происходит полная перезапись состояния
	      // игры из изначального состояния.
	      this.state = this.getInitialState();
	      this.state = LevelsInitialize[this.level](this.state);
	    } else {
	      // При продолжении уровня состояние сохраняется, кроме записи о том,
	      // что состояние уровня изменилось с паузы на продолжение игры.
	      this.state.currentStatus = Verdict.CONTINUE;
	    }

	    // Запись времени начала игры и времени начала уровня.
	    this.state.levelStartTime = Date.now();
	    if (!this.state.startTime) {
	      this.state.startTime = this.state.levelStartTime;
	    }

	    this._preloadImagesForLevel(function() {
	      // Предварительная отрисовка игрового экрана.
	      this.render();

	      // Установка обработчиков событий.
	      this._initializeGameListeners();

	      // Запуск игрового цикла.
	      this.update();
	    }.bind(this));
	  },

	  /**
	   * Временная остановка игры.
	   * @param {Verdict=} verdict
	   */
	  pauseLevel: function(verdict) {
	    if (verdict) {
	      this.state.currentStatus = verdict;
	    }

	    this.state.keysPressed.ESC = false;
	    this.state.lastUpdated = null;

	    this._removeGameListeners();
	    window.addEventListener('keydown', this._pauseListener);

	    this._drawPauseScreen();
	  },

	  /**
	   * Обработчик событий клавиатуры во время паузы.
	   * @param {KeyboardsEvent} evt
	   * @private
	   * @private
	   */
	  _pauseListener: function(evt) {
	    if (evt.keyCode === 32) {
	      evt.preventDefault();
	      var needToRestartTheGame = this.state.currentStatus === Verdict.WIN ||
	          this.state.currentStatus === Verdict.FAIL;
	      this.initializeLevelAndStart(this.level, needToRestartTheGame);

	      window.removeEventListener('keydown', this._pauseListener);
	    }
	  },

	  _drawMessage: function(text, parameters) {
	    // Если не заданы параметры, то используются параметры по умолчанию
	    if (typeof (parameters) === 'undefined') {
	      parameters = {
	        top: 75,
	        left: 310,
	        width: 300,
	        height: 150
	      };
	    }
	    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
	    this.ctx.fillRect(parameters.left + 10, parameters.top + 10, parameters.width, parameters.height);
	    this.ctx.fillStyle = '#FFFFFF';
	    this.ctx.fillRect(parameters.left, parameters.top, parameters.width, parameters.height);
	    this.ctx.fillStyle = '#000000';
	    this.ctx.font = 'bold 16px PT Mono';

	    // Преобразование введенной строки текста в массив
	    var textArray = text.split(' ');

	    // Отрисовка текста на одной строчке
	    var currentWidth = 0;
	    var spaceWidth = this.ctx.measureText(' ').width;
	    for (var i = 0; i < textArray.length; i++) {
	      currentWidth += this.ctx.measureText(textArray[i]).width;
	      // Рисуем текст, пока он влазит в ширину прямоугольника
	      if (currentWidth < (parameters.width - 40)) {
	        this.ctx.fillText(textArray[i], parameters.left + 20 + currentWidth - this.ctx.measureText(textArray[i]).width, parameters.top + 30);
	      } else {
	        // Переход на следующую строчку
	        parameters.top += 20;
	        this.ctx.fillText(textArray[i], parameters.left + 20, parameters.top + 30);
	        currentWidth = this.ctx.measureText(textArray[i]).width;
	      }
	      currentWidth += spaceWidth;
	    }
	  },

	  /**
	   * Отрисовка экрана паузы.
	   */
	  _drawPauseScreen: function() {
	    switch (this.state.currentStatus) {
	      case Verdict.WIN:
	        this._drawMessage('Поздравляем! Уровень пройден успешно. Для продолжения игры нажмите пробел.');
	        break;
	      case Verdict.FAIL:
	        this._drawMessage('К сожалению, вы проиграли... Нажмите пробел для рестарта.');
	        break;
	      case Verdict.PAUSE:
	        this._drawMessage('Вы поставили игру на паузу. Для возобновления игры нажмите пробел.');
	        break;
	      case Verdict.INTRO:
	        this._drawMessage('Я умею ходить вперед-назад и летать! Нажимай на стрелки! А еще я стреляю файрболом. Нажимай на shift!');
	        break;
	    }
	  },

	  /**
	   * Предзагрузка необходимых изображений для уровня.
	   * @param {function} callback
	   * @private
	   */
	  _preloadImagesForLevel: function(callback) {
	    if (typeof this._imagesArePreloaded === 'undefined') {
	      this._imagesArePreloaded = [];
	    }

	    if (this._imagesArePreloaded[this.level]) {
	      callback();
	      return;
	    }

	    var levelImages = [];
	    this.state.objects.forEach(function(object) {
	      levelImages.push(object.sprite);

	      if (object.spriteReversed) {
	        levelImages.push(object.spriteReversed);
	      }
	    });

	    var i = levelImages.length;
	    var imagesToGo = levelImages.length;

	    while (i-- > 0) {
	      var image = new Image();
	      image.src = levelImages[i];
	      image.onload = function() {
	        if (--imagesToGo === 0) {
	          this._imagesArePreloaded[this.level] = true;
	          callback();
	        }
	      }.bind(this);
	    }
	  },

	  /**
	   * Обновление статуса объектов на экране. Добавляет объекты, которые должны
	   * появиться, выполняет проверку поведения всех объектов и удаляет те, которые
	   * должны исчезнуть.
	   * @param {number} delta Время, прошеднее с отрисовки прошлого кадра.
	   */
	  updateObjects: function(delta) {
	    // Персонаж.
	    var me = this.state.objects.filter(function(object) {
	      return object.type === ObjectType.ME;
	    })[0];

	    // Добавляет на карту файрбол по нажатию на Shift.
	    if (this.state.keysPressed.SHIFT) {
	      this.state.objects.push({
	        direction: me.direction,
	        height: 24,
	        speed: 5,
	        sprite: 'img/fireball.gif',
	        type: ObjectType.FIREBALL,
	        width: 24,
	        x: me.direction & Direction.RIGHT ? me.x + me.width : me.x - 24,
	        y: me.y + me.height / 2
	      });

	      this.state.keysPressed.SHIFT = false;
	    }

	    this.state.garbage = [];

	    // Убирает в garbage не используемые на карте объекты.
	    var remainingObjects = this.state.objects.filter(function(object) {
	      ObjectsBehaviour[object.type](object, this.state, delta);

	      if (object.state === ObjectState.DISPOSED) {
	        this.state.garbage.push(object);
	        return false;
	      }

	      return true;
	    }, this);

	    this.state.objects = remainingObjects;
	  },

	  /**
	   * Проверка статуса текущего уровня.
	   */
	  checkStatus: function() {
	    // Нет нужны запускать проверку, нужно ли останавливать уровень, если
	    // заранее известно, что да.
	    if (this.state.currentStatus !== Verdict.CONTINUE) {
	      return;
	    }

	    if (!this.commonRules) {
	      /**
	       * Проверки, не зависящие от уровня, но влияющие на его состояние.
	       * @type {Array.<functions(Object):Verdict>}
	       */
	      this.commonRules = [
	        /**
	         * Если персонаж мертв, игра прекращается.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkDeath(state) {
	          var me = state.objects.filter(function(object) {
	            return object.type === ObjectType.ME;
	          })[0];

	          return me.state === ObjectState.DISPOSED ?
	              Verdict.FAIL :
	              Verdict.CONTINUE;
	        },

	        /**
	         * Если нажата клавиша Esc игра ставится на паузу.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkKeys(state) {
	          return state.keysPressed.ESC ? Verdict.PAUSE : Verdict.CONTINUE;
	        },

	        /**
	         * Игра прекращается если игрок продолжает играть в нее два часа подряд.
	         * @param {Object} state
	         * @return {Verdict}
	         */
	        function checkTime(state) {
	          return Date.now() - state.startTime > 3 * 60 * 1000 ?
	              Verdict.FAIL :
	              Verdict.CONTINUE;
	        }
	      ];
	    }

	    // Проверка всех правил влияющих на уровень. Запускаем цикл проверок
	    // по всем универсальным проверкам и проверкам конкретного уровня.
	    // Цикл продолжается до тех пор, пока какая-либо из проверок не вернет
	    // любое другое состояние кроме CONTINUE или пока не пройдут все
	    // проверки. После этого состояние сохраняется.
	    var allChecks = this.commonRules.concat(LevelsRules[this.level]);
	    var currentCheck = Verdict.CONTINUE;
	    var currentRule;

	    while (currentCheck === Verdict.CONTINUE && allChecks.length) {
	      currentRule = allChecks.shift();
	      currentCheck = currentRule(this.state);
	    }

	    this.state.currentStatus = currentCheck;
	  },

	  /**
	   * Принудительная установка состояния игры. Используется для изменения
	   * состояния игры от внешних условий, например, когда необходимо остановить
	   * игру, если она находится вне области видимости и установить вводный
	   * экран.
	   * @param {Verdict} status
	   */
	  setGameStatus: function(status) {
	    if (this.state.currentStatus !== status) {
	      this.state.currentStatus = status;
	    }
	  },

	  /**
	   * Отрисовка всех объектов на экране.
	   */
	  render: function() {
	    // Удаление всех отрисованных на странице элементов.
	    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

	    // Выставление всех элементов, оставшихся в this.state.objects согласно
	    // их координатам и направлению.
	    this.state.objects.forEach(function(object) {
	      if (object.sprite) {
	        var image = new Image(object.width, object.height);
	        image.src = (object.spriteReversed && object.direction & Direction.LEFT) ?
	            object.spriteReversed :
	            object.sprite;
	        this.ctx.drawImage(image, object.x, object.y, object.width, object.height);
	      }
	    }, this);
	  },

	  /**
	   * Основной игровой цикл. Сначала проверяет состояние всех объектов игры
	   * и обновляет их согласно правилам их поведения, а затем запускает
	   * проверку текущего раунда. Рекурсивно продолжается до тех пор, пока
	   * проверка не вернет состояние FAIL, WIN или PAUSE.
	   */
	  update: function() {
	    if (!this.state.lastUpdated) {
	      this.state.lastUpdated = Date.now();
	    }

	    var delta = (Date.now() - this.state.lastUpdated) / 10;
	    this.updateObjects(delta);
	    this.checkStatus();

	    switch (this.state.currentStatus) {
	      case Verdict.CONTINUE:
	        this.state.lastUpdated = Date.now();
	        this.render();
	        requestAnimationFrame(function() {
	          this.update();
	        }.bind(this));
	        break;

	      case Verdict.WIN:
	      case Verdict.FAIL:
	      case Verdict.PAUSE:
	      case Verdict.INTRO:
	      default:
	        this.pauseLevel();
	        break;
	    }
	  },

	  /**
	   * @param {KeyboardEvent} evt [description]
	   * @private
	   */
	  _onKeyDown: function(evt) {
	    switch (evt.keyCode) {
	      case 37:
	        this.state.keysPressed.LEFT = true;
	        break;
	      case 39:
	        this.state.keysPressed.RIGHT = true;
	        break;
	      case 38:
	        this.state.keysPressed.UP = true;
	        break;
	      case 27:
	        this.state.keysPressed.ESC = true;
	        break;
	    }

	    if (evt.shiftKey) {
	      this.state.keysPressed.SHIFT = true;
	    }
	  },

	  /**
	   * @param {KeyboardEvent} evt [description]
	   * @private
	   */
	  _onKeyUp: function(evt) {
	    switch (evt.keyCode) {
	      case 37:
	        this.state.keysPressed.LEFT = false;
	        break;
	      case 39:
	        this.state.keysPressed.RIGHT = false;
	        break;
	      case 38:
	        this.state.keysPressed.UP = false;
	        break;
	      case 27:
	        this.state.keysPressed.ESC = false;
	        break;
	    }

	    if (evt.shiftKey) {
	      this.state.keysPressed.SHIFT = false;
	    }
	  },

	  /** @private */
	  _initializeGameListeners: function() {
	    window.addEventListener('keydown', this._onKeyDown);
	    window.addEventListener('keyup', this._onKeyUp);
	  },

	  /** @private */
	  _removeGameListeners: function() {
	    window.removeEventListener('keydown', this._onKeyDown);
	    window.removeEventListener('keyup', this._onKeyUp);
	  }
	};

	/**
	 * Движение облаков при скролле
	 */
	var scrollTimeout;

	window.addEventListener('scroll', function() {
	  var clouds = document.querySelector('.header-clouds');
	  var cloudsCoordinates = clouds.getBoundingClientRect();

	  /**
	   * Проверка видимости блока с облаками
	  */
	  function isCloudsVisible() {
	    return (-cloudsCoordinates.top <= cloudsCoordinates.height);
	  }

	  clearTimeout(scrollTimeout);
	  scrollTimeout = setTimeout(function() {
	    // Проверка видимости блока с облаками не чаще 1 раза в 100мс
	    isCloudsVisible();
	  }, 100);
	  // Смещаем облака только, если блок с облаками виден
	  if (isCloudsVisible()) {
	    clouds.style.backgroundPosition = -cloudsCoordinates.top + 'px ' + '0px';
	  }
	});

	window.Game = Game;
	window.Game.Verdict = Verdict;

	var game = new Game(document.querySelector('.demo'));
	game.initializeLevelAndStart();
	game.setGameStatus(Game.Verdict.INTRO);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(3);

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

	formOpenButton.onclick = function(evt) {
	  evt.preventDefault();
	  formContainer.classList.remove('invisible');
	};

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

	// Сохранение оценки и имени пользователя в cookies при отправке формы
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


/***/ },
/* 3 */
/***/ function(module, exports) {

	/**
	 * @fileoverview Библиотека для удобной работы с cookie.
	 */

	var docCookies = {
	  /**
	   * Возвращает значение cookie с переданным ключом sKey.
	   * @param {string} sKey
	   * @return {string}
	   */
	  getItem: function (sKey) {
	    if (!sKey) { return null; }
	    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
	  },

	  /**
	   * Устанавливает cookie с названием sKey и значением sValue. Остальные параметры
	   * необязательны и используются для более точного задания параметров cookie:
	   * срок жизни cookie, домен и путь. bSecure указывает что cookie можно передавать
	   * только по безопасному соединению.
	   * @param {string} sKey
	   * @param {string} sValue
	   * @param {number|Date|string=} vEnd Срок жизни cookie. Может передаваться
	   *     как дата, строка или число.
	   * @param {string=} sPath
	   * @param {string=} sDomain
	   * @param {boolean=} bSecure
	   */
	  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
	    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
	    var sExpires = "";
	    if (vEnd) {
	      switch (vEnd.constructor) {
	        case Number:
	          sExpires = !isFinite(vEnd) ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + (vEnd / 1000);
	          break;
	        case String:
	          sExpires = "; expires=" + vEnd;
	          break;
	        case Date:
	          sExpires = "; expires=" + vEnd.toUTCString();
	          break;
	      }
	    }
	    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
	    return true;
	  },

	  /**
	   * Удаляет cookie по переданному ключу. sPath и sDomain необязательные параметры.
	   * @param {string} sKey
	   * @param {string} sPath
	   * @param {string} sDomain
	   * @return {boolean} Ключ, успешно ли произошло удаление. Равен false, если cookie
	   *     с таким названием нет.
	   */
	  removeItem: function (sKey, sPath, sDomain) {
	    if (!this.hasItem(sKey)) { return false; }
	    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "");
	    return true;
	  },

	  /**
	   * Проверяет, действительно ли существует cookie с переданным названием.
	   * @param {string} sKey
	   * @return {boolean}
	   */
	  hasItem: function (sKey) {
	    if (!sKey) { return false; }
	    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
	  },

	  /**
	   * Возвращает все ключи, установленных cookie.
	   * @return {Array.<string>}
	   */
	  keys: function () {
	    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
	    for (var nLen = aKeys.length, nIdx = 0; nIdx < nLen; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
	    return aKeys;
	  }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ReviewData = __webpack_require__(5);
	var ReviewBase = __webpack_require__(6);

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


/***/ },
/* 5 */
/***/ function(module, exports) {

	'use strict';

	/**
	* @param {Object} data
	* @constructor
	*/
	var ReviewData = function(data) {
	  this.params = data;
	};

	// Получение текста отзыва
	ReviewData.prototype.getDescription = function() {
	  return this.params.description;
	};

	// Получение рейтинга
	ReviewData.prototype.getRating = function() {
	  return this.params.rating;
	};

	// Получение имени автора
	ReviewData.prototype.getAuthor = function() {
	  return this.params.author.name;
	};

	// Получение адреса картинки
	ReviewData.prototype.getImage = function() {
	  return this.params.author.picture;
	};

	// Получение адреса картинки
	ReviewData.prototype.getDate = function() {
	  return this.params.date;
	};

	// Получение оценки полезности отзыва
	ReviewData.prototype.getUsefulness = function() {
	  return this.params.review_usefulness;
	};

	module.exports = ReviewData;


/***/ },
/* 6 */
/***/ function(module, exports) {

	'use strict';

	/**
	* @constructor
	*/
	var ReviewBase = function() {};

	ReviewBase.prototype._data = null;

	ReviewBase.prototype.setData = function(data) {
	  this._data = data;
	};

	/**
	* Отрисовка элемента отзыва в списке
	*/
	ReviewBase.prototype.render = function() {
	  var template = document.querySelector('#review-template');
	  if ('content' in template) {
	    this.element = template.content.querySelector('.review').cloneNode(true);
	  } else {
	    this.element = template.querySelector('.review').cloneNode(true);
	  }

	  // Вывод текста отзыва
	  this.element.querySelector('.review-text').textContent = this._data.getDescription();

	  // Вывод рейтинга
	  var rating = this._data.getRating();
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
	  this.element.querySelector('.review-rating').classList.add('review-rating-' + ratingMark);

	  // Загрузка изображений
	  var reviewImage = new Image(124, 124);
	  reviewImage.onload = function() {
	    clearTimeout(imageLoadTimeout);
	    reviewImage.classList.add('review-author');
	    reviewImage.setAttribute('alt', this._data.getAuthor());
	    reviewImage.setAttribute('title', this._data.getAuthor());
	    this.element.replaceChild(reviewImage, this.element.querySelector('.review-author'));
	  }.bind(this);
	  reviewImage.onerror = function() {
	    this.element.classList.add('review-load-failure');
	  }.bind(this);
	  reviewImage.src = this._data.getImage();

	  var IMAGE_TIMEOUT = 10000;
	  var imageLoadTimeout = setTimeout(function() {
	    this.element.querySelector('.review-author').setAttribute('src', '');
	    this.element.classList.add('review-load-failure');
	  }, IMAGE_TIMEOUT);

	  // Запись имени автора в атрибуты alt и title незагрузившейся картинки
	  this.element.querySelector('.review-author').setAttribute('alt', this._data.getAuthor());
	  this.element.querySelector('.review-author').setAttribute('title', this._data.getAuthor());
	};

	module.exports = ReviewBase;


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Photo = __webpack_require__(8);
	var gallery = __webpack_require__(9);

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


/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	/**
	* @constructor
	*/
	function Photo(src) {
	  this.src = src;
	}

	module.exports = Photo;


/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

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
	    var photoImage = new Image();
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

	module.exports = new Gallery();


/***/ }
/******/ ]);