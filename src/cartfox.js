const Currency = require('./currency.js');
// const Images = require('./images.js');
const Handlebars = require('handlebars');
const jQuery = require('jquery');
/** Class representing a queue */
export class Queue {
  /**
   * Build a queue.
   */
  constructor() {
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
  add(url, data, options) {
    console.log(data);
    const request = {
      url,
      data,
      type: options.type || 'POST',
      dataType: 'json',
      statusCode: {
        422: (err) => {
          /**
           * In case you cannot add the item to the cart this function fires cartfox:cannotAddToCart
           */
          console.log(err);
          jQuery(document).trigger('cartfox:cannotAddToCart', [err]);
        },
      },
      success: [options.success],
      error: (error) => { jQuery(document).trigger('cartfox:requestError', [error]); },
      complete: [options.complete],
    };
    console.log(request);
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
  process() {
    if (!this.queue.length) {
      this.processing = false;
      jQuery(document).trigger('cartfox:requestComplete');
      return;
    }
    this.processing = true;
    const params = this.queue.shift();
    params.success.push(this.process);
    jQuery.ajax(params);
  }
}

/** Class representing a cart */
export class Cart {
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
  constructor(cart = {}, selectors) {
    this.queue = new Queue();
    this.cart = cart;
    this.selectors = Object.assign({}, {
      cart: '.cart',
      cartItemCount: '#CartItemCount',
      cartTotal: '.cartTotal',
      decreaseQuantity: '#minusOne',
      increaseQuantity: '#plusOne',
      itemQuantity: '.item-qty',
      addItem: '.addItem',
      removeItem: '.removeItem',
      updateItem: '.updateItem',
      emptyTemplate: '#CartTemplate',
      itemsContainer: '#PopupCart .items',
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
  buildSelectors(selectors) {
    /**
     * addItem - Event listener for when the additem event is triggered
     */
    function add(e) {
      e.preventDefault();
      const id = jQuery('select[name=id]').val();
      const quantity = Number(jQuery('input[name=quantity]').val());
      let properties = null;
      if (jQuery('input[name*=properties]').length > 0) {
        properties = {};

        jQuery('input[name*=properties]').each(() => {
          const key = jQuery(this).attr('name').split('[')[1].split(']')[0];
          const value = jQuery(this).val();
          properties[key] = value;
        });
      }
      this.addItem(id, quantity, properties);
    }

    function decreaseQuantity(e) {
      e.preventDefault();
      const qty = Number(jQuery(this).next(e.data.cart.selectors.itemQuantity).text()) - 1;
      const itemId = Number(jQuery(this).next(e.data.cart.selectors.itemQuantity).data('item-id'));
      e.data.cart.updateItemById(itemId, qty);
      if (qty >= 1) {
        jQuery(this).next(e.data.cart.selectors.itemQuantity).text(qty);
      }
    }

    function quickAdd(e) {
      e.preventDefault();
      const itemId = Number(jQuery(this).data('quick-add'));
      console.log(itemId);
      const qty = Number(jQuery(this).data('quick-add-qty')) || 1;
      e.data.cart.addItem(itemId, qty);
    }

    function increaseQuantity(e) {
      e.preventDefault();
      const qty = Number(jQuery(this).prev(e.data.cart.selectors.itemQuantity).text()) + 1;
      const itemId = Number(jQuery(this).prev(e.data.cart.selectors.itemQuantity).data('item-id'));
      e.data.cart.updateItemById(itemId, qty);
    }

    function remove(e) {
      e.preventDefault();
      const itemId = Number(jQuery(this).data('item-id'));
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

  wrapKeys(obj, type = 'properties', defaultValue = null) {
    const wrapped = {};
    Object.keys(obj).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];
        wrapped[`${type}[${key}]`] = defaultValue === null ? value : defaultValue;
      }
    });
    return wrapped;
  }

  /**
   * Get the cart
   */
  getCart() {
    const options = {
      updateCart: true,
      success: this.updateCart,
      type: 'GET',
    };
    this.queue.add('/cart.js', {}, options);
  }

  /**
   * Update cart
   * Fires jQuery event 'cartfox:cartUpdated' and passes the cart to the event when it has completed
   * @param {object} cart - Update the cart json in the object. Will also fire events that update
   * the quantity etc.
   */
  updateCart(cart, updateCart = true) {
    this.cart = cart;
    jQuery(this.selectors.cartItemCount).text(this.cart.item_count);
    jQuery(this.selectors.cartTotal).text(Currency.formatMoney(this.cart.total_price));
    const template = jQuery(this.selectors.emptyTemplate).html();
    const itemContainer = jQuery(this.selectors.itemsContainer);
    jQuery(itemContainer).html('');
    Handlebars.registerHelper('formatMoney', amount => Handlebars.SafeString(`<span class='money'>${Currency.formatMoney(amount)}</span>`));
    if (updateCart) { // This will update any cart html if unless updateCart=false
      cart.items.forEach((lineItem) => {
        const itemTemplate = template;
        const renderedTemplate = Handlebars.compile(itemTemplate);
        renderedTemplate({ lineItem });
        const renderedHTML = renderedTemplate({ lineItem });
        jQuery(itemContainer).append(renderedHTML);
      });
    }
    Handlebars.unregisterHelper('formatMoney');
    jQuery(document).trigger('cartfox:cartUpdated', [this.cart]);
  }
  /**
   * Add an item to the cart. Fired when the selector for addItem is fired.
   * Fires a jQuery event cartfox:itemAdded.
   * @param {number} id - The variant or product id you want to add to the cart
   * @param {number} quantity - The quantity of the variant you want to add to the cart.
   * Defaults to 1 if set to less than 1.
   * @param {object} properties - The custom properties of the item.
   */
  addItem(id, quantity = 1, properties = {}) {
    let qty = quantity;
    if (qty < 1) {
      qty = 1;
    }
    const data = {};
    data.id = id;
    data.quantity = qty;
    if (properties === {}) {
      data.properties = this.wrapKeys(properties);
    }
    this.queue.add('/cart/add.js', data, {});

    return this.getCart();
  }

  removeItem(line) {
    const data = {};
    data.line = line;
    data.quantity = 0;
    this.queue.add('/cart/change.js', data, {});
    return this.getCart();
  }

  removeById(id) {
    const data = { updates: {} };
    data.updates[id] = 0;
    this.queue.add('/cart/update.js', data, {});
    return this.getCart();
  }

  updateItemById(id, quantity) {
    const data = { updates: {} };
    data.updates[id] = quantity;
    const options = {
      updateCart: true,
      success: [this.updateCart],
    };
    this.queue.add('/cart/update.js', data, options);
    return this.getCart();
  }

  updateItemsById(items, options = {}) {
    const data = {
      updates: items,
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
  setAttribute(name, value, options = {}) {
    const attribute = {};
    attribute[name] = value;
    return this.setAttributes(attribute, options);
  }

  /**
   * Set multiple cart attributes by passing them in an object.
   * @param {object} attributes
   * @param {object} options
   */
  setAttributes(attrs = {}, options = {}) {
    if (attrs !== {}) {
      const attributes = this.wrapKeys(attrs, 'attributes');
      this.queue.add('/cart/update.js', attributes, options);
    }
    return this.getCart();
  }

  getAttribute(attribute, defaultValue = false) {
    const attributes = this.cart.attributes;
    return Object.prototype.hasOwnProperty.call(attributes,
                                                attribute) ? attributes[attribute] : defaultValue;
  }

  getAttributes() {
    return this.cart.attributes;
  }

  clearAttributes() {
    this.queue.add('/cart/update.js', this.wrapKeys(this.getAttributes(), 'attributes', ''));
    return this.getCart();
  }

  clear() {
    this.queue.add('/cart/clear.js', {}, {});
    return this.getCart();
  }


}
