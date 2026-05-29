---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions
title: Mentions - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-facebook-login%2Fmentions%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#mentions)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#limitations)

[Endpoints](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#endpoints)

[Webhooks](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#webhooks)

[Examples](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#examples)

[Listening for and Replying to Comment @Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#listening-for-and-replying-to-comment--mentions)

[Listening for and Replying to Caption @Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#listening-for-and-replying-to-caption--mentions)

# Mentions

Identify captions, comments, and IG Media in which an Instagram Business or Creator's alias has been tagged or @mentioned.

## Limitations

- Mentions on Stories are not supported.
- Commenting on photos in which you were tagged is not supported.
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#webhooks) will not be sent if the Media upon which the comment or @mention appears was created by an account that is set to [private](https://www.facebook.com/help/instagram/448523408565555).

## Endpoints

The API consists of the following endpoints:

- [`GET /{ig-user-id}/tags`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/tags) — to get the media objects in which a Business or Creator Account has been tagged
- [`GET /{ig-user-id}?fields=mentioned_comment`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/mentioned_comment#reading) — to get data about a comment that an Business or Creator Account has been @mentioned in
- [`GET /{ig-user-id}?fields=mentioned_media`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/mentioned_media#reading) — to get data about a media object on which a Business or Creator Account has been @mentioned in a caption
- [`POST /{ig-user-id}/mentions`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/mentions#creating) — to reply to a comment or media object caption that a Business or Creator Account has been @mentioned in by another Instagram user

Refer to each endpoint reference document for usage instructions.

## Webhooks

Subscribe to the `mentions` field to recieve [Instagram Webhooks](https://developers.facebook.com/docs/instagram-api/guides/webhooks) notifications whenever an Instagram user mentions an Instagram Business or Creator Account. Note that we do not store Webhooks notification data, so if you set up a Webhook that listens for mentions, you should store any received data if you plan on using it later.

## Examples

### Listening for and Replying to Comment @Mentions

You can listen for comment @mentions and reply to any that meet your criteria:

1. Set up an [Instagram webhook](https://developers.facebook.com/docs/instagram-api/guides/webhooks) that's subscribed to the `mentions` field.
2. Set up a script that can parse the Webhooks notifications and identify comment IDs.
3. Use the IDs to query the `GET /{ig-user-id}/mentioned_comment` endpoint to get more information about each comment.
4. Analyze the returned results to identify any comments that meet your criteria.
5. Use the `POST /{ig-user-id}/mentions` endpoint to [reply to those comments](https://developers.facebook.com/docs/instagram-api/reference/ig-user/mentions#creating).

The reply will appear as a sub-thread comment on the comment in which the Business or Creator Account was mentioned.

### Listening for and Replying to Caption @Mentions

You can listen for caption @mentions and reply to any that meet your criteria:

1. Set up an [Instagram webhook](https://developers.facebook.com/docs/instagram-api/guides/webhooks) that's subscribed to the `mentions` field.
2. Set up a script that can parse the Webhooks notifications and identify media IDs.
3. Use the IDs to query the `GET /{ig-user-id}/mentioned_media` endpoint to get more information about each media object.
4. Analyze the returned results to identify media objects with captions that meet your criteria.
5. Use the `POST /{ig-user-id}/mentions` endpoint to [comment on those media objects](https://developers.facebook.com/docs/instagram-api/reference/ig-user/mentions#creating).

On This Page

[Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#mentions)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#limitations)

[Endpoints](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#endpoints)

[Webhooks](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#webhooks)

[Examples](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#examples)

[Listening for and Replying to Comment @Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#listening-for-and-replying-to-comment--mentions)

[Listening for and Replying to Caption @Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions#listening-for-and-replying-to-caption--mentions)