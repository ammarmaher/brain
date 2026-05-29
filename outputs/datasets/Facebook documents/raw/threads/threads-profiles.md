---
url: https://developers.facebook.com/docs/threads/threads-profiles/
title: Profiles - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fthreads-profiles%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
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

[Threads Profiles](https://developers.facebook.com/docs/threads/threads-profiles/#threads-profiles)

[Retrieve a Threads App-Scoped User's Profile Information](https://developers.facebook.com/docs/threads/threads-profiles/#retrieve-a-threads-app-scoped-user-s-profile-information)

[Permissions](https://developers.facebook.com/docs/threads/threads-profiles/#permissions)

[Limitations](https://developers.facebook.com/docs/threads/threads-profiles/#limitations)

[Fields](https://developers.facebook.com/docs/threads/threads-profiles/#fields)

[Example Request](https://developers.facebook.com/docs/threads/threads-profiles/#example-request)

[Example Response](https://developers.facebook.com/docs/threads/threads-profiles/#example-response)

[Retrieve a Threads User's Public Profile Information](https://developers.facebook.com/docs/threads/threads-profiles/#retrieve-a-threads-user-s-public-profile-information)

[Permissions](https://developers.facebook.com/docs/threads/threads-profiles/#permissions-2)

[Limitations](https://developers.facebook.com/docs/threads/threads-profiles/#limitations-2)

[Parameters](https://developers.facebook.com/docs/threads/threads-profiles/#parameters)

[Fields](https://developers.facebook.com/docs/threads/threads-profiles/#fields-2)

[Example Request](https://developers.facebook.com/docs/threads/threads-profiles/#example-request-2)

[Example Response](https://developers.facebook.com/docs/threads/threads-profiles/#example-response-2)

# Threads Profiles

The [Threads Profile API](https://developers.facebook.com/docs/threads/reference/user#get---threads-user-id--fields-id-username----) and [Threads Profile Discovery API](https://developers.facebook.com/docs/threads/reference/user#get--profile-lookup-username----) provide 2 ways of retrieving Threads profile information depending on scope.

## Retrieve a Threads App-Scoped User's Profile Information

Use the `GET /{threads-user-id}?fields=id,username,...` endpoint to return profile information about a Threads user.

### Permissions

The Threads Profile API requires an appropriate access token and permissions based on the node you are targeting. While you are testing, you can easily generate tokens and grant your app permissions by using the Graph API Explorer.

- `threads_basic` — Required for making any calls to all Threads API endpoints.

### Limitations

- You may only fetch the profile of the app-scoped user.

### Fields

| Name | Description |
| --- | --- |
| `id` | Threads user ID. This is returned by default. |
| `username` | Handle or unique username on Threads. |
| `name` | Display name of the user on Threads. |
| `threads_profile_picture_url` | URL of the user's profile picture on Threads. |
| `threads_biography` | Biography text on Threads profile. |
| `is_verified` | Returns `true` if the user is verified on Threads. |

### Example Request

```html
curl -s -X GET \
"https://graph.threads.net/v1.0/me?fields=id,username,name,threads_profile_picture_url,threads_biography,is_verified&access_token=<ACCESS_TOKEN>"
```

### Example Response

```json
{
  "id": "1234567",
  "username": "threadsapitestuser",
  "name": "Threads API Test User",
  "threads_profile_picture_url": "https://scontent-sjc3-1.cdninstagram.com/link/to/profile/picture/on/threads/",
  "threads_biography": "This is my Threads bio.",
  "is_verified": false
}
```

## Retrieve a Threads User's Public Profile Information

Use the `GET /profile_lookup?username=...` endpoint to look up a public profile and retrieve their basic profile information.

### Permissions

The Threads Profile Discovery API requires an appropriate access token and permissions based on the node you are targeting. While you are testing, you can easily generate tokens and grant your app permissions by using the Graph API Explorer.

- `threads_basic` — Required for making any calls to all Threads API endpoints.
- `threads_profile_discovery` — Required for making any calls to all Threads Profile Discovery API endpoints.

With [standard access](https://developers.facebook.com/docs/graph-api/overview/access-levels), only some of the official Meta accounts can be looked up. These include @meta, @threads, @instagram, and @facebook.

### Limitations

- Only returns public profiles with at least 100 followers.
- A user can send a maximum of 1,000 requests within a rolling 24-hour period. Once a query is sent, it will count against this limit for 24 hours.

### Parameters

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `username`<br>string | **Required.**<br>Handle or unique username on Threads. Must be an exact match. |

### Fields

| Name | Description |
| --- | --- |
| `username`<br>string | Handle or unique username on Threads. |
| `name`<br>string | Display name of the user on Threads. |
| `profile_picture_url`<br>string | URL of the user's profile picture on Threads. |
| `biography`<br>string | Biography text on Threads profile. |
| `follower_count`<br>int | Total follower count of the user. |
| `likes_count`<br>int | Likes count of the user's posts in the past 7 days. |
| `quotes_count`<br>int | Quotes count of the user's posts in the past 7 days. |
| `reposts_count`<br>int | Reposts count of the user's posts in the past 7 days. |
| `views_count`<br>int | Views count of the user's posts in the past 7 days. |
| `is_verified`<br>Boolean | Returns `true` if the user is verified on Threads. |

### Example Request

```html
curl -i -X GET \
  "https://graph.threads.net/v1.0/profile_lookup?access_token=<ACCESS_TOKEN>&username=<THREADS_USERNAME>"
```

### Example Response

```json
{
  "username": "meta",
  "name": "Meta",
  "profile_picture_url": "https://scontent-sjc3-1.cdninstagram.com/link/to/profile/picture/on/threads/",
  "biography": "Connect with what you love to make things happen. It’s Your World.",
  "is_verified": true,
  "follower_count": 1234567,
  "likes_count": 1234567,
  "quotes_count": 1234567,
  "replies_count": 1234567,
  "reposts_count": 1234567,
  "views_count": 1234567
}
```

On This Page

[Threads Profiles](https://developers.facebook.com/docs/threads/threads-profiles/#threads-profiles)

[Retrieve a Threads App-Scoped User's Profile Information](https://developers.facebook.com/docs/threads/threads-profiles/#retrieve-a-threads-app-scoped-user-s-profile-information)

[Permissions](https://developers.facebook.com/docs/threads/threads-profiles/#permissions)

[Limitations](https://developers.facebook.com/docs/threads/threads-profiles/#limitations)

[Fields](https://developers.facebook.com/docs/threads/threads-profiles/#fields)

[Example Request](https://developers.facebook.com/docs/threads/threads-profiles/#example-request)

[Example Response](https://developers.facebook.com/docs/threads/threads-profiles/#example-response)

[Retrieve a Threads User's Public Profile Information](https://developers.facebook.com/docs/threads/threads-profiles/#retrieve-a-threads-user-s-public-profile-information)

[Permissions](https://developers.facebook.com/docs/threads/threads-profiles/#permissions-2)

[Limitations](https://developers.facebook.com/docs/threads/threads-profiles/#limitations-2)

[Parameters](https://developers.facebook.com/docs/threads/threads-profiles/#parameters)

[Fields](https://developers.facebook.com/docs/threads/threads-profiles/#fields-2)

[Example Request](https://developers.facebook.com/docs/threads/threads-profiles/#example-request-2)

[Example Response](https://developers.facebook.com/docs/threads/threads-profiles/#example-response-2)