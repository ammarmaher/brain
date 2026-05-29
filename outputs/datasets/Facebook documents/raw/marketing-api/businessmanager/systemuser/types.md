---
url: https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser/types
title: Overview - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fsystem-users%2Foverview%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)


  - [Overview](https://developers.facebook.com/docs/business-management-apis/system-users/overview)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/system-users/guides)

- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)

On This Page

[Overview](https://developers.facebook.com/docs/business-management-apis/system-users/overview#overview)

[Types of System Users](https://developers.facebook.com/docs/business-management-apis/system-users/overview#types-of-system-users)

[Business Assets Access](https://developers.facebook.com/docs/business-management-apis/system-users/overview#business-assets-access)

[Your Business](https://developers.facebook.com/docs/business-management-apis/system-users/overview#your-business)

[Assets](https://developers.facebook.com/docs/business-management-apis/system-users/overview#assets)

[Admin User](https://developers.facebook.com/docs/business-management-apis/system-users/overview#admin-user)

[Admin System User](https://developers.facebook.com/docs/business-management-apis/system-users/overview#admin-system-user)

[System User](https://developers.facebook.com/docs/business-management-apis/system-users/overview#system-user)

[Permissions to Access](https://developers.facebook.com/docs/business-management-apis/system-users/overview#permissions-to-access)

[System User Access Token](https://developers.facebook.com/docs/business-management-apis/system-users/overview#system-user-access-token)

[System Users And Custom Audiences](https://developers.facebook.com/docs/business-management-apis/system-users/overview#system-users-custom-audiences)

[Limits](https://developers.facebook.com/docs/business-management-apis/system-users/overview#limits)

[How do I increase my system user limits?](https://developers.facebook.com/docs/business-management-apis/system-users/overview#how-do-i-increase-my-system-user-limits-)

# Overview

To have system users, your Business Manager must:

- Have a real person as an admin user.
- Own a Facebook app. You should claim the app and associate it with a business via API or in [Business Manager](https://business.facebook.com/). The app must belong to the same business

**Note:** A system user can only be granted a role on an app if both the system user and the app belong to the same business. If your app needs to access data using a system user and access token belonging to another business, use the [Business On Behalf Of API](https://developers.facebook.com/docs/marketing-api/business-manager/guides/on-behalf-of/) instead.
- Have the Meta app go through an app review (and Business verification) for the permissions the [system user wants access to](https://developers.facebook.com/docs/apps/review/).

Meta limits the number of [system users per business manager](https://developers.facebook.com/docs/business-management-apis/system-users/overview#limits) based on your app's [access level](https://developers.facebook.com/docs/marketing-api/access).

This [`bash` script](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Fdilraba%2FFBSystemUserSampleCalls&h=AUDVsD0P1W84MF3-IptCNKpJ-vYoI1rCR6A7Ki-LV2KhfD-7rm5LjibIwmTnNt1V-7KMiS-BsIB-7T6QHV-IjLaToFA3ErjXfhtx3oY-FCedHogcj-8w3-Lr4pzrWTcqYpqBHByMQibWFw) sample shows API calls which create a system user token then use it token to make Marketing API calls.

## Types of System Users

There are two types of [system users](https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser): **admin system user** and **system user**.

- **admin system user** can create system users, ad accounts, assign permissions, and more.
- **system user** can only access the assets they have permission for.

You should [create one system user](https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser/create-retrieve-update) for each type of access you need. Use the admin system user to programmatically maintain the right roles. This way, if a system user token is compromised, it has limited scope and cannot compromise more permissions.

Give system user access to assets and use system users for most API calls. You should limit using admin system user for administrative actions, such as assigning permission. Since it has the most permissions, carefully safeguard the admin system user token.

Here is how it works:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/24233839_1709473275741354_3454229990428639232_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=mjngPhvTanMQ7kNvwFd_foI&_nc_oc=Ado60UCKPxwWshplph5J9Py3cQ861S8nCNHbFFfsD4Jq-tLvKzOIt5w0RVX0X2b0vOo&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=UcK0a5Z_wUrkU7xhE6o19w&_nc_ss=7b289&oh=00_Af48LlTgSrsicJQ8aV6t91c23u2h7-kgI3BMFM0_IsxadQ&oe=6A2580A0)

## Business Assets Access

Requirements and actions required to get access to business assets:

### Your Business

We represent your business as an instance of a [Business Manager](https://developers.facebook.com/docs/marketing-api/business-manager-api) in Marketing API. Your Business Manager must claim, create or share a Facebook app built on Marketing API. To create a system user access token, this app must have Standard Access. You can also contact your Facebook representative to be added to a list of businesses allowed to create the token.

### Assets

Assets that belong to your Business Manager. For example: pages, ad accounts, and so on.

### Admin User

All instances of Business Manager have an admin user. Typically, this is the same person who originally created the Business Manager object and manages it over time.

### Admin System User

An admin user can create this special type of user. An admin system user can create new users and access all assets belonging to the business. We do not recommend managing business' assets through an admin system user, since this user type has more power than a regular system user. Limit use of admin system user to creating other system user, and do not use it for access to assets.

### System User

An admin user or admin system user can create a system user. This person can ultimately access assets. Use this type of user to manage a business' assets.

**Note:** A system user can only be granted a role on an app if both the system user and the app belong to the same business. If your app needs to access data using a system user and access token belonging to another business, use the [Business On Behalf Of API](https://developers.facebook.com/docs/marketing-api/business-manager/guides/on-behalf-of/) instead.

### Permissions to Access

A system user must grant their user [permission](https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser/permissions) to access assets owned by a business.

### System User Access Token

You need an app on the Marketing API with the standard access or your app must be added to the allow list by a Facebook representative. Ensure that the app has gone through app review (and verification, if applicable) for required permissions. With a system user and this app, you can [generate a system user access token](https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser/install-apps-and-generate-tokens). After you have this token, and after a system user grants user permissions to access assets, your can access those assets programmatically.

## System Users And Custom Audiences

For a system user to operate with a Custom File Custom Audience in a business, a non-system user needs to accept that Business’ Custom Audience terms of service. The acceptance must be made from an ad account that belongs to that Business.

Learn more about [Custom Audience Terms Of Service](https://developers.facebook.com/docs/marketing-api/audiences-api/custom-audience-terms-of-service) and the [options available for **system users**](https://developers.facebook.com/docs/marketing-api/audiences-api/custom-audience-terms-of-service#system-users).

## Limits

Your app's [access](https://developers.facebook.com/docs/marketing-api/get-started/authorization) level to Ads Management Standard Access Feature determines how many System Users you can create for the Business Manager that owns your app.

| Access Level | System Users | Admin System Users |
| --- | --- | --- |
| **Standard** | 1 | 1 |
| **Advanced** | 10 | 1 |

### How do I increase my system user limits?

**Prerequisite:** Make sure the app for which you are requesting the system user increase is in live [mode](https://developers.facebook.com/docs/development/build-and-test/app-modes)

If you want to increase your System User limits you would have to get Advanced Access level to **Ads Management Standard Access** feature. You can check your current Access Level for this feature by going to **App Dashboard > App Review > Permissions and Features** and searching for **Ads Management Standard Access**. Under Action, click **Request advanced access**. You can learn more about it [here](https://developers.facebook.com/docs/marketing-api/get-started/authorization#permissions-and-features)

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=3342979815877358&version=1770475758)

**NOTE:** Admin System User limits will stay at 1 admin. This is done purposely to facilitate good practice of using Admin System User to manage the access of Employee System User with scoped permissions and not to use it for access to assets.

On This Page

[Overview](https://developers.facebook.com/docs/business-management-apis/system-users/overview#overview)

[Types of System Users](https://developers.facebook.com/docs/business-management-apis/system-users/overview#types-of-system-users)

[Business Assets Access](https://developers.facebook.com/docs/business-management-apis/system-users/overview#business-assets-access)

[Your Business](https://developers.facebook.com/docs/business-management-apis/system-users/overview#your-business)

[Assets](https://developers.facebook.com/docs/business-management-apis/system-users/overview#assets)

[Admin User](https://developers.facebook.com/docs/business-management-apis/system-users/overview#admin-user)

[Admin System User](https://developers.facebook.com/docs/business-management-apis/system-users/overview#admin-system-user)

[System User](https://developers.facebook.com/docs/business-management-apis/system-users/overview#system-user)

[Permissions to Access](https://developers.facebook.com/docs/business-management-apis/system-users/overview#permissions-to-access)

[System User Access Token](https://developers.facebook.com/docs/business-management-apis/system-users/overview#system-user-access-token)

[System Users And Custom Audiences](https://developers.facebook.com/docs/business-management-apis/system-users/overview#system-users-custom-audiences)

[Limits](https://developers.facebook.com/docs/business-management-apis/system-users/overview#limits)

[How do I increase my system user limits?](https://developers.facebook.com/docs/business-management-apis/system-users/overview#how-do-i-increase-my-system-user-limits-)