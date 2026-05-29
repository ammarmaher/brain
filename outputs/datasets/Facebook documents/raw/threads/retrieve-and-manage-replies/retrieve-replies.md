---
url: https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/retrieve-replies
title: Retrieve User Replies - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fretrieve-and-manage-replies%2Fretrieve-replies%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Retrieve User Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/retrieve-replies#retrieve-user-replies)

[Retrieve a List of a User's Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/retrieve-replies#retrieve-a-list-of-a-user-s-replies)

[Fields](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/retrieve-replies#fields)

# Retrieve User Replies

You can retrieve a list of a user's replies.

## Retrieve a List of a User's Replies

Use the `GET /{threads-user-id}/replies` endpoint to return a paginated list of all replies created by a user.

### Fields

Here's a list of fields that can be returned for each reply.

| Name | Description |
| --- | --- |
| `id` _(default)_ | The media's ID. |
| `text` | Represents text for a Threads reply. This is optional on image, video, and carousel replies. |
| `username` | Threads username who created the post.<br>**Note:** This only works for public users and your own user. |
| `permalink` | Permanent link to the post. Will be omitted if the media contains copyrighted material or has been flagged for a copyright violation.<br>**Note:** This only works for public users and your own user. |
| `timestamp` | The publish date and time of the post in ISO 8601 format. |
| `media_product_type` | Surface where the media is published. In the case of Threads, the value is `THREADS`. |
| `media_type` | The media type for a Threads reply will be one of these values: `TEXT_POST`, `IMAGE`, `VIDEO`, `CAROUSEL_ALBUM`, or `AUDIO`. |
| `media_url` | The post’s media URL. This only shows for image, video, and carousel replies. |
| `shortcode` | Shortcode of the media. |
| `thumbnail_url` | URL of thumbnail. This only shows for Threads replies with video. |
| `children` | List of child posts. This only shows for carousel replies. |
| `is_quote_post` | Indicates if the media is a quoted reply made by another user. |
| `quoted_post` | Media ID of the post that was quoted.<br>**Note**: This only appears on quote posts. |
| `has_replies` | `true` if the Threads post or reply has replies that you can see. |
| `root_post` | Media ID of the top-level post or original thread in the reply tree.<br>**Note:** This only appears on replies. |
| `replied_to` | Media ID of the immediate parent of the reply.<br>**Note:** This only appears on replies. |
| `is_reply` | `true` if the Threads media is a reply. `false` if the Threads media is a top-level post. |
| `is_reply_owned_by_me` | `true` if your user is the owner of the Threads reply. `false` if another user is the owner of the Threads reply.<br>**Note:** This only appears on replies. |
| `reply_audience` | Who can reply to your post.<br>**Values:**`EVERYONE`, `ACCOUNTS_YOU_FOLLOW`, `MENTIONED_ONLY`, `PARENT_POST_AUTHOR_ONLY`, `FOLLOWERS_ONLY`<br>**Note:** This only appears on top-level posts and replies that you own. |
| `gif_url` | The URL of the GIF attached to the post (if any).<br>**Note:** This will only show up on posts that have a GIF attachment. |
| `poll_attachment` | The poll attachment for the post.<br>**Note:** This will only show up on posts that have a poll. |
| `topic_tag` | The topic tag for the post (if any).<br>**Note:** This will only show up on posts that have a topic tag. |
| `is_verified` | Returns `true` if the post author's profile is verified on Threads. |
| `profile_picture_url` | Returns the URL of the post author's profile picture on Threads. |

#### Example Request

```code
curl -s -X GET \
  "https://graph.threads.net/v1.0/me/replies?fields=id,media_product_type,media_type,media_url,permalink,username,text,topic_tag,timestamp,shortcode,thumbnail_url,children,is_quote_post,has_replies,root_post,replied_to,is_reply,is_reply_owned_by_me,reply_audience&since=2023-10-15&until=2023-11-18&limit=1&access_token=<ACCESS_TOKEN>"
```

#### Examples Response

```code
{
  "data": [\
    {\
      "id": "1234567",\
      "media_product_type": "THREADS",\
      "media_type": "TEXT_POST",\
      "permalink": "https://www.threads.net/@threadsapitestuser/post/abcdefg",\
      "username": "threadsapitestuser",\
      "text": "Reply Text",\
      "topic_tag": "Reply Topic",\
      "timestamp": "2023-10-17T05:42:03+0000",\
      "shortcode": "abcdefg",\
      "is_quote_post": false,\
      "has_replies": false,\
      "root_post": {\
        "id": "1234567890"\
      },\
      "replied_to": {\
        "id": "1234567890"\
      },\
      "is_reply": true,\
      "is_reply_owned_by_me": true,\
      "reply_audience": "EVERYONE"\
    },\
  ],
  "paging": {
    "cursors": {
      "before": "BEFORE_CURSOR",
      "after": "AFTER_CURSOR"
    }
  }
}
```

On This Page

[Retrieve User Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/retrieve-replies#retrieve-user-replies)

[Retrieve a List of a User's Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/retrieve-replies#retrieve-a-list-of-a-user-s-replies)

[Fields](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/retrieve-replies#fields)