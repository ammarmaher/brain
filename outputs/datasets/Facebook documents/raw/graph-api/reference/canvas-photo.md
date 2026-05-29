---
url: https://developers.facebook.com/docs/graph-api/reference/canvas-photo/
title: Graph API Reference v25.0: Canvas Photo
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fcanvas-photo%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)
- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)
- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)
- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Canvas Photo](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#)

# Canvas Photo

## Reading

A photo inside a canvas

### Example

### Parameters

This endpoint doesn't have any parameters.

### Fields

| Field | Description |
| --- | --- |
| `id`<br>numeric string | The id of the element |
| `action`<br>CanvasOpenURLAction | The action associated with the photo |
| `bottom_padding`<br>numeric string | The padding below the element |
| `deep_link`<br>string | Deep link destination only for mobile apps<br>(used for mobile install or engagement ads, and app link is supported) |
| `element_group_key`<br>string | The element group key to bundle multiple elements in editing |
| `element_type`<br>enum | The type of the element<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `hide_product_prices`<br>bool | Flag to determine whether or not to hide prices for tagged products |
| `name`<br>string | The name of the element<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `photo`<br>[Photo](https://developers.facebook.com/docs/graph-api/reference/photo/) | The facebook photo node |
| `product_tags`<br>list<CanvasProductTag> | The product tags on the photo |
| `style`<br>enum | The presentation style of the photo node |
| `top_padding`<br>numeric string | The padding above the element |

### Error Codes

| Error | Description |
| --- | --- |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

#### Add Product Tags

Create an ads experience that mimics browsing a printed, lifestyle catalog featuring desired products to promote. You can tag featured products in the image and a tag appears on the image.

**This API is available on a limited basis to partners and advertisers that are on the allow list. Contact your Facebook representative if you want to use this API.**

When someone taps the tag, a thumbnail for that product appears in a rotating group of thumbnails, including all tagged products. Someone can tap the thumbnail to be taken to the product's product detail page. This uses the photo with product tags element API. For example:

`
curl
  -F 'canvas_photo={
    "bottom_padding": 20,
    "name": "Instant Experience Photo Name",
    "open_url_action": {"url":"URL"},
    "photo_id": "PHOTO_ID",
    "style": "FIT_TO_WIDTH",
    "top_padding": 20,
    "product_tags": "[{product_id: PRODUCT_ID, coordinates: [0.65, 0.58]}, {product_id: PRODUCT_ID}]"
}'
}'
  -F 'access_token=ACCESS_TOKEN'
https://graph.facebook.com/VERSION/PAGE_ID/canvas_elements
`

The options available for product tags are:

| Field Name | Description | Type | Required |
| --- | --- | --- | --- |
| `product_tags` | Provide a list of products for the photo | `array` | Yes |
| `product_id` | Product id for tapped photo | `number` | Yes |
| `coordinates` | Spot coordinates on the photo. | `array`, where `x` and `y` greater than zero and less than 1 | No. If none specified, there is no spot on the photo |

On This Page

[Canvas Photo](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/canvas-photo/#Deleting)