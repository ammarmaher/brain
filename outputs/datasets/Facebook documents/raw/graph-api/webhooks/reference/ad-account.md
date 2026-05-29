---
url: https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/
title: Webhooks Reference: Ad Account
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Freference%2Fad-account%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Webhooks from Meta](https://developers.facebook.com/docs/graph-api/webhooks)

- [Getting Started](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
- [Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps)
- [Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge)
- [Reference](https://developers.facebook.com/docs/graph-api/webhooks/reference)


  - [Ad Account](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/)
  - [Application](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/)
  - [Catalog](https://developers.facebook.com/docs/graph-api/webhooks/reference/catalog/)
  - [Instagram](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/)
  - [Managed Meta Account](https://developers.facebook.com/docs/graph-api/webhooks/reference/managed-meta-account/)
  - [Page](https://developers.facebook.com/docs/graph-api/webhooks/reference/page/)
  - [Permissions](https://developers.facebook.com/docs/graph-api/webhooks/reference/permissions/)
  - [User](https://developers.facebook.com/docs/graph-api/webhooks/reference/user/)
  - [Whatsapp Business Account](https://developers.facebook.com/docs/graph-api/webhooks/reference/whatsapp-business-account/)

On This Page

[Ad Account (ad\_account)](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#ad-account--ad-account--)

[ads\_async\_creation\_request](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#ads_async_creation_request)

[creative\_fatigue](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#creative_fatigue)

[ad\_recommendations](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#ad_recommendations)

[in\_process\_ad\_objects](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#in_process_ad_objects)

[product\_set\_issue](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#product_set_issue)

[with\_issues\_ad\_objects](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#with_issues_ad_objects)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#)

# Ad Account (`ad_account`)

List of Ad account fields you can subscribe to.

## `ads_async_creation_request`

AdAccountAdsAsyncCreationRequestField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `status`<br>enum | status |
| `result`<br>object | result |
| `result_id`<br>numeric string | result\_id |
| `error_code`<br>unsigned int32 | error\_code |
| `error_message`<br>string | error\_message |

## `creative_fatigue`

AdAccountCreativeFatigueField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `ad_account_id`<br>numeric string | ad\_account\_id |
| `adgroup_id`<br>numeric string | adgroup\_id |
| `creative_fatigue_level`<br>string | creative\_fatigue\_level |
| `creative_fatigue_message`<br>string | creative\_fatigue\_message |

## `ad_recommendations`

AdAccountGuidanceField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `ad_account_id`<br>numeric string | ad\_account\_id |
| `ad_object_ids`<br>list<numeric string> | ad\_object\_ids |
| `recommendation_type`<br>enum | recommendation\_type |
| `recommendation_signature`<br>string | recommendation\_signature |
| `recommendation_message`<br>string | recommendation\_message |

## `in_process_ad_objects`

AdAccountInProcessAdObjectsField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | Data of the ad object exit in\_process status |
| `id`<br>numeric string | id of the ad object |
| `level`<br>string | Level of the ad object, including 'CREATIVE', 'AD', 'AD\_SET', 'CAMPAIGN'. |
| `status_name`<br>string | Status of current ad object transition to |

## `product_set_issue`

AdAccountProductSetIssueField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | Product Set Issue Details |
| `ad_account_id`<br>numeric string | ID of [Ad Account](https://developers.facebook.com/docs/marketing-api/reference/ad-account) |
| `product_set_id`<br>numeric string | ID of [Product Set](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/product_sets/) |
| `type`<br>enum | An enum of the product set issue type |
| `description`<br>string | Detailed explanation of the specific issue related to the product set. |
| `recommended_action`<br>string | Suggested actions to resolve the issue described. |

## `with_issues_ad_objects`

AdAccountWithIssuesAdObjectsField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | Data of the ad object set to WITH\_ISSUES |
| `id`<br>numeric string | ID of the ad object |
| `level`<br>string | Level of the ad object, including 'AD', 'AD\_SET', 'CAMPAIGN'. |
| `error_code`<br>numeric string | Error code of the issue |
| `error_summary`<br>string | Error summary of the issue |
| `error_message`<br>string | Error message of the issue |

On This Page

[Ad Account (ad\_account)](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#ad-account--ad-account--)

[ads\_async\_creation\_request](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#ads_async_creation_request)

[creative\_fatigue](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#creative_fatigue)

[ad\_recommendations](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#ad_recommendations)

[in\_process\_ad\_objects](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#in_process_ad_objects)

[product\_set\_issue](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#product_set_issue)

[with\_issues\_ad\_objects](https://developers.facebook.com/docs/graph-api/webhooks/reference/ad-account/#with_issues_ad_objects)