// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"calc.ts":[function(require,module,exports) {
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//MARKET VALUES
var MAX_DELTA_MARKET_PERCENT = 3;
var IS_NODE = typeof window === 'undefined';

var fixNumber = function fixNumber() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var point = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 6;
  return parseFloat(num.toFixed(point));
};

var getPercentDiff = function getPercentDiff() {
  var from = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var to = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return fixNumber(Math.abs(from - to) / from * 100);
};

var addPercent = function addPercent() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.abs(fixNumber(value * (100 + percent) / 100));
};

var subPercent = function subPercent() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Math.abs(fixNumber(value * (100 - percent) / 100));
};
/**
 * INPUT PARAMS
 */


var SettingItem = /*#__PURE__*/function () {
  function SettingItem(name, value, placeholder) {
    _classCallCheck(this, SettingItem);

    this.name = name;
    var ramValue = parseFloat(localStorage.getItem(name)) || value;
    this._value = ramValue;
    this.placeholder = placeholder;
    SettingItem.items.push(this);
  }

  _createClass(SettingItem, [{
    key: "_value",
    set: function set(val) {
      if (!IS_NODE) localStorage.setItem(this.name, String(val));
      this.value = val;
    }
  }]);

  return SettingItem;
}();

SettingItem.items = [];
var COLORS;

(function (COLORS) {
  COLORS["ORANGE"] = "#cc8f2e";
  COLORS["RED"] = "#fc5252";
  COLORS["GREEN"] = "#2ecc40";
  COLORS["GREEN_DARK"] = "#70af11";
  COLORS["LIGHT"] = "#e3e3e3";
})(COLORS || (COLORS = {}));

var START_MARKET_VALUE = new SettingItem('START_MARKET_VALUE', 185, 'цена валюты входа');
var ORDER_LEN = new SettingItem('ORDER_LEN', 10, 'макс число ордеров');
var STEP_DEFAULT_PERCENT = new SettingItem('STEP_DEFAULT_PERCENT', 1, 'шаг цены дефолтный');
var STEP_DIN = new SettingItem('STEP_DIN', 1.1, 'динамический шаг цены');
var START_MART = new SettingItem('START_MART', 1.2, 'мартенгейл');
var TAKE_PROFIT_PERCENT = new SettingItem('TAKE_PROFIT_PERCENT', 0.5, 'тейк профит процент');
var START_BUY = new SettingItem('START_BUY', 18, 'первый закуп');
var MAX_LOSE_PERCENT = new SettingItem('MAX_LOSE_PERCENT', 15, 'макс падение цены в процентах');
var MAX_BUY = new SettingItem('MAX_BUY', 606, 'максимум вложений');
var orderPoints = []; //минимальная цена валюты допустимая

var MIN_END_MARKET_VALUE = subPercent(START_MARKET_VALUE.value, MAX_LOSE_PERCENT.value);

var checkMarketValid = function checkMarketValid() {
  var price = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var min = subPercent(MIN_END_MARKET_VALUE, MAX_DELTA_MARKET_PERCENT);
  var max = addPercent(MIN_END_MARKET_VALUE, MAX_DELTA_MARKET_PERCENT);
  return price > min && price < max;
};

var generateChart = function generateChart() {
  if (IS_NODE) return; //IF not DOM then break

  var chartBox = document.querySelector('#chart');
  chartBox.innerHTML = '';
  var sumBuy = START_BUY.value + orderPoints.map(function (_ref) {
    var orderPrice = _ref.orderPrice;
    return orderPrice;
  }).reduce(function (a, b) {
    return a + b;
  }, 0); //create first lines info

  chartBox.innerHTML += "\n<p style=\"margin: 0; color: ".concat(COLORS.GREEN_DARK, "\">\n\u041D\u0430\u0447\u0430\u043B\u043E \u0441\u0434\u0435\u043B\u043A\u0438 \u043F\u043E\u043A\u0443\u043F\u043A\u0430 ").concat(START_BUY.value, " USDT<br> \u0440\u044B\u043D\u043E\u043A ").concat(START_MARKET_VALUE.value, " USDT\n<br> \u043C\u0438\u043D \u0446\u0435\u043D\u0430 \u0440\u044B\u043D\u043A\u0430 ").concat(MIN_END_MARKET_VALUE, " USDT = \u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u043D\u0430 ").concat(MAX_LOSE_PERCENT.value, " % </p>\n");
  chartBox.innerHTML += "<p style=\"margin: 0; color: ".concat(sumBuy > MAX_BUY.value ? COLORS.RED : COLORS.GREEN_DARK, "\">\u0421\u0443\u043C \u0432\u043B\u043E\u0436\u0435\u043D\u0438\u044F ").concat(sumBuy, " USDT</p>");
  orderPoints.forEach(function (point, index) {
    var MIN_H = 40;
    var SIZE_KOEF = 30;
    var H_PIXELS = MIN_H + point.lastStep * SIZE_KOEF;
    var MAX_SAME_KOEF = H_PIXELS / Math.max(point.upToTp, point.sumStep); //create line item

    chartBox.innerHTML += "\n<div style=\"height: ".concat(H_PIXELS, "px; width: 100%; background-color: #313131; margin-top: 2px; display: flex; overflow: scroll; flex-direction: row;\" >\n<p style=\"padding-right: 5px; color: #929292; flex: 0.3\">\u2116").concat(index + 1, ". </p>\n<p style=\"color: ").concat(COLORS.LIGHT, "; flex: 1\">").concat(point.marketValue, " \u0446\u0435\u043D\u0430 \u0440\u044B\u043D\u043A\u0430 (USDT)</p> \n<p style=\"color: ").concat(COLORS.LIGHT, "; flex: 1\">").concat(point.orderPrice, " \u0446\u0435\u043D\u0430 \u043E\u0440\u0434\u0435\u0440\u0430 (USDT)</p>\n<p style=\"color: ").concat(COLORS.ORANGE, "; flex: 1\">").concat(point.lastStep, " (%) \u0448\u0430\u0433 \u0446\u0435\u043D\u044B</p> \n<p style=\"color: ").concat(COLORS.RED, "; flex: 1\">").concat(point.sumStep, " (%) \u0441\u0443\u043C \u043F\u0430\u0434\u0435\u043D\u0438\u0435 \u0446\u0435\u043D\u044B</p> \n<p style=\"color: ").concat(COLORS.GREEN, "; flex: 1\" >").concat(point.upToTp, " (%) \u043F\u0440\u043E\u0446\u0435\u043D\u0442 \u0442\u0440\u0435\u0431. \u0440\u043E\u0441\u0442\u0430 \u0434\u043E TP</p> \n<p style=\"color: ").concat(COLORS.GREEN_DARK, "; flex: 1\" >\u0426\u0435\u043D\u0430 \u0440\u044B\u043D\u043A\u0430 TP ").concat(addPercent(point.marketValue, point.upToTp), " USDT</p> \n<div style=\"flex: 1; flex-direction: row; display:flex; align-items: flex-end; justify-content: center\">\n    <div style=\"width: 20px; height: ").concat(point.lastStep * MAX_SAME_KOEF, "px; background-color: ").concat(COLORS.ORANGE, "\"></div>\n    <div style=\"width: 20px; height: ").concat(point.upToTp * MAX_SAME_KOEF, "px; background-color: ").concat(COLORS.GREEN, "\"></div>\n    <div style=\"width: 20px; height: ").concat(point.sumStep * MAX_SAME_KOEF, "px; background-color: ").concat(COLORS.RED, "\"></div>\n</div>\n</div>");
  });
};

var generateDom = function generateDom() {
  if (IS_NODE) return; //IF not DOM then break

  var container = document.querySelector('#inputs');
  SettingItem.items.forEach(function (_ref2) {
    var name = _ref2.name,
        placeholder = _ref2.placeholder,
        value = _ref2.value;
    container.innerHTML += "\n<p>\n<input type=\"number\" placeholder=\"".concat(placeholder, "\" value=\"").concat(value, "\" id=\"").concat(name, "\" />\n<label> ").concat(placeholder, "</label></p>\n");

    var onChange = function onChange(val) {
      SettingItem.items.find(function (_ref3) {
        var n = _ref3.name;
        return n === name;
      }).value = val;
      logCalc();
      generateChart();
    };

    document.addEventListener('input', function (e) {
      //@ts-ignore
      if (e.target && e.target.id == name && e.target.value) {
        //@ts-ignore
        var _value = Number.parseFloat(e.target.value) || 0;

        localStorage.setItem(name, String(_value));
        onChange(_value);
      }
    });
    container.innerHTML += "<hr/>";
  });
};

var logCalc = function logCalc() {
  var _console$table;

  orderPoints = [];
  console.log('START OF', new Date().toLocaleString());
  var TP_KOEF = addPercent(1, TAKE_PROFIT_PERCENT.value); //цена предыдущего ордера

  var LAST_ORDER_VALUE = START_BUY.value; //сумма вложений текущая

  var SUM_OF_BUY = START_BUY.value; //стоимотсть денег после предыдущего падения

  var LAST_MONEY_AFTER_DOWN_SUM = START_BUY.value; //текущая цена рынка

  var MARKET_VALUE = START_MARKET_VALUE.value;
  var LAST_STEP_PERCENT = STEP_DEFAULT_PERCENT.value;
  var STEP_DELTA_SUM = STEP_DEFAULT_PERCENT.value; //first buy

  console.log('start buy = ', LAST_ORDER_VALUE, 'MARKET PRICE', MARKET_VALUE);
  console.log('MARKET 1st sell price', addPercent(MARKET_VALUE, TAKE_PROFIT_PERCENT.value));
  console.log('START TP = ', LAST_ORDER_VALUE * TP_KOEF + '\n___');
  console.log('\nПараметры для бота');
  console.table((_console$table = {}, _defineProperty(_console$table, 'Мартенгейл', START_MART.value), _defineProperty(_console$table, 'Динамический шаг СО', STEP_DIN.value), _defineProperty(_console$table, 'Шаг СО(%)', STEP_DEFAULT_PERCENT.value), _defineProperty(_console$table, 'Take profit (%)', TAKE_PROFIT_PERCENT.value), _defineProperty(_console$table, 'Макс. Число ордеров', ORDER_LEN.value), _defineProperty(_console$table, 'Макс сумм депозит($)', MAX_BUY.value), _defineProperty(_console$table, 'Нач цена рынка (вход)', START_MARKET_VALUE.value), _defineProperty(_console$table, 'Мин цена рынка (ласт ордер)', MIN_END_MARKET_VALUE), _console$table));

  for (var i = 0; i < ORDER_LEN.value; i++) {
    var _console$table2;

    //текущ цена рынка валюты
    MARKET_VALUE = subPercent(MARKET_VALUE, LAST_STEP_PERCENT); //реальная стоимость денег после падения на этом уровне

    var MONEY_AFTER_DOWN = subPercent(LAST_MONEY_AFTER_DOWN_SUM, LAST_STEP_PERCENT); //покупка нового ордера

    var ORDER_VALUE = fixNumber(LAST_ORDER_VALUE * START_MART.value);
    SUM_OF_BUY += ORDER_VALUE;
    LAST_ORDER_VALUE = ORDER_VALUE; //Реальная сум стоимость денег после падения в сумме с новым ордером

    var SUM_REAL_CURRENT_MONEY = MONEY_AFTER_DOWN + ORDER_VALUE; //сохраняем значение стоимости денег. чтобы использовать его в слд цикле

    LAST_MONEY_AFTER_DOWN_SUM = SUM_REAL_CURRENT_MONEY; //(потеря денег при продаже на текущ. уровне) расчитаем разницу в стоимости денег суммарной и вложенных деньгах

    var DELTA_RESET_MONEY = SUM_OF_BUY - SUM_REAL_CURRENT_MONEY; //(процент роста треб-ый для откупа) разница в процентах от стоимости денег и вложенными деньгами

    var DELTA_RESET_PERCENT = getPercentDiff(SUM_REAL_CURRENT_MONEY, SUM_OF_BUY); //процент треб-го роста от цены ордера до тейка

    var FULL_TP_PERCENT_FROM_ORDER = getPercentDiff(SUM_REAL_CURRENT_MONEY, addPercent(SUM_OF_BUY, TAKE_PROFIT_PERCENT.value)); //цена раныка валюты для откупа

    var RESET_MONEY_VALUE = addPercent(MARKET_VALUE, DELTA_RESET_PERCENT); //цена рынка валюты для получения тейк профита

    var TP_MARKET_PRICE = addPercent(MARKET_VALUE, FULL_TP_PERCENT_FROM_ORDER); //реальная цена денег при возрастании от уровня ордера до тейк профита

    var TP_SELL_SUM_VALUE = addPercent(SUM_OF_BUY, TAKE_PROFIT_PERCENT.value); //доход от продажи тейк профита

    var SALARY_FROM_SELL_TP = TP_SELL_SUM_VALUE - SUM_OF_BUY; //buy order (price down)

    var IS_VALID_SUM = SUM_OF_BUY <= MAX_BUY.value;
    var IS_VALID_MARKET_PRICE = checkMarketValid(MARKET_VALUE);
    var MARKET_DELTA_RESULT = getPercentDiff(MIN_END_MARKET_VALUE, MARKET_VALUE);
    console.table((_console$table2 = {}, _defineProperty(_console$table2, '🌧 куплен СО (USD)', ORDER_VALUE), _defineProperty(_console$table2, '🚷 Потери при продаже на этом уровне (usd)', DELTA_RESET_MONEY), _defineProperty(_console$table2, '🚶 последний шаг падения цены СО (%)', LAST_STEP_PERCENT), _defineProperty(_console$table2, '📉 сумарное падение цены (%)', getPercentDiff(START_MARKET_VALUE.value, MARKET_VALUE)), _defineProperty(_console$table2, '🌧 следующий ордер СО может быть на уровне', subPercent(MARKET_VALUE, LAST_STEP_PERCENT * STEP_DIN.value)), _defineProperty(_console$table2, (IS_VALID_MARKET_PRICE ? '✅' : '⛔️') + ' текушая цена валюты (крипты)', MARKET_VALUE), _defineProperty(_console$table2, '📈 ✅ цена валюты Take Profit (крипты)', TP_MARKET_PRICE), _defineProperty(_console$table2, 'отклонение цены от мин допустимой', "".concat(MARKET_DELTA_RESULT, "% from max ").concat(MAX_DELTA_MARKET_PERCENT, "%")), _defineProperty(_console$table2, '👇 стоимость денег после падения', SUM_REAL_CURRENT_MONEY), _defineProperty(_console$table2, (IS_VALID_SUM ? '👍' : '⛔️') + ' суммарные текущие вложения', SUM_OF_BUY), _defineProperty(_console$table2, '💸 сумма денег для продажи Take Profit', TP_SELL_SUM_VALUE), _defineProperty(_console$table2, 'Цена валюты для откупа всех вложенных денег (крипты)', RESET_MONEY_VALUE), _defineProperty(_console$table2, '⬆️ Процент треб. роста для продажи TP', "".concat(FULL_TP_PERCENT_FROM_ORDER, " %")), _defineProperty(_console$table2, '🦺 Процент падения от уровня закупа до продажи TP (страховка)', getPercentDiff(START_MARKET_VALUE.value, TP_MARKET_PRICE)), _defineProperty(_console$table2, '✅ Доход от продажи Take Profit (USD)', SALARY_FROM_SELL_TP), _console$table2));
    orderPoints.push({
      orderPrice: ORDER_VALUE,
      marketValue: MARKET_VALUE,
      lastStep: LAST_STEP_PERCENT,
      sumStep: STEP_DELTA_SUM,
      upToTp: FULL_TP_PERCENT_FROM_ORDER
    });
    console.log(" \u0421\u0442\u0440\u0430\u0445\u043E\u0432\u043E\u0447\u043D\u044B\u0439 \u043E\u0440\u0434\u0435\u0440 ".concat(i + 1, " \n")); //перед началом след цикла (в конце предыдущего)

    STEP_DELTA_SUM = fixNumber(STEP_DELTA_SUM + LAST_STEP_PERCENT);
    LAST_STEP_PERCENT = fixNumber(LAST_STEP_PERCENT * STEP_DIN.value);
  }
};

generateDom();
logCalc();
generateChart();
},{}]