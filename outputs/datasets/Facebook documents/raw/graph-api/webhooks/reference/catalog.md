---
url: https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/
title: Webhooks Reference: Catalog
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Freference%2Fcatalog%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Webhooks from Meta](https://developers.facebook.com/docs/graph-api/webhooks)

- [Getting Started](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
- [Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps)
- [Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge)
- [Reference](https://developers.facebook.com/docs/graph-api/webhooks/reference)

On This Page

[Catalog (catalog)](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/#catalog--catalog--)

[items\_batch](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/#items_batch)

[product\_feed](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/#product_feed)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/#)

# Catalog (`catalog`)

Category of updates relating to product catalog changes and events.

## `items_batch`

CatalogItemsBatchField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `catalog_id`<br>numeric string | catalog\_id |
| `handle`<br>string | The handle returned here can be used to check the status of the submitted request via the [/check\_batch\_request\_status](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/check_batch_request_status/) API endpoint. |
| `status`<br>string | Status of a batch request. Possible values are:<br>Finished - The action was completed successfully; individual requests with errors were not saved. |

## `product_feed`

CatalogProductFeedField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `catalog_id`<br>numeric string | catalog\_id |
| `product_feed_id`<br>numeric string | product\_feed\_id |
| `status`<br>string | Status of a Product Feed. Possible values are:<br>Finished - The action was completed successfully |

On This Page

[Catalog (catalog)](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/#catalog--catalog--)

[items\_batch](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/#items_batch)

[product\_feed](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/#product_feed)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close