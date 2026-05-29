---
url: https://developers.facebook.com/docs/graph-api/reference/event/photos/
title: /event/photos
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fevent%2Fphotos%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[/event/photos](https://developers.facebook.com/docs/graph-api/reference/event/photos)

On This Page

[Graph API Reference /{event-id}/photos](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#graph-api-reference---event-id--photos)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#read)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#readperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#readfields)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#publish)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#pubperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#pubfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#pubresponse)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#delete)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#updatepost)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#)

# Graph API Reference [`/{event-id}`](https://developers.facebook.com/docs/graph-api/reference/event/)`/photos`

All the photos uploaded to an event's wall.

## Reading

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bevent-id%7D%2Fphotos&version=v25.0)

```
GET /v25.0/{event-id}/photos HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{event-id}/photos',
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
    "/{event-id}/photos",
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
    "/{event-id}/photos",
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
                               initWithGraphPath:@"/{event-id}/photos"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Permissions

- A user access token is required.


### Fields

An array of [Photo objects](https://developers.facebook.com/docs/graph-api/reference/photo).

## Publishing

There are two separate ways of publishing photos to Facebook:

1. Capture a photo via file upload as `multipart/form-data` then use the `source` parameter:

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK

```
POST /v25.0/{event-id}/photos HTTP/1.1
Host: graph.facebook.com

source=%7Bimage-data%7D
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->post(
    '/{event-id}/photos',
    array (
      'source' => '{image-data}',
    ),
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
    "/{event-id}/photos",
    "POST",
    {
        "source": "{image-data}"
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
params.putString("source", "{image-data}");
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{event-id}/photos",
    params,
    HttpMethod.POST,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
NSDictionary *params = @{
  @"source": @"{image-data}",
};
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{event-id}/photos"\
                                      parameters:params\
                                      HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

1. Use a photo that is already on the internet by publishing using the `url` parameter:

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK

```
POST /v25.0/{event-id}/photos HTTP/1.1
Host: graph.facebook.com

url=%7Bimage-url%7D
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->post(
    '/{event-id}/photos',
    array (
      'url' => '{image-url}',
    ),
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
    "/{event-id}/photos",
    "POST",
    {
        "url": "{image-url}"
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
params.putString("url", "{image-url}");
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{event-id}/photos",
    params,
    HttpMethod.POST,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
NSDictionary *params = @{
  @"url": @"{image-url}",
};
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{event-id}/photos"\
                                      parameters:params\
                                      HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Permissions

- A user access token with `publish_actions` permission can be used to publish new photos.


### Fields

| Name | Description | Type |
| --- | --- | --- |
| `source` | The photo, [encoded as form data](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml401%2Finteract%2Fforms.html%23h-17.13.4.2&h=AUB8ds_bvHDJXWRuYE1DEcyPECG5SmMD391GawKGSeNu0J1aAVd82KA-DKytkt_738HPOcd7COH-EMSy8-6UpAtSP8QC-gsZ75hSzP5Up_muh22UtSeH6M7XakjydCDSaQqdGnRavzfWuA). Either this or `url` field is required, but both should not be used together. | [`multipart/form-data`](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml401%2Finteract%2Fforms.html%23h-17.13.4.2&h=AUDmyETpOCJ2vRy22aHDZl4ARHrtVIkHFRL61SWBhLq37CxGcRkRYC4Ovoq_-nOUMjowzSJqFLoTjNnz4iVOSUn2YR8_L_4RJAem2be30brHg7xyWRj9nJ9ApuuO09zVO8mbnVGkIk1C_g) |
| `url` | The URL of a photo that is already uploaded to the internet. Either this or `source` is required, but both should not be used together. | `string` |
| `message` | The description of the photo, used as the accompanying status message in any feed story. | `string` |

### Response

If successful:

| Name | Description | Type |
| --- | --- | --- |
| `id` | The newly created photo ID | `string` |

## Deleting

You can't delete using this edge, however you can [delete each photo using the /{photo-id} node](https://developers.facebook.com/docs/reference/api/photo/).

## Updating

You can't update using this edge.

On This Page

[Graph API Reference /{event-id}/photos](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#graph-api-reference---event-id--photos)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#read)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#readperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#readfields)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#publish)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#pubperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#pubfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#pubresponse)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#delete)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/photos#updatepost)