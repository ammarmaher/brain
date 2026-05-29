---
url: https://developers.facebook.com/docs/graph-api/reference/photo/likes/
title: /photo/likes
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fphoto%2Flikes%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Photo Likes](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#Reading)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#new-page-experience)

[Example](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#Creating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#)

# Photo Likes

Likes on a Photo

## Reading

Likes for this object

### New Page Experience

This endpoint is supported for [New Page Experience](https://developers.facebook.com/docs/pages/new-pages-experience/).

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bphoto-id%7D%2Flikes&version=v25.0)

```
GET /v25.0/{photo-id}/likes HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{photo-id}/likes',
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
    "/{photo-id}/likes",
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
    "/{photo-id}/likes",
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
                               initWithGraphPath:@"/{photo-id}/likes"\
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
    "paging": {},
    "summary": {}
}
```

#### `data`

A list of [Profile](https://developers.facebook.com/docs/graph-api/reference/profile/) nodes.

#### `paging`

For more details about pagination, see the [Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging).

#### `summary`

Aggregated information about the edge, such as counts. Specify the fields to fetch in the summary param (like `summary=total_count`).

| Field | Description |
| --- | --- |
| `total_count`<br>unsigned int32 | Total number of likes |
| `can_like`<br>bool | Can the viewer like |
| `has_liked`<br>bool | Has the viewer liked |

### Error Codes

| Error | Description |
| --- | --- |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |
| 104 | Incorrect signature |
| 100 | Invalid parameter |

## Creating

You can make a POST request to `likes` edge from the following paths:

- [`/{photo_id}/likes`](https://developers.facebook.com/docs/graph-api/reference/photo/likes/)

When posting to this edge, no Graph object will be created.

### Parameters

This endpoint doesn't have any parameters.

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node to which you POSTed.

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |
| 100 | Invalid parameter |
| 459 | The session is invalid because the user has been checkpointed |

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Photo Likes](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#Reading)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#new-page-experience)

[Example](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#Creating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/photo/likes/#Deleting)