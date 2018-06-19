```
<script>
  var cart;
  $(document).ready(function() {
    cart = new CartFox({{ cart | json }});
  });
</script>
```

```
<script type="text/javascript">
  // Cart error handling
  $(document).on('cartfox:itemAdded', function(event, item) {
    console.log(event)
    console.log(item)
  });
  $(document).on('cartfox:itemRemoved', function(event, cart) {
    console.log('itemRemoved')
    console.log(event)
    console.log(cart)
  });
  $(document).on('cartfox:itemQuantityDecreased', function(event, cart) {
    console.log('itemQuantityDecreased')
    console.log(event)
    console.log(cart)
  });
  $(document).on('cartfox:cannotAddToCart', function(event, error) {
    console.log(event)
    console.log(error)
  });
  $(document).on('cartfox:cannotRemoveFromCart', function(event, error) {
    console.log('cartfox:cannotRemoveFromCart')
    console.log(event)
    console.log(error)
  });
  $(document).on('cartfox:cannotDecreaseItemQuantity', function(event, error) {
    console.log('cartfox:cannotDecreaseItemQuantity')
    console.log(event)
    console.log(error)
  });
</script>
```
