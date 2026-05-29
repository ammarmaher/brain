---
url: https://developers.facebook.com/docs/graph-api/rights-manager-api
title: Rights Manager API - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Frights-manager-api%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Rights Manager API](https://developers.facebook.com/docs/graph-api/rights-manager-api#rights-manager-api)

[Copyrighting Video](https://developers.facebook.com/docs/graph-api/rights-manager-api#copyrightvideo)

[For Videos, the steps are:](https://developers.facebook.com/docs/graph-api/rights-manager-api#for-videos--the-steps-are-)

[For Live Videos, the steps are:](https://developers.facebook.com/docs/graph-api/rights-manager-api#for-live-videos--the-steps-are-)

[Reference Only](https://developers.facebook.com/docs/graph-api/rights-manager-api#reference-only)

[Understanding the video\_copyright\_rule and video\_copyright Endpoints](https://developers.facebook.com/docs/graph-api/rights-manager-api#differences)

[The video\_copyright\_rule Endpoint](https://developers.facebook.com/docs/graph-api/rights-manager-api#videocopyrightrule)

[Creating a Copyright Rule](https://developers.facebook.com/docs/graph-api/rights-manager-api#create)

[Reading a Copyright Rule](https://developers.facebook.com/docs/graph-api/rights-manager-api#read)

[Deleting a Copyright Rule](https://developers.facebook.com/docs/graph-api/rights-manager-api#delete)

[The video\_copyright Endpoint](https://developers.facebook.com/docs/graph-api/rights-manager-api#videocopyright)

[Creating a video\_copyright Endpoint](https://developers.facebook.com/docs/graph-api/rights-manager-api#creatingvideocopyright)

# Rights Manager API

The Rights Manager API enables publishers to claim copyright ownership for videos and manage copyright matching rules with two new endpoints: the `video_copyright_rule` endpoint and `video_copyright` endpoint.

### Permissions

To use this API, you'll need to [apply for access](https://www.facebook.com/rights_manager/apply) to the Rights Manager tool (you must be signed in to Facebook to use this tool).
You can read more and learn about Rights Manager in [rightsmanager.fb.com](https://l.facebook.com/l.php?u=https%3A%2F%2Frightsmanager.fb.com%2F&h=AUDugApME08eJKEd_Djg53eUVEXsnczDO97CR5Urc6DmgJ7PZV3-2LRxmY5RGeDp7iUso5xgrNnzTM4-Ec8Ioh-MUFhUtq9DpbnuKy5ObFhG_XzRGEq7XLbonoQ8KsJV9-ULzANOt09m2g).

## Copyrighting Video

The Rights Manager API can only be applied to videos on pages. All pages need to go through the enrollment process in order to be eligible to use the API.

Before you can copyright video you should create video content on a Facebook **Page**. This can be done through the Video Upload API or Live Video API.

### For Videos, the steps are:

1. Upload a video to Facebook and obtain video id.
2. Use Rights Manager API to copyright the video.

### For Live Videos, the steps are:

1. Create a live\_video object and obtain live video id.
2. Use Rights Manager API to copyright the live video.
3. Start streaming using your streaming software.

### Reference Only

If the video should be used **only** as a reference video, and **not** for consumption and distribution on Facebook, the video should be uploaded using the ['reference\_only'](https://developers.facebook.com/docs/graph-api/reference/video/) param, and the Rights Manager API needs to be called using the [`is_reference_video`](https://developers.facebook.com/docs/graph-api/reference/video-copyright/#Creating) param.
When streaming, just make sure you call Rights Manager with 'is\_reference\_video' before starting to stream.
The video or live video will not appear in your Video Library, and will only be visible to the Admin, in the Reference Files section of the Rights Manager tool.

## Understanding the `video_copyright_rule` and `video_copyright` Endpoints

- `video_copyright_rule` endpoint: This endpoint allows you to create a copyright rule. For example, you can determine under what kind of condition a copyright report should be triggered and what kind of action should be taken.

- `video_copyright` endpoint: You can use this endpoint to copyright a specific video. You can also specify copyright ownership and apply a copyright rule here.


## The `video_copyright_rule` Endpoint

The [`video_copyright_rule` endpoint](https://developers.facebook.com/docs/graph-api/reference/video-copyright-rule) allows you to create copyright rules that determine which actions to take on a video that matches these rules. For example, you as a rights owner can create a copyright rule that allows usage of your video for less than 3 minutes.

There are several types of conditions:

- `GEO`: Determines if the video is available in a certain location. For example, if a video can be viewed in the UK, and the geo condition is 'UK and US', then the video meets the condition.
- `OVERLAP_DURATION`: Determines how long the match occurs (greater or less than 2 or 3 minutes for example)
- `MATCH_OVERLAP_PERCENTAGE`: Determines what percentage of the matching video matches (greater or less than 20% of the matching video for example)
- `REFERENCE_OVERLAP_PERCENTAGE`: Determines what percentage of your reference file matches (greater or less than 50% for example)
- `MONITORING_TYPE`: Determines if the video, audio, or both match
- `PUBLISHER_TYPE`: Whether the matched video is owned by a Page, Profile, or either one.
- `PRIVACY`: Determines whether the matching video was public or non-public, or either. Non-public videos have a limited audience. For example, a video that is visible to a person's friends or to a group is non-public.

There are four available action types:

- `TRACK`: This action allows you to keep track of the matched video, without taking any action on it. In the future, you will also be able to see insights on the matched video.
- `MONETIZE`: This action allows you to share in the ad revenue that a video generates. It requires that you have set up Payments, which you can do from the Rights Manager section of your Page Settings.
- `BLOCK`: Blocking a video means it will not be visible in any geos in which you own it
- `MANUAL_REVIEW`: This action will send the match to the Manual Review section of Rights Manager, so that you may manually apply an action on the matched video. Matches in your manual review section will expire in 30 days.

## Creating a Copyright Rule

You can create a copyright rule by making a POST request to the `video_copyright_rules` edge at the following path: [`POST/{pageid}/video_copyright_rules`](https://developers.facebook.com/docs/graph-api/reference/video-copyright-rule/#Creating).

```code
curl \
-X POST \
'https://graph.facebook.com/v2.6/405152342992687/video_copyright_rules' \
 -F 'access_token=XXXXXXXX' \
 -F 'name="testrule"' \
 -F 'condition_groups=[{action:"MANUAL_REVIEW",conditions:[{type:"MONITORING_TYPE",operator:"IS",value:"VIDEO_ONLY"},{type:"OVERLAP_DURATION",operator:"LESS_THAN",value:120000},{type:"GEO",operator:"IN_SET",value:["AR","AU"]}]}]'
```

## Reading a Copyright Rule

Issue a [`GET /video_copyright_rule_id request`](https://developers.facebook.com/docs/graph-api/d) to get more information about the copyright rule.

Note in this example that `576407315867188` is the copyright rule ID.

```code
curl \
-X GET \
'https://graph.facebook.com/v2.6/576407315867188?&amp;access_token=XXXXXXXX' \
```

## Deleting a Copyright Rule

You can delete a live video by making a [`DELETE /video_copyright_rule_id` request](https://developers.facebook.com/docs/graph-api/reference/video-copyright-rule#Deleting).

## The `video_copyright` Endpoint

The `video_copyright` endpoint allows you to specify which video you want to copyright. From this endpoint, you can whitelist other pages or users to use the reference video. For example, if you have 3 pages and want to copyright a certain video to be able to play on all of your pages, you can specify those pages in the whitelist.

## Creating a `video_copyright` Endpoint

You can make a `POST` request to the [`video_copyrights` edge](https://developers.facebook.com/docs/graph-api/reference/video-copyright/#Creating) from the following paths: `/{page_id}/video_copyrights`

Note in this example that `576425449198708` is the video ID representing the video to be copyrighted.

```code
curl \
-X POST \
'https://graph.facebook.com/v2.6/405152342992687/video_copyrights' \
-F  'access_token=XXXXXXXX' \
-F  'copyright_content_id=576425449198708' \
-F  'is_reference_video=true' \
-F  'monitoring_type=VIDEO_ONLY' \
-F  'rule_id=576407315867188' \
-F  'whitelisted_ids=[139577256378818]' \
-F  'ownership_countries=[“us”,”ca”]' \
Return values: Video copyright id.
{"id":"576425925865327"}
```

For any given video, you can query the 'copyright' field to obtain more information about the `video_copyright` node.

```code
curl \
-X GET \
'https://graph.facebook.com/v2.6/576407315867188?fields=copyright&amp;access_token=XXXXXXXX' \
```

Update, Read, and Delete capabilities are also available for the `video_copyright` endpoint. For more information, please refer to the [video copyright endpoint documentation](https://developers.facebook.com/docs/graph-api/reference/video-copyright).

On This Page

[Rights Manager API](https://developers.facebook.com/docs/graph-api/rights-manager-api#rights-manager-api)

[Copyrighting Video](https://developers.facebook.com/docs/graph-api/rights-manager-api#copyrightvideo)

[For Videos, the steps are:](https://developers.facebook.com/docs/graph-api/rights-manager-api#for-videos--the-steps-are-)

[For Live Videos, the steps are:](https://developers.facebook.com/docs/graph-api/rights-manager-api#for-live-videos--the-steps-are-)

[Reference Only](https://developers.facebook.com/docs/graph-api/rights-manager-api#reference-only)

[Understanding the video\_copyright\_rule and video\_copyright Endpoints](https://developers.facebook.com/docs/graph-api/rights-manager-api#differences)

[The video\_copyright\_rule Endpoint](https://developers.facebook.com/docs/graph-api/rights-manager-api#videocopyrightrule)

[Creating a Copyright Rule](https://developers.facebook.com/docs/graph-api/rights-manager-api#create)

[Reading a Copyright Rule](https://developers.facebook.com/docs/graph-api/rights-manager-api#read)

[Deleting a Copyright Rule](https://developers.facebook.com/docs/graph-api/rights-manager-api#delete)

[The video\_copyright Endpoint](https://developers.facebook.com/docs/graph-api/rights-manager-api#videocopyright)

[Creating a video\_copyright Endpoint](https://developers.facebook.com/docs/graph-api/rights-manager-api#creatingvideocopyright)