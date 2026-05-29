---
url: https://developers.facebook.com/docs/threat-exchange/best-practices
title: Best Practices - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Fbest-practices%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[ThreatExchange](https://developers.facebook.com/docs/threat-exchange)

- [Get Access](https://developers.facebook.com/docs/threat-exchange/getting-access)
- [Get Started](https://developers.facebook.com/docs/threat-exchange/getting-started)
- [Best Practices](https://developers.facebook.com/docs/threat-exchange/best-practices)
- [UI Overview](https://developers.facebook.com/docs/threat-exchange/ui)
- [UI Reference](https://developers.facebook.com/docs/threat-exchange/reference/ui)
- [API Overview](https://developers.facebook.com/docs/threat-exchange/api)
- [API Structure](https://developers.facebook.com/docs/threat-exchange/api-structure)
- [API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis)
- [Privacy Controls](https://developers.facebook.com/docs/threat-exchange/reference/privacy)
- [Submit Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting)
- [Editing Existing Data](https://developers.facebook.com/docs/threat-exchange/reference/editing)
- [Delete Data](https://developers.facebook.com/docs/threat-exchange/reference/deleting)
- [Reshare Controls](https://developers.facebook.com/docs/threat-exchange/reference/resharing)
- [React to Data](https://developers.facebook.com/docs/threat-exchange/reference/reacting)
- [Submit Connections](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections)
- [Vendors](https://developers.facebook.com/docs/threat-exchange/reference/vendors)
- [FAQ](https://developers.facebook.com/docs/threat-exchange/FAQ)
- [Changelog](https://developers.facebook.com/docs/threat-exchange/reference/changelog)

On This Page

[Best Practices for Using ThreatExchange](https://developers.facebook.com/docs/threat-exchange/best-practices#best_practices)

[Downloading Data](https://developers.facebook.com/docs/threat-exchange/best-practices#download-data)

[Sample CSVs from the UI](https://developers.facebook.com/docs/threat-exchange/best-practices#sample-csvs)

[Sampling from /threat\_descriptors API](https://developers.facebook.com/docs/threat-exchange/best-practices#threat-descriptors-api)

[Tailing /threat\_updates API](https://developers.facebook.com/docs/threat-exchange/best-practices#threat-updates-api)

[/<TAG\_ID>/tagged\_objects API](https://developers.facebook.com/docs/threat-exchange/best-practices#tagged-objects-api)

[Tag Your Data](https://developers.facebook.com/docs/threat-exchange/best-practices#tag-your-data)

[Be Descriptive with Your Tags](https://developers.facebook.com/docs/threat-exchange/best-practices#descriptive-tags)

[Consider Privacy Rules](https://developers.facebook.com/docs/threat-exchange/best-practices#tag-privacy)

[Use Batch Requests for Improved Throughput](https://developers.facebook.com/docs/threat-exchange/best-practices#use-batch-requests)

[Include Nested Fields and Objects in Result Data](https://developers.facebook.com/docs/threat-exchange/best-practices#nested-fields-objects)

# Best Practices for Using ThreatExchange

This guide explains some ways to use ThreatExchange that will help improve throughput and usage.

## Downloading Data

When you get access to new data in ThreatExchange (such as by being added to a PrivacyGroup), we recommend you get a sample or complete copy of the data to evaluate it.

You can use these APIs and UI:

- [/threat\_updates API](https://developers.facebook.com/docs/threat-exchange/best-practices#threat-updates-api) \- Recommended API for complete copy of program data
- [ThreatExchange UI](https://developers.facebook.com/docs/threat-exchange/best-practices#sample-csvs) \- sample data, but can provide all data for small programs
- [/threat\_descriptors API](https://developers.facebook.com/docs/threat-exchange/best-practices#threat-descriptors-api) \- okay for sampled data with low retention
- [/<TAG\_ID>/tagged\_objects API](https://developers.facebook.com/docs/threat-exchange/best-practices#tagged-objects-api) \- Not recommended without client-side filtering

Only some of them should be used for automated integration into your own systems, and the others should be used only for sampled evaluation and testing.

### Sample CSVs from the UI

Some privacy groups have a feature where samples of indicators can be downloaded from the UI, which is the fastest way to evaluate potential data. Learn more at [ThreatExchange UI.](https://developers.facebook.com/docs/threat-exchange/reference/ui/collaborations)

### Sampling from /threat\_descriptors API

[The /threat\_descriptors API](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors) allows you to do complex searches on ThreatDescriptors. This can be useful to generate your own narrow samples, but the API is not guaranteed to be contain all data that matches the filters.

### Tailing /threat\_updates API

**Recommended**— [The /threat\_updates](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates) API allows you to exactly reproduce a [ThreatPrivacyGroup](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group/)'s contents. It also allows you to get deletion events as long as you poll within 30 days of the object being deleted. Tailing /threat\_updates gives you the lowest latency, complete data, and is the only API that notifies of deletes.

Not all PrivacyGroups have this API enabled, reach out to threatexchange@meta.com for questions about enabling it.

### /<TAG\_ID>/tagged\_objects API

The [/<TAG\_ID>/tagged\_objects](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags) API allows you to reliably download all ThreatDescriptors tagged with those tags. Because most data is tagged, this is a reliable way to get data. However, you must do client-side filtering to remove unwanted data, but with the same tags (for example, in the wrong privacy group, wrong type, etc). Additionally, because you don't learn of deletions or updates, you must start over from `tagged_since=0` at some interval (for example, 30 days) in order get updates and discard data that has been deleted.

## Tag Your Data

By [tagging your data](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags/), it makes it easier for yourself and others to find the indicators they care most about. For example, by tagging descriptors with `evil`, this allows others to filter descriptors searches by data with that tag. Another option is that you can then search the `threat_tags` endpoint by that tag and see all the tagged objects visible to you. The tagging endpoint also supports partial matches on tags, so a query for `evil` will surface any tags visible to you which are like `evil*`.

## Be Descriptive with Your Tags

ThreatTags (also known as "subjective tags") contain metadata fields describing what they are. If you create the tag `foo`, others can inspect the metadata to see what means or why the data was tagged. But it's helpful to be more descriptive instead; for example, `campaign_zeusbotnet` or `malicious_ssl_cert`.

## Consider Privacy Rules

ThreatTags are visible based on the [PrivacyType](https://developers.facebook.com/docs/threat-exchange/reference/apis/privacy-type/) of the tagged data. For example, if the tag `public_tag` is on ANY descriptor that is publically visible (privacy type of VISIBLE), then the tag is visible to all members. Conversely, if the tag `nonpublic_tag` is ONLY on tagged objects shared to specific members (privacy types \`HAS\_WHITELIST\` or \`HAS\_PRIVACY\_GROUP\`), then the tag is only visible to those members. Tag your data accordingly. Learn more about [PrivacyType tag](https://developers.facebook.com/docs/threat-exchange/reference/apis/privacy-type/).

For more uses cases with ThreatTags, see the [ThreatTag reference](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags/).

## Use Batch Requests for Improved Throughput

Batch requests allow you to make multiple requests to the Graph API using a single HTTP call. For more information on Graph API Batch Requests, review the following:

- [Making multiple API requests](https://developers.facebook.com/docs/graph-api/making-multiple-requests)

- [Batch requests documentation](https://developers.facebook.com/docs/reference/ads-api/batch-requests)


You can also query for multiple objects by ID using the following syntax:

```code
https://graph.facebook.com/v2.8/?ids=[id1,id2]&amp;access_token=<access_token>
```

If you need to query for a specific field:

```code
https://graph.facebook.com/v2.8/?ids=[id1,id2]&amp;fields=field1,field2&amp;access_token=<access_token>
```

## Include Nested Fields and Objects in Result Data

It can sometimes be more efficient to include various nested fields or related objects in your search results. The following syntax shows how, for the `facebook.com` indicator object, to pull all of its descriptors without issuing additional API calls:

```code
https://graph.facebook.com/v2.8/788497497903212?fields=descriptors{owner,description,status,share_level},indicator,type&amp;access_token=<access_token>

RESULT:
{
  "descriptors": {
    "data": [\
      {\
        "owner": {\
          "id": "820763734618599",\
          "name": "Facebook Administrator"\
        },\
        "description": "Facebook",\
        "status": "NON_MALICIOUS",\
        "share_level": "GREEN",\
        "id": "834469179976904"\
      },\
      {\
        "owner": {\
          "id": "588498724619612",\
          "name": "Facebook CERT ThreatExchange"\
        },\
        "description": "Non malicious",\
        "status": "NON_MALICIOUS",\
        "share_level": "GREEN",\
        "id": "1202389109786630"\
      }\
    ],
    "paging": {
      "cursors": {
        "before": "ODM0NDY5MTc5OTc2OTA0",
        "after": "MTIwMjM4OTEwOTc4NjYzMAZDZD"
      }
    }
  },
  "indicator": "facebook.com",
  "type": "DOMAIN",
  "id": "788497497903212"
}
```

On This Page

[Best Practices for Using ThreatExchange](https://developers.facebook.com/docs/threat-exchange/best-practices#best_practices)

[Downloading Data](https://developers.facebook.com/docs/threat-exchange/best-practices#download-data)

[Sample CSVs from the UI](https://developers.facebook.com/docs/threat-exchange/best-practices#sample-csvs)

[Sampling from /threat\_descriptors API](https://developers.facebook.com/docs/threat-exchange/best-practices#threat-descriptors-api)

[Tailing /threat\_updates API](https://developers.facebook.com/docs/threat-exchange/best-practices#threat-updates-api)

[/<TAG\_ID>/tagged\_objects API](https://developers.facebook.com/docs/threat-exchange/best-practices#tagged-objects-api)

[Tag Your Data](https://developers.facebook.com/docs/threat-exchange/best-practices#tag-your-data)

[Be Descriptive with Your Tags](https://developers.facebook.com/docs/threat-exchange/best-practices#descriptive-tags)

[Consider Privacy Rules](https://developers.facebook.com/docs/threat-exchange/best-practices#tag-privacy)

[Use Batch Requests for Improved Throughput](https://developers.facebook.com/docs/threat-exchange/best-practices#use-batch-requests)

[Include Nested Fields and Objects in Result Data](https://developers.facebook.com/docs/threat-exchange/best-practices#nested-fields-objects)