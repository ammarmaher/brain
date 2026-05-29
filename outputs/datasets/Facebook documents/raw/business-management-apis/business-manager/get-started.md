---
url: https://developers.facebook.com/docs/business-management-apis/business-manager/get-started
title: Get Started - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fbusiness-manager%2Fget-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)


  - [Get Started](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/business-manager/guides)
  - [Best Practices](https://developers.facebook.com/docs/business-management-apis/business-manager/best-practices)
  - [Support](https://developers.facebook.com/docs/business-management-apis/businessmanager/support)

- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)

On This Page

[Get Started](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#get-started)

[Requirements](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#requirements)

[Create a New Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#business)

[Requirements](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#requirements-2)

[Update Business Managers](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#update)

[Manage People and Roles](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users)

[Invite People](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users-inviting-people)

[People on Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users-getting-list)

[Change Roles](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users-changing-role)

[Remove Users](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users-removing-people)

[Manage Business Assets](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#business-assets)

[Invoices](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#invoice)

[Business Manager Owned Normal Credit Line](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#invoice-bm)

[Month-End Invoicing](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#monthly)

[Funding Source API](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#invoice-funding)

[Dynamic Credit Allocation](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#invoice-dcaf)

# Get Started

Reference Docs

- Reference: [Business](https://developers.facebook.com/docs/marketing-api/reference/business)


To use Business Manager, a business needs at least one page, an admin, a business name, and a valid email address.

The business name is used only for your business and any of other businesses you choose to share objects with. After you create this business, you can add pages, ad accounts, apps, offsite conversion tracking objects, and other ads-related assets that belong to a business.

## Requirements

- Your app needs appropriate [Marketing API Access Level](https://developers.facebook.com/docs/marketing-api/access#limits) to use the Business Manager API. Please note that in some cases your app may require Advanced Access. [Learn more about different access levels](https://developers.facebook.com/docs/graph-api/overview/access-levels/).
- Your app also needs the `business_management` permission.
- Your user also needs the `business_management` permission.

## Create a New Business Manager

Create a new business manager to represent your business. **Only create a new business manager if you are setting up a new business manager for yourself or your clients. If you need another ad account or access to another page, you should use your existing manager and asset permissions. Deleting a business manager is not allowed.**

For example, create a new Business Manager with a `POST`:

```code
curl \
  -F "name=Pomni Media" \
  -F "vertical=ADVERTISING" \
  -F "primary_page=<PAGE_ID>" \
  -F "timezone_id=1" \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<USER_ID>/businesses"
```

### Requirements

To create a business, you need:

- An access token
- A Page ID
- A vertical
- An app-scoped user ID

The Page ID you provide should be the primary page of your business. This page publicly represents your business on Facebook. Whoever creates the business is a manager of this page. If you don't have a page to represent your business on Facebook, [create one](https://www.facebook.com/pages/create/).

To view properties for a business, use its ID. The ID will be a part of the response from the request to create a business manager:

```code
curl "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>?access_token=<ACCESS_TOKEN>"
```

You can also see a list of the business managers you can access:

```code
curl "https://graph.facebook.com/<API_VERSION>/me/businesses?access_token=<ACCESS_TOKEN>"
```

Response fields include:

| Name | Description |
| --- | --- |
| `name`<br>type: string | Name of business |
| `timezone_id`<br>type: int | [ID of the business's timezone](https://developers.facebook.com/docs/marketing-api/reference/ad-account/timezone-ids/) |
| `primary_page`<br>type: JSON object | Object of the primary page associated with this Business Manager.<br>{<br>"category": "App page", <br>"name": "Sample Primary Page", <br>"id": "123456789"<br>} |
| `id`<br>type: long | ID of the Business Manager |
| `update_time`<br>type: string | Last time this Business Manager was updated |
| `updated_by`<br>type: JSON object | Last user, by name and id, who have updated this manager |
| `creation_time`<br>type: string | Time this business created |
| `created_by`<br>type: JSON object | Username and id who created this manager |

## Update Business Managers

Update fields in the business manager using make a `POST` request to `https://graph.facebook.com/{API_VERSION}/{BUSINESS_ID}`. For example, change the business name:

```code
curl \
-F "name=My Actual Business Name" \
-F "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/"
```

Change the business vertical by making the following POST request:

```code
curl \
-F "vertical=RETAIL" \
-F "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/"
```

The vertical is one of these string constants:

- `ADVERTISING`
- `AUTOMOTIVE`
- `CONSUMER_PACKAGED_GOODS`
- `ECOMMERCE`
- `EDUCATION`
- `ENERGY_AND_UTILITIES`
- `ENTERTAINMENT_AND_MEDIA`
- `FINANCIAL_SERVICES`
- `GAMING`
- `GOVERNMENT_AND_POLITICS`
- `MARKETING`
- `ORGANIZATIONS_AND_ASSOCIATIONS`
- `PROFESSIONAL_SERVICES`
- `RETAIL`
- `TECHNOLOGY`
- `TELECOM`
- `TRAVEL`
- `OTHER`

You have these options:

| Name | Description |
| --- | --- |
| `name` | **Required**.<br>The Name of the Business |
| `primary_page` | The ID of the primary page associated with this business manager. |

You can update the primary page by making the following POST request. The primary page has to be owned by business manager.

```code
curl \
  -F "primary_page=<PAGE_ID>" \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/"
```

You can also update all of the above in one POST request:

```code
curl \
  -F "name=My Actual Business Name" \
  -F "vertical=RETAIL" \
  -F "primary_page=<PAGE_ID>" \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/"
```

## Manage People and Roles

There are two types of roles in Business Manager:

| Name | API Constant | Description |
| --- | --- | --- |
| Admin | `ADMIN` | - Can control all aspects of the business including modifying or deleting the account and adding or removing people from the employee list.<br>- Has `READ` and `WRITE` access to all assets that the Business Manager is connected with. |
| Employee | `EMPLOYEE` | - Can see all of information in business settings and be assigned roles by business admins. Cannot make any changes, except to add Pages or ad accounts which this user is an admin of to the business.<br>- Has `READ` access to all assets that the Business Manager is connected with. |

For more information about roles, see [Set up catalog roles in Business Manager](https://www.facebook.com/business/help/1953352334878186).

Initially the creator of the Business is the only user on the Business and is an Admin.

### Invite People

To add your coworkers to your business you must invite them. To invite someone, provide a valid email address that they have access to. **Sending requests to add employees to a business manager is limited. When you reach this limit you will get error code 17, you should resume 24 hours later.**

To invite someone as an admin, send a `POST` request:

```code
curl \
-F "email=some@email.com" \
-F "role=ADMIN" \
-F "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/business_users"
```

To invite someone as an employee, send a `POST` request:

```code
curl \
-F "email=some@email.com" \
-F "role=EMPLOYEE" \
-F "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/business_users"
```

Facebook sends an email invitation to the work email address you specified. The invitee must check the email and follow the signup process. Once they are done, you can see them in your list of Users.

### People on Business Manager

As of v2.11 we have separate endpoints to get users based on their status. Make a `GET` request to retrieve each group of users. To get all business users (Please note that [Advanced Access is required](https://developers.facebook.com/docs/graph-api/overview/access-levels/).):

```code
curl "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/business_users?access_token=<ACCESS_TOKEN>"
```

To get system users, with system-level access:

```code
curl "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/system_users?access_token=<ACCESS_TOKEN>"
```

To get _pending_ users who are invited to access a business, but who have not yet accepted:

```code
curl "https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/pending_users?access_token=<ACCESS_TOKEN>"
```

The endpoints return either active, pending or system users for your Business. For example:

```code
{
  "data": [\
    {\
      "id": "<BUSINESS_ID>",\
      "name": "Alpha MK",\
      "email": "some@email.com",\
      "role": "EMPLOYEE",\
    }\
  ]
}
```

The results for pending users looks like this:

```code
{
  "data": [\
    {\
      "id": "<BUSINESS_ID>",\
      "email": "some@email.com",\
      "role": "EMPLOYEE",\
      "status": "PENDING",\
      "owner": {\
        "id": "USER_ID",\
        "name": "Generic Emporium"\
      }\
    }\
  ]
}
```

Definitions for returned fields are as follows:

| Name | Description |
| --- | --- |
| `id`<br>type: long | ID of this user scoped to this Business. |
| `name`<br>type: string | Name of this user under this Business |
| `business`<br>type: JSON object | Business Manager that this user belongs to |
| `first_name`<br>type: string | First name of this user under this business |
| `last_name`<br>type: string | Last name of user under this business |
| `title`<br>type: string | Title of user under this business |
| `role`<br>type: string | The [role](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users) this person has for this business. `EMPLOYEE` or `ADMIN` |
| `email`<br>type: string | Email address of user |

### Change Roles

To change an **active** user's role on your Business provide the User ID for the user. For example you can upgrade an Employee to the Admin role, with this `POST` request:

```code
curl \
  -F "role=ADMIN" \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_SCOPED_USER_ID>"
```

To change someone from an Admin to the Employee role make a POST request:

```code
curl \
  -F "role=EMPLOYEE" \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_SCOPED_USER_ID>"
```

You can change the role for a **pending user** with this `POST` request:

```code
curl \
  -F "role=EMPLOYEE" \
    -F "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/<API_VERSION>/<PENDING_USER_ID>"
```

### Remove Users

Remove permissions granted to someone based on membership under your business managers. Limit access to ad accounts and pages. If the user has access to ad accounts or pages outside of your Business Manager those permissions do not change. For example, someone may have added themselves or they have access through another business manager

To remove an **active** user from your business make a `DELETE` call:

```code
curl \
  -X DELETE \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<BUSINESS_SCOPED_USER_ID>"
```

To cancel a **pending** user with a `DELETE` request:

```code
curl \
  -X DELETE \
  -F "access_token=<ACCESS_TOKEN>" \
  "https://graph.facebook.com/<API_VERSION>/<PENDING_USER_ID>"
```

This remove the users from your Business and removes access to your Business's assets.

## Manage Business Assets

Reference Docs

- [Business Assets](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/assets/)


Business Assets are the Facebook objects (for example, pages, apps, and so on) that an administrator manages. An administrator can be a user or business, or in the case of apps, a developer or advertiser. The types of Business Assets are:

- Pages
- Accounts
- Apps
- Catalogs
- Facebook pixels

See a sample queries and learn more at [Business Assets](https://developers.facebook.com/docs/marketing-api/business-asset-management/guides/assets/)

## Invoices

Reference Docs

- Reference: [Business Invoices](https://developers.facebook.com/docs/marketing-api/reference/business/business_invoices/)


Business Manager API enables you to view and manage credit sources associated with a business. The API retries all invoices that are visible to a Business Manager. This means all invoices that this Business Manager is liable for are visible via the API, not just the invoices belonging to an individual business ID.

### Business Manager Owned Normal Credit Line

For the Marketing API partners who have invoicing enabled, you can take advantage of Business Manager Owned Normal Credit Line.

Facebook Marketing Partners (FBMP) need to contact their sales rep to get your business manager setup for credit. Please make sure ask for Business Manager Owned Normal Credit Line. Once this is setup, you can start using the ad account creation API to start creating ad accounts. Charges will be against your business manager credit line.

For the ad accounts created via the following API, we will dynamically distribute credit across accounts and update credit limits and spend to avoid hitting the credit limits. You will also be able to see summarized credit available and the amount of credit on each ad account.

Today, we only support normal liability, sequential liability is not
supported. The process for setting this up will remain unchanged.

### Month-End Invoicing

Once your credit line is set up for a business and the business uses it to run ads, we generate month-end invoices for the business account. To see the business invoices, you need a finance role. For normal administrators and employees of a business, you can assign permissions under `People` in Business Manager. You can also assign finance permissions to system users using Business Manager.

To retrieve invoices under a business account using the API, send a `GET` request:

```code
curl -G \
-d "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/business_invoices?start_date=2017-01-01&end_date=2017-04-01"
```

Sample results look like this:

```code
{
  "business_invoices": {
    "data": [\
      {\
        "id": "1659175694099710",\
        "billing_period": "2017-03-01"\
      },\
      {\
        "id": "1303851778395619",\
        "billing_period": "2017-01-01"\
      },\
      {\
        "id": "1415846861611329",\
        "billing_period": "2017-02-01"\
      }\
    ],
    "paging": {
      "cursors": {
        "before": "MAZDZD",
        "after": "MgZDZD"
      }
    }
  },
  "id": "249554531892085"
}
```

You can get invoice details at a campaign level with this request:

```code
curl -G \
-d "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/business_invoices?fields=billed_amount_details,billing_period,entity,id,invoice_id,payment_term,type,campaigns&start_date=2019-06-01&end_date=2019-07-01"
```

The response is similar to this:

```code
{
  "business_invoices": {
    "data": [\
      {\
        "billed_amount_details": {\
          "currency": "USD",\
          "net_amount": "387.70",\
          "tax_amount": "0.00",\
          "total_amount": "387.70"\
        },\
        "billing_period": "2017-03-01",\
        "entity": "FBUS",\
        "id": "1659175694099710",\
        "invoice_id": "22736800",\
        "liability_type": "Normal",\
        "invoice_type": "Invoice",\
        "payment_term": "CUSTOMER",\
        "type": "Invoice",\
        "campaigns": {\
          "data": [\
            {\
              "campaign_id": "6056967798500",\
              "campaign_name": "Nhận ưu đãi",\
              "tags": [\
                "hello2"\
              ],\
              "billed_amount_details": {\
                "currency": "USD",\
                "net_amount": "207.62",\
                "tax_amount": "0.00",\
                "total_amount": "207.62"\
              }\
            },\
            {\
              "campaign_id": "6056958052500",\
              "campaign_name": "Nhận ưu đãi",\
              "billed_amount_details": {\
                "currency": "USD",\
                "net_amount": "180.08",\
                "tax_amount": "0.00",\
                "total_amount": "180.08"\
              }\
              "impressions": 100,\
              "clicks": 50,\
              "conversions": 30\
            }\
          ]\
        }\
      },\
      {\
        "billed_amount_details": {\
          "currency": "USD",\
          "net_amount": "382.99",\
          "tax_amount": "0.00",\
          "total_amount": "382.99"\
        },\
        ......\
    "paging": {\
      "cursors": {\
        "before": "MAZDZD",\
        "after": "MgZDZD"\
      }\
    }\
  },\
  "id": "1515766328651000"\
}\
```\
\
You can also retrieve the additional invoicing fields:\
\
- `invoice_date` \- Date when Facebook generated the invoice\
- `due_date` \- Date the invoice is due\
- `payment_status` \- Shows whether the invoice is `Paid`, `Unpaid`, or `Partially Paid`\
- `amount_due` \- How much money is currently due, and outstanding, on the invoice\
- `download_uri` \- Download a PDF of the invoice at this URI\
\
### Funding Source API\
\
To retrieve the extended credit funding source associated with a business manager, send this GET request.\
\
```code\
curl "https://www.graph.facebook.com/<API_VERSION>/<BUSINESS_ID>/extendedcredits"\
```\
\
To setup a funding source for a business, go to settings section of your business on [Business Manager](https://business.facebook.com/).\
\
### Dynamic Credit Allocation\
\
Dynamic Credit Allocation, also known as DCAF, is our credit allocation system for periodically adjusting available credit on per ad account basis. Our automated script runs approximately every 30 minutes and takes your available credit and evenly distributes it across all your active accounts enabled for DCAF. Available credit includes total approved credit minus total outstanding balance. This helps manage spend at your ad account level and allocate funding for each ad account.\
\
A business can also “inactivate” an invoiced ad account and removing the ad account from the list that needs credit assigned. Businesses no longer need to have Facebook manage this status.\
\
On This Page\
\
[Get Started](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#get-started)\
\
[Requirements](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#requirements)\
\
[Create a New Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#business)\
\
[Requirements](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#requirements-2)\
\
[Update Business Managers](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#update)\
\
[Manage People and Roles](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users)\
\
[Invite People](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users-inviting-people)\
\
[People on Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users-getting-list)\
\
[Change Roles](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users-changing-role)\
\
[Remove Users](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#users-removing-people)\
\
[Manage Business Assets](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#business-assets)\
\
[Invoices](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#invoice)\
\
[Business Manager Owned Normal Credit Line](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#invoice-bm)\
\
[Month-End Invoicing](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#monthly)\
\
[Funding Source API](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#invoice-funding)\
\
[Dynamic Credit Allocation](https://developers.facebook.com/docs/business-management-apis/business-manager/get-started#invoice-dcaf)