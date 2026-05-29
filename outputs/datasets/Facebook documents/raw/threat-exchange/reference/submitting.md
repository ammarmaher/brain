---
url: https://developers.facebook.com/docs/threat-exchange/reference/submitting
title: Submit Data - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fsubmitting%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Submit New Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting#submit-new-data)

[Create](https://developers.facebook.com/docs/threat-exchange/reference/submitting#creating)

[Create with Templates](https://developers.facebook.com/docs/threat-exchange/reference/submitting#creating-with-templates)

[Upload from CSV](https://developers.facebook.com/docs/threat-exchange/reference/submitting#uploading)

[Upload Using the API](https://developers.facebook.com/docs/threat-exchange/reference/submitting#api-upload)

[Field Names for Upload](https://developers.facebook.com/docs/threat-exchange/reference/submitting#parameters)

[CSV Examples](https://developers.facebook.com/docs/threat-exchange/reference/submitting#csv-examples)

# Submit New Data

Visit the [**descriptors-tab page**](https://developers.facebook.com/docs/threat-exchange/reference/ui/descriptors) to see more things you can do with threat descriptors within the ThreatExchange UI, including searching, bulk download, and more.

## Create

Click **Create** to upload a new descriptor with tooltips to provide context. See the example below on how to submit a malicious domain using the UI:

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1206961946162107&version=1711673911)

If you set a descriptor's privacy to **has-whitelist** and include no whitelist apps, the owner's app is automatically included. This is a "visible to self" or "storage mode"
option.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2401774076595697&version=1711673911)

## Create with Templates

Using the **Create** button is fine for sharing a single threat descriptor, but what if you have a hundred or a thousand? As the example shows below, bulk-upload from a CSV file solves this problem in a general way.

But there's a common case that's simpler—when you don't really need a CSV file. ThreatExchange users often find they're submitting a number of threat descriptors which have all the same metadata, except for the indicator value. The **create-with-templates** feature fits the bill.

To use templates, click **Create**, then select the .

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2667055906873752&version=1711673911)

Because **template mode** is selected, once you click **OK**, you're redirected to a commit screen (the same as for upload from file) where you can make any revisions, if any, then commit.

The same process works for the **Copy** button as for the **Create** button. You can easily make "more of the same" as your organization has more data to share on a given topic.

## Upload from CSV

- See [below for information on column/attribute names](https://developers.facebook.com/docs/threat-exchange/reference/submitting#parameters).

- Alternatively, you can simply save any descriptor-query result to CSV and use that as a template.


To upload from CSV:

01. Click **Bulk Upload** s.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2481255302154528&version=1711673911)

05. Select your file:

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=766146170476013&version=1711673911)

09. Revise your data before committing:

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=451147712198193&version=1711673911)

13. If there are errors detected before committing, you'll be notified, and you can revise them.

Not all possible errors are surfaced here.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=469384570359335&version=1711673911)

17. Within the revision dialog, you can fix the errors and click **OK** to continue:

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=547816802663565&version=1711673911)

21. Once you click **Confirm Upload**, your new descriptors are saved and their IDs are entered into the search bar. At that point, you can further revise them, as necesary.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2530979646990822&version=1711673911)

The following screen recording shows the revise-before-upload feature in more detail:

Play

0:00

Mute

Enter Fullscreen

Sharing and reporting options

![](https://static.xx.fbcdn.net/rsrc.php/v4/y4/r/-PAXP-deijE.gif)

Something went wrong

We're having trouble playing this video.

[Learn more](https://www.facebook.com/help/396404120401278/list)

## Upload Using the API

You can submit data using the ThreatExchange API via an `HTTP POST` to [https://graph.facebook.com/v22.0/threat\_descriptors](https://graph.facebook.com/v22.0/threat_descriptors).

The call to `/threat_indicators` is deprecated as of v2.4 of the ThreatExchange API. If you attempt to access this endpoint in v2.4+, it creates a threat descriptor and the associated threat indicator behind the scenes.

**Example**: Submission of a malicious domain using the API

```code
https://graph.facebook.com/v22.0/threat_descriptors?access_token=555|aSdF123GhK

POST DATA:
indicator=evil-domain.biz
&amp;type=DOMAIN
&amp;tags=testingtags
&amp;status=MALICIOUS
&amp;description=This%20domain%20was%20hosting%20malware
&amp;privacy_type=VISIBLE
```

Data returned:

```code
{
"id": "853037291373757",
"success": true
}
```

## Field Names for Upload

Bold parameters are required.

| API Name and Example | UI CSV Name and Example | Description |
| --- | --- | --- |
| **`access_token`**<br>`555|aSdF123GhK` | _Not used for the UI_ | Key for authenticating to the API, in this format:<br>`your-app-id|your-app-secret`<br>See the<br> [Access Token Tool](https://developers.facebook.com/tools/accesstoken) <br>to find values for your apps. |
| **`description`**<br>`This%20domain%20was%20hosting%20malware` | **`td_description`**<br>`This domain was hosting malware` | Short summary of the indicator and threat. |
| **`indicator`**<br>`evil-domain.biz` | **`td_raw_indicator`**<br>`evil-domain.biz` | Indicator data being submitted. |
| **`type`**<br>`URI` | **`td_indicator_type`**<br>`URI` | Type of indicator being described. See<br> [IndicatorType](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type) <br>for the list of allowed values. |
| **`privacy_type`**<br>`HAS_PRIVACY_GROUP` | **`td_visibility`**<br>`HAS_PRIVACY_GROUP` | Type of privacy for the indicator. See<br> [PrivacyType](https://developers.facebook.com/docs/threat-exchange/reference/apis/privacy-type) <br>for the list of allowed values. |
| `privacy_members`<br>`1064060413755420,494491891138576` | `td_whitelist_apps`<br>`1064060413755420,494491891138576`<br>`td_privacy_groups`<br>`438835087026293,468692780520730`<br>Or, for compatibility, you can use a column name of<br>`td_privacy_members`<br>for upload, as necessary. If visibility is<br>`HAS_WHITELIST`<br>, proceed as if your<br>`td_privacy_members`<br>column were named<br>`td_whitelist_apps`<br>. If visibility is<br>`HAS_PRIVACY_GROUP`<br>, proceed as if your<br>`td_privacy_members`<br>column were named<br>`td_privacy_groups`<br>.<br>See [CSV examples](https://developers.facebook.com/docs/threat-exchange/reference/submitting#csv_examples) example below. | A list of<br> [ThreatExchangeMembers](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member) <br>allowed to see the indicator, and only applies when<br>`privacy_type`<br>is set to<br>`HAS_WHITELIST`<br>or<br>`HAS_PRIVACY_GROUP`<br>. Delimiters are comma for the API and semicolon for the UI. |
| **`share_level`**<br>`AMBER` | **`td_share_level`**<br>`AMBER` | A designation of how the indicator may be shared based on the<br> [US-CERT's Traffic Light Protocol](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.us-cert.gov%2Ftlp%2F&h=AUA6egh2SmtOEJ-QMGd3DojSjZBqzgAEvCxQudS0wvIJVnlumg9hyZPhMrb9RS7B4bxWw3JbDk8nLz-SS71U_sWUBIT7nkhiA6l7-jfZvU6f94yhJRRROMFUBjpcAv9x0f2k38P5Sj9azg)<br>. See<br> [ShareLevelType](https://developers.facebook.com/docs/threat-exchange/reference/apis/share-level-type) <br>for the list of allowed values. Note: GREEN/WHITE requires VISIBLE, and AMBER/RED requires HAS\_WHITELIST or HAS\_PRIVACY\_GROUP. |
| **`status`**<br>`MALICIOUS` | **`td_status`**<br>`MALICIOUS` | Indicates if the indicator is labeled as malicious. See<br> [StatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/status-type) <br>for the list of allowed values. |
| `tags`<br>`testing,pwny` | `td_subjective_tags`<br>`testing;pwny` | API: Comma-separated list of tags you want to publish. <br>UI: Semicolon-separated list of tags you want to publish.<br>This replaces any existing tags.<br>Tags are not strictly required, but they are essential for your collaborators to discover data you contribute. |
| `add_tags`<br>`pwny,testing` | _Not used for the UI_ | To add tags to an object without overwriting existing tags. |
| `remove_tags`<br>`pwny,testing` | _Not used for the UI_ | Remove tags associated with an object. |
| `confidence`<br>`100` | `td_confidence`<br>`100` | A score for how likely the indicator's<br>`status`<br>is accurate, ranging from 0 to 100. |
| `expired_on` | `td_expire_time`<br>`2019-11-07T22:25:00-05:00` | Time the indicator is no longer considered a threat, in ISO 8601 date format. |
| `first_active` | `td_first_active`<br>`2019-11-07T22:25:00-05:00` | Time when the opinion first became valid. |
| `last_active` | `td_last_active`<br>`2019-11-07T22:25:00-05:00` | Time when the opinion stopped being valid. |
| `review_status`<br>`PENDING` | `td_review_status`<br>`PENDING` | Describes how the indicator was vetted. See<br> [ReviewStatusType](https://developers.facebook.com/docs/threat-exchange/reference/apis/review-status-type) <br>for the list of allowed values. |
| `severity`<br>`SEVERE` | `td_severity`<br>`SEVERE` | A rating of how severe the indicator is when found in an incident. See<br> [SeverityType](https://developers.facebook.com/docs/threat-exchange/reference/apis/severity-type) <br>for the list of allowed values. |
| N/A | `td_related_ids_for_upload` | For submitting relations in bulk. Please see the<br> [Submitting Connections page](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections) <br>for more information. |
| N/A | `td_related_triples_for_upload` | For submitting relations in bulk. Please see the<br> [Submitting Connections page](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections) <br>for more information. |

## CSV Examples

When you download as CSV, we put whitelist apps and privacy groups in the format `id1:name1;id2:name2`. Tags are always text-only, delimited by semicolons:

`id                 2494923897281868
td_description     This is an example descriptor
td_status          UNKNOWN
td_confidence      0
td_severity        SEVERE
td_share_level     AMBER
td_indicator_type  URI
td_raw_indicator   https://evilevillabs.com/evil.php
td_visibility      HAS_WHITELIST
td_creation_time   2019-11-07T22:25:00-05:00
td_update_time     2019-11-07T22:25:01-05:00
td_expire_time
td_owner_id        494491891138576
td_owner_name      Media Hash Sharing RF Test
td_subjective_tags testing;pwny
td_whitelist_apps  1064060413755420:Media Hash Sharing Test;494491891138576:Media Hash Sharing RF Test

`

When upload from CSV, you may specify whitelist apps and privacy groups in the format `id1;id2` if you prefer:

`td_description     This is an example descriptor
td_status          UNKNOWN
td_confidence      0
td_severity        SEVERE
td_share_level     AMBER
td_indicator_type  URI
td_raw_indicator   https://evilevillabs.com/evil.php
td_visibility      HAS_WHITELIST
td_creation_time   2019-11-07T22:25:00-05:00
td_update_time     2019-11-07T22:25:01-05:00
td_expire_time
td_owner_id        494491891138576
td_owner_name      Media Hash Sharing RF Test
td_subjective_tags testing;pwny
td_whitelist_apps  1064060413755420;494491891138576

`

On This Page

[Submit New Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting#submit-new-data)

[Create](https://developers.facebook.com/docs/threat-exchange/reference/submitting#creating)

[Create with Templates](https://developers.facebook.com/docs/threat-exchange/reference/submitting#creating-with-templates)

[Upload from CSV](https://developers.facebook.com/docs/threat-exchange/reference/submitting#uploading)

[Upload Using the API](https://developers.facebook.com/docs/threat-exchange/reference/submitting#api-upload)

[Field Names for Upload](https://developers.facebook.com/docs/threat-exchange/reference/submitting#parameters)

[CSV Examples](https://developers.facebook.com/docs/threat-exchange/reference/submitting#csv-examples)