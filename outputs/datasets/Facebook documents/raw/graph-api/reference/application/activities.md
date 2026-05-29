---
url: https://developers.facebook.com/docs/graph-api/reference/application/activities/
title: Graph API Reference v25.0: Application Activities
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fapplication%2Factivities%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Application Activities](https://developers.facebook.com/docs/graph-api/reference/application/activities/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/application/activities/#Reading)

[Creating](https://developers.facebook.com/docs/graph-api/reference/application/activities/#Creating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/application/activities/#parameters)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/application/activities/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/application/activities/#error-codes)

[Updating](https://developers.facebook.com/docs/graph-api/reference/application/activities/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/application/activities/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/application/activities/#)

# Application Activities

Application activities are events from your app.

## Reading

You can't perform this operation on this endpoint.

## Creating

You can use a user access token or app access token to log events to this endpoint.

You can make a POST request to `activities` edge from the following paths:

- [`/{application_id}/activities`](https://developers.facebook.com/docs/graph-api/reference/application/activities/)

When posting to this edge, no Graph object will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `add_to_messaging_customer_base_for_whatsapp`<br>string | It's a consent/opt-in field used in Meta's Ads Marketing Messages system, specifically for WhatsApp Marketing Messages. It indicates whether a user/customer has consented to be added to an advertiser's messaging customer base for receiving marketing messages via WhatsApp. |
| `advertiser_id`<br>string | Apple's Advertising Identifier (IDFA) or Google Android's advertising ID. You can see how Facebook fetches this on [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-ios-sdk%2Fblob%2F7fe08877ea773dc35a5e4d6d9d305fae57c513b6%2Fsrc%2FCore%2FFBUtility.m%23L334-L357&h=AUA-wsWloiQ1512nlcSBc8VnVi2qxux9GJnaxfN9y2QxhsPyF0BNXq6KQGHPB8BvuwembXIKKg7q5DCuBH3XPAhtHU_NzGSWdC5WsjFoJyl5maXKp7LDoxR_MoXSzeBM7WQfoliU2JZG6w) or on [Android](https://developers.facebook.com/docs/reference/ads-api/mobile-conversions-endpoint/v2.2#android) |
| `advertiser_tracking_enabled`<br>boolean | Specifies whether a person has enabled advertising tracking on their iOS 14.5+ device. Set to 0 for disabled or 1 for enabled. You should fetch this data and return it to Meta will use the event data (from partners about user activities off Meta) pursuant to its Data Policy, including for ad reporting, fraud detection and to build and improve our products (including our ads delivery products), but will restrict use of data about that individual to personalize that user’s ads. For devices running earlier versions than iOS 6, this parameter should default to 1. |
| `anon_id`<br>string | The ID of a person who has installed the app anonymously |
| `app_user_id`<br>string | Specifies [user id](https://developers.facebook.com/docs/analytics/properties#user-id) of an app user. Used internally by the iOS and Android SDKs for `MOBILE_APP_INSTALL` event |
| `application_tracking_enabled`<br>boolean | A person can choose to enable ad tracking on an app level. Your SDK should allow an app developer to put an opt-out setting into their app. Use this field to specify the person's choice. Use 0 for disabled, 1 for enabled |
| `attribution`<br>string | mobile\_cookie from the person's device. Use this only on Android or iOS devices before iOS 6. The format for this should look something like `DDDECD0A-C076-4050-8CE8-C20EC3FC2BD3` |
| `attribution_referrer`<br>string | attribution\_referrer |
| `attribution_sources`<br>array<JSON object> | For post-install events credited to Meta, attribution\_sources contains information about the earlier claim Meta made (typically for an install event) that drove the attribution for this event. |
| `source_ad_id`<br>int64 | source\_ad\_id |
| `source_ad_engagement_time`<br>datetime/timestamp | source\_ad\_engagement\_time |
| `source_ad_engagement_type`<br>string | source\_ad\_engagement\_type |
| `source_event_time`<br>datetime/timestamp | source\_event\_time |
| `source_event_id`<br>string | source\_event\_id |
| `source_install_id`<br>string | source\_install\_id |
| `source_auditing_token`<br>string | source\_auditing\_token |
| `source_attribution_method`<br>string | source\_attribution\_method |
| `source_is_primary`<br>boolean | source\_is\_primary |
| `source_adgroup_id`<br>int64 | source\_adgroup\_id |
| `auto_publish`<br>boolean | This field is not longer being used. Used to be used internally by Facebook's SDK |
| `bundle_id`<br>string | Used internally by Facebook's SDK |
| `bundle_short_version`<br>string | Used internally by Facebook's SDK |
| `bundle_version`<br>string | Used internally by Facebook's SDK |
| `campaign_ids`<br>string | Parameter passed via the deep link for Mobile App Engagement campaigns. |
| `circuit_breaker_timeout_ms`<br>int64 | circuit\_breaker\_timeout\_ms |
| `click_id`<br>string | click\_id |
| `consider_views`<br>boolean | Specifies that view through data should be considered when determining the ad to attribute this install to. Clicks will always be considered first before views and views will only be returned if there was not a click on an ad for the app |
| `custom_events`<br>list<CustomEvent> | Custom events reported, required with `CUSTOM_APP_EVENTS` events. Please see our [App Events API](https://developers.facebook.com/docs/marketing-api/app-event-api), [App Events for iOS](https://developers.facebook.com/docs/app-events/ios) and [App Events for Android](https://developers.facebook.com/docs/app-events/android) for more information |
| `_eventName`<br>RegexParam | Event name, must match the regular expression /^\[0-9a-zA-Z\_\]\[0-9a-zA-Z \_-\]{0,39}$/<br>Required |
| `_eventName_md5`<br>RegexParam | MD5 hash of the event name, must match the regular expression /^\[A-Fa-f0-9\]{32}$/ |
| `_valueToSum`<br>float | Values to Sum |
| `_logTime`<br>int64 | Time to Log |
| `_implicitlyLogged`<br>int64 | Whether this is implicitly logged |
| `_isTimedEvent`<br>boolean | Whether this is a timed event |
| `_session_id`<br>string |  |
| `_app_user_id`<br>string |  |
| `custom_events_file`<br>file | Custom file, encoded as JSON that describes the event. Please encode as UTF-8 and attach with the mime type `application/json` or `content/unknown` |
| `device_token`<br>string | A token used to identify the device on push networks |
| `event`<br>enum {MOBILE\_APP\_INSTALL, CUSTOM\_APP\_EVENTS, DEFERRED\_APP\_LINK} | Event type, one of `MOBILE_APP_INSTALL`, `CUSTOM_APP_EVENTS` or `DEFERRED_APP_LINK`. If you are reporting a `MOBILE_APP_INSTALL` event, you must include either `attribution` or `advertiser_id` in the request<br>Required |
| `event_id`<br>string | event\_id is used for MMP to cross-validate the campaign claim response with Meta. |
| `extinfo`<br>Object | Extended device and source information array, used by Facebook's SDKs, MMPs and Bots for Messenger. This parameter is an array and must be in a specific format. Please see our [App Events API](https://developers.facebook.com/docs/marketing-api/app-event-api) for more information |
| `0`<br>string | extinfo version<br>Required |
| `1`<br>string | app package name |
| `2`<br>string | short version (int or string) |
| `3`<br>string | long version |
| `4`<br>string | OS version |
| `5`<br>string | device model name |
| `6`<br>string | locale |
| `7`<br>string | timezone abbreviation |
| `8`<br>string | carrier |
| `9`<br>int64 | screen width |
| `10`<br>int64 | screen height |
| `11`<br>string | screen density (float decimal , or .) |
| `12`<br>int64 | CPU cores |
| `13`<br>int64 | external storage size in GB |
| `14`<br>int64 | free space on external storage in GB |
| `15`<br>string | device timezone |
| `google_install_referrer`<br>string | google\_install\_referrer |
| `include_dwell_data`<br>boolean | Specifies that view dwell ms should be returned as part of view through data |
| `include_video_data`<br>boolean | Specifies that video view completion percentages should be returned as part of view through data |
| `install_id`<br>string | If this is an install event, install\_id should be an MMP-generated ID unique across all installs (which can be the same as the event\_id). If this is a post-install event, the install\_id should be MMP-defined install\_id of the install event that preceded this event. |
| `install_referrer`<br>string | 3rd party install referrer, currently available for Android only, see https://developers.google.com/analytics/devguides/collection/android/v4/campaigns |
| `install_timestamp`<br>float | The timestamp of the app install or app event |
| `installer_package`<br>string | Used internally by the Android SDKs |
| `is_circuit_breaker_active`<br>boolean | is\_circuit\_breaker\_active |
| `is_fb`<br>boolean | Include this field for post-install events when the attribution result is already available. |
| `meta_install_referrer`<br>string | meta\_install\_referrer |
| `migration_bundle`<br>string | Used internally by the iOS and Android SDKs |
| `operational_parameters`<br>array<JSON object> | An array of operational parameters where each index corresponds to the event in custom\_events array. These are operational parameters that are not set by the advertiser, but instead only used for operational and debugging purposes. For each index, operational parameters are segmented into different use cases. |
| `iap_parameters`<br>AppOperationalData | iap\_parameters |
| `deferral_link_parameters`<br>AppOperationalData | deferral\_link\_parameters |
| `page_id`<br>int64 | Specifies the Page ID associated with the messenger bot that logs the event |
| `page_scoped_user_id`<br>int64 | Specifies the page scoped User ID associated with the messenger bot that logs the event |
| `receipt_data`<br>string | The receipts of in-app purchase |
| `sdk_version`<br>string | sdk\_version |
| `ud`<br>JSON object | Optional user data parameters for advanced matchingProvide hashed fields as key/value pairs similar to the Pixel |
| `em`<br>string | em |
| `fn`<br>string | fn |
| `ln`<br>string | ln |
| `ph`<br>string | ph |
| `ge`<br>string | ge |
| `dob`<br>string | dob |
| `ct`<br>string | ct |
| `st`<br>string | st |
| `zp`<br>string | zp |
| `extern_id`<br>string | extern\_id |
| `db`<br>string | db |
| `r1`<br>string | r1 |
| `r2`<br>string | r2 |
| `cn`<br>string | cn |
| `r3`<br>string | r3 |
| `r4`<br>string | r4 |
| `r5`<br>string | r5 |
| `r6`<br>string | r6 |
| `r7`<br>string | r7 |
| `r8`<br>string | r8 |
| `country`<br>string | country |
| `external_id`<br>string | external\_id |
| `url_schemes`<br>array<string> | Used internally by the iOS and Android SDKs |
| `user_id`<br>string | user\_id |
| `user_id_type`<br>enum {INSTANT\_GAMES\_PLAYER\_ID} | user\_id\_type |
| `vendor_id`<br>string | vendor\_id |
| `windows_attribution_id`<br>string | Attribution token used for Windows 10 |

### Return Type

Struct {

`success`: bool,

} Or Struct {

`applink_class`: string,

`applink_url`: string,

`applink_args`: string,

`is_fb`: bool,

`is_paid`: bool,

`account_id`: ad account id,

`ad_id`: numeric string,

`ad_objective_name`: string,

`adgroup_id`: numeric string,

`adgroup_name`: string,

`campaign_id`: numeric string,

`campaign_name`: string,

`campaign_group_id`: numeric string,

`campaign_group_name`: string,

`click_time`: timestamp,

`is_mobile_data_terms_signed`: bool,

`is_external`: bool,

`is_instagram`: bool,

`is_view_through`: bool,

`is_modeled`: bool,

`is_same_ip`: bool,

`device_model`: string,

`os_version`: string,

`view_time`: timestamp,

`is_playable_ad`: bool,

`is_aaa_campaign`: bool,

`creative_id`: numeric string,

`engagement_type`: enum,

`trace_id`: string,

`fbclid`: string,

`event_id`: string,

`vertical`: string,

`sub_vertical`: string,

`advertiser_region`: string,

`additional_touchpoints`: List \[\
\
Struct {\
\
`ad_id`: numeric string,\
\
`adgroup_id`: numeric string,\
\
`adgroup_name`: string,\
\
`campaign_id`: numeric string,\
\
`campaign_name`: string,\
\
`campaign_group_id`: numeric string,\
\
`campaign_group_name`: string,\
\
`account_id`: ad account id,\
\
`is_view_through`: bool,\
\
`click_time`: timestamp,\
\
`view_time`: timestamp,\
\
`engagement_type`: enum,\
\
`is_external`: bool,\
\
`is_instagram`: bool,\
\
`publisher_platform`: string,\
\
`is_aaa_campaign`: bool,\
\
`creative_id`: numeric string,\
\
`vertical`: string,\
\
`sub_vertical`: string,\
\
`advertiser_region`: string,\
\
}\
\
\],

} Or Struct {

`success`: bool,

`drop_reason`: string,

}

### Error Codes

| Error | Description |
| --- | --- |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |
| 100 | Invalid parameter |

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Application Activities](https://developers.facebook.com/docs/graph-api/reference/application/activities/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/application/activities/#Reading)

[Creating](https://developers.facebook.com/docs/graph-api/reference/application/activities/#Creating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/application/activities/#parameters)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/application/activities/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/application/activities/#error-codes)

[Updating](https://developers.facebook.com/docs/graph-api/reference/application/activities/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/application/activities/#Deleting)