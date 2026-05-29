---
url: https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates
title: /threat_updates - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fapis%2Fthreat-updates%2Fv25.0%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[ThreatExchange](https://developers.facebook.com/docs/threat-exchange)

- [Get Access](https://developers.facebook.com/docs/threat-exchange/getting-access)
- [Get Started](https://developers.facebook.com/docs/threat-exchange/getting-started)
- [Best Practices](https://developers.facebook.com/docs/threat-exchange/best-practices)
- [UI Overview](https://developers.facebook.com/docs/threat-exchange/ui)
- [UI Reference](https://developers.facebook.com/docs/threat-exchange/reference/ui)
- [API Overview](https://developers.facebook.com/docs/threat-exchange/api)
- [API Structure](https://developers.facebook.com/docs/threat-exchange/api-structure)
- [API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis)


  - [ThreatExchangeMember Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member)
  - [ThreatDescriptor Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor)
  - [ThreatIndicator Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator)
  - [ThreatPrivacyGroup Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group)
  - [ThreatTag Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags)
  - [ImpactReport Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-impact-report)
  - [CaseTag Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/case-tag)
  - [ConfidenceType](https://developers.facebook.com/docs/threat-exchange/reference/apis/confidence-type)
  - [IndicatorType](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type)
  - [PrecisionType](https://developers.facebook.com/docs/threat-exchange/reference/apis/precision-type)
  - [PrivacyType](https://developers.facebook.com/docs/threat-exchange/reference/apis/privacy-type)
  - [ReactionType](https://developers.facebook.com/docs/threat-exchange/reference/apis/reaction-type)
  - [ReviewStatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/review-status-type)
  - [SeverityType](https://developers.facebook.com/docs/threat-exchange/reference/apis/severity-type)
  - [SignatureType](https://developers.facebook.com/docs/threat-exchange/reference/apis/signature-type)
  - [ShareLevelType](https://developers.facebook.com/docs/threat-exchange/reference/apis/share-level-type)
  - [StatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/status-type)
  - [/threat\_updates](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates)
  - [/threat\_tags](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags)
  - [/threat\_indicators](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicators)
  - [/threat\_descriptors](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors)
  - [/threat\_exchange\_members](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-members)
  - [/threat\_privacy\_groups](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-groups)
  - [/<app-id>/threat\_privacy\_groups\_owner](https://developers.facebook.com/docs/threat-exchange/reference/apis/app-id-threat-privacy-groups-owner)
  - [/<app-id>/threat\_privacy\_groups\_member](https://developers.facebook.com/docs/threat-exchange/reference/apis/app-id-threat-privacy-groups-member)

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

[/<privacy-group>/threat\_updates](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/v25.0#threat_updates)

[Parameters](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/v25.0#parameters)

Graph API Version

[v25.0](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/v25.0#)

# /<privacy-group>/threat\_updates

This call is not currently enabled for all PrivacyGroups. A 500 error will be returned if this call is used with PrivacyGroup that doesn't have \`/threat\_updates\` enabled. If you would like to enable this call for your PrivacyGroup please
[contact the ThreatExchange team](mailto:threatexchange@meta.com).


ThreatExchange provides [multiple APIs](https://developers.facebook.com/docs/threat-exchange/reference/apis/) for querying data. Most of these APIs will only allow you to know the current state of the object, and if it is later updated or removed, you can only learn of changes by polling the objects again. ThreatExchange API integration works best when you can keep an up-to-date copy of the information that you are interested in, and re-polling all data would be cumbersome.

`/threat_updates` provides a solution to keeping a copy of data within a PrivacyGroup, specifically for the data that users tell us they most need kept up to date. `/threat_updates` allows for a specific projection of the ThreatExchange graph database to turn it into a list of signals with opinions. By tailing `/threat_updates`, you can learn of updates to that projection within seconds, and so the liveness of the data is only limited by how frequently you poll.

When data in the PrivacyGroup is updated, an event is moved to the "end" of the update list. All updates are ordered by `update_time`, and you can save this time to resume fetching from where you left off.

## Update Events

`/threat_updates` entries represent one of two events, which can be differentiated using the `should_delete` flag.

| Event | `should_delete` | Meaning |
| --- | --- | --- |
| Update | false | An opinion connected to the ThreatIndicator has been created or updated. Fetch connected data to get updates. |
| Delete | true | A ThreatIndicator has been removed from the PrivacyGroup or deleted. |

Otherwise, entries returned by this API behave as [ThreatIndicator Objects](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/), with additional fields described below.

## Delete Event TTL, Polling Frequency, and Checkpointing

Deletion events **are only stored for 90 days**, and so you must poll more frequently than that, or your copy of the database will become invalid. We generally recommend polling daily to prevent a large backlog of updates from accruing, and many platforms will want to poll more frequently than that to have a lower latency between sharing and ingestion. We don't recommend polling more frequently than 1/minute.

To resume from where you last left off, set the `start_time` to the largest `update_time` you have previously seen. It is important that you not attempt to use the time you completed your last fetch as the checkpoint, as there may be a small delay between when updates are written and when they appear in `/threat_updates`.

`start_time` is inclusive, so you may see updates you have already seen when there is not much activity in a PrivacyGroup.

This call may reveal indicators that have been removed from the privacy group. When you recieve notice of a deletion, you should remove it from your copy of ThreatExchange data, as it may have been previously shared in error. See [Terms and Conditions](https://www.facebook.com/legal/threatexchange_terms) for more.


## Maintaining a copy of data in a PrivacyGroup using `threat_updates`

The object emitted by `threat_updates` is [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/), and has the same fields and connections. However, the connections are modified such that only data in the given PrivacyGroup are returned.

This allows you to use `/threat_updates` as an update stream to keep a copy of the data, keyed by the `id` of the [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/). The simplest way to do this is use the `fields=` parameter to fetch all the data you are interested in connected data, and store the resultant data.

### Example Table Schema

Here's is a sample database table schema you could use (for a single PrivacyGroup):

| Column | Type | Note |
| --- | --- | --- |
| indicator\_id | 64 bit integer (Primary Key) | An opinion connected to the ThreatIndicator has been created or updated. Fetch connected data to get updates. |
| indicator\_type | string | The type of the signal (e.g. HASH\_MD5). Each type usually needs type-specific handling, so you could provide a secondary index on (type, update\_time) to checkpoint your own internal processing. This column is an example of parsing specific data out of the payload for the purposes of indexing - you may find you are interested in other fields as well. |
| json\_payload | JSON | The raw JSON, including connections fetched by `fields=` returned by the API. |

### Updating the Table

In order to build your copy of the database, begin polling at `start_time=0`.

For each entry seen:

- Update: `UPSERT INTO MyTableForPrivacyGroup VALUES ($response[id], $response[type], $response)`
- Delete: `DELETE FROM MyTableForPrivacyGroup WHERE indicator_id = $response[id]`

When you completely exhaust `/threat_updates`, you should have a complete and up-to-date copy of the data stored in ThreatExchange.

Store the largest `update_time` that you have seen to use as a the `start_time` for the next time you fetch, as described above.

## What changes constitute an Update

`/threat_updates` will generate an update to changes to [ThreatDescriptor objects](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/) that have been shared to the PrivacyGroup. Changes to the fields or connected data will generate an update.

At a minimum, this is:

1. If a [ThreatDescriptor objects](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/) is added to the PrivacyGroup, removed from the PrivacyGroup, or deleted.
2. Changes to fields directly stored on the [ThreatDescriptor objects](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/)
3. Changes in which [ThreatTags](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/docs/threat-exchange/reference/apis/threattags/) are on those ThreatDescriptors
4. Changes in which [Reactions](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/docs/threat-exchange/reference/apis/threattags/) are on those ThreatDescriptors

Note that not every update will appear to have changed data - `/threat_updates` only stores the last update to an object, and so changes that are rapidly undone may not appear to change your copy of the data. Additionally, if you select only some fields, you will see updates that don't change the fields you selected.

## Speeding up your initial fetch

Some privacy groups have a very large number of signals, and it can take a while to catch up. There are some tricks you can employ to speed up your initial fetch. The first is if you only care about recent data, you can fetch only after a start\_time that is more recent, which will have less data. The second is that you can split up resolving the fields of `threat_updates` into two calls:

1. Fetching only the fields `id`, `type`, `last_update` from `threat_updates`, and then ignoring types that you don't use
2. Fetching the rest of the fields from records via ID (returning [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/) s), and adding the parameter `?privacy_group=<id>` to limit to the same projection that `threat_updates` uses.

It is even possible to further parallelize these operations by fetching lists of comma-separated ids. As a reference, if resolving all nested fields from `threat_updates`, you might be able to process ~200,000 records an hour, but by splitting the calls, you are usually limited only by the speed of getting new ids from `threat_updates`, which can be many multiples faster.

## Open Source Fetching Implementation

Instead of building an implementation from scratch, you can start with our
[Python open source library](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmain%2Fpython-threatexchange&h=AUCZ2di1rEsuqANxxUdhHeBup5tn7Krteo-WwIoLDukqSTMQM5_eFtLzoQ8vIk-f9ebMtBNGGWdJeXP3yqFFX5DSBK42ZDuhuD01r_VF_YGo_PKaXKtUNw4qhrHBeA018TDzLv90d3djHJvfJ7xwfnie5Hk) which can also be used as a reference implementation.


## Parameters

The following query parameters are available (bold parameters are required):

- **`access_token`** \- The key for authenticating to the API.

- `start_time` \- Search for indicators that last updated on or after this timestamp.

- `stop_time` \- Search for indicators that last updated before this timestamp.

- `limit` \- Defines the maximum size of a page of results

- `fields` \- A list of [fields](https://developers.facebook.com/docs/graph-api/overview#fields) to return in the response, if not specified only a few default fields will be returned.


  - `id` \- The id of the ThreatIndicator

  - `should_delete` \- Whether this is an update or deletion event

  - `last_updated` \- The checkpointable timestamp of the update.

  - `type` \- Unchanged from [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/)

  - `indicator` \- Unchanged from [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/)

  - `descriptors` \- A list of [ThreatDescriptor objects](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/) in this PrivacyGroup.


    - Clients that want to deeply inspect data should refer to the fields selection in [ThreatDescriptor objects](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/) \- you can [nest field selections](https://developers.facebook.com/docs/graph-api/guides/field-expansion#nested-requests) with curly braces: example: `fields=descriptors{owner{name}}`


  - `tags` A shortcut for a flattened list of tag names from `descriptors{tags{name}}`

  - `status` A shortcut to taking the highest severity status from`descriptors{status, reactions}`

  - `applications_with_opinions` A shortcut for a flattened list of ThreatExchange member ids from `descriptors{owner, reactions{owner}}`


Example query for all indicators that last updated between December 2019 (1575187200) to March 2020 (1583049600) for privacy group 123456789012345:

```code
https://graph.facebook.com/v25.0/123456789012345/threat_updates/?access_token=555|aSdF123GhK&start_time=1575187200&stop_time=1583049600&fields=id,indicator,type,creation_time,last_updated,should_delete,tags,status,applications_with_opinions,descriptors{status,owner{id}}
```

Data Returned:

```code
{
    "data": [\
        {\
            'id': '123456',\
            'indicator': 'a_hash_that_was_created_or_updated',\
            'type': 'HASH_PDQ',\
            'creation_time': 1581977111,\
            'last_updated': 1582372222,\
            'should_delete': False,\
            'tags': ['tag1', 'another_tag'],\
            'status': 'MALICIOUS',\
            'applications_with_opinions': ['1234567890'],\
            'descriptors': {\
                'data': [\
                    {\
                        "status": "SUSPICIOUS",\
                        "owner": {\
                            "id": "1234567890"\
                        }\
                    }\
                ]\
            }\
        },\
        {\
            'id': '123457',\
            'indicator': 'a_hash_that_should_be_deleted',\
            'type': 'HASH_PDQ',\
            'creation_time': 1581977111,\
            'last_updated': 1582372222,\
            'should_delete': True,\
            'tags': ['tag1', 'another_tag'],\
            'status': 'MALICIOUS',\
            'applications_with_opinions': ['1234567890']\
            'descriptors': [...]\
        },\
        ...\
    ]
    "paging": {
        "cursors": {
            "before": "MjVFR",
            "after": "MjQZD"
        }
    "next": "https://graph.facebook.com/v25.0/123456789012345/threat_updates/?access_token=555|aSdF123GhK&start_time=1575187200&stop_time=1583049600&types=HASH_MD5,HASH_PDQ&fields=id,indicator,type,creation_time,last_updated,should_delete,tags,status,applications_with_opinions,descriptors{status,owner{id}}&after=MjQZD"
    }
```

On This Page

[/<privacy-group>/threat\_updates](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/v25.0#threat_updates)

[Parameters](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/v25.0#parameters)