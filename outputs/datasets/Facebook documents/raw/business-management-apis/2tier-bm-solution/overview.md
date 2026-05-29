---
url: https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview
title: Overview - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2F2tier-bm-solution%2Foverview%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)


  - [Overview](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview)
  - [Prerequisites](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/prerequisites)
  - [Pre-app Review Development](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development)
  - [Get Started](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/get-started)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/guides)
  - [Supported Operations](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/supported-operations)
  - [Support](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support)

On This Page

[Overview](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#overview)

[Use Cases](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#use-cases)

[When Not To Use](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#when-not-to-use)

[How it Works](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#how-it-works)

[See Also](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#see-also)

# Overview

This guide give an overview of the 2-tier Business Manager solution, its components, and how it works.

## Use Cases

The 2-Tier Business Manager solution is an API-based solution to create and manage campaigns for their clients. These are some scenarios where 2-Tier may be a good solution:

- You manage ad campaigns for a large number of SMBs.
- You pay for the ad campaigns and bill the client.
- Your clients use your platform for campaign management as opposed to the native Meta interfaces.
- You are a commerce platform who helps small merchants sell Facebook ads.
- You are a website builder who wants to add ads buying capabilities to your portfolio.
- You are a national brand managing your local brand’s ad activity.

### When Not To Use

- If you don’t want the liability of paying for all ad activity, then consider using the [Business On Behalf Of](https://developers.facebook.com/docs/marketing-api/business-manager-api/business-onboarding/obo) API.
- If you don’t want to pay for the clients’ ad activity, but only manage their assets, then consider using the [Business On Behalf Of](https://developers.facebook.com/docs/marketing-api/business-manager-api/business-onboarding/obo) API.
- If you only want to manage a few set of clients, consider using [agency access](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/business-to-business/) instead. This allows the access to assets, such as ad accounts, pixels, product catalogs, and so on, without having to build on top of the 2-tier Business Manager solution.


  - Note that access to these APIs is limited. Contact your Meta representative to request access.
  - You can [ask a client to share assets with your business](https://www.facebook.com/business/help/408759743051505), or a client can [grant you access to their assets](https://www.facebook.com/business/help/1717412048538897).

## How it Works

The 2-Tier Business Manager solution provides the ability to own the full workflow of creating, managing, and deleting Business Managers via a single Parent Business Manager. (Newly created Business Managers are referred to as _Child Business Managers_).

To use this solution, your Business Manager (referred to as _Parent Business Manager_) creates a Child Business Manager on behalf of your client using a user access token and Facebook page. By default, the client does not have access to the Child Business Manager, but you have complete access to the Child Business Manager, and can choose to give permission to the client based on their use case.

In this framework, the Parent Business Manager pays for the Child Business Managers’ ad activity and bills their clients separately. This is meant to allow full control over ad activity and reduce friction of asking clients to approve of every modification. This means you must pay for the ads and then choose one of these options:

- Bill clients _before_ serving ads
- Bill clients _after_ serving ads

The purpose of using this framework is to manage the newly created/managed child Business Managers in a scalable, maintainable way.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2438006549850667&version=1742843253)

## See Also

- [Business Manager System User](https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser)
- [About Your Business Settings in Business Manager, Ads Help Center](https://www.facebook.com/business/help/530540643805698?id=180505742745347)
- [Business On Behalf Of](https://developers.facebook.com/docs/marketing-api/business-manager-api/business-onboarding/obo)
- [Business Asset Management](https://developers.facebook.com/docs/marketing-api/businessmanager/assets)
- [Best Practices, Business Manager](https://developers.facebook.com/docs/marketing-api/businessmanager/bestpractice)
- [About Monthly Invoicing, Ads Help Center](https://www.facebook.com/business/help/2086865811541431?id=2356205651275420)
- [Manage your payment methods for Facebook ads, Ads Help Center](https://www.facebook.com/business/help/132073386867900?id=160022731342707)
- [Payment Settings in Ads Manager, Ads Help Center](https://www.facebook.com/ads/manager/account_settings/account_billing/)
- [Create a Facebook Marketing App](https://developers.facebook.com/docs/apps/)
- [App Development](https://developers.facebook.com/docs/apps#app-development)
- [App dashboard](https://developers.facebook.com/apps/)

On This Page

[Overview](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#overview)

[Use Cases](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#use-cases)

[When Not To Use](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#when-not-to-use)

[How it Works](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#how-it-works)

[See Also](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview#see-also)