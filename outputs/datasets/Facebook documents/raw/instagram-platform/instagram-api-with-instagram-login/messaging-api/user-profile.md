---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile
title: User Profile API - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-instagram-login%2Fmessaging-api%2Fuser-profile%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Instagram User Profile API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#instagram-user-profile-api)

[Webhook notification](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#webhook-notification)

[Get profile information](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#get-profile-information)

[Reference](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#reference)

[Next steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#next-steps)

# Instagram User Profile API

The User Profile API allows your app to get an Instagram user's profile information using the user's Instagram-scoped ID received from an Instagram messaging webhook notification. Your app can use this information to create a personalized messaging experience for Instagram users who are interacting with your app users.

## User Consent

**User consent is required to access an Instagram user's profile.**

User consent is set only when an Instagram user sends a message to your app user, or clicks an icebreaker or persistent menu. If an Instagram user comments on a post or comment but has not sent a message to your app user, and your app tries to send the Instagram user a message, your app will receive an error, **User consent is required to access user profile.**

## Requirements

This guide assumes you have read the [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview) and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

You will need the following:

#### Access Level

- Advanced Access if your app serves Instagram professional accounts you don't own or manage
- Standard Access if your app serves Instagram professional accounts you own or manage and have added to your app in the App Dashboard

#### Access tokens

- An Instagram user access token requested from your app user who received the webhook notification and who can manage messages on the Instagram professional account

#### Base URL

All endpoints can be accessed via the `graph.instagram.com` host.

#### Endpoints

- `/<IGSID>`

#### IDs

- The Instagram-scoped ID (`<IGSID>`) for the Instagram user interested in your app user; [received from a webhook notification](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#webhook-notification)

#### Permissions

- `instagram_business_basic`
- `instagram_business_manage_messages`

#### Webhook event subscriptions

- `messages`
- `messaging_optins`
- `messaging_postbacks`
- `messaging_referral`

### Limitations

- If the Instagram user has blocked your app user, your app will not be able to view the Instagram user's information.

## Webhook notification

In order to get profile information for an Instagram user who has messaged your app user's Instagram professional account, you need the Instagram-scoped ID for the Instagram user that was sent in a message notification, the value of the `messages.sender.id` property.

```curl
{
  "object": "instagram",
  "entry": [\
    {\
      "id": "<YOUR_APP_USERS_IG_ID>",  // Your app user's Instagram Professional account ID\
      "time": <UNIX_TIMESTAMP>,\
      "messaging": [\
        {\
          "sender": { "id": "<INSTAGRAM_SCOPED_ID>" },    // Instagram-scoped ID for the Instagram user who sent the message\
...\
```\
\
## Get profile information\
\
To get an the Instagram user's profile information, send a `GET` request to the `/<INSTAGRAM_SCOPED_ID>` endpoint, where `<INSTAGRAM_SCOPED_ID>` is the Instagram-scoped ID received in a messaging webhook notification, with the `fields` parameter set to a comma separated list of information you would like to view.\
\
#### Sample Request\
\
_Formatted for readability._\
\
```curl\
curl -X GET "https://graph.instagram.com/v25.0/<INSTAGRAM_SCOPED_ID> \\
  ?fields=name,username,profile_pic,follower_count,is_user_follow_business,is_business_follow_user \\
  &access_token=<INSTAGRAM_ACCESS_TOKEN>"\
```\
\
On success, your app will receive the following JSON response:\
\
```json\
{\
  "name": "Peter Chang",\
  "username": "peter_chang_live",\
  "profile_pic": "https://fbcdn-profile-...",\
  "follower_count": 1234\
  "is_user_follow_business": false,\
  "is_business_follow_user": true,\
}\
```\
\
## Reference\
\
| Field Name | Description |\
| --- | --- |\
| `access_token`<br> _string_ | The Instagram user access token from your app user who can manage messages on the Instagram professional account who received the webhook notification |\
| `follower_count`<br> _int_ | The number of followers the Instagram user has |\
| `<IGSID>`<br> _int_ | The Instagram-scoped ID returned in a webhook notification that represents the Instagram user who interacted with your app user's Instagram professional account and triggered the notification |\
| `is_business_follow_user`<br> _boolean_ | Indicates whether your app user follows the Instagram user (`true`) or not (`false`) |\
| `is_user_follow_business`<br> _boolean_ | Indicates whether the Instagram user follows your app user (`true`) or not (`false`) |\
| `is_verified_user`<br> _boolean_ | Indicates whether the Instagram user has a verified Instagram account (`true`) or not (`false`) |\
| `name`<br> _string_ | The Instagram user's name (can be null if name not set) |\
| `profile_pic`<br> _url_ | The URL for the Instagram user's profile picture (can be null if profile pic not set). The URL will expire in a few days |\
| `username`<br> _string_ | The Instagram user's username |\
\
## Next steps\
\
Use this information to [send a quick reply](https://developers.facebook.com/docs/instagram/messaging-api/quick-replies).\
\
On This Page\
\
[Instagram User Profile API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#instagram-user-profile-api)\
\
[Webhook notification](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#webhook-notification)\
\
[Get profile information](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#get-profile-information)\
\
[Reference](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#reference)\
\
[Next steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api/user-profile#next-steps)