---
url: https://developers.facebook.com/docs/threads/reply-management
title: Reply Management - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freply-management%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)


  - [Retrieve User Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/retrieve-replies)
  - [Retrieve Media Replies and Conversations](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/replies-and-conversations)
  - [Reply Management](https://developers.facebook.com/docs/threads/reply-management)

- [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts)
- [Profiles](https://developers.facebook.com/docs/threads/threads-profiles)
- [Insights](https://developers.facebook.com/docs/threads/insights)
- [Webhooks](https://developers.facebook.com/docs/threads/webhooks)
- [oEmbed](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post)
- [Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents)
- [Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting)
- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Reply Management](https://developers.facebook.com/docs/threads/reply-management#reply-management)

[Hide Replies](https://developers.facebook.com/docs/threads/reply-management#hide-replies)

[Control Who Can Reply](https://developers.facebook.com/docs/threads/reply-management#control-who-can-reply)

[Reply Approvals](https://developers.facebook.com/docs/threads/reply-management#reply-approvals)

[Limitations](https://developers.facebook.com/docs/threads/reply-management#limitations)

[Create a post with reply approvals enabled](https://developers.facebook.com/docs/threads/reply-management#create-a-post-with-reply-approvals-enabled)

[Retrieve pending replies](https://developers.facebook.com/docs/threads/reply-management#retrieve-pending-replies)

[Manage pending replies](https://developers.facebook.com/docs/threads/reply-management#manage-pending-replies)

# Reply Management

The Threads Reply Management API allows you manage replies to users' own Threads by [hiding replies](https://developers.facebook.com/docs/threads/reply-management#hide-replies), [controlling who can reply](https://developers.facebook.com/docs/threads/reply-management#control-who-can-reply), and using [reply approvals](https://developers.facebook.com/docs/threads/reply-management#reply-approvals).

## Hide Replies

Use the `/manage_reply` endpoint to hide/unhide any top-level replies. This will automatically hide/unhide all the nested replies. **Note:** Replies nested deeper than the top-level reply cannot be targeted in isolation to be hidden/unhidden.

#### Example Request

```code
curl -X POST \
  -F "hide={true | false}" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_REPLY_ID>/manage_reply"
```

#### Example Response

```code
{
 "success": true
}
```

## Control Who Can Reply

Use the `reply_control` parameter to specify who can reply to a post being created for publishing. This parameter accepts one of the five options: `everyone`, `accounts_you_follow`, `mentioned_only`, `parent_post_author_only`, and `followers_only`.

#### Example Request

```code
curl -X POST \
  -F "media_type=<MEDIA_TYPE>" \
  -F "text=<TEXT>" \
  -F "reply_control=accounts_you_follow" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/me/threads"
```

#### Example Response

```code
{
 "id": "1234567890"
}
```

Use the `POST /{threads-user-id}/threads_publish` endpoint to publish the media container ID returned in the previous step. It is recommended to wait on average 30 seconds before publishing a Threads media container to give our server enough time to fully process the upload. See the [media container status endpoint](https://developers.facebook.com/docs/threads/troubleshooting#publishing-does-not-return-a-media-id) for more details.

#### Parameters

- `creation_id` — Identifier of the Threads media container created from the `/threads` endpoint.

#### Example Request

```curl
curl -i -X POST \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads_publish?creation_id=<MEDIA_CONTAINER_ID>&access_token=<ACCESS_TOKEN>"
```

#### Example Response

```json
{
  "id": "1234567" // Threads Media ID
}
```

## Reply Approvals

You can create posts with reply approvals enabled using the Threads API. Replies to these posts must be approved to get published and are hidden until then.

### Limitations

- Reply approvals can not be enabled for [ghost posts](https://developers.facebook.com/docs/threads/create-posts/ghost-posts).

### Create a post with reply approvals enabled

#### Step 1: Create a Threads media container

You can enable reply approvals on a post by making a request to the `POST /{threads-user-id}/threads` endpoint to create a media container with the `enable_reply_approvals` parameter set to `true`.

##### Example request

```html
curl -i -X POST \
  -d "media_type=TEXT" \
  -d "text=<TEXT>" \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "enable_reply_approvals=true" \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads"
```

##### Example response

```json
{
  "id": "<MEDIA_CONTAINER_ID>"
}
```

#### Step 2: Publish the media container

Use the returned Threads media container ID to [publish your Threads post](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container) with reply approvals enabled.

### Retrieve pending replies

Make a request to the `GET /{threads-media-id}/pending_replies` endpoint to fetch a paginated list of all pending replies.

The default behavior will return all pending and ignored replies. The `approval_status` parameter can be used to filter which replies get returned.

#### Parameters

| Name | Description |
| --- | --- |
| `reverse`<br>Boolean | **Optional.**<br>**Values:**<br>- `true` ( _default_) — Replies should be sorted in reverse chronological order. <br>- `false` — Replies should be sorted in chronological order. |
| `approval_status`<br>string | **Optional.**<br>**Values:** ( _case-sensitive_)<br>- `pending` — Show only pending replies.<br>- `ignored` — Show only ignored replies.<br>**Note:** The default is to show all replies. |

#### Fields

All the [existing fields](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/replies-and-conversations) from existing replies endpoints apply with a new field to fetch pending reply approval status.

| Name | Description |
| --- | --- |
| `reply_approval_status` | Approval status of a pending reply.<br>**Values:**`pending`, `ignored` |

##### Example request

```html
curl -s -X GET \
    -d "fields=id,text,topic_tag,timestamp,media_product_type,media_type,media_url,shortcode,thumbnail_url,children,has_replies,root_post,replied_to,is_reply,hide_status,reply_approval_status" \
    -d "reverse=false" \
    -d "access_token=<ACCESS_TOKEN>"
"https://graph.threads.net/v1.0/<MEDIA_ID>/pending_replies"
```

##### Example response

```json
{
  "data": [\
    {\
      "id": "<MEDIA_ID>",\
      "text": "ignored reply",\
      "timestamp": "<TIMESTAMP>",\
      "media_product_type": "THREADS",\
      "media_type": "TEXT_POST",\
      "shortcode": "<SHORT_CODE>",\
      "has_replies": false,\
      "is_reply": true,\
      "hide_status": "NOT_HUSHED",\
      "reply_approval_status": "ignored"\
    },\
    {\
      "id": "<MEDIA_ID>",\
      "text": "pending reply",\
      "timestamp": "<TIMESTAMP>",\
      "media_product_type": "THREADS",\
      "media_type": "TEXT_POST",\
      "shortcode": "<SHORT_CODE>",\
      "has_replies": false,\
      "is_reply": true,\
      "hide_status": "NOT_HUSHED",\
      "reply_approval_status": "pending"\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "<BEFORE_CURSOR>",
      "after": "<AFTER_CURSOR>"
    }
  }
}
```

### Manage pending replies

Use the `/manage_pending_reply` endpoint to approve/ignore any pending replies.

**Note:** Ignored replies can still be approved.

#### Example request

```html
curl -X POST \
  -F "approve={true|false}" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/<THREADS_REPLY_ID>/manage_pending_reply"
```

#### Example response

```json
{
 "success": true
}
```

On This Page

[Reply Management](https://developers.facebook.com/docs/threads/reply-management#reply-management)

[Hide Replies](https://developers.facebook.com/docs/threads/reply-management#hide-replies)

[Control Who Can Reply](https://developers.facebook.com/docs/threads/reply-management#control-who-can-reply)

[Reply Approvals](https://developers.facebook.com/docs/threads/reply-management#reply-approvals)

[Limitations](https://developers.facebook.com/docs/threads/reply-management#limitations)

[Create a post with reply approvals enabled](https://developers.facebook.com/docs/threads/reply-management#create-a-post-with-reply-approvals-enabled)

[Retrieve pending replies](https://developers.facebook.com/docs/threads/reply-management#retrieve-pending-replies)

[Manage pending replies](https://developers.facebook.com/docs/threads/reply-management#manage-pending-replies)