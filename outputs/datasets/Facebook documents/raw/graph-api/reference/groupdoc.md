---
url: https://developers.facebook.com/docs/graph-api/reference/groupdoc/
title: Group Doc - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fv25.0%2Fgroupdoc%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Group Doc /{group-doc-id}](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#group-doc---group-doc-id-)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#read)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#readfields)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#publish)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#delete)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#update)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#)

# Group Doc `/{group-doc-id}`

Represents a doc within a Facebook group. The `/{group-doc-id}` node returns a single doc.

## Reading

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bgroup-doc-id%7D&version=v25.0)

```
GET /v25.0/{group-doc-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{group-doc-id}',
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
    "/{group-doc-id}",
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
    "/{group-doc-id}",
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
                               initWithGraphPath:@"/{group-doc-id}"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Fields

| Property Name | Description | Type |
| --- | --- | --- |
| `id` | The group doc ID. | `string` |
| `from` | The profile that created this doc. | [`User`](https://developers.facebook.com/docs/graph-api/reference/user/)`|` [`Page`](https://developers.facebook.com/docs/graph-api/reference/page/) |
| `subject` | The title of the doc. | `string` |
| `message` | The body of the doc. This string will contain HTML for any formatting in the doc, and will be HTML encoded. | `string` |
| `icon` | The URL for the doc's icon | `string` |
| `created_time` | When the doc was created. | `datetime` |
| `updated_time` | The last time the doc was changed. | `datetime` |
| `revision` | An ID representing the current doc revision. | `int` |
| `can_edit` | Whether the session user can edit this doc. | `boolean` |
| `can_delete` | Whether the session user can delete this doc (on Facebook.com). | `boolean` |
| `embedded_urls` | URLs for document embeds | `[string]` |

## Publishing

You cannot create docs via the Graph API.

## Deleting

You cannot delete docs via the Graph API.

## Updating

You cannot update docs via the Graph API.

On This Page

[Group Doc /{group-doc-id}](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#group-doc---group-doc-id-)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#read)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#readfields)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#publish)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#delete)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/groupdoc#update)