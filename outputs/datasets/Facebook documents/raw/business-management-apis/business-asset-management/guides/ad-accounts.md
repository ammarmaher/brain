---
url: https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/ad-accounts
title: Ad Accounts - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fbusiness-asset-management%2Fguides%2Fad-accounts%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)


  - [Overview](https://developers.facebook.com/docs/business-management-apis/business-asset-management/overview)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides)


    - [Manage Assets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets)
    - [Asset Groups And Users](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups)
    - [Ad Accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/ad-accounts)
    - [Pages](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/pages)
    - [Apps](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/apps)
    - [Instagram Accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/instagram-accounts)
    - [Catalog](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/catalog)
    - [Business-to-Business Functions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business)
    - [Pixel Sharing](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-pixel-sharing)
    - [Appeals APIs](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/appeals)
    - [Share Custom Audiences between Business Managers](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/share-custom-audiences)

- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)

# Ad Accounts

As a business admin, you can claim ad accounts that belong to a business. This enables you to easily assign people to the ad accounts they should access. You can also assign Shared Funding Sources to your ad accounts.

[Ad account groups](https://developers.facebook.com/docs/reference/ads-api/adaccountgroup) cannot be claimed by a business. Users with access to certain ad account groups still have access to them after those users are added to a Business Manager.

## Claim Accounts

If you manage ad accounts outside of a Business Manager with the **Admin** role, you can claim them for your business. This is a one-time procedure. Once claimed, you can only manage the ad accounts in that Business Manager.

Creative Accounts are not claimable.

To claim an ad account for your business, provide the ad account ID in the format `act_###`. Send a `POST`:
\\The requester needs to be an admin of the Business claiming the ad account

```code
curl \
  -F "adaccount_id=act_<AD_ACCOUNT_ID>" \
  -F "access_token=<ACCESS_TOKEN>" \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/owned_ad_accounts"
```

If you are an Admin of the ad account, we immediately approve this claim request. Facebook returns `access_status` set to `CONFIRMED`.

If you are a user who **does not have the proper permissions on the ad account**, we send an ownership request to the ad account's Admins. Once we send the request, the response contains `access_status` set to `PENDING`.

To accept an ownership request, you must be an ad account admin, and you should log in and accept the request in Ads Manager.

## Request Account Access

Most marketing companies won't need to claim ad accounts from their clients. See [Business-to-Business Functions](https://developers.facebook.com/docs/marketing-api/businessmanager/business-to-business) to request access to assets owned by other business managers.

## Create Ad Accounts

You must be an admin for a business to create new ad accounts. You can't use shared logins of business admins to create new ad accounts or perform other actions.

To use this API, you must have a valid business and page setup. If you have any incomplete ad accounts or pages unpublished by Facebook, you will not be able to create a new ad account.

Ad account creation using the API is limited to 5 ad accounts. To create more than 5 ad accounts, you must do so manually.

The fields available are:

| Name | Description |
| --- | --- |
| `name`<br>type: string | Name of the ad account |
| `timezone_id`<br>type: int | ID of the timezone |
| `currency`<br>type: string | Currency abbrevation used for this ad account |
| `partner`<br>type: long or string | Facebook Business Partner (FBP). Must be a Facebook Page Alias, Facebook Page ID or a Facebook App ID. If unavailable, use `NONE` or `UNFOUND`. |
| `end_advertiser`<br>type: long or string | Entity the ads will target. Must be a Business ID. If unavailable, use `NONE` or `UNFOUND`. |
| `media_agency`<br>type: long or string | Agency; this could be your own business. Must be a Facebook Page Alias, Facebook Page ID or a Facebook App ID. If unavailable, use `NONE` or `UNFOUND`. |
| `invoice`<br>type: boolean | If a business has a Business Manager-Owned Normal Credit Line with Facebook, we attach the ad account to that credit line. |

To create a new ad account for a business, specify `name`, `currency`, `timezone_id`, `end_advertiser`, `media_agency`, and `partner`. Please see the following conditions:

- `media_agency` and `partner` must be a Facebook Page Alias, Facebook Page ID or a Facebook app ID.
- `end_advertiser` must be a Business ID.

If your ad account doesn't have an advertiser, Media Agency, or Partner, specify `NONE`. If your ad account has an advertiser, Media Agency, or Partner, but they are not on Facebook as a Page or an app, specify `UNFOUND` .

To create an ad account:

```code
curl \
  -F "name=MyAdAccount" \
  -F "currency=USD" \
  -F "timezone_id=1" \
  -F "end_advertiser=<END_ADVERTISER_ID>" \
  -F "media_agency=<MEDIA_AGENCY_ID>" \
  -F "partner=NONE" \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/adaccount"
```

If you already have an extended credit line with Facebook, you can set `invoice` to `true`. Then, we associate your new ad account with your extended credit line.

The response looks like this:

```code
{
  "id": "act_<ADACCOUNT_ID>",
  "account_id": "<ADACCOUNT_ID>",
  "business_id": "<BUSINESS_ID>",
  "end_advertiser_id": "<END_ADVERTISER_ID>",
  "media_agency_id": "<MEDIA_AGENCY_ID>",
  "partner_id": "NONE"
}
```

## View Owned Accounts

See all the ad accounts your business has access to with a `GET` call:

```code
curl -G \
-d "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/owned_ad_accounts"
```

This returns all ad accounts owned by a business. Some fields are specific to the business and ad account relationship.

- `permitted_tasks` is an array of the tasks you can assign for that particular ad account.
- `access_type` defines if your business is acting as an `OWNER` or an `AGENCY` of the ad account.

To see ad accounts where the access is still pending, make this `GET` call:

```code
curl -G \
  -d "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/pending_owned_ad_accounts"
```

## Remove Accounts

You cannot remove ad accounts from your business if you're `OWNER` and if the accounts are `CONFIRMED`. If you have a `PENDING` access request or you have `AGENCY` access to the ad account, you can make this `DELETE` call:

```code
curl \
  -X DELETE \
  -F "adaccount_id=act_<AD_ACCOUNT_ID>" \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/ad_accounts"
```

## View Account Access

See the ad accounts that someone has permission on with this `GET` call:

```code
curl -G \
  -d "access_token=ACCESS_TOKEN" \
"https://graph.facebook.com/<API_VERSION>/<BUSINESS_SCOPED_USER_ID>/assigned_ad_accounts"
```

To see permissions someone has for an ad account, make this `GET` call:

```code
curl -G \
  -d "access_token=ACCESS_TOKEN" \
  "https://graph.facebook.com/<API_VERSION>/act_<AD_ACCOUNT_ID>/assigned_users"
```

## Add People to Accounts

After your Business Manager is associated with an ad account, you can assign tasks to other business users. Possible tasks include:

| Name | API Constant | Description |
| --- | --- | --- |
| Reporting only | `['ANALYZE']` | Can see data on ad performance |
| General user | `['ADVERTISE', 'ANALYZE']` | Can see and edit ads and create ads using the funding source associated with the ad account. Cannot set anything at ad account level such as funding source itself. |
| Admin | `['MANAGE', 'ADVERTISE', 'ANALYZE']` | Can manage all aspects of campaigns, reporting, billing and ad account permissions. |

You need:

- `adaccount_id` — Ad account ID, in `act_123` form
- `user_id` — User ID to add
- Tasks to assign

To add a new user with the tasks `['MANAGE', 'ADVERTISE', 'ANALYZE']`, make this `POST` call:

```code
curl \
  -F "user=BUSINESS_SCOPED_USER_ID" \
  -F "tasks=['MANAGE', 'ADVERTISE', 'ANALYZE']" \
  -F "access_token=ACCESS_TOKEN" \
  "https://graph.facebook.com/<API_VERSION>/act_<AD_ACCOUNT_ID>/assigned_users"
```

## Change Permissions on Accounts

Make the same `POST` call to change an existing user's tasks as you would to add a new user:

```code
curl \
  -F "user=BUSINESS_SCOPED_USER_ID" \
  -F "tasks=['ANALYZE']" \
  -F "access_token=ACCESS_TOKEN" \
  "https://graph.facebook.com/<API_VERSION>/act_<AD_ACCOUNT_ID>/assigned_users"
```

## Remove People from Ad Accounts

To remove someone from an account, you need:

- `adaccount_id` — Ad account ID, in `act_123` form
- `user_id` — User ID to remove

The `DELETE` call is:

```code
curl \
  -X DELETE \
  -F "user=<BUSINESS_SCOPED_USER_ID>" \
  -F "access_token=ACCESS_TOKEN" \
  "https://graph.facebook.com/<API_VERSION>/act_<AD_ACCOUNT_ID>/assigned_users"
```