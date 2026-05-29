---
url: https://developers.facebook.com/docs/marketing-api/reference/product-item/
title: Graph API Reference v25.0: Product Item
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmarketing-api%2Freference%2Fproduct-item%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Marketing API](https://developers.facebook.com/docs/marketing-api)

- [Overview](https://developers.facebook.com/docs/marketing-api/overview)
- [Get Started](https://developers.facebook.com/docs/marketing-api/get-started)
- [Ad Creative](https://developers.facebook.com/docs/marketing-api/creative)
- [Bidding](https://developers.facebook.com/docs/marketing-api/bidding)
- [Ad Rules Engine](https://developers.facebook.com/docs/marketing-api/ad-rules)
- [Audiences](https://developers.facebook.com/docs/marketing-api/audiences)
- [Insights API](https://developers.facebook.com/docs/marketing-api/insights)
- [Brand Safety and Suitability](https://developers.facebook.com/docs/marketing-api/brand-safety-and-suitability)
- [Best Practices](https://developers.facebook.com/docs/marketing-api/best-practices)
- [Troubleshooting](https://developers.facebook.com/docs/marketing-api/troubleshooting)
- [API Reference](https://developers.facebook.com/docs/marketing-api/reference)


  - [Ad Account](https://developers.facebook.com/docs/marketing-api/reference/ad-account)
  - [Ad Image](https://developers.facebook.com/docs/marketing-api/reference/ad-image)
  - [Ad Previews](https://developers.facebook.com/docs/marketing-api/generatepreview)
  - [Ad Preview Plugin](https://developers.facebook.com/docs/marketing-api/ad-preview-plugin)
  - [Business](https://developers.facebook.com/docs/marketing-api/reference/business)
  - [Business Role Request](https://developers.facebook.com/docs/marketing-api/reference/business-role-request)
  - [Business User](https://developers.facebook.com/docs/marketing-api/reference/business-user)
  - [Currencies](https://developers.facebook.com/docs/marketing-api/currencies)
  - [High Demand Period](https://developers.facebook.com/docs/marketing-api/reference/high-demand-period)
  - [Image Crop](https://developers.facebook.com/docs/marketing-api/image-crops)
  - [Product Catalog](https://developers.facebook.com/docs/marketing-api/reference/product-catalog)
  - [System User](https://developers.facebook.com/docs/marketing-api/reference/system-user)

- [Changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)

On This Page

[Product Item](https://developers.facebook.com/docs/marketing-api/reference/product-item/#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/product-item/#Reading)

[Example](https://developers.facebook.com/docs/marketing-api/reference/product-item/#example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/product-item/#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/product-item/#fields)

[Edges](https://developers.facebook.com/docs/marketing-api/reference/product-item/#edges)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/product-item/#error-codes)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/product-item/#Creating)

[Example TSV feed](https://developers.facebook.com/docs/marketing-api/reference/product-item/#tsv)

[XML Example RSS](https://developers.facebook.com/docs/marketing-api/reference/product-item/#XML_RSS)

[XML Example ATOM](https://developers.facebook.com/docs/marketing-api/reference/product-item/#xmlatomfeed)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/product-item/#parameters-2)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/product-item/#return-type)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/product-item/#error-codes-2)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/product-item/#Updating)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/product-item/#parameters-3)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/product-item/#return-type-2)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/product-item/#error-codes-3)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/product-item/#Deleting)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/product-item/#parameters-4)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/product-item/#return-type-3)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/product-item/#error-codes-4)

Graph API Version

[v25.0](https://developers.facebook.com/docs/marketing-api/reference/product-item/#)

# Product Item

## Reading

A Product Item object.

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bproduct-item-id%7D&version=v25.0)

```
GET /v25.0/{product-item-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{product-item-id}',
    '{access-token}'
  );
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphNode = $response->getGraphNode();
/* handle the result */
```

```
/* make the API call */
FB.api(
    "/{product-item-id}",
    function (response) {
      if (response && !response.error) {
        /* handle the result */
      }
    }
);
```

```
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{product-item-id}",
    null,
    HttpMethod.GET,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{product-item-id}"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

### Parameters

| Parameter | Description |
| --- | --- |
| `catalog_id`<br>numeric string | catalog\_id |
| `image_height`<br>int64 | Default value: `0`<br>image\_height |
| `image_width`<br>int64 | Default value: `0`<br>image\_width |
| `override_country`<br>string | override\_country |
| `override_language`<br>string | override\_language |

### Fields

| Field | Description |
| --- | --- |
| `id`<br>numeric string | id<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `additional_image_cdn_urls`<br>list<list<KeyValue:string,string>> | additional\_image\_cdn\_urls |
| `additional_image_urls`<br>list<string> | additional\_image\_urls |
| `additional_variant_attributes`<br>list<KeyValue:string,string> | additional\_variant\_attributes |
| `age_group`<br>enum {adult, all ages, infant, kids, newborn, teen, toddler} | age\_group |
| `applinks`<br>[CatalogItemAppLinks](https://developers.facebook.com/docs/marketing-api/reference/catalog-item-app-links/) | applinks |
| `availability`<br>enum {in stock, out of stock, preorder, available for order, discontinued, pending, mark\_as\_sold, mark\_as\_expired} | availability |
| `brand`<br>string | brand |
| `capabilities_disabled_by_user`<br>list<enum> | capabilities\_disabled\_by\_user |
| `capability_to_review_status`<br>list<KeyValue:enum,enum {NO\_REVIEW, PENDING, REJECTED, APPROVED, OUTDATED}> | capability\_to\_review\_status |
| `category`<br>string | category |
| `category_specific_fields`<br>CatalogSubVerticalList | category\_specific\_fields |
| `color`<br>string | color |
| `commerce_insights`<br>ProductItemCommerceInsights | commerce\_insights |
| `condition`<br>enum {new, refurbished, used, used\_like\_new, used\_good, used\_fair, cpo, open\_box\_new} | condition |
| `currency`<br>string | currency |
| `custom_data`<br>list<KeyValue:string,string> | custom\_data |
| `custom_label_0`<br>string | custom\_label\_0 |
| `custom_label_1`<br>string | custom\_label\_1 |
| `custom_label_2`<br>string | custom\_label\_2 |
| `custom_label_3`<br>string | custom\_label\_3 |
| `custom_label_4`<br>string | custom\_label\_4 |
| `custom_number_0`<br>string | custom\_number\_0 |
| `custom_number_1`<br>string | custom\_number\_1 |
| `custom_number_2`<br>string | custom\_number\_2 |
| `custom_number_3`<br>string | custom\_number\_3 |
| `custom_number_4`<br>string | custom\_number\_4 |
| `description`<br>string | description |
| `errors`<br>[list<ProductItemError>](https://developers.facebook.com/docs/graph-api/reference/product-item-error/) | errors |
| `expiration_date`<br>string | expiration\_date |
| `fb_product_category`<br>string | fb\_product\_category |
| `gender`<br>enum {female, male, unisex} | gender |
| `generated_background_images`<br>list<AIGeneratedProductImage> | generated\_background\_images |
| `generated_background_images_ad_usage`<br>bool | generated\_background\_images\_ad\_usage |
| `gtin`<br>string | gtin |
| `image_cdn_urls`<br>list<KeyValue:string,string> | image\_cdn\_urls |
| `image_fetch_status`<br>enum {NO\_STATUS, DIRECT\_UPLOAD, FETCHED, FETCH\_FAILED, OUTDATED, PARTIAL\_FETCH} | image\_fetch\_status |
| `image_url`<br>string | image\_url |
| `images`<br>list<string> | images |
| `importer_address`<br>ProductItemImporterAddress | importer\_address |
| `importer_name`<br>string | importer\_name |
| `invalidation_errors`<br>list<ProductItemInvalidationError> | invalidation\_errors |
| `inventory`<br>integer | inventory |
| `manufacturer_info`<br>string | manufacturer\_info |
| `manufacturer_part_number`<br>string | manufacturer\_part\_number |
| `marked_for_product_launch`<br>enum | marked\_for\_product\_launch |
| `material`<br>string | material |
| `mobile_link`<br>string | mobile\_link |
| `name`<br>string | name<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `ordering_index`<br>int32 | ordering\_index |
| `origin_country`<br>enum | origin\_country |
| `parent_product_id`<br>numeric string | parent\_product\_id |
| `pattern`<br>string | pattern |
| `post_conversion_signal_based_enforcement_appeal_eligibility`<br>bool | post\_conversion\_signal\_based\_enforcement\_appeal\_eligibility |
| `price`<br>string | price |
| `product_catalog`<br>[ProductCatalog](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/) | product\_catalog |
| `product_feed`<br>[ProductFeed](https://developers.facebook.com/docs/marketing-api/reference/product-feed/) | product\_feed |
| `product_relationship`<br>enum | product\_relationship |
| `product_type`<br>string | product\_type |
| `quantity_to_sell_on_facebook`<br>integer | quantity\_to\_sell\_on\_facebook |
| `retailer_id`<br>string | retailer\_id<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `retailer_product_group_id`<br>string | retailer\_product\_group\_id |
| `review_rejection_reasons`<br>list<enum> | review\_rejection\_reasons |
| `review_status`<br>enum {, pending, rejected, approved, outdated} | review\_status |
| `rich_text_description`<br>string | rich\_text\_description |
| `sale_price`<br>string | sale\_price |
| `sale_price_end_date`<br>string | sale\_price\_end\_date |
| `sale_price_start_date`<br>string | sale\_price\_start\_date |
| `shipping_weight_unit`<br>enum {g, kg, oz, lb} | shipping\_weight\_unit |
| `shipping_weight_value`<br>float | shipping\_weight\_value |
| `short_description`<br>string | short\_description |
| `size`<br>string | size |
| `start_date`<br>string | start\_date |
| `tags`<br>list<string> | tags |
| `url`<br>string | url |
| `vendor_id`<br>string | vendor\_id |
| `video_fetch_status`<br>enum {NO\_STATUS, DIRECT\_UPLOAD, FETCHED, FETCH\_FAILED, OUTDATED, PARTIAL\_FETCH} | video\_fetch\_status |
| `videos`<br>list<ProductItemVideoData> | Array of JSON objects for product item video data.<br>Contains:<br>- `url`: The URLs provided from the catalog ingestion source, regardless of whether or not the videos are fetched.<br>- `tags`: The tags provided with the videos.<br>The following is an example response for the `videos` field for a product item with 2 videos:<br>`"videos": [{"url": "https://facebook.com/video1", "tags": ["abcd"]}, {"url": "https://facebook.com/video2", "tags": ["efgh"]}],` |
| `visibility`<br>enum {staging, published} | visibility |
| `wa_compliance_category`<br>enum | wa\_compliance\_category |

### Edges

| Edge | Description |
| --- | --- |
| [`product_sets`](https://developers.facebook.com/docs/marketing-api/reference/product-item/product_sets/)<br>Edge<ProductSet> | product\_sets |

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 115 | Invalid field list |
| 104 | Incorrect signature |
| 190 | Invalid OAuth 2.0 Access Token |

## Creating

### Example TSV feed

Desktop only:

```code
id  title   description google product category product type    link    image link  condition   availability    price   sale price  sale price effective date   gtin    brand   mpn item group id   gender  age group   color   size    shipping    shipping weight
DB_1    Dog Bowl In Blue    Solid plastic Dog Bowl in marine blue color Animals &gt; Pet Supplies   Bowls &amp; Dining &gt; Food &amp; Water Bowls  http://www.example.com/bowls/db-1.html  http://images.example.com/TV_123456.png new in stock    9.99 GBP                                                        UK::Standard:4.95 GBP
```

With Deep Links:

```code
id  title   ios_url ios_app_store_id    ios_app_name    android_url android_class   android_package android_app_name    description google product category product type    link    image link  condition   availability    price   sale price  sale price effective date   gtin    brand   mpn item group id   gender  age group   color   size    shipping    shipping weight
DB_1    Dog Bowl In Blue    example-ios://electronic    42  Electronic Example iOS  example-android://electronic    com.electronic  com.electronic.Example  Electronic Example Android  Solid plastic Dog Bowl in marine blue color Animals &gt; Pet Supplies   Bowls &amp; Dining &gt; Food &amp; Water Bowls  http://www.example.com/bowls/db-1.html  http://images.example.com/TV_123456.png new in stock    9.99 GBP                                                        UK::Standard:4.95 GBP
```

### XML Example RSS

```code
<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
    <channel>
        <title>Test Store</title>
        <link>http://www.example.com</link>
        <description>An example item from the feed</description>

        <item>
            <g:id>DB_1</g:id>
            <g:title>Dog Bowl In Blue</g:title>
            <g:description>Solid plastic Dog Bowl in marine blue color</g:description>
            <g:link>http://www.example.com/bowls/db-1.html</g:link>
            <g:image_link>http://images.example.com/DB_1.png</g:image_link>
            <g:brand>Example</g:brand>
            <g:condition>new</g:condition>
            <g:availability>in stock</g:availability>
            <g:price>9.99 GBP</g:price>


            <g:google_product_category>Animals &gt; Pet Supplies</g:google_product_category>
        </item>
    </channel>
</rss>
```

### XML Example ATOM

Desktop only:

```code
<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">
    <title>Test Store</title>
    <link rel="self" href="http://www.example.com"/>

    <entry>
        <g:id>DB_1</g:id>
        <g:title>Dog Bowl In Blue</g:title>
        <g:description>Solid plastic Dog Bowl in marine blue color</g:description>
        <g:link>http://www.example.com/bowls/db-1.html</g:link>
        <g:image_link>http://images.example.com/DB_1.png</g:image_link>
        <g:brand>Example</g:brand>
        <g:condition>new</g:condition>
        <g:availability>in stock</g:availability>
        <g:price>9.99 GBP</g:price>


        <g:google_product_category>Animals &gt; Pet Supplies</g:google_product_category>
    </entry>
</feed>
```

With Deep Links:

```code
<?xml version="1.0"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:g="http://base.google.com/ns/1.0">
    <title>Test Store</title>
    <link rel="self" href="http://www.example.com"/>

    <entry>
        <g:id>DB_1</g:id>
        <g:title>Dog Bowl In Blue</g:title>
        <g:description>Solid plastic Dog Bowl in marine blue color</g:description>
        <g:link>http://www.example.com/bowls/db-1.html</g:link>
        <g:image_link>http://images.example.com/DB_1.png</g:image_link>
        <g:brand>Example</g:brand>
        <g:condition>new</g:condition>
        <g:availability>in stock</g:availability>
        <g:price>9.99 GBP</g:price>
        <g:google_product_category>Animals &gt; Pet Supplies</g:google_product_category>
        <applink property="ios_url" content="example-ios://electronic" />
        <applink property="ios_app_store_id" content="42" />
        <applink property="ios_app_name" content="Electronic Example iOS" />
        <applink property="iphone_url" content="example-iphone://electronic" />
        <applink property="iphone_app_store_id" content="43" />
        <applink property="iphone_app_name" content="Electronic Example iPhone" />
        <applink property="ipad_url" content="example-ipad://electronic" />
        <applink property="ipad_app_store_id" content="44" />
        <applink property="ipad_app_name" content="Electronic Example iPad" />
        <applink property="android_url" content="example-android://electronic" />
        <applink property="android_package" content="com.electronic" />
        <applink property="android_class" content="com.electronic.Example" />
        <applink property="android_app_name" content="Electronic Example Android" />
        <applink property="windows_phone_url" content="example-windows://electronic" />
        <applink property="windows_phone_app_id" content="64ec0d1b-5b3b-4c77-a86b-5e12d465edc0" />
        <applink property="windows_phone_app_name" content="Electronic Example Windows" />
    </entry>
</feed>
```

You can make a POST request to `batch` edge from the following paths:

- [`/{product_catalog_id}/batch`](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/batch/)

When posting to this edge, a [ProductItem](https://developers.facebook.com/docs/marketing-api/reference/product-item/) will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `allow_upsert`<br>boolean | Default value: `true`<br>Parameters specifying whether non existing items that are being updated should be inserted or should throw the error |
| `requests`<br>list<JSON object> | Array of JSON objects containing batch requests. Each batch request consists of<br>`retailer_id`, `method` and `data` fields.<br>```<br>  `retailer_id` - retailer's ID for a<br>  product.<br>  `method` - an operation of a batch request, either `CREATE`, `UPDATE`<br>  or `DELETE`.<br>  `data` - JSON object containing fields and values for a product. See [Catalog Batch API](https://developers.facebook.com/docs/marketing-api/catalog-batch) to learn more the list of fields and values for the data object. <br>```<br>Required |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node to which you POSTed.

Struct {

`handles`: List \[\
\
string\
\
\],

`validation_status`: List \[\
\
Struct {\
\
`errors`: List \[\
\
Struct {\
\
`message`: string,\
\
}\
\
\],\
\
`retailer_id`: string,\
\
`warnings`: List \[\
\
Struct {\
\
`message`: string,\
\
}\
\
\],\
\
}\
\
\],

}

### Error Codes

| Error | Description |
| --- | --- |
| 80014 | There have been too many calls for the batch uploads to this catalog account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting#catalog. |
| 100 | Invalid parameter |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |

You can make a POST request to `products` edge from the following paths:

- [`/{product_group_id}/products`](https://developers.facebook.com/docs/marketing-api/reference/product-group/products/)

When posting to this edge, a [ProductItem](https://developers.facebook.com/docs/marketing-api/reference/product-item/) will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `additional_image_urls`<br>list<URL> | Additional product image URLs |
| `additional_variant_attributes`<br>JSON object {string : string} | Additional attributes to distinguish the product in its variant group (ex: {"Scent" : "Fruity", "Style" : "Classic"}) |
| `age_group`<br>enum {adult, all ages, infant, kids, newborn, teen, toddler} | age\_group |
| `android_app_name`<br>string | The name of the app (suitable for display) |
| `android_class`<br>string | A fully-qualified Activity class name for intent generation |
| `android_package`<br>string | A fully-qualified package name for intent generation |
| `android_url`<br>string | A custom scheme for the Android app |
| `availability`<br>enum{in stock, out of stock, preorder, available for order, discontinued, pending, mark\_as\_sold, mark\_as\_expired} | Default value: `in stock`<br>Availability of the product item |
| `brand`<br>string | Brand of the product item |
| `category`<br>string | Category of the product item. This is a required field |
| `checkout_url`<br>URL | URL to add product item to cart and directly to checkout |
| `color`<br>string | Color of the product item |
| `commerce_tax_category`<br>enum{FB\_ANIMAL, FB\_ANIMAL\_SUPP, FB\_APRL, FB\_APRL\_ACCESSORIES, FB\_APRL\_ATHL\_UNIF, FB\_APRL\_CASES, FB\_APRL\_CLOTHING, FB\_APRL\_COSTUME, FB\_APRL\_CSTM, FB\_APRL\_FORMAL, FB\_APRL\_HANDBAG, FB\_APRL\_JEWELRY, FB\_APRL\_SHOE, FB\_APRL\_SHOE\_ACC, FB\_APRL\_SWIM, FB\_APRL\_SWIM\_CHIL, FB\_APRL\_SWIM\_CVR, FB\_ARTS, FB\_ARTS\_HOBBY, FB\_ARTS\_PARTY, FB\_ARTS\_PARTY\_GIFT\_CARD, FB\_ARTS\_TICKET, FB\_BABY, FB\_BABY\_BATH, FB\_BABY\_BLANKET, FB\_BABY\_DIAPER, FB\_BABY\_GIFT\_SET, FB\_BABY\_HEALTH, FB\_BABY\_NURSING, FB\_BABY\_POTTY\_TRN, FB\_BABY\_SAFE, FB\_BABY\_TOYS, FB\_BABY\_TRANSPORT, FB\_BABY\_TRANSPORT\_ACC, FB\_BAGS, FB\_BAGS\_BKPK, FB\_BAGS\_BOXES, FB\_BAGS\_BRFCS, FB\_BAGS\_CSMT\_BAG, FB\_BAGS\_DFFL, FB\_BAGS\_DIPR, FB\_BAGS\_FNNY, FB\_BAGS\_GRMT, FB\_BAGS\_LUG\_ACC, FB\_BAGS\_LUGG, FB\_BAGS\_MSGR, FB\_BAGS\_TOTE, FB\_BAGS\_TRN\_CAS, FB\_BLDG, FB\_BLDG\_ACC, FB\_BLDG\_CNSMB, FB\_BLDG\_FENCE, FB\_BLDG\_FUEL\_TNK, FB\_BLDG\_HT\_VNT, FB\_BLDG\_LOCK, FB\_BLDG\_MATRL, FB\_BLDG\_PLMB, FB\_BLDG\_PUMP, FB\_BLDG\_PWRS, FB\_BLDG\_S\_ENG, FB\_BLDG\_STR\_TANK, FB\_BLDG\_TL\_ACC, FB\_BLDG\_TOOL, FB\_BUSIND, FB\_BUSIND\_ADVERTISING, FB\_BUSIND\_AGRICULTURE, FB\_BUSIND\_AUTOMATION, FB\_BUSIND\_HEAVY\_MACH, FB\_BUSIND\_LAB, FB\_BUSIND\_MEDICAL, FB\_BUSIND\_RETAIL, FB\_BUSIND\_SANITARY\_CT, FB\_BUSIND\_SIGN, FB\_BUSIND\_STORAGE, FB\_BUSIND\_STORAGE\_ACC, FB\_BUSIND\_WORK\_GEAR, FB\_CAMERA\_ACC, FB\_CAMERA\_CAMERA, FB\_CAMERA\_OPTIC, FB\_CAMERA\_OPTICS, FB\_CAMERA\_PHOTO, FB\_ELEC, FB\_ELEC\_ACC, FB\_ELEC\_ARCDADE, FB\_ELEC\_AUDIO, FB\_ELEC\_CIRCUIT, FB\_ELEC\_COMM, FB\_ELEC\_COMPUTER, FB\_ELEC\_GPS\_ACC, FB\_ELEC\_GPS\_NAV, FB\_ELEC\_GPS\_TRK, FB\_ELEC\_MARINE, FB\_ELEC\_NETWORK, FB\_ELEC\_PART, FB\_ELEC\_PRINT, FB\_ELEC\_RADAR, FB\_ELEC\_SFTWR, FB\_ELEC\_SPEED\_RDR, FB\_ELEC\_TELEVISION, FB\_ELEC\_TOLL, FB\_ELEC\_VID\_GM\_ACC, FB\_ELEC\_VID\_GM\_CNSL, FB\_ELEC\_VIDEO, FB\_FOOD, FB\_FURN, FB\_FURN\_BABY, FB\_FURN\_BENCH, FB\_FURN\_CART, FB\_FURN\_CHAIR, FB\_FURN\_CHAIR\_ACC, FB\_FURN\_DIVIDE, FB\_FURN\_DIVIDE\_ACC, FB\_FURN\_ENT\_CTR, FB\_FURN\_FUTN, FB\_FURN\_FUTN\_PAD, FB\_FURN\_OFFICE, FB\_FURN\_OFFICE\_ACC, FB\_FURN\_OTTO, FB\_FURN\_OUTDOOR, FB\_FURN\_OUTDOOR\_ACC, FB\_FURN\_SETS, FB\_FURN\_SHELVE\_ACC, FB\_FURN\_SHLF, FB\_FURN\_SOFA, FB\_FURN\_SOFA\_ACC, FB\_FURN\_STORAGE, FB\_FURN\_TABL, FB\_FURN\_TABL\_ACC, FB\_GENERIC\_TAXABLE, FB\_HLTH, FB\_HLTH\_HLTH, FB\_HLTH\_JWL\_CR, FB\_HLTH\_LILP\_BLM, FB\_HLTH\_LTN\_SPF, FB\_HLTH\_PRSL\_CR, FB\_HLTH\_SKN\_CR, FB\_HMGN, FB\_HMGN\_BATH, FB\_HMGN\_DCOR, FB\_HMGN\_EMGY, FB\_HMGN\_FPLC, FB\_HMGN\_FPLC\_ACC, FB\_HMGN\_GS\_SFT, FB\_HMGN\_HS\_ACC, FB\_HMGN\_HS\_APP, FB\_HMGN\_HS\_SPL, FB\_HMGN\_KTCN, FB\_HMGN\_LAWN, FB\_HMGN\_LGHT, FB\_HMGN\_LINN, FB\_HMGN\_LT\_ACC, FB\_HMGN\_OTDR, FB\_HMGN\_POOL, FB\_HMGN\_SCTY, FB\_HMGN\_SMK\_ACC, FB\_HMGN\_UMBR, FB\_HMGN\_UMBR\_ACC, FB\_MDIA, FB\_MDIA\_BOOK, FB\_MDIA\_DVDS, FB\_MDIA\_MAG, FB\_MDIA\_MANL, FB\_MDIA\_MUSC, FB\_MDIA\_PRJ\_PLN, FB\_MDIA\_SHT\_MUS, FB\_OFFC, FB\_OFFC\_BKAC, FB\_OFFC\_CRTS, FB\_OFFC\_DSKP, FB\_OFFC\_EQIP, FB\_OFFC\_FLNG, FB\_OFFC\_GNRL, FB\_OFFC\_INSTM, FB\_OFFC\_LP\_DSK, FB\_OFFC\_MATS, FB\_OFFC\_NM\_PLT, FB\_OFFC\_PPR\_HNDL, FB\_OFFC\_PRSNT\_SPL, FB\_OFFC\_SEALR, FB\_OFFC\_SHIP\_SPL, FB\_RLGN, FB\_RLGN\_CMNY, FB\_RLGN\_ITEM, FB\_RLGN\_WEDD, FB\_SFTWR, FB\_SFWR\_CMPTR, FB\_SFWR\_DGTL\_GD, FB\_SFWR\_GAME, FB\_SHIPPING, FB\_SPOR, FB\_SPORT\_ATHL, FB\_SPORT\_ATHL\_CLTH, FB\_SPORT\_ATHL\_SHOE, FB\_SPORT\_ATHL\_SPRT, FB\_SPORT\_EXRCS, FB\_SPORT\_INDR\_GM, FB\_SPORT\_OTDR\_GM, FB\_TOYS, FB\_TOYS\_EQIP, FB\_TOYS\_GAME, FB\_TOYS\_PZZL, FB\_TOYS\_TMRS, FB\_TOYS\_TOYS, FB\_VEHI, FB\_VEHI\_PART} | commerce\_tax\_category |
| `condition`<br>enum{new, refurbished, used, used\_like\_new, used\_good, used\_fair, cpo, open\_box\_new} | Default value: `new`<br>The condition of the product item |
| `currency`<br>ISO 4217 Currency Code | Currency for the product item<br>Required |
| `custom_data`<br>dictionary { string : <string> } | TBD |
| `custom_label_0`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_1`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_2`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_3`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_4`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_number_0`<br>int64 | custom\_number\_0 |
| `custom_number_1`<br>int64 | custom\_number\_1 |
| `custom_number_2`<br>int64 | custom\_number\_2 |
| `custom_number_3`<br>int64 | custom\_number\_3 |
| `custom_number_4`<br>int64 | custom\_number\_4 |
| `description`<br>string | Description of the product item. Max size: 5000<br>Supports Emoji |
| `expiration_date`<br>string | Item's expiration date (YYYY-MM-DD) |
| `fb_product_category`<br>string | The facebook product category specified by the seller. |
| `gender`<br>enum{female, male, unisex} | Gender the product item is targeted towards |
| `gtin`<br>string | Global trade ID of the product item |
| `image_url`<br>URI | URL of the product image<br>Required |
| `inventory`<br>int64 | Inventory count for the product item |
| `ios_app_name`<br>string | The name of the app (suitable for display) |
| `ios_app_store_id`<br>int64 | The app ID for the App Store |
| `ios_url`<br>string | A custom scheme for the iOS app |
| `ipad_app_name`<br>string | The name of the app (suitable for display) |
| `ipad_app_store_id`<br>int64 | The app ID for the App Store |
| `ipad_url`<br>string | A custom scheme for the iPhone app |
| `iphone_app_name`<br>string | The name of the app (suitable for display) |
| `iphone_app_store_id`<br>int64 | The app ID for the App Store |
| `iphone_url`<br>string | A custom scheme for the iPhone app |
| `launch_date`<br>string | launch\_date |
| `manufacturer_part_number`<br>string | Manufacturer's ID for the product item |
| `marked_for_product_launch`<br>enum{default, marked, not\_marked} | marked\_for\_product\_launch |
| `material`<br>string | Material of the product item<br>Max size: 200 |
| `mobile_link`<br>URI | Link to a mobile-optimized external product page |
| `name`<br>string | Name/title of the product item<br>RequiredSupports Emoji |
| `ordering_index`<br>int64 | Index used for ordering items within a group |
| `pattern`<br>string | Pattern of the product item |
| `price`<br>int64 | Price of the item with 2 digits added for cents (ex: use "100" for 1 or "599" for 5.99)<br>Required |
| `product_priority_0`<br>float | product\_priority\_0 |
| `product_priority_1`<br>float | product\_priority\_1 |
| `product_priority_2`<br>float | product\_priority\_2 |
| `product_priority_3`<br>float | product\_priority\_3 |
| `product_priority_4`<br>float | product\_priority\_4 |
| `product_type`<br>string | Retailer defined category of the product item. Max size: 750 |
| `quantity_to_sell_on_facebook`<br>int64 | quantity\_to\_sell\_on\_facebook |
| `retailer_id`<br>string | A unique identifier for this item (which can be a variant for a product)<br>Required |
| `return_policy_days`<br>int64 | Return Policy Days |
| `sale_price`<br>int64 | Sale price of the item with 2 digits added for cents (ex: use "100" for 1 or "599" for 5.99) |
| `sale_price_end_date`<br>datetime | Date when the sale price ends |
| `sale_price_start_date`<br>datetime | Date when the sale price starts |
| `short_description`<br>string | A brief description of the product |
| `size`<br>string | Size of the product item |
| `start_date`<br>string | Date when the product started to exist |
| `url`<br>URI | URL of the product item |
| `visibility`<br>enum{staging, published} | Default value: `published`<br>Visibility of the product item |
| `windows_phone_app_id`<br>string | The app ID (a GUID) for app store |
| `windows_phone_app_name`<br>string | The name of the app (suitable for display) |
| `windows_phone_url`<br>string | A custom scheme for the Windows Phone app |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node represented by `id` in the return type.

Struct {

`id`: numeric string,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |

You can make a POST request to `products` edge from the following paths:

- [`/{product_catalog_id}/products`](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/products/)

When posting to this edge, a [ProductItem](https://developers.facebook.com/docs/marketing-api/reference/product-item/) will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `additional_image_urls`<br>list<URL> | Additional product image URLs |
| `additional_variant_attributes`<br>JSON object {string : string} | Additional attributes to distinguish the product in its variant group (ex: {"Scent" : "Fruity", "Style" : "Classic"}) |
| `age_group`<br>enum {adult, all ages, infant, kids, newborn, teen, toddler} | The age group that the item is targeted towards |
| `allow_upsert`<br>boolean | Default value: `true`<br>If the retailer\_id of the item already exists in the catalog, setting this flag to true allows the request to update the item, otherwise it throws an error.<br>By default the value is true. |
| `android_app_name`<br>string | The name of the app (suitable for display) |
| `android_class`<br>string | A fully-qualified Activity class name for intent generation |
| `android_package`<br>string | A fully-qualified package name for intent generation |
| `android_url`<br>string | A custom scheme for the Android app |
| `availability`<br>enum{in stock, out of stock, preorder, available for order, discontinued, pending, mark\_as\_sold, mark\_as\_expired} | Default value: `in stock`<br>Availability of the product item |
| `brand`<br>string | Brand of the product item |
| `category`<br>string | Google product category for the item. If you need a custom category name instead, use field 'product\_type' |
| `category_specific_fields`<br>JSON object | JSON object containing category specific fields |
| `item_sub_type`<br>enum {APPLIANCES, BABY\_FEEDING, BABY\_TRANSPORT, BEAUTY, BEDDING, CAMERAS, CELL\_PHONES\_AND\_SMART\_WATCHES, CLEANING\_SUPPLIES, CLOTHING, CLOTHING\_ACCESSORIES, COMPUTERS\_AND\_TABLETS, DIAPERING\_AND\_POTTY\_TRAINING, ELECTRONICS\_ACCESSORIES, FURNITURE, HEALTH, HOME\_GOODS, JEWELRY, NURSERY, PRINTERS\_AND\_SCANNERS, PROJECTORS, SHOES\_AND\_FOOTWEAR, SOFTWARE, TOYS, TVS\_AND\_MONITORS, VIDEO\_GAME\_CONSOLES\_AND\_VIDEO\_GAMES, WATCHES} | Default value: `"EMPTY"`<br>item\_sub\_type |
| `checkout_url`<br>URL | URL to add product item to cart and directly to checkout |
| `color`<br>string | Color of the product item |
| `commerce_tax_category`<br>enum{FB\_ANIMAL, FB\_ANIMAL\_SUPP, FB\_APRL, FB\_APRL\_ACCESSORIES, FB\_APRL\_ATHL\_UNIF, FB\_APRL\_CASES, FB\_APRL\_CLOTHING, FB\_APRL\_COSTUME, FB\_APRL\_CSTM, FB\_APRL\_FORMAL, FB\_APRL\_HANDBAG, FB\_APRL\_JEWELRY, FB\_APRL\_SHOE, FB\_APRL\_SHOE\_ACC, FB\_APRL\_SWIM, FB\_APRL\_SWIM\_CHIL, FB\_APRL\_SWIM\_CVR, FB\_ARTS, FB\_ARTS\_HOBBY, FB\_ARTS\_PARTY, FB\_ARTS\_PARTY\_GIFT\_CARD, FB\_ARTS\_TICKET, FB\_BABY, FB\_BABY\_BATH, FB\_BABY\_BLANKET, FB\_BABY\_DIAPER, FB\_BABY\_GIFT\_SET, FB\_BABY\_HEALTH, FB\_BABY\_NURSING, FB\_BABY\_POTTY\_TRN, FB\_BABY\_SAFE, FB\_BABY\_TOYS, FB\_BABY\_TRANSPORT, FB\_BABY\_TRANSPORT\_ACC, FB\_BAGS, FB\_BAGS\_BKPK, FB\_BAGS\_BOXES, FB\_BAGS\_BRFCS, FB\_BAGS\_CSMT\_BAG, FB\_BAGS\_DFFL, FB\_BAGS\_DIPR, FB\_BAGS\_FNNY, FB\_BAGS\_GRMT, FB\_BAGS\_LUG\_ACC, FB\_BAGS\_LUGG, FB\_BAGS\_MSGR, FB\_BAGS\_TOTE, FB\_BAGS\_TRN\_CAS, FB\_BLDG, FB\_BLDG\_ACC, FB\_BLDG\_CNSMB, FB\_BLDG\_FENCE, FB\_BLDG\_FUEL\_TNK, FB\_BLDG\_HT\_VNT, FB\_BLDG\_LOCK, FB\_BLDG\_MATRL, FB\_BLDG\_PLMB, FB\_BLDG\_PUMP, FB\_BLDG\_PWRS, FB\_BLDG\_S\_ENG, FB\_BLDG\_STR\_TANK, FB\_BLDG\_TL\_ACC, FB\_BLDG\_TOOL, FB\_BUSIND, FB\_BUSIND\_ADVERTISING, FB\_BUSIND\_AGRICULTURE, FB\_BUSIND\_AUTOMATION, FB\_BUSIND\_HEAVY\_MACH, FB\_BUSIND\_LAB, FB\_BUSIND\_MEDICAL, FB\_BUSIND\_RETAIL, FB\_BUSIND\_SANITARY\_CT, FB\_BUSIND\_SIGN, FB\_BUSIND\_STORAGE, FB\_BUSIND\_STORAGE\_ACC, FB\_BUSIND\_WORK\_GEAR, FB\_CAMERA\_ACC, FB\_CAMERA\_CAMERA, FB\_CAMERA\_OPTIC, FB\_CAMERA\_OPTICS, FB\_CAMERA\_PHOTO, FB\_ELEC, FB\_ELEC\_ACC, FB\_ELEC\_ARCDADE, FB\_ELEC\_AUDIO, FB\_ELEC\_CIRCUIT, FB\_ELEC\_COMM, FB\_ELEC\_COMPUTER, FB\_ELEC\_GPS\_ACC, FB\_ELEC\_GPS\_NAV, FB\_ELEC\_GPS\_TRK, FB\_ELEC\_MARINE, FB\_ELEC\_NETWORK, FB\_ELEC\_PART, FB\_ELEC\_PRINT, FB\_ELEC\_RADAR, FB\_ELEC\_SFTWR, FB\_ELEC\_SPEED\_RDR, FB\_ELEC\_TELEVISION, FB\_ELEC\_TOLL, FB\_ELEC\_VID\_GM\_ACC, FB\_ELEC\_VID\_GM\_CNSL, FB\_ELEC\_VIDEO, FB\_FOOD, FB\_FURN, FB\_FURN\_BABY, FB\_FURN\_BENCH, FB\_FURN\_CART, FB\_FURN\_CHAIR, FB\_FURN\_CHAIR\_ACC, FB\_FURN\_DIVIDE, FB\_FURN\_DIVIDE\_ACC, FB\_FURN\_ENT\_CTR, FB\_FURN\_FUTN, FB\_FURN\_FUTN\_PAD, FB\_FURN\_OFFICE, FB\_FURN\_OFFICE\_ACC, FB\_FURN\_OTTO, FB\_FURN\_OUTDOOR, FB\_FURN\_OUTDOOR\_ACC, FB\_FURN\_SETS, FB\_FURN\_SHELVE\_ACC, FB\_FURN\_SHLF, FB\_FURN\_SOFA, FB\_FURN\_SOFA\_ACC, FB\_FURN\_STORAGE, FB\_FURN\_TABL, FB\_FURN\_TABL\_ACC, FB\_GENERIC\_TAXABLE, FB\_HLTH, FB\_HLTH\_HLTH, FB\_HLTH\_JWL\_CR, FB\_HLTH\_LILP\_BLM, FB\_HLTH\_LTN\_SPF, FB\_HLTH\_PRSL\_CR, FB\_HLTH\_SKN\_CR, FB\_HMGN, FB\_HMGN\_BATH, FB\_HMGN\_DCOR, FB\_HMGN\_EMGY, FB\_HMGN\_FPLC, FB\_HMGN\_FPLC\_ACC, FB\_HMGN\_GS\_SFT, FB\_HMGN\_HS\_ACC, FB\_HMGN\_HS\_APP, FB\_HMGN\_HS\_SPL, FB\_HMGN\_KTCN, FB\_HMGN\_LAWN, FB\_HMGN\_LGHT, FB\_HMGN\_LINN, FB\_HMGN\_LT\_ACC, FB\_HMGN\_OTDR, FB\_HMGN\_POOL, FB\_HMGN\_SCTY, FB\_HMGN\_SMK\_ACC, FB\_HMGN\_UMBR, FB\_HMGN\_UMBR\_ACC, FB\_MDIA, FB\_MDIA\_BOOK, FB\_MDIA\_DVDS, FB\_MDIA\_MAG, FB\_MDIA\_MANL, FB\_MDIA\_MUSC, FB\_MDIA\_PRJ\_PLN, FB\_MDIA\_SHT\_MUS, FB\_OFFC, FB\_OFFC\_BKAC, FB\_OFFC\_CRTS, FB\_OFFC\_DSKP, FB\_OFFC\_EQIP, FB\_OFFC\_FLNG, FB\_OFFC\_GNRL, FB\_OFFC\_INSTM, FB\_OFFC\_LP\_DSK, FB\_OFFC\_MATS, FB\_OFFC\_NM\_PLT, FB\_OFFC\_PPR\_HNDL, FB\_OFFC\_PRSNT\_SPL, FB\_OFFC\_SEALR, FB\_OFFC\_SHIP\_SPL, FB\_RLGN, FB\_RLGN\_CMNY, FB\_RLGN\_ITEM, FB\_RLGN\_WEDD, FB\_SFTWR, FB\_SFWR\_CMPTR, FB\_SFWR\_DGTL\_GD, FB\_SFWR\_GAME, FB\_SHIPPING, FB\_SPOR, FB\_SPORT\_ATHL, FB\_SPORT\_ATHL\_CLTH, FB\_SPORT\_ATHL\_SHOE, FB\_SPORT\_ATHL\_SPRT, FB\_SPORT\_EXRCS, FB\_SPORT\_INDR\_GM, FB\_SPORT\_OTDR\_GM, FB\_TOYS, FB\_TOYS\_EQIP, FB\_TOYS\_GAME, FB\_TOYS\_PZZL, FB\_TOYS\_TMRS, FB\_TOYS\_TOYS, FB\_VEHI, FB\_VEHI\_PART} | Commerce tax category |
| `condition`<br>enum{new, refurbished, used, used\_like\_new, used\_good, used\_fair, cpo, open\_box\_new} | Default value: `new`<br>The condition of the product item |
| `currency`<br>ISO 4217 Currency Code | Currency for the product item<br>Required |
| `custom_data`<br>dictionary { string : <string> } | Field used to specify custom variants for a specific catalog item. In this case, variants can be colors, materials, etc.<br>The field must be formatted as key-value pairs, and the keys must be defined in the product group.<br>For example: `custom_data: {"color":"red", "size": "L"}` |
| `custom_label_0`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_1`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_2`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_3`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_4`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_number_0`<br>int64 | custom\_number\_0 |
| `custom_number_1`<br>int64 | custom\_number\_1 |
| `custom_number_2`<br>int64 | custom\_number\_2 |
| `custom_number_3`<br>int64 | custom\_number\_3 |
| `custom_number_4`<br>int64 | custom\_number\_4 |
| `description`<br>string | Description of the product item. Max size: 5000<br>Supports Emoji |
| `expiration_date`<br>string | Item's expiration date (YYYY-MM-DD) |
| `fb_product_category`<br>string | Facebook product category for the item |
| `gender`<br>enum{female, male, unisex} | Gender the product item is targeted towards |
| `gtin`<br>string | Global trade ID of the product item |
| `image_url`<br>URI | Required. URL of the product image. |
| `importer_address`<br>JSON object | Address of the product importer |
| `street1`<br>string | street1 |
| `street2`<br>string | street2 |
| `city`<br>string | city<br>Required |
| `region`<br>string | region |
| `postal_code`<br>string | postal\_code |
| `country`<br>enum {AC, AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BQ, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CW, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KP, KR, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, SS, ST, SV, SX, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, XK, YE, YT, ZA, ZM, ZW} | country<br>Required |
| `importer_name`<br>string | Name of the product Importer |
| `inventory`<br>int64 | Inventory count for the product item |
| `ios_app_name`<br>string | The name of the app (suitable for display) |
| `ios_app_store_id`<br>int64 | The app ID for the App Store |
| `ios_url`<br>string | A custom scheme for the iOS app |
| `ipad_app_name`<br>string | The name of the app (suitable for display) |
| `ipad_app_store_id`<br>int64 | The app ID for the App Store |
| `ipad_url`<br>string | A custom scheme for the iPhone app |
| `iphone_app_name`<br>string | The name of the app (suitable for display) |
| `iphone_app_store_id`<br>int64 | The app ID for the App Store |
| `iphone_url`<br>string | A custom scheme for the iPhone app |
| `manufacturer_info`<br>string | The Manufacturer Information such as Name, address, etc... |
| `manufacturer_part_number`<br>string | Manufacturer's ID for the product item |
| `marked_for_product_launch`<br>enum{default, marked, not\_marked} | Whether this product should be marked for a product launch and hide it from shops until product launch is created with this product. |
| `material`<br>string | Material of the product item<br>Max size: 200 |
| `mobile_link`<br>URI | Link to a mobile-optimized external product page |
| `name`<br>string | Name/title of the product item<br>RequiredSupports Emoji |
| `ordering_index`<br>int64 | Index used for ordering items within a group |
| `origin_country`<br>enum {AC, AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BQ, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CW, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KP, KR, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, SS, ST, SV, SX, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, XK, YE, YT, ZA, ZM, ZW} | Product Country of Origin |
| `pattern`<br>string | Pattern of the product item |
| `price`<br>int64 | Price of the item with 2 digits added for cents (ex: use "100" for 1 or "599" for 5.99)<br>Required |
| `product_priority_1`<br>float | product\_priority\_1 |
| `product_priority_2`<br>float | product\_priority\_2 |
| `product_priority_3`<br>float | product\_priority\_3 |
| `product_priority_4`<br>float | product\_priority\_4 |
| `product_type`<br>string | Retailer defined category of the product item. Max size: 750 |
| `retailer_id`<br>string | A unique identifier for this item (which can be a variant for a product). This field is required. |
| `retailer_product_group_id`<br>string | Item group ID that this product is a variant of |
| `return_policy_days`<br>int64 | return\_policy\_days |
| `sale_price`<br>int64 | Sale price of the item with 2 digits added for cents (ex: use "100" for 1 or "599" for 5.99) |
| `sale_price_end_date`<br>datetime | Date when the sale price ends |
| `sale_price_start_date`<br>datetime | Date when the sale price starts |
| `short_description`<br>string | A brief description of the product |
| `size`<br>string | Size of the product item |
| `start_date`<br>string | Date when the product started to exist |
| `url`<br>URI | URL of the product item |
| `visibility`<br>enum{staging, published} | Default value: `published`<br>Visibility of the product item |
| `wa_compliance_category`<br>enum {DEFAULT, COUNTRY\_ORIGIN\_EXEMPT} | wa\_compliance\_category |
| `windows_phone_app_id`<br>string | The app ID (a GUID) for app store |
| `windows_phone_app_name`<br>string | The name of the app (suitable for display) |
| `windows_phone_url`<br>string | A custom scheme for the Windows Phone app |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node represented by `id` in the return type.

Struct {

`id`: numeric string,

}

### Error Codes

| Error | Description |
| --- | --- |
| 10800 | Duplicate retailer\_id when attempting to create a store collection |
| 100 | Invalid parameter |
| 200 | Permissions error |
| 10801 | Either "file" or "url" must be specified |

## Updating

You can update a [ProductItem](https://developers.facebook.com/docs/marketing-api/reference/product-item/) by making a POST request to [`/{product_item_id}`](https://developers.facebook.com/docs/marketing-api/reference/product-item/).

### Parameters

| Parameter | Description |
| --- | --- |
| `additional_image_urls`<br>list<URL> | Additional product image URLs |
| `additional_variant_attributes`<br>JSON object {string : string} | Additional attributes to distinguish the product in its variant group (ex: {"Scent" : "Fruity", "Style" : "Classic"}) |
| `age_group`<br>enum {adult, all ages, infant, kids, newborn, teen, toddler} | The age group that the item is targeted towards |
| `android_app_name`<br>string | The name of the app (suitable for display) |
| `android_class`<br>string | A fully-qualified Activity class name for intent generation |
| `android_package`<br>string | A fully-qualified package name for intent generation |
| `android_url`<br>string | A custom scheme for the Android app |
| `availability`<br>enum{in stock, out of stock, preorder, available for order, discontinued, pending, mark\_as\_sold, mark\_as\_expired} | Availability of the product item |
| `brand`<br>string | Brand of the product item |
| `category`<br>string | Category of the product item |
| `category_specific_fields`<br>JSON object | JSON object containing category specific fields |
| `item_sub_type`<br>enum {APPLIANCES, BABY\_FEEDING, BABY\_TRANSPORT, BEAUTY, BEDDING, CAMERAS, CELL\_PHONES\_AND\_SMART\_WATCHES, CLEANING\_SUPPLIES, CLOTHING, CLOTHING\_ACCESSORIES, COMPUTERS\_AND\_TABLETS, DIAPERING\_AND\_POTTY\_TRAINING, ELECTRONICS\_ACCESSORIES, FURNITURE, HEALTH, HOME\_GOODS, JEWELRY, NURSERY, PRINTERS\_AND\_SCANNERS, PROJECTORS, SHOES\_AND\_FOOTWEAR, SOFTWARE, TOYS, TVS\_AND\_MONITORS, VIDEO\_GAME\_CONSOLES\_AND\_VIDEO\_GAMES, WATCHES} | Default value: `"EMPTY"`<br>item\_sub\_type |
| `checkout_url`<br>URL | URL to add product item to cart and directly to checkout |
| `color`<br>string | Color of the product item |
| `commerce_tax_category`<br>enum{FB\_ANIMAL, FB\_ANIMAL\_SUPP, FB\_APRL, FB\_APRL\_ACCESSORIES, FB\_APRL\_ATHL\_UNIF, FB\_APRL\_CASES, FB\_APRL\_CLOTHING, FB\_APRL\_COSTUME, FB\_APRL\_CSTM, FB\_APRL\_FORMAL, FB\_APRL\_HANDBAG, FB\_APRL\_JEWELRY, FB\_APRL\_SHOE, FB\_APRL\_SHOE\_ACC, FB\_APRL\_SWIM, FB\_APRL\_SWIM\_CHIL, FB\_APRL\_SWIM\_CVR, FB\_ARTS, FB\_ARTS\_HOBBY, FB\_ARTS\_PARTY, FB\_ARTS\_PARTY\_GIFT\_CARD, FB\_ARTS\_TICKET, FB\_BABY, FB\_BABY\_BATH, FB\_BABY\_BLANKET, FB\_BABY\_DIAPER, FB\_BABY\_GIFT\_SET, FB\_BABY\_HEALTH, FB\_BABY\_NURSING, FB\_BABY\_POTTY\_TRN, FB\_BABY\_SAFE, FB\_BABY\_TOYS, FB\_BABY\_TRANSPORT, FB\_BABY\_TRANSPORT\_ACC, FB\_BAGS, FB\_BAGS\_BKPK, FB\_BAGS\_BOXES, FB\_BAGS\_BRFCS, FB\_BAGS\_CSMT\_BAG, FB\_BAGS\_DFFL, FB\_BAGS\_DIPR, FB\_BAGS\_FNNY, FB\_BAGS\_GRMT, FB\_BAGS\_LUG\_ACC, FB\_BAGS\_LUGG, FB\_BAGS\_MSGR, FB\_BAGS\_TOTE, FB\_BAGS\_TRN\_CAS, FB\_BLDG, FB\_BLDG\_ACC, FB\_BLDG\_CNSMB, FB\_BLDG\_FENCE, FB\_BLDG\_FUEL\_TNK, FB\_BLDG\_HT\_VNT, FB\_BLDG\_LOCK, FB\_BLDG\_MATRL, FB\_BLDG\_PLMB, FB\_BLDG\_PUMP, FB\_BLDG\_PWRS, FB\_BLDG\_S\_ENG, FB\_BLDG\_STR\_TANK, FB\_BLDG\_TL\_ACC, FB\_BLDG\_TOOL, FB\_BUSIND, FB\_BUSIND\_ADVERTISING, FB\_BUSIND\_AGRICULTURE, FB\_BUSIND\_AUTOMATION, FB\_BUSIND\_HEAVY\_MACH, FB\_BUSIND\_LAB, FB\_BUSIND\_MEDICAL, FB\_BUSIND\_RETAIL, FB\_BUSIND\_SANITARY\_CT, FB\_BUSIND\_SIGN, FB\_BUSIND\_STORAGE, FB\_BUSIND\_STORAGE\_ACC, FB\_BUSIND\_WORK\_GEAR, FB\_CAMERA\_ACC, FB\_CAMERA\_CAMERA, FB\_CAMERA\_OPTIC, FB\_CAMERA\_OPTICS, FB\_CAMERA\_PHOTO, FB\_ELEC, FB\_ELEC\_ACC, FB\_ELEC\_ARCDADE, FB\_ELEC\_AUDIO, FB\_ELEC\_CIRCUIT, FB\_ELEC\_COMM, FB\_ELEC\_COMPUTER, FB\_ELEC\_GPS\_ACC, FB\_ELEC\_GPS\_NAV, FB\_ELEC\_GPS\_TRK, FB\_ELEC\_MARINE, FB\_ELEC\_NETWORK, FB\_ELEC\_PART, FB\_ELEC\_PRINT, FB\_ELEC\_RADAR, FB\_ELEC\_SFTWR, FB\_ELEC\_SPEED\_RDR, FB\_ELEC\_TELEVISION, FB\_ELEC\_TOLL, FB\_ELEC\_VID\_GM\_ACC, FB\_ELEC\_VID\_GM\_CNSL, FB\_ELEC\_VIDEO, FB\_FOOD, FB\_FURN, FB\_FURN\_BABY, FB\_FURN\_BENCH, FB\_FURN\_CART, FB\_FURN\_CHAIR, FB\_FURN\_CHAIR\_ACC, FB\_FURN\_DIVIDE, FB\_FURN\_DIVIDE\_ACC, FB\_FURN\_ENT\_CTR, FB\_FURN\_FUTN, FB\_FURN\_FUTN\_PAD, FB\_FURN\_OFFICE, FB\_FURN\_OFFICE\_ACC, FB\_FURN\_OTTO, FB\_FURN\_OUTDOOR, FB\_FURN\_OUTDOOR\_ACC, FB\_FURN\_SETS, FB\_FURN\_SHELVE\_ACC, FB\_FURN\_SHLF, FB\_FURN\_SOFA, FB\_FURN\_SOFA\_ACC, FB\_FURN\_STORAGE, FB\_FURN\_TABL, FB\_FURN\_TABL\_ACC, FB\_GENERIC\_TAXABLE, FB\_HLTH, FB\_HLTH\_HLTH, FB\_HLTH\_JWL\_CR, FB\_HLTH\_LILP\_BLM, FB\_HLTH\_LTN\_SPF, FB\_HLTH\_PRSL\_CR, FB\_HLTH\_SKN\_CR, FB\_HMGN, FB\_HMGN\_BATH, FB\_HMGN\_DCOR, FB\_HMGN\_EMGY, FB\_HMGN\_FPLC, FB\_HMGN\_FPLC\_ACC, FB\_HMGN\_GS\_SFT, FB\_HMGN\_HS\_ACC, FB\_HMGN\_HS\_APP, FB\_HMGN\_HS\_SPL, FB\_HMGN\_KTCN, FB\_HMGN\_LAWN, FB\_HMGN\_LGHT, FB\_HMGN\_LINN, FB\_HMGN\_LT\_ACC, FB\_HMGN\_OTDR, FB\_HMGN\_POOL, FB\_HMGN\_SCTY, FB\_HMGN\_SMK\_ACC, FB\_HMGN\_UMBR, FB\_HMGN\_UMBR\_ACC, FB\_MDIA, FB\_MDIA\_BOOK, FB\_MDIA\_DVDS, FB\_MDIA\_MAG, FB\_MDIA\_MANL, FB\_MDIA\_MUSC, FB\_MDIA\_PRJ\_PLN, FB\_MDIA\_SHT\_MUS, FB\_OFFC, FB\_OFFC\_BKAC, FB\_OFFC\_CRTS, FB\_OFFC\_DSKP, FB\_OFFC\_EQIP, FB\_OFFC\_FLNG, FB\_OFFC\_GNRL, FB\_OFFC\_INSTM, FB\_OFFC\_LP\_DSK, FB\_OFFC\_MATS, FB\_OFFC\_NM\_PLT, FB\_OFFC\_PPR\_HNDL, FB\_OFFC\_PRSNT\_SPL, FB\_OFFC\_SEALR, FB\_OFFC\_SHIP\_SPL, FB\_RLGN, FB\_RLGN\_CMNY, FB\_RLGN\_ITEM, FB\_RLGN\_WEDD, FB\_SFTWR, FB\_SFWR\_CMPTR, FB\_SFWR\_DGTL\_GD, FB\_SFWR\_GAME, FB\_SHIPPING, FB\_SPOR, FB\_SPORT\_ATHL, FB\_SPORT\_ATHL\_CLTH, FB\_SPORT\_ATHL\_SHOE, FB\_SPORT\_ATHL\_SPRT, FB\_SPORT\_EXRCS, FB\_SPORT\_INDR\_GM, FB\_SPORT\_OTDR\_GM, FB\_TOYS, FB\_TOYS\_EQIP, FB\_TOYS\_GAME, FB\_TOYS\_PZZL, FB\_TOYS\_TMRS, FB\_TOYS\_TOYS, FB\_VEHI, FB\_VEHI\_PART} | Commerce tax category |
| `condition`<br>enum{new, refurbished, used, used\_like\_new, used\_good, used\_fair, cpo, open\_box\_new} | The condition of the product item |
| `currency`<br>ISO 4217 Currency Code | Currency for the product item |
| `custom_data`<br>dictionary { string : <string> } | Key value pair used to store extra data to differentiate variants. Example {"Scent" : "Fruity", "Style" : "Classic"} |
| `custom_label_0`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_1`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_2`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_3`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `custom_label_4`<br>string | An optional custom label to associate with the product item. Max size: 100 |
| `description`<br>string | Description of the product item. Max size: 5000<br>Supports Emoji |
| `expiration_date`<br>string | Item's expiration date (YYYY-MM-DD) |
| `fb_product_category`<br>string | Facebook product category for the item |
| `gender`<br>enum{female, male, unisex} | Gender the product item is targeted towards |
| `gtin`<br>string | Global trade ID of the product item |
| `image_url`<br>URI | URL of the product image |
| `importer_address`<br>JSON object | Product importer address |
| `street1`<br>string | street1 |
| `street2`<br>string | street2 |
| `city`<br>string | city |
| `region`<br>string | region |
| `postal_code`<br>string | postal\_code |
| `country`<br>enum {AC, AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BQ, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CW, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KP, KR, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, SS, ST, SV, SX, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, XK, YE, YT, ZA, ZM, ZW} | country |
| `importer_name`<br>string | Product importer name |
| `inventory`<br>int64 | Inventory count for the product item |
| `ios_app_name`<br>string | The name of the app (suitable for display) |
| `ios_app_store_id`<br>int64 | The app ID for the App Store |
| `ios_url`<br>string | A custom scheme for the iOS app |
| `ipad_app_name`<br>string | The name of the app (suitable for display) |
| `ipad_app_store_id`<br>int64 | The app ID for the App Store |
| `ipad_url`<br>string | A custom scheme for the iPhone app |
| `iphone_app_name`<br>string | The name of the app (suitable for display) |
| `iphone_app_store_id`<br>int64 | The app ID for the App Store |
| `iphone_url`<br>string | A custom scheme for the iPhone app |
| `launch_date`<br>string | Launch Date of product in ISO 8061 format (YYYY-MM-DDTHH:MM:SS+HH:MM) |
| `live_special_price`<br>string | A special price for the product item during a live video. The price has 2 digits added for cents (ex: use "100" for 1 or "599" for 5.99). The field accepts 0 as a value and also accepts the empty string (ex: "") to unset the live special price for the product item. |
| `manufacturer_info`<br>string | The Manufacturer Information such as Manufacturer name, address, etc... |
| `manufacturer_part_number`<br>string | Manufacturer's ID for the product item |
| `marked_for_product_launch`<br>enum{default, marked, not\_marked} | Whether this product should be marked for a product launch and hide it from shops until product launch is created with this product. |
| `material`<br>string | Material of the product item<br>Max size: 200 |
| `mobile_link`<br>URI | Link to a mobile-optimized external product page |
| `name`<br>string | Name/title of the product item<br>Supports Emoji |
| `ordering_index`<br>int64 | Index used for ordering items within a group |
| `origin_country`<br>enum {AC, AD, AE, AF, AG, AI, AL, AM, AN, AO, AQ, AR, AS, AT, AU, AW, AX, AZ, BA, BB, BD, BE, BF, BG, BH, BI, BJ, BL, BM, BN, BO, BQ, BR, BS, BT, BV, BW, BY, BZ, CA, CC, CD, CF, CG, CH, CI, CK, CL, CM, CN, CO, CR, CU, CV, CW, CX, CY, CZ, DE, DJ, DK, DM, DO, DZ, EC, EE, EG, EH, ER, ES, ET, FI, FJ, FK, FM, FO, FR, GA, GB, GD, GE, GF, GG, GH, GI, GL, GM, GN, GP, GQ, GR, GS, GT, GU, GW, GY, HK, HM, HN, HR, HT, HU, ID, IE, IL, IM, IN, IO, IQ, IR, IS, IT, JE, JM, JO, JP, KE, KG, KH, KI, KM, KN, KP, KR, KW, KY, KZ, LA, LB, LC, LI, LK, LR, LS, LT, LU, LV, LY, MA, MC, MD, ME, MF, MG, MH, MK, ML, MM, MN, MO, MP, MQ, MR, MS, MT, MU, MV, MW, MX, MY, MZ, NA, NC, NE, NF, NG, NI, NL, NO, NP, NR, NU, NZ, OM, PA, PE, PF, PG, PH, PK, PL, PM, PN, PR, PS, PT, PW, PY, QA, RE, RO, RS, RU, RW, SA, SB, SC, SD, SE, SG, SH, SI, SJ, SK, SL, SM, SN, SO, SR, SS, ST, SV, SX, SY, SZ, TC, TD, TF, TG, TH, TJ, TK, TL, TM, TN, TO, TR, TT, TV, TW, TZ, UA, UG, UM, US, UY, UZ, VA, VC, VE, VG, VI, VN, VU, WF, WS, XK, YE, YT, ZA, ZM, ZW} | Product country of origin |
| `pattern`<br>string | Pattern of the product item |
| `price`<br>int64 | Price of the item with 2 digits added for cents (ex: use "100" for 1 or "599" for 5.99) |
| `product_priority_0`<br>float | product\_priority\_0 |
| `product_priority_1`<br>float | product\_priority\_1 |
| `product_priority_2`<br>float | product\_priority\_2 |
| `product_priority_3`<br>float | product\_priority\_3 |
| `product_priority_4`<br>float | product\_priority\_4 |
| `product_type`<br>string | Retailer defined category of the product item. Max size: 750 |
| `retailer_id`<br>string | Retailer ID for a product item. (Internal only) |
| `return_policy_days`<br>int64 | Return policy days |
| `sale_price`<br>int64 | Sale price of the item with 2 digits added for cents (ex: use "100" for 1 or "599" for 5.99) |
| `sale_price_end_date`<br>datetime | Date when the sale price ends |
| `sale_price_start_date`<br>datetime | Date when the sale price starts |
| `short_description`<br>string | A brief description of the product |
| `size`<br>string | Size of the product item |
| `start_date`<br>string | Date when the product started to exist |
| `url`<br>URI | URL of the product item |
| `visibility`<br>enum{staging, published} | Visibility of the product item |
| `wa_compliance_category`<br>enum {DEFAULT, COUNTRY\_ORIGIN\_EXEMPT} | Product compliance category. Only for Whatsapp businesses in India |
| `windows_phone_app_id`<br>string | The app ID (a GUID) for app store |
| `windows_phone_app_name`<br>string | The name of the app (suitable for display) |
| `windows_phone_url`<br>string | A custom scheme for the Windows Phone app |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node to which you POSTed.

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 200 | Permissions error |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 190 | Invalid OAuth 2.0 Access Token |

## Deleting

You can delete a [ProductItem](https://developers.facebook.com/docs/marketing-api/reference/product-item/) by making a DELETE request to [`/{product_item_id}`](https://developers.facebook.com/docs/marketing-api/reference/product-item/).

### Parameters

This endpoint doesn't have any parameters.

### Return Type

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |
| 801 | Invalid operation |

On This Page

[Product Item](https://developers.facebook.com/docs/marketing-api/reference/product-item/#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/product-item/#Reading)

[Example](https://developers.facebook.com/docs/marketing-api/reference/product-item/#example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/product-item/#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/product-item/#fields)

[Edges](https://developers.facebook.com/docs/marketing-api/reference/product-item/#edges)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/product-item/#error-codes)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/product-item/#Creating)

[Example TSV feed](https://developers.facebook.com/docs/marketing-api/reference/product-item/#tsv)

[XML Example RSS](https://developers.facebook.com/docs/marketing-api/reference/product-item/#XML_RSS)

[XML Example ATOM](https://developers.facebook.com/docs/marketing-api/reference/product-item/#xmlatomfeed)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/product-item/#parameters-2)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/product-item/#return-type)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/product-item/#error-codes-2)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/product-item/#Updating)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/product-item/#parameters-3)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/product-item/#return-type-2)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/product-item/#error-codes-3)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/product-item/#Deleting)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/product-item/#parameters-4)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/product-item/#return-type-3)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/product-item/#error-codes-4)