---
url: https://developers.facebook.com/docs/graph-api/reference/user/accounts
title: Graph API User Accounts
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fuser%2Faccounts%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[User Accounts](https://developers.facebook.com/docs/graph-api/reference/user/accounts#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/user/accounts#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/user/accounts#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/user/accounts#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/user/accounts#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/user/accounts#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/user/accounts#Creating)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/user/accounts#permissions)

[Limitations](https://developers.facebook.com/docs/graph-api/reference/user/accounts#limitations)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/user/accounts#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/user/accounts#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/user/accounts#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/user/accounts#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/user/accounts#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/user/accounts#)

# User Accounts

The Facebook Pages that a person owns or is able to perform tasks on.

## Reading

Pages the User has a role on

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Buser-id%7D%2Faccounts&version=v25.0)

```
GET /v25.0/{user-id}/accounts HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{user-id}/accounts',
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
    "/{user-id}/accounts",
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
    "/{user-id}/accounts",
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
                               initWithGraphPath:@"/{user-id}/accounts"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

### Parameters

| Parameter | Description |
| --- | --- |
| `ad_id`<br>numeric string or integer | Filter pages by a specific ad id |
| `is_place`<br>boolean | If specified,filter pages based on whetherthey are places or not |
| `is_promotable`<br>boolean | If specified, filter pages based on whether they can be promoted or not |

### Fields

Reading from this edge will return a JSON formatted result:

```
{
    "data": [],
    "paging": {},
    "summary": {}
}
```

#### `data`

A list of [Page](https://developers.facebook.com/docs/graph-api/reference/page/) nodes.

The following fields will be added to each node that is returned:

| Field | Description |
| --- | --- |
| `tasks`<br>list<enum> | The User's tasks assigned to the Page.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

#### `paging`

For more details about pagination, see the [Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging).

#### `summary`

Aggregated information about the edge, such as counts. Specify the fields to fetch in the summary param (like `summary=total_count`).

| Field | Description |
| --- | --- |
| `total_count`<br>int32 | Total number of objects on this edge<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

### Error Codes

| Error | Description |
| --- | --- |
| 459 | The session is invalid because the user has been checkpointed |
| 190 | Invalid OAuth 2.0 Access Token |
| 200 | Permissions error |
| 100 | Invalid parameter |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 80001 | There have been too many calls to this Page account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |
| 80002 | There have been too many calls to this Instagram account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |
| 483 | The session is invalid because the user is in consent app blocking |
| 283 | That action requires the extended permission pages\_read\_engagement and/or pages\_read\_user\_content and/or pages\_manage\_ads and/or pages\_manage\_metadata |
| 2500 | Error parsing graph query |

## Creating

This API lets you create Facebook pages.

### Permissions

- A User access token with `pages_manage_metadata` and `pages_show_list` permissions.

- The `category_enum` parameter with a Page Category.

- Other requirements vary depending on the type of page you are creating but may require the following parameters: `name`, `about`, `picture`, and `cover_photo`.


**Note:** When setting the locale, at least one, `city_id`, `location`, or `coordinates`, is required. Caveats:

- `city_id` and `location` can not be used together

- `city_id` and `coordinates` can be used together however the coordinates must be within the city selected

- `location` and `coordinates` can be used together however the coordinates must be within the location selected


### Limitations

- You can only create a Page as a [test user](https://developers.facebook.com/docs/apps/test-users) or if your app has been allowlisted by your Facebook representative.


* * *

You can make a POST request to `accounts` edge from the following paths:

- [`/{user_id}/accounts`](https://developers.facebook.com/docs/graph-api/reference/user/accounts/)

When posting to this edge, no Graph object will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `about`<br>UTF-8 encoded string | Short description |
| `address`<br>UTF-8 encoded string | Address |
| `category_enum`<br>string | Page category (enum). See [Pages Categories API](https://developers.facebook.com/docs/graph-api/reference/page-category/) docs. |
| `category_list`<br>list<numeric string> | List of categories |
| `city_id`<br>city id | City ID |
| `coordinates`<br>JSON-encoded coordinate list | Coordinates |
| `cover_photo`<br>Object | Cover photo |
| `url`<br>URL | Required |
| `offset_y`<br>integer | Default value: `50` |
| `offset_x`<br>integer | Default value: `50` |
| `focus_y`<br>float |  |
| `focus_x`<br>float |  |
| `zoom_scale_x`<br>float |  |
| `zoom_scale_y`<br>float |  |
| `no_feed_story`<br>boolean | Default value: `false` |
| `no_notification`<br>boolean | Default value: `false` |
| `description`<br>UTF-8 encoded string | Description |
| `ignore_coordinate_warnings`<br>boolean | If ignore warnings generated in coordination validation (bool) |
| `location`<br>Object | This defines the location for this page. This is required if `location_page_id` is not specified, or if the Page referenced by the `location_page_id` doesn't have a valid value for the field. The dictionary must include the keys either `city_id` or all of `city`, `state`, and `country` (but `state` is optional if the address is not in the U.S.). |
| `city`<br>string |  |
| `state`<br>string |  |
| `country`<br>string |  |
| `name`<br>UTF-8 encoded string | Page name<br>Required |
| `phone`<br>UTF-8 encoded string | Phone |
| `picture`<br>URL | Profile picture |
| `website`<br>URL | Website |
| `zip`<br>string | Zipcode |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node represented by `id` in the return type.

Struct {

`id`: numeric string,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 200 | Permissions error |
| 152 | Invalid page type |
| 194 | Missing at least one required parameter |
| 283 | That action requires the extended permission pages\_read\_engagement and/or pages\_read\_user\_content and/or pages\_manage\_ads and/or pages\_manage\_metadata |

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[User Accounts](https://developers.facebook.com/docs/graph-api/reference/user/accounts#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/user/accounts#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/user/accounts#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/user/accounts#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/user/accounts#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/user/accounts#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/user/accounts#Creating)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/user/accounts#permissions)

[Limitations](https://developers.facebook.com/docs/graph-api/reference/user/accounts#limitations)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/user/accounts#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/user/accounts#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/user/accounts#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/user/accounts#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/user/accounts#Deleting)