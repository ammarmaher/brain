---
url: https://developers.facebook.com/docs/instagram-platform/reference/access_token
title: Access Token - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Freference%2Faccess_token%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


  - [Error Codes](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/error-codes)
  - [Access Token](https://developers.facebook.com/docs/instagram-platform/reference/access_token)
  - [IG Comment](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-comment)
  - [IG Container](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-container)
  - [IG Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag-search)
  - [IG Hashtag](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-hashtag)
  - [IG Media](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media)
  - [IG User](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user)
  - [/me](https://developers.facebook.com/docs/instagram-platform/reference/me)
  - [Oauth Authorize](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize)
  - [Page](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page)
  - [Refresh Access Token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token)

- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Access Token](https://developers.facebook.com/docs/instagram-platform/reference/access_token#access-token)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/access_token#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/access_token#reading)

[Limitations](https://developers.facebook.com/docs/instagram-platform/reference/access_token#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/reference/access_token#requirements)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/reference/access_token#request-syntax)

[Response](https://developers.facebook.com/docs/instagram-platform/reference/access_token#response)

[cURL Example](https://developers.facebook.com/docs/instagram-platform/reference/access_token#curl-example)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/access_token#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/access_token#deleting)

# Access Token

The `/access_token` endpoint allows you to exchange short-lived Instagram User Access Tokens, those that expire in one hour, for long-lived Instagram User access Tokens that expire in 60 days.

## Creating

This operation is not supported.

## Reading

**`GET /access_token`**

Exchange a short-lived Instagram User access token, that expires in one hour, for long-lived Instagram User access token that expires in 60 days.

### Limitations

Requests for long-lived tokens include your app secret so should only be made in server-side code, never in client-side code or in an app binary that could be decompiled. Do not share your app secret with anyone, expose it in code, send it to a client, or store it in a device.

### Requirements

#### Access tokens

- An Instagram User access token requested from a person who can send a message from the Instagram professional account

#### Base URL

All endpoints can be accessed via the graph.instagram.com host.

#### Endpoints

- `/access_token`

#### Required Parameters

The following table contains the required parameters for each API request.

| Key | Value |
| --- | --- |
| `client_secret`<br>**Required**<br>_String_ | Your Instagram app's secret from the App Dashboard |
| `grant_type`<br>**Required**<br>_String_ | Set this to `ig_exchange_token` |
| `access_token`<br>**Required**<br>_String_ | The valid (unexpired) short-lived Instagram User Access Token that you want to exchange for a long-lived token. |

#### Permissions

- `instagram_basic` for apps that implemented Facebook Login for Business
- `instagram_business_basic` for apps that implemented Business Login for Instagram

### Request Syntax

_Formatted for readability._

```code
GET https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_secret=<INSTAGRAM_APP_SECRET>
  &access_token=<VALID_SHORT_LIVED_ACCESS_TOKEN>
```

### Response

Upon success, your app receives a JSON-formatted object containing the following:

- `access_token` set to the new, long-lived Instagram User access token; _numeric string_
- `token_type` set to `bearer`; _string_
- `expires_in` set to the number of seconds until the token expires; _integer_

### cURL Example

#### Request

```curl
curl -X GET "https://graph.instagram.com/access_token?grant_type=ig_exchange_token&&client_secret=eb87G...&access_token=IGQVJ..."
```

#### Response

```json
{
  "access_token": "lZAfb2dhVW...",
  "token_type": "bearer",
  "expires_in": 5184000
}
```

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Access Token](https://developers.facebook.com/docs/instagram-platform/reference/access_token#access-token)

[Creating](https://developers.facebook.com/docs/instagram-platform/reference/access_token#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/reference/access_token#reading)

[Limitations](https://developers.facebook.com/docs/instagram-platform/reference/access_token#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/reference/access_token#requirements)

[Request Syntax](https://developers.facebook.com/docs/instagram-platform/reference/access_token#request-syntax)

[Response](https://developers.facebook.com/docs/instagram-platform/reference/access_token#response)

[cURL Example](https://developers.facebook.com/docs/instagram-platform/reference/access_token#curl-example)

[Updating](https://developers.facebook.com/docs/instagram-platform/reference/access_token#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/reference/access_token#deleting)