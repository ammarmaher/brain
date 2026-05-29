---
url: https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge
title: Subscriptions Edge - Webhooks from Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Fsubscriptions-edge%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Webhooks from Meta](https://developers.facebook.com/docs/graph-api/webhooks)

- [Getting Started](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
- [Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps)
- [Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge)
- [Reference](https://developers.facebook.com/docs/graph-api/webhooks/reference)

On This Page

[Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge#subscriptions-edge)

[Creating Subscriptions](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge#creating-subscriptions)

[Getting Subscription Information](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge#getting-subscription-information)

# Subscriptions Edge

You can use the Graph API's `/app/subscriptions` edge to configure and manage your app's Webhooks product. Refer to our [/app/subscriptions documentation](https://developers.facebook.com/docs/graph-api/reference/app/subscriptions) to see which operations you can perform with this edge, and any permissions they require. This document only covers a few common operations.

## Creating Subscriptions

To subscribe to an object and its fields, send a `POST` request to the [/app/subscriptions edge](https://developers.facebook.com/docs/graph-api/reference/app/subscriptions) and include the following parameters:

- `object` — The type of object you want to set up field subscriptions for (e.g., `user`).
- `callback_url` — Your endpoint's URL.
- `verify_token` — A `string` that we will include whenever we send you a [verification request](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests).
- `fields` — The fields you want to subscribe to (e.g., `photos`).

For example, if your app's ID were `188559381496048` and you want to be notified when your app's user publish a new photo, you could do this:

#### Sample Request

```html
curl -F "object=user" \
     -F "callback_url=https://your-clever-domain-name.com/webhooks" \
     -F "fields=photos" \
     -F "verify_token=your-verify-token" \
     -F "access_token=your-app-access-token" \
     "https://graph.facebook.com/188559381496048/subscriptions"
```

#### Sample Response

If successful:

```js
{
  "success": "true"
}
```

## Getting Subscription Information

To see the object and field subscriptions that you have set up for your app, send a `GET` request the `/app/subscriptions` edge. For example, if your app's ID were `188559381496048`, you could do this:

#### Sample Request

```html
GET graph.facebook.com/188559381496048/subscriptions
```

#### Sample Response

```html
{
  "data": [\
    {\
      "object": "user",\
      "callback_url": "https://your-clever-domain-name.com/webhooks",\
      "active": true,\
      "fields": [\
        {\
          "name": "photos",\
          "version": "v2.10"\
        },\
        {\
          "name": "feed",\
          "version": "v2.10"\
        }\
      ]\
    }\
  ]
}
```

On This Page

[Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge#subscriptions-edge)

[Creating Subscriptions](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge#creating-subscriptions)

[Getting Subscription Information](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge#getting-subscription-information)