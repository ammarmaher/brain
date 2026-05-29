---
url: https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/
title: Graph API Reference v25.0: Post Sharedposts
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fpost%2Fsharedposts%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Post Sharedposts](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#)

# Post Sharedposts

## Reading

PostSharedPosts

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bpost-id%7D%2Fsharedposts&version=v25.0)

```
GET /v25.0/{post-id}/sharedposts HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{post-id}/sharedposts',
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
    "/{post-id}/sharedposts",
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
    "/{post-id}/sharedposts",
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
                               initWithGraphPath:@"/{post-id}/sharedposts"\
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
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 190 | Invalid OAuth 2.0 Access Token |
| 2500 | Error parsing graph query |
| 100 | Invalid parameter |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Post Sharedposts](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/post/sharedposts/#Deleting)