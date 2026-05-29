---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events
title: Upcoming Events - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-facebook-login%2Fupcoming-events%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)


  - [Get Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started)
  - [Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram)
  - [Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery)
  - [Creator Marketplace API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/creator-marketplace)
  - [Copyright Detection](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection)
  - [Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search)
  - [Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions)
  - [Product Tagging](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/product-tagging)
  - [Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events)
  - [Collaboration](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration)

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

[Instagram Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#instagram-upcoming-events)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#before-you-start)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#limitations)

[Create a New Event](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#create-a-new-event)

[Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#request)

[Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#parameters)

[Retrieve an event](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#retrieve-an-event)

[Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#request-2)

[Update an Existing Event](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#update-an-existing-event)

[Example Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#example-request)

[Retrieve all Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#retrieve-all-upcoming-events)

[Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#request-3)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#next-steps)

# Instagram Upcoming Events

This document explains how to manage Instagram events using the Instagram API with Facebook Login, covering creation, modification and retrieval of existing events.

In this document we use "Instagram User" and "Instagram Account" interchangeable; both represent your app user's Instagram professional account.

## Before You Start

You'll need the following:

- The `instagram_basic` permission
- The `instagram_manage_upcoming_events` permission
- The ID of the app user's Instagram professional account linked to a Business

### Limitations

- Only supports Instagram Professional accounts linked to a Business
- Currently only supports retrieval of events created via Ads Manager or this API
- Intended to facilitate the creation of reminder ads

## Create a New Event

To create a new event, send a `POST` request to the `/<IG_USER_ID>/upcoming_events` endpoint, where `<IG_USER_ID>` is the ID for your app user's Instagram professional account, including the following parameters:

- `title`
- `start_time`
- `notification_subtypes` (optional)
- `end_time` (optional)
- `notification_target_time` (optional)

### Request

_Formatted for readability. Make sure to replace placeholders with your own values._

```code
curl -X POST "https://graph.facebook.com/v25.0/<IG_USER_ID>/upcoming_events" \
  -F 'title="Season Premiere"' \
  -F 'start_time="2024-06-30T19:00:00+0000"' \
  -F 'notification_subtypes=["BEFORE_EVENT_1DAY", "BEFORE_EVENT_15MIN", "EVENT_START"]' \
  -F 'access_token=<ACCESS_TOKEN>'
```

On success, your app receives a JSON response containing the new event's ID.

```json
{
  "id": "<EVENT_ID>"
}
```

### Parameters

| Name | Description |
| --- | --- |
| `end_time`<br>ISO string | Optional. The event's end time.<br>**Note:** Must not be set when setting `notification_target_time` to `"EVENT_END"`. |
| `notification_target_time`<br>string | Optional. A string value specifying the part of the event relative to which notifications will be sent. Supported values are `"EVENT_START"` or `"EVENT_END"`.<br>If not set in the request, defaults to `"EVENT_START"`. When set to `"EVENT_END"`, the `notification_subtypes` field must include the following three values in any order: `[“BEFORE_EVENT_2DAY”, “BEFORE_EVENT_1DAY”, “BEFORE_EVENT_1HOUR”]`.<br>Additionally, when set to `"EVENT_END"`, the event `end_date` must not be specified. |
| `notification_subtypes`<br>array of strings | Optional.
A comma-separated list of three values that describe when notifications will be sent to event subscribers relative to the event’s `start_time`.
If not set in the request, defaults to `"BEFORE_EVENT_1DAY"`, `"BEFORE_EVENT_15MIN"`, and `"EVENT_START"`.

If set without specifying `notification_target_time` or with `notification_target_time` set to `"EVENT_START"`, `"EVENT_START"` and `"BEFORE_EVENT_1DAY"` are required with one additional value. Possible additional values include:

|     |     |
| --- | --- |
| - `"AFTER_EVENT_1DAY"`<br>- `"AFTER_EVENT_2DAY"`<br>- `"AFTER_EVENT_3DAY"`<br>- `"AFTER_EVENT_4DAY"` | - `"AFTER_EVENT_5DAY"`<br>- `"AFTER_EVENT_6DAY"`<br>- `"AFTER_EVENT_7DAY"`<br>- `"BEFORE_EVENT_15MIN"` |

Order does not matter.

If `notification_target_time` is set to `"EVENT_END"`, the specified values here must be: `[“BEFORE_EVENT_2DAY”, “BEFORE_EVENT_1DAY”, “BEFORE_EVENT_1HOUR”]` |
| `start_time`<br>ISO string | **Required.** The event's start time. |
| `title`<br>string | **Required.** The event's title. |

## Retrieve an event

To retrieve details of an existing event, send a `GET` request to the `/<EVENT_ID>` endpoint.

### Request

_Formatted for readability. Make sure to replace placeholders with your own values._

```curl
curl -X GET "https://graph.facebook.com/v25.0/<EVENT_ID>?access_token=<ACCESS_TOKEN>"
```

On success, your app receives a JSON response containing the ID, title , and start time for the event.

```json
{
  "id": "<EVENT_ID>"
  "title":"Updated Season Premier",
  "start_time":"2024-05-11T16:00:00+0000"
}
```

## Update an Existing Event

To update the details of an existing event, send a `POST` request to the `/<EVENT_ID>` and include one or more of the following parameters that you want to update:

- `title`
- `start_time`
- `notification_subtypes` (optional)
- `end_time` (optional)

### Example Request

_Formatted for readability. Make sure to replace placeholders with your own values._

```curl
curl -X POST "https://graph.facebook.com/v25.0/<EVENT_ID>" \
     -F 'title="Season Premiere"' \
     -F 'start_time="2024-06-30T19:00:00+0000"' \
     -F 'notification_subtypes=["BEFORE_EVENT_1DAY", "BEFORE_EVENT_15MIN", "EVENT_START"]' \
     -F 'access_token=<ACCESS_TOKEN>'
```

On success, your app receives a JSON response containing the ID for the event.

```json
{
  "id": "<EVENT_ID>"
}
```

## Retrieve all Upcoming Events

To retrieve a list of all upcoming events, send a `GET` request to the `/<IG_USER_ID>/upcoming_events`.

### Request

_Formatted for readability. Make sure to replace placeholders with your own values._

```curl
curl -X GET "https://graph.facebook.com/v25.0/<IG_USER_ID>/upcoming_events?access_token=<ACCESS_TOKEN>"
```

On success, your app receives a JSON response containing a list of all upcoming events with the ID, title, and start time for each.

```json
{
  "data": [\
    {\
      "id": "<EVENT_ID_1>,"\
      "title":"<EVENT_TITLE_1>",\
      "start_time":"2024-04-11T16:00:00+0000"\
    },\
    {\
      "id": "<EVENT_ID_2>,"\
      "title":"<EVENT_TITLE_2>",\
      "start_time":"2024-04-18T16:00:00+0000"\
    },\
    {\
      "id": "<EVENT_ID_3>,"\
      "title":"<EVENT_TITLE_3>",\
      "start_time":"2024-04-25T16:00:00+0000"\
    },\
  ]
}
```

## Next Steps

- Learn how to create
[Instagram Reminder Ads \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFT4Rvf&_nc_oc=AdpqiukGg96xZvDxbXjvQL-yv609zk52k7l_INbIVVFADw-9zPXCFlfe-b1uW9Vw1TQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ZhLazeK3TwuLX_YbbcbJMg&_nc_ss=7b289&oh=00_Af6xYTQCbbXOcPlecFc6mQ3ouZaTjyoZz3q2D0CR29O30Q&oe=6A2592E2)](https://developers.facebook.com/docs/instagram/marketing-api/guides/reminder-ads)
using Meta's Marketing API.



On This Page

[Instagram Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#instagram-upcoming-events)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#before-you-start)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#limitations)

[Create a New Event](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#create-a-new-event)

[Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#request)

[Parameters](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#parameters)

[Retrieve an event](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#retrieve-an-event)

[Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#request-2)

[Update an Existing Event](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#update-an-existing-event)

[Example Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#example-request)

[Retrieve all Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#retrieve-all-upcoming-events)

[Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#request-3)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events#next-steps)