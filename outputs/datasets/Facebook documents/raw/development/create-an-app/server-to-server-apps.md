---
url: https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps
title: Server-to-Server Apps - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fcreate-an-app%2Fserver-to-server-apps%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
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

[Server-to-Server Apps](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#server-to-server-apps)

[Basic Settings](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#basic-settings)

[App Icon](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#app-icon)

[Business Use](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#business-use)

[Live Mode](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#live-mode)

[Privacy Policy](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#privacy-policy)

[Platform](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#platform)

[App Review](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#app-review)

[Add Details](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#add-details)

[Platform](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#platform-2)

[Testing](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#testing)

[Business Verification](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#business-verification)

# Server-to-Server Apps

Server-to-Server apps are apps that do not have a user interface. These apps are generally pulling backend data, such as products for a catalog.

If your app has no user interface because it exchanges data directly with our APIs, refer to this guide when configuring your app's [basic settings](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings), and when completing [App Review](https://developers.facebook.com/docs/app-review).

## Basic Settings

![Screenshot of Settings > Basic in left-hand menu and Basic panel displayed.](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/132566615_1118590981894790_1639212399989706470_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=EkJYPXQxUAgQ7kNvwFfFT_8&_nc_oc=AdrLdq15UFpdptg08ntP1sUS_9O-fZdgepzXssc5ZjWXyd_12WF7GTOoDm-dDM40Wlg&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=9MLiYwKuUiQoB1b5EETTng&_nc_ss=7b289&oh=00_Af65SZ-ii-EgybCCjlVRiJ4VGAhmWuPPSlzrM2d6PdwOxg&oe=6A2590D3)

### App Icon

If you are building an app on behalf of a client who will ultimately own the app, use a logo that identifies your client or the client's app icon. In all other cases, use your own company's logo or app icon.

Learn more about [app icons](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/basic-settings#app-icon).

### Business Use

If you are building an app that you will use to access your own data on Facebook, or building an app for a client who will ultimately own the app and only use it to access their own Facebook data, select **Yourself or your own business**.

If you are building an app that other businesses will use to access their data on Facebook, select **Client**.

### Live Mode

Even though your app may not have a user interface, or be available publicly, switching to [Live mode](https://developers.facebook.com/docs/development/build-and-test/app-modes#live-mode) just means that your app will start interacting with our API using live data instead of data generated by app admins, developers, or testers.

We recommend that you only switch to Live mode after your app has undergone App Review.

### Privacy Policy

This should be the privacy policy that applies to your app's users. For example, let's say you are building an app that you own, but that will be used by other businesses. The other businesses will want to know what privacy policies you have in place before they agree to use your app, so you should enter your privacy policy link here.

### Platform

Platform refers to the platform that your app users use to interact with your app. Since your app does not have an interface and your users don't interact with it directly, set this to Website and provide the URL to your company's website.

## App Review

The majority of the [App Review](https://developers.facebook.com/docs/app-review) steps should make sense for server-to-server apps. For any confusing steps, you can follow these guidelines when providing details about how your app will use the [permissions](https://developers.facebook.com/docs/permissions/reference) or [features](https://developers.facebook.com/docs/apps/features-reference) you are including with your submission.

### Add Details

If you are asked to describe how you will be using a specific feature or permission, describe how the data provided by that feature or permission will ultimately be used.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/70885669_930052340691415_3340542390787112960_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=5tkcaJZBh2MQ7kNvwGg02ad&_nc_oc=AdpAl0B7TrANwMPTAtqdWc-mCdgMkW7BmfY4iXBXQ8QMHsBxhyqQ2b5TIokHucGZx4M&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=9MLiYwKuUiQoB1b5EETTng&_nc_ss=7b289&oh=00_Af4n9NwfVGs5SxOg7rlfz-rYwDMvrpHPL6lpg6pCSxOfxg&oe=6A256E7C)

If you already have a working relationship with Facebook, such as an Ad Account that you are working with, describe that relationship as well.

### Platform

Set this to **Website**.

### Testing

Since there's no easy way for us to test your app, describe how the data provided by that feature or permission will ultimately be used. If you were already asked to provide a description, you can reuse that description here.

## Business Verification

If you are required to undergo [Business Verification](https://developers.facebook.com/docs/development/release/business-verification), and your company will own the app, complete the steps using your company's business information. If you are developing the app on behalf of a client who will ultimately own the app, use the client's business information instead.

On This Page

[Server-to-Server Apps](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#server-to-server-apps)

[Basic Settings](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#basic-settings)

[App Icon](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#app-icon)

[Business Use](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#business-use)

[Live Mode](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#live-mode)

[Privacy Policy](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#privacy-policy)

[Platform](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#platform)

[App Review](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#app-review)

[Add Details](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#add-details)

[Platform](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#platform-2)

[Testing](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#testing)

[Business Verification](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps#business-verification)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close