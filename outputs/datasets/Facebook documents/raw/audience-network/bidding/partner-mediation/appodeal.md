---
url: https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal
title: Appodeal - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fbidding%2Fpartner-mediation%2Fappodeal%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Appodeal Stack (Open Beta)](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#appodeal-stack--open-beta-)

[Before You Start](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#before-you-start)

[New to Audience Network?](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#new-to-audience-network-)

[Setting up Appodeal Mediation](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#setting-up-appodeal-mediation)

[Best Practices](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#best-practices)

# Appodeal Stack (Open Beta)

This topic explains how to set up Appodeal as a bidding mediation partner for Audience Network.

## Before You Start

- **Required Facebook SDK Version:** 6.2.1 or later ( [Android](https://developers.facebook.com/docs/audience-network/guides/adding-sdk/android) \| [iOS](https://developers.facebook.com/docs/audience-network/guides/adding-sdk/ios))
- **Appodeal SDK Requirements:** Appodeal SDK version requirements: Android - 2.10.3 or later, iOS - 2.10.3 or later, Unity - 2.14.5 or later ( [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fwiki.appodeal.com%2Fen%2Fandroid%2Fget-started&h=AUC9ShXRNo50SFzYScQEJE0rnciNfqvrOCu414AQpkrRh6pMwJNYC51FxwGIA1aI7hxCWeFSiHz2WTBE6F5f3AlAacbYupU1ixnLuWkxBtdyqfCAZ9Aw0d6jcTfKQmwdIy-u78XOHHl32g) \| [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fwiki.appodeal.com%2Fen%2Fios%2Fget-started&h=AUCSfQaH_rJOc15NA_M4_7HlV08U6-ULFb6SEACvG4Dlc0nQ-O2nQHlga9SWJktYKhBLb_RhmKZDjmeS-noU4skdetYdfaay3OsXZH7jLpu6DKQlBiQHjm349P4Lphs3EdY0rY_D0jd53A) \| [Unity](https://l.facebook.com/l.php?u=https%3A%2F%2Fwiki.appodeal.com%2Fen%2Funity%2Fget-started&h=AUCzjPFZdXL5RK0UlfOK3sGy_wGrxT8cU5Xc6hTrcxinmL8V7Ln22Or-VjCcO7tMBW4o3vJKaq90f38XtLOMFR0Uib0toYk3mxZk8zqHYptQTEbIp7WE_q_zQAQqnsk9RV4EW7p-ib3Fyw)).
- **Supported Formats:** Banner, Interstitial, Medium rectangle, Native, Native banner, Rewarded video.

## New to Audience Network?

If you haven’t done so already, set up [Audience Network](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup) in Monetisation Manager.

## Setting up Appodeal Mediation

1. Integrate Meta Audience Network into your App via Appodeal SDK. To do this, select Meta Audience Network in Mediation Wizard.
2. Refer to the [Guide](https://l.facebook.com/l.php?u=https%3A%2F%2Ffaq.appodeal.com%2Fen%2Farticles%2F5778714-how-can-i-switch-meta-audience-network-to-bidding-mode&h=AUBJw71VZDIw1iZmpDfrVvx20IENlbwPvHreK9a_lV2Va0wXvCeu8RHY8chEFgp4wIVhZdN3UfF4PyCd3jFUk35gWfZKXsYnXvPk7sZFGQsF3DWRciFXhOHNR2qsVgumrdNiYXwDf5CoJvUsLuqsv8zeknU) to learn how to link Meta Audience Network with Appodeal.

## Best Practices

Please follow this steps to check your Meta Audience Network Integration to be sure that it's ready to bid in your app:

- Make sure that the keys you provide to Appodeal match the Meta Audience Network keys for the selected app.
- Make sure that Meta Audience Network and BidMachine adapters are included in your app build.
- After connecting Meta Audience Network to Appodeal, you need to [test](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform) the ad performance.
- Make an ad request from your app on a device with Meta Facebook mobile application installed.
- Go to your [Meta Monetisation Manager](https://business.facebook.com/pub/home/) and check if you can see your bidding ad unit requests. It can take a few hours to start seeing the requests in your Meta dashboard.
- After that, if the placement is new, its status should change to [receiving ads](https://www.facebook.com/business/help/190480988843577?id=211412110064838).
- Reach out to our support@appodeal.com in case you have issues with any of these steps.

On This Page

[Appodeal Stack (Open Beta)](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#appodeal-stack--open-beta-)

[Before You Start](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#before-you-start)

[New to Audience Network?](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#new-to-audience-network-)

[Setting up Appodeal Mediation](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#setting-up-appodeal-mediation)

[Best Practices](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/appodeal#best-practices)

Allow the use of cookies by Facebook on this browser?

We use cookies and similar technologies to help provide and improve content on [Meta Products](https://www.facebook.com/help/1561485474074139). We also use them to provide a safer experience by using information we receive from cookies on and off Facebook, and to provide and improve Meta Products for people who have an account.

- Essential cookies: These cookies are required to use Meta Products and are necessary for our sites to work as intended.
- Cookies from other companies: We use these cookies to show you ads off of Meta Products and to provide features like maps and videos on Meta Products. These cookies are optional.

You have control over the optional cookies we use. Learn more about cookies and how we use them, and review or change your choices at any time in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

* * *

## About cookies

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_1.png)

What are cookies?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_2.png)

Why do we use cookies?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_3.png)

What are Meta Products?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_4.png)

Your cookie choices

Learn more

* * *

## Cookies from other companies

We use cookies from [other companies](https://www.facebook.com/privacy/policies/cookies/?annotations[0]=explanation%2F3_companies_list) in order to show you ads off of our Products, and provide features like maps, payment services and video.

How we use these cookies

We use cookies from other companies on our Products:

- To show you ads about our Products and features on other companies’ apps and websites.
- To provide features on our Products such as maps, payment services and video.
- For analytics.

If you allow these cookies

- Features you use on Meta Products will not be affected.
- We'll be able to better personalize ads for you off of Meta Products, and measure their performance.
- Other companies will receive information about you by using their cookies.

If you don't allow these cookies

- Some features on our products may not work.
- We won't use cookies from other companies to personalize ads for you off of Meta products, or measure their performance.

## Other ways you can control your information

Manage your ad experience in Accounts Center

You can manage your ad experience by visiting the following settings.

Ad preferences

In your ad preferences you can choose whether we show you ads and make choices about the information used to show you ads.

Ad settings

If we show you ads, we use data that advertisers and other partners provide us about your activity off Meta Company Products, including websites and apps, to show you better ads. You can control whether we use this data to show you ads in your [ad settings](https://www.facebook.com/settings/ads/).

More information about online advertising

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUAeprrRF_CgKZWTTlAJo-dyPTFgzvzzivhgE6I1xTjvTnl9XBsXpvNt6C_AjFR_x3xu06oZTQITiihjyKq9yoJ9em4Pj-Xj0VTor2cQu7XrREr69Lan8n6r4vusiel6bykfu0xZk2W8tw) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUAAKdr-8AHMcCwmVUcWWz2tG81yhfhhliUtCszBe4NeB3jRP4isqMpETDcxkD-uMDmm8AXdylcvSGopSV6STbfooG8_dT2TWi63O-TVNkfkKcTu2FL1YxN9fDC_hrqRfFtNiWlooHyQjg) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUDd12uEvzL1Rh5Vj2TBUM0TPohoj4dhab_9GwXqPYrm9KFW8gX3-0x_Fk2onR5f2YuLMccQnWyWgPu5yy_-HRlG1xx8U4PmVTHp7JAVDBVZIFnVwx4gM6YROqjdvrRZFZagrBWW2RSUwg) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUBq4txBEpXC3tdo9Qgtr4ldKZKw2a-IVczbNS0KVjT7iYqmfFItGY3aKUnetLfVNgpdpJRhOexjMLe7O8_On0WXkTVq8J_lXynRRpF6Iprt9uztsxZgcyluJEtRA5w_UBM7fxR-1wXc4w)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUBvHji3T2quEZx9d2_9nHjXX0LwqqqVrgBBHGcvkC3JGW5h6nznrsIP1Rf1_d_d6EbaoUPPmRDnvpvZHiWDKPL4rr1Lbzpn3kXYgzKCTYSA-VqYIFEKeTxq9WlTFgh1iYv68BOQ-wm-UQ)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUAiOID_bOaA0-JYRBHPszFbY1G2s6uyld-sffaBNoDGgvj-kSEdYLCBOmWACpuqTkgjlSmJaTvSHQR4tKgb7nUz00mNjqcrR8nV2-LYbt0Hvoeeag-lpCGs83lp7ukV49F-gJfDcI_eOA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUAO-P4Wwdcz6E3QbP38Vm5teJgtE-5QOH-S4HVJBT8kS32M4aA305d1IQFOvQhF0NmayUMyuS5zi_j6Tg9WkuzEVrUrftm_vZ6HvfdVcf0wV4mmxNvNdWu8SWqJU1ntWgPyiLLjY8v9YA)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUAVkEnQP0RIVxGDD22FHqXkJYs24AeoBi4CLYXRMSqNYHe4yXCS3Udh5_n73Hwv7yWqzmDNAfTip1Bp0iEPOiJ7ArLbuWpF7UXhaunpRJKFIOT_WGn9WrRj6ilBDagAeuzPbmc_KoMuaA)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUD9on--JO-Ppjfm8tKbmz30FNFdMVzayI-PlOBBQ5HRsf7109slMBRKzjG7iGhhmzPLPxK6xhafv3JvhO_eQRxEd3MsVhk39r00LwWAIao6CfPPQVffFCgbpmyZWirBdFVZxMLJcPVi_Q)

Decline optional cookiesAllow all cookies

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_1.png)

## What are cookies?

Cookies are small pieces of text that are used to store and receive identifiers on a web browser. We use cookies and similar technologies to offer Meta Products and understand information we receive about users, like their activity on other websites and apps.

If you don't have an account, we don't use cookies to personalize ads for you, and activity we receive will be used only for the security and integrity of our Products.

Learn more about cookies and the similar technologies we use in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_2.png)

## Why do we use cookies?

Cookies help us provide, protect and improve the Meta Products, such as by personalizing content, tailoring and measuring ads, and providing a safer experience.

While the cookies that we use may change from time to time as we improve and update the Meta Products, we use them for the following purposes:

- Authentication to keep users logged in
- To ensure security, site and product integrity
- To provide advertising, recommendations, insights and measurement, if we show you ads
- To provide site features and services
- To understand our Products' performance
- To enable analytics and research
- On third-party websites and apps to help companies that incorporate Meta technologies to share information with us about activity on their apps and websites.

Learn more about cookies and how we use them in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_3.png)

## What are Meta Products?

Meta Products include the Facebook, Instagram and Messenger apps, and any other features, apps, technologies, software or services offered by Meta under our Privacy Policy.

You can learn more about [Meta Products in our Privacy Policy](https://www.facebook.com/privacy/policy/?annotations[0]=0.ex.0-WhatProductsDoesThis&entry_point=cookie_consent_modal_what_are_meta_products).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_4.png)

## Your cookie choices

You have control over optional cookies we use:

- Our cookies on other apps and websites owned by companies that use Meta technologies, such as the Like button and Meta Pixel, can be used to personalize your ads, if we show you ads.
- We use cookies from other companies to show you ads off of Meta Products, and to provide features like maps and video on Meta Products.

You can review or change your choices at any time in your Cookies settings.