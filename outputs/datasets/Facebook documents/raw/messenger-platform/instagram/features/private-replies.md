---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies
title: Private Replies - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fprivate-replies%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging)

- [Overview](https://developers.facebook.com/docs/instagram-messaging/overview)
- [Get Started](https://developers.facebook.com/docs/instagram-messaging/get-started)
- [Instagram Messaging Webhooks](https://developers.facebook.com/docs/instagram-messaging/webhooks)
- [Generic Template](https://developers.facebook.com/docs/instagram-messaging/generic-template)
- [Button Template](https://developers.facebook.com/docs/instagram-messaging/button-template)
- [Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing)
- [Human Agent Escalation](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation)
- [Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers)
- [ig.me links](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links)
- [Send a Message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message)
- [Sender Actions](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions)
- [Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu)
- [Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies)
- [Product Template](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template)
- [Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies)
- [Story Mention](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention)
- [Attachment Upload API](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload)
- [User Profile API](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile)
- [Moderate Conversations API](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations)
- [Sample Experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience)
- [App Review](https://developers.facebook.com/docs/messenger-platform/instagram/app-review)

On This Page

[Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#private-replies)

[How It Works](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#how-it-works)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#limitations)

[Before You Start](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#before-you-start)

[Send a Private Reply](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#send-a-private-reply)

[See Also](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#see-also)

[Developer Support](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#developer-support)

# Private Replies

This documents shows you how to programmatically add the Private Replies to your messaging experience.

|     |     |
| --- | --- |
| ## How It Works<br>Private Replies allows your app user to send a single message to an Instagram user who commented on the app user's Instagram professional account post, ads post, reel, or live story.<br>When your webhook server receives a `comments` or `live_comments` event notification, you can use the comment ID to send a private response directly to the Instagram user who published the comment. This reply will be delivered to the Instagram user's **Inbox** folder, if the Instagram user follows the Instagram professional account, or to the Instagram user's **Request** folder, if the Instagram user does not follow the account.<br>Private replies can be sent within 7 days of the creation time of the comment, excepting Instagram Live for which you a private reply can only be sent during the live broadcast. The message will contain a link to the post that the Instagram user commented on. | ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/118520113_305452657552386_5531150750029687976_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=Kc4Hq-SVArsQ7kNvwHYZiy8&_nc_oc=AdqedpV0b_lG6eSeoAf8vAwCrIbDt9gbGpsUBxiXnZuVfnC0jfJhX5GS9Ia3Yog1zFg&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=q1cu1EZ_5-dBYcvSLC87Fw&_nc_ss=7b289&oh=00_Af4g7DgPXHQTQiFQf9RZzljbOEGq9aGNqJYnAi601YuByg&oe=6A23A9CA) |

#### Webhooks

- When hosting an Instagram Live story, make sure you server can handle the increased load of notifications triggered by

[`live_comments` webhooks events, via the Instagram API, \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFSV64G&_nc_oc=Adp-UAF-ToGSqWdh3OkGlVd5su6YsjatpwILXvm7aU46kobG1QjRwsOE7thQnBwDROA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=q1cu1EZ_5-dBYcvSLC87Fw&_nc_ss=7b289&oh=00_Af7h1SItQti8ms-lund4u5lG7GyrxgTEIFluAhsoIKfSBA&oe=6A2398A2)](https://developers.facebook.com/docs/instagram-api/guides/webhooks)
and that your system can differentiate between `live_comments` and `comments` notifications.


- Instagram Graph API `comments` webhooks notifications for ads posts will include the ID and title for the ad. You may need to update your webhooks server to handle these new fields.








The `ad_id` and `ad_title` will be returned in the media object when an Instagram user comments on a boosted Instagram post or Instagram ads post. This may result in duplicate webhook notifications.


### Limitations

- Only one message can be sent to the Instagram user who commented
- The message must be sent within 7 days from when the comment was created for comments on a post, ads post, or reel
- Due to the transient nature of Instagram Live Stories, private replies on Instagram Live Story comments can only be sent during the live broadcast. As soon as the live broadcast has ended, private replies can no longer be sent.
- Only when the Instagram user responds to the private message can you continue the conversation within the 24-hour messaging window.
- Standard Access apps can only access data for people who have a role on the app

### Before You Start

This tutorial assumes you have read the [Messenger Platform Overview](https://developers.facebook.com/docs/messenger-platform/overview) and the [Instagram Messaging Overview](https://developers.facebook.com/docs/messenger-platform/instagram/overview) and implemented the needed components.

You will need:

- The ID for the Facebook Page linked to your Instagram professional account
- The ID for the comment made by the person to whom you are sending the private reply. The ID can be obtained from the Instagram `comments` webhooks, for posts, ads posts, and reels, and Instagram `live_comments` webhooks for live stories (recommended to avoid rate limiting) or an API call to the `/page/feed` endpoint
- The `instagram_manage_comments` and `pages_messaging` permissions, obtained via Facebook Login
- A Page access token requested by an Instagram user who can perform the `MESSAGING` task on the Facebook Page linked to your Instagram professional account
- The Human Agent feature
- Advanced Access

## Send a Private Reply

To send a private reply to an Instagram user who commented on your post, reel, or live story, send `POST` request to the `/<PAGE_ID>/messages` endpoint where the `recipient` parameter contains the comment ID and the `message` parameter contains the text you wish to send.

_Formatted for readability._

cURLAndroid SDKObjective-CJava SDK

```sh
curl -i -X POST "https://graph.facebook.com/&lt;PAGE_ID>/messages
  ?recipient: { comment_id: &lt;COMMENT_ID> }
  &message: { "text": "Thanks for reaching out, how can I help?" }
  &access_token=&lt;PAGE_ACCESS_TOKEN>"
```

```java
GraphRequest request = GraphRequest.newPostRequest(
  accessToken,
  "/1353269864728879/messages",
  new JSONObject("{\"recipient\":\"{comment_id: 18000158536435933}\",\"message\":\"{\\\"text\\\": \\\"It is cool\\\"}\"}"),
  new GraphRequest.Callback() {
    @Override
    public void onCompleted(GraphResponse response) {
      // Insert your code here
    }
});
request.executeAsync();
```

```m
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
    initWithGraphPath:@"/1353269864728879/messages"\
           parameters:@{ @"recipient": @"{comment_id: 18000158536435933}",@"message": @"{"text": "It is cool"}",}\
           HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/1353269864728879/messages',
  'POST',
  {"recipient":"{comment_id: 18000158536435933}","message":"{\"text\": \"It is cool\"}"},
  function(response) {
      // Insert your code here
  }
);
```

On success, your app will receive the following response:

```json
{
  "recipient_id": "526...",   // The Instagram-scoped ID
  "message_id": "aWdfZ..."    // The message ID for your private reply
}
```

## See Also

- [Access Levels\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFSV64G&_nc_oc=Adp-UAF-ToGSqWdh3OkGlVd5su6YsjatpwILXvm7aU46kobG1QjRwsOE7thQnBwDROA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=q1cu1EZ_5-dBYcvSLC87Fw&_nc_ss=7b289&oh=00_Af7h1SItQti8ms-lund4u5lG7GyrxgTEIFluAhsoIKfSBA&oe=6A2398A2)](https://developers.facebook.com/docs/messenger-platform/overview#advanced---standard-access) – Learn about the access levels and data available for each.


- [Instagram Live Media and Comments\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFSV64G&_nc_oc=Adp-UAF-ToGSqWdh3OkGlVd5su6YsjatpwILXvm7aU46kobG1QjRwsOE7thQnBwDROA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=q1cu1EZ_5-dBYcvSLC87Fw&_nc_ss=7b289&oh=00_Af7h1SItQti8ms-lund4u5lG7GyrxgTEIFluAhsoIKfSBA&oe=6A2398A2)](https://developers.facebook.com/docs/instagram-api/reference/ig-user/live_media) – Visit the Instagram Graph API Reference for more information about live media.


- [Instagram Media and Comments\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFSV64G&_nc_oc=Adp-UAF-ToGSqWdh3OkGlVd5su6YsjatpwILXvm7aU46kobG1QjRwsOE7thQnBwDROA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=q1cu1EZ_5-dBYcvSLC87Fw&_nc_ss=7b289&oh=00_Af7h1SItQti8ms-lund4u5lG7GyrxgTEIFluAhsoIKfSBA&oe=6A2398A2)](https://developers.facebook.com/docs/instagram-api/reference/ig-media) – Visit the Instagram Graph API Reference for more information about Instagram media.


- [Rate limits for Instagram Messaging API\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFSV64G&_nc_oc=Adp-UAF-ToGSqWdh3OkGlVd5su6YsjatpwILXvm7aU46kobG1QjRwsOE7thQnBwDROA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=q1cu1EZ_5-dBYcvSLC87Fw&_nc_ss=7b289&oh=00_Af7h1SItQti8ms-lund4u5lG7GyrxgTEIFluAhsoIKfSBA&oe=6A2398A2)](https://developers.facebook.com/docs/messenger-platform/overview#rate-limiting) – Learn more about the rate limits that affect Instagram Messaging.


- [Tasks on Facebook Pages\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFSV64G&_nc_oc=Adp-UAF-ToGSqWdh3OkGlVd5su6YsjatpwILXvm7aU46kobG1QjRwsOE7thQnBwDROA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=q1cu1EZ_5-dBYcvSLC87Fw&_nc_ss=7b289&oh=00_Af7h1SItQti8ms-lund4u5lG7GyrxgTEIFluAhsoIKfSBA&oe=6A2398A2)](https://developers.facebook.com/docs/pages/overview/permissions-features#tasks) – Learn about the tasks people can perform on the Page.


- [Webhooks for Messenger Platform\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFSV64G&_nc_oc=Adp-UAF-ToGSqWdh3OkGlVd5su6YsjatpwILXvm7aU46kobG1QjRwsOE7thQnBwDROA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=q1cu1EZ_5-dBYcvSLC87Fw&_nc_ss=7b289&oh=00_Af7h1SItQti8ms-lund4u5lG7GyrxgTEIFluAhsoIKfSBA&oe=6A2398A2)](https://developers.facebook.com/docs/messenger-platform/webhooks) – Learn about the webhooks available for Instagram Messaging



### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUCwwoj2Dg6KvxgWxY4WXiVskyhQT_mRsMLmWE4EhssaNhrWQllgHauIWaNg_FPCk71UJ4Kn0xhhLe7xlTxc9p7hSH-84zn4VKk9JPdDPt92aFaNBl1Twk89s-C2hF_5PuHMiRvuCHRMdg) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#private-replies)

[How It Works](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#how-it-works)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#limitations)

[Before You Start](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#before-you-start)

[Send a Private Reply](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#send-a-private-reply)

[See Also](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#see-also)

[Developer Support](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies#developer-support)