---
url: https://developers.facebook.com/docs/marketing-api/reference/archived-ad/
title: Graph API Reference v25.0: Archived Ad
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmarketing-api%2Freference%2Farchived-ad%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Marketing API](https://developers.facebook.com/docs/marketing-api)

- [Overview](https://developers.facebook.com/docs/marketing-api/overview)
- [Get Started](https://developers.facebook.com/docs/marketing-api/get-started)
- [Ad Creative](https://developers.facebook.com/docs/marketing-api/creative)
- [Bidding](https://developers.facebook.com/docs/marketing-api/bidding)
- [Ad Rules Engine](https://developers.facebook.com/docs/marketing-api/ad-rules)
- [Audiences](https://developers.facebook.com/docs/marketing-api/audiences)
- [Insights API](https://developers.facebook.com/docs/marketing-api/insights)
- [Brand Safety and Suitability](https://developers.facebook.com/docs/marketing-api/brand-safety-and-suitability)
- [Best Practices](https://developers.facebook.com/docs/marketing-api/best-practices)
- [Troubleshooting](https://developers.facebook.com/docs/marketing-api/troubleshooting)
- [API Reference](https://developers.facebook.com/docs/marketing-api/reference)
- [Changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)

On This Page

[Archived Ad](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#Reading)

[Example](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#fields)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#Creating)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#Updating)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#)

# Archived Ad

An ad Facebook stores in the Ad Library. You can perform keyword searches or search by Page ID of ads stored in the Ad Library. See [Ad Library](https://www.facebook.com/ads/library) and [Ad Library API](https://developers.facebook.com/docs/marketing-api/reference/ads_archive/).

## Reading

An archived ad.

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=...%3Ffields%3D%257Bfieldname_of_type_ArchivedAd%257D&version=v25.0)

```
GET v25.0/...?fields={fieldname_of_type_ArchivedAd} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '...?fields={fieldname_of_type_ArchivedAd}',
    '{access-token}'
  );
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphNode = $response->getGraphNode();
/* handle the result */
```

```
/* make the API call */
FB.api(
    "...?fields={fieldname_of_type_ArchivedAd}",
    function (response) {
      if (response && !response.error) {
        /* handle the result */
      }
    }
);
```

```
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "...?fields={fieldname_of_type_ArchivedAd}",
    null,
    HttpMethod.GET,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"...?fields={fieldname_of_type_ArchivedAd}"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

### Parameters

This endpoint doesn't have any parameters.

### Fields

| Field | Description |
| --- | --- |
| `id`<br>numeric string | The Library ID of the ad object. |
| `ad_creation_time`<br>string | The [UTC](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.timeanddate.com%2Ftime%2Faboututc.html&h=AUBFWI9F8qmi2HnyIvH31NL8cIAmJnpfZBylRV2XI77zOHzrtsyL21THd0i2cwHoEbzCf7eDze0k7wipdA53GFA0wFk8VyE5n10R5VQZGzCtHYem19MGyxwGBtla_2uMmjRFwBIBg2JHmA) date and time when someone created the ad. This is not the same time as when the ad ran. Includes date and time separated by `T`. Example: `2019-01-24T19:02:04+0000`, where `+0000` is the UTC offset. |
| `ad_creative_bodies`<br>list<string> | A list of the text which displays in each unique ad card of the ad. Some ads run with multiple ad versions or carousel cards each with their own unique text. See [Reference, Ad Creative](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/). |
| `ad_creative_link_captions`<br>list<string> | A list of the captions which appear in the call to action section for each unique ad card of the ad. Some ads run with multiple ad versions or carousel cards each with their own unique text that appears in the link. |
| `ad_creative_link_descriptions`<br>list<string> | A list of text descriptions which appear in the call to action section for each unique ad card of the ad. Some ads run with multiple ad versions or carousel cards each with their own unique text describing the link. |
| `ad_creative_link_titles`<br>list<string> | A list of titles which appear in the call to action section for each unique ad card of the ad. Some ads run with multiple ad versions or carousel cards each with their own unique title text about the link. |
| `ad_delivery_start_time`<br>string | Date and time when an advertiser wants to start delivering an ad. Provided in [UTC](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.timeanddate.com%2Ftime%2Faboututc.html&h=AUABgKjm7Y3VZLg0hscTC8lk8iAF0u1b-03KHJTEg_XjlVt8mK6kwb1MGCpmO-Xrmk3dmbI_AlPOloxNPE8vu74SpsIetsLkMmXI3-Uv_DjJpUzc8U_1gudKeDarQ1RO4R4xsz72-qdNQg) as in `ad_creation_time`.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `ad_delivery_stop_time`<br>string | The time when an advertiser wants to stop delivery of their ad. If this is blank, the ad will run until the advertiser stops it or they spend their entire campaign budget. In [UTC](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.timeanddate.com%2Ftime%2Faboututc.html&h=AUDpfUai3PR-8SHfpv-sp1-2CBOhIDZGUk-PE-_IZMbCsAYdAtvRIhr86wSo583mMF1i8R8HL35UqVQZ70l3b3IHSTw2a2LioVsitJc80jXM1n-LT2ZLF09mC0ykNUQQKaPSINyuj_zR0A).<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `ad_snapshot_url`<br>string | String with URL link which displays the archived ad. This displays uncompressed images and videos from the ad. While you cannot currently download a batch of archived ads, you can download ad creative such as images and text for an individual ad. If you do so, it must be for analysis and you must comply with the data storage terms in our [Terms of Service](https://www.facebook.com/terms.php).<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `age_country_gender_reach_breakdown`<br>[list<AgeCountryGenderReachBreakdown>](https://developers.facebook.com/docs/graph-api/reference/age-country-gender-reach-breakdown/) | The demographic distribution of [Accounts Center accounts](https://www.facebook.com/business/help/283579896000936) in the UK & EU reached by the ad. **Available only for ads delivered to the UK & EU and POLITICAL\_AND\_ISSUE\_ADS delivered to Brazil** |
| `beneficiary_payers`<br>[list<BeneficiaryPayer>](https://developers.facebook.com/docs/graph-api/reference/beneficiary-payer/) | The reported beneficiaries and payers for this ad. **Available only for ads delivered to the EU** |
| `br_total_reach`<br>int32 | The estimated ad reach for Brazil.<br>**Available for POLITICAL\_AND\_ISSUE\_ADS delivered to Brazil** |
| `bylines`<br>string | A string containing the name of the person, company, or entity that provided funding for the ad. Provided by the purchaser of the ad. **Available only for POLITICAL\_AND\_ISSUE\_ADS** |
| `currency`<br>string | The currency used to pay for the ad, as an [ISO currency code](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.iso.org%2Fiso-4217-currency-codes.html&h=AUANDvO67JqKPY-YapIrkECnAKVzB84PLiXGhDBnhcWNcWMfk3i8Nr4uGIOGyuElcO9AfNJFlTEE1f-2WdZPa2I8ZDl9fObLk2ZiYS9I4Abe4XTKzSfmkR5b15ulUuOYrxleP9A3-0QyxQ). **Available only for POLITICAL\_AND\_ISSUE\_ADS** |
| `delivery_by_region`<br>[list<AudienceDistribution>](https://developers.facebook.com/docs/graph-api/reference/audience-distribution/) | Regional distribution of [Accounts Center accounts](https://www.facebook.com/business/help/283579896000936) reached by the ad. Provided as a percentage and where regions are at a sub-country level. **Available only for POLITICAL\_AND\_ISSUE\_ADS** |
| `demographic_distribution`<br>[list<AudienceDistribution>](https://developers.facebook.com/docs/graph-api/reference/audience-distribution/) | The demographic distribution of [Accounts Center accounts](https://www.facebook.com/business/help/283579896000936) reached by the ad. Provided as age ranges and gender.<br>Age ranges: Can be one of 18-24, 25-34, 35-44, 45-54, 55-64, 65+.<br>Gender: Can be the following strings: "Male", "Female", "Unknown". **Available only for POLITICAL\_AND\_ISSUE\_ADS** |
| `estimated_audience_size`<br>[InsightsRangeValue](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/) | Estimated Audience Size generally estimates how many [Accounts Center accounts](https://www.facebook.com/business/help/283579896000936) meet the targeting and ad placement criteria that advertisers select while creating an ad. [Learn more](https://www.facebook.com/business/help/1665333080167380?id=176276233019487). **Available only for POLITICAL\_AND\_ISSUE\_ADS** |
| `eu_total_reach`<br>int32 | The estimated combined ad reach for all locations inside the European Union. **Available only for ads delivered to the EU** |
| `impressions`<br>[InsightsRangeValue](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/) | A string containing the number of times the ad created an impression. In ranges of: <1000, 1K-5K, 5K-10K, 10K-50K, 50K-100K, 100K-200K, 200K-500K, >1M. **Available only for POLITICAL\_AND\_ISSUE\_ADS** |
| `languages`<br>list<string> | The list of languages contained within the ad. These are displayed in [ISO 639-1 language codes](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.iso.org%2Fstandard%2F22109.html&h=AUCVYp4FWAS_tDgn1Y8pDHdzU4XixGBjJSB9y1nr0YfoaiAydLZEpg-7AS_Wy5taZ_xG253FH0_rNyVysCgVFwznmgKsoSjYMony5nPqyLAmYnLAPiTb-M5Jex2V7mfHneFGAhle_sAXJg). |
| `page_id`<br>numeric string | ID of the Facebook Page that ran the ad.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `page_name`<br>string | Name of the Facebook Page which ran the ad. |
| `publisher_platforms`<br>list<enum> | A list of Meta technologies where the archived ad appeared, such as Facebook or Instagram. |
| `spend`<br>[InsightsRangeValue](https://developers.facebook.com/docs/graph-api/reference/insights-range-value/) | A string showing the amount of money spent running the ad, as specified in `currency`. This is reported in ranges: <100, 100-499, 500-999, 1K-5K, 5K-10K, 10K- 50K, 50K-100K, 100K-200K, 200K-500K, >1M. **Available only for POLITICAL\_AND\_ISSUE\_ADS** |
| `target_ages`<br>list<numeric string> | The age ranges selected for ad targeting in the UK & EU. The lowest age that can be returned is 13; the highest is 65+. **Available only for ads delivered to the UK & EU and POLITICAL\_AND\_ISSUE\_ADS delivered to Brazil** |
| `target_gender`<br>enum | The genders selected for ad targeting in the UK & EU. Possible values: “Women”, “Men” or “All”. **Available only for ads delivered to the UK & EU and POLITICAL\_AND\_ISSUE\_ADS delivered to Brazil** |
| `target_locations`<br>[list<TargetLocation>](https://developers.facebook.com/docs/graph-api/reference/target-location/) | The locations included or excluded for ad targeting in the UK & EU. **Available only for ads delivered to the UK & EU and POLITICAL\_AND\_ISSUE\_ADS delivered to Brazil** |
| `total_reach_by_location`<br>list<KeyValue:string,int32> | The estimated combined ad reach broken down by location. Currently supported locations: EU, BR, and UK. |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Archived Ad](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#Reading)

[Example](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#fields)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#Creating)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#Updating)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/archived-ad/#Deleting)