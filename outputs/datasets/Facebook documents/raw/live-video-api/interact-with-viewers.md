---
url: https://developers.facebook.com/docs/live-video-api/interact-with-viewers
title: Interact with viewers - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Finteract-with-viewers%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Live Video API](https://developers.facebook.com/docs/live-video-api)

- [Overview](https://developers.facebook.com/docs/live-video-api/overview)
- [Get Started](https://developers.facebook.com/docs/live-video-api/getting-started)
- [Broadcast a video](https://developers.facebook.com/docs/live-video-api/guides/streaming)
- [Schedule a video](https://developers.facebook.com/docs/live-video-api/guides/scheduling)
- [Create a Backup Stream](https://developers.facebook.com/docs/live-video-api/backup_stream)
- [Crosspost a video](https://developers.facebook.com/docs/live-video-api/guides/crossposting)
- [Target an Audience](https://developers.facebook.com/docs/live-video-api/audience-targeting)
- [Interact with viewers](https://developers.facebook.com/docs/live-video-api/interact-with-viewers)
- [Poll viewers](https://developers.facebook.com/docs/live-video-api/polls)
- [Speed Test](https://developers.facebook.com/docs/live-video-api/guides/speed-test)
- [Automatic Encoder Configuration API](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api)
- [Copyrighted Content](https://developers.facebook.com/docs/live-video-api/guides/copyrighted-content)
- [Best Practices](https://developers.facebook.com/docs/live-video-api/best-practices)
- [Support](https://developers.facebook.com/docs/live-video-api/support)
- [Reference](https://developers.facebook.com/docs/live-video-api/reference)
- [Changelog](https://developers.facebook.com/docs/live-video-api/changelog)

On This Page

[Interacting with Viewers](https://developers.facebook.com/docs/live-video-api/interact-with-viewers#interacting-with-viewers)

[Getting Current Comments and Reactions](https://developers.facebook.com/docs/live-video-api/interact-with-viewers#getting-current-comments-and-reactions)

[Receiving Real-time Comments and Reactions](https://developers.facebook.com/docs/live-video-api/interact-with-viewers#receiving-real-time-comments-and-reactions)

# Interacting with Viewers

You can use the Live Video API to get comments and reactions on live video broadcasts so that video producers and on-air talent can interact with viewers. You can do this by periodically querying the [LiveVideo](https://developers.facebook.com/docs/graph-api/reference/live-video) object to [get current comments and reactions](https://developers.facebook.com/docs/live-video-api/interact-with-viewers#getting-current-comments-and-reactions), or set up Server-Sent Events to [receive real-time comments and reactions](https://developers.facebook.com/docs/live-video-api/interact-with-viewers#receiving-real-time-comments-and-reactions).

## Getting Current Comments and Reactions

To get the current comments or reactions on a live video broadcast, send a request to:

[`GET /{live-video-id}/comments`](https://developers.facebook.com/docs/graph-api/reference/live-video/comments#Reading)

[`GET /{live-video-id}/reactions`](https://developers.facebook.com/docs/graph-api/reference/live-video/reactions#Reading)

#### Sample Request

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X GET \
  "https://graph.facebook.com/{live-video-id}/comments?access_token={access-token}"
```

```java
GraphRequest request = GraphRequest.newGraphPathRequest(
  accessToken,
  "/{live-video-id}/comments",
  new GraphRequest.Callback() {
    @Override
    public void onCompleted(GraphResponse response) {
      // Insert your code here
    }
});

request.executeAsync();
```

```m
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
    initWithGraphPath:@"/{live-video-id}/comments"\
           parameters:nil\
           HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/{live-video-id}/comments',
  'GET',
  {},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->get(
    '/{live-video-id}/comments',
    '{access-token}'
  );
} catch(FacebookExceptionsFacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(FacebookExceptionsFacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphNode = $response->getGraphNode();
```

#### Sample Response

```js
{
  "data": [\
    {\
      "created_time": "2018-08-30T18:47:02+0000",\
      "from": {\
        "name": "Steph C.",\
        "id": "552524095105158"\
      },\
      "message": "This is such a great live stream.",\
      "id": "911936075671494_911936769004758"\
    },\
    {\
      "created_time": "2018-08-30T18:47:17+0000",\
      "from": {\
        "name": "Kevin D.",\
        "id": "552524095105158"\
      },\
      "message": "Shoutout over here!",\
      "id": "911936075671494_911936909004744"\
    },\
    {\
      "created_time": "2018-08-30T18:48:14+0000",\
      "from": {\
        "name": "Clay T.",\
        "id": "552524095105158"\
      },\
      "message": "Where is this place?",\
      "id": "911936075671494_911937292338039"\
    }\
    ],
  "paging": {
    "cursors": {
      "before": "WTI5d...",
      "after": "WTI5d..."
    }
  }
}
```

Refer to the [Comments](https://developers.facebook.com/docs/graph-api/reference/live-video/comments) and [Reactions](https://developers.facebook.com/docs/graph-api/reference/live-video/reactions/) edge references for information on returnable fields, and filtering and ordering instructions. Comments and reactions can be polled every few seconds.

## Receiving Real-time Comments and Reactions

To receive comments and reactions in browser clients in real-time, set up [Server Sent Events](https://developers.facebook.com/docs/graph-api/server-sent-events) and send a request to these endpoints:

[`GET /{live-video-id}/live_comments`](https://developers.facebook.com/docs/graph-api/server-sent-events/endpoints/live-comments#reading)

[`GET /{live-video-id}/live_reactions`](https://developers.facebook.com/docs/graph-api/server-sent-events/endpoints/live-reactions#reading)

Note that the host URL for streaming events is: `https://streaming-graph.facebook.com`

#### Sample Request

HTTPJavaScript SDK

```regex
GET https://streaming-graph.facebook.com/{live-video-id}/live_comments?access_token={access-token}
```

```js
var source = new EventSource("https://streaming-graph.facebook.com/{live-video-id}/live_comments?access_token={access-token}");
source.onmessage = function(event) {
  // Do something with event.message for example
};
```

#### Sample Response

```js
: ping
data:
  {
    "created_time":"2018-08-30T21:11:01+0000",
    "id":"911936075671494_912014908996944",
    "view_id":43329028,
    "from":
      {
        "id":"552524095105158",
        "name":"Kerry Fisher"
      },
    "message":"I love this video!"
  }
: ping
: ping
```

Refer to the [Live Comments](https://developers.facebook.com/docs/graph-api/server-sent-events/endpoints/live-comments) and [Live Reactions](https://developers.facebook.com/docs/graph-api/server-sent-events/endpoints/live-reactions) references for information on returnable fields, ping frequency, and filtering.

On This Page

[Interacting with Viewers](https://developers.facebook.com/docs/live-video-api/interact-with-viewers#interacting-with-viewers)

[Getting Current Comments and Reactions](https://developers.facebook.com/docs/live-video-api/interact-with-viewers#getting-current-comments-and-reactions)

[Receiving Real-time Comments and Reactions](https://developers.facebook.com/docs/live-video-api/interact-with-viewers#receiving-real-time-comments-and-reactions)