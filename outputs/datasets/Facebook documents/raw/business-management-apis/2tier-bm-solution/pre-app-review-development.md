---
url: https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development
title: Pre-app Review Development - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2F2tier-bm-solution%2Fpre-app-review-development%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)


  - [Overview](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview)
  - [Prerequisites](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/prerequisites)
  - [Pre-app Review Development](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development)
  - [Get Started](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/get-started)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/guides)
  - [Supported Operations](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/supported-operations)
  - [Support](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support)

On This Page

[Pre-App Review Development](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development#pre-app-review-development)

[Advice for App Review Submissions](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development#advice-for-app-review-submissions)

# Pre-App Review Development

**Note**: In Meta’s User Interfaces, such as the App Dashboard and Meta Business Suite, the term “App Install” or “App Installation” is used. This is equivalent to meaning “Logging in” without going through the login window. When you have a user log in through Facebook Login for Business, they “install” the app into their user. In MBS, you can “install” an application into a system user. It just means that the user has given the app the ability to impersonate them for a subset of activities. These subsets are called scopes.

## Background

App Review is a process by which Meta ensures your app actually needs the permissions that you want to request from a user. To understand App Review, it is good to cover OAuth2 quickly and why Meta blocks the ability to gain these permissions from anyone.

OAuth2 is a mechanism to provide a scoped impersonation ability using a user access token. The user logs in using a modal, and your app is given an access token (a character string which stores authorization information) which is passed in API calls. Your app specifies what permissions you will ask of the user during the log in, but in practice you are gaining the ability to impersonate that user for some purpose (e.g. post to their page, create an ad campaign for them, etc).

App Review was created to make sure an app is legitimate and shows a Meta reviewer how the permission will be used in your app. Basically, Meta is asking, “Why do you need to impersonate the user for "blank" operations and show me how you intend to perform the operations”.

But how do you build a test application to show the App Review team, when you can’t have a user login without App Review? Also, how do you test whether your login modal (i.e. FBLogin) is set up correctly?

## How to succeed in App Review

There are two mechanisms for building your app prior to App Review:

- **Test Users**
1. Can give any app permissions without that app having undergone App Review.
2. Permissions can be granted in the App Dashboard when you create a Test User.
3. Allows simultaneous development of FBLogin and testing
4. Create fresh test users to retest login multiple times
5. If you reach the limit on test users, you can delete old ones to free up limits
- **Tester/Employee/Developer App Roles**
1. These are roles for real users on the app
2. Use tester roles for final stage testing with real users before App Review
3. Users with a role on the app can always give an app impersonation abilities without App Review
4. If you only want to build an app for company employees, you can use roles and prevent using app review. This can happen if your app is for internal company use where you know the users ahead of time.

Both of these mechanisms are found in the App Dashboard in the left side panel **App Roles**.

Our recommendation is to use Test Users for rapid prototyping and setting up Facebook Login for Business, and then use App Roles for more thorough and final testing with real users.

## Advice for App Review Submissions

**Required Permissions:** At a minimum, request the following Advanced permissions when going from Development to Live mode:

- `ads_management`
- `business_management`
- `pages_show_list`
- `pages_read_engagement`
- `instagram_basic` \- If you want the ads to be deliverable to both Facebook and Instagram

**Additional permissions may be needed based on your use case. Consult your Meta representative for guidance.**

#### Requesting `business_management` permission

When requesting the `business_management` permission, call out the following in your app review submission:

1. `business_management` permission is being requested as a dependency for the `ads_management` and `pages_show_list` permissions.
2. For publishing ads to instagram, call out that `business_management` permission is being requested as a dependency for the `instagram_basic` permission.
3. In your App Review screencast, clearly show the user navigating your Facebook Login for Business flow, picking the pages or Instagram handles and providing the necessary permissions to the app.
4. For each permission, show in the screencast user activities that call APIs which require the permission.

In your app, make sure to inform the User that they are explicitly providing permissions to your app to manage their business assets. You will need to add the `business_management` permission as part of the [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business/) flow.

On This Page

[Pre-App Review Development](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development#pre-app-review-development)

[Advice for App Review Submissions](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development#advice-for-app-review-submissions)