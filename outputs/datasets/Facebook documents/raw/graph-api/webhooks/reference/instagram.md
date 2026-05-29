---
url: https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/
title: Webhooks Reference: Instagram
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Freference%2Finstagram%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Instagram (instagram)](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#instagram--instagram--)

[comments](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#comments)

[messaging\_handover](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messaging_handover)

[live\_comments](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#live_comments)

[message\_edit](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#message_edit)

[message\_reactions](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#message_reactions)

[messages](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messages)

[mentions](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#mentions)

[messaging\_referral](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messaging_referral)

[messaging\_seen](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messaging_seen)

[messaging\_postbacks](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messaging_postbacks)

[standby](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#standby)

[story\_insights](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#story_insights)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#)

# Instagram (`instagram`)

Category of updates relating to activity on Instagram user

## `comments`

FBInstagramCommentsField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `from`<br>IGCommentFromUser | Instagram-scoped ID and username of the Instagram user who created the comment |
| `id`<br>numeric string | id |
| `username`<br>string | username |
| `self_ig_scoped_id`<br>numeric string | self ig scoped id |
| `media`<br>IGCommentMedia | ID and product type of the IG Media the comment was created on |
| `id`<br>numeric string | ID of the IG Media the comment was created on |
| `media_product_type`<br>string | Product type of the IG Media the comment was created on |
| `ad_id`<br>numeric string | ID of the IG Ad the comment was created on |
| `ad_title`<br>string | Title of the IG Ad the comment was created on |
| `original_media_id`<br>numeric string | original\_media\_id |
| `id`<br>numeric string | The id of the object |
| `parent_id`<br>numeric string | ID of parent IG Comment if this comment was created on another IG Comment (i.g. a reply to another comment) |
| `text`<br>string | Comment text |

## `messaging_handover`

FBInstagramHOPField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `sender`<br>IDName | sender |
| `id`<br>id | ID |
| `recipient`<br>IDName | recipient |
| `id`<br>id | ID |
| `timestamp`<br>unsigned integer | timestamp |
| `pass_thread_control`<br>object | pass\_thread\_control |
| `previous_owner_app_id`<br>numeric string | previous\_owner\_app\_id |
| `new_owner_app_id`<br>numeric string | new\_owner\_app\_id |
| `metadata`<br>string | metadata |
| `take_thread_control`<br>object | take\_thread\_control |
| `previous_owner_app_id`<br>numeric string | previous\_owner\_app\_id |
| `new_owner_app_id`<br>numeric string | new\_owner\_app\_id |
| `metadata`<br>string | metadata |
| `request_thread_control`<br>object | request\_thread\_control |
| `requested_owner_app_id`<br>numeric string | requested\_owner\_app\_id |
| `metadata`<br>string | metadata |
| `app_roles`<br>map | app\_roles |

## `live_comments`

FBInstagramLiveCommentsField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `from`<br>IGCommentFromUser | Instagram-scoped ID and username of the Instagram user who created the comment |
| `id`<br>numeric string | id |
| `username`<br>string | username |
| `self_ig_scoped_id`<br>numeric string | self ig scoped id |
| `media`<br>IGCommentMedia | ID and product type of the IG Media the comment was created on |
| `id`<br>numeric string | ID of the IG Media the comment was created on |
| `media_product_type`<br>string | Product type of the IG Media the comment was created on |
| `ad_id`<br>numeric string | ID of the IG Ad the comment was created on |
| `ad_title`<br>string | Title of the IG Ad the comment was created on |
| `original_media_id`<br>numeric string | original\_media\_id |
| `id`<br>numeric string | The id of the object |
| `parent_id`<br>numeric string | ID of parent IG Comment if this comment was created on another IG Comment (i.g. a reply to another comment) |
| `text`<br>string | Comment text |

## `message_edit`

FBInstagramMessageEditField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |

## `message_reactions`

FBInstagramMessageReactionsField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `sender`<br>IDName | sender |
| `id`<br>id | ID |
| `recipient`<br>IDName | recipient |
| `id`<br>id | ID |
| `timestamp`<br>unsigned integer | timestamp |
| `reaction`<br>object | reaction |
| `mid`<br>string | mid |
| `action`<br>enum | action |
| `reaction`<br>enum | reaction |
| `emoji`<br>string | emoji |
| `folder`<br>string | folder |

## `messages`

FBInstagramMessagesField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `sender`<br>IDName | sender |
| `id`<br>id | ID |
| `recipient`<br>IDName | recipient |
| `id`<br>id | ID |
| `timestamp`<br>unsigned integer | timestamp |
| `message`<br>object | message |
| `attachments`<br>list<FBInstagramMessageAttachmentData> | attachments |
| `type`<br>string | type |
| `payload`<br>object | payload |
| `ig_post_media_id`<br>numeric string | ig post media id |
| `url`<br>string | for url field in message attachment |
| `generic`<br>map | for generic template data field in message attachment |
| `reply_to`<br>object | reply\_to |
| `story`<br>object | story |
| `url`<br>string | url |
| `id`<br>string | id |
| `link_sticker_url`<br>string | link sticker url |
| `is_self_reply`<br>bool | is self reply |
| `is_self`<br>bool | is self |
| `is_deleted`<br>bool | is\_deleted |
| `folder`<br>string | folder |

## `mentions`

Notifies you when an Instagram User @mentions you in a comment or caption on a media object.

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | Contents of the update |
| `media_id`<br>string | ID of media containing comment with mention. |
| `comment_id`<br>string | ID of comment with mention. |

## `messaging_referral`

InstagramMessagingReferralField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | the referral information along with sender and business ids, and timestamp |
| `sender`<br>MessengerParticipantID | sender |
| `id`<br>numeric string | id |
| `recipient`<br>MessengerParticipantID | recipient |
| `id`<br>numeric string | id |
| `timestamp`<br>unsigned integer | timestamp |
| `referral`<br>object | referral |

## `messaging_seen`

InstagramMessagingSeenField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | Contents of the seen state update |
| `sender`<br>IDName | sender |
| `id`<br>id | ID |
| `recipient`<br>IDName | recipient |
| `id`<br>id | ID |
| `timestamp`<br>unsigned integer | timestamp |
| `read`<br>object | read |

## `messaging_postbacks`

InstagramPostbackField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | value |
| `sender`<br>IDName | sender of the postback |
| `id`<br>id | ID |
| `recipient`<br>IDName | recipient |
| `id`<br>id | ID |
| `is_self`<br>bool | is self |
| `timestamp`<br>unsigned integer | timestamp when it was sent |
| `postback`<br>object | postback payload |
| `title`<br>string | title of postback |
| `payload`<br>string | payload of postback |
| `referral`<br>object | referral details |
| `mid`<br>string | mid |

## `standby`

InstagramStandbyField

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>string | value |

## `story_insights`

Notifies you when a story expires. Metrics with counts of less than 5 will be returned as `-1`.

| Field | Description |
| --- | --- |
| `field`<br>string | Name of the updated field |
| `value`<br>object | The result values |
| `media_id`<br>numeric string | Media Id of the Story |
| `impressions`<br>integer | Impressions |
| `reach`<br>integer | Reach |
| `taps_forward`<br>integer | Taps forward |
| `taps_back`<br>integer | Taps back |
| `exits`<br>integer | Exits |
| `replies`<br>integer | Replies |

On This Page

[Instagram (instagram)](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#instagram--instagram--)

[comments](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#comments)

[messaging\_handover](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messaging_handover)

[live\_comments](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#live_comments)

[message\_edit](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#message_edit)

[message\_reactions](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#message_reactions)

[messages](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messages)

[mentions](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#mentions)

[messaging\_referral](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messaging_referral)

[messaging\_seen](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messaging_seen)

[messaging\_postbacks](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#messaging_postbacks)

[standby](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#standby)

[story\_insights](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/#story_insights)