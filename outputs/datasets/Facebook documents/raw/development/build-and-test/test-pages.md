---
url: https://developers.facebook.com/docs/development/build-and-test/test-pages
title: Test Pages - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fbuild-and-test%2Ftest-pages%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Test Pages](https://developers.facebook.com/docs/development/build-and-test/test-pages#test-pages)

[Limitations](https://developers.facebook.com/docs/development/build-and-test/test-pages#limitations)

[Creating Test Pages](https://developers.facebook.com/docs/development/build-and-test/test-pages#creating-test-pages)

[Managing Test Pages](https://developers.facebook.com/docs/development/build-and-test/test-pages#managing-test-pages)

[Test Pages Graph API Endpoints](https://developers.facebook.com/docs/development/build-and-test/test-pages#test-pages-graph-api-endpoints)

# Test Pages

Test pages are [test user](https://developers.facebook.com/docs/development/build-and-test/test-users)-generated Facebook Pages that you can use to simulate real Facebook Pages when testing your app in [Development](https://developers.facebook.com/docs/development/build-and-test/app-modes#development-mode) mode. Test pages cannot interact with real Facebook users, and any data you generate with a test page will only be visible to test users on your app, or to real Facebook users who have an Administrator, Developer, or Tester [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on your app. Test pages are exempt from our spam and fake account detection systems, so they won't be disabled when you use them to test your app.

## Limitations

- Test pages can only be created by [test users](https://developers.facebook.com/docs/development/build-and-test/test-users).
- Test pages can only interact with test users or real Facebook users who have an Administrator, Developer, or Tester [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on your app.
- Only test users who are friends of a test user who created a test page can interact with the test page.

## Creating Test Pages

To create a test page, log into one of your app's [test users](https://developers.facebook.com/docs/development/build-and-test/test-users) and create a Facebook Page as you normally would.

To log in as a test user:

1. Go to the [Apps](https://developers.facebook.com/apps) panel and select your app to load it in the App Dashboard.
2. Go to **Roles** \> **Test Users** and click an existing test user's **Edit** button.
3. Click **Log in as this test user** and complete the confirmation flow.

## Managing Test Pages

When logged into Facebook as a test user, you can edit the following test page attributes:

- Change the name of the test page.
- Add and update its settings such as its cover picture, profile picture, and description.
- Add and update business information such as a website, location, and business hours.
- Invite other test users to visit the page.
- Publish content, comment and react to posts, create events, and more.
- View page insights such as Page Views, Post Engagement, and Page Likes.

If you delete the test user who created the test page, all test pages created by the test user will be deleted as well.

## Test Pages Graph API Endpoints

You can manage test page using the Graph API.

App Administrators and Developers can use the [User Accounts](https://developers.facebook.com/docs/graph-api/reference/user/accounts) endpoint to:

- Get the ID for each test page that a test user has created.
- Get a Page access token for each test page that a test user has created.

App Administrators and Developers can use the [Page](https://developers.facebook.com/docs/graph-api/reference/page) endpoint to:

- Add and update Page settings such as a cover and profile picture, and description.
- Add and update business information such as a website, location, business hours, and more.
- Invite other Test Users to visit your Page.
- Publish content, comment and react to posts, create events, and more.
- View Page insights such as Page views, post engagement, and Page likes.
- Delete a Test Page.

On This Page

[Test Pages](https://developers.facebook.com/docs/development/build-and-test/test-pages#test-pages)

[Limitations](https://developers.facebook.com/docs/development/build-and-test/test-pages#limitations)

[Creating Test Pages](https://developers.facebook.com/docs/development/build-and-test/test-pages#creating-test-pages)

[Managing Test Pages](https://developers.facebook.com/docs/development/build-and-test/test-pages#managing-test-pages)

[Test Pages Graph API Endpoints](https://developers.facebook.com/docs/development/build-and-test/test-pages#test-pages-graph-api-endpoints)