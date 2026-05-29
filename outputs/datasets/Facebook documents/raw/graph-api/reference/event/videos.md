---
url: https://developers.facebook.com/docs/graph-api/reference/event/videos/
title: Graph API Reference /event/videos
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fv25.0%2Fevent%2Fvideos%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API Reference /event/videos](https://developers.facebook.com/docs/graph-api/reference/event/videos)

On This Page

[Event Videos /{event-id}/videos](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#event-videos---event-id--videos)

[Creating](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#create)

[Limitations](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#limits)

[Supported Formats](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#formats)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#permissions)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#pubfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#pubresponse)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#reading)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#updatepost)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#delete)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#)

This edge has been deprecated and can no longer be used.

# Event Videos [`/{event-id}`](https://developers.facebook.com/docs/graph-api/reference/event/)`/videos`

Use this endpoint to publish videos to an event. To delete or update an existing video, use the `/{video-id}` node instead.

## Creating

To publish a video to an event, send a `POST` request to the `/{event-id}/videos` edge on `graph-video.facebook.com`.

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK

```
POST /v25.0/{event-id}/videos HTTP/1.1
Host: graph-video.facebook.com

source=%7Bvideo-data%7D
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->post(
    '/{event-id}/videos',
    array (
      'source' => '{video-data}',
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
    "/{event-id}/videos",
    "POST",
    {
        "source": "{video-data}"
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
params.putString("source", "{video-data}");
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{event-id}/videos",
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
  @"source": @"{video-data}",
};
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{event-id}/videos"\
                                      parameters:params\
                                      HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Limitations

- Videos must be encoded as [`multipart/form-data`](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml401%2Finteract%2Fforms.html%23h-17.13.4.2&h=AUDXK_kFt-wXTZT5Zwn4f4HhjTyS6WLDrbYZc_GwAwasavIhrsHjda0id08Fps2cburCGIaNRWnYjVAQJH8ifpn2Pj5oYHZriCjxeZoegDAH8IuPizkwkLaYp8nKLEaOByIdq9nr3dxZ1w).

- If you upload a video with a multi-part HTTP request or by providing a URL to a video, the video cannot exceed **1 GB** in size and **20 minutes** in duration.

- Resumable video uploads can be up to **1.75GB** and **45 minutes** in duration.


### Supported Formats

3g2, 3gp, 3gpp, asf, avi, dat, divx, dv, f4v, flv, m2ts, m4v, mkv, mod, mov, mp4, mpe, mpeg, mpeg4, mpg, mts, nsv, ogm, ogv, qt, tod, ts, vob, wmv.

### Permissions

As of April 24,2018, the `pubish_actions` permission has been removed. Please see the [Breaking Changes Changelog](https://developers.facebook.com/docs/graph-api/changelog/breaking-changes#login-4-24) for more details. To provide a way for your app users to share content to Facebook, we encourage you to use our [Sharing products](https://developers.facebook.com/docs/sharing) instead.

This endpoint requires a user access token with the `publish_actions` permission.

### Fields

| Name | Description | Type |
| --- | --- | --- |
| `id` | The target ID where the video is posted to. | `numeric string` |
| `title` | The title of the video. | `string` |
| `description` | The description of the video, used as the accompanying status message in any feed story. This parameter can contain mentions of other Facebook Pages using the following syntax:<br>```code<br>@[page-id]<br>```<br>For example the following description would mention the [Facebook Developers](https://www.facebook.com/FacebookDevelopers) page inline:<br>```code<br>Test message @[19292868552] tag<br>```<br>Usage of this feature is [subject to review](https://developers.facebook.com/docs/apps/review) but by using Pages you are an admin of (both to make the API call, and to be used in a mention), and an app you are a developer of, you can test it for yourself before review. | `string` |
| `source` | The video, [encoded as form data](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml401%2Finteract%2Fforms.html%23h-17.13.4.2&h=AUCqs0cW6_zZ_Ow2H-tA-R4KP-5XdVyXUcC0drseeWV8V3rG1QnoIAJtcT1wZ3sfznfYW1ZQfrEl1Esa9kDzUMxOF_xg6Dq9Xmc7kQg-Erceajm9lzImkXwHcM9xw8Dy8EjC_n47azU6ew). This field is required. | [`multipart/form-data`](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml401%2Finteract%2Fforms.html%23h-17.13.4.2&h=AUDuSZhYnUduxumo3Y9HDIibKct2gZRTjOqQVSqfKY4WI2n6pI1R1zBnkwPHBk4aBkNc9JTEzgw1SIkyp1tiT67NdNFp8EiQcpmuqmTfOh1AvR1QoOqGe3mFS_SySDFeSKCiNI0zKi44iQ) |
| `file_url` | Accessible URL of a video file. Cannot be used with `upload_phase`. | `string` |
| `thumb` | The video thumbnail raw data to be uploaded and associated with a video. | `image` |
| `upload_phase` | Type of chunked upload request. | `enum{start, transfer, finish}` |
| `file_size` | The size of the entire video file in bytes. | `unsigned int32` |
| `start_offset` | Start byte position of the file chunk. | `unsigned int32` |
| `video_file_chunk` | The video file chunk, [encoded as form data](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml401%2Finteract%2Fforms.html%23h-17.13.4.2&h=AUCGP399aEUGTdRhYf4aEGKwIEycvq46-lB1gZykseBhMCnjqAvd_icY8OI6kx0l7SPRMdawoSxldctZKfW4ClBTCYuWMW43IISudFDCGUxSOOo2GqLZ4LLrSAuh889vd4JhgIzMTaC2cQ). This field is required during `transfer` upload phase. | `multipart/form-data` |
| `upload_session_id` | ID of the chunked upload session. | `numeric string` |

### Response

If successful:

```code
Struct {
  id: numeric string,
  upload_session_id: numeric string,
  video_id: numeric string,
  start_offset: numeric string,
  end_offset: numeric string,
  success: bool,
  skip_upload: bool,
}
```

## Reading

You can't read the videos uploaded to an event using this edge.

## Updating

You can't update using this edge.

## Deleting

You can't delete using this edge.

On This Page

[Event Videos /{event-id}/videos](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#event-videos---event-id--videos)

[Creating](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#create)

[Limitations](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#limits)

[Supported Formats](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#formats)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#permissions)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#pubfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#pubresponse)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#reading)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#updatepost)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/event/videos#delete)