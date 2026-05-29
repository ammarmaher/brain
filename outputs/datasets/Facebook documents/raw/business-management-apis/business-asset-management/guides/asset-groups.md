---
url: https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups
title: Asset Groups And Users - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fbusiness-asset-management%2Fguides%2Fasset-groups%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

On This Page

[Asset Groups And Users](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#asset-groups-and-users)

[Asset Groups](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#asset-groups)

[Get List of Groups](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#get-list-of-groups)

[Get a Specific Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#get-a-specific-group)

[Rename Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#rename-group)

[Delete Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#delete-group)

[Users](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#users)

[Requirements](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#requirements)

[Get User Access To Groups](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#get-user-access-to-groups)

[Get User Permissions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#get-user-permissions)

[Assign a User to an Asset Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#assign-a-user-to-an-asset-group)

[Remove a User from an Asset Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#remove-a-user-from-an-asset-group)

# Asset Groups And Users

Manage your business' asset groups and learn how to connect your business users to asset groups.
Business asset groups help large advertisers or agencies efficiently manage users and assets in their business. You should organize assets and users in a way that maps to real-world operations. For example, a business can structure its assets and users according to brand, region, client, or an organizing principle of their choice.

Business asset groups can contain ad accounts, Pages, Facebook pixels, offline event sets, apps, catalogs, custom conversions and Instagram accounts. The assets can be owned by a business or shared to provide access to an agency.

## Asset Groups

### Get List of Groups

To get a list of asset groups associated with a business, send a `GET` request to the `BusinessBusinessAssetGroups` endpoint.

#### Example Request

```code
curl -i -X GET
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/business_asset_groups
    ?access_token=<ACCESS_TOKEN>"
```

#### Example Response

```code
{
  "data": [\
    {\
      "id": "BUSINESS-ID",\
      "name": "Northern Region"\
    },\
    {\
      "id": "BUSINESS-ID",\
      "name": "Western Region"\
    }\
  ],
....
}
```

### Get a Specific Group

To get details about a specific business asset group, send a `GET` request to the `BusinessAssetGroup` endpoint.

#### Example Request

```code
curl -i -X GET
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>
    ?access_token=<ACCESS_TOKEN>"
```

#### Example Response

```code
{
  "id": "BUSINESS-ASSET-GROUP-ID", "name": "BUSINESS-ASSET-GROUP-NAME"
}
```

### Rename Group

To rename a specific asset group, send a `POST` request to the `BusinessAssetGroup` endpoint and set `name` to the new value.

#### Example Request

_Formatted for readability_

```code
curl -i -X POST
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>
   ?name=BUSINESS-ASSET-GROUP-NAME
   &access_token=<ACCESS_TOKEN>"
```

#### Example Response

```json
"success":  "true"
```

### Delete Group

To delete a specific asset group, send a `DELETE` request to the `BusinessAssetGroup` endpoint.

#### Example Request

_Formatted for readability_

```code
curl -i -X DELETE
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>
    ?access_token=<ACCESS_TOKEN>"
```

#### Example Response

```json
"success":  "true"
```

## Users

Public User fields for a User who has a role on the business that has claimed the app.

### Requirements

- Business Asset User Profile Access Feature allows [Business apps](https://developers.facebook.com/docs/apps/app-types#business) to read a small set of public Fields on a User, as long as the User has engaged with assets owned by a Business that has claimed the app.

Refer to the [Business Asset User Profile Access](https://developers.facebook.com/docs/apps/features-reference#business-asset-user-profile-access) reference for a list of readable User Fields.

### Get User Access To Groups

To view a list of all business asset groups that a business-scoped user can access send a `GET` request to the `BusinessScopedUser/AssignedBusinessAssetGroups` endpoint.

#### Example Request

_Formatted for readability_

```code
curl -i -X GET
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_SCOPED_USER_ID>/assigned_business_asset_groups
    ?limit=1
    &access_token=<ACCESS_TOKEN>"
```

#### Example Response

The response includes roles which define the access levels a user has per asset type:

```code
{
  "data": [\
    {\
      "id": "BUSINESS-ID"\
      "name": "USER NAME",\
      "page_roles": [ "ANALYZE", "ADVERTISE" ],\
      "offline_conversion_data_set_roles": ["UPLOAD"],\
      "adaccount_roles": ["ANALYZE", "ADVERTISE"],\
      "pixel_roles": ["ANALYZE", "EDIT"]\
    }\
    ],
        ....
}
```

### Get User Permissions

To read a list of assigned users for an asset group, send a `GET` request to the `BusinessAssetGroupAssignedUsers` endpoint.

#### Example Request

_Formatted for readability_

```code
curl -i -X GET
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/assigned_users
    ?limit=2
    &business=<BUSINESS_ID>
    &access_token=<ACCESS_TOKEN>"
```

#### Example Response

```code
{
  "data": [\
    {\
      "id": "BUSINESS-ID",\
      "name": "Dabney Donigan",\
      "page_roles": [ "ANALYZE" ],\
      "offline_conversion_data_set_roles": [ "ADVERTISE", "UPLOAD", "MANAGE" ],\
      "adaccount_roles": [ "ANALYZE" ],\
      "pixel_roles": [ "ANALYZE", "EDIT" ]\
      }\
      ],
   ....
}
```

### Assign a User to an Asset Group

To assign users to a business asset group, send a `POST` request to the `BusinessAssetGroupAssignedUsers` endpoint.

#### Example Request

_Formatted for readability_

```code
curl -i -X POST
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/assigned_users
    ?business=<BUSINESS_ID>
    &user=USER-ID
    &page_roles=LIST-OF-PAGE-ROLES
    &adaccount_roles=LIST-OF-AD-ACCOUNT-ROLES
    &pixel_roles=LIST-OF-PIXEL-ROLES
    &offline_conversion_data_set_roles=LIST-OF-OFFLINE-CONVERSION-ROLES
    &access_token=<ACCESS_TOKEN>"
```

#### Example Response

```json
"success":  "true"
```

### Remove a User from an Asset Group

To remove a user from a group, send a `POST` request to the `BusinessAssetGroup` endpoint.

#### Example Request

_Formatted for readability_

```code
curl -i -X DELETE \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/assigned_users
    ?business=<BUSINESS_ID>
    &user=<USER_ID>
    &access_token=<ACCESS_TOKEN>"
```

#### Example Response

```json
"success":  "true"
```

On This Page

[Asset Groups And Users](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#asset-groups-and-users)

[Asset Groups](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#asset-groups)

[Get List of Groups](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#get-list-of-groups)

[Get a Specific Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#get-a-specific-group)

[Rename Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#rename-group)

[Delete Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#delete-group)

[Users](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#users)

[Requirements](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#requirements)

[Get User Access To Groups](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#get-user-access-to-groups)

[Get User Permissions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#get-user-permissions)

[Assign a User to an Asset Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#assign-a-user-to-an-asset-group)

[Remove a User from an Asset Group](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/asset-groups#remove-a-user-from-an-asset-group)