---
url: https://developers.facebook.com/docs/instagram-messaging/overview
title: Overview - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-messaging%2Foverview%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Overview of Instagram Messaging API](https://developers.facebook.com/docs/instagram-messaging/overview#overview-of-instagram-messaging-api)

[Common Uses](https://developers.facebook.com/docs/instagram-messaging/overview#common-uses)

[How It Works](https://developers.facebook.com/docs/instagram-messaging/overview#how-it-works)

[Instagram Inbox](https://developers.facebook.com/docs/instagram-messaging/overview#inbox-folder-behavior)

[Business Login for Instagram](https://developers.facebook.com/docs/instagram-messaging/overview#business-login-for-instagram)

[Requirements](https://developers.facebook.com/docs/instagram-messaging/overview#requirements)

[Human Agent Escalation](https://developers.facebook.com/docs/instagram-messaging/overview#human-agent-escalation)

[Automated Experiences](https://developers.facebook.com/docs/instagram-messaging/overview#automated-experiences)

[Human Agent Only](https://developers.facebook.com/docs/instagram-messaging/overview#custom-inbox-only)

[Limitations](https://developers.facebook.com/docs/instagram-messaging/overview#limitations)

[Testing Limitations](https://developers.facebook.com/docs/instagram-messaging/overview#testing-limitations)

[Next Steps](https://developers.facebook.com/docs/instagram-messaging/overview#next-steps)

[See Also](https://developers.facebook.com/docs/instagram-messaging/overview#see-also)

# Overview of Instagram Messaging API

The Messenger Platform allows you to build messaging solutions for Instagram Professional accounts at scale.

Instagram Messaging is available for the following accounts:

- Any Instagram Professional account for a business
- Any Instagram Professional account for a Creator

You can check the eligibility for accounts that you manage using the
[Conversations API](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation).


If your app user's don't have a Facebook Page linked to their Instagram account, you can use the [Instagram Platform's Messaging API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api) instead.

## Common Uses

- Get messages that have been sent to your Instagram Professional Inbox from customers
- Receive and respond to customer messages with text, media, stories, and more
- Send a private reply to a person who published a public post on your Instagram
- Send a private reply to a person who published a comment on your Instagram post

## How It Works

The Messenger Platform allows you to have conversations with people interested in your business or creations. The Facebook Page linked to your Instagram Professional account facilitates these conversations using the Messenger Platform. When a person sends your Instagram a message, the message will be delivered to your Instagram Inbox and a webhook notification will be sent to your server. Your messaging app has
[24 hours](https://developers.facebook.com/docs/messenger-platform/send-messages#standard-messaging)
to respond to this message. If more time is needed to allow a human agent to respond, you can add a tag to your response to send the message outside the standard 24 hour messaging window.


Instagram Messaging offers a wide variety of conversation entry points for people to start a conversation and message types for your messaging app to respond with.


### Instagram Inbox

An Instagram Professional account has a messaging inbox that allows you to control notifications and organize messages. By default notifications are off. You can turn notifications on in the Inbox Settings. The inbox is organized into different categories, **Primary**, **General**, and **Requests**. By default, all new conversations from followers will appear in the Primary folder.
Conversations that existed before you implemented Instagram Messaging will be in the folders you have placed them within.

Messages that you receive from people who are not followers of your account are in Requests folder. You can choose to accept or deny these requests, and request messages aren’t marked as **Seen** until you accept them. Once a request is accepted you can move the conversation to the Primary or General folder. All message requests that you answer using a third-party app will be moved to the General folder.


#### Inbox Limitations

- If you reply to a message using a third-party app, the conversation will be moved to the **General** folder regardless of your Setting configuration
- Inbox folders are not supported and messages delivered by the Messenger Platform do not include folder information that is shown in the Instagram from Meta app inbox folder
- Webhooks notifications or messages delivered via the API will not be considered as **Read** in the Instagram app inbox. Only after a reply is sent will a message be considered **Read**.

### Business Login for Instagram

[Business Login for Instagram](https://developers.facebook.com/docs/instagram/business-login-for-instagram) allows a person to convert their Instagram account to an Instagram Professional account, create a Facebook Page for their business, and to connect that Page to their Instagram Professional account within the login flow.

## Requirements

This guide assumes you have read the [Messenger Platform Overview](https://developers.facebook.com/docs/messenger-platform/overview) and implemented the needed components for sending and receiving messages and notifications.

-
The [**Instagram Graph API**](https://developers.facebook.com/docs/instagram-api/) – This API allows businesses and Creators to manage their presence on Instagram using your app


- The following permissions:


  - `instagram_basic`

  - `instagram_manage_messages`

  - `pages_manage_metadata`

  - `pages_showlist`

  - `business_management`


- The Human Agent feature – This feature allows your messaging app to provide an escalation path to a human agent

- Content Delivery Network (CDN) URL handling

- Delete messages when you receive a webhooks notification to do so, in accordance with [Meta Platform Terms](https://developers.facebook.com/terms/dfc_platform_terms/)


### Human Agent Escalation

Apps that use the Instagram Messaging APIs must have an escalation path to a human agent. Experiences can either start by directly interacting with a human agent or can start from an automation to qualify intent but must have a way for users to chat with a human agent as needed.

### Automated Experiences

You can provide an escalation path for automated messaging experiences using one of the following:

- **A Single App** – You can create a custom inbox to receive or reply to messages from a person. This custom inbox is powered by the same messaging app that also provides the automated experience


- **Multiple Apps** – [Handover Protocol](https://developers.facebook.com/docs/messenger-platform/handover-protocol) allows you pass the conversation from one app or inbox to another. For example, one app would handle the conversation with an automated experience and, when needed, would pass the conversation to another app to continue the conversation with a human agent.



#### Informing Users About Your Automated Experience

When required by applicable law, automated chat experiences must disclose that a person is interacting with an automated service:

- at the beginning of any conversation or message thread,
- after a significant lapse of time, or
- when a chat moves from human interaction to automated experience.

Automated chat experiences that serve the following groups should pay special attention to this requirement:

- California market or California users
- German market or German users

Disclosures may include but are not limited to: “I’m the \[Page Name\] bot,”“You are interacting with an automated experience,” “You are talking to a bot,” or “I am an automated chatbot.”

Even where not legally required, we recommend informing users when they’re interacting with an automated chat as best practice, as this helps manage user expectations about their interaction with your messaging experience.

Visit our
[Developer Policies \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwHd2MI6&_nc_oc=Adqrt8y-wBRV-6AX9B7Gvtt32K3EKINhsu3qV4T4Js9FAPQggHv0vqD4LhlCeHkqdcc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=5QSc4STTwYxwj6MwzIOKgg&_nc_ss=7b289&oh=00_Af5HJelt7kLETygF4YHmxB4K-gEvExlBnhE2mXW7uYUS0Q&oe=6A2592E2)](https://developers.facebook.com/devpolicy/#messengerplatform)
for more information.


### Human Agent Only

You can provide an escalation path for human agent only messaging experiences with a custom inbox. Your messaging app must be able to:

- receive messages sent by people and render them correctly in the custom inbox

- reply to messages via the custom inbox and ensure people successfully received them


## Limitations

- An Instagram Professional account can only converse with **one customer per conversation**. Group messaging is not supported
- Conversations in the Requests folder that have not been active for 30 days will not be returned in API calls
- Only the URL for the shared media or post is included in the webhooks notification when a customer sends a message with a share
- An Instagram Professional account for a **Creator** must send an API request using the Instagram Conversations API before the account can receive webhooks

### Testing Limitations

- Apps with Standard Access can only interact people who have a role on the app
- Some features may not work properly until your app has been granted Advanced Access
- People testing your app must have a role on your app, grant access to all the required permissions, and have a role on the Instagram Professional account

## Next Steps

- [Set up Webhooks](https://developers.facebook.com/docs/messenger-platform/webhooks) for Instagram Messaging

## See Also

- [Sample Instagram Messaging Experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience) – Example code for a working Instagram messaging experience



- [Available Message Types](https://developers.facebook.com/docs/messenger-platform/instagram/features) – Explanations of various Instagram Messaging features


- [FAQs](https://developers.facebook.com/docs/messenger-platform/instagram/faq) – Solutions to common problems, troubleshooting tips, and FAQs


- [Rate Limits](https://developers.facebook.com/docs/messenger-platform/overview#rate-limiting) – Explanations of various Instagram Messaging rate limits



- [App Review](https://developers.facebook.com/docs/messenger-platform/instagram/app-review/) – Review the Platform policies and follow our pre-launch checklist to ensure a successful launch



- [Feature Reference](https://developers.facebook.com/docs/features-reference) – Learn more about the Human Agent feature and how it works




On This Page

[Overview of Instagram Messaging API](https://developers.facebook.com/docs/instagram-messaging/overview#overview-of-instagram-messaging-api)

[Common Uses](https://developers.facebook.com/docs/instagram-messaging/overview#common-uses)

[How It Works](https://developers.facebook.com/docs/instagram-messaging/overview#how-it-works)

[Instagram Inbox](https://developers.facebook.com/docs/instagram-messaging/overview#inbox-folder-behavior)

[Business Login for Instagram](https://developers.facebook.com/docs/instagram-messaging/overview#business-login-for-instagram)

[Requirements](https://developers.facebook.com/docs/instagram-messaging/overview#requirements)

[Human Agent Escalation](https://developers.facebook.com/docs/instagram-messaging/overview#human-agent-escalation)

[Automated Experiences](https://developers.facebook.com/docs/instagram-messaging/overview#automated-experiences)

[Human Agent Only](https://developers.facebook.com/docs/instagram-messaging/overview#custom-inbox-only)

[Limitations](https://developers.facebook.com/docs/instagram-messaging/overview#limitations)

[Testing Limitations](https://developers.facebook.com/docs/instagram-messaging/overview#testing-limitations)

[Next Steps](https://developers.facebook.com/docs/instagram-messaging/overview#next-steps)

[See Also](https://developers.facebook.com/docs/instagram-messaging/overview#see-also)