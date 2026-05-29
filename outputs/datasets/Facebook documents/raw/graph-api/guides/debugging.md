---
url: https://developers.facebook.com/docs/graph-api/guides/debugging
title: Debug Requests - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fguides%2Fdebugging%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging#debug-requests)

[Graph API Debug Mode](https://developers.facebook.com/docs/graph-api/guides/debugging#graphapidebugmode)

[Determining Version used by API Requests](https://developers.facebook.com/docs/graph-api/guides/debugging#apiversiondebug)

[Debug Info for Reporting Bugs](https://developers.facebook.com/docs/graph-api/guides/debugging#bugdebug)

# Debug Requests

## Graph API Debug Mode

When Debug Mode is enabled, Graph API response may contain additional fields that explain potential issues with the request.

To enable debug mode, use the `debug` query string parameter. For example:

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X GET \
  "https://graph.facebook.com/{user-id}
    ?fields=friends
    &debug=all
    &access_token={your-access-token}"
```

```java
GraphRequest request = GraphRequest.newMeRequest(
  accessToken,
  new GraphRequest.GraphJSONObjectCallback() {
    @Override
    public void onCompleted(JSONObject object, GraphResponse response) {
      // Insert your code here
    }
});

Bundle parameters = new Bundle();
parameters.putString("fields", "friends");
parameters.putString("debug", "all");
request.setParameters(parameters);
request.executeAsync();
```

```m
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
    initWithGraphPath:@"/{user-id}"\
           parameters:@{ @"fields": @"friends",@"debug": @"all",}\
           HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/{user-id}',
  'GET',
  {"fields":"friends","debug":"all"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->get(
    '/{user-id}',
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

If `user_friends` permission was not granted, this produces the following response:

```js
{
  "data": [\
  ],
  "__debug__": {
    "messages": [\
      {\
        "message": "Field friends is only accessible on User object, if user_friends permission is granted by the user",\
        "type": "warning"\
      },\
      {\
        "link": "https://developers.facebook.com/docs/apps/changelog#v2_0",\
        "message": "Only friends who have installed the app are returned in versions greater or equal to v2.0.",\
        "type": "info"\
      }\
    ]
  }
}
```

The `debug` parameter value can be set to "all" or to a minimal requested severity level that corresponds to `type` of the message:

| Debug Param Value | What Will Be Returned |
| --- | --- |
| all | All available debug messages. |
| info | Debug messages with type _info_ and _warning_. |
| warning | Only debug messages with type _warning_. |

Debug information, when available, is returned as a JSON object under the `__debug__` key in the `messages` array. Every element of this array is a JSON object that contains the following fields:

| Field | Datatype | Description |
| --- | --- | --- |
| message | String | The message. |
| type | String | The message severity. |
| link | String | \[Optional\] A URL pointing to related information. |

You can also use Debug Mode with [Graph API Explorer](https://developers.facebook.com/tools/explorer).

### Determining Version used by API Requests

When you're building an app and making Graph API requests, you might find it useful to determine what API version you're getting a response from. For example, if you're making calls without a version specified, the API version that responds may not be known to you.

The Graph API supplies a request header with any response called `facebook-api-version` that indicates the exact version of the API that generated the response. For example, a Graph API call that generates a request with v2.0 produces the following HTTP header:

```code
facebook-api-version:v2.0
```

This `facebook-api-version` header allows you to determine whether API calls are being returned from the version that you expect.

### Debug Info for Reporting Bugs

When [reporting a bug](https://developers.facebook.com/bugs/) in the Graph API, we include some additional request headers to send with your bug report to help us pinpoint and reproduce your issue. These request headers are `X-FB-Debug`, `x-fb-rev`, and `X-FB-Trace-ID`.

On This Page

[Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging#debug-requests)

[Graph API Debug Mode](https://developers.facebook.com/docs/graph-api/guides/debugging#graphapidebugmode)

[Determining Version used by API Requests](https://developers.facebook.com/docs/graph-api/guides/debugging#apiversiondebug)

[Debug Info for Reporting Bugs](https://developers.facebook.com/docs/graph-api/guides/debugging#bugdebug)