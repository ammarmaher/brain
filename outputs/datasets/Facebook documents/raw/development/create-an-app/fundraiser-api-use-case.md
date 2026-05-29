---
url: https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case
title: Fundraiser API Use Case - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fcreate-an-app%2Ffundraiser-api-use-case%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Customize the Share or create fundraisers on Facebook and Instagram Use Case](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#customize-the-share-or-create-fundraisers-on-facebook-and-instagram-use-case)

[Use case customization](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#use-case-customization)

[Permissions](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#permissions)

[Customize Facebook Login for Business](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#customize-facebook-login-for-business)

[Settings](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#settings)

[Quickstart](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#quickstart)

[Configurations](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#configurations)

[App Review](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#app-review)

[Publish](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#publish)

[Required app assets](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#required-app-assets)

[See Also](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#see-also)

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
- A [Privacy Policy](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPrivacy_policy&h=AUCe5Oh3N3oHvoddaBHMC2FBZFpd8urdle6nIZteWZYEyQBAhSKheVR3WkA073CTbpLf_GtzoKrsil55aqKyj08tsYhxJsZIKiUGzmKRo2SemTONqO_2bLONCH__dwo5Nfr0JX6K3wEThQ) URL for your app
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

On This Page

[Customize the Share or create fundraisers on Facebook and Instagram Use Case](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#customize-the-share-or-create-fundraisers-on-facebook-and-instagram-use-case)

[Use case customization](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#use-case-customization)

[Permissions](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#permissions)

[Customize Facebook Login for Business](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#customize-facebook-login-for-business)

[Settings](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#settings)

[Quickstart](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#quickstart)

[Configurations](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#configurations)

[App Review](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#app-review)

[Publish](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#publish)

[Required app assets](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#required-app-assets)

[See Also](https://developers.facebook.com/docs/development/create-an-app/fundraiser-api-use-case#see-also)