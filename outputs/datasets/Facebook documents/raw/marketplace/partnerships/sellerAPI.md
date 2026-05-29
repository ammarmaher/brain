---
url: https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI
title: Seller API - Marketplace Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmarketplace%2Fpartnerships%2FsellerAPI%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Marketplace Platform](https://developers.facebook.com/docs/marketplace)

- [Marketplace Partnerships](https://developers.facebook.com/docs/marketplace/partnerships)


  - [Item API](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI)
  - [Seller API](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI)

On This Page

[Marketplace Partner Seller API](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#marketplace-partner-seller-api)

[Params](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#params)

[API Rate Limit](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#api-rate-limit)

[Seller Ban](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#seller-ban)

[Product Item Fields](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#product-item-fields)

[Check Status of Upload](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#check-status-of-upload)

[View and Manage Products](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#view-and-manage-products)

# Marketplace Partner Seller API

Every product in your catalog must have a seller associated with it. Each product must include a seller, but sellers can have multiple products.

It’s recommended to first upload partner sellers, followed by the products associated with the sellers. If a product is uploaded before the associated seller, the product won’t be distributed on Facebook Marketplace.

To upload, update, or delete your sellers on Facebook Marketplace you will use the GraphAPI interface.

| HTTP |
| --- |
| POST /v20.0/{product-catalog-id}/marketplace\_partner\_sellers\_details HTTP/1.1 |

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

## Params

| Parameter | Description |
| --- | --- |
| requests | The method and fields for each seller in an array of sellers. |

The request parameter is where you will define the method and the data of your request.

| Field | Description |
| --- | --- |
| method | The action you wish to perform for a given partner seller. Options are:<br>CREATE<br>UPDATE<br>DELETE |
| data | The information about the partner seller to be created, updated, or deleted. |

Example requests parameter

```code
[\
    {\
        "method": "CREATE",\
        "data": {\
            "seller_name": "Plush Seller Inc.0",\
            "seller_id": "partnerID1",\
            "seller_review_count": 7,\
            "seller_positive_ratings_pct": 1.0,\
            "seller_member_since": 2019,\
        }\
    },\
    {\
        "method": "UPDATE",\
        "data": {\
            "seller_name": "Plush Seller Inc.0",\
            "seller_id": "partnerID2",\
            "seller_review_count": 13,\
            "seller_positive_ratings_pct": 0.8,\
            "seller_member_since": 2015,\
        }\
    },\
    {... next seller},\
]

```

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=855868409846697&version=1774407334)

## API Rate Limit

To prevent throttling please follow these recommendations:

- Do not exceed 200 calls per hour. Anything above will cause throttling.

- Batch sellers in one API call, up to 5000.


## Seller Ban

If we suspect a seller of using Marketplace to sell as a business, we will ban them and stop distribution of their listings on Marketplace. Sellers may be flagged as a business based on their listings. If you believe a seller has been incorrectly blocked, you can unblock them by deleting suspected business listings using the [itemAPI](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI).

## Product Item Fields

| Parameter | Type | Required/<br> Optional | Description |
| --- | --- | --- | --- |
| `seller_name` | String | Required | The name of the seller displayed on the products. |
| `seller_id` | String | Required | The id of the seller. The id must match the partner product field **partner\_seller\_id** to connect the partner seller with the products.<br>The id must be unique for each seller in a partnership catalog. If not unique, uploading a seller with the same **seller\_id** as another seller in the same catalog will override the previous seller.<br>If an item is available in multiple countries, be sure to reuse the same seller\_id for all catalogs. |
| `seller_review_count` | Number | Optional | The number of reviews a seller has received. |
| `seller_positive_ratings_pct` | Float between 0.0 and 1.0 | Optional | The positive ratings percentage of a seller displayed on Marketplace out of 5 stars. For example, a **seller\_positive\_ratings\_pct** of 0.8 would be displayed on Marketplace as 4 / 5 stars. |
| `seller_member_since` | Number | Optional | The year the seller joined your platform. |

## Check Status of Upload

After submitting a create, update, or delete request, a ‘session\_id’ field will be returned to you. You can then check the result of the submission with another request.

The data -> status will be set to “completed” upon completion and the errors will be displayed.

| HTTP |
| --- |
| GET /v20.0/{product-catalog-id}/check\_marketplace\_partner\_sellers\_status?session\_id={your session id} |

Example return

```code
{
  "data": [\
    "session_id": "session_id",\
    "status": "completed",\
    "sample_errors": [\
      {\
        "error_type": "property_value_string_exceeds_length",\
        "line": 1,\
        "properties": "seller_id"\
      },\
      {\
        "error_type": "property_value_string_exceeds_length",\
        "line": 2,\
        "properties": "seller_id"\
      }\
    ]\
  ]
}

```

## View and Manage Products

To view or manage uploaded products on [Commerce Manager](https://business.facebook.com/commerce/). Any issues with your products will appear on Commerce Manager and may be resolved in the tool. For example, if products have been uploaded with a partner\_seller\_id for a seller that does not exist yet, the error will be displayed under ‘Issues’.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=520233884507441&version=1774407334)

On This Page

[Marketplace Partner Seller API](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#marketplace-partner-seller-api)

[Params](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#params)

[API Rate Limit](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#api-rate-limit)

[Seller Ban](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#seller-ban)

[Product Item Fields](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#product-item-fields)

[Check Status of Upload](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#check-status-of-upload)

[View and Manage Products](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI#view-and-manage-products)