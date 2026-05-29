---
url: https://developers.facebook.com/docs/fundraiser-api/integrate
title: Integrate - Fundraiser API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Ffundraiser-api%2Fintegrate%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Fundraiser API](https://developers.facebook.com/docs/fundraiser-api)

- [Learn](https://developers.facebook.com/docs/fundraiser-api/learn)
- [Plan](https://developers.facebook.com/docs/fundraiser-api/plan)
- [Create an app](https://developers.facebook.com/docs/fundraiser-api/create-an-app)
- [Integrate](https://developers.facebook.com/docs/fundraiser-api/integrate)
- [Reporting](https://developers.facebook.com/docs/fundraiser-api/reporting)
- [FAQ](https://developers.facebook.com/docs/fundraiser-api/faq)

On This Page

[Integrate with Fundraiser API](https://developers.facebook.com/docs/fundraiser-api/integrate#integrate-with-fundraiser-api)

[Create a fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate#create_fundraiser)

[Request Fields](https://developers.facebook.com/docs/fundraiser-api/integrate#request-fields)

[Example Request](https://developers.facebook.com/docs/fundraiser-api/integrate#example-request)

[Response](https://developers.facebook.com/docs/fundraiser-api/integrate#response)

[Example Response](https://developers.facebook.com/docs/fundraiser-api/integrate#example-response)

[Update a fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate#update_fundraiser)

[End a fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate#end_fundraiser)

[Get donations](https://developers.facebook.com/docs/fundraiser-api/integrate#get_donations)

[Request Fields](https://developers.facebook.com/docs/fundraiser-api/integrate#request-fields-2)

[Example Request](https://developers.facebook.com/docs/fundraiser-api/integrate#example-request-2)

[Response Fields](https://developers.facebook.com/docs/fundraiser-api/integrate#response-fields)

[Example Response](https://developers.facebook.com/docs/fundraiser-api/integrate#example-response-2)

[Create and delete external donations](https://developers.facebook.com/docs/fundraiser-api/integrate#external_donations)

[Example Requests](https://developers.facebook.com/docs/fundraiser-api/integrate#example-requests)

[Response](https://developers.facebook.com/docs/fundraiser-api/integrate#response-2)

[Example Response](https://developers.facebook.com/docs/fundraiser-api/integrate#example-response-3)

[Parameters](https://developers.facebook.com/docs/fundraiser-api/integrate#parameters)

[Get real-time donation data](https://developers.facebook.com/docs/fundraiser-api/integrate#webhook)

[Example Request](https://developers.facebook.com/docs/fundraiser-api/integrate#example-request-3)

[FAQ](https://developers.facebook.com/docs/fundraiser-api/integrate#faq)

# Integrate with Fundraiser API

Building your Fundraiser API integration

Graph API endpoints to manage fundraisers on Facebook:

- [/me/fundraisers](https://developers.facebook.com/docs/fundraiser-api/integrate#create_fundraiser) \- Create a fundraiser
- [/{fundraiser-id}](https://developers.facebook.com/docs/fundraiser-api/integrate#update_fundraiser) \- Get or update a fundraiser
- [/{fundraiser-id}/end\_fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate#end_fundraiser) \- End a fundraiser
- [/{fundraiser-id}/donations](https://developers.facebook.com/docs/fundraiser-api/integrate#get_donations) \- Get the list of donations made on Facebook from an existing fundraiser
- [/{fundraiser-id}/external\_donations](https://developers.facebook.com/docs/fundraiser-api/integrate#external_donations) \- Post and delete donations made on the external fundraiser site to keep data in sync with Facebook
- [Webhook subscription](https://developers.facebook.com/docs/fundraiser-api/integrate#webhook) \- Get notified in real-time about donations made on Facebook.

Some endpoints allow you to use the app access token in case the user access token is not valid anymore. For security purposes, you should always make these API calls server side and never embed your app access token in a client. This will help prevent malicious developers from impersonating your app.

## Create a fundraiser

To create a new fundraiser on behalf a user, make a `POST` request to `/me/fundraisers` with a user access token. Making a `GET` request to this endpoint will list all fundraisers created by your app for the given user.

### Request Fields

| Field Name | Description | Type |
| --- | --- | --- |
| `page_id` \[required\] | The Page ID of the charity. You can alternatively use a charity\_id field if you have it. | numeric string |
| `name` \[required\] | Title of the Facebook Fundraiser, can be up to 70 characters long. | string |
| `description` \[required\] | Description of the Facebook Fundraiser, can be up to 50k characters long. | string |
| `goal_amount` \[required\] | Target goal in currency’s smallest unit. Fundraisers currently support only whole values, so for currencies with cents like USD, you must round to an integer number and then multiply by 100 to get the value in cents. For zero-decimal currencies like JPY, simply provide the integer amount without multiplying by 100. | int |
| `currency` \[required\] | The ISO 4127 code of the currency displayed for the goal amount. | string (ISO 4127) |
| `cover_photo` | Cover photo of the fundraiser. Supported file types are JPEG and PNG. | image |
| `end_time` \[required\] | Unix timestamp of when the fundraiser will stop accepting donations. Must be within 5 years from now. | int |
| `external_id` \[required\] | The ID generated by you to identify the fundraiser in your system. | string |
| `fundraiser_type` \[required\] | Must be `person_for_charity`. | string |
| `external_fundraiser_uri` | URI of the fundraiser on the external site. | string |
| `external_event_name` | Name of the event this fundraiser belongs to. | string |
| `external_event_uri` | URI of the event this fundraiser belongs to. | string |
| `external_event_start_time` | Unix timestamp in seconds of the day when the event takes place. | string |

- The user access token must belong to an actual Facebook user. Creating a fundraiser cannot be performed by a test user.
- `goal_amount` must be a positive integers. For currencies with cents like USD, round up the value to an integer and then multiply by 100. For example, $123.45 should be converted to 12400. This is necessary because we only allow users to set goal amounts in whole units. When posting external donations to Facebook, you don't need to round the amount.
- If you don't pass the `cover_photo`, the fundraiser will display a default cover photo.
- To pass the `cover_photo` you need to upload the image as multipart/form-data.
- Facebook converts the `end_time` to 11:59pm in the fundraiser creator's timezone.

### Example Request

```code
curl -X POST -H "Content-Type: application/json" -d '{
  "page_id": 12345,
  "name": "Test Fundraiser",
  "description": "The description for Test Fundraiser",
  "goal_amount": 100000,
  "currency": "USD",
  "end_time": 1501784952,
  "external_id": "ABC123",
  "fundraiser_type": "person_for_charity",
  "external_fundraiser_uri": "https://secure.info-komen.org/site/TR?fr_id=6847&pg=personal&px=123",
  "external_event_name": "2017 Komen DC Race for the Cure",
  "external_event_uri": "https://secure.info-komen.org/site/TR?fr_id=6847&pg=entry",
  "external_event_start_time": 1504970131
}' "https://graph.facebook.com/v2.8/me/fundraisers?access_token=USER_ACCESS_TOKEN"
```

### Response

If the request succeeds, the response object will contain a single field `id` with the unique identifier of the created object.

### Example Response

```code
{
  "id": "1234567"
}
```

## Update a fundraiser

You can edit a fundraiser by issuing a `POST` request to `/{fundraiser-id}` with a user or app access token.

Here are the fields that can be updated: `name`, `description`, `goal_amount`, `end_time`, `external_event_name`, `external_event_start_time`, `external_fundraiser_uri`, `external_event_uri`, `external_id`.

## End a fundraiser

While ending a fundraiser is generally controlled by the user on Facebook, there may be situations where you may need to end all fundraisers to stop receiving donations from Facebook. You can do this by issuing a `POST` request to `/{fundraiser-id}/end_fundraiser` with a user or app access token.

## Get donations

To list all donations made on Facebook send a `GET` request to `/<fundraiser_id>/donations` with a user or app access token. As any other Graph API endpoint, you can user the `fields` parameter to specify a comma separated list of fields you want to the response to contain.

You can also get donations data in real-time by creating a [Webhook subscription](https://developers.facebook.com/docs/fundraiser-api/integrate#webhook).

### Request Fields

| Field Name | Description | Type |
| --- | --- | --- |
| `limit` | Restricts the maximum number of records to get. Must be non-negative. | int |
| `fields` | List of fields to be retrieved for each donation record. The list may contain the following values: amount\_received, currency, donation\_time, donor\_id\_hash, fundraiser, payment\_id. | Comma separated list of strings. |

### Example Request

```code
curl "https://graph.facebook.com/v2.8/<fundraiser_id>/donations?access_token=USER_ACCESS_TOKEN&limit=1&fields=amount_received,donation_time,donor_id_hash,fundraiser,id,currency,payment_id"
```

### Response Fields

The following fields may be included in the response for each object in the `data` array:

| Field Name | Description | Type |
| --- | --- | --- |
| `amount_received` | Donation amount received in cents. | int |
| `currency` | ISO 4127 code of the `amount_received` currency. | string (ISO 4127) |
| `donation_time` | The time when the donation occurred, in ISO 8601 format. | string (ISO 8601) |
| `donor_id_hash` | Hash of the donor ID, unique for the same donor across all fundraisers for a given charity page. | string |
| `payment_id` | Graph API ID of the payment transaction. | numeric string |
| `fundraiser.id` | Graph API ID of the fundraiser object. | numeric string |
| `id` | Graph API ID of the donation object. | numeric string |

### Example Response

```code
{
  "data": [\
    {\
      "amount_received": 500,\
      "donation_time": "2017-03-01T16:03:08+0000",\
      "donor_id_hash": "BA1C...bSA",\
      "fundraiser": {\
        "id": "1234567"\
      },\
      "id": "987654321",\
      "currency": "USD",\
      "payment_id": "135792468"\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "QVFI...FR",
      "after": "QVFI...FR"
    }
  }
}
```

For additional information about the available parameters please check [Graph API Reading](https://developers.facebook.com/docs/graph-api/using-graph-api/#reading)

## Create and delete external donations

To update the counter on the Facebook Fundraiser, you need to let Facebook know about donations happening on your site. You can do this by making a `POST` request to `/<fundraiser_id>/external_donations` with an app access token.

The `amount_received` must be in the same currency that you set when creating the fundraiser. Unlike the `goal_amount`, you should not round this number even though the Fundraiser page does not show cents.

For example, if you pass a donation of $10.20 as `1020`, then the progress UI will show $10. If you then pass another donation of $9.80, the total will correctly be added to show $20.

If you need to delete the donation, issue a `DELETE` request to the Graph API node ID that it was returned to you when creating the donation.

There is no support for updating an existing external donation. If you need to do so, you can delete the external donation and create a new one with the updated information.

### Example Requests

```code
curl -X POST -H "Content-Type: application/json" -d '{
  "amount_received": 4000,
  "currency": "USD",
  "donation_id_hash": "3857768956349",
  "donor_id_hash": "4587387354",
  "donation_time": 1488387995
}' "https://graph.facebook.com/v2.8/<fundraiser_id>/external_donations?access_token=APP_ACCESS_TOKEN"
```

```code
curl -X DELETE "https://graph.facebook.com/v2.8/<external_donation_id>?access_token=APP_ACCESS_TOKEN"
```

### Response

If the `POST` request succeeds, the response will contain a single field `id` with the unique identifier of the new Graph API object. This is the `id` that you can use to delete the external donation.

### Example Response

```code
{
  "id": "9876543"
}
```

### Parameters

| Property Name | Description | Type |
| --- | --- | --- |
| `amount_received` \[required\] | Donation amount received in cents. MUST be non-negative and in the corresponding fundraiser currency, not the currency of the actual donation. | int |
| `currency` \[required\] | This MUST be the currency set in the Fundraiser API, not the currency of the actual donation. ISO 4127 codes only. | string |
| `donation_id_hash` \[required\] | Hash of the donation id on the external fundraiser for de-duplication purposes. This is unique per charity\_id across all fundraisers. | string |
| `donor_id_hash` \[required\] | Hash of the donor ID, unique for the same donor across all fundraisers for a given charity page. | string |
| `donation_time` \[required\] | Unix timestamp of when the donation occurred on your platform. | int |

## Get real-time donation data

To keep donation data in sync on your platform, Facebook can send real-time updates to your servers via a webhook. To do this, create a webhook subscription for the Application object's `fundraiser_donations` field. Refer to the [Webhook documentation](https://developers.facebook.com/docs/graph-api/webhooks/) to learn how to setup a webhook subscription for your app.

Facebook will send an HTTPS POST request to your callback URL when someone makes a donation to a fundraiser created by your app. The body of the request will contain a JSON payload as described in the Webhook documentation, including these donation fields:

| Field Name | Description | Type |
| --- | --- | --- |
| `id` | Graph API ID of the donation object. | numeric string |
| `fundraiser_id` | Graph API ID of the fundraiser object. | numeric string |
| `amount_received` | Donation amount received in cents. | int |
| `currency` | ISO 4127 code of the `amount_received` currency. | string (ISO 4127) |
| `donation_time` | The time when the donation occurred, in ISO 8601 format. | string (ISO 8601) |
| `donor_id_hash` | Hash of the donor ID, unique for the same donor donating more than once to the same fundraiser. | string |
| `payment_id` | Graph API ID of the payment transaction. | numeric string |

### Example Request

```code
[\
  {\
    "object": "application",\
    "entry": [\
      {\
        "id": "9186349565458",\
        "time": 1478311580,\
        "changes": [\
          {\
            "field": "fundraiser_donations",\
            "value": {\
              "id": 1323410515135,\
              "fundraiser_id": 41312314512132,\
              "amount_received": 2000,\
              "currency": "USD",\
              "donation_time": "2019-06-11T16:03:08+0000",\
              "donor_id_hash": "BARDSADm0341341kuv...",\
              "payment_id": 12312312123\
            }\
          }\
        ]\
      }\
    ]\
  }\
]
```

## FAQ

You can find answers to commonly asked questions in our FAQ at [https://developers.facebook.com/docs/fundraiser-api/faq](https://developers.facebook.com/docs/fundraiser-api/faq)

On This Page

[Integrate with Fundraiser API](https://developers.facebook.com/docs/fundraiser-api/integrate#integrate-with-fundraiser-api)

[Create a fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate#create_fundraiser)

[Request Fields](https://developers.facebook.com/docs/fundraiser-api/integrate#request-fields)

[Example Request](https://developers.facebook.com/docs/fundraiser-api/integrate#example-request)

[Response](https://developers.facebook.com/docs/fundraiser-api/integrate#response)

[Example Response](https://developers.facebook.com/docs/fundraiser-api/integrate#example-response)

[Update a fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate#update_fundraiser)

[End a fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate#end_fundraiser)

[Get donations](https://developers.facebook.com/docs/fundraiser-api/integrate#get_donations)

[Request Fields](https://developers.facebook.com/docs/fundraiser-api/integrate#request-fields-2)

[Example Request](https://developers.facebook.com/docs/fundraiser-api/integrate#example-request-2)

[Response Fields](https://developers.facebook.com/docs/fundraiser-api/integrate#response-fields)

[Example Response](https://developers.facebook.com/docs/fundraiser-api/integrate#example-response-2)

[Create and delete external donations](https://developers.facebook.com/docs/fundraiser-api/integrate#external_donations)

[Example Requests](https://developers.facebook.com/docs/fundraiser-api/integrate#example-requests)

[Response](https://developers.facebook.com/docs/fundraiser-api/integrate#response-2)

[Example Response](https://developers.facebook.com/docs/fundraiser-api/integrate#example-response-3)

[Parameters](https://developers.facebook.com/docs/fundraiser-api/integrate#parameters)

[Get real-time donation data](https://developers.facebook.com/docs/fundraiser-api/integrate#webhook)

[Example Request](https://developers.facebook.com/docs/fundraiser-api/integrate#example-request-3)

[FAQ](https://developers.facebook.com/docs/fundraiser-api/integrate#faq)