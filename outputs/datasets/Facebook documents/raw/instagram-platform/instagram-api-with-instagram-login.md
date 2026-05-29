---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/
title: Instagram API with Instagram Login - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-instagram-login%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/#instagram-api-with-instagram-login)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/#limitations)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/#next-steps)

[See Also](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/#see-also)

# Instagram API with Instagram Login

The Instagram API with Instagram Login allows
[Instagram professionals](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F502981923235522&h=AUCtUnxxp0NNSc5NueijwjT6ZxRLHpioqcPn9KCFx8dMZHevAiSRyHlq68WpSttltX2WHc8lAI7ShR8pCT4iYgecaQ5hPskPIfB2yTI8rU8aTd5ekhHOTpOObClvBTpMW4nNUfcqWOZ5cg)
— businesses and creators — to use your app to manage their presence on Instagram. The API can be used to:


Instagram Media Insights are now available for Instagram API with Instagram Login. [Learn more.](https://developers.facebook.com/docs/instagram-platform/reference/instagram-media/insights)

- **Comment moderation** – Manage and reply to comments on their media
- **Content publishing** – Get and publish their media
- **Media Insights** \- Get insights on their media
- **Mentions** – Identify media where they have been @mentioned by other Instagram users
- **Messaging** – Send and receive messages with customers or people interested in their Instagram account

**Note:** This API setup does not require a Facebook Page to be linked to the Instagram professional account.

To ensure consistency between scope values and permission names, we are introducing new `scope` values for the Instagram API with Instagram login. The new `scope` values are:

- `instagram_business_basic`
- `instagram_business_content_publish`
- `instagram_business_manage_messages`
- `instagram_business_manage_comments`

These will replace the existing `business_basic`, `business_content_publish`, `business_manage_comments` and `business_manage_messages``scope` values, respectively.

Please note that the old scope values will be deprecated on **January 27, 2025**. It is essential to update your code before this date to avoid any disruption in your app's functionality. Failure to do so will result in your app being unable to call the Instagram endpoints.

## Limitations

- This API setup cannot access ads or tagging.

## Next Steps

Next, read the [**Overview**](https://developers.facebook.com/docs/instagram/platform/instagram-api/overview) to learn about the core concepts, components, and usage requirements for this API.

## See Also

- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-api)
- [Instagram Messaging with Messenger Platform](https://developers.facebook.com/docs/messenger-platform/instagram)
- [Instagram professional accounts](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F502981923235522&h=AUDI6tiOcIqLJIpQ6lrsZLeVCZiML0W6hIzAS8hxFToWVIkCqxA0itMKbqZ0Pg8d7ixgkMeyxfMJ0EnRwRrHxx5izoSorhiUDK1eFu2sUYYbgH_1h2_qDGQYYlxwb0JDov3GCQlAzoZGJg)

On This Page

[Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/#instagram-api-with-instagram-login)

[Limitations](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/#limitations)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/#next-steps)

[See Also](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/#see-also)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUDA_Kn2xNbWJF_-ttwyvBZp_2hl7k4_FGMxeLEmvZDnP24lRxbFKsNv8T-NgBWlDg7MvfWYcopA_7m4zoiKel4XoFfKL-1N9sskj0QunfwNumktdRPlX_KlnFUxlgkejcBNwbRIVtrmVg) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUDU5Qm0knGmlD9kx-DOdPyyXmuBDXYen-1h9BfgPhdDpDy1D-8MBK3_wSIy21t0vX-J7D6E7NeLy-kRsDe3hm5rGzJs-9KAgHWhfjqDKu4FfUmlGYvDaQaEsc6Hzr8WHZH4TEqVD_0ugA) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUC_BMxM19PoC8SwIVg6YAjhc0Bs0CNtmGLACIlQcxYzDRZndOTE938RfI_WiDuFmDR23mZhENV2ToliQRoIVkyzDrP5Wd7KebIkt6AtNvumUQW1y6MUkYWcfTGXYt42UWMlTClBmInjXw) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUBu46Rbd-95pgi_qBl0qWfc60XpZD5Rb1f2pyJhQJbUv_N1YFFjmOmBsz-qVVDfnSBkGVG4hN51o4JiDfCko4FvMmIp5yx-Pz5uqu6j8zRLO5RYfDac_DOofHFGA_Nt8I671kCLJLx45Q)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUAxOXIRH-q-lVQeZDq8NToAIdQQgCEURw8zahAXf00ahc6ZQnk9rt4kdSUoeTFff2ADJDJYlSLyD8KPKSQ7Q5Z_KfBVsojw8u4yyejndSVj6qBP01QC7_KxfddR-FcIutG2UnokhwjfVw)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUB5vMlSjg1J6v1HFqIicDv4H3EyIdTUc3196aXLwjAzQ5Q4wN2rlbkcz4IxNigGvLI_K9zb0NREc76vsSSIYefNAJAeQNyGtsiyoluXRqocOkMEmEYjSD4innE-A2N43sG0dtwn0JgyLQ)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCFcWDaU0O4dWPT4akcS383We68MOw5Hjmy4WbvuDYDLqQZrB42yRiPvTw3_-8rNjtLI9OVdfyxWxvgpAsuiY3Lg7vVXJw4rg_Uq5khjUl6KhPNUP2UUnCzx9UyKZ6ZtK6N1eLFd-6aTQ)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUAXVZmrLVqWqn1pfsTKoFKbc0HvdJy4T0bA3AdeShHVy948v-1QAoU9Lva9YJ7caFzWw5bCPpq3WOpGZo0RX8Jx-53GNHJOQd3VGBzvH823CkrovMZWcfDb6fnw3tbC8gxIeXu4F_By_g)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBQb5XZe23QvwSaWaB5sGaJQXIwNEWHRc30Q9G5N_1r0pxKBw3Clp6Y7uSVFcCw2XEc1o9Fwj3WHGQtevESfN957fDJ5DIiXzu3-lnKsJWTw-AYSJZBU_geTe2ZvqOccVxjKSBwoXPqlg)

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