---
url: https://developers.facebook.com/docs/development/build-and-test
title: Build and Test - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fbuild-and-test%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Build and Test](https://developers.facebook.com/docs/development/build-and-test#build-and-test)

[General Process](https://developers.facebook.com/docs/development/build-and-test#general-process)

[App Use Cases](https://developers.facebook.com/docs/development/build-and-test#app-use-cases)

[App Types](https://developers.facebook.com/docs/development/build-and-test#app-types)

[App Modes](https://developers.facebook.com/docs/development/build-and-test#app-modes)

[App Roles](https://developers.facebook.com/docs/development/build-and-test#app-roles)

[Testing](https://developers.facebook.com/docs/development/build-and-test#testing)

[Test Users](https://developers.facebook.com/docs/development/build-and-test#test-users)

[Test Pages](https://developers.facebook.com/docs/development/build-and-test#test-pages)

[Data Deletion Callback](https://developers.facebook.com/docs/development/build-and-test#data-deletion-callback)

[See Also](https://developers.facebook.com/docs/development/build-and-test#see-also)

[Next Steps](https://developers.facebook.com/docs/development/build-and-test#next-steps)

# Build and Test

This document outlines the basic development and testing process for apps created on Meta for Developers. It also describes tools and settings available in the App Dashboard that may help you during development.

## General Process

The development process will vary depending on your app's needs, but the basic flow begins with reading the documentation for each of the use cases. Information about these use cases can be found at [developers.facebook.com/products](https://developers.facebook.com/products/).

Once you have identified and read any relevant documentation sets, the next step is to make changes to your app's codebase and configure any App Dashboard settings that may be required by the use cases, SDKs, and API calls that you are implementing. If other people will be helping you develop and test your app, you can assign them app roles so they can configure app settings and help test Graph API integrations.

Finally, to verify that you have implemented everything correctly, you can test your app using your own Meta developer account or with test users that simulate real Meta technologies users.

As a starting point, most Facebook apps use the Graph API to get data in and out of Facebook. Graph API endpoints require permissions. Since getting data in and out of the Graph API is a common action, we have a set of SDKs to make calling Graph API endpoints easier. So, many developers start with those four documentation sets.

## App Use Cases

When you first create an app, you must choose a main use case then secondary use cases, if needed, to add functionality to your app. Use cases are made up of permissions and features which are automatically added to your Meta app. The majority of these use cases will require App Review.

For example, when you select Facebook Login as the main use case for your app in the creation process, you will then be able to add secondary use cases with associated permissions and features.

Each use case has its own set of permissions, features, and APIs to choose from. When you add a secondary use case, you’ll be taken to the Configure page in the App Dashboard where you can configure the permissions, features, and APIs associated with this use case.

### App Types

If you are creating an app that does not use a use case listed in the app dashboard you will select **Other** where you will then choose the type of app you are creating.

App types determine the products that can be added to an app in the App Dashboard and which permissions and features can be requested for approval through the App Review process.

## App Modes

Your app will be in one of two App modes, Development and Live. App modes apply to non-business apps and determine which permissions and features your app can use, and who can use your app.

Apps in Development mode can be granted any permission, but only from app users who have a role on the app itself. In addition, all features are active, but only for app users who have a role on the app.

Apps in Live Mode can be granted permissions by anyone, but only permissions that have been approved through the App Review process. Similarly, features are active for all app users, but only features approved through App Review.

**All newly created non-business apps start out in Development mode and you should avoid changing it until you have completed all development and testing.**

Note that:

- App types also affect which permissions are available to an app. For example, user-related permissions are not available to Business apps, and business-related permissions are not available to Consumer apps. Apps that have chosen the Business app type do not have app modes at all and instead rely on access levels, which behave similarly.
- Apps requesting advanced access for permissions may have to be connected to a verified business.

## App Roles

Before your app is published, only people who have been granted a specific role on the app, such as developer or tester, can access it so they can aid with the development and testing process.

## Testing

The Testing page contains all the use cases for your app and the associated permissions you have requested access to. You can also find the testing requirements for App Review.

You should use the Graph API Explorer or create test user accounts to make the required API test calls before you submit for App Review. Some permissions don’t require testing before App Review, but we recommend testing all permissions to ensure the app works as intended.

Once all required API test calls are complete, you are ready for App Review.

Keep in mind that:

- Test API calls can take up to 24 hours to appear on the Testing page.
- Test API calls are only valid for 30 days and must be completed within the 30 days before you submit to App Review.

## Test Users

Test Users are test accounts that you can sign into in order to simulate real Facebook users when testing your app. Test users cannot interact with real Facebook users and any content or interactions generated by test users are only visible to other test users and anyone who has a role on your app.

## Test Pages

Test pages are pages created by test users that you can use to simulate real Facebook Pages when testing your app. Test pages are not discoverable by real Facebook users and can only be interacted with by other test users, or by people who have a role on your app.

## Data Deletion Callback

If you have implemented a use case, you must implement a Data Deletion Callback before it can be published. We will call your app's data deletion callback URL anytime one of your app users requests that you delete their data.

## See Also

Learn more about the different concepts mentioned in this document.

|     |     |
| --- | --- |
| #### App Development – Build and Test<br>- [App Modes\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/development/build-and-test/app-modes)<br>  <br>- [App Roles\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/development/build-and-test/app-roles)<br>  <br>- [App Types\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/apps/app-types)<br>  <br>- [Business Verification\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/development/release/business-verification)<br>  <br>- [Data Deletion Callback\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback)<br>  <br>- [Product Types\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/development/create-an-app/app-dashboard#products-2)<br>  <br>- [Test Pages\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/development/build-and-test/test-pages)<br>  <br>- [Test Users\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/development/build-and-test/test-users) | #### App Review<br>- [App Review\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/apps/review)<br>  <br>#### Graph API Documentation<br>- [Access Levels\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/overview/access-levels/)<br>  <br>- [Features\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/apps/review/feature) and<br>   [Permissions\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/permissions)<br>  <br>- [Graph API\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api)<br>  <br>- [Meta Technologies APIs and SDKs\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGzc3f-&_nc_oc=Ado5r5yLVytQG9496BIARtjcFaUM-mRpQd7PfF3AWGRWdKeCTZkco5vLqs6mdTPrpng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=u25u6AJb3VvDi0EMr0jfsw&_nc_ss=7b289&oh=00_Af6NCXNiCUwEsyPJ5RRF7FzL-fU0FCBrxHpjMqMs2c3htg&oe=6A2592E2)](https://developers.facebook.com/docs#apis-sdks) |

## Next Steps

Once you have completed app development and are ready to publish your app, you can begin any processes that may be required to successfully [release your app](https://developers.facebook.com/docs/development/release).

On This Page

[Build and Test](https://developers.facebook.com/docs/development/build-and-test#build-and-test)

[General Process](https://developers.facebook.com/docs/development/build-and-test#general-process)

[App Use Cases](https://developers.facebook.com/docs/development/build-and-test#app-use-cases)

[App Types](https://developers.facebook.com/docs/development/build-and-test#app-types)

[App Modes](https://developers.facebook.com/docs/development/build-and-test#app-modes)

[App Roles](https://developers.facebook.com/docs/development/build-and-test#app-roles)

[Testing](https://developers.facebook.com/docs/development/build-and-test#testing)

[Test Users](https://developers.facebook.com/docs/development/build-and-test#test-users)

[Test Pages](https://developers.facebook.com/docs/development/build-and-test#test-pages)

[Data Deletion Callback](https://developers.facebook.com/docs/development/build-and-test#data-deletion-callback)

[See Also](https://developers.facebook.com/docs/development/build-and-test#see-also)

[Next Steps](https://developers.facebook.com/docs/development/build-and-test#next-steps)