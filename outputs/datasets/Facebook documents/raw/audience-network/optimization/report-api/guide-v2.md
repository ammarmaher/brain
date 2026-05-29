---
url: https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2
title: Reporting API v2 - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Freport-api%2Fguide-v2%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)
- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)


  - [Reporting API v2](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2)
  - [AIR API](https://developers.facebook.com/docs/audience-network/optimization/api/air-api)
  - [FB-Login-Reporting-API](https://developers.facebook.com/docs/audience-network/optimization/apis/FB-login-Reporting-API)

- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Reporting API](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#reporting-api)

[Prerequisites](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#prerequisites)

[Recommendations](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#recommendations)

[Limitations](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#limitations)

[Updates for Aggregation](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#aggregation)

[Request Syntax](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#calling)

[Example GET Request](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#example-get-request)

[Example Response](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#example-response)

[Reference](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#required-params)

[Query Parameters](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#query-parameters)

[Available Metrics](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#available-metrics)

[Troubleshooting](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#troubleshooting)

[Access Token Debugger](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#access-token-debugger)

[Error Messages](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#error-messages)

# Reporting API

Below is a guide for integrating the Audience Network Reporting API to access performance data for your apps.

## Prerequisites

- [A Meta App with the Facebook Login use case](https://developers.facebook.com/docs/development/create-an-app)
and the `read_audience_network_insights` permission


- [Facebook Login in your app](https://developers.facebook.com/docs/facebook-login)

- [A successful test query for a Graph API endpoint](https://developers.facebook.com/docs/graph-api)
and the `read_audience_network_insights` permission


- [Successful completion of Meta App Review](https://developers.facebook.com/docs/resp-plat-initiatives/app-review)

- [A long-lived User Access Token](https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing)


### Recommendations

- When requesting large amounts of data,
[cursor-based pagination](https://developers.facebook.com/docs/graph-api/results) is recommended. Paginated results are returned immediately for synchornous requests and is the preferred method for retrieving breakdowns.



### Limitations

- Dates always refer to PDT unless specifed otherwise
- Revenue metrics may not be available if the number of impressions is too small

  - If the data for is not available with a specific breakdown, we recommend querying the total for the time period
- User access tokens generated in Monetization Manager or Business Manager cannot be used
- Metrics are only reported when a minimum number of events has occurred. Some values may be approximate.

### Updates for Aggregation

#### Hourly aggregations are only available for 72 hours

We currently only return hourly aggregations for up to the past 72 hours. After, you may need to request for total or daily aggregations.

#### Daily aggregations may take longer to be come available

Hourly aggregations may be available before daily. It make take up to a few hours after the end of day (in PDT timezone) for daily aggregations to be available. In the meantime, you're welcome to use hourly aggregations or visit MoMa for latest available data. Data between hourly and daily is always subject to small adjusments.

#### Daily Impressions and Revenue

Query impressions and revenue for the placement on 1-4 May 2022 with a daily breakdown.

What might change:
You may see that some data is unavailable following the change.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=444770871031242&version=1776410910)

The revenue and CPM data points that are not available due to insufficient number of impressions will not be included in the `results` field in the API response. Instead, the corresponding entries will be added to the `omitted_results` field. They will include the time, metric and breakdowns fields, but they will not include the value - please refer to the sample response at the bottom of this page.

## Request Syntax

Use the GET
[ID > adnetworkanalytics](https://developers.facebook.com/docs/marketing-api/reference/business/adnetworkanalytics/)
endpoint to get audience network insights for a business, property, or app.


```code
GET /<ID>/adnetworkanalytics
```

### Example GET Request

To get insights, send a `GET` request to the `/<ID>/adnetworkanalytics` endpoint with a comma-separated list of metrics and optional comma-separated list of breakdowns where `<ID>` is your Meta business ID, property ID, or app ID. The following example gets metrics over a single 24 hour period and limiting the results to 2 responses per metric.

_Formatted for readability. Be sure to replace bold and italics placeholder values with your values._

```code
      curl -X GET https://graph.facebook.com/v25.0/BUSINESS_ID/adnetworkanalytics
      ?metrics=["fb_ad_network_request","fb_ad_network_imp","fb_ad_network_click","fb_ad_network_revenue"]
      &breakdowns=["placement","country"]
      &since=2021-08-06
      &until=2021-08-06
      &limit=2

```

### Example Response

```code
{
  "data": [\
    {\
      "query_id": "531234567890123456789012345683d6",\
      "results": [\
        {\
          "time": "2021-08-06T07:00:00+0000",\
          "metric": "fb_ad_network_imp",\
          "breakdowns": [\
            {\
              "key": "placement",\
              "value": "123456789012345"\
            },\
            {\
              "key": "country",\
              "value": "AE"\
            }\
          ],\
          "value": "1200"\
        },\
        {\
          "time": "2021-08-06T07:00:00+0000",\
          "metric": "fb_ad_network_imp",\
          "breakdowns": [\
            {\
              "key": "placement",\
              "value": "123456789012345"\
            },\
            {\
              "key": "country",\
              "value": "AU"\
            }\
          ],\
          "value": "35"\
        },\
        {\
          "time": "2021-08-06T07:00:00+0000",\
          "metric": "fb_ad_network_revenue",\
          "breakdowns": [\
            {\
              "key": "placement",\
              "value": "123456789012345"\
            },\
            {\
              "key": "country",\
              "value": "AE"\
            }\
          ],\
          "value": "21.212345"\
        },\
        {\
          "time": "2021-08-06T07:00:00+0000",\
          "metric": "fb_ad_network_request",\
          "breakdowns": [\
            {\
              "key": "placement",\
              "value": "123456789012345"\
            },\
            {\
              "key": "country",\
              "value": "AD"\
            }\
          ],\
          "value": "1"\
        },\
        {\
          "time": "2021-08-06T07:00:00+0000",\
          "metric": "fb_ad_network_request",\
          "breakdowns": [\
            {\
              "key": "placement",\
              "value": "123456789012345"\
            },\
            {\
              "key": "country",\
              "value": "AE"\
            }\
          ],\
          "value": "12"\
        },\
        {\
          "time": "2021-08-06T07:00:00+0000",\
          "metric": "fb_ad_network_click",\
          "breakdowns": [\
            {\
              "key": "placement",\
              "value": "123456789012345"\
            },\
            {\
              "key": "country",\
              "value": "AE"\
            }\
          ],\
          "value": "1"\
        },\
        {\
          "time": "2021-08-06T07:00:00+0000",\
          "metric": "fb_ad_network_click",\
          "breakdowns": [\
            {\
              "key": "placement",\
              "value": "123456789012345"\
            },\
            {\
              "key": "country",\
              "value": "CA"\
            }\
          ],\
          "value": "2"\
        }\
      ],\
      "omitted_results": [\
        {\
          "time": "2021-08-06T07:00:00+0000",\
          "metric": "fb_ad_network_revenue",\
          "breakdowns": [\
            {\
              "key": "placement",\
              "value": "123456789012345"\
            },\
            {\
              "key": "country",\
              "value": "AU"\
            }\
          ]\
        }\
      ]\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "MAZDZD",
      "after": "MQZDZD"
    },
    "next": "https://graph.facebook.com/v10.0/142440604406900/adnetworkanalytics?access_token=<ACCESS_TOKEN>&since=2021-08-06&until=2021-08-06&breakdowns=%5B%22placement%22%2C%22country%22%5D&limit=2&metrics=%5B%22fb_ad_network_request%22%2C%22fb_ad_network_imp%22%2C%22fb_ad_network_click%22%2C%22fb_ad_network_revenue%22%5D&after=MQZDZD"
  }
}
```

## Reference

### Query Parameters

| Parameter | Description |
| --- | --- |
| #### `aggregation_period` | `aggregation_period=hour|day|total`<br>Aggregate results by `day` (default), `hour`, or `total`. **Limitations:** To aggregate results by hour you must query at least 2 days of results using `since` and `until`. |
| #### `breakdowns` | `breakdowns=['breakdown_1', 'breakdown_2',...]`

Syncronous requests have no limits on the number of breakdowns that can be included.

| Breakdown types | Description |
| --- | --- |
| `ad_space` | Breakdown by ad space |
| `country` | Breakdown by country |
| `delivery_method` | Breakdown by either `standard` or `bidding` when the metric comes from an ad served through Audience Network bidding.<br>**Only available for publishers using Monetization Manager.** |
| `fail_reason` | **Only available for `fb_ad_network_no_fill` and `fb_ad_network_no_bid` metrics.** |
| `placement` | Breakdown by placement ID. **Cannot be used with `placement_name`.** |
| `placement_name` | Breakdown by placement ID and name. **Cannot be used with `placement`.** |
| `platform` | Breakdown by platform. `ios`, `android`, `mobile_web` or `instant_games`. **Only available for publishers using Monetization Manager.** |
| `property` | Breakdown by propery ID | |
| #### `filters` | `filters=[{'field':'country', 'operator':'in', 'values':['US', 'JP']}]`

Further filter responses to get more specific results. The `field`, `operator`, and `values` key:value pairs are required. `values` is a comma-separated list of values.
Currently only the `in` operator is supported.

| `field` | `values` |
| --- | --- |
| `country` | A comma-separated list of two letter country abbreviations |
| `placement` | Placement IDs. **Limitations:**`REDACTED` if the number of impressions is not sufficient. |
| `delivery_method` | `standard` or `bidding` |
| `platform` | Can be `ios` (mobile app), `android` (mobile app), `mobile_web` or `instant_games`. | |
| #### `limit` | `limit=500`<br>The number of rows to return. **Limitations:** Syncronous requests have a maximum limit of 2,000. |
| #### `metrics` | **Required.**<br>`metrics=['metric_1', 'metric_2',...]`<br>At least one metric is required but there are no limits on the number of metrics that can be included in a request. |
| #### `ordering_column` | `ordering_column=time|value`<br>Order by the results by time or value. Defaults to `time` if not included. |
| #### `ordering_type` | `ordering_column=ascending|descending`<br>Defaults to `descending` if not included. |
| #### `since` | `since=YYYY-MM-DD` or `since=1548880485`<br>The starting limit of the query (always inclusive). Defaults to past 7 days if not included.<br>**Limitations:**<br>- To use Unix timestamps you must query at least 1 hour.<br>- You can only request up to 8 days in syncronous requests.<br>- Data is only retained for 540 days. Requests for data beyond `$currentDate - 539 days` won't return additional data. |
| #### `until` | `until=YYYY-MM-DD` or `until=1548880485+86400`<br>The ending limit of the query (exclusive by default, inclusive for hourly aggregations) |

### Available Metrics

| Metric | Description |
| --- | --- |
| `fb_ad_network_bidding_bid_rate` | [Rate of bid responses](https://developers.facebook.com/docs/audience-network/bidding/metrics#responserate) |
| `fb_ad_network_bidding_request` | Number of bid requests |
| `fb_ad_network_bidding_response` | [Number of bid responses](https://developers.facebook.com/docs/audience-network/bidding/metrics#bidresponse) |
| `fb_ad_network_bidding_win_rate` | [Rate of auction wins by the bidder](https://developers.facebook.com/docs/audience-network/bidding/metrics#winrate) |
| `fb_ad_network_click` | [Number of clicks](https://developers.facebook.com/docs/audience-network/bidding/metrics#clicks) |
| `fb_ad_network_cpm` | [Effective CPM (eCPM)](https://developers.facebook.com/docs/audience-network/bidding/metrics#ecpm) |
| `fb_ad_network_ctr` | [Estimated click rate](https://developers.facebook.com/docs/audience-network/bidding/metrics#ctr) |
| `fb_ad_network_fill_rate` | Rate of filled ad requests |
| `fb_ad_network_filled_request` | [Number of filled ad requests](https://developers.facebook.com/docs/audience-network/bidding/metrics#filled) |
| `fb_ad_network_imp` | [Number of impressions](https://developers.facebook.com/docs/audience-network/bidding/metrics#impressions) |
| `fb_ad_network_no_bid` | Count of top no response bid reasons<br>**Available only when used as a single metric `fail_reason` breakdown** |
| `fb_ad_network_no_fill` | Count of top no-fill reasons<br>**Available only when used as a single metric `fail_reason` breakdown** |
| `fb_ad_network_request` | [Ad requests](https://developers.facebook.com/docs/audience-network/bidding/metrics#requests) |
| `fb_ad_network_revenue` | [Estimated revenue](https://developers.facebook.com/docs/audience-network/bidding/metrics) |
| `fb_ad_network_show_rate` | Impressions divided by Filled |

## Troubleshooting

### Access Token Debugger

Use the
[Access Token Debugger](https://developers.facebook.com/tools/debug/accesstoken/) to get detailed information for an access token, including permissions, validity, property access, and App ID associated with the token.


### Error Messages

| Error Message / Issue | Resolution |
| --- | --- |
| Expired Token | For best user experience, use [Long-Lived Access Tokens](https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing) |
| “Facebook has detected that \[your app\] isn't using a secure connection to transfer information error when using `read_audience_network_insights` scope." | Ensure that your Business has been onboarded in [Monetization Manager](https://business.facebook.com/pub/home/?business_id=100764642000645) and you have created at least one property. |
| "Reading insights of a Page, business, app, domain or event source group not owned by the querying user or application." | Review Business Settings to make sure that you are requesting data owned by the Business that you are querying for. |
| "Unsupported `GET` request. Object with ID X does not exist, cannot be loaded due to missing permissions, or does not support this operation. Read the [Graph API documentation](https://developers.facebook.com/docs/graph-api)." | Review the property to make sure that you are requesting data for a property you own. |
| "The way to access reporting API v2.0 has changed.<br>You now need to implement Facebook Login for your app to access this API.<br>See instructions here: https://developers.facebook.com/docs/facebook-login/" | You have tried to query the Reporting API v2 with the System User token. Use Facebook Login to make queries, or revert to v1 (but you will need to implement Facebook Login anyway in the future). |
| "Bad arg: All applications should have a property" | Ensure that your Business has been onboarded in [Monetization Manager](https://business.facebook.com/pub/home/?business_id=100764642000645) and you have created at least one property. |
| ""Please reduce the amount of data you're asking for, then retry your request." | - If you are using the `day` or `hour` [aggregation period](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#aggregation-period), set a lower value for the [limit](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#limit) parameter.<br>- If you are using the `total` aggregation period, reduce the duration of the date range specified by the [since/until](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#since-until) parameters. |
| "You can have at most 250 queries per minute" | Reporting API V2 allows requests with multiple parameters and the use of pagination. Please look into ways of using less API requests where possible. |

On This Page

[Reporting API](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#reporting-api)

[Prerequisites](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#prerequisites)

[Recommendations](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#recommendations)

[Limitations](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#limitations)

[Updates for Aggregation](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#aggregation)

[Request Syntax](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#calling)

[Example GET Request](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#example-get-request)

[Example Response](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#example-response)

[Reference](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#required-params)

[Query Parameters](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#query-parameters)

[Available Metrics](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#available-metrics)

[Troubleshooting](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#troubleshooting)

[Access Token Debugger](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#access-token-debugger)

[Error Messages](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2#error-messages)