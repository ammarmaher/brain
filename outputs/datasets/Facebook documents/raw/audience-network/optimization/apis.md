---
url: https://developers.facebook.com/docs/audience-network/optimization/apis
title: APIs - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Fapis%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)
- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)


  - [Reporting API v2](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2)
  - [AIR API](https://developers.facebook.com/docs/audience-network/optimization/api/air-api)
  - [FB-Login-Reporting-API](https://developers.facebook.com/docs/audience-network/optimization/apis/FB-login-Reporting-API)

- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Audience Network APIs](https://developers.facebook.com/docs/audience-network/optimization/apis#audience-network-apis)

# Audience Network APIs

Find out more about the APIs available to you with Audience Network.

Reporting API has now migrated to V2:


- FB Login is needed to access Reporting API v2 and will feature aggregation.

- Note: This is not a user facing change. This requirement focuses on the publisher logging in via Facebook Login to access Reporting API

- If you are using the Reporting API through a 3rd party, they will need to use V2.


In this section:

- Reporting API v1 **\[Depecated\]**
- [Reporting API v2](https://developers.facebook.com/docs/audience-network/optimization/report-api/guide-v2) \- version 2 supports `GET` sync requests with multiple parameters. Facebook Login permissions are required.
- [AIR API](https://developers.facebook.com/docs/audience-network/optimization/api/air-api) \- provides aggregated data on impression performance, allowing you to measure ROAS (Return on Ad Spend).

On This Page

[Audience Network APIs](https://developers.facebook.com/docs/audience-network/optimization/apis#audience-network-apis)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUA7_snP-q8kT0DSZiwnVx0cvJPM0_ygziw8yFaE5EpjTcL54qblyrNcfPwABrcM_3tMfae15aXxWUgJvR3xuTHChrfeL26ED-lTmMnsFr24Rdxq5WjfPXO9YeDNHBkLXxcXapUyuhBcVA) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUDi6ZyHE_fgDO1o58OaObBuE8sQoSzCDGeDC2IOUDZZfSLn1CtrPKCmKBTRuo6QP8QIejlTNNXCUwdrC7VNZEzfeOxISqorsj1K-LO1vmbKoH19aCMBd3yJpp-fg9CEzouErEg6lvE-kA) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUAyITaif7xsck8-ppYQCaRjuzge_qDH_5rEwo8LKr0fLe8qfUheBuZJz-8mg5e6f3-SqbpwvIaaxqZnwDC7JBvZ45rBxP9m4rR5k0BnHa_ieGQtYGs_U020YPqUfdxkCrOPKMevs0O6yg) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUB2cb4xGdlU0L5KT8ZRmcexZQIby8NRaLfd1tZ29bjtXtIcWGDfDSAG5f3nkITQ-1jm0IQdcEV_t-xbofOiAg5ifrb0PU_01OgSMX--2q6TuS1anRjH6y2V8HZXCMqNzMKs6Hu2cjbr3g)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUBDo2sDve0UOw6vALmLMOwQ-gwhJP_FF1ei52fSD8yTWEIb5BCi-z-zoMu0Gm391OtqeSnn4N2c7W252BYKxF-d4Nu2KmchNpA8EK97ECp0HRPGUGx81HH4IvQ9s6lEu0rX3A2iZ85Imw)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUBpZHsWO0jmK-AEL4TWDX6K0_MGRjF__Gy-f_VIA7WwvJL-WnSd3lt8dhrl2GZuFw2Tc1TShqVd0aeH2Hxh2ozjTQu5pH3UKgWEp1iPvYnX1CKnrneDVR70zkkMWik3ftdkGhbyKf9nrQ)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUBZQZrh9ZT8S69dY_MxZEPgFw0iJ0AMpa1MRHFGt2FEKB7jI-lKtM6j11TDGwgPpjneP5Rvm1rcK3qKuch14vbx_DfhmtvIPce38_bMqxnUmceR2Q0fBlQ7uWDw8qYYIDQzI6K-UOlmqw)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUCVOyluunuGsx37TNwPH_BOqmTUR_jUW4RgrkRrC7RrFicKo0ih8Pj3ipX1IVcYhYv5zVW9ObZpcXwcsBtWfNZxavppT7I3UlE2fjgo5pRKgijOMfnBAfm6RlUb9J_Eqk9xgidpA1bX-Q)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUCKlrVOlTTCaMOH7nQY7FRSA_ZIYA0DLAKHhrExJsni8IzlI-6_AWiJ3GsKroMqbh7_eajKvS9WGHvmDVOxv7Gg8oBu8CcFpbNogGbSop3Q201ELr7EJRMU0VNPCayQoU5G20-u7Y-XaQ)

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