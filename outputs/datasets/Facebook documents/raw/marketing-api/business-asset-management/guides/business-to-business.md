---
url: https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/business-to-business/
title: Business-to-Business Functions - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fbusiness-asset-management%2Fguides%2Fbusiness-to-business%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Business-to-Business Functions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#business-to-business-functions)

[Request Access to Assets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#request-access-to-assets)

[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples)

[Pending requests](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#pending-requests)

[Grant Access to Assets for Another Business Manager](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#grant-access-to-assets-for-another-business-manager)

[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples-2)

[Remove Access to Assets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#remove-access-to-assets)

[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples-3)

[View Agency Access](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-agency-access)

[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples-4)

[View Client Access](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-client-access)

[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples-5)

[Managing Your Relationship as an Ad Agency Acting on Behalf of Another Business](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#managing-your-relationship-as-an-ad-agency-acting-on-behalf-of-another-business)

[View OBO request details](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-obo-request-details)

[Delete OBO requests](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#delete-obo-requests)

[View the status of an ad account's OBO requests](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-the-status-of-an-ad-account-s-obo-requests)

[View OBO requests received from other businesses](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-obo-requests-received-from-other-businesses)

[View pending OBO requests sent by your business](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-pending-obo-requests-sent-by-your-business)

[Learn More](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#learn-more)

# Business-to-Business Functions

As of June 8, 2021, access to these endpoints is limited. Apps without access will receive an error.

## Request Access to Assets

A Meta Business Manager may request access to an ad account or Page owned by another Business Manager. They must specify the tasks that they want to assign in the request.

**Note:** Assigning a business to a Page requires a Page token.

To request `AGENCY` access, you must provide `permitted_tasks` in your request.

You can only send a request for access to assets to the Business Manager that you intend to approve and that they must already know your business.

### Examples

```html
curl -X POST \
  -F "business=<BUSINESS_ID>" \
  -F "permitted_tasks=['MODERATE', 'ADVERTISE', 'ANALYZE']" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/v25.0/<PAGE_ID>/agencies"
```

If a business needs access to `adaccount_id` and needs to be able to assign its employees with `['ADVERTISE', 'ANALYZE']` tasks:

```html
curl -X POST \
  -F "adaccount_id=act_<AD_ACCOUNT_ID>" \
  -F "permitted_tasks=['ADVERTISE','ANALYZE']" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/v25.0/<BUSINESS_ID>/client_ad_accounts"
```

For a Page, if you want to assign `['ADVERTISE', 'ANALYZE']` tasks for a Page someone does not own:

```html
curl -X POST \
  -F "page_id=<PAGE_ID>" \
  -F "permitted_tasks=['ADVERTISE','ANALYZE']" \
  -F "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/v25.0/<BUSINESS_ID>/client_pages"
```

These calls send out a notification to the admins of the ad account or Page, which asks them to accept the access request. The admins will see the notification in Ads Manager or Pages Manager. They can also accept the request in the user interface.

### Pending requests

If you want to see outstanding requests via the API, make a `GET` request to the `/{business-id}/clients` endpoint to check the `access_status` field for a pending status.

```html
curl "https://graph.facebook.com/v25.0/<BUSINESS_ID>/clients?access_token=<ACCESS_TOKEN>"
```

The response will look like this:

```json
"data": [\
 {\
    "name": "Random Page",\
    "page_permissions": [\
    {\
    "id": "1900952844321",\
    "permitted_tasks": [\
        'MANAGE',\
        'CREATE_CONTENT',\
        'MODERATE',\
        'ADVERTISE',\
        'ANALYZE',\
    ],\
    "access_status": "CLIENT_RESPONSE_PENDING",\
    "access_requested_time": "2014-01-07T23:26:09+0000",\
    "access_updated_time": "2014-01-07T23:26:09+0000"\
    }\
    ],\
    "id": "190137931178903"\
 },\
```\
\
## Grant Access to Assets for Another Business Manager\
\
This is also known as adding an agency to your object.\
\
To accept an access request of an object you own from another Business Manager, or to give access of one of the objects you own to another Business Manager, you must specify the business and the list of tasks they should have access to.\
\
If the access token used to make the API call belongs to a user or system user who has access to the requested asset via a business, the access to the asset can only be granted if this business is the `OWNER` of the asset. You cannot grant access to assets of which you are just an `AGENCY`.\
\
### Examples\
\
To give someone access to an ad account using the `'ADVERTISE'` and `'ANALYZE'` tasks:\
\
```html\
curl -X POST\\
  -F "business=<BUSINESS_ID>" \\
  -F "permitted_tasks=['ADVERTISE', 'ANALYZE']" \\
  -F "access_token=<ACCESS_TOKEN>" \\
"https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/agencies"\
```\
\
To give a business access to your Page with `ADVERTISE`, `MODERATE` and `ANALYZE` tasks:\
\
```html\
curl -X POST \\
  -F "business=<BUSINESS_ID>" \\
  -F "permitted_tasks=['MODERATE', 'ADVERTISE', 'ANALYZE']" \\
  -F "access_token=<ACCESS_TOKEN>" \\
"https://graph.facebook.com/v25.0/<PAGE_ID>/agencies"\
```\
\
In the case of granting access to an ad account, a review from another business admin is sometimes required as a security measure. This review can be approved by navigating to [https://business.facebook.com/settings/requests/admin\_reviews](https://business.facebook.com/settings/requests/admin_reviews). In this case, the response will have an additional field indicating a review is required.\
\
```json\
{\
  "success": true,\
  "requires_admin_approval": true\
}\
```\
\
Page admins can also accept agency access requests in the **Manage Admin Roles** tab in the Page Settings.\
\
## Remove Access to Assets\
\
This is also known as removing an agency from your business.\
\
### Examples\
\
To remove a Business Managers's access from your ad account:\
\
```html\
curl -X DELETE \\
  -F "business=<BUSINESS_ID>" \\
  -F "access_token=<ACCESS_TOKEN>" \\
"https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/agencies"\
```\
\
To remove a business's access from your Page:\
\
```html\
curl -X DELETE \\
  -F "business=<BUSINESS_ID>" \\
  -F "access_token=<ACCESS_TOKEN>" \\
"https://graph.facebook.com/v25.0/<PAGE_ID>/agencies"\
```\
\
## View Agency Access\
\
### Examples\
\
To see all the businesses that have access to your ad account:\
\
```html\
curl "https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/agencies?access_token=<ACCESS_TOKEN>"\
```\
\
To see all the businesses that have access to your Page:\
\
```html\
curl "https://graph.facebook.com/v25.0/<PAGE_ID>/agencies?access_token=<ACCESS_TOKEN>"\
```\
\
To see all the businesses that have access to your business assets:\
\
```html\
curl "https://graph.facebook.com/v25.0/<BUSINESS_ID>/agencies?access_token=<ACCESS_TOKEN>"\
```\
\
## View Client Access\
\
### Examples\
\
To see all the businesses that have given you access to one or more of their ad accounts or Pages:\
\
```html\
curl "https://graph.facebook.com/v25.0/<BUSINESS_ID>/clients?access_token=<ACCESS_TOKEN>"\
```\
\
## Managing Your Relationship as an Ad Agency Acting on Behalf of Another Business\
\
These APIs allow you to manage the relationship between your ad accounts and the businesses for which you are acting "on behalf of" (OBO). Creating these relationships allows you to access custom audiences for the business and use of the audience overlap tool.\
\
### View OBO request details\
\
#### Example request\
\
```html\
curl -G \\
  -F "access_token=<ACCESS_TOKEN>" \\
"https://graph.facebook.com/v25.0/<OBO_REQUEST_ID>?fields=id,receiving_business,requesting_business,status,business_owned_object"\
```\
\
#### Example response\
\
The response contains the details of the OBO request.\
\
```json\
{\
  "data": [\
    {\
      "id": "1111111111",\
      "receiving_business": {\
        "id": "2222222222",\
        "name": "Example Business Name"\
      },\
      "requesting_business": {\
        "id": "3333333333",\
        "name": "Example Business Name"\
      },\
      "status": "IN_PROGRESS",\
      "business_owned_object": "1111111111"\
    }\
  ]\
}\
```\
\
### Delete OBO requests\
\
#### Example request\
\
To cancel a pending request to act OBO another business:\
\
```html\
curl -X DELETE \\
  -F "access_token=<ACCESS_TOKEN>" \\
"https://graph.facebook.com/v25.0/<OBO_REQUEST_ID>"\
```\
\
#### Example response\
\
```json\
{\
  "success": "true"\
}\
```\
\
### View the status of an ad account's OBO requests\
\
#### Example request\
\
To view the status of requests to act OBO another business for an ad account:\
\
```html\
curl -G \\
  -F "access_token=<ACCESS_TOKEN>" \\
  "https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/onbehalf_requests?\
    fields=id,status,receiving_business,requesting_business&status=<STATUS>"\
```\
\
**Note:** The `<STATUS>` in the request must be `APPROVE`, `DECLINE`, or `IN_PROGRESS`.\
\
\
#### Example response\
\
The response contains an array with the OBO request objects for an ad account matching the requested status.\
\
```json\
{\
  "data": [\
    {\
      "id": "1111111111",\
      "status": "IN_PROGRESS",\
      "receiving_business": {\
        "id": "2222222222",\
        "name": "Example Business Name"\
      },\
      "requesting_business": {\
        "id": "3333333333",\
        "name": "Example Business Name"\
      }\
    }\
  ]\
}\
```\
\
### View OBO requests received from other businesses\
\
#### Example request\
\
To view requests of `IN_PROGRESS` OBO requests sent to your business:\
\
```html\
curl -G \\
  -F "access_token=<ACCESS_TOKEN>" \\
"https://graph.facebook.com/v25.0/<BUSINESS_ID>/received_inprogress_onbehalf_requests"\
```\
\
#### Example response\
\
The response contains the `IN_PROGRESS` OBO request IDs:\
\
```json\
{\
  "data": [\
    {"id": "1111111111"},\
    {"id": "2222222222"},\
    {"id": "3333333333"}\
  ]\
}\
```\
\
### View pending OBO requests sent by your business\
\
#### Example request\
\
To view OBO requests that were sent by your business that are still in the `IN_PROGRESS` state:\
\
```html\
curl -G \\
  -F "access_token=<ACCESS_TOKEN>" \\
"https://graph.facebook.com/v25.0/<BUSINESS_ID>/sent_inprogress_onbehalf_requests"\
```\
\
#### Example response\
\
The response contains the `IN_PROGRESS` OBO request IDs:\
\
```json\
{\
  "data": [\
    {"id": "1111111111"},\
    {"id": "2222222222"},\
    {"id": "3333333333"}\
  ]\
}\
```\
\
## Learn More\
\
- [Reference: Business](https://developers.facebook.com/docs/marketing-api/reference/business)\
- [Business Asset Management](https://developers.facebook.com/docs/marketing-api/businessmanager/assets)\
- [Share Custom Audiences between Business Managers](https://developers.facebook.com/docs/marketing-api/businessmanager/assets/share-custom-audiences)\
\
On This Page\
\
[Business-to-Business Functions](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#business-to-business-functions)\
\
[Request Access to Assets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#request-access-to-assets)\
\
[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples)\
\
[Pending requests](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#pending-requests)\
\
[Grant Access to Assets for Another Business Manager](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#grant-access-to-assets-for-another-business-manager)\
\
[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples-2)\
\
[Remove Access to Assets](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#remove-access-to-assets)\
\
[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples-3)\
\
[View Agency Access](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-agency-access)\
\
[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples-4)\
\
[View Client Access](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-client-access)\
\
[Examples](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#examples-5)\
\
[Managing Your Relationship as an Ad Agency Acting on Behalf of Another Business](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#managing-your-relationship-as-an-ad-agency-acting-on-behalf-of-another-business)\
\
[View OBO request details](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-obo-request-details)\
\
[Delete OBO requests](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#delete-obo-requests)\
\
[View the status of an ad account's OBO requests](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-the-status-of-an-ad-account-s-obo-requests)\
\
[View OBO requests received from other businesses](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-obo-requests-received-from-other-businesses)\
\
[View pending OBO requests sent by your business](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#view-pending-obo-requests-sent-by-your-business)\
\
[Learn More](https://developers.facebook.com/docs/business-management-apis/business-asset-management/guides/business-to-business#learn-more)