---
title:  "Getting Started"
handle: "getting-started"
category: "getting started"
---

Grab `Cart.js` or `Cart.min.js` from [the repository](https://github.com/Elkfox/Cart).

Include the following in your `theme.liquid`

{% highlight liquid %}
{% raw %}{{ 'Cart.min.js' | asset_url | script_tag }}{% endraw %}
{% endhighlight %}

Optionally, include the styles located in the css directory of the repository.

Initialize a new Cart instance:

{% highlight html %}
<script type="text/javascript">
  var cart;
  $(document).ready(function() {
    cart = new Cart({% raw %}{{ cart | json }}{% endraw %});
  });
</script>
{% endhighlight %}

We build the new cart using the existing liquid cart object from Shopify, passed into JSON format. It's also possible to customize the cart with custom selectors, using a variety of options - as detailed below.
