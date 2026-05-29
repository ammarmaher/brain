---
url: https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale
title: Onboard Clients at Scale - Meta Business SDK
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-sdk%2Fcommon-scenarios%2Fonboard-at-scale%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Business SDK](https://developers.facebook.com/docs/business-sdk)

- [Overview](https://developers.facebook.com/docs/business-sdk/overview)
- [Get Started](https://developers.facebook.com/docs/business-sdk/getting-started)
- [Ads Buying](https://developers.facebook.com/docs/business-sdk/common-scenarios/ads-buying)
- [Disable Crash Reports](https://developers.facebook.com/docs/business-sdk/guides/crash-reports)
- [Onboard Clients at Scale](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale)


  - [Get Started](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale/getting-started)
  - [Guides](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale/common-scenarios)
  - [Support](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale/faq)

- [Switching Access Tokens](https://developers.facebook.com/docs/business-sdk/common-scenarios/token-switch)
- [Using Other APIs](https://developers.facebook.com/docs/business-sdk/common-scenarios/add-apis)
- [Support](https://developers.facebook.com/docs/business-sdk/faq)
- [Reference](https://developers.facebook.com/docs/business-sdk/reference)

On This Page

[Onboard Clients at Scale](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#onboard-clients-at-scale)

[Overview](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#overview)

[How it Works](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#how-it-works)

[About the Setup](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#about-the-setup)

[Why use this solution?](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#why-use-this-solution-)

[Learn More](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#learn-more)

# Onboard Clients at Scale

## Overview

Use this guide if you manage hundreds or thousands of small businesses and want to offer ads buying within your website or platform.

We have built a set of APIs that allow you to onboard your clients to Meta advertising with great ease. Using this solution, you can:

- Create ad accounts for your clients
- Manage their ad campaigns
- Pay for any ads created on their behalf directly to Meta

This solution allows our partners to build new ads buying experiences within their website or platform.

### How it Works

The solution allows you to manage ads and other assets programmatically via the API on behalf of your clients. You have access to the ads and assets you create and get to maintain a billing relationship with your client for any Meta Ads created on their behalf. This enables you to offer fully managed ads services or simplified self serve ads buying experiences thereby improving return and reducing churn. A typical user flow involves your clients going to your website or platform, selecting the ads product they are interested in, some customization to support their use case and finally establishing a billing payment with you.

When using the [2-tier Business Manager solution](https://developers.facebook.com/docs/marketing-api/business-manager-api/2tier-bm-solution/), you can create a child Business Manager on behalf of your client using their user access token and a Facebook Page owned by your client.

Your client **does not have access** to:

- The client Business manager, by default, but you have complete access to the child Business Manager, and can choose to give your clients read-only permission.
- The new child Business Manager and its ad account, unless you explicitly grant access.

### About the Setup

- This client Business Manager has a Admin system user attached to it with **advertiser access** to the page provided by your client during the Business Manager creation.

- Using the access token of the Admin system user for the client Business Manager, an ad account can be created for the client Business Manager and any other assets, such as pixel, custom audience, product catalog, and so on, can be associated with it.

- You can also share the line of credit (LOC) attached to your parent Business Manager with its client Business Manager, and assign a spend limit to it to prevent accidental over spend.


Below is a diagram that summarizes the model.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/31428455_2399241646768538_1725391738371047424_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=TSgP6vOV-QAQ7kNvwGbNUPX&_nc_oc=AdribJbo6bVGGBsxX3eOHac6NwovwraUb4kLDovvvbVuxUmeHa2n8OfqvI6MMqkrG5c&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=Hs6q7xIpTvZB0JBUPHLlCQ&_nc_ss=7b289&oh=00_Af4yFl4BSKpG-R4KloGOaFZNgNTdgabPaJJTfEY9N6GcBA&oe=6A257480)

- BM: Business Manager

- C: Client

- SAU: System Admin User


## Why use this solution?

- **Lowers the friction** for your client signing up for Meta advertising and improves your clients stickiness to your platform.

- **Allows more revenue models** for you and settles the balance with Meta after setting aside service fees. You can share your line of credit with the child Business Managers on behalf of your clients.

- **Scales well**. It doesn't require any manual intervention from Meta every time your Business Manager reaches the limit of maximum number of Ad Accounts.

- **Organizes all the assets for clients more cleanly**. Instead of you managing all the assets (Pages/Custom Audiences/pixels, and so on) within one Business Manager, it organizes all the assets for a client within their own Business Manager.

- **Provides you with actionable notifications** for critical errors when an ad Account has been blocked due to policy violation.

- Allows you to get **consolidated invoices** for all your ad accounts, which helps with bookkeeping.


## Learn More

[2-Tier Business Manager Solution](https://developers.facebook.com/docs/marketing-api/business-manager-api/2tier-bm-solution/)

On This Page

[Onboard Clients at Scale](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#onboard-clients-at-scale)

[Overview](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#overview)

[How it Works](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#how-it-works)

[About the Setup](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#about-the-setup)

[Why use this solution?](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#why-use-this-solution-)

[Learn More](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale#learn-more)