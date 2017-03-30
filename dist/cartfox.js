var Cartfox =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 50);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(2)(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

var global    = __webpack_require__(4)
  , core      = __webpack_require__(0)
  , ctx       = __webpack_require__(28)
  , hide      = __webpack_require__(32)
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(27);
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var anObject       = __webpack_require__(25)
  , IE8_DOM_DEFINE = __webpack_require__(33)
  , toPrimitive    = __webpack_require__(44)
  , dP             = Object.defineProperty;

exports.f = __webpack_require__(1) ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = __webpack_require__(36)
  , enumBugKeys = __webpack_require__(30);

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};

/***/ }),
/* 10 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(7)
  , defined = __webpack_require__(6);
module.exports = function(it){
  return IObject(defined(it));
};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(6);
module.exports = function(it){
  return Object(defined(it));
};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Cart = exports.Queue = undefined;

var _keys = __webpack_require__(18);

var _keys2 = _interopRequireDefault(_keys);

var _assign = __webpack_require__(16);

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = __webpack_require__(19);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(20);

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Currency = __webpack_require__(14);
var Images = __webpack_require__(15);
var jQuery = __webpack_require__(49);
/** Class representing a queue */

var Queue = exports.Queue = function () {
  /**
   * Build a queue.
   */
  function Queue() {
    (0, _classCallCheck3.default)(this, Queue);

    this.queue = [];
    this.processing = false;
    this.add = this.add.bind(this);
    this.process = this.process.bind(this);
  }
  /**
   * Add a request to the queue.
   * Fires a jQuery event 'cartfox:requestStarted'
   * @param {string} url - Url to make the request to (i.e. '/cart.js')
   * @param {object} data - Data to send to the url
   * (i.e. {id: 123453, quantity: 1, properties: {} })
   * @param {object} options - Options for the request.
   * Can include method, success and error functions.
   * @returns this.process() - begins processing the queue.
   */


  (0, _createClass3.default)(Queue, [{
    key: 'add',
    value: function add(url, data, options) {
      var request = {
        url: url,
        data: data,
        type: options.type || 'POST',
        dataType: 'json',
        statusCode: {
          422: function _(err) {
            /**
             * In case you cannot add the item to the cart this function fires cartfox:cannotAddToCart
             */
            console.log(err);
            jQuery(document).trigger('cartfox:cannotAddToCart', [err]);
          }
        },
        success: [options.success],
        error: function error(_error) {
          jQuery(document).trigger('cartfox:requestError', [_error]);
        },
        complete: [options.complete]
      };
      // let request = {};
      this.queue.push(request);
      if (this.processing) {
        return;
      }
      jQuery(document).trigger('cartfox:requestStarted');
      this.process();
    }

    /**
     * Process through the queue. Prevents synchonous callbacks.
     * Fires a jQuery event 'cartfox:requestComplete'
     */

  }, {
    key: 'process',
    value: function process() {
      if (!this.queue.length) {
        this.processing = false;
        jQuery(document).trigger('cartfox:requestComplete');
        return;
      }
      this.processing = true;
      var params = this.queue.shift();
      params.success.push(this.process);
      jQuery.ajax(params);
    }
  }]);
  return Queue;
}();

/** Class representing a cart */


var Cart = function () {
  /**
   * Build a new cart. Also creates a new queue.
   * Default selectors are:
   * cart: '.cart',
   * cartItemCount: "#CartItemCount",
   * cartTotal: ".cartTotal",
   * decreaseQuantity: "#minusOne",
   * increaseQuantity: "#plusOne",
   * addItem: '.addItem',
   * removeItem: '.removeItem',
   * updateItem: '.updateItem'
   * @param {object} cart - The json of the cart for the initial data. Can be set using liquid tags
   * with the json filter. {{ cart | json }}
   * @param {object} selectors - The selectors to update information and for events to listen to.
   */
  function Cart() {
    var cart = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var selectors = arguments[1];
    (0, _classCallCheck3.default)(this, Cart);

    this.queue = new Queue();
    this.cart = cart;
    this.selectors = (0, _assign2.default)({}, {
      cart: '.cart',
      cartItemCount: '#CartItemCount',
      cartTotal: '.cartTotal',
      decreaseQuantity: '#minusOne',
      increaseQuantity: '#plusOne',
      itemQuantity: '.item-qty',
      addItem: '.addItem',
      removeItem: '.removeItem',
      updateItem: '.updateItem',
      emptyTemplate: '#PopupCart .items-hidden .item',
      itemsContainer: '#PopupCart .items'
    }, selectors);

    //  Non Data API keys
    this.addItem = this.addItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
    this.updateItemById = this.updateItemById.bind(this);
    this.updateCart = this.updateCart.bind(this);
    this.buildSelectors = this.buildSelectors.bind(this);

    this.buildSelectors(this.selectors);
  }
  /**
   * Build the event listeners and DOMElement selectors.
   * @param {object} selectors - An object that includes all the selectors to use.
   */


  (0, _createClass3.default)(Cart, [{
    key: 'buildSelectors',
    value: function buildSelectors(selectors) {
      /**
       * addItem - Event listener for when the additem event is triggered
       */
      function add(e) {
        var _this = this;

        e.preventDefault();
        var id = jQuery('select[name=id]').val();
        var quantity = Number(jQuery('input[name=quantity]').val());
        var properties = null;
        if (jQuery('input[name*=properties]').length > 0) {
          properties = {};

          jQuery('input[name*=properties]').each(function () {
            var key = jQuery(_this).attr('name').split('[')[1].split(']')[0];
            var value = jQuery(_this).val();
            properties[key] = value;
          });
        }
        this.addItem(id, quantity, properties);
      }

      function decreaseQuantity(e) {
        e.preventDefault();
        var qty = Number(jQuery(this).next(e.data.cart.selectors.itemQuantity).text()) - 1;
        var itemId = Number(jQuery(this).next(e.data.cart.selectors.itemQuantity).data('item-id'));
        e.data.cart.updateItemById(itemId, qty);
        if (qty >= 1) {
          jQuery(this).next(e.data.cart.selectors.itemQuantity).text(qty);
        }
      }

      function quickAdd(e) {
        e.preventDefault();
        var itemId = Number(jQuery(this).data('quick-add'));
        var qty = Number(jQuery(this).data('quick-add-qty')) || 1;
        e.data.cart.addItem(itemId, qty);
      }

      function increaseQuantity(e) {
        e.preventDefault();
        var qty = Number(jQuery(this).prev(e.data.cart.selectors.itemQuantity).text()) + 1;
        var itemId = Number(jQuery(this).prev(e.data.cart.selectors.itemQuantity).data('item-id'));
        e.data.cart.updateItemById(itemId, qty);
      }

      function remove(e) {
        e.preventDefault();
        var itemId = Number(jQuery(this).data('item-id'));
        e.data.cart.removeById(itemId);
      }

      function update(e) {
        e.preventDefault();
      }
      jQuery(document).on('click', selectors.addItem, add.bind(this));
      jQuery(document).on('click', selectors.updateItem, { cart: this }, update);
      jQuery(document).on('click', selectors.removeItem, { cart: this }, remove);
      jQuery(document).on('click', selectors.decreaseQuantity, { cart: this }, decreaseQuantity);
      jQuery(document).on('click', selectors.increaseQuantity, { cart: this }, increaseQuantity);
      jQuery(document).on('click', '[data-quick-add]', { cart: this }, quickAdd);
    }
  }, {
    key: 'getCart',


    /**
     * Get the cart
     */
    value: function getCart() {
      var options = {
        updateCart: true,
        success: this.updateCart,
        type: 'GET'
      };
      this.queue.add('/cart.js', {}, options);
    }

    /**
     * Update cart. 
     * Fires jQuery event 'cartfox:cartUpdated' and passes the cart to the event when it has completed
     * @param {object} cart - Update the cart json in the object. Will also fire events that update
     * the quantity etc.
     */

  }, {
    key: 'updateCart',
    value: function updateCart(cart) {
      var _updateCart = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      this.cart = cart;
      jQuery(this.selectors.cartItemCount).text(this.cart.item_count);
      jQuery(this.selectors.cartTotal).text(Currency.formatMoney(this.cart.total_price));
      if (_updateCart) {
        // This will update any cart html if unless updateCart=false
        var template = jQuery(this.selectors.emptyTemplate).clone();
        var master = jQuery(this.selectors.itemContainer);
        master.html('');
        this.cart.items.forEach(function (item) {
          var temp = template.clone();
          var imageSize = temp.find('.item-image').data('image-size') || 'small';
          var imageUrl = Images.getImageUrl(item.image, imageSize);
          temp.find('.item-title').text(item.title);
          temp.find('.item-image').attr('src', imageUrl);
          temp.find('.item-price').text(Currency.formatMoney(item.line_price));
          temp.find('.item-qty').text(item.quantity);
          temp.find('[data-item-id]').attr('data-item-id', item.id);
          temp.appendTo(master);
        });
      }
      jQuery(document).trigger('cartfox:cartUpdated', [this.cart]);
    }
    /**
     * Add an item to the cart. Fired when the selector for addItem is fired.
     * Fires a jQuery event cartfox:itemAdded.
     * @param {number} id - The variant or product id you want to add to the cart
     * @param {number} quantity - The quantity of the variant you want to add to the cart. Defaults to 1 if set to less than 1.
     * @param {object} properties - The custom properties of the item.
     */

  }, {
    key: 'addItem',
    value: function addItem(id) {
      var quantity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
      var properties = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var data = {};
      data.id = id;
      data.quantity = quantity;
      if (properties) {
        data.properties = this.wrapKeys(properties);
      }
      this.queue.add('/cart/add.js', data, {});

      return this.getCart();
    }
  }, {
    key: 'increaseQuantity',
    value: function increaseQuantity() {
      return true;
    }
  }, {
    key: 'decreaseQuantity',
    value: function decreaseQuantity() {
      return true;
    }
  }, {
    key: 'removeItem',
    value: function removeItem(line) {
      var data = {};
      data.line = line;
      data.quantity = 0;
      this.queue.add('/cart/change.js', data, {});
      return this.getCart();
    }
  }, {
    key: 'removeById',
    value: function removeById(id) {
      var data = { updates: {} };
      data.updates[id] = 0;
      this.queue.add('/cart/update.js', data, {});
      return this.getCart();
    }
  }, {
    key: 'updateItemById',
    value: function updateItemById(id, quantity) {
      var data = { updates: {} };
      data.updates[id] = quantity;
      var options = {
        updateCart: true,
        success: [this.updateCart]
      };
      this.queue.add('/cart/update.js', data, options);
      return this.getCart();
    }
  }, {
    key: 'updateItemsById',
    value: function updateItemsById(items) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      var data = {
        updates: items
      };
      if (items.length > 0) {
        this.queue.add('/cart/update.js', data, options);
      }
      return this.getCart();
    }

    /**
     * Set a cart attribute
     * @param {string} name
     * @param {string} value
     * @param {object} options
     * @returns Nothing
     */

  }, {
    key: 'setAttribute',
    value: function setAttribute(name, value) {
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      var attribute = {};
      attribute[name] = value;
      return this.setAttributes(attribute, options);
    }

    /**
     * Set multiple cart attributes by passing them in an object.
     * @param {object} attributes
     * @param {object} options
     */

  }, {
    key: 'setAttributes',
    value: function setAttributes() {
      var attrs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if (attrs !== {}) {
        var attributes = this.wrapKeys(attrs, 'attributes');
        this.queue.add('/cart/update.js', attributes, options);
      }
      return this.getCart();
    }
  }, {
    key: 'getAttribute',
    value: function getAttribute(attribute) {
      var defaultValue = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      return Object.hasOwnProperty.call(this.cart.attributes, attribute) ? this.cart.attributes[attribute] : defaultValue;
    }
  }, {
    key: 'getAttributes',
    value: function getAttributes() {
      return this.cart.attributes;
    }
  }, {
    key: 'clearAttributes',
    value: function clearAttributes() {
      this.queue.add('/cart/update.js', this.wrapKeys(this.getAttributes(), 'attributes', ''));
      return this.getCart();
    }
  }, {
    key: 'clear',
    value: function clear() {
      this.queue.add('/cart/clear.js', {}, {});
      return this.getCart();
    }
  }], [{
    key: 'wrapKeys',
    value: function wrapKeys(obj) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'properties';
      var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

      var wrapped = {};
      (0, _keys2.default)(obj).forEach(function (key) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          var value = obj[key];
          wrapped[type + '[' + key + ']'] = defaultValue === null ? value : defaultValue;
        }
      });
      return wrapped;
    }
  }]);
  return Cart;
}();

exports.Cart = Cart;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Currency = {

  formatWithDelimiters: function formatWithDelimiters(amount) {
    var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 2;
    var thousands = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ',';
    var decimal = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '.';

    if (isNaN(amount) || amount == null) {
      return 0;
    }

    var number = (amount / 100.0).toFixed(precision);

    var parts = number.split('.');
    var dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands);
    var cents = parts[1] ? decimal + parts[1] : '';

    return dollars + cents;
  },
  formatMoney: function formatMoney(amount, format) {
    var moneyFormat = '${{amount}}';
    if (typeof amount === 'string') {
      var _cents = amount.replace('.', '');
    }
    var value = '';
    var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
    var formatString = format || moneyFormat;

    switch (formatString.match(placeholderRegex)[1]) {
      case 'amount':
        value = undefined.formatWithDelimiters(cents, 2);
        break;
      case 'amount_no_decimals':
        value = undefined.formatWithDelimiters(cents, 0);
        break;
      case 'amount_with_comma_separator':
        value = undefined.formatWithDelimiters(cents, 1, '.', ',');
        break;
      case 'amount_no_decimals_with_comma_separator':
        value = undefined.formatWithDelimiters(cents, 0, '.', ',');
        break;
      default:
        value = undefined.formatWithDelimiters(cents, 2);
        break;
    }
    return formatString.replace(placeholderRegex, value);
  }
};

module.exports = Currency;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Images = {
  getImageUrl: function getImageUrl(src, size) {
    if (size === null) {
      return src;
    }

    if (size === 'master') {
      return this.removeProtocol(src);
    }

    var match = src.match(/\.(jpg|jpeg|gif|png|tiff|tif|bmp|bitmap)(\?v=\d+)$/i);

    if (match !== null) {
      var prefix = src.split(match[0]);
      var suffix = match[0];

      return this.removeProtocol(prefix[0] + "_" + size + suffix);
    }

    return null;
  },


  removeProtocol: function removeProtocol(url) {
    return url.replace(/http(s)?:/, '');
  }

};

module.exports = Images;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(21), __esModule: true };

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(22), __esModule: true };

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(23), __esModule: true };

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(17);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(46);
module.exports = __webpack_require__(0).Object.assign;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(47);
var $Object = __webpack_require__(0).Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(48);
module.exports = __webpack_require__(0).Object.keys;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5);
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(11)
  , toLength  = __webpack_require__(43)
  , toIndex   = __webpack_require__(42);
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(24);
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(5)
  , document = __webpack_require__(4).document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

/***/ }),
/* 31 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var dP         = __webpack_require__(8)
  , createDesc = __webpack_require__(39);
module.exports = __webpack_require__(1) ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(1) && !__webpack_require__(2)(function(){
  return Object.defineProperty(__webpack_require__(29)('div'), 'a', {get: function(){ return 7; }}).a != 7;
});

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = __webpack_require__(9)
  , gOPS     = __webpack_require__(35)
  , pIE      = __webpack_require__(37)
  , toObject = __webpack_require__(12)
  , IObject  = __webpack_require__(7)
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(2)(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;

/***/ }),
/* 35 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

var has          = __webpack_require__(31)
  , toIObject    = __webpack_require__(11)
  , arrayIndexOf = __webpack_require__(26)(false)
  , IE_PROTO     = __webpack_require__(40)('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(3)
  , core    = __webpack_require__(0)
  , fails   = __webpack_require__(2);
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};

/***/ }),
/* 39 */
/***/ (function(module, exports) {

module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(41)('keys')
  , uid    = __webpack_require__(45);
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(4)
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(10)
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(10)
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(5);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};

/***/ }),
/* 45 */
/***/ (function(module, exports) {

var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(3);

$export($export.S + $export.F, 'Object', {assign: __webpack_require__(34)});

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(3);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(1), 'Object', {defineProperty: __webpack_require__(8).f});

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(12)
  , $keys    = __webpack_require__(9);

__webpack_require__(38)('keys', function(){
  return function keys(it){
    return $keys(toObject(it));
  };
});

/***/ }),
/* 49 */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(13);


/***/ })
/******/ ]);