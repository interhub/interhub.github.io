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

// const jq = require('jquery')
//MARKET VALUES
var START_MARKET_VALUE = 185;
var MAX_DELTA_MARKET_PERCENT = 3;

var fixNumber = function fixNumber() {
  var num = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var point = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
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
  return fixNumber(value * (100 + percent) / 100);
};

var subPercent = function subPercent() {
  var value = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var percent = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return fixNumber(value * (100 - percent) / 100);
};

var checkMarketValid = function checkMarketValid() {
  var price = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
  var min = subPercent(MIN_END_MARKET_VALUE, MAX_DELTA_MARKET_PERCENT);
  var max = addPercent(MIN_END_MARKET_VALUE, MAX_DELTA_MARKET_PERCENT);
  return price > min && price < max;
};
/**
 * INPUT PARAMS
 */


var SettingItem = function SettingItem(name, value, placeholder) {
  _classCallCheck(this, SettingItem);

  this.name = name;
  this.value = value;
  this.placeholder = placeholder;
  SettingItem.items.push(this);
};

SettingItem.items = [];
var ORDER_LEN = new SettingItem('ORDER_LEN', 10, 'макс число ордеров');
var STEP_DEFAULT_PERCENT = new SettingItem('STEP_DEFAULT_PERCENT', 1, 'шаг цены дефолтный');
var STEP_DIN = new SettingItem('STEP_DIN', 1.1, 'динамический шаг цены');
var START_MART = new SettingItem('START_MART', 1.2, 'мартенгейл');
var TAKE_PROFIT_PERCENT = new SettingItem('TAKE_PROFIT_PERCENT', 0.5, 'тейк профит процент');
var START_BUY = new SettingItem('START_BUY', 18, 'первый закуп');
var MAX_LOSE_PERCENT = new SettingItem('MAX_LOSE_PERCENT', 15, 'макс падение цены в процентах');
var MAX_BUY = new SettingItem('MAX_BUY', 606, 'максимум вложений'); //минимальная цена валюты допустимая

var MIN_END_MARKET_VALUE = subPercent(START_MARKET_VALUE, MAX_LOSE_PERCENT.value);
var MARKET_VALUE = START_MARKET_VALUE;
var orderPoints = [];

var generateChart = function generateChart() {
  if (typeof window === 'undefined') return; //IF not DOM then break

  var chartBox = document.querySelector('#chart');
  orderPoints.forEach(function (point, index) {
    var SIZE_KOEF = 30;
    var H_PIXELS = point.lastStep * SIZE_KOEF;
    chartBox.innerHTML += "\n<div style=\"height: ".concat(H_PIXELS, "px; width: 100%; background-color: #313131\" >\n<p style=\"margin: 3px; color: #fff\">\n").concat(point.marketValue, " \u0446\u0435\u043D\u0430 \u0440\u044B\u043D\u043A\u0430 (USDT) /\n").concat(point.orderPrice, " \u0446\u0435\u043D\u0430 \u043E\u0440\u0434\u0435\u0440\u0430 (USDT) /\n").concat(point.lastStep, " \u0448\u0430\u0433 \u0446\u0435\u043D\u044B (%)\n</p>\n</div>");
  });
};

var generateDom = function generateDom() {
  if (typeof window === 'undefined') return; //IF not DOM then break

  var container = document.querySelector('#inputs');
  SettingItem.items.forEach(function (_ref) {
    var name = _ref.name,
        placeholder = _ref.placeholder,
        value = _ref.value;
    container.innerHTML += "\n<p>\n<input type=\"text\" placeholder=\"".concat(placeholder, "\" value=\"").concat(value, "\" id=\"").concat(name, "\" />\n<label> ").concat(placeholder, "</label></p>\n");

    var onChange = function onChange(val) {
      SettingItem.items.find(function (_ref2) {
        var n = _ref2.name;
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
  var TP_KOEF = addPercent(1, TAKE_PROFIT_PERCENT.value); //computed

  var LAST_ORDER_VALUE = START_BUY.value;
  var SUM_OF_BUY = START_BUY.value;
  var LAST_MONEY_AFTER_DOWN_SUM = START_BUY.value;
  var LAST_STEP_PERCENT = STEP_DEFAULT_PERCENT.value;
  var STEP_DELTA_SUM = STEP_DEFAULT_PERCENT.value; //first buy

  console.log('start buy = ', LAST_ORDER_VALUE, 'MARKET PRICE', MARKET_VALUE);
  console.log('MARKET 1st sell price', addPercent(MARKET_VALUE, TAKE_PROFIT_PERCENT.value));
  console.log('START TP = ', LAST_ORDER_VALUE * TP_KOEF + '\n___');
  console.log('\nПараметры для бота');
  console.table((_console$table = {}, _defineProperty(_console$table, 'Мартенгейл', START_MART.value), _defineProperty(_console$table, 'Динамический шаг СО', STEP_DIN.value), _defineProperty(_console$table, 'Шаг СО(%)', STEP_DEFAULT_PERCENT.value), _defineProperty(_console$table, 'Take profit (%)', TAKE_PROFIT_PERCENT.value), _defineProperty(_console$table, 'Макс. Число ордеров', ORDER_LEN.value), _defineProperty(_console$table, 'Макс сумм депозит($)', MAX_BUY.value), _defineProperty(_console$table, 'Нач цена рынка (вход)', START_MARKET_VALUE), _defineProperty(_console$table, 'Мин цена рынка (ласт ордер)', MIN_END_MARKET_VALUE), _console$table));

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
    console.table((_console$table2 = {}, _defineProperty(_console$table2, '🌧 куплен СО (USD)', ORDER_VALUE), _defineProperty(_console$table2, '🚷 Потери при продаже на этом уровне (usd)', DELTA_RESET_MONEY), _defineProperty(_console$table2, '🚶 последний шаг падения цены СО (%)', LAST_STEP_PERCENT), _defineProperty(_console$table2, '📉 сумарное падение цены (%)', getPercentDiff(START_MARKET_VALUE, MARKET_VALUE)), _defineProperty(_console$table2, '🌧 следующий ордер СО может быть на уровне', subPercent(MARKET_VALUE, LAST_STEP_PERCENT * STEP_DIN.value)), _defineProperty(_console$table2, (IS_VALID_MARKET_PRICE ? '✅' : '⛔️') + ' текушая цена валюты (крипты)', MARKET_VALUE), _defineProperty(_console$table2, '📈 ✅ цена валюты Take Profit (крипты)', TP_MARKET_PRICE), _defineProperty(_console$table2, 'отклонение цены от мин допустимой', "".concat(MARKET_DELTA_RESULT, "% from max ").concat(MAX_DELTA_MARKET_PERCENT, "%")), _defineProperty(_console$table2, '👇 стоимость денег после падения', SUM_REAL_CURRENT_MONEY), _defineProperty(_console$table2, (IS_VALID_SUM ? '👍' : '⛔️') + ' суммарные текущие вложения', SUM_OF_BUY), _defineProperty(_console$table2, '💸 сумма денег для продажи Take Profit', TP_SELL_SUM_VALUE), _defineProperty(_console$table2, 'Цена валюты для откупа всех вложенных денег (крипты)', RESET_MONEY_VALUE), _defineProperty(_console$table2, '⬆️ Процент треб. роста для продажи TP', "".concat(FULL_TP_PERCENT_FROM_ORDER, " %")), _defineProperty(_console$table2, '🦺 Процент падения от уровня закупа до продажи TP (страховка)', getPercentDiff(START_MARKET_VALUE, TP_MARKET_PRICE)), _defineProperty(_console$table2, '✅ Доход от продажи Take Profit (USD)', SALARY_FROM_SELL_TP), _console$table2));
    orderPoints.push({
      orderPrice: ORDER_VALUE,
      marketValue: MARKET_VALUE,
      lastStep: LAST_STEP_PERCENT
    });
    console.log(" \u0421\u0442\u0440\u0430\u0445\u043E\u0432\u043E\u0447\u043D\u044B\u0439 \u043E\u0440\u0434\u0435\u0440 ".concat(i + 1, " \n")); //перед началом след цикла (в конце предыдущего)

    STEP_DELTA_SUM += LAST_STEP_PERCENT;
    LAST_STEP_PERCENT = fixNumber(LAST_STEP_PERCENT * STEP_DIN.value);
  }
};

generateDom();
logCalc();
generateChart();
},{}],"../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "52858" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../.config/yarn/global/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","calc.ts"], null)
//# sourceMappingURL=/calc.js.map