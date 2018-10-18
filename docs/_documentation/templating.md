---
title:  "Templating"
handle: "templating"
category: "templating"
---

In order to keep Cart as versatile as possible, we haven't included any cart rendering by default. However, we have made it painlessly simple to add rendering to your projects using only a few lines of code.

A rendering function can be defined at the time of the Cart initialization:

{% highlight html %}
<script type="text/javascript">
  cart = new Cart({% raw %}{{ cart | json }}{% endraw %}, {
    render: function(event, cart) {
      // Render anything you want here
    }
  });
</script>
{% endhighlight %}

Additionally, rendering functions can be called using the jQuery event `Cart:render` which is fired eevery time the cart is updated.

{% highlight html %}
<script type="text/javascript">
  $(document).on('Cart:render', function(event, cart) {
    // Render anything extra you want here
  });
</script>
{% endhighlight %}

### Examples
Here are a few of our favorite implementations using popular templating libraries:

#### Handlebars
We have provided this Handlebars example in the `templating/` folder. This implementation has been pulled from our in-house framework [Concrete](https://elkfox.github.io/Concrete/).

{% highlight html %}
<script data-Cart-template type="text/x-handlebars-template">

</script>

<script type="text/javascript">
  $(document).on('Cart:render', function(event, cart) {
    var source = $('[data-Cart-template]').html();
    var template = Handlebars.compile(source);
    var html = template(cart);
    $('[data-Cart-container]').html(html);
  });
</script>
{% endhighlight %}

#### Vue
Templating with Vue.

{% highlight html %}
<script type="vu/hoang">

</script>
{% endhighlight %}
