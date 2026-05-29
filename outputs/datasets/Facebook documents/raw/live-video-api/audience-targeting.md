---
url: https://developers.facebook.com/docs/live-video-api/audience-targeting
title: Target an Audience - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Faudience-targeting%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Live Video API](https://developers.facebook.com/docs/live-video-api)

- [Overview](https://developers.facebook.com/docs/live-video-api/overview)
- [Get Started](https://developers.facebook.com/docs/live-video-api/getting-started)
- [Broadcast a video](https://developers.facebook.com/docs/live-video-api/guides/streaming)
- [Schedule a video](https://developers.facebook.com/docs/live-video-api/guides/scheduling)
- [Create a Backup Stream](https://developers.facebook.com/docs/live-video-api/backup_stream)
- [Crosspost a video](https://developers.facebook.com/docs/live-video-api/guides/crossposting)
- [Target an Audience](https://developers.facebook.com/docs/live-video-api/audience-targeting)
- [Interact with viewers](https://developers.facebook.com/docs/live-video-api/interact-with-viewers)
- [Poll viewers](https://developers.facebook.com/docs/live-video-api/polls)
- [Speed Test](https://developers.facebook.com/docs/live-video-api/guides/speed-test)
- [Automatic Encoder Configuration API](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api)
- [Copyrighted Content](https://developers.facebook.com/docs/live-video-api/guides/copyrighted-content)
- [Best Practices](https://developers.facebook.com/docs/live-video-api/best-practices)
- [Support](https://developers.facebook.com/docs/live-video-api/support)
- [Reference](https://developers.facebook.com/docs/live-video-api/reference)
- [Changelog](https://developers.facebook.com/docs/live-video-api/changelog)

On This Page

[Audience Targeting](https://developers.facebook.com/docs/live-video-api/audience-targeting#audience-targeting)

[Create a Target Audience](https://developers.facebook.com/docs/live-video-api/audience-targeting#create-a-target-audience)

[Get Target Audience Information](https://developers.facebook.com/docs/live-video-api/audience-targeting#get-target-audience-information)

# Audience Targeting

Include and exclude specific audiences from viewing your Live Video.

#### Before You Start

For live videos on a Page, you will need:

- A Page access token requested by a person who can perform the [`CREATE_CONTENT` task](https://developers.facebook.com/docs/pages/overview/permissions-features#tasks) on the Page
- The [`pages_read_user_content` permission](https://developers.facebook.com/docs/permissions/reference/pages_read_user_content)
- The [`pages_manage_engagement` permission](https://developers.facebook.com/docs/permissions/reference/pages_manage_engagement)
- The [`pages_show_list` permission](https://developers.facebook.com/docs/permissions/reference/pages_show_list)
- The [`publish_video` permission](https://developers.facebook.com/docs/permissions/reference/publish_video)

#### Node

- [LiveVideo](https://developers.facebook.com/docs/graph-api/reference/live-video/)

## Create a Target Audience

To set a target audience, send a `POST` to the `/id` request where `id` is the LiveVideo ID and set the `targeting` parameter to an object with a comma separated list of audience parameters.

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

```curl

curl -i -X POST \
  "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>
    ?targeting={
      age_min:17,
      geo_locations:{
        countries:["US","CA","MX"]
      }
    }"
```

On success your app receives a JSON response with a list of audience parameters that have been set.

#### Sample Response

```json
{
  "targeting": {
    "age_max": 65,
    "age_min": 17,
    "geo_locations": {
      "countries": [\
        "US",\
        "CA",\
        "MX"\
      ]
    }
  },
  "id": "<LIVE_VIDEO_ID>"
}
```

## Get Target Audience Information

To get a list of audience target information, send a `GET` request to the `/LIVE_VIDEO_ID` endpoint with the `field` parameter set to `targeting`.

```curl
curl -i -X GET \
  "https://graph.facebook.com/v25.0/<LIVE_VIDEO_ID>
    ?fields=targeting"
```

On success your app receives a JSON response with a list of audience parameters that have been set.

#### Sample Response

```json
{
  "targeting": {
    "age_max": 65,
    "age_min": 17,
    "geo_locations": {
      "countries": [\
        "US"\
        "CA",\
        "MX"\
      ]
    }
  },
  "id": "<LIVE_VIDEO_ID>"
}
```

On This Page

[Audience Targeting](https://developers.facebook.com/docs/live-video-api/audience-targeting#audience-targeting)

[Create a Target Audience](https://developers.facebook.com/docs/live-video-api/audience-targeting#create-a-target-audience)

[Get Target Audience Information](https://developers.facebook.com/docs/live-video-api/audience-targeting#get-target-audience-information)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUAET-xe0JMqDA-vFUwGmJGIGKWrdsyXff3uUFzinI59PfZkddDITrQUguXxikI4ECGBaAhuI7kInSaiwnpL2y-Ib_JOy4Fdqfbx4jQNPhua45PpDZIVOjL37JMPXgaUtyCkL9eelF0zBQ) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUCZA6EXSXM0YeR-8-JXlHDa41ZHtyf8W8jvEHe-cIiq8C4dhQmLSAHvGlqwlKBxHnJ48t1wfXs_ySNsx8E5uad_FkhROj-Rp645W51C8IfCzFNQLO9CcfmcF-KANtlx1zDL2N3-WV1ZhQ) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUCArpvDBXXXNtiMTr8jQcIr-HN1QGRHsO-RGGYLprOnbzHuyWYuOPtDC3XMa4vS7xbHSRovBNviZHy4m4KxGNtFqfvvRg0H6YPqv4oelh8ZDL5e2EwUkoN0swwarzZV-iyJelauOh2_Gw) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUDy0MulrIVqVRfBeeFVV0PYaRbEHHTx_mBOeUpE8EL3imXmwHi_d4WzUtQ-96hY4p_uxiJKNWuwauNo0v_LyQNeo50Yo8O_jMLtGj5qnz1vxiOkJlvMbJyZcrKVcN-Kdczd8v1vWyj5RA)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUBVdSB0wVObPD_CmmvMzN6muDOS8AfSoGF6AfpajsU6B8_tPFAdxTThCm5KW1m9xJtnhMOxXyiaRrsRpqL72l39Pk6SZJLdZD35ues0UPNkausvTdfePeQw21qhkZxutYGr94fKoevEOA)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUDib-kgBZfRnzLztIYqDItO9MlW7TNBXwlGFb7Xc_nrcy0byEUwP7hnD-Qfcf9wA0oqjhfwqp2NZ0bUkrZ-xls2PKgehN055LLjrYUKYHJPbmyIDUvtAYp3kmwdJw0iD_Gil3_mTUTY_g)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCoHVNI5smt821qjMy1ty_1cA6e6kNkrYF2y2giwBZwz-IoT4bFO_8UQX2O_SH674BpFUY83QStywA6a4144haMyni16d9hWnUptlxnQbfw-rrqyPJpPj8fy0D1pfhrxIpSnVU4cpv7mQ)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUApviTd3iFR1v4OprJWvRsW1tMvssitlGu2zqnSAEl9Iyy7AbZxjs07NG4rAzyXhweolpKy9Ys4SNJEuUok9wJJeKwO5012um9E1nMsuhNBM-IjMKMGN__1e-IXlN4r8ZLvh6VJQLK5Nw)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUDh8kcaxSwkUTLSuSTlSF464U8JV1BjDZG8UyQuez2PTK6gJPNJzkZ3gOa_40YDBU74NCTMoCPR5SSjsNS_AXn1bf2QjUXnrw2_yEekx8iBv59496cY2n-hnDw_On6aVS5tBsH3CCr4Zw)

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