---
url: https://developers.facebook.com/docs/audience-network/bidding/partner-mediation
title: Bidding with Partner Mediation - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fbidding%2Fpartner-mediation%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)


  - [Bidding Overview](https://developers.facebook.com/docs/audience-network/bidding/overview)
  - [Bidding with Partner Mediation](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation)


    - [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup)
    - [Google Ad Manager](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager)
    - [AdMob](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob)
    - [Admost](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admost)
    - [Appodeal](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal)
    - [Chartboost](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/chartboost)
    - [CloudX](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/cloudx)
    - [Fyber](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/fyber)
    - [ironSource](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ironsource)
    - [MAX](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/max)
    - [TopOn](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/topon)
    - [TradPlus](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/tradplus)
    - [Unity](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/unity)
    - [Nimbus](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/nimbus)
    - [Bidding Checklist](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/bidding-checklist)

  - [In-House Mediation](https://developers.facebook.com/docs/audience-network/bidding/in-house-mediation)
  - [Metrics](https://developers.facebook.com/docs/audience-network/bidding/metrics)

- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)
- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Getting Started with Partner Mediation](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#getting-started-with-partner-mediation)

[New to Audience Network?](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#new-to-audience-network-)

[Ready to Start Bidding?](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#readytostart)

[Before you start](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#before-you-start)

[Set up your mediation partner](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#setuppartner)

[Next steps](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#next-steps)

# Getting Started with Partner Mediation

Follow this guide to generate ad revenue from Audience Network through your chosen mediation partner.

Meta Audience Network works with a number of approved partners who support bidding. Our mediation partners follow the principles of our [code of conduct](https://www.facebook.com/audiencenetwork/partner-program/CoC), which outlines best practices for enabling an open and fair ecosystem.

## New to Audience Network?

If you’re already monetizing with the Audience Network SDK, or moving from waterfall to bidding, go straight to [Ready to Start Bidding?](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#readytostart)

If you’re new to Audience Network, go to [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup), then return here to set up your mediation partner.

## Ready to Start Bidding?

You’ll need to set up with one of our mediation partners if:

- You’re new to Audience Network, and have completed [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup)
- You’re already monetizing with the Audience Network SDK
- You’re currently using a waterfall mediation partner

### Before you start

Make sure you have generated the following Audience Network identifiers: **system user access token**, **placement ID** and **property ID**. Go to [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup#sdk) to find out how.

[What are the system user access token, placement ID and property ID?](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#faq_306724437452119)

- **System User Access Token**: Used to make requests to Facebook APIs on behalf of an app.
- **Placement ID**: Unique Audience Network identifier of a specific ad placement in your app.
- **App ID**: The Placement ID is partly made up of the App ID. For example, in the Placement ID 1234567898765432\_9876543212345678, the numbers before the underscore are the App ID.
- **Property ID**: Unique Audience Network identifier of your app. You can use the same property ID on multiple platforms, for example Android and iOS.

[Permalink](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#faq_306724437452119)

### Set up your mediation partner

Follow the instructions for your chosen mediation partner. Each link opens a separate page, with onward links to the partner’s own documentation (sign up may be required) and best practices hints and tips.

We do not recommend that you integrate multiple mediations in one app, as changes to one mediation could affect delivery on the other.

|     |
| --- |
| #### [Admost](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/admost) |
| #### [Appodeal Stack](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal) |
| #### [Chartboost](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/chartboost) |
| #### [Fyber](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/fyber) |
| #### [Google Ad Manager](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager) |
| #### [Google AdMob](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/admob) |
| #### [Ironsource](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/ironsource) |
| #### [MAX](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/max) |
| #### [Nimbus](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/nimbus) |
| #### [TopOn](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/topon) |
| #### [TradPlus](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/tradplus) |
| #### [Unity](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/unity) |

## Next steps

Take a look at our [Bidding Checklist](https://developers.facebook.com/docs/audience-network/guides/partner-mediation/bidding-checklist) to make sure you're ready to start bidding.

On This Page

[Getting Started with Partner Mediation](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#getting-started-with-partner-mediation)

[New to Audience Network?](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#new-to-audience-network-)

[Ready to Start Bidding?](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#readytostart)

[Before you start](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#before-you-start)

[Set up your mediation partner](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#setuppartner)

[Next steps](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation#next-steps)