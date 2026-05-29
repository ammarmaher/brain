---
url: https://developers.facebook.com/docs/graph-api/reference/video-poll-option/
title: Graph API Reference v25.0: Video Poll Option
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fvideo-poll-option%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Video Poll Option](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#Reading)

[Feature Permissions](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#feature-permissions)

[Example](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#)

# Video Poll Option

## Reading

Represents a single poll option that may be selected by the user

### Feature Permissions

| Name | Description |
| --- | --- |
| `Live Video API` | This is a required [feature permission](https://developers.facebook.com/docs/apps/review/feature/) |

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bvideo-poll-option-id%7D&version=v25.0)

```
GET /v25.0/{video-poll-option-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{video-poll-option-id}',
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
    "/{video-poll-option-id}",
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
    "/{video-poll-option-id}",
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
                               initWithGraphPath:@"/{video-poll-option-id}"\
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
| `id`<br>numeric string | Poll option ID<br>[Core](https://developers.facebook.com/docs/apps/versions/#coreextended) |
| `is_correct`<br>bool | True if this answer is considered correct, otherwise false |
| `order`<br>int32 | Options appear in increasing numerical order within a poll |
| `text`<br>string | Text to display to the user for this option<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `total_votes`<br>int32 | Total number of votes for this option |

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Video Poll Option](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#Reading)

[Feature Permissions](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#feature-permissions)

[Example](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/#Deleting)