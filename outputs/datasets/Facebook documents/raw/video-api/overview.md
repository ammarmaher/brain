---
url: https://developers.facebook.com/docs/video-api/overview
title: Overview - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Foverview%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Video API](https://developers.facebook.com/docs/video-api)

- [Overview](https://developers.facebook.com/docs/video-api/overview)
- [Get Started](https://developers.facebook.com/docs/video-api/getting-started)
- [A/B Testing](https://developers.facebook.com/docs/video-api/ab-testing)
- [Crossposting](https://developers.facebook.com/docs/video-api/guides/crossposting)
- [Get Videos](https://developers.facebook.com/docs/video-api/guides/get-videos)
- [Get Insights](https://developers.facebook.com/docs/video-api/guides/insights)
- [Music Recommendations](https://developers.facebook.com/docs/video-api/guides/music-recommendations)
- [Upload a File or Video](https://developers.facebook.com/docs/graph-api/guides/upload)
- [Splitting](https://developers.facebook.com/docs/video-api/guides/splitting)
- [Publish a Video](https://developers.facebook.com/docs/video-api/guides/publishing)
- [Publish a Reel](https://developers.facebook.com/docs/video-api/guides/reels-publishing)
- [Rights Manager API](https://developers.facebook.com/docs/graph-api/rights-manager-api)
- [Slideshows](https://developers.facebook.com/docs/video-api/guides/slideshows)
- [Stories](https://developers.facebook.com/docs/page-stories-api)
- [Reference](https://developers.facebook.com/docs/video-api/reference)

On This Page

[Overview for the Video API from Meta](https://developers.facebook.com/docs/video-api/overview#overview-for-the-video-api-from-meta)

[Components](https://developers.facebook.com/docs/video-api/overview#components)

[Host URL](https://developers.facebook.com/docs/video-api/overview#host-url)

[Upload Protocols](https://developers.facebook.com/docs/video-api/overview#upload-protocols)

[Resources](https://developers.facebook.com/docs/video-api/overview#resources)

[Ads](https://developers.facebook.com/docs/video-api/overview#ads)

[Insights](https://developers.facebook.com/docs/video-api/overview#insights)

[Webhooks](https://developers.facebook.com/docs/video-api/overview#webhooks)

[Rights Management](https://developers.facebook.com/docs/video-api/overview#rights-management)

[Requirements](https://developers.facebook.com/docs/video-api/overview#requirements)

[App Review](https://developers.facebook.com/docs/video-api/overview#app-review)

[How It Works](https://developers.facebook.com/docs/video-api/overview#how-it-works)

# Overview for the Video API from Meta

The Video API is a collection of Graph API endpoints that allow apps to publish existing videos on [Pages](https://developers.facebook.com/docs/graph-api/reference/page) administered by app users.

## Components

### Host URL

All requests are passed to the `graph.facebook.com` host URL.

The `graph-video.facebook.com` host for video uploads has been deprecated. Use the `graph.facebook.com` host for API requests when uploading videos to Meta servers.

### Upload Protocols

Upload videos using the [Resumable Upload API](https://developers.facebook.com/docs/video-api/guides/publishing#resumable-upload).

### Resources

The API uses the following nodes.

#### Videos

The [Video](https://developers.facebook.com/docs/graph-api/reference/video) node is the API's primary resource. When you upload an existing video the API generates a Video entity and publishes it on a [Page](https://developers.facebook.com/docs/graph-api/reference/page). Videos must be published on a target node.

#### Pages

Videos can be published on a Page as long as the app user can perform admin-equivalent [Tasks](https://developers.facebook.com/docs/pages/overview#tasks) on the Page, or have been granted an Admin Role on the Page via the Business Manager.

#### Crossposted Videos

Videos that have already been published can also be [published on other Pages](https://developers.facebook.com/docs/video-api/guides/crossposting) that the app user administers without having to be reuploaded. Insights on Crossposted Videos can be returned as aggregate values (e.g. the sum of all views across all Pages) or broken down by Page.

#### Slideshows

You can use the API to [generate a slideshow Video](https://developers.facebook.com/docs/video-api/guides/slideshows) from a collection of images hosted on a public server.

#### Polls

You can use the API to [create Polls on published videos](https://developers.facebook.com/docs/graph-api/reference/video/polls) and get their results.

### Ads

Published Videos can be used with the Marketing API's [Ad Creative](https://developers.facebook.com/docs/marketing-api/advideo/) endpoint to create Video Ads.

### Insights

You can [get insights](https://developers.facebook.com/docs/video-api/guides/insights) on any published Video. Insights for [Crossposted Videos](https://developers.facebook.com/docs/video-api/overview#crossposted-videos) can be returned as aggregate values or broken down by Page.

### Webhooks

You can receive real-time notifications of changes to a Video's publishing status and viewer interactions by setting up [Page Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages). Set up a callback and then subscribe to the Page topic's `feed` and `videos` fields to receive notifications. Note that notification will not be sent for videos that are uploaded as `secret` or `no_story`.

### Rights Management

For Videos published on a Page, you can use the [Rights Manager API](https://developers.facebook.com/docs/graph-api/rights-manager-api) to create and apply copyright rules in order to discover other published Videos that may be in violation, and report them.

### Requirements

#### Permissions

To publish on a Page, the app user must grant your app the [`pages_show_list`](https://developers.facebook.com/docs/permissions/reference/pages_show_list), [`pages_read_engagement`](https://developers.facebook.com/docs/permissions/reference/pages_read_engagement), and [`pages_manage_posts`](https://developers.facebook.com/docs/permissions/reference/pages_manage_posts) permissions.

#### Admin Role

The app user must be able to perform the equivalent of [`ADMIN` tasks](https://developers.facebook.com/docs/pages/overview-1#tasks) on the targeted Page.

### App Review

All permissions require [App Review](https://developers.facebook.com/docs/apps/review).

## How It Works

The general flow for publishing a video on a Page is to:

1. Get an Access Token and appropriate permissions from your app user
2. Get a list of Pages that the app user is able to perform admin-equivalent Tasks on
3. Provide a way for the app user to select the Page where they want the video to appear
4. Provide a way for the app user to select a Video to be published.
5. Upload the video using the Resumable Upload API
6. Publish the video to the Page using the Video ID

On This Page

[Overview for the Video API from Meta](https://developers.facebook.com/docs/video-api/overview#overview-for-the-video-api-from-meta)

[Components](https://developers.facebook.com/docs/video-api/overview#components)

[Host URL](https://developers.facebook.com/docs/video-api/overview#host-url)

[Upload Protocols](https://developers.facebook.com/docs/video-api/overview#upload-protocols)

[Resources](https://developers.facebook.com/docs/video-api/overview#resources)

[Ads](https://developers.facebook.com/docs/video-api/overview#ads)

[Insights](https://developers.facebook.com/docs/video-api/overview#insights)

[Webhooks](https://developers.facebook.com/docs/video-api/overview#webhooks)

[Rights Management](https://developers.facebook.com/docs/video-api/overview#rights-management)

[Requirements](https://developers.facebook.com/docs/video-api/overview#requirements)

[App Review](https://developers.facebook.com/docs/video-api/overview#app-review)

[How It Works](https://developers.facebook.com/docs/video-api/overview#how-it-works)