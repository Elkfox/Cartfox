const Cart = function Cart(configuration) {
  // Set up our Cartfox instance with the defined configuration
  const config = configuration;
  const cart = config.cart || {};
  const selectors = config.selectors || {};
  const options = config.options || {};

  // Define the default selectors and options for the class
  const defaultSelectors = {
    cart: '[data-cart]',
    cartItemCount: '[data-cart-item-count]',
    cartTotal: '[data-cart-total]',
    decreaseQuantity: '[data-minus-one]',
    increaseQuantity: '[data-plus-one]',
    itemQuantity: '[data-item-quantity]',
    staticQuantity: '[data-static]',
    staticChangeQuantity: '[data-adjust]',
    addItem: '[data-add-to-cart]',
    quickAdd: '[data-quick-add]',
    quickAddQuantity: '[data-quick-add-qty]',
    quickAddProperties: '[data-quick-add-properties]',
    removeItem: '[data-remove-item]',
    updateItem: '[data-update-item]',
    emptyTemplate: '[data-cart-template]',
    itemsContainer: '[data-item-container]',
  };
  const defaultOptions = {
    moneyFormat: '${{amount}}',
  };

  // Create a new queue
  this.queue = new Queue({
    dataType: 'json',
    method: 'POST',
  });

  // Merge and add the settings into the prototype
  this.cart = cart;

  // Keep track of items in an id centric structure
  this.items = this.createItems(cart);
  this.selectors = Object.assign(selectors, defaultSelectors);
  this.options = Object.assign(options, defaultOptions);
  this.renderCart = this.options.renderCart || this.renderCart;
  if (this.options.onRender && typeof this.options.onRender === 'function') { this.onRender = this.options.onRender.bind(this); }

  // Build the event listeners from the selectors
  this.buildEventListeners(this.selectors);
  jQuery(document).trigger('cart:ready', [this]);
  return this;
}

Cart.prototype.buildEventListeners = function buildEventListeners(selectors) {
  // Try and build event listeners using jQuery
  try {
    jQuery(document).on('click', selectors.addItem, this.addToCart.bind(this));
    jQuery(document).on('click', selectors.removeItem, this.removeFromCart.bind(this));
    jQuery(document).on('click', selectors.decreaseQuantity, this.decreaseQuantity.bind(this));
    jQuery(document).on('click', selectors.increaseQuantity, this.increaseQuantity.bind(this));
    jQuery(document).on('click', selectors.quickAdd, this.quickAdd.bind(this));
  } catch (error) {
    console.warn('Could not build event listeners: ' + error);
  }
  return this;
};

/*
  Event based Functions
*/
Cart.prototype.addToCart = function onClickAddToCartButton(event) {
  event.preventDefault();
  const id = jQuery('[name="id"]').val();
  const quantity = Number(jQuery('[name="quantity"]').val());
  const properties = {};

  if (jQuery('[name*=properties]').length > 0) {
    jQuery('[name*=properties]').each(function getProperty() {
      const key = jQuery(this).attr('name').split('[')[1].split(']')[0];
      const value = jQuery(this).val();
      properties[key] = value;
    });
  }

  const data = {
    id: id,
    quantity: quantity,
    properties: properties,
  };

  this.addItem(data);
};

Cart.prototype.quickAdd = function onClickQuickAddButton(event) {
  event.preventDefault();

  const id = Number(jQuery(event.currentTarget).data(this.getDataAttribute(this.selectors.quickAdd)));
  const quantity = Number(jQuery(event.currentTarget).data(this.getDataAttribute(this.selectors.quickAddQuantity))) || 1;
  const properties = jQuery(event.currentTarget).data(this.getDataAttribute(this.selectors.quickAddProperties)) || {};
  const data = {
    id: id,
    quantity: quantity,
    properties: properties,
  };

  this.addItem(data);
};

Cart.prototype.removeFromCart = function onClickRemoveButton(event) {
  event.preventDefault();

  const attribute = this.getDataAttribute(this.selectors.removeItem);
  const line = Number(jQuery(event.currentTarget).data(attribute));

  this.removeItemByLine(line);
};

Cart.prototype.decreaseQuantity = function onClickDecreaseQuantityButton(event) {
  event.preventDefault();

  const attribute = this.getDataAttribute(this.selectors.decreaseQuantity);
  const line = Number(jQuery(event.currentTarget).data(attribute));
  const index = line - 1;
  const id = this.cart.items[index].id;
  const quantity = this.cart.items[index].quantity - 1;

  const success = function success(cart) {
    return jQuery(document).trigger('cart:itemQuantityDecreased', [cart]);
  }
  const error = function error(error) {
    return jQuery(document).trigger('cart:cannotDecreaseItemQuantity', [error]);
  }
  const options = {
    success: success,
    error: error,
  }

  jQuery(document).trigger('cart:beforeItemQuantityDecreased');
  this.updateItemByLine(line, quantity, options);
};

Cart.prototype.increaseQuantity = function onClickIncreaseQuantityButton(event) {
  event.preventDefault();

  const attribute = this.getDataAttribute(this.selectors.increaseQuantity);
  const line = Number(jQuery(event.currentTarget).data(attribute));
  const index = line - 1;
  const id = this.cart.items[index].id;
  const quantity = this.cart.items[index].quantity + 1;

  const success = function success(cart) {
    return jQuery(document).trigger('cart:itemQuantityIncreased', [cart]);
  }
  const error = function error(error) {
    return jQuery(document).trigger('cart:cannotIncreaseItemQuantity', [error]);
  }
  const options = {
    success: success,
    error: error,
  }

  jQuery(document).trigger('cart:beforeItemQuantityIncreased');
  this.updateItemByLine(line, quantity, options);
};
/*
  End Event based Functions
*/

/*
  AJAX API Functions
*/

// Get a fresh cart back from the API
// Request a fresh cart from 'cart.js'
// Then re-render the cart
Cart.prototype.getCart = function getCart(config) {
  const options = config || {};
  const success = options.success || function getCartSuccess(cart) {
    this.updateCartObject(cart);
  }.bind(this);

  const request = {
    url: '/cart.js',
    method: 'GET',
    success: success,
  };

  // Add the request to the queue
  this.queue.add(request);
  return this.cart;
}

// Updating cart object
// Update global this.cart from the returned 'update.js' or 'change.js' API callback
// Then re-render the cart
Cart.prototype.updateCartObject = function updateCartObjectFromNewCart(cart) {
  this.cart = cart;
  this.renderCart(this.cart);
}

// Default cart rendering
// Trigger a renderCart event and run any onRender functions
// Can be overwritten from new Cartfox init
Cart.prototype.renderCart = function renderCartFromObject() {
  $(this.selectors.cartItemCount).html(this.cart.item_count);
  jQuery(document).trigger('cart:render', this.cart);

  if (this.onRender && typeof this.onRender === 'function') {
    this.onRender(this.cart);
  }
}

// Create an AJAX request to add an item the cart
// Accepts an object of the item to add:
//  - id (required)
//  - quantity
//  - properties
Cart.prototype.addItem = function addItem(data, config) {
  const item = data || {};
  const options = config || {};

  if (item.id === undefined) {
    return false;
  }
  item.quantity = item.quantity || 1;
  item.properties = item.properties || {};

  options.success = options.success || function success(lineItem) {
    this.getCart();
    return jQuery(document).trigger('cart:itemAdded', [lineItem]);
  }.bind(this);
  options.error = options.error || function error(error) {
    return jQuery(document).trigger('cart:cannotAddToCart', [error]);
  }.bind(this);

  const request = {
    url: '/cart/add.js',
    data: item,
    success: options.success,
    error: options.error,
  };

  // Add the request to the queue
  jQuery(document).trigger('cart:beforeItemAdded');
  this.queue.add(request);
  return this;
};

// Remove item by id
// Accepts an item id and config
Cart.prototype.removeItemById = function removeItemById(id, config) {
  const data = { updates: {} };
  const options = config || {};
  data.updates[id] = 0;

  options.success = options.success || function success(cart) {
    this.updateCartObject(cart);
    return jQuery(document).trigger('cart:itemRemoved', [cart]);
  }.bind(this);
  options.error = options.error || function error(error) {
    return jQuery(document).trigger('cart:cannotRemoveItemFromCart', [error]);
  };

  const request = {
    url: '/cart/update.js',
    data: data,
    error: options.error,
    success: options.success,
  }

  // Add the request to the queue
  jQuery(document).trigger('cart:beforeItemRemoved');
  this.queue.add(request);
  return this;
}

// Remove item by line
// Accepts a line index and config
Cart.prototype.removeItemByLine = function removeItemFromCartUsingLineindex(line, config) {
  const options = config || {};

  options.success = options.success || function success(cart) {
    this.updateCartObject(cart)
    return jQuery(document).trigger('cart:itemRemoved', [cart]);
  }.bind(this);
  options.error = options.error || function error(error) {
    return jQuery(document).trigger('cart:cannotRemoveItemFromCart', [error]);
  };

  const request = {
    url: '/cart/change.js',
    data: {
      line: line,
      quantity: 0,
    },
    success: options.success,
    error: options.error,
  };

  // Add the request to the queue
  jQuery(document).trigger('cart:beforeItemRemoved');
  this.queue.add(request);
  return this;
}

Cart.prototype.updateItemById = function updateItemById(id, quantity, config) {
  const data = { updates: {} };
  const options = config || {};

  data.updates[id] = quantity;

  options.success = options.success || function success(cart) {
    this.updateCartObject(cart)
    return jQuery(document).trigger('cart:itemUpdated', [cart]);
  }.bind(this);
  options.error = options.error || function error(error) {
    return jQuery(document).trigger('cart:cannotUpdateItem', [error]);
  };

  const request = {
    url: '/cart/update.js',
    data: data,
    error: options.error,
    success: options.success,
  }

  // Add the request to the queue
  jQuery(document).trigger('cart:beforeItemUpdated');
  this.queue.add(request);
  return this;
}

Cart.prototype.updateItemByLine = function updateItemFromCartUsingLineindex(line, quantity, config) {
  const options = config || {};

  options.success = options.success || function success(cart) {
    this.updateCartObject(cart)
    return jQuery(document).trigger('cart:itemUpdated', [cart]);
  }.bind(this);
  options.error = options.error || function error(error) {
    return jQuery(document).trigger('cart:cannotUpdateItem', [error]);
  };

  const request = {
    url: '/cart/change.js',
    data: {
      line: line,
      quantity: quantity,
    },
    success: options.success,
    error: options.error,
  };

  // Add the request to the queue
  jQuery(document).trigger('cart:beforeItemUpdated');
  this.queue.add(request);
  return this;
}

Cart.prototype.clearCart = function clearCart(config) {
  const options = config || {};

  options.success = options.success || function success(cart) {
    this.updateCartObject(cart);
    return jQuery(document).trigger('cart:cartCleared', [cart]);
  }.bind(this);
  options.error = options.error || function error(error) {
    return jQuery(document).trigger('cart:cannotClearCart', [error]);
  };

  const request = {
    url: '/cart/clear.js',
    success: options.success,
    error: options.error,
  };

  // Add the request to the queue
  jQuery(document).trigger('cart:beforeCartCleared');
  this.queue.add(request);
  return this;
}

/*
  END AJAX API Functions
*/

/*
  Utility Functions
*/

Cart.prototype.getDataAttribute = function getAttributeFromDataAttributeSelector(selector) {
  return selector.replace('[data-', '').replace(']', '');
};

Cart.prototype.createItems = function createAnIdCentricDataStuctureFromTheCart(cart) {
  const items = {};

  for (var i = 0; i < cart.items.length; i++) {
    items[cart.items[i].id] = {
      line: i+1,
      quantity: cart.items[i].quantity
    }
  }

  return items;
};

/*
  End Utility Functions
*/

module.exports = Cart;
