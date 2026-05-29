---
url: https://developers.facebook.com/docs/audience-network/optimization/best-practices/coppa
title: COPPA - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Fbest-practices%2Fcoppa%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)


  - [Layout Guidelines](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices)
  - [Audio Guidelines](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices)
  - [Policy](https://developers.facebook.com/docs/audience-network/optimization/best-practices/an-policy)
  - [Ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers)
  - [App-ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads)
  - [Data Processing Options for US Users](https://developers.facebook.com/docs/audience-network/optimization/best-practices/data-processing-options)
  - [COPPA](https://developers.facebook.com/docs/audience-network/optimization/best-practices/coppa)

- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Information for Child-Directed Apps and Services](https://developers.facebook.com/docs/audience-network/optimization/best-practices/coppa#information-for-child-directed-apps-and-services)

# Information for Child-Directed Apps and Services

When you participate in Meta Audience Network and use the Facebook SDKs in apps or services that are directed to children, or where you knowingly collect personal information from children, you are responsible for complying with all applicable laws. For example, in the United States, operators of web sites, apps or services that are directed to children under 13 or that knowingly collect personal information from children under 13 must comply with the [U.S. Children’s Online Privacy Protection Act (“COPPA”).](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.ftc.gov%2Fbusiness-guidance%2Fprivacy-security%2Fchildrens-privacy&h=AUDXOy1UYLT2wJfEUhfGe-lRSTJBTSaALXjCdBQ_NjdD2QUuE2ZIZ8ROdeAgTc6LLxrZwq-Trcy4qRkLt4S0_Td64ePIDmBXMhG8uBAU1upS-tnhiyu3sHPfRRm9vhmsXXojXxiFl3jqew)

Under the [COPPA Rule](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.ecfr.gov%2Fcgi-bin%2Ftext-idx%3FSID%3Ded5f76ab1e38b07607347f089c048eb8%26node%3Dse16.1.312_12%26rgn%3Ddiv8&h=AUDe8jrBWxW5AlNpSe27XZwZiQnhceKfXlMtul86cZZULaBQkrT--MiNEhSOcUMzv3HiXwsHpP5cjnqMz0FxOyM3E8fjG-Mqp3bbgz7z5CHxohBH0_i_1GOlyr3vamddSUYIvy2OwMeK6w) and per FTC guidance, developers are responsible for determining whether or not an app is child directed by looking to “its subject matter, visual content, use of animated characters or child-oriented activities and incentives, music or other audio content, age of models, presence of child celebrities or celebrities who appeal to children, language or other characteristics of the Web site or online service, as well as whether advertising promoting or appearing on the Web site or online service is directed to children . . . \[and\] competent and reliable empirical evidence regarding audience composition, and evidence regarding the intended audience.”

If the app is child directed and children under the age of 13 are the primary audience, then it is “primarily child directed.”

Apps that are child directed, but do not target children as the primary audience, are “child directed, but mixed audience” services under the COPPA Rule. If an app is child directed but mixed audience, it can choose to implement an age gate, a mechanism that asks users to provide their age or date of birth in an age-neutral way. Child directed, but mixed audience apps that implement age gates are permitted to differentiate among users for purposes of COPPA compliance.

This document provides the additional code you are required to use for the Facebook SDKs if you have determined that your site, app, or service has obligations under COPPA. Where you use this code depends on your determination of which of the following categories applies to your site, app, or service.

1. [Primarily child-directed](https://developers.facebook.com/docs/plugins/restrictions#child-directed). Your site, app, or service is [directed to children](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUBrTrrzEL_PL6nsIy44MTXXnS4UeQK0RMIqDyOkGXXAHE0XHCzMjgIKlzHAs8Sg0FJsmqeA6XNhwF3j-gFJnCKfMhtiOIFsrvdm92UwjMr3e7YyIG7eki17YYFKQavsrZS-7LSLIhERJA) whose primary target audience is children under the age of 13.
2. [Mixed audience without age gate](https://developers.facebook.com/docs/plugins/restrictions#mixed-no-age-gate). Your site, app, or service is [directed to children](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUAvPmAoIavSl4PyezPVRFcQKn6oQQEjEizY-sbMvufnMAh6G06WjC3gjd-U2e_3LSgsHPaPaRAkzC-FGb_gta8-S10qY24dFQiOarFBYwNvTnEvL-Y651W9j3USuH_qich57AwQW3lyXg) but its primary target audience is people who are at least 13 years old. Your site, app or service does not include an age gate. An “age gate” generally is a mechanism that asks users to provide their age or date of birth in a non-leading way before they access a website or service. For more information [click here](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUDwA1mKPapAHFndQewUP-JfpqoXS6Z_Tf0k2dcPBvHJYI7BOl7mK7a63uQZFWaAN0vITolaEexLZyBZVEm1ledBQXqqB-tz7bZrJ0_fA2sPfJd2vvTUERIucgh0ZRWY_ZdtOsrdM5TANw).
3. [Mixed audience with age gate](https://developers.facebook.com/docs/plugins/restrictions#mixed-with-age-gate). Your site, app, or service is [directed to children](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUCbH6VtqkIuedRdABfdSHn1K8Dyj-YkRLdEVo2_XnqZkQOthWyQ9pKaCN6NV3uUEQaykCKNJMDlbWnA6IYAmqkllerYwtvyuz-arFZGWx7TesILbHKt16FlDF7CqKVZfkk05vClC66Dm6h6VG62I0sebFo) but its primary target audience is people who are at least 13 years old. Your site, app or service uses an age gate. An “age gate” generally is a mechanism that asks users to provide their age or date of birth in a non-leading way before they access a website or service. For more information [click here](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUB5yODfgGXxQPBv5QW67GXEwkwvqxfTTtv1BWJe09LX-V1o0xRVoqTFKUmjTtdxS1nwJ7P4soAUp69gH0jxYtA3cb06sfWxG8whSea3Z-2P4Gqk8T38GzTDsEe3kcwjTG5wYghh07drQQ).

If your app or service is **Primarily Child-Directed**, then you may not use the Facebook SDK for Android.

If your app or service is **Mixed Audience without an Age Gate**, then you may use the Facebook SDK for Android only if you set the `setMixedAudience` flag for all users. When an app or service tells Facebook that the `setMixedAudience` flag is set in the Facebook SDK for Android, Facebook will only serve ads to non-United States users of that app through the Audience Network services.

- [iOS](https://developers.facebook.com/docs/reference/ios/4.6/class/FBAdSettings/)
- [Android](https://developers.facebook.com/docs/reference/android/current/class/AdSettings/#setMixedAudience)

For apps or services that are **Mixed Audience with an Age Gate** and where an individual user represents that they are under 13, you may not issue an ad request to the Audience Network by ensuring that the Audience Network is not being requested in your view controller (iOS), activity class (Android), or any respective app function. Where an individual represents that they are at least 13 years old, you may use the Facebook SDK for Android without setting the `setMixedAudience` flag.

On This Page

[Information for Child-Directed Apps and Services](https://developers.facebook.com/docs/audience-network/optimization/best-practices/coppa#information-for-child-directed-apps-and-services)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUBpkKj-Hl-9GBErjiaOsU_cE_rbqhYDROg8nqFgGyWxpLqCBPsNN0PUd1gS96iguWgfzbfIFvZCgsZP8RxlASwd9rKX2bxIarz1DL5FTeH0GDP1Jeni0_uJzWGdNb7GLM3vMiH17mfTcxqwqPbNh6aOW7Y) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUBiMkDlJtUozkQqcmXf-ZrqYBeiW_RhgP-iV7_07_SyQYNHZZTa0O2Xwx9nF7F0l1N-QNAiwIRN0_TRn4orCZIrLr3Og1-NB6MQCUixDDS-9YIyfXCRqc4jxCyGAjYSDJGJjeq34rpuJg) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUCswzmpOk63ARnZL6bT_zvoiCAy0x401LSdxLgUTc_083ToEHpWxWFseeJcjFABe1SOS1y19Lry9I4ghxfq8d1WQK81EaPfTOHb26YpbJRriZTBjsyuCXy4hpcWW8bv9jcz10Q6g5wzJQ) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUBqG3HL8CO_rBOHl3NC0n4BpooMsRjep8Um-oR3-PauYutvGVNh0x_Ht-756Vij_H-BcS1_Np4hS-xkP67y0RHSDYBNLMJlQge8BuVjLRnZhgG5dlpC-yP_oT9p_E8yrc2zyYD8aNLAEQ)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUBNsoj4Je55IJzMHX0_Awu4Dg77CDrIW2E7nvq03CKcCD7QNsKNaLFQpy0KN5u55NDAsPH5B775Mkgi5SwMRpky2tANc6ISk7yAkjhWY2zVd7r8plONFg8J-UoIpVOoAmI88fExUQuj4A)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUBVodxAb_A_Ql_82JchtJlgcs1Jj6nY2tMFOoMHUoPUYMqfhhV7qYIfXz9ubva86N7DWGxnC8Gu55nl-AZ1pBujhWwvG4JBGzFEIa44Ynm9AegnqoEDAgKclQo7IAtFh1b7K6hCpmPdng)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCsMDyy5LDcOFde3Q40Etj9ucpevK-IBQ0o9zrWJxSMUOPAqzwojRqqsYAixmrA3ptWDWGZe6qJgqo_KKuhkxEBNMU_2N_eVQkR3H1c1VDOz2qCrVs8jQO_3KLjwSjhMWIwNEyU9MJ64Q)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUDwav5MuMaQY-b9CxPSXNr3rpl2qLrGIE-QSkTkDHDkzu4FFY_hEn29F3gnjGdzJvypd0uUv9MUxzT0zlQqpoRLEEDJw-ERuocIZELIHsu_jyABLpv58ZKwsbu3OnA-fe-kAcz4jwLGRg)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBb64BF7gABtgGVjoId0hjpTT6VMalUGqrgcs4F_sKbzB4e9iKfXQCbtg_7_agxYoDgyomd6gnjZ1FduNK2FZKpqMOUyWGadKuDzwNkqXtuKHJw8y4XIU-CMUpkSQ9o1zp77wd8i2BkeQ)

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