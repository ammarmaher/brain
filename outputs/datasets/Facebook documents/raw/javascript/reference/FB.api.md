---
url: https://developers.facebook.com/docs/javascript/reference/FB.api
title: Graph API - Facebook SDK for JavaScript
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fjavascript%2Freference%2FFB.api%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook SDK for JavaScript](https://developers.facebook.com/docs/javascript)

- [Quickstart](https://developers.facebook.com/docs/javascript/quickstart)
- [Advanced Setup](https://developers.facebook.com/docs/javascript/advanced-setup)
- [Examples](https://developers.facebook.com/docs/javascript/examples)
- [Frameworks](https://developers.facebook.com/docs/javascript/frameworks)
- [Reference](https://developers.facebook.com/docs/javascript/reference)


  - [Initialization](https://developers.facebook.com/docs/javascript/reference/FB.init)
  - [Graph API](https://developers.facebook.com/docs/javascript/reference/FB.api)
  - [Dialogs](https://developers.facebook.com/docs/javascript/reference/FB.ui)
  - [Login Status](https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus)
  - [Login](https://developers.facebook.com/docs/reference/javascript/FB.login)
  - [Logout](https://developers.facebook.com/docs/reference/javascript/FB.logout)
  - [Auth Response](https://developers.facebook.com/docs/reference/javascript/FB.getAuthResponse)
  - [Event Subscription](https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe)
  - [Cancel Subscription](https://developers.facebook.com/docs/reference/javascript/FB.Event.unsubscribe)
  - [XFBML Parsing](https://developers.facebook.com/docs/reference/javascript/FB.XFBML.parse)
  - [Resource Prefetching](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.Prefetcher.addStaticResource)
  - [Prefetching Mode](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.Prefetcher.setCollectionMode)
  - [Page Info](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.getPageInfo)
  - [Loading Control](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.setDoneLoading)
  - [Scroll Control](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.scrollTo)
  - [Canvas Resizing](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.setAutoGrow)
  - [Manual Canvas Resizing](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.setSize)
  - [URL Handler](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.setUrlHandler)
  - [Start Loading Timer](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.startTimer)
  - [Stop Loading Timer](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.stopTimer)

On This Page

[Graph API Request](https://developers.facebook.com/docs/javascript/reference/FB.api#graph-api-request)

[Parameters](https://developers.facebook.com/docs/javascript/reference/FB.api#parameters)

[Examples](https://developers.facebook.com/docs/javascript/reference/FB.api#examples)

[Example: Delete a previously published post:](https://developers.facebook.com/docs/javascript/reference/FB.api#example--delete-a-previously-published-post-)

[Example: Reading a Page's messages using a Page Access Token:](https://developers.facebook.com/docs/javascript/reference/FB.api#example--reading-a-page-s-messages-using-a-page-access-token-)

# Graph API Request

The method **`FB.api()`** lets you make calls to the [Graph API](https://developers.facebook.com/docs/graph-api).

```code
FB.api(path, method, params, callback)
```

## Parameters

| Name | Type | Description |
| --- | --- | --- |
| `path` | `string` | This is the Graph API endpoint path that you want to call. You can read the [Graph API reference docs](https://developers.facebook.com/docs/graph-api/reference/) to see which endpoint you want to use. This is a required parameter. |
| `method` | `enum{get, post, delete}` | This is the HTTP method that you want to use for the API request. Consult the [Graph API reference docs](https://developers.facebook.com/docs/graph-api/reference/) to see which method you need to use. Default is `get` |
| `params` | `object` | This is an object consisting of any parameters that you want to pass into your Graph API call. The parameters that can be used vary depending on the endpoint being called, so check the [Graph API reference docs](https://developers.facebook.com/docs/graph-api/reference/) for full lists of available parameters. One parameter of note is `access_token` which you can use to make an API call with a Page access token. App access tokens should **never** be used in this SDK as it is client-side, and your app secret would be exposed. |
| `callback` | `function` | This is the function that is triggered whenever the API returns a response. The response object available to this function contains the API result. |

## Examples

#### Example: Read the [JavaScript Facebook Page](https://www.facebook.com/pages/JavaScript/113124472034820):

```code
FB.api('/113124472034820', function(response) {
  console.log(response);
});
```

#### Example: Return the last name of the current user:

```code
FB.api('/me', {fields: 'last_name'}, function(response) {
  console.log(response);
});
```

#### Example: Publish a status message to the current user's feed:

```code
var body = 'Reading JS SDK documentation';
FB.api('/me/feed', 'post', { message: body }, function(response) {
  if (!response || response.error) {
    alert('Error occured');
  } else {
    alert('Post ID: ' + response.id);
  }
});
```

### Example: Delete a previously published post:

```code
var postId = '1234567890';
FB.api(postId, 'delete', function(response) {
  if (!response || response.error) {
    alert('Error occured');
  } else {
    alert('Post was deleted');
  }
});
```

### Example: Reading a Page's messages using a Page Access Token:

```code
var pageAccessToken = '1234567890|faketoken';
FB.api('/me/conversations', {
  access_token : pageAccessToken
});
```

On This Page

[Graph API Request](https://developers.facebook.com/docs/javascript/reference/FB.api#graph-api-request)

[Parameters](https://developers.facebook.com/docs/javascript/reference/FB.api#parameters)

[Examples](https://developers.facebook.com/docs/javascript/reference/FB.api#examples)

[Example: Delete a previously published post:](https://developers.facebook.com/docs/javascript/reference/FB.api#example--delete-a-previously-published-post-)

[Example: Reading a Page's messages using a Page Access Token:](https://developers.facebook.com/docs/javascript/reference/FB.api#example--reading-a-page-s-messages-using-a-page-access-token-)