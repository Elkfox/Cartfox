---
title:  "Templating"
handle: "templating"
category: "templating"
---

In order to keep Cartfox as versatile as possible, we haven't included any cart rendering by default. However, we have made it painlessly simple to add rendering to your projects using only a few lines of code.

A rendering function can be defined at the time of the Cartfox initialization:

{% highlight html %}
<script>
  cart = new CartFox({% raw %}{{ cart | json }}{% endraw %}, {
    render: function(event, cart) {
      // Render anything you want here
    }
  });
</script>
{% endhighlight %}

Additionally, rendering functions can be called using the jQuery event `cartfox:render` which is fired eevery time the cart is updated.

{% highlight html %}
<script>
  $(document).on('cartfox:render', function(event, cart) {
    // Render anything extra you want here
  });
</script>
{% endhighlight %}

### Examples
Here are a few of our favorite implementations using popular templating libraries:

#### Handlebars
We have provided this Handlebars example in the `templating/` folder. This implementation has been pulled from our in-house framework [Concrete](https://elkfox.github.io/Concrete/).

{% highlight html %}
<script data-cartfox-template type="text/x-handlebars-template">

</script>

<script>
  $(document).on('cartfox:render', function(event, cart) {
    var source = $('[data-cartfox-template]').html();
    var template = Handlebars.compile(source);
    var html = template(cart);
    $('[data-cartfox-container]').html(html);
  });
</script>
{% endhighlight %}

#### Vue
Templating with Vue.

{% highlight html %}
<script type="vu/hoang">

</script>
{% endhighlight %}
