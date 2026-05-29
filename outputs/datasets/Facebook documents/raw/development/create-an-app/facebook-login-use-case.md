---
url: https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case
title: Facebook Login Use Case - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fcreate-an-app%2Ffacebook-login-use-case%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)
- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)


  - [App Ads Use Case](https://developers.facebook.com/docs/development/create-an-app/app-install-ads-use-case)
  - [Facebook Login Use Case](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case)
  - [Fundraiser API Use Case](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case)
  - [Instagram Use Case](https://developers.facebook.com/docs/development/create-an-app/instagram-use-case)
  - [Launch a game on Facebook Use Case](https://developers.facebook.com/docs/development/create-an-app/launch-a-game-on-facebook-use-case)
  - [Marketing API Use Cases](https://developers.facebook.com/docs/development/create-an-app/marketing-api-use-cases)
  - [Messenger Use Case](https://developers.facebook.com/docs/development/create-an-app/messenger-use-case)
  - [oEmbed Use Case](https://developers.facebook.com/docs/development/create-an-app/oembed-use-case)
  - [Pages API Use Case](https://developers.facebook.com/docs/development/create-an-app/pages-use-case)
  - [Threads Use Case](https://developers.facebook.com/docs/development/create-an-app/threads-use-case)
  - [WhatsApp Use Case](https://developers.facebook.com/docs/development/create-an-app/whatsapp-use-case)

- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)
- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)
- [Release](https://developers.facebook.com/docs/development/release)
- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Customize the Authenticate and request data from users with Facebook Login Use Case](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#customize-the-authenticate-and-request-data-from-users-with-facebook-login-use-case)

[Customize use cases](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#customize)

[Permissions and features](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#permissions-and-features)

[Add more use cases](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#add-more-use-cases)

[Next Steps](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#next-steps)

[See Also](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#see-also)

# Customize the Authenticate and request data from users with Facebook Login Use Case

This document shows you how to customize the **Facebook Login Use Case** use case you added to your app during the [app creation process](https://developers.facebook.com/docs/development/create-an-app/).

## Customize use cases

### Permissions and features

1. If you are not already on the **Use cases** page of the dashboard, click **Use cases**, or pencil icon, in the left-side menu.
2. Click on a use case to view the permissions and features that are available, both required and optional, for that use case.
3. Click the **Add** button to the right of each permission or feature you'd like to add. If, during development, you find that your app doesn't use the permission or feature, you can return here and remove it.
4. Additional actions are available for certain permissions and features.

   - To request a higher rate limit for the Ads Management Standard Access feature, click the **Actions** button and select **Request higher limit**.


     - If you are ready to submit your app for App Review, continue to the [App Review section](https://developers.facebook.com/docs/app-review). If not, click **Use cases**, or pencil icon, in the left-side menu to continue to customize your use cases.
   - To increase access for the `public_profile` permission, allow your app to serve user who don't have a role on your app or the business connected to your app, click the **Increase access** button.
   - If, during development, you find that your app doesn't need a higher rate limir or increased access to `public_profile`, you can return here and remove it.

| Use Case Feature or Permission | Allowed Actions |
| --- | --- |
| [`email`](https://developers.facebook.com/docs/permissions#email) | Optional for all use cases. |
| [`public_profile`](https://developers.facebook.com/docs/permissions#public_profile) | **Required for all use cases**. |

#### Settings

Facebook Login allows you to control oAuth settings, and add a deauthorization callback URL and redirect URI validator.

#### Quickstart

The Facebook Login quickstart allows you to quickly get the code to implement Facebook Login into your app.


After you add a permission to your app, you can see the status for that permission:


- Ready for live mode – This permission has been approved in App Review and you can publish your app

- Ready for testing – You can test API calls to endpoints that require this permission and complete App Review permission testing requirements

- Verification required – This permission requires a verified Meta Business Account added to the app





You can also see the number of successful API calls you have made to endpoints that require each permission.



## Add more use cases

Click the **Go back** button in the upper right or **Use cases** in the left side menu to add more use cases to your app.

These are the use cases most commonly used with the use case you chose when you created this app.

| Use case | Available permissions to add and code to implement |
| --- | --- |
| **Use additional Facebook user data for personalization** – <br>Choose data permissions to personalize the app experience for users logging in with their Facebook account.<br>**Only add permissions that your app will use.**<br>All of these permissions require App Review before you can publish your app and go live. | `user_age_range`<br>`user_birthday`<br>`user_friends`<br>`user_gender`<br>`user_hometown`<br>`user_likes`<br>`user_link`<br>`user_location`<br>`user_photos`<br>`user_posts`<br>`user_videos` |
| **Track engagement with App Events** – Meta App Events allows your app to understand how people engage with your business across, devices, platforms and websites. | [Meta App Events](https://developers.facebook.com/docs/app-events/overview/) |
| **Get real-time notifications with Webhooks** – Get automatic HTML notifications when app users make changes related to the permissions that you've added to your app. | [Meta Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/) |

## Next Steps

Now that you have successfully customized your Facebook Login use case, let's [update the settings for your app](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings) on the app Dashboard.

## See Also

To learn more about the concepts, endpoints, and permissions mentioned in this document, please visit the following guides:

- [Facebook Login Overview](https://developers.facebook.com/docs/facebook-login)

- [Meta App Events Overview](https://developers.facebook.com/docs/app-events/overview/)

- [Meta Webhooks Overview](https://developers.facebook.com/docs/graph-api/webhooks/)

- [Permissions Reference](https://developers.facebook.com/docs/permissions)


On This Page

[Customize the Authenticate and request data from users with Facebook Login Use Case](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#customize-the-authenticate-and-request-data-from-users-with-facebook-login-use-case)

[Customize use cases](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#customize)

[Permissions and features](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#permissions-and-features)

[Add more use cases](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#add-more-use-cases)

[Next Steps](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#next-steps)

[See Also](https://developers.facebook.com/docs/development/create-an-app/facebook-login-use-case#see-also)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUBTgfGwK9768NlZjhFqsC_Q67XD026wk4ljB7zqCh4XAcBmBVDK-vbQcD33HLdtX6pCtQmnSAru4_FgsXfzWoTeZdreEEcdw3EWcy4s17nBtU74_wGSsVyhUwWbkvtg0fKLMpGwDO-C5A) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUCLqUIQPN8S7LsLECwo4NmNbzKs2thJ9ajFNwvg9Yoihy76WYvrEIX9bZ2ls2nP_PwWH0yOqn0DcLNoG7LkGp2vAhqBJY9Swrvg-OWiz_CzcEzP8ncKtKIdzVQqptKkYypCbl_K-2engg) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUDeHZbGwueeG-_35oAqM_Uh7K7iwEehG0zhFu32EcU_xwoydAoY4N2iMMiE6aZ1VY4AZCP70E_RUCUfJctY0suyqwWtGcodZqm9nK74jrJ-aDOXxL4VMVh07pkI2sq_FOdNcgOzo3Vt-A) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUCeC-t6M-4op7-bYSBk1PYz2bX_Oyr7rIvLZhF4stSDukTRtoUSGe5Y85lgqa_vOOsZafSHJdkSkETZp28xVgH_p4sD903ACrGZigANOrgC12709NSWHsbHsuPhUcIRkjCS3u08qIDpTQ)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUBRl2a-M-uNL2_VYsqdIQNURWnaB1CzE05P62YwiejIdBRtf8A60v-FzqYl7KxmcxrY2rgpmY8ZBp-INPxZXENoIPzOx9iVCHYlpxXEwedb7K1jQ0nK9W57Cq0tH5yh6fbMY0pxcmWEQw)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUBvdi1EQAhjcWm7vUprEItB1uzlQOouAwzZsA_-DftYgM7bgayuGIUv0wTumAfuBLT9dq0lBEWnq_PlCAe4Vv1XL5LAhnEfgH4d8JCiQVWJgUJh9fnRfpFpcCMhNEW4X779t4MSHjerTw)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUAWtHtovifuENnwKwHCtAPxeti6aCcjVKJBn2KjAO4Amr5VjWNXOBSvO4Q2boSWxGXA6rlJ2NcPETiZUkZQQcbAEb25SP1WkrzDn38dz4RsFonIv7wuJyqNDE3P430qRahNO5YAXZ3-Uw)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUBAfcLZnDKrfuolidXLiw02navBxzDU4Yl5YejvyQ2xNVOLpv6pYLg3rdH-ohNNw-w7vD7c9HLghinX7YWoE-C2dZHALftSk6By88aDkD6q3KwAG89yglriQC3AJ2zrKLapfBrOzT8FIgWLqVj4WB1BOlw)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBAZj0ivNqGhUqeikBaxl9yGWi2Q38qxCrw0ydnB-s4W90mV-c0PLtXmvCYQfVBPy6894WWrQpdMGDxNJvrI1v26txOBG343CzkZYLykMznF3bwzfk6cUf6f0yVemNp3S_c_IaFc1B6wA)

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