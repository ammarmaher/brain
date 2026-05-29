---
url: https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management
title: Instagram Management
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-sdk%2Fcommon-scenarios%2Finstagram-management%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Management](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management)

On This Page

[Instagram Management](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#instagram-management)

[Get your Instagram Professional Account ID](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#get-your-instagram-professional-account-id)

[Sample Code](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#sample-code)

[Comment on an Instagram Professional Account Posts](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#comments)

[Sample Code](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#sample-code-2)

[Learn More](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#learn-more)

# Instagram Management

Manage comments on Instagram using the Meta Business SDK.

### Requirements

- An [Instagram Professional Account ID](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F502981923235522%3Ffbclid%3DIwAR0uB5YLGSb3VqUgVyJLHOaF0tK6BVBWUaAyUND8NZVGEs02s72Kp68atWs&h=AUComIbTCjP12dzBpnHdknIV3mLRIujZsXuDYQYhuGi5EoSen3kqCjzKjwq0XWy72x0dNNZyWi2n26Agt738GMp4nxLv0es-_Ohl43eGdtdsMjMbht2mRWj14zh36kQHicnQNr7TzBOlqQ)
- Your Facebook Page ID of the [Page linked to an Instagram Professional Account](https://developers.facebook.com/docs/instagram-api/getting-started#connect)
- Your Meta App ID
- A Page access token of the Page linked to your Instagram Professional Account

### Endpoints

- The [/comment](https://developers.facebook.com/docs/instagram-api/reference/ig-comment) node — delete and hide/unhide comments

- The [/commment/replies](https://developers.facebook.com/docs/instagram-api/reference/ig-comment/replies) edge — send and receive comments

- The [/media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) node — disable/enable comments on a media object


Refer to each endpoint's reference documentation for parameter and permission requirements.

## Get your Instagram Professional Account ID

Before you can publish to Instagram, you need to get your Instagram Professional Account ID.

### Sample Code

## Comment on an Instagram Professional Account Posts

You can get comments on your media objects, analyze these comments, filter against specific criteria, then reply to any comments that match your criteria.

**Step 1.** Use the [`/media/comments` edge](https://developers.facebook.com/docs/instagram-api/reference/ig-media/comments#comments) to get all comments and their IDs.

**Step 2.** Select the comment to which you want to reply and use the comment ID to [reply in the comment thread](https://developers.facebook.com/docs/instagram-api/reference/ig-comment/replies#replying) to the User.

### Sample Code

### Learn More

- [Batch replies into a single request](https://developers.facebook.com/docs/business-sdk/common-scenarios/docs/graph-api/making-multiple-requests/) when you have multiple comments to which you want to reply.


On This Page

[Instagram Management](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#instagram-management)

[Get your Instagram Professional Account ID](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#get-your-instagram-professional-account-id)

[Sample Code](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#sample-code)

[Comment on an Instagram Professional Account Posts](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#comments)

[Sample Code](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#sample-code-2)

[Learn More](https://developers.facebook.com/docs/business-sdk/common-scenarios/instagram-management#learn-more)