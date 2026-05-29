---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads
title: Welcome message ads - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-instagram-login%2Fwelcome-message-ads%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Welcome Message Flows](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#welcome-message-flows)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#limitations)

[Create a flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#create-a-flow)

[Reference](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#reference)

[Read](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#read)

[Get a specific flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#get-a-specific-flow)

[Update a flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#update-a-flow)

[Delete a flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#delete-a-flow)

[Sample request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#sample-request)

[Next steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#next-steps)

[Ads manager](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#ads-manager)

# Welcome Message Flows

When creating ads that Click to Instagram Direct, you can connect a message flow from a messaging partner app. A message flow can include text, images, emoji, buttons, and other message types supported by the [Send API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api).

This guide shows how to create and manage welcome message flows via the Instagram Platform.

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

- [`/welcome_message_flows`](https://developers.facebook.com/docs/instagram-api/reference)
- `/<APP_USERS_INSTAGRAM_PRO_ID>` or `/me`

#### IDs

- The ID for the Instagram professional account that is creating the welcome message flow

#### Permissions

- `instagram_business_basic`
- `instagram_business_manage_messages`

### Limitations

- Welcome message flows are only available through Instagram Boost Ads if the Instagram professional account is not linked to a Facebook Page.
- Welcome message flows will not appear in Meta's Ads Manager if the Instagram professional account is not linked to a Facebook Page.

Linking a Facebook Page to the Instagram professional account allows for the welcome message flows to be visible in Ads Manager and accessible for other ad types.

## Create a flow

To create a welcome message flow, send a `POST` request to the `/me/welcome_message_flows` endpoint with the following properties:

- `eligible_platforms` set to `"instagram"` (Only Instagram is supported.)
- `name` set to the name of the flow
- `welcome_message_flow` set to an array of `message` objects with:


  - `message.text` set to your app user's welcome message
  - `message.quick_replies`set to an array defining each quick reply with:


    - `content_type` set to `text`
    - `title` set to the quick reply button text
    - `payload` set to the content to be sent in a webhook notification when a person clicks that button

#### Sample request

```curl
curl -X POST -H "Content-Type: application/json"
     -d '{
           "eligible_platforms":["instagram"],
           "name"="<WELCOME_MESSAGE_FLOW_NAME>",
           "welcome_message_flow": [\
             {\
               "message": {\
                 "text":"<WELCOME_MESSAGE_TEXT>",\
                 "quick_replies":[\
                   {\
                     "content_type":"text",\
                     "title":"<QUICK_REPLY_TEXT_1>",\
                     "payload":"<QUICK_REPLY_TEXT_1_WEBHOOK_CONTENT>"\
                   },\
                   {\
                     "content_type":"text",\
                     "title":"<QUICK_REPLY_TEXT_2>",\
                     "payload":"<QUICK_REPLY_TEXT_2_WEBHOOK_CONTENT>"\
                   },\
                   {\
                     "content_type":"text",\
                     "title":"<QUICK_REPLY_TEXT_3>",\
                     "payload":"<QUICK_REPLY_TEXT_3_WEBHOOK_CONTENT>"\
                   }\
                 ]\
               }\
             }\
           ]
        }' "https://graph.instagram.com/v25.0/me/welcome_message_flows?access_token=<INSTAGRAM_USER_ACCESS-TOKEN>"
```

On success your app receives an ID for the welcome message flow.

```json
{
  "flow_id":"<WELCOME_MESSAGE_FLOW_ID>"
}
```

### Reference

| Properties | Description |
| --- | --- |
| `eligible_platforms`<br> _Array of strings_ | **Required.** The platforms that the welcome message can be shown on, `"instagram"`. Only Instagram is supported. |
| `name`<br> _String_ | **Required.** Name of the flow |
| `welcome_message_flow`<br> _Array of `message` objects_ | **Required.** An array of message objects that contain the welcome message text and an array of quick replies sent upon clicking the ad |

| `welcome_message_flow` Properties | Description |
| --- | --- |
| `message`<br> _Object_ | **Required.** An objects that contain the welcome message text and an array of quick replies sent upon clicking the ad |
| `message.text`<br> _String_ | **Required.** The welcome message text sent upon clicking the ad |
| `message.quick_replies`<br> _Array_ | **Required.** An array of objects that defines each quick reply including the content type of each quick reply, the text shown in each quick reply button, and the content sent via webhook notification when the quick reply that is selected. |
| `message.quick_replies.content_type`<br> _String_ | **Required.** Must be `text`. |
| `message.quick_replies.payload`<br> _String_ | **Required.** The content sent in a webhook notification when a person clicks on the associated quick reply button |
| `message.quick_replies.title`<br> _String_ | **Required.** The text shown in the quick reply button. |

_**Note:** Each Welcome Message will be validated against the platform(s) specified and will only be accepted if the message type in the welcome message is supported on the specified platform(s)._

## Read

To get a list of your app user's welcome message flows, send a `GET` request to `/me/welcome_message_flows` endpoint.

#### Sample request

_Formatted for readability._

```curl
curl -X GET "https://graph.instagram.com/v25.0/me/welcome_message_flows
      ?access_token=<INSTAGRAM_USER_ACCESS-TOKEN>"
```

On success, your app will receive a list of flows.

```json
[\
  {\
    "id":"<WELCOME_FLOW_1_ID>",\
    "name":"<WELCOME_FLOW_1_NAME>",\
    "welcome_message":"<MESSAGE_1_OBJECT_CONTENT>",\
    "eligible_platforms": ["instagram"],\
    "last_update_time":"2023-09-01T05:20:38+0000",\
    "is_used_in_ad": false // indicates whether or not a flow is used in an ad\
  },\
  {\
    "id":"<WELCOME_FLOW_2_ID>",\
    "name":"<WELCOME_FLOW_2_NAME>",\
    "welcome_message":"<MESSAGE_2_OBJECT_CONTENT>",\
    "eligible_platforms": ["instagram"],\
    "last_update_time":"2023-08-25T08:21:48+0000",\
    "is_used_in_ad": true\
  },\
  {\
    "id":"<WELCOME_FLOW_3_ID>",\
    "name":"<WELCOME_FLOW_3_NAME>",\
    "welcome_message":"<MESSAGE_3_OBJECT_CONTENT>",\
    "eligible_platforms": ["instagram"],\
    "last_update_time":"2023-08-20T07:43:00+0000",\
    "is_used_in_ad": true\
  }\
  ...\
  ...\
  ...\
]
```

**Note:** You can limit the number of flows returned by including the `limit` parameter set to the number you want returned.

### Get a specific flow

To get a specific flow, send a `GET` request to `/me/welcome_message_flows` endpoint with the `flow_id` parameter set to the the flow ID being queried.

#### Sample request

_Formatted for readability._

```curl
curl -X GET "https://graph.instagram.com/v25.0/me/welcome_message_flows
      ?access_token=<INSTAGRAM_USER_ACCESS-TOKEN>"
```

On success, your app receives a JSON object with the data about the specific flow queried.

## Update a flow

To update an existing flow, send a `POST` request to the `/me/welcome_message_flows` endpoint with:

- the `flow_id` parameter set to the ID of the flow being updated
- at least one of the following parameters to be updated

  - `name`
  - `welcome_message`
  - `platforms`

A flow that is currently connected to an advertisement cannot be updated. Check the `is_used_in_ad` field to determine whether a flow is connected to an advertisement.

#### Sample request

_Formatted for readability._

```curl
curl -X POST "https://graph.instagram.com/v25.0/me/welcome_message_flows \
      ?access_token=<INSTAGRAM_USER_ACCESS-TOKEN> \
      &flow_id=<WELCOME_FLOW_3_ID> \
      &name=<WELCOME_FLOW_3_NEW_NAME>"
```

On success, your app receives a JSON object with `success` set to `true`.

```json
{"success":true}
```

## Delete a flow

To delete a flow, send a `DELETE` request to `/me/welcome_message_flows` endpoint with the `flow_id` parameter set to the ID of the flow to be deleted.

A flow that is currently connected to an advertisement cannot be deleted. Check the `is_used_in_ad` field to determine whether a flow is connected to an advertisement.

### Sample request

_Formatted for readability._

```curl
curl -X DELETE "https://graph.instagram.com/v25.0/me/welcome_message_flows
      ?access_token=<INSTAGRAM_USER_ACCESS-TOKEN> \
      &flow_id=<WELCOME_FLOW_3_ID>"
```

On success, your app receives a JSON object with `success` set to `true`.

## Next steps

Now that you have welcome message flows, they can be used to create ads using [the Marketing API](https://developers.facebook.com/docs/marketing-api/ad-creative/messaging-ads/click-to-instagram#flows) or the [Ads Manager](https://adsmanager.facebook.com/).

|     |     |
| --- | --- |
| ### Ads manager<br>When creating a new engagement ad, scroll down to the **Message template** section and select Partner App. | ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=511053737856149&version=1773565683) |

|     |     |
| --- | --- |
| Select the appropriate messaging Partner App.<br>![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/462036421_512488521495608_383524262698312955_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=T1OzfoWAISQQ7kNvwGGiYhe&_nc_oc=AdrBfdoVYEn6fhXXoHWZX8WMV6_h5JVYd01M0WzA1g-chpBXFJBWCff8VlRwG5-CVC4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=oPMUzpGth0rBuOwXRjRDCw&_nc_ss=7b289&oh=00_Af64MNwX0QqmTbOM7Vka3HUNBn6mL-qFfnsQBHuNiSygBw&oe=6A257374) | Select the Welcome Message Flow.<br>![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/462113779_1088150599979201_1416961844067074328_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=TBi_HS3YQlQQ7kNvwFbF31G&_nc_oc=AdoVYpYXSZj4svD4On4TDyGyOsPqR3GFsIPX8ULcgNRjgxNXajwD6Zi-ipx8rZm47Us&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=oPMUzpGth0rBuOwXRjRDCw&_nc_ss=7b289&oh=00_Af4Rb5V9MSDtC7zKl0YHQGpJyUYRMsgn2KbcRfuM1DixSQ&oe=6A2574C4) |

Preview your message flow.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/462114163_1471346940091684_1811867063520648558_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=U4IqKFLsyaUQ7kNvwFygZFI&_nc_oc=AdqQ_s9D-olwChBEjDZYlwwsBUMptA85tuxWF5LwnJuW15Pegh_6wkNl23jpMZeIZXA&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=oPMUzpGth0rBuOwXRjRDCw&_nc_ss=7b289&oh=00_Af6RXlyhHsg6ItuvcvB4izp1kZEG0a8_Dq1XHhPbolPEbg&oe=6A2584BA)

On This Page

[Welcome Message Flows](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#welcome-message-flows)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#limitations)

[Create a flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#create-a-flow)

[Reference](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#reference)

[Read](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#read)

[Get a specific flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#get-a-specific-flow)

[Update a flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#update-a-flow)

[Delete a flow](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#delete-a-flow)

[Sample request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#sample-request)

[Next steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#next-steps)

[Ads manager](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads#ads-manager)