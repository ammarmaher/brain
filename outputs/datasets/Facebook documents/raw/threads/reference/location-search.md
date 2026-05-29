---
url: https://developers.facebook.com/docs/threads/reference/location-search
title: Location Search - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Freference%2Flocation-search%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


  - [Publishing](https://developers.facebook.com/docs/threads/reference/publishing)
  - [Media Retrieval](https://developers.facebook.com/docs/threads/reference/media-retrieval)
  - [Reply Management](https://developers.facebook.com/docs/threads/reference/reply-management)
  - [User](https://developers.facebook.com/docs/threads/reference/user)
  - [Locations](https://developers.facebook.com/docs/threads/reference/locations)
  - [Location Search](https://developers.facebook.com/docs/threads/reference/location-search)
  - [Insights](https://developers.facebook.com/docs/threads/reference/insights)
  - [oEmbed](https://developers.facebook.com/docs/threads/reference/oembed)
  - [Debug](https://developers.facebook.com/docs/threads/reference/debug)

- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

# Location Search

The Threads location search endpoint allows you to search for locations which can then be tagged in Threads posts. See [Location Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging) for more information.

## `GET /location_search`

Search for locations by query or by coordinates.

| Name | Description |
| --- | --- |
| `access_token`<br>string | **Required.**<br>Threads Graph API user access token. |
| `query`<br>string | **Optional.**<br>The query string to search for. |
| `latitude`<br>float | **Optional.**<br>The latitude coordinate to search for. This must be used with `longitude`. |
| `longitude`<br>float | **Optional.**<br>The longitude coordinate to search for. This must be used with `latitude`. |
| `fields`<br>string | **Optional.**<br>A comma-separated list of the fields to be returned.<br>**Values:**`id` _(default)_, `name`, `address`, `city`, `country`, `latitude`, `longitude`, `postal_code` |