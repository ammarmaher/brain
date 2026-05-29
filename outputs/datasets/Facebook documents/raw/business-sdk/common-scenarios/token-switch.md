---
url: https://developers.facebook.com/docs/business-sdk/common-scenarios/token-switch
title: Switching Access Tokens - Meta Business SDK
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-sdk%2Fcommon-scenarios%2Ftoken-switch%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Business SDK](https://developers.facebook.com/docs/business-sdk)

- [Overview](https://developers.facebook.com/docs/business-sdk/overview)
- [Get Started](https://developers.facebook.com/docs/business-sdk/getting-started)
- [Ads Buying](https://developers.facebook.com/docs/business-sdk/common-scenarios/ads-buying)
- [Disable Crash Reports](https://developers.facebook.com/docs/business-sdk/guides/crash-reports)
- [Onboard Clients at Scale](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale)
- [Switching Access Tokens](https://developers.facebook.com/docs/business-sdk/common-scenarios/token-switch)
- [Using Other APIs](https://developers.facebook.com/docs/business-sdk/common-scenarios/add-apis)
- [Support](https://developers.facebook.com/docs/business-sdk/faq)
- [Reference](https://developers.facebook.com/docs/business-sdk/reference)

On This Page

[Get a Page Access Token](https://developers.facebook.com/docs/business-sdk/common-scenarios/token-switch#get-a-page-access-token)

# Get a Page Access Token

This document explains how to get a list of Page access tokens for Facebook Pages a person using your app manages.

## Requirements

- A valid User access token
- The person requesting the token must be able to [perform a task](https://developers.facebook.com/docs/pages/overview#tasks) on the Page
- At least one [Page permission](https://developers.facebook.com/docs/pages/overview#permissions) applicable to the request being made

The following code example, exchanges a User access token for a Page access token. Using the User access token, a list of all Pages the User manages is returned. This list includes Page access tokens for each Page. You can then use the Page access token to get information about the Page, such as `page_fan_adds` insights.

These Page access tokens are valid for 1 hour.

## Learn More

- [Access Token Guide](https://developers.facebook.com/docs/facebook-login/access-tokens/) – Learn more about access tokens.

- [Long-lived Access Tokens Guide](https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing) – Learn how to extend the expiry of your access tokens.


On This Page

[Get a Page Access Token](https://developers.facebook.com/docs/business-sdk/common-scenarios/token-switch#get-a-page-access-token)