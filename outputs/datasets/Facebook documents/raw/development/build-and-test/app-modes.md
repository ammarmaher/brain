---
url: https://developers.facebook.com/docs/development/build-and-test/app-modes/
title: App Modes - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fbuild-and-test%2Fapp-modes%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)


  - [No Use Case](https://developers.facebook.com/docs/development/create-an-app/no-use-case)
  - [Other App Types](https://developers.facebook.com/docs/development/create-an-app/other-app-types)


    - [App States](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-states)
    - [App Modes](https://developers.facebook.com/docs/development/build-and-test/app-modes)
    - [App Types](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-types)

  - [Instagram Platform](https://developers.facebook.com/docs/development/create-an-app/other-app-types/instagram-apis)
  - [Server-to-Server Apps](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps)
  - [Permission Mapping](https://developers.facebook.com/docs/development/create-an-app/use-cases-permission-mapping)

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

[App Modes](https://developers.facebook.com/docs/development/build-and-test/app-modes/#app-modes)

[Development Mode](https://developers.facebook.com/docs/development/build-and-test/app-modes/#development-mode)

[Live Mode](https://developers.facebook.com/docs/development/build-and-test/app-modes/#live-mode)

[Switching Modes](https://developers.facebook.com/docs/development/build-and-test/app-modes/#switching-modes)

[See Also](https://developers.facebook.com/docs/development/build-and-test/app-modes/#see-also)

# App Modes

An app's mode determines who can use the app. App users can be broadly split into two groups: users who have a [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on the app itself ( **role users**) and those who do not ( **non-role users**).

## Development Mode

Apps in Development mode can only request [permissions](https://developers.facebook.com/docs/permissions/reference) from [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) users, and only permissions with standard or advanced [access levels](https://developers.facebook.com/docs/graph-api/overview/access-levels). Similarly, [features](https://developers.facebook.com/docs/apps/features-reference) will only be active for role users, and only features with standard or advanced access levels.

Apps in Development mode cannot be searched for by the public through our tools and APIs, and if your app is eligible to be listed in the [App Center](https://developers.facebook.com/apps), it will be hidden.

Any data generated while an app is in Development mode, such as test posts, can only be seen by role users. However, that data will be visible to non-role users once the app is switched to [Live](https://developers.facebook.com/docs/development/build-and-test/app-modes/#live-mode) mode.

All newly created apps start out in Development mode and should not be switched to Live mode until app development is complete.

## Live Mode

Apps in Live mode can request [permissions](https://developers.facebook.com/docs/permissions/reference) from anyone, but only permissions approved through [App Review](https://developers.facebook.com/docs/app-review). Similarly, only [features](https://developers.facebook.com/docs/apps/features-reference) approved through App Review are active for app users.

[Consumer](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-types) apps behave a little differently since they also rely on [access levels](https://developers.facebook.com/docs/graph-api/overview/access-levels). Consumer apps in Live mode can request permissions with Advanced Access from anyone, but permissions with Standard Access can only be requested from role users. Similarly, Advanced Access features are active for everyone, but Standard Access features are only active for [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) users.

Apps in Live mode can be searched for by anyone using our tools and APIs, and if eligible, can be listed in the [App Center](https://developers.facebook.com/apps).

You should only switch it to Live mode after you have completed app development and have completed App Review. Note that, data generated while in [Development](https://developers.facebook.com/docs/development/build-and-test/app-modes/#development-mode) mode such as test posts will become visible to all app users once you switch.

## Switching Modes

App administrators can use the app mode toggle in the App Dashboard toolbar to switch between modes.

![Screenshot of App Mode Toggle in the top toolbar.](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/132548785_157784576104170_8580811177349617583_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=StshxEmRHXsQ7kNvwHPD0aB&_nc_oc=AdpuOtQSzt3Um9SxCtvdtc6PNO4zptllNUIio7BET0y9b-pvKOWrfFd-K1rf8-7B4eo&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=-yM5UBRV4Gj42fHwR5c89w&_nc_ss=7b289&oh=00_Af6ilta1oMmEjpbvSrVSTKYMesRfwsU9KD4ZiT7K5U50tw&oe=6A242E0F)

## See Also

- [Access Levels](https://developers.facebook.com/docs/graph-api/overview/access-levels)
- [Marketing API Access Levels Guide](https://developers.facebook.com/docs/marketing-api/overview/authorization#access-levels)

On This Page

[App Modes](https://developers.facebook.com/docs/development/build-and-test/app-modes/#app-modes)

[Development Mode](https://developers.facebook.com/docs/development/build-and-test/app-modes/#development-mode)

[Live Mode](https://developers.facebook.com/docs/development/build-and-test/app-modes/#live-mode)

[Switching Modes](https://developers.facebook.com/docs/development/build-and-test/app-modes/#switching-modes)

[See Also](https://developers.facebook.com/docs/development/build-and-test/app-modes/#see-also)