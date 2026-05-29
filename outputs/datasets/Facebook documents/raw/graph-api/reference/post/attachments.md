---
url: https://developers.facebook.com/docs/graph-api/reference/post/attachments/
title: Graph API Reference v25.0: Post Attachments
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fpost%2Fattachments%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Post Attachments](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#Reading)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#new-page-experience)

[Example](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#)

# Post Attachments

## Reading

PostAttachments

### New Page Experience

This endpoint is supported for [New Page Experience](https://developers.facebook.com/docs/pages/new-pages-experience/).

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bpost-id%7D%2Fattachments&version=v25.0)

```
GET /v25.0/{post-id}/attachments HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{post-id}/attachments',
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
    "/{post-id}/attachments",
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
    "/{post-id}/attachments",
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
                               initWithGraphPath:@"/{post-id}/attachments"\
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

A list of [StoryAttachment](https://developers.facebook.com/docs/graph-api/reference/story-attachment/) nodes.

#### `paging`

For more details about pagination, see the [Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging).

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 190 | Invalid OAuth 2.0 Access Token |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Post Attachments](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#Reading)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#new-page-experience)

[Example](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/post/attachments/#Deleting)