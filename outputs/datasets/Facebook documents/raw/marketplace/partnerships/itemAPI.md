---
url: https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/
title: Item API - Marketplace Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmarketplace%2Fpartnerships%2FitemAPI%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Marketplace Platform](https://developers.facebook.com/docs/marketplace)

- [Marketplace Partnerships](https://developers.facebook.com/docs/marketplace/partnerships)


  - [Item API](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI)
  - [Seller API](https://developers.facebook.com/docs/marketplace/partnerships/sellerAPI)

On This Page

[Marketplace Partner Item API](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#marketplace-partner-item-api)

[Params](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#params)

[API Rate Limit](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#api-rate-limit)

[Product Item Fields](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#product-item-fields)

[Check Status of Upload](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#check-status-of-upload)

[View and Manage Products](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#view-and-manage-products)

# Marketplace Partner Item API

Being a Marketplace partner makes your listings available on Facebook Marketplace in certain countries.

To upload, update, or delete your products on Facebook Marketplace you will use the GraphAPI interface.

| HTTP |
| --- |
| POST /v20.0/{product-catalog-id}/items\_batch HTTP/1.1 |

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

When posting to this edge, a [Product Item](https://developers.facebook.com/docs/marketing-api/reference/product-item/) will be created.

## Params

| Parameter | Description |
| --- | --- |
| item\_type | Set as PRODUCT\_ITEM |
| requests | The method and fields for each product in an array of products. |

The request parameter is where you will define the method and the data of your request.

| Field | Description |
| --- | --- |
| method | The action you wish to perform for a given product. Options are:<br>CREATE<br>UPDATE<br>DELETE |
| data | The information about the product to be created, updated, or deleted. |

Example requests parameter

```code
[\
    {\
        "method": "CREATE",\
        "data": {\
            "id": "UniqueProductID",\
            "title": "Title",\
            "description": "This is the description",\
            "price": "100 USD",\
            "image_link": "https:\/\/www.facebook.com",\
            "brand": "Monster",\
            "availability": "in stock",\
            "condition": "new",\
            "link": "https:\/\/www.facebook.com",\
            "return_details": {"return_days": "30", "return_type": "SELLER_PAID_RETURN"},\
            "partner_product_checkout_uri": "https:\/\/www.facebook.com",\
            "partner_product_location": "San Fransisco, CA",\
            "partner_product_expiration_time": "1923181264",\
            "partner_delivery_method": ["shipping"],\
            "partner_shipping_type": "fixed",\
            "partner_shipping_cost": "14.95",\
            "partner_shipping_speed": "3:5",\
            "partner_attribute_data": {"color": "blue"},\
            "partner_seller_id": "MySellerId1",\
            "partner_item_country": "US"\
        }\
    },\
    .... {next product}\
]

```

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=855868409846697&version=1774407334)

## API Rate Limit

To prevent throttling please follow these recommendations:

- Do not exceed 30 calls per minute. Anything above will cause throttling.

- Batch items in one API call, up to 300.


## Product Item Fields

| Parameter | Type | Required/<br> Optional | Description |
| --- | --- | --- | --- |
| `id` | String (Max character limit: 100 | Required | A unique content ID for the item. Use the item's SKU if possible. Each content ID must appear only once in your catalog. If there are multiple instances of the same ID, we ignore all instances.<br>If items are available in multiple countries, you must reuse the same id across all catalogs. Be sure to update the price to the country's currency (see the price field). |
| `title` | String (Character limit: 200) | Required | The title of the product item that appears on the Marketplace listing.<br>This text will appear on Marketplace. Do not include HTML tags. |
| `description` | String (Character limit: 9999) | Required | Description of the product. While the character limit of this field is 9999, only the first 256 characters will be shown on the listing on Facebook Marketplace.<br>This text will appear on Marketplace. Do not include HTML tags.<br>Example: A comfortable royal blue women's T-shirt in organic cotton. Cap sleeves and relaxed fit. Perfect for warm summer days. |
| `condition` | Enum {new, refurbished, used, used\_like\_new, used\_good, used\_fair, cpo, open\_box\_new} | Required | The condition of the product item. |
| `partner_listing_type` | Enum {fixed\_price, auction, vehicle, rental, real\_estate} | Optional | This determines the listing type. It will default to ‘fixed\_price’ if there is no selection.<br>If set as ‘auction’, ‘vehicle’, ‘rental’, or ‘real\_estate’, will deliver specified partner listing type experience for buyers on Marketplace. |
| `partner_product_condition` | Enum {acceptable, brand\_new, certified\_pre\_owned, certified\_refurbished, damaged, digital\_good, excellent\_refurbished, for\_parts\_or\_not\_working, good, good\_refurbished, graded, like\_new, new, new\_other, new\_other\_see\_details, new\_with\_box, new\_with\_defects, new\_with\_tags, open\_box, others, pre\_owned, remanufactured, retread, seller\_refurbished, ungraded, used, very\_good, very\_good\_refurbished, new\_open\_box, open\_box\_used, new\_factory\_sealed, unknown} | Optional | Product conditions. Optional field that will override the condition field. Use if more specificity is desired for the condition of the product. |
| `brand` | String | Required | The brand of the product. Set to ‘N/A’ if no brand exists. |
| `price` | String (Character limit: 9999) | Required | Format the price as a number, followed by a space and then the 3-letter ISO 4217 currency code. Ex. 10.99 EUR<br>If the listing type is ‘auction’ this is the bid price of the product. Format the price as a number, followed by a space and then the 3-letter ISO 4217 currency code. |
| `availability` | Enum {in stock, out of stock} | Required | Availability of the product item. |
| `link` | String | Required | Mobile URL web link to the product detail page. |
| `partner_product_checkout_uri` | String | Optional | Checkout URL link we would send the user to when they tap Buy on listing.<br>We will append the click\_id to the param. If missing, we will default to the URL from the ‘link’ field. |
| `partner_product_html_desc_uri` | String | Optional | URL link to site with full description of product. Used if product description contains more than can fit in the text field ‘description’. Marketplace will optionally provide a link to the full description. |
| `image_link` | String | Required | The URL for the main image of your item. Images must be in JPEG or PNG format, at least 500 x 500 pixels and up to 8 MB. See [product image specifications](https://www.facebook.com/business/help/686259348512056). |
| `partner_seller_id` | String (Max character limit: 100) | Required | Unique identifier for the seller. Needs to match partner\_seller\_id in the seller information.<br>Example: “partner\_seller\_id”: “great\_seller\_inc” |
| `partner_item_country` | Enum {AT, BE, BG, CY, CZ, DE, DK, EE, ES, FI, FR, GR, HR, HU, IE, IS, IT, LI, LT, LU, LV, MT, NL, NO, PL, PT, RO, SE, SI, SK} | Required | This is the country that the product is available in, if applicable, can be shipped to. The catalog country and partner\_item\_country will need to match.<br>Items supporting cross border shipping, it is required that one item be created in each country catalog where shipping is supported and the partner intends to distribute. |
| `fb_product_category` | String | Optional | Facebook product category for the item. Most specific Facebook product category possible from this list: [Spreadsheet (.csv)](https://www.facebook.com/products/categories/en_US.csv) or [Plain text (.txt)](https://www.facebook.com/products/categories/en_US.txt). |
| `status` | Enum {active, archived} | Optional | The current status of the product. |
| `sale_price` | String | Optional | Format the price as a number, followed by a space and then the 3-letter ISO 4217 currency code. Ex. 10.99 EUR. This is the same format as the price field. Use in conjunction with the price field to show discounts. |
| `sale_price_effective_date` | String | Optional | Start and end date and time for the sale, separated by a slash. Write the start and end dates as YYYY-MM-DD. Add a "T" after each date and then include the time. Write the time in a 24-hour format (0:00 to 23:59).<br>Example: 2014-11-01T12:00-0300/2014-12-01T00:00-0300. |
| `additional_image_link` | String (Character limit: 2000) | Optional | URLs for up to 20 additional images of your item, separated by a comma (,), semicolon (;), space ( ) or vertical bar (\|). Follow the same image specifications as image\_link. |
| `return_details` | Nullable json object (ie. map)<br>{<br>“return\_days”: 30,<br>“return\_type”: enum<br>}<br>enum:<br>FINAL\_SALE<br>NO\_RETURNS\_WITH\_EXCEPTION<br>NO\_RETURNS<br>SELLER\_PAID\_RETURN<br>BUYER\_PAID\_RETURN<br>Or, if returns not available<br>“return\_details”: null | Optional | _return\_days_ denotes the number of days within which the buyer has to start the product return.<br>_return\_days_ should be -1 for NO\_RETURNS and FINAL\_SALE<br>_return\_type_ denotes the supported return style of the product. Available options include:<br>FINAL\_SALE,<br>NO\_RETURNS\_WITH\_EXCEPTION,<br>NO\_RETURNS,<br>SELLER\_PAID\_RETURN,<br>BUYER\_PAID\_RETURN<br>If left empty, return details will not be shown. |
| `partner_attribute_data` | Nullable json object<br>{<br>“color”: “blue”<br>}<br>Available keys:<br>aspect\_ratio, band\_material, bike\_type, brand, break\_type, cable\_length, capacity, case\_size, certification, character, circulated\_uncirculated, closure, color, compatible\_bike\_type, compatible\_brand, compatible\_model, compatible\_operating\_system, compatible\_product, connectivity, credit\_included, denomination, department, display\_technology, dress\_length, exterior\_color, exterior\_material, fabric\_type, features, film\_format, fit, focal\_length, focus\_type, form\_factor, format, frame\_color, game\_name, game, gauge, golf\_club\_type, handedness, inseam, internet\_connectivity, item\_height, item\_length, item\_weight, item\_width, items\_included, main\_stone, manufacturer\_part\_number, manufacturer, material, maximum\_aperture, maximum\_magnification, maximum\_resolution, memory\_cards\_supported, metal\_purity, metal, model, mount, mpn, network, number\_of\_items, occasion, outer\_shell\_material, package\_quantity, part\_type, pattern, performance\_activity, platform, processor, publication\_name, quantity, rack\_type, rim\_diameter, rim\_width, ring\_size, screen\_size, section\_width, series, set\_includes, set, size\_type, size, skirt\_length, sleeve\_length, sport\_activity, sport, storage\_capacity, style, type, unit\_quantity, unit\_type, upper\_material, us\_shoe\_size, vintage, voltage, volume, waist\_size, wheel\_diameter, year | Optional | A key-value list of attributes that will be displayed in the details section of the product. The values are string format.<br>Keys applicable to rentals/real estate:<br>property\_type (required), sale\_type, bed\_bath, area\_size, pet\_friendly, ac\_type, heating\_type, laundry\_type, parking\_type, parkingSpace, furnishing\_type, garden\_type, tenure\_type, listed\_by, property\_tax\_and\_condo\_fee, construction\_status, lease\_duration, energy\_rating\_eu, co2\_emission\_rating<br>Keys applicable to vehicles:<br>vehicle\_type, year, make, model, number\_of\_owners, trim, body\_style, exterior\_color, interior\_color, transmission, fuel\_type, mileage, money\_still\_owed, motorcycle\_type, engine\_size |
| `partner_product_creation_time` | UNIX timestamp in seconds UTC (number) | Optional | UNIX timestamp when the product was created or updated.<br>Example: “partner\_product\_creation\_time”: 1713917255 |
| `partner_product_location` | String | Optional | Location of the item as string to be displayed. Example: “Paris, France”. No restrictions on how specific or broad this can be. |
| `partner_product_expiration_time` | UNIX timestamp in seconds UTC (number) | Optional | Time at which the listing will be removed from Marketplace. Must be time in the future. |
| `partner_delivery_method` | Array of string enums {shipping, in\_person} | Optional | This captures how the product can be delivered to a buyer. If a product can be shipped and picked up in person, include both.<br>Example: \[“shipping”,”in\_person”\]<br>Default: \[“shipping”\] |
| `partner_item_latitude` | Float | Optional | Latitude of the item. Required if delivery method includes “in\_person”. |
| `partner_item_longitude` | Float | Optional | Longitude of the item. Required if delivery method includes “in\_person”. |
| `partner_shipping_type` | Enum {free, fixed, dynamic} | Optional | Shipping price strategy for item. If shipping is free, use ‘free’. If shipping is a fixed price no matter the location, use ‘fixed’ and set the cost in partner\_shipping\_cost. If shipping price varies based on buyer location, variant choices, etc. choose ‘dynamic’. If dynamic, we will not display shipping cost but instead indicate they can see shipping cost during checkout.<br>Default: “dynamic” |
| `partner_shipping_cost` | Float | Optional | Required if partner\_shipping\_type is ‘fixed’.<br>Example “14.95” |
| `partner_shipping_speed` | String<br>‘MIN\_DELIVERY\_SPEED\_IN\_DAYS:MAX\_DELIVERY\_SPEED\_IN\_DAYS’ | Optional | Minimum and maximum expected business days to ship item.<br>Example: “3:5” |
| `partner_auction_bid_close_time` | UNIX timestamp in seconds UTC (number) | Optional | Required field if the partner\_listing\_type is ‘auction’. This is when the bidding closes for the product. Example: “partner\_auction\_bid\_close\_time”: 1713917255 |
| `partner_auction_bid_count` | Number | Optional | Applicable only if partner\_listing\_type is ‘auction’. This is the current number of bids placed on the product. |
| `additional_fields` | Nullable json object<br>Freeform (no set enum / keys)<br>{<br>“revised\_title”: “Premium Blue T-Shirt”<br>} | Optional | A freeform Json field for partners to send any additional fields. |

## Check Status of Upload

After submitting a create, update, or delete request, a handle will be returned to you. You can then check the result of the submission with another request.

The data -> status will be set to “finished” upon completion and the errors and warnings will be displayed.

| HTTP |
| --- |
| GET /v20.0/{product-catalog-id}/check\_batch\_request\_status?handle={your handle} |

Example return

```code
{
  "data": [\
    {\
      "handle": "Acy3FUJwzE10XnWrYr4ttrjOAfs-h6BUg-Wtg6sWGeV7qZZaErX15XPfqT_KWeyC6T4-nTbng9r1BJuScb6hgO1B",\
      "status": "finished",\
      "errors_total_count": 0,\
      "errors": [\
      ],\
      "warnings": [\
        {\
          "line": 1,\
          "id": "YourItemID",\
          "message": "These attributes are invalid and need to be updated in the feed file: The product_tags information under  is invalid. Review for more details"\
        }\
      ],\
      "ids_of_invalid_requests": [\
      ]\
    }\
  ],
  "__www_request_id__": "Az3ghYsDh-101IH2t6DXKuP"
}

```

## View and Manage Products

To view or manage uploaded products on [Commerce Manager](https://business.facebook.com/commerce/). Any issues with your products will appear on Commerce Manager and may be resolved in the tool.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=520233884507441&version=1774407334)

On This Page

[Marketplace Partner Item API](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#marketplace-partner-item-api)

[Params](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#params)

[API Rate Limit](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#api-rate-limit)

[Product Item Fields](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#product-item-fields)

[Check Status of Upload](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#check-status-of-upload)

[View and Manage Products](https://developers.facebook.com/docs/marketplace/partnerships/itemAPI/#view-and-manage-products)