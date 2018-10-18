---
title:  "Events"
handle: "events"
category: "events"
---

The following events occur when interacting with Cart and can be used to trigger almost anything else:

| Event        | Parameters          | Description  |
|:---|:---|:---|
| cart:ready | Cart (Object) | Fires after Cart has been initiated and is ready to accept API calls. Returns the Cart instance. |
| cart:render | cart (Object) | Fires after the cart object has been updated. Useful for rendering or re-rendering the cart UI. |
| cart:beforeItemAdded | – | Fires before the add AJAX request has been sent. Useful for implementing a busy state for the cart UI. |
| cart:itemAdded | item (Object) | Fires after a new item has been successfully added to the cart. Returns the added line item. |
| cart:cannotAddToCart | error (Object) | Fires after an item cannot be added to the cart. Returns the error object. |
| cart:beforeItemRemoved | – | Fires before the remove AJAX request has been sent. Useful for implementing a busy state for the cart UI. |
| cart:itemRemoved | cart (Object) | Fires after an item has been successfully removed from the cart. Returns the updated cart object. |
| cart:cannotRemoveFromCart | error (Object) | Fires after an item cannot be removed from the cart. Returns the error object. |
| cart:beforeItemQuantityDecreased | – | Fires before the decrement AJAX request has been sent. Useful for implementing a busy state for the cart UI. |
| cart:itemQuantityDecreased | cart (Object) | Fires after an item's quantity has been successfully decreased. Returns the updated cart object. |
| cart:cannotDecreaseItemQuantity | error (Object) | Fires after an item's quantity cannot be decreased. Returns the error object. |
| cart:beforeItemQuantityIncreased | – | Fires before the increment AJAX request has been sent. Useful for implementing a busy state for the cart UI. |
| cart:itemQuantityIncreased | cart (Object) | Fires after an item's quantity has been successfully increased. Returns the updated cart object. |
| cart:cannotIncreaseItemQuantity | error (Object) | Fires after an item's quantity cannot be increased. Returns the error object. |
| cart:beforeCartCleared | – | Fires before the clear cart AJAX request has been sent. Useful for implementing a busy state for the cart UI. |
| cart:cartCleared | cart (Object) | Fires after the cart has been successfully cleared. Returns the updated (empty) cart object. |
| cart:cannotClearCart | error (Object) | Fires after an item's quantity cannot be increased. Returns the error object. |

### Implementing callbacks
Here's an example of a simple callback to add and remove a class from the cart whist it is processing a "clear" action.

Note the use of two seperate callbacks on the second function in order to account for a potential cart clearing error.

{% highlight html %}
<script type="text/javascript">
  // Before clearing the cart
  // Add the 'is-busy' class to the element '#PopupCart'
  $(document).on('cart:beforeCartCleared', function(event) {
    $('#PopupCart').addClass('is-busy');
  });

  // After successfully or unsuccessfully clearing the cart
  // Remove the 'is-busy' class from the element '#PopupCart'
  $(document).on('cart:cartCleared cart:cannotClearCart', function(event) {
    $('#PopupCart').removeClass('is-busy');
  });
</script>
{% endhighlight %}
