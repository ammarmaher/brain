---
url: https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors
title: /threat_descriptors - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fapis%2Fthreat-descriptors%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[/threat\_descriptors](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors#threat_descriptors)

[Parameters](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors#parameters)

# /threat\_descriptors

NOTE: Queries using this call are not guaranteed to be comprehensive and may only return partial results. See how to do bulk download in [Best Practices](https://developers.facebook.com/docs/threat-exchange/best-practices).

The API call enables searching for subjective opinions on indicators stored in ThreatExchange. With this call you can search by free text, type, submitter, or all in a specific time window. Combinations of these query types are also allowed. This call is only permitted on Platform versions 2.4 and later.

This query may only return partial results and should only be used to find examples of ThreatDescriptors matching the query parameters. To get a comprehensive list of ThreatDescriptors you should use the [`\threat_tags` endpoint](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags) and do any necessary post-process filtering

## Parameters

The following query parameters are available (bold params are required):

- **`access_token`** \- The key for authenticating to the API, in the format <your-app-id>\|<your-app-secret>. For example, if our app ID was 555 and our app secret aSdF123GhK, our access\_token would be "555\|aSdF123GhK".

- `include_expired` \- When set to true, the API can return data which has expired. Expired data is denoted by having the expire\_time field as non-zero and less than the current time.

- `limit` \- Defines the maximum size of a page of results. The maximum is 1,000.

- `max_confidence` \- Define the maximum allowed confidence value for the data returned.

- `min_confidence` \- Define the minimum allowed confidence value for the data returned.

- `owner` \- Comma-separated list of [ThreatExchangeMember](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member) IDs of the person who submitted the data.

- `privacy_groups` \- Comma-separated list of [ThreatPrivacyGroup](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group) IDs.

- `text` \- Freeform text field with a value to search for. This can be a file hash or a string found in other fields of the objects.

- `review_status` \- A given [ReviewStatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/review-status-type)

- `share_level` \- A given [ShareLevelType](https://developers.facebook.com/docs/threat-exchange/reference/apis/share-level-type)

- `sort_by` \- Sort search results by RELEVANCE or by CREATE\_TIME. When sorting by RELEVANCE, your query will return results sorted by similarity against your text query.

- `status` \- A given [StatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/status-type)

- `strict_text` \- When set to 'true', the API will not do approximate matching on the value in text

- `tags` \- Comma-separated list of tags to filter results

- `tags_are_anded` \- If omitted or set to `false`, with `tags=a,b` shows descriptors having tags `a` or `b`. If set to `true`, shows descriptors having tags `a` and `b`.

- `type` \- The type of descriptor to search for (see [IndicatorTypes](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type/))

- `since` \- Returns descriptors collected after a timestamp

- `until` \- Returns descriptors collected before a timestamp

- `fields` \- A list of fields to return in the response


Optional parameters for POST -- documented with examples [here](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fapi-reference-examples%2Fjava%2Fte-tag-query&h=AUBtB89talHv-bguU4Mm6S7owMU4MCXOQSeldVeSjIZK9lTWEzNi21U0JqPQw3t5ECaRdoYxjCoPEEVzoa1kORodb7usu-Pr0NEeUqJAkHhX9rDzkhqA6F-xF17uTvVbb63QRsKsfE09kg):

- `related_ids_for_upload`

- `related_triples_for_upload`


Example query for all IP addresses submitted by Facebook Administrator which contain the word "proxy":

```code
https://graph.facebook.com/v2.8/threat_descriptors?access_token=555|asDF&amp;type=IP_ADDRESS&amp;owner=820763734618599&amp;text=proxy
```

Data returned:

```code
{
  "data": [\
    {\
      "id": "600399050063019",\
      "indicator": {\
        "indicator": "52.68.54.232",\
        "type": "IP_ADDRESS",\
        "id": "1117440484937537"\
      },\
      "owner": {\
        "id": "820763734618599",\
        "email": "threatexchange@support.facebook.com",\
        "name": "Facebook Administrator"\
      },\
      "type": "IP_ADDRESS",\
      "raw_indicator": "52.68.54.232",\
      "description": "TOR Proxy IP Address",\
      "status": "UNKNOWN"\
    },\
    ...\
  ],
  "paging": {
    "cursors": {
      "before": "MAZDZD",
      "after": "MjQZD"
    },
    "next": "https://graph.facebook.com/v2.8/threat_descriptors?access_token=555|1234&amp;pretty=0&amp;owner=820763734618599&amp;text=proxy&amp;type=IP_ADDRESS&amp;limit=25&amp;after=MjQZD"
  },
}
```

The same query using a cURL:

```code
curl -i -X GET \
 "https://graph.facebook.com/v2.8/threat_descriptors?type=IP_ADDRESS&amp;owner=820763734618599&amp;text=proxy&amp;access_token=555%7C1234"
```

The same query in Python:

```code
import requests
import json
import ast
import urllib

app_id = '555' # Replace this with your app ID
app_secret = '1234' # Replace this with your app secret
type_ = 'IP_ADDRESS'
owner_app_id = 820763734618599
text = 'proxy'

query_params = urllib.urlencode({
    'access_token' : app_id + '|' + app_secret,
    'type' : type_,
    'owner' : owner_app_id,
    'text' : text
    })

r = requests.get('https://graph.facebook.com/v2.8/threat_descriptors?' + query_params)

print json.dumps(ast.literal_eval(r.text), sort_keys=True,indent=4,separators=(',', ': '))
```

The same query in Java:

```code
import java.io.InputStream;
import java.net.URL;
import java.net.URLConnection;
import java.util.Scanner;

public class ThreatDescriptors {

    public final static void main(String[] args) throws Exception {
        String url = "https://graph.facebook.com/v2.8/threat_descriptors?";
        String appID = "555"; // Replace this with your app ID
        String appSecret = "12345"; // Replace this with your app secret
        String type = "IP_ADDRESS";
        String ownerAppID = "820763734618599";
        String text = "proxy";

        String query = String.format("access_token=%s&amp;type=%s&amp;owner=%s&amp;text=%s",
                appID + "|" + appSecret,
                type,
                ownerAppID,
                text
                );
        URLConnection connection = new URL(url + query).openConnection();
        InputStream response = connection.getInputStream();
        System.out.print(convertStreamToString(response));
        response.close();
    }

    static String convertStreamToString(InputStream inputStream){
        Scanner scanner = new Scanner(inputStream).useDelimiter("\\A");
        return scanner.hasNext() ? scanner.next() : "";
    }

}
```

The same query in PHP:

```code
<?php
  $appID = "555"; // Replace this with your AppID
  $appSecret = "1234"; // Replace this with your App Secret
  $type = 'IP_ADDRESS';
  $text = 'proxy';
  $ownerAppID = "820763734618599";
  $access_token = $appID . "|" . $appSecret;

  $ch = curl_init();
  curl_setopt($ch, CURLOPT_URL,
    "https://graph.facebook.com/v2.8/threat_descriptors?" .
    "access_token=" . $access_token .
    "&amp;type=" . $type .
    "&amp;owner=" . $ownerAppID .
    "&amp;text=" . $text);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
  $response = curl_exec($ch);
  $json = json_encode(json_decode($response), JSON_PRETTY_PRINT);
  print($json . PHP_EOL);
  curl_close($ch);
?>
```

On This Page

[/threat\_descriptors](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors#threat_descriptors)

[Parameters](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptors#parameters)