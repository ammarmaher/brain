---
url: https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching
title: Advanced Matching - Meta Pixel
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmeta-pixel%2Fadvanced%2Fadvanced-matching%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Pixel](https://developers.facebook.com/docs/meta-pixel)

- [Get Started](https://developers.facebook.com/docs/meta-pixel/get-started)
- [Guides](https://developers.facebook.com/docs/meta-pixel/guides)


  - [Track Multiple Events](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events)
  - [Advanced](https://developers.facebook.com/docs/meta-pixel/advanced)
  - [Advanced Matching](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching)
  - [Custom Audiences](https://developers.facebook.com/docs/meta-pixel/implementation/custom-audiences)
  - [Tagging SPAs](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa)
  - [Terms and Policies](https://developers.facebook.com/docs/meta-pixel/guides/terms-and-policies)

- [Support](https://developers.facebook.com/docs/meta-pixel/support)
- [Reference](https://developers.facebook.com/docs/meta-pixel/reference)

On This Page

[Advanced Matching](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching#advanced-matching)

[Implementation](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching#implementation)

[Reference](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching#reference)

[Learn More](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching#learn-more)

# Advanced Matching

This document explains how to manually implement advanced matching for [tracked conversion events](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking) using the Meta Pixel.

Please visit the [Privacy and Data Use Guide](https://www.facebook.com/business/m/privacy-and-data?Data-Use-&-Ads) to learn what data is sent when using the Meta Pixel.

To [automatically implement advanced matching](https://www.facebook.com/business/help/1993001664341800) use the [Events Manager](https://business.facebook.com/events_manager/).

## Implementation

To use advanced matching, format the visitor's data as a JSON object and include it in the [pixel base code `fbq('init')` function call](https://developers.facebook.com/docs/facebook-pixel/implementation#base-code) as a third parameter.

Be sure to place advanced matching parameters in the pixel base code or the values will not be treated as manual advanced matching values.

For example, if your pixel ID was `283859598862258`, you could do this:

```code
fbq('init', '283859598862258', {
  em: 'email@email.com',         //Values will be hashed automatically by the pixel using SHA-256
  fn: 'first_name',
  ln: 'last_name'
  ...
});
```

**Note:** We accept both lowercase unhashed and normalized SHA-256 hashed email addresses in your function calls

#### Sending More Hashed Values

You can use the `<img>` tag to pass your own visitor data if you format and hash your user data using a SHA-256 hashing algorithm.

The following is an example of passing hashed user email, first name, and last name:

```code
<img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr/?id=PIXEL_ID&ev=Purchase
  &ud[em]=f1904cf1a9d73a55fa5de0ac823c4403ded71afd4c3248d00bdcd0866552bb79
  &ud[fn]=4ca6f6d5a544bf57c323657ad33aae1a019c775518cf4414beedb86962aea7c1
  &ud[ln]=41f3e15ff8a4e4117da46465954304497ef29bdf35afaa9e36d527864d24c266
  &cd[value]=0.00
  &cd[currency]=USD" />
```

## Reference

| User Data | Parameter | Format | Example |
| --- | --- | --- | --- |
| Email | `em` | Unhashed lowercase or hashed SHA-256 | `jsmith@example.com` or `6e3913852f512d76acff15d1e402c7502a5bbe6101745a7120a2a4833ebd2350` |
| First Name | `fn` | Lowercase letters | `john` |
| Last Name | `ln` | Lowercase letters | `smith` |
| Phone | `ph` | Digits only including country code and area code | `16505554444` |
| External ID | `external_id` | Any unique ID from the advertiser, such as loyalty membership ID, user ID, and external cookie ID. | `a@example.com` |
| Gender | `ge` | Single lowercase letter, `f` or `m`, if unknown, leave blank | `f` |
| Birthdate | `db` | Digits only with birth year, month, then day | `19910526` for May 26, 1991. |
| City | `ct` | Lowercase with any spaces removed | `menlopark` |
| State or Province | `st` | Lowercase two-letter state or province code | `ca` |
| Zip or Postal Code | `zp` | String | `94025` |
| Country | `country` | Lowercase two-letter country code | `us` |

## Learn More

- Meta Blueprint course: [Advanced Matching for Websites](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fpath%2F211540-advanced-matching-for-websites%3Fcontent_id%3DXmPXIuAmW8z20zl&h=AUD7pXGJ2pFn1Xcaj-XDe3XfTxkRE4LQMxrj-fxfNNp5cw4Wn6OPP5KS-YxbckFU61IqAKorlHhj9CvQLXqjsZDSlr_-8pnnOMG1vPI-YazTavx3v7TBDY27irLsx7Od-_cib5rl3eeTEg).

On This Page

[Advanced Matching](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching#advanced-matching)

[Implementation](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching#implementation)

[Reference](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching#reference)

[Learn More](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching#learn-more)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUA3SEyuhKKAtUizxtOp5e1rmt2-EZEjbvrlLtXJDUwQkttxV9tfGqC0dHzLtWwCjxvXOp_oUmMD6f25hR9eDNq19oJBr9WUfJc_gzQpA880y7rHnITEOzNIGDLJqk9OLYUttZjapggdoQ) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUAPyUpz5chWyKJ0Dur58y1xE_1II06pmckcpNacia9OG91csAPB2HdDbbuttscX0-7GfePxIyJx30ZrgOL9V_4niuJProBIR4kvXAzD3EThDQ6iAkgIABHT57KmQmnafFPPS9U_TI6W-A) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUDLSQ6vmrlANigh37zSJIb7uAdOKrJQcK9t8kYbRYdMcKmmmA_mev17x90STLIQFaS2ztypNH1DdgWt6KHKQwdT1dxEo_KRVMgM0yOBy43PEWyWnv6flfqW95K-qRhUrAruSKd7mw4g0g) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUDDdesFsJj0VgWt_pwXXNPXGBFyVSXocpO5A772G6xheL-xeTnq7FfO7LhZMY84TTjArees-EeMhzGMthVaddmvqVNUktylciYh_-d-GheAPXxYxIAeQ6d-7HCL4kyX_K3UmoPOZntMAg)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDpriFYgbAY3VPqQWKVY8XBvzgLUQGO8XU83eA6dc473tL6fIhRahtagrmwc9EzS0fuknG1I3kXaMOAG8kErJI6ZQDcNOpPLo-g2fY5nQtgOlPzDq1lmeTU-80u3ZJRiG-iFQdtrv2fLQ)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUAxdyNBoMfwjSPV2-PM34P7BG4CPwyPzQ6D7Z9tZFR1QWI0UURIMEtzqCfw1wBZXHHZMylAWmqJlC6IzRZ7UnBM5_io9z2-9BovvRUibNg-QX1VnkA5bkqjKLFxfvblpb6xfSH0k57kVg)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCNSVt_Sbg6xGEvN92ajTn54soBZtf3Lpgq-lDlavyNd0XLV5vO7xn9Zq1R_88-1deXOlB6MgcLXWhJs8tudVpbCbeHBWAitF5oAaiYQuZItbU58Wo4PU5hR_NgWaaqFTNoU7dz6ycT4g)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUADhFWgTlpUNnXWQPdJwtGDIPiHxMdXE6Hpg4iU7BrYkJ5uqYmzPO-sqVP_eRmU5lTcf8ISFOvhGByjxNx-e3510qIn6tl3cpttl0zs-nHtBNmnD-94pJqJn0ybBVk8axqkEr_au3vsWg)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUDs_XQANtkxBFWLOzGBzHbfp6-bIAInRy4wS0GD1cj6YsNLCKOlaDWT38ummosiKSlOpkLkraLFcqqcNf5jgdBX3P-BjUJdrEl-nmobgGSyO5_I3uzQ6mbCPzlvmrGkvkyY_hudXLc98Q)

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