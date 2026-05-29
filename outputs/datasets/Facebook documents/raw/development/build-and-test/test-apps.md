---
url: https://developers.facebook.com/docs/development/build-and-test/test-apps
title: Test Apps - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fbuild-and-test%2Ftest-apps%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps#test-apps)

[Limitations](https://developers.facebook.com/docs/development/build-and-test/test-apps#limitations)

[Test App Roles](https://developers.facebook.com/docs/development/build-and-test/test-apps#test-app-roles)

[Creating Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps#creating-test-apps)

[Testing Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps#testing-test-apps)

[Removing Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps#removing-test-apps)

[FAQs](https://developers.facebook.com/docs/development/build-and-test/test-apps#faqs)

# Test Apps

Test apps are child apps created from other, non-child (i.e. parent) apps. They are primarily used to clone parent apps that are already in [Live](https://developers.facebook.com/docs/development/build-and-test/app-modes#live-mode) mode in order to test new [reviewable](https://developers.facebook.com/docs/app-review) permissions and features without compromising the functionality of the cloned parent app.

![Screenshot of App Selection dropdown meny in App Dashboard toolbar with Create Test App button displayed.](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/132131435_864715260997752_3537093673129395753_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=BQdwuin2O2gQ7kNvwHc1bNn&_nc_oc=AdoNK-04Bdc_za8CLkkbjEjTecJe0G6tzhziYPAEDKplfXZyG8Z3T5T-2UOb3M_x3OA&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=51rCRcOG4LXt9D9dKVZxsw&_nc_ss=7b289&oh=00_Af4vWg9HYWrGbgB6Q4sgI8GezSyNYKndSPfKRHh4bDGj3w&oe=6A259428)

Test apps are always in [Development](https://developers.facebook.com/docs/development/build-and-test/app-modes#development-mode) mode and inherit their parent app settings at the time that they are created. Once created, you can adjust a test app's settings to suit your testing needs.

## Limitations

- Parent apps can only have 50 child test apps.
- User IDs are scoped to the parent app.

## Test App Roles

Test apps inherit the [Administrators](https://developers.facebook.com/docs/development/build-and-test/app-roles#admin) from their parents. As with non-test apps, Administrators have full control over the test app's settings, including the ability to add and remove people from roles.

People who have been added as Administrators to test apps (instead of inherited from their parents) can only perform admin actions on those test apps.

## Creating Test Apps

To create a test app:

1. Load the app that you want to clone in the App Dashboard.
2. In the upper-left corner of the dashboard, click the app selection dropdown menu and click **Create Test App**.
3. Name the app and click **Create Test App**.

You can now adjust your test app's settings and products and test new features and permissions without affecting the app from which it was cloned.

## Testing Test Apps

Testing a test app is just like testing any other app; update any SDK configurations that rely on your app ID and app secret with the test app's corresponding values and grant the test app relevant permissions using any user who has a role on the app itself.

## Removing Test Apps

You can remove test apps like you would any Facebook app.

1. In the Dashboard select the test app you would like to remove.
2. In the left navigation pane, click **Settings** \> **Advanced**.
3. Scroll down and click **Remove App**.

Note: If you remove a parent app, all of its test apps will also be removed.

## FAQs

[I have already created apps for development, QA or staging. Can I merge these apps into my production app's Test Apps list?](https://developers.facebook.com/docs/development/build-and-test/test-apps#faq_726113361672658)

No. We suggest creating new test apps and migrating your development teams to use these new test apps for development, testing, QA, and staging purposes.

[Permalink](https://developers.facebook.com/docs/development/build-and-test/test-apps#faq_726113361672658)

[My production app's settings have change. Can I push these updates to my test apps?](https://developers.facebook.com/docs/development/build-and-test/test-apps#faq_156905329523539)

No. You will need to change settings in each test app manually or create a new test app to reflect the new settings.

[Permalink](https://developers.facebook.com/docs/development/build-and-test/test-apps#faq_156905329523539)

[I created a test app with settings that I want my production app to use. Is there an easy way to update my production app with these settings?](https://developers.facebook.com/docs/development/build-and-test/test-apps#faq_390923895550274)

No. You will need to update your production app's settings manually.

[Permalink](https://developers.facebook.com/docs/development/build-and-test/test-apps#faq_390923895550274)

On This Page

[Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps#test-apps)

[Limitations](https://developers.facebook.com/docs/development/build-and-test/test-apps#limitations)

[Test App Roles](https://developers.facebook.com/docs/development/build-and-test/test-apps#test-app-roles)

[Creating Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps#creating-test-apps)

[Testing Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps#testing-test-apps)

[Removing Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps#removing-test-apps)

[FAQs](https://developers.facebook.com/docs/development/build-and-test/test-apps#faqs)