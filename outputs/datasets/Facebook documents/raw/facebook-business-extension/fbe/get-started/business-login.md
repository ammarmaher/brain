---
url: https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login
title: Business Login - Meta Business Extension
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Ffacebook-business-extension%2Ffbe%2Fget-started%2Fbusiness-login%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Business Extension](https://developers.facebook.com/docs/meta-business-extension/)

- [Overview](https://developers.facebook.com/docs/facebook-business-extension/fbe/overview)
- [Partner Integrations](https://developers.facebook.com/docs/facebook-business-extension/fbe/partner-int-overview)
- [Get Started](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started)
- [Walkthroughs](https://developers.facebook.com/docs/facebook-business-extension/fbe/guides)
- [Integration Review](https://developers.facebook.com/docs/facebook-business-extension/fbe/integration-review)
- [Self-serve Testing](https://developers.facebook.com/docs/facebook-business-extension/fbe/ss-testing)
- [Reference](https://developers.facebook.com/docs/facebook-business-extension/fbe/reference)
- [Direct Support](https://developers.facebook.com/docs/facebook-business-extension/fbe/support)
- [Offsite Deprecation](https://developers.facebook.com/docs/facebook-business-extension/fbe/deprecation)
- [Changelog](https://developers.facebook.com/docs/facebook-business-extension/fbe/changelog)
- [FAQs](https://developers.facebook.com/docs/facebook-business-extension/fbe/faqs)

On This Page

[Business Login Authentication](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#business-login-authentication)

[Requirements](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#requirements)

[Set Up Login Flow](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#login-flow)

[Mobile](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#mobile)

[Learn More](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#learn-more)

# Business Login Authentication

Business Login (commonly
known as [Facebook Login](https://developers.facebook.com/docs/facebook-login)) is an entry point that allows business owners to connect their business on your platform to their Facebook or Instagram profiles, using a button you place on your site.

Business Login lives on your platform's surface (usually in an internal admin panel on your site) and triggers the Business Login flow. Business owners can use this flow to associate their Facebook profiles to their business presence on your site and enable Facebook Business Extension (FBE) features.

A [Business On-Behalf-Of Solution (OBO)](https://developers.facebook.com/docs/marketing-api/business-manager/guides/on-behalf-of) connecting the partner and client businesses is created during FBE install. It allows the partner to get the FBE system user access token using a partner Business Manager admin system user’s credential, besides the client Business Manager admin’s credential (the current method).

**Note**: Business Apps can be used as an alternative to Business Login for authentication. [See the documentation on how to use Business Apps.](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/get-started/business-apps)

## Requirements

Your app may need to complete [App Review](https://developers.facebook.com/docs/facebook-login/review) to get the following [permissions](https://developers.facebook.com/docs/facebook-login/permissions/overview):

- `public_profile` — Advanced Access to this permission is necessary for all MBE integrations. This permission tells the MBE app who is installing an MBE integration. More information [here](https://developers.facebook.com/docs/permissions).

- `catalog_management` — Only if your app is going to enable Catalog features. Alternatively, you can request `ads_management` permission if you also want to manage merchants ads on behalf of the client.

- `business_creative_management` \- If your app is a creative app utilizing draper api.

### Set Up Login Flow

To set up the login flow, review these options:

- [Load Business Login via URL](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#biz_login_via_url)— **Recommended** if you don't intend to use the Facebook JavaScript SDK. This option requires that you link to a dynamically generated URL per business from a button on your site.

- [Load Business Login via Facebook SDK](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#biz_login_via_sdk)—The Facebook SDK provides common client-side functionality. We recommend this option for developers who are more familiar with it as it offers a more standardized approach to launching the same flow.


#### Load Business Login via URL

To trigger Business Login via URL, place a button on your site that opens a URL.

The Business Login URL must have these query parameters:

| Field | Description |
| --- | --- |
| `client_id`<br>Type: string | **Required**.<br>Meta App ID. |
| `display`<br>Type: string | **Required**.<br>Display type of Business Login: `popup`, `window`, or `page`. |
| `redirect_uri`<br>Type: string | **Required**.<br>Redirect URI that FBE redirects to after the flow is finished. |
| `response_type`<br>Type: string | **Required**.<br>Determines whether the Business Login response included when the redirect back to the app occurs is in URL parameters or fragments.<br>Use `token` if you need the `access_token` appended to the Redirect URI as a URL fragment, or `code` if you prefer to get the response as a URL parameter (it has to be [exchanged for an access token using API call](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow#exchangecode)). |
| `scope`<br>Type: string | **Required**.<br>Permissions or scopes are needed: `manage_business_extension`.<br>Depending of your use case, also `ads_management` or `catalog_management`.<br>In case of a creative app, scope should also include `business_creative_management`. |
| `extras`<br>Type: string | **Required**.<br>Contains the information regarding what flows and parameters the user will see during the flow. This includes `setup` and `business_config`. See supported [`extra` fields](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#extras). |
| `setup`<br>Type: string | **Required**.<br>Merchant’s Facebook setup, such as a their unique identifier (`external_business_id`) or currency of their catalog (`currency`). See supported [`setup` fields](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#setup). |
| `business_config`<br>Type: string | **Required**.<br>Object that FBE uses to configure the FBE workflow. See supported [`business_config` fields](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#biz-config). |

If your app requires **dynamic redirect URIs**, use the [state parameter](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/#logindialog) to pass back the dynamic information to your redirect URI after the Business Login flow is complete.

For details on how to format this URL and all required parameters, see the fields listed in [Facebook Business Extension API Objects and Types](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#objects-types).

In the example below, the `extras` query parameter is properly formatted and specifies both `business_config` and `setup` objects.

**Example URL**

```code
https://facebook.com/dialog/oauth?
client_id=<FB_APP_ID>
&display=page
&redirect_uri="https://partner-site.com/redirectlanding"
&response_type=token
&scope=manage_business_extension
//   alternatively use catalog_management or ads_management
//   &scope=manage_business_extension,catalog_management,ads_management
&extras={
  "setup": {
    "external_business_id": "foo-123",
    "timezone": "America/Los_Angeles",
    "currency": "USD",
    "business_vertical": "APPOINTMENTS"
  },
  "business_config": {
    "business": {
      "name": "Foo Business"
    },
    "page_cta": {
      "enabled": true,
      "cta_button_text": "Book Now",
      "cta_button_url": "https://partner-site.com/foo-business",
      "below_button_text": "Powered by FBE Partner"
    },
    "page_card": {
      "enabled": true,
      "see_all_text": "See All",
      "see_all_url": "https://partner-site.com/foo-business",
      "cta_button_text": "Book"
    },
    "ig_cta": {
      "enabled": true,
      "cta_button_text": "Book Now",
      "cta_button_url": "https://partner-site.com/foo-business"
    },
    "messenger_menu": {
      "enabled": true,
      "cta_button_text": "Book Now",
      "cta_button_url": "https://partner-site.com/foo-business"
    },
    "thread_intent": {
      "enabled": true,
      "cta_button_url": "https://partner-site.com/foo-business"
    }
  },
  "repeat": false
}
```

To manually build a Login flow, enter your redirect URL in the App Dashboard:

The redirect URL is a protection mechanism for FBE redirects. If the redirect from FBE does not match the domain in your app's redirect URL field, FBE will not redirect to the URL at the end of the flow.

1. Go to [App Dashboard](https://developers.facebook.com/apps/) and choose your app.
2. Scroll to **Add a Product** and click **Set Up** in the Facebook Login card.
3. Select **Settings** in the left side navigation panel.
4. Scroll to **Client OAuth Settings** and enter your redirect URL in the **Valid OAuth Redirect URIs** field.

As with a normal Facebook Login, the end of this flow returns an `access_token`, which you will use to get the Pixel ID, page ID, and Instagram Business ID.

#### Load Business Login via Facebook SDK

**Step 1**. Load the Facebook JavaScript SDK

You can download the SDK and host on your platform or pull down the Facebook-hosted SDK. We recommend using the Facebook-hosted SDK.

**Step 2**. Attach the `fbAsyncInit` function to the `Window` object to set up the SDK settings.

Before loading the javascript SDK, the `fbAsyncInit` function needs to exist on the `window` object. The SDK will call the function to set up the proper will call `window.fbAsyncInit()`.

This setup includes:

- `appId`: Facebook App ID.
- `cookie`: Enables cookies to allow the server to access this session.
- `xfbml`: Parses social plugins on this page.
- `version`: Tells SDK which graph API version to use (this doc was written at the time v10.0 was the latest release)

Before loading the JavaScript SDK, attach the `fbAsyncInit` to the `window` object.

**Step 3**. Launch FBE via the `FB.login()` function (also known as "Business Login").

After loading the SDK and initializing with the proper information, use the SDK to load `FB.login()`. The important parameters to pass to `FB.login()` function are:

1. Response callback function
2. Object for `scope` and `extras` field

| Field | Description |
| --- | --- |
| `scope` | **Required**.<br>Permissions or scopes needed: `manage_business_extension` and `ads_management` or `catalog_management`. |
| `extras` | **Required**.<br>Contains the information regarding which flows and parameters the user sees during the FBE workflow. This includes [`setup`](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#setup) and [`business_config`](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#biz-config). |
| `setup` | **Required**.<br>Defines the merchant’s Facebook setup such as a their unique identifier (`external_business_id`) or currency of their catalog (`currency`). See supported [`setup` fields](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#setup). |
| `business_config` | **Required**.<br>Object that FBE uses to configure the FBE workflow. See [`business_config` supported fields](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#biz-config). |

See [Facebook Business Extension API Objects and Types](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#objects-types) for details.

#### Example:

```code
<script>
    window.fbAsyncInit = function() {
    //2. FB JavaScript SDK configuration and setup
        FB.init({
            appId      : '<app_id>', // FB App ID
            cookie     : true,  // enable cookies to allow the server to access the session
            xfbml      : true,  // parse social plugins on this page
            version    : 'v4.0' // uses graph api version v4.0
        });
    };

    //1. Load the JavaScript SDK asynchronously
    (function(d, s, id) {
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) return;
        js = d.createElement(s); js.id = id;
        js.src = "https://connect.facebook.net/en_US/sdk.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

     //3. Facebook login with JavaScript SDK
    function launchFBE() {
        FB.login(function (response) {
            if (response.authResponse) {
                // returns a User Access Token with scopes requested
                const accessToken = response.authResponse.accessToken;
                const message = {
                    'success':true,
                    'access_token':accessToken,
                };
                // store access token for later
            } else {
              console.log('User cancelled login or did not fully authorize.');
            }
        }, {
            scope: 'catalog_management,manage_business_extension',
          // refer to the extras object table for details
            extras: {
                "setup":{
                  "external_business_id":"<external_business_id>",
                  "timezone":"America\/Los_Angeles",
                  "currency":"USD",
                  "business_vertical":"ECOMMERCE"
                },
                "business_config":{
                  "business":{
                     "name":"<business_name>"
                  },
                  "ig_cta": {
                    "enabled": true,
                    "cta_button_text": "Book Now",
                    "cta_button_url": "https://partner-site.com/foo-business"
                  }
                },
                "repeat":false
            }
        });
    }
</script>
```

**Step 4**. Create a button or link to launch FBE.

To load the screen, add a button or link `onClick` function that calls `launchFBE()`:

```code
<button onclick="launchFBE()"> Launch FBE Workflow </button>
```

#### Enter your redirect URL in the App Dashboard:

The redirect URL is a protection mechanism for FBE redirects. If the redirect from FBE does not match the domain in your app's redirect URL field, FBE will not redirect to the URL at the end of the flow.

1. Go to [App Dashboard](https://developers.facebook.com/apps/) and choose your app.

2. Scroll to **Add a Product** and click **Set Up** in the Facebook Login card.

3. Select **Settings** in the left navigation pane.

4. Scroll to **Client OAuth Settings** and in the **Valid OAuth Redirect URIs** field, enter your redirect URL.


## Mobile

For Mobile FBE implementation, see our [Mobile documentation](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/guides/mobile).

## Learn More

- How to do a [Business Apps](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/get-started/business-apps) integration
- Learn about [Facebook Login](https://developers.facebook.com/docs/facebook-login)
- View [FBE API Objects and Types](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/reference/#objects-types)
- Find out more about [App Review](https://developers.facebook.com/docs/facebook-login/review) and [permissions](https://developers.facebook.com/docs/facebook-login/permissions/overview)
- [How to uninstall FBE](https://developers.facebook.com/docs/marketing-api/fbe/fbe2/support#uninstall-fbe)

On This Page

[Business Login Authentication](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#business-login-authentication)

[Requirements](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#requirements)

[Set Up Login Flow](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#login-flow)

[Mobile](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#mobile)

[Learn More](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login#learn-more)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close