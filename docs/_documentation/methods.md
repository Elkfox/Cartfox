---
title:  "JavaScript"
handle: "javascript"
category: "javascript"
---

In some cases you may wish to fire your Focus element from within your JavaScript.

Say for example when a user scrolled a specific part of the page.

{% highlight html %}
  <div class="popup overlay" id="scrollPopup">
    <div class="popup-inner">
      <div class="popup-content left">
        <h2>👏 Now you're really getting focused!</h2>

        <a class="popup-close" data-close>Close popup</a>
      </div>
    </div>
  </div>

  <h2 id="scrollTrigger">Scroll to here I dare you</h2>
  <script type="text/javascript">
    // In this scenario we need to initialise our Focus element with JS
    var scrollPopup = new Focus('#scrollPopup');

    // Now scrollPopup has access to .hide .show and .toggle methods
    // The following js is use to detect how far we have scrolled.

    $(document).on('scroll load resize', function(){
      var docTop = ($(document).scrollTop() + $(window).height());
      var scrollTrigger = $('#scrollTrigger').offset().top;
      if( docTop > scrollTrigger && docTop < (scrollTrigger+100) ) {
        // Now we have scrolled far enough lets open the popup 🎉
        scrollPopup.show();
      }
    })
  </script>
{% endhighlight %}
