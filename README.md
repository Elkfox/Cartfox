🛒🦊 (Cartfox)
==
A super simple wrapper for the [Shopify](https://www.shopify.com) ajax cart API.

Light weight and easy to setup.

By [Elkfox](https://www.elkfox.com)

### [Tutorial](https://github.com/Elkfox/cartfox/blob/master/TUTORIAL.md)

## Installation

Download the minified or uncompressed source files from the dist folder and add them to your themes asset folder.

If you don't have jQuery included inside your theme then we recommend using the cartfox.jquery.js or cartfox.jquery.min.js files. 
These include the jQuery libray for internal use so you don't have to.

Include the script in the head of your ``theme.liquid`` file using ``{% 'cartfox.js' | asset_url | script_tag %}``

## Initialization
Note: This is the bare minimum required to get Cartfox going.
~~~~js
 var cart = {{ cart | json }}
 var cartfox = new Cartfox.Cart(cart, {
   cart: '.cart',
   cartItemCount: '.cartItemCount',
   cartTotal: '.cartTotal',
   addItem: '.addItem',
   removeItem: '.removeItem',
 });
~~~~

### List of selectors
#### Required Selectors
* cart: The container for the ajax cart, if you have one.
* cartItemCount: The selector that displays the total number of items in the cart
* cartToal: The selector that displays the total value of the cart in $
* addItem: The selector for the 'Add To Cart' button usually found on your product pages
* removeItem: The selector for the 'Remove Item From Cart' button. 
(N.B. This button must also have a data attribute ``data-item-id`` that is set to the value of the item id.)

#### Optional Selectors
* emptyTemplate: The selector for your 'item template' in your cart popup or cart. Explained in the next section.
* itemsContainer: The selector for the container in your cart that holds all the items. Explained in the next section.
* decreaseQuantity: The selector for your "Reduce Quantity" button 
* increaseQuantity: The selector for your "Increase Quantity" button
* itemQuantity: The selector that contains the item quantity. This selector must also have a data-item-id data attribute set to the items data id for the increase and decrease buttons to work.

## jQuery events
A number of jQuery events are triggered whenever certain events are compelted.

| Event | Returns | Description |
| --- | --- | --- |
| cartfox:requestStarted | ``None`` | Fires when the Queue has begun to be processed. |
| cartfox:requestFinished | ``None`` | Fires when the Queue has finished being processed. |
| cartfox:cannotAddToCart | ``string`` | Fires whenever the item cannot be added to the cart. Returns the error. |
| cartfox:requestError | ``string`` | Fires whenever a request inside the queue has failed. Returns the error. |
| cartfox:cartUpdated | ``object`` | Fires whenever the cart is updated. Returns the cart object. |

## Ajax Cart quantity update.
If you'd like to have **+** or **-** buttons on either side of your item quantities in your ajax cart then you can include them on either side of your quantity span, paragaph, div, etc. Including the item id inside a data attribute on the quantity makes it easier for the **+** and **-** items to find the item id that they need to update the quantity for. 
~~~~html
<span class="decrease-qty">-</span><span class="item-qty" data-item-id="123121">12</span><span class="increase-qty">
~~~~

Don't forget to add these selectors to your cartfox initialisation function.

~~~~js
//Code above cart initilisation
var cartfox = new Cartfox.Cart(cart, { 
...other Cartfox selectors...,
decreaseQuantity: '.decrease-qty',
increaseQuantity: '.increase-qty',
item-quantity: '.item-qty',
});
~~~~

## Quick Add Buttons.
By adding a data attribute ``data-quick-add`` to a button and passing it an item id you add in the ability to add a product without having to submit a form.
~~~~html
<button class="quick-add" data-quick-add="1231">Add To Cart</button>
~~~~
By default the quantity that gets added to the cart is 1 but you can overwrite this by adding an extra data attribute ``data-quick-add-quantity`` and assigning it to the number of items you want added to the cart.


Classes
==

## Cartfox
Class representing the cart

**Kind**: global class  

* [Cart](#Cart)
    * [new Cart(cart, selectors)](#new_Cart_new)
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
