---
url: https://developers.facebook.com/docs/meta-pixel/advanced
title: Advanced - Meta Pixel
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmeta-pixel%2Fadvanced%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Advanced](https://developers.facebook.com/docs/meta-pixel/advanced#advanced)

[General Data Protection Regulation](https://developers.facebook.com/docs/meta-pixel/advanced#general-data-protection-regulation)

[Install the Pixel using an IMG Tag](https://developers.facebook.com/docs/meta-pixel/advanced#install-the-pixel-using-an-img-tag)

[Limitations](https://developers.facebook.com/docs/meta-pixel/advanced#limitations)

[Example IMG tag installation](https://developers.facebook.com/docs/meta-pixel/advanced#example-img-tag-installation)

[Aggregated Event Measurement IMG Pixel for iOS 14.5+](https://developers.facebook.com/docs/meta-pixel/advanced#aggregated-event-measurement-img-pixel-for-ios-14-5-)

[Missing IMG Pixel Data](https://developers.facebook.com/docs/meta-pixel/advanced#missing-img-pixel-data)

[Enabling AEM for auto-redirect scenarios](https://developers.facebook.com/docs/meta-pixel/advanced#enabling-aem-for-auto-redirect-scenarios)

[Tracking clicks on Buttons](https://developers.facebook.com/docs/meta-pixel/advanced#buttonclicks)

[Triggering events based on visibility](https://developers.facebook.com/docs/meta-pixel/advanced#scrolltrack)

[Triggering events based on page length or percentage](https://developers.facebook.com/docs/meta-pixel/advanced#scrollpagelengthtrack)

[Delayed Pixel Fires](https://developers.facebook.com/docs/meta-pixel/advanced#delayed-pixel-fires)

[Triggering events based on articles viewed per session](https://developers.facebook.com/docs/meta-pixel/advanced#viewarticles)

[Selective event tracking with multiple Pixels](https://developers.facebook.com/docs/meta-pixel/advanced#multipixels)

[Tracking events for individual Pixels](https://developers.facebook.com/docs/meta-pixel/advanced#tracking-events-for-individual-pixels)

[Automatic Configuration](https://developers.facebook.com/docs/meta-pixel/advanced#automatic-configuration)

[Content Security Policy](https://developers.facebook.com/docs/meta-pixel/advanced#content-security-policy)

# Advanced

Tips for alternate implementations, using the Pixel with single-page web apps, and tracking conversions with button clicks and page scrolling.

## General Data Protection Regulation

If you conduct business in countries that are subject to General Data Protection Regulation (GDPR), please refer to our [GDPR document](https://developers.facebook.com/docs/facebook-pixel/implementation/gdpr) to learn how to become compliant.

## Install the Pixel using an IMG Tag

While you can use the IMG tag to install Pixels, we suggest you refer to our [Implementation guide](https://developers.facebook.com/docs/meta-pixel/get-started#installing-the-pixel) for alternatives.

If you need to install the Pixel using a lightweight implementation, you can install it with an `<img>` tag. To do this, add the code below between an opening and closing `<noscript>` tag within your website's header or body, and replace `{pixel-id}` with your pixel's ID and `{standard-event}` with a [Standard Event](https://developers.facebook.com/docs/facebook-pixel/reference#standard-events).

```code
<img src="https://www.facebook.com/tr?id={pixel-id}&ev={standard-event}" height="1" width="1" style="display:none"/>
```

Pixels installed using an `<img>` tag also support [parameters](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking#parameters), which you can include in your query string. For example:

```code
<img src="https://www.facebook.com/tr?id=12345
  &ev=ViewContent
  &cd[content_name]=ABC%20Leather%20Sandal
  &cd[content_category]=Shoes
  &cd[content_type]=product
  &cd[content_ids]=1234
  &cd[value]=0.50
  &cd[currency]=USD" height="1" width="1" style="display:none"/>
```

### Limitations

- Cannot be fired multiple times on each page load
- Cannot track standard or custom events triggered by UI interactions (e.g., a button click)
- Subject to HTTP GET limits in sending custom data or long URLs
- Cannot be loaded asynchronously

### Example IMG tag installation

Below is an example of Meta Pixel IMG tag installation across key pages of a fictitious website using a fictitious Pixel ID (`12345`) and custom parameters (e.g. `cd[currency]=USD`).

On the product page, a Pixel to track a `PageView` event and another to track a `ViewContent` event:

```html
<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=12345&ev=PageView"/>
```

```html
<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=12345&ev=ViewContent"/>
```

On the add-to-cart page, one Pixel to track a `PageView` event and another to track an `AddToCart` event, with custom data:

```html
<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=12345&ev=PageView"/>
```

```html
<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=12345&ev=AddToCart&cd[currency]=USD&cd[value]=0.00"/>
```

On the purchase page, one Pixel to track a `PageView` event and another to track a `Purchase` event, with data about the purchase:

```html
<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=12345&ev=PageView"/>
```

```html
<img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=12345&ev=Purchase&cd[currency]=USD&cd[value]=0.00"/>
```

## Aggregated Event Measurement IMG Pixel for iOS 14.5+

Meta's Aggregated Event Measurement is a protocol that allows for measurement of web and app events from people using iOS 14.5 or later devices. Statistical modeling may be used and is designed to provide a more complete view of results when data is missing or partial.

We strongly recommend following the [Install the Pixel using an IMG tag section](https://developers.facebook.com/docs/facebook-pixel/advanced/#install-the-pixel-using-an-img-tag) of this doc when using the Pixel IMG tag or to forgo using the IMG tag and follow our [Implementation guide](https://developers.facebook.com/docs/facebook-pixel/implementation#installing-the-pixel) instead.

### Missing IMG Pixel Data

#### Runtime JavaScript

If you set up your IMG Pixel by using runtime JavaScript to generate a [JavaScript Image class](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FAPI%2FHTMLImageElement%2FImage&h=AUAjunHAcuh-k3-CsOfkm3I30rC86lCdk64tlfkaV5zkr13O675HnfnVoR7M2MsH87LQ9LYJuDw58T6Fl_Ra2WllHHGIC6JHewe7GIO63RqQ-Sgn_SBPbSsUan08FXNElGEQx_HQ44WVyg) without appending that Image class onto the website's DOM tree, for example, using third-party JavaScript libraries to send your IMG Pixel, you must add the following code or Meta will not receive your IMG Pixel data.

```javascript
var nativeBridge = window.webkit && window.webkit.messageHandlers && window.webkit.messageHandlers.receiveImgPixel;
if (nativeBridge) {
    const postObj = {
        id: {pixel-id},
        ev: {standard-event},
        cd: {stringified-custom-data},
        dpo: {data-processing-options},          // Optional CCPA param
        dpoco: {data-processing-option-country}, // Optional CCPA param
        dpost: {data-processing-option-state},   // Optional CCPA param
    };
    nativeBridge.postMessage(JSON.stringify(postObj));
}
```

#### Sandbox Attribute

If you place your Pixel IMG within an iframe that has the `sandbox` attribute you must add the `allow-scripts` value or Facebook will not receive your IMG Pixel data.

### Enabling AEM for auto-redirect scenarios

We have extended AEM functionality to consider conversions from all advertiser-associated webpages where an advertiser’s optimized Pixel events are fired (as in the specific scenarios where advertisers may rely on URL shorteners or geo-based redirects, may have multiple lines of business or may depend on agencies to run their advertising). If you fall into one of these scenarios and want to enable AEM, we recommend you do the following:

- Use the same Meta Pixel (i.e., same Pixel ID and Pixel event name pair) across the relevant domains they want to get conversions from
- Ensure that the AEM events you want to get conversions from are prioritized across these domains

## Tracking clicks on Buttons

When a visitor clicks a button, the Meta Pixel's JavaScript code automatically detects and passes the relevant form fields to Meta.

Suppose you have an e-commerce website and your "Add to Cart" button does not navigate to a new page. You may want to activate an event when the button is clicked.

In this example, we will activate a `ViewContent` standard event on page load. When someone clicks "Add to Cart" button, we will activate an `AddToCart` standard event.

To do this, first load Meta Pixel code that you want to fire on page load:

```html
<!-- Facebook Pixel Code -->
<script>
fbq('track', 'ViewContent', {
  content_name: 'Really Fast Running Shoes',
  content_category: 'Apparel & Accessories > Shoes',
  content_ids: ['1234'],
  content_type: 'product',
  value: 0.50,
  currency: 'USD'
 });
</script>
<!-- End Facebook Pixel Code -->
```

Then fire `AddToCart` either on a new page load or on the click of an Add To Cart button. There are multiple ways to handle clicks on buttons. Here's an example adding an `eventListener` to a button.

```html
<!-- Somewhere there is a button that performs Add to Cart -->
<button id="addToCartButton">Add To Cart</button>

<!-- Add Pixel Events to the button's click handler -->
<script type="text/javascript">
  var button = document.getElementById('addToCartButton');
  button.addEventListener(
    'click',
    function() {
      fbq('track', 'AddToCart', {
        content_name: 'Really Fast Running Shoes',
        content_category: 'Apparel & Accessories > Shoes',
        content_ids: ['1234'],
        content_type: 'product',
        value: 4.99,
        currency: 'USD'
      });
    },
    false
  );
</script>
```

There are many ways you can handle click events; just make sure to always call `fbq` function after the click.

Depending on how you have implemented the Pixel, the [Pixel Helper](https://developers.facebook.com/docs/facebook-pixel/support/pixel-helper) may show an error before the button is clicked. You can verify that your Pixel is firing correctly by clicking the button, which dismisses the helper's error.

## Triggering events based on visibility

For this example, suppose you have a blog and want to track users who read the entire content of an article. There's no action from the user other than scrolling to the end of the page.

Here's the sample HTML for a page where the Pixel loads:

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Facebook Pixel Code -->
  <script>
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');

  fbq('init', '<FB_PIXEL_ID>');
  fbq('track', "PageView");
  </script>
  <noscript><img height="1" width="1" style="display:none"
  src="https://www.facebook.com/tr?id=<FB_PIXEL_ID>&ev=PageView&noscript=1"
  /></noscript>
  <!-- End Facebook Pixel Code -->
</head>

<body>
  <h1>Scroll Page until the Lead event is fired</h1>
  <div style="height: 120vh; width: 100vw; background-color: #00f;"></div>
  <h1 id="fb-fire-pixel">Lead event will fire when this phrase enters the screen</h1>
  <div style="height: 120vh; width: 100vw; background-color: #000;"></div>
</body>
</html>
```

When the `h1` element with `id=fb-fire-pixel` appears, we should fire the `Lead` standard event. To verify an element is visible on screen, we add the following code to the page:

```js
// This code should be loaded together with Meta Pixel

var executeWhenElementIsVisible = function(dom_element, callback) {

  if (!(dom_element instanceof HTMLElement)) {
    console.error('dom_element must be a valid HTMLElement');
  }

  if (typeof callback !== 'function') {
    console.error(
      'Second parameter must be a function, got',
      typeof callback,
      'instead',
    );
  }

  function isOnViewport(elem) {
    var rect = elem.getBoundingClientRect();
    var docElem = document.documentElement;
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || docElem.clientHeight) &&
      rect.right <= (window.innerWidth || docElem.clientWidth)
    );
  }

  var executeCallback = (function() {
    var wasExecuted = false;
    return function() {
      if (!wasExecuted && isOnViewport(dom_element)) {
        wasExecuted = true;
        callback();
      }
    };
  })();

  window.addEventListener('scroll', executeCallback, false);
};
```

After that, we need to define how to fire the Pixel when the element is visible on screen:

```js
// Get the element that should be visible to trigger the pixel fire
var element = document.getElementById('fb-fire-pixel');

// Then, set the event to be tracked when element is visible
// Note that second parameter is a function, not a function call
executeWhenElementIsVisible(element, function() {
  fbq('track', 'Lead');
});
```

## Triggering events based on page length or percentage

For this example, suppose you want to track users who read up to a length or percentage of the page. There's no action from the user other than scrolling to the desired page length or percentage.

This first example is to track the length of the page which the user has read. In the example, we are firing off the lead Pixel when the user has read up to 500px length of the page.

```js
var executeWhenReachedPageLength = function(length, callback) {
  if (typeof length !== 'number') {
    console.error(
      'First parameter must be a number, got',
      typeof length,
      'instead',
    );
  }

  if (typeof callback !== 'function') {
    console.error(
      'Second parameter must be a function, got',
      typeof callback,
      'instead',
    );
  }

  function getWindowLength() {
    return window.innerHeight ||
      (document.documentElement || document.body).clientHeight;
  }

  function getCurrentScrolledLengthPosition() {
   return window.pageYOffset ||
     (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }

  var executeCallback = (function() {
    var wasExecuted = false;
    return function() {
      if (!wasExecuted && getCurrentScrolledLengthPosition() > length) {
        wasExecuted = true;
        callback();
      }
    };
  })();

  if (getWindowLength() >= length) {
    callback();
  } else {
    window.addEventListener('scroll', executeCallback, false);
  }
};

executeWhenReachedPageLength(10, function() {
  fbq('track', 'Lead');
});
```

This second example is to track the percentage of the page which the user has read. In the example, we are firing off the lead Pixel when the user has read 75% of the page.

```js
var executeWhenReachedPagePercentage = function(percentage, callback) {
  if (typeof percentage !== 'number') {
    console.error(
      'First parameter must be a number, got',
      typeof percentage,
      'instead',
    );
  }

  if (typeof callback !== 'function') {
    console.error(
      'Second parameter must be a function, got',
      typeof callback,
      'instead',
    );
  }

  function getDocumentLength() {
    var D = document;
    return Math.max(
        D.body.scrollHeight, D.documentElement.scrollHeight,
        D.body.offsetHeight, D.documentElement.offsetHeight,
        D.body.clientHeight, D.documentElement.clientHeight
    )
  }

  function getWindowLength() {
    return window.innerHeight ||
      (document.documentElement || document.body).clientHeight;
  }

  function getScrollableLength() {
    if (getDocumentLength() > getWindowLength()) {
      return getDocumentLength() - getWindowLength();
    } else {
      return 0;
    }
  }

  var scrollableLength = getScrollableLength();

  window.addEventListener("resize", function(){
    scrollableLength = getScrollableLength();
  }, false)

  function getCurrentScrolledLengthPosition() {
   return window.pageYOffset ||
     (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }

  function getPercentageScrolled() {
    if (scrollableLength == 0) {
      return 100;
    } else {
      return getCurrentScrolledLengthPosition() / scrollableLength * 100;
    }
  }

  var executeCallback = (function() {
    var wasExecuted = false;
    return function() {
      if (!wasExecuted && getPercentageScrolled() > percentage) {
        wasExecuted = true;
        callback();
      }
    };
  })();

  if (getDocumentLength() == 0 ||
    (getWindowLength()/getDocumentLength() * 100 >= percentage)) {
    callback();
  } else {
    window.addEventListener('scroll', executeCallback, false);
  }
};

executeWhenReachedPagePercentage(75, function() {
  fbq('track', 'Lead');
});
```

## Delayed Pixel Fires

Suppose you want to track users who interact with your website a few seconds before firing a Pixel event. You can do this with the `setTimeout` function.

```js
// Delay pixel fire by 3 seconds
var seconds = 3;
setTimeout(function() {
  fbq('track', 'Lead');
}, seconds * 1000);
```

It could be used to track “engaged” visits to a page, where people are not bouncing too fast and are actually reading the content.

## Triggering events based on articles viewed per session

If you want to know who viewed a certain number of articles from your site, you can have a session counter and load Meta Pixel code when this occurs.

We know that a session is a group of user interactions with your website that can take place within a given time frame per site request. You can increase the number of page views as long as you detect user activities given a time frame.

Assuming you have the variable `sessionCountViews` per `site_request`, you can add the Meta Pixel code based on the number of page views you counted.

Example counting only for the 6th article viewed

```js
if (site_request.sessionCountViews == 6) {
  fbq('track', "ViewContent", {
    sessionCountViews: site_request.sessionCountViews,
  });
}
```

## Selective event tracking with multiple Pixels

If you have multiple Pixels on the same page and would like to selectively fire events on each unique Pixel, the `trackSingle` and `trackSingleCustom` capabilities should be used.

Using the `track` function on pages that have multiple Pixels initialized (either using multiple base codes or even combining it within one base code) could produce over-firing or unexpected behavior and should be applied only in specific situations.

Example where we fire a `PageView` event on both initialized Pixels and selectively fire a Standard event (`Purchase`) on one Pixel and a Custom Event on a second Pixel.

```js
fbq('init', '<PIXEL_A>');
fbq('init', '<PIXEL_B>');
fbq('track', 'PageView'); //fire PageView for both initialized pixels

// only fire the Purchase event for Pixel A
fbq('trackSingle', '<PIXEL_A>', 'Purchase', {
      value: 4,
      currency: 'GBP',
});

// only fire the custom event Step4 for Pixel B
fbq('trackSingleCustom', '<PIXEL_B>', 'Step4',{
  //optional parameters
});
```

## Tracking events for individual Pixels

In unusual cases, you may want to send events to just one of the Pixels installed on your website; for example, to restrict the data sent to one of the Pixels on your website.
These methods track Pixel fires for a single Pixel. They're called using the following:

```code
fbq('trackSingle', 'FB_PIXEL_ID', 'Purchase', customData);
fbq('trackSingleCustom', 'FB_PIXEL_ID', 'CustomEvent', customData);
```

## Automatic Configuration

The Meta Pixel will send button click and page metadata (such as data structured according to Opengraph or Schema.org formats) from your website to improve your ads delivery and measurement and automate your Pixel setup. To configure the Meta Pixel to not send this additional information, in the Meta Pixel Base code, add `fbq('set', 'autoConfig', 'false', 'FB_PIXEL_ID')` above the init call.

```code
<!-- Facebook Pixel Code -->
<script>
!function(f,b,e,v,n,t,s){
if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
document,'script','https://connect.facebook.net/en_US/fbevents.js');
// Line to enable Manual Only mode.
fbq('set', 'autoConfig', false, 'FB_PIXEL_ID');
//Insert Your Facebook Pixel ID below.
fbq('init', 'FB_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript>
<img height="1" width="1" style="display:none"src="https://www.facebook.com/tr?id=FB_PIXEL_ID&amp;ev=PageView&amp;noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
```

## Content Security Policy

If your website has a [Content Security Policy](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.mozilla.org%2Fen-US%2Fdocs%2FWeb%2FHTTP%2FCSP&h=AUC-XyC4e2rMl51MagiOYkanSd_Ey-99t0Cw64F-O1RcaOkX7Z9f6BhvXyWs0ogNA5B_ySe67feLn40K8tCWR-lj0JwAVjTqOR4k8QcJah2-CBgEbN0mFjro9S0FNwCuDs_0-6Hyelfz3w), you should allow JavaScript to load from `https://connect.facebook.net`. Note: The Pixel load scripts from two paths: `/en_US/fbevents.js` and `/signals/config/{pixelID}?v={version}`.

On This Page

[Advanced](https://developers.facebook.com/docs/meta-pixel/advanced#advanced)

[General Data Protection Regulation](https://developers.facebook.com/docs/meta-pixel/advanced#general-data-protection-regulation)

[Install the Pixel using an IMG Tag](https://developers.facebook.com/docs/meta-pixel/advanced#install-the-pixel-using-an-img-tag)

[Limitations](https://developers.facebook.com/docs/meta-pixel/advanced#limitations)

[Example IMG tag installation](https://developers.facebook.com/docs/meta-pixel/advanced#example-img-tag-installation)

[Aggregated Event Measurement IMG Pixel for iOS 14.5+](https://developers.facebook.com/docs/meta-pixel/advanced#aggregated-event-measurement-img-pixel-for-ios-14-5-)

[Missing IMG Pixel Data](https://developers.facebook.com/docs/meta-pixel/advanced#missing-img-pixel-data)

[Enabling AEM for auto-redirect scenarios](https://developers.facebook.com/docs/meta-pixel/advanced#enabling-aem-for-auto-redirect-scenarios)

[Tracking clicks on Buttons](https://developers.facebook.com/docs/meta-pixel/advanced#buttonclicks)

[Triggering events based on visibility](https://developers.facebook.com/docs/meta-pixel/advanced#scrolltrack)

[Triggering events based on page length or percentage](https://developers.facebook.com/docs/meta-pixel/advanced#scrollpagelengthtrack)

[Delayed Pixel Fires](https://developers.facebook.com/docs/meta-pixel/advanced#delayed-pixel-fires)

[Triggering events based on articles viewed per session](https://developers.facebook.com/docs/meta-pixel/advanced#viewarticles)

[Selective event tracking with multiple Pixels](https://developers.facebook.com/docs/meta-pixel/advanced#multipixels)

[Tracking events for individual Pixels](https://developers.facebook.com/docs/meta-pixel/advanced#tracking-events-for-individual-pixels)

[Automatic Configuration](https://developers.facebook.com/docs/meta-pixel/advanced#automatic-configuration)

[Content Security Policy](https://developers.facebook.com/docs/meta-pixel/advanced#content-security-policy)