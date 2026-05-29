---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile
title: User Profile API - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fuser-profile%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging)

- [Overview](https://developers.facebook.com/docs/instagram-messaging/overview)
- [Get Started](https://developers.facebook.com/docs/instagram-messaging/get-started)
- [Instagram Messaging Webhooks](https://developers.facebook.com/docs/instagram-messaging/webhooks)
- [Generic Template](https://developers.facebook.com/docs/instagram-messaging/generic-template)
- [Button Template](https://developers.facebook.com/docs/instagram-messaging/button-template)
- [Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing)
- [Human Agent Escalation](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation)
- [Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers)
- [ig.me links](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links)
- [Send a Message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message)
- [Sender Actions](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions)
- [Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu)
- [Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies)
- [Product Template](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template)
- [Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies)
- [Story Mention](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention)
- [Attachment Upload API](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload)
- [User Profile API](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile)
- [Moderate Conversations API](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations)
- [Sample Experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience)
- [App Review](https://developers.facebook.com/docs/messenger-platform/instagram/app-review)

On This Page

[User Profile API](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#user-profile-api)

[User Consent](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#user-consent)

[Requirements](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#requirements)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#limitations)

[User Profile Fields](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#user-profile-fields)

[Sample Request](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#sample-request)

# User Profile API

The User Profile API allows you to use a Instagram Scoped ID (IGSID) to retrieve customer profile information. You can use this information to create a personalize experience for people interacting with your business.

## User Consent

**User consent is required to access user profile.** User consent is set only when a person sends a message to a business, or clicks icebreakers or persistent menu. If a person comments on a post or comment but has not sent a message to business, your app will receive an error, **User consent is required to access user profile.**

### Requirements

You will need:

- The `instagram_basic` permission
- The `instagram_manage_messages` permission
- The `pages_manage_metadata` permissions
- The `pages_read_engagement` permission
- The `pages_show_list` permission
- A Page access token requested by a person who can perform the `MODERATE` task on the Page

### Limitations

If a customer has blocked your business, you will not be able to view their information.

## User Profile Fields

The following profile fields are available for all Graph API versions.

| Field Name | Description |
| --- | --- |
| `name`<br>_string_ | The customers's name (can be null if name not set) |
| `profile_pic`<br>_url_ | The URL for the customer's profile picture (can be null if profile pic not set). The URL will expire in a few days. |
| `is_verified_user`<br>_boolean_ | Verification status for the customer |
| `follower_count`<br>_int_ | Follower count for the customer |
| `is_user_follow_business`<br>_boolean_ | Indicates whether the customer follows the business or not |
| `is_business_follow_user`<br>_boolean_ | Indicates whether the business follows the customer or not |
| `username`<br>_string_ | The username for the customer's Instagram account |

### Sample Request

To get a customer's profile information, send a `GET` request to the Instagram Scoped ID node for the customer and include the fields you would like to view.

_Formatted for readability._

```curl
curl -X GET "https://graph.facebook.com/v25.0/<INSTAGRAM_SCOPED_USER_ID>
  ?fields=name,username,profile_pic,follower_count,is_user_follow_business,is_business_follow_user
  &access_token=page-access-token"
```

On success, your app will receive the following JSON response:

```json
{
  "name": "Peter Chang",
  "username": "peter_chang_live",
  "profile_pic": "https://fbcdn-profile-...",
  "follower_count": 1234
  "is_user_follow_business": false,
  "is_business_follow_user": true,
}
```

### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUDOmxUfpDJYZ4dCcZJMsoS4yGVL5D4DEB7NoexLwAsYjtS-mwIcyeixLeTuBB_kbKbEbWqjhQzk2mHqFFPMy5_27tInNo1uer3zax4NeYLRGW9ks5KKTNxMqdEgSyTC2pafrH2fuacmeQ) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[User Profile API](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#user-profile-api)

[User Consent](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#user-consent)

[Requirements](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#requirements)

[Limitations](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#limitations)

[User Profile Fields](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#user-profile-fields)

[Sample Request](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile#sample-request)