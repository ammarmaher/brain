---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api
title: Conversations API - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-instagram-login%2Fconversations-api%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)


  - [Migration Guide](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide)
  - [Business Login for Instagram](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login)
  - [Get started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started)
  - [Messaging](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api)
  - [Welcome message ads](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads)
  - [Conversations API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api)
  - [Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions)

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

[Get Conversations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#get-conversations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#limitations)

[Get a List of Conversations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#conversation-list)

[Find a conversation with a specific person](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#find-a-conversation-with-a-specific-person)

[Get a List of Messages in a Conversation](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#get-a-list-of-messages-in-a-conversation)

[Get information about a message](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#get-information-about-a-message)

[Example reponse](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#example-reponse)

[See also](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#see-also)

# Get Conversations

This document explains how to get information about conversations between your app user and an Instagram user interested in your app user's Instagram media. You can get:

- A list of conversations for your app user's Instagram professional account
- A list of messages within each conversation
- Details about each message including when the message was sent and from who

## Requirements

This guide assumes you have read the [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview) and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

You will need the following:

#### Access Level

- Advanced Access if your app serves Instagram professional accounts you don't own or manage
- Standard Access if your app serves Instagram professional accounts you own or manage and have added to your app in the App Dashboard

#### Access tokens

- An Instagram User access token requested from a person who can manage messages on the Instagram professional account

#### Base URL

All endpoints can be accessed via the `graph.instagram.com` host.

#### Endpoints

- `/<IG_ID>/conversations` or `/me/conversations`

#### IDs

- The ID for the Instagram professional account (`<IG_ID>`)
- The Instagram-scoped ID for the Instagram user in the conversation

#### Permissions

- `instagram_business_basic`
- `instagram_business_manage_messages`

### Limitations

- Only the image or video URL for a share will be included in the data returned in a call to the API or in the webhooks notification.

- Conversations that are within the Requests folder that have not been active for 30 days will not be returned in API calls.


## Get a List of Conversations

To get a list of your app user's conversations for an Instagram professional account, send a `GET` request to the `/<IG_ID>/conversations` endpoint.

#### Sample Request

_Formatted for readability_

```curl
curl -i -X GET "https://graph.instagram.com/v25.0/me/conversations
    ?platform=instagram
    &access_token=<INSTAGRAM_ACCESS_TOKEN>"
```

On success, your app will receive a JSON object with a list of IDs for the conversations between you and a person and the most recent time a message was sent.

```json
{
  "data":
    {
      "id": "<CONVERSATION_ID_1",
      "updated_time": "<UNIX_TIMESTAMP>"
    },
    {
      "id": "<CONVERSATION_ID_2",
      "updated_time": "<UNIX_TIMESTAMP>"
    }
    ...
  ]
}
```

### Find a conversation with a specific person

To get a conversation between your app user's Instagram professional account and a specific Instagram user, send a `GET` request to the `/<IG_ID>/conversations` endpoint with the following parameters:

- `user_id` parameter set to the Instagram-scoped ID for the Instagram user in the conversation

#### Sample Request

_Formatted for readability_

```curl
curl -i -X GET "https://graph.instagram.com/v25.0/me/conversations
    ?user_id=<IGSID>
    &access_token=<INSTAGRAM_ACCESS_TOKEN>"
```

On success, your app will receive the ID for the conversation.

```code
{
  "data": [\
      {\
        "id": "<CONVERSATION_ID>\
      },\
  ]
}
```

## Get a List of Messages in a Conversation

To get a list of messages in a conversations, send a `GET` request to the `/<CONVERSATION_ID>` endpoint with the `fields` parameter set to `messages`.

#### Sample Request

_Formatted for readability_

```curl
curl -i -X GET "https://graph.instagram.com/v25.0/<CONVERSATION_ID>
    &fields=messages
    &access_token=<INSTAGRAM_ACCESS_TOKEN>"
```

On success, your app will receive a list of message IDs and the time each message was created.

```code
{
  "messages": {
    "data": [\
      {\
        "id": "<MESSAGE_1_ID>",\
        "created_time": "<UNIX_TIMESTAMP_MOST_RECENT_MESSAGE>"\
      },\
      {\
        "id": "<MESSAGE_2_ID>",\
        "created_time": "<UNIX_TIMESTAMP>"\
      },\
      {\
        "id": "<MESSAGE_3_ID>",\
        "created_time": "<UNIX_TIMESTAMP>"\
      },\
...\
    ]
  },
  "id": "<CONVERSATION_ID>",
}
```

### Get information about a message

To get information about a message, such as the sender, receiver, and message content, send a `GET` request to the `/<MESSAGE_ID>` endpoint with the `fields` parameter set to a comma separated list of fields you are interested in.

Default fields are `id` and `created_time`.

**Note:** Queries to the `/<CONVERSATION_ID>` endpoint will return all message IDs in a conversation. However, you can only get details about the 20 most recent messages in the conversation. If you query a message that is older than the last 20, you will see an error that the message has been deleted.


#### Sample request

_Formatted for readability_

```curl
curl -i -X GET "https://graph.instagram.com/v25.0/<MESSAGE_ID>
    &fields=id,created_time,from,to,message
    &access_token=<INSTAGRAM_ACCESS_TOKEN>"
```

On success, your app will receive a JSON response with a list of fields that you requested and values for each.

### Example reponse

```json
{
  "id": "aWdGGiblWZ...",
  "created_time": "2022-07-12T19:11:07+0000",
  "to": {
    "data": [\
      {\
        "username": "<IG_ID_USERNAME>",\
        "id": "<IG_ID>"\
      }\
    ]
  },
  "from": {
    "username": "<IGSID_USERNAME>",
    "id": "<IGSID>"
  },
  "message": "Hi Kitty!"
}
```

## See also

- [Conversations Reference](https://developers.facebook.com/docs/graph-api/reference/conversation#readfields)
- [Conversation Messages Reference](https://developers.facebook.com/docs/graph-api/reference/conversation/messages)
- [Message Reference](https://developers.facebook.com/docs/graph-api/reference/message)

On This Page

[Get Conversations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#get-conversations)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#limitations)

[Get a List of Conversations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#conversation-list)

[Find a conversation with a specific person](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#find-a-conversation-with-a-specific-person)

[Get a List of Messages in a Conversation](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#get-a-list-of-messages-in-a-conversation)

[Get information about a message](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#get-information-about-a-message)

[Example reponse](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#example-reponse)

[See also](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api#see-also)