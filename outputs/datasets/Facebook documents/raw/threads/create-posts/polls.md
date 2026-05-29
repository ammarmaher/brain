---
url: https://developers.facebook.com/docs/threads/create-posts/polls
title: Polls - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fcreate-posts%2Fpolls%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)


  - [Posts](https://developers.facebook.com/docs/threads/posts)
  - [Create Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies)
  - [Reposts](https://developers.facebook.com/docs/threads/posts/reposts)
  - [Quote Posts](https://developers.facebook.com/docs/threads/posts/quote-posts)
  - [Ghost Posts](https://developers.facebook.com/docs/threads/create-posts/ghost-posts)
  - [Polls](https://developers.facebook.com/docs/threads/create-posts/polls)
  - [Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers)
  - [Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments)
  - [Share to Instagram Stories](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories)
  - [Location Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging)
  - [Geo-Gated Content](https://developers.facebook.com/docs/threads/posts/geo-gating)
  - [Accessibility](https://developers.facebook.com/docs/threads/posts/accessibility)

- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
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

[Polls](https://developers.facebook.com/docs/threads/create-posts/polls#polls)

[Create a post with a poll](https://developers.facebook.com/docs/threads/create-posts/polls#create-a-post-with-a-poll)

[Example request](https://developers.facebook.com/docs/threads/create-posts/polls#example-request)

[Example response](https://developers.facebook.com/docs/threads/create-posts/polls#example-response)

[Media retrieval](https://developers.facebook.com/docs/threads/create-posts/polls#media-retrieval)

[Example request](https://developers.facebook.com/docs/threads/create-posts/polls#example-request-2)

[Example response](https://developers.facebook.com/docs/threads/create-posts/polls#example-response-2)

# Polls

You can use the Threads API to create posts with polls.

### Limitations

- Polls can only be attached to text-only posts.

## Create a post with a poll

You can attach a poll when making a request to the `POST /threads` endpoint to create a media object. Include the following parameter in your request:

- `poll_attachment` – A JSON object containing the options for the poll.

The `poll_attachment` object must be of the form:

```code
{
  "option_a": "first option",
  "option_b": "second option",
  "option_c": "third option", // Optional
  "option_d": "fourth option" // Optional
}
```

The `poll_attachment` object must contain at least 2 options and no more than 4 options. The length of each option you include must be at least 1 character long and at most 25 characters long.

### Example request

```code
curl -i -X POST \
"https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads?media_type=TEXT&text=MyText&access_token=<ACCESS_TOKEN>" \
-d poll_attachment='{"option_a":"first option", "option_b":"second option"}'
```

### Example response

```code
{
  "id": "1234567" // Threads Media Container ID
}
```

The request above creates a Threads post container that, once [published](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container), will contain a poll attachment with the provided options.

## Media retrieval

Make a request to the `GET /threads` or `GET /{threads-media-id}` endpoint to retrieve media object(s). Make sure to include the following field with your API request:

- `poll_attachment` – The poll attachment for the post.

### Example request

```code
curl -i -X GET \
"https://graph.threads.net/v1.0/<THREADS_MEDIA_ID>&access_token=<ACCESS_TOKEN>" \
-d fields=id,poll_attachment{option_a,option_b,option_c,option_d,option_a_votes_percentage,option_b_votes_percentage,option_c_votes_percentage,option_d_votes_percentage,total_votes,expiration_timestamp}
```

### Example response

```code
{
  "id": "1234567", // Threads Media ID
  "poll_attachment": {
    "option_a": "first option",
    "option_b": "second option",
    "option_c": "third option",
    "option_d": "fourth option",
    "option_a_votes_percentage": 0.10, // Percentage of votes for first option
    "option_b_votes_percentage": 0.20,
    "option_c_votes_percentage": 0.15,
    "option_d_votes_percentage": 0.55,
    "total_votes": 100,
    "expiration_timestamp": "2025-01-01T23:00:00+0000" // Time when the poll expires
  }
}
```

**Note:** The fields for option C and option D will only be returned if available for the poll being retrieved.

On This Page

[Polls](https://developers.facebook.com/docs/threads/create-posts/polls#polls)

[Create a post with a poll](https://developers.facebook.com/docs/threads/create-posts/polls#create-a-post-with-a-poll)

[Example request](https://developers.facebook.com/docs/threads/create-posts/polls#example-request)

[Example response](https://developers.facebook.com/docs/threads/create-posts/polls#example-response)

[Media retrieval](https://developers.facebook.com/docs/threads/create-posts/polls#media-retrieval)

[Example request](https://developers.facebook.com/docs/threads/create-posts/polls#example-request-2)

[Example response](https://developers.facebook.com/docs/threads/create-posts/polls#example-response-2)