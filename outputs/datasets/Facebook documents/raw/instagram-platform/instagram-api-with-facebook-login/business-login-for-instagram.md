---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/
title: Facebook Login for Business   - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-facebook-login%2Fbusiness-login-for-instagram%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)


  - [Get Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started)
  - [Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram)
  - [Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery)
  - [Creator Marketplace API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/creator-marketplace)
  - [Copyright Detection](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection)
  - [Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search)
  - [Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions)
  - [Product Tagging](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/product-tagging)
  - [Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events)
  - [Collaboration](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration)

- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [Comment Moderation](https://developers.facebook.com/docs/instagram-platform/comment-moderation)
- [Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies)
- [Insights](https://developers.facebook.com/docs/instagram-platform/insights)
- [Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed)
- [Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories)
- [oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed)
- [Embed Button](https://developers.facebook.com/docs/instagram-platform/embed-button)
- [Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging)
- [API Reference](https://developers.facebook.com/docs/instagram-platform/reference)
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#facebook-login-for-business)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#before-you-start)

[Step 1: Construct the Login URL](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#step-1--construct-the-login-url)

[URL Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#url-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#query-string-parameters)

[Example URL](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#example-url)

[Step 2: Assign the URL to a Button](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#step-2--assign-the-url-to-a-button)

[Example Anchor Link](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#example-anchor-link)

[Step 3: Capture User access token](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#step-3--capture-user-access-token)

[Canceled Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#canceled-login)

[Redirect Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#redirect-syntax)

[Fragment Providers](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#fragment-providers)

[Example Redirect](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#example-redirect)

[Step 4: Get the User's Page, Page Access Token, and Instagram Business Account](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#step-4--get-the-user-s-page--page-access-token--and-instagram-business-account)

[cURL Example](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#curl-example)

[Example Response](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#example-response)

[Conclusion](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#conclusion)

# Facebook Login for Business

Facebook Login for Business is a custom, [manual Facebook Login flow](https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow) that makes it easier for you to onboard Instagram users who still need to configure their account for API access.

In order to make their account accessible to our APIs, Instagram users must first convert their account to a Professional account, create a Facebook Page that represents their business, then connect that Page to their account.

Facebook Login for Business simplifies this process by allowing Instagram users to complete all of these steps in a single window instead of having to complete them in the Facebook and Instagram apps.

## Before You Start

You will need a Meta [Business type app](https://developers.facebook.com/docs/development/create-an-app/other-app-types) to add the following products:

- Instagram > API setup with Facebook login
- Facebook Login for Business
- Webhooks

Add the Facebook Login for B product to your app and add a redirect URL. We will redirect users to this URL after they complete the onboarding flow.

1. Go to the [Apps Panel](https://developers.facebook.com/apps) and select your app to load it in the App Dashboard.
2. In the left-hand menu, click **Add Products**, locate **Facebook Login for Business**, then click **Set Up** to add it to your app.
3. In the left-hand menu under **Facebook Login for Business**, click **Settings**.
4. In the **Client OAuth Settings** \> **Valid OAuth Redirect URIs** field, enter your redirect URL.

## Step 1: Construct the Login URL

Construct the Business Login URL using its base URL and query string parameters.

### URL Syntax

```http
https://www.facebook.com/dialog/oauth
  ?client_id={client-id}
  &display={display}
  &extras={extras}
  &redirect_uri={redirect-uri}
  &response_type={response_type}
  &scope={scope}
```

### Query String Parameters

All parameters are **required**.

| Key | Placeholder | Description | Sample Value |
| --- | --- | --- | --- |
| `client_id` | `{client-id}` | Your Meta app ID. | `442224939723604` |
| `display` | `{display}` | Set to `page`. | `page` |
| `extras` | `{extras}` | Set to `{"setup":{"channel":"IG_API_ONBOARDING"}}`. | `{"setup":{"channel":"IG_API_ONBOARDING"}}` |
| `redirect_uri` | `{redirect_uri}` | URL to redirect user to after completing login flow. This URL must match a URL in the **Facebook Login** \> **Settings** \> **Client OAuth Settings** \> **Valid OAuth Redirect URI** field in the **App Dashboard**.<br>See [Before you start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#before-you-start). | `https://my-clever-redirect-url.com/success/` |
| `response_type` | `{response_type}` | Set to `token`. | `token` |
| `scope` | `{scope}` | A list of permissions you want to request from the user.<br>The list of permission you request will depend on which APIs your app relies on. Refer the endpoint references for any endpoints your app uses to determine which permission you should request. | `instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement` |

### Example URL

This is an example of a URL constructed by an app that relies on the Instagram Messaging API and has therefore requested permissions required by Messaging API endpoints.

```http
https://www.facebook.com/v25.0/dialog/oauth?client_id=442224939723604&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=https://my-clever-redirect-url.com/success/&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement
```

## Step 2: Assign the URL to a Button

Assign the URL to a standard anchor link or button of your own design and display it to any users who you are certain have not completed the onboarding flow.

### Example Anchor Link

```html
<a href="https://www.facebook.com/v25.0/dialog/oauth?client_id=442224939723604&display=page&extras={"setup":{"channel":"IG_API_ONBOARDING"}}&redirect_uri=https://my-clever-redirect-url.com/success/&response_type=token&scope=instagram_basic,instagram_content_publish,instagram_manage_comments,instagram_manage_insights,pages_show_list,pages_read_engagement">Login to Facebook</a>
```

## Step 3: Capture User access token

After a user clicks your link or button and completes the Business Login for Instagram flow, we will redirect the user to the URL you assigned to the `redirect_uri`. We will also append a URL fragment (`#`) with the user's short-lived [User access token](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#usertokens), some metadata about the token, and the user's [long-lived access token](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived). Capture the long-lived access token.

### Canceled Login

If a user cancels out of the login flow we will still redirect the user to your `redirect_uri` but append different data. Refer to the [Manually Build a Login Flow](https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow) document's [Canceled Login](https://developers.facebook.com/docs/facebook-login/guides/advanced/manual-flow#nonjscancel) section to learn how process these redirects.

### Redirect Syntax

```http
{redirect-url}?
  #access_token={access-token}
  &data_access_expiration_time={data-access-expiration-time}
  &expires_in={expires-in}
  &long_lived_token={long-lived-token}
```

### Fragment Providers

Token values have been truncated (`...`) in this example for readibility.

| Key | Placeholder | Description | Sample Value |
| --- | --- | --- | --- |
| `access_token` | `{access-token}` | The user's short-lived [User access token](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#usertokens). | `EAAHm...` |
| `data_access_expiration_time` | `{data-access-expiration-time}` | ISO 8601 timestamp when [data access expires](https://developers.facebook.com/docs/facebook-login/auth-vs-data/#data-access-expiration). | `1658889585` |
| `expires_in` | `{expires-in}` | Number of seconds until the short-lived User access token expires. | `4815` |
| `long_lived_token` | `{long-lived-token}` | The user's [long-lived access token](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived). | `ABAEs...` |

### Example Redirect

Token values have been truncated (`...`) in this example for readability.

```http
https://my-clever-redirect-url.com/success/?#access_token=EAAHm...&data_access_expiration_time=1658889585&expires_in=4815&long_lived_token=ABAEs...
```

## Step 4: Get the User's Page, Page Access Token, and Instagram Business Account

Send a request to the `GET /me/accounts` endpoint and request the following fields:

- `id`
- `name`
- `access_token`
- `instagram_business_account`

This will return a collection of Facebook Pages that the user can perform tasks on. For each Page in the result set, the response will include its:

- ID
- Name
- [Page access token](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#pagetokens)
- Instagram Business account ID connected to the Page

### cURL Example

Token values have been truncated (`...`) in this example for readability.

```curl
curl -i -X GET \
 "https://graph.facebook.com/v25.0/me/accounts?fields=id%2Cname%2Caccess_token%2Cinstagram_business_account&access_token=EAACw..."
```

### Example Response

Token values have been truncated (`...`) in this example for readability.

```json
{
  "data": [\
    {\
      "id": "134895793791914",\
      "name": "Metricsaurus",\
      "access_token": "EAACw...",\
      "instagram_business_account": {\
        "id": "17841405309211844"\
      }\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "MTc1NTg0Nzc2ODAzNDQwMgZDZD",
      "after": "MTc1NTg0Nzc2ODAzNDQwMgZDZD"
    }
  }
}
```

Capture the Page ID (`id`), Page access token (`access_token`), and Instagram Professional account ID (`instagram_business_account`) for the Page that the user has connected to their Instagram Professional account.

Keep in mind that some users may be able to perform tasks on more than one Page. If multiple Pages are included in the response, you may have to surface each Page's name (`name`) to the user so they can identify which Page's data to capture.

## Conclusion

You should now have everything you need to help your access and work with their data using our various APIs:

- Instagram Business account ID
- ID of the Facebook Page connected to the Instagram Business account
- the Facebook Page's access token (required by the [Instagram Messaging API](https://developers.facebook.com/docs/messenger-platform/instagram))
- a User access token from the user, who is able to perform tasks on the Facebook Page connected to the Instagram Business account (required by the [Instagram Graph API](https://developers.facebook.com/docs/instagram-api))

On This Page

[Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#facebook-login-for-business)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#before-you-start)

[Step 1: Construct the Login URL](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#step-1--construct-the-login-url)

[URL Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#url-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#query-string-parameters)

[Example URL](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#example-url)

[Step 2: Assign the URL to a Button](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#step-2--assign-the-url-to-a-button)

[Example Anchor Link](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#example-anchor-link)

[Step 3: Capture User access token](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#step-3--capture-user-access-token)

[Canceled Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#canceled-login)

[Redirect Syntax](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#redirect-syntax)

[Fragment Providers](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#fragment-providers)

[Example Redirect](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#example-redirect)

[Step 4: Get the User's Page, Page Access Token, and Instagram Business Account](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#step-4--get-the-user-s-page--page-access-token--and-instagram-business-account)

[cURL Example](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#curl-example)

[Example Response](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#example-response)

[Conclusion](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram/#conclusion)