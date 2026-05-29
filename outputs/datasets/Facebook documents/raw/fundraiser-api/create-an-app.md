---
url: https://developers.facebook.com/docs/fundraiser-api/create-an-app
title: Create an app - Fundraiser API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Ffundraiser-api%2Fcreate-an-app%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Fundraiser API](https://developers.facebook.com/docs/fundraiser-api)

- [Learn](https://developers.facebook.com/docs/fundraiser-api/learn)
- [Plan](https://developers.facebook.com/docs/fundraiser-api/plan)
- [Create an app](https://developers.facebook.com/docs/fundraiser-api/create-an-app)
- [Integrate](https://developers.facebook.com/docs/fundraiser-api/integrate)
- [Reporting](https://developers.facebook.com/docs/fundraiser-api/reporting)
- [FAQ](https://developers.facebook.com/docs/fundraiser-api/faq)

# Customize the Share or create fundraisers on Facebook and Instagram Use Case

This document shows you how to customize the **Customize a Meta app with the Share or create fundraisers on Facebook and Instagram Use Case** use case you added to your app during the [app creation process](https://developers.facebook.com/docs/development/create-an-app/).

#### Existing apps

If you have an existing business app that you created with the Fundraisers product with the `manage_fundraisers` permission, you can still submit this app for App Review. [Learn more.](https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review)

### What are permissions and features?

**Permissions** are how your app asks someone if it can access their data stored on Meta's servers. [Learn more.](https://developers.facebook.com/docs/facebook-login/guides/permissions/)

**Features** are authorization mechanisms that allow your app to access specific endpoints that don’t require explicit consent from your app users in order to access the user’s data for a specific purpose. [Learn more.](https://developers.facebook.com/docs/features-reference/)

When customizing a use case, you will see a list of permissions and features that are available for the use case. A use case has permissions that are required for the use case to work proper. These required permission can't be removed. A use case might also have optional permissions that you can add that provide additional functionality. Optional permissions can be added or removed at any time during development. **Only add optional permissions that your app needs in order to work the way you want it to.**

## Use case customization

1. Click **Dashboard** in menu to the left in the App Dashboard. Each use case that you have added to your app is listed here.
2. Select the use case you want to customize. This allows you to add settings and permissions to make your app work the way you want it to.
3. Add permissions that your app needs and remove permissions that your app doesn't need.

   - If a permission or feature is required for a use case, it can't be removed.
4. Click **Ready to test** to test each use case. If you need to submit your app for Meta App Review, you must test each use case. The [**Meta's Graph API Explorer**](https://developers.facebook.com/tools/explorer) allows you to test your queries and get access tokens and code samples for your queries.
5. Click **Dashboard** to repeat the above for each use case.

### Permissions

To customize the Fundraiser API use case, select **Share or create fundraisers on Facebook and Instagram**. You are redirected to a list of permissions.

The `manage_fundraisers` permission is required for this use case and added by default.

Click **Add** next to each additional feature or permission that your app needs to work the way you want it to.

## Customize Facebook Login for Business

If you are implementing [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business/) in your app, follow these steps.

### Settings

1. Click **Facebook Login for Business** in the menu to the left in the App Dashboard.
2. Select **Settings**.
3. Add your **Redirect URI** and click **Check URI** to validate it.
4. Customize the **Client OAuth settings**.
5. Add your **Deauthorize Callback URL**.
6. Add your **Data Deletion Request URL**.
7. Click **Save changes**.

### Quickstart

Use the Quickstart to add Facebook Login for Business to your app.

1. Click **Quickstart**.
2. Select and customize each platform for this app.
3. Add the **Facebook Login Button** to your app.

### Configurations

This optional feature of Facebook Login for Business allows you to create multiple configurations and present them to different sets of users. Configurations allow you to choose:

- The type of login variation to present to your app users.
- The type of access token you want to request from your business clients, a User access token or System-user access token and token expiration
- If you select User access token then your app users will log in using their personal Facebook account.
- If you select System-user access token your app users will be required to log in using a business portfolio. This is only required if this configuration needs continuous access to business assets, such as Facebook Pages, ad accounts or Instagram accounts.
- The business assets you want to request from your clients.
- The permissions your app users are required to grant your app.

## App Review

If you are submitting an existing business app with Fundraiser product for App Review, please visit our [App Review documentation](https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review) to learn how to submit your app. If you are submitting a new use case app, following these instructions:

1. In the left side menu go to **Review > App Review**. Click the **Edit** button to start your submission. All permissions and features you are requesting, with links to the documentation for each, are listed here.
2. **Complete App Settings** – Click **Review your app settings** to add or update any [app settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings) such as app icon, privacy policy URL, and app category. **This step must be complete before continuing.**
3. **Reviewer instructions** – Click **Provide reviewer instructions** A popup dialog appears for each platform on which you app is available. Select each platform and answer the questions with questions for our reviewers to test your use case implementations. Click **Done**.
4. Click each permission and feature you requested.
5. Click the checkbox to agree to use each permission or feature in accordance with its allowed usage. If your app doesn't use a permission or feature listed, remove it by clicking the trashcan icon.
6. Click the **Submit for Review** button in the lower right.

## Publish

### Required app assets

To publish your app, you need the following assets:

- An app icon – Your app's unique icon image; this file must be less than 5 MB, between 512 x 512 and 1024 x 1024 pixels, and in JPEG, GIF or PNG format.
- Contact information for a Data Protection Officer, if you are doing business in the European Union.
- A [Privacy Policy](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPrivacy_policy&h=AUBFI6OwxHWx-nDimKBy3p1xzvE6Mf9m6MYMD1JyPVmVPKltGD7O2Ahi0QDvPM9_6OGxXULUuygIFBMM_NhyYBM8IsYpeJwO8-afL98Y0xxAMTE0J-G_Rkc3g_jzGxnts7noHdyaoE8yoQ) URL for your app
- A [data deletion](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/) URL with instructions or a callback that allows your app user to delete their data from your app.

1. When you are ready to publish, select **Publish** in the left side menu.
2. **Review** your use cases and requirements.
3. Click **Publish** in the lower right corner.

Congratulations on completing your app!

## See Also

Visit the following to learn more about the app development process:

- [App Development](https://developers.facebook.com/docs/development)
- [App Review](https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review)
- [Business verification](https://developers.facebook.com/docs/development/release/business-verification)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Fundraiser API Developer Documentation](https://developers.facebook.com/docs/fundraiser-api)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUAWU-diDb1nLYoXJwiWTcizoFL40AEM9cg6e7ivvXejFA4A3WIAoIo-Y8e-nDDaJt-eN1QnvKq4fhJ5ECUF5CTfD_SItLdyZ6tSNP3MDQVC4zD6iDpfQUJ2lbSnlsfV4eTZZ8cLdl9P3Q) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUCAb5n1Pa1ew7XHV83iSitdwHq8Ze1EJrLbfAzWc1NVQIGWfGnE6ulO8L8fllqdoID02wiPXzW1SRK33iKuXAAv5-rsJ_k5VDOlTWR4Y16RSBMPVEz_3bq8AukEI_MM-RIIABxLByFN1A) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUAVJA6a5Q6nj5vYeuFjXpnNQ0v-tCXHHTXHM9-0OVyUAYy10AnBp-q3RqWZYDAMBKzt96cFXOVl_i8ZBQxPChoeBx-07_yDV-ttxLFIeDBrAVdXY56AZcequEQYtpvN_lW24p7K4J4RDQ) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUDlVbyOoZ0j7IOsaT9B8VEt8-UjyZnvk3jmeP6DqnQSv3LGw5A5-dvicXXg5F9dwT3nv7dQ3WWJnIx-cAw1PaFhVlAYMo2KVh7d_uG3cKB_xm1KIWNpZ7SlNBKDrDmPDI10ydFEQmkS6Q)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUBtn9aURcntgHnrbg0cQ1L_i7f7v4alaRpPmjGqVopgCgIvYi6ZrfuY0Fv9o8PU_akj3Sl8RPb5wZaDi2__rF5ADs5tpAgCNVlQKRJGx3Bc8szi_q6r38qgiNMnTF_FMj0DhXvmKwZBEg)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUCZf3dnr--gmZuzFn1_SK71pvj0lSQ67FQsF5JuFc-Ev-MDI5tNbYKgbNuMYZchtkGgggiCgYv2ReMEYGfZrGVvtLpS3DDTrh2bkhRCsaCxxAsQMfEQIPP6PRJ4bILwfXUBZPiij-sCUg)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUBn5dnK-uXyi-OzhCUfKLSA1e_ZtA_G_FIoR6NNo--ekI5asKwYC6nj4iGFQo0N2sqIVEBmDebwuOiR7z16EPWwRrSlxU8DWHbulWI8sqUsr7BjBtkLBvCinqSkei_BBYaR3wmPhQAfaQ)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUDAC372bO4bjiV3iE78GJ5ZWI1cRazHcpPufM178HRYb9jQbMJmyG7_pJVRotDcDmydknsYazHBgOckG2BBwPb6C1d9aWd-h7041Bkhlr078AKGz6f-n5Tfv3SZhNv2vT1WNkHaP_KOzQ)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUALxmAU3aUFhS-4QIKqRkOuGdEqVrNGsrE2sVnFpLCGDBB6dYJ0ZuR1Vr74PTDw_OJVe9KdkU_icOOuNcZSWNweXu7EgmuO88p7KXdxDSB8YhSmpNZr3XHrvmMyVxeC7bMykvXzAhIM5Q)

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