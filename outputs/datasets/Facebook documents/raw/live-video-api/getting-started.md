---
url: https://developers.facebook.com/docs/live-video-api/getting-started
title: Get Started - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fgetting-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Getting Started](https://developers.facebook.com/docs/live-video-api/getting-started#getting-started)

[Before You Start](https://developers.facebook.com/docs/live-video-api/getting-started#before-you-start)

[Start the broadcast](https://developers.facebook.com/docs/live-video-api/getting-started#start-the-broadcast)

[Stream the broadcast](https://developers.facebook.com/docs/live-video-api/getting-started#stream-the-broadcast)

[End the broadcast](https://developers.facebook.com/docs/live-video-api/getting-started#end-the-broadcast)

[Example end broadcast request](https://developers.facebook.com/docs/live-video-api/getting-started#example-end-broadcast-request)

[Permission denied error codes](https://developers.facebook.com/docs/live-video-api/getting-started#permission-denied-error-codes)

[Next Steps](https://developers.facebook.com/docs/live-video-api/getting-started#next-steps)

# Getting Started

This document explains how to use the Live Video API to broadcast a live video broadcast with your app. If you do not have an app, you can use the Graph API Explorer and streaming software of your choice.

On June 10th, 2024, Meta is launching new requirements that must meet before an account can go live on Facebook. The new requirements are as follows:

- The Facebook account must be at least 60 days old

- The Facebook Page or [professional mode profile](https://www.facebook.com/business/help/2680340558863560) must have at least 100 followers


Visit our
[Help Center \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGmhaJw&_nc_oc=AdpTRKaAlV02mcmQ_3BEwwbPI1K4uqy8PTXGa-7BFEP8bsCEp7AMs-OZh_bcbfaohNA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=V4CjBY5UzRupGMsLaVudtg&_nc_ss=7b289&oh=00_Af56hnmYe6PvWR-Ut79X27QyRgoQCxjAjmitPnYZMB3lHA&oe=6A2592E2)](https://developers.facebook.com/docs/live-video-api/getting-started#) to learn more about this change.



## Before You Start

If you have an app, you will need the following:

- [A Meta App ID with the Facebook Login Use Case \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGmhaJw&_nc_oc=AdpTRKaAlV02mcmQ_3BEwwbPI1K4uqy8PTXGa-7BFEP8bsCEp7AMs-OZh_bcbfaohNA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=V4CjBY5UzRupGMsLaVudtg&_nc_ss=7b289&oh=00_Af56hnmYe6PvWR-Ut79X27QyRgoQCxjAjmitPnYZMB3lHA&oe=6A2592E2)](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case)

- [Facebook Login implemented in your app\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGmhaJw&_nc_oc=AdpTRKaAlV02mcmQ_3BEwwbPI1K4uqy8PTXGa-7BFEP8bsCEp7AMs-OZh_bcbfaohNA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=V4CjBY5UzRupGMsLaVudtg&_nc_ss=7b289&oh=00_Af56hnmYe6PvWR-Ut79X27QyRgoQCxjAjmitPnYZMB3lHA&oe=6A2592E2)](https://developers.facebook.com/docs/facebook-login)

  - If your app is on a device that does not have an interface that allows users to sign into Facebook, implement
     [Facebook Login for Devices \\
     ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGmhaJw&_nc_oc=AdpTRKaAlV02mcmQ_3BEwwbPI1K4uqy8PTXGa-7BFEP8bsCEp7AMs-OZh_bcbfaohNA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=V4CjBY5UzRupGMsLaVudtg&_nc_ss=7b289&oh=00_Af56hnmYe6PvWR-Ut79X27QyRgoQCxjAjmitPnYZMB3lHA&oe=6A2592E2)](https://developers.facebook.com/docs/facebook-login/for-devices/)
     instead.



- The following permissions:
[`publish_video`![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGmhaJw&_nc_oc=AdpTRKaAlV02mcmQ_3BEwwbPI1K4uqy8PTXGa-7BFEP8bsCEp7AMs-OZh_bcbfaohNA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=V4CjBY5UzRupGMsLaVudtg&_nc_ss=7b289&oh=00_Af56hnmYe6PvWR-Ut79X27QyRgoQCxjAjmitPnYZMB3lHA&oe=6A2592E2)](https://developers.facebook.com/docs/permissions/reference/publish_video)

- An
[access token\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGmhaJw&_nc_oc=AdpTRKaAlV02mcmQ_3BEwwbPI1K4uqy8PTXGa-7BFEP8bsCEp7AMs-OZh_bcbfaohNA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=V4CjBY5UzRupGMsLaVudtg&_nc_ss=7b289&oh=00_Af56hnmYe6PvWR-Ut79X27QyRgoQCxjAjmitPnYZMB3lHA&oe=6A2592E2)](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)


If you don't have an app, you also will need:

- The
[Graph API Explorer \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGmhaJw&_nc_oc=AdpTRKaAlV02mcmQ_3BEwwbPI1K4uqy8PTXGa-7BFEP8bsCEp7AMs-OZh_bcbfaohNA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=V4CjBY5UzRupGMsLaVudtg&_nc_ss=7b289&oh=00_Af56hnmYe6PvWR-Ut79X27QyRgoQCxjAjmitPnYZMB3lHA&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/explorer)

- Video streaming software


## Start the broadcast

To create a LiveVideo object, send a `POST` request to the `/me/live_videos?status=LIVE_NOW` endpoint where `me` is the ID for the User or Page.

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

```curl
curl -i -X POST \
 "https://graph.facebook.com/v25.0/me/live_videos?status=LIVE_NOW"
```

This will return a response that looks like this:

```code
{
  "id": "10214937378883406",  //The LiveVideo object ID
  "stream_url": "rtmp://rtmp-api.faceboo...",
  "secure_stream_url": "rtmps://rtmp-api.faceboo...", //The stream URL
  "stream_secondary_urls": [],
  "secure_stream_secondary_urls": []
}
```

Capture the `id` and `secure_stream_url` values that were returned to you. The `id` is the LiveVideo object ID which you can use to manipulate your broadcast. The `secure_stream_url` is the ingest URL that you will use to stream live video data from your encoder to the LiveVideo object.

## Stream the broadcast

Pass the `secure_stream_url` value that you captured in the last step to your encoding device and stream live video data to it. Once the LiveVideo object detects streaming data, the broadcast will go live on your User profile.

View your profile and verify that a new live video post has been created and is broadcasting your streaming data.

If you are using streaming software instead of developing your own app, manually add the `secure_stream_url` value to your software. Depending on which streaming software you are using, you may have to break the stream URL into its server (`rtmps://rtmp-api.facebook.com/rtmp/`) and key components (everything after `/rtmp/`).

## End the broadcast

To end the broadcast, send a `POST` request to the `/<LIVE_VIDEO_ID>?end_live_video=true` endpoint.

### Example end broadcast request

```curl
curl -i -X POST \
  "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>?end_live_video=true"
```

This ends your broadcast and saves it as a video on demand (VOD). If you want to delete the VOD, send a request to the `DELETE /<LIVE_VIDEO_ID>` endpoint.

## Permission denied error codes

| Code | Subcode | Message | Type | Mitigation messaging |
| --- | --- | --- | --- | --- |
| 200 | 1363120 | Permissions error | OAuthException | You’re not eligible to go live <br>Your profile needs to be at least 60 days old before you can go live on Facebook. Learn more at https://www.facebook.com/business/help/167417030499767?id=1123223941353904 |
| 200 | 1363144 | Permissions error | OAuthException | You’re not eligible to go live <br>You need at least 100 followers before you can go live from your profile. Learn more at https://www.facebook.com/business/help/167417030499767?id=1123223941353904 |

## Next Steps

- Use the Live Video API to [schedule a live video](https://developers.facebook.com/docs/live-video-api/guides/scheduling) for a future broadcast.

On This Page

[Getting Started](https://developers.facebook.com/docs/live-video-api/getting-started#getting-started)

[Before You Start](https://developers.facebook.com/docs/live-video-api/getting-started#before-you-start)

[Start the broadcast](https://developers.facebook.com/docs/live-video-api/getting-started#start-the-broadcast)

[Stream the broadcast](https://developers.facebook.com/docs/live-video-api/getting-started#stream-the-broadcast)

[End the broadcast](https://developers.facebook.com/docs/live-video-api/getting-started#end-the-broadcast)

[Example end broadcast request](https://developers.facebook.com/docs/live-video-api/getting-started#example-end-broadcast-request)

[Permission denied error codes](https://developers.facebook.com/docs/live-video-api/getting-started#permission-denied-error-codes)

[Next Steps](https://developers.facebook.com/docs/live-video-api/getting-started#next-steps)