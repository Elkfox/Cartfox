---
title:  "Getting Started"
handle: "getting-started"
category: "getting started"
---

Grab `cartfox.js` or `cartfox.min.js` from [the repository](https://github.com/Elkfox/Cartfox).

Include the following in your `theme.liquid`

{% highlight liquid %}
{% raw %}{{ 'cartfox.min.js' | asset_url | script_tag }}{% endraw %}
{% endhighlight %}

Optionally, include the styles located in the css directory of the repository.

Initialize a new Cartfox instance:

{% highlight html %}
<script>
  var cart;
  $(document).ready(function() {
    cart = new CartFox({% raw %}{{ cart | json }}{% endraw %});
  });
</script>
{% endhighlight %}

We build the new cart using the existing liquid cart object from Shopify, passed into JSON format. It's also possible to customize the cart with custom selectors, using a variety of options - as detailed below.
