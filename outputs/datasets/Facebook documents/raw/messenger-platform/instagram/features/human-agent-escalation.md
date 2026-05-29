---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation
title: Human Agent Escalation - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fhuman-agent-escalation%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Human Agent Escalation](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation#human-agent-escalation)

[Custom inbox only (no automation)](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation#custom-inbox-only)

[Automated experiences](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation#automated-experiences)

# Human Agent Escalation

Your app can implement an escalation path to a human agent using a custom inbox only or using an automated experience.

## Custom inbox only (no automation)

With the custom inbox only solution (no automation) the users would be interacting with the human (live) agent directly rather than initiating the conversation with a keyword/intent. If your app uses this path to escalate to human agent then ensure it has the ability to:

- Receive messages sent by users and render them correctly in the custom inbox using the [Conversation API](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation) with the given app id
- Reply to messages via the custom inbox and the user successfully received them using the [Send API](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message#send-api) with the given app id

## Automated experiences

If the app has an automated experience then the app should be able to escalate to human agents either by having a fallback intent or keyword or quick replies when a certain scenario or flow is met.

As soon as the the scenario/flow is met the escalation to human agent can be done in the following ways:

- **Custom Inbox** \- The ability to receive or reply to messages to the user from the custom inbox which is powered by the same app ID
- **Conversation Routing API** \- [This API](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing) can be used to pass thread control to either Instagram Inbox (first party) or a custom third-party inbox solution (using another FB app id). For the app review process you should demonstrate that when escalation to a human agent happens, the thread ownership is successfully transferred to the inbox and the agent is able to use the inbox to reply to users.

On This Page

[Human Agent Escalation](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation#human-agent-escalation)

[Custom inbox only (no automation)](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation#custom-inbox-only)

[Automated experiences](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation#automated-experiences)