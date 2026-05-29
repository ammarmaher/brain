---
url: https://developers.facebook.com/docs/graph-api/advanced/api-upgrade
title: Upgrade  - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fadvanced%2Fapi-upgrade%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)
- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)
- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)


  - [Upgrade](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade)
  - [Versions](https://developers.facebook.com/docs/graph-api/changelog/versions)
  - [Out-Of-Cycle Changes](https://developers.facebook.com/docs/graph-api/changelog/out-of-cycle-changes)

- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Upgrade to the Latest Graph API Version](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#upgrade-to-the-latest-graph-api-version)

[Learn How a Change Affects Your App](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#learn-how-a-change-affects-your-app)

[Read the Results](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#read-the-results)

[Limitations](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#limitations)

[Implement a New Version](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#implement-a-new-version)

[Learn More](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#learn-more)

# Upgrade to the Latest Graph API Version

This guide describes how to prepare your app to test different versions of the Graph API and to upgrade to the latest version.

The [API Upgrade Tool](https://developers.facebook.com/tools/api_versioning/) shows the API calls from your app that may be affected by changes in newer versions of the API. You will be able to quickly see which changes you need to make to upgrade from your current version to a newer version.

## Learn How a Change Affects Your App

The API Upgrade Tool displays a customized list of changes that impact an app when upgrading to a specified target version. This allows you to view all relevant changes between the source and target versions.

Step 1. In the [Upgrade tool](https://developers.facebook.com/tools/api_versioning/), select your app from the dropdown menu or type in the name of the app.

The dropdown menu only lists up to ten apps. To view more apps than those listed, use the search bar in the dropdown menu.

Step 2. Use the dropdown menus to the right to select the version you would like to **Upgrade from** and the version you would like to **Upgrade to**.

### Read the Results

The tool displays the number of changes that need to be made to update your app to the selected version. If your app makes API calls that will not be affected by a newer version no data will be returned.

Methods are color coded by the version affecting the call. Hover over the bar chart to see how many changes are in each version. The dates associated with each version are when the changes will be enforced for all apps.

The table shows the type of change (deprecation, new feature or change), which methods are affected, the number of calls made in the last 7 days, and the percentage of API calls affected by that specific change.

### Limitations

- You must be an admin or developer of the app to view the app in the tool.
- No data will be returned if your app has not made any, or too few, API calls from the **Update from** version.
- Call volumes may appear incorrect. API call logging is sampled and aggregated over the previous week. It is compared with the call volume to estimate how many of your calls could be affected by a given version change.

**Note:** Not all changes may affect each API call. Use your best judgment on whether a particular change needs to be handled by your app. Be sure to test your API calls in the newer version to ensure it works properly.

## Implement a New Version

In the App Dashboard **Settings > Advanced**, scroll to the **Upgrade API Version** section.

#### Upgrading Developers and Admins

This upgrades all developers and admins of an app to the next available version. This allows you to test changes with a small subset of real users before releasing the new version to the public.

#### Upgrading All Calls

This upgrades all calls made by an app to the next available version. Upgrading early is useful since it preserves the option of going back to the original version in case of unforeseen bugs or issues.

## Learn More

- [Graph API Changelog](https://developers.facebook.com/docs/graph-api/changelog) – Learn about the latest version changes.
- [Versioning](https://developers.facebook.com/docs/graph-api/guides/versioning) – Learn all about Graph API versioning, requests to different versions, and more.
- [Test Apps](https://developers.facebook.com/docs/development/build-and-test/test-apps) – Learn how to create test apps to test changes to your app before public release.
- [Test Users](https://developers.facebook.com/docs/development/build-and-test/test-users) – Learn how to create test users to test changes to your app before public release.

On This Page

[Upgrade to the Latest Graph API Version](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#upgrade-to-the-latest-graph-api-version)

[Learn How a Change Affects Your App](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#learn-how-a-change-affects-your-app)

[Read the Results](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#read-the-results)

[Limitations](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#limitations)

[Implement a New Version](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#implement-a-new-version)

[Learn More](https://developers.facebook.com/docs/graph-api/advanced/api-upgrade#learn-more)