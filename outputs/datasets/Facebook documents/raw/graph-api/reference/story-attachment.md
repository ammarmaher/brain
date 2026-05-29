---
url: https://developers.facebook.com/docs/graph-api/reference/story-attachment/
title: Graph API Reference v25.0: Story Attachment
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fstory-attachment%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Story Attachment](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#fields)

[Edges](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#edges)

[Creating](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#)

# Story Attachment

## Reading

Attachment on a story or comment

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=...%3Ffields%3D%257Bfieldname_of_type_StoryAttachment%257D&version=v25.0)

```
GET v25.0/...?fields={fieldname_of_type_StoryAttachment} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '...?fields={fieldname_of_type_StoryAttachment}',
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
    "...?fields={fieldname_of_type_StoryAttachment}",
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
    "...?fields={fieldname_of_type_StoryAttachment}",
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
                               initWithGraphPath:@"...?fields={fieldname_of_type_StoryAttachment}"\
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

This endpoint doesn't have any parameters.

### Fields

| Field | Description |
| --- | --- |
| `description`<br>string | Text accompanying the attachment<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `description_tags`<br>[list<EntityAtTextRange>](https://developers.facebook.com/docs/graph-api/reference/entity-at-text-range/) | Profiles tagged in the text accompanying the attachment<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `media`<br>[StoryAttachmentMedia](https://developers.facebook.com/docs/graph-api/reference/story-attachment-media/) | Media object (photo, link etc.) contained in the attachment<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `media_type`<br>string | Type of the media such as (photo, video, link etc) |
| `target`<br>[StoryAttachmentTarget](https://developers.facebook.com/docs/graph-api/reference/story-attachment-target/) | Object that the attachment links to<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `title`<br>string | Title of the attachment<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `type`<br>string | Type of the attachment. Possible types include: `album`, `animated_image_autoplay`, `checkin`, `cover_photo`, `event`, `link`, `multiple`, `music`, `note`, `offer`, `photo`, `profile_media`, `status`, `video`, `video_autoplay`, etc.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `unshimmed_url`<br>uri | Unshimmed URL of the attachment |
| `url`<br>uri | URL of the attachment<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

### Edges

| Edge | Description |
| --- | --- |
| [`subattachments`](https://developers.facebook.com/docs/graph-api/reference/story-attachment/subattachments/)<br>Edge<StoryAttachment> | Any subattachments associated with the attachment<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Story Attachment](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#Reading)

[Example](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#fields)

[Edges](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#edges)

[Creating](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/story-attachment/#Deleting)