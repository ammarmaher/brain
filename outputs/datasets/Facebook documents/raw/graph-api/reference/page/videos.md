---
url: https://developers.facebook.com/docs/graph-api/reference/page/videos/
title: Graph API Reference v25.0: Page Videos
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fpage%2Fvideos%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)
- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)
- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)
- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Page Videos](https://developers.facebook.com/docs/graph-api/reference/page/videos/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page/videos/#Reading)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page/videos/#Creating)

[Get Started](https://developers.facebook.com/docs/graph-api/reference/page/videos/#get-started)

[Requirements](https://developers.facebook.com/docs/graph-api/reference/page/videos/#requirements)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page/videos/#parameters)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/page/videos/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page/videos/#error-codes)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page/videos/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page/videos/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/page/videos/#)

# Page Videos

Represents a collection of [Videos](https://developers.facebook.com/docs/graph-api/reference/video) for a Page.

## Reading

You can't perform this operation on this endpoint.

## Creating

### Get Started

Refer to the [Video API Publishing guide](https://developers.facebook.com/docs/video-api/guides/publishing) to learn how to upload and publish a video.

### Requirements

To create an unpublished video for advertising, you will need:

- A Page access token requested by a person who can perform the `ADVERTISE` task on the Page.
- The `pages_manage_ads` and `pages_show_list` permissions

To create and publish a video, you will need:

- A Page access token requested by a person who can perform the `CREATE_CONTENT` task on the Page.
- The `pages_manage_posts`, `pages_read_engagement`, and `pages_show_list` permissions

You can make a POST request to `videos` edge from the following paths:

- [`/{page_id}/videos`](https://developers.facebook.com/docs/graph-api/reference/page/videos/)

When posting to this edge, a [Video](https://developers.facebook.com/docs/graph-api/reference/video/) will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `ad_breaks`<br>array | Time offsets of ad breaks in milliseconds. Ad breaks are short ads that play within a video. Place new ad breaks or delete existing ones. |
| `audio_story_wave_animation_handle`<br>string | Everstore handle of wave animation used to burn audio story video |
| `backdated_post`<br>array | Settings to allow backdated video post.A backdated post needs to be published. |
| `backdated_time`<br>datetime | The time when the video post was created.<br>Required |
| `backdated_time_granularity`<br>enum{year, month, day, hour, min, none} | Default value: `none`<br>Accuracy of the backdated time. |
| `hide_from_newsfeed`<br>boolean | Default value: `false`<br>Whether to hide the video from newsfeed display. |
| `content_category`<br>enum {BEAUTY\_FASHION, BUSINESS, CARS\_TRUCKS, COMEDY, CUTE\_ANIMALS, ENTERTAINMENT, FAMILY, FOOD\_HEALTH, HOME, LIFESTYLE, MUSIC, NEWS, POLITICS, SCIENCE, SPORTS, TECHNOLOGY, VIDEO\_GAMING, OTHER} | Content category of this video. |
| `content_tags`<br>list<numeric string> | Tags that describe the contents of the video. Use search endpoint with `type=adinterest` to get possible IDs. Example:<br>```<br>~~~~<br>/search?type=adinterest&q=couscous<br>~~~~<br>``` |
| `crossposted_video_id`<br>numeric string or integer | The video id that the new video post will be reusing |
| `custom_labels`<br>list<string> | Labels used to describe the video. Unlike content tags, custom labels are not published and only appear in insights data. |
| `description`<br>UTF-8 string | The text describing a post that may be shown in a story about it. It may include rich text information, such as entities and emojis.<br>Supports Emoji |
| `direct_share_status`<br>int64 | The status to allow sponsor directly boost the post. |
| `edit_description_spec`<br>JSON object | Specification for burned-in text and sticker elements that require screen reader support. Contains information about on-screen text overlays, their positions, timing, and accessibility labels to enable proper screen reader functionality for video content. |
| `screen_readers`<br>array<JSON object> |  |
| `embeddable`<br>boolean | Whether the video is embeddable. |
| `end_offset`<br>int64 | end\_offset |
| `expiration`<br>Object | Time the video expires and whether it will be removed or hidden. |
| `time`<br>string |  |
| `type`<br>enum{expire\_and\_delete, expire\_only} |  |
| `feed_targeting`<br>feed target | Object that controls [news feed targeting](https://www.facebook.com/help/352402648173466) for this content. Anyone in these demographics will be more likely to see this content, those not will be less likely, but may still see it anyway. Any of the targeting fields shown here can be used, none are required. |
| `geo_locations`<br>Object |  |
| `countries`<br>list<string> |  |
| `regions`<br>list<Object> |  |
| `key`<br>int64 |  |
| `cities`<br>list<Object> |  |
| `key`<br>int64 |  |
| `zips`<br>list<Object> |  |
| `key`<br>string |  |
| `locales`<br>list<string> | Values for targeted locales. Use `type` of `adlocale` to [find Targeting Options](https://developers.facebook.com/docs/marketing-api/targeting-search) and use the returned key to specify. |
| `age_min`<br>int64 | Must be `13` or higher. Default is 0. |
| `age_max`<br>int64 | Maximum age. |
| `genders`<br>list<int64> | Target specific genders. `1` targets all male viewers and `2` females. Default is to target both. |
| `college_years`<br>list<int64> | Array of integers. Represent graduation years from college. |
| `education_statuses`<br>list<int64> | Array of integers which represent current educational status. Use `1` for high school, `2` for undergraduate, and `3` for alum (or localized equivalents). |
| `interested_in`<br>list<int64> | Deprecated. Please see the [Graph API Changelog](https://developers.facebook.com/docs/graph-api/changelog/breaking-changes#2-7-2018) for more information.<br>Deprecated |
| `relationship_statuses`<br>list<int64> | Array of integers for targeting based on relationship status. Use `1` for single, `2` for 'in a relationship', `3` for married, and `4` for engaged. Default is all types. |
| `interests`<br>list<int64> | One or more IDs of pages to target fans of pages.Use `type` of `page` to get possible IDs as [find Targeting Options](https://developers.facebook.com/docs/marketing-api/targeting-search) and use the returned id to specify. |
| `file_size`<br>int64 | The size of the entire video file in bytes. |
| `file_url`<br>string | Accessible URL of a video file. Cannot be used with `upload_phase`. |
| `fisheye_video_cropped`<br>boolean | Whether the single fisheye video is cropped or not |
| `fov`<br>int64 | 360 video only: Vertical field of view |
| `front_z_rotation`<br>float | The front z rotation in degrees on the single fisheye video |
| `guide`<br>list<list<int64>> | 360 video only: Guide keyframes data. An array of keyframes, each of which is an array of 3 or 4 elements in the following order: \[video timestamp (seconds), pitch (degrees, -90 ~ 90), yaw (degrees, -180 ~ 180), field of view (degrees, 40 ~ 90, optional)\], ordered by video timestamp in strictly ascending order. |
| `guide_enabled`<br>boolean | 360 video only: Whether Guide is active. |
| `initial_heading`<br>int64 | 360 video only: Horizontal camera perspective to display when the video begins. |
| `initial_pitch`<br>int64 | 360 video only: Vertical camera perspective to display when the video begins. |
| `is_voice_clip`<br>boolean | is\_voice\_clip, used to indicate that if a video is used as audio record |
| `multilingual_data`<br>list<Object> | The data of multilingual messages and their dialects |
| `multilingual_status_lang`<br>string |  |
| `multilingual_status`<br>UTF-8 string | Supports Emoji |
| `no_story`<br>boolean | If set to `true`, this will suppress feed and timeline story. |
| `original_fov`<br>int64 | Original field of view of the source camera |
| `original_projection_type`<br>enum {equirectangular, cubemap, half\_equirectangular} | 360 video only: The original projection type of the 360 video being uploaded. |
| `prompt_id`<br>string | The prompt id in prompts or purple rain that generated this post |
| `prompt_tracking_string`<br>string | The prompt tracking string associated with this video post |
| `published`<br>boolean | Default value: `true`<br>Whether a post about this video is published. Non-published videos cannot be backdated. |
| `reference_only`<br>boolean | If set to `true`, this video will not appear anywhere on Facebook and can not be viewed or shared using permalink. After creating copyright for the video, the video can be used as copyright reference video. Default value is `false`. |
| `referenced_sticker_id`<br>numeric string or integer | Sticker id of the sticker in the post |
| `replace_video_id`<br>numeric string or integer | The video id your uploaded video about to replace |
| `scheduled_publish_time`<br>int64 | Time when the page post about this video should go live, this should be between 10 mins and 6 months from the time of publishing the video. |
| `secret`<br>boolean | If set to `true`, this video will not appear anywhere on Facebook and is not searchable. It can be viewed and shared using permalink and embeds. Default value is false. |
| `social_actions`<br>boolean | This can be used to enable or prohibit the use of Facebook socialactions (likes, comments, and sharing) on an unlisted video. Default value is false |
| `source`<br>string | The video, [encoded as form data](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml401%2Finteract%2Fforms.html%23h-17.13.4.2&h=AUBRwDKmpzcHGrwEmjh1yIbxVEf7Iv5HScjYmTQ2lO3z4fclVIASEGr8kwxNyxTj_Ma3SG2cPvZAX43YFuK1HTH22G02xFLKTuqGi3Unwpddi818E4We5qYJrK-3VgxRDeEJnLRUIxEEqQ). This field is required. |
| `source_instagram_media_id`<br>numeric string | source\_instagram\_media\_id |
| `specified_dialect`<br>string | The default dialect of a multilingual post |
| `spherical`<br>boolean | Default value: `false`<br>Set if the video was recorded in 360 format. |
| `sponsor_id`<br>numeric string or integer | Facebook Page id that is tagged as sponsor in the video post |
| `sponsor_relationship`<br>int64 | Sponsor Relationship, such as Presented By or Paid PartnershipWith |
| `start_offset`<br>int64 | Start byte position of the file chunk. |
| `swap_mode`<br>enum {replace} | Type of replacing video request |
| `targeting`<br>target | Object that [limits the audience](https://www.facebook.com/help/352402648173466) for this content. Anyone not in these demographics will not be able to view this content. This will not override any Page-level demographic restrictions that may be in place. |
| `geo_locations`<br>Object |  |
| `countries`<br>list<string> |  |
| `regions`<br>list<Object> |  |
| `key`<br>int64 |  |
| `cities`<br>list<Object> |  |
| `key`<br>int64 |  |
| `zips`<br>list<Object> |  |
| `key`<br>string |  |
| `locales`<br>list<string> |  |
| `excluded_countries`<br>list<string> |  |
| `excluded_regions`<br>list<int64> |  |
| `excluded_cities`<br>list<int64> |  |
| `excluded_zipcodes`<br>list<string> |  |
| `timezones`<br>list<int64> |  |
| `age_min`<br>enum {13, 15, 18, 21, 25} |  |
| `thumb`<br>image | The video thumbnail raw data to be uploaded and associated with a video. |
| `title`<br>UTF-8 string | The title of the video.<br>Supports Emoji |
| `transcode_setting_properties`<br>string | Properties used in computing transcode settings for the video |
| `universal_video_id`<br>string | The publishers asset management code for this video. |
| `unpublished_content_type`<br>enum {SCHEDULED, SCHEDULED\_RECURRING, DRAFT, PUBLISH\_PENDING, ADS\_POST, INLINE\_CREATED, PUBLISHED, REVIEWABLE\_BRANDED\_CONTENT} | Type of unpublished content, such as scheduled, draft or ads\_post. |
| `upload_phase`<br>enum {start, transfer, finish, cancel} | Type of chunked upload request. |
| `upload_session_id`<br>numeric string or integer | ID of the chunked upload session. |
| `video_file_chunk`<br>string | The video file chunk, [encoded as form data](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FTR%2Fhtml401%2Finteract%2Fforms.html%23h-17.13.4.2&h=AUBkna0tmBGfpOXrhyG0CILngrsgVvkaxdPKjvV4WjIjKPhrbxSq_q64WoAYsqyA_dRd8H-F-NHK6UyGe60vsBQ0_PA7qVNd_c-JUNpGYxjC73vcHowWrokxCP2ZFxIwhPA_LXCXkGyOwQ). This field is required during `transfer` upload phase. |

### Return Type

Struct {

`id`: numeric string,

`upload_session_id`: numeric string,

`video_id`: numeric string,

`start_offset`: numeric string,

`end_offset`: numeric string,

`success`: bool,

`skip_upload`: bool,

`upload_domain`: string,

`region_hint`: string,

`xpv_asset_id`: numeric string,

`is_xpv_single_prod`: bool,

`transcode_bit_rate_bps`: numeric string,

`transcode_dimension`: numeric string,

`should_expand_to_transcode_dimension`: bool,

`action_id`: string,

`gop_size_seconds`: numeric string,

`target_video_codec`: string,

`target_hdr`: string,

`maximum_frame_rate`: numeric string,

}

### Error Codes

| Error | Description |
| --- | --- |
| 200 | Permissions error |
| 6001 | There was a problem uploading your video. Please try again. |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 389 | Unable to fetch video file from URL. |
| 100 | Invalid parameter |
| 6000 | There was a problem uploading your video file. Please try again with another file. |
| 190 | Invalid OAuth 2.0 Access Token |
| 210 | User not visible |
| 382 | The video file you tried to upload is too small. Please try again with a larger file. |

## Updating

Use the [Video endpoint](https://developers.facebook.com/docs/graph-api/reference/video) to update a Video.

You can't perform this operation on this endpoint.

## Deleting

Use the [Video endpoint](https://developers.facebook.com/docs/graph-api/reference/video) to delete a Video.

You can't perform this operation on this endpoint.

On This Page

[Page Videos](https://developers.facebook.com/docs/graph-api/reference/page/videos/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page/videos/#Reading)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page/videos/#Creating)

[Get Started](https://developers.facebook.com/docs/graph-api/reference/page/videos/#get-started)

[Requirements](https://developers.facebook.com/docs/graph-api/reference/page/videos/#requirements)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page/videos/#parameters)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/page/videos/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page/videos/#error-codes)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page/videos/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page/videos/#Deleting)