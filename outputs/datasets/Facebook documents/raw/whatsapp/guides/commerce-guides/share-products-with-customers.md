---
url: https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers
title: Share Products With Customers
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fwhatsapp%2Fguides%2Fcommerce-guides%2Fshare-products-with-customers%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Share Products With Customers](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers)

On This Page

[Share Products With Customers](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#share-products-with-customers)

[Catalog Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-messages)

[Requirements](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#requirements)

[Request Syntax](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#request-syntax)

[Post Body](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#post-body)

[Properties](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#properties)

[Sample Request](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#sample-request)

[Sample Response](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#sample-response)

[Catalog Template Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-template-messages)

[Catalog Link Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-link-messages)

[Product Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#product-messages)

[Overview](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#overview)

[Expected Behavior for Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#expected-behavior-for-messages)

[Product Updates](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#product-updates)

[Shopping Cart Experience](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#shopping-cart-experience)

[Why You Should Use It](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#why-you-should-use-it)

[When You Should Use It](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#when-you-should-use-it)

[Get Started](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#get-started)

[Step 1: Assemble The Interactive Object](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#step-1--assemble-the-interactive-object)

[Single Product Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#single-product-messages)

[Multi-Product Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#multi-product-messages)

[Missing Items](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#missing-items)

[Step 2: Add Common Message Parameters](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#step-2--add-common-message-parameters)

[Step 3: Make a POST Call to /messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#step-3--make-a-post-call-to--messages)

[Multi-Product Template Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#multi-product-template-messages)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=595945097590761&version=1770998864)[WhatsApp Business Platform](https://developers.facebook.com/docs/whatsapp)

On-Premises API was [officially sunset](https://developers.facebook.com/docs/whatsapp/on-premises/sunset) on October 23, 2025 and is no longer available. Please use Cloud API instead.

# Share Products With Customers

Businesses have multiple ways to share products with customers:

- [Catalog Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-messages) — Free-form messages containing a button that, when tapped, displays your product catalog within WhatsApp.
- [Catalog Template Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-template-messages) — Template messages containing a button that, when tapped, displays your product catalog within WhatsApp.
- [Catalog Link Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-link-messages) — Messages containing catalog thumbnails and a link to your entire product catalog.
- [Product Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#product-messages) — Messages containing information about a single product or up to 30 products from your product catalog.
- [Multi-Product Template Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#multi-product-template-messages) — Template messages containing information about up to 30 products from your ecommerce catalog, organized in up to 10 sections, in a single message.

## Catalog Messages

Catalog messages are free-form messages that allow you to showcase your product catalog entirely within WhatsApp.

Catalog messages display a product thumbnail header image of your choice, custom body text, a fixed text header, a fixed text sub-header, and a **View catalog** button.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/353831413_931793014769642_1489938023342123500_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=azxCvwewOHYQ7kNvwHC9rGZ&_nc_oc=AdqrODwGFnEm7XREJDwHD5oHzsoBmd1rcTwTOp-JnS1NsyWeIKAjMFLlDuYSe6aXL5E&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=uAg2x2e2Qdva8c2UGdJs2Q&_nc_ss=7b289&oh=00_Af4N9FjhzLuiwtwSIrnnDjhSnicNHUhzPmnWP7Wxvsq4vQ&oe=6A259795)

When a customer taps the **View catalog** button, your product catalog appears within WhatsApp.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/353808079_9331603410246288_3629219693038191737_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=MIQR3a2I_20Q7kNvwHcD48Y&_nc_oc=AdqG-JlD3SaSJnHXtfI-OrGOXTMpz-BVFimSZ7dpvuxCiWG7Ldr6x15QKRFix5ZENuk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=uAg2x2e2Qdva8c2UGdJs2Q&_nc_ss=7b289&oh=00_Af5MaDm9K4otDaqGsIkRvyrSm0cHG71bu8guvf3EuNwtwA&oe=6A258CA8)

### Requirements

You must have [inventory uploaded to Meta](https://developers.facebook.com/docs/whatsapp/guides/upload-inventory-to-facebook) in an ecommerce catalog [connected to your WhatsApp Business Account](https://www.facebook.com/business/help/158662536425974).

### Request Syntax

Use the **WhatsApp Business Phone Number > Messages** endpoint to send a catalog message.

```json
POST /<WHATSAPP_BUSINESS_PHONE_NUMBER_ID>/messages
```

### Post Body

```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "<TO>",
  "type": "interactive",
  "interactive" : {
    "type" : "catalog_message",
    "body" : {
      "text": "<BODY_TEXT>"
    },
    "action": {
      "name": "catalog_message",
      "parameters": {
        "thumbnail_product_retailer_id": "<THUMBNAIL_PRODUCT_RETAILER_ID>"
      }
    },

    /* Footer object is optional */
    "footer": {
      "text": "<FOOTER_TEXT>"
  }
}
```

### Properties

| Placeholder | Description | Sample Value |
| --- | --- | --- |
| `<BODY_TEXT>`<br>_String_ | **Required.**<br>Text to appear in the message body.<br>Maximum 1024 characters. | `Hello! Thanks for your interest. Ordering is easy. Just visit our catalog and add items to purchase.` |
| `<FOOTER_TEXT>`<br>_String_ | **Optional.**<br>Text to appear in the message footer.<br>Maximum 60 characters. | `Best grocery deals on WhatsApp!` |
| `<THUMBNAIL_PRODUCT_RETAILER_ID>`<br>_String_ | **Required.**<br>Item SKU number. Labeled as **Content ID** in the Commerce Manager.<br>The thumbnail of this item will be used as the message's header image.<br>If the `parameters` object is omitted, the product image of the first item in your catalog will be used. | `2lc20305pt` |
| `<TO>`<br>_String_ | Customer phone number. | `16505551234` |

### Sample Request

```code
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "16505551234",
  "type": "interactive",
  "interactive": {
    "type": "catalog_message",
    "body": {
      "text": "Hello! Thanks for your interest. Ordering is easy. Just visit our catalog and add items to purchase."
    },
    "action": {
      "name": "catalog_message",
      "parameters": {
        "thumbnail_product_retailer_id": "2lc20305pt"
      }
    },
    "footer": {
      "text": "Best grocery deals on WhatsApp!"
    }
  }
}'
```

### Sample Response

```json
{
  "messaging_product": "whatsapp",
  "contacts": [\
    {\
      "input": "16505551234",\
      "wa_id": "16505551234"\
    }\
  ],
  "messages": [\
    {\
      "id": "wamid.HBgLMTY1MDM4Nzk0MzkVAgARGBI0ODVEREUwQzEzQkVBRjQ1RUUA"\
    }\
  ]
}
```

## Catalog Template Messages

Catalog template messages are template messages containing a button that, when tapped, displays your product catalog within WhatsApp.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/354047426_125269187252102_7173148343631613735_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=ACShtiWbeaAQ7kNvwFq93RN&_nc_oc=AdrCCKQBbBxRXUJrdqjM9i9c-hsbBXUYw6OiQQurnpyQd_lp4RKV4tlXhNeLqjYrD8M&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=uAg2x2e2Qdva8c2UGdJs2Q&_nc_ss=7b289&oh=00_Af67BU2L0NWLE3_s1EAkH0DFa-HogpknwRp5VSMGGbopkw&oe=6A2586E6)

To send a catalog template message you need a catalog template. See our [Catalog Templates](https://developers.facebook.com/docs/whatsapp/api/messages/message-templates/interactive-message-templates/catalog) document to learn how to create these templates and how to send them in a template message.

## Catalog Link Messages

Businesses can send a link to their entire product catalog by assembling a wa.me link and including it in a standard [text message](https://developers.facebook.com/docs/whatsapp/api/messages/text). When sending a text message, businesses can use the optional `preview_url` set to `true` to have the message render a set of product catalog thumbnails of any URL in the message `body` string.

Note that if businesses [disable the catalog](https://developers.facebook.com/docs/whatsapp/on-premises/guides/commerce-guides/commerce-settings#enable-disable-catalog), wa.me links and the **View Catalog** button in catalog link messages will display a **Invalid catalog link** message when tapped.

To assemble wa.me link, append the business's business phone number, including country code, to the end of the following string:

```http
https://wa.me/c/
```

For example:

```http
https://wa.me/c/15555455657
```

## Product Messages

Both Multi-Product Messages and Single Product Messages are types of `interactive` messages.

|     |     |
| --- | --- |
| _Multi-Product message example:_ | _Single Product message example:_ |
| ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1395416064274007&version=1765184272) | ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=827995641720475&version=1765184272) |
| _Menu triggered when user clicks on Start Shopping:_ | _Product Detail Page example:_ |
| ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2914485018850726&version=1765184272) | ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=707961307104719&version=1765184272) |

## Overview

Users that receive Multi and Single Product Messages can perform 3 main actions:

1. **View products**: Customers can see a list of products or just one product. Whenever a user clicks on a specific item, we fetch the product's latest info and display the product in a Product Detail Page (PDP) format. Currently, PDPs only support product images —any videos and/or GIFs added to the product won’t be displayed in the PDP.
2. **Add products to a cart**: A user can add a product to their cart, or amend quantities directly from the list or in the product detail page. Whenever a user adds a product to the shopping cart, we fetch the item’s latest info. If there has been a state change on any of the items, we display a dialog saying “One or more items in your cart have been updated” —See [Product Updates](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#product-updates) for more information. A cart persists in a chat thread between business and customer until the cart is sent to the business —See [Shopping Cart Experience](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#shopping-cart-experience) for details.
3. **Send a shopping cart to the business**: After adding all needed items, customers can send their cart to the business they’re messaging with. After that, businesses can define the next steps, such as requesting delivery info or giving payment options.

If a customer has Multiple devices linked to the same WhatsApp account, the Multi-Product and Single Product Messages will be synced between devices. However, the shopping cart is local to each specific device. See [Shopping Cart Experience](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#shopping-cart-experience) for details.

Currently, these types of messages can be received in the following platforms:

- iOS: `2.21.100` (Multi-Product Messages) and `2.21.210` (Single Product Messages).
- Android: `2.21.9.15` (Multi-Product Messages) and `2.21.19` (Single Product Messages).
- Web: The web client that supports these features has been launched.

If the recipient's app version does not support Multi or Single Product Messages, they will instead receive a message explaining that they were unable to receive a message because they are using an outdated version of WhatsApp. The business will also receive a webhook notification indicating the message was unable to be delivered due to the recipient using an outdated version of WhatsApp.

### Expected Behavior for Messages

Multi-Product Messages and Single Product Messages can be:

- Forwarded by one user to another.
- Reopened by a user within the same chat thread.

Catalog Messages, Multi-Product Messages and Single Product Messages cannot be:

- Sent as notifications. They can only be sent as part of an existing chat thread.

### Product Updates

Businesses may need to update properties of items in their catalog. Depending on the updated property, this is how we handle any messages mentioning that product:

| Updated Property | Update Process |
| --- | --- |
| Product’s price, title, description, and image. | 1. A business sends a Multi or Single Product Message containing product A.<br>2. The business updates product A’s properties on their catalog.<br>3. The screens that display that product are updated as soon as the customer client learns about the change from the server. |
| Availability change | 1. A business sends a customer a Multi or Single Product Message containing product B.<br>2. The business sells all units of product B available. Then, the business updates their catalog saying that product B is no longer available<br>3. If a customer had already added product B to a cart, the item will be removed from the cart. The shopping cart displays a dialog saying “One or more items in your cart have been updated”.<br>4. If a customer had not added product B to the cart, the Multi or Single Product Message now shows the item as unavailable. |

### Shopping Cart Experience

After viewing products, a customer can add them to their shopping cart and send that cart to a business. For the purposes of commerce on WhatsApp, a shopping cart:

- **Is unique to a person/business chat thread in a specific device**: Only one cart is created per chat thread between customer and business and carts do not persist across multiple devices. Once a cart is sent, the customer can open another cart with the business and start the process again.
- **Has no expiration date**: The cart persists in the chat thread until it is sent to the business. Once sent, the cart is cleared.

Customers can add up to 99 units of each single catalog item to a shopping cart, but there is no limit on the number of distinct items that can be added to a cart.

Once a cart has been sent, no edits can be made. Customers can send a new cart if they need new items, or would like to change their order. Businesses cannot send carts to customers.

|     |     |
| --- | --- |
| ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=357660539835692&version=1765184272) | ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=571456757903275&version=1765184272) |

_Shopping cart experience example and expected behavior for item state change._

## Why You Should Use It

Both Multi and Single Product Messages lend themselves best to user experiences that are simple and personalised, where it’s a better experience to guide the customer to a subset of items most relevant to them, rather than browsing a business’ full inventory.

#### Simple & Efficient

Combining the features with navigation tools like NLP, text search or List Messages and Reply Buttons to get to what the customer is looking for fast.

#### Personal

Populated dynamically so can be personalised to the customer or situation. For example, you can show a Multi-Product Message of a customer’s most frequently ordered items.

#### Business Outcomes

A performant channel for driving orders, during testing businesses had an average 7% conversion of Multi-Product Messages sent to carts received.

#### No Templates

Interactive messages do not require templates or pre-approvals. They are generated in real-time and will always reflect the latest item details, pricing and stock levels from your inventory.

## When You Should Use It

Multi-Product Messages are best for guiding customers to a specific subset of a business’ inventory, such as:

- Shopping in a conversational way. For example, using search functionality to allow customers to type a shopping list and send back a Multi-Product Message in response.
- Navigating to a specific category. For example, fitness apparel.
- Personalised offers or recommendations.
- Re-ordering previously ordered items. For example, a user can re-order their regular take-out order of less than 30 items.

Single Product Messages are best for guiding customers to one specific item from a business’ inventory, offering quick responses from a limited set of options, such as:

- Responding to a customer’s specific request.
- Providing a recommendation.
- Reordering a previous item.

Both features can also be used as part of a human agent flow, however you need to build the tooling to allow the human agent to generate a Multi-Product Message or Single Product Message in thread.

## Get Started

Before sending each message, you need to get your receiver’s WhatsApp ID with a call to the [`/contacts` node](https://developers.facebook.com/docs/whatsapp/api/contacts).

We recommend setting up [webhooks](https://developers.facebook.com/docs/whatsapp/api/webhooks) to receive message status and inbound message notifications. This way, you can track if a message was sent and the answers from customers.

## Step 1: Assemble The Interactive Object

### Single Product Messages

To send a Single Product Message, assemble an `interactive` object of type `product` with the following components:

| Object | Description |
| --- | --- |
| `body` | **Optional.**<br>A body object. [See all options for the `body` object](https://developers.facebook.com/docs/whatsapp/api/messages#body-object). |
| `footer` | **Optional.**<br>A footer object. [See all options for the `footer` object](https://developers.facebook.com/docs/whatsapp/api/messages#footer-object). |
| `action` | **Required.**<br>The action field must include:<br>- `catalog_id`: ID for the catalog you want to use for this message. Retrieve this ID via Commerce Manager.<br>- `product_retailer_id`: A product’s unique identifier.<br>[See all options for the `action` object](https://developers.facebook.com/docs/whatsapp/api/messages#action-object). |

By the end, the interactive object should look something like this:

```code
"interactive": {
    "type": "product",
    "body": {
      "text": "text-body-content"
    },
    "footer": {
      "text": "text-footer-content"
    },
    "action": {
      "catalog_id": "catalog-id",
      "product_retailer_id": "product-SKU-in-catalog"
    }
}
```

### Multi-Product Messages

To send a Multi-Product Message, assemble an `interactive` object of type `product_list` with the following components:

| Object | Description |
| --- | --- |
| `header` | **Required.**<br>The header’s `type` must be set to `text`. Remember to add a `text` object with the desired content. [See all available `header` fields](https://developers.facebook.com/docs/whatsapp/api/messages#header-object). |
| `body` | **Required.**<br>A `body` object. [See all options for the `body` object](https://developers.facebook.com/docs/whatsapp/api/messages#body-object). |
| `footer` | **Optional.**<br>A `footer` object. [See all options for the `footer` object](https://developers.facebook.com/docs/whatsapp/api/messages#footer-object). |
| `action` | **Required.**<br>The action field must include:<br>- `catalog_id`: ID for the catalog you want to use for this message. Retrieve this ID via Commerce Manager.<br>- `sections`: Array of section objects. You must include at least one section. <br>Inside each section, you can include the following:<br>- `title`: Include a title for each section if you plan to use more than one. <br>- `product_items`: Array of product objects that should be displayed. <br>Each product object contains a `product_retailer_id`, which corresponds to a product’s unique identifier. Retrieve this ID via Commerce Manager. [See all options for the `action` object](https://developers.facebook.com/docs/whatsapp/api/messages#action-object). |

By the end, the `interactive` object should look something like this:

```code
"interactive":
    {
    "type": "product_list",
    "header":{
       "type": "text",
        "text": "text-header-content"
     },
     "body":{
        "text": "text-body-content"
      },
     "footer":{
        "text":"text-footer-content"
     },
     "action":{
        "catalog_id":"catalog-id",
        "sections": [\
             {\
             "title": "the-section-title",\
             "product_items": [\
                  { "product_retailer_id": "product-SKU-in-catalog" },\
                  { "product_retailer_id": "product-SKU-in-catalog" },\
                            ...\
              ]},\
              {\
              "title": "the-section-title",\
              "product_items": [\
                 { "product_retailer_id": "product-SKU-in-catalog" }\
                           ...\
              ]},\
               ...\
       ]
     },
    }
```

### Missing Items

If none of the items provided in the API calls above matches a product from the business’ Facebook catalog, an error message is sent and the Multi or Single Product Message is not sent to the user.

For Multi-Product Message, at least one item from the products list must match an item from the business’ Facebook Catalog. In this case:

- Messages are sent successfully,
- Items without a match are dropped, and
- The business receives an error message asking for a catalog update.

## Step 2: Add Common Message Parameters

Once the interactive object is complete, append the other parameters that make a message: `recipient_type`, `to`, and `type`. Remember to set the `type` to `interactive`.

```code
{
  "recipient_type": "individual",
  "to" : "whatsapp-id", // WhatsApp ID of the recipient
  "type": "interactive",
  "interactive":{
    // The interactive object
   }
  }
```

See parameters common to all message types [here](https://developers.facebook.com/docs/whatsapp/api/messages#sending-messages).

## Step 3: Make a `POST` Call to `/messages`

Make a `POST` call to the [`/messages`](https://developers.facebook.com/docs/whatsapp/api/messages) endpoint with the `JSON` object you have assembled in steps 1 and 2. If your message is sent successfully, you get the following response:

```code
{
  "messages": [{\
    "id": "{message-id}"\
  }]
  }
```

## Multi-Product Template Messages

To send a multi-product template message you need a multi-product message template. See our [Multi-Product Message Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/mpm-templates) document to learn how to create these templates and how to send them in a template message.

On This Page

[Share Products With Customers](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#share-products-with-customers)

[Catalog Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-messages)

[Requirements](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#requirements)

[Request Syntax](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#request-syntax)

[Post Body](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#post-body)

[Properties](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#properties)

[Sample Request](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#sample-request)

[Sample Response](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#sample-response)

[Catalog Template Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-template-messages)

[Catalog Link Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#catalog-link-messages)

[Product Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#product-messages)

[Overview](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#overview)

[Expected Behavior for Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#expected-behavior-for-messages)

[Product Updates](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#product-updates)

[Shopping Cart Experience](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#shopping-cart-experience)

[Why You Should Use It](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#why-you-should-use-it)

[When You Should Use It](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#when-you-should-use-it)

[Get Started](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#get-started)

[Step 1: Assemble The Interactive Object](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#step-1--assemble-the-interactive-object)

[Single Product Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#single-product-messages)

[Multi-Product Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#multi-product-messages)

[Missing Items](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#missing-items)

[Step 2: Add Common Message Parameters](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#step-2--add-common-message-parameters)

[Step 3: Make a POST Call to /messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#step-3--make-a-post-call-to--messages)

[Multi-Product Template Messages](https://developers.facebook.com/docs/whatsapp/guides/commerce-guides/share-products-with-customers#multi-product-template-messages)