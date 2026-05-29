---
url: https://developers.facebook.com/docs/live-video-api/overview
title: Overview - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Foverview%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Overview](https://developers.facebook.com/docs/live-video-api/overview#overview)

[How it works](https://developers.facebook.com/docs/live-video-api/overview#how-it-works)

[Components](https://developers.facebook.com/docs/live-video-api/overview#components)

[Broadcasts](https://developers.facebook.com/docs/live-video-api/overview#broadcasts)

[Stream URLs](https://developers.facebook.com/docs/live-video-api/overview#stream-urls)

[RTMPS](https://developers.facebook.com/docs/live-video-api/overview#rtmps)

[Polls](https://developers.facebook.com/docs/live-video-api/overview#polls)

[Tools](https://developers.facebook.com/docs/live-video-api/overview#tools)

[Live Video Composer](https://developers.facebook.com/docs/live-video-api/overview#live-video-composer)

[Live Ingests](https://developers.facebook.com/docs/live-video-api/overview#ingest)

[Next Steps](https://developers.facebook.com/docs/live-video-api/overview#next-steps)

# Overview

This document is an overview for the Live Video API for streaming a live broadcast on Facebook.

On June 10th, 2024, Meta is launching new requirements that must meet before an account can go live on Facebook. The new requirements are as follows:

- The Facebook account must be at least 60 days old

- The Facebook Page or [professional mode profile](https://www.facebook.com/business/help/2680340558863560) must have at least 100 followers


Visit our
[Help Center \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFRHMuU&_nc_oc=AdrsA3Acs6AoaZr6EIWaGfXfCjt_ZUrX4XygWIHjxftORwM7wiuCUpk44pm-SwC0E6c&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=IgEPUkTTyB7F9tUojjPQ7w&_nc_ss=7b289&oh=00_Af7HiegFGaFwjBISc7ffRHDKZxueXYOFPzA-Xl9CKmaHYw&oe=6A2592E2)](https://developers.facebook.com/docs/live-video-api/overview#) to learn more about this change.



## How it works

Live video broadcasts are represented by LiveVideo objects in the Graph API. To broadcast a live video, you first use the API to create a LiveVideo object on a User, Page or Event. Upon creation, the API will return a LiveVideo object ID and an ingest streaming URL. You can then use the streaming URL to stream live video data from your encoder to the LiveVideo object and use the object to manipulate the broadcast’s visibility.

## Components

### Broadcasts

Live video broadcasts are represented by LiveVideo objects. By manipulating a LiveVideo object's properties, you can control the live video broadcast. For example, you can change the live video broadcast's visibility, update its description or title, add labels, define audiences, add polls, or perform many other actions.

LiveVideo objects are associated with LiveVideoInputStream objects, which represent the broadcast’s ingest streaming data. LiveVideoInputStream objects are created and managed automatically for you.

Broadcasts can be created on User, Page or Event objects using their `/live_videos` edge.

### Stream URLs

Stream URLs are ingest URLs that you can use to stream live video data from your encoder to a LiveVideo object. When you use the API to create a LiveVideo object, the API will respond with a LiveVideo object ID and a unique stream URL. The stream URL must be used within 24 hours before expiring. Once used, a stream URL can be streamed to for up to 8 hours.

### RTMPS

Live video broadcasts on must be encrypted using the RTMPS data transfer protocol. When starting a broadcast, the API will return an RTMPS secure stream URL which you must use when streaming to our servers.

### Polls

You can use the API to create polls on live video broadcasts and get real-time responses from your viewers. Polls are represented by VideoPoll objects in the Graph API, and can be created with the `POST /LIVE_VIDEO_ID/polls` endpoint on a LiveVideo object. Upon creation, the API will return a VideoPoll object ID, which you can use to manipulate the poll and query for viewer interactions.

## Tools

### Live Video Composer

If you are using streaming software that does not integrate with the Live Video API, you can use our Live Video Composer tool to get stream URLs and plug them into your preferred streaming software manually. The Live Video Composer allows you to create broadcasts on your own User profile, or on Pages or Events that you manage.

[Live Video Composer](https://www.facebook.com/live/create)

### Live Ingests

The quality of your live video broadcast starts with a reliable connection to our servers. Poor connections can result in low quality video, playback interruptions, and failed broadcasts. The Live Ingests tool allows you to test your ingestion quality so you can diagnose connection issues, identify the best video ingestion server for your broadcast, and provide high quality broadcasts with fewer playback issues.

[Live Ingests](https://www.facebook.com/live/ingests/)

## Next Steps

- Learn about the
[audio and video specifications \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFRHMuU&_nc_oc=AdrsA3Acs6AoaZr6EIWaGfXfCjt_ZUrX4XygWIHjxftORwM7wiuCUpk44pm-SwC0E6c&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=IgEPUkTTyB7F9tUojjPQ7w&_nc_ss=7b289&oh=00_Af7HiegFGaFwjBISc7ffRHDKZxueXYOFPzA-Xl9CKmaHYw&oe=6A2592E2)](https://developers.facebook.com/docs/live-video-api/reference) required to broadcast a live video.



- [Get Started with the Live Video API \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFRHMuU&_nc_oc=AdrsA3Acs6AoaZr6EIWaGfXfCjt_ZUrX4XygWIHjxftORwM7wiuCUpk44pm-SwC0E6c&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=IgEPUkTTyB7F9tUojjPQ7w&_nc_ss=7b289&oh=00_Af7HiegFGaFwjBISc7ffRHDKZxueXYOFPzA-Xl9CKmaHYw&oe=6A2592E2)](https://developers.facebook.com/docs/live-video-api/reference) to broadcast a live video.




On This Page

[Overview](https://developers.facebook.com/docs/live-video-api/overview#overview)

[How it works](https://developers.facebook.com/docs/live-video-api/overview#how-it-works)

[Components](https://developers.facebook.com/docs/live-video-api/overview#components)

[Broadcasts](https://developers.facebook.com/docs/live-video-api/overview#broadcasts)

[Stream URLs](https://developers.facebook.com/docs/live-video-api/overview#stream-urls)

[RTMPS](https://developers.facebook.com/docs/live-video-api/overview#rtmps)

[Polls](https://developers.facebook.com/docs/live-video-api/overview#polls)

[Tools](https://developers.facebook.com/docs/live-video-api/overview#tools)

[Live Video Composer](https://developers.facebook.com/docs/live-video-api/overview#live-video-composer)

[Live Ingests](https://developers.facebook.com/docs/live-video-api/overview#ingest)

[Next Steps](https://developers.facebook.com/docs/live-video-api/overview#next-steps)