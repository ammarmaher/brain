---
url: https://developers.facebook.com/docs/marketing-api/businessmanager/systemuser/api-calls
title: API Calls - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fsystem-users%2Fguides%2Fapi-calls%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[API Calls](https://developers.facebook.com/docs/business-management-apis/system-users/guides/api-calls#api-calls)

[Marketing API](https://developers.facebook.com/docs/business-management-apis/system-users/guides/api-calls#marketing-api)

[Pages API](https://developers.facebook.com/docs/business-management-apis/system-users/guides/api-calls#page-api-calls)

# API Calls

Examples of API Calls using system users.

## Marketing API

These calls are automated calls made by a server not a human, but the end point call syntax does not change. You just need to use the system user token instead of the old gray user token.

Example, where `access_token` should be the system user token:

```code
CURL https://graph.facebook.com/<API_VERSION>/act_<AD_ACCOUNT_ID>/?access_token=<ACCESS_TOKEN>
```

## Pages API

These are automated calls made by a server not a human. Once the system user has `pages_read_engagement` permission, the system user access token can be used to retrieve the page access token.

The call to retrieve the token is a `GET` request, where `me` refers to the **system user** since that is the user id from the access token.

```code
CURL https://graph.facebook.com/<API_VERSION>/me/accounts?access_token=<ACCESS_TOKEN>
```

The response looks like this:

```code
{
    "data": [\
        {\
        "category": "App page",\
        "name": "Test App Page",\
        "access_token": "CAAHYqnL1lRYBAOXZAHqZCQ5gUuIId6dKxzfOovZADPZBzSq79BxvbGQWE38IMQQxhVSbdzBPb2IgfVkmXKDTQAPf6PHG8z4WZCkhj26V2cxE7bJNgyg97JwmmDwlHVsOCNgNTMEyNAvI4suafezTmthyKboe5KABA2PrSc1BEtjMMssK6b8FP2rCNjShRcZD",\
        "tasks": [\
            "ANALYZE"\
            ],\
        "id": "17502650099664862613886"\
        }\
    ],
    "paging": {
    "next": "https://graph.facebook.com/<API_VERSION>/100008179/accounts?limit=5000&amp;offset=5000&amp;__after_id=175024862613886"
    }
}

}
```

At this point, all the steps have been taken to make page calls if you use system user to programmatically manage pages. The way to call the page end points does not change.

On This Page

[API Calls](https://developers.facebook.com/docs/business-management-apis/system-users/guides/api-calls#api-calls)

[Marketing API](https://developers.facebook.com/docs/business-management-apis/system-users/guides/api-calls#marketing-api)

[Pages API](https://developers.facebook.com/docs/business-management-apis/system-users/guides/api-calls#page-api-calls)