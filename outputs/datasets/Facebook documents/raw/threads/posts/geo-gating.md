---
url: https://developers.facebook.com/docs/threads/posts/geo-gating
title: Geo-Gated Content - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fposts%2Fgeo-gating%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Geo-Gated Content](https://developers.facebook.com/docs/threads/posts/geo-gating#geo-gated-content)

[User Eligibility](https://developers.facebook.com/docs/threads/posts/geo-gating#user-eligibility)

[Example Request](https://developers.facebook.com/docs/threads/posts/geo-gating#example-request)

[Example Response](https://developers.facebook.com/docs/threads/posts/geo-gating#example-response)

[Publish Geo-Gated Content](https://developers.facebook.com/docs/threads/posts/geo-gating#publish-geo-gated-content)

[Example Request](https://developers.facebook.com/docs/threads/posts/geo-gating#example-request-2)

[Media Retrieval](https://developers.facebook.com/docs/threads/posts/geo-gating#media-retrieval)

[Example Request](https://developers.facebook.com/docs/threads/posts/geo-gating#example-request-3)

[Example Response](https://developers.facebook.com/docs/threads/posts/geo-gating#example-response-2)

[Error Codes](https://developers.facebook.com/docs/threads/posts/geo-gating#error-codes)

# Geo-Gated Content

You can use the Threads API to create geo-gated content restricted to one or more specific countries. Content marked in this way will only be shown to Threads profiles in those countries.

### Limitations

Only users with access to this feature on threads.net can use this feature via Threads API.

## User Eligibility

A user's eligibility for the geo-gating feature can be retrieved when making a request to the `GET /me` or `GET /{threads-user-id}` endpoints to [retrieve profile information](https://developers.facebook.com/docs/threads/threads-profiles#retrieve-a-threads-user-s-profile-information). To retrieve this value, include the following parameter with your API request:

- `is_eligible_for_geo_gating` \- A boolean value which represents whether a user is eligible for the geo-gating feature.

### Example Request

```code
curl -s -X GET \
  "https://graph.threads.net/v1.0/me?fields=id,is_eligible_for_geo_gating&access_token=<ACCESS_TOKEN>"
```

### Example Response

```code
{
   "id": "12312312312123",
   "is_eligible_for_geo_gating": true
}
```

This means that this user has access to the geo-gating feature.

## Publish Geo-Gated Content

Geo-gating can be used when making a request to the `POST /threads` endpoint to [create a media object](https://developers.facebook.com/docs/threads/posts#step-1--create-a-threads-media-container). To use geo-gating, include the following parameter with your API request:

- `allowlisted_country_codes` \- A string list of valid [ISO 3166-1 alpha-2 country codes](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.iso.org%2Fobp%2Fui%2F%23search&h=AUD1gJbK0x39PI1c6oKosfXXcs5upfuZCPTH_uEHX_3szbyHZ1I2aG9AID--l0gq5CpM5eyHBqg7YizRKTfHzMm0m3JTnyyNaRP2gf9S4K787voQRTYFtUw2Vt2PU3XLPlGtcn_nUHhXMg) that represents the countries where this media should be shown. If this parameter is passed in, the media will not be shown to Threads profiles in countries outside of this list.

### Example Request

```code
curl -i -X POST \
  "https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads?media_type=IMAGE&image_url=https://www.example.com/images/bronz-fonz.jpg&text=#BronzFonz&allowlisted_country_codes=US,CA&access_token=<ACCESS_TOKEN>"
```

This request would create a Threads post container that, once published, is only visible in the United States and Canada.

**Note:** The creator of a Threads post is always able to see their content, regardless of geo-gating settings.

## Media Retrieval

Allowlisted country codes for geo-gating can be retrieved when making a request to the `GET /threads` or `GET /{threads_media_id}` endpoint to [retrieve media object(s)](https://developers.facebook.com/docs/threads/threads-media). To retrieve the geo-gating allowlist, include the following parameter with your API request:

- `allowlisted_country_codes` \- A string list of valid [ISO 3166-1 alpha-2 country codes](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.iso.org%2Fobp%2Fui%2F%23search&h=AUBonXapDp_wX5J6fGjaof2VyuEH0VAntUDDdjje2g_zdnJzX62OeUTcBpCL60jhFY9o-Iy-uEfALlZUUeFwVu4M-NvIkuuoDlGMjYg4QpEOvWaNA5qQwGX3e13r5x1ZMmmQE7j-UN_KmA) that represents the countries where this media is shown.

### Example Request

```code
curl -s -X GET \
  "https://graph.threads.net/v1.0/me/threads?fields=id,allowlisted_country_codes&limit=1&access_token=<ACCESS_TOKEN>"
```

### Example Response

```code
{
   "id": "12312312312123",
   "allowlisted_country_codes": [\
      "US"\
   ]
}
```

This means this media is only shown to users in the United States.

## Error Codes

| Error | Description |
| --- | --- |
| `ErrorCode::THREADS_API__FEATURE_NOT_AVAILABLE` | This user does not have access to this Threads API feature. |
| `ErrorCode::THREADS_API__GEO_GATING_INVALID_COUNTRY_CODES` | Some of the specified country code(s) are not supported for geo-gating. |

On This Page

[Geo-Gated Content](https://developers.facebook.com/docs/threads/posts/geo-gating#geo-gated-content)

[User Eligibility](https://developers.facebook.com/docs/threads/posts/geo-gating#user-eligibility)

[Example Request](https://developers.facebook.com/docs/threads/posts/geo-gating#example-request)

[Example Response](https://developers.facebook.com/docs/threads/posts/geo-gating#example-response)

[Publish Geo-Gated Content](https://developers.facebook.com/docs/threads/posts/geo-gating#publish-geo-gated-content)

[Example Request](https://developers.facebook.com/docs/threads/posts/geo-gating#example-request-2)

[Media Retrieval](https://developers.facebook.com/docs/threads/posts/geo-gating#media-retrieval)

[Example Request](https://developers.facebook.com/docs/threads/posts/geo-gating#example-request-3)

[Example Response](https://developers.facebook.com/docs/threads/posts/geo-gating#example-response-2)

[Error Codes](https://developers.facebook.com/docs/threads/posts/geo-gating#error-codes)