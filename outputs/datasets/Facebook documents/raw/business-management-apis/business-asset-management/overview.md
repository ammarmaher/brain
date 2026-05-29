---
url: https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fbusiness-asset-management%2Foverview%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)


  - [Overview](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides)

- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)

On This Page

[Asset Management Overview](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#asset-management-overview)

[Business Asset Groups](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#business-asset-groups)

[Permissions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#limits)

[Limitations](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#limits-2)

[Permitted Roles](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#roles)

[Catalogs](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#catalogs)

[Ad Accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#ad-accounts)

[Pages](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#pages)

[Apps](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#apps)

[Instagram accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#instagram-accounts)

# Asset Management Overview

A business can access multiple assets. Your business owns the assets or your business accesses them as an **agency**. Use [Facebook's Business Management Asset APIs](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/assets/) to add, remove, or query the relationship between a business and its assets, to manage business assets and access to the assets.

**Agency** refers to a type of business entity that can manage or access assets owned by another business. This relationship allows the agency to perform specific tasks or actions on the behalf of the client, such as managing ad accounts, pages, or other digital assets.

## Business Asset Groups

Business asset groups help large advertisers or agencies efficiently manage users and assets in their business. You should organize assets and users in a way that maps to real-world operations. For example, a business can structure its assets and users according to brand, region, client, or an organizing principle of their choice.

Business asset groups can contain ad accounts, Pages, Facebook pixels, offline event sets, apps, catalogs, custom conversions and Instagram accounts. The assets can be owned by a business or shared to provide access to an agency.

You can use this API add users to a business asset group. Once added, you can grant people permissions to assets in a business asset group. This helps you grant access to multiple assets all at once, without creating too many admins at the business level.

With this API, you can manage business asset groups that someone already created through [Business Manager](https://business.facebook.com/) or you can administer assets _within the business asset group_. You can:

- Get a list of business asset groups associated with a business
- Delete or rename a business asset group
- View all assets in a business asset group
- Get, add, edit and delete user permissions for assets in a business asset group
- Assign users to a business asset group
- Get, add and delete assets from a business asset group

## Permissions

To use Business Asset Groups API, your app needs the appropriate [Marketing API Access Level](https://developers.facebook.com/docs/marketing-api/access#limits):

- For all add and remove endpoints: Access token's user needs to be an admin of the business. Otherwise, the access will be denied.
- For all API endpoints, your app needs `business_management` permission.

You need extra permissions for:

| Business Asset Group Endpoints | Required permissions |
| --- | --- |
| Get list of Ad Accounts | `ads_management` |
| Get list of product catalogs, add product catalog or remove product catalog | `ads_management` |
| Get list of Instagram accounts, add Instagram account or remove Instagram account | `ads_management`. If you are using [Marketing API v4.0](https://developers.facebook.com/docs/graph-api/changelog/version4.0), you also need `instagram_basic`. |
| Get list of pixels | `ads_read` |
| Get list of offline event sets | `ads_management` |
| Get list of custom conversion | `ads_read` |
| Add custom conversion | `ads_management` |

## Limitations

You see an error if you try to reduce or remove permissions for an asset contained in a business asset group via the following API calls:

- `DELETE` request to [`/{page_id}/assigned_users`](https://developers.facebook.com/docs/graph-api/reference/page/assigned_users/)
- `POST` request to [`/{page_id}/assigned_users`](https://developers.facebook.com/docs/graph-api/reference/page/assigned_users/)
- `DELETE` request to [`/act_{ad_account_id}/assigned_users`](https://developers.facebook.com/docs/marketing-api/reference/ad-account/assigned_users/)
- `POST` request to [`/act_{ad_account_id}/assigned_users`](https://developers.facebook.com/docs/marketing-api/reference/ad-account/assigned_users/).

To reduce or remove permissions, follow these steps:

1. Make a call to get a list of asset groups associated with a business. Look for asset groups where `contained_asset_id` is equal to the `{page_id}` or `{ad_account_id}`.
2. For each returned business asset group id, make an API call to remove a user from that group.
3. Then, call the above `DELETE` or `POST` requests to remove the permission for that user on Page or Ad Account.

If you provide permissions management features in your app for other businesses, you should use this API to prevent inconsistencies and errors between the API and [Business Manager](https://business.facebook.com/).

You cannot set permissions on apps, catalogs, Instagram accounts and custom conversions through the business asset group. Instead, you should assign permissions at the asset level.

For example, if you add Roger to a business asset group in _Jasper’s_ business manager, he can get permissions to any Pages, ad accounts, pixels and so on, in that business asset group. However to remove or edit Roger’s permissions to any asset in the _Jasper’s_ business asset group, you must perform this action in the business asset group itself.

You can add user permissions at the asset level using asset API, such as change someone from Page moderator to admin. See examples for [Page](https://developers.facebook.com/docs/graph-api/reference/page/assigned_users/) and [Ad Account](https://developers.facebook.com/docs/marketing-api/reference/ad-account/assigned_users/).

[Business asset groups replaced Projects API on October 13, 2019](https://developers.facebook.com/docs/graph-api/changelog/breaking-changes). You should migrate all apps on Projects API to business asset groups.

## Permitted Roles

When a user is added to a business, one of the following two roles can be assigned via the [Business Users APIs](https://developers.facebook.com/docs/marketing-api/business-manager/get-started#users):

| API Constant | Name | Description |
| --- | --- | --- |
| `ADMIN` | Business Admin | Can manage all aspects of the business settings, including modifying or deleting the account and adding or removing people. |
| `EMPLOYEE` | Business Employee | Can see all of the information in the business settings but can't make any changes, except to add Pages or ad accounts which this user is an admin of to the business. |

### Catalogs

The following roles can be assigned to any user of the business, Admin or Employee, on catalogs accessible by this business using the [Catalog APIs](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/catalog/):

| API Constant | Name | Description |
| --- | --- | --- |
| `['MANAGE', 'ADVERTISE']` | Catalog Admin | Can manage all aspects of the catalog with full read and write access, including create/update/delete of items, managing feeds, attaching catalog to pixels and apps, creating product sets, running Advantage+ catalog ads with the catalog, changing catalog settings, and so on. |
| `['ADVERTISE']` | Catalog Advertiser | Can create product sets and run Advantage+ catalog ads with the catalog. Cannot edit its products, feeds, or catalog settings. |

### Ad Accounts

The following tasks can be assigned to any user of the business for ad accounts accessible by this business using the [Ad Account APIs](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/ad-accounts/):

| API Constant | Name | Description |
| --- | --- | --- |
| `['MANAGE', 'ADVERTISE', 'ANALYZE']` | Ad Account Admin | Can manage all aspects of campaigns, reporting, billing and account permissions, and can set ad account spending limits. Ad account admins can also associate business payment methods. |
| `['ADVERTISE', 'ANALYZE']` | Advertiser on ad account | Can see and edit ads and set up ads using the payment method associated with the ad account. |
| `['ANALYZE']` | Ad Account analyst | Can see ad performance. |

### Pages

You can assign the following tasks to any user of a business on Pages accessible to this business using the [Page APIs](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/pages/):

| API Constant | Name | Description |
| --- | --- | --- |
| `['MANAGE', 'CREATE_CONTENT', 'MODERATE', 'ADVERTISE', 'ANALYZE']` | Page admin | Can manage Page roles, send messages and post as the Page, create ads, and view insights. |
| `['CREATE_CONTENT', 'MODERATE', 'ADVERTISE', 'ANALYZE']` | Page editor | Can edit the Page, send messages and post as the Page, create ads, and view insights. |
| `['MODERATE', 'ADVERTISE', 'ANALYZE']` | Page moderator | Can respond to and delete comments on the Page, send messages as the Page, create ads, and view insights. Cannot post as the Page. |
| `['ADVERTISE', 'ANALYZE']` | Page Advertiser | Can create ads for the Page and view insights. Cannot post as the Page. |
| `['ANALYZE']` | Page analyst | Can view insights. Cannot post as the Page. |

### Apps

There is no role or task management APIs for apps in Business Manager.

### Instagram accounts

There is no role management for **Instagram accounts** in Business Manager. Users with access to ad accounts that are linked to Instagram accounts can run ads for those Instagram accounts.

On This Page

[Asset Management Overview](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#asset-management-overview)

[Business Asset Groups](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#business-asset-groups)

[Permissions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#limits)

[Limitations](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#limits-2)

[Permitted Roles](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#roles)

[Catalogs](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#catalogs)

[Ad Accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#ad-accounts)

[Pages](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#pages)

[Apps](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#apps)

[Instagram accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview#instagram-accounts)