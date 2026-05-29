---
url: https://developers.facebook.com/docs/facebook-login/facebook-login-for-business/
title: Facebook Login for Business | Developer Documentation
status: 200
---

Facebook Login

Facebook Login

[Facebook Login](https://developers.facebook.com/documentation/facebook-login)

[Overview](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Overview](https://developers.facebook.com/documentation/facebook-login/overview)

[Authentication Versus Data Access](https://developers.facebook.com/documentation/facebook-login/auth-vs-data)

[Login Security](https://developers.facebook.com/documentation/facebook-login/security)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens)

[Get Long-Lived Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived)

[OIDC Token with Manual Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/oidc-token)

[Get an OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-oidc)

[Get Session Info Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-session-info)

[Security](https://developers.facebook.com/documentation/facebook-login/access-tokens/security)

[Portability](https://developers.facebook.com/documentation/facebook-login/access-tokens/portability)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions)

[Request & Revoke](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke)

[Handle Declined Permissions](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined)

[Review](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review)

[Create an app](https://developers.facebook.com/documentation/facebook-login/create-an-app)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business)

[Conversions API Partner Integration Template](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/conversions-api-integration-template/)

[Business Integration Webhooks](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/integration-webhooks)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/managed-accounts)

[FAQ](https://developers.facebook.com/documentation/facebook-login/managed-accounts/faq)

[For Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

[Re-Authentication](https://developers.facebook.com/documentation/facebook-login/guides/advanced/re-authentication)

[Map Users Across Apps and Pages](https://developers.facebook.com/documentation/facebook-login/guides/map-users)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/test)

[Test User Data Access](https://developers.facebook.com/documentation/facebook-login/guides/test/data-access)

[Manually Build a Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow)

[iOS](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/permissions)

[Advanced](https://developers.facebook.com/documentation/facebook-login/ios/advanced)

[Limited Facebook Login](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios/limited-login)

[Unity](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/unity)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token)

[Validating the Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token/validating)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/permissions)

[FAQ](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/faq)

[Android](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Android](https://developers.facebook.com/documentation/facebook-login/android)

[Access Tokens and Profiles](https://developers.facebook.com/documentation/facebook-login/android/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/android/permissions)

[Troubleshooting](https://developers.facebook.com/documentation/facebook-login/android/troubleshooting)

[Web](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Web](https://developers.facebook.com/documentation/facebook-login/web)

[Login Button](https://developers.facebook.com/documentation/facebook-login/web/login-button)

[Access Tokens](https://developers.facebook.com/documentation/facebook-login/web/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/web/permissions)

[Enabling HTTPS](https://developers.facebook.com/documentation/facebook-login/web/enabling-https)

[JS Example](https://developers.facebook.com/documentation/facebook-login/web/js-example)

[Best Practices](https://developers.facebook.com/documentation/facebook-login/best-practices)

[User Experience Design](https://developers.facebook.com/documentation/facebook-login/userexperience)

[Login Connect with Messenger](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#)

[Overview](https://developers.facebook.com/documentation/facebook-login/login-connect)

[Implementing](https://developers.facebook.com/documentation/facebook-login/login-connect/implementing)

[FAQ](https://developers.facebook.com/documentation/facebook-login/login-connect/faq)

# Facebook Login for Business

Updated:May 5, 2026

Facebook Login for Business is the preferred authentication and authorization solution for tech providers building integrations with Meta’s business tools to create marketing, messaging, and selling solutions.

Facebook Login for Business allows you to create a login experience in the Meta App Dashboard based on the needs of your app. You can specify the access token type, assets, and permissions your app needs, and save it as a **configuration**. During login your app users are presented with this configuration that allows them to grant your app access to their business assets.

## Requirements

Your Meta app must be a [**business type app**](https://developers.facebook.com/docs/development/create-an-app/other-app-types#step-3--select-an-app-type)

All permissions that your app asks for during login must be granted by your app user or your app won’t be granted any permissions.

The `email` and `public_profile` permissions are automatically granted to all apps but at least one other supported permission must be included for each app installation.

To serve businesses that you do not own or manage, your app must be approved for **Advanced Access** via [**Meta’s App Review**](https://developers.facebook.com/docs/app-review)

Apps with Advanced Access are required to undergo [Ongoing Review](https://developers.facebook.com/documentation/resp-plat-initiatives/individual-processes/ongoing-reviews) to retain access. However, apps using Facebook Login for Business have reduced requirements for certain ongoing compliance reviews because they are limited to accessing business permissions and features.

## Supported permissions

The following table shows the available permissions for Facebook Login for Business.

| Available Permissions | User access tokens | Business Integration System User access tokens |
| --- | --- | --- |
| [`ads_management`](https://developers.facebook.com/docs/permissions#ads_management) | ✓ | ✓ |
| [`ads_read`](https://developers.facebook.com/docs/permissions#ads_read) | ✓ | ✓ |
| [`business_management`](https://developers.facebook.com/docs/permissions#business_management) | ✓ | ✓ |
| [`catalog_management`](https://developers.facebook.com/docs/permissions#catalog_management) | ✓ | ✓ |
| `commerce_account_manage_orders` | ✓ | ✓ |
| `commerce_account_read_orders` | ✓ | ✓ |
| `commerce_account_read_reports` | ✓ | ✓ |
| `commerce_account_read_settings` | ✓ | ✓ |
| `commerce_manage_accounts` | ✓ | ✓ |
| [`email`](https://developers.facebook.com/docs/permissions#email) | ✓ | N/A |
| [`instagram_basic`](https://developers.facebook.com/docs/permissions#instagram_basic) | ✓ | ✓ |
| [`instagram_content_publish`](https://developers.facebook.com/docs/permissions#instagram_content_publish) | ✓ | ✓ |
| [`instagram_manage_comments`](https://developers.facebook.com/docs/permissions#instagram_manage_comments) | ✓ | ✓ |
| [`instagram_manage_insights`](https://developers.facebook.com/docs/permissions#instagram_manage_insights) | ✓ | ✓ |
| [`instagram_manage_messages`](https://developers.facebook.com/docs/permissions#instagram_manage_messages) | ✓ | ✓ |
| [`instagram_shopping_tag_products`](https://developers.facebook.com/docs/permissions#instagram_shopping_tag_products) | ✓ | ✓ |
| [`leads_retrieval`](https://developers.facebook.com/docs/permissions#leads_retrieval) | ✓ | ✓ |
| [`manage_app_solutions`](https://developers.facebook.com/docs/permissions#manage_app_solution) | ✓ | ✓ |
| [`manage_fundraisers`](https://developers.facebook.com/docs/permissions#manage_fundraisers) | ✓ | ✓ |
| [`pages_manage_cta`](https://developers.facebook.com/docs/permissions#pages_manage_cta) | ✓ | ✓ |
| [`page_events`](https://developers.facebook.com/docs/permissions#page_events) | ✓ | ✓ |
| [`pages_manage_ads`](https://developers.facebook.com/docs/permissions#pages_manage_ads) | ✓ | ✓ |
| [`pages_manage_engagement`](https://developers.facebook.com/docs/permissions#pages_manage_engagement) | ✓ | ✓ |
| [`pages_manage_instant_articles`](https://developers.facebook.com/docs/permissions#pages_manage_instant_articles) | ✓ | ✓ |
| [`pages_manage_metadata`](https://developers.facebook.com/docs/permissions#pages_manage_metadata) | ✓ | ✓ |
| [`pages_manage_posts`](https://developers.facebook.com/docs/permissions#pages_manage_posts) | ✓ | ✓ |
| [`pages_messaging`](https://developers.facebook.com/docs/permissions#pages_messaging) | ✓ | ✓ |
| [`pages_read_engagement`](https://developers.facebook.com/docs/permissions#pages_read_engagement) | ✓ | ✓ |
| [`pages_read_user_content`](https://developers.facebook.com/docs/permissions#pages_read_user_content) | ✓ | ✓ |
| [`pages_show_list`](https://developers.facebook.com/docs/permissions#pages_show_list) | ✓ | ✓ |
| [`private_computation_access`](https://developers.facebook.com/docs/permissions#private_computation_access) | ✓ | ✓ |
| [`public_profile`](https://developers.facebook.com/docs/permissions#public_profile) | ✓ | N/A |
| [`publish_video`](https://developers.facebook.com/docs/permissions#publish_video) | ✓ | ✓ |
| [`read_insights`](https://developers.facebook.com/docs/permissions#read_insights) | ✓ | ✓ |
| [`read_audience_network_insights`](https://developers.facebook.com/docs/permissions#read_audience_network_insights) | ✓ | ✓ |
| [`whatsapp_business_management`](https://developers.facebook.com/docs/permissions#whatsapp_business_management) | ✓ | ✓ |
| [`whatsapp_business_messaging`](https://developers.facebook.com/docs/permissions#whatsapp_business_messaging) | ✓ | ✓ |

## [Supported features](https://developers.facebook.com/docs/features-reference)

Marketing API Access Tier
Business Asset User Profile Access
Human Agent
Instagram Public Content Access

Live Video API
Page Mentions
Page Public Content Access
Page Public Metadata Access

## Supported products

[App Ads](https://developers.facebook.com/documentation/app-ads)

[App Events](https://developers.facebook.com/docs/app-events)

[App Links](https://developers.facebook.com/documentation/applinks)

[Audience Network](https://developers.facebook.com/docs/audience-network)

[Commerce Platform](https://developers.facebook.com/documentation/ads-commerce/commerce-platform)

[Fundraiser API](https://developers.facebook.com/docs/fundraiser-api)

[Instagram Platform](https://developers.facebook.com/documentation/instagram-platform)

[Jobs](https://developers.facebook.com/docs/pages/jobs-xml)

[Marketing API](https://developers.facebook.com/documentation/ads-commerce/marketing-api)

[Messenger Platform](https://developers.facebook.com/documentation/business-messaging/messenger-platform)

[Meta Business Extension](https://developers.facebook.com/docs/meta-business-extension)

[Meta Pixel](https://developers.facebook.com/documentation/meta-pixel)

[Pages API](https://developers.facebook.com/docs/pages-api)

[Sharing](https://developers.facebook.com/docs/sharing)

[ThreatExchange](https://developers.facebook.com/docs/threat-exchange)

[Web Payments](https://developers.facebook.com/docs/games_payments)

[Webhooks](https://developers.facebook.com/docs/graph-api/webhooks)

[WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/overview)

## Supported access tokens

You can use Facebook Login for Business to get either Business Integration System User access tokens or User access tokens.

### User access tokens

User access tokens should be used if your app takes actions in real time, based on input from the user. For example, use a user access token if your app requires a user to input text and click a button in order to post content to their Page. User access tokens should also be used if you require an API that requires admin permissions on a business portfolio.

### Business integration system user access tokens

Business integration system user access tokens should be used if your app performs programmatic, automated actions on your business clients’ assets without having to rely on input from an app user, or require re-authentication at a future date. For example:

Hourly, automated server-to-server conversion API calls
Sending automated responses as a Facebook Page or WhatsApp business portfolio
Continuous, automated updates to product catalog inventories
Automated retrieval of ads insights

#### Requirements

To get business integration system user access tokens from your business clients:

Your app can only request logins from web surfaces

Businesses onboarding to your app must have, or be willing to create, a
[business portfolio⁠](https://www.facebook.com/business/help/2199735813629697)

Your app must be associated with a
[business portfolio,⁠](https://www.facebook.com/business/help/2199735813629697) which you have full control. This needs to be separate from the business portfolio owned by your business client.

To test the business integration system user access token flow, the tester must have a role on the app and full control of the client business.

#### Granular business integration system user access tokens

If you need different access setups for different purposes or departments, you can use multiple granular business integration system user access tokens per client business to improve the scalability and security of your integrations.

Granular access tokens are still specific to a client business portfolio. They are not shareable and accessible across different client businesses. Their scope and asset list are a subset of the original business integration system user access token.

To isolate potential security incidents in the event of a compromised token, only that specific client business will be impacted, instead of impacting all business portfolios across all client businesses.

![Image](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/653700966_1459945775864072_8056443032003340873_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=fbfMEQgh8egQ7kNvwGi8K6k&_nc_oc=AdqSFR2QTzq8jQnE_pZQDwYoNL_hgOaRm0DtzS3HoggASM8U818FjthRSMioELKbXdg&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=nd0rLKm9x_Z4R-WLUR3t7w&_nc_ss=7b289&oh=00_Af4J3OcaDTBlcbQwQj-GhVD3A6Dvh1Us1sQ3XXfrj1cI8w&oe=6A25351E)

### Comparison

|  | Business Integration System User access tokens | User access tokens |
| --- | --- | --- |
| Access Designations | Access is **explicitly delegated** at the time of authorization. Your app can only access the assets that were designated by your business client when they completed the Facebook Login for Business flow. Tech Providers only. | Access is **inherited** from your app user’s current account access; your app can access the same business assets that the app user currently has access to. |
| Account association | Associated with your business client’s business portfolio rather than a specific user. Any admin in your business client’s admin group can grant your app a system user access token. | Associated with your app user’s personal Facebook account. |
| Expiration and refresh | Defaults to **never expire** for the common offline server-to-server communication. | A **short-lived** token for online activities such as web browsers. |
| OAuth grant type | **Authorization Code** grant only. | **Implicit** grant by default, and can support authorization code grant for improved security. Mainly used for user-agent based clients such as web browsers and mobile apps. |
| Representation | Part of the Tech Provider integration’s infrastructure, initialized by a client business through Tech Provider’s app installation. | Represents servers or software making API calls to assets owned or managed by a<br>[Business Manager.](https://developers.facebook.com/docs/business-manager-api) |
| Token Invalidation | Your business clients can invalidate business integration system User access tokens by going to **[Business Manager⁠](https://business.facebook.com/) \> Settings > Business Settings > Integrations > Connected apps** and removing your app. | Your business clients can invalidate User access tokens by going to Facebook and navigating to **Settings & privacy** \> **Settings** \> **Security and login** \> **Business Integrations** and removing your app. |

## Business Integration System User Access Token Management API

When a client business installs an app through Facebook Login for Business and generates a business integration system user access token, the token includes a client business ID. This ID represents the client business and is used by your app to make API calls.

### Get a client business ID

To get a client business ID from the business integration system user access token, send a `GET` request to the `/me` endpoint with the `fields` parameter set to `client_business_id` and the `access_token` parameter to your app user’s business integration system user access token.

```
curl -i -X GET \
"https://graph.facebook.com/<API_VERSION>/me \
  ?fields=client_business_id
  &access_token=<BUSINESS_INTEGRATION_SYSTEM_USER_ACCESS_TOKEN>”
```

On success your app receives a JSON response with your app user’s client business ID.

```
{
  "client_business_id": "<CLIENT_BUSINESS_ID>",
  "id": "<APP_SCOPED_ID>"
}
```

### Get tokens

The `/<CLIENT_BUSINESS_ID>/system_user_access_tokens` endpoint allows you to manage your existing business integration system user access tokens. Actions include:

Generate granular business integration system user access tokens from the existing business integration system user access tokens
Fetch any existing business integration system user access tokens

##### Parameters

| Object | Description |
| --- | --- |
| `access_token` _string_ | **Required.** This access token requires the `business_management` permission |
| `appsecret_proof` _string_ | **Required.**<br>The [`appsecret_proof`](https://developers.facebook.com/docs/graph-api/guides/secure-requests#generate-the-proof) is a `sha256` hash of your access token ensuring API calls are from a server are more secure. |
| `asset` _int_ | Optional.<br>When you want to generate a more granular token, you can set a list of `asset` IDs, separated by commas. The list of assets will have to be a subset of assets from the original access token. |
| `fetch_only` _bool_ | Optional.<br>The flag you want to use to fetch the existing token and indicate this operation is read only |
| `scope` _bool_ | Optional.<br>When you want to generate a more granular token, you can set a list of `scope` ids, separated by a comma. The list of assets will have to be a subset of scopes from the original access token. |
| `set_token_expires_in_60_days` _bool_ | Optional.<br>When you generate a new token, set to `true` so that the token expires in 60 days. |
| `system_user_id` _int_ | Optional. The ID for the system user included in the access token. |

##### Sample request

_Formatted for readability._

```
curl -i -X POST "https://graph.facebook.com/v25.0/<CLIENT_BUSINESS_ID>/system_user_access_tokens
    ?appsecret_proof=<APPSECRET_PROOF_HASH>
    &access_token=<ACCESS_TOKEN>
    &system_user_id=<SYSTEM_USER_ID>
    &fetch_only=true"
```

On success your app receives a JSON response with a new access token to be used in subsequent API calls.

```
{
  "access_token": "<NEW_ACCESS_TOKEN>"
}
```

## Login flow experience

| User access token login flow | Business integration system user access token login flow |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t15.5256-10/348280015_586506133549065_1248618649964712243_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=861778&_nc_ohc=EtABVlMvjicQ7kNvwGNE962&_nc_oc=AdpWyAUJg75uL9JSezB5_xjbaYSXen3UB0Jky6k-_uN2kUKrDsQlbWjDLvG2xwePtwA&_nc_zt=23&_nc_ht=scontent-lax3-1.xx&_nc_gid=nd0rLKm9x_Z4R-WLUR3t7w&_nc_ss=7b289&oh=00_Af5ADuIfxTbq8wSWcuqrDCE7o8ZkApQUPXY6JirCRId5bg&oe=6A10C5FC) | ![](https://scontent-lax7-1.xx.fbcdn.net/v/t15.5256-10/344303707_1061948651445158_8496308741180122348_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=861778&_nc_ohc=qxlCC5jLhRwQ7kNvwFLZ9lH&_nc_oc=AdoyDmRyZQy859GRTLE-wvB-TMT6aZFgPwzcyGF-FSKDzLQqiSYxGQQmhxwkPzgClE8&_nc_zt=23&_nc_ht=scontent-lax7-1.xx&_nc_gid=nd0rLKm9x_Z4R-WLUR3t7w&_nc_ss=7b289&oh=00_Af5kMat2JmxnSrRtyR9gTl0im0Ta7TEkVAHQ5iwVzPvo1w&oe=6A10B092) |

## Get started

The following are the steps required to set up Facebook Login for Business if you don’t already have an app.

### Create an app

In Meta’s App Dashboard, create a [**Business type app**.](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-types#business)

Add the **Facebook Login for Business** product.

In the left side menu select **Configurations**.

You can either **\+ Create configuration** to create a configuration or **Create from template** to select one of Meta’s preset configurations.

You can create multiple configurations and present them to different sets of users.

Name your configuration

Choose the type of access token you want to request from your business clients, a User access token or System-user access token and token expiration.

If you select User access token then your app users will log in using their personal Facebook account. If you select System-user access token your app users will be required to log in using a business portfolio. This is only required if this configuration needs continuous access to business assets, such as Facebook Pages, ad accounts or Instagram accounts.

Select all the assets your app needs access to.

Select the permissions your app needs and click **Create**.

You will receive a **Configuration ID** that you will use in your code to invoke the login dialog.

#### Create a WhatsApp Business Platform Embedded Signup configuration

To create a WhatApp Embedded Signup configuration, visit our [WhatsApp Embedded Signup guide.](https://developers.facebook.com/documentation/business-messaging/whatsapp/embedded-signup/overview)

#### Create a Conversions API for Business Messaging configuration

To create a Conversions API for Business Messaging configuration, visit our [Marketing API – Conversions API for Business Messaging guide](https://developers.facebook.com/documentation/ads-commerce/conversions-api/business-messaging).

#### Create an Instagram Graph API configuration

To create an Instagram Graph API configuration, visit our [Instagram Graph API documentation](https://developers.facebook.com/documentation/instagram-platform/instagram-api-with-facebook-login).

### Invoke a login dialog

Invoke a login dialog using one of our SDKs (recommended) or manually build your login flow.

#### Invoking with our SDKS

You can use any of our SDKs to invoke the login dialog by replacing the list of scopes (permissions) your app needs with your configuration ID and the access token’s required OAuth grant type.

If you are unfamiliar with our SDKs, we recommend that you first install the JavaScript SDK and get it working with the consumer Facebook Login product before proceeding, as the following examples reference the SDK.

##### Business integration system user access token configurations

Here’s an example of the JavaScript SDK’s `FB.login()` method modified to use a configuration for a System User access token. Note that `config_id` has replaced `scope` (which should not be used), the `response_type` has been set to `code`, since SUAT’s require the authorization code grant type, and `override_default_response_type` must be set to `true`. When true, any response types passed in the `response_type` will take precedence over the default types.

```
FB.login(
  function(response) [\
    console.log(response);\
  ],
  [\
    config_id: '<CONFIG_ID>',\
    response_type: 'code',\
    override_default_response_type: true\
  ]
);
```

When the user completes the login dialog flow we will redirect the user to your redirect URL and include a code. You must then exchange this code for an access token by performing a server-to-server call to our servers.

```
GET https://graph.facebook.com/v25.0/oauth/access_token?
  client_id=<APP_ID>
  &client_secret=<APP_SECRET>
  &code=<CODE>
```

See [Exchanging Code for an Access Token](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow#exchangecode) for more information about this step.

##### User access token configurations

Here’s an example of the JavaScript SDK’s `FB.login()` method modified to use a configuration for a User access token. Note that `config_id` has replaced `scope` (although `scope` can still be included, we recommend that you do not use it).

```
FB.login(
  function(response) {
    console.log(response);
  },
  {
    config_id: '<CONFIG_ID>' // configuration ID goes here
  }
);
```

Here’s an example of the JavaScript SDK’s **login** button modified to use a User access token configuration:

```
<fb:login-button config_id="<CONFIG_ID>" onlogin="checkLoginState();">
</fb:login-button>
```

#### Build a manual login flow

See [Manually Building the Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow) to learn how to invoke the login dialog manually. When [invoking the login dialog and setting the redirect URL](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow#logindialog), include your configuration ID as an optional parameter (although scope can still be included, we recommend that you do not use it).

```
config_id=<CONFIG_ID>
```

## Switch to Facebook Login for Business

It is recommended you conduct [testing](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#getting-started) and learn about potentially encountered problems before switching to Facebook Login for Business.

Facebook Login for Business is available to [**Business type apps**](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-types#business).

If your app is eligible to switch to Facebook Login for Business, you should be able to see an opt in banner by the following steps:

Select your app in the App Dashboard

Go to or add the Facebook Login product

Click either **Settings** or **Quickstart** in the left side menu

Click the “Get started with Facebook Login for Business” button at the top of the page.

Note that your current access tokens will not be impacted upon switching to Facebook Login for Business. Additionally, any test app(s) associated with this app will also switch to Facebook Login for Business.

After switching, your app type will be under **Business type**. If your app is not functioning as intended, each app is allowed to roll back to Facebook Login within **30 days** after the switch.

## Troubleshooting

Business clients might encounter error messages for the following reasons:

Config ID is invalid
Business System User Access Token is not currently supported on Mobile devices
Business System User Access Token is set up with incorrect response\_type

Potential breaking changes:

If your app type is currently **None**, switching to Facebook Login for Business will change your app’s type to **Business** and will only retain access to the [permissions](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#supported-permissions), [features](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#supported-features) and [products](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#supported-products) listed above.
If you request permissions or features from business clients that Facebook Login for Business doesn’t support, those permissions and features will be **revoked immediately** once you switch your app to Facebook Login for Business.
If you only request `email` and/or `public_profile` from your business clients, switching the app to Facebook Login for Business will lead to the invalidation of all previously installed tokens for these clients.
If your app has both Facebook Login for Business and Meta Business Extension, the Meta Business Extension experience will be limited to permissions supported by Facebook Login for Business.
Business Asset User Profile Access may affect how user profile data is accessed and managed through our APIs.
Note that if the login dialog for Facebook Login for Business is invoked via configuration id, and if you decide to rollback to Facebook Login, the login dialog might fail to load as Facebook Login does not support the `config_id` parameter and you need to replace the `config_id` parameter with the `scope` parameter instead.

Learn more about [Meta Business Extension.](https://developers.facebook.com/docs/facebook-business-extension/fbe/get-started/business-login)

## Switch back to Facebook Login

Only available when an existing app has switched to Facebook Login for Business; Newly created Business Type apps cannot switch back to Facebook Login.

After switching to Facebook Login for Business, if your app is not functioning as intended after switching to Facebook Login for Business, you can roll back to Facebook Login by going to the **App Dashboard** \> **Facebook Login for Business** \> **Settings** and clicking the **Switch to Facebook Login** link. You will be presented with a survey which helps us improve the Facebook Login for Business configuration experience. Each app is allowed to roll back to Facebook Login within **30 days** after the switch.

## FAQs

**Facebook Login for Business isn’t available for my app - what should I do?**

The easiest way to add Facebook Login for Business is to create a new Business Type app, where Facebook Login for Business is automatically available, and request supported business permissions through Meta App Review. If you want to use it for an existing None type app, your app must have advanced access to at least one supported business permission.

**What should I use for authentication if my app is not intended for businesses or if I am not a Tech Provider building an app for other businesses to use?**

If you are not a Tech Provider building solutions using Meta’s business APIs, Facebook Login is recommended for consumer authentication.

**What permissions do I need to request when implementing Facebook Login for Business?**

Only request the minimum permissions necessary for your app’s functionality. Be transparent with users about why you need each permissions and features. Note that the `email` and `public_profile` permissions must be requested with at least one other supported [business permission](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business#supported-permissions).

**Is advanced access to the public\_profile permission required before a Facebook Login for Business app goes live?**

Yes, advanced access to the `public_profile` permission is required for Facebook Login for Business apps before they go live. This requirement is crucial to ensure that the app can support authorization from users who do not have an app role, commonly referred to as external users.

Did you find this page helpful?

![Thumbs up icon](https://static.xx.fbcdn.net/rsrc.php/yR/r/OEXJ0_DJeZv.svg)

![Thumbs down icon](https://static.xx.fbcdn.net/rsrc.php/yb/r/qKPgNVNeatU.svg)

ON THIS PAGE

Requirements

Supported permissions

Supported features

Supported products

Supported access tokens

User access tokens

Business integration system user access tokens

Requirements

Granular business integration system user access tokens

Comparison

Business Integration System User Access Token Management API

Get a client business ID

Get tokens

Login flow experience

Get started

Create an app

Create a WhatsApp Business Platform Embedded Signup configuration

Create a Conversions API for Business Messaging configuration

Create an Instagram Graph API configuration

Invoke a login dialog

Invoking with our SDKS

Build a manual login flow

Switch to Facebook Login for Business

Troubleshooting

Switch back to Facebook Login

FAQs

* * *