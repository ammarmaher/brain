---
url: https://developers.facebook.com/docs/graph-api/reference/user/feed/
title: Graph API Reference v25.0: User Feed
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fuser%2Ffeed%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[User Feed](https://developers.facebook.com/docs/graph-api/reference/user/feed/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/user/feed/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/user/feed/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/user/feed/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/user/feed/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/user/feed/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/user/feed/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/user/feed/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/user/feed/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/user/feed/#)

# User Feed

## Reading

The posts and links published by this person or others on their profile

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Buser-id%7D%2Ffeed&version=v25.0)

```
GET /v25.0/{user-id}/feed HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{user-id}/feed',
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
    "/{user-id}/feed",
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
    "/{user-id}/feed",
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
                               initWithGraphPath:@"/{user-id}/feed"\
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

Reading from this edge will return a JSON formatted result:

```
{
    "data": [],
    "paging": {}
}
```

#### `data`

A list of [Post](https://developers.facebook.com/docs/graph-api/reference/post/) nodes.

#### `paging`

For more details about pagination, see the [Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging).

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 190 | Invalid OAuth 2.0 Access Token |
| 200 | Permissions error |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 104 | Incorrect signature |
| 2500 | Error parsing graph query |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[User Feed](https://developers.facebook.com/docs/graph-api/reference/user/feed/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/user/feed/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/user/feed/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/user/feed/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/user/feed/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/user/feed/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/user/feed/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/user/feed/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/user/feed/#Deleting)