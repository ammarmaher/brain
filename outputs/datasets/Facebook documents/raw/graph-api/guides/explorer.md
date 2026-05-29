---
url: https://developers.facebook.com/docs/graph-api/guides/explorer
title: Graph Explorer Guide - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fguides%2Fexplorer%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)
- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)


  - [Graph Explorer Guide](https://developers.facebook.com/docs/graph-api/guides/explorer)

- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)
- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Graph API Explorer Guide](https://developers.facebook.com/docs/graph-api/guides/explorer#graph-api-explorer-guide)

[Common Uses](https://developers.facebook.com/docs/graph-api/guides/explorer#common-uses)

[Requirements](https://developers.facebook.com/docs/graph-api/guides/explorer#requirements)

[Components](https://developers.facebook.com/docs/graph-api/guides/explorer#components)

[Access Token](https://developers.facebook.com/docs/graph-api/guides/explorer#access-token)

[Meta App](https://developers.facebook.com/docs/graph-api/guides/explorer#meta-app)

[User or Page](https://developers.facebook.com/docs/graph-api/guides/explorer#user-or-page)

[Permissions](https://developers.facebook.com/docs/graph-api/guides/explorer#permissions)

[Query string Field](https://developers.facebook.com/docs/graph-api/guides/explorer#query-string-field)

[Node Field Viewer](https://developers.facebook.com/docs/graph-api/guides/explorer#node-field-viewer)

[Response Window](https://developers.facebook.com/docs/graph-api/guides/explorer#response-window)

[Get Code](https://developers.facebook.com/docs/graph-api/guides/explorer#get-code)

[Copy Debug Information](https://developers.facebook.com/docs/graph-api/guides/explorer#copy-debug-information)

[Save Session](https://developers.facebook.com/docs/graph-api/guides/explorer#save-session)

[Sample Query](https://developers.facebook.com/docs/graph-api/guides/explorer#sample-query)

# Graph API Explorer Guide

|     |     |
| --- | --- |
| The Graph API Explorer tool allows you to construct and perform Graph API queries and see their responses for any apps on which you have an admin, developer, or tester role. | [Open the Graph API Explorer tool](https://developers.facebook.com/tools/explorer) |

## Common Uses

- Quickly generate access tokens
- Get code samples for your queries
- Generate debug information to include in support requests
- Test API queries with your production app's settings including permissions, features, and settings for your use cases
- Test API queries with your test or development app using permission and features on test users or test data

## Requirements

- A [Facebook Developer Account](https://developers.facebook.com/apps)

- An app for which you have a role, such as an [admin, developer, or tester role](https://developers.facebook.com/docs/apps#roles)


## Components

### Access Token

When you get an access token, it is displayed in the upper right of the tool. This is the token that is included in your Graph API query. You can copy this token and use it in your app to test your code.

Click the information icon to see information about the current token, including the app that it's tied to, and any permissions that have been granted by the User who is using the app (which is you).

You can generate a new access token if the token has expired or if you add new permissions.

### Meta App

The Meta App dropdown menu in the upper right displays all the apps on which you have an admin, developer, or tester role. Use the dropdown to select the app settings that you wish to test.

### User or Page

The User or Page dropdown menu allows you to get and exchange App, User, and Page access tokens for the currently selected app. You can also use it to uninstall your app from your User node, which destroys the current access token.

### Permissions

The Permission dropdown menu allows you to select permissions, such as `email`, `pages_show_list`, and `ads_management` permissions. This allows the current app user (which is you) to grant the app specific permissions. Only grant permissions that your app actually needs.

If your app is in development, you can grant your app any permission and your queries respect them for data owned by people with a role on your app. If your app is live, however, granting a permission that your app has not been approved for by the [App Review](https://developers.facebook.com/docs/apps/review) process causes your query to fail whenever you submit it.

### Query string Field

When you first enter the tool a default query appears. You can edit the query by typing in a new one, or by searching for and selecting fields in the field viewer after executing the query. You can also use the dropdown menus to switch between operation methods, and target different versions of the Graph API.

If you click the star icon at the end of the query field, the query is saved as a favorite. You can view your favorite queries by clicking the book icon.

### Node Field Viewer

When you submit a `GET` query on a node, the field viewer located in the left side of the window displays the name of the node and the fields returned by the Graph API. You can modify your query by searching for and selecting new fields, clicking the plus icon, and choosing from available fields, or unchecking unnecessary fields. These actions dynamically update your query in the query string field.

### Response Window

The response, located below the query string, shows the results returned from your last submitted query.

### Get Code

If you are happy with your query, click the Get Code button located in the botton center below the response, to generate sample code based on the query. Typically you won't be able to copy and paste the sample code directly in your code base, but it gives you a useful starting point.

### Copy Debug Information

If your query keeps failing and you can't figure out why, and you decide to contact Developer Support, click this button, located at the bottom center, to copy your query and response details to your clipboard. You can submit this information with your support request to help us figure out what's going on.

### Save Session

Click the Save Session button, located at the bottom center, to save the state of your query, with the access token removed. Include the link to this session if you decide to contact Developer Support.

## Sample Query

Try executing the default query that appears when you first load the Graph API Explorer. If you haven't already, [open the Graph API Explorer in a new window](https://developers.facebook.com/tools/explorer), select the app you want to test from the application dropdown menu, and get a User access token.

The default query appears in the query string field:

```code
GET https://developers.facebook.com/v25.0/me?fields=id,name
```

The default query is requesting the `id` and `name` fields on the `/me` node, which is a special node that maps to either the `/User` or `/Page` node identified by the token. Since your are using a User access token, this maps to your User node.

The `id` and `name` fields are publicly available and can be returned if the User has granted your app the `default` or `public_profile` permissions. These permissions are pre-approved for all apps (you can confirm this by clicking the information icon in the **Access Token Field**), so you don't have to grant your app any additional permissions for the query to work. Click **Get Access Token** and confirm that you want to grant your app access to your publicly available User information.

Submit your query, and you should see your app-scoped User ID and name appear in the response window.

On This Page

[Graph API Explorer Guide](https://developers.facebook.com/docs/graph-api/guides/explorer#graph-api-explorer-guide)

[Common Uses](https://developers.facebook.com/docs/graph-api/guides/explorer#common-uses)

[Requirements](https://developers.facebook.com/docs/graph-api/guides/explorer#requirements)

[Components](https://developers.facebook.com/docs/graph-api/guides/explorer#components)

[Access Token](https://developers.facebook.com/docs/graph-api/guides/explorer#access-token)

[Meta App](https://developers.facebook.com/docs/graph-api/guides/explorer#meta-app)

[User or Page](https://developers.facebook.com/docs/graph-api/guides/explorer#user-or-page)

[Permissions](https://developers.facebook.com/docs/graph-api/guides/explorer#permissions)

[Query string Field](https://developers.facebook.com/docs/graph-api/guides/explorer#query-string-field)

[Node Field Viewer](https://developers.facebook.com/docs/graph-api/guides/explorer#node-field-viewer)

[Response Window](https://developers.facebook.com/docs/graph-api/guides/explorer#response-window)

[Get Code](https://developers.facebook.com/docs/graph-api/guides/explorer#get-code)

[Copy Debug Information](https://developers.facebook.com/docs/graph-api/guides/explorer#copy-debug-information)

[Save Session](https://developers.facebook.com/docs/graph-api/guides/explorer#save-session)

[Sample Query](https://developers.facebook.com/docs/graph-api/guides/explorer#sample-query)