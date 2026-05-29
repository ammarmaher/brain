---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations
title: Moderate Conversations API - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fmoderate-conversations%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Moderate Conversations API for Instagram](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#moderate-conversations-api-for-instagram)

[Before You Start](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#before-you-start)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#limitations)

[Request Parameters](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#request-parameters)

[Block A User](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#block-a-user)

[Unblock A User](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#unblock-a-user)

[Move Conversation to Spam](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#move-conversation-to-spam)

[Perform Multiple Actions For Multiple Users](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#perform-multiple-actions-for-multiple-users)

[Error Codes](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#error-codes)

# Moderate Conversations API for Instagram

We explain how to use the Moderate Conversations API to:

- Block a user
- Unblock a user
- Move a conversation to spam in the Meta Business Suite Inbox

## Before You Start

This guide assumes you have read the [Messenger Platform Overview](https://developers.facebook.com/docs/messenger-platform/overview) and implemented the needed components for sending and receiving messages and notifications.

You will need:

- The ID for the Facebook Page linked to your Instagram Professional account
- The Instagram-scoped ID for the customer whom the action will be implemented
- A Page access token requested from a person who can perform the MESSAGE task on the Facebook Page linked to your Instagram Professional account
- `instagram_manage_messages`, `instagram_basic`, and `business_management` permissions. **Advanced Access** is required to use this API for conversations involving your business and people who **do not** have a role on your messaging app, your Facebook page, or your business
- A conversation must exist between the user and Instagram business before any of the actions provided by this API can be used

### Limitations

- Up to 10 IDs can be provided in each request
- Up to 2 actions can be specified in each request. `unblock_user` cannot be included in the same request as `block_user`
- You can not block an instagram user that is linked, through accounts center, to your instagram business account

### Request Parameters

#### user\_ids

| Property | Description |
| --- | --- |
| `id`<br> _string_ | Instagram-Scoped ID for the person the action should be applied |

#### actions

| Action | Description |
| --- | --- |
| `block_user` | Blocks user and Instagram business interactions on Instagram.<br>Prevents a user from messaging the Instagram business and prevents the business from messaging the user. The user will not be able to find the business’s profile, posts, or stories on Instagram. |
| `unblock_user` | Unblocks user and Instagram business interactions on Instagram.<br>Allows the user and business to message each other again. The user will be able to view and interact with the business’s content on Instagram. |
| `move_to_spam` | Marks the conversation as spam and moves the conversation to the spam folder in Meta Business Suite inbox. |

## Block A User

To block messaging with a user, send a `POST` request to the `/PAGE-ID/moderate_conversations` endpoint with the instagram-scoped id for the user and the `block_user` action.

#### Sample Request

```curl
curl -X POST -H "Content-Type: application/json" -d '{
  "user_ids":[\
    {\
        "id": "{IGSID}"\
    }\
  ],
  "actions": [\
    "block_user"\
  ]
}' "https://graph.facebook.com/v22.0/{PAGE-ID}/moderate_conversations?access_token={PAGE-ACCESS-TOKEN}"
```

On success, your app will receive the following JSON response with the `success` field set to `true`. On failure, the `success` field will be set to `false`.

```curl
"success": "true"
```

## Unblock A User

To unblock a user, send a `POST` request to the `/PAGE-ID/moderate_conversations` endpoint with the Instagram-scoped id for the user and the `unblock_user` action.

#### Sample Request

```curl
curl -X POST -H "Content-Type: application/json" -d '{
  "user_ids":[\
    {\
        "id":"{IGSID}"\
    }\
  ],
  "actions": [\
    "unblock_user"\
  ]
}' "https://graph.facebook.com/v22.0/{PAGE-ID}/moderate_conversations?access_token={PAGE-ACCESS-TOKEN}"
```

On success, your app will receive the following JSON response with the `success` field set to `true`. On failure, the `success` field will be set to `false`.

```curl
"success": "true"
```

## Move Conversation to Spam

To mark a conversation as spam and move it to the spam folder in the Meta Business Suite inbox, send a `POST` request to `/PAGE-ID/moderate_conversations` with the Instagram-scoped id for the user and the `move_to_spam` action.

#### Sample Request

```curl
curl -X POST -H "Content-Type: application/json" -d '{
  "user_ids":[\
    {\
        "id":"{IGSID}"\
    }\
  ],
  "actions": [\
    "move_to_spam"\
  ]
}' "https://graph.facebook.com/v22.0/{PAGE-ID}/moderate_conversations?access_token={PAGE-ACCESS-TOKEN}"
```

On success, your app will receive the following JSON response with the `success` field set to `true`. On failure, the `success` field will be set to `false`.

```curl
"success": "true"
```

## Perform Multiple Actions For Multiple Users

If you would like to perform multiple actions at once for a set of users, send a `POST` request to `/PAGE-ID/moderate_conversations` with the Instagram-scoped ids for the users and a list of the actions that should be applied to the users.

#### Sample Request

Block two users and move the conversations to spam.

```curl
curl -X POST -H "Content-Type: application/json" -d '{
  "user_ids":[\
    {\
        "id":"{IGSID}"\
    },\
    {\
        "id":"{IGSID}"\
    }\
  ],
  "actions": [\
    "block_user",\
    "move_to_spam"\
  ]
}' "https://graph.facebook.com/v22.0/{PAGE-ID}/moderate_conversations?access_token={PAGE-ACCESS-TOKEN}"
```

On success, your app will receive the following JSON response with the `success` field set to `true`. On failure, the `success` field will be set to `false`.

```curl
"success": "true"
```

## Error Codes

If you are facing any of the following errors while trying to complete the request for multiple users, you can retry the request with one user at a time.

| Error Code | Message |
| --- | --- |
| `100` | Invalid parameter<br>The provided user ids or actions may be invalid<br>The user ID is not a valid PSID or IGSID<br>Invalid actions |
| `1` | Failed to block Instagram user<br>Failed to unblock Instagram user<br>Instagram Direct thread not found between business and consumer<br>Unexpected error: Failed to move Instagram thread to spam folder |

On This Page

[Moderate Conversations API for Instagram](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#moderate-conversations-api-for-instagram)

[Before You Start](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#before-you-start)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#limitations)

[Request Parameters](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#request-parameters)

[Block A User](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#block-a-user)

[Unblock A User](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#unblock-a-user)

[Move Conversation to Spam](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#move-conversation-to-spam)

[Perform Multiple Actions For Multiple Users](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#perform-multiple-actions-for-multiple-users)

[Error Codes](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations#error-codes)