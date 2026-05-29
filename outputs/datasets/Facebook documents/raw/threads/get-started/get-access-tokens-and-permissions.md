---
url: https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/
title: Get Access Tokens - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fget-started%2Fget-access-tokens-and-permissions%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)


  - [Create an app](https://developers.facebook.com/docs/threads/get-started/create-an-app)
  - [Get Access Tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions)
  - [Long-Lived Access Tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens)
  - [App Access Tokens](https://developers.facebook.com/docs/threads/get-started/app-access-tokens)

- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)
- [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts)
- [Profiles](https://developers.facebook.com/docs/threads/threads-profiles)
- [Insights](https://developers.facebook.com/docs/threads/insights)
- [Webhooks](https://developers.facebook.com/docs/threads/webhooks)
- [oEmbed](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post)
- [Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents)
- [Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting)
- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Get Access Tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#get-access-tokens)

[Step 1: Get Authorization](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#step-1--get-authorization)

[Parameters](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#parameters)

[Sample Authorization Window URL](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#sample-authorization-window-url)

[Successful Authorization](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#successful-authorization)

[Canceled Authorization](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#canceled-authorization)

[Step 2: Exchange the Code For a Token](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#step-2--exchange-the-code-for-a-token)

[Parameters](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#parameters-2)

[Sample Request](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#sample-request)

[Sample Success Response](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#sample-success-response)

[Sample Rejected Response](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#sample-rejected-response)

# Get Access Tokens

This guide explains how to use the Authorization Window to get permissions from Threads users for short-lived Threads user access tokens.

## Step 1: Get Authorization

The Authorization Window allows app users to grant your app permissions and short-lived Threads user access tokens. After a user logs in and chooses which data to allow your app to access, we will redirect the user to your app and include an authorization code, which you can then exchange for a short-lived access token.

To begin the process, get the Authorization Window and present it to the user:

```code
https://threads.net/oauth/authorize
  ?client_id=<THREADS_APP_ID>
  &redirect_uri=<REDIRECT_URI>
  &scope=<SCOPE>
  &response_type=code
  &state=<STATE> // Optional
```

If accessing the Authorization Window from an Android mobile system, make sure to open the URL in the native webview or browser and not the native app.

An example of how you can achieve this with JavaScript:

```javascript
window.open(url, '_system');`
```

### Parameters

**Note:** All parameters except `state` are required.

| Name | Description |
| --- | --- |
| `client_id`<br>numeric string | **Required.**<br>Your Threads App ID displayed in **App Dashboard** \> **App settings** \> **Basic** \> **Threads App ID**.<br>**Example:**`990602627938098` |
| `redirect_uri`<br>string | **Required.**<br>A URI where we will redirect users after they allow or deny permission requests. Make sure this exactly matches one of the base URIs in your list of [valid OAuth URIs](https://developers.facebook.com/docs/development/create-an-app/threads-use-case#step-7--add-settings). Keep in mind that the App Dashboard may have added a trailing slash to your URIs, so we recommend that you verify by checking the list.<br>**Example:** https://socialsizzle.herokuapp.com/auth/ |
| `response_type`<br>string | **Required.**<br>Set this value to `code`. |
| `scope`<br>comma-separated or space-separated list | **Required.**<br>A comma-separated list, or URL-encoded space-separated list, of permissions to request from the app user.<br>**Note:**`threads_basic` is required.<br>**Values:**`threads_basic`, `threads_content_publish`, `threads_read_replies`, `threads_manage_replies`, `threads_manage_insights` |
| `state`<br>string | An optional value indicating a server-specific state. For example, you can use this to protect against CSRF issues. We will include this parameter and value when redirecting the user back to you.<br>**Example:**`1` |

### Sample Authorization Window URL

```code
https://threads.net/oauth/authorize
  ?client_id=990602627938098
  &redirect_uri=https://socialsizzle.herokuapp.com/auth/
  &scope=threads_basic,threads_content_publish
  &response_type=code
```

### Successful Authorization

If authorization is successful, we will redirect the user to your redirect\_uri and pass you an authorization code through the code query string parameter. Capture the code so your app can exchange if for a short-lived Threads User Access Token.

Authorization codes are valid for 1 hour and can only be used once.

#### Sample Successful Authentication Redirect

```code
https://socialsizzle.herokuapp.com/auth/?code=AQBx-hBsH3...#_
```

**Note:**`#_` will be appended to the end of the redirect URI, but it is not part of the code itself, so strip it out.

### Canceled Authorization

If the user cancels the authorization flow, we will redirect the user to your `redirect_uri` and append the following error parameters.

**Note:** It is your responsibility to fail gracefully in these situations and display an appropriate message to your users.

| Error Parameter | Description |
| --- | --- |
| `error` | `acceess_denied` |
| `error_reason` | `user_denied` |
| `error_description` | `The+user+denied+your+request` |

#### Sample Canceled Authorization Redirect

```code
https://socialsizzle.herokuapp.com/auth/?error=access_denied
  &error_reason=user_denied
  &error_description=The+user+denied+your+request
```

## Step 2: Exchange the Code For a Token

Once you receive a code, exchange it for a short-lived access token by sending a `POST` request to the following endpoint:

```code
POST https://graph.threads.net/oauth/access_token
```

### Parameters

Include the following parameters in your `POST` request body.

| Name | Description |
| --- | --- |
| `client_id`<br>numeric string | **Required.**<br>Your Threads App ID displayed in **App Dashboard** \> **App settings** \> **Basic** \> **Threads App ID**.<br>**Example:**`990602627938098` |
| `client_secret`<br>string | **Required.**<br>Your Threads App Secret displayed in **App Dashboard** \> **App settings** \> **Basic** \> **Threads App secret**.<br>**Example:**`a1b2C3D4` |
| `code`<br>string | **Required.**<br>The authorization code we passed you in the `code` parameter when redirecting the user to your `redirect_uri`.<br>**Example:**`AQBx-hBsH3...` |
| `grant_type`<br>string | **Required.**<br>Set this value to `authorization_code`. |
| `redirect_uri`<br>string | **Required.**<br>The redirect URI you passed us when you directed the user to our Authorization Window. This must be the same URI or we will reject the request.<br>**Example:** https://socialsizzle.heroku.com/auth/ |

### Sample Request

```code
curl -X POST \
  https://graph.threads.net/oauth/access_token \
  -F client_id=990602627938098 \
  -F client_secret=eb8c7... \
  -F grant_type=authorization_code \
  -F redirect_uri=https://socialsizzle.herokuapp.com/auth/ \
  -F code=AQBx-hBsH3...
```

### Sample Success Response

If successful, the API will return a JSON payload containing the app user's short-lived access token and User ID.

```code
{
  "access_token": "THQVJ...",
  "user_id": 17841405793187218
}
```

Capture the `access_token` value. This is the user’s short-lived Threads user access token, which your app can use to access Threads API endpoints.

### Sample Rejected Response

If the request is malformed in some way, the API will return an error.

```code
{
  "error_type": "OAuthException",
  "code": 400,
  "error_message": "Matching code was not found or was already used"
}
```

On This Page

[Get Access Tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#get-access-tokens)

[Step 1: Get Authorization](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#step-1--get-authorization)

[Parameters](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#parameters)

[Sample Authorization Window URL](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#sample-authorization-window-url)

[Successful Authorization](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#successful-authorization)

[Canceled Authorization](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#canceled-authorization)

[Step 2: Exchange the Code For a Token](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#step-2--exchange-the-code-for-a-token)

[Parameters](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#parameters-2)

[Sample Request](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#sample-request)

[Sample Success Response](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#sample-success-response)

[Sample Rejected Response](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions/#sample-rejected-response)