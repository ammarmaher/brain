---
url: https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer
title: Graph API Reference v25.0: Ad Creative Ad Disclaimer
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmarketing-api%2Freference%2Fad-creative-ad-disclaimer%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Ad Creative Ad Disclaimer](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#Reading)

[Example](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#fields)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#Creating)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#Updating)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#)

# Ad Creative Ad Disclaimer

## Reading

Disclaimer information to attach to your ad creative. When using disclaimers:
\- title is required
\- at least one of text or url is required.

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=...%3Ffields%3D%257Bfieldname_of_type_AdCreativeAdDisclaimer%257D&version=v25.0)

```
GET v25.0/...?fields={fieldname_of_type_AdCreativeAdDisclaimer} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '...?fields={fieldname_of_type_AdCreativeAdDisclaimer}',
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
    "...?fields={fieldname_of_type_AdCreativeAdDisclaimer}",
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
    "...?fields={fieldname_of_type_AdCreativeAdDisclaimer}",
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
                               initWithGraphPath:@"...?fields={fieldname_of_type_AdCreativeAdDisclaimer}"\
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

This endpoint doesn't have any parameters.

### Fields

| Field | Description |
| --- | --- |
| `text`<br>string | Text description of your disclaimer.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `title`<br>string | Title of the disclaimer on your ad. Can only be one of the following values: 'health\_disclaimer', 'important\_safety\_information', 'medication\_guide', 'offer\_details', 'prescribing\_information', 'terms\_and\_conditions'<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `url`<br>string | Link for your disclaimer.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Ad Creative Ad Disclaimer](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#Reading)

[Example](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#fields)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#Creating)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#Updating)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer#Deleting)