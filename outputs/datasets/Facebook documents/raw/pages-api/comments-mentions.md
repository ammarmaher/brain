---
url: https://developers.facebook.com/docs/pages-api/comments-mentions/
title: Comments and @Mentions - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2Fcomments-mentions%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook Pages API](https://developers.facebook.com/docs/pages-api)

- [Overview](https://developers.facebook.com/docs/pages-api/overview)
- [Create an app](https://developers.facebook.com/docs/pages-api/create-an-app)
- [Webhooks](https://developers.facebook.com/docs/pages-api/webhooks-for-pages)
- [Get Started](https://developers.facebook.com/docs/pages-api/getting-started)
- [Manage a Page](https://developers.facebook.com/docs/pages-api/manage-pages)
- [Upcoming Changes](https://developers.facebook.com/docs/pages/upcoming-changes)
- [Comments and @Mentions](https://developers.facebook.com/docs/pages-api/comments-mentions)
- [Posts](https://developers.facebook.com/docs/pages-api/posts)
- [Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook)
- [Insights](https://developers.facebook.com/docs/platforminsights/page)
- [Search Pages](https://developers.facebook.com/docs/pages-api/search-pages)
- [Error Codes](https://developers.facebook.com/docs/pages-api/error-codes)
- [Changelog](https://developers.facebook.com/docs/pages-api/changelog)

On This Page

[Comments and @mentions](https://developers.facebook.com/docs/pages-api/comments-mentions/#comments-and--mentions)

[Before you start](https://developers.facebook.com/docs/pages-api/comments-mentions/#before-you-start)

[Best Practices](https://developers.facebook.com/docs/pages-api/comments-mentions/#best-practices)

[Comments](https://developers.facebook.com/docs/pages-api/comments-mentions/#comments)

[Comment on a Post](https://developers.facebook.com/docs/pages-api/comments-mentions/#comment-on-a-post)

[Comment on a comment](https://developers.facebook.com/docs/pages-api/comments-mentions/#comment-on-a-comment)

[@mention or tag](https://developers.facebook.com/docs/pages-api/comments-mentions/#-mention-or-tag)

[Limitations](https://developers.facebook.com/docs/pages-api/comments-mentions/#limitations)

[Reply to a Post](https://developers.facebook.com/docs/pages-api/comments-mentions/#reply-to-a-post)

[Reply to a Comment](https://developers.facebook.com/docs/pages-api/comments-mentions/#reply-to-a-comment)

[Next Steps](https://developers.facebook.com/docs/pages-api/comments-mentions/#next-steps)

[See Also](https://developers.facebook.com/docs/pages-api/comments-mentions/#see-also)

# Comments and @mentions

This guide explains how to comment on a Facebook Page post or comment on a Facebook Page post and @mention or tag a specific person or Page who has published a post on your Page or commented on a Page post using the Pages API from Meta.

## Before you start

This guide assumes you have read the [Overview](https://developers.facebook.com/docs/pages/overview) and the [Posts guide](https://developers.facebook.com/docs/pages/publishing) for the Facebook Pages API.

#### Permissions

For a person who can perform tasks on the page, you will need to implement Facebook Login or Business on your app to ask for the following permissions and receive a Page access token:

- `pages_manage_engagement`
- `pages_read_engagement`
- `pages_read_user_engagement`

#### Page tasks

Your app user must be able to perform the following tasks on the in the API requests:

- `MODERATE`
- `CREATE_CONTENT`

#### Page features

Your app will need the following features:

- Page Mentioning

#### IDs

- The Page Post ID for the Page post
- The Page-scoped ID for the person who created the Page post or comment, if you want to @mention that person

### Best Practices

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

## Comments

You can comment on a Page post or a comment on a comment. The author of the comment will be the Page.

#### Limitations

- If a Page is unpublished no one will be able to comment on a Page post or comment.
- If you try to comment as a User you will see a `1705` error code with `"message":"(#1705) There was an error posting to this wall"`.

### Comment on a Post

To comment on a Page post, send a `POST` request to the `/page_post_id/comments` endpoint with the `message` parameter set to the content for your comment.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_post\_id**, with your values._

```curl
curl -i -X POST "https://graph.facebook.comv25.0/page_post_id/comments" \
     -H "Content-Type: application/json" \
     -d '{
           "message":"your_message_text",
         }'
```

On success, your app receives the following JSON response with `id` set to the comment ID:

```json
{
  "id":"comment_id"
}
```

### Comment on a comment

To comment on a comment, you will need to get the comments for a Page post, then get the ID for the comment you want to comment on.

#### Get comments

To get the comments for a Page post, send a `GET` request to the `/page_post_id/comments` endpoint with the `fields` parameter set to a comma-separated list that includes the `message` field, to get the content for the comment and the `from` field, to get the Page-scoped ID (PSID) for the person or Page who commented on the post, if you would like to @mention the person or Page in the comment.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_post\_id**, with your values._

```code
curl -i -X GET "https://graph.facebook.com/page_post_id/comments?fields=from,message"
```

On success, your app receives the following JSON response with the commentor's name, PSID, message and the comment ID:

```json
{
  "data": [\
    {\
      "created_time": "2020-02-19T23:05:53+0000",\
      "from": {\
        "name": "commentor_name",\
        "id": "commentor_PSID"\
      },\
      "message": "comment_content",\
     "id": "comment_id"\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "MQZDZD",
      "after": "MQZDZD"
    }
  }
}
```

## @mention or tag

You can reply to a specific person or Facebook Page by mentioning, or tagging, the person in a comment. A notification will be sent to the person who has been mentioned by the Page. The most common uses for @mentions are:

- Replying to a specific Facebook Page or person who commented on a Page post or Page post comment that received multiple comments
- Batch replying to multiple people who commented on a Page post or commented on a Page post comment.

### Limitations

- In the **Settings** of your Page, you must have allowed **Others Tagging this Page**.
- A Page can only mention a person if the person commented on a Page post or if the person created the Page post.

#### Testing

When testing your app before going live, you must be an admin or a developer of the app and use Pages (both to make the API call, and to be used in a mention) for which you are an admin.

### Reply to a Post

To mention a person or a Page who published a post on your Facebook Page, send a `POST` request to the ID for the Page post with the `message` parameter set to your comment content that includes the `@` symbol with the person's PSID or the Page's ID.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_post\_id**, with your values._

```curl
curl -i -X POST "https://graph.facebook.comv25.0/page_post_id" \
     -H "Content-Type: application/json" \
     -d '{
           "message":"your_message_text @[PSID]",
         }'
```

On success, your app receives the following JSON response with `id` set to the ID for your comment:

```json
{
  "id":"comment_id"
}
```

### Reply to a Comment

To mention a person or a Page who commented on your Facebook Page post, send a `POST` request to the ID for the comment with the `message` parameter set to your comment content that includes the `@` symbol followed by an an array with the person's PSID or the Page's ID.

To mention multiple people, use an array of a comma-separated of PSIDs.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_post\_id**, with your values._

```curl
curl -i -X POST "https://graph.facebook.comv25.0/comment_id" \
     -H "Content-Type: application/json" \
     -d '{
           "message":"your_message_text @[PSID,PSID,PSID]",
         }'
```

On success, your app receives the following JSON response with `id` set to the ID for your comment:

```json
{
  "id":"comment_id"
}
```

## Next Steps

Learn how to [start conversations with people](https://developers.facebook.com/docs/messenger-platform/) who are interested in your Page and how to [send a private reply](https://developers.facebook.com/docs/messenger-platform/discovery/private-replies) to a specific person who has posted or commmented on your Page.

## See Also

- [How do People Mention Your Page - Facebook Help Center](https://www.facebook.com/help/218027134882349?helpref=search&sr=1&query=mention%20a%20page)
- [Comment Comments Reference Guide](https://developers.facebook.com/docs/graph-api/reference/object/comments/#publish)
- [Page Post Comments Reference Guide](https://developers.facebook.com/docs/graph-api/reference/page-post)

On This Page

[Comments and @mentions](https://developers.facebook.com/docs/pages-api/comments-mentions/#comments-and--mentions)

[Before you start](https://developers.facebook.com/docs/pages-api/comments-mentions/#before-you-start)

[Best Practices](https://developers.facebook.com/docs/pages-api/comments-mentions/#best-practices)

[Comments](https://developers.facebook.com/docs/pages-api/comments-mentions/#comments)

[Comment on a Post](https://developers.facebook.com/docs/pages-api/comments-mentions/#comment-on-a-post)

[Comment on a comment](https://developers.facebook.com/docs/pages-api/comments-mentions/#comment-on-a-comment)

[@mention or tag](https://developers.facebook.com/docs/pages-api/comments-mentions/#-mention-or-tag)

[Limitations](https://developers.facebook.com/docs/pages-api/comments-mentions/#limitations)

[Reply to a Post](https://developers.facebook.com/docs/pages-api/comments-mentions/#reply-to-a-post)

[Reply to a Comment](https://developers.facebook.com/docs/pages-api/comments-mentions/#reply-to-a-comment)

[Next Steps](https://developers.facebook.com/docs/pages-api/comments-mentions/#next-steps)

[See Also](https://developers.facebook.com/docs/pages-api/comments-mentions/#see-also)