---
url: https://developers.facebook.com/docs/live-video-api/
title: Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Live Video API](https://developers.facebook.com/docs/live-video-api)

- [Overview](https://developers.facebook.com/docs/live-video-api/overview)
- [Get Started](https://developers.facebook.com/docs/live-video-api/getting-started)
- [Broadcast a video](https://developers.facebook.com/docs/live-video-api/guides/streaming)
- [Schedule a video](https://developers.facebook.com/docs/live-video-api/guides/scheduling)
- [Create a Backup Stream](https://developers.facebook.com/docs/live-video-api/backup_stream)
- [Crosspost a video](https://developers.facebook.com/docs/live-video-api/guides/crossposting)
- [Target an Audience](https://developers.facebook.com/docs/live-video-api/audience-targeting)
- [Interact with viewers](https://developers.facebook.com/docs/live-video-api/interact-with-viewers)
- [Poll viewers](https://developers.facebook.com/docs/live-video-api/polls)
- [Speed Test](https://developers.facebook.com/docs/live-video-api/guides/speed-test)
- [Automatic Encoder Configuration API](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api)
- [Copyrighted Content](https://developers.facebook.com/docs/live-video-api/guides/copyrighted-content)
- [Best Practices](https://developers.facebook.com/docs/live-video-api/best-practices)
- [Support](https://developers.facebook.com/docs/live-video-api/support)
- [Reference](https://developers.facebook.com/docs/live-video-api/reference)
- [Changelog](https://developers.facebook.com/docs/live-video-api/changelog)

On This Page

[Live Video API](https://developers.facebook.com/docs/live-video-api/#live-video-api)

[Common Uses](https://developers.facebook.com/docs/live-video-api/#common-uses)

[Requirements](https://developers.facebook.com/docs/live-video-api/#requirements)

[Features](https://developers.facebook.com/docs/live-video-api/#features)

[Permissions](https://developers.facebook.com/docs/live-video-api/#permissions)

[Next Steps](https://developers.facebook.com/docs/live-video-api/#next-steps)

The overlay\_url field on the [GET /<LIVE\_VIDEO\_ID>](https://developers.facebook.com/docs/graph-api/reference/live-video/#fields) endpoint has been removed for v24.0+. It will continue to return null for v23.0 and older requests.

# Live Video API

The Live Video API from Meta shows you how to steam live video to Facebook, create backup streams, crosspost to other profiles or pages, interact with viewers, and more.

On June 10th, 2024, Meta is launching new requirements that must meet before an account can go live on Facebook. The new requirements are as follows:

- The Facebook account must be at least 60 days old

- The Facebook Page or [professional mode profile](https://www.facebook.com/business/help/2680340558863560) must have at least 100 followers


Visit our
[Help Center \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEo-IBY&_nc_oc=AdqQ25TWVDBnik8lmW7dF339bhdaBx_yb7apHQfW-heao8daZVYXsD8rfxhaF2tkdzE&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=h_GXRSCZ_p838AzgmKkgKg&_nc_ss=7b289&oh=00_Af4OizPCQCKt0FgeSkUfXIY3_A2huziC9l9XJWoMqKWkng&oe=6A2592E2)](https://developers.facebook.com/docs/live-video-api/#) to learn more about this change.



## Common Uses

- [Broadcasting](https://developers.facebook.com/docs/live-video-api/guides/streaming) a live video stream on a User profile, Page, Group, or Event
- [Interacting](https://developers.facebook.com/docs/live-video-api/guides/interacting) with live video broadcast audiences
- [Creating polls](https://developers.facebook.com/docs/live-video-api/guides/live-polls) on live video broadcasts

## Requirements

To use this API, your app must undergo [App Review](https://developers.facebook.com/docs/apps/review) for the following features and permissions.

Your app must produce a live RTMPS stream to be abe to stream to Facebook using the Live Video API.

### Features

- [Live Video API](https://developers.facebook.com/docs/apps/review/feature#reference-LIVE_VIDEOS)

### Permissions

Most endpoints require a mix of the following permissions. To determine which permissions you need, refer to the reference documents for each of the endpoints your app uses.

|     |     |
| --- | --- |
| Publishing on a User<br>- [`publish_video`](https://developers.facebook.com/docs/facebook-login/permissions#publish_video) | Publishing on a Page<br>- [`pages_manage_posts`](https://developers.facebook.com/docs/pages/overview-1#permissions)<br>  <br>- [`pages_read_engagement`](https://developers.facebook.com/docs/pages/overview-1#permissions) |

## Next Steps

Read our [Overview](https://developers.facebook.com/docs/live-video-api/overview) to learn about the API's core concepts, then follow the steps in our [Getting Started](https://developers.facebook.com/docs/live-video-api/overview) document to quickly create a broadcast on your own User profile.

On This Page

[Live Video API](https://developers.facebook.com/docs/live-video-api/#live-video-api)

[Common Uses](https://developers.facebook.com/docs/live-video-api/#common-uses)

[Requirements](https://developers.facebook.com/docs/live-video-api/#requirements)

[Features](https://developers.facebook.com/docs/live-video-api/#features)

[Permissions](https://developers.facebook.com/docs/live-video-api/#permissions)

[Next Steps](https://developers.facebook.com/docs/live-video-api/#next-steps)