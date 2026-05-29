---
url: https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor
title: ThreatDescriptor Object - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fapis%2Fthreat-descriptor%2Fv25.0%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/v25.0#threatdescriptors)

Graph API Version

[v25.0](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/v25.0#)

# ThreatDescriptor

A subjective opinion about a [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/) that was submitted by a [ThreatExchangeMember](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member).

## Fields

| Parameter | Description | Type |
| --- | --- | --- |
| `id` | Unique identifier of the threat descriptor. Automatically assigned at create time, and non-editable. | `number` |
| `added_on` | The datetime this descriptor was first uploaded. Automatically computed; not directly editable. | `string` |
| `confidence` | A rating, from 0-100, on how confident the publisher is of the threat indicator's status. 0 is meant to be least confident, with 100 being most confident. | `number` |
| `description` | A short summary of the indicator and threat. | `string` |
| `expired_on` | Datetime the indicator is no longer considered a threat, as subjectively determined by the owner of the descriptor. | `number` |
| `first_active` | The datetime when this opinion first became valid, as subjectively determined by the owner of the descriptor. | `string` |
| `last_active` | The datetime when this opinion stopped being valid, as subjectively determined by the owner of the descriptor. | `string` |
| `indicator` | The [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) described by the descriptor: for example, a URL or a hash string. Non-editable after the descriptor is created. | [`ThreatIndicator`](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) |
| `last_updated` | Datetime the threat descriptor was last updated. Automatically computed; not directly editable. | `string` |
| `my_reactions` | A list of reactions that you have added to this descriptor. | [`ReactionType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/reaction-type) |
| `owner` | The [ThreatExchangeMember](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member) that submitted the descriptor. Non-editable. | [`ThreatExchangeMember`](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member) |
| `precision` | The degree of accuracy of the descriptor. | [`PrecisionType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/precision-type) |
| `privacy_type` | The level of privacy applied to the descriptor. Also known as "visibility". | [`PrivacyType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/privacy-type) |
| `raw_indicator` | A raw, unsanitized string of the indicator being described. | `string` |
| `reactions` | A list of reactions to reacting application. | [`ReactionType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/reaction-type) |
| `review_status` | Describes how the indicator was vetted. | [`ReviewStatusType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/review-status-type) |
| `severity` | Dangerousness of threat associated with the indicator. | [`SeverityType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/severity-type) |
| `share_level` | A designation of how the indicator may be shared, based on the [US-CERT's Traffic Light Protocol](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.us-cert.gov%2Ftlp%2F&h=AUDBO1iuiECoOMGbm-nNRywlXZBFzaBNEtAHi1BIazgAljHDztes3kDs0dB3FEOug6gv2ZhiPjpRzA0_8o1i8ZCv6JmzL6YWK6F4GckXNTKGwJePTYHVGX2DSNaOo1PrnaW0vyszdQCWrg). | [`ShareLevelType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/share-level-type) |
| `source_uri` | A publicly accessible URL containing further context or details about the descriptor. | `string` |
| `status` | If the indicator is known to be malicious or not. | [`StatusType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/status-type) |
| `type` | The type of indicator. | [`IndicatorType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type) |

### Connections

| Parameter | Description | Type |
| --- | --- | --- |
| `tags` | The tags applied to this descriptor. | `string` |

For additional documentation on ThreatTags, see [ThreatTag Object](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags/v2.8)

## Reading

Example query for a specific descriptor: 29552573304386008

```curl
curl \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/29552573304386008


Open In Graph API Explorer
```

Data returned:

```code
{
  "added_on": "2025-05-20T13:49:06+0000",
  "confidence": 99,
  "description": "An example of a publicly visible Descriptor for the docs at https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor",
  "id": "29552573304386008",
  "indicator": {
    "id": "2821805551224300",
    "indicator": "https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor",
    "type": "URI"
  },
  "last_updated": "2025-05-20T13:49:06+0000",
  "owner": {
    "id": "316842935455502",
    "name": "Meta ThreatExchange"
  },
  "privacy_type": "VISIBLE",
  "raw_indicator": "https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor",
  "review_status": "REVIEWED_MANUALLY",
  "severity": "INFO",
  "share_level": "WHITE",
  "status": "NON_MALICIOUS",
  "type": "URI"
}
```

## Creating

We can send a POST request to `/threat_descriptors`. The example below will create a piece of data that shared only with other members in Example Program. Note to run this call, you must join Example Program.

```curl
curl -X POST https://graph.facebook.com/v24.0/threat_descriptors \
  -F "access_token=<ACCESS_TOKEN>" \
  -F "type=URI" \
  -F "indicator=https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor" \
  -F "description=A malicious URL shared via the ThreatDescriptor API" \
  -F "privacy_type=HAS_PRIVACY_GROUP" \
  -F "share_level=GREEN" \
  -F "status=MALICIOUS" \
  -f "privacy_members=1012185296055235"


Open In Graph API Explorer
```

Data returned:

```code
{
  "success": true,
  "id": "25702495966077851"
}
```

## Updating

To make an update to an existing ThreatDescriptor, make a POST request to `/{threat_descriptor_id}`.

```curl
curl -X POST https://graph.facebook.com/v24.0/25702495966077851 \
  -F "access_token=<ACCESS_TOKEN>" \
  -F "description=Updated description via the ThreatDescriptor API"


Open In Graph API Explorer
```

Data returned:

```code
{
  "success": true
}
```

## Deleting

To remove an existing ThreatDescriptor, make a DELETE request to `/{threat_descriptor_id}`.

```curl
curl -X DELETE https://graph.facebook.com/v24.0/25702495966077851 \
  -F "access_token=<ACCESS_TOKEN>"


Open In Graph API Explorer
```

Data returned:

```code
{
  "success": true
}
```

On This Page

[ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/v25.0#threatdescriptors)