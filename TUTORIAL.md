🛒🦊 Tutorial
==
Installation
--
### Prerequisites
* One of the cartfox.js files from `dist/`
  * We recommend `cartfox.min.js` or `cartfox.js` if you already have jQuery included in your theme.
  * If you don't have jQuery then you should use `cartfox.jquery.min.js` or `cartfox.jquery.js` as these both include jQuery as a dependency and work out of the box.
* A shopify store
* A shopify theme you want to install Cartfox on.


### Including Cartfox.
1. Place your choice of cartfox files inside you theme `assets/` folder. (For this tutorial we'll use `cartfox.min.js`)
2. Put the following in the `head` tags in your `theme.liquid` file found in your `layouts/` folder:
  ```liquid
    {{ 'cartfox.min.js' | asset_url | script_tag }}
  ```
3. Now at the bottom of your theme place the following:

```html
<script>
  var cartfox = new Cartfox({{ cart | json }}, {
        addItem: '#AddToCart',
        cartItemCount: "#CartItemCount",
        cartTotal: "#CartTotal, .cart-total",
        decreaseQuantity: ".minusOne",
        increaseQuantity: ".plusOne",
        itemQuantity: '.item-qty',
        removeItem: '.removeItem',
        emptyTemplate: '#CartToggled .items-hidden .item',
        itemContainer: '#CartToggled .items'
      });
</script>
```
This sets up all the initial code you need to run Cartfox. The only required argument for the `Cartfox()` class is the json for the current cart, it doesn't necessarily have to have any items in it this just tells Cartfox if you have any cart attributes or notes set up by default. The other argument is an Object which contains a list of the selectors we'll use. You can find more info about this [here](https://www.github.io/Elkfox/cartfox/README.md)

### product.liquid
Now we'll modify the page where you add items to the cart. We'll also have a cart popup that appears whenever someone adds something to the cart.

#### Modifying the Add To Cart button
 Open up `templates/product.liquid` inside your text editor of choice and locate the form where we add items to the cart.

Make sure you have two form fields one with the name `quantity` and one with the name `id`.

As both of these fields are required to add items to teh cart using the form if you don't have them consult your theme author.

Locate your submit button towards the bottom of your form.

It should look what is shown below.
```html
<button type="submit" name="add" id="AddToCart">
  <span id="AddToCartText">{{ 'product.add_to_cart' | t }}</span>
</button>
```

Make sure it has the same selector as your list of selectors when you initialised Cartfox. In our case our selector was `#AddToCart` and we can see that the button has an attribute `id="AddToCart` so we're good to go.





