---
url: https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings
title: Basic Settings - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fcreate-an-app%2Fapp-dashboard%2Fbasic-settings%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)
- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)
- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)


  - [App Audience](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-audience)
  - [App Categories](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-categories)
  - [Basic Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings)
  - [Advanced Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/advanced-settings)
  - [Data Deletion Callback](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback)
  - [Platform Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/platform-settings)

- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)
- [Release](https://developers.facebook.com/docs/development/release)
- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Basic Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#basic-settings)

[General Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#general-settings)

[App ID](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-id)

[App Secret](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-secret)

[Display Name](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#display-name)

[Namespace](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#namespace)

[App Domains](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-domains)

[Contact Email](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#contact-email)

[Privacy Policy URL](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#privacy-policy-url)

[Terms of Service URL](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#terms-of-service-url)

[User Data Deletion](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#user-data-deletion)

[App Icon](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-icon)

[Category](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#category)

[App Purpose](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-purpose)

[Business Verification](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#business-verification)

[Verification Status](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#verification-status)

[Data Protection Officer Contact Information](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#data-protection-officer-contact-information)

# Basic Settings

The Basic settings page gives you one place to configure important settings, like your apps' name, contact email, and category, and find the app secret assigned to your app by Meta. The settings listed in this document are needed for you to build an app on the Meta Platform.

## General Settings

General settings contains unique identifiers assigned to your app and allows you to provide additional information to further define and describe your app. These identifiers allows us to identify your app when it makes API calls, and helps us determine which permissions and features your app has been granted by app users, and are used to generate access tokens.

### App ID

When you create a Facebook app we generate and assign it a unique ID. This ID must be included when making any calls to our APIs. All of our SDKs provide a way for you to easily set this value in your codebase so that will automatically be included with any API calls.

### App Secret

Your app secret is used in some of the [Facebook Login](https://developers.facebook.com/docs/facebook-login) flows to generate an [App access token](https://developers.facebook.com/docs/facebook-login/access-tokens/#apptokens) which can make API requests on behalf of any user of the app. It is extremely important that an App Secret be stored securely and not be included in any code that could be accessed by anyone other than a developer of the app.

We recommend that App access tokens only be used directly from your app's servers in order to provide the best security. For native apps, we suggest that the app communicates with your own server and the server then makes the API requests to Facebook using the App access token.

#### Resetting App Secret

If your App Secret is compromised, you should reset it immediately in the [Basic Settings of your App Dashboard](https://developers.facebook.com/apps/). It is not possible to programmatically rotate the app secret.

If Meta discovers the app secret has been leaked and user data is at risk, Meta will notify you to reset the app secret immediately. If you do not reply in a timely manner, Meta will reset the app secret. This will cause all the business integrations to stop working as user data grants for the app will be revoked. This is a very disruptive process which will only happen if there is a risk to user data and you do not reset the app secret quickly.

### Display Name

The display name is the user facing name of your app that will be displayed in the [App Center](https://developers.facebook.com/docs/games/listing/). This field is required to switch your app to Live mode.

#### Display Name Guidelines

Follow these guidelines when choosing or modifying your app's display name, otherwise it will be rejected during [App Review](https://developers.facebook.com/docs/app-review).

- Do not use names that include Facebook or FB, or any names of Facebook products such as Oculus, WhatsApp, or Instagram.
- Do not use "F", "Book", or "Face" in your name if it could be perceived as a reference to Facebook.
- Do not use [our brands](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookbrand.com%2Ftrademarks&h=AUDIISuNpwp_Gb0CKLmxZk7IbdYQ29cqza1ryNC2M64SGnK8O7opk7tjGBvn56UUSL7lVsyZI6-xFkUexhDowyb-OIl7krzp2imQZyVOWDcxE0kSVoUn0CAF0bs4SIC76gnANNben-gxQbJE_o1SYQTDoC8) in a way that implies partnership, sponsorship, or endorsement by us.
- Do not combine any part of [our brands](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookbrand.com%2Ftrademarks&h=AUA3OJKoJSHmJZDRIxzbDWm3xc125s1KdigKE_RUnL8MKNHF7DSmJCrxljA7oKqgIoJ6_GQGzbJA7CLQuUBOXn4ti0tr0HPHnO9dlM66zeEg1m1o0UAfsUFcevGCeY_FDEgUqLTfETxF4A) with your name.
- Do not use names or logos that imitate or could be confused with [our brands](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookbrand.com%2Ftrademarks&h=AUDwXuTdNjFB-vbYD-0n1rie6fDS54p-3ytJwYu1qReAQLPVyksv1LP9mpDImJCrcsflh3qi495BgNWb2u9iqOW82zB8ofLuNYQISSsvLL_MoseUu-YzNnkR86dmodsrchBuftWsCmJkaQ)
- Do not present our brand assets in a way that make them the most distinctive or prominent feature of your app.

### Namespace

The namespace URL links to your app's Canvas page. The Canvas page is used to tell user about your app.

### App Domains

Domains and subdomains of your app for app installation and are used during Graph API request for verification.

### Contact Email

The contact email is the email address where [developer notifications](https://developers.facebook.com/docs/development/create-an-app/developer-settings) will be sent. These notifications will also surface in the Alerts in the App Dashboard. This field is required to switch your app to Live mode.

### Privacy Policy URL

The Privacy Policy URL links to your app's privacy policy that applies to your app users.

### Terms of Service URL

The Terms of Service URL links to the Terms of Service for your app that applies to your app users. This field is required to switch your app to Live mode.

### User Data Deletion

The User Data Delection URL links to explicit instructions for your app users on how to delete their data from your app. This URL may be the relevant section in the application's Privacy Policy.

The data deletion URL is called when users remove your app by way of the Facebook's Apps and Website settings page, and then in the Removed section, click your app and request that their data be deleted.

Learn more about [data deletion](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback).

### App Icon

The App Icon represents your app in the App Center. This field is required to switch your app to Live mode.

#### App Icon Guidelines

Follow these guidelines when uploading or replacing your app icon, otherwise it will be rejected during [App Review](https://developers.facebook.com/docs/app-review).

- Do not use or incorporate any of our logos, trademarks, icons, or any modified forms or variations of them. This includes logos, trademarks, and icons for any of our products, such as Facebook, Instagram, Oculus, or WhatsApp.
- Do not include "Facebook" or "FB".

### Category

Your app’s [category](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-categories) helps users discover new apps based on their search. This field is required to switch your app to Live mode.

### App Purpose

Your app's purpose is used during App Review to tell us how your app will access and use your data or data of others. This field is required to switch your app to Live mode.

## Business Verification

Business Verification is a process that allows Facebook to verify your identity as a business entity. This is required io access data that is not owned by you. While verification is not required to Go Live, you will not be able to access data you do not own until verification is complete.

Learn more about [Business Verification](https://developers.facebook.com/docs/development/release/business-verification).

### Verification Status

After you have submitted for verification, your status will be Pending then Verified once Meta has verified your Business information.

## Data Protection Officer Contact Information

The General Data Protection Regulation (GDPR) requires certain companies that serve individuals in the European Union to designate and publish contact information for a Data Protection Officer (DPO) who can assist with matters related to the processing of personal information. This information will be made available in your apps and website settings so that your app users can contact your DPO if they have questions about how their data is processed and used.

On This Page

[Basic Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#basic-settings)

[General Settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#general-settings)

[App ID](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-id)

[App Secret](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-secret)

[Display Name](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#display-name)

[Namespace](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#namespace)

[App Domains](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-domains)

[Contact Email](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#contact-email)

[Privacy Policy URL](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#privacy-policy-url)

[Terms of Service URL](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#terms-of-service-url)

[User Data Deletion](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#user-data-deletion)

[App Icon](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-icon)

[Category](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#category)

[App Purpose](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-purpose)

[Business Verification](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#business-verification)

[Verification Status](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#verification-status)

[Data Protection Officer Contact Information](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#data-protection-officer-contact-information)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUDybzabYet0A72Ym8m45mJtAmnppCjR026ESgIGLZJ0X1PU0c31iM_Yv0MOBEKYaVgKHaAHnoJc4LRKtl-AFJOTShmfDx7bUIUjjF14hdzCIcdepFwqokaYjI08DOvjulriuHneeNb9sQ) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUD8oneGUPW8hTKj4svZUl63hYxtQ1nOWfCXesbEgcfBzC5LAcMJ1Gi1vC_IzTAxm_vKVYFfCzasUyWsfyJ7UpTJCPBRG3LRfFxdLRUmpraKNxreWfAI-7MCu489tT-VrsTMtD1YIGuBGQ) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUD_ZCXx0mbTEG1PeJXPmYfK4hMKZ_R1sVW3QEQPTPSC7HowevRene57H0VwgypnPtnCiPDPYijG27eqYxvhLs0boWNXE_8ewPQ5_ZyrNc2CgJbdic6Hwl0D5lnD6hAKrI7iH3e9dw8THw) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUBPhPBjLsas-uPHYMmAr5FjELqz9_UEu8us3NQB2wnVrQvkSRDUTXykJ0MXdNcFVNCsqbzmfHh86TLMz5_yqNDA1uoLMffV1LDntNAOvAzTYpi5wMJuRqAHfLfLwoxcuvovtNGuEVWdIw)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUD2RB6Rj-0pByWAbF5Cpg8OEksTJCfi7vw1y9RlpTL5eVY3v0UZzH6teTgQfeGqhIiS_rTtut2F1cmZMYr4imGh-fAUF68rMrXP-PCW-SrgatWoK4WV-fHJ8RcIV9dapmU9fNosBOpcsg)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUDynrCNu5wkHDU_VOHq1dGeLfIqfmT2CIsPZcDzNTBwbvtC6Nd75oAp1Jx_gSZAXjF_tUSKMdqqfe-O6QpMKKK35fJs5RU84n0EL3PwIAC3LqQWZWheTIBMmhDf-MKHcS2_Fu7np1ovQA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUAsJkfIY8UjazuUVyI65bTujnGhsD8Gl3RJrPPkvrZd5ZlpjuDE5h2akCMZIVWN4JmXmcJvLUuxcsjN60GQQ3NzY9v3yGbr53Skw1z9GRHW9m1zK4yDpLGZw4S1uGPYpBukGxBr8HDtxA)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUBF_JP4nCgURwRmKg4TDqB5ZBIMeQBXrTmVn3999j3mLc-Q4TCHmDE8PCNjtk9xmUTSBAT7BH7c0bvXdArtQn8CLr6VLBrvSfPIQ9_j9_-nfo78pkOv2gudBAHqzK1GXw14hvAyzGThs599ehR4Fp6wHyk)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUAYlQlymqp7MLwuDRdCDE7wQcMSXpa2S4fpMCUjOezYnMi1hZD66UYRFjU4jFdvZzE5TNu0EyfeqMVcY-7Zfrqjeh4pmNkVWhVHQQrTEaoFfUIzhDNP4zOMKTdYelkQtXVqr7hH93szUg)

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