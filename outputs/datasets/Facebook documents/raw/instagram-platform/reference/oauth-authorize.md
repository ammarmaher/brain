---
url: https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/
title: Oauth Authorize - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Freference%2Foauth-authorize%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)
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

[Oauth Authorize](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#oauth-authorize)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#reading)

[Requirements](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#requirements)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#request-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#query-string-parameters)

[Response](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#response)

[HTTP Example](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#http-example)

[Successful Authorization](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#successful-authorization)

[Canceled Authorization](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#canceled-authorization)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#deleting)

# Oauth Authorize

This endpoint returns the Authorization Window, which app users use to authenticate their identity and grant your app permissions and Instagram User Access Tokens.

## Creating

This operation is not supported.

## Reading

**`GET /oauth/authorize`**

Get the Authorization Window.

### Requirements

None.

### Request Syntax

```html
GET https://api.instagram.com/oauth/authorize
  ?client_id=<APP_ID>,
  &redirect_uri=<REDIRECT_URI>,
  &response_type=code,
  &scope=<PERMISSIONS_APP_NEEDS>
```

### Query String Parameters

Augment the request with the following query parameters.

| Key | Sample Value | Description |
| --- | --- | --- |
| `client_id`<br>**Required**<br>_Numeric string_ | `990602627938098` | Your Instagram App ID displayed in the **Meta App Dashboard** |
| `redirect_uri`<br>**Required**<br>_String_ | `https://socialsizzle.herokuapp.com/auth/` | A URI where we will redirect users after they authenticate. Make sure this exactly matches one of the base URIs in your list of valid oAuth URIs. Keep in mind that the App Dashboard may have added a trailing slash to your URIs, so we recommend that you verify by checking the list. |
| `response_type`<br>**Required**<br>_String_ | `code` | Set this value to `code`. |
| `scope`<br>**Required**<br>_Comma-separated list_ | `instagram_basic` or `instagram_business_basic` | A comma-separated list, or URL-encoded space-separated list, of permissions to request from the app user. `instagram_basic` or `instagram_business_basic` is required. |
| `state`<br>_String_ | `1` | An optional value indicating a server-specific state. For example, you can use this to protect against CSRF issues. We will include this parameter and value when redirecting the user back to you. |

### Response

The Authorization Window, which you should display to the app user. Once the user authenticates, the window will redirect to your `redirect_uri` and include an Authentication Code, which you can then exchange for a short-lived Instagram User Access Token.

Note that we `#_` append to the end of the redirect URI, but it is not part of the code itself, so strip it out before exchanging it for a short-lived token.

### HTTP Example

```json
https://api.instagram.com/oauth/authorize
  ?client_id=990602627938098
  &redirect_uri=https://socialsizzle.herokuapp.com/auth/
  &scope=instagram_business_basic
  &response_type=code
```

### Successful Authorization

If authentication is successful, the Authorization Window will redirect the user to your `redirect_uri` and include an Authorization Code. Capture the code so you can exchange it for a short-lived access token.

Codes are valid for 1 hour and can only be used once.

#### Sample Successful Authorization Redirect

```code
https://socialsizzle.herokuapp.com/auth?code=AQBx-hBsH3...
```

### Canceled Authorization

If the user cancels the authorization flow, we will redirect the user to your `redirect_uri` and append the following error parameters. _It is your responsibility to fail gracefully in these situations and display an appropriate message to your users_.

| Parameter | Value |
| --- | --- |
| `error` | `access_denied` |
| `error_reason` | `user_denied` |
| `error_description` | `The+user+denied+your+request` |

#### Sample Canceled Authentication Redirect

```code
https://socialsizzle.herokuapp.com/auth/
  ?error=access_denied
  &error_reason=user_denied
  &error_description=The+user+denied+your+request
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Oauth Authorize](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#oauth-authorize)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#reading)

[Requirements](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#requirements)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#request-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#query-string-parameters)

[Response](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#response)

[HTTP Example](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#http-example)

[Successful Authorization](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#successful-authorization)

[Canceled Authorization](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#canceled-authorization)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize/#deleting)