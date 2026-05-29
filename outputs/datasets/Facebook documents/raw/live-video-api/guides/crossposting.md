---
url: https://developers.facebook.com/docs/live-video-api/guides/crossposting
title: Crosspost a video - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fguides%2Fcrossposting%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Crosspost to multiple Facebook Pages](https://developers.facebook.com/docs/live-video-api/guides/crossposting#crosspost-to-multiple-facebook-pages)

[How it works](https://developers.facebook.com/docs/live-video-api/guides/crossposting#how-it-works)

[Establish a crossposting relationship](https://developers.facebook.com/docs/live-video-api/guides/crossposting#establish-a-crossposting-relationship)

[Step 1: Send a Crossposting Request](https://developers.facebook.com/docs/live-video-api/guides/crossposting#step-1--send-a-crossposting-request)

[Accept a Crossposting Request](https://developers.facebook.com/docs/live-video-api/guides/crossposting#accept-a-crossposting-request)

[Find eligible Pages for crossposting](https://developers.facebook.com/docs/live-video-api/guides/crossposting#find-eligible-pages-for-crossposting)

[Adding Crossposting Actions to a Live Video](https://developers.facebook.com/docs/live-video-api/guides/crossposting#adding-crossposting-actions-to-a-live-video)

# Crosspost to multiple Facebook Pages

This document shows you how you can use the Live Video API to post videos simultaneously to multiple pages.

Crossposting is not available for personal profiles, but for pages and professional profiles only. Crossposting is also [available for VOD videos](https://www.facebook.com/help/678485232304895) in addition to live videos.

## How it works

To crosspost live videos to multiple pages and professional profiles, and VOD, you will need to do the following:

1. App users must be able to perform the `CREATE_CONTENT` task on the Page
2. App users must grant your app the following permissions using [Facebook Login for Business:](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business)
   - `pages_manage_posts`

   - `pages_read_user_content`

   - `pages_manage_engagement`

   - `pages_show_list`

   - `publish_video`
3. App users must [establish a crossposting relationship](https://developers.facebook.com/docs/live-video-api/guides/crossposting#establish-a-crossposting-relationship) with other Pages or professional profiles.


   - If you are building an app for your own pages, you might want to
      [set up the crossposting relationship in your Facebook Page or professional profile settings.\\
      ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEbSDMy&_nc_oc=AdpZgPsNiFFHPjfXuqRkVQc_YF2ymx83z2DfPjW2Tm5vdM3X3JZyzytrkiY3JzuVi9k&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bE_lICh6LbrHxG9tF0t96A&_nc_ss=7b289&oh=00_Af7Pl3mgqQi8wWUnl4hPQPdYK76OhUZNNrzisnMWrZWRUA&oe=6A2592E2)](https://www.facebook.com/business/help/435603007278527)
4. Find Eligible Crossposting Pages


## Establish a crossposting relationship

In order to crosspost to another page or professional profile, your page must send a crossposting request to a page or professional profile, and the invited page or profile must accept your request.

### Step 1: Send a Crossposting Request

To send a crosspost request, send a `POST` request to the `/<YOUR_PAGE_ID>` endpoint with the following parameters:

- `begin_crossposting_handshake` set to an array with a comma separated list of pages where `partner_page_id` is set to the Page ID to which you are sending the request and `allow_live` set to `true`

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

_The following code sample has been formatted for readability._

```curl
curl -i -X POST "https://graph.facebook.com/v25.0<PAGE_1_ID> \
      ?begin_crossposting_handshake=[{partner_page_id:<PAGE_2_ID>,allow_live:true}]"
```

On success, your app receives a JSON response with `success` set to `true`.

#### Sample Response

```json
{
  "success": true
}
```

Set `allow_live` to `false` to send a request to create a crossposting relationship wherein a Page can crosspost live videos to your Page only after your admins or editors have approved the video.

### Accept a Crossposting Request

To accept a request from another page to crosspost their video to your page, send a `POST` request to the `/<ID>` endpoint with the `accept_crossposting_handshake` parameter set to the Page ID who sent the request and `allow_live` to `true`.

_The following code sample has been formatted for readability._

```curl
curl -X POST "https://graph.facebook.com/v25.0/<PAGE_2_ID>
    ?accept_crossposting_handshake=[{partner_page_id:<PAGE_1_ID>, allow_live:true}]"
```

On success, your app receives a JSON response with `success` set to `true`. The video will now be live on multiple pages.

To deny a request, set `allow_live` to `false`.

## Find eligible Pages for crossposting

To find pages that your app user has permission to crosspost to, send a `GET` request to the `/<PAGE_ID>/crosspost_whitelisted_pages` endpoint with the following fields:

- `allows_live_crossposts`
- `id`
- `name` (optional)

```curl
curl "https://graph.facebook.com/v25.0/<PAGE_ID>/crosspost_whitelisted_pages" \
  -d "fields=id,name,allows_live_crossposts"
```

On success your app will receive a list of IDs, names, and whether or not the Page is allowed to crosspost, `true` or `false`. `true` means the source page can post the crossposted live video directly to the target page without further authorization. `false` means the target page must [manually post the crossposted video](https://www.facebook.com/business/help/1385580858214929).

#### Sample Response

```json
{
  "data": [\
    {\
      "id": "107738621396466",\
      "name": "Crossposting Page C",\
      "allows_live_crossposts": false\
    },\
    {\
      "id": "106589754846067",\
      "name": "Crossposting Page B",\
      "allows_live_crossposts": true\
    },\
    {\
      "id": "106343288214714",\
      "name": "Crossposting Target X",\
      "allows_live_crossposts": true,\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "&lt;PAGE_CURSOR>",
      "after": "&lt;PAGE_CURSOR>"
    }
  }
}
```

## Adding Crossposting Actions to a Live Video

#### Before you start

A user must be able to act on behalf of a page, and must be able to edit and update videos. That means, your app will need to have [`pages_manage_posts` permission](https://developers.facebook.com/docs/permissions/reference/pages_manage_posts) on behalf of your user.

Once we know which pages are available for crossposting, we can add `crossposting_actions` to any [LiveVideo](https://developers.facebook.com/docs/graph-api/reference/live-video) object. Each crossposting action defines whether a live video is made available for crossposting, and if it should automatically post to the target page.

The request is [`POST /{video-id}`](https://developers.facebook.com/docs/live-video-api/guides/docs/graph-api/reference/live-video#Updating) to update a video.

cURLAndroid SDKObjective-CJavaScript SDKPHP SDK

```sh
curl -i -X POST \
 "https://graph.facebook.com/v10.0/112103234301221?fields=crosspost_shared_pages,crossposted_broadcasts%7Bstatus,from%7Bname%7D%7D&access_token=${access_token}" \
 -H "Content-Type: application/json" \
 -d @- << HEREDOC
{"crossposting_actions": [\
  {\
    "page_id": "107738621396466",\
    "action": "enable_crossposting"\
  },\
  {\
    "page_id": "106589754846067",\
    "action": "enable_crossposting_and_create_post"\
  },\
  {\
    "page_id": "106343288214714",\
    "action": "disable_crossposting"\
  }\
]}
HEREDOC
```

```java
GraphRequest request = GraphRequest.newPostRequest(
  accessToken,
  "/112103234301221",
  new JSONObject("{\"crossposting_actions\":\"[\\n  {\\n    \\\"page_id\\\": \\\"107738621396466\\\",\\n    \\\"action\\\": \\\"enable_crossposting\\\"\\n  },\\n  {\\n    \\\"page_id\\\": \\\"106589754846067\\\",\\n    \\\"action\\\": \\\"enable_crossposting_and_create_post\\\"\\n  },\\n  {\\n    \\\"page_id\\\": \\\"106343288214714\\\",\\n    \\\"action\\\": \\\"disable_crossposting\\\"\\n  }\\n]\"}"),
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
    initWithGraphPath:@"/112103234301221"\
           parameters:@{ @"fields": @"crosspost_shared_pages,crossposted_broadcasts{status,from{name}}",@"crossposting_actions": @"[\
  {\
    "page_id": "107738621396466",\
    "action": "enable_crossposting"\
  },\
  {\
    "page_id": "106589754846067",\
    "action": "enable_crossposting_and_create_post"\
  },\
  {\
    "page_id": "106343288214714",\
    "action": "disable_crossposting"\
  }\
]",}\
           HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```js
FB.api(
  '/112103234301221',
  'POST',
  {"fields":"crosspost_shared_pages,crossposted_broadcasts{status,from{name}}","crossposting_actions":"[\n  {\n    \"page_id\": \"107738621396466\",\n    \"action\": \"enable_crossposting\"\n  },\n  {\n    \"page_id\": \"106589754846067\",\n    \"action\": \"enable_crossposting_and_create_post\"\n  },\n  {\n    \"page_id\": \"106343288214714\",\n    \"action\": \"disable_crossposting\"\n  }\n]"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->post(
    '/112103234301221',
    array (
      'fields' => 'crosspost_shared_pages,crossposted_broadcasts{status,from{name}}',
      'crossposting_actions' => '[\
        {\
          "page_id": "107738621396466",\
          "action": "enable_crossposting"\
        },\
        {\
          "page_id": "106589754846067",\
          "action": "enable_crossposting_and_create_post"\
        },\
        {\
          "page_id": "106343288214714",\
          "action": "disable_crossposting"\
        }\
      ]'
    ),
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

These actions show the options available. The first would allow the first page (`107738621396466`) to crosspost the video from Creator Studio, or the API, but would not automatically crosspost the video anywhere. The second would prevent the second page (`106589754846067`) from crossposting the video, and the third would automatically post the video to the targeted page (`106343288214714`).

#### Example success

Returns the [LiveVideo](https://developers.facebook.com/docs/graph-api/reference/live-video) object, and we've used the [`crosspost_shared_pages`](https://developers.facebook.com/docs/graph-api/reference/live-video/crosspost_shared_pages/) edge to see which pages have it available, and the [`crossposted_broadcasts`](https://developers.facebook.com/docs/live-video-api/guides/docs/graph-api/reference/live-video/crossposted_broadcasts/) edge to see the pages where our posts have already posted.

#### Important Note

If any crossposting relationships have changed or are invalid, the crossposts will obviously not succeed, but no error will be thrown. That means inspecting the response for successful broadcasts is the only way to know if an action has succeded or not.

```json
{
  "crosspost_shared_pages": {
    "data": [\
      {\
        "name": "Crossposting Page C",\
        "id": "107738621396466"\
      },\
      {\
        "name": "[FB Test Page] Crossposting Page B",\
        "id": "106589754846067"\
      }\
    ]
  },
  "crossposted_broadcasts": {
    "data": [\
      {\
        "status": "UNPUBLISHED",\
        "from": {\
          "name": "[FB Test Page] Crossposting Page B",\
          "id": "106589754846067"\
        },\
        "id": "114820814022961"\
      }\
    ]
  },
  "id": "112103234301221"
}
```

#### Example Error

If any `crossposting_options` are invalid, the entire request will fail. No crossposts will succeed.

```json
{
  "error": {
    "message": "Fatal",
    "type": "OAuthException",
    "code": -1,
    "error_subcode": 1363103,
    "is_transient": false,
    "error_user_title": "Invalid Parameters",
    "error_user_msg": "The request does not specify valid parameters, no action has been taken.",
    "fbtrace_id": "AnI03n5n0Px-ihrZjkWMeTP"
  }
}
```

On This Page

[Crosspost to multiple Facebook Pages](https://developers.facebook.com/docs/live-video-api/guides/crossposting#crosspost-to-multiple-facebook-pages)

[How it works](https://developers.facebook.com/docs/live-video-api/guides/crossposting#how-it-works)

[Establish a crossposting relationship](https://developers.facebook.com/docs/live-video-api/guides/crossposting#establish-a-crossposting-relationship)

[Step 1: Send a Crossposting Request](https://developers.facebook.com/docs/live-video-api/guides/crossposting#step-1--send-a-crossposting-request)

[Accept a Crossposting Request](https://developers.facebook.com/docs/live-video-api/guides/crossposting#accept-a-crossposting-request)

[Find eligible Pages for crossposting](https://developers.facebook.com/docs/live-video-api/guides/crossposting#find-eligible-pages-for-crossposting)

[Adding Crossposting Actions to a Live Video](https://developers.facebook.com/docs/live-video-api/guides/crossposting#adding-crossposting-actions-to-a-live-video)