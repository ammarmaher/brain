---
url: https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/
title: Collaborators - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-graph-api%2Freference%2Fig-media%2Fcollaborators%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


    - [Children](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/children)
    - [Collaborators](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators)
    - [Comments](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/comments)
    - [Insights](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights)
    - [Product Tags](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/product_tags)

  - [IG User](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-user)
  - [/me](https://developers.facebook.com/docs/instagram-platform/reference/me)
  - [Oauth Authorize](https://developers.facebook.com/docs/instagram-platform/reference/oauth-authorize)
  - [Page](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/page)
  - [Refresh Access Token](https://developers.facebook.com/docs/instagram-platform/reference/refresh_access_token)

- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Collaborators](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#collaborators)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#reading)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#requirements)

[Request syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#request-syntax)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#sample-response)

[Path Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#path-parameters)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#query-string-parameters)

[Response fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#response-fields)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#deleting)

# Collaborators

Represents a list of users who are added as collaborators on an IG Media object.

Available for the Instagram API with Facebook Login.

## Creating

This operation is not supported.

## Reading

Get a list of Instagram users as collaborators and their invitation status on an IG Media object.

**`GET /<IG_MEDIA_ID>`**

### Limitations

- Up to 5 Instagram accounts can be added as collaborators
- Only IG users who have enabled collaborator tagging will be returned in the response
- Collaborators tagging supports Feed image, Reels and Carousel, Stories is not supported

### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | [User](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) – User must have created the IG Media object |
| [Permissions](https://developers.facebook.com/docs/permissions) | `instagram_basic`<br>`pages_read_engagement`<br>If the app user was granted a role on the Page via the Business Manager, you also need one of the following:<br>`ads_management`<br>`ads_read` |

### Request syntax

```curl
GET https://graph.facebook.com/<API_VERSION>/<IG_MEDIA_ID>/collaborators&<USER_ACCESS_TOKEN>
```

### Sample Response

```json
{
  "data": [\
    {\
      "id": "90010775360791",\
      "username": "realtest1",\
      "invite_status": "Accpeted"\
    },\
    {\
      "id": "17841449208283139",\
      "username": "realtest2",\
      "invite_status": "Pending"\
    }\
  ]
}
```

### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<API_VERSION>` | API [version](https://developers.facebook.com/docs/graph-api/guides/versioning). |
| `<IG_MEDIA_ID>` | **Required.** The ID for your app user's Instagram media. |

### Query String Parameters

| Key | Placeholder | Value |
| --- | --- | --- |
| `access_token` | `<USER_ACCESS_TOKEN>` | **Required.** Your app user's [User](https://developers.facebook.com/docs/facebook-login/access-tokens/#usertokens) access token. |

### Response fields

| Field Name | Description |
| --- | --- |
| `id` | The App-scoped ID for the Instagram account of the potential collaborator |
| `invite_status` | The status for the invitation sent to a potential collaborator. Can be one of the following:<br>- `Accepted`<br>- `Pending` |
| `username` | Instagram profile username for the potential collaborator |

## Updating

This operation is not supported.

## Deleting

This operation is not supported.

On This Page

[Collaborators](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#collaborators)

[Creating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#creating)

[Reading](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#reading)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#limitations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#requirements)

[Request syntax](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#request-syntax)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#sample-response)

[Path Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#path-parameters)

[Query String Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#query-string-parameters)

[Response fields](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#response-fields)

[Updating](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#updating)

[Deleting](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api/reference/ig-media/collaborators/#deleting)