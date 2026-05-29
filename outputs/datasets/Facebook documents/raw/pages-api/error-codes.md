---
url: https://developers.facebook.com/docs/pages-api/error-codes
title: Error Codes - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2Ferror-codes%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook Pages API](https://developers.facebook.com/docs/pages-api)

- [Overview](https://developers.facebook.com/docs/pages-api/overview)
- [Create an app](https://developers.facebook.com/docs/pages-api/create-an-app)
- [Webhooks](https://developers.facebook.com/docs/pages-api/webhooks-for-pages)
- [Get Started](https://developers.facebook.com/docs/pages-api/getting-started)
- [Manage a Page](https://developers.facebook.com/docs/pages-api/manage-pages)
- [Upcoming Changes](https://developers.facebook.com/docs/pages/upcoming-changes)
- [Comments and @Mentions](https://developers.facebook.com/docs/pages-api/comments-mentions)
- [Posts](https://developers.facebook.com/docs/pages-api/posts)
- [Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook)
- [Insights](https://developers.facebook.com/docs/platforminsights/page)
- [Search Pages](https://developers.facebook.com/docs/pages-api/search-pages)
- [Error Codes](https://developers.facebook.com/docs/pages-api/error-codes)
- [Changelog](https://developers.facebook.com/docs/pages-api/changelog)

On This Page

[Facebook Pages API Error Codes](https://developers.facebook.com/docs/pages-api/error-codes#facebook-pages-api--error-codes)

# Facebook Pages API Error Codes

This guide displays common error codes, error messages, and descriptions related to the Facebook Pages API .

| Error Codes | Error Message | Description |
| --- | --- | --- |
| `1713216` | You can't create a video engagement Custom Audience with video {object\_id} because this video isn't associated with a Facebook Page. | This video must be associated with a Facebook Page to create a [video engagement Custom Audience](https://developers.facebook.com/docs/marketing-api/reference/custom-audience/). |
| `200` with subcode `2069030` | This endpoint is not supported. | The endpoint in your call is not supported. |
| `200` with subcode `2069031` | This field is not supported. | The field of the endpoint in your call is not supported. |
| `190` with subcode `2069032` | A Page access token is required for this call. | This endpoint must be called with a [Page access token](https://developers.facebook.com/docs/pages/npe-reference/npe-endpoints#access-tokens--features--permissions--and-tasks). |
| `200` with subcode `2069033` | The corresponding UI feature of this API is deprecated or not available. | The corresponding UI feature of this API is deprecated or not available. Please review the [Graph API Reference](https://developers.facebook.com/docs/graph-api/reference) or the [Overview](https://developers.facebook.com/docs/pages/npe-reference/npe-endpoints) for more information about this endpoint and its fields. |
| `2446158` | This ad objective is not supported. You can create it with a Page instead. | This [ad objective](https://developers.facebook.com/docs/marketing-api/campaign-structure#objectives) is not supported. |
| `1` with subcode `2853006` | Viewer doesn't have permission to perform this action. | You do not have permission to [perform this task](https://developers.facebook.com/docs/pages/overview/permissions-features#tasks). Contact an admin of the Page to request access. |
| `2874008` | Facebook Page insights are only available for Pages with at least 100 Page followers. | [Page insights](https://developers.facebook.com/docs/graph-api/reference/page/insights/) are only available for Pages that have at least 100 followers. |
| `2932001` | To access this info, the post needs to be set to public. | [Page insights](https://developers.facebook.com/docs/platforminsights/page) are only available for public posts. |
| `2932003` | You can only get insights on the original post of a shared post but only if you own the original post. You can only boost the original post of a shared post but only if you own the original post. | You can only get insights on the original post, as long as you are the owner, of a [shared post](https://developers.facebook.com/docs/graph-api/reference/page-post/sharedposts/). |
| `2932004` | To access this info, you need to be the creator of the post. | To get insights or boost a [shared Page post](https://developers.facebook.com/docs/graph-api/reference/page-post/sharedposts/), you must be the owner of the original post and must use the original post to get insights or boost the post. |
| `2932005` | {Name} tagged you in this post. To access this info, you need to be the creator of the post. | To get insights or boost a post in which your [Page was mentioned](https://developers.facebook.com/docs/pages/mentions), you must own the post. |
| `2932006` | This info isn't available for profile pictures. To get insights or boost a post, you can add this photo to a new post. | Insights or boosting a [profile picture](https://developers.facebook.com/docs/graph-api/reference/page/picture) change is not supported. Create a post with the new profile picture to boost and get insights. |
| `2932007` | This info isn't available for cover photos. To get insights or boost a post, you can add this photo to a new post. | Insights or boosting a [cover photo](https://developers.facebook.com/docs/graph-api/reference/cover-photo/) change is not supported. Create a post with the new cover photo to boost and get insights. |
| `2932009` | This info isn't available for live videos. | Insights or boosting a [live video](https://developers.facebook.com/docs/live-video-api/guides/streaming) is not supported. |
| `2932010` | This info isn't available right now. | Insights are not available for this post. |

On This Page

[Facebook Pages API Error Codes](https://developers.facebook.com/docs/pages-api/error-codes#facebook-pages-api--error-codes)