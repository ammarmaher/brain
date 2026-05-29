---
url: https://developers.facebook.com/docs/graph-api/reference/link/
title: Link - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fv25.0%2Flink%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Link /{link-id}](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#link---link-id-)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#read)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#fields)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#publishing)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#updating)

[Edges](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#edges)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#)

# Link `/{link-id}`

A link shared on Facebook.

## Reading

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Blink-id%7D&version=v25.0)

```
GET /v25.0/{link-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{link-id}',
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
    "/{link-id}",
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
    "/{link-id}",
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
                               initWithGraphPath:@"/{link-id}"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Fields

| Name | Description | Type |
| --- | --- | --- |
| `id` | The link ID. | `string` |
| `created_time` | The time the message was published. | `datetime` |
| `description` | A description of the link (appears beneath the link caption). | `string` |
| `from` | The user that created the link. | [`User`](https://developers.facebook.com/docs/graph-api/reference/user) |
| `icon` | A URL to the link icon that Facebook displays in Feed. | `string` |
| `link` | The URL that was shared. | `string` |
| `message` | The optional message from the user about this link. | `string` |
| `name` | The name of the link. | `string` |
| `picture` | A URL to the thumbnail image used in the link post | `string` |
| `reactions`<br>Deprecated in v8.0+. | Reactions, LIKE, LOVE, WOW, HAHA, SORRY, ANGRY, NONE, to a link. | `string` |

## Publishing

Please use the [Sharing documentation](https://developers.facebook.com/docs/sharing/) to publish.

## Updating

You can't update a link using the Graph API.

## Edges

| Name | Description |
| --- | --- |
| [`/likes`](https://developers.facebook.com/docs/graph-api/reference/object/likes) | People who like this link. |
| [`/comments`](https://developers.facebook.com/docs/graph-api/reference/object/comments) | Comments on this link. |

On This Page

[Link /{link-id}](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#link---link-id-)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#read)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#fields)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#publishing)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#updating)

[Edges](https://developers.facebook.com/docs/graph-api/reference/v25.0/link#edges)