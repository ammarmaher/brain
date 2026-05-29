---
url: https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags
title: /threat_tags - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fapis%2Fthreat-tags%2Fv25.0%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[/threat\_tags](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags/v25.0#threat_tags)

[Parameters](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags/v25.0#parameters)

Graph API Version

[v25.0](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags/v25.0#)

# /threat\_tags

This API call enables searching for tags in ThreatExchange. With this call you can search for ThreatTag objects by text.

## Parameters

The following query parameters are available (bold parameters are required):

- **`access_token`** \- The key for authenticating to the API.

- **`text`** \- Freeform text field with a value to search for. This value should describe a broader type or class of attack you are interested in.

- `fields` \- A list of fields to return in the response

- `subscribed` \- when POSTing to a specific tag, will subscribe you to a tag for Webhooks


Example query for all tags which start with `malware`:

```code
https://graph.facebook.com/v25.0/threat_tags?access_token=555|aSdF123GhK&text=malware
```

```code
{
  "data": [\
    {\
      "id": "1318516441499594",\
      "text": "malware"\
    },\
    {\
      "id": "1104531542952223",\
      "text": "malwaresite"\
    },\
    ...\
}\
```\
\
The same query using a cURL:\
\
```code\
curl -i -X GET \\
 "https://graph.facebook.com/v14.0/threat_tags?access_token=555|7C1234&amp;text=malware"\
```\
\
The same query in Python:\
\
```code\
import requests\
import json\
import ast\
import urllib\
\
app_id = '555' # Replace this with your app ID\
app_secret = '1234' # Replace this with your app secret\
text = 'malware'\
\
query_params = urllib.urlencode({\
    'access_token' : app_id + '|' + app_secret,\
    'text' : text\
    })\
\
r = requests.get('https://graph.facebook.com/v14.0/threat_tags?' + query_params)\
\
print json.dumps(ast.literal_eval(r.text), sort_keys=True,indent=4,separators=(',', ': '))\
```\
\
Example query for tags which start with `ducks` and fetching the tagged objects.\
\
```code\
https://graph.facebook.com/v25.0/threat_tags/?access_token=555|aSdF123GhK&text=ducks&fields=id,text,tagged_objects\
```\
\
Data returned:\
\
```code\
{\
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
  ]\
}\
```\
\
On This Page\
\
[/threat\_tags](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags/v25.0#threat_tags)\
\
[Parameters](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags/v25.0#parameters)