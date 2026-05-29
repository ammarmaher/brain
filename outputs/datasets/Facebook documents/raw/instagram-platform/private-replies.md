---
url: https://developers.facebook.com/docs/instagram-platform/private-replies
title: Private Replies - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Fprivate-replies%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Send a Private Reply to a Commenter](https://developers.facebook.com/docs/instagram-platform/private-replies#send-a-private-reply-to-a-commenter)

[How It Works](https://developers.facebook.com/docs/instagram-platform/private-replies#how-it-works)

[Requirements](https://developers.facebook.com/docs/instagram-platform/private-replies#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/private-replies#limitations)

[Send a Private Reply](https://developers.facebook.com/docs/instagram-platform/private-replies#send-a-private-reply)

# Send a Private Reply to a Commenter

This documents shows you how to programmatically send a private reply to a person who commented on your app user's Instagram professional post, reel, story, Live, or ad post.

## How It Works

Step 1. An Instagram user comments on your app user's Instagram professional post, reel, story, Live, or ad post.

Step 2. A webhook event is triggered and Meta sends your server a notification with information about the comment including:

|     |     |
| --- | --- |
| - Your app user's Instagram professional account ID<br>- The commenter's Instagram-scoped ID and username<br>- The comment's ID<br>- The media's ID, if the commenter included media in their comment<br>- The text of the comment, if applicable<br>Step 3. Your app uses the comment's ID to send a private response directly to the Instagram user. This reply appears in the person's **Inbox**, if the person follows the Instagram professional account, or to the **Request** folder, if they do not. | ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/118520113_305452657552386_5531150750029687976_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=Kc4Hq-SVArsQ7kNvwHwchWU&_nc_oc=AdpFJgq4MXyrqSVXUQAlwzRU7uOr8ZIVGazkGlobU71yE0TdIWrJsuN0SvBy7zXnnlM&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=AQGkqGDKgad7eOgeVoDbTA&_nc_ss=7b289&oh=00_Af7YE2oM0dZLMbsCABwj8Dm0kAwI37TIxyraHeMrYeoGVQ&oe=6A256BCA) |

Step 4. Your app can send this private reply within 7 days of the creation time of the comment, excepting Instagram Live, where replies can only be sent during the live broadcast. The private reply message includes a link to the commented post.

## Requirements

This guide assumes you have read the [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview) and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

You need the following:

|  | Instagram API with Instagram Login | Instagram API with Facebook Login |
| --- | --- | --- |
| **Access Tokens** | - Instagram User access token | - [Facebook Page access token](https://developers.facebook.com/docs/facebook-login/access-tokens) |
| **Host URL** | `graph.instagram.com` | `graph.facebook.com` |
| **Login Type** | Business Login for Instagram | Facebook Login for Business |
| [**Permissions**](https://developers.facebook.com/docs/permissions/reference#i) | - `instagram_business_basic`<br>- `instagram_business_manage_comments` | - `instagram_basic`<br>- `instagram_manage_comments`<br>- `pages_read_engagement`<br>If the app user was granted a role on the [Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to your app user's Instagram professional account via the Business Manager, your app will also need:<br>- `ads_management`<br>- `ads_read` |
| **Webhooks** | - `comments`<br>- `live_comments` | - `comments`<br>- `live_comments` |

### Limitations

- Only one message can be sent to the commenter
- The message must be sent within 7 days of the comment was made on the post or reel
- For Instagram Live, private replies can only be sent during the live broadcast. Once the broadcast ends, private replies cannot be sent
- Follow-up messages can only be sent if the recipient responds, and must be sent within 24 hours of the response

## Send a Private Reply

To send a private reply to a commenter on your app user's Instagram professional post, reel, or story, send a `POST` request to the `<APP_USERS_IG_ID>/messages` endpoint. The `recipient` parameter should contain the comment's ID and the `message` parameter should contain the text you wish to send.

#### Sample request

_Formatted for readability._

```html
curl -i -X POST "https://<HOST_URL>/<API_VERSION>/<APP_USERS_IG_ID>/messages"
     -H "Content-Type: application/json"
     -H "Authorization: Bearer <ACCESS_TOKEN>"
     -d '{
             "recipient":{
                 "comment_id": "<COMMENT_ID>"
             },
             "message": {
                 "text": "<COMMENT_TEXT>"
             }
         }'
```

On success, your app receives a JSON response with the recipient's Instagram-scoped ID and the ID for the message.

```json
{
  "recipient_id": "526...",   // The Instagram-scoped ID
  "message_id": "aWdfZ..."    // The ID for the private reply message
}
```

On This Page

[Send a Private Reply to a Commenter](https://developers.facebook.com/docs/instagram-platform/private-replies#send-a-private-reply-to-a-commenter)

[How It Works](https://developers.facebook.com/docs/instagram-platform/private-replies#how-it-works)

[Requirements](https://developers.facebook.com/docs/instagram-platform/private-replies#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/private-replies#limitations)

[Send a Private Reply](https://developers.facebook.com/docs/instagram-platform/private-replies#send-a-private-reply)