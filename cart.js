/* =============================================================================
 ___  _   _    _
/   || | | |  | |
\__  | | | |  | |  __
/    |/  |/_) |/  /  \_/\/
\___/|__/| \_/|__/\__/  /\_/
              |\
              |/

Cart
v3.0.0
https://github.com/Elkfox/Cart
Copyright (c) 2018 Elkfox Co Pty Ltd

https://elkfox.com
MIT License
============================================================================= */

/*
  For the purpose of clarity, throughout this file:
  Cart (capitalised) = Elkfox Cart function
  cart (lowercase)   = Shopify cart object
*/

/*
  This is our master Cart function
  Additional items below are prototypes of, and extend, this function
*/
const Cart = function Cart(configuration) {
  // Set up our Cart instance with the pre-defined configuration
  const config = configuration;
  const cart = config.cart || {};
  const selectors = config.selectors || {};
  const options = config.options || {};

  // Define the default selectors and options:
    // Selectors refer to elements on the page
    // Options refer to Cart configuration
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

  // Create a new Queue and attach into this Cart instance
  this.queue = new Queue({
    dataType: 'json',
    method: 'POST',
  });

  // Merge the liquid cart into this Cart instance
  this.cart = cart;

  // Keep track of the current cart items in an id-centric structure
  // using our very own createItems function
  this.items = this.createItems(cart);

  // Merge and add the settings into the prototype
  this.selectors = Object.assign(selectors, defaultSelectors);
  this.options = Object.assign(options, defaultOptions);

  // Set up the renderCart function from the defined configured options
  // or using the defualt built in function
  this.renderCart = this.options.renderCart || this.renderCart;

  // Set up the onRender function, if defined in the configured options
  if (this.options.onRender && typeof this.options.onRender === 'function') {
    this.onRender = this.options.onRender.bind(this);
  }

  // Build the event listeners from the configured selectors
  this.buildEventListeners(this.selectors);

  // Trigger a cart:ready event
  jQuery(document).trigger('cart:ready', [this]);

  // Return self, used for chaining functions
  return this;
}

/*
  Build the event listeners from the configured selectors
*/
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

  // Return self
  return this;
};

/*
============================
  Event based functions
============================
*/

/*
  Add to cart
  Called from product forms
*/
Cart.prototype.addToCart = function onClickAddToCartButton(event) {
  // Prevent click events from performing their default actions
  event.preventDefault();

  // Set up constant variables from the product form
  const id = jQuery('[name="id"]').val();
  const quantity = Number(jQuery('[name="quantity"]').val());
  const properties = {};

  // If there are line-item property inputs,
  // loop through each and attach them to this item
  if (jQuery('[name*=properties]').length > 0) {
    jQuery('[name*=properties]').each(function getProperty() {
      const key = jQuery(this).attr('name').split('[')[1].split(']')[0];
      const value = jQuery(this).val();
      properties[key] = value;
    });
  }

  // Build request data
  const data = {
    id: id,
    quantity: quantity,
    properties: properties,
  };

  // Add the item, using the above data
  this.addItem(data);
};

/*
  Quick add
  Called from anywhere
*/
Cart.prototype.quickAdd = function onClickQuickAddButton(event) {
  // Prevent click events from performing their default actions
  event.preventDefault();

  // Set up attribute variables from the defined selectors
  const id = Number(jQuery(event.currentTarget).data(this.getDataAttribute(this.selectors.quickAdd)));
  const quantity = Number(jQuery(event.currentTarget).data(this.getDataAttribute(this.selectors.quickAddQuantity))) || 1;
  const properties = jQuery(event.currentTarget).data(this.getDataAttribute(this.selectors.quickAddProperties)) || {};

  // Build request data
  const data = {
    id: id,
    quantity: quantity,
    properties: properties,
  };

  // Add the item, using the above data
  this.addItem(data);
};

/*
  Remove from cart
*/
Cart.prototype.removeFromCart = function onClickRemoveButton(event) {
  // Prevent click events from performing their default actions
  event.preventDefault();

  // Set up the attribute from the defined selectors
  const attribute = this.getDataAttribute(this.selectors.removeItem);
  // Get the line index from the current target and above attribute
  const line = Number(jQuery(event.currentTarget).data(attribute));

  // Remove the item by line number, using the above line index
  this.removeItemByLine(line);
};

/*
  Decrease item quantity
*/
Cart.prototype.decreaseQuantity = function onClickDecreaseQuantityButton(event) {
  // Prevent click events from performing their default actions
  event.preventDefault();

  // Set up the attribute from the defined selectors
  const attribute = this.getDataAttribute(this.selectors.decreaseQuantity);
  // Get the line index from the current target and above attribute
  const line = Number(jQuery(event.currentTarget).data(attribute));
  // Line items are zero-indexed
  const index = line - 1;
  // Grab the item's id
  const id = this.cart.items[index].id;
  // Reduce the item's quantity by one
  const quantity = this.cart.items[index].quantity - 1;

  // Success
  const success = function success(cart) {
    // Trigger a cart:itemQuantityDecreased event
    return jQuery(document).trigger('cart:itemQuantityDecreased', [cart]);
  }
  // Error
  const error = function error(error) {
    // Trigger a cart:cannotDecreaseItemQuantity event
    return jQuery(document).trigger('cart:cannotDecreaseItemQuantity', [error]);
  }

  // Build request data
  const options = {
    success: success,
    error: error,
  }

  // Trigger a cart:beforeItemQuantityDecreased event
  jQuery(document).trigger('cart:beforeItemQuantityDecreased');

  // Update the item, based on it's line number and updated quantity
  this.updateItemByLine(line, quantity, options);
};

/*
  Increase item quantity
*/
Cart.prototype.increaseQuantity = function onClickIncreaseQuantityButton(event) {
  // Prevent click events from performing their default actions
  event.preventDefault();

  // Set up the attribute from the defined selectors
  const attribute = this.getDataAttribute(this.selectors.increaseQuantity);
  // Get the line index from the current target and above attribute
  const line = Number(jQuery(event.currentTarget).data(attribute));
  // Line items are zero-indexed
  const index = line - 1;
  // Grab item's id
  const id = this.cart.items[index].id;
  // Increase the item's quantity by one
  const quantity = this.cart.items[index].quantity + 1;

  // Success
  const success = function success(cart) {
    // Trigger a cart:itemQuantityIncreased event
    return jQuery(document).trigger('cart:itemQuantityIncreased', [cart]);
  }
  // Error
  const error = function error(error) {
    // Trigger a cart:cannotIncreaseItemQuantity event
    return jQuery(document).trigger('cart:cannotIncreaseItemQuantity', [error]);
  }

  // Build request data
  const options = {
    success: success,
    error: error,
  }

  // Trigger a cart:beforeItemQuantityIncreased event
  jQuery(document).trigger('cart:beforeItemQuantityIncreased');

  // Update the item, based on it's line number and updated quantity
  this.updateItemByLine(line, quantity, options);
};

/*
============================
     AJAX API functions
============================
*/

/*
  Get a fresh cart back from the API
  Accepts a config
*/
Cart.prototype.getCart = function getCart(config) {
  // Merge in the defined config
  const options = config || {};

  // Success
  // As defined in the configured options, or using the default below function
  const success = options.success || function getCartSuccess(cart) {
    this.updateCartObject(cart);
  }.bind(this);

  // Build request data
  const request = {
    url: '/cart.js',
    method: 'GET',
    success: success,
  };

  // Add the request to the queue
  this.queue.add(request);

  // Return self
  return this.cart;
}

/*
  Update cart object
  Requires a cart object
*/
Cart.prototype.updateCartObject = function updateCartObjectFromNewCart(cart) {
  // Update the stored cart object from a new cart object
  this.cart = cart;

  // Re-render the cart from the updated object
  this.renderCart(this.cart);
}

/*
  Default cart rendering
  Can be overwritten upon the Cart init
*/
Cart.prototype.renderCart = function renderCartFromObject() {
  // Update the item count selector with the current cart item_count
  $(this.selectors.cartItemCount).html(this.cart.item_count);

  // Trigger a cart:render event and pass through the current cart
  jQuery(document).trigger('cart:render', this.cart);

  // Run a configured onRender functions, if it exists
  if (this.onRender && typeof this.onRender === 'function') {
    this.onRender(this.cart);
  }
}

/*
  Create an AJAX request to add an item the cart
  Accepts a config and an object of the item to add:
   - id (required)
   - quantity
   - properties
*/
Cart.prototype.addItem = function addItem(data, config) {
  // Merge in the defined data and config
  const item = data || {};
  const options = config || {};

  // If the item's id is undefined, return
  if (item.id === undefined) {
    return false;
  }

  // Set up the item's attributes if defined, or use the defaults
  item.quantity = item.quantity || 1;
  item.properties = item.properties || {};

  // Success
  options.success = options.success || function success(lineItem) {
    // Get the latest cart from the API
    this.getCart();

    // Trigger a cart:itemAdded event and return
    return jQuery(document).trigger('cart:itemAdded', [lineItem]);
  }.bind(this);
  // Error
  options.error = options.error || function error(error) {
    // Trigger a cart:cannotAddToCart event and return
    return jQuery(document).trigger('cart:cannotAddToCart', [error]);
  }.bind(this);

  // Build request data
  const request = {
    url: '/cart/add.js',
    data: item,
    success: options.success,
    error: options.error,
  };

  // Trigger a cart:beforeItemAdded event
  jQuery(document).trigger('cart:beforeItemAdded');

  // Add the request to the queue
  this.queue.add(request);

  // Return self
  return this;
};

/*
  Remove item by id
  Accepts an id and config
*/
Cart.prototype.removeItemById = function removeItemById(id, config) {
  // Merge in the defined id and config
  const data = { updates: {} };
  const options = config || {};

  // Set up the request's id
  data.updates[id] = 0;

  // Success
  options.success = options.success || function success(cart) {
    // Update the stored cart object with the cart returned from the API
    this.updateCartObject(cart);

    // Trigger a cart:itemRemoved event and return
    return jQuery(document).trigger('cart:itemRemoved', [cart]);
  }.bind(this);
  // Error
  options.error = options.error || function error(error) {
    // Trigger a cart:cannotRemoveItemFromCart event and return
    return jQuery(document).trigger('cart:cannotRemoveItemFromCart', [error]);
  };

  // Build request data
  const request = {
    url: '/cart/update.js',
    data: data,
    error: options.error,
    success: options.success,
  }

  // Trigger a cart:beforeItemRemoved event
  jQuery(document).trigger('cart:beforeItemRemoved');

  // Add the request to the queue
  this.queue.add(request);

  // Return self
  return this;
}

/*
  Remove item by line
  Accepts a line index and config
*/
Cart.prototype.removeItemByLine = function removeItemFromCartUsingLineindex(line, config) {
  // Merge in the defined config
  const options = config || {};

  // Success
  options.success = options.success || function success(cart) {
    // Update the stored cart object with the cart returned from the API
    this.updateCartObject(cart);

    // Trigger a cart:itemRemoved event and return
    return jQuery(document).trigger('cart:itemRemoved', [cart]);
  }.bind(this);
  // Error
  options.error = options.error || function error(error) {
    // Trigger a cart:cannotRemoveItemFromCart event and return
    return jQuery(document).trigger('cart:cannotRemoveItemFromCart', [error]);
  };

  // Build request data
  const request = {
    url: '/cart/change.js',
    data: {
      line: line,
      quantity: 0,
    },
    success: options.success,
    error: options.error,
  };

  // Trigger a cart:beforeItemRemoved event
  jQuery(document).trigger('cart:beforeItemRemoved');

  // Add the request to the queue
  this.queue.add(request);

  // Return self
  return this;
}

/*
  Update item by id
  Accepts an id, quantity and config
*/
Cart.prototype.updateItemById = function updateItemById(id, quantity, config) {
  // Merge in the defined config
  const options = config || {};

  // Create a blank data object
  const data = { updates: {} };

  // Set up the request's id
  data.updates[id] = quantity;

  // Success
  options.success = options.success || function success(cart) {
    // Update the stored cart object with the cart returned from the API
    this.updateCartObject(cart);

    // Trigger a cart:itemUpdated event
    return jQuery(document).trigger('cart:itemUpdated', [cart]);
  }.bind(this);
  // Error
  options.error = options.error || function error(error) {
    // Trigger a cart:cannotUpdateItem event
    return jQuery(document).trigger('cart:cannotUpdateItem', [error]);
  };

  // Build request data
  const request = {
    url: '/cart/update.js',
    data: data,
    error: options.error,
    success: options.success,
  }

  // Trigger a cart:beforeItemUpdated event
  jQuery(document).trigger('cart:beforeItemUpdated');

  // Add the request to the queue
  this.queue.add(request);

  // Return self
  return this;
}

/*
  Update item by line
  Accepts a line index, quantity and config
*/
Cart.prototype.updateItemByLine = function updateItemFromCartUsingLineindex(line, quantity, config) {
  // Merge in the defined config
  const options = config || {};

  // Success
  options.success = options.success || function success(cart) {
    // Update the stored cart object with the cart returned from the API
    this.updateCartObject(cart);

    // Trigger a cart:itemUpdated event and return
    return jQuery(document).trigger('cart:itemUpdated', [cart]);
  }.bind(this);
  // Error
  options.error = options.error || function error(error) {
    // Trigger a cart:cannotUpdateItem event and return
    return jQuery(document).trigger('cart:cannotUpdateItem', [error]);
  };

  // Build request data
  const request = {
    url: '/cart/change.js',
    data: {
      line: line,
      quantity: quantity,
    },
    success: options.success,
    error: options.error,
  };

  // Trigger a cart:beforeItemUpdated event
  jQuery(document).trigger('cart:beforeItemUpdated');

  // Add the request to the queue
  this.queue.add(request);

  // Return self
  return this;
}

/*
  Clear the cart
  Accepts a config
*/
Cart.prototype.clearCart = function clearCart(config) {
  // Merge in the defined config
  const options = config || {};

  // Success
  options.success = options.success || function success(cart) {
    // Update the stored cart object with the cart returned from the API
    this.updateCartObject(cart);

    // Trigger a cart:cartCleared event, then return
    return jQuery(document).trigger('cart:cartCleared', [cart]);
  }.bind(this);
  // Error
  options.error = options.error || function error(error) {
    // Trigger a cart:cannotClearCart event, then return
    return jQuery(document).trigger('cart:cannotClearCart', [error]);
  };

  // Build request data
  const request = {
    url: '/cart/clear.js',
    success: options.success,
    error: options.error,
  };

  // Trigger a cart:beforeCartCleared event
  jQuery(document).trigger('cart:beforeCartCleared');

  // Add the request to the queue
  this.queue.add(request);

  // Return self
  return this;
}

/*
============================
     Utility Functions
============================
*/

/*
  Get data attribute from selector
*/
Cart.prototype.getDataAttribute = function getAttributeFromDataAttributeSelector(selector) {
  return selector.replace('[data-', '').replace(']', '');
};

/*
  Create an object of cart items, keyed by their ids
*/
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

// Export Cart to npm
module.exports = Cart;
