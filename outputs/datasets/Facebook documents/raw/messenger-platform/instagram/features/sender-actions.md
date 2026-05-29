---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions
title: Sender Actions - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fsender-actions%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Sender Actions](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#sender-actions)

[Display a Sender Action](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#example)

[Typing Indicator](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#typing-indicator)

[Mark messages as seen](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#mark-messages-as-seen)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#limitations)

# Sender Actions

This guide explains how to display your actions in a conversation to let message recipients know that you have seen and are processing their message.

## Display a Sender Action

### Typing Indicator

To display the `typing_on` or `typing_off` actions in the for a sender in the conversation, send a POST request to the [`/PAGE-ID/messages` endpoint](https://developers.facebook.com/docs/graph-api/reference/page/messages/) with the `sender_action` parameter set to `typing_on` or `typing_off`.

For the best conversational experience, send the `typing_on` indicator when your bot receives a message it will respond to. Do not allow an unnatural amount of time (too long or too short) to pass between `typing_on` and `typing_off` sender actions. Ideally, the user should feel that a real person was typing the message in the elapsed time.

```sh
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"<IGSID>"
  },
  "sender_action":"typing_on"
}' "https://graph.facebook.com/VERSION/PAGE-ID/messages?access_token=PAGE-ACCESS_TOKEN"
```

### Mark messages as seen

To send the `mark_seen` indicator to the most recent message, send a `POST` request to the [`/PAGE-ID/messages` endpoint](https://developers.facebook.com/docs/graph-api/reference/page/messages/) with the `sender_action` parameter set to `mark_seen`.

For the best conversational experience, send the `mark_seen` indicator when your bot receives a message so that the user does not feel ignored.

```sh
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"<IGSID>"
  },
  "sender_action":"mark_seen"
}' "https://graph.facebook.com/VERSION/PAGE-ID/messages?access_token=PAGE-ACCESS_TOKEN"
```

### Limitations

- Requests to display sender actions for typing indicators and `mark_seen` indicators should only include the `sender_action` parameter and the `recipient` object. All other Send API properties, such as text and templates, should be sent in a separate request.
- The recipient must be signed in for sender actions to be displayed.

### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUA6QatKOoa_BNVDh8fwdf5jsItCuKTV4fei_QHYcEJtEl8MNIi3NW_WPlnAMbu4xqdjDvsoW4Oou9rSrwqh7r35stX6Nq05-bW8pwdM7Joiu4S2kerwf4_M3TACkvakfQnHjF2powCXTg) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[Sender Actions](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#sender-actions)

[Display a Sender Action](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#example)

[Typing Indicator](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#typing-indicator)

[Mark messages as seen](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#mark-messages-as-seen)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions#limitations)