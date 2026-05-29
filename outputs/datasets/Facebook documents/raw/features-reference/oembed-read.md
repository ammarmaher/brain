---
url: https://developers.facebook.com/docs/features-reference/oembed-read
title: oEmbed Read - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Ffeatures-reference%2Foembed-read%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)


  - [Ad Targeting Data Access](https://developers.facebook.com/docs/features-reference/ad-targeting-data-access)
  - [Ads Management Standard Access](https://developers.facebook.com/docs/features-reference/ads-management-standard-access)
  - [Business Asset User Profile Access](https://developers.facebook.com/docs/features-reference/business-asset-user-profile-access)
  - [Human Agent](https://developers.facebook.com/docs/features-reference/human-agent)
  - [Instagram Public Content Access](https://developers.facebook.com/docs/features-reference/instagram-public-content-access)
  - [Instant Games Zero Permission Access](https://developers.facebook.com/docs/features-reference/instant-games-zero-permission-access)
  - [Live Video API](https://developers.facebook.com/docs/features-reference/live-video-api)
  - [Meta oEmbed Read](https://developers.facebook.com/docs/features-reference/meta-oembed-read)
  - [oEmbed Read](https://developers.facebook.com/docs/features-reference/oembed-read)
  - [Page Mentioning](https://developers.facebook.com/docs/features-reference/page-mentioning)
  - [Page Public Content Access](https://developers.facebook.com/docs/features-reference/page-public-content-access)
  - [Page Public Metadata Access](https://developers.facebook.com/docs/features-reference/page-public-metadata-access)
  - [Threads oEmbed Read](https://developers.facebook.com/docs/features-reference/threads-oembed-read)
  - [Threat Exchange](https://developers.facebook.com/docs/features-reference/threat-exchange)

- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)
- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)
- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)
- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)
- [Release](https://developers.facebook.com/docs/development/release)
- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[oEmbed Read](https://developers.facebook.com/docs/features-reference/oembed-read#oembed-read)

[Allowed Usage](https://developers.facebook.com/docs/features-reference/oembed-read#allowed-usage)

[Common Endpoints](https://developers.facebook.com/docs/features-reference/oembed-read#common-endpoints)

[Additional Details](https://developers.facebook.com/docs/features-reference/oembed-read#additional-details)

# oEmbed Read

On April 8, 2025, we introduced a new oEmbed feature, [**Meta oEmbed Read**](https://developers.facebook.com/docs/features-reference/meta-oembed-read) to replace the existing oEmbed Read feature. The current [oEmbed Read feature](https://developers.facebook.com/docs/features-reference/oembed-read) will be deprecated on November 3, 2025.

- Apps created after April 8, 2025 that implement oEmbed will use the new Meta oEmbed Read feature.
- Existing apps that already use the current oEmbed Read feature will be automatically updated to the new Meta oEmbed Read feature by November 3, 2025.

The following fields are no longer returned and will be fully deprecated on November 3, 2025:

- `author_name`
- `author_url`
- `thumbnail_height`
- `thumbnail_url`
- `thumbnail_width`

Read the [oEmbed Updates blog post](https://developers.facebook.com/blog/post/2025/04/08/oembed-updates/) from Meta to learn more.

_Requires [App Review](https://developers.facebook.com/docs/app-review)._

The **oEmbed Read** feature allows your app to get embed HTML and basic metadata for public Facebook and Instagram pages, posts, and videos. The allowed usage for this feature is to provide front-end views of Facebook and Instagram pages, posts, and videos. You may also use this permission to request analytics insights to improve your app and for marketing or advertising purposes, through the use of aggregated and de-identified or anonymized information (provided such data cannot be re-identified).

## Allowed Usage

- Provide front-end views of Facebook and Instagram pages, posts, and videos.


## Common Endpoints

- [/oembed\_page](https://developers.facebook.com/docs/graph-api/reference/oembed-page/)

- [/oembed\_post](https://developers.facebook.com/docs/graph-api/reference/oembed-post/)

- [/oembed\_video](https://developers.facebook.com/docs/graph-api/reference/oembed-video/)

- [/instagram\_oembed](https://developers.facebook.com/docs/graph-api/reference/instagram-oembed/)


## Additional Details

- This permission or feature requires successful completion of the App Review process before your app can access live data. [Learn More.](https://developers.facebook.com/docs/app-review)


- This permission or feature is only available with business verification. You may also need to sign additional contracts before your app can access data. [Learn More Here](https://developers.facebook.com/docs/development/release/business-verification)


On This Page

[oEmbed Read](https://developers.facebook.com/docs/features-reference/oembed-read#oembed-read)

[Allowed Usage](https://developers.facebook.com/docs/features-reference/oembed-read#allowed-usage)

[Common Endpoints](https://developers.facebook.com/docs/features-reference/oembed-read#common-endpoints)

[Additional Details](https://developers.facebook.com/docs/features-reference/oembed-read#additional-details)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUClYXjEy6FsfXLwNVil12uIWn18aUMgObXFhameqeNgnW-gQAVlq07UwJkvZoRFPxOPvGccS6l0q4KOxvatU9fj9eREZB1Obtxw_cyChs1TXJWlcQL6CucAyc9LDoH6AjZWghCOlwRocA) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUDHXBzOk8sOKxl89PaJxuGUbMHbzJ-4TI5lmaeeUfeK8627SUNBWClWVogKHk_hqp96hWmmRcOTYzVWr_747vRpUtVbTa32rnQhAJBC754lBmCL_VSu2paJLd-Xq_sU1RRKsz_oaIEanA) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUAvT9JWoT9p7rWgPsbUL6WX1uJb9IMaT1w7VxuQr63lkTtfEj1FFyL83Y9eWlYUQQ2h28_MeqjAvXEOdn_W2sDlkcn-yCQZDs65KFk9UtYeqhobrj38GTIa1a1V6QLxDAtUuNdGrlzU6g) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUAw4NJlLVwd_7XwOXdzR9Ypw_M_0qHkjuh2pQwOC3WQ-M-9KuwYaCWXL0995QtUO-KFI6DuZQ-4iK6DaYsv7u5T1F7HKLombrU76wDGN-DI9U9SNqFcbnDYyqE3lnXiBObu51QBomQFMA)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUAfN2H1BNN_ig4VkE5bRYBpTPfiVnWbHW1A-ib5rOjb--gsxexHid_LhREL3DTFSZDquzYm7d2CeAwwBCJ4ZnR89VQW4QivJqV11W1tjN8vIImdlYlugFyeEfRkWL88e8TZVnXipQs7xQ)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUCEE9HizYiExC3YchiqFUy7sS3mhZjgIzD0XrG6NPRfTKxmJ-MtiG7gRiyHXcxkuAIYM2Yi6kPFSYRcXsVXma_PNmUU7oOXg-q89nxWU43TctLCIa6okCRgpPK5jb_rt-ehcuPtKcCluA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUBTxZwMgd062j7PW9flJ_5atiCVGN3zXWeFG0RgddN2B1Jzy4xXAb0F129t7L6EE6uSFqPlqI4SG4wMTS6Duj9v9J2G8b17nb39F5foNQbbPXFK91QtAZ4QGbLm-AU37MDFa25nU3T3fw)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUDFvQYeX0sX3Haor3ughCFBvcdcfR3kcsqxA2pQxkSJKO44gCTP9QjLh5Ds4DCtv7U43tGSN0yFNxeUqaE8Wu3HJ3TUDN1ZKQGeb1KRyynt9-E-ggIVcLCz2qOe2AcL1Usjk_s0OwVacw)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUCZ0VzL4LaM4HVFzR9zbG-kZ-DnmiEwN3wrRG5NfdVUfz3w76lyFDuOq7LnCmwHeBoev40d2GcVlxjBbX6F_bU9_PYfh1p7kRZkUqHFAVXR4R8wZ5fjMBuqihNmK-iq0EO6eQ1MMYTcZg)

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