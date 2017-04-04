🛒🦊 Tutorial
==
Installation
--
### Prerequisites
* One of the cartfox.js files from `dist/`
* A shopify store
* A shopify theme you want to install Cartfox on.


### Including Cartfox.
1. Place your choice of cartfox files inside you theme `assets/` folder. (For this tutorial we'll use `cartfox.min.js`)
2. Put the following in the `head` tags in your `theme.liquid` file found in your `layouts/` folder:
  ```liquid
    {{ 'cartfox.min.js' | asset_url | script_tag }}
  ```
  N.B This should be below your jQuery script tag.

3. Below that place the following code

```html
<script>
  var cartfox = new Cartfox.Cart({{ cart | json }}, {
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

This sets up all the initial code you need to run Cartfox. The only required argument for the `Cartfox.Cart()` class is the json for the current cart, it doesn't necessarily have to have any items in it this just tells Cartfox if you have any cart attributes or notes set up by default. The other argument is an Object which contains a list of the selectors we'll use. You can find more info about this [here](https://www.github.io/Elkfox/cartfox/README.md)

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

### Popup Cart
As of version 2.0 Cartfox uses handlebars to handle cart layout when updating the minicart popup. Below is a snippet from Reinforced Concrete, Elkfox's inhouse custom shopify Framework. This includes the code for Cartfox to update the cart.

#### popup-cart.liquid
```html
<!-- /snippets/popup-cart.liquid -->

{% comment %}
  The popup cart has been added to display the cart contents on any page
{% endcomment %}

<div id="PopupCart" class="popup overlay">
  <div class="popup-inner">
    <div class="popup-outside"></div>
    <div class="popup-content left">
      <div class="h4">{{ 'cart.title' | t }}</div>
      <div class="items">
        {% for item in cart.items %}
          <div class="item">
            <p>
              <a class="item-title">{{ item.title }}</a>
            </p>
            <div class="row cart-item">
              <div class="column l6 m6 s6">
                <strong class="item-price">{{ item.line_price | money_with_currency }}</strong>
                <p><small><a href="#" class="removeItem" data-item-id="{{item.id}}">Remove</a></small></p>
              </div>
              <div class="column l6 m6 s6 right">
                <div class="quanity_adjust">
                  <a class="adjust minusOne">&#8722;</a>
                  <span class="quantity item-qty" data-item-id="{{item.id}}">{{ item.quantity }}</span>
                  <a class="adjust plusOne">&#43;</a>
                </div>
              </div>
            </div>
          </div>
        {% endfor %}
      </div>
      <hr>
      <p><small>{{ 'cart.shipping_at_checkout' | t }}</small></p>
      <div class="row cart-item">
        <div class="column l6 m6 s6">
          <a href="/cart" aria-label="{{ 'cart.view_cart' | t }}">{{ 'cart.view_cart' | t }}</a>
        </div>
        <div class="column l6 m6 s6 right">
          <strong>{{ 'cart.total' | t }} <span id="CartTotal" class="cart-total">{{ cart.total_price | money_with_currency }}</span></strong>
        </div>
      </div>
      <p class="center"><a href="/cart" class="button wide" aria-label="{{ 'cart.checkout' | t }}">{{ 'cart.checkout' | t }}</a></p>
      <a href="#close" class="popup-close" aria-label="{{ 'common.close' | t }}">{{ 'common.close' | t }}</a>
    </div>
  </div>
  {% raw %}
  <script id="CartTemplate" type="text/x-handlebars-template">
    <div class="item">
      <p>
        <a class="item-title">{{lineItem.title}}</a>
      </p>
      <div class="row cart-item">
        <div class="column l6 m6 s6">
          <strong class="item-price">{{formatMoney lineItem.original_line_price}}</strong>
          <p><small><a href="#" class="removeItem" data-item-id="{{lineTtem.id}}">Remove</a></small></p>
        </div>
        <div class="column l6 m6 s6 right">
          <div class="quanity_adjust">
            <a class="adjust minusOne">&#8722;</a>
            <span class="quantity item-qty" data-item-id="{{lineItem.id}}">{{ lineItem.quantity }}</span>
            <a class="adjust plusOne">&#43;</a>
          </div>
        </div>
      </div>
    </div>
  </script>
  {% endraw %}
</div>
```
The code above is the basic popup cart included in Concrete. At the moment it is basic and only allows us to update the quantity of an item or remove it.

#### Item Quantity Updates
You can update the quantity by adding two `a` tags on either side of your item quantity one with the class `minusOne` and the other with `plusOne`. These tags will grab the closest element with an `.item-qty` class and a data-item-id. 

Example
```html
  <a class="adjust minusOne">&#8722;</a>
  <span class="quantity item-qty" data-item-id="{{item.id}}">{{ item.quantity }}</span>
  <a class="adjust plusOne">&#43;</a>
```




