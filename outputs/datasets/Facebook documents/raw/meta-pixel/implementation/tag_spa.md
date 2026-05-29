---
url: https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa
title: Tagging SPAs - Meta Pixel
status: 200
---

![](https://googleads.g.doubleclick.net/pagead/viewthroughconversion/963623955/?guid=ON&script=0)

![](https://dc.ads.linkedin.com/collect/?pid=276116&fmt=gif)

![](https://analytics.twitter.com/i/adsct?txn_id=nz7m3&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0)

![](https://t.co/i/adsct?txn_id=nz7m3&p_id=Twitter&tw_sale_amount=0&tw_order_quantity=0)

![](https://facebook.com/security/hsts-pixel.gif)

[Meta logo](https://developers.facebook.com/?no_redirect=true)

MoreMoreMore

DocsDocsDocs

ToolsToolsTools

SupportSupportSupport

Search input

​

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmeta-pixel%2Fimplementation%2Ftag_spa%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Pixel](https://developers.facebook.com/docs/meta-pixel)

- [Get Started](https://developers.facebook.com/docs/meta-pixel/get-started)
- [Guides](https://developers.facebook.com/docs/meta-pixel/guides)


  - [Track Multiple Events](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events)
  - [Advanced](https://developers.facebook.com/docs/meta-pixel/advanced)
  - [Advanced Matching](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching)
  - [Custom Audiences](https://developers.facebook.com/docs/meta-pixel/implementation/custom-audiences)
  - [Tagging SPAs](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa)
  - [Terms and Policies](https://developers.facebook.com/docs/meta-pixel/guides/terms-and-policies)

- [Support](https://developers.facebook.com/docs/meta-pixel/support)
- [Reference](https://developers.facebook.com/docs/meta-pixel/reference)

On This Page

[Meta Pixel Implementation for Single Page Applications](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa#meta-pixel-implementation-for-single-page-applications)

[Track a an Action](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa#track-a-an-action)

[Learn More](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa#learn-more)

# Meta Pixel Implementation for Single Page Applications

Single Page Applications (SPA) does not require a page to be reloaded when the URL changes therefore a different approach to event tracking with the Meta Pixel has to be followed.

### Requirements

- The Pixel's [base code](https://developers.facebook.com/docs/facebook-pixel/implementation) must already be installed on the webpage where you will be tracking events.

**Note:** You can set `disablePushState` to `true` to stop sending `PageView` events on history state changes but it is not recommended.

## Track a an Action

Track a specific area where an action it taking place using the History State API. There is no one one-size fits all solution to this as it highly depends on the framework and the implementation details. The general idea is to track the event whenever there is a URL change in the SPA. Hooking it into the routing system of the framework or application is required.

#### Example Code

```htm
...
<body>
  <ul id="menu" class="clearfix">
    <li><a href="link1">Link 1</a></li>  //Link to ViewContent
    <li><a href="link2">Link 2</a></li>  //Link to AddPaymentInfo
    <li><a href="link3">Link 3</a></li>  //Link to CompleteRegistration
  </ul>
...
  <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.0/jquery.min.js"></script>
  <script>
    (function($) {
      var loadContent = function(href) {     // Simulates an AJAX call to the server to grab new content
        $.ajax(href + ".html", {
          success: function(data) {
            history.pushState({ 'url': href }, 'New URL: ' + href, href);     // Called to the the URL on link click
            $('#content').html(data + new Date());

            var eventname = null;   //Optional Section - Demonstrates that additional
            switch (href) {         // events can be tracked on particular path changes
              case 'link1':
                eventname = 'ViewContent';
                break;
              case 'link2':
                eventname = 'AddPaymentInfo';
                break;
              case 'link3':
                eventname = 'CompleteRegistration';
                break;
              default:
            }

            fbq('track', eventname)   //Tracking event function is called
          },
          error: function() {
            console.log('An error occurred');
          }
        });
      };

      var init = function() {
        $('#menu a').click(function(e) {
          e.preventDefault();
          loadContent($(this).attr("href"));
        });
      };

      $(document).ready(function() {
        init();
      });
    })(jQuery);
  </script>
</body>
...
```

## Learn More

- Visit [Google's Tag Manager documentation](https://l.facebook.com/l.php?u=https%3A%2F%2Fmarketingplatform.google.com%2Fabout%2Ftag-manager%2F&h=AUDeBlth59TGGvtIfwcUqTugULzaWdKIppc5NxeroPeGEMkJm7LblNqBjaYwyAj6TGbDizuLc9jzhDrnKsC0NQ_SnEo2qc-FJPAbZF6mbEZ1g2ZWYHOgmZPhHcbUeHoHfT_UWlFGFEbuvQ) to track events using a tag manager
- Debug using [DataLayer plugins](https://l.facebook.com/l.php?u=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Fdatalayer-checker%2Fffljdddodmkedhkcjhpmdajhjdbkogke&h=AUBhSt6_ITvm1lmGKP2bovVBEzy-vKvffWMNP_Cq5fVB-DsoqN3XWvM10RSz9ZUglI2SFqh4KD_dNsoBXNq18so4O3K4b4p-wNGgjwV_LN-y3ekE4EsWeTtiZ_xt00aM85fHnEFdxi4Myg) or the [Meta Pixel Helper](https://l.facebook.com/l.php?u=https%3A%2F%2Fchrome.google.com%2Fwebstore%2Fdetail%2Ffacebook-pixel-helper%2Ffdgfkebogiimcoedlicjlajpkdmockpc&h=AUBxqs4qW8uxywvH4KS07DuIxEdzhkkdvC3q-KjaUAnRgZSf2Cbd-uxK4dnfZ6ibzVubt3XNCKnq3xvH1M-dcQkPWpt4l3KLYgo5WW1bBbexfQAIuYzqn1K1c67rEiBXZppWwSi6dIQ_EQ) to see event tracking

On This Page

[Meta Pixel Implementation for Single Page Applications](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa#meta-pixel-implementation-for-single-page-applications)

[Track a an Action](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa#track-a-an-action)

[Learn More](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa#learn-more)