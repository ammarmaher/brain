---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions
title: Mentions - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-instagram-login%2Fmentions%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)


  - [Migration Guide](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide)
  - [Business Login for Instagram](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login)
  - [Get started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started)
  - [Messaging](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api)
  - [Welcome message ads](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads)
  - [Conversations API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api)
  - [Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions)

- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)
- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [Comment Moderation](https://developers.facebook.com/docs/instagram-platform/comment-moderation)
- [Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies)
- [Insights](https://developers.facebook.com/docs/instagram-platform/insights)
- [Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed)
- [Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories)
- [oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed)
- [Embed Button](https://developers.facebook.com/docs/instagram-platform/embed-button)
- [Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging)
- [API Reference](https://developers.facebook.com/docs/instagram-platform/reference)
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions#mentions)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions#limitations)

[Listening for and Replying to @Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions#listening-for-and-replying-to--mentions)

# Mentions

Identify captions, comments, and IG Media in which an Instagram Business or Creator's alias has been tagged or @mentioned.

## Requirements

This guide assumes you have read the [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview) and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

You will need the following:

#### Access Level

- Advanced Access if your app serves Instagram Professional accounts you don't own or manage
- Standard Access if your app serves Instagram Professional accounts you own or manage and have added to your app in the App Dashboard

#### Base URL

All endpoints can be accessed via the `graph.instagram.com` host.

#### Endpoints

- [`GET /<IG_ID>/tags`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/tags) — to get the media objects in which a Business or Creator Account has been tagged
- [`POST /<IG_ID>/mentions`](https://developers.facebook.com/docs/instagram-api/reference/ig-user/mentions#creating) — to reply to a comment or media object caption that a Business or Creator Account has been @mentioned in by another Instagram user

#### Permissions

- `instagram_business_basic`
- `instagram_business_manage_comments`

### Limitations

- Mentions on Stories are not supported.
- Commenting on photos in which you were tagged is not supported.
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks) will not be sent if the Media upon which the comment or @mention appears was created by an account that is set to [private](https://www.facebook.com/help/instagram/448523408565555).

## Listening for and Replying to @Mentions

You can listen for comment @mentions and reply to any that meet your criteria:

1. Set up a script that can parse the Webhooks notifications and identify comment IDs.
2. Use the IDs to query the `GET /<IG_ID>/tags` endpoint to get more information about each comment.
3. Analyze the returned results to identify any comments that meet your criteria.
4. Use the `POST /<IG_ID>/mentions` endpoint to reply to those comments or media objects.

On This Page

[Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions#mentions)

[Requirements](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions#limitations)

[Listening for and Replying to @Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions#listening-for-and-replying-to--mentions)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUCwo_GVVSB05TUUQuLz_NyklvpAPw7yMJLR7j4h0kIwwf-DXBE80bqHAk9nCEie0LAqjtvlQ2A9AT9luTAgIe54Z_VFVHafTsX18lPnYuxinzhjXNnHuYte4n9m6DSPJE7IHyyuj4i0cA) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUB_LXM0YdBL01OaGlZ113uDWYxp0EevBUeCJryvxIE3b2F2HUFFSn-9wcdPtzSHK63MNLcaQENjDshm1aJOU5g7HhgR-7fY7dFxjpGj6MuWOAb7nUJn45fIbR6aQpmnwt1VZ1c0RkoKbA) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUA_JmiRcIZLxdVsKJeQxPVPYlNPuT3Wy0gW_aC8SKWwy9sIFyYDxpS9yZm7FhBNUEq3Sk5kVFU7arG0NIgkMGmO3mHDVTo4EQe27QNSfOZ2wA6-1_hnG3MrslHvaQ1qFHQOJ2zsSS7g2Q) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUBTsDwsQNRPa6yf3n3EzPBADfe_Ezw7gCsl-hOeWHrfIeJj9GZ_rkpXD6lIKztkY2RE9mAgxRiESeAcMw7YPS-F-h2UoVy7fCxwJFZxy6uAWNVQhD-7eUP-AY1t2EpRG8W_X7XWaghOtg)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUBs4T950WejLEnxLrexzmwThQU-H15wa3z0FMJzR4To4bo6otX09WyXuCD0s3jv8jw9dXKrj3akYJnDZQ0RIAj2kGCsOpxa7BgmFMtymT_fuNp94K_ZQ03Y92loHg8IoTl2wfOy9U5CWw)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUBFCH6Wz142wH-kzJZdhhFfU4MIL5ci8OxBN1yrfCtRNizwDIBqCaeRKEobrRntGmxSHO_4jBLI973ZOPQ4EsnpLXsXFc_Zy6gLhh9xQPB5fpnvcfAKpeZNH2_UB_a_toLCHI4RrJlT2g)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUAvTAH81USRHzbMQtpSfR8Eu9el2-szQTi2mXytkmpDiZSZHNlWeXEKLXpdE_VbtZQH3XFBDw0ufT4k0jVovec2kljN9CkUrEpNUMi2-a32Ok3k_3oI1IeTpzvK_pz-XR1GqvvzB4ZN2w)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUDHwY7L4qVyEco8jWyA_IlLaJE7EFUoiTpHCe11Ocudx4_9q-vXqvf4jRDX1XtP9Od4y8a8-KBSXvVJ049A4RqbSs6zEFvMT3bF5BqR3hP-iE-z7ElY0oQo4xJi55KNQz9vaV-qS7VS1A)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUC4veosWup-sO7CABWKAGuJq94dzcR2z9esKN2WrR8Z37MLy4cN0otm1jJwSR_hGAiwzglLlZ9I7-CWAaa-ZWLjM9ZgUf9GN2n_B5P_UIhHBXkX-GfStTCI73t1YfI2JY4I1gqP4v5bbQ)

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