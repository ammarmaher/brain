---
url: https://developers.facebook.com/docs/pages-api/changelog
title: Changelog - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2Fchangelog%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook Pages API](https://developers.facebook.com/docs/pages-api)

- [Overview](https://developers.facebook.com/docs/pages-api/overview)
- [Create an app](https://developers.facebook.com/docs/pages-api/create-an-app)
- [Webhooks](https://developers.facebook.com/docs/pages-api/webhooks-for-pages)
- [Get Started](https://developers.facebook.com/docs/pages-api/getting-started)
- [Manage a Page](https://developers.facebook.com/docs/pages-api/manage-pages)
- [Upcoming Changes](https://developers.facebook.com/docs/pages/upcoming-changes)
- [Comments and @Mentions](https://developers.facebook.com/docs/pages-api/comments-mentions)
- [Posts](https://developers.facebook.com/docs/pages-api/posts)
- [Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook)
- [Insights](https://developers.facebook.com/docs/platforminsights/page)
- [Search Pages](https://developers.facebook.com/docs/pages-api/search-pages)
- [Error Codes](https://developers.facebook.com/docs/pages-api/error-codes)
- [Changelog](https://developers.facebook.com/docs/pages-api/changelog)

On This Page

[Changelog](https://developers.facebook.com/docs/pages-api/changelog#changelog)

[January 30, 2026](https://developers.facebook.com/docs/pages-api/changelog#january-30--2026)

[November, 15 2025](https://developers.facebook.com/docs/pages-api/changelog#november--15-2025)

[September, 16 2024](https://developers.facebook.com/docs/pages-api/changelog#september--16-2024)

[June 17, 2024](https://developers.facebook.com/docs/pages-api/changelog#june-17--2024)

[March 14, 2024](https://developers.facebook.com/docs/pages-api/changelog#march-14--2024)

[December 14, 2023](https://developers.facebook.com/docs/pages-api/changelog#december-14--2023)

[2021-06-21](https://developers.facebook.com/docs/pages-api/changelog#2021-06-21)

[2021-03-18](https://developers.facebook.com/docs/pages-api/changelog#2021-03-18)

[2021-03-25](https://developers.facebook.com/docs/pages-api/changelog#2021-03-25)

[2021-01-04](https://developers.facebook.com/docs/pages-api/changelog#2021-01-04)

[2020-10-02](https://developers.facebook.com/docs/pages-api/changelog#2020-10-02)

[Available Endpoints for the New Pages Experience](https://developers.facebook.com/docs/pages-api/changelog#available-endpoints-for-the-new-pages-experience)

# Changelog

Facebook Pages and related endpoints and fields will be made available for the new Pages experience in the future.

## January 30, 2026

#### \[New\] Page Integrity API

You can now get real-time integrity information for a page via the [Page Integrity Webhook and API](https://developers.facebook.com/docs/pages-api/integrity-webhook#page-integrity-webhook). This includes the integrity status, violations, restrictions, recommended actions (e.g. file an appeal) and appeal status.

## November, 15 2025

#### Page Insights API Updates

_Applies to all versions._

On November 15, 2025, a number of the Page Insights metrics will be deprecated for all API versions. The API will return an invalid metric error when calling any of these metrics. [Learn more.](https://developers.facebook.com/blog/post/2025/08/15/page-insights-api-updates/)

- `page_fans (Alternative: page_follows)`

- `Page_fans_locale`

- `Page_fans_city (Alternative: page_follows_city)`

- `Page_fans_country (Alternative: page_follows_country)`

- `Page_fan_adds`

- `Page_fan_adds_unique`

- `Page_fan_removes`

- `page_fan_removes_unique*`

- `page_impressions* (Alternative: page_media_view)`

- `page_impressions_paid* (Alternative: page_media_view with is_from_ads breakdown)`

- `page_impressions_viral*`

- `page_impressions_nonviral*`

- `post_impressions* (Alternative: post_media_view)`

- `post_impressions_paid* (Alternative: post_media_view with is_from_ads breakdown)`

- `post_impressions_fan* (Alternative: post_media_view with is_from_followers breakdown)`

- `post_impressions_organic* (Alternative: post_media_view with is_from_ads breakdown)`

- `post_impressions_viral*`

- `post_impressions_nonviral*`


## September, 16 2024

#### Page Insights API Updates

_Applies to all versions._

The following Page Insights metrics have been deprecated for all API versions. The API returns an invalid metric error when calling any of these metrics.

- `page_call_phone_clicks_logged_in_by_locale_unique`
- `page_call_phone_clicks_logged_in_count`
- `page_call_phone_clicks_logged_in_unique`
- `page_consumptions_by_consumption_type`
- `page_consumptions_by_consumption_type_unique`
- `page_consumptions_unique`
- `page_cta_clicks_logged_in_total`
- `page_cta_clicks_logged_in_unique`
- `page_daily_follows_by_paid_non_paid_unique`
- `page_daily_follows_by_source`
- `page_daily_follows_by_source_unique`
- `page_daily_unfollows_by_source`
- `page_daily_unfollows_by_source_unique`
- `page_fans_by_like_source`
- `page_fans_by_like_source_unique`
- `page_fans_by_unlike_source`
- `page_fans_by_unlike_source_unique`
- `page_fans_online`
- `page_fans_online_per_day`
- `page_get_directions_clicks_logged_in_count`
- `page_get_directions_clicks_logged_in_unique`
- `page_impressions_by_age_gender_unique`
- `page_impressions_by_city_unique`
- `page_impressions_by_country_id_unique`
- `page_impressions_by_country_unique`
- `page_impressions_by_locale_unique`
- `page_impressions_by_paid_non_paid`
- `page_impressions_by_paid_non_paid_unique`
- `page_impressions_by_story_type`
- `page_impressions_by_story_type_unique`
- `page_impressions_organic_unique_v2`
- `page_impressions_organic_v2`
- `page_impressions_frequency_distribution`
- `page_impressions_viral_frequency_distribution`
- `page_negative_feedback`
- `page_negative_feedback_by_type`
- `page_negative_feedback_by_type_unique`
- `page_negative_feedback_unique`
- `page_places_checkin_total`
- `page_places_checkin_total_unique`
- `page_palces_checkins_by_age_gender`
- `page_places_checkins_by_city`
- `page_places_checkins_by_country`
- `page_places_checkins_by_locale`
- `page_posts_impressions_by_paid_non_paid`
- `page_posts_impressions_by_paid_non_paid_unique`
- `page_posts_impressions_frequency_distribution`
- `page_posts_impressions_organic`
- `page_posts_impressions_organic_unique`
- `page_posts_impressions_organic_v2 (on hold)`
- `page_story_adds_by_country_unique`
- `page_tab_views_login_top`
- `page_tab_views_login_top_unique`
- `page_tab_views_logout_top`
- `page_views`
- `page_views_external_referrals`
- `page_views_login_unique`
- `page_views_login`
- `page_views_logout`
- `page_views_unique`
- `page_website_clicks_logged_in_by_city_unique`
- `page_website_clicks_logged_in_by_country_unique`
- `page_website_clicks_logged_in_by_locale_unique`
- `page_website_clicks_logged_in_count`
- `page_website_clicks_logged_in_unique`
- `post_clicks_unique*`
- `post_clicks_by_type_unique`
- `post_cta_clicks_by_type`
- `post_cta_clicks_total`
- `post_engaged_fan`
- `post_engaged_users*`
- `post_impressions_by_paid_non_paid`
- `post_impressions_by_story_type*`
- `post_impressions_by_story_type_unique*`
- `post_negative_feedback*`
- `post_negative_feedback_by_type*`
- `post_negative_feedback_by_type_unique*`
- `post_negative_feedback_unique*`

## June 17, 2024

#### Page Insights API Updates

_Applies to all versions._

On September 16, 2024, a number of the Page Insights metrics will be deprecated for all API versions. The API will return an invalid metric error when calling any of these metrics. [Learn more.](https://developers.facebook.com/blog/post/2024/06/17/page-insights-metrics-removal/)

- `page_call_phone_clicks_logged_in_by_locale_unique`
- `page_call_phone_clicks_logged_in_count`
- `page_call_phone_clicks_logged_in_unique`
- `page_consumptions_by_consumption_type`
- `page_consumptions_by_consumption_type_unique`
- `page_consumptions_unique`
- `page_cta_clicks_logged_in_total`
- `page_cta_clicks_logged_in_unique`
- `page_daily_follows_by_paid_non_paid_unique`
- `page_daily_follows_by_source`
- `page_daily_follows_by_source_unique`
- `page_daily_unfollows_by_source`
- `page_daily_unfollows_by_source_unique`
- `page_fans_by_like_source`
- `page_fans_by_like_source_unique`
- `page_fans_by_unlike_source`
- `page_fans_by_unlike_source_unique`
- `page_fans_online`
- `page_fans_online_per_day`
- `page_get_directions_clicks_logged_in_count`
- `page_get_directions_clicks_logged_in_unique`
- `page_impressions_by_age_gender_unique`
- `page_impressions_by_city_unique`
- `page_impressions_by_country_id_unique`
- `page_impressions_by_country_unique`
- `page_impressions_by_locale_unique`
- `page_impressions_by_paid_non_paid`
- `page_impressions_by_paid_non_paid_unique`
- `page_impressions_by_story_type`
- `page_impressions_by_story_type_unique`
- `page_impressions_organic_unique_v2`
- `page_impressions_organic_v2`
- `page_impressions_frequency_distribution`
- `page_impressions_viral_frequency_distribution`
- `page_negative_feedback`
- `page_negative_feedback_by_type`
- `page_negative_feedback_by_type_unique`
- `page_negative_feedback_unique`
- `page_places_checkin_total`
- `page_places_checkin_total_unique`
- `page_palces_checkins_by_age_gender`
- `page_places_checkins_by_city`
- `page_places_checkins_by_country`
- `page_places_checkins_by_locale`
- `page_posts_impressions_by_paid_non_paid`
- `page_posts_impressions_by_paid_non_paid_unique`
- `page_posts_impressions_frequency_distribution`
- `page_posts_impressions_organic`
- `page_posts_impressions_organic_unique`
- `page_posts_impressions_organic_v2 (on hold)`
- `page_story_adds_by_country_unique`
- `page_tab_views_login_top`
- `page_tab_views_login_top_unique`
- `page_tab_views_logout_top`
- `page_views`
- `page_views_external_referrals`
- `page_views_login_unique`
- `page_views_login`
- `page_views_logout`
- `page_views_unique`
- `page_website_clicks_logged_in_by_city_unique`
- `page_website_clicks_logged_in_by_country_unique`
- `page_website_clicks_logged_in_by_locale_unique`
- `page_website_clicks_logged_in_count`
- `page_website_clicks_logged_in_unique`
- `post_clicks_unique*`
- `post_clicks_by_type_unique`
- `post_cta_clicks_by_type`
- `post_cta_clicks_total`
- `post_engaged_fan`
- `post_engaged_users*`
- `post_impressions_by_paid_non_paid`
- `post_impressions_by_story_type*`
- `post_impressions_by_story_type_unique*`
- `post_negative_feedback*`
- `post_negative_feedback_by_type*`
- `post_negative_feedback_by_type_unique*`
- `post_negative_feedback_unique*`

## March 14, 2024

#### Page Insights Metrics Deprecation

_Applies to all versions._

On March 14, 2024, a number of the [Page Insights metrics](https://developers.facebook.com/docs/platforminsights/page/deprecated-metrics) will be deprecated for all API versions. The API will return an invalid metric error when calling any of these metrics. [Learn more.](https://developers.facebook.com/blog/post/2023/12/14/page-insights-metrics-deprecation)

## December 14, 2023

#### Page Insights Metrics Deprecation

_Applies to all versions on March 14, 2024._

On March 14, 2024, a number of the Page Insights metrics will be deprecated for all API versions. The API will return an invalid metric error when calling any of these metrics. [Learn more.](https://developers.facebook.com/blog/post/2023/12/14/page-insights-metrics-deprecation)

- ~~`page_actions_post_reactions_anger_total`~~

- ~~`page_actions_post_reactions_haha_total`~~

- ~~`page_actions_post_reactions_like_total`~~

- ~~`page_actions_post_reactions_love_total`~~

- ~~`page_actions_post_reactions_sorry_total`~~

- ~~`page_actions_post_reactions_total`~~

- ~~`page_actions_post_reactions_wow_total`~~

- `page_call_phone_clicks_by_age_gender_logged_in_unique`

- `page_call_phone_clicks_by_site_logged_in_unique`

- `page_call_phone_clicks_logged_in_by_city_unique`

- `page_call_phone_clicks_logged_in_by_country_unique`

- `page_call_phone_clicks_logged_in_by_locale_unique`

- `page_consumptions`

- `page_content_activity`

- `page_content_activity_by_action_type`

- `page_content_activity_by_action_type_unique`

- `page_content_activity_by_age_gender_unique`

- `page_content_activity_by_city_unique`

- `page_content_activity_by_country_unique`

- `page_content_activity_by_locale_unique`

- `page_content_activity_unique`

- `page_cta_clicks_by_age_gender_logged_in_unique`

- `page_cta_clicks_by_site_logged_in_unique`

- `page_cta_clicks_logged_in_by_city_unique`

- `page_cta_clicks_logged_in_by_country_unique`

- `page_cta_clicks_logged_in_by_locale_unique`

- `page_daily_follows_by_source_unique`

- `page_daily_unfollows_by_source_unique`

- `page_engaged_users`

- `page_fans_by_like_source_unique`

- `page_fans_by_like_source`

- `page_fans_by_unlike_source_unique`

- `page_fans_by_unlike_source`

- `page_fans_gender_age`

- `page_follows_city`

- `page_follows_country`

- `page_follows_gender_age`

- `page_follows_locale`

- `page_get_directions_clicks_by_age_gender_logged_in_unique`

- `page_get_directions_clicks_by_site_logged_in_unique`

- `page_get_directions_clicks_logged_in_by_city_unique`

- `page_get_directions_clicks_logged_in_by_country_unique`

- `page_impressions_frequency_distribution`

- `page_places_checkin_mobile_unique`

- `page_places_checkin_mobile`

- `page_places_checkins_by_age_gender`

- `page_places_checkins_by_city`

- `page_places_checkins_by_country`

- `page_places_checkins_by_locale`

- `page_positive_feedback_by_type_unique`

- `page_positive_feedback_by_type`

- `page_positive_feedback_unique`

- `page_positive_feedback`

- `page_posts_impressions_frequency_distribution`

- `page_views_by_age_gender_logged_in_unique`

- `page_views_by_city_logged_in_unique`

- `page_views_by_country_logged_in_unique`

- `page_views_by_internal_referer_logged_in_unique`

- `page_views_by_locale_logged_in_unique`

- `page_views_by_profile_tab_logged_in_unique`

- `page_views_by_profile_tab_total`

- `page_views_by_referers_logged_in_unique`

- `page_views_by_site_logged_in_unique`

- `page_views_external_referrals`

- `page_views_logged_in_total`

- `page_views_logged_in_unique`

- `page_views_login_unique`

- `page_views_login`

- `page_views_logout`

- `page_website_clicks_by_age_gender_logged_in_unique`

- `page_website_clicks_by_site_logged_in_unique`

- `page_website_clicks_logged_in_by_city_unique`

- `page_website_clicks_logged_in_by_country_unique`

- `page_website_clicks_logged_in_by_locale_unique`

- `post_activity`

- ~~`post_activity_by_action_type`~~

- ~~`post_activity_by_action_type_unique`~~

- `post_activity_unique`

- `post_impressions_fan_paid_unique*`

- `post_impressions_fan_paid*`


## 2021-06-21

- The Page `impressum` field is now available.

## 2021-03-18

- To determine if a Page has been migrated to the new Pages experience, use the new [Page `has_transitioned_to_new_page_experience` field](https://developers.facebook.com/docs/graph-api/reference/page/).

## 2021-03-25

- [`POST /{page-id}/messages`](https://developers.facebook.com/docs/graph-api/reference/page/messages)
- [`POST /{page-id}/messenger_profile`](https://developers.facebook.com/docs/graph-api/reference/page/messenger_profile)

## 2021-01-04

Additional endpoints are now available for the new Pages experience.

|     |     |
| --- | --- |
| - [`POST /{album-id}`](https://developers.facebook.com/docs/graph-api/reference/album/photos)<br>- [`POST /{canvas-button-id}`](https://developers.facebook.com/docs/graph-api/reference/canvas-button)<br>- [`POST /{canvas-carousel-id}`](https://developers.facebook.com/docs/graph-api/reference/canvas-carousel)<br>- [`POST /{canvas-text-id}`](https://developers.facebook.com/docs/graph-api/reference/canvas-text)<br>- [`DELETE /{comment-id}/likes`](https://developers.facebook.com/docs/graph-api/reference/object/likes)<br>- [`GET /{comment-id}/reactions`](https://developers.facebook.com/docs/graph-api/reference/object/reactions)<br>- [`GET /{lead-id}`](https://developers.facebook.com/docs/marketing-api/reference/user-lead-gen-info/)<br>- [`GET /{link-id}/comments`](https://developers.facebook.com/docs/graph-api/reference/object/comments)<br>- [`/{media-fingerprint-id}`](https://developers.facebook.com/docs/graph-api/reference/media-fingerprint)<br>- [`DELETE /{page-id}/blocked`](https://developers.facebook.com/docs/graph-api/reference/page/blocked)<br>- [`/{page-id}/copyright_whitelisted_partners`](https://developers.facebook.com/docs/graph-api/reference/page/copyright_whitelisted_partners)<br>- [`/{page-id}?fields=copyright_whitelisted_ig_partners`](https://developers.facebook.com/docs/graph-api/reference/page#fields)<br>- [`GET /{page-id}/crosspost_whitelisted_pages`](https://developers.facebook.com/docs/graph-api/reference/page/crosspost_whitelisted_pages) | - [`POST /{page-id}/picture`](https://developers.facebook.com/docs/graph-api/reference/page/picture)<br>- [`GET /{page-id}/roles`](https://developers.facebook.com/docs/graph-api/reference/page/roles)<br>- [`/{page-id}/settings`](https://developers.facebook.com/docs/graph-api/reference/page/settings)<br>- [`GET /{pagepost-id}/to`](https://developers.facebook.com/docs/graph-api/reference/pagepost)<br>- [`DELETE /{photo-id}`](https://developers.facebook.com/docs/graph-api/reference/photo/)<br>- [`GET /{photo-id}/likes`](https://developers.facebook.com/docs/graph-api/reference/photo/likes)<br>- [`GET /{photo-id}/picture`](https://developers.facebook.com/docs/graph-api/reference/photo/picture)<br>- [`DELETE /{post-id}/likes`](https://developers.facebook.com/docs/graph-api/reference/object/likes)<br>- [`POST /{video-id}/thumbnails`](https://developers.facebook.com/docs/graph-api/reference/video/thumbnails) |

## 2020-10-02

- Facebook begins migrating select Pages to the [new Pages experience](https://www.facebook.com/business/help/NewPagesExperience)

### Available Endpoints for the New Pages Experience

| Endpoint | Unavailable Fields |
| --- | --- |
| [`/{comment-id}`](https://developers.facebook.com/docs/graph-api/reference/comment) |  |
| [`/{comment-id}/comments`](https://developers.facebook.com/docs/graph-api/reference/object/comments) |  |
| [`/{live-video-id}`](https://developers.facebook.com/docs/graph-api/reference/live-video) |  |
| [`/{media-fingerprint-id}`](https://developers.facebook.com/docs/graph-api/reference/media-fingerprint) |  |
| [`/{page-id}/conversations`](https://developers.facebook.com/docs/graph-api/reference/page/conversations) |  |
| [`/{page-id}/copyright_whitelisted_partners`](https://developers.facebook.com/docs/graph-api/reference/page/copyright_whitelisted_partners) |  |
| [`/{page-id}/feed`](https://developers.facebook.com/docs/graph-api/reference/page/feed) | `GET` fields:<br>- `child_attachments`<br>- `feed_targeting`<br>- `scheduled_publish_time`<br>`POST` fields:<br>- `backdated_time_granularity`<br>- `child_attachments`<br>- `feed_targeting`<br>- `multi_share_end_card`<br>- `multi_share_optimized`<br>- `published`<br>- `scheduled_publish_time` |
| [`/{page-id}/live_videos`](https://developers.facebook.com/docs/graph-api/reference/page/live_videos) |  |
| [`/{page-id}/media_fingerprints`](https://developers.facebook.com/docs/graph-api/reference/page/media_fingerprints) |  |
| [`/{page-id}/posts`](https://developers.facebook.com/docs/graph-api/reference/page/feed) |  |
| [`/{page-id}/promotable_posts`](https://developers.facebook.com/docs/graph-api/reference/page/feed/#promotable-ids) | `GET` fields:<br>- `child_attachments`<br>- `feed_targeting` |
| [`/{page-id}/videos`](https://developers.facebook.com/docs/graph-api/reference/page/videos) |  |
| [`/{page-id}/videos`](https://developers.facebook.com/docs/graph-api/reference/page/videos) |  |
| [`GET /{page-name}/feed`](https://developers.facebook.com/docs/graph-api/reference/page/feed) |  |
| [`GET /{page-name}/posts`](https://developers.facebook.com/docs/graph-api/reference/page/feed) |  |
| [`/{pagepost-id}`](https://developers.facebook.com/docs/graph-api/reference/pagepost) | `GET` fields:<br>- `backdated_time`<br>- `child_attachments`<br>- `feed_targeting`<br>- `scheduled_publish_time` |
| [`/{pagepost-id}/comments`](https://developers.facebook.com/docs/graph-api/reference/pagepost/comments) |  |
| [`/{pagepost-id}/likes`](https://developers.facebook.com/docs/graph-api/reference/pagepost/likes) |  |
| [`/{pagepost-id}/reactions`](https://developers.facebook.com/docs/graph-api/reference/pagepost/reactions) |  |
| [`/{post-id}`](https://developers.facebook.com/docs/graph-api/reference/post) |  |
| [`/{post-id}/comments`](https://developers.facebook.com/docs/graph-api/reference/post/comments) |  |
| [`/{post-id}/reactions`](https://developers.facebook.com/docs/graph-api/reference/post/reactions) |  |
| [`GET /{user-id}/accounts`](https://developers.facebook.com/docs/graph-api/reference/user/accounts) |  |
| [`/{video-id}`](https://developers.facebook.com/docs/graph-api/reference/video) |  |
| [`/{video-id}/video_insights`](https://developers.facebook.com/docs/graph-api/reference/video/video_insights) |  |
| [`/{video_copyright_rule-id}`](https://developers.facebook.com/docs/graph-api/reference/video-copyright-rule) |  |

On This Page

[Changelog](https://developers.facebook.com/docs/pages-api/changelog#changelog)

[January 30, 2026](https://developers.facebook.com/docs/pages-api/changelog#january-30--2026)

[November, 15 2025](https://developers.facebook.com/docs/pages-api/changelog#november--15-2025)

[September, 16 2024](https://developers.facebook.com/docs/pages-api/changelog#september--16-2024)

[June 17, 2024](https://developers.facebook.com/docs/pages-api/changelog#june-17--2024)

[March 14, 2024](https://developers.facebook.com/docs/pages-api/changelog#march-14--2024)

[December 14, 2023](https://developers.facebook.com/docs/pages-api/changelog#december-14--2023)

[2021-06-21](https://developers.facebook.com/docs/pages-api/changelog#2021-06-21)

[2021-03-18](https://developers.facebook.com/docs/pages-api/changelog#2021-03-18)

[2021-03-25](https://developers.facebook.com/docs/pages-api/changelog#2021-03-25)

[2021-01-04](https://developers.facebook.com/docs/pages-api/changelog#2021-01-04)

[2020-10-02](https://developers.facebook.com/docs/pages-api/changelog#2020-10-02)

[Available Endpoints for the New Pages Experience](https://developers.facebook.com/docs/pages-api/changelog#available-endpoints-for-the-new-pages-experience)