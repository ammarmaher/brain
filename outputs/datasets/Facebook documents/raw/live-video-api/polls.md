---
url: https://developers.facebook.com/docs/live-video-api/polls
title: Poll viewers - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fpolls%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Polls](https://developers.facebook.com/docs/live-video-api/polls#polls)

[Create a Poll](https://developers.facebook.com/docs/live-video-api/polls#create-a-poll)

[Query String Parameters](https://developers.facebook.com/docs/live-video-api/polls#query-string-parameters)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response)

[Close a Poll](https://developers.facebook.com/docs/live-video-api/polls#close-a-poll)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-2)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-2)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-2)

[Reopen a Poll](https://developers.facebook.com/docs/live-video-api/polls#reopen-a-poll)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-3)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-3)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-3)

[Show Poll Results](https://developers.facebook.com/docs/live-video-api/polls#show-poll-results)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-4)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-4)

[Get Poll Options](https://developers.facebook.com/docs/live-video-api/polls#get-poll-options)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-5)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-5)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-4)

[Get Poll Option Votes](https://developers.facebook.com/docs/live-video-api/polls#get-poll-option-votes)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-6)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-6)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-5)

[Get All Poll Option Votes](https://developers.facebook.com/docs/live-video-api/polls#get-all-poll-option-votes)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-7)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-7)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-6)

# Polls

You can use the API to create and manage polls on live video broadcasts that have a status of `LIVE`. Polls are represented by [VideoPoll](https://developers.facebook.com/docs/graph-api/reference/video-poll/) objects and are comprised of [VideoPollOptions](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/), which represent possible answers to the poll question.

## Create a Poll

To create a poll on a live video broadcast, send a request to:

[`POST /{live-video-id}/polls?question={question}&options={options}`](https://developers.facebook.com/docs/graph-api/reference/live-video/polls#Creating)

The targeted [LiveVideo](https://developers.facebook.com/docs/graph-api/reference/live-video) object must have a `status` of `LIVE` in order for the [VideoPoll](https://developers.facebook.com/docs/graph-api/reference/video-poll/) to be created. Upon success, the API will respond with the VideoPoll object's ID.

### Query String Parameters

- `{question}` — The poll question.
- `{options}` — An array of possible answers.

Refer to the [Live Video Polls](https://developers.facebook.com/docs/graph-api/reference/live-video/polls) edge reference for a complete list of query string parameters you can include when creating a poll.

### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens) | An access token of a User or Page who created the LiveVideo. |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | For a VideoPoll on a LiveVideo on a Group:<br>- [Groups API](https://developers.facebook.com/docs/apps/review/feature#reference-GROUPS_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | For a VideoPoll on a LiveVideo on a User:<br>- [`publish_video`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-video)<br>For a VideoPoll on a LiveVideo on a Page:<br>- [`pages_read_engagement`](https://developers.facebook.com/docs/pages/overview#permissions)<br>- [`pages_manage_posts`](https://developers.facebook.com/docs/pages/overview#permissions)<br>For a VideoPoll on a LiveVideo on a Group:<br>- [`publish_to_groups`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-to-groups) |

### Sample Request

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X POST \
  "https://graph.facebook.com/v3.3/10214959467675612/polls
    ?question=What%20kind%20of%20bear%20is%20best%3F
    &options=%5B%22Black%20bear%22%2C%20%22Brown%20bear%22%2C%20%22That's%20a%20ridiculous%20question%22%5D
    &access_token={access-token}"
```

```java
GraphRequest request = GraphRequest.newPostRequest(
  accessToken,
  "/10214959467675612/polls",
  new JSONObject("{\"question\":\"What kind of bear is best?\",\"options\":\"[\"Brown bear\", \"Black bear\", \"That is a stupid question\", \"Basically, there are two schools of thought\"]\"}"),
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
    initWithGraphPath:@"/10214959467675612/polls"\
           parameters:@{ @"question": @"What kind of bear is best?",@"options": @"['Brown bear', 'Black bear', 'That is a stupid question', 'Basically, there are two schools of thought']",}\
           HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/10214959467675612/polls',
  'POST',
  {"question":"What is the best bear?","options":"['Brown bear', 'Black bear', 'That is a stupid question', 'Basically, there are two schools of thought']"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->post(
    '/10214959467675612/polls',
    array (
      'question' => 'What is the best bear?',
      'options' => '["Brown bear", "Black bear", "That is a stupid question", "Basically, there are two schools of thought"]'
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

### Sample Response

```json
{
  "id": "2318567914888258"  // VideoPoll ID
}
```

## Close a Poll

To close a poll on a live video broadcast after a person has selected a poll option, send a request to:

[`POST /{video-poll-id}?action=CLOSE`](https://developers.facebook.com/docs/graph-api/reference/video-poll#Updating)

### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | An access token of a [User](https://developers.facebook.com/docs/graph-api/reference/user) who created the [VideoPoll](https://developers.facebook.com/docs/graph-api/reference/video-poll). |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | For a VideoPoll on a LiveVideo on a Group:<br>- [Groups API](https://developers.facebook.com/docs/apps/review/feature#reference-GROUPS_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | For a VideoPoll on a LiveVideo on a User:<br>- [`publish_video`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-video)<br>For a VideoPoll on a LiveVideo on a Page:<br>- [`pages_read_engagement`](https://developers.facebook.com/docs/pages/overview#permissions)<br>- [`page_manage_posts`](https://developers.facebook.com/docs/pages/overview#permissions)<br>For a VideoPoll on a LiveVideo on a Group:<br>- [`publish_to_groups`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-to-groups) |

### Sample Request

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X POST \
 "https://graph.facebook.com/{video-poll-id}?action=CLOSE&access_token={access-token}"
```

```java
GraphRequest request = GraphRequest.newPostRequest(
  accessToken,
  "/{video-poll-id}",
  new JSONObject("{\"action\":\"CLOSE\"}"),
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
    initWithGraphPath:@"/{video-poll-id}"\
           parameters:@{ @"action": @"CLOSE",}\
           HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/{video-poll-id}',
  'POST',
  {"action":"CLOSE"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->post(
    '/{video-poll-id}',
    array (
      'action' => 'CLOSE'
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

### Sample Response

```json
{
  "success": true
}
```

## Reopen a Poll

To reopen a closed poll so a person can change their poll option, send a request to:

[`POST /{video-poll-id}?action=SHOW_VOTING`](https://developers.facebook.com/docs/graph-api/reference/video-poll#Updating)

### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | An access token of a User who created the VideoPoll. |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | For a VideoPoll on a LiveVideo on a Group:<br>- [Groups API](https://developers.facebook.com/docs/apps/review/feature#reference-GROUPS_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | For a VideoPoll on a LiveVideo on a User:<br>- [`publish_video`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-video)<br>For a VideoPoll on a LiveVideo on a Page:<br>- [`pages_read_engagement`](https://developers.facebook.com/docs/pages/overview#permissions)<br>- [`pages_manage_posts`](https://developers.facebook.com/docs/pages/overview#permissions)<br>For a VideoPoll on a LiveVideo on a Group:<br>- [`publish_to_groups`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-to-groups) |

### Sample Request

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X POST \
 "https://graph.facebook.com/{video-poll-id}
   ?action=SHOW_VOTING
   &access_token={access-token}"
```

```java
GraphRequest request = GraphRequest.newPostRequest(
  accessToken,
  "/{video-poll-id}",
  new JSONObject("{\"action\":\"SHOW_VOTING\"}"),
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
    initWithGraphPath:@"/{video-poll-id}"\
           parameters:@{ @"action": @"SHOW_VOTING",}\
           HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/{video-poll-id}',
  'POST',
  {"action":"SHOW_VOTING"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->post(
    '/{video-poll-id}',
    array (
      'action' => 'SHOW_VOTING'
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

### Sample Response

```json
{
  "success": true
}
```

## Show Poll Results

To configure a poll to display results after a person has voted, send a request to:

[`POST /{video-poll-id}?action=SHOW_RESULTS`](https://developers.facebook.com/docs/graph-api/reference/video-poll#Updating)

### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | An access token of a User who created the VideoPoll. |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | For a VideoPoll on a LiveVideo on a Group:<br>- [Groups API](https://developers.facebook.com/docs/apps/review/feature#reference-GROUPS_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | For a VideoPoll on a LiveVideo on a User:<br>- [`publish_video`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-video)<br>For a VideoPoll on a LiveVideo on a Page:<br>- [`pages_read_engagement`](https://developers.facebook.com/docs/pages/overview#permissions)<br>- [`pages_manage_posts`](https://developers.facebook.com/docs/pages/overview#permissions)<br>For a VideoPoll on a LiveVideo on a Group:<br>- [`publish_to_groups`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-to-groups) |

### Sample Request

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X POST \
 "https://graph.facebook.com/{video-poll-id}
    ?action=SHOW_RESULTS
    &access_token={access-token}"
```

```java
GraphRequest request = GraphRequest.newPostRequest(
  accessToken,
  "/{video-poll-id}",
  new JSONObject("{\"action\":\"SHOW_RESULTS\"}"),
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
    initWithGraphPath:@"/{video-poll-id}"\
           parameters:@{ @"action": @"SHOW_RESULTS",}\
           HTTPMethod:@"POST"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/{video-poll-id}',
  'POST',
  {"action":"SHOW_RESULTS"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->post(
    '/{video-poll-id}',
    array (
      'action' => 'SHOW_RESULTS'
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

#### Sample Response

```json
{
  "success": true
}
```

## Get Poll Options

To get a poll's possible answers, send a request to:

[`GET /{video-poll-id}?fields=poll_options`](https://developers.facebook.com/docs/graph-api/reference/video-poll#Reading)

[`GET /{video-poll-id}/poll_options`](https://developers.facebook.com/docs/graph-api/reference/video-poll#Reading)

Refer to the [VideoPoll](https://developers.facebook.com/docs/graph-api/reference/video-poll/) reference for a list of available fields and edges.

### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | An access token of a User who created the VideoPoll. |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | For a VideoPoll on a LiveVideo on a Group:<br>- [Groups API](https://developers.facebook.com/docs/apps/review/feature#reference-GROUPS_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | For a VideoPoll on a LiveVideo on a User:<br>- [`publish_video`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-video)<br>For a VideoPoll on a LiveVideo on a Page:<br>- [`pages_read_engagement`](https://developers.facebook.com/docs/pages/overview#permissions)<br>- [`pages_manage_posts`](https://developers.facebook.com/docs/pages/overview#permissions)<br>For a VideoPoll on a LiveVideo on a Group:<br>- [`publish_to_groups`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-to-groups) |

### Sample Request

Gets a poll's possible answers:

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X GET \
 "https://graph.intern.facebook.com/{video-poll-id}/poll_options
   ?fields=poll_options
   &access_token={access-token}"
```

```java
GraphRequest request = GraphRequest.newGraphPathRequest(
  accessToken,
  "/{video-poll-id}",
  new GraphRequest.Callback() {
    @Override
    public void onCompleted(GraphResponse response) {
      // Insert your code here
    }
});

Bundle parameters = new Bundle();
parameters.putString("fields", "poll_options");
request.setParameters(parameters);
request.executeAsync();
```

```m
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
    initWithGraphPath:@"/{video-poll-id}"\
           parameters:@{ @"fields": @"poll_options",}\
           HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/{video-poll-id}',
  'GET',
  {"fields":"poll_options"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->get(
    '/{video-poll-id}',
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

### Sample Response

An object containing a list of possible answers (a list of [VideoPollOptions](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/)).

```json
{
  "poll_options":
    {
      "data": [\
        {\
          "text": "Brown bear",\
          "id": 145049637\
        },\
        {\
          "text": "Black bear",\
          "id": 145049638\
        }\
        {\
          "text": "That is a stupid question",\
          "id": 145049639\
        }\
        {\
          "text": "Basically, there are two schools of thought",\
          "id": 145049640\
        }\
      ]
    },
  "id": 12345
}
```

## Get Poll Option Votes

To get the number of votes on a poll option, send a request to:

[`GET /{video-poll-option-id}?fields=total_votes`](https://developers.facebook.com/docs/graph-api/reference/video-poll-option#Reading/)

### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | An access token of a User who created the VideoPollOption. |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | For a VideoPoll on a LiveVideo on a Group:<br>- [Groups API](https://developers.facebook.com/docs/apps/review/feature#reference-GROUPS_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | For a VideoPoll on a LiveVideo on a User:<br>- [`publish_video`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-video)<br>For a VideoPoll on a LiveVideo on a Page:<br>- [`pages_read_engagement`](https://developers.facebook.com/docs/pages/overview#permissions)<br>- [`pages_manage_posts`](https://developers.facebook.com/docs/pages/overview#permissions)<br>For a VideoPoll on a LiveVideo on a Group:<br>- [`publish_to_groups`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-to-groups) |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | The same access token used to create the LiveVideo or Broadcast. |

### Sample Request

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X GET \
 "https://graph.facebook.com/{video-poll-option-id}
   ?fields=total_votes
   &access_token={access-token}"
```

```java
GraphRequest request = GraphRequest.newGraphPathRequest(
  accessToken,
  "/{video-poll-option-id}",
  new GraphRequest.Callback() {
    @Override
    public void onCompleted(GraphResponse response) {
      // Insert your code here
    }
});

Bundle parameters = new Bundle();
parameters.putString("fields", "total_votes");
request.setParameters(parameters);
request.executeAsync();
```

```m
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
    initWithGraphPath:@"/{video-poll-option-id}"\
           parameters:@{ @"fields": @"total_votes",}\
           HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/{video-poll-option-id}',
  'GET',
  {"fields":"total_votes"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->get(
    '/{video-poll-option-id}',
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

### Sample Response

```json
    {
  "total_votes": 129,
  "id": "{video-poll-option}"
}
```

## Get All Poll Option Votes

To get the number of votes for each of the possible answers on a poll, use field expansion on the `poll_options` field to have the response include the `total_votes` field on any [VideoPollOptions](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/) that are returned:

[`GET /{video-poll-id}?fields=poll_options{total_votes}`](https://developers.facebook.com/docs/graph-api/reference/video-poll#Reading)

### Requirements

| Type | Description |
| --- | --- |
| [Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) | An access token of a User who created the LiveVideo. |
| [Features](https://developers.facebook.com/docs/apps/review/feature) | For a VideoPoll on a LiveVideo on a Group:<br>- [Groups API](https://developers.facebook.com/docs/apps/review/feature#reference-GROUPS_ACCESS) |
| [Permissions](https://developers.facebook.com/docs/apps/review/login-permissions) | For a VideoPoll on a LiveVideo on a User:<br>- [`publish_video`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-video)<br>For a VideoPoll on a LiveVideo on a Page:<br>- [`pages_read_engagement`](https://developers.facebook.com/docs/pages/overview#permissions)<br>- [`pages_manage_posts`](https://developers.facebook.com/docs/pages/overview#permissions)<br>For a VideoPoll on a LiveVideo on a Group:<br>- [`publish_to_groups`](https://developers.facebook.com/docs/apps/review/login-permissions#publish-to-groups) |

### Sample Request

Gets all of the [VideoPollOptions](https://developers.facebook.com/docs/graph-api/reference/video-poll-option/) and their `text` and `total_votes` fields on a [VideoPoll](https://developers.facebook.com/docs/graph-api/reference/video-poll/).

cURLAndroid SDKObjective-CJava SDKPHP SDK

```sh
curl -i -X GET \
 "https://graph.intern.facebook.com/{video-poll-id}
   ?fields=poll_options{text,total_votes}
   &access_token={access-token}"
```

```java
GraphRequest request = GraphRequest.newGraphPathRequest(
  accessToken,
  "/{video-poll-id}",
  new GraphRequest.Callback() {
    @Override
    public void onCompleted(GraphResponse response) {
      // Insert your code here
    }
});

Bundle parameters = new Bundle();
parameters.putString("fields", "poll_options{text,total_votes}");
request.setParameters(parameters);
request.executeAsync();
```

```m
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
    initWithGraphPath:@"/{video-poll-id}"\
           parameters:@{ @"fields": @"poll_options{text,total_votes}",}\
           HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection, id result, NSError *error) {\
    // Insert your code here\
}];
```

```java
FB.api(
  '/{video-poll-id}',
  'GET',
  {"fields":"poll_options{text,total_votes}"},
  function(response) {
      // Insert your code here
  }
);
```

```cpp
try {
  // Returns a `FacebookFacebookResponse` object
  $response = $fb->get(
    '/{video-poll-id}',
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

### Sample Response

```json
{
  "poll_options":
    {
      "data": [\
        {\
          "text": "Brown Bear",\
          "total_votes": 12,\
          "id": 145049637\
        },\
        {\
          "text": "Black Bear",\
          "total_votes": 87,\
          "id": 67890\
        }\
        {\
          "text": "That's a stupid question",\
          "total_votes": 45,\
          "id": 145049639\
        }\
        {\
          "text": "Basically, there are two schools of thought",\
          "total_votes": 12,\
          "id": 145049640\
        }\
      ]
    },
  "id": 12345
}
```

On This Page

[Polls](https://developers.facebook.com/docs/live-video-api/polls#polls)

[Create a Poll](https://developers.facebook.com/docs/live-video-api/polls#create-a-poll)

[Query String Parameters](https://developers.facebook.com/docs/live-video-api/polls#query-string-parameters)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response)

[Close a Poll](https://developers.facebook.com/docs/live-video-api/polls#close-a-poll)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-2)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-2)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-2)

[Reopen a Poll](https://developers.facebook.com/docs/live-video-api/polls#reopen-a-poll)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-3)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-3)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-3)

[Show Poll Results](https://developers.facebook.com/docs/live-video-api/polls#show-poll-results)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-4)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-4)

[Get Poll Options](https://developers.facebook.com/docs/live-video-api/polls#get-poll-options)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-5)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-5)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-4)

[Get Poll Option Votes](https://developers.facebook.com/docs/live-video-api/polls#get-poll-option-votes)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-6)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-6)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-5)

[Get All Poll Option Votes](https://developers.facebook.com/docs/live-video-api/polls#get-all-poll-option-votes)

[Requirements](https://developers.facebook.com/docs/live-video-api/polls#requirements-7)

[Sample Request](https://developers.facebook.com/docs/live-video-api/polls#sample-request-7)

[Sample Response](https://developers.facebook.com/docs/live-video-api/polls#sample-response-6)