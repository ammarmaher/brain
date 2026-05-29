---
url: https://developers.facebook.com/docs/graph-api/reference/event/picture/
title: /event/picture
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fv25.0%2Fevent%2Fpicture%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[/event/picture](https://developers.facebook.com/docs/graph-api/reference/event/picture)

On This Page

[/{event-id}/picture](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#--event-id--picture)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#read)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#readperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#readfields)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#publish)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#delete)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#)

# [`/{event-id}`](https://developers.facebook.com/docs/graph-api/reference/event/)`/picture`

An event's cover photo with profile picture dimensions.

## Reading

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bevent-id%7D%2Fpicture&version=v25.0)

```
GET /v25.0/{event-id}/picture HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{event-id}/picture',
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
    "/{event-id}/picture",
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
    "/{event-id}/picture",
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
                               initWithGraphPath:@"/{event-id}/picture"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Permissions

- A user access token is required to retrieve the cover photo of any events visible to that person.


#### Modifiers

| Name | Description | Type |
| --- | --- | --- |
| `redirect` | The `picture` edge is a special case, as when requested, it will by default return the picture itself and not a JSON response. To return a JSON response, you need to set `redirect=false` as a request attribute. This is how to return the [fields below](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#readfields). | `bool` |
| `type` | You can use this to get a pre-specified size of picture. | `enum{small, normal, large, square}` |

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK

```
GET /v25.0/{event-id}/picture?redirect=0&type=normal HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{event-id}/picture?redirect=0&type=normal',
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
    "/{event-id}/picture",
    {
        "redirect": false,
        "type": "normal"
    },
    function (response) {
      if (response && !response.error) {
        /* handle the result */
      }
    }
);
```

```
Bundle params = new Bundle();
params.putBoolean("redirect", false);
params.putString("type", "normal");
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{event-id}/picture",
    params,
    HttpMethod.GET,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
NSDictionary *params = @{
  @"redirect": @NO,
  @"type": @"normal",
};
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{event-id}/picture"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Fields

| Parameter | Description | Type |
| --- | --- | --- |
| `url` | The URL of the profile photo. Only returned when `redirect` is `false`. | `string` |
| `is_silhouette` | Indicates if the photo hasn't been customised and is the default icon. Only returned when `redirect` is `false`. | `boolean` |

## Publishing

You can't publish an event cover photo using the Graph API.

## Deleting

You can't delete an event cover photo using the Graph API.

On This Page

[/{event-id}/picture](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#--event-id--picture)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#read)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#readperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#readfields)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#publish)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/picture#delete)