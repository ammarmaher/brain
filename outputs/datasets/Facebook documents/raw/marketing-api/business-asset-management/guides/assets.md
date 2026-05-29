---
url: https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/assets
title: Manage Assets - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fbusiness-asset-management%2Fguides%2Fassets%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Manage Assets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#manage-assets)

[Pages](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#bag_pages)

[Ad Accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#ad_act)

[Product Catalogs](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#catalog)

[Instagram Accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#ig)

[Facebook Pixels](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#fbpix)

[Offline Event Datasets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#offline)

[Apps](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#app)

[Custom Conversions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#convers)

# Manage Assets

You can get, add and delete assets from an business asset group. This includes ad accounts, pages, Facebook pixels, offline event sets, app, catalogs, Instagram accounts and custom conversions.

Manage your business' asset groups and learn how to connect your business users to asset groups. Business asset groups help large advertisers or agencies efficiently manage users and assets in their business. You should organize assets and users in a way that maps to real-world operations. For example, a business can structure its assets and users according to brand, region, client, or an organizing principle of their choice.

## Pages

To get a list of all Facebook pages that are in a business asset group:

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_pages?access_token=<ACCESS_TOKEN>"
```

The response looks like this:

```code
{
  "data": [\
    {\
      "name": "Sample Name",\
      "id": "<ID>"\
    },\
    {\
      "name": "Another Name",\
      "id": "<ID>"\
    },\
    {\
      "name": "Third Name",\
      "id": "<ID>"\
    }\
  ],
  ....
}
```

You can add a page to a business asset group. You can add owned pages or shared pages:

```code
curl -i -X POST \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_pages?asset_id=<PAGE_ID>&access_token=<ACCESS_TOKEN>"
```

On success, we return `true`.

To remove a page from a business asset group:

```code
curl -i -X DELETE \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_pages?asset_id=<PAGE_ID>&access_token=<ACCESS_TOKEN>"
```

On success, we return `true`.

## Ad Accounts

Business asset groups can contain either owned or shared ad accounts. To see all the accounts in a group:

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_adaccounts?access_token=<ACCESS_TOKEN>"
```

The response looks like this:

```code
{
  "data": [\
    {\
      "account_id": "<ID>",\
      "id": "act_<ID>"\
    },\
    {\
      "account_id": "<ID>",\
      "id": "act_<ID>"\
    },\
    {\
      "account_id": "<ID>",\
      "id": "act_<ID>"\
    }\
  ],
....
    }
  }
}
```

To add an ad account to a business asset group:

```code
curl -i -X POST \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_adaccounts?asset_id=<AD_ACCOUNT_ID>&access_token=<ACCESS_TOKEN>"
```

To remove an ad account from a business asset group:

```code
curl -i -X DELETE \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_adaccounts?asset_id=<AD_ACCOUNT_ID>&access_token=<ACCESS_TOKEN>"
```

## Product Catalogs

You can add either owned or shared product catalogs to a business asset group. To see all catalogs in a group:

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_product_catalogs?access_token=<ACCESS_TOKEN>"
```

The response looks like this:

```code
{
  "data": [\
    {\
      "id": "<ID>",\
      "name": "1 product catalog"\
    },\
    {\
      "id": "<ID>",\
      "name": "First_Catalog_Products"\
    }\
  ],
....
}
```

To add a catalog to a business asset group:

```code
curl -i -X POST \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_product_catalogs?asset_id=<CATALOG_ID>&access_token=<ACCESS_TOKEN>"
```

On success, we return `true`. To remove a catalog from a business asset group:

```code
curl -i -X DELETE \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_product_catalogs?asset_id=<CATALOG_ID>&access_token=<ACCESS_TOKEN>"
```

## Instagram Accounts

You can add shared or owned Instagram Accounts to a business asset group. To get a list of existing accounts:

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_instagram_accounts?access_token=<ACCESS_TOKEN>"
```

The response looks like this:

```code
{
  "data": [\
    {\
      "id": "<ID>"\
    },\
    {\
      "id": "<ID>"\
    }\
  ],
  ....
}
```

To add an Instagram Account to a business asset group:

```code
curl -i -X POST \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_instagram_accounts?asset_id=<INSTAGRAM_ACCOUNT_ID>&access_token=<ACCESS_TOKEN>"
```

On success, we return `true`.

To remove an account from a business asset group:

```code
curl -i -X DELETE \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_instagram_accounts?asset_id=<ID>&access_token=<ACCESS_TOKEN>"
```

## Facebook Pixels

You can add or remove owned and shared pixels in business asset groups. To see all existing pixels in a business asset group:

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_pixels?access_token=<ACCESS_TOKEN>"
```

The response looks like this:

```code
{
  "data": [\
    {\
      "id": "<ID>"\
    },\
    {\
      "id": "<ID>"\
    }\
  ],
 ....
    }
  }
}
```

To add a pixel to a business asset group:

```code
curl -i -X POST \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_pixels?asset_id=<PIXEL_ID>&access_token=<ACCESS_TOKEN>"
```

On success, we return `true`.

To remove a pixel from a business asset group:

```code
curl -i -X DELETE \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_pixels?asset_id=<PIXEL_ID>&access_token=<ACCESS_TOKEN>"
```

## Offline Event Datasets

Business asset groups can contains both shared and owned offline event datasets. To see all datasets in a business asset group:

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_offline_conversion_data_sets?access_token=<ACCESS_TOKEN>"
```

The response looks like this:

```code
{
 "data": [\
 {\
 "id": "<ID>", "name": "Transfer", "business": {\
 "id": "<ID>", "name": "Acme Industries Inc." }, "enable_auto_assign_to_accounts": false,\
 "is_restricted_use": false\
 },\
 {\
 "id": "<ID>", "name": "Default Offline Event Set For Biz1", "business": {\
 "id": "<ID>", "name": "Biz1" }, "enable_auto_assign_to_accounts": true, "is_restricted_use": false } ],
 ....
 }
```

To add offline event sets to a business asset group:

```code
curl -i -X POST \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_offline_conversion_data_sets?asset_id=<EVENT_SET_ID>&access_token=<ACCESS_TOKEN>"
```

On success, we return `true`.

To remove an event set from a business asset group:

```code
curl -i -X DELETE \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_offline_conversion_data_sets?asset_id=<EVENT_SET_ID>&access_token=<ACCESS_TOKEN>"
```

## Apps

To get all shared and owned apps in a business asset group:

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_applications?access_token=<ACCESS_TOKEN>"
```

The response:

```code
{
 "data": [\
 {\
 "category": "Games", "link": "/instantgames/<ID>/", "name": "testing again", "id": "<ID>" }, {\
 "category": "Lifestyle", "link": "https://www.facebook.com/games/?app_id=<ID>", "name": "AccountKitTest", "id": "<ID>" } ],
 ....
 }
```

To add an app to a business asset group:

```code
curl -i -X POST \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_applications?asset_id=<APP_ID>&access_token=<ACCESS_TOKEN>"
```

To remove an app from a business asset group:

```code
curl -i -X DELETE \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_applications?asset_id=<APP_ID>&access_token=<ACCESS_TOKEN>"
```

When you either add or remove an app successfully, we return `true`.

## Custom Conversions

To see all owned and shared custom conversions data sets in a business asset group:

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_custom_conversions?access_token=<ACCESS_TOKEN>"
```

The response:

```code
{
 "data": [{\
  "data": [\
    {\
      "id": "<ID>"\
    },\
    {\
      "id": "<ID>"\
    }\
  ],\
  ....\
}\
```\
\
To add custom conversions to a business asset group:\
\
```code\
curl -i -X POST \\
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_custom_conversions?asset_id=<CUSTOM_CONVERSIONS_DATA_SET_ID>&access_token=<ACCESS_TOKEN>"\
```\
\
To delete custom conversions from a business asset group:\
\
```code\
curl -i -X DELETE \\
 "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ASSET_GROUP_ID>/contained_custom_conversions?asset_id=<CUSTOM_CONVERSIONS_DATA_SET_ID>&access_token=<ACCESS_TOKEN>"\
```\
\
When you successfully add or remove an custom conversions, we return `true`.\
\
On This Page\
\
[Manage Assets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#manage-assets)\
\
[Pages](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#bag_pages)\
\
[Ad Accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#ad_act)\
\
[Product Catalogs](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#catalog)\
\
[Instagram Accounts](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#ig)\
\
[Facebook Pixels](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#fbpix)\
\
[Offline Event Datasets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#offline)\
\
[Apps](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#app)\
\
[Custom Conversions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/assets#convers)