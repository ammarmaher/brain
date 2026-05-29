---
url: https://developers.facebook.com/docs/whatsapp/guides/interactive-messages
title: Interactive Messages
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fwhatsapp%2Fguides%2Finteractive-messages%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Interactive Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages)

On This Page

[Sending Interactive Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#sending-interactive-messages)

[Overview](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#overview)

[Why You Should Use It](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#why-you-should-use-it)

[When You Should Use It](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#when-you-should-use-it)

[How To Use It](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#how-to-use-it)

[Get Started](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#get-started)

[Step 1: Assemble your interactive object](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#step-1--assemble-your-interactive-object)

[List Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#list-messages)

[Reply Buttons](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#reply-buttons)

[Location Request Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#location-request-messages)

[Flows Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#flows-messages)

[Step 2: Add common message parameters](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#step-2--add-common-message-parameters)

[Step 3: Make a POST call to /messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#step-3--make-a-post-call-to--messages)

[Step 4: Check Webhooks](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#step-4--check-webhooks)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=595945097590761&version=1770998864)[WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)
\>
[On-Premises API](https://developers.facebook.com/docs/whatsapp/on-premises)
\>
[Guides](https://developers.facebook.com/docs/whatsapp/on-premises/guides)
\>
[Send Messages](https://developers.facebook.com/docs/whatsapp/on-premises/guides/messages)

On-Premises API was [officially sunset](https://developers.facebook.com/docs/whatsapp/on-premises/sunset) on October 23, 2025 and is no longer available. Please use Cloud API instead.

# Sending Interactive Messages

This guide teaches you how to send each interactive message option. Interactive messages give your users a simpler way to find and select what they want from your business on WhatsApp. During testing, chatbots using interactive messaging features achieved significantly higher response rates and conversions compared to those that are text-based.

Types of interactive messages:

- **List Messages**: Messages including a menu of up to 10 options. This type of message offers a simpler and more consistent way for users to make a selection when interacting with a business.
- **Reply Button Messages**: Messages including up to 3 options —each option is a button. This type of message offers a quicker way for users to make a selection from a menu when interacting with a business. Reply buttons have the same user experience as interactive templates with buttons.
- **Single-Product Messages**: Messages with a single product item from the business's inventory. See [Share Products With Customers](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers) for more information.
- **Multi-Product Messages**: Messages containing a selection of up to 30 items from the business's inventory. See [Share Products With Customers](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers) for more information.
- **Location Request Messages**: Messages that request the user's location.
- **Flows Messages**: Messages for structured interactions. See [Flows Messages](https://developers.facebook.com/docs/whatsapp/flows) for more information.

### Interactive Message Specifications

- Interactive messages can be combined together in the same flow.
- Users cannot select more than one option at the same time from a list or button message, but they can go back and re-open a previous message.
- List or reply button messages cannot be used as notifications. Currently, they can only be sent within 24 hours of the last message sent by the user. If you try to send a message outside the 24-hour window, you get an error message.
- Supported platforms: iOS, Android, and web (Flows messages are not supported on web).

See how text messages compare to interactive messages:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.8562-6/185251026_214443210216177_123641285902243447_n.png?_nc_cat=111&ccb=1-7&_nc_sid=f537c7&_nc_ohc=Q62j44L2CCIQ7kNvwE7puVf&_nc_oc=AdrJ5NTLOaambplrwbgdK9zQdSBEIey-kQ4sIEiCkiaJ1JKsE0yGK3w8UVcnqvqtIUw&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=C2L4NsAiFtWi9S5lK1imZw&_nc_ss=7b289&oh=00_Af7gAg_5sU5ZL2DC8VADeP-ogQmVVPpvuCMe1dtILA-OcA&oe=6A11099B)

See an example of how List messages and Reply buttons can be combined in the same flow:

Play

0:00

Mute

Enter Fullscreen

Sharing and reporting options

![](https://static.xx.fbcdn.net/rsrc.php/v4/y4/r/-PAXP-deijE.gif)

Something went wrong

We're having trouble playing this video.

[Learn more](https://www.facebook.com/help/396404120401278/list)

## Overview

### Why You Should Use It

#### User Comprehension

When compared to text-based lists, interactive messages provide a simpler and more consistent format for people to find and select what they want from a business. During testing, people had higher comprehension levels interacting with these features.

#### Business Outcomes

During testing, chatbots using interactive messaging features achieved significantly higher response rates and conversions compared to those that are text-based.

#### Personalized

Populated dynamically in real-time and so can be personalized to the customer or situation. For example, you can show a List message of available time slots for appointment booking, or use Reply buttons to show previous delivery addresses.

#### No Templates

Interactive Messages do not require templates or pre-approvals.

### When You Should Use It

List Messages are best for presenting several options, such as:

- A customer care or FAQ menu
- A take-out menu
- Selection of nearby stores or locations
- Available reservation times
- Choosing a recent order to repeat

Reply Buttons are best for offering quick responses from a limited set of options, such as:

- Airtime recharge
- Changing personal details
- Reordering a previous order
- Requesting a return
- Adding optional extras to a food order
- Choosing a payment method

Reply buttons are particularly valuable for ‘personalized’ use cases where a generic response is not adequate.

Flows messages are best for structured communication across one or multiple screens, such as:

- Booking appointments
- Browsing products
- Collecting customer feedback
- Getting new sales leads

Flows messages enable businesses to offer a richer, more engaging user experience that can help customers get things done faster on WhatsApp without necessarily needing to switch to another app, or visit a website.

### How To Use It

At the API level, interactive messages are set by specifying a message’s `type` to `interactive` and adding the [`interactive` object](https://developers.facebook.com/docs/whatsapp/api/messages#interactive-object). Generally, these messages include 4 main parts: `header`, `body`, `footer`, and `action`:

```code
{
  "recipient_type": "individual",
  "to" : "whatsapp-id",
  "type": "interactive"
  "interactive":{
    "type": "list" | "button" | ...,
    "header": {},
    "body": {},
    "footer": {},
    "action": {}
  }
}
```

For List Messages, this is how the parts fit together:
![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.8562-6/183554814_504218921028568_8013384280208209094_n.png?_nc_cat=101&ccb=1-7&_nc_sid=f537c7&_nc_ohc=upx-aIa7oGIQ7kNvwEMVDlH&_nc_oc=AdqS68RnsbEG9Fag0RNp_27LogDmvfAenHY8asjm6nTNjkwC_mamMmOHZZcWv4hvt44&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=C2L4NsAiFtWi9S5lK1imZw&_nc_ss=7b289&oh=00_Af7pZgHuRKRKK3aUgWuJbOK-LW6ggZypYSfolbz7YDQAjg&oe=6A1121B3)



For Reply Buttons Messages, this is how the parts fit together:![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.8562-6/250868356_1722171884839861_6155811972878117161_n.png?_nc_cat=111&ccb=1-7&_nc_sid=f537c7&_nc_ohc=NSzVlt5GaN0Q7kNvwFtZkNO&_nc_oc=AdrlxCwSv2J0EKCStgDyBiE_UftjgZzOGKDo72Z0Dokqu4y8JgR6Swk2roJkpDb7ekw&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=C2L4NsAiFtWi9S5lK1imZw&_nc_ss=7b289&oh=00_Af6_u7OTdHHTMxU7ANQLmQXYxF7sezb8GrtjUFKRjSAaYw&oe=6A1123F4)

See more information below on how to send these messages.

## Get Started

Before you can send each message, you need to get your receiver’s WhatsApp ID with a call to the [`/contacts` node](https://developers.facebook.com/docs/whatsapp/api/contacts).

We recommend setting up your [webhooks](https://developers.facebook.com/docs/whatsapp/api/webhooks) to receive message status and inbound message notifications. This way, you can track if your message was sent and the answers you get from the users. See [Webhooks](https://developers.facebook.com/docs/whatsapp/api/webhooks) for more information.

## Step 1: Assemble your `interactive` object

### List Messages

To send a list message, you must assemble an `interactive` object of type `list` with the following components:

| Object | Description |
| --- | --- |
| `header` | **Optional**.<br>If you decide to include it, you must set the header’s type to text and add a text field with the desired content. Maximum of 60 characters.<br>[See all available `header` fields](https://developers.facebook.com/docs/whatsapp/api/messages#header-object). |
| `body` | **Required.**<br>Your message’s body. Maximum of 1024 characters.<br>[See all available `body` fields](https://developers.facebook.com/docs/whatsapp/api/messages#body-object). |
| `footer` | **Optional.**<br>Your message’s footer.<br>[See all available `footer` fields](https://developers.facebook.com/docs/whatsapp/api/messages#footer-object). |
| `action` | **Required.**<br>Inside action, you must nest:<br>- a `button` field with your button’s content, maximum of 20 characters<br>- at least one `section` object (maximum of 10) with a maximum of 24 characters for the `title` for `section`<br>Inside `section`, you must add at least one `rows` object. Maximum of 24 characters for the `title` for a row and maximum of 72 characters for the `description` for a row.<br>[See all available `action` fields.](https://developers.facebook.com/docs/whatsapp/api/messages#action-object)<br>[See all available `section` fields](https://developers.facebook.com/docs/whatsapp/api/messages#section-object). |

By the end, your `interactive` object should look something like this:

```code
"interactive":{
  "type": "list",
  "header": {
    "type": "text",
    "text": "your-header-content"
  },
  "body": {
    "text": "your-text-message-content"
  },
  "footer": {
    "text": "your-footer-content"
  },
  "action": {
    "button": "cta-button-content",
    "sections":[\
      {\
        "title":"your-section-title-content",\
        "rows": [\
          {\
            "id":"unique-row-identifier",\
            "title": "row-title-content",\
            "description": "row-description-content",\
          }\
        ]\
      },\
      {\
        "title":"your-section-title-content",\
        "rows": [\
          {\
            "id":"unique-row-identifier",\
            "title": "row-title-content",\
            "description": "row-description-content",\
          }\
        ]\
      },\
      ...\
    ]
  }
}
```

### Reply Buttons

To send a reply button message, you must assemble an `interactive` object of type `button` with the following components:

| Object | Description |
| --- | --- |
| `header` | **Optional.**<br>For `button` interactive messages, you can use the following header types: `text`, `video`, `image`, or `document`.<br>Once you select your `type`, add the corresponding objects/fields with more information:<br>- For `video`, `image`, and `document` types: [Add a `media` object](https://developers.facebook.com/docs/whatsapp/api/messages#media-object).<br>- For `text` type: Add a `text` field with the desired content.<br>Example:<br>```code<br>"header": {<br>      "type": "text" | "image" | "video" | "document",<br>      "text": "your text"<br>      # OR<br>      "document": {<br>        "id": "your-media-id",<br>        "filename": "some-file-name"<br>      }<br>      # OR<br>      "document": {<br>        "link": "the-provider-name/protocol://the-url",<br>        "provider": {<br>          "name": "provider-name",<br>        },<br>        "filename": "some-file-name"<br>      },<br>      # OR<br>      "video": {<br>        "id": "your-media-id"<br>      }<br>      # OR<br>      "video": {<br>        "link": "the-provider-name/protocol://the-url",<br>        "provider": {<br>          "name": "provider-name"<br>        }<br>      }<br>      # OR<br>      "image": {<br>        "id": "your-media-id"<br>      }<br>      # OR<br>      "image": {<br>        "link": "http(s)://the-url",<br>        "provider": {<br>          "name": "provider-name"<br>        }<br>      }<br>    }<br>```<br>[See all available `header` fields](https://developers.facebook.com/docs/whatsapp/api/messages#header-object). |
| `body` | **Required**.<br>[See all available `body` fields](https://developers.facebook.com/docs/whatsapp/api/messages#body-object). |
| `footer` | **Optional.**<br>[See all available `footer` fields](https://developers.facebook.com/docs/whatsapp/api/messages#footer-object). |
| `action` | **Required.**<br>You must add at least one `button`, and include `type`, `title`, and `id` for your buttons. You cannot add more than 3 buttons. Maximun of 20 characters for `title`.<br>**You cannot have leading or trailing spaces when setting the ID.**<br>Example:<br>```code<br>"action": {<br>      "buttons": [<br>        {<br>          "type": "reply",<br>          "reply": {<br>            "id": "unique-postback-id",<br>            "title": "First Button’s Title" <br>          }<br>        },<br>        {<br>          "type": "reply",<br>          "reply": {<br>            "id": "unique-postback-id",<br>            "title": "Second Button’s Title" <br>          }<br>        }<br>      ] <br>    }<br>```<br>[See all available `action` fields.](https://developers.facebook.com/docs/whatsapp/api/messages#action-object) |

By the end, your `interactive` object should look something like this:

```code
"interactive": {
    "type": "button",
    "header": { # optional
      "type": "text" | "image" | "video" | "document",
      "text": "your text"
      # OR
      "document": {
        "id": "your-media-id",
        "filename": "some-file-name"
      }
      # OR
      "document": {
        "link": "the-provider-name/protocol://the-url",
        "provider": {
          "name": "provider-name",
        },
        "filename": "some-file-name"
      },
      # OR
      "video": {
        "id": "your-media-id"
      }
      # OR
      "video": {
        "link": "the-provider-name/protocol://the-url",
        "provider": {
          "name": "provider-name"
        }
      }
      # OR
      "image": {
        "id": "your-media-id"
      }
      # OR
      "image": {
        "link": "http(s)://the-url",
        "provider": {
          "name": "provider-name"
        }
      }
    }, # end header
    "body": {
      "text": "your-text-body-content"
    },
    "footer": { # optional
      "text": "your-text-footer-content"
    },
    "action": {
      "buttons": [\
        {\
          "type": "reply",\
          "reply": {\
            "id": "unique-postback-id",\
            "title": "First Button’s Title"\
          }\
        },\
        {\
          "type": "reply",\
          "reply": {\
            "id": "unique-postback-id",\
            "title": "Second Button’s Title"\
          }\
        }\
      ]
    } # end action
  } # end interactive
```

### Location Request Messages

Location request messages contain body text and a **Send location** button that users can tap. Tapping the button displays a location sharing screen which the user can then use to share their location.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/315084249_702469914777094_2733615945192362609_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=WycszeePxWkQ7kNvwGNLiIa&_nc_oc=AdqOWLgUaZnW0jE8bLkjKi9PR7B1Ur2SByFtqskoxGJdN4cN96eIkEV8s1LaDzExKOQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=C2L4NsAiFtWi9S5lK1imZw&_nc_ss=7b289&oh=00_Af72mURxVpHMyg271SNfrFrM6yH-mQ7in0YHIB6ZIkz7jw&oe=6A256BA5)

To send a location request message, first assemble an `interactive` object with text you wish to display in the message:

```json
{
  "type": "location_request_message",
  "body": {
    "type": "text",
    "text": "<TEXT>"
  },
  "action": {
    "name": "send_location"
  }
}
```

| Property | Description |
| --- | --- |
| `type` | Set to `location_request_message`. |
| `body.type` | Set to `text`. |
| `body.text` | Set to the text you want to display above the **Send location** button. |
| `action.name` | Set to `send_location`. |

### Flows Messages

Flows messages contain a call-to-action button that users can tap. Tapping the button displays your custom Flow.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=853106676483065&version=1777334136)

To send a Flows message, you must assemble an `interactive` object of type `flow`. See [here](https://developers.facebook.com/docs/whatsapp/flows/gettingstarted/sendingaflow) the full details.

## Step 2: Add common message parameters

Now that you have your interactive object, append the other parameters that make a message: `recipient_type`, `to`, and `type`. Remember to set the `type` to `interactive`.

```code
{
  "recipient_type": "individual",
  "to" : "whatsapp-id", // WhatsApp ID of your recipient
  "type": "interactive",
  "interactive":{
    // Your interactive object
   }
  }
```

See parameters common to all message types [here](https://developers.facebook.com/docs/whatsapp/api/messages#sending-messages).

## Step 3: Make a `POST` call to `/messages`

Make a `POST` call to the [`/messages`](https://developers.facebook.com/docs/whatsapp/api/messages) endpoint with the `JSON` object you have assembled in steps 1 and 2. If your message is sent successfully, you get the following response:

```code
{
  "messages": [{\
    "id": "{message-id}"\
  }]
}
```

## Step 4: Check Webhooks

If you set up your [webhooks](https://developers.facebook.com/docs/whatsapp/api/webhooks), check for changes in your message status as well as any responses coming from users.

Webhooks of users responding to interactive messages include a new component called `interactive`, which contains information about the user’s choice. See [Webhooks, Components](https://developers.facebook.com/docs/whatsapp/api/webhooks/components) for more information.

For example, here's a webhook request describing a user who has shared their location.

```json
{
  "object": "whatsapp_business_account",
  "entry": [\
    {\
      "id": "12345",\
      "changes": [\
        {\
          "value": {\
            "messaging_product": "whatsapp",\
            "metadata": {\
              "display_phone_number": "12345",\
              "phone_number_id": "12345"\
            },\
            "contacts": [\
              {\
                "profile": {\
                  "name": "John Doe"\
                },\
                "wa_id": "12345"\
              }\
            ],\
            "messages": [\
              {\
                "context": {\
                  "from": "12345",\
                  "id": "test-id"\
                },\
                "from": "123450",\
                "id": "test-id",\
                "timestamp": "16632",\
                "location": {\
                  "address": "1071 5th Ave, New York, NY 10128", #Optional\
                  "latitude": 37.421996751527,\
                  "longitude": -122.08407156636,\
                  "name": "Solomon R. Guggenheim Museum" #Optional\
                },\
                "type": "location"\
              }\
            ]\
          },\
          "field": "messages"\
        }\
      ]\
    }\
  ]
}
```

The `location` component within the payload contains the user's latitude and longitude. Note that `address` and `name` are optional for the user and may not be included.

```json
"location": {
  "address": "1071 5th Ave, New York, NY 10128", #Optional
  "latitude": 40.782910059774,
  "longitude": -73.959075808525,
  "name": "Solomon R. Guggenheim Museum" #Optional
}
```

On This Page

[Sending Interactive Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#sending-interactive-messages)

[Overview](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#overview)

[Why You Should Use It](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#why-you-should-use-it)

[When You Should Use It](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#when-you-should-use-it)

[How To Use It](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#how-to-use-it)

[Get Started](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#get-started)

[Step 1: Assemble your interactive object](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#step-1--assemble-your-interactive-object)

[List Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#list-messages)

[Reply Buttons](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#reply-buttons)

[Location Request Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#location-request-messages)

[Flows Messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#flows-messages)

[Step 2: Add common message parameters](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#step-2--add-common-message-parameters)

[Step 3: Make a POST call to /messages](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#step-3--make-a-post-call-to--messages)

[Step 4: Check Webhooks](https://developers.facebook.com/docs/whatsapp/guides/interactive-messages#step-4--check-webhooks)