const jquery = require('jquery');
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
   * @return this.process() - begins processing the queue.
   */
  add(url, data, options = {}) {
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
          try {
            jQuery(document).trigger('cartfox:cannotAddToCart', [err]);
          } catch (e) {
            console.log('No document');
          }
        },
        400: (err) => {
          jQuery(document).trigger('cartfox:cannotAddToCart', [err]);
          console.log(err);
        },
      },
      success: [options.success],
      error: (error) => { jQuery(document).trigger('cartfox:requestError', [error]); },
      complete: [options.complete],
    };
    // let request = {};
    this.queue.push(request);

    if (this.processing) {
      return true;
    }

    try {
      jQuery(document).trigger('cartfox:requestStarted');
    } catch (e) {
      console.log('No document');
    }
    this.processing = false;
    this.process();
    return this.processing;
  }

  /**
   * Process through the queue. Prevents synchonous callbacks.
   * Fires a jQuery event 'cartfox:requestComplete'
   */
  process() {
    if (!this.queue.length) {
      this.processing = false;
      jQuery(document).trigger('cartfox:requestComplete');
      return true;
    }
    this.processing = true;
    const params = this.queue.shift();
    params.success.push(this.process);
    try {
      jQuery.ajax(params);
    } catch (e) {
      console.log(e);
    }
    return params;
  }
}
