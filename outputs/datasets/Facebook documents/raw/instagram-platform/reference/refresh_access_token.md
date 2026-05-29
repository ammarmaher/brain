---
url: https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token
title: Refresh Access Token - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Freference%2Frefresh_access_token%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Refresh Access Token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#refresh-access-token)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#reading)

[Requirements](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#requirements)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#request-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#query-string-parameters)

[Response](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#response)

[cURL Example](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#curl-example)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#deleting)

# Refresh Access Token

This endpoint allows you to refresh long-lived Instagram User Access Tokens.

## Creating

This operation is not supported.

## Reading

**`GET /refresh_access_token`**

Refresh a long-lived accesstoken that is at least 24 hours old but has not expired. Refreshed tokens are valid for 60 days from the date at which they are refreshed.

### Requirements

| Type | Requirement |
| --- | --- |
| Access tokens | Instagram User (long-lived) |
| Permissions | `instagram_business_basic` |

### Request Syntax

```html
GET https://graph.instagram.com/refresh_access_token
  ?grant_type=ig_refresh_token
  &access_token=<LONG_LIVED_ACCESS_TOKENS>
```

### Query String Parameters

Include the following query string parameters to augment the request.

| Key | Value |
| --- | --- |
| `grant_type`<br>**Required**<br>_String_ | Set this to `ig_refresh_token`. |
| `access_token`<br>**Required**<br>_String_ | The valid (unexpired) long-lived Instagram User Access Token that you want to refresh. |

### Response

A JSON-formatted object containing the following properties and values.

```json
{
  "access_token": "<ACCESS_TOKEN>",
  "token_type": "<TOKEN_TYPE>",
  "expires_in": <EXPIRES_IN>
}
```

**Response Contents**

| Value Placeholder | Value |
| --- | --- |
| `<ACCESS_TOKEN>`<br>_Numeric string_ | A long-lived Instagram User Access Token. |
| `<TOKEN_TYPE>`<br>_String_ | `bearer` |
| `<EXPIRES_IN>`<br>_Integer_ | The number of seconds until the long-lived token expires. |

### cURL Example

#### Request

```html
curl -X GET \
  'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=F4RVB...'
```

#### Response

```json
{
  "access_token": "c3oxd...",
  "token_type": "bearer",
  "expires_in": 5183944
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Refresh Access Token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#refresh-access-token)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#reading)

[Requirements](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#requirements)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#request-syntax)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#query-string-parameters)

[Response](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#response)

[cURL Example](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#curl-example)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token#deleting)