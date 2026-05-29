---
url: https://developers.facebook.com/docs/plugins/share-button
title: Share Button - Social Plugins
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2Fshare-button%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Social Plugins](https://developers.facebook.com/docs/plugins)

- [Embedded Posts](https://developers.facebook.com/docs/plugins/embedded-posts)
- [Page Plugin](https://developers.facebook.com/docs/plugins/page-plugin)
- [Share Button](https://developers.facebook.com/docs/plugins/share-button)
- [Child-Directed Sites](https://developers.facebook.com/docs/plugins/restrictions)
- [Best Practices](https://developers.facebook.com/docs/plugins/best-practices)

On This Page

[Share Button](https://developers.facebook.com/docs/plugins/share-button#share-button)

[Step-by-Step](https://developers.facebook.com/docs/plugins/share-button#step-by-step)

[Share Button Configurator](https://developers.facebook.com/docs/plugins/share-button#configurator)

[Full Code Example](https://developers.facebook.com/docs/plugins/share-button#example)

[Settings](https://developers.facebook.com/docs/plugins/share-button#settings)

# Share Button

The Share button lets people add a personalized message to links before sharing on their timeline, in groups, or to their friends via a Facebook Message.

If your app is native to iOS or Android, we recommend that you use the native [Share Dialog on iOS](https://developers.facebook.com/docs/ios/share-dialog/) and [Share Dialog on Android](https://developers.facebook.com/docs/android/share-dialog/) instead.

If your website doesn't need a button to open share dialog or Facebook provided button doesn't fit into your website design, [Web Share Dialog](https://developers.facebook.com/docs/sharing/reference/share-dialog) is also provided for sharing links. Note that you do not need to implement Facebook login or request any additional permissions through app review in order to use this plugin.

- [**Share Button Configurator**](https://developers.facebook.com/docs/plugins/share-button#configurator)
- [**Code Example**](https://developers.facebook.com/docs/plugins/share-button#example)
- [**Settings**](https://developers.facebook.com/docs/plugins/share-button#settings)
- [**FAQs**](https://developers.facebook.com/docs/plugins/faqs)

## Step-by-Step

#### 1\. Choose URL or Page

Pick the URL of a website or Facebook Page you want to share.

#### 2\. Code Configurator

Paste the URL to the [Code Configurator](https://developers.facebook.com/docs/plugins/share-button#configurator) and adjust the `layout` of your share button. Click the **`Get Code`** button to generate your share button code.

#### 3\. Copy & Paste HTML snippet

Copy and past the snippet into the HTML of the destination website.

## Share Button Configurator

href

layout

[button\_count](https://developers.facebook.com/docs/plugins/share-button#)

size

[small](https://developers.facebook.com/docs/plugins/share-button#)

[Get code](https://developers.facebook.com/plugins/code?path=share_button&href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F)

## Full Code Example

Copy & paste the code example to your website. Adjust the value `data-href` to your website URL. Next use the `og:***` meta tags to adjust your link preview. `og:url` and `data-href` should use the same URL.

```code
<html>
<head>
<title>Your Website Title</title>
<!-- You can use Open Graph tags to customize link previews.
Learn more: https://developers.facebook.com/docs/sharing/webmasters -->
<meta property="og:url"           content="https://www.your-domain.com/your-page.html" />
<meta property="og:type"          content="website" />
<meta property="og:title"         content="Your Website Title" />
<meta property="og:description"   content="Your description" />
<meta property="og:image"         content="https://www.your-domain.com/path/image.jpg" />
</head>
<body>

<!-- Load Facebook SDK for JavaScript -->
<div id="fb-root"></div>
<script>(function(d, s, id) {
var js, fjs = d.getElementsByTagName(s)[0];
if (d.getElementById(id)) return;
js = d.createElement(s); js.id = id;
js.src = "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.0";
fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));</script>

<!-- Your share button code -->
<div class="fb-share-button"
data-href="https://www.your-domain.com/your-page.html"
data-layout="button_count">
</div>

</body>
</html>
```

## Settings

| Setting | HTML5 Attribute | Description | Default |
| --- | --- | --- | --- |
| `href` | `data-href` | The absolute URL of the page that will be shared. | XFBML and HTML5 versions default to the current URL. |
| `lazy` | `data-lazy` | `true` means use the browser's lazy-loading mechanism by setting the `loading="lazy"` iframe attribute. The effect is that the browser does not render the plugin if it's not close to the viewport and might never be seen. Can be one of `true` or `false` (default). | `false` |
| `layout` | `data-layout` | Selects one of the different layouts that are available for the plugin. Can be one of `box_count`, `button_count`, `button`. | `icon_link` |
| ~~`mobile_iframe`~~ <br>Deprecated | ~~`data-mobile_iframe`~~ | ~~If set to `true`, the share button will open the share dialog in an iframe (instead of a popup) on top of your website on mobile. This option is **only available for mobile**, not desktop. For more information see Mobile Web Share Dialog.~~ | ~~`false`~~ |
| `size` | `data-size` | The button is offered in 2 sizes i.e. `large` and `small`. | `small` |

# Related Topics

[Social Plugins FAQs](https://developers.facebook.com/docs/plugins/faqs) [Share Dialog](https://developers.facebook.com/docs/sharing/reference/share-dialog) [Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters) [Facebook SDK for JavaScript](https://developers.facebook.com/docs/javascript)

On This Page

[Share Button](https://developers.facebook.com/docs/plugins/share-button#share-button)

[Step-by-Step](https://developers.facebook.com/docs/plugins/share-button#step-by-step)

[Share Button Configurator](https://developers.facebook.com/docs/plugins/share-button#configurator)

[Full Code Example](https://developers.facebook.com/docs/plugins/share-button#example)

[Settings](https://developers.facebook.com/docs/plugins/share-button#settings)