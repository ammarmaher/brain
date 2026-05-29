---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template
title: Product Template - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fproduct-template%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Product Template for Instagram Messaging](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#product-template-for-instagram-messaging)

[Before you start](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#before-you-start)

[Send a product message](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#send-a-product-message)

[Send a carousel](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#send-a-carousel)

[Send an opt in request](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#send-an-opt-in-request)

[Properties](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#properties)

[Next steps](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#next-steps)

[See also](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#see-also)

# Product Template for Instagram Messaging

Send Instagram messages with product information that you have uploaded to the [your product catalog](https://www.facebook.com/business/help/1275400645914358) using the product template. Product details (image, title, price) will automatically be pulled from the product catalog.

You can create messages that have one product or a horizontally scrollable carousel of products using the product template.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=583752468987971&version=1778062048)![](https://lookaside.fbsbx.com/elementpath/media/?media_id=447994142698870&version=1778055091)

## Before you start

You will need:

- The ID, or IDs, for the product from your Facebook catalog – You can get IDs from via [Catalog API](https://developers.facebook.com/docs/marketing-api/catalog) or [Commerce Manager](https://www.facebook.com/business/help/2371372636254534).
- A Page Access Token from the Page that owns the products in the catalog
- [Meta Webhooks for Instagram Messaging subscriptions](https://developers.facebook.com/docs/messenger-platform/instagram/features/webhook)
- The ID for your Instagram Professional account
- The ID for the Page linked to your Instagram Professional account
- The Instagram Scoped ID for the person to whom you are sending the message

## Send a product message

To send a product message to a person, send a `POST` request to the `/PAGE-ID/messages` endpoint with the `recipient.id` property set to the Instagram-scoped ID of the person receiving the message. Include the `type` and `payload` properties in the `message.attachment` object. Set `type` to `template` and set the `payload.template_type` property to `product` and `payload.elements` to a list of product ID key-value pairs.

```curl
curl -X POST -H "Content-Type: application/json" -d '{
  "recipient":{
    "id":"INSTAGRAM-SCOPED-ID"
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload": {
        "template_type": "product",
        "elements": [\
          {\
            "id": "PRODUCT-ID"\
          }\
        ]
      }
    }
  }
}' "https://graph.facebook.com/LATEST-GRAPH-API-VERSION/PAGE-ID/messages?access_token=PAGE-ACCESS-TOKEN"
```

### Send a carousel

To send a product carousel, add more product key-value pairs to the `payload.elements` property. You can include up to 10 products in your request.

```json
...
      "payload": {
        "template_type": "product",
        "elements": [\
          {\
            "id": "PRODUCT-ID-1"\
          },\
          {\
            "id": "PRODUCT-ID-2"\
          },\
          {\
            "id": "PRODUCT-ID-3"\
          }\
        ]
      }
...
```

On success your app will receive the following JSON object with the recipient ID and the message ID.

```js
{
  "recipient_id": "1254477777772919",
  "message_id": "AG5Hz2Uq7tuwNEhXfYYKj8mJEM_QPpz5jdCK48PnKAjSdjfipqxqMvK8ma6AC8fplwlqLP_5cgXIbu7I3rBN0P"
}
```

## Send an opt in request

To send an opt in request to a person to receive recurring marketing messages, send a `POST` request to `/PAGE-ID/messages` endpoint with the `recipient.id` property set to the Instagram-scoped ID of the person receiving the message. In the `message``attachment.payload` property set `template_type` to `notification_messages`. In the `payload.elements` property include the `image_url`, `title`, `payload`, `notification_message_frequency`, and `notification_messages_cta_text`.

```curl
curl -X POST -H "Content-Type:application/json" -d '{
  "recipient": {
    "id": "INSTAGRAM-SCOPED-ID"
  },
  "message": {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "notification_messages",
        "elements": [\
          {\
            "image_url": "IMAGE-URL",\
            "title": "TEXT-TO-DISPLAY",\
            "payload": "INFORMATION-ABOUT-THIS-MESSAGE",\
            "notification_messages_frequency": "DAILY",\
            "notification_messages_cta_text": "GET_UPDATES"\
          }\
        ]
      }
    }
  }
}' "https://graph.intern.facebook.com/LATEST-GRAPH-API-VERSION/PAGE-ID/messages?access_token=PAGE-ACCESS-TOKEN"
```

### Properties

| Property | Value |
| --- | --- |
| `image_url`<br> _string_ | The URL for the image to display in the template |
| `notification_messages_cta_text`<br> _enum {_<br>_`ALLOW`,_<br>_`FREQUENCY`,_<br>_`GET`,_<br>_`GET_UPDATES`,_<br>_`OPT_IN`,_<br>_`SIGN_UP` }_ | Text that appears on call to action button is set by using one of the following values:<br>- `ALLOW` – set optin message button text to **Allow messages**<br>- `FREQUENCY` \- set optin message button text to **Get daily messages**<br>- `GET` – set optin message button text to **Get messages**<br>- `GET_UPDATES` – set optin message button text to **Get updates**, this is also default if notification\_messages\_cta\_text is not set<br>- `OPT_IN` – set optin message button text to **Opt in to messages**<br>- `SIGN_UP` – set optin message button text to **Sign up for messages** |
| `notification_messages_frequency`<br> _enum {_<br>_`DAILY`,_<br>_`WEEKLY`,_<br>_`MONTHLY` }_ | Message frequency for this recurring notification opt in request.<br>- `DAILY` – Opt in to receive one notification per 24 hour period for 6 months<br>- `WEEKLY` – Opt in to receive one notification per 7 day period for 9 months<br>- `MONTHLY` – Opt in to receive one notification per 1 month period for 12 months |
| `payload`<br> _string_ | The type of recurring notification, such as promotional messaging or product release messaging, for this recurring notification opt in request |
| `title`<br> _string_ | The title to display in the template, can not exceed 65 characters. If no value is assigned, the value defaults to "Updates and promotions" |

## Next steps

Now that you people have opted in to receiving recurring marketing messages, learn how to [send your marketing messages](https://developers.facebook.com/docs/messenger-platform/instagram/features/recurring-notifications#message-attachment-payload).

## See also

- [Common Error Codes Reference](https://developers.facebook.com/docs/messenger-platform/error-codes)
- [Message Attachment Payload Reference](https://developers.facebook.com/docs/messenger-platform/instagram/features/recurring-notifications#message-attachment-payload)

On This Page

[Product Template for Instagram Messaging](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#product-template-for-instagram-messaging)

[Before you start](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#before-you-start)

[Send a product message](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#send-a-product-message)

[Send a carousel](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#send-a-carousel)

[Send an opt in request](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#send-an-opt-in-request)

[Properties](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#properties)

[Next steps](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#next-steps)

[See also](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template#see-also)