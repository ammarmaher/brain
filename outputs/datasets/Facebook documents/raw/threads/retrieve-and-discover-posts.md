---
url: https://developers.facebook.com/docs/threads/retrieve-and-discover-posts
title: Retrieve and Discover Posts - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fretrieve-and-discover-posts%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)


  - [Retrieve User Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts/retrieve-posts)
  - [Mentions](https://developers.facebook.com/docs/threads/threads-mentions)
  - [Keyword Search](https://developers.facebook.com/docs/threads/keyword-search)

- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)
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

[Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#retrieve-and-discover-posts)

[Pagination](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#pagination)

[Example Request](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#example-request)

[Example Response](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#example-response)

[Next Steps](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#next-steps)

# Retrieve and Discover Posts

You can search for posts using the keyword search or retrieve posts and mentions related to a specific user.

## Pagination

Retrieving a user's posts and mentions supports cursor-based pagination so the response will include `before` and `after` cursors if the response contains multiple pages of data. Unlike standard cursor-based pagination, however, the response will not include previous or next fields, so you will have to use the `before` and `after` cursors to construct previous and next query strings manually in order to page through the returned data set.

### Example Request

```code
curl -s -X GET \
  https://graph.threads.net/17841405822304914/mentions?fields=id,username&access_token=EAADd...
```

### Example Response

```code
{
  "data": [\
    {\
      "id": "18038...",\
      "username": "keldo..."\
    },\
    {\
      "id": "17930...",\
      "username": "ashla..."\
    },\
    {\
      "id": "17931...",\
      "username": "jaypo..."\
    }\
  ]
}
```

## Next Steps

- [Retrieve Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts/retrieve-posts)
- [Mentions](https://developers.facebook.com/docs/threads/threads-mentions)
- [Keyword Search](https://developers.facebook.com/docs/threads/keyword-search)

On This Page

[Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#retrieve-and-discover-posts)

[Pagination](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#pagination)

[Example Request](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#example-request)

[Example Response](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#example-response)

[Next Steps](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts#next-steps)