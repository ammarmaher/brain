---
url: https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging
title: Webhook debugger - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-messaging%2Fwebhooks%2Fdebugging%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging)

- [Overview](https://developers.facebook.com/docs/instagram-messaging/overview)
- [Get Started](https://developers.facebook.com/docs/instagram-messaging/get-started)
- [Instagram Messaging Webhooks](https://developers.facebook.com/docs/instagram-messaging/webhooks)


  - [Webhook debugger](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging)

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

[Webhook Debugger](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#webhook-debugger)

[Requirements](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#requirements)

[How to use](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#how-to-use)

[Check subscriptions and setup](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#check-subscriptions-and-setup)

[Send Debug Webhook](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#send-debug-webhook)

# Webhook Debugger

The Instagram Messaging Webhook Debugger can be used to check if your app has the correct subscriptions and permissions for pages that your app is connected to as part of your IG Messaging API integrations. It can be accessed from **Developer app dashboard → Messenger → Instagram Settings** and is only available for users who have an **Administrator** [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on your app.

## Requirements

- Tool is only accessible to users with Administrator [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on your app.
- Tool only works for pages/handle that are connected to your app.
- Ensure that you have an instagram account and it is linked to your Facebook account (needed so that the debug webhook will be sent with your details rather than a random user)
- Please do not use tool run random checks as it will add to your API call rates. Only use it to debug if you have an actual issue.

## How to use

### Check subscriptions and setup

1. Go to the [Meta App Dashboard](https://developers.facebook.com/apps) and select your app.
2. Navigate to **App Dashboard → Messenger → Instagram Settings** and scroll to the botton to see the Webhook debugger section
3. Enter Page ID of Facebook Page connected to the Instagram account that you want to check. Click **Submit**.
4. Details like webhook subscriptions, connected Instagram account, and Messaging toggle status will be shown.
5. If any of them is incorrect or missing, it will be shown in red with detail links to fix those.

### Send Debug Webhook

If the setup is correct but your app is still not receiving webhooks, following the steps listed.

1. Navigate to the Send Debug Webhook section and enter the Page Id(connected to the IG account) for which you are not receiving webhooks.
2. Click Submit.
3. If all setup is correct then a sample messages webhook will be sent to your app.
4. A TraceID will also be shown like in the screenshot below
5. If your app still does not receive the sample webhook, please share the TraceID in a ticket via our support platform, detailing the steps you followed and any additional context.

On This Page

[Webhook Debugger](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#webhook-debugger)

[Requirements](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#requirements)

[How to use](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#how-to-use)

[Check subscriptions and setup](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#check-subscriptions-and-setup)

[Send Debug Webhook](https://developers.facebook.com/docs/instagram-messaging/webhooks/debugging#send-debug-webhook)