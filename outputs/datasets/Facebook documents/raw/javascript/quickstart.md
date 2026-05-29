---
url: https://developers.facebook.com/docs/javascript/quickstart/
title: Quickstart - Facebook SDK for JavaScript
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fjavascript%2Fquickstart%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook SDK for JavaScript](https://developers.facebook.com/docs/javascript)

- [Quickstart](https://developers.facebook.com/docs/javascript/quickstart)
- [Advanced Setup](https://developers.facebook.com/docs/javascript/advanced-setup)
- [Examples](https://developers.facebook.com/docs/javascript/examples)
- [Frameworks](https://developers.facebook.com/docs/javascript/frameworks)
- [Reference](https://developers.facebook.com/docs/javascript/reference)

On This Page

[Quickstart: Facebook SDK for JavaScript](https://developers.facebook.com/docs/javascript/quickstart/#quickstart--facebook-sdk-for-javascript)

[Basic Setup](https://developers.facebook.com/docs/javascript/quickstart/#loading)

[Next Steps](https://developers.facebook.com/docs/javascript/quickstart/#next)

# Quickstart: Facebook SDK for JavaScript

The Facebook SDK for JavaScript provides a rich set of client-side functionality that:

- Enables you to use the [Like Button](https://developers.facebook.com/docs/reference/plugins/like) and other [Social Plugins](https://developers.facebook.com/docs/plugins) on your site.
- Enables you to use [Facebook Login](https://developers.facebook.com/docs/concepts/login) to lower the barrier for people to sign up on your site.
- Makes it easy to call into Facebook's [Graph API](https://developers.facebook.com/docs/reference/api).
- Launch Dialogs that let people perform various actions like sharing stories.
- Facilitates communication when you're building a [game](https://developers.facebook.com/docs/guides/canvas) or an [app tab](https://developers.facebook.com/docs/appsonfacebook/pagetabs) on Facebook.

This quickstart will show you how to setup the SDK and get it to make some basic Graph API calls. If you don't want to setup just yet, you can use our [JavaScript Test Console](https://developers.facebook.com/tools/console/) to use all of the SDK methods, and explore some examples (you can skip the setup steps, but the rest of this quickstart can be tested in the console).

**Supported Browsers**

The Facebook SDK for JavaScript supports the latest two versions of the most popular browsers: Chrome, Firefox, Edge, Safari (including iOS), and Internet Explorer (version 11 only).

## Basic Setup

The Facebook SDK for JavaScript doesn't have any standalone files that need to be downloaded or installed, instead you simply need to include a short piece of regular JavaScript in your HTML that will asynchronously load the SDK into your pages. The async load means that it does not block loading other elements of your page.

The following snippet of code will give the basic version of the SDK where the options are set to their most common defaults. You should insert it directly after the opening `<body>` tag on each page you want to load it:

```code
<script>
  window.fbAsyncInit = function() {
    FB.init({
      appId            : 'your-app-id',
      xfbml            : true,
      version          : 'v25.0'
    });
  };
</script>
<script async defer crossorigin="anonymous" src="https://connect.facebook.net/en_US/sdk.js"></script>

```

This code will load **and** initialize the SDK. You must replace the value in `your-app-id` with the ID of your own Facebook App. You can find this ID using the [App Dashboard](https://developers.facebook.com/apps).

## Next Steps

[Advanced Setup](https://developers.facebook.com/docs/javascript/advanced-setup) [Usage Examples](https://developers.facebook.com/docs/javascript/examples)

On This Page

[Quickstart: Facebook SDK for JavaScript](https://developers.facebook.com/docs/javascript/quickstart/#quickstart--facebook-sdk-for-javascript)

[Basic Setup](https://developers.facebook.com/docs/javascript/quickstart/#loading)

[Next Steps](https://developers.facebook.com/docs/javascript/quickstart/#next)