const Currency = require('./currency.js');
// const Images = require('./images.js');
const Handlebars = require('handlebars');
const Queue = require('./queue').Queue;
const jQuery = require('jquery');

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
    return this.cart;
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
    try {
      jQuery(document).on('click', selectors.addItem, add.bind(this));
      jQuery(document).on('click', selectors.updateItem, { cart: this }, update);
      jQuery(document).on('click', selectors.removeItem, { cart: this }, remove);
      jQuery(document).on('click', selectors.decreaseQuantity, { cart: this }, decreaseQuantity);
      jQuery(document).on('click', selectors.increaseQuantity, { cart: this }, increaseQuantity);
      jQuery(document).on('click', '[data-quick-add]', { cart: this }, quickAdd);
    } catch (e) {
      console.log('No document');
    }
  }

  static wrapKeys(obj, type = 'properties', defaultValue = null) {
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
    jQuery(this.selectors.cartTotal).html(`<span class="money">${Currency.formatMoney(this.cart.total_price)}</span>`);
    const template = jQuery(this.selectors.emptyTemplate).html();
    const itemContainer = jQuery(this.selectors.itemsContainer);
    jQuery(itemContainer).html('');
    Handlebars.registerHelper('formatMoney', amount => new Handlebars.SafeString(`<span class='money'>${Currency.formatMoney(amount)}</span>`));
    if (updateCart) { // This will update any cart html unless updateCart=false
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
    const data = {};
    data.id = id;
    data.quantity = quantity;
    if (properties === {}) {
      data.properties = Cart.wrapKeys(properties);
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
      const attributes = Cart.wrapKeys(attrs, 'attributes');
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
    this.queue.add('/cart/update.js', Cart.wrapKeys(this.getAttributes(), 'attributes', ''));
    return this.getCart();
  }

  getNote() {
    return this.cart.note;
  }

  setNote(note, options={}) {
    this.queue.add('/cart/update.js', { note }, options);
    return this.getCart();
  }

  clear() {
    this.queue.add('/cart/clear.js', {}, {});
    return this.getCart();
  }
}
