---
url: https://developers.facebook.com/docs/graph-api/reference/insights-range-value/
title: Graph API Reference v25.0: Insights Range Value
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Finsights-range-value%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Insights Range Value](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#fields)

[Creating](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#)

# Insights Range Value

## Reading

InsightsRangeValue

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=...%3Ffields%3D%257Bfieldname_of_type_InsightsRangeValue%257D&version=v25.0)

```
GET v25.0/...?fields={fieldname_of_type_InsightsRangeValue} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '...?fields={fieldname_of_type_InsightsRangeValue}',
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
    "...?fields={fieldname_of_type_InsightsRangeValue}",
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
    "...?fields={fieldname_of_type_InsightsRangeValue}",
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
                               initWithGraphPath:@"...?fields={fieldname_of_type_InsightsRangeValue}"\
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
| `lower_bound`<br>numeric string | The lower bound of the ads performance data.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `upper_bound`<br>numeric string | The upper bound of the ads performance data.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Insights Range Value](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#fields)

[Creating](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/#Deleting)