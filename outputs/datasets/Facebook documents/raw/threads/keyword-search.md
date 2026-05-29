---
url: https://developers.facebook.com/docs/threads/keyword-search/
title: Keyword Search - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fkeyword-search%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Keyword and Topic Tag Search](https://developers.facebook.com/docs/threads/keyword-search/#keyword-and-topic-tag-search)

[Keyword Search](https://developers.facebook.com/docs/threads/keyword-search/#keyword-search)

[Parameters](https://developers.facebook.com/docs/threads/keyword-search/#parameters)

[Example Request](https://developers.facebook.com/docs/threads/keyword-search/#example-request)

[Example Response](https://developers.facebook.com/docs/threads/keyword-search/#example-response)

[Topic Tag Search](https://developers.facebook.com/docs/threads/keyword-search/#topic-tag-search)

[Example Request](https://developers.facebook.com/docs/threads/keyword-search/#example-request-2)

[Example Response](https://developers.facebook.com/docs/threads/keyword-search/#example-response-2)

[Search by Media Type](https://developers.facebook.com/docs/threads/keyword-search/#search-by-media-type)

[Example Request](https://developers.facebook.com/docs/threads/keyword-search/#example-request-3)

[Example Response](https://developers.facebook.com/docs/threads/keyword-search/#example-response-3)

[Interacting with Public Threads](https://developers.facebook.com/docs/threads/keyword-search/#interacting-with-public-threads)

[Recently Searched Keywords](https://developers.facebook.com/docs/threads/keyword-search/#recently-searched-keywords)

[Example Request](https://developers.facebook.com/docs/threads/keyword-search/#example-request-4)

[Example Response](https://developers.facebook.com/docs/threads/keyword-search/#example-response-4)

# Keyword and Topic Tag Search

Search for public Threads media with specific keywords or by topic tag.

### Limitations

- A user can send a maximum of 2,200 queries within a rolling 24-hour period. Once a query is sent, it will count against this limit for 24 hours.
- This limit applies to a user across apps and is not differentiated for different apps. If multiple apps send requests for the same user, those queries will apply to the same limit for that user.
- Subsequent queries against the same keyword within this timeframe will also count against this limit.
- Queries which return no results do not count against this limit for the user. If no results are returned, consider refining or shortening your query.
- The API will return an empty array for any requests that include keywords that we have deemed sensitive or offensive.

### Permissions

The Threads Keyword Search API requires an appropriate access token and permissions. While you are testing, you can easily generate tokens and grant your app permissions by using the Graph API Explorer.

- `threads_basic` — Required for making any calls to all Threads API endpoints.
- `threads_keyword_search` — Required for making GET calls to the keyword search endpoint.

If your app has not been approved for the `threads_keyword_search` permission, the search will be performed only on posts owned by the authenticated user. After approval, public posts will be searchable.

## Keyword Search

To search for public Threads media by keyword, send a `GET` request to the `/keyword_search` endpoint with a keyword to be queried.

### Parameters

| Name | Description |
| --- | --- |
| `q`<br>string | **Required.**<br>The keyword(s) to be queried. |
| `search_type`<br>string | **Optional.**<br>Specifies the search behavior.<br>**Values:**<br>- `TOP` ( _default_) — To get the most popular search results.<br>- `RECENT` — To get the most recent search results. |
| `search_mode`<br>string | **Optional.**<br>Specifies the search mode.<br>**Values:**<br>- `KEYWORD` ( _default_) — The query will be treated as a keyword.<br>- `TAG` — The query will be treated as a topic tag. |
| `media_type`<br>string | **Optional.**<br>Specifies the type of media to search for. Only the media type values listed below are supported.<br>**Values:**<br>- `TEXT` — The query will search for text posts.<br>- `IMAGE` — The query will search for image posts.<br>- `VIDEO` — The query will search for video posts. |
| `since` | **Optional.**<br>Query string parameter representing the start date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be greater than or equal to `1688540400` and less than the `until` parameter). |
| `until` | **Optional.**<br>Query string parameter representing the end date for retrieval (must be a Unix timestamp or a date/time representation parseable by `strtotime();`, the timestamp must be less than or equal to the current timestamp and greater than the `since` parameter). |
| `limit` | **Optional.**<br>Query string parameter representing the maximum number of media objects or records requested to return, default is **25** and maximum is **100** (only non-negative numbers are allowed). |
| `author_username` | **Optional.**<br>Filters search results to include only posts created by the specified username or profile. The username must be an exact match without the `@` symbol. |

See the [Media](https://developers.facebook.com/docs/threads/threads-media) documentation for a list of available fields. **Note:** The owner field is excluded and will not be returned.

### Example Request

```code
curl -s -X GET \
  -F "q=<KEYWORD>" \
  -F "search_type=TOP" \
  -F "fields=id,text,media_type,permalink,timestamp,username,has_replies,is_quote_post,is_reply" \
  -F "access_token=<THREADS_ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/keyword_search"
```

### Example Response

```code
{
  "data": [\
    {\
      "id": "1234567890",\
      "text": "first thread",\
      "media_type": "TEXT",\
      "permalink": "https://www.threads.net/@<USER>/post/abcdefg",\
      "timestamp": "2023-10-17T05:42:03+0000",\
      "username": "<USER>",\
      "has_replies": false,\
      "is_quote_post": false,\
      "is_reply": false\
    }\
  ]
}
```

## Topic Tag Search

To search for public Threads media by topic tag, send a `GET` request to the `/keyword_search` endpoint with a topic to be queried. To perform a topic tag search, you need to use the `search_mode` parameter and set the value to `TAG`.

### Example Request

```code
curl -s -X GET \
  -F "q=<TAG>" \
  -F "search_mode=TAG" \
  -F "search_type=TOP" \
  -F "fields=id,text,media_type,permalink,timestamp,username,has_replies,is_quote_post,is_reply" \
  -F "access_token=<THREADS_ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/keyword_search"
```

### Example Response

```code
{
  "data": [\
    {\
      "id": "1234567890",\
      "text": "second thread",\
      "media_type": "TEXT",\
      "permalink": "https://www.threads.net/@<USER>/post/abcdefg",\
      "timestamp": "2023-10-17T05:42:03+0000",\
      "username": "<USER>",\
      "has_replies": false,\
      "is_quote_post": false,\
      "is_reply": false\
    }\
  ]
}
```

## Search by Media Type

To search for public Threads posts by media type, send a `GET` request to the `/keyword_search` endpoint with the `media_type` parameter. Searches can be done for text, image, and video media types. If the `media_type` parameter is not sent, all media types will be returned in the response.

### Example Request

```code
curl -s -X GET \
  -F "q=<KEYWORD>" \
  -F "media_type=IMAGE"
  -F "fields=id,text,media_type,permalink,timestamp,username" \
  -F "access_token=<THREADS_ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/keyword_search"
```

### Example Response

```code
{
  "data": [\
    {\
      "id": "1234567890",\
      "text": "third thread",\
      "media_type": "IMAGE",\
      "permalink": "https://www.threads.net/@<USER>/post/abcdefg",\
      "timestamp": "2023-10-17T05:42:03+0000",\
      "username": "<USER>"\
    }\
  ]
}
```

## Interacting with Public Threads

You can interact with public Threads media that you have recently searched for. These actions include [replying](https://developers.facebook.com/docs/threads/reply-management), [quoting](https://developers.facebook.com/docs/threads/posts/quote-posts), and [reposting](https://developers.facebook.com/docs/threads/posts/reposts).

**Note:** Additional permissions may be required as listed in those pages.

## Recently Searched Keywords

You can retrieve a list of recently searched keywords for the currently authenticated user by sending a `GET` request to the `/me` endpoint and requesting the `recently_searched_keywords` field.

### Example Request

```code
curl -s -X GET \
  -F "fields=recently_searched_keywords" \
  -F "access_token=<THREADS_ACCESS_TOKEN>" \
"https://graph.threads.net/v1.0/me"
```

### Example Response

```code
{
  "id": "1234567890",
  "recently_searched_keywords": [\
    {\
      "query": "some keyword",\
      "timestamp": 1735707600000,\
    },\
    {\
      "query": "some other keyword",\
      "timestamp": 1735707600000,\
    }\
  ]
}
```

On This Page

[Keyword and Topic Tag Search](https://developers.facebook.com/docs/threads/keyword-search/#keyword-and-topic-tag-search)

[Keyword Search](https://developers.facebook.com/docs/threads/keyword-search/#keyword-search)

[Parameters](https://developers.facebook.com/docs/threads/keyword-search/#parameters)

[Example Request](https://developers.facebook.com/docs/threads/keyword-search/#example-request)

[Example Response](https://developers.facebook.com/docs/threads/keyword-search/#example-response)

[Topic Tag Search](https://developers.facebook.com/docs/threads/keyword-search/#topic-tag-search)

[Example Request](https://developers.facebook.com/docs/threads/keyword-search/#example-request-2)

[Example Response](https://developers.facebook.com/docs/threads/keyword-search/#example-response-2)

[Search by Media Type](https://developers.facebook.com/docs/threads/keyword-search/#search-by-media-type)

[Example Request](https://developers.facebook.com/docs/threads/keyword-search/#example-request-3)

[Example Response](https://developers.facebook.com/docs/threads/keyword-search/#example-response-3)

[Interacting with Public Threads](https://developers.facebook.com/docs/threads/keyword-search/#interacting-with-public-threads)

[Recently Searched Keywords](https://developers.facebook.com/docs/threads/keyword-search/#recently-searched-keywords)

[Example Request](https://developers.facebook.com/docs/threads/keyword-search/#example-request-4)

[Example Response](https://developers.facebook.com/docs/threads/keyword-search/#example-response-4)