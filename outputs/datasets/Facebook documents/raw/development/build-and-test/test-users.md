---
url: https://developers.facebook.com/docs/development/build-and-test/test-users
title: Test Users - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fbuild-and-test%2Ftest-users%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)
- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)
- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)
- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)


  - [App Roles](https://developers.facebook.com/docs/development/build-and-test/app-roles)
  - [Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps)
  - [Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users)
  - [Test Pages](https://developers.facebook.com/docs/development/build-and-test/test-pages)

- [Release](https://developers.facebook.com/docs/development/release)
- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users#test-users)

[Limitations](https://developers.facebook.com/docs/development/build-and-test/test-users#limitations)

[Creating Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users#creating-test-users)

[Testing With Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users#testing-with-test-users)

[Managing Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users#managing-test-users)

[Test User Graph API Endpoints](https://developers.facebook.com/docs/development/build-and-test/test-users#test-user-graph-api-endpoints)

# Test Users

We are temporarily removing the ability for apps to create new test users. This should not affect existing test users or apps where we temporarily request test users to be created for assessment purposes. We will share an update once access to creating new test users has been reinstated.

Unlike Testers, who are real people who have been granted a Tester [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on your app, test users are simulated Facebook user accounts that you can use to test your app's implementation of [Facebook Login](https://developers.facebook.com/docs/facebook-login/) and any [permissions](https://developers.facebook.com/docs/permissions/reference) or [features](https://developers.facebook.com/docs/features-reference) your app uses.

![Screenshot of Roles > Test Users in left-hand menu and Roles > Test Users panel displayed.](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/255441424_215743117348316_6745453838395605964_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=gnXRACBQW_EQ7kNvwFnaEHz&_nc_oc=AdoeGUngXttUpL1gDLCEq9YzwU6nL5sptPUAuFgDhNINuhciI9G6SqzIqliYukG1eeg&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ODwDz28A01ATv6R8b7UKIw&_nc_ss=7b289&oh=00_Af696jCrEdCXeIArRy-DcmNDNTDJUX14XLGCGBT5llJJuA&oe=6A25907C)

Test users cannot interact with real Facebook users, and any data you generate with a test user will only be visible to other test users on your app, or to real Facebook users who have an Administrator, Developer, or Tester role on your app. Test users are exempt from our spam and fake account detection systems, so they won't be disabled when you use them to test your app.

You can create, edit, delete, and login as a test user through your App Dashboard or the Graph API.

## Limitations

- Apps are limited to 10 test users.
- Do not create or maintain more test users than reasonably needed to test your app integration.
- Test users must only be used to test your app integration or simulate how your app performs.
- Test users can only be created by app [Administrators](https://developers.facebook.com/docs/development/build-and-test/app-roles#administrator) or [Developers](https://developers.facebook.com/docs/development/build-and-test/app-roles#developer).
- Test users can grant your app any permission while it is in [Development mode](https://developers.facebook.com/docs/development/build-and-test/app-modes#development-mode) but can only grant [approved](https://developers.facebook.com/docs/app-review) permissions while it is in [Live Mode](https://developers.facebook.com/docs/development/build-and-test/app-modes#live-mode).
- All features are active for test users while your app is in Development mode but only approved features are active for test users while it is in Live mode.
- Test users can only interact with other test users, or real users who have an Administrator, Developer, or Tester role on the app.
- Data generated by a test user can only be seen by other test users or real users who have a Administrator, Developer, or Tester role on the app.
- Test users can only interact with app-scoped [test pages](https://developers.facebook.com/docs/apps/test-pages).
- Test users can only comment on app Posts published via a Facebook Share Dialog or the Graph API.
- Test users cannot be converted to real users.
- Test users can only make enough API calls to simulate how an app performs in [Live](https://developers.facebook.com/docs/development/build-and-test/app-modes#live-mode) mode. They are rate limited differently than users who have a role on the app.

## Creating Test Users

You can create test users in the [App Dashboard](https://developers.facebook.com/apps) by going to the **Test Users** section in the **Roles** \> **Test Users** panel and clicking the **Create test users** button. This will open a dialog that allows you create up to 4 test users at once.

![Screenshot of Roles > Test Users in left-hand menu and Roles > Test Users panel displayed.](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/251929966_2062690150553539_1214803938353501072_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=f4ur7gHYcc8Q7kNvwEZnwKR&_nc_oc=AdqjAQL4QsYIBYR-KmFKJWJRwut93eW5Fz7n1b-rgpNo7IE6eQnboTJQC-D990i3I30&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ODwDz28A01ATv6R8b7UKIw&_nc_ss=7b289&oh=00_Af7F-T_S38l2ddnbP3wmDina-ErettUUgs1cBMStDAfT9g&oe=6A257083)

You can also choose to install the app for each of these users, which means to grant your app each of the permissions (authorization) you specify at the time of creation (you can always grant others permissions later).

The **Create Test Facebook Accounts** dialog allows you to:

- Create up to 4 test users at a time. If you want to create more in bulk, you should [use the Graph API](https://developers.facebook.com/docs/development/build-and-test/test-users#test-user-graph-api-endpoints) instead.
- Select whether each newly created test account will have the app installed by default.
- Select the [Graph API version](https://developers.facebook.com/docs/apps/versions) to use in calls.
- Grant [permissions](https://developers.facebook.com/docs/permissions) for the app for each test user.
- Add age restrictions.
- Choose the locale that the test accounts will use to view Facebook.

Once created, test users will appear in the **Facebook Accounts** table.

## Testing With Test Users

You can test your app with a test user by signing into Facebook Login using the test user account's credentials and granting your app any permissions it needs. You can also grant your app permissions on behalf of a test user by clicking the ellipsis icon ( **•••**) in the **Options** column within a given test user's row in the **Facebook Accounts** table. Clicking the ellipsis icon will give you the option to edit the permissions the test user has granted your app, generate User access tokens for the test user, and log into the test user's account.

![Screenshot of Options ellipsis dropdown menu.](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/255080591_637900490709141_4524220917586275948_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=LlMp22E6QXsQ7kNvwEhH5-3&_nc_oc=AdrW9UyFXFCKYZkeJGHZzEGTahI22l-Z4citAGMUIMXhK8RLoY1n-w_IjrlbmqzggEY&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ODwDz28A01ATv6R8b7UKIw&_nc_ss=7b289&oh=00_Af7I3Ur1VsRYepFAaL8nfT-Sdwht2UC5vjQHHtkZyHz5GQ&oe=6A25773D)

## Managing Test Users

The App Dashboard shows you a list of existing test users and allows you to edit the settings of any test user.

You can:

- Change the name or password for a test user.
- Change permissions a test user granted to an app.
- Get a valid access token for each test user.
- Add and delete this test user's friends.
- Get a new access token for a test user when an existing access token expires.
- Log in as the test user.
- Change the Graph API version used in calls for a test user.
- Delete any test user.

If you want to associate or disassociate an existing test user with other apps you will have to [use the Graph API](https://developers.facebook.com/docs/development/build-and-test/test-users#test-user-graph-api-endpoints).

## Test User Graph API Endpoints

If the App Dashboard is not sufficient for your needs or you would like to create more than 4 test users at a time you can use the Graph API.

App Administrators and Developers can use the [Application Accounts](https://developers.facebook.com/docs/graph-api/reference/application/accounts) endpoint to:

- Create new test user accounts for an app.
- Get a list of existing test users associated with an app.
- Get a valid access token for each test user.
- Associate and disassociate existing test users with an app.
- Get a URL to use to login as a test user.

App Administrators and Developers can use the [Test Account](https://developers.facebook.com/docs/graph-api/reference/test-account/) endpoint to:

- See details about a test user.
- Update a test user's name or password.
- Delete a test user.
- Create friend connections between test users.

On This Page

[Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users#test-users)

[Limitations](https://developers.facebook.com/docs/development/build-and-test/test-users#limitations)

[Creating Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users#creating-test-users)

[Testing With Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users#testing-with-test-users)

[Managing Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users#managing-test-users)

[Test User Graph API Endpoints](https://developers.facebook.com/docs/development/build-and-test/test-users#test-user-graph-api-endpoints)