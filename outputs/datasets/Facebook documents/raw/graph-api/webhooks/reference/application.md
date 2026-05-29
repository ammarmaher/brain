---
url: https://developers.facebook.com/docs/graph-api/webhooks/reference/application/
title: Webhooks Reference: Application
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Freference%2Fapplication%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Application (application)](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#application--application--)

[ad\_account](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#ad_account)

[ads\_rules\_engine](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#ads_rules_engine)

[async\_requests](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#async_requests)

[dev\_alerts](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#dev_alerts)

[group\_install](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#group_install)

[oe\_reseller\_onboarding\_request\_created](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#oe_reseller_onboarding_request_created)

[plugin\_comment](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#plugin_comment)

[plugin\_comment\_reply](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#plugin_comment_reply)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#)

# Application (`application`)

Category of updates that are sent to a specific app

## `ad_account`

ApplicationAdAccountField, which is used to get status of AdAccount from Webhooks.

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | Result values |
| `id`<br>string | ID of the AdAccount |
| `account_status`<br>unsigned int32 | Account Status of AdAccount |
| `disable_reason`<br>unsigned int32 | Disabled reason of AdAccount |
| `business`<br>string | ID of the Business |

## `ads_rules_engine`

The ads\_rules\_engine field of the Webhooks application topic.

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | Result values |
| `rule_id`<br>id | ID of the rule associated with the ad object |
| `account_id`<br>id | ID of the ad account that owns the rule |
| `object_id`<br>id | ID of the ad object that passed rule evaluation |
| `object_type`<br>enum {CAMPAIGN, ADSET, AD} | The type of the ad object |
| `trigger_type`<br>enum {METADATA\_CREATION, METADATA\_UPDATE, STATS\_MILESTONE, STATS\_CHANGE, DELIVERY\_INSIGHTS\_CHANGE} | The type of the trigger |
| `trigger_field`<br>string | Field that passed rule evaluation |
| `current_value`<br>string | Current value of the trigger field |

## `async_requests`

The async\_requests field of the Webhooks application topic

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | The result values. |
| `category`<br>string | Category. |
| `verb`<br>enum {complete, fail} | Status of the async job. |
| `report_id`<br>id | Report run id. |

## `dev_alerts`

ApplicationDevAlertsField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `notification_id`<br>numeric string | notification\_id |
| `date`<br>datetime | date |
| `header`<br>string | header |
| `subtitle`<br>string | subtitle |

## `group_install`

The group\_install field for the Webhooks group topic

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | The contents of the update |
| `group_id`<br>numeric string | Group ID on which application was installed or uninstalled |
| `update_time`<br>datetime | The time of update |
| `verb`<br>enum {add, block, edit, edited, delete, follow, hide, mute, remove, unblock, unhide, update} | The type of action taken |
| `actor_id`<br>numeric string | Admin who installed or uninstalled the application |

## `oe_reseller_onboarding_request_created`

The node for the webhook called during oe reseller create.

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | The data storing the id. |
| `id`<br>numeric string | The associated oe request id, that can be used to query more information |

## `plugin_comment`

The plugin\_comment field of the Webhooks application topic

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>[Comment](https://developers.facebook.com/docs/graph-api/reference/comment/) | The result value. |
| `id`<br>token with structure: Comment ID | The comment ID |
| `from`<br>User\|Page | The profile that made this comment |
| `message`<br>string | The comment text |
| `created_time`<br>datetime | The time this comment was made |

## `plugin_comment_reply`

The plugin\_comment\_reply field of the Webhooks application topic

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>[Comment](https://developers.facebook.com/docs/graph-api/reference/comment/) | The result value. |
| `id`<br>token with structure: Comment ID | The comment ID |
| `from`<br>User\|Page | The profile that made this comment |
| `message`<br>string | The comment text |
| `created_time`<br>datetime | The time this comment was made |
| `parent`<br>[Comment](https://developers.facebook.com/docs/graph-api/reference/comment/) | For comment replies, the comment this is a reply to |

On This Page

[Application (application)](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#application--application--)

[ad\_account](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#ad_account)

[ads\_rules\_engine](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#ads_rules_engine)

[async\_requests](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#async_requests)

[dev\_alerts](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#dev_alerts)

[group\_install](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#group_install)

[oe\_reseller\_onboarding\_request\_created](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#oe_reseller_onboarding_request_created)

[plugin\_comment](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#plugin_comment)

[plugin\_comment\_reply](https://developers.facebook.com/docs/graph-api/webhooks/reference/application/#plugin_comment_reply)