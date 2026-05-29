---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention
title: Story Mention - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fstory-mention%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Story Mention](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#story-mention)

[Important Points](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#important-points)

[Developer Implementation Flow](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#developer-implementation-flow)

[Rendering Story in Agent’s Inbox/Client View](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#rendering-story-in-agent-s-inbox-client-view)

[Example webhook](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#example-webhook)

[Example request to retrieve story mention via Conversation API](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#example-request-to-retrieve-story-mention-via-conversation-api)

# Story Mention

An Instagram Professional account can be notified when a user mentions them in a story. When this happens, the IG Professional account will get a message in the inbox referencing the story that the user posted. Due to a story being ephemeral by nature (it will disappear after 24 hours or when deleted by the user), you must meet specific requirements and implementation guidelines to comply and respect user privacy for ephemeral content.

## Important Points

- A Story mention webhook will only flow in if the user mentioning the account has their account setup as public. Story mentions from a private account will only flow in if the account follows the said account.
- You must not store/cache the media content on your server.

## Developer Implementation Flow

- You will get a webhook for every story mention received with the story CDN URL. You may store the CDN URL on your system to avoid repeated calls to conversation API. You must not store the media content on your server.
- When the agent clicks on the content or opens the thread, it will trigger a call to your server.
- The agent’s browser renders the content using the CDN URL obtained via webhooks/Conversation API.
- Once the user deletes a story/expired, the URL will stop rendering and you should show a placeholder message indicating that the story content is no longer available.

## Rendering Story in Agent’s Inbox/Client View

There are several options where you can choose to render the story content in the agent’s inbox:

- _In-thread rendering_ \- For this scenario/behavior, when the agent clicks a particular thread, you will load the CDN URL and render it on the client’s side.
- _User action rendering_ \- For this scenario/behavior, story content is rendered with a placeholder and when the user clicks on display/view button, you will load the CDN URL and render it on the client’s side.

## Example webhook

```code
  {
  "object": "instagram",
  "entry": [\
    {\
      "id": "<IGID>",\
      "time": 1569262486134,\
      "messaging": [\
        {\
          "sender": {\
            "id": "<IGSID>"\
          },\
          "recipient": {\
            "id": "<IGID>"\
          },\
          "timestamp": 1569262485349,\
          "message": {\
            "mid": "<MESSAGE_ID>",\
            "attachments":[\
              {\
                  "type":"story_mention",\
                  "payload":{\
                     "url":"<CDN_URL>"\
                  }\
              }\
            ]\
          }\
        }\
      ]\
    }\
  ],
}

```

## Example request to retrieve story mention via Conversation API

```code
GET <MESSAGE_ID>?fields=story

{
  "story": {
    "mention": {
      "link": "<CDN_URL>",
      "id": "<STORY_ID>"
    }
  },
  "id": "<MESSAGE_ID>"
}
```

### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUBlV6kWLE7PjR10K3BxBWz5Nx8GNP1T1UWPG2RW11iES0EcIBxXcuJKQERmRNQbZw7Qfahu6-ckprlDf2IjI-ciUAxZeowZNYkcOfuArl3tWKwvQzzG4iYaoXoW3Mb3vQYtJvdc68gzmg) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[Story Mention](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#story-mention)

[Important Points](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#important-points)

[Developer Implementation Flow](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#developer-implementation-flow)

[Rendering Story in Agent’s Inbox/Client View](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#rendering-story-in-agent-s-inbox-client-view)

[Example webhook](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#example-webhook)

[Example request to retrieve story mention via Conversation API](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention#example-request-to-retrieve-story-mention-via-conversation-api)