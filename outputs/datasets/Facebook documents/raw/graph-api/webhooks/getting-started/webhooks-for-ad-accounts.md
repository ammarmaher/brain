---
url: https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts
title: Ad Accounts - Webhooks from Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Fgetting-started%2Fwebhooks-for-ad-accounts%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Webhooks from Meta](https://developers.facebook.com/docs/graph-api/webhooks)

- [Getting Started](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)


  - [Ad Accounts](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts)
  - [Instagram](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-instagram)
  - [Leads](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-leadgen)
  - [Catalogs](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-catalogs)
  - [Messenger](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-messenger)
  - [Pages](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages)
  - [Payments](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-payments)
  - [WhatsApp Business Accounts](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-whatsapp)

- [Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps)
- [Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge)
- [Reference](https://developers.facebook.com/docs/graph-api/webhooks/reference)

On This Page

[Webhooks for Ad Accounts](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#webhooks-for-ad-accounts)

[Before You Begin](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#before-you-begin)

[Endpoint and Webhooks Setup](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#setup)

[Webhook Subscription](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#subscribe)

[Subscribe your app](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#subscribe-your-app)

[Retrieve an ad account's app subscriptions](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#retrieve-an-ad-account-s-app-subscriptions)

[Delete an app's subscriptions](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#delete-an-app-s-subscriptions)

[Subscribe with Graph API Explorer](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#explorer)

# Webhooks for Ad Accounts

Webhooks for ad accounts allow you to get real-time notifications for certain ads changes.

## Before You Begin

1. [Set up your endpoint and configure the Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#setup).
2. [Subscribe your app under your ad account](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#subscribe).

## Endpoint and Webhooks Setup

Follow our [Webhooks Getting Started guide](https://developers.facebook.com/docs/graph-api/webhooks/getting-started) to create your endpoint and configure your webhooks by choosing **Ad Account**.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=249334528266072&version=1766447472)

You can get real-time notifications for ad object status changes by subscribing to one or more fields below.

| Field | Description |
| --- | --- |
| `with_issues_ad_objects` | Notifies you when a campaign, ad set, or ad under the ad account changes to the `WITH_ISSUES` status. |
| `in_process_ad_objects` | Notifies you when a campaign, ad set, or ad is finished processing and exits the `IN_PROCESS` status. |
| `ad_recommendations` | Notifies you when ad recommendations are generated for your ads. |
| `creative_fatigue` | Notifies you when your ad enters or exits fatigue. Provides more granular information with different fatigue levels such as `Low`, `Medium`, and `High`. Only sends notifications for ads that have an `ACTIVE` status. |
| `product_set_issue` | Notifies you when a product set encounters issues that affect your ads. |

See [Post-Processing](https://developers.facebook.com/docs/marketing-api/using-the-api/post-processing/) for more information.

## Webhook Subscription

You need to subscribe your app to webhook notifications for your ad account. You app should have edit permission to the ad account to complete this step. The app should also have `ads_management` permission.

### Subscribe your app

To subscribe your app, send a `POST` request to the `/{ad-account-id}/subscribed_apps` endpoint with the app ID.

#### Example request

```html
curl -i -X POST \
  -d "access_token=<ACCESS_TOKEN>" \
  -d "app_id=<APP_ID>" \
"https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/subscribed_apps"
```

#### Example response

On success, you'll receive this response:

```json
{
  "success": "true"
}
```

### Retrieve an ad account's app subscriptions

To see which of your ad account's apps have subscriptions, send a `GET` request to the `/{ad-account-id}/subscribed_apps` endpoint.

#### Example request

```html
curl -i -X GET \
  -d "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/subscribed_apps"
```

#### Example response

On success, you'll receive this response:

```json
{
  "data":[\
    {\
      "name": "<APP_NAME>",\
      "id": "<APP_ID>"\
    }\
  ]
}
```

### Delete an app's subscriptions

To remove a subscription from an app, send a `DELETE` request to the `/{ad-account-id}/subscribed_apps` endpoint.

#### Example request

```html
curl -X DELETE \
  -d "access_token=<ACCESS_TOKEN>" \
"https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/subscribed_apps"
```

#### Example response

On success, you'll receive this response:

```json
{
  "success": "true"
}
```

## Subscribe with Graph API Explorer

You can also subscribe an app with the [Graph API Explorer](https://developers.facebook.com/tools/explorer).

Replace the `me?fields=id,name` query with `act_<AD_ACCOUNT_ID>/subscribed_apps`. Running this will subscribe the app you have selected in the **Meta App** dropdown menu. Or you can subscribe a different app by specifying `subscribed_apps` as an input parameter with the app Id.

**Note:** The app must have permission to edit the ad account in order to subscribe.

```code
[\
  {\
    "object": "ad_account",\
    "entry": [\
      {\
        "id": "0",\
        "time": 1568132516,\
        "changes": [\
          {\
            "field": "with_issues_ad_objects",\
            "value": {\
              "id": "111111111111",\
              "level": "AD",\
              "error_code": "567",\
              "error_summary": "error summary",\
              "error_message": "error message"\
            }\
          }\
        ]\
      }\
    ]\
  }\
]
```

On This Page

[Webhooks for Ad Accounts](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#webhooks-for-ad-accounts)

[Before You Begin](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#before-you-begin)

[Endpoint and Webhooks Setup](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#setup)

[Webhook Subscription](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#subscribe)

[Subscribe your app](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#subscribe-your-app)

[Retrieve an ad account's app subscriptions](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#retrieve-an-ad-account-s-app-subscriptions)

[Delete an app's subscriptions](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#delete-an-app-s-subscriptions)

[Subscribe with Graph API Explorer](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts#explorer)