---
url: https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob
title: AdMob - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fbidding%2Fpartner-mediation%2Fadmob%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Google AdMob](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#google-admob)

[Before You Start](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#before-you-start)

[How to Set Up Bidding](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#how-to-set-up-bidding)

[Initialize SDK](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#initialize-sdk)

[Moving from waterfall to bidding](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#moving-from-waterfall-to-bidding)

[If you're new to Audience Network](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#if-you-re-new-to-audience-network)

[Testing](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#testing)

[Google / Meta format mapping](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#google---meta-format-mapping)

# Google AdMob

Set up the AdMob bidding mediation partner for Audience Network.

## Before You Start

- **Meta Audience Network adapter version:** The adapter version must match the first three digits of the Audience Network SDK version. For example, Audience Network SDK 5.9.0 is compatible with adapter 5.9.0.0. The last digit is reserved for adapter versioning if a newer version is available for the same SDK.
- **AdMob Audience Network adapter:** Download the latest AdMob Audience Network adapters ( [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fandroid%2Fmediation%2Fmeta%23step_3_import_the_meta_audience_network_sdk_and_adapter&h=AUC3Xy6_PFUPgWbMNO9uSLTSAF0WFRJw5ar-l4aQlbKTsqweCNkYqiJdQwO66raoOluea3M8WwweSAgATA1n2PeKqcmf3uKoH_Pz8SmfvbU4ccQk5qzplPTnER0g-cR0R3_1JaWxU3W1pA) \| [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fios%2Fmediation%2Fmeta%23step_3_import_the_meta_audience_network_sdk_and_adapter&h=AUC4OlmpmM1MHLqw1EAkj-wy-jRVV-6NfsyA-s8894jkRW5rGXhBVygjnmuOnlYSiNCAaKNj9PepZG1q2lpu_LNgZWkK9ghX3OtVfEHJjVzRGXxsd3O-DmulFy3k1VYC0c-6iJMdDmJGzhbxj1PHZc_Vf-k) \| [Unity](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Funity%2Fmediation%2Fmeta%23step_3_import_the_meta_audience_network_sdk_and_adapter&h=AUBEd3-_JhJz3eUeNWYaVJnk3dSOp41sir0FWlANDanqz5ELk4w1gUvxqXdsFYUZWuJXTBvBU-lVOIFXD0btXOp6jKUg4pMswUror_HTKpA8zPZLy0MU5BPSU9wo1jae1tdaVfyL4UFD4g)).
- **SDK Bidding setup:** Update the Google Mobile Ads SDK, Audience Network SDK, and Adapter to the latest version. Then follow the instructions for Android or iOS to set up SDK bidding. Check compatibility for the Google Mobile Ads SDK, Audience Network SDK, and Adapter in the changelog ( [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fandroid%2Fmediation%2Fmeta%23meta-audience-network-android-mediation-adapter-changelog&h=AUC-4ZvZjH3-PAMM9Qmu9Y-d7wiXPLNZSDfATtXWEy8tc5ObxvQsg8GWKIv7Y0qQc7pTb-XdpFHf-gmOcuixH8yKUvfaAi1507IMBIigDHI3ifT4UKvst6T1qJm_uj78RM18wJXiIGKvbw) \| [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fios%2Fmediation%2Fmeta%23meta-audience-network-ios-mediation-adapter-changelog&h=AUCo2Qk4ANNiU33-Q4PiVQhXz9GQqnjkm2oH34Pu5M__AOMc6-psv2rimJm38HlibHVS8PeshQ1Va0yBu0gB9srCXPCgXC7ovYsmUsT_5YcOi9Bf4m1tVcXKUT9GpjFWv371Fj9puDo5sQ)).
- **Supported formats:** Banner, Interstitial, Medium Rectangle, Native, Native Banner, Rewarded Video.

## How to Set Up Bidding

See AdMob's guidance on how to set up bidding for [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fandroid%2Fmediation%2Fmeta&h=AUCvfSjlnZmwVcXZvyhJ_3FqI9Wh-t4Ye-SLxaTMmJ2y9o3gHW-Mjm2PhoboCoRZI2zRkqX3lueXf75HBPmw-4yTQBOUZq4_vQlwubEj6wD_fkylU02toJKOit6uu3WOubmv5qDpkAiv6A) and [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fios%2Fmediation%2Fmeta&h=AUDfIO-G-NGOwlbaGFM0A1tNmY6fPpcWEbodlkO0aEVNehDLhGFcKcXLK-HYsquYYkJ3mh2r3arr_vcfQkKz4JUKFFB-ek3ES1_EiQn-fg2SNIHMRCjTS0uhE-whW1L0A7P1FGGSDvUXlQ).

### Initialize SDK

1. Initialize the Google Mobile Ads SDK and adapters by following the instructions for [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fad-manager%2Fmobile-ads-sdk%2Fios%2Fearly-access%2Fopen-bidding%23initialize_the_mobile_ads_sdk&h=AUC6nk16lEfHgIxcuXJlEGJEcBL23egU6iYA3tbnnDWCBG8xQ7SoeIWdEyj_h3soMlOnjop3kJ1CZoNTXoCN1Fp7hKaHNWBhgNWWqS3xiqiHey-0ZJGV3WY7p37YXxS-azH5i-Yylhvhzw) or [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fandroid%2Fearly-access%2Fopen-bidding%23initialize_the_mobile_ads_sdk&h=AUCdMbeOv8QJjsDuWmZBKTsuW3hoW3-5dNH6tC6rtURijQoj5BKi7ebhmKsmc3Gs9FkmV-51CFhzei4JSyBG6nqhDL08kopYsepuwjzMC3_PFzQC7LVeFvriOmA67YMeTfm915I_m_RN6Q).
2. Wait for the SDK to finish initializing before sending a bid request.
3. Use AdMob's listeners and callback functions to confirm initialization is complete.
4. Make bid requests and load ads.

> **Important:** Wait until the SDK finishes initializing before sending bid requests. If you skip this step, the bid request may be malformed and your requests will appear under an "Unknown" platform in the Monetization Dashboard with a 0 Bid Response.

### Moving from waterfall to bidding

- Use the existing top revenue tag placement for bidding for each ad format and OS.
- In your reporting dashboard, filter by placement type (for example, Rewarded Video) and sort by Estimated Revenue from highest to lowest.
- Choose the placement with the highest revenue for that placement type.
- Use that Placement ID in the AdMob Open Bidding section of your Mediation Group.
- When you convert your top placement to bidding, use that same placement in the Waterfall section below Open Bidding as a default for inventory that is not monetizable through bidding. The mediation platform handles defaulting to waterfall in such cases. The volume of inventory monetized through waterfall depends on the composition of your traffic.

### If you're new to Audience Network

1. Create a new placement in [Monetization Manager](https://business.facebook.com/pub/). Copy the Placement ID for the next steps.
2. Add a new Meta Audience Network Open Bidding entry in your mediation group using the Placement ID.
3. Add a waterfall entry in the mediation group using the same Placement ID.

For instructions on how to generate a System User Access Token for the AdMob Dashboard, see [Generate a System User Access Token](https://developers.facebook.com/docs/audience-network/guides/reporting/system-user).

## Testing

We recommend testing your integration before releasing your app. Complete the following steps to load bidding test ads into your app:

- Add your Device ID to the [Testing section](https://developers.facebook.com/docs/audience-network/guides/test) of your Monetization Dashboard.
- Send a test bid request to Meta using AdMob's Mediation Test Suite ( [Android](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fandroid%2Fmediation-test-suite&h=AUDQhsPsYhvxy2I9XspKMQiS6VxsSY1pn3_H3k3GLraEP_KTvslS_-CSUkwMU1MRmlxD7eyc9r5Xqrhnvm2F5VubDmOjprRygR_SHZf60AMzaxiW5fvqq377cHbhfbfkaqgbMaXF-tqVTQ) \| [iOS](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Fios%2Fmediation-test-suite&h=AUDN22oaI8bXRji2zqGmLYgl85cpQY8hRAZnucx36sygB4BGbno_KPUog94q0N1kv0l3BSMZnm_quANR0_SPlTZ313-byGKQUvfREEVyZ6jBhkqo0HfkAIBg08t9P2WDkJIsw7VZ7kWSRA) \| [Unity](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fadmob%2Funity%2Fmediation-test-suite&h=AUC9bDn3IR_PFqRqOuizPGd1dX6oO9sJ8YjgVZFAOewdTQDWXmqYxAWkfVWg9RSrFYD56TxNVPrGL4L8N2gb4pl-nBb2BKCYeJA0OdI3nNrI9fGBDSlmwKfsMh658wschJKA0U28OQ3T2Q)).
- (iOS and Unity only) Set Audience Network's [ATE flag](https://developers.facebook.com/docs/audience-network/guides/advertising-tracking-enabled) to `true` for testing.

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

On This Page

[Google AdMob](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#google-admob)

[Before You Start](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#before-you-start)

[How to Set Up Bidding](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#how-to-set-up-bidding)

[Initialize SDK](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#initialize-sdk)

[Moving from waterfall to bidding](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#moving-from-waterfall-to-bidding)

[If you're new to Audience Network](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#if-you-re-new-to-audience-network)

[Testing](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#testing)

[Google / Meta format mapping](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/admob#google---meta-format-mapping)