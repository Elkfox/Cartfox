Cartfox
==
An in progress ajax cart and queue for Shopify.
By [Elkfox](https://www.elkfox.com)

## Initialisation
1. Grab the minified or unminified 'cartfox.js' from dist/ and add it to your themes asset folder.
2. Initialise the cart in your theme.liquid file using the following code.

Note: This is the bare minimum required to get Cartfox going.
~~~~
 var cart = {{ cart | json }}
 var cartfox = new Cartfox.Cart(cart, {
   cart: '.cart',
   cartItemCount: '.cartItemCount',
   cartTotal: '.cartTotal',
   addItem: '.addItem',
   removeItem: '.removeItem',
 });
~~~~

3. That's it! Your cart should be ready to go

## jQuery events
A number of jQuery events are triggered whenever certain events are compelted.

| Event | Returns | Description |
| --- | --- | --- |
| cartfox:requestStarted | ``None`` | Fires when the Queue has begun to be processed. |
| cartfox:requestFinished | ``None`` | Fires when the Queue has finished being processed. |
| cartfox:cannotAddToCart | ``string`` | Fires whenever the item cannot be added to the cart. Returns the error. |
| cartfox:requestError | ``string`` | Fires whenever a request inside the queue has failed. Returns the error. |
| cartfox:cartUpdated | ``object`` | Fires whenever the cart is updated. Returns the cart object. |



## Adding an empty template popup.
If you have a cart popup that appears everytime a customer adds an item to the cart then we recommend having what we call an 'empty cart template' set up ready to go. This is done by adding the ``emptyTemplate`` option to the initialisation method. You will also need to include the 'container' for the items in your cart. .e.g. ``#AjaxCart .items``
~~~~
//code above
var cartfox = new Cartfox(cart, {
   ...other Cartfox selectors...,
   emptyTemplate: '#AjaxCart .hidden-item-template',
   itemsContainer: '#AjaxCart .items'
   });
~~~~
Now when``updateCart(cart)`` is called (By design whenever ``getCart()`` is called) Cartfox will select the empty template and copy it for each item it needs to add to the cart. If these are not set then 

## Ajax Cart quantity update.
If you'd like to have **+** or **-** buttons on either side of your item quantities in your ajax cart then you can include them on either side of your quantity span, paragaph, div, etc. Including the item id inside a data attribute on the quantity makes it easier for the **+** and **-** items to find the item id that they need to update the quantity for. 
~~~~
<span class="decrease-qty">-</span><span class="item-qty" data-item-id="123121">12</span><span class="increase-qty">
~~~~

Don't forget to add these selectors to your cartfox initialisation function.

~~~~
//Code above cart initilisation
var cartfox = new Cartfox(cart, { 
...other Cartfox selectors...,
decreaseQuantity: '.decrease-qty',
increaseQuantity: '.increase-qty',
item-quantity: '.item-qty',
});
~~~~


Classes
==

---
## Queue
Class representing a queue

**Kind**: global class  

* [Queue](#Queue)
    * [new Queue()](#new_Queue_new)
    * [.add(url, data, options)](#Queue+add)
    * [.process()](#Queue+process)

### new Queue()
Build a queue.

### queue.add(url, data, options)
Add a request to the queue.
Fires a jQuery event 'cartfox:requestStarted'

**Kind**: instance method of [Queue](#Queue)

| Param | Type | Description |
| --- | --- | --- |
| url | ``string`` | Url to make the request to (i.e. '/cart.js') |
| data | ``object`` | Data to send to the url (i.e. {id: 123453, quantity: 1, properties: {} }) |
| options | ``object`` | Options for the request. Can include method, success and error functions. |


### queue.process()
Process through the queue. Prevents synchonous callbacks.
Fires a jQuery event 'cartfox:requestComplete'

**Kind**: instance method of [Queue](#Queue)  
## Cartfox
Class representing the cart

**Kind**: global class  

* [Cartfox](#Cart)
    * [new Cartfox(cart, selectors)](#new_Cart_new)
    * [.buildSelectors(selectors)](#Cart+buildSelectors)
    * [.getCart()](#Cart+getCart)
    * [.updateCart(cart)](#Cart+updateCart)
    * [.addItem(id, quantity, properties)](#Cart+addItem)

### new Cart(cart, selectors)
Build a new cart. Also creates a new queue.

* Default selectors are:
 * cart: '.cart',
 * cartItemCount: "#CartItemCount",
 * cartTotal: ".cartTotal",
 * decreaseQuantity: "#minusOne",
 * increaseQuantity: "#plusOne",
 * addItem: '.addItem',
 * removeItem: '.removeItem',
 * updateItem: '.updateItem'


| Param | Type | Description |
| --- | --- | --- |
| cart | ``object`` | The json of the cart for the initial data. Can be set using liquid tags with the json filter. i.e. ``{{ cart | json }}`` |
| selectors | ``object`` | The selectors to update information and for events to listen to. |

### cart.buildSelectors(selectors)
Build the event listeners and DOMElement selectors.

**Kind**: instance method of [Cart](#Cart) 

| Param | Type | Description |
| --- | --- | --- |
| selectors | ``object`` | An object that includes all the selectors to use. |

### cart.getCart()
Get the cart

**Kind**: instance method of [Cart](#Cart) 

### cart.updateCart(cart)
Update cart. 
Fires jQuery event 'cartfox:cartUpdated' and passes the cart to the event when it has completed.

**Kind**: instance method of [Cart](#Cart)  

| Param | Type | Description |
| --- | --- | --- |
| cart | ``object`` | Update the cart json in the object. Will also fire events that update the quantity etc. |

### cart.addItem(id, quantity, properties)
Add an item to the cart. Fired when the selector for addItem is fired.
Fires a jQuery event cartfox:itemAdded.

**Kind**: instance method of [Cart](#Cart)  

| Param | Type | Description |
| --- | --- | --- |
| id | ``number`` | The variant or product id you want to add to the cart |
| quantity | ``number`` | The quantity of the variant you want to add to the cart. Defaults to 1 if set to less than 1. |
| properties | ``object`` | The custom properties of the item. |

