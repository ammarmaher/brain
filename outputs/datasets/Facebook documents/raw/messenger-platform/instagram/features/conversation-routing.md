---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing
title: Conversation Routing - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fconversation-routing%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging)

- [Overview](https://developers.facebook.com/docs/instagram-messaging/overview)
- [Get Started](https://developers.facebook.com/docs/instagram-messaging/get-started)
- [Instagram Messaging Webhooks](https://developers.facebook.com/docs/instagram-messaging/webhooks)
- [Generic Template](https://developers.facebook.com/docs/instagram-messaging/generic-template)
- [Button Template](https://developers.facebook.com/docs/instagram-messaging/button-template)
- [Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing)


  - [Conversation Routing APIs](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing/apis)

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

[Conversation Routing for Instagram](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#conversation-routing-for-instagram)

[Overview](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#overview)

[When To Use Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#when-to-use-conversation-routing)

[Conversation Routing for Instagram Ads](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#conversation-routing-for-instagram-ads)

[Defining Message Templates](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#defining-message-templates)

[Sample template](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#sample-template)

[Thread Control Window](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#thread-control-window)

[Configure Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#configure-conversation-routing)

[Enabling Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#enabling-conversation-routing)

[Default Application](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#default-application)

[Entry Point Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#entry-point-routing)

[1\. Link Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#1--link-routing)

[2\. Campaign Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#2--campaign-routing)

[3\. Default/Organic Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#3--default-organic-routing)

[Meta Business Suite Inbox Support](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#meta-business-suite-inbox-support)

[Conversation Control and Thread Ownership](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#conversation-control-and-thread-ownership)

[Thread Owner States](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#thread-owner-states)

[Conversation Control Flows](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#conversation-control-flows)

[1\. Pass Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#1--pass-thread-control)

[2\. Release Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#2--release-thread-control)

[3\. Take Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#3--take-thread-control)

[4\. Extend Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#4--extend-thread-control)

[5\. Request Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#5--request-thread-control)

[Default Message Routing Behavior (Zero Config Behavior)](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#default-message-routing-behavior--zero-config-behavior-)

[When to Use Default Behavior](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#when-to-use-default-behavior)

[Key Differences from Conversation Routing (Primary Behavior)](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#key-differences-from-conversation-routing--primary-behavior-)

# Conversation Routing for Instagram

Meta no longer supports the Handover Protocol for Instagram. All businesses have been migrated to Conversation Routing. Conversation Routing is backwards compatible with most Handover Protocol APIs and functionalities, and is expected to function without interruption.

## Overview

Conversation Routing enables businesses to utilize multiple connected applications to respond to user messages in a coordinated manner, designating which application should take responsibility for responding. This allows both businesses and users to have a rich conversation experience without having to manage complex business logic within each individual application when responding to user queries.

Businesses can connect various types of applications, each serving different roles, such as:

1. **Marketing Applications:** Send product marketing messages.
2. **Sales Applications:** Handle customer orders, shipments, and schedule service appointments.
3. **Customer Care Applications:** Provide human agent-based support.
4. **Messaging Automation/Bot Applications:** Include AI agent bots for automated responses.

In some cases, a single application may fulfill multiple roles.

### When To Use Conversation Routing

Use Conversation Routing when you have multiple messaging applications connected to your Instagram account and want Meta to automatically route messages to the appropriate application, based on how customers initiate conversations.

Some basic message routing features are available even without enabling Conversation Routing. For more details, see [Default Message Routing Behavior.](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#default-message-routing-behavior--zero-config-behavior-)

## Conversation Routing for Instagram Ads

To set up conversation routing for Instagram Ads, you’ll need to configure a message template as part of your ad creation process. For detailed steps, refer to the official [Facebook Business Help article](https://www.facebook.com/business/help/198088077975174?id=371525583593535).

### Defining Message Templates

When creating your Instagram Ad, you’ll be prompted to select a Message template. You can either create a new template or use an existing one.

Within the message template, you can specify parameters such as the `receiving_app_id` and the thread window. This allows you to control which app receives the conversation and for how long it maintains control.

### Sample template

```json
{
    "message": {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Hi! Please let us know how we can help you",
                "buttons": [\
                    {\
                        "title": "Show me the product!",\
                        "type": "web_url",\
                        "url": "http://www.facebook.com/"\
                    },\
                    {\
                        "title": "Tell me more",\
                        "type": "postback",\
                        "payload": "USER_DEFINED_PAYLOAD"\
                    }\
                ]
            }
        },
        "receiving_app_id": 1278416343931139,
        "receiving_app_control_expiration": 4
    }
}
```

- `receiving_app_id`: The ID of the app that will receive the conversation.

- `receiving_app_control_expiration`: The duration (in days) for which the app will maintain control of the thread. Valid values are from 1 to 30.


## Thread Control Window

- When a conversation starts from an Instagram Ad, the designated app will have control of the thread for 1 day (24 hours) from the last user message by default.


- Businesses with longer lead or sales cycles can extend thread control for up to 30 days by setting `receiving_app_control_expiration` to a value between 1 and 30.


- If you set an invalid value for `receiving_app_control_expiration`, the thread control window will default to 1 day.


- Any
Conversation Control
actions (such as handover protocol events) will also reset the thread control window to 1 day.



## Configure Conversation Routing

This section explains how to enable Conversation Routing, configure entry point routing, manage thread ownership, and use conversation control flows for Instagram messaging integrations.

### Enabling Conversation Routing

To use Conversation Routing for Instagram, you need:

- An Instagram Business account linked to a Facebook Page using the New Pages Experience.
- The Facebook Page must have messaging enabled and at least one connected app (with PAGES\_MESSAGING permissions and webhook subscriptions).
- You must be interacting as the owner for the Facebook Page.
- You must set up a default application.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/557401024_3877875349022462_5203629662465522515_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=IHZ26b0yZAQQ7kNvwG06Dmu&_nc_oc=AdrJBK2ga_mMUjL4KsL3d0eI5mUn91GPgMhWae7UDNwpHCNV5xfH4Cq03qGY7ZCZ8Yk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=EdD_CSKXTUlZSGh2NjjvbA&_nc_ss=7b289&oh=00_Af5tNGqxy4bRtKlL1JDPlnyboFc8C1D3qRsWiwpIS6wpzw&oe=6A256AA7)

### Default Application

The default application is the primary app allowed to respond to a conversation when no other app is currently assigned or configured to do so.

#### How to Assign a Default Application

- Log in as the Page connected to your Instagram account.

- Go to your
[Facebook Page settings](https://www.facebook.com/settings).


- Go to Page Setup → Instagram Conversation Routing.

- Assign the desired app as the default application.


![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/557814088_1321002352759405_2809512243079325855_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=aWNovm2A-9gQ7kNvwF3b0pS&_nc_oc=Adpv-YlZEvruDZ7KSEELvCsDjjGrYLBficUS0l_Gu-Kc72MTJIvap2Nxh38dZCweW9k&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=EdD_CSKXTUlZSGh2NjjvbA&_nc_ss=7b289&oh=00_Af5PHWAQHmo7t_0XsJxb8CRBwai2TIzBM3DO0h4PuaePBw&oe=6A2598E0)

## Entry Point Routing

Entry point routing lets you direct conversations to specific apps based on how users initiate contact. Configure these routes in the Conversation Routing tab of your Facebook Page settings.

There are three types of entry point routing:

### 1\. Link Routing

- Configure multiple
[ig.me links](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links) on third-party sites.


- Assign a routing app to each link.


![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/556394578_4022106128006295_8750907597174535625_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=m9WDn7_BCc0Q7kNvwHdpRne&_nc_oc=AdrhsjsuGnOLYIA6YkZvaUVx1e4iBAvBSedafF4OMTxoG2sDNqEHNoK88Gejvh05wnk&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=EdD_CSKXTUlZSGh2NjjvbA&_nc_ss=7b289&oh=00_Af6qMCLfR6Fp76pwEBzaDhnp_JtAuRFY28gZvYeArA44iw&oe=6A2598A4)

### 2\. Campaign Routing

- Route conversations from
[Click-to-Direct (CTD) ads.](https://www.facebook.com/business/help/198088077975174?id=371525583593535)

- Set up in Ads Manager.

- See **Conversation routing for Instagram Ads** for more details.


![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/557779966_1091057403017804_5368672729917145289_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=uoJbtbn9j8AQ7kNvwHpbUZv&_nc_oc=AdqcDd1suloSR5rhXpX0IPFa61EBwno_M7cA47hra1fbWs2DoUpmkVNVH5m2ZxcINgI&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=EdD_CSKXTUlZSGh2NjjvbA&_nc_ss=7b289&oh=00_Af7kEvBIqtb-oi0LX47Q80dczCPtJGkd0lMWpGCjNZDxMw&oe=6A25714E)

### 3\. Default/Organic Routing

- Applies to any other entry point within the Meta ecosystem.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/555906699_1346584906811704_4985785832807926096_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=qE7pcs5so50Q7kNvwHW6Nsl&_nc_oc=AdoTZiLublWKmTn4kcpAi2oA52LJKj1l2zwWnnXRKQTeOMGlIsHjOms0k2JMX_nfGo8&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=EdD_CSKXTUlZSGh2NjjvbA&_nc_ss=7b289&oh=00_Af6fuJDBXMBXAcC_YYBkHxE9QLybEeGpJTtzJLC3n4zryA&oe=6A256D2A)

## Meta Business Suite Inbox Support

- You can use Meta Business Suite Inbox as a connected application to continue conversations with users.
- The Inbox can also be assigned as a default application.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/556619958_761082143394573_6858419065996670168_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=qMxqyA3odz8Q7kNvwEboNPo&_nc_oc=AdorWfB1r7chIlo703mIyJjWTAPy85-sDm9CC2uEtHOOLh3GFM2fgumlUiEh_-ubW1I&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=EdD_CSKXTUlZSGh2NjjvbA&_nc_ss=7b289&oh=00_Af4UxqxHdY3VPUTfWYEJbqwvy4KmowDJPykQS301s69ilg&oe=6A258E5E)

## Conversation Control and Thread Ownership

The application responsible for responding to a user-business conversation is said to have Conversation Control or be the Thread Owner.

### Thread Owner States

#### Idle

No active conversation between user and business(no user-to-business message in the last 24 hours), or after the current thread owner releases control. Only the default application can send messages in this state (within the messaging window).

#### Active

There is an ongoing conversation between the user and a business application.

## Conversation Control Flows

Conversation control flows allow applications to change message routing for subsequent customer messages. There are five types of control flows:

### 1\. Pass Thread Control

The current thread owner passes control to another application, making it the new thread owner.

**Examples:**

Marketing app passes control to Sales app to complete a transaction. AI support bot passes control to a human customer care agent.

### 2\. Release Thread Control

The current thread owner releases control, setting the thread to idle once they are done with the conversation.

**Examples:**

The marketing app finishes answering queries and does not expect any further marketing queries from the customer, so it can release control for future queries. App cannot respond due to technical issues or unrelated queries and releases control to allow the default app to respond.

### 3\. Take Thread Control

Applications which are allowed to **Take control of conversations** by the business are allowed to take thread control, which allows the application to set itself as the thread owner.

Apps with the Human Agent feature cannot take control via the Send API (with HA tag) unless allowed to **Take control of conversations** (configured in Page Settings → Page Setup → Advanced Messaging).

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/557602820_4165034547145335_1640326007958894077_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=1YRxOFy9k8oQ7kNvwGf8QSe&_nc_oc=AdqUIkTlx7ll4VAhyfe_iVNfUWncs3qyCxro4kOXrRGSQGHIr_8P8JqSiF2PU8gnt3k&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=EdD_CSKXTUlZSGh2NjjvbA&_nc_ss=7b289&oh=00_Af4TSL6UhRXPTNZl_FcjBg7-XPnAL3YlkkEvJVFHT8_d-g&oe=6A25A035)

**Example:**
Customer Care agent sees there is an issue with the Marketing bot application sending some invalid responses and can take thread control to continue conversation.

### 4\. Extend Thread Control

Thread control usually expires after 24 hours of inactivity, but in some cases businesses might not have enough time to respond to the user, so they can use this API to extend thread control up to 7 days.

**Example:**

In a non-default customer sales application, customer sales agents answering the customer queries may require more time to find the product details requested by the users. In such a case, agents need to extend the thread control time period until they find the details, which they can use to extend thread control.

### 5\. Request Thread Control

It is used to request thread control from another application which has thread control already. In certain scenarios, you may not want to take the thread control directly but rather ask the application in control to pass the control to your application, and this can be used to inform them. If the current thread owner is done with the conversation, they can pass the thread control to your application.

## Default Message Routing Behavior (Zero Config Behavior)

Default behavior, also known as zero config behavior, allows applications to use certain conversation controls even without configuring a Conversation Routing default application. However, there are some limitations to be aware of.


### When to Use Default Behavior

- You have only a single application connected to your business, which is solely responsible for receiving and responding to user messages.


- You may use the Page Inbox to respond to users in addition to the application connected, but you are responsible for coordinating responses between your app and the Inbox to avoid sending multiple responses to the same user message.



### Key Differences from Conversation Routing (Primary Behavior)

1. **Multiple Apps Receive Webhooks:** If more than one application is connected, all applications will receive messaging webhooks.

2. **No Coordination Between Apps:** All connected applications can respond to the same user message without restrictions or coordination, increasing the risk of duplicate responses.

3. **Take Thread Control API Blocked:** The Take Thread Control API is not available. This feature is only enabled when a default application is set.

4. **Pass Thread Control API Available:** The Pass Thread Control API is enabled. Any application can pass thread control to any other application (including itself) when the thread is in the idle state.

5. **Request Thread Control API Available:** The Request Thread Control API is enabled. Any application can request thread control, but only the first application to invoke the API will receive control.

6. **Limited Entry Point Routing:** Only **campaign routing** is available as an entry point routing option. Link routing and default/organic routing are not available for configuration.


On This Page

[Conversation Routing for Instagram](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#conversation-routing-for-instagram)

[Overview](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#overview)

[When To Use Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#when-to-use-conversation-routing)

[Conversation Routing for Instagram Ads](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#conversation-routing-for-instagram-ads)

[Defining Message Templates](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#defining-message-templates)

[Sample template](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#sample-template)

[Thread Control Window](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#thread-control-window)

[Configure Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#configure-conversation-routing)

[Enabling Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#enabling-conversation-routing)

[Default Application](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#default-application)

[Entry Point Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#entry-point-routing)

[1\. Link Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#1--link-routing)

[2\. Campaign Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#2--campaign-routing)

[3\. Default/Organic Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#3--default-organic-routing)

[Meta Business Suite Inbox Support](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#meta-business-suite-inbox-support)

[Conversation Control and Thread Ownership](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#conversation-control-and-thread-ownership)

[Thread Owner States](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#thread-owner-states)

[Conversation Control Flows](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#conversation-control-flows)

[1\. Pass Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#1--pass-thread-control)

[2\. Release Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#2--release-thread-control)

[3\. Take Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#3--take-thread-control)

[4\. Extend Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#4--extend-thread-control)

[5\. Request Thread Control](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#5--request-thread-control)

[Default Message Routing Behavior (Zero Config Behavior)](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#default-message-routing-behavior--zero-config-behavior-)

[When to Use Default Behavior](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#when-to-use-default-behavior)

[Key Differences from Conversation Routing (Primary Behavior)](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing#key-differences-from-conversation-routing--primary-behavior-)