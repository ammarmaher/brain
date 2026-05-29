---
url: https://developers.facebook.com/docs/apps/migrations
title: Migrations
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fchangelog%2Farchive%2Fmigrations%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Migrations](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations)

On This Page

[Facebook Platform Migrations](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#facebook-platform-migrations)

[Table of Contents](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#toc)

[US-only Gray User Login Deprecation](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#grey_account)

[Important Dates](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#important-dates)

[Step by step](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#step-by-step)

[New Graph API framework conversion](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode)

[Ad account GET](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode_account)

[Custom Audiences GET](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode_ca)

[Deleted/Archive status](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#archive)

[Custom Audiences API v2](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ca)

[Rename custom audiences from your website remarketingpixelcode endpoint](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#wca)

[Structured targeting sentences](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#targeting_sentences)

[Generalize vat\_status field of ad account into tax\_id\_status](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#vat_status)

[New Campaign Structure](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#mmp_new_campaign_structure)

[Tracking flag is required](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#mmp_flag)

[Removal of PTAT metric](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ptat)

[Require message field in offers API](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#offers)

[Payments Realtime Updates & Disputes API 2014](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#payments-realtime-updates---disputes-api-2014)

[October 2, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#oct_2013)

[September 12, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#sep_2013)

[July 10, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#july_2013)

[April 3, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#apr_2013)

[March 6, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#mar_2013)

[February 6, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#feb_2013)

[January 9, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jan_2013)

[December 5, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#dec_2012)

[November 7, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#nov_2012)

[October 3, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#oct_2012)

[September 5, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#sep_2012)

[August 1, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#aug_2012)

[July 5, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jul_2012)

[June 6, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jun_2012)

[May 2, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#may_2012)

[April 4, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#apr_2012)

[February 15, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#feb15_2012)

[February 1, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#feb1_2012)

[January 1, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jan_2012)

[December 1, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#dec_2011)

[November 1, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#nov_2011)

[October 1, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#oct_2011)

[June 11, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jun11_2011)

[June 3, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jun3_2011)

[April 18, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#apr_2011)

[March 11, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#mar_2011)

# Facebook Platform Migrations

This document covers past Facebook Platform Migrations, changes prior to 2016.

## Ads API 2014

# Ads API Breaking Changes

Due Oct 1st, 2014 at 10am PDT

## Table of Contents

- [Deprecating grey account login](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#grey_account)

- [New Graph API framework conversion](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode) (part 2)

- [Deleted/Archived status](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#archive)

- [Custom Audiences API v2](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ca)

- [Rename Custom Audiences From Your Website remarketingpixelcode Endpoint](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#wca)

- [Structured targeting sentences](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#targeting_sentences)

- [Generalize vat\_status field of ad account into tax\_id\_status](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#vat_status)


## US-only Gray User Login Deprecation

- Documentation



  - https://developers.facebook.com/docs/reference/ads-api/businessmanager-systemuser

  - https://developers.facebook.com/docs/reference/ads-api/businessmanager/

  - https://developers.facebook.com/docs/reference/ads-api/sharedlogin-migration


- [Create a Business Manager](https://business.facebook.com/create)

- [Best Practices for PMDs](https://developers.facebook.com/docs/reference/ads-api/businessmanager-bestpractice)


A “gray user account” also known as a “shared login” or “business account” is a type of Facebook account that does not have a **real** user profile. Gray user accounts are used by some advertisers to manage multiple Facebook ad accounts, Pages or to use Facebook's APIs. Creating gray user accounts has historically been a manual and time consuming process requiring assistance from internal Facebook teams. As a result of this feedback, we have created a self-service solution called Business Manager for business level management of ad accounts, Pages, and permissions that no longer require you to create gray user accounts.

Business Manager can help you organize and manage all of the ad accounts and pages for your businesses. Business Manager is a new level of organization on top of existing assets that offers the following benefits:

- Work faster and better so it's easier to grow your business



  - Reduce the time it takes to set up and manage your ad accounts and Pages

  - Create new ad accounts on demand

  - Directly request roles on client pages


- Everything in one place



  - Use Business.facebook.com to see and manage all your Facebook Pages and ad accounts

  - Give people in your Business Manager access without sharing usernames or passwords


- Increased control



  - Clearly see who has access to your Pages and ad accounts

  - Easily remove or change who has permission to access your Pages and ad accounts


Business Manager is free to use and it does not replace the existing management tools of ads manager, Pages Manager, Power Editor, or third party tools. These are still used to manage individual pages or ad accounts within a business manager. Existing APIs for managing these are also unchanged. Business Manager adds a layer of organization on top of these assets and tools to help you scale your business.

LEARN MORE ABOUT BUSINESS MANAGER: [https://business.facebook.com/overview](https://business.facebook.com/overview)

### Important Dates

Two dates will impact customers who use gray accounts

As of August 1st, Facebook will no longer **create** new gray user logins for customers in the US. All new ad accounts must be created through Business Manager.

As of October 1st, Facebook will no longer support **login requests** from gray users in the US.

Note: these dates apply to any advertiser or PMD who manages gray accounts in the US. However, we encourage all PMDs to review the API documentation to prepare for the upcoming changes. As we continue to scale Business Manager, we will notify you of the corresponding rollout dates for international markets.

**Actions needed prior to August 1st**

If you need new accounts to create and manage ads after August 1st, you will need to use the Business Manager UI or the Business Manager API to create your own ad accounts. Note that existing gray users will continue to function as before until October 1st. There will be no change in functionality to your existing gray users, gray user API tokens, or the ad accounts and Pages they manage.

**Actions needed prior to October 1st**

As of October 1st, **gray user logins will no longer be supported**, and assets that are managed or owned by gray users must be migrated to Business Manager to avoid service interruption. No Pages or ad accounts will be deleted as part of this change and ads will continue to run. However, you must arrange to have gray user assets managed using Business Manager prior to October 1st as the gray user login will not be allowed to log in to the account for management and tokens will no longer be granted. Migration of assets from a gray user to a business manager also does not cause service interruption or change in any of the assets.

After October 1st, Facebook will continue offer a UI to migrate assets to Business Manager for an additional 90 days, but tokens will not be issued and content and ad creation operations will not be permitted until after migration to Business Manager.

### Step by step

#### 1\. Check if your accounts are gray user accounts:

Using the API, calling FQL “/me” with a gray user returns data as below without a Name field, as below: (regular user accounts will have a Name attribute)

```code
{
 "id": "[14******************25](https://graph.facebook.com/1433037676971325)",
 "link": "[https://www.facebook.com/app_scoped_user_id/](https://www.facebook.com/app_scoped_user_id/1433037676971325/)[14******************25](https://graph.facebook.com/1433037676971325)/",
 "locale": "en_US",
 "timezone": -7,
 "updated_time": "2014-03-05T23:11:03+0000",
 "verified": false
 }
```

Or from a browser:

Log in to Facebook.com with the username and password of the gray account. When you log in to Facebook with a gray account using a desktop web browser, you are taken immediately to an ad account or a Page instead of seeing a Facebook News Feed. We will be releasing an additional API on Aug 1 to query the deprecation date for each gray user account.

#### 2\. Setup your Business Manager

Learn about business manager from https://business.facebook.com/overview then follow the steps at http://business.facebook.com/create to setup your Business Manager. You must be signed in as a real Facebook user to complete Business Manager setup.

#### 3\. Migrate any assets from your gray users into your Business Manager

Following the steps outlined here: https://developers.facebook.com/docs/reference/ads-api/sharedlogin-migration
Ensure that your Business Manager owns the assets you need after migration and assign them to people within your Business Manager as needed.

#### 4\. Replace gray user tokens embedded in your API before October 1st

For customers using gray user tokens to all Facebook APIs, Business Manager offers an improved solution to support applications calling Facebook's APIs with a new mechanism called System Users. Once your Business Manager is setup, ensure that your applications are claimed into your Business Manager. Follow steps outlined [here](https://developers.facebook.com/docs/reference/ads-api/businessmanager-systemuser) for further details on system users. For applications with Ads API access you’ll be able to see a special pane in [Business Manager](https://business.facebook.com/settings) where you can create System Users.

#### 5\. Review messaging US clients will receive from Facebook

Facebook's sales teams will be reaching out to their US clients to notify them of the gray account deprecation dates. Please find guidelines for client outreach [here](https://developers.facebook.com/docs/reference/ads-api/businessmanager-clientmessaging).

## New Graph API framework conversion

Migration name: Migrate Ads API endpoints to new Graph API framework for Q4 2014

Documentation: https://developers.facebook.com/docs/reference/ads-api/adaccount/

https://developers.facebook.com/docs/reference/ads-api/custom-audience-targeting/

For the following endpoints, OAuthInsufficientScopeException will now be replaced by a GraphMethodException. `count`, `offset`, `limit` will no longer be returned and you must instead use a [cursor-based](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging) approach to paging. Finally, `total_count` is only returned when the flag `summary=true` is set.

- [Ad account GET](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode_account)

- [Custom Audiences GET](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode_ca)


### Ad account GET

`https://graph.facebook.com/act_{ad_account_id}`

- New field: `created_time` which is the time the account was created

- `funding_source` now returns a numeric string ID

- `users` now returns a data property with fields `id`, `permissions`, and `role` (`id` instead of `uid`)

- `account_group_id` value within `account_groups` now returns a numeric string ID


Example of changes:

```code
https://graph.facebook.com/act_{ad_account_id}?fields=created_time,funding_source,users

{
  "created_time": "2008-12-08T14:26:23-0800",
  "funding_source": "962324027801",
  "users": {
    "data": [\
      {\
        "id": "594012385",\
        "permissions": [\
          1,\
          2,\
          3,\
          4,\
          5,\
          7\
        ],\
        "role": 1001\
      }\
    ]
  },
  "account_id": "{ad_account_id}",
  "id": "act_{ad_account_id}"
}
```

### Custom Audiences GET

GET https://graph.facebook.com/act\_{ad\_account\_id}/customaudiences

and

GET https://graph.facebook.com/{audience\_id}

Removal of following fields:

- `parent_audience_id`

- `parent_category`

- `status`, use `delivery_status` or `operation_status`

- `type`

- `type_name`


Previously, these fields would return `null` or a single value, so are being removed for simplicity.

Addition of following fields:

- `data_source`

- `delivery_status`

- `operation_status`

- `permission_for_actions`


See the [documentation](https://developers.facebook.com/docs/reference/ads-api/custom-audience-targeting/) for explanation of new fields.

Changes to following fields:

- `account_id` type change from int to numeric string ID

- `id` type change from int to numeric string ID


Previously all fields were returned by default, now you must explicity request them.

Example of changes to GET https://graph.facebook.com/act\_{ad\_account\_id}/customaudiences:

```code
// Fields need to be explicitly requested
https://graph.facebook.com/act_{ad_account_id}/customaudiences

{
  "data": [\
    {\
      "id": "{audience_id}"\
    },\
  ],
  "paging": {
    "cursors": {
      "before": "TmpBeE56azBNakF4TmpNME9Eb3hOREF6TWpnMk1qQXpPakkwTnpJNE5URXpNakEyT1RFeU1BPT0=",
      "after": "TmpBd09UZ3dORGszTlRrME9Eb3hNell3T0Rnd05qZ3dPakkwTnpJNE5URXpNakEyT1RFeU1BPT0="
    }
  }
}

// Example for new field responses
https://graph.facebook.com/act_{ad_account_id}/customaudiences?fields=account_id,approximate_count,lookalike_audience_ids,lookalike_spec,name,parent_audience_id,parent_category,status,subtype,type,type_name,time_updated,operation_status,delivery_status,permission_for_actions,data_source

{
  "data": [\
    {\
      "account_id": "{ad_account_id}",\
      "approximate_count": 20,\
      "lookalike_spec": {\
        "country": "US",\
        "origin": [\
          {\
            "id": "{source_id}",\
            "name": "my page",\
            "type": "page"\
          }\
        ],\
        "ratio": 0.01,\
        "type": "custom_ratio"\
      },\
      "name": "My Audience",\
      "subtype": "APP",\
      "time_updated": 1381276042,\
      "data_source": {\
        "type": "SEED_BASED",\
        "sub_type": "PAGE_FANS",\
        "creation_params": "[]"\
      },\
      "delivery_status": {\
        "code": 200,\
        "description": "This audience is ready for use."\
      },\
      "operation_status": {\
        "code": 200,\
        "description": "Normal"\
      },\
      "permission_for_actions": {\
        "can_edit": true,\
        "can_see_insight": true,\
        "can_share": false,\
        "subtype_supports_lookalike": true\
      },\
      "id": "{audience_id}"\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "TmpBeE1qVXdNekEwTlRVME9Eb3hNemd4TWpjMk1EUXpPakkwTnpJNE5URXpNakEyT1RFeU1BPT0=",
      "after": "TmpBeE1qVXdNekEwTlRVME9Eb3hNemd4TWpjMk1EUXpPakkwTnpJNE5URXpNakEyT1RFeU1BPT0="
    }
  }
}
```

Example of changes to GET https://graph.facebook.com/{audience\_id}:

```code
// Fields need to be explicitly requested
https://graph.facebook.com/{audience_id}

{
  "id": "{audience_id}"
}

// Example for new field responses
https://graph.facebook.com/{audience_id}?fields=account_id,approximate_count,lookalike_audience_ids,lookalike_spec,name,subtype,time_updated,operation_status,delivery_status,permission_for_actions,data_source

{
  "account_id": "{ad_account_id}",
  "approximate_count": 20,
  "lookalike_spec": {
    "country": "US",
    "origin": [\
      {\
        "id": "{source_id}",\
        "name": "my page",\
        "type": "page"\
      }\
    ],
    "ratio": 0.01,
    "type": "custom_ratio"
  },
  "name": "First-time purchaser - over five dollars",
  "subtype": "APP",
  "time_updated": 1381276042,
  "operation_status": {
    "code": 200,
    "description": "Normal"
  },
  "delivery_status": {
    "code": 300,
    "description": "Audiences must include at least 20 people to be used for ads."
  },
  "permission_for_actions": {
    "can_edit": true,
    "can_see_insight": true,
    "can_share": false,
    "subtype_supports_lookalike": true
  },
  "data_source": {
    "type": "SEED_BASED",
    "sub_type": "PAGE_FANS",
    "creation_params": "[]"
  },
  "id": "{audience_id}"
}
```

## Deleted/Archive status

Migration name: Adding the Archived status to Ads objects

Documentation: http://developers.facebook.com/docs/ads-api/best-practices/storing\_adobjects

Previously, the loading of deleted adgroups/adset/adcampaigns sometimes threw exceptions. To address this problem we introduced two (2) types of delete states, archived and deleted, for all ad objects. You can query objects in both archived and deleted state based on the object id, however deleted objects will not be available for retrieval via the connection objects.

For archived state you can have up to 50,000 objects, hence you need to move ad objects from archived state to deleted state once there is no need to retrieve from the edges. To get a better understanding of how the migration works and api calls, see this [migration and best practice document](https://developers.facebook.com/docs/ads-api/best-practices/storing_adobjects).

[Ad Group Breaking Change](https://developers.facebook.com/docs/reference/ads-api/adgroup)

[Ad Set Breaking Change](https://developers.facebook.com/docs/reference/ads-api/adset)

[Ad Campaign Breaking Change](https://developers.facebook.com/docs/reference/ads-api/adcampaign)

## Custom Audiences API v2

Migration name: Custom Audience New Upload API

Documentation: https://developers.facebook.com/docs/reference/ads-api/custom-audience-targeting/

Migration applies to GET, POST, DELETE `https://graph.facebook.com/{audience_id}/users`

**Adding/removing users from Custom Audiences will have a simpler upload format:**

The `users` field from the `https://graph.facebook.com/{audience_id}/users` endpoint will be deprecated in favor of `payload`. Details of the payload field provided in [Adding People to Audiences](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#add).

```code
curl \
-F 'payload = { \
"schema":"EMAIL_SHA256", \
"data":["HASH", "HASH", "HASH"]}' \
-F "access_token=_____" \
"https://graph.facebook.com/6005123456/users"
```

**MD5 hashing will no longer be supported. For hashing fields, use SHA-256.**

**There are changes to the `schema` names when specifying the type of data:**

| Old field name | New field name (case sensitive) |
| --- | --- |
| id | UID |
| email\_hash | EMAIL\_SHA256 |
| phone\_hash | PHONE\_SHA256 |
| custom\_audience\_third\_party\_id | deprecated in favor of MOBILE\_ADVERTISER\_ID |
| mobile\_advertiser\_id | MOBILE\_ADVERTISER\_ID |

**The response to adding users to an audience will contain the following fields instead of returning `true`:**

| name | type | description |
| --- | --- | --- |
| audience\_id | int | Audience identifier |
| num\_received | int | Total number of users received |
| num\_invalid\_entries | int | Total number of users with invalid format or unable to decode. |
| invalid\_entry\_samples | JSON string Array | Up to 100 samples of invalid entries. |

## Rename custom audiences from your website remarketingpixelcode endpoint

Migration name: Deprecate /act\_xxx/remarketingpixelcode endpoint

Documentation: https://developers.facebook.com/docs/reference/ads-api/custom-audience-website

The `/remarketingpixelcode` endpoint for receiving the Custom Audience Pixel code is going to be renamed to `/adspixels` so that in the future it can be more easily generalized. This endpoint will be used both for creating the Custom Audience pixel and for reading the pixel code. We plan to add more features to this endpoint in the future.

## Structured targeting sentences

Migration name: Structured ads targeting sentence lines.

Documentation: https://developers.facebook.com/docs/reference/ads-api/targeting-description

`https://graph.facebook.com/{adgroup_id or adaccountid}/targetingsentencelines` will now return a JSON structured response instead of a JSON string array.

```code
**Before**

 "targetingsentencelines": [\
    "Location: Japan; United States",\
    "Age: 20 - 24",\
    "Gender: male"\
 ]

**After**

 "targetingsentencelines": [\
    {\
       "content": "Location:",\
       "children": [\
          "Japan",\
          "United States"\
       ]\
    },\
    {\
       "content": "Age:",\
       "children": [\
          "20 - 24"\
       ]\
    },\
    {\
       "content": "Gender:",\
       "children": [\
          "male"\
       ]\
    }\
 ]
```

## Generalize vat\_status field of ad account into tax\_id\_status

Migration name: Generalize vat\_status field into tax\_id\_status

Documentation: https://developers.facebook.com/docs/reference/ads-api/adaccount

The field `vat_status` will be renamed `tax_id_status` to allow for a more general usage in the future.

```code
curl http://graph.facebook.com/act_{account_id}?fields=tax_id_status
{
  "tax_id_status": 1,
  "account_id": "{account_id}",
  "id": "act_{account_id}"
}
```

# Ads API Breaking Changes

July 2nd, 2014 at 10am PDT

## Table of Contents

- [New Campaign Structure](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#new_campaign_structure)

- [Mobile and Desktop App ad format change](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#app_ad)

- [New Graph API framework conversion](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graph)

- [Right hand side image size change](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#rhs_image_size)

- Ad Campaign Object



  - [Enforce buying\_type](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#buying_type)

  - [Only allow string values for "campaign\_status"](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#campaign_status_string)


- Ad Set Object



  - [Daily budget prorating and budget type limitations for short duration ad sets](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#daily_budget)

  - [Remove `include_deleted` flag](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#set_include_deleted)


- Ad Object



  - [Rename `ADGROUP_PAUSED` to `PAUSED`](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ad_paused)

  - [Limit on ads in an ad set](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ad_limit)

  - [Remove `include_deleted` flag](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ad_include_deleted)


- [oCPM and CPA](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ocpm_cpa)

  - CPA for Link Click only allowed for page posts

  - oCPM and CPA for link click conversion spec requires `post_id`

  - Deprecate `page_story`, `post_story`, and `app_story` specs

  - Only allow one conversion spec for oCPM ads


- [Custom Audiences](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#custom_audiences)

  - When deleting a custom audience with lookalikes, error will be thrown

  - Remove `origin_audience_id` and `origin_audience_name`


- Ad previews API: [deprecate the `page_type` field for preview in favor of `ad_format`](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ad_previews)

- Reachestimate API: [remove `imp_estimates`](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#imp_estimates)


-

## New Campaign Structure

Migration name: New Campaign Structure

If you have already migrated to the New Campaign Structure, there are no new changes to make.

Previously, only client-facing ad interfaces were required to be ready to implement the new campaign structure on March 4, 2014. Now, all API developers will need to implement the new campaign structure by July 2, 2014.

The new campaign structure makes it easier for advertisers of every size to organize, optimize and measure their ads. Up until now, Facebook’s campaign structure consisted of two levels — campaigns and ads. Our new campaign structure consists of three levels: campaigns, ad sets and ads.

Details:

- We have added a third level to our campaign structure that is now called "campaign" in the interface. The campaign level now sits above the ad set level, and each new campaign has one or more ad sets. The new campaigns have run status, reporting and an optional objective setting that allows only ads of the selected objective to be created within the campaign. You are now able to get all the ad report stats at the new campaign level, including reach. The new end point in the ads API for accessing this object is /adcampaign\_groups

- What was called a "campaign" in our two-level structure is now called an "ad set." Ad sets have the same features that campaigns had previously, including budgets and schedules. The end point in the ads API for accessing these objects remains /adcampaigns but refer to ad set in our interfaces.

- The ad group end point will not change at this time, and it will continue to refer to ‘ad’ as the first level object in our campaign structure.

- To minimize disruption for our advertisers, we automatically migrated all existing campaigns to the new structure. Existing campaigns have become ad sets, and a new campaign object is created for each of them. That new campaign object, now at level 3, has inherited the original campaign's name, is set to active and its objective was automatically set to "none". The ad set has been automatically renamed depending on the targeting properties of its ads and it has the original campaign's budget, schedule and status settings. The ad set contains the exact same ads as the original campaign.

- You will be required to use our updated API as part of this platform migration.


Development and testing should only be conducted in a **test/staging** app ID environment, which can be whitelisted for the new campaign structure APIs by flipping the migration toggle in your **test/staging** app ID.

When you are ready to migrate, enable the 'New Campaign Structure" migration toggle for your **production** app. All ad accounts already have the new campaign structure enabled, so there is no action to take on the account level.

-

## Mobile and Desktop App ad format change

Migration name: App Ad Format Transition July 2014

Documentation: [link](https://developers.facebook.com/docs/reference/ads-api/mobile-app-ads/)

As we [previously announced](https://l.facebook.com/l.php?u=http%3A%2F%2Fnewsroom.fb.com%2Fnews%2F2013%2F06%2Fan-update-on-facebook-ads%2F&h=AUAzwNfHIEERE5DbZE9U1bEcdrfpCqdL_y9i1rkIczw-YQC5VXE_1JhOi6NXr6DJXBQj-oWkobQQDtq3TZ5B47d5ttgehovlHQsIlx5URs4GnVIW3A4adIySC2cUyqRlmtVzVYWMvYYt8A) Facebook is simplifying its ad offerings and making ad units look consistent. Today, app ads are unique amongst Facebook's ad offerings as they carry no social context (e.g. Mark likes this Page) or have like, comment, or share buttons on the ad unit. We are removing this inconsistency by adding social context and like, comment, or share buttons on app ads. This will offer you consistency amongst all your Facebook ads so you will always know how your ad looks in News Feed.

This consistent experience across News Feed ads has an intent to improve ad effectiveness through social context and ad pricing efficiency through like, comment, share interactions on your ads. Two important takeaways about this which you should know:

- Previous research on how much performance lift social context gives Facebook ads showed that ads with social context have 50% higher recall and can drive 35% better online sales. To receive this benefit, mobile app ads will need to be connected to a Facebook Page exactly like any Page post ads you buy today.

- You will not pay for likes, comments, and shares on your mobile app ads or pay for Page likes that happen from your mobile app ads. You will only pay for clicks to app stores if you're bidding CPC. oCPM and CPA bidding does not charge on a click basis and these bidding types will still optimize for getting you installs. This can lead to ad pricing efficiency as likes, comments, and shares on your mobile app ads are signals of your ad's relevancy to your targeted audience.


### API details

Now, instead of creating an app ad using the below fields:

| Creative | Required fields | Optional fields |
| --- | --- | --- |
| mobile app install | `object_store_url`<br>`image_hash` | `body`<br>`actor_name`<br>`name`<br>`actor_image_hash`<br>`video_id` |
| mobile app engagement | `object_store_url`<br>`image_hash`<br>`title`<br>`call_to_action_type`<br>`link_deep_link_url` | `body`<br>`actor_name`<br>`name`<br>`actor_image_hash` |
| desktop app ad for install or engagement | `object_id`<br>`image_hash` | `body`<br>`actor_name`<br>`name`<br>`actor_image_hash`<br>`url_tags`<br>`link_url` |

You should create an app ad for either mobile or desktop, install or engagement using a link page post where the link is the desktop app URL, iTunes store URL, or Google Play URL. See details [here](https://developers.facebook.com/docs/reference/ads-api/mobile-app-ads/).

Additionally you must add the following to your adgroup:

- **Must** specify an objective of either `MOBILE_APP_INSTALLS`, `MOBILE_APP_ENGAGEMENT`, `CANVAS_APP_INSTALLS`, or `CANVAS_APP_ENGAGEMENT`

- Explicitly specify the tracking or conversion spec with the Facebook app ID

- Desktop destinations **must** specify a page\_type placement


To translate the fields between the post- [Creative Data Model](https://developers.facebook.com/roadmap/completed-changes/) API and the page post API, see the field mappings below. Fundamentally, the mobile install and engagement units will now only be differentiated by the call to action and existance of a deep link. If `INSTALL_MOBILE_APP` is set on the call to action, the page post cannot be associated with an ad or campaign that has objective `MOBILE_APP_ENGAGEMENT`.

| Creative | Ad Creative fields -> Page post fields |
| --- | --- |
| mobile app install | \`object\_store\_url\`<br>-\> `{'call_to_action':{'value':{'link':...}}}`<br>\`image\_hash\`<br>-\> picture<br>\`body\`<br>-\> message<br>\`actor\_name\`<br>-\> n/a<br>\`name\`<br>-\> automatically set<br>\`actor\_image\_hash\`<br>-\> n/a<br>\`video\_id\`<br>-\> source<br>n/a -> `{'call_to_action':{'value':{'link_title':...}}}`<br>n/a -> `{'call_to_action':{'type':...}}` |
| mobile app engagement | \`object\_store\_url\`<br>-\> `{'call_to_action':{'value':{'link':...}}}`<br>\`image\_hash\`<br>-\> picture<br>\`title\`<br>-\> `{'call_to_action':{'value':{'link_title':...}}}`<br>\`call\_to\_action\_type\`<br>-\> `{'call_to_action':{'type':...}}`<br>\`link\_deep\_link\_url\`<br>-\> `{'call_to_action':{'value':{'app_link':...}}}`<br>\`body\`<br>-\> message<br>\`actor\_name\`<br>-\> n/a<br>\`name\`<br>-\> automatically set<br>\`actor\_image\_hash\`<br>-\> n/a<br>\`video\_id\`<br>-\> source |
| desktop app ad for install or engagement | \`object\_id\` or \`link\_url\`<br>-\> `{'call_to_action':{'value':{'link':...}}}`<br>\`image\_hash\`<br>-\> picture<br>\`body\`<br>-\> message<br>\`actor\_name\`<br>-\> n/a<br>\`name\`<br>-\> automatically set<br>\`actor\_image\_hash\`<br>-\> n/a<br>`url_tags` -\> this will remain a field of the [ad creative](https://developers.facebook.com/docs/reference/ads-api/adcreative) object<br>n/a -> `{'call_to_action':{'value':{'link_title':...}}}` |

If you have extended the [Creative Data Model](https://developers.facebook.com/roadmap/completed-changes/) app ad changes until July 2nd, you must now complete those. Ads that were created pre-Creative Data Model will be automatically migrated to their post-Creative Data Model formats, which are specified in the above table.

All existing ads will continue to be returned using the post-Creative Data Model format specified above. At some point after July 2nd Facebook will automatically migrate these into a page post link format.

By July 2nd or when you finish migrating, there will only be two formats to support, post-Creative Data Model for existing ads, and Page Post Link format for newly created ads.

-

## New Graph API framework conversion

Migration name: Migrate Ads API endpoints to new Graph API framework

For the following endpoints, OAuthInsufficientScopeException will now be replaced by a GraphMethodException. `count`, `offset`, `limit` will no longer be returned and you must instead use a [cursor-based](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging) approach to paging. Finally, `total_count` is only returned when the flag `summary=true` is set.

- /act\_{ad\_account\_id}/adcampaign\_groups

- /act\_{ad\_account\_id}/adcampaigns

- /act\_{ad\_account\_id}/adgroups

- /act\_{ad\_account\_id}/adcreatives

- /act\_{ad\_account\_id}/adimages

- /act\_{adaccount\_id}/generatepreviews

- /{campaign\_id}

- /{campaign\_id}/adcampaigns

- /{campaign\_id}/adgroups

- /{set\_id}

- /{set\_id}/adgroups

- /{set\_id}/adcreatives

- /{adgroup\_id}

- /{adgroup\_id}/adcreatives

- /{adgroup\_id}/previews

- /{creative\_id}

- /{creative\_id}/previews


### Ad account object

We will be removing the ability to filter adgroups by the `adgroup_ids` param when fetching using `https://graph.facebook.com/act_{ad_account_id}/adgroups`

We will be removing the ability to filter adsets by the `campaign_ids` param when fetching using `https://graph.facebook.com/act_{ad_account_id}/adcampaigns`

Instead, you should filter using the `ids` param like so:
`https://graph.facebook.com/act_{ad_account_id}/?ids=[adgroup_id_1,adgroup_id_2,campaign_id1,campaign_id2]`

### Ad campaign object

`id`, `account_id` output field types will become a numeric string value.

### Ad set object

`id`, `account_id`, `campaign_group_id` output field types will become a numeric string value.

### Ad object

`id`, `account_id`, `campaign_group_id`, `campaign_id` output field types will be a numeric string value. `creative_ids` output field type will be an array of numeric strings.

### Ad creative object

All IDs will be a string value, and `object_id` and `actor_id` will become numeric string values.

We will be removing the `preview_url` field of the [ad creative](https://developers.facebook.com/docs/reference/ads-api/adcreative/#read). Instead, you should leverage the new [ad preview API](https://developers.facebook.com/docs/reference/ads-api/generatepreview/).

### Ad Image

The response data array no longer keys based on the hash

### Ad preview API

Documentation: [link](https://developers.facebook.com/docs/reference/ads-api/generatepreview/)

The field `page_type`, that is used in [ad preview API](https://developers.facebook.com/docs/reference/ads-api/generatepreview/), is being replaced by a new field named `ad_format`. Valid values for `ad_format` are RIGHT\_COLUMN\_STANDARD, DESKTOP\_FEED\_STANDARD and MOBILE\_FEED\_STANDARD.

With the new iframe-based [preview API](https://developers.facebook.com/docs/reference/ads-api/generatepreview), the preview css is no longer needed. Therefore, if the user is in the graph node migration, the endpoint below will return an error.

```
https://graph.facebook.com/act_{ad_account_id}/adpreviewscss
```

Finally, the ad preview iframe will now only be valid for 24 hours.

-

## Right hand side image size change

Migration name: n/a

Documentation: [link](https://developers.facebook.com/docs/reference/ads-api/adcreative)

In the coming months, we'll be rolling out an updated design for ads in the right-hand column on Facebook. The new look will showcase larger images, offering a bigger creative canvas for your marketing and provide consistency with the ads in desktop News Feed. Early tests have shown up to 3X more engagement with this new design, with higher click-through rates and fewer hides than our current right-hand column ads.

To simplify the ads creation process, the new image dimensions for ads in the right column will use the same aspect ratio as ads in desktop News Feed so you only need one image asset to run in either placement. Starting late April, we will be updating our self-serve interfaces to accept larger images that fit in the new design so you will no longer have to upload separate creative assets to run ads in News Feed and in the right column of Facebook.
As a result of the new design, people will see fewer ads in the right column. Since fewer ads may lead to increased competition for the right-hand column, we encourage you to carefully monitor your bidding strategy to ensure your ads receive adequate exposure.

We encourage you to update your tools for the new image sizes and continue supporting the brands you work with through this transition. All ads will be rendered in the new design by July and ads with smaller sizes will cease to have delivery soon after. We encourage you to recreate ads with incorrect image sizes in the new sizes.

Please be assured that we will continue to update you as these changes go into effect.

The dimensions are as follows:

Page post photo, Page post link, Offer, Desktop App, and Doman ads:

Image dimensions: 254x133 px

Consistent aspect ratio: 1.91:1

Page post video

Image dimensions: 254x143 px

Consistent aspect ratio: 16:9

Page like ad, Event ad

Image dimensions: 254x94 px

Consistent aspect ratio: 2.7:1

-

## Ad Campaign object changes

Documentation: [link](https://developers.facebook.com/docs/reference/ads-api/adcampaign)

### Enforce buying\_type

Migration name: Enforce 'buying\_type'

We are introducing a new optional 'buying\_type' field for ad campaigns (adcampaign\_groups). The two options for buying\_type are: AUCTION or FIXED\_CPM (know as Fixed Price in Power Editor).
Making buying types explicit at the API level will allow us to add more buying types in the future, and differentiate between them easily - without the need to infer buying types from ad set properties.

If 'buying\_type' is not specified, the default value will be AUCTION. All ad sets must validate against the campaign 'buying\_type'. For example: all ad sets within a campaign having 'buying\_type' of FIXED\_CPM must have a 'daily\_imps' or a 'lifetime\_imps' setting and the bid type must be set to premium; all ad sets within an AUCTION campaign may NOT have 'daily\_imps' or 'lifetime\_imps' settings and the bid type must NOT be set to premium. 'Buying\_type' can only be set at campaign creation, you cannot edit 'buying\_type'.

We have automatically set your buying\_type for each of your campaigns based on what we could infer from each of your ad sets. If your campaign contained ad sets with different buying types, we set your campaign's 'buying\_type' as mixed. When you enable the Enforce 'buying\_type' migration, you will NOT be able to create additional ad sets in a mixed 'buying\_type' campaign. You will see an error specifying mixed buying types.

This new 'buying\_type' field will also help us make future optimizations to delivery, pricing, and limits.You can access more information through our [ad campaign](https://developers.facebook.com/docs/reference/ads-api/adcampaign-alpha) documentation.

### Only allow string values for "campaign\_status"

In a [previous migration](https://developers.facebook.com/roadmap/completed-changes/) we moved `campaign_status` from an int to a string value, but did not perform the same migration when using `campaign_status` to filter an API call, e.g.

```
https://graph.facebook.com/{campaign_id}/?campaign_status=['1']
```

Now, we will enforce that you must use strings when filtering, e.g.

```
https://graph.facebook.com/{campaign_id}/?campaign_status=['ACTIVE']
```

All other uses of `campaign_status` continue to accept string values only.

-

## Ad Set object changes

Documentation: [link](https://developers.facebook.com/docs/reference/ads-api/adset)

### Daily budget prorating and budget type limitations for short duration ad sets

Migration name: Support of Prorating in Ads API

For ad sets using daily budgets, we prorate the ad set delivery on the first and last days. The prorating takes into account the remaining time in the day and adjusts the target daily spend pro rata. For example, if the start time of an ad set is noon, then we target spending 50% of the daily budget amount for that day. Note, this only affects ad sets with daily budgets.

To help ensure that ad sets deliver in consistent and expected ways, we are limiting the budget type that ad sets can use when the duration (difference between `end_time` and `start_time`) is less than 24 hours. For ad sets with durations less than 24 hours, the ad set must use a `lifetime_budget`.

After the breaking change, if an ad set is created or edited using `daily_budget` and the ad set duration is less than 24 hours, then an error message will be returned.

During the period allotted for the breaking change, if an ad set is created or edited using `daily_budget` and the ad set duration is less than 24 hours, then the target daily spend for the first and last days will be prorated based on the number of scheduled hours in each day. This will result in a target daily spend amount that is less than the daily budget amount since there are fewer than 24 hours in the ad set schedule.

### Remove `include_deleted` flag

Migration name: Remove support for "include\_deleted" as a filter param

You will no longer be able to view deleted ad sets by making an HTTP GET call to

```
https://graph.facebook.com/act_{ad_account_id}/adcampaigns
```

with the flag `include_deleted`. Instead, you must make an HTTP GET call and specify the field `campaign_status=['DELETED']`

-

## Ad Object object changes

Documentation: [link](https://developers.facebook.com/docs/reference/ads-api/adgroup)

### Rename `ADGROUP_PAUSED` to `PAUSED`

Migration name: Renaming "ADGROUP\_PAUSED" to "PAUSED"

Facebook will be renaming the `adgroup_status` value `ADGROUP_PAUSED` TO `PAUSED` to be consistent with the rest of the object's APIs.

`PAUSED` will now always refer to the current object, and the `{object}_PAUSED` status will refer to the paused status of other objects.

### Limit on ads in an ad set

Migration name: Limit non-deleted "Ads" to 50 per "Ad Set"

We are introducing a new limit to the number of ads you can create in an ad set. The new limit will be 50 non-deleted ads per ad set.

Ad sets with more than 50 non-deleted ads will continue delivering as they were before. After your app is migrated, when you try to create a new ad in an ad set that already has 50 or more non-deleted ads, you will see an error message that you have exceeded your limit and that ad will not be created. The existing ads in that set will not be affected. To create a new ad within that set you will have to delete ads within that ad set, or create a new ad set.

Our delivery system optimizes to serve the best performing ad within an ad set. We suggest that you try multiple creative variations within an ad set so we can use our optimization engine to find the best one. The maximum number of ads per ad set should be correlated with ad set reach. Larger reach can support more creative variations. However, too many variations will produce unhelpful results. 50 is the maximum number of ads supported within an ad set. If you want to test multiple audiences, we suggest that you create different ad sets for each audience.

### Remove `include_deleted` flag

Migration name: Remove support for "include\_deleted" as a filter param

You will no longer be able to view deleted ads by making an HTTP GET call to

```
https://graph.facebook.com/act_{ad_account_id}/adgroups
```

with the flag `include_deleted`. Instead, you must make an HTTP GET call and specify the field `adgroup_status=['DELETED']`

-

## oCPM and CPA

### CPA for Link Click only allowed for page posts and oCPM and CPA for link click conversion spec requires `post_id`

Migration name: Use link click with post selector as default conversion spec.
Documentation: [CPA](https://developers.facebook.com/docs/reference/ads-api/cost-per-action-ads/) and [conversion spec](https://developers.facebook.com/docs/reference/ads-api/conversion-specs/)

We've seen under-delivery on offsite link click CPA and oCPM ads due to a flaw in the design of the current object ID based offsite link click conversion spec. When the destination URLs in the ads change or the links in the page post ads are edited, the conversion spec is not updated, which impacts delivery.

To address this problem, we will change the default conversion spec for CPA and oCPM for offsite link click will change from object ID based to post ID based for page post ads, e.g. from `{"action.type":"link_click", "object": "http://mydomain.com/mypage”}` to `{"action.type":"link_click", "post_id": "POST_ID", "post.wall": "PAGE_ID"}`.

Enabling the migration will enforce the default spec change. Since the spec requires a `POST_ID`, **only page post ads will be eligible for CPA for link click**. Existing domain ads with CPA will continue to have delivery and you can continue to change the status or update the bid and budget.

You may have previously submitted a request to enable this migration early. If so, there is no action necessary and the migration toggle will not show up for you as it's already pre-enabled.

### Deprecate `page_story`, `post_story`, and `app_story` specs

Migration name: Deprecate app\_story, page\_story and post\_story conversion specs

Documentation: [conversion spec](https://developers.facebook.com/docs/reference/ads-api/conversion-specs/)

We are deprecating all `*_story` meta specs because the newer ones, `*_engagement` contain more actions and should provide a better picture of the engagement produced by the ad. For example, `post_engagement` includes video plays and photo views on the post while `post_story` does not.

### Only allow one conversion spec for oCPM ads

Migration name: Restrict conversion specs to just one

We are going to enforce that all oCPM ads can only have one conversion spec associated with the ad, e.g. only one goal to optimize on, to ensure the most optimal setup for your ad.

Existing ads with >1 conversion spec will continue to deliver after July 2nd, but upon editing, you must comply by the one conversion spec per ad restriction.

-

## Custom Audiences

Documentation: [link](https://developers.facebook.com/docs/reference/ads-api/custom-audience-targeting)

### When deleting a custom audience with lookalikes, error will be thrown

Migration name: Custom Audience Delete Lookalike Migration

To maintain the effectiveness of a lookalike cluster, we modify and refresh the underlying model over time. Hence we want to enforce that the source of a lookalike cluster (the original custom audience) be available if a lookalike cluster is to be used. This migration will enforce that a deletion of the custom audience with existing lookalike audiences will throw an error.

To make the process easier, we are also providing an option to delete a custom audience as well as all of its lookalikes in one API call, the flag is called `force_delete_lookalikes`.

### Remove `origin_audience_id` and `origin_audience_name`

Migration name: Custom Audience Origin Audience Fields Cleanup

We are introducing a more unified way to provide information about a lookalike cluster in the new `lookalike_spec` field returned on a READ. `origin_audience_id` and `origin_audience_name` are being deprecated in favor of the `origins` field in `lookalike_spec` which will contain the origin ID, name, and type.

-

## Ad previews

Migration name: Deprecate 'page\_type' for ad preview plugin

Documentation: [link](https://developers.facebook.com/docs/reference/ads-api/ad-preview-plugin)

The field `page_type`, that is used in [ad preview plugin](https://developers.facebook.com/docs/reference/ads-api/ad-preview-plugin), is being replaced by a new field named `ad_format`. Valid values for `ad_format` are RIGHT\_COLUMN\_STANDARD, DESKTOP\_FEED\_STANDARD and MOBILE\_FEED\_STANDARD.

-

## Reachestimate API

Migration name: deprecated imp\_estimates field in api response

We will be removing the `imp_estimates` field of the [reach estimate API](https://developers.facebook.com/docs/reference/ads-api/reachestimate/). Instead, use the `users` field.

\## Mobile Measurement API 2014

# Mobile Measurement API Breaking Changes

July 2nd, 2014 at 10am PDT

## New Campaign Structure

The new campaign structure will be enforced in the Mobile Measurement API. Please see this [document](https://developers.facebook.com/docs/reference/ads-api/mmp-alpha/) for migration steps.

This migration is already enabled and you should be seeing the two new fields, `campaign_group_id` and `campaign_group_name` in your API response when the install is attributable to Facebook.

## Tracking flag is required

Migration name: Tracking Flags required

The two tracking flags, `advertiser_tracking_enabled` and `application_tracking_enabled` will now be a required field for both install and conversion pingbacks.

\## Pages API 2014

# Pages API Breaking Changes

As of July 2nd, 2014 at 10am PDT

## Removal of PTAT metric

Migration name: Deprecate PTAT (People Talking About This)

Facebook will be removing the People Talking About This metric (PTAT) from Page Insights.

To better see how people interact with a pages content, the PTAT metrics have been split into separate elements: Page Likes, People Engaged (the number of unique people who have clicked on, liked, commented on, or shared your posts), Page tags and mentions, Page checkins and other interactions on a Page.

We recommend that you use these metrics moving forward to evaluate your Page posting strategy and engagement.

## Require `message` field in offers API

Migration name: Offers Message field will be required after July 2, 2014.

The `message` field, which was once optional, will now be required when creating any offer.

## Payments Realtime Updates & Disputes API 2014

# Realtime Updates & Disputes API Breaking Change

May 13th, 2014 at 10am PDT

When we announced the migration from Credits to local currency payments last June, we also introduced Realtime Updates for payments and disputes to provide asynchronous payment updates and notifications of disputed payments.

Starting May 13th, 2014, developers that accept payments **will be required to subscribe to and honor Realtime Updates** to ensure order fulfilment and appropriate handling of disputes from all payers.

If you do not subscribe to and honor these updates, Facebook reserves the right, under our [Developer Payment Terms](https://developers.facebook.com/policy/payments_terms) to withhold payouts and/or stop your app from accepting payments.

As part of this change, developers must also take **action on each dispute** that is raised by a user in your app. This can either be a refund, or by calling the new Graph API for disputes, to notify Facebook of the dispute outcome.

After May 13th, 2014, Facebook will start auto-refunding disputes which are not handled by the developer in a timely manner.

Read about [Realtime Updates for payments and how to subscribe](https://developers.facebook.com/docs/payments/realtimeupdates/#subscribing)

Read about how to [resolve disputed payments](https://developers.facebook.com/docs/howtos/payments/disputesrefunds/#resolve_disputes) for your app

Once you update your app, you should enable the migration setting for Realtime Updates on your [app settings](https://developers.facebook.com/apps) on "https://apps.facebook.com/apps/\[APP\_ID\]/settings/migrations/".

\## January 2014

# Facebook Platform Migration January 8, 2014

## **Broad age targeting deprecation**

To simplify things, we are deprecating the broad age targeting as part of targeting specs. You will continue to create ads using `age_min` and `age_max`. See [Targeting Specs](https://developers.facebook.com/docs/reference/ads-api/targeting-specs/).

## **Relative oCPM deprecation**

We are deprecating relative oCPM bid type (`bid_type=RELATIVE_OCPM`) and instead will use absolute oCPM.

**Note:** PMD interfaces could still present the oCPM bid type as relative values, but the API calls should be all in absolute value.

For example, a relative bid of 40% clicks, 30% conversions and 30% impressions should be translated to $4, $3, $3 for clicks, conversions, and impressions in the API call (PMDs should test different absolute bid values to understand performance). Please refer to the documentation [here](https://developers.facebook.com/docs/reference/ads-api/optimizedcpm/).

## **Feature phone targeting**

We are deprecating `site_category` as part of mobile targeting options, since this is now supported by device targeting type (the new option is `user_device=feature_phone`). Please refer to the documentation [here](https://developers.facebook.com/docs/reference/ads-api/targeting-specs/).

## **Sponsored Results, Online offers and Question Poll Ads**

Since we have removed these ad types, we will be returning errors in the API when attempting to create a sponsored result, online offer or a question poll ad. Please refer to the documentation [here](https://developers.facebook.com/docs/reference/ads-api/adcreative/).

## **New image format and text size for app install ads on mobile**

App install ads on mobile will have image size of 1200x627 and body text of 90 characters.

The old image size 600x360 and body text format of 130 characters will be deprecated.

## 2013 and Older

# Facebook Platform Migrations (Older)

This document covers migrations from 2013 and earlier. Please see our [main migrations page](https://developers.facebook.com/docs/apps/migrations) for more recent migrations.

## October 2, 2013

The following changes can be enabled/disabled using the "October 2013 Breaking Changes" migration in the [app dashboard](https://developers.facebook.com/apps) until October 2nd when they will go into effect permanently for everyone:

> **Game Achievement API update**
>
> Game Achievement action custom properties will appear in the 'data' field, and consistent with other Open Graph Actions.
>
> **/USER\_ID/likes default update**
>
> Currently the API returns all likes by default. After the migration, fetching a user's likes via the Graph API will return 25 results at a time. We've added pagination to the results so you can page through to all of a user's likes.
>
> **/POST\_ID/likes update**
>
> Apps will be able to retrieve all likes on a post (rather than the first 4 as it is today) through paging. As a result of the functionality update, the like count will be moved to the summary field.
>
> **Removing 'network' based privacy**
>
> As we have deprecated 'network' based privacy settings on Facebook, we are removing the network privacy field from Graph API and FQL. Currently if an app attempts to create a post with a network privacy, it will default to 'only me'. After the migration period, posting with a network privacy will result in an error.
>
> **Removing the ability to post to friends' timelines via API**
>
> We have found that posting content via API (stream.publish) on a friend's wall lead to a high incidence of user dissatisfaction (hiding content, blocking the app). After the migration period, posting content to friends' timelines via stream.publish will no longer be allowed. Please use the [Feed Dialog](https://developers.facebook.com/docs/reference/dialogs/feed/) for posting.
>
> **FQL and Graph API limit=0 change**
>
> Currently, we have a bug where limit=0 returns all results. After the migration period, specifying a limit of 0 in FQL or the Graph API will return zero results.
>
> **Send Dialog will use Open Graph meta tags**
>
> After the migration, the Send Dialog will use Open Graph meta tags and ignore 'name', 'description', and 'picture' parameters.
>
> **Adgroups endpoint**
>
> Removing ad\_id, adgroup\_id, max\_bid, start\_time, and end\_time field. Replacing bid\_info and bid\_type int values with enum values. You must now specify query params when retrieving information about adgroups. The only field returned by default will be id. See [Ads API adgroup](https://developers.facebook.com/docs/reference/ads-api/adgroup/) docs for more detail.
>
> **Adaccount endpoint**
>
> You must now specify query params when retrieving information about adgroups. The only field returned by default will be id. See [docs](https://developers.facebook.com/docs/reference/ads-api/adaccount/) for more detail.
>
> **Adcampaign endpoint**
>
> Removing campaign\_id and include\_budget\_remaining flag. You must now specify query params when retrieving information about adgroups. The only field returned by default will be id. See [docs](https://developers.facebook.com/docs/reference/ads-api/adcampaign/) for more detail.
>
> **Adcreative endpoint**
>
> Removing creative\_id and run\_status field. You must now specify query params when retrieving information about adgroups. The only field returned by default will be id. Creative types 8, 9, 10, 16, 17, 19 are removed. See [docs](https://developers.facebook.com/docs/reference/ads-api/adcreative/) for more detail.
>
> **Custom Audiences**
>
> After the migration period, apps cannot hash using CRC32, will only accept MD5 hash. See [docs](https://developers.facebook.com/docs/reference/ads-api/custom-audience-targeting) for more detail.

The following changes will go into effect on October 2, 2013:

> **Native iOS and Android apps must not use their own web views for Facebook Login**
>
> Native apps that implement Facebook Login by embedding their own web views inside their apps provide inconsistent and subpar user experiences. For example, users who are already signed in to Facebook on their devices must re-enter their Facebook credentials when logging in via custom web views. This results in a poor user experience as well as lower conversion for apps. In contrast, login flows provided by Facebook's official native SDKs allow people to skip entering their credentials. See our [iOS](https://developers.facebook.com/docs/ios/login/) and [Android SDK](https://developers.facebook.com/docs/android/login-with-facebook/) documentation for more details.
>
> To provide a better experience for all Facebook Login users, we are changing our policy to prohibit native iOS and Android apps from using custom web views for Facebook login.
>
> Native iOS or Android apps initiating their own web views for Facebook login are required to use our official SDKs for login by October 2, 2013. Native iOS or Android apps using third-party SDKs that provide Facebook login via custom web views have an extension until January 8, 2014 to work with their third-party provider to resolve this or to migrate to our SDKs.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/851548_630704293637208_1221473229_n.png?_nc_cat=109&ccb=1-7&_nc_sid=34156e&_nc_ohc=0MidEirHGSMQ7kNvwGDNN2T&_nc_oc=AdoR3Lf22uD0sYe9s1uQVjy73_1G2USSXR1rtj2dNNFvnhhqmZBW1IOoUpHcFfNMxz4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=qi990qH3QZmyG5GozThyww&_nc_ss=7b289&oh=00_Af7iljE5We8EK0uUV3CdRIGXjWnVXEwh0I_X-1ZzEDYdFQ&oe=6A1103A1)

* * *

## September 12, 2013

> **Local currency payments**
>
> We are migrating all canvas app developers that use the legacy Facebook Credits payments system to local currency payments. Facebook Credits will no longer be supported on September 12, 2013 and you must migrate to [local currency payments](https://developers.facebook.com/docs/concepts/payments/) to continue to accept payments from users.

* * *

## July 10, 2013

The following changes can be enabled/disabled using the "July 2013 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until July 10th when they will go into effect permanently for everyone:

> **New APIs for comment replies**
>
> As announced [here](https://developers.facebook.com/blog/post/2013/04/03/new-apis-for-comment-replies/), this migration enables the updated comment APIs.
>
> **Social plugins will require an absolute URL in the 'href' parameter**
>
> [Social plugins](https://developers.facebook.com/docs/plugins/), such as the Like Box and Like Button, will require an absolute URL in the 'href' parameter.
>
> **Stream table will throw exception with invalid filter\_key**
>
> Query \[stream\_filter\] table for a set of valid stream filters. The \[stream\] table will throw an exception if called with an invalid 'filter\_key' option.
>
> **Removing 'publish\_checkins' permissions**
>
> Publishing a Checkin object is deprecated in favor of creating an Open Graph story with a [location](https://developers.facebook.com/docs/opengraph/guides/tagging/#places) attached. You can also create a Post with a location attached using the 'publish\_steam' extended permission.
>
> **FQL Checkin table 'page\_id' change**
>
> We are renaming 'page\_id' to 'target\_id' for the \[Checkin\] table.
>
> **Removing 'version' field for Groups**
>
> We introduced 'version' field to indicate whether the group was created prior to launch of the current groups product in October 2010. We are removing this field as all Groups on Facebook are now the same version. This impacts both [Group Graph API](https://developers.facebook.com/docs/reference/api/group/) and \[Group FQL Table\].
>
> **Photos will no longer return larger sizes than the uploaded version**
>
> 'images' field in \[photos\] and \[photo\_src\] table will no longer return image sizes larger than the original uploaded version of the photo.
>
> **Deprecating 'comments' field from 'stream' FQL table**
>
> We are deprecating the 'comments' field from 'stream' FQL table. Please select the 'comment\_info' column to fetch the 'can\_comment' and 'comment\_count' fields (formerly called 'can\_post' and 'count'), and use the comment table directly to retrieve the list of comments.
>
> **Removing 'xid', 'reply\_xid', 'username' and 'comments' from 'comment' FQL table**
>
> We are removing the fields on the FQL 'comment' table that were used exclusively for legacy [Comments Plugins](https://developers.facebook.com/docs/reference/plugins/comments/) \-\- 'xid', 'reply\_xid', 'username' and 'comments'. We now treat comments the same across plugins and within Facebook. Please query for comment replies left on the plugin [the same way](https://developers.facebook.com/docs/graphapi/guides/comments/) as you would for other comments.
>
> **Removing 'count' from 'comments' Graph API connection**
>
> We are removing the undocumented 'count' field on the 'comments' connection in the Graph API. Please request '{id}/comments?summary=true' explicitly if you would like the summary field which contains the count (now called 'total\_count')

The following changes will go into effect on July 10, 2013:

> **Mobile App Install Ads change**
>
> We are updating the [Creative Spec](https://developers.facebook.com/docs/reference/ads-api/mobile-app-ads/) parameter 'app\_platform\_type' to 'mobile\_store'. The possible values for mobile\_store are now "itunes", "itunes\_ipad", and "google\_play".
>
> **Conversion spec and tracking pixel ID changes**
>
> We are deprecating the use of 'tracking\_pixel\_id' when specifying the desire to track a [conversion pixel](https://developers.facebook.com/docs/reference/ads-api/offsite-pixels/) in an ad. You should instead specify the pixel in the newly launched [tracking\_specs](https://developers.facebook.com/docs/reference/ads-api/tracking-specs/) field.
> We are also deprecating the use of [conversion specs](https://developers.facebook.com/docs/reference/ads-api/conversion-specs/) in bid types that are not optimized for actions (e.g. CPM, CPC, and oCPM when no bid value is placed on actions). You should instead use [tracking\_specs](https://developers.facebook.com/docs/reference/ads-api/tracking-specs/) to track conversions for these bid types.
>
> **Custom Audiences change**
>
> We have changed the targeting spec parameter 'excluded\_user\_adclusters' to be 'excluded\_custom\_audiences'. Additionally, the endpoint to create and retrieve your custom audiences is now: https://graph.facebook.com/(act\_adaccountid)/customaudiences.
>
> **Accessing link stats change**
>
> App access tokens will be required for accessing the \[link\_stat\] FQL table. App access tokens will also be required for retrieving data from Graph API endpoint for link stats, ie: http://graph.facebook.com/?id=http://example.com.
>
> **Graph API search changes**
>
> User access tokens will be required for all search Graph API calls except Posts, Places and Pages. App access tokens may also be used for Post search Graph API calls. Places and Pages search Graph API calls will still require an App access token. Search for Applications will no longer be supported.
>
> **Open Graph apps using custom actions for fitness, books, movies, and TV**
>
> As [announced](https://developers.facebook.com/blog/post/2013/03/08/improving-facebook-for-books--movies--tv-and-fitness/) in March, any apps that previously used custom actions to represent this type of sharing will need to move common actions by July 10, 2013.
>
> **Removing 'page\_friends\_of\_fans' metric**
>
> We are removing the metric: 'page\_friends\_of\_fans' from the Insights Dashboard and the [Insights API](https://developers.facebook.com/docs/reference/api/insights/).

* * *

## April 3, 2013

The following changes can be enabled/disabled using the "April 2013 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until April 3rd when they will go into effect permanently for everyone:

> **Removing ability to POST to USER\_ID/questions**
>
> As it's no longer possible for users to create questions, we will remove this functionality from the Graph API. `POST`s to `USER_ID/questions` will fail.

* * *

## March 6, 2013

The following changes can be enabled/disabled using the "March 2013 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until March 6th when they will go into effect permanently for everyone:

> **No more accessing mailbox FQL tables without a user session**
>
> It will not longer be possible to access the \[message\], \[thread\], or \[mailbox\_folder\] FQL tables without a user session.
>
> **Removing apps from /me/accounts/ and page\_admin FQL table**
>
> We will no longer show apps under `/me/accounts/` in the Graph API or in the \[`page_admin`\] FQL table. You can access the list of apps a user is a developer on by hitting `/me/applications/developer/` or using the \[`app_role`\] FQL table.
>
> **Removing redirect to docs when hitting graph.facebook.com**
>
> We will no longer return a redirect to the [Graph API docs](https://developers.facebook.com/docs/reference/api/) when hitting the URL `http(s)://graph.facebook.com` with no path.

* * *

## February 6, 2013

The following change will go into effect on February 6th, 2013:

> **End of custom actions for content consumption**
>
> We will no longer show Custom Open Graph actions that were published simply by a user consuming content. If you own one of these actions and it was previously approved, you will have received an email from us. Developers should stop publishing these actions as doing so will return an error starting February 6th. The only actions that can be published upon a user simply consuming content are [built-in actions](https://developers.facebook.com/docs/opengraph/actions/builtin/). For more info, see [this blog post](https://developers.facebook.com/blog/post/2012/10/10/growing-quality-apps-with-open-graph/).

The following changes can be enabled/disabled using the "February 2013 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until February 6th when it will go into effect permanently for everyone:

> **Authenticated referrals going away**
>
> We will remove the [Authenticated Referrals](https://developers.facebook.com/docs/opengraph/authentication/#referrals) feature. You should instead use the [Login Dialog](https://developers.facebook.com/docs/concepts/login/).
>
> **Create\_event permission required to remove attendees from event**
>
> We will require the `create_event` [permission](https://developers.facebook.com/docs/authentication/permissions/) in order to remove attendees from an event a user admins.
>
> **Minor change to admin.getAppProperties call**
>
> When making an `admin.getAppProperties` call, we will now return an empty Android Key Hash field as `[]` instead of `[""]`.
>
> **Canonical URLs used when fetching Open Graph objects**
>
> We will start using canonical URLs (e.g. the URL set in an `og:url` tag, 301/302 redirects, etc.) when fetching objects (e.g. `http://graph.facebook.com?ids=http://developers.facebook.com`).
>
> **Offset no longer allowed when searching posts**
>
> We will no longer allow the `offset` parameter to be used when [searching stream posts](https://developers.facebook.com/docs/graph-api/using-graph-api#search) (e.g. `https://graph.facebook.com/search?q=watermelon&type=post`). Please use `since` and `until` to do paging instead. For more info, check out [this blog post](https://developers.facebook.com/blog/post/478/).
>
> **Curly bracket syntax for mentioning users in notifications going away**
>
> We will no longer allow the curly bracket syntax (`{USER_ID}`) for [mentioning users in notifications](https://developers.facebook.com/docs/app-notifications/). Developers should instead use the new syntax (`@[USER_ID]`).
>
> **Removing ability to post to friends walls via Graph API**
>
> We will remove the ability to post to a user's friends' walls via the Graph API. Specifically, posts against \[user\_id\]/feed where \[user\_id\] is different from the session user, or stream.publish calls where the `target_id` user is different from the session user, will fail. If you want to allow people to post to their friends' timelines, invoke the [feed dialog](https://developers.facebook.com/docs/reference/dialogs/feed/). Stories that include friends via [user mentions tagging](https://developers.facebook.com/docs/opengraph/mention_tagging/) or [action tagging](https://developers.facebook.com/docs/opengraph/actions/#taggingpeople/) will show up on the friend’s timeline (assuming the friend approves the tag). For more info, see [this blog post](https://developers.facebook.com/blog/post/2012/10/10/growing-quality-apps-with-open-graph/).

The following change can be enabled/disabled using the "Picture as Dictionary" [migration](https://developers.facebook.com/roadmap/migrations) until February 6th when it will go into effect permanently for everyone:

> **Picture connection/field may return a dictionary**
>
> We will start returning a dictionary containing the fields `url`, `height`, `width`, and `is_silhouette` when accessing the `/picture` connection for an object and specifying a `callback` property, a `redirect=false` parameter, or getting the `picture` field as part of a larger JSON response.

* * *

## January 9, 2013

The following change will go into effect on January 9th, 2013. Please note that January 9th is the second Wednesday of the month, not the first Wednesday of the month as is normally the case per our [Breaking Change Policy](https://developers.facebook.com/roadmap/change-policy/). This is due to the fact that January 2nd is a company holiday so our standard Tuesday push will be delayed.

> **Removing unused splash\_screen\_url and gamebar\_image\_url properties**
>
> We will remove the `splash_screen_url` and `gamebar_image_url` app properties as these are no longer used anywhere so setting them will have no effect.

The following changes can all be enabled/disabled using the "January 2013 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until January 9th when they will go into effect permanently for everyone:

> **Removing Dashboard REST API methods**
>
> We will remove all of the \[dashboard.\* REST API methods\]. This was originally scheduled for June 2012 as announced in [December 2011](https://developers.facebook.com/roadmap/completed-changes/#december-2011). To manage counts for your app, see the [Requests documentation](https://developers.facebook.com/docs/channels/#requests) or [this blog post](https://developers.facebook.com/blog/post/464/).
>
> **Using canonical URLs when fetching data using link\_stat table**
>
> When getting stats about a URL (e.g. number of likes) from the \[link\_stat FQL table\] or by passing a URL to the `ids` parameter in a Graph API call, we will now use the canonicalized URL to fetch those stats. This fixes a few issues. For example, getting stats for `developers.facebook.com` and `developers.facebook.com?foo=bar` currently could return different values for `shares`. This change will ensure they return the same values since they in fact point to the same page.

* * *

## December 5, 2012

The following change will go into effect on December 5th, 2012:

> **Removing the Static FBML Page tab app**
>
> We [removed FBML](https://developers.facebook.com/roadmap/completed-changes/#july-2012) in July of this year so any FBML code that was being used in the Static FBML Page app would have stopped working at that time. However, the Static FBML Page app is still able to render plain HTML. On December 5th, we will remove the Static FBML Page app and any Static FBML tabs you had installed on your Page will disappear. To replace any Static FBML tabs you may be using, we recommend you either host your own content and [create your own Page tab](https://developers.facebook.com/docs/appsonfacebook/pagetabs/) or search the web for "Static HTML Facebook Page Tab" to find a replacement.
>
> **New policies for desktop web games off of Facebook.com**
>
> The following policies will go into effect:
>
> > 13a. Desktop web games off of [Facebook.com](https://developers.facebook.com/docs/guides/canvas/) may only use Facebook Login ( [Authentication](https://developers.facebook.com/docs/authentication/), excluding user connections such as friend list), [Social Plugins](https://developers.facebook.com/docs/plugins/) and publishing (e.g., Feed Dialog, Stream Publish, or Open Graph). When authenticating, these games may not request [additional permissions](https://developers.facebook.com/docs/authentication/permissions/) other than age, email, and our [Publishing Permissions](https://developers.facebook.com/docs/publishing/).
> >
> > 13b. Games on [Facebook.com](https://developers.facebook.com/docs/guides/canvas/) and mobile must not share the same app ID with desktop web games off of [Facebook.com](https://developers.facebook.com/docs/guides/canvas/). You must not use [Canvas](https://developers.facebook.com/docs/guides/canvas/#canvas/) apps to promote or link to game sites off of Facebook, and must not use emails obtained from us to promote or link to desktop web games off of [Facebook.com](https://developers.facebook.com/docs/guides/canvas/).
>
> For more information, check out the [Platform Policies](https://developers.facebook.com/policy).

The following change can be enabled/disabled using the "Remove offline\_access permission" [migration](https://developers.facebook.com/roadmap/migrations) until December 5th when it will go into effect permanently for everyone:

> **offline\_access permission removal**
>
> The `offline_access` [permission](https://developers.facebook.com/docs/authentication/permissions/) is deprecated and will be removed December 5th, 2012 (originally scheduled for July 5th). Please see the [Removal of offline\_access Permission doc](https://developers.facebook.com/docs/roadmap/completed-changes/offline-access-removal) for more details.

The following changes can all be enabled/disabled using the "December 2012 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until December 5th when they will go into effect permanently for everyone:

> **New security restrictions for OAuth authorization codes**
>
> We will only allow authorization codes to be exchanged for access tokens once and will require that they be exchanged for an access token within 10 minutes of their creation. This is in line with the OAuth 2.0 Spec which from the start [has stated that](https://l.facebook.com/l.php?u=http%3A%2F%2Ftools.ietf.org%2Fhtml%2Fdraft-ietf-oauth-v2-31%23section-10.5&h=AUCjP1QzJsGQk4JK427cyoxqAJFJ-bpZ_9WQKq8GTTJfO7TdLvtZtbESlKYNRRPWHG_cO_3ZSZcokeGg0wpsQPYhWNIjNLiaU9rsxPuMPb98OXjDcabdiZBXo4voMHAafwggl3p49wVL4A) "authorization codes MUST be short lived and single use". For more information, check out our [Authentication documentation](https://developers.facebook.com/docs/authentication/).
>
> **Graph API will return full Custom Open Graph objects**
>
> We will begin returning full Custom Open Graph objects (including custom-defined fields) via the Graph API when requesting them using the `id` parameter (e.g. `https://graph.facebook.com/?id=YOUR_URL`). Currently we only return the `id` and `shares` fields for these objects.
>
> **Stripping HTML from Page description field**
>
> As some Page descriptions contain HTML (e.g. `https://graph.facebook.com/107850102581157`), we will begin stripping HTML tags from the `description` column/field of the \[Page FQL table\] and the \[Page Graph API object\] so as to not require you to parse/render HTML when using a Page description. We will add a `description_html` column/field that will contain the description including the HTML tags (as `description` used to contain). The `description_html` Graph API field will not be returned by default. It will have to be explicitly requested by including a `?fields=description_html` parameter in your Graph API `GET` request.

* * *

## November 7, 2012

The following change will go into effect on November 7th, 2012:

> **No more payments reporting emails**
>
> We will stop sending payments reporting emails. You can download daily reports of transaction data using our [Payments Reporting API](https://developers.facebook.com/blog/post/2012/08/06/new-payments-reporting-api/).

The following changes can all be enabled/disabled using the "November 2012 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until November 7th when they will go into effect permanently for everyone:

> **Notifications table no longer returns pid/aid for photos/albums**
>
> The `object_id` field on the `notification` FQL table will return photo ids and album ids (called `object_id` and `album_object_id` respectively in the `photo` FQL table) instead of `pid` and `aid`.
>
> **New permission required to read Page mailboxes**
>
> In order to read a Page's mailbox (`PAGE_ID/conversations` in the Graph API or `unified_*` FQL tables), you will need the `read_page_mailboxes` permission. The `read_mailbox` permission will now only give you access to a user's mailbox.

The following change can be enabled/disabled using the "External Page Migration" [migration](https://developers.facebook.com/roadmap/migrations) until November 7th when it will go into effect permanently for everyone:

> **External Page migration**
>
> You will no longer be able to publish content to the News Feeds of users who have liked your Open Graph object. This feature will only be available for Facebook Pages.

* * *

## October 3, 2012

The following changes will go into effect on October 3rd, 2012:

> **Built-in like/follow action required**
>
> We will stop allowing the use of Custom Open Graph "like" and "follow" actions now that there are built-in "like" and built-in "follow" actions. Please convert any custom "like" or "follow" actions you may have created to instead use the built-in "like" or "follow" actions.
>
> **Removing Bookmark URL** \- _[Originally scheduled](https://developers.facebook.com/blog/post/547/) for December 1, 2011_
>
> As [mentioned on the blog](https://developers.facebook.com/blog/post/547/), this optional field was originally created to help developers track user referrals from app bookmarks. We now pass a `ref` parameter to let you know that the user is coming from a bookmark (i.e. `ref=bookmarks`). As such, we will remove the "Bookmark URL" field from the apps settings.

The following changes can all be enabled/disabled using the "October 2012 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until October 3rd when they will go into effect permanently for everyone:

> **Removing Live Stream plugin**
>
> The Live Stream plugin has been deprecated and will render the [Comments Box plugin](https://developers.facebook.com/docs/reference/plugins/comments/) in its place. While it offers similar functionality, there are a few functional differences.
>
> **Summary field being replaced by description field**
>
> Because the two fields were somewhat redundant, we will be removing the "Summary" field (found in the "Login Dialog" section of an app's settings) and instead using the "Description" field (found in the "Advanced" section of an app's settings) in places where "Summary" was previously used.
>
> **Removing position field for photos**
>
> The `position` field in both the \[`photo` FQL table\] as well as the [`Photo` Graph API object](https://developers.facebook.com/docs/reference/api/photo/) will start returning `0` for all photos. The `photos` connection on an [`Album` object](https://developers.facebook.com/docs/reference/api/album/) in the Graph API will continue to return photos in the order they appear in the album. FQL queries on the \[`photo` table\] that have a `WHERE` clause containing the `aid` or `album_object_id` columns will return in the correct order as well without needing an `ORDER BY position` clause.
>
> **/picture connection will return a dictionary when a callback is specified**
>
> We will start returning a dictionary containing the fields `url`, `height`, `width`, and `is_silhouette` when accessing the /picture connection for an object and specifying a `callback` property. Currently we just return the picture URL as a string.

* * *

## September 5, 2012

The following changes will go into effect on September 5th, 2012:

> **Deleting FB.Canvas.setAutoResize** \- _[Originally scheduled](https://developers.facebook.com/blog/post/565/) for January 1, 2011_
>
> We have renamed FB.Canvas.setAutoResize to [FB.Canvas.setAutoGrow](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.setAutoGrow/) so that the method more accurately represents its function. FB.Canvas.setAutoResize [will stop working](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#removing-auto-resize) on August 1st. We will completely delete the function on September 5th (if you call it you will get an "undefined function" error).
>
> **Built-in actions required for watching and reading**
>
> Custom actions for reading articles and watching videos must use built-in actions. Built-in watch and read actions can only be published after someone engages with the content for 10 or more seconds.

The following changes can all be enabled/disabled using the "September 2012 Breaking Changes" [migration](https://developers.facebook.com/roadmap/migrations) until September 5th when they will go into effect permanently for everyone:

> **Renaming 'likes' property of Comments and 'votes' property of QuestionOptions**
> We will be renaming the `likes` property of the [Comment](https://developers.facebook.com/docs/reference/api/comment/) object to `like_count` and the `votes` property of the [QuestionOption](https://developers.facebook.com/docs/reference/api/question_option/) to `vote_count`.
>
> **Minor change to admin.getAppProperties call**
>
> When making an `admin.getAppProperties` call, we will now return an empty iOS Bundle ID as `[]` instead of `[""]`.
>
> **Returning actual size in photo\_src table**
>
> We will start returning the actual `size`, `height`, and `width` of photos in the \[`photo_src`\] FQL table instead of the dimensions of the bounding box.

* * *

## August 1, 2012

> **Disabling FB.Canvas.setAutoResize** \- _[Originally scheduled](https://developers.facebook.com/blog/post/565/) for January 1, 2011_
>
> We have renamed FB.Canvas.setAutoResize to FB.Canvas.setAutoGrow so that the method more accurately represents its function. FB.Canvas.setAutoResize will stop working on August 1st. We will [completely delete](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#deleting-auto-resize) the function on September 5th.
>
> **Page Post GETs from Graph API/FQL Will Require an Access Token**
>
> All calls to `GET` [Page](https://developers.facebook.com/docs/reference/api/page/) [posts](https://developers.facebook.com/docs/reference/api/post/) from the [Graph API](https://developers.facebook.com/docs/reference/api/) or \[FQL\] will now require an access token to be used.
>
> **Removing prompt\_permissions.php and prompt\_feed.php**
>
> We will be removing a very old version of the feed dialog (/connect/prompt\_feed.php) as well as a very old version of the Login Dialog (/connect/prompt\_permissions(s).php). If you are one of the very few developers still using these legacy endpoints, you should upgrade to the current [Feed Dialog](https://developers.facebook.com/docs/reference/dialogs/feed/) and/or [Login Dialog](https://developers.facebook.com/docs/reference/dialogs/oauth/).
>
> **Removing Add To Timeline Plugin**
> We will be removing the Add to Timeline plugin. If you are embedding the Add to Timeline plugin, we will render the [Login Button](https://developers.facebook.com/docs/reference/plugins/login/) in its place with the `publish_actions` [permission](https://developers.facebook.com/docs/authentication/permissions/) automatically added to the `scope` parameter.

* * *

## July 5, 2012

> **Event GETs from Graph API/FQL Will Require an Access Token**
>
> All calls to get \[events\] from the Graph API or FQL will now require an access token to be used.
>
> **Removal of FBML**
>
> FBML apps will no longer work on Platform. All FBML endpoints will be removed and the "FBML Removal" [migration](https://developers.facebook.com/roadmap/migrations/) added June 6th will be removed.
>
> **Updating Page Hours Property**
>
> The `hours` property of [Pages](https://developers.facebook.com/docs/reference/api/page/) will return times in the format HH:MM (e.g. "14:23") rather than the a Unix time.
>
> **Batch API Exception Format**
>
> Errors from the Batch API will return errors in a new format. Previously, errors would take the format:

```code
{"error_code": "", "error_description": ""}
```

> With this change, they will now be formatted in-line like the rest of the Graph API:

```code
{"error": {"message": "", "type": ""}}
```

> **Removing Timezone From Event Times**
>
> We have had a [migration](https://developers.facebook.com/roadmap/migrations) titled "Timezone-less Events" out for a while now which removes timezones from [event](https://developers.facebook.com/docs/reference/api/event/) start and end times. This migration was originally created because in the past, events have been intended to be created with start and end times that are specific to the location of the event so including a timezone in the API simply led to confusion. Until now, this migration never had a date set for when it would go into full effect. That date is now July 5th. This change can be enabled/disabled using the "Timezone-less Events" [migration](https://developers.facebook.com/roadmap/migrations).
>
> Since this migration was originally created, we have added a `timezone` field to [events](https://developers.facebook.com/docs/reference/api/event/) which indicates the name of the timezone (as defined [here](https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.php.net%2Fmanual%2Fen%2Ftimezones.php&h=AUAqCfefzb9xR-4r8g7QT6M-8nkH2lfTYLbmJ85EI_wb233VF1GCj2SvGEvdUHPt9aeLCDKBUs-UZrdjAZj89osr29cpSmdE-g8QJQrir6KLJw486CrN-BCkCCBw1GLz7pqzb0J2aIgvtw)) where the event is expected to happen. FYI, developers reading time in [ISO 8601](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FISO_8601&h=AUBiHz6vbLvgbT29SMvreGL38ziTMQRUsqD2dD5eLbBfwNAXXTqM2Zuumwko7KfcYy29_j9eGHk24WBbpH5kreKsZuKZIYaIP-JitIuhBJOF9oJQenZgttKEt7rFhm6_lS8Ezdw9Vxj6XQ) should be supporting the full standard when reading event times. Most events return local times (no GMT offset), but in the future events likely will return other formats (namely `date-only` and `precise`).
>
> **Removing display=wap Dialogs**
>
> The `wap` [dialog display mode](https://developers.facebook.com/docs/reference/dialogs/) will be removed.
>
> **Removing Some Event FQL Object Fields**
>
> We will be removing the following legacy fields from the \[event\] FQL object.
>
> - `show_in_search`
>
> - `show_wall`
>
> - `show_photos`
>
> - `show_videos`
>
> - `show_posts`
>
> - `nid`
>
> - `tagline`
>
> - `event_type`
>
> - `event_subtype`
>
>
> **Coordinate-less Tags**
>
> Tags previously could only exist on [photos](https://developers.facebook.com/docs/reference/api/photo/) and always included x,y coordinates. On Facebook it is now possible to tag people in [photos](https://developers.facebook.com/docs/reference/api/photo/) and [statuses](https://developers.facebook.com/docs/reference/api/status/) with no coordinates ( [example](https://developers.facebook.com/attachment/roadmap-with-tags.png)). These people show up as being "with" the actor. The potential breaking change is that it will be possible for the `tags` parameter of any [photo](https://developers.facebook.com/docs/reference/api/photo/) object to return objects with no `x` or `y` parameters.
>
> **Removing Bookmark.Add and Profile.AddTab Dialogs**
>
> We will be removing the `bookmark.add` and `profile.addtab` dialogs from the [Javascript SDK](https://developers.facebook.com/docs/reference/javascript/). These dialogs already don't do anything as the concepts of manually adding bookmarks and profile tabs have already been removed.
>
> **Moving Type Property Into Metadata Array**
>
> When querying the [Graph API](https://developers.facebook.com/docs/reference/api/) with a `metadata=1` parameter, we append a `metadata` array and a `type` property to the response. We will be moving the `type` property into the `metadata` array.

* * *

## June 6, 2012

> **Removal of FBML**
>
> FBML apps will no longer work on Platform. The "FBML Removal" [migration](https://developers.facebook.com/roadmap/migrations) will appear and will be enabled for all apps. It will be possible to disable the migration, thereby re-enabling FBML, until July 5, 2012 when the migration and all FBML endpoints will be removed completely.
>
> **XMPP Connections must be done over TLS**
>
> Apps connecting to [Facebook's XMPP service](https://developers.facebook.com/docs/chat/) will be required to use STARTTLS for all connections. We will start rejecting unencrypted connections.

* * *

## May 2, 2012

> **Removal of group\_type and group\_subtype columns from group FQL table**
>
> We will remove the `group_type` and `group_subtype` columns of the `group` FQL table. Please ensure that your apps are not utilizing these columns.
>
> **Removing support to claim Domains using Page ID** \- _[Originally scheduled](https://developers.facebook.com/blog/post/608/) for April 1st, 2012_
>
> We will remove the ability to claim domains with a Page ID. The recommended option for claiming domains is with an App ID or User ID and existing domains that have been claimed will continue to work fine. After claiming domains, owners are able to view insights or run Domain Sponsored Stories. See the [Insights documentation](https://developers.facebook.com/docs/insights/) for more on the updated domain claiming flow.

* * *

## April 4, 2012

> **Making deprecated SDK repositories private**
>
> We will make the Python and C# SDK repositories on [GitHub](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2F&h=AUAypiIGrfBxpUP6VEULtF-_inG-MYVZCKITwu2jDlrRqrC5ffgZYEeIsZHznMWbbJ-EOhZTK9hd62W_ZlPAtwmKRHPmhkf147N7FzO1jyROCSA5ECJReULZBtRR7QwDsU4kfxUsNsE21Q) private. These repositories are deprecated and may not work as expected due to changes in our auth system.
>
> **Removing canvas\_name field from application object** \- _[Originally scheduled](https://developers.facebook.com/blog/post/579/) for February 1st, 2012_
>
> We will be removing the `canvas_name` field in favor of `namespace` field on the [application object](https://developers.facebook.com/docs/reference/api/application).

* * *

## February 15, 2012

> **Pages Insights Metrics Deprecations**
>
> We are in the process of deprecating some old Page Insights. We announced this in a number of forums, but failed to outline this change in our Platform Roadmap per our breaking change policy. Our apologies. You can find a full list of the Insights to be deprecated from the Insights documentation. These Insights will be completely removed from API on Feb 15th 2012. Please make all necessary updates as soon as possible so that you can transition smoothly.

* * *

## February 1, 2012

> **Removing App Profile Pages**
>
> We will be deleting all App Profile Pages and redirecting all traffic directly to the App. For more information, please refer to the [blog post](https://developers.facebook.com/blog/post/611/).
>
> **Removing REST Support for Ads API**
>
> We will be removing REST support for the Ads API. All Ads API developers now use the Graph API.

* * *

## January 1, 2012

> **Removing the FB.Data.\* JS SDK APIs**
>
> These will be no longer available.
>
> **Deprecating FBML**
>
> FBML will no longer be supported as of January 1, 2012. Aside from security and privacy related bugs, we will not fix any bugs related to FBML after January 1, 2012. On June 1, 2012 FBML endpoints will be removed from Platform.
>
> **All apps will be opted into "Upgrade to Requests 2.0" and "Requests 2.0 Efficient" Migrations**
>
> Existing apps will be opted into “Requests 2.0 Efficient” and "Upgrade to Requests 2.0" migrations and all developers must ensure that they are using the correct `request_id` format and deleting requests appropriately. Details [here](https://developers.facebook.com/blog/post/569/).
>
> **Enforcing Credits Policy**
>
> We have added a new policy to the [Facebook Credits Terms](https://developers.facebook.com/policy/credits/) that prohibits routing Credits from one application to another application without our prior authorization.
>
> > 2.14 You may not accept Credits in one application and deliver or transfer the purchase to the user in another application without our prior authorization. For example, an application solely designed to facilitate transactions is not permitted.
>
> Applications that are not compliant by January 1, 2012 run the risk of having their Credits disabled shortly after.

* * *

## December 1, 2011

> **OAuth Spec Migration**
>
> In order to be compliant with the [OAuth spec](https://l.facebook.com/l.php?u=http%3A%2F%2Ftools.ietf.org%2Fhtml%2Fdraft-ietf-oauth-v2-20&h=AUCoTqhciKnWMUhhUykD-ln1cmeBFtubci3qdHbKyPraxftzSAWL_2n6aEVz-HmociVzYAu89lcY4iQGJ2dCILZevmCsTqIbBlYX9K4PIkzPCH6NTzbnzhVeKJTdSXPX85c2BKHe0wGqlw) we have made changes to our auth APIs. As part of this update, we will be deprecating `code_and_token` and need developers to use `code%20token`. Everything is identical, just replace `_and_` with encoded <space> (`%20`).
>
> **Deprecating Dashboard APIs**
>
> These APIs (that start with "dashboard.") are no longer supported and will not be available past this date. This does not include the Dashboard count APIs which will deprecate on the FBML and Request 1.0 schedule (no support past Jan 1st 2012, and removed June 1st 2012.
>
> **Apps on Facebook: FB.Canvas.getPageInfo must be called with callback**
>
> The [FB.Canvas.getPageInfo](https://developers.facebook.com/docs/reference/javascript/FB.Canvas.getPageInfo/) method will have to be called with a callback function. This was previously not required. See [this blog post](https://developers.facebook.com/blog/post/543/) for more information.

* * *

## November 1, 2011

> **manage\_notifications Permissions Migration**
>
> To read or manipulate a user’s notifications, we will require you to get the `manage_notifications` permission.

* * *

## October 1, 2011

> **OAuth 2.0 Migration**
>
> As we [announced](https://developers.facebook.com/blog/post/497/) in May, all apps [must migrate to OAuth 2.0](https://developers.facebook.com/docs/oauth2-https-migration/) for authentication and expect an encrypted access token. The old SDKs, including the old JS SDK and old iOS SDK will no longer work.
>
> **Apps on Facebook Authentication and Security Migration (HTTPS)**
>
> All Canvas and Page tab apps must [convert](https://developers.facebook.com/blog/post/499/) to process `signed_request` (`fb_sig` will be removed) and obtain an SSL certificate for use in "Secure Canvas URL" and "Secure Page Tab URL" (unless you are in Sandbox mode). You must provide an SSL certificate in the [Dev App](https://developers.facebook.com/apps) settings to avoid having your app disabled.
>
> **auth.promotesession Deprecation**
>
> This method is deprecated and will be removed.
>
> **manage\_pages Permission Required to Access User Accounts (/me/accounts)**
>
> We are [modifying access](https://developers.facebook.com/blog/post/516/) to the FQL `page_admin` table and the `graph.facebook.com/me/accounts` endpoint. Previously, with basic permissions granted, an app could go to this endpoint or the FQL table to access the list of a user’s apps and Pages. We are going to require that apps have the `manage_pages` permission in order to obtain access to this information.

* * *

## June 11, 2011

> **New Developer app**
>
> We are building a new version of the [Developer app](https://developers.facebook.com/apps) for managing your application's settings and will be adding features such as the ability to easily create and manage [test users](https://developers.facebook.com/docs/test_users/), manage large numbers of apps, manage users with special privileges (admin, developer, tester, insights), and more.

* * *

## June 3, 2011

> **Requiring Access Token for Feed Connection**
>
> We will require an access token to `GET` from `PROFILE_ID/feed`.

* * *

## April 18, 2011

> **Removing "year" and "status" properties of "affiliations" column in "user" FQL table**
>
> These properties [will be removed](https://developers.facebook.com/blog/post/482) from the "affiliations" column. You should use the "education" property of the [User object](https://developers.facebook.com/docs/reference/api/) in the Graph API or the "education\_history" column of the \[user FQL table\] instead.

* * *

## March 11, 2011

> **Canvas Apps and Page Tabs: No new FBML apps**
>
> We [will stop](https://developers.facebook.com/blog/post/462#fbml_roadmap) allowing new FBML apps, but will continue to support existing FBML tabs and apps. Instead, we recommend using iframes.

On This Page

[Facebook Platform Migrations](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#facebook-platform-migrations)

[Table of Contents](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#toc)

[US-only Gray User Login Deprecation](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#grey_account)

[Important Dates](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#important-dates)

[Step by step](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#step-by-step)

[New Graph API framework conversion](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode)

[Ad account GET](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode_account)

[Custom Audiences GET](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#graphnode_ca)

[Deleted/Archive status](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#archive)

[Custom Audiences API v2](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ca)

[Rename custom audiences from your website remarketingpixelcode endpoint](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#wca)

[Structured targeting sentences](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#targeting_sentences)

[Generalize vat\_status field of ad account into tax\_id\_status](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#vat_status)

[New Campaign Structure](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#mmp_new_campaign_structure)

[Tracking flag is required](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#mmp_flag)

[Removal of PTAT metric](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#ptat)

[Require message field in offers API](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#offers)

[Payments Realtime Updates & Disputes API 2014](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#payments-realtime-updates---disputes-api-2014)

[October 2, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#oct_2013)

[September 12, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#sep_2013)

[July 10, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#july_2013)

[April 3, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#apr_2013)

[March 6, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#mar_2013)

[February 6, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#feb_2013)

[January 9, 2013](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jan_2013)

[December 5, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#dec_2012)

[November 7, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#nov_2012)

[October 3, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#oct_2012)

[September 5, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#sep_2012)

[August 1, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#aug_2012)

[July 5, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jul_2012)

[June 6, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jun_2012)

[May 2, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#may_2012)

[April 4, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#apr_2012)

[February 15, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#feb15_2012)

[February 1, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#feb1_2012)

[January 1, 2012](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jan_2012)

[December 1, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#dec_2011)

[November 1, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#nov_2011)

[October 1, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#oct_2011)

[June 11, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jun11_2011)

[June 3, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#jun3_2011)

[April 18, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#apr_2011)

[March 11, 2011](https://developers.facebook.com/docs/graph-api/changelog/archive/migrations#mar_2011)