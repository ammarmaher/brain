---
url: https://developers.facebook.com/docs/marketing-api/business-manager-api/business-onboarding/obo
title: On Behalf Of - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fbusiness-manager%2Fguides%2Fon-behalf-of%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)


  - [Get Started](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/business-manager/guides)


    - [On Behalf Of](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of)

  - [Best Practices](https://developers.facebook.com/docs/business-management-apis/business-manager/best-practices)
  - [Support](https://developers.facebook.com/docs/business-management-apis/businessmanager/support)

- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)

On This Page

[Business On Behalf Of](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#business-on-behalf-of)

[Get Started](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#get-started)

[Business Manager for Client](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#bm-client)

[App Permissions](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#app-permissions)

[IDs](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#ids)

[Access Tokens](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#access-tokens)

[Recommended Steps](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#steps)

[FAQ](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#faq)

# Business On Behalf Of

The **Business On Behalf Of** API allows a partner to:

- Get access to act on behalf of their client
- Create a system user under their client's Business Manager and fetch its access token

A _system user_ is defined as someone who may perform repetitive programmatic tasks, such as updating a product catalog, sending server-to-server events, or updating custom audiences, and so on.

In this scenario, the system user has employee access and can only access assigned (at the time of creation) assets using the admin user's access token.

The advantage of using a system user vs. a user access token — users can cycle off a business, but system user access tokens don't expire. In this approach, the client continues to be the owner of their business and allows the partner access to their Business Manager and its assets via a system user. A client has the ability to go to their Business Manager and revoke the system user or remove certain assets access to a partner programmatically.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=514320780210095&version=1768200965)

## Get Started

Before you start, we recommend that you review these requirements and information:

### Business Manager for Client

If your client has created a commerce account [through Commerce Manager](https://developers.facebook.com/docs/commerce-platform/platforms/onboarding/cmredirect#2--redirect-to-commerce-manager), it is already connected to their Business Manager. You can find their Business Manager ID by following [this instruction](https://developers.facebook.com/docs/commerce-platform/platforms/onboarding/troubleshooting#biz-id).

If there is **no Business Manager** for the client, you **must create one before proceeding.** For instructions, see [Business Manager API](https://developers.facebook.com/docs/marketing-api/business-manager-api/).

### App Permissions

- `business_management`

### IDs

- `PARTNER_BM_ID`: ID of the Business Manager of the partner who should own the app.
- `CLIENT_BM_ID`: ID of the Business Manager of the client that owns the Facebook Page connected to the client's Commerce Account.

### Access Tokens

- `USERS_ACCESS_TOKEN`: The access token of an admin of client's Business Manager, created with `business_manage` permissions using the app owned by the partner's Business Manager. This token is generated through [Facebook Login](https://developers.facebook.com/docs/commerce-platform/platforms/onboarding/cmredirect#1--set-up-a-facebook-login-flow).
- `PARTNER_BM_ADMIN_SYSTEM_USER_ACCESS_TOKEN`: The access token of the admin system user in the partner's Business Manager for the app.
- `CLIENT_BM_SU_ACCESS_TOKEN`: The access token of the system user under the client's Business Manager.
- `CLIENT_BM_SU_PAGE_ACCESS_TOKEN`: The **page** access token of the system user under the client's Business Manager.

## Recommended Steps

#### Step 1

Create the On Behalf Of relationship between the partner and client's Business Manager.

This creates an relationship edge between partner's Business Manager and client's Business Manager. This enables the partner to be able to create a SU via the API in the next step.

**Access Token Used:**`USERS_ACCESS_TOKEN`

```json

curl -i -X POST \
 "https://graph.facebook.com/v25.0/<PARTNER_BM_ID>/managed_businesses?existing_client_business_id=<CLIENT_BM_ID>&access_token=<USERS_ACCESS_TOKEN>"

```

#### Step 2

Fetch the access token of system user under the client's Business Manager. This installs the app in the client's Business Manager and creates a system user. By default the name of the system user is **"{Client\_Business\_Manager\_Name} SYSTEM USER**". A client will be able to see the partners App in their Business Manager as a shared asset. (They will not have any access to the App other than at most as a test user.)

In the `scope` parameter, you should include any permissions you need the system user to have in order to access relevant API endpoints. Refer to individual API references for what permissions are needed to access them.

**Access Token Used:**`PARTNER_BM_ADMIN_SYSTEM_USER_ACCESS_TOKEN`. This access token needs to have the `business_management` permission, and all the permissions included in the `scope` parameters above.

```json

curl -i -X POST \
 "https://graph.facebook.com/v25.0/<CLIENT_BM_ID>/access_token?scope=ads_management,pages_read_engagement&app_id=<APP_ID>&access_token=<PARTNER_BM_ADMIN_SYSTEM_USER_ACCESS_TOKEN>"

```

The response contains the token for the system user who is linked to the OBO relationships. You do not need to create or use any other system user for the commerce integration.

#### Step 3

Get the ID of the system user.

**Access Token Used:**`CLIENT_BM_SU_ACCESS_TOKEN`

```json
curl -i -X GET \
 "https://graph.facebook.com/v25.0/me?access_token=<CLIENT_BM_SU_ACCESS_TOKEN>"

```

#### Step 4

Assign assets (page and catalog) to the system user in the client's Business Manager.

**Access Token Used:**`USERS_ACCESS_TOKEN`

```json
curl -i -X POST \
 "https://graph.facebook.com/v25.0/<ASSET_ID>/assigned_users?user=<SYSTEM_USER_ID>&tasks=MANAGE&access_token=<USERS_ACCESS_TOKEN>"

```

#### Step 5

Store this `CLIENT_BM_SU_ACCESS_TOKEN` in a secure database and use it for accessing APIs that require a user access token, such as [Catalog Management](https://developers.facebook.com/docs/commerce-platform/catalog).

#### Step 6

Generate a [Page Access Token](https://developers.facebook.com/docs/pages/access-tokens/#page-access-tokens) using `CLIENT_BM_SU_ACCESS_TOKEN` by calling:

```json
curl -i -X GET \
 "https://graph.facebook.com/v25.0/me/accounts?access_token=<CLIENT_BM_SU_ACCESS_TOKEN>"

```

This request will list all Pages managed by the system user including the matching `access_token`. Example response:

```json
{
  "data": [\
    {\
      "access_token": "<access token sanitized>",\
      "category": "Retail Company",\
      "category_list": [\
        {\
          "id": "2239",\
          "name": "Retail Company"\
        }\
      ],\
      "name": "Test_Shop_Page",\
      "id": "<content sanitized>",\
      "tasks": [\
        "ANALYZE",\
        "ADVERTISE",\
        "MODERATE",\
        "CREATE_CONTENT",\
        "MANAGE"\
      ]\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "<content sanitized>",
      "after": "<content sanitized>"
    }
  }
}
```

Copy the `access_token` corresponding to the page linked with client's Commerce Account, and store it securely. You will use it to access APIs that require a Page Access Token on behalf of the Commerce Account, such as [Order Management](https://developers.facebook.com/docs/commerce-platform/order-management) and [Finance Reporting](https://developers.facebook.com/docs/commerce-platform/reporting).

## FAQ

How can I delete the On Behalf of relationship to remove the System user under the clients Business Manager assigned to me?

```json

curl -i -X DELETE \
 "https://graph.facebook.com/v25.0/<PARTNER_BM_ID>/managed_businesses?existing_client_business_id=<CLIENT_BM_ID>&access_token=<USERS_ACCESS_TOKEN>"

```

If the Client wants to remove the connection and the System User of the Partner, they can do so in the [App view of the Business Manager](https://business.facebook.com/settings/connected-apps).

On This Page

[Business On Behalf Of](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#business-on-behalf-of)

[Get Started](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#get-started)

[Business Manager for Client](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#bm-client)

[App Permissions](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#app-permissions)

[IDs](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#ids)

[Access Tokens](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#access-tokens)

[Recommended Steps](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#steps)

[FAQ](https://developers.facebook.com/docs/business-management-apis/business-manager/guides/on-behalf-of#faq)