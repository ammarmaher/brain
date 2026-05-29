---
url: https://developers.facebook.com/docs/fundraiser-api/reporting
title: Reporting - Fundraiser API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Ffundraiser-api%2Freporting%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Fundraiser API](https://developers.facebook.com/docs/fundraiser-api)

- [Learn](https://developers.facebook.com/docs/fundraiser-api/learn)
- [Plan](https://developers.facebook.com/docs/fundraiser-api/plan)
- [Create an app](https://developers.facebook.com/docs/fundraiser-api/create-an-app)
- [Integrate](https://developers.facebook.com/docs/fundraiser-api/integrate)
- [Reporting](https://developers.facebook.com/docs/fundraiser-api/reporting)
- [FAQ](https://developers.facebook.com/docs/fundraiser-api/faq)

On This Page

[Charity Reporting API](https://developers.facebook.com/docs/fundraiser-api/reporting#charity-reporting-api)

[How Does it Work](https://developers.facebook.com/docs/fundraiser-api/reporting#how-does-it-work)

[Generate a Page Access Token](https://developers.facebook.com/docs/fundraiser-api/reporting#generate-a-page-access-token)

[Secure your API calls](https://developers.facebook.com/docs/fundraiser-api/reporting#secure-your-api-calls)

[Generate the Transaction Report](https://developers.facebook.com/docs/fundraiser-api/reporting#generate-the-transaction-report)

[POST /fundraisers/transactions Request](https://developers.facebook.com/docs/fundraiser-api/reporting#post--fundraisers-transactions-request)

[POST /fundraisers/transactions Response](https://developers.facebook.com/docs/fundraiser-api/reporting#post--fundraisers-transactions-response)

[GET {async\_session} Request](https://developers.facebook.com/docs/fundraiser-api/reporting#get--async-session--request)

[GET {async\_session} Response](https://developers.facebook.com/docs/fundraiser-api/reporting#get--async-session--response)

[Retrieve the Transaction Report](https://developers.facebook.com/docs/fundraiser-api/reporting#retrieve-the-transaction-report)

[GET {report\_id} Request](https://developers.facebook.com/docs/fundraiser-api/reporting#get--report-id--request)

[GET {report\_id} Response](https://developers.facebook.com/docs/fundraiser-api/reporting#get--report-id--response)

# Charity Reporting API

Retrieve Facebook transaction reports programmatically

The Charity Reporting API allows you to retrieve your Page's [transaction reports](https://www.facebook.com/help/1787615158233986) programmatically. The data returned is the same found in transaction reports, just in a more convenient JSON format. The list of donations is still grouped by date (meaning that you can only requests donations for a given date or multiple dates) and is returned in chronological order.

For transactions where PayPal Giving Fund collects donations and grants the donated funds to charities, Meta cannot guarantee the accuracy of this data. The reports will not reflect donation payment processing details, including fees which are charged by the third-party payment processing partner, and should be used for informational purposes only. For more detailed information, please reference PayPal Giving Fund materials instead.

## How Does it Work

At a high level, these are the steps you may want to implement to call the API:

1. Generate a non-expiring Page Access Token with the `page_read_donations` permission.
2. Use the token to call the endpoints to generate and read transaction reports.
3. Create a job that runs daily to get the latest report available. At this time, reports are usually available with a two day delay from the date of the donation.
4. Paginate through all transactions to get all data for a given report
5. Store the latest date for which you have data and request reports only for new dates.

For more information on transaction reports' availability and data, please refer to the [Help Center article](https://www.facebook.com/help/586228872977813).

## Generate a Page Access Token

To call the API, you’ll need to use a non-expiring page access token with the `page_read_donations` permission. Page access tokens are generated via the Facebook Login for Business permission dialog. The person granting the permission must be an admin of the charity’s Facebook Page for the relevant page to show up in the permission dialog. You can learn about how to generate a page access token from a user access token here: [https://developers.facebook.com/docs/pages/getting-started](https://developers.facebook.com/docs/pages/getting-started)

An admin of the app and charity's Facebook page can use the [Graph API Explorer](https://developers.facebook.com/tools/explorer) to generate a page access token by selecting the Application from the dropdown list, clicking Get Token, then Get Page Access Token, and following the steps in the dialogs selecting the appropriate charity pages and making sure to select the `page_read_donations` permission.

The page access token will not expire unless the admin revokes access to your app. More information on page access tokens can be found here: [https://developers.facebook.com/docs/pages/access-tokens](https://developers.facebook.com/docs/pages/access-tokens)

## Secure your API calls

In the calls below, you’ll notice a field called appsecret\_proof. Adding the appsecret\_proof parameter adds a level of security by requiring that the call come from your server and requires knowing the app secret. If you're using the official PHP SDK, the appsecret\_proof parameter is automatically added.

Although not required to use the API, we also recommend configuring your app to require appsecret\_proof in all calls from your app by going to your App Dashboard's Advanced tab and check the Require App Secret option. You can find more information on how to secure your app here: [https://developers.facebook.com/docs/graph-api/securing-requests](https://developers.facebook.com/docs/facebook-login/security)

## Generate the Transaction Report

### POST /fundraisers/transactions Request

To trigger the generation of a transaction report, make a `POST` request to `/fundraisers/transactions` with a page access token. Note that you must call this endpoint as an [asyncbatch request](https://developers.facebook.com/docs/graph-api/asynchronous-batch-requests) or the report may not contain any transactions. Note also that some organizations have a lot of transactions, so it is recommended to generate reports for a single day instead of specifying long date ranges. You can do this by specifying the same value for `since` and `until` parameters.

| Field Name | Description | Type |
| --- | --- | --- |
| access\_token | A nonprofit Facebook page admin's Page Access Token with page\_read\_donations permission | string |
| appsecret\_proof | Sha256 hash of the access token using the app secret as the key | string |
| since | UTC midnight timestamp in seconds of the start time of transactions to receive | int |
| until | UTC midnight timestamp in seconds of the end time of transactions to receive | int |

#### Example Request

```code
curl \
  -F 'access_token={ACCESS_TOKEN}' \
  -F 'appsecret_proof={APPSECRET_PROOF}' \
  -F 'asyncbatch=[\
       {\
         "method": "POST",\
         "relative_url": "fundraisers/transactions",\
         "name": "async_session_1",\
         "body": "since=1567814400&until=1567900800"\
       },\
     ]' \
  https://graph.facebook.com
```

### POST /fundraisers/transactions Response

The response contains a list of `async_sessions` with IDs that can be used in subsequent `GET` requests to retrieve the report IDs.

#### Example Response

```json
{
  "async_sessions":[\
    {\
      "id":"111111111111",\
      "name":"async_session_1"\
    },\
  ]
}
```

### GET {async\_session} Request

To use the async session ID from the previous call to get the corresponding report ID, make a `GET` request to `/{async_session_id}` with a page access token. This call can also be [batched](https://developers.facebook.com/docs/graph-api/making-multiple-requests).

#### Example Request

```code
curl -G -X GET \
  -d fields=result \
  -d access_token={ACCESS_TOKEN} \
  'https://graph.facebook.com/{async_session_id}'
```

### GET {async\_session} Response

The response result field contains an `id`, which is the `report_id` to be used in a subsequent `GET` request to retrieve the report.

#### Example Response

```code
{
  "result":"{
    \"id\":\"{report_id}\"
  }",
  "id":"{async_session_id}"
}
```

## Retrieve the Transaction Report

### GET {report\_id} Request

To get the transaction report created by an earlier `POST` request, make a `GET` request to `/{report_id}/transactions` with a page access token and appsecret proof.

| Field Name | Description | Type |
| --- | --- | --- |
| access\_token | A nonprofit Facebook page admin's Page Access Token with page\_read\_donations permission | string |
| appsecret\_proof | Sha256 hash of the access token using the app secret as the key | string |

#### Example Request

```code
curl -G -X GET \
  -d access_token={ACCESS_TOKEN} \
  -d appsecret_proof={APPSECRET_PROOF} \
  'https://graph.facebook.com/{report_id}/transactions'
```

### GET {report\_id} Response

The response will contain a list of transaction objects.

This endpoint supports pagination to get the full list of transactions. Learn more about cursor-based pagination here: [https://developers.facebook.com/docs/graph-api/using-graph-api/#paging](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging)

| Field Name | Description | Type |
| --- | --- | --- |
| id | Graph API ID of the transaction object | numeric string |
| payment\_id | Graph API ID of the payment object | numeric string |
| charge\_time | Unix time the transaction occurred | int |
| charge\_date | Date the transaction occurred in YYYY-MM-DD format | string |
| charge\_action\_type | Type of charge made<br>S - Normal Charge<br>R - Refund<br>C - Chargeback<br>D - Out of Window Chargebacks<br>K - Chargeback Reversal<br>J - Out of Window Chargeback Reversal<br>N - Decline | string |
| donation\_amount\_in\_sender\_currency | Donation amount in the sender’s currency (in cents). This value is available for donations made after Sept 15, 2023. The total donation amount you receive may be less than shown, as the donation amount shown does not reflect any payment processing fees charged by a third party payment processor. | int |
| donation\_amount | Donation amount in the currency of the recipient (in cents). This is an estimate if the payment was processed by a third-party, and does not reflect any payment processing fees. Note: final payout amounts may differ based on currency conversions. | int |
| net\_payout\_amount | Net amount donated to the nonprofit in cents (donation\_amount - facebook\_fee). This value is only returned if the payment was processed by Meta Payments (US & CA) or Facebook Payments (EU). | int |
| payout\_currency | ISO 4127 code of donation\_amount, facebook\_fee, and net\_payout\_amount | string (ISO 4127) |
| sender\_currency | ISO 4127 code of donation\_amount\_in\_sender\_currency. | string (ISO 4127) |
| paypal\_transaction\_id | Transaction ID provided by PayPal identifying this transaction if PayPal was the payment processor for this transaction. | string |
| first\_name | First name of the donor | string |
| last\_name | Last name of the donor | string |
| email | Email of the donor, if provided | string |
| charity\_id | Graph API ID of the charity object | numeric string |
| fundraiser\_id | Graph API ID of the fundraiser object | numeric string |
| fundraiser\_title | Title of the fundraiser | string |
| fundraiser\_owner\_name | Name of the owner of the fundraiser | string |
| permalink\_url | URL of the fundraiser on Facebook | string |
| source\_name | Source of the transaction on Facebook | string |

The fields below are only available in some countries and if the payment was processed by Meta Payments (US & CA) or Facebook Payments (EU).

|  |  |  |
| --- | --- | --- |
| gift\_aid | If the donation is eligible for Gift Aid | boolean |
| donor\_care\_of | Care Of address line of the donor | string |
| donor\_address\_line\_1 | Street address line 1 of the donor | string |
| donor\_address\_line\_2 | Street address line 2 of the donor | string |
| donor\_city | City of the donor | string |
| donor\_state | State of the donor | string |
| donor\_postal\_code | Postal code of the donor | string |
| donor\_country | Country of the donor | string |
| donation\_email\_for\_receipt | Email address for tax purposes, if required | string |
| donation\_country | Donation country for tax purposes, if required | string |

#### Example Response

```json
{
  "data": [\
    {\
      "payment_id": "123456789123456",\
      "charge_time": 1567881064,\
      "charge_date": "2019-09-07",\
      "charge_action_type": "S",\
      "donation_amount": 1224,\
      "facebook_fee": 0,\
      "net_payout_amount": 1224,\
      "payout_currency": "USD",\
      "sender_currency": "GBP",\
      "first_name": "Jane",\
      "last_name": "Doe",\
      "email": "jane.doe@example.com",\
      "charity_id": "112233445566778899",\
      "fundraiser_id": "998877665544332211",\
      "fundraiser_title": "Roger Rabbit's fundraiser to save the world!",\
      "fundraiser_owner_name": "Roger Rabbit",\
      "permalink_url": "https://www.facebook.com/998877665544332211",\
      "source_name": "fundraiser_api",\
      "id": "1002003004005"\
    },\
  ],
  "paging": {
    "cursors": {
      "before": "QVFIUnZA3Y09Ydzg4Tmo3TzdzTnlabF",
      "after": "QVFIUmp6dF9VVlZAERHJHbmRxREhydDW"
    },
    "next": "https://graph.facebook.com/v4.0/*`report_id`*/transactions?after=QVFIUmp6dF9VVlZAERHJHbmRxREhydDW"
  }
}
```

On This Page

[Charity Reporting API](https://developers.facebook.com/docs/fundraiser-api/reporting#charity-reporting-api)

[How Does it Work](https://developers.facebook.com/docs/fundraiser-api/reporting#how-does-it-work)

[Generate a Page Access Token](https://developers.facebook.com/docs/fundraiser-api/reporting#generate-a-page-access-token)

[Secure your API calls](https://developers.facebook.com/docs/fundraiser-api/reporting#secure-your-api-calls)

[Generate the Transaction Report](https://developers.facebook.com/docs/fundraiser-api/reporting#generate-the-transaction-report)

[POST /fundraisers/transactions Request](https://developers.facebook.com/docs/fundraiser-api/reporting#post--fundraisers-transactions-request)

[POST /fundraisers/transactions Response](https://developers.facebook.com/docs/fundraiser-api/reporting#post--fundraisers-transactions-response)

[GET {async\_session} Request](https://developers.facebook.com/docs/fundraiser-api/reporting#get--async-session--request)

[GET {async\_session} Response](https://developers.facebook.com/docs/fundraiser-api/reporting#get--async-session--response)

[Retrieve the Transaction Report](https://developers.facebook.com/docs/fundraiser-api/reporting#retrieve-the-transaction-report)

[GET {report\_id} Request](https://developers.facebook.com/docs/fundraiser-api/reporting#get--report-id--request)

[GET {report\_id} Response](https://developers.facebook.com/docs/fundraiser-api/reporting#get--report-id--response)