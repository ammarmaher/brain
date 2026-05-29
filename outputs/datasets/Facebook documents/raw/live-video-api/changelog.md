---
url: https://developers.facebook.com/docs/live-video-api/changelog
title: Changelog - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fchangelog%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Changelog](https://developers.facebook.com/docs/live-video-api/changelog#changelog)

[September 14, 2021](https://developers.facebook.com/docs/live-video-api/changelog#september-14--2021)

[August 4, 2021](https://developers.facebook.com/docs/live-video-api/changelog#august-4--2021)

[September 29, 2020](https://developers.facebook.com/docs/live-video-api/changelog#september-29--2020)

[November 4, 2019](https://developers.facebook.com/docs/live-video-api/changelog#november-4--2019)

[May 1, 2019](https://developers.facebook.com/docs/live-video-api/changelog#may-1--2019)

[December 26, 2018](https://developers.facebook.com/docs/live-video-api/changelog#december-26--2018)

# Changelog

## September 14, 2021

- **Scheduling Live Videos** – Scheduling a live video is deprecated for v12.0 and will be deprecated for all versions on December 14, 2021. Calls to the `POST /ID/live-video` endpoint with the `planned_start_time` parameter will return an error.

## August 4, 2021

- **Live Encoder API** — The Live Encoder API has been deprecated.

## September 29, 2020

- **Backup Streams** — Live Video broadcasts now support [backup streams](https://developers.facebook.com/docs/live-video-api/guides/backup_stream).

## November 4, 2019

- **RTMP Deprecation** — RTMP is [no longer supported](https://developers.facebook.com/blog/post/2018/04/24/new-facebook-platform-product-changes-policy-updates/). All live video broadcasts must now be encrypted using the RTMPS protocol.

## May 1, 2019

- **RTMP Deprecation** — As we [announced earlier](https://developers.facebook.com/blog/post/2018/04/24/new-facebook-platform-product-changes-policy-updates/), we have begun deprecation of RTMP support. Starting today, Live Video streams on Users, Events, and Groups must be encrypted using the RTMPS data transfer protocol. Live Video streams on Pages and Workplace can continue using the non-encrypted standard RTMP protocol until November 1st, 2019, after which they must use RTMPS. If you are continuing to use RTMP and using a persistent stream key, you should [reset your persistent key](https://developers.facebook.com/docs/live-video-api/faq#faq_2013143112146867) and update any devices that use them or your streams will fail.

## December 26, 2018

- **Live Video API** — Released new [Live Video API](https://developers.facebook.com/docs/live-video-api) documentation.
- **Stream Health API** — You can now monitor [properties of the ingest stream](https://developers.facebook.com/docs/live-video-api/common-uses#getting-live-video-data) such as format, bitrate and frame-rate, as well as get a [preview URL](https://developers.facebook.com/docs/live-video-api/common-uses/scheduling-updating#previewing-a-stream) that you can render within your application.
- **Real-time Comments and Reactions** — You can receive [real-time comments and reactions](https://developers.facebook.com/docs/live-video-api/common-uses/interacting-with-viewers#receiving-real-time-comments-and-reactions) on the live video using server-sent events.

On This Page

[Changelog](https://developers.facebook.com/docs/live-video-api/changelog#changelog)

[September 14, 2021](https://developers.facebook.com/docs/live-video-api/changelog#september-14--2021)

[August 4, 2021](https://developers.facebook.com/docs/live-video-api/changelog#august-4--2021)

[September 29, 2020](https://developers.facebook.com/docs/live-video-api/changelog#september-29--2020)

[November 4, 2019](https://developers.facebook.com/docs/live-video-api/changelog#november-4--2019)

[May 1, 2019](https://developers.facebook.com/docs/live-video-api/changelog#may-1--2019)

[December 26, 2018](https://developers.facebook.com/docs/live-video-api/changelog#december-26--2018)