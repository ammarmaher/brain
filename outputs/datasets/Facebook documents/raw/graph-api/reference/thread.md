---
url: https://developers.facebook.com/docs/graph-api/reference/thread/
title: Thread - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fv25.0%2Fthread%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Thread /{thread-id}](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#thread---thread-id-)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#read)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#permissions)

[Example](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#example)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#fields)

[Edges](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#edges)

[Filtering Messages](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#filtering-messages)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#publishing)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#deleting)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#updating)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#)

# Thread `/{thread-id}`

A Facebook Messages conversation thread. This endpoint is only accessible for users that are developers of the app making the request.

Pages should use the [Conversation endpoint](https://developers.facebook.com/docs/graph-api/reference/conversation/).

## Reading

Get a message thread.

### Permissions

- A Page access token requested by a person who can perform the [`MODERATE` task](https://developers.facebook.com/docs/pages/overview/permissions-features#tasks) on the Page.

- The [`pages_messaging` permission](https://developers.facebook.com/docs/permissions/reference/pages_messaging)

- The [`pages_manage_metadata` permission](https://developers.facebook.com/docs/permissions/reference/pages_manage_metadata)

- The [`pages_show_list` permission](https://developers.facebook.com/docs/permissions/reference/pages_show_list)


### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bthread-id%7D&version=v25.0)

```
GET /v25.0/{thread-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{thread-id}',
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
    "/{thread-id}",
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
    "/{thread-id}",
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
                               initWithGraphPath:@"/{thread-id}"\
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
| `id` | The unique ID for this message thread. | `string` |
| `comments` | The messages in this thread. | [`Message[]`](https://developers.facebook.com/docs/graph-api/reference/message/) |
| `to` | Profiles that are subscribed to the thread. | [`Profile[]`](https://developers.facebook.com/docs/graph-api/reference/profile/) |
| `unread` | The amount of messages that are unread by the session profile. | `integer` |
| `unseen` | The amount of messages that are unseen by the session profile. | `integer` |
| `updated_time` | When the thread was last updated. | `datetime` |
| `can_reply` | Can the page reply in the thread. | `boolean` |
| `linked_group` | ID of the Workplace group that the thread is linked to (Workplace only) | `string` |

### Edges

| Name | Description |
| --- | --- |
| `messages` | List of individual messages in the thread. See [Messages](https://developers.facebook.com/docs/graph-api/reference/message) |

### Filtering Messages

The `messages` connection can be filtered to avoid pulling text that is part of thread warnings by the Messenger Apps. This is done via the `source` filter there only participants might be selected.

If this filter is not apply _admin text_ (gray text appears in the thread by Messenger) will be retrieved as well.

#### Example

This call will retrieve the last 3 messages made only by the participants.

```code
curl -i -X GET \
 "https://graph.facebook.com/v4.0/t_10155839492600149?fields=id,messages.source(PARTICIPANTS).limit(3)&access_token=<Access Token>"
```

## Publishing

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

On This Page

[Thread /{thread-id}](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#thread---thread-id-)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#read)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#permissions)

[Example](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#example)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#fields)

[Edges](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#edges)

[Filtering Messages](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#filtering-messages)

[Publishing](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#publishing)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#deleting)

[Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/thread#updating)