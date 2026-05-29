---
url: https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager
title: Google Ad Manager - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fbidding%2Fpartner-mediation%2Fad-manager%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Google Ad Manager](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#google-ad-manager)

[Before You Start](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#before-you-start)

[How to Set Up Bidding](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#how-to-set-up-bidding)

[Update your app code](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#update-your-app-code)

[Initialize SDK](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#initialize-sdk)

[Placement setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#placement-setup)

[Inspect your Ad Units](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#inspect-your-ad-units)

[Best practices](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#best-practices)

[Testing](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#testing)

[Google / Meta format mapping](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#google---meta-format-mapping)

[Troubleshooting](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#troubleshooting)

# Google Ad Manager

Set up the Google Ad Manager bidding mediation partner for Audience Network.

## Before You Start

- **Audience Network SDK requirements:** 6.2.1 or later ( [Android](https://developers.facebook.com/docs/audience-network/guides/adding-sdk/android) \| [iOS](https://developers.facebook.com/docs/audience-network/guides/adding-sdk/ios))
- **Google SDK requirements:** Download the Google Mobile Ads SDK for any apps that use Open Bidding ( [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fandroid%2Fquick-start&h=AUAHp3Ieg3tRcZFa5ovLI_8eRTkwOp6h1biS93cHNlSrvAoCTQzS1E3F38chfTS_th0hJ3KGr0dA4sVdnL95fsMUKSoXZDQTJrakfk5jlW6OrkDSL1M4Rh0D7HIKKRyR4ESY185SQtrdwA) \| [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fios%2Fquick-start&h=AUCVv4BaLU1oyNfCcqRm_GA7GhfAqWL3T6detFd7l-sRaCakDqV8HjBaAo6ru-C6PwyXJQV2unHoh5g1lqTr-fIQEzsDph1Iq66wb5tnHk1pFX2394nJfjFlBYT8qK0RUtvL2eCTo99PiQ)).
- **Open Bidding setup:** Update the AdsManager SDK, Audience Network SDK, and Adapter to the latest version. Then follow the instructions for [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fandroid%2Fmediation%2Fmeta&h=AUAoeoP421pBa6_uXxLej3c4IquVgUMNHWrE6K7E9lVeE7MupLKeiflI3Ya3vdBkIkolp8W1ACdNEGUtLRYyzA7Blhq3mE4XZ2cyMmv7ijEZsP_UvBTKDWFlwdqNNyNdpovPrKq3_m41iw) or [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fios%2Fmediation%2Fmeta&h=AUAc-LQnfSJ7lv0EokE5CS7e1ioWztA8_Zv620-ZatW8nK_-dSDxZfJqibQegCr-_eBUSUXzNonJcAwwyo4G6bwfXv3s3Q6RMp5Q63rtX-pH88dXpfRU2UY4lZk3jazto_bO6MYLhQ_xWw) to set up Open Bidding. Check compatibility for the Google Mobile Ads SDK, Audience Network SDK, and Adapter in the changelog ( [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fandroid%2Fmediation%2Fmeta%23meta-audience-network-android-mediation-adapter-changelog&h=AUD7_KBxBcqg36InUkqjpot7328RGp_L-HJqTyqm41w7qyWFog33H4dFprNmgDGVlWpnbAX5bFCrpn0FQKcw3_WqlHUb-0-g_Hee9-Qsk6XcyzPwvzk2k4INkISfkRn39LFn8ZS7pCO81A) \| [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fios%2Fmediation%2Fmeta%23meta-audience-network-ios-mediation-adapter-changelog&h=AUDOcb38ZT6kX5ex2UsyuehF5U3D1n9xyFa5jeScteqvfHvfG_-Hp8XcozT3LwBd0Vr429062hCCDSjk56kb2PZubSVNDUGEivRabWGEXzjkrR_v1Z_KfCC-BvJZMcihKwBf03unDdA2Vw)).
- **Supported formats:** Banner, Interstitial, Medium Rectangle, Native, Native Banner, Rewarded Video.

## How to Set Up Bidding

### Update your app code

- **iOS**: [Update your Info.plist file](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fios%2Fearly-access%2Fopen-bidding%23update_your_infoplist&h=AUD59n6wE6jSREHyve4ilV4Dgr7rSCspBz79Z-YiUsVW3stEyH45ocWALccWiSYSyzRLGzh7OzZzxPVRIsh-reOc_OXAvaTIJw1LnIuOj0NQ4lz0K_kw1tc3eD_fYmTEizFn10jUXS49Bg). Add the `GADIsAdManagerApp` key and the `GADApplicationIdentifier` key.
- **Android:** [Update your AndroidManifest.xml](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fandroid%2Fearly-access%2Fopen-bidding%23update_your_androidmanifestxml&h=AUAYkmKxmpeZ_NBfAOwoFsoWPC4Y3yZDwXzf8KXJ_iowKq-u4nc4qdsRg-EQvEmTFie92-otYIDadR-bAf-EKd-7lv6_CVOqc2g6IWq8cW0pEB5kxdgsPqTXSsYDfSRoDsRmN84Lw76gHA). Add the `rtb` enabled flag in your AndroidManifest.xml file.

### Initialize SDK

1. Initialize the Google Mobile SDK and adapters by following the instructions for [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fios%2Fearly-access%2Fopen-bidding%23initialize_the_mobile_ads_sdk&h=AUB1zyOfaZ7XYA5FUCmz4rPAF5gM2kenCTHtVii5uPpiTVG9SDlUnOk5DcOkHPDCxeWbU043TjgyEQaEEBlqRmTnpk-k6DM7Xvoroygf_xqRoGXpI4XnmWhZkQOGqer8KmKqUbVYV7jALQ) or [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fandroid%2Fearly-access%2Fopen-bidding%23initialize_the_mobile_ads_sdk&h=AUDn7aoLJbp6Iju-GCJimHUiNXgbG0amalJP9MyScNYazjP7TdVYqgJP9KIvC5sfMleSsMInnQZJ6dmKD-gpBHlB_ysn63zZyLdN7bzTUpkGOEL1yxuIL4UFmQF2ChHPE0WO3xEYDuv_iA).
2. Wait for successful completion of adapters. Use callbacks and listener functions to confirm.
3. Make ad requests and load ads.

> **Important:** Wait until the completion handler is called before loading ads to ensure that all mediation adapters are initialized. For more information, see the [Google Ad Manager quick start guide](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fandroid%2Fquick-start%23example_mainactivity_excerpt&h=AUBPH4ywdtJ8FPs1vpuPhETWAdqvoy4bT5jvSVCNRTEkak9za5lqb-kRbZuQze5NfE9hvGUqVCrF31Xw9W3hzH0YQRNFF1uUoHspeo2WGSWmgYW1QnEDod_d4JdN-gKyn_R2_RTdG2qvug).

### Placement setup

Rather than creating a new `placement_id` for bidding, use an existing `placement_id` that generates the most revenue and convert it to bidding. This provides statistically reliable results and helps with accurate performance comparisons.

### Inspect your Ad Units

Use [Ad Inspector](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fadmanager%2Fanswer%2F7180401%3Fhl%3Den%23ad-inspector&h=AUDfH4xqBqc3zQWjEw3igf1midMycqm6G7gPd0v6jpM_8zgmviSpaFWPxjsnzRkctlH6xB2n9tHyv9jQbVDrXHxoLi9Kdpnm-6k0C7ZthbxGidtT_fiIwktq1f8YP-DEkmH27DVmj64CtA) to get serving insights and test third-party yield partners in real time. Ad Inspector displays as an overlay in your app.

Ad Inspector is only available with Google Mobile Ads SDK (8.10.0 or later) for iOS.

## Best practices

- **Create yield groups for each app separately:** You can combine iOS and Android in the yield group for the same app. Don't combine multiple apps in the same yield group.
- **Choose the correct integration type and platform in yield groups:** For example, choose integration type "Mobile SDK Mediation – iOS" for iOS placements, and integration type "Mobile SDK Mediation – Android" for the Android placements in Audience Network.
- **Review regional privacy legislation**: Consider specific legislation such as CCPA, EU consent, and LGPD. Make sure your new Yield Partner is part of either the Global Vendor List or the Additional Consent string if your app uses the TCF Framework. See [Create and Manage Yield Partners](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fadmanager%2Fanswer%2F7388260&h=AUC8j_0mE7XnUjgCJFqCqU2u3XkYJb6ORPA4SyC78g4-TMrgpAyUtnXxDJQYdhmCsvSThVyeYofgufaCxvfMzr_DWql86X2VAlOIE6IXbHEe0L1Az3FMaKjOBFi3QqywMVpt7gXrPyHAqA).
- **Map your inventory using [Ad Unit Mapping](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fadmanager%2Fanswer%2F9601810&h=AUC4zCVcw3B7OO_bnES8r9GWPwsMfjP-7EngdHRc65FzYar25z0d-6turqghfQrc4B-5VM8P_nOIwTGD_xhawxOGwTKCN0Zminn52A6mTvkNs_2bYIMEWYxthbTAmnkm2v7Zc56mtUuvaA)**
- **Monitor performance and delivery using [Yield Group Reporting](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fadmanager%2Ftable%2F7575094&h=AUBxvekHs2OUNarDqTKsgkAIHDJ90a0-slfmT6Tf3Wq864oLbRjuKSG_EDmQT1YYvRRylm1OgXSiZDwLyRDKlHED2jGkkLM0LL4y2MgnLOmh1UkbYchzA5kTgv7IaMLdMh_Ac_ro-iWVHg)**
- **Wait for the SDK to initialize:** Wait until the completion handler is called before loading ads. For more information, see the [Google Ad Manager quick start guide](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fandroid%2Fquick-start%23example_mainactivity_excerpt&h=AUBHIRGl5WzJKlgwxbRupbHFmPKTlw-0Ki4GJdQIhVuiN8YpRCmTPE7n2H5mdl8H6na0TklrzC88kKjOlP-kp4pY-2zbHlGBThXgKKydLWVB_5_4phfBZqTPm12mKQ-ijgpufVC3zMLlzA).

## Testing

We recommend testing your integration before releasing your app. Complete the following steps to load bidding test ads into your app:

- Add your Device ID to the Testing section of your Monetization Dashboard. See [Testing](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform) for details.
- Send a test bid request to Facebook using Ad Manager's Mediation Test Suite ( [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fandroid%2Fmediation-test-suite&h=AUD3bG6L37dc3IFCbTJzX57MbvKuiCvISTiZaM2V870n-2TZSOrVXmu3gMbSLqCjJwxq_HKdoAz3gC6vPlIU6qDlketvUP7JlR0Tw1cK4E_EloGTeFF_dkbjxSHeKNFpFAXTCMwKJWIHLQ) \| [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fios%2Fmediation-test-suite&h=AUCtF3QJXZ4QdCSHFyaPAHJvjW0V8rEpUHF0Yl96KdxO18rUPg_WFE2twyY4X3N4rlPXVSKAOtwB98hnASlpLGtLtiMnZYPQPTdbzAsgBKVN46eYzShPIbAZqY5jrMHhsjmg_STZkuqxTQ)).
- (iOS only) Set Audience Network's [ATE flag](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/ios/advertising-tracking-enabled) to `true` for testing.

## Google / Meta format mapping

Note: Applies to both Android and iOS.

| Google Format | Meta Format | Google AdSize (WxH) |
| --- | --- | --- |
| Banner | Banner | 360x0 (Adaptive Banner on Android), 360x61 (Adaptive Banner on iOS) |
| Banner | Banner | 320x50 (BANNER) |
| Banner | Banner | 320x100 (LARGE\_BANNER) |
| Banner | Medium Rectangle | 300x250 (MEDIUM\_RECTANGLE) |
| Interstitial | Interstitial |  |
| Rewarded Video | Rewarded Video |  |
| Native Advanced | Native |  |
| Native Advanced | Native Banner |  |
| Rewarded Interstitial | Rewarded Interstitial |  |

## Troubleshooting

- **Ensure the SDKs finish initializing:** The most common issue occurs when the SDK has not fully initialized. Wait until the completion handler is called before loading ads to ensure that all mediation adapters are initialized. For more information, see the [Google Ad Manager quick start guide](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fandroid%2Fquick-start%23example_mainactivity_excerpt&h=AUDQjA2Ou5mBdar1eOUsLP8zOHZSynh6hlK65Q7HkjOJFc_L2PQ-6iN4EeZOSbUnWPb3KluOZoRnI7P_LgGUI5BtCxVl-UVYNYkOhVzr7K-7aM9HuYeeIXCCFqri2B7i0uZbU4R2yZryTA).
- **Refer to [Open Bidding FAQs](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fadmanager%2Fanswer%2F9189594&h=AUD60FDPlUyQ07zJxTViBbPKxwBtb1q1EijsFcCLuJVzzazqONCmwerDrTmjXQC0xR4kLnwfqvN7wagdCAMrlTRf4bYz3AolY62J4JQLLcJYxStQsUTuQ3XwPF5oi8A2aKkgdwu9qKbtQg)** for answers to questions on open bidding and how it works.
- **Use [Ad Inspector](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fadmanager%2Fanswer%2F7180401%3Fhl%3Den%23ad-inspector&h=AUCgfoJNO5nkUVOo3VakgusJUOXtlY_K5A1wuDUZZPFDZp3dl41ghmEMcj8YIKxHYk_ZuBfc1Mc3GslOK7qP_nbnccXChUk4hYm25R0wUvDwf80xzFEc-z32ueg2bCq5vhSmCGpulGOhVA)** to check whether your ads are filling as expected, identify errors, find out how to resolve them, and view Open Bidding ad sources or mediation details per request.

On This Page

[Google Ad Manager](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#google-ad-manager)

[Before You Start](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#before-you-start)

[How to Set Up Bidding](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#how-to-set-up-bidding)

[Update your app code](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#update-your-app-code)

[Initialize SDK](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#initialize-sdk)

[Placement setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#placement-setup)

[Inspect your Ad Units](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#inspect-your-ad-units)

[Best practices](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#best-practices)

[Testing](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#testing)

[Google / Meta format mapping](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#google---meta-format-mapping)

[Troubleshooting](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/ad-manager#troubleshooting)