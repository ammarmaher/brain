---
url: https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/
title: Interactive Message Templates
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fwhatsapp%2Fapi%2Fmessages%2Fmessage-templates%2Finteractive-message-templates%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Interactive Message Templates](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates)

On This Page

[Sending Interactive Message Templates](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#sending-interactive-message-templates)

[Before You Start](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#before-you-start)

[Constraints](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#constraints)

[Step 1: Make POST Request to /messages](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#step-1--make-post-request-to--messages)

[Parameters](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#parameters)

[Step 2: Check Your API Response](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#response)

[Optional Step 3: Handle User Action](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#optional-step-3--handle-user-action)

[Callback from a Quick Reply Button Click](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#callback-from-a-quick-reply-button-click)

[Examples](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#examples)

[Trip Reminder](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#trip-reminder)

[Product Shipment](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#product-shipment)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=595945097590761&version=1770998864)[WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)

On-Premises API was [officially sunset](https://developers.facebook.com/docs/whatsapp/on-premises/sunset) on October 23, 2025 and is no longer available. Please use Cloud API instead.

# Sending Interactive Message Templates

Interactive message templates expand the content you can send recipients beyond the standard message template and media messages template types to include interactive buttons using the [`components`](https://developers.facebook.com/docs/whatsapp/api/messages#components-object) object.

There are two types of predefined buttons offered:

- **Call-to-Action** — Allows your customer to call a phone number and visit a website
- **Quick Reply** — Allows your customer to return a simple text message

These buttons can be attached to text messages or media messages. Once your interactive message templates have been created and approved, you can use them in notification messages as well as customer service/care messages.

## Before You Start

You need to:

- Meet all the prerequisites listed in the [Before You Start section](https://developers.facebook.com/docs/whatsapp/api/messages#before-you-start) of the [Messages documentation](https://developers.facebook.com/docs/whatsapp/api/messages).
- Have [created an interactive message template on Business Manager](https://developers.facebook.com/docs/whatsapp/message-templates/creation#step-1--create-template-using-the-whatsapp-manager). You can either add a call-to-action button or a quick reply button.

Once the message template is approved, you can use the API to send a message.

### Constraints

- For call-to-action templates, you can add 2 buttons, up to one button of each type (call phone number and visit website).
- For quick reply templates, you can add up to 3 buttons.

## Step 1: Make `POST` Request to [`/messages`](https://developers.facebook.com/docs/whatsapp/api/messages)

```code
POST /v1/messages
{
    "to": "recipient_wa_id",
    "type": "template",
    "template": {
        "namespace": "your-namespace",
        "language": {
            "policy": "deterministic",
            "code": "your-language-and-locale-code"
        },
        "name": "your-template-name",
        "components": [\
            {\
                "type" : "header",\
                "parameters": [\
                    {\
                        "type": "text",\
                        "text": "replacement_text"\
                    }\
                ]\
            # end header\
            },\
            {\
                "type" : "body",\
                "parameters": [\
                    {\
                        "type": "text",\
                        "text": "replacement_text"\
                    },\
                    {\
                        "type": "currency",\
                        "currency" : {\
                            "fallback_value": "$100.99",\
                            "code": "USD",\
                            "amount_1000": 100990\
                        }\
                    },\
                    {\
                        "type": "date_time",\
                        "date_time" : {\
                            "fallback_value": "February 25, 1977",\
                            "day_of_week": 5,\
                            "day_of_month": 25,\
                            "year": 1977,\
                            "month": 2,\
                            "hour": 15,\
                            "minute": 33, #OR\
                            "timestamp": 1485470276\
                        }\
                    },\
                    {\
                        ...\
                        # Any additional template parameters\
                    }\
                ]\
            # end body\
            },\
\
            # The following part of this code example includes several possible button types,\
            # not all are required for an interactive message template API call.\
            {\
                "type": "button",\
                "sub_type" : "quick_reply",\
                "index": "0",\
                "parameters": [\
                    {\
                        "type": "payload",\
                        # Business Developer-defined payload\
                        "payload":"aGlzIHRoaXMgaXMgY29vZHNhc2phZHdpcXdlMGZoIGFTIEZISUQgV1FEV0RT"\
                    }\
                ]\
            },\
            {\
                "type": "button",\
                "sub_type" : "url",\
                "index": "1",\
                "parameters": [\
                    {\
                        "type": "text",\
                        # Business Developer-defined dynamic URL suffix\
                        "text": "9rwnB8RbYmPF5t2Mn09x4h"\
                    }\
                ]\
            },\
            {\
                "type": "button",\
                "sub_type" : "url",\
                "index": "2",\
                "parameters": [\
                    {\
                        "type": "text",\
                        # Business Developer-defined dynamic URL suffix\
                        "text": "ticket.pdf"\
                    }\
                ]\
            }\
        ]
    }
}
```

### Parameters

- [Parameters common to all message requests](https://developers.facebook.com/docs/whatsapp/api/messages#parameters)
- [Parameters for message templates](https://developers.facebook.com/docs/whatsapp/api/messages#message-templates):


  - [`template` object](https://developers.facebook.com/docs/whatsapp/api/messages#template-object)
  - [`components` object](https://developers.facebook.com/docs/whatsapp/api/messages#components-object): for interactive message templates, include the [`button` type](https://developers.facebook.com/docs/whatsapp/api/messages#buttons) and the `sub_type` field
  - [`parameters` object](https://developers.facebook.com/docs/whatsapp/api/messages#parameters-object)

## Step 2: Check Your API Response

A successful response includes a `messages` object with an `id`.

```code
{
  "messages": [{\
    "id": "gBEGkYiEB1VXAglK1ZEqA1YKPrU"\
  }]
}
```

An unsuccessful response contains an error object with an error string, error code and other information.

If a template is sent to an account that is incapable of receiving the template, the `1026 (ReceiverIncapable)` error will be sent in the error object to the configured Webhook server.

See [Error and Status Codes](https://developers.facebook.com/docs/whatsapp/api/errors) for more information on errors.

## Optional Step 3: Handle User Action

When a user clicks a quick reply button, a responjse is sent back to the business. See [Callback from a Quick Reply Button Click](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#callback-from-a-quick-reply-button-click) for information. Users can also choose to not click the button and just send you a free form message.

### Callback from a Quick Reply Button Click

When your customer clicks on a quick reply button, a response is sent. Below is an example of the callback format.

**Note:** A customer may not click a button and either reply to the interactive template message or just send you a message. Make sure that you are able to support this type of scenario as well.

See the [Webhooks documentation](https://developers.facebook.com/docs/whatsapp/api/webhooks) for more information.


```json
{
    "contacts": [\
        {\
            "profile": {\
                "name": "Kerry Fisher"\
            },\
            "wa_id": "16505551234"\
        }\
    ],
    "messages": [\
        {\
            "button": {\
                "payload": "No-Button-Payload",\
                "text": "No"\
            },\
            "context": {\
                "from": "16315558007",\
                "id": "gBGGFmkiWVVPAgkgQkwi7IORac0"\
            },\
            "from": "16505551234",\
            "id": "ABGGFmkiWVVPAgo-sKD87hgxPHdF",\
            "timestamp": "1591210827",\
            "type": "button"\
        }\
    ]
    # If there are any errors, an errors field (array) will be present
    "errors": [ { ... } ]
}
```

## Examples

These examples illustrate the process of setting up interactive message templates beginning with the template creation in your Business Manager and sending the message templates with API calls to the `messages` endpoint.

### Trip Reminder

This example shows the creation of an interactive media message template with quick reply buttons.

#### 1\. Create the interactive media message template in your Business Manager.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/69992761_2422053444581036_9156860843323817984_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=cdfYi2tBBIIQ7kNvwFmFouK&_nc_oc=AdpOgakFZwG0p_Npw40olYQLfL2mX1KULUc4AIO4yh2-pe9WsbA3eRjNpNWgU4Zms_k&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=FLH-4GVFB4LMMksxjDv_pw&_nc_ss=7b289&oh=00_Af54Q7B1kzLj-j-MdYNxOPzOey2kRQxrY0uQh2MJgJisDg&oe=6A254E73)

#### 2\. The `messages` API call adds in the parameter information.

```code
POST /v1/messages
{
    "to": "your-test-recipient-wa-id",
    "recipient_type": "individual",
    "type": "template",
    "template": {
        "namespace": "88b39973_f0d5_54e1_29cf_e80f1e3da4f2",
        "name": "upcoming_trip_reminder",
        "language": {
            "code": "en",
            "policy": "deterministic"
        },
        "components": [\
            {\
                "type": "header",\
                "parameters": [\
                    {\
                        "type": "text",\
                        "text": "12/26"\
                    }\
                ]\
            },\
            {\
                "type": "body",\
                "parameters": [\
                    {\
                        "type": "text",\
                        "text": "*Ski Trip*"\
                    },\
                    {\
                        "type": "date_time",\
                        "date_time" : {\
                            "fallback_value": "29th July 2019, 8:00am",\
                            "day_of_month": "29",\
                            "year": "2019",\
                            "month": "7",\
                            "hour": "8",\
                            "minute": "00"\
                        }\
                    },\
                    {\
                            "type": "text",\
                            "text": "*Squaw Valley Ski Resort, Tahoe*"\
                    }\
                ]\
            },\
            {\
                "type": "button",\
                "sub_type": "quick_reply",\
                "index": 0,\
                "parameters": [\
                    {\
                        "type": "payload",\
                        "payload": "Yes-Button-Payload"\
                    }\
                ]\
            },\
            {\
                "type": "button",\
                "sub_type": "quick_reply",\
                "index": 1,\
                "parameters": [\
                    {\
                        "type": "payload",\
                        "payload": "No-Button-Payload"\
                    }\
                ]\
            }\
        ]
    }
}
```

#### 3\. Your customer receives their trip reminder message with quick reply buttons.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/70313288_3542556432436756_2429364280076795904_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=5GdzJskoGfMQ7kNvwGZqss7&_nc_oc=Adpz0JfRpY7EnWpzrN2v5G0R8NnzwUhv2mlXLibFOqjDmGW-EgqE0cv8rkHgf65F_zQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=FLH-4GVFB4LMMksxjDv_pw&_nc_ss=7b289&oh=00_Af4WC3CuG0HDGA13u1dHFdY41-cGjYcpUzvIkhlfCYe5-g&oe=6A253EAF)

### Product Shipment

This example show the creation of an interactive media message template with URL and phone number buttons.

#### 1\. Create the interactive media message template in your Business Manager:

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=432139208312006&version=1766574500)

#### 2\. The `messages` API call adds in the parameter information.

```code
POST /v1/messages
{
    "to": "your-test-recipient-wa-id",
    "recipient_type": "individual",
    "type": "template",
    "template": {
        "namespace": "88b39973_f0d5_54e1_29cf_e80f1e3da4f2",
        "name": "oculus_shipment_update",
        "language": {
            "code": "en",
            "policy": "deterministic"
        },
        "components": [\
            {\
                "type": "header",\
                "parameters": [{\
                    "type": "image",\
                    "image": {\
                        "link": "link-to-your-image"\
                    }\
                }]\
            },\
            {\
                "type": "body",\
                "parameters": [\
                    {\
                        "type": "text",\
                        "text": "Anand"\
                    },\
                    {\
                        "type": "text",\
                        "text": "Quest"\
                    },\
                    {\
                        "type": "text",\
                        "text": "113-0921387"\
                    },\
                    {\
                        "type": "date_time",\
                        "date_time" : {\
                            "fallback_value": "23rd Nov 2019",\
                            "day_of_month": "20",\
                            "year": "2019",\
                            "month": "9"\
                        }\
                    }\
                ]\
            },\
            {\
                "type": "button",\
                "index": "0",\
                "sub_type": "url",\
                "parameters": [\
                    {\
                        "type": "text",\
                        "text": "1Z999AA10123456784"\
                    }\
                ]\
            }\
        ]
    }
}
```

#### 3\. Your customer receives their product shipment message with URL and phone call buttons:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/70110077_2418689288410121_928570447631482880_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=ZodCbzkD8dIQ7kNvwFM7k1f&_nc_oc=AdoDvLhTjvxP-fP5Q1V7bUBAkYbardTLux65jJBOIELxxoAs6cAN_US7mjjruJpc-hE&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=FLH-4GVFB4LMMksxjDv_pw&_nc_ss=7b289&oh=00_Af7bbdCyEPZ3xj909QpJm3X77nbn2Xh9WLrEpDfuqdcC4A&oe=6A25679E)

On This Page

[Sending Interactive Message Templates](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#sending-interactive-message-templates)

[Before You Start](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#before-you-start)

[Constraints](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#constraints)

[Step 1: Make POST Request to /messages](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#step-1--make-post-request-to--messages)

[Parameters](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#parameters)

[Step 2: Check Your API Response](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#response)

[Optional Step 3: Handle User Action](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#optional-step-3--handle-user-action)

[Callback from a Quick Reply Button Click](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#callback-from-a-quick-reply-button-click)

[Examples](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#examples)

[Trip Reminder](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#trip-reminder)

[Product Shipment](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/#product-shipment)