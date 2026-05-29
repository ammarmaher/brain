---
url: https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags
title: ThreatTag Object - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fapis%2Fthreattags%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

Graph API Version

[v25.0](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags/v25.0#)

# ThreatTag

A label which groups [Malware](https://developers.facebook.com/docs/threat-exchange/reference/apis/malware), [ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor), and/or [MalwareFamily](https://developers.facebook.com/docs/threat-exchange/reference/apis/malware-family) objects. Once objects are tagged, you can use tags to narrow your search queries in TE.

## Fields

| Parameter | Description | Type |
| --- | --- | --- |
| `id` | Unique identifier of the threat tag | `number` |
| `text` | The text for this tag | `string` |

### Legal Tags

The text of tags is case insensitive, restricted to letters, numbers, underscores, and colons, and must be UTF-8 friendly. So "שלום" is a valid text, but "#example-tag" is not.

### Sample Usage

Example query for a specific ThreatTag: 908180082612873

Data returned:

```code
{
  "id": "908180082612873",
  "text": "evilevil"
}
```

Example of searching for a tag by text 'evilevil'. Note that partial tag search is supported.

```code
https://graph.facebook.com/v2.7/threat_tags/?access_token=555|aSdF123GhK&amp;text=evilevil
```

Data returned:

```code
{
  "data": [\
    {\
      "id": "908180082612873",\
      "text": "evilevil"\
    }\
    ...\
  ]
}
```

## Connections

| Name | Description | Type |
| --- | --- | --- |
| `tagged_objects` | The objects tagged with this text. | `Malware`, `ThreatDescriptor`, `MalwareFamily` |

#### Parameters

The following query parameters are available:

- `tagged_since` \- Fetches all objects that have been tagged since this time (inclusive).

- `tagged_until` \- Fetches all objects that have been tagged until this time (inclusive).


Tagged objects are returned in the order based on when the tag was applied, ascending. This timestamp is currently not exposed by the API, but is the same one used by `tagged_since` and `tagged_until`. While this API can be used to create a copy of data in ThreatExchange, the [threat\_updates](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-updates/v10.0) API may be better suited for your usecase.

### Sample Usage

Example of tagged objects for a specific ThreatTag: 908180082612873

```code
https://graph.facebook.com/v2.7/908180082612873/tagged_objects/?access_token=555|aSdF123GhK
```

Data returned:

```code
{
  "data": [\
    {\
      "id": "1039423046092869",\
      "type": "THREAT_DESCRIPTOR",\
      "name": "test1464195852.evilevillabs.com"\
    },\
    ...\
  ]
}
```

Example of tagged objects for a ThreatTag with the text 'ducks'

```code
https://graph.facebook.com/v2.7/threat_tags/?access_token=555|aSdF123GhK&amp;text=ducks&amp;fields=id,text,tagged_objects
```

Data returned:

```code
{
  "data": [\
    {\
      "id": "501159930008561",\
      "text": "ducks"\
      "tagged_objects": {\
        "data": [\
          {\
            "id": "1162586023812794",\
            "type": "THREAT_DESCRIPTOR",\
            "name": "test1469481750.evilevillabs.com"\
          },\
          ...\
        ]\
      },\
    }\
  ]
}
```

## Creating a New Tag

You can create a ThreatTag on-the-fly while creating a ThreatDescriptor. If the ThreatTag does not exist, a new one will be created and applied to the new ThreatDescriptor.

```code
https://graph.facebook.com/v2.7/threat_descriptors?access_token=555|aSdF123GhK

POST DATA:
  tags=cows,bar
  &amp;type=DOMAIN
  &amp;indicator=test1466722733.evilevillabs.com
  &amp;description=this is an example with tags
  &amp;privacy_type=VISIBLE
  &amp;share_level=GREEN
  &amp;status=UKNOWN
```

Data returned:

```code
{
  "success": true,
  "id": "1162586023812794"
}
```

To create a ThreatTag without labeling any objects, you can post to the /threat\_tags endpoint explicitly:

```code
https://graph.facebook.com/v2.7/threat_tags?access_token=555|aSdF123GhK

POST DATA:
  text=superlongtagfortestingcreation
  &amp;objects=973966502652751,898684593584287
```

Data returned:

```code
{
  "success": true,
  "id": "1373232162693002"
}
```

Example of updating a ThreatDescriptor with more tags. If the tag does not exist, a new one will be created and applied to this ThreatDescriptor.

```code
https://graph.facebook.com/v2.7/1162586023812794?access_token=555|aSdF123GhK

POST DATA:
  tags=ducks,chicken
```

Data returned:

```code
{
  "success": true
}
```

## Popular Tags

Here is a list of the most popular tags categorizing data related to attacks:

| Name | Description |
| --- | --- |
| `access_token_theft` | Theft of an OAuth style or similar access token |
| `bogon` | A bogus IP address |
| `bot` | A bot |
| `brute_force` | Repeated attempts to access an authenticated resource |
| `clickjacking` | Any UI redressing or similar type of attack redirecting a person's clicks |
| `compromised` | The associated party has been compromised |
| `creeper` | A party which stalks another online |
| `drugs` | Associated with drugs |
| `email_spam` | Sending of unsolicited email |
| `explicit_content` | Pornographic or otherwise explicit content |
| `exploit_kit` | A set of tools used to take advantage of vulnerabilities |
| `fake_account` | An account associated with no real entity, often used for abuse |
| `financial` | Associated with financials, perhaps fraud |
| `ip_infringement` | Infringement on the rights of an intellectual property holder |
| `malicious_app` | A malicious web app |
| `malicious_nameserver` | A malicious name server |
| `malicious_webserver` | A malicious web server |
| `malvertising` | The use of online advertising to spread malware |
| `malware` | A malware-based attack |
| `passive_dns` | Interserver DNS messages are being captured, recorded, and potentially exfiltrated |
| `phishing` | An attempt to obtain credentials via a deceptive lure |
| `piracy` | Illegal replication of protected property |
| `prox` | A proxy host |
| `scam` | A generic type of scam |
| `scanning` | Port scanning to map a network |
| `scraping` | Systematic traversal of a network and recording of data |
| `self_xss` | Attack where a person is social engineered into pasting malicious code into their brower's address bar or developer console |
| `share_baiting` | A person is convinced to share spammy content in exchange for a fictitious product or content |
| `targeted` | An attack conducted by a sophisticated actor and directed at a specific target |
| `terrorism` | Associated with terrorist attacks or groups |
| `weapons` | Related to the illegal trade of arms |
| `web_app` | A malicious web app |

Here is a list of the most popular tags categorizing data by type:

| Name | Description |
| --- | --- |
| `bad_actor` | Details on a presumed bad actor (e.g. botherder, spammer) |
| `compromised_credential` | The credential compromised by an attack (must be already publicly accessible) |
| `ht_victim` | For high-value victim targeting |
| `malicious_ad` | A malicious advertisement |
| `malicious_api_key` | An API key which is being abused |
| `malicious_content` | A malicious post, image, or document |
| `malicious_domain` | A malicious Internet domain |
| `malicious_inject` | A malicious piece of code that injected into a another file, process, or DOM |
| `malicious_ip` | A malicious IP address |
| `malicious_subnet` | A malicious IP address range |
| `malicious_ssl_cert` | A malicious SSL certificate |
| `malware_sample` | A specific piece of [Malware](https://developers.facebook.com/docs/threat-exchange/reference/apis/malware) |
| `malware_victim` | A victim of [Malware](https://developers.facebook.com/docs/threat-exchange/reference/apis/malware) |
| `proxy_ip` | An IP address known to be a proxy or VPN |
| `signature` | Represents some means or pattern for detecting a threat |
| `web_request` | A full web request, optionally with GET query parameters |
| `whitelist_domain` | An Internet domain that should be treated as non-malicious |
| `whitelist_ip` | An IP address that should be treated as non-malicious |
| `whitelist_url` | An URI that should be treated as non-malicious |