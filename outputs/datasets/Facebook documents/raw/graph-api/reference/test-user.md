---
url: https://developers.facebook.com/docs/graph-api/reference/test-user/
title: Test User - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Ftest-user%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Test User /{test-user-id}](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#test-user---test-user-id-)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#read)

[Publishing and Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#publishing)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#pubperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#pubfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#pubresponse)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#deleting)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#delperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#delfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#delresponse)

[Edges](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#edges)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#)

# Test User /{test-user-id}

A test user associated with a Facebook app. Test users are created and associated using the [`/{app-id}/accounts/test-users`](https://developers.facebook.com/docs/graph-api/reference/app/accounts/test-users) edge or [in the App Dashboard](https://developers.facebook.com/docs/apps/test-users#managetool).

### Related Guides

- [Managing Test Accounts using the App Dashboard](https://developers.facebook.com/docs/apps/test-users#managetool)


## Reading

Permissions and fields for read operations on this node are [identical to those of the regular `/{user-id}` node](https://developers.facebook.com/docs/graph-api/reference/user#read).

## Publishing and Updating

You can publish to this node to update the test user's password or name.

HTTPPHP SDKAndroid SDKiOS SDK

```
POST /v25.0/{test-user-id} HTTP/1.1
Host: graph.facebook.com

password=newpassword&name=Newname+Smith
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->post(
    '/{test-user-id}',
    array (
      'password' => 'newpassword',
      'name' => 'Newname Smith',
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
Bundle params = new Bundle();
params.putString("password", "newpassword");
params.putString("name", "Newname Smith");
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{test-user-id}",
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
  @"password": @"newpassword",
  @"name": @"Newname Smith",
};
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{test-user-id}"\
                                      parameters:params\
                                      HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Permissions

- An app access token is required to update these fields for any test users associated with that app.


### Fields

| Name | Description | Type |
| --- | --- | --- |
| `name` | New name for the test user. | `string` |
| `password` | A new password for the test user. | `string` |

### Response

If update is successful, `true`, otherwise an error message.

## Deleting

You can delete a test user by making a delete operation on this node.

HTTPPHP SDKAndroid SDKiOS SDK

```
DELETE /v25.0/{test-user-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->delete(
    '/{test-user-id}',
    array (),
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
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{test-user-id}",
    null,
    HttpMethod.DELETE,
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
                               initWithGraphPath:@"/{test-user-id}"\
                                      parameters:params\
                                      HTTPMethod:@"DELETE"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

### Permissions

- An app access token for an associated app or the test user's own access token must be used to delete that test user.

- The test user must have been disassociated from all but a single app. You can disassociate test users using the [`/{app-id}/accounts/test-users` edge](https://developers.facebook.com/docs/graph-api/reference/app/accounts/test-users#delete).


### Fields

No fields are required to delete.

### Response

If delete is successful, `true`, otherwise an error message.

## Edges

| Name | Description |
| --- | --- |
| [`/friends`](https://developers.facebook.com/docs/graph-api/reference/test-user/friends) | The friends of the test user - this edge can be used to friend two test users. |

On This Page

[Test User /{test-user-id}](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#test-user---test-user-id-)

[Reading](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#read)

[Publishing and Updating](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#publishing)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#pubperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#pubfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#pubresponse)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#deleting)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#delperms)

[Fields](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#delfields)

[Response](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#delresponse)

[Edges](https://developers.facebook.com/docs/graph-api/reference/v25.0/test-user#edges)