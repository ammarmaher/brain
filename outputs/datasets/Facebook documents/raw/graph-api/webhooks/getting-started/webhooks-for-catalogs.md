---
url: https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs
title: Catalogs - Webhooks from Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Fgetting-started%2Fwebhooks-for-catalogs%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Webhooks from Meta](https://developers.facebook.com/docs/graph-api/webhooks)

- [Getting Started](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)


  - [Ad Accounts](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts)
  - [Instagram](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-instagram)
  - [Leads](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen)
  - [Catalogs](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs)
  - [Messenger](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-messenger)
  - [Pages](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages)
  - [Payments](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-payments)
  - [WhatsApp Business Accounts](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-whatsapp)

- [Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps)
- [Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge)
- [Reference](https://developers.facebook.com/docs/graph-api/webhooks/reference)

On This Page

[Webhooks for Catalogs](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs#webhooks-for-catalogs)

[Set up Endpoint and Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs#setup)

[Subscribe Your App](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs#subscribe)

# Webhooks for Catalogs

Webhooks for catalogs allow you to get real-time notifications for certain data changes.

To set up Webhooks for catalogs, the following steps are required:

1. [Set up your endpoint and configure the Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs#setup).
2. [Subscribe your app under your catalog](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs#subscribe).

## Set up Endpoint and Webhooks

Follow our [Webhooks Getting Started guide](https://developers.facebook.com/docs/graph-api/webhooks/getting-started) to create your endpoint and configure your Webhooks. When you configure your webhooks, make sure to choose `Catalog`.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1476119800125789&version=1762401082)

Subscribe to one or more fields below:

| Field | Description |
| --- | --- |
| `product_feed` | Notifies you when the data from a [Product Feed](https://developers.facebook.com/docs/marketing-api/reference/product-feed/) has persisted. |
| `items_batch` | Notifies you when the data from a [Product Catalog Items Batch](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/items_batch/) session has persisted. |

For the Webhook data structure, refer to the [Webhooks Reference - Catalog.](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/)

## Subscribe Your App

You need to subscribe your app to Webhook notifications for your catalog. You app should have edit permission to the catalog to complete this step. The app should also have `catalog_management` permission.

To subscribe your app, have your app send a `POST` request `subscribed_apps` for the catalog:

```code
curl -X POST \
  "https://graph.facebook.com/<VERSION>/<CATALOG_ID>/subscribed_apps?access_token=<ACCESS_TOKEN>" \
-d 'app_id=<APP_ID>'
```

To see which apps are subscribed for your catalog, send a `GET` request:

```code
curl -X GET \
  "https://graph.facebook.com/<VERSION>/<CATALOG_ID>/subscribed_apps?access_token=<ACCESS_TOKEN>"
```

On success, you will see this response:

```code
{
  "data": [\
    {\
      "name": "<APP_NAME>",\
      "id": "<APP_ID>"\
    }\
  ]
}
```

To remove an app from subscription, send a `DELETE` request:

```code
curl -X DELETE \
  "https://graph.facebook.com/<VERSION>/<CATALOG_ID>/subscribed_apps?access_token=<ACCESS_TOKEN>" \
-d 'app_id=<APP_ID>'
```

On This Page

[Webhooks for Catalogs](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs#webhooks-for-catalogs)

[Set up Endpoint and Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs#setup)

[Subscribe Your App](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs#subscribe)