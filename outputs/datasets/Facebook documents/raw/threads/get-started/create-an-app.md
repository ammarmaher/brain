---
url: https://developers.facebook.com/docs/threads/get-started/create-an-app
title: Create an app - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fget-started%2Fcreate-an-app%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)


  - [Create an app](https://developers.facebook.com/docs/threads/get-started/create-an-app)
  - [Get Access Tokens](https://developers.facebook.com/docs/threads/get-started/get-access-tokens-and-permissions)
  - [Long-Lived Access Tokens](https://developers.facebook.com/docs/threads/get-started/long-lived-tokens)
  - [App Access Tokens](https://developers.facebook.com/docs/threads/get-started/app-access-tokens)

- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)
- [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts)
- [Profiles](https://developers.facebook.com/docs/threads/threads-profiles)
- [Insights](https://developers.facebook.com/docs/threads/insights)
- [Webhooks](https://developers.facebook.com/docs/threads/webhooks)
- [oEmbed](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post)
- [Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents)
- [Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting)
- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Customize a Meta app with the Access the Threads API Use Case](https://developers.facebook.com/docs/threads/get-started/create-an-app/#customize-a-meta-app-with-the-access-the-threads-api-use-case)

[Customize use cases](https://developers.facebook.com/docs/threads/get-started/create-an-app/#customize-use-cases)

[Threads API use cases permissions](https://developers.facebook.com/docs/threads/get-started/create-an-app/#threads-api-use-cases-permissions)

[Settings](https://developers.facebook.com/docs/threads/get-started/create-an-app/#settings)

[Webhooks (optional)](https://developers.facebook.com/docs/threads/get-started/create-an-app/#webhooks--optional-)

[Testing (Optional)](https://developers.facebook.com/docs/threads/get-started/create-an-app/#testing--optional-)

[Publish](https://developers.facebook.com/docs/threads/get-started/create-an-app/#publish)

[Required app assets](https://developers.facebook.com/docs/threads/get-started/create-an-app/#required-app-assets)

[For Tech Providers](https://developers.facebook.com/docs/threads/get-started/create-an-app/#for-tech-providers)

[App Review](https://developers.facebook.com/docs/threads/get-started/create-an-app/#app-review)

[Publish your app](https://developers.facebook.com/docs/threads/get-started/create-an-app/#publish-your-app)

[See Also](https://developers.facebook.com/docs/threads/get-started/create-an-app/#see-also)

The following content is from the Meta App Development documentation. Please refer to the Development documentation to learn more about the
[Meta App Development process.](https://developers.facebook.com/docs/development)

# Customize a Meta app with the Access the Threads API Use Case

This document shows you how to customize the Access the Threads API use case you added to your app during the [app creation process](https://developers.facebook.com/docs/development/create-an-app/).

## Customize use cases

1. If you are not already on the Use cases page of the dashboard, click **Use cases**, or the pencil icon, in the left-side menu.
2. Click on a use case to view the permissions that are available, both required and optional, for this use case.
3. Click the **Add** button to the right of each permission you'd like to add. If, during development, you find that your app doesn't use the permission, you can return here and remove it.

### Threads API use cases permissions

The following table shows the permissions available for the Threads API use case.

| Permission | Usage | Allowed actions |
| --- | --- | --- |
| [`threads_basic`](https://developers.facebook.com/docs/permissions#threads_basic) | **Required** | **Cannot be removed.** |
| [`threads_content_publish`](https://developers.facebook.com/docs/permissions#threads_content_publish) | Optional. | Can be added or removed. |
| [`threads_delete`](https://developers.facebook.com/docs/permissions#threads_delete) | Optional. | Can be added or removed. |
| [`threads_keyword_search`](https://developers.facebook.com/docs/permissions#threads_keyword_search) | Optional. | Can be added or removed. |
| [`threads_location_tagging`](https://developers.facebook.com/docs/permissions#threads_location_tagging) | Optional. | Can be added or removed. |
| [`threads_manage_insights`](https://developers.facebook.com/docs/permissions#threads_manage_insights) | Optional. | Can be added or removed. |
| [`threads_manage_mentions`](https://developers.facebook.com/docs/permissions#threads_manage_mentions) | Optional. | Can be added or removed. |
| [`threads_manage_replies`](https://developers.facebook.com/docs/permissions#threads_manage_replies) | Optional. | Can be added or removed. |
| [`threads_profile_discovery`](https://developers.facebook.com/docs/permissions#threads_profile_discovery) | Optional. | Can be added or removed. |
| [`threads_read_replies`](https://developers.facebook.com/docs/permissions#threads_read_replies) | Optional. | Can be added or removed. |

You can add and remove permissions at any time during the development process.

### Settings

1. In the left side menu, click **Settings**. You'll find your **Threads app ID** and **Threads app secret**.
2. Add the following URLs:

   - **Client OAuth Settings** – valid OAuth redirect URIs
   - **Deauthorize callback URL** – the URL Meta will ping when a user deauthorizes your app
   - **Data Deletion Requests URL** – the URL Meta will ping when someone requests that you delete their data
3. Click **Save**.
4. Click the **Add or Remove Threads Test Users** to add testers to your app. The page will refresh to the **App roles > Roles** page in the dashboard.
5. Click the **Add People** button to add people as to one or more of the following app roles:

   - Adminstrator
   - Developers
   - Testers
   - Analytics Users
   - Threads Testers

### Webhooks (optional)

A majority of Meta developers use webhooks to get real-time notifications and reduce the number of API calls, and thus reducing the change of rate limiting. Webhooks is automatically added but it is optional.

To receive webhooks from Meta, you need to:

1. [Create an endpoint](https://developers.facebook.com/docs/threads/get-started/create-an-app/docs/graph-api/webhooks/getting-started) on your server to receive and process these HTTP notifications
2. [Send a `POST` request to subscribe your app](https://developers.facebook.com/docs/threads/get-started/create-an-app/docs/graph-api/webhooks/getting-started/webhooks-for-ad-account) to webhooks
3. Configure webhooks in your app's dashboard (the step listed in this section)

To configure webhooks for your use case in the app's dashboard, follow these steps. These steps assumes you are in the **Use cases > Customize > Customize use case** dashboard and have selected the **Webhooks** option in the menu.

1. **Select product** \- In the dropdown select the assets, such as Page and Ad Account, you'd like to be notified about.
2. Add your **Callback URL**, the endpoint you created to receive webhooks.
3. Add your **Verify token** that Meta will use as part of the callback URL verification.
4. You can add client authentication to the verification process by sliding **Mutual TLS** from No to **Yes**. (Optional)

**Note:** To receive webhook notifications your app must be published. App Review is not required to use webhooks.

## Testing (Optional)

Testing is only required if you are submitting your app for App Review; if your app will access data you don't own or manage.

1. Click **Testing** in the left-side menu if you are ready to test your configuration.

## Publish

**Note:** Some use cases require your app to be published.

### Required app assets

To publish your app, you need the following assets:

- An app icon – Your app's unique icon image; this file must be less than 5 MB, between 512 x 512 and 1024 x 1024 pixels, and in JPEG, GIF or PNG format.
- Contact information for a Data Protection Officer, if you are doing business in the European Union.
- A [Privacy Policy](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FPrivacy_policy&h=AUDRCQMPwZx5iZ-dhW2YrnBJwnIZ49mTluy8hgAxUlOPOYGQYVLfBj9lVCQsEYB3KgVW9NYcYddfwpYouqqabcTKkBFPjj8CAqgve9WXw8TVRSXnizlfYF1t5vaw86ntrDIc5YhIVwTfhA) URL for your app
- A [data deletion](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/data-deletion-callback/) URL with instructions or a callback that allows your app user to delete their data from your app.

1. When you are ready to publish, select **Publish** in the left side menu.
2. **Review** your use cases and requirements.
3. Click **Publish** in the lower right corner.

If you would like to become a Tech Provider click **Become a Tech Provider**.

## For Tech Providers

The following steps must be completed if you're a Tech Provider, your app will serve clients or other business portfolios.

### App Review

1. Click the chevron next to each requirement listed under **Prepare and submit for App Review**. You must complete each requirement before publishing your app.

A checkmark within a circle appears when each of these requirements has been completed.

Learn more about [App Review](https://developers.facebook.com/docs/resp-plat-initiatives/app-review).

### Publish your app

1. Click the chevron to the right of **Check that all requirements are met, then publish your app.**
If any requirements have not yet been met, messaging will appear and you will need to satisfy those requirements.
2. Once you have successfully completed all the requirements, click **Publish** in the lower-right corner.

After your app has been published, the **Dashboard** will show **App Health** with **Daily API Calls**.

## See Also

Visit the following to learn more about the app development process:

- [App Review](https://developers.facebook.com/docs/resp-plat-initiatives/app-review)
- [Business verification](https://developers.facebook.com/docs/development/release/business-verification)
- [Permissions Reference](https://developers.facebook.com/docs/permissions/threads)
- [Threads API Developer Documentation](https://developers.facebook.com/docs/threads)

On This Page

[Customize a Meta app with the Access the Threads API Use Case](https://developers.facebook.com/docs/threads/get-started/create-an-app/#customize-a-meta-app-with-the-access-the-threads-api-use-case)

[Customize use cases](https://developers.facebook.com/docs/threads/get-started/create-an-app/#customize-use-cases)

[Threads API use cases permissions](https://developers.facebook.com/docs/threads/get-started/create-an-app/#threads-api-use-cases-permissions)

[Settings](https://developers.facebook.com/docs/threads/get-started/create-an-app/#settings)

[Webhooks (optional)](https://developers.facebook.com/docs/threads/get-started/create-an-app/#webhooks--optional-)

[Testing (Optional)](https://developers.facebook.com/docs/threads/get-started/create-an-app/#testing--optional-)

[Publish](https://developers.facebook.com/docs/threads/get-started/create-an-app/#publish)

[Required app assets](https://developers.facebook.com/docs/threads/get-started/create-an-app/#required-app-assets)

[For Tech Providers](https://developers.facebook.com/docs/threads/get-started/create-an-app/#for-tech-providers)

[App Review](https://developers.facebook.com/docs/threads/get-started/create-an-app/#app-review)

[Publish your app](https://developers.facebook.com/docs/threads/get-started/create-an-app/#publish-your-app)

[See Also](https://developers.facebook.com/docs/threads/get-started/create-an-app/#see-also)