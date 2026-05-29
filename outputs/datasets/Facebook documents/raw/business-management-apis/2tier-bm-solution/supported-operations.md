---
url: https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/supported-operations
title: Supported Operations - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2F2tier-bm-solution%2Fsupported-operations%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)


  - [Overview](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview)
  - [Prerequisites](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/prerequisites)
  - [Pre-app Review Development](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development)
  - [Get Started](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/get-started)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/guides)
  - [Supported Operations](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/supported-operations)
  - [Support](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support)

On This Page

[Supported Assets and Operations](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/supported-operations#supported-assets-and-operations)

# Supported Assets and Operations

#### 1) Get Facebook Pages for a User ( [documentation](https://developers.facebook.com/docs/graph-api/reference/user/accounts/\#Reading))

```code
curl -X GET \
    -F 'access_token={{user_access_token}}' \
    https://graph.facebook.com/{{meta-api-version}}/me/accounts?fields=id,name,category,link,picture,tasks,access_token
```

#### 2) Convert Access token to Long-lived access token ( [documentation](https://developers.facebook.com/docs/facebook-login/guides/access-tokens/get-long-lived/))

```code
curl -i -X GET "https://graph.facebook.com/{graph-api-version}/oauth/access_token?
    grant_type=fb_exchange_token&
    client_id={app-id}&
    client_secret={app-secret}&
    fb_exchange_token={your-access-token}"
```

#### 3) Set Up a New Child Business Manager ( [documentation](https://developers.facebook.com/docs/marketing-api/2tier-bm-solution/guides/setup-cbm/\#create-cbm))

```code
curl -X POST \
'https://graph.facebook.com/{{meta-api-version}}/{{parent_bm_id}}/owned_businesses' \
  -F 'id={{parent_bm_id}}' \
  -F 'name=Cbm John Doe' \
  -F 'vertical=OTHER' \
  -F 'shared_page_id={{user_page_id}}' \
  -F 'page_permitted_tasks=["ADVERTISE", "ANALYZE"]' \
  -F 'timezone_id=1' \
  -F 'access_token={{user_access_token}}'
```

#### 4) Generate the System User Token for the Child BM ( [documentation](https://developers.facebook.com/docs/marketing-api/2tier-bm-solution/guides/setup-cbm/\#get-child-su-token))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/access_token' \
  -F 'id={{cbm_id}}' \
  -F 'app_id={{application_id}}' \
  -F 'scope=ads_management,business_management,catalog_management,pages_manage_metadata,pages_show_list,pages_read_engagement,ads_read,instagram_basic' \
  -F 'access_token={{parent_access_token}}'
```

#### 5) Fetch the System User's ID of the CBM ( [documentation](https://developers.facebook.com/docs/marketing-api/2tier-bm-solution/guides/setup-cbm/\#fetch-system-uid))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/system_users?access_token={{cbm_access_token}}'
```

#### 6) Fetch the Business User's ID of the CBM ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/business-user/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/business_users?access_token={{cbm_access_token}}'
```

#### 7) Create Catalog for CBM ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/\#Creating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/owned_product_catalogs?access_token={{cbm_access_token}}' \
  -H 'Content-Type: application/json' \
  -d '{"name": "Catalog John Doe"}'
```

#### 8) List Catalogs of the CBM ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/owned_product_catalogs?access_token={{cbm_access_token}}'
```

#### 9) Add product in Catalog of CBM ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/items_batch/\#Creating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_catalog_id}}/items_batch' \
  -H 'Content-Type: application/json' \
  -d '{"access_token": "{{cbm_access_token}}", "requests": [{"method": "CREATE", "data": {"item_type": "", "item_sub_type": "CELL_PHONES_AND_SMART_WATCHES", "custom_label_4": null, "custom_label_3": null, "custom_label_2": null, "custom_label_1": null, "color": "Azul", "additional_image_urls": [""], "image_url": "", "retailer_product_group_id": "", "description": "", "availability": "in stock", "custom_label_0": null, "sale_price": 0, "url": "", "condition": "new", "product_type": "", "size": "", "additional_variant_attributes": null, "manufacturer_part_number": "", "price": 450000, "applinks": null, "name": "", "currency": "", "category": null, "brand": ""}, "retailer_id": "ABC1234567890"}]}'
```

#### 10) Check batch request status ( [documentation](https://developers.facebook.com/docs/marketing-api/catalog-batch/guides/get-batch-request/))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_catalog_id}}/check_batch_request_status?handle={{cbm_catalog_handle}}&access_token={{cbm_access_token}}'
```

#### 11) Get products in Catalog ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/products/))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_catalog_id}}/products?summary=true&access_token={{cbm_access_token}}&fields=id,name,retailer_id,url,availability&limit=500'
```

#### 12) Create Product Set of the Catalog ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/product_sets/\#Creating))

```code
curl -X POST \ \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_catalog_id}}/product_sets'
  -F 'name=Product Set I' \
  -F 'access_token={{cbm_access_token}}' \
```

#### 13) Get Product Set ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/product_sets/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_product_set_id}}/products?access_token={{cbm_access_token}}'
```

#### 14) Get Catalog Stats ( [documentation](https://developers.facebook.com/docs/marketing-api/catalog/guides/cat-signals-quality/))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_catalog_id}}/event_stats?access_token={{cbm_access_token}}'
```

#### 15) Get Product Set of the Catalog ( [documentation](https://developers.facebook.com/docs/commerce-platform/catalog/collections/\#create-a-product-set))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_catalog_id}}/product_sets?access_token={{cbm_access_token}}'
```

#### 16) Get the Funding Source ID (LOC) ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/business/extendedcredits/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{parent_bm_id}}/extendedcredits?fields=id,max_balance,balance,credit_available&access_token={{parent_access_token}}'
```

#### 17) Share LOC with Child BM (Set Up Payment Method) ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/extended-credit/owning_credit_allocation_configs/))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{parent_credit_line}}/owning_credit_allocation_configs' \
  -H 'Cookie: {{your-cookie-params}}' \
  -F 'receiving_business_id={{cbm_id}}' \
  -F 'access_token={{parent_access_token}}'
```

#### 18) Get the Funding Source ID (LOC) of the CBM ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/business/extendedcredits/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/extendedcredits?fields=id,max_balance&access_token={{cbm_access_token}}'
```

#### 19) Get Invoice Group ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/extended-credit/extended_credit_invoice_groups/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{extended-credit-id}}/extended_credit_invoice_groups?access_token={{parent_access_token}}'
```

#### 20) Get Invoice Group Ad Accounts ( [documentation](https://developers.facebook.com/docs/marketing-api/2tier-bm-solution/guides/invoice-group/\#add-an-ad-account-in-an-invoice-group))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{invoice-group-id}}/ad_accounts?access_token={{parent_access_token}}&limit=5000'
```

#### 21) Delete Invoice Group Ad Account ( [documentation](https://developers.facebook.com/docs/marketing-api/2tier-bm-solution/guides/invoice-group/\#delete-an-invoice-group))

```code
curl -X DELETE \
  'https://graph.facebook.com/{{meta-api-version}}/{{invoice-group-id}}/ad_accounts' \
  -F 'access_token={{parent_access_token}}' \
  -F 'ad_account_id={{cbm_adaccount_id}}' \
```

#### 22) Get Instagram Accounts of Facebook Page ( [documentation](https://developers.facebook.com/docs/graph-api/reference/page/instagram_accounts/))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{user_page_id}}/instagram_accounts?fields=username,profile_pic,has_profile_picture,id&access_token={{user_page_access_token}}'
```

#### 23) Get Page Backed Instagram Accounts ( [documentation](https://developers.facebook.com/docs/graph-api/reference/v2.10/page/page_backed_instagram_accounts/))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_page_id}}/page_backed_instagram_accounts?access_token={{cbm_page_access_token}}' \
  -H 'Content-Type: application/json' \
  -H 'Cookie: {{your-cookie-params}}'
```

#### 24) Create Page Backed Instagram Accounts

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_page_id}}/page_backed_instagram_accounts' \
  -F 'access_token={{cbm_page_access_token}}'
```

#### 25) Create Ad Account with the Default Funding Source ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/business/adaccount/))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/adaccount' \
  -F 'name=Ad Account John Doe' \
  -F 'currency=COP' \
  -F 'timezone_id=1' \
  -F 'end_advertiser={{cbm_page_id}}' \
  -F 'media_agency=NONE' \
  -F 'partner=NONE' \
  -F 'funding_id={{cbm_funding_source_id}}' \
  -F 'access_token={{cbm_access_token}}'
```

#### 26) Delete Ad Account of the CBM ( [documentation](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/ad-accounts/\#adaccounts-remove))

```code
curl -X DELETE \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}?access_token={{cbm_access_token}}'
```

#### 27) Assign Users to Ad Account ( [documentation](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/ad-accounts/\#adaccounts-add-people))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/assigned_users' \
  -F 'tasks=["MANAGE,ADVERTISE,ANALYZE"]' \
  -F 'user={{cbm_system_user_id}}' \
  -F 'access_token={{cbm_access_token}}'
```

#### 28) Get Assigned Users to Ad Account ( [documentation](https://developers.facebook.com/docs/graph-api/reference/ad-account/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/assigned_users?access_token={{cbm_access_token}}&business={{cbm_id}}'
```

#### 29) Get Ad Accounts ( [documentation](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/ad-accounts/\#adaccounts-view))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/owned_ad_accounts?access_token={{cbm_access_token}}&fields=id,account_id,name,status'
```

#### 30) Get Ad Account Detail ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account\#Reading))

```code
curl -G \
  -d 'fields=tos_accepted' \
  -d 'access_token={{cbm_access_token}}' \
  https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}
```

#### 31) Create Pixel for CBM ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ads-pixel/\#Creating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/adspixels' \
  -F 'access_token={{cbm_access_token}}' \
  -F 'name={{pixel-name}}'
```

#### 32) Get Pixel for CBM or Ad Account ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ads-pixel/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_id}}/adspixels?access_token={{cbm_access_token}}'
```

#### 33) Get Pixel Events ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ads-pixel/stats\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_pixel_id}}/stats?access_token={{cbm_access_token}}&limit=100'
```

#### 34) Catalog External Event Source ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/product-catalog/\#overview))

```code
curl -X GET \
'https://graph.facebook.com/{{meta-api-version}}/{{cbm_catalog_id}}/external_event_sources?access_token={{cbm_access_token}}'
```

#### 35) Delete Pixel for CBM

```code
curl -X DELETE \
'https://graph.facebook.com/{{meta-api-version}}/{{cbm_pixel_id}}?access_token={{cbm_access_token}}'
```

#### 36) Share a Pixel ( [documentation](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/business-pixel-sharing/\#-3--share-the-pixel-with-agency-business-ad-accounts))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_pixel_id}}/shared_accounts' \
  -F 'account_id={{cbm_adacccount_account_id}}' \
  -F 'access_token={{cbm_access_token}}' \
  -F 'business={{cbm_id}}'
```

#### 37) Create Campaign for product catalog ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/\#Creating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/campaigns' \
  -F 'name=Advantage+ Campaign Name' \
  -F 'objective=OUTCOME_SALES' \
  -F 'special_ad_categories=[]' \
  -F 'promoted_object={"product_catalog_id": "{{cbm_catalog_id}}"}' \
  -F 'status=ACTIVE' \
  -F 'access_token={{cbm_access_token}}' \
  -F 'daily_budget=2000' \
  -F 'bid_strategy=LOWEST_COST_WITHOUT_CAP'
```

#### 38) Update Campaign ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/\#Updating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_campaing_id}}' \
  -F 'status=ACTIVE' \
  -F 'access_token={{cbm_access_token}}'
```

#### 39) Update Campaign Budget ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/\#Updating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_campaing_id}}' \
  -F 'access_token={{cbm_access_token}}' \
  -F 'daily_budget=2000'
```

#### 40) Get Campaign ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_campaing_id}}?fields=id,name,account_id,objective,smart_promotion_type,daily_budget,bid_strategy,promoted_object,adlabels,created_time,configured_status,status,effective_status,lifetime_budget,adsets{ads{status,effective_status,name,creative},bid_strategy,daily_budget,bid_amount,promoted_object,status,effective_status,name,optimization_goal,billing_event}&access_token={{cbm_access_token}}'
```

#### 41) Get all Campaigns ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/campaigns?fields=id,name,account_id,objective,smart_promotion_type,daily_budget,bid_strategy,promoted_object,adlabels,created_time,configured_status,status,effective_status,lifetime_budget,adsets{ads{status,effective_status,name,creative,preview_shareable_link},bid_strategy,daily_budget,bid_amount,promoted_object,status,effective_status,name,optimization_goal,billing_event}&access_token={{cbm_access_token}}'
```

#### 42) Delete Campaign ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account/campaigns/\#Deleting))

```code
curl -X DELETE \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_campaing_id}}' \
  -F 'access_token={{cbm_access_token}}'
```

#### 43) Create Ad Set ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign\#Creating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/adsets' \
  -F 'name=Advantage+ Adset Name' \
  -F 'billing_event=IMPRESSIONS' \
  -F 'optimization_goal=OFFSITE_CONVERSIONS' \
  -F 'campaign_id={{cbm_campaing_id}}' \
  -F 'targeting={"geo_locations":{"countries":["US"]}}' \
  -F 'promoted_object={"custom_event_type": "PURCHASE", "product_set_id": "{{cbm_product_set_id}}"}' \
  -F 'status=ACTIVE' \
  -F 'access_token={{cbm_access_token}}'
```

#### 44) Get specific Ad Set by ID or all Ad Sets ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adset_id}}?fields=id,status,campaign,lifetime_budget,daily_budget,effective_status&access_token={{cbm_access_token}}'
```

#### 45) Delete Ad Set ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign\#Deleting))

```code
curl -X DELETE \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adset_id}}' \
  -F 'access_token={{cbm_access_token}}'
```

#### 46) Ad Creative ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-creative\#Creating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/adcreatives' \
  -F 'name=AdCreative Name>' \
  -F 'object_story_spec={"page_id": "{{cbm_page_id}}", "instagram_actor_id": "{{cbm_pbia_id}}", "template_data": {"call_to_action": {"type": "SHOP_NOW"}, "description": "{{product.description}}", "link": "website", "message": "{{product.description}}"}} \
```

#### 47) Get Ad Creatives ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/adcreatives?fields=id,name,product_set_id,object_story_spec&access_token={{cbm_access_token}}'
```

#### 48) Delete Ad Creative ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/\#Deleting))

```code
curl -X DELETE \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adcreative_id}}' \
  -F 'access_token={{cbm_access_token}}'
```

#### 49) Create Ad ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/adgroup\#Creating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/ads' \
  -F 'name=Advantage+ Ad Name' \
  -F 'adset_id={{cbm_adset_id}}' \
  -F 'status=ACTIVE' \
  -F 'access_token={{cbm_access_token}}' \
  -F 'creative={"creative_id": "{{cbm_adcreative_id}}"}' \
```

#### 50) Get specific Ad or all Ads ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/adgroup\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_ad_id}}?fields=account_id,adset_id,ad_active_time,ad_review_feedback,configured_status,created_time,creative,effective_status,id,name,preview_shareable_link,source_ad,status,tracking_specs&access_token={{cbm_access_token}}'
```

#### 51) Update Ad ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/adgroup\#Updating))

```code
curl -X POST \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_ad_id}}' \
  -H 'Content-Type: application/json' \
  -d '{"access_token":"{{cbm_access_token}}","tracking_specs":{"fb_pixel":["{{cbm_pixel_id}}"],"action.type":["offsite_conversion"]}}'
```

#### 52) Delete Ad ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/adgroup\#Deleting))

```code
curl -X DELETE \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_ad_id}}' \
  -F 'access_token={{cbm_access_token}}'
```

#### 53) Ad Preview ( [documentation](https://developers.facebook.com/docs/marketing-api/generatepreview/v13.0))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{cbm_ad_id}}/previews?access_token={{cbm_access_token}}&ad_format=INSTAGRAM_SEARCH_CHAIN'
```

#### 54) Find Child Business Managers ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/business/owned_businesses/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/{{parent_bm_id}}/owned_businesses?fields=id,name,created_time&limit=5000&access_token={{parent_access_token}}'
```

#### 55) Delete Child Business Manager ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/business/owned_businesses/\#Deleting))

```code
curl -X DELETE \
  'https://graph.facebook.com/{{meta-api-version}}/{{parent_bm_id}}/owned_businesses' \
  -F 'client_id={{cbm_id}}' \
  -F 'access_token={{parent_access_token}}'
```

#### 56) Delete MBE Installs ( [documentation](https://developers.facebook.com/docs/facebook-business-extension/fbe/guides/business-configurations/\#feature-config-api))

```code
curl -X GET \
  'https://graph.facebook.com/v14.0/fbe_business/fbe_installs?fbe_external_business_id={{external_business_id}}&access_token={{user_access_token}}'
```

#### 57) Delete Business Integration USER ( [documentation](https://developers.facebook.com/docs/graph-api/reference/user/permissions/\#overview))

```code
curl -X DELETE \
  'https://graph.facebook.com/{{meta-api-version}}/me/permissions' \
  -F 'access_token={{user_access_token}}'
```

#### 58) Permissions ( [documentation](https://developers.facebook.com/docs/graph-api/reference/user/permissions/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/me/permissions?access_token={{user_access_token}}'
```

#### 59) Debug Token ( [documentation](https://developers.facebook.com/docs/graph-dapi/reference/v21.0/debug_token\#read))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/debug_token?input_token={{user_access_token}}&access_token={{user_access_token}}'
```

#### 60) Ad Account Insights ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-account/insights/\#Reading))

```code
curl -X GET \
    'https://graph.facebook.com/{{meta-api-version}}/{{cbm_adacccount_id}}/insights?fields=impressions,spend,date_start,date_stop,clicks,objective,account_currency,actions,action_values&access_token={{cbm_access_token}}'
```

#### 61) Campaign Insights ( [documentation](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign-group/insights/\#Reading))

```code
curl -X GET \
    'https://graph.facebook.com/{{meta-api-version}}/{{cbm_campaing_id}}/insights?fields=clicks,impressions,actions,action_values&access_token={{cbm_access_token}}'
```

#### 62) Access Token Permissions ( [documentation](https://developers.facebook.com/docs/graph-api/reference/user/permissions/\#Reading))

```code
curl -X GET \
  'https://graph.facebook.com/{{meta-api-version}}/me/permissions?access_token={{user_access_token}}'
```

On This Page

[Supported Assets and Operations](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/supported-operations#supported-assets-and-operations)