---
url: https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations
title: Feb 3, 2020 - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fchangelog%2F2020-02-03-endpoint-deprecations%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Changelog](https://developers.facebook.com/docs/graph-api/changelog)

- [Upgrade](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade)
- [Versions](https://developers.facebook.com/docs/graph-api/changelog/versions)
- [Out-Of-Cycle Changes](https://developers.facebook.com/docs/graph-api/changelog/out-of-cycle-changes)

On This Page

[2020-02-03 Endpoint Deprecations](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#2020-02-03-endpoint-deprecations)

[Ads](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#ads)

[Album](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#album)

[Application](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#application)

[Audience Network](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#audience-network)

[Authentication](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#authentication)

[Business](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#business)

[Comments](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#comments)

[Device Based Login](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#device-based-login)

[Events](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#events)

[Fundraisers](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#fundraisers)

[Groups](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#groups)

[Instagram](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#instagram)

[Links](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#links)

[OpenGraph](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#opengraph)

[Pages](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#pages)

[Places](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#places)

[Photo](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#photo)

[Posts](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#posts)

[Surveys](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#surveys)

[Unified Threads](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#unified-threads)

[Users](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#users)

[Video](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#video)

[Corrections](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#corrections)

# 2020-02-03 Endpoint Deprecations

The following endpoints are deprecated for version 6.0+ of the Graph and Marketing APIs, and will be deprecated for all versions on May 5th, 2020.

## Ads

- `DELETE /<AD_ACCOUNT_ID>/ads`
- `DELETE /<AD_CAMPAIGN_GROUP_ID>/adlabels`
- `DELETE /<ADGROUP_ID>/adlabels`
- `GET /ads_planner_plan_creation`
- `GET /ads_planner_predictions_sync`
- `GET /ads_planner_sharing_spec_update`
- `GET /<AD_ACCOUNT_ID>/async_sessions`
- `GET /<AD_ACCOUNT_ID>/audiencesharing_recipientaccounts`
- `GET /<AD_ACCOUNT_ID>/brand_audiences`
- `GET /<AD_ACCOUNT_ID>/column_suggestions`
- `GET /<AD_ACCOUNT_ID>/custom_audience_limits`
- `GET /<CUSTOM-AUDIENCE-ID>/capabilities`
- `GET /<CUSTOM-AUDIENCE-ID>/shared_account_campaign_info`
- `GET /<CUSTOM-AUDIENCE-ID>/usage_history`
- `GET /<ADS_PIXEL_ID>/audiences`
- `GET /<ADS_PLANNER_PLAN_ID>`
- `GET /custom_audience_third_party_id`
- `GET /<SAVED_AUDIENCE_ID>/adsets`
- `POST /<AD_ACCOUNT_ID>/deactivate`
- `POST /<AD_ACCOUNT_ID>/emailimport`
- `POST /<CUSTOM-AUDIENCE-ID>/upload`
- `DELETE /<CUSTOM_AUDIENCE-ID>/upload`

## Album

- `GET /{album-id}/likes` (Reinstated 2020-06-08)
- `GET /{album-id}/reactions`
- `GET /{object-album-id}/likes`

## Application

- `GET /{application-id}/banned`
- `GET /{application-id}/custom_audience_third_party_id`
- `GET /{application-context-id}/friends_using_app`

## Audience Network

See [Corrections](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#corrections) below.

## Authentication

- `GET /Auth`

## Business

- `DELETE /{business-id}/adaccounts` (Reinstated October 20, 2020)
- `GET /{business-id}/customconversions`
- `GET /{business-id}/deal_shows_pages`
- `GET /{business-id}/initiated_sharing_agreements`
- `GET /{business-id}/offline_terms_of_service`
- `GET /{business-id}/pending_offline_conversion_data_sets`
- `GET /{business-id}/pending_shared_pixels`
- `GET /{business-id}/product_catalogs`
- `GET /{business-id}/received_audience_permissions`
- `GET /{business-id}/received_inprogress_onbehalf_requests`
- `GET /{business-id}/received_sharing_agreements`
- `GET /{business-id}/sent_inprogress_onbehalf_requests`
- `GET /{business-id}/shared_audience_permissions`
- `GET /{business-agreement-id}`
- `GET /{business-project-id}/adaccounts`
- `GET /{business-project-id}/apps`
- `GET /{business-project-id}/pages`
- `GET /{business-project-id}/product_catalogs`
- `POST /{business-id}/sent_inprogress_onbehalf_requests`
- `POST /{business-agreement-id}`

## Comments

See [Corrections](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#corrections) below.

- `GET /{comment-id}/likes` (Reinstated on 2020-06-08)
- `POST /{comment-id}/reactions`

## Device Based Login

- `GET /DBL`

## Events

- `GET /imported_events`
- `GET /{event-id}/admins`
- `GET /{event-id}/feed`
- `GET /{event-id}/picture`
- `GET /{event-id}/posts`
- `GET /{event-id}/roles`
- `GET /{event-id}/videos`
- `POST /{event-id}/feed`
- `POST /{event-id}/photos`

## Fundraisers

- `POST /{fundraiser-donation-id}/comments`
- `POST /{FundraiserPersonForPerson}/videos`
- `POST /{FundraiserPersonToCharity}/feed`
- `POST /{FundraiserPersonToCharity}/videos`

## Groups

- `GET /{group-id}/companies`
- `GET /{group-id}/reported_content`
- `GET /{group-message-id}/comments`
- `GET /{group-message-id}/feed`
- `GET /{group-message-id}/likes`
- `GET /{group-message-id}/posts`
- `POST /{group-message-id}/comments`

## Instagram

Note that these endpoints are not part of [Instagram Graph API](https://developers.facebook.com/docs/instagram-api) or the [Instagram Basic Display API](https://developers.facebook.com/docs/instagram-basic-display-api).

- `POST /{instagram-auth-id}/secure_account_link`

## Links

- `GET /{app-links-id}`
- `GET /{link-id}/comments`
- `GET /{link-url-id}/comments`

## OpenGraph

See [Corrections](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#corrections) below.

- `GET /{open-graph-action}`
- `GET /{open-graph-action}/likes`
- `GET /{open-graph-object-id}/likes`
- `GET /{open-graph-object-id}/picture`
- `GET /{single-recommendation-story}/likes`

## Pages

See [Corrections](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#corrections) below.

- `DELETE /{page-id}/roles`
- `GET /page_message_tags`
- `GET /{page-id}/news_subscriptions`
- `GET /{page-id}/rich_media_documents`
- `GET /{page-id}/show_playlists`
- `GET /{page-id}/userpermissions`
- `GET /{page-broadcast-id}`
- `GET /{page-broadcast-id}/insights`
- `GET /{page-insights-async-export-run-id}`
- `GET /{page-name-id}/news_subscriptions`
- `GET /{page-name-id}/userpermissions`
- `GET /{page-post-id}/edit_actions`
- `GET /{page-post-id}/with_tags`
- `GET /{question-id}/comments`
- `POST /{page-id}/call_to_actions`
- `POST /{page-id}/roles`
- `POST /{page-broadcast-id}`
- `POST /{page-post-id}/reactions`

## Places

- `GET /{place-information-id}`

## Photo

- `GET /{photo-id}/reactions`
- `GET /{photo-id}/tags`

## Posts

See [Corrections](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#corrections) below.

- `GET /{post-id}/edit_actions`
- `GET /{post-id}/likes`
- `GET /{post-id}/with_tags`
- `GET /{post-comment-id}/likes`
- `POST /{post-id}/reactions`

## Surveys

- `POST /{structured-survey-id}/impressions`

## Unified Threads

- `DELETE /{unified-thread-id}/participants`
- `POST /{unified-thread-id}/participants`
- `POST /{unified-thread-id}/threadname`

## Users

- `GET /{user-id}/domains`
- `GET /{user-id}/family`
- `GET /{user-id}/insights`
- `GET /{user-id}/notifications`
- `GET /{user-id}/promotable_events`
- `GET /{user-id}/screennames`
- `GET /{user-id}/session_keys`
- `GET /{user-id}/tagged`
- `GET /{user-id}/threads`
- `GET /{user-context-id}/mutual_likes`

## Video

- `GET /{video-id}/reactions`
- `GET /{video-id}/sharedposts`
- `POST /{video-id}/reactions`

## Corrections

The following endpoints were erroneously listed and will not be deprecated at this time.

- `GET /{open-graph-object-id}/comments`
- `GET /{post-comment-id}/comments`
- `DELETE /{post-comment-id}/likes`
- `POST /{open-graph-action}/comments`
- `POST /{page-id}/albums`

On This Page

[2020-02-03 Endpoint Deprecations](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#2020-02-03-endpoint-deprecations)

[Ads](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#ads)

[Album](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#album)

[Application](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#application)

[Audience Network](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#audience-network)

[Authentication](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#authentication)

[Business](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#business)

[Comments](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#comments)

[Device Based Login](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#device-based-login)

[Events](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#events)

[Fundraisers](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#fundraisers)

[Groups](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#groups)

[Instagram](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#instagram)

[Links](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#links)

[OpenGraph](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#opengraph)

[Pages](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#pages)

[Places](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#places)

[Photo](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#photo)

[Posts](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#posts)

[Surveys](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#surveys)

[Unified Threads](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#unified-threads)

[Users](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#users)

[Video](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#video)

[Corrections](https://developers.facebook.com/docs/graph-api/changelog/2020-02-03-endpoint-deprecations#corrections)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close