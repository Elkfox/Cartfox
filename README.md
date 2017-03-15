## Cartfox
An in progress ajax cart and queue for Shopify.
By [Elkfox](https://www.elkfox.com)

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
| url | string | Url to make the request to (i.e. '/cart.js') |
| data | object | Data to send to the url (i.e. {id: 123453, quantity: 1, properties: {} }) |
| options | object | Options for the request. Can include method, success and error functions. |

### queue.process()
Process through the queue. Prevents synchonous callbacks.
Fires a jQuery event 'cartfox:requestComplete'

**Kind**: instance method of [Queue](#Queue) 

---

## Cart
Class representing a cart

**Kind**: global class  

* [Cart](#Cart)
    * [new Cart(cart, options, selectors)](#new_Cart_new)
    * [.buildSelectors(selectors)](#Cart+buildSelectors)
    * [.getCart()](#Cart+getCart)
    * [.updateCart(cart)](#Cart+updateCart)
    * [.addItem(id, quantity, properties)](#Cart+addItem)

### new Cart(cart, options, selectors)
Build a new cart. Also creates a new queue.


| Param | Type | Description |
| --- | --- | --- |
| cart | object | The json of the cart for the initial data. Can be set using liquid tags with the json filter. {{ cart | json }} |
| options | object | The options for the cart. Overrides defaults. Curently not in use. |
| selectors | object | The selectors to update information and for events to listen to. |

### cart.buildSelectors(selectors)
Build the event listeners and DOMElement selectors.

**Kind**: instance method of [Cart](#Cart) 

| Param | Type | Description |
| --- | --- | --- |
| selectors | object | An object that includes all the selectors to use. |

### cart.getCart()
Get the cart

**Kind**: instance method of [Cart](#Cart)

### cart.updateCart(cart)
Update cart. 
Fires jQuery event 'cartfox:cartUpdated' and passes the cart to the event when it has completed.

**Kind**: instance method of [Cart](#Cart)

| Param | Type | Description |
| --- | --- | --- |
| cart | object | Update the cart json in the object. Will also fire events that update the quantity etc. |


### cart.addItem(id, quantity, properties)
Add an item to the cart. Fired when the selector for addItem is fired.
Fires a jQuery event cartfox:itemAdded.

**Kind**: instance method of [Cart](#Cart)

| Param | Type | Description |
| --- | --- | --- |
| id | number | The variant or product id you want to add to the cart |
| quantity | number | The quantity of the variant you want to add to the cart. Defaults to 1 if set to less than 1. |
| properties | object | The custom properties of the item. |

