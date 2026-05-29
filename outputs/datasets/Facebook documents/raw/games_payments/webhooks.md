---
url: https://developers.facebook.com/docs/games_payments/webhooks
title: Webhooks - Game Payments
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgames_payments%2Fwebhooks%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Game Payments](https://developers.facebook.com/docs/games_payments)

- [Taking Payments](https://developers.facebook.com/docs/games_payments/taking-payments)
- [Payments Lite (serverless)](https://developers.facebook.com/docs/games_payments/payments_lite)
- [Webhooks](https://developers.facebook.com/docs/games_payments/webhooks)
- [Testing](https://developers.facebook.com/docs/games_payments/testing)
- [Reports](https://developers.facebook.com/docs/games_payments/reports)
- [Reference](https://developers.facebook.com/docs/games_payments/reference)

On This Page

[Webhooks for Payments](https://developers.facebook.com/docs/games_payments/webhooks#-webhooks-for-payments-)

[Overview](https://developers.facebook.com/docs/games_payments/webhooks#overview)

[Subscribing to Webhooks](https://developers.facebook.com/docs/games_payments/webhooks#subscribing)

[Subscribing via the App Dashboard](https://developers.facebook.com/docs/games_payments/webhooks#dashboard)

[Testing your settings](https://developers.facebook.com/docs/games_payments/webhooks#testing)

[Subscribing via the Graph API](https://developers.facebook.com/docs/games_payments/webhooks#graph_api)

[Adding and modifying subscriptions](https://developers.facebook.com/docs/games_payments/webhooks#modifying)

[Listing your subscriptions](https://developers.facebook.com/docs/games_payments/webhooks#listing)

[Your Callback Server](https://developers.facebook.com/docs/games_payments/webhooks#callbackserver)

[Subscription Verification](https://developers.facebook.com/docs/games_payments/webhooks#verification)

[Receiving Updates](https://developers.facebook.com/docs/games_payments/webhooks#receiving)

[Responding to Updates](https://developers.facebook.com/docs/games_payments/webhooks#responding)

[Actions](https://developers.facebook.com/docs/games_payments/webhooks#actions)

[Charge](https://developers.facebook.com/docs/games_payments/webhooks#charge)

[Refund](https://developers.facebook.com/docs/games_payments/webhooks#refund)

[Chargeback, Chargeback Reversal and Declines](https://developers.facebook.com/docs/games_payments/webhooks#updates)

[Disputes](https://developers.facebook.com/docs/games_payments/webhooks#disputes)

# Webhooks for Payments

Realtime updates about your transactions.

|     |
| --- |
| Webhooks for Payments (formerly Realtime Updates) are an essential method by which you're informed of changes to orders made through Facebook Payments within your app. |

## Overview

Webhooks are a subscription based system between Facebook and your server. Your app subscribes to receive updates from Facebook via a specified HTTPS endpoint. When an order made within your app is updated, we will issue an HTTPS `POST` request to that endpoint, notifying your server of the change.

There are 3 primary scenarios in which updates are sent to your developer server:

- [Payment Fulfillment](https://developers.facebook.com/docs/games_payments/fulfillment)
- [Refunds, Chargebacks, Chargeback Reversals and Declines](https://developers.facebook.com/docs/games_payments/fulfillment/updates)
- [Disputes](https://developers.facebook.com/docs/games_payments/fulfillment/disputes)

## Subscribing to Webhooks

To subscribe to Payments Webhooks, first create a public endpoint URL that receives both HTTPS `GET` for subscription verification and `POST` for change data requests. The structure of both of these types of requests is described below. Next, set up subscriptions to the `payment` object of your app. There are 2 ways to do this:

- [Subscribing via the App Dashboard](https://developers.facebook.com/docs/games_payments/webhooks#dashboard)
- [Subscribing via the Graph API](https://developers.facebook.com/docs/games_payments/webhooks#graph_api)

In either case, your endpoint will receive the same data in the same manner. See [Your Callback Server](https://developers.facebook.com/docs/games_payments/webhooks#callbackserver) for more information on what your server wiil receive.

### Subscribing via the App Dashboard

The easiest way to set up your app to receive Webhooks updates is to use the [App Dashboard's](https://developers.facebook.com/apps) Payments panel. Find your app in the dashboard and then click on the `Payments` tab. The Webhooks section will be just below your company's Settings section.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/12679464_1709074255999278_1813043975_n.png?_nc_cat=102&ccb=1-7&_nc_sid=34156e&_nc_ohc=kTw-r74pczwQ7kNvwHhpO9B&_nc_oc=AdoT3_zIYEyEciZ3V0Lhj6g96JmxW9E7qBuYcCSYTWs4oJCsSSuR_FGZHYczMk_noEQ&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=Q52UrfEm9m2W3Qp62XhDMw&_nc_ss=7b289&oh=00_Af61nDP-YY0HkTksOruEgMBFfLc0Iaxk0OASldIYoDkseg&oe=6A110D17)

Webhooks for Payments

This screen will then list your app's subscription status, whether it's been added through this panel or the API. From here, it's possible to change the subscription callback URL and test it.

In the 'Callback' field, you must provide a valid publicly accessible server endpoint. This is the address that we will use to both verify the subscription and send the updates, and needs to respond as described in [Your Callback Server](https://developers.facebook.com/docs/games_payments/webhooks#callbackserver).

Finally, provide a 'Verification Token'. This token will be sent only during the enrolling phase to verify that the subscription is being originated from a secure location. This token won't be sent on regular Webhook updates.

### Testing your settings

You should test the callback settings before saving the subscription. This will issue a verification GET request to your endpoint, containing the `hub.mode`, `hub.challenge` and `hub.verify_token` parameters, and will ensure that you handle them correctly. For example, you must be sure your endpoint echoes `hub.challenge` back to Facebook:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/12385813_224525211235230_333457367_n.png?_nc_cat=100&ccb=1-7&_nc_sid=34156e&_nc_ohc=RVZ2C-PkpGgQ7kNvwH7gfGF&_nc_oc=AdoG1-EMcrHmHeBNugXr57pDIDMkShe-OxSRB4XAYHZ1wNEo8Fk3QhnUqVEH_VUsuPo&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=Q52UrfEm9m2W3Qp62XhDMw&_nc_ss=7b289&oh=00_Af4SmJBYYNd9sFvLKXGx14hCnLQdHBzB01eI0N2amA_d3g&oe=6A111DFB)

Testing your settinfs

Once you’ve entered your subscription details, be sure to click the ‘Save Changes’ button at the bottom of the page. Editing a subscription is a simple matter of altering the contents of the fields, re-testing and then saving the form again.

### Subscribing via the Graph API

It's also possible to set up and list subscriptions programmatically, through the Graph API. You'll need your app's `access token`, which is available from the [access token Tool](https://developers.facebook.com/tools/access_token/) or by using the Graph API's `/oauth`endpoint

The Subscription API is available on the `https://graph.facebook.com/[APP_ID]/subscriptions` endpoint

There are 3 tasks you can perform with it:

- Add or modify a subscription (by sending an HTTPS `POST` request)
- List each of your existing subscriptions (by sending an HTTPS `GET` request)

### Adding and modifying subscriptions

To set up a subscription, send a `POST` with the following parameters. Note that these parameters correspond to the fields in the form described above:

- `object` \- As above, the type of the object you want to receive updates about. Specify `payments`.
- `fields` \- A comma-separated list the properties of the object type that you'd like to be updated about changes to. Specify 'actions' and 'disputes'.
- `callback_url` \- A valid, and publicly accessible, server endpoint.
- `verify_token` \- An arbitrary string, sent to your endpoint when the subscription is verified.

When we receive this request, as with the form configuration above, we will perform a `GET` to your callback to ensure that it's valid and ready to receive updates. In particular, you must be sure your endpoint echoes `hub.challenge` back to Facebook.

Note that, because an app can only have one subscription for each object type, if a subscription exists for this object type, then the newly posted data replaces any existing data.

### Listing your subscriptions

Issuing an HTTP `GET` to the Subscription API returns JSON-encoded content that lists your subscriptions. For example:

```code
[\
  {\
    "object": "payments",\
    "callback_url": "https://www.friendsmash.com/rtu.php",\
    "fields": ["actions", "disputes"],\
    "active": true\
  }\
]
```

You can use the [Graph Explorer](https://developers.facebook.com/tools/explorer) to experiment with this API directly, remembering to use your app's [access token](https://developers.facebook.com/tools/access_token/).

## Your Callback Server

Your callback server must handle 2 types of requests. Ensure that it is on a public URL so that we can make these requests successfully.

### Subscription Verification

First, Facebook servers will make a single HTTPS `GET` to your callback URL when you try to add or modify a subscription. A query string will be appended to your callback URL with the following parameters:

| Parameter | Description |
| --- | --- |
| `hub.mode` | The string "`subscribe`" is passed in this parameter |
| `hub.challenge` | A random string |
| `hub.verify_token` | The `verify_token` value you specified when you created the subscription |

The endpoint should first verify the `hub.verify_token`. This ensures that your server knows that the request is being made by Facebook and relates to the subscription you just configured.

It should then echo just the `hub.challenge` value back, which confirms to Facebook that this server is configured to accept callbacks, and prevents denial-of-service (DDoS) vulnerabilities.

Note for PHP developers: In PHP, dots and spaces in query parameter names are converted to underscores automatically. Therefore, you should access these parameters using `$_GET['hub_mode']`,`$_GET['hub_challenge']` and `$_GET['hub_verify_token']` if you are writing your callback endpoint in PHP. See [this note](https://l.facebook.com/l.php?u=https%3A%2F%2Fphp.net%2Fmanual%2Fen%2Flanguage.variables.external.php&h=AUCGRLLigLPAcqvVbK2a-7gzVtPP9i-mz1DFZ2GqbeLTmE-ijAEd3-F3X5URfCRh6I7TFznJYRySdBL3O9IOQGSnt0rQPtxHIo7c9MO4SrXZbEuyqFM6fRusSc9n6MpiTE1DPz3GQwTuZWy78jX0h0RMHd0) in the PHP language manual for more details.

### Receiving Updates

Following a successful subscription, we will proceed to issue an HTTPS `POST` to your server endpoint every time that there are changes (to the chosen fields or connections). You must respond to this request with HTTP code `200`.

Note - we consider any HTTP response other than `200` to be an error. In these circumstances we'll continue to retry sending the webhooks update. If you don't respond correctly therefore, you may receive the same update multiple times.

The request will have content type of `application/json` and the body will comprise a JSON-encoded string containing one or more changes.

**Note for PHP developers**: In PHP, to get the encoded data you'd use the following code:

```code
$data = file_get_contents("php://input");
$json = json_decode($data);`
```

Note that the `hub.mode`, `hub.challenge` and `hub.verify_token` parameters aren't sent again once the subscription has been confirmed.

Here is a typical example of a callback made for a `payments` object subscription:

```code
{
  "object": "payments",
  "entry": [\
    {\
      "id": "296989303750203",\
      "time": 1347996346,\
      "changed_fields": [\
        "actions"\
      ]\
    }\
  ]
}
```

It's important to note that Webhook updates only inform you that a particular payment, [identified by the `id` field](https://developers.facebook.com/docs/reference/api/payment/) has been changed. After receiving the update, you're then required to [query the Graph API](https://developers.facebook.com/docs/games_payments/fulfillment/#orderfulfillment) for details of the transaction, to handle the change appropriately.

Note - While Webhooks for other object types can be batched, payment updates are **never batched**.

You're guaranteed to receive a new update every time a transaction is updated, either by user action or developer action.

If an update to your server fails, we will retry again immediately and then a few times more, with decreasing frequency, over the subsequent 24 hours.

With every request, we send a `X-Hub-Signature-256` HTTP header which contains the SHA256 signature of the request payload, using the app secret as the key, and prefixed with `sha256=`. Your callback endpoint can verify this signature to validate the integrity and origin of the payload.

## Responding to Updates

After your server receives an update, you should [query the Graph API](https://developers.facebook.com/docs/reference/api/payment/) using the `id` field for details on the new status of the transaction. You should then take action depending on the status.

The following sections enumerate all the potential state changes that trigger an update to be sent. These are broadly divided into:

- Changes to the [actions](https://developers.facebook.com/docs/games_payments/fulfillment/updates) array, which occurs when a payment completes asynchronously, a refund is issued (by either you or by Facebook) or when a chargeback occurs.
- Changes to the [disputes](https://developers.facebook.com/docs/games_payments/fulfillment/disputes) array, which occurs when an order dispute is initiated by the consumer.

### Actions

Each `payment` object contains an array titled `actions`, containing the collection of state changes the transaction has progressed through. Each entry in the `actions` array has a property named `type` which describes the type of action that has taken place. `type` can have the following values: `charge`, `refund`,`chargeback`, `chargeback_reversal` and `decline`, which are [fully explained here](https://developers.facebook.com/docs/reference/api/payment/#type_explanation).

A sample response from the Graph API for a payment object with associated actions is below:

```code
{
   "id": "3603105474213890",
   "user": {
      "name": "Marco Alvarez",
      "id": "500535225"
   },
   "application": {
      "name": "Friend Smash",
      "namespace": "friendsmashsample",
      "id": "241431489326925"
   },
   "actions": [\
      {\
         "type": "charge",\
         "status": "completed",\
         "currency": "USD",\
         "amount": "0.99",\
         "time_created": "2013-03-22T21:18:54+0000",\
         "time_updated": "2013-03-22T21:18:55+0000"\
      },\
      {\
         "type": "refund",\
         "status": "completed",\
         "currency": "USD",\
         "amount": "0.99",\
         "time_created": "2013-03-23T21:18:54+0000",\
         "time_updated": "2013-03-23T21:18:55+0000"\
      }\
   ],
   "refundable_amount": {
      "currency": "USD",
      "amount": "0.00"
   },
   "items": [\
      {\
         "type": "IN_APP_PURCHASE",\
         "product": "https://www.friendsmash.com/og/friend_smash_bomb.html",\
         "quantity": 1\
      }\
   ],
   "country": "US",
   "created_time": "2013-03-22T21:18:54+0000",
   "payout_foreign_exchange_rate": 1,}`
```

As you subscribed to the actions field when registering for Webhooks, we will issue an update when the array changes as follows:

### Charge

Initially, all orders contain a charge entry with `"status": "initiated"`. An initiated payment designates the payment was only initiated and hasn't yet fully completed. we won't send updates for payments in an initiated state.

When a payment completes successfully, `"status": "initiated"` will be changed to `"status": "completed"` and we will issue an update. Upon seeing this change you should check your payment records to verify if this is a new or existing transaction and respond as follows:

- If the order is already known to you, and has been fulfilled by the JavaScript callback (preferable as a first-choice), then you can either safely ignore the update, or use it as an extra confirmation.
- If the order is known to you, but exists in an `initiated` state, then you can proceed to fulfill the order, issuing the associated virtual item or currency to the consumer. This payment can then safely be marked as complete.
- If the order is unknown, it indicates that the client-side flow didn't complete, most likely due to a connectivity issue or the consumer closing their browser mid-checkout. You can still safely fulfill and complete this order, because Facebook remains the ultimate source of truth regarding user billing.

You'll also receive updates for payments with `"status": "failed"`. These should not be fulfilled.

### Refund

Whenever you [issue a refund via the Graph API](https://developers.facebook.com/docs/games_payments/fulfillment/disputes), you'll receive an update. As with `"type": "charge"`, a refund can also have a varying status of which you must be aware. Most notably, it's possible for a refund to fail, typically due to a processing or connectivity error - in which case you should retry to issue the refund.

### Chargeback, Chargeback Reversal and Declines

As with refunds, you'll also be notified when a chargeback, chargeback reversal or decline has been issued. A chargeback, chargeback reversal or decline object will be added to the actions array of the Graph API return data for the payment.

### Disputes

We will notify you by issuing an update when a dispute is initiated. In this case, you'll see a new`"disputes"` array appear as part of the `payment` object. The array will contain the time the dispute was initiated, the consumer's reason for initiated the response and the consumer's email address, which you can use to contact them directly to resolve the dispute.

A full sample response from the Graph API for a disputed transaction is below:

```code
{
   "id": "990361254213890",
   "user": {
      "name": "Marco Alvarez",
      "id": "500535225"
   },
   "application": {
      "name": "Friend Smash",
      "namespace": "friendsmashsample",
      "id": "241431489326925"
   },
   "actions": [\
      {\
         "type": "charge",\
         "status": "completed",\
         "currency": "USD",\
         "amount": "0.99",\
         "time_created": "2013-03-22T21:18:54+0000",\
         "time_updated": "2013-03-22T21:18:55+0000"\
      }\
   ],
   "refundable_amount": {
      "currency": "USD",
      "amount": "0.99"
   },
   "items": [\
      {\
         "type": "IN_APP_PURCHASE",\
         "product": "https://www.friendsmash.com/og/friend_smash_bomb.html",\
         "quantity": 1\
      }\
   ],
   "country": "US",
   "created_time": "2013-03-22T21:18:54+0000",
   "payout_foreign_exchange_rate": 1,
   "disputes": [\
      {\
         "user_comment": "I didn't receive my item! I want a refund, please!",\
         "time_created": "2013-03-24T18:21:02+0000",\
         "user_email": "email\u0040domain.com",\
         "status": "resolved",\
         "reason": "refunded_in_cash"\
      }\
   ]
}
```

For more information on how to respond to disputes and issue refunds, please see [Payments How-to: Handling Disputes and Refunds](https://developers.facebook.com/docs/games_payments/fulfillment/updates).

On This Page

[Webhooks for Payments](https://developers.facebook.com/docs/games_payments/webhooks#-webhooks-for-payments-)

[Overview](https://developers.facebook.com/docs/games_payments/webhooks#overview)

[Subscribing to Webhooks](https://developers.facebook.com/docs/games_payments/webhooks#subscribing)

[Subscribing via the App Dashboard](https://developers.facebook.com/docs/games_payments/webhooks#dashboard)

[Testing your settings](https://developers.facebook.com/docs/games_payments/webhooks#testing)

[Subscribing via the Graph API](https://developers.facebook.com/docs/games_payments/webhooks#graph_api)

[Adding and modifying subscriptions](https://developers.facebook.com/docs/games_payments/webhooks#modifying)

[Listing your subscriptions](https://developers.facebook.com/docs/games_payments/webhooks#listing)

[Your Callback Server](https://developers.facebook.com/docs/games_payments/webhooks#callbackserver)

[Subscription Verification](https://developers.facebook.com/docs/games_payments/webhooks#verification)

[Receiving Updates](https://developers.facebook.com/docs/games_payments/webhooks#receiving)

[Responding to Updates](https://developers.facebook.com/docs/games_payments/webhooks#responding)

[Actions](https://developers.facebook.com/docs/games_payments/webhooks#actions)

[Charge](https://developers.facebook.com/docs/games_payments/webhooks#charge)

[Refund](https://developers.facebook.com/docs/games_payments/webhooks#refund)

[Chargeback, Chargeback Reversal and Declines](https://developers.facebook.com/docs/games_payments/webhooks#updates)

[Disputes](https://developers.facebook.com/docs/games_payments/webhooks#disputes)