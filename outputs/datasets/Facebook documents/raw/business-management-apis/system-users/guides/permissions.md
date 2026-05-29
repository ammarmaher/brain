---
url: https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions
title: Permissions - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fsystem-users%2Fguides%2Fpermissions%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)


  - [Overview](https://developers.facebook.com/docs/business-management-apis/system-users/overview)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/system-users/guides)


    - [Create, Retrieve and Update](https://developers.facebook.com/docs/business-management-apis/system-users/create-retrieve-update)
    - [Install Apps, Generate, Refresh, and Revoke Tokens](https://developers.facebook.com/docs/business-management-apis/system-users/install-apps-and-generate-tokens)
    - [Permissions](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions)
    - [API Calls](https://developers.facebook.com/docs/business-management-apis/system-users/guides/api-calls)

- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)

On This Page

[System User Permissions](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#system-user-permissions)

[Assign System User Tasks on Ad Accounts](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#role-on-ad-accounts)

[Assign System User Pages Tasks](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#role-on-pages)

[Assign System User Tasks on Proxied Assets](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#role-on-proxied)

[Retrieve System User Permissions](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#retrieve-permissions)

# System User Permissions

## Assign System User Tasks on Ad Accounts

You need the following to make the API call:

- `user` \- System user id that you created
- Tasks - Access type for this system user for the ad account: `['MANAGE']`, `['ADVERTISE']` and `['ANALYZE']`.
- `access_token` \- of an admin user or **admin system user**.

To assign system user permissions to an ad account, make the following `POST` request:

```code
curl \
-F "user=APP_SCOPED_SYSTEM_USER_ID" \
-F "tasks=['MANAGE', 'ADVERTISE', 'ANALYZE']" \
-F "business=BUSINESS_ID" \
-F "access_token=ACCESS_TOKEN" \
"https://graph.facebook.com/VERSION/act_AD_ACCOUNT_ID/assigned_users"
```

## Assign System User Pages Tasks

You need the following to make the call:

- `user` \- System user id that you created
- Tasks - Access type for this system user for Page: `['MANAGE']`, `['CREATE_CONTENT']`, `['MODERATE']`, `['ADVERTISE']` and `['ANALYZE']`
- `access_token` \- of admin user or **admin system user**.

To assign system user permissions to a page, make this `POST` request:

```code
curl \
-F "user=APP_SCOPED_SYSTEM_USER_ID" \
-F "tasks=['ADVERTISE', 'ANALYZE']" \
-F "access_token=ACCESS_TOKEN" \
"https://graph.facebook.com/VERSION>/PAGE_ID/assigned_users"
```

## Assign System User Tasks on Proxied Assets

You may request access to an ad account or a page owned by another Business Manager. Or a business can grant access to assets owned to another business. See [Business Assets](https://developers.facebook.com/docs/marketing-api/businessmanager/assets).

**System users** can have access for these proxied assets for their given tasks. The idea behind this is to provide mechanism to make API calls to ad accounts or Pages that your business manager handles for your clients.

## Retrieve System User Permissions

To see permissions that a system user has over assets, you need:

- `business_id` \- Business Manager owning this system user
- `access_token` \- Of user with `business_management` permission or an admin user

Then, make this call:

```code
curl -G \
-d "fields=email,assigned_ad_accounts,assigned_pages" \
-d "access_token=ACCESS_TOKEN" \
https://graph.facebook.com/VERSION/APP_SCOPED_SYSTEM_USER_ID
```

On This Page

[System User Permissions](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#system-user-permissions)

[Assign System User Tasks on Ad Accounts](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#role-on-ad-accounts)

[Assign System User Pages Tasks](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#role-on-pages)

[Assign System User Tasks on Proxied Assets](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#role-on-proxied)

[Retrieve System User Permissions](https://developers.facebook.com/docs/business-management-apis/system-users/guides/permissions#retrieve-permissions)