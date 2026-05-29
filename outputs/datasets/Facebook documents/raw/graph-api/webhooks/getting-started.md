---
url: https://developers.facebook.com/docs/graph-api/webhooks/getting-started
title: Getting Started - Webhooks from Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Fgetting-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Webhooks from Meta](https://developers.facebook.com/docs/graph-api/webhooks)

- [Getting Started](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
- [Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps)
- [Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge)
- [Reference](https://developers.facebook.com/docs/graph-api/webhooks/reference)

On This Page

[Get started with webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#get-started-with-webhooks)

[Create an endpoint](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#create-an-endpoint)

[Verification Requests](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests)

[Event Notifications](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications)

[Configure webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#configure-webhooks)

[mTLS for Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#mtls-for-webhooks)

[How to configure mTLS](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#how-to-configure-mtls)

[Client Certificate Verification](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#client-certificate-verification)

[Example](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#example)

[Nginx](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#nginx)

[AWS Application Load Balancer (ALB)](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#aws-application-load-balancer--alb-)

[Downloadable CA certificate](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#downloadable-ca-certificate)

[Next Steps](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#next-steps)

# Get started with webhooks

This document explains how to set up a Webhook that will notify you whenever your app's Users publish any changes to their User photos. Once you understand how to set up this Webhook you will know how to set up all Webhooks.

Setting up any Webhook requires you to:

1. [Create an endpoint](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#create-an-endpoint) on a secure server that can process HTTPS requests.
2. [Configure the Webhooks product](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#configure-webhooks) in your app's App Dashboard.

These steps are explained in detail below.

## Create an endpoint

This step must be completed before you can subscribe to any webhook fields in the App Dashboard.

Your endpoint must be able to process two types of HTTPS requests: [Verification Requests](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests) and [Event Notifications](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications). Since both requests use HTTPs, your server must have a valid TLS or SSL certificate correctly configured and installed. Self-signed certificates are not supported.

The sections below explain what will be in each type of request and how to respond to them. Alternatively, you can use our [sample app](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps) which is already configured to process these requests.

### Verification Requests

Anytime you configure the Webhooks product in your App Dashboard, we'll send a `GET` request to your endpoint URL. Verification requests include the following query string parameters, appended to the end of your endpoint URL. They will look something like this:

#### Sample Verification Request

```html
GET https://www.your-clever-domain-name.com/webhooks?
  hub.mode=subscribe&
  hub.challenge=1158201444&
  hub.verify_token=meatyhamhock
```

| Parameter | Sample Value | Description |
| --- | --- | --- |
| `hub.mode` | `subscribe` | This value will always be set to `subscribe`. |
| `hub.challenge` | `1158201444` | An `int` you must pass back to us. |
| `hub.verify_token` | `meatyhamhock` | A string that we grab from the **Verify Token** field in your app's App Dashboard. You will set this string when you complete the [Webhooks configuration settings](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#the-steps) steps. |

**Note:** [PHP converts periods (.) to underscores (\_) in parameter names](https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.php.net%2Fmanual%2Fen%2Flanguage.variables.external.php&h=AUC1qgaUIAay7LYdQpUqLzx4iTaAipjyEYTJYZAP6R2-FfjefOgRMpVhON2x06T297QQwyXm3eBmbJxuGZibuDrbb34dkvJ_uM0Mxk1lkz0dnyxAoA8jiVBw3lgk6jPcBYlGepmgsAYXhg).

#### Validating Verification Requests

Whenever your endpoint receives a verification request, it must:

- Verify that the `hub.verify_token` value matches the string you set in the **Verify Token** field when you [configure the Webhooks product](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#the-steps) in your App Dashboard (you haven't set up this token string yet).
- Respond with the `hub.challenge` value.

If you are in your App Dashboard and configuring your Webhooks product (and thus, triggering a Verification Request), the dashboard will indicate if your endpoint validated the request correctly. If you are using the Graph API's [/app/subscriptions endpoint](https://developers.facebook.com/docs/graph-api/reference/app/subscriptions) to configure the Webhooks product, the API will indicate success or failure with a response.

### Event Notifications

When you configure your Webhooks product, you will subscribe to specific `fields` on an `object` type (e.g., the `photos` field on the `user` object). Whenever there's a change to one of these fields, we will send your endpoint a `POST` request with a JSON payload describing the change.

For example, if you subscribed to the `user` object's `photos` field and one of your app's Users posted a Photo, we would send you a `POST` request that would look something like this:

```html
POST / HTTPS/1.1
Host: your-clever-domain-name.com/webhooks
Content-Type: application/json
X-Hub-Signature-256: sha256={super-long-SHA256-signature}
Content-Length: 311

{
  "entry": [\
    {\
      "time": 1520383571,\
      "changes": [\
        {\
          "field": "photos",\
          "value":\
            {\
              "verb": "update",\
              "object_id": "10211885744794461"\
            }\
        }\
      ],\
      "id": "10210299214172187",\
      "uid": "10210299214172187"\
    }\
  ],
  "object": "user"
}
```

#### Payload Contents

Payloads will contain an object describing the change. When you [configure the webhooks product](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#the-steps), you can indicate if payloads should only contain the names of changed fields, or if payloads should include the new values as well.

We format all payloads with JSON, so you can parse the payload using common JSON parsing methods or packages.

You will not be able to query historical webhook event notification data, so be sure to capture and store any webhook payload content that you want to keep.

Most payloads will contain the following common properties, but the contents and structure of each payload varies depending on the object fields you are subscribed to. Refer to each object's [reference](https://developers.facebook.com/docs/graph-api/webhooks/reference) document to see which fields will be included.

| Property | Description | Type |
| --- | --- | --- |
| `object` | The object's type (e.g., `user`, `page`, etc.) | `string` |
| `entry` | An array containing an object describing the changes. Multiple changes from different objects that are of the same type may be batched together. | `array` |
| `id` | The object's ID | `string` |
| `changed_fields` | An array of strings indicating the names of the fields that have been changed. Only included if you _disable_ the **Include Values** setting when configuring the Webhooks product in your app's App Dashboard. | `array` |
| `changes` | An array containing an object describing the changed fields and their new values. Only included if you _enable_ the **Include Values** setting when configuring the Webhooks product in your app's App Dashboard. | `array` |
| `time` | A UNIX timestamp indicating when the Event Notification was sent (not when the change that triggered the notification occurred). | `int` |

#### Validating Payloads

We sign all Event Notification payloads with a **SHA256** signature and include the signature in the request's `X-Hub-Signature-256` header, preceded with `sha256=`. You don't have to validate the payload, but you should.

To validate the payload:

1. Generate a **SHA256** signature using the payload and your app's **App Secret**.
2. Compare your signature to the signature in the `X-Hub-Signature-256` header (everything after `sha256=`). If the signatures match, the payload is genuine.

#### Responding to Event Notifications

Your endpoint should respond to all Event Notifications with `200 OK HTTPS`.

#### Frequency

Event Notifications are aggregated and sent in a batch with a **maximum** of 1000 updates. However batching cannot be guaranteed so be sure to adjust your servers to handle each Webhook individually.

If any update sent to your server fails, we will retry immediately, then try a few more times with decreasing frequency over the next 36 hours. Your server should handle deduplication in these cases. Unacknowledged responses will be dropped after 36 hours.

Note: The frequency with which Messenger event notifications are sent is different. Please refer to the [Messenger Platform Webhooks documentation](https://developers.facebook.com/docs/messenger-platform/webhook/) for more information.

## Configure webhooks

To learn how to configure webhooks in your app, visit the [Use Case Customization page](https://developers.facebook.com/docs/development/app-customization) for your use case.

## mTLS for Webhooks

Mutual TLS (mTLS) is a method for mutual authentication.

mTLS ensures that the parties at each end of a network connection are who they claim to be by verifying that they both have the correct private key. The information within their respective TLS certificates provides additional verification.

### How to configure mTLS

Once you enable mTLS on your subscription to WhatsApp Business Account, Meta will present a client certificate together with its signing intermediate certificate. Both certificates are used to create a TLS handshake of Webhook requests to your server. Your server then can verify the sender’s identity of these requests by the trust chain and the common name (CN).

The client certificate is signed by a Meta-owned Certificate Authority (CA). Configure your server or load balancer to trust the Meta outbound API CA certificate (meta-outbound-api-ca-2025-12.pem). This certificate replaces the previous DigiCert-signed certificate, which expired on April 15, 2026.

### Client Certificate Verification

After setting up HTTPS for receiving Webhook requests, complete the following steps to verify the client certificate and its common name `client.webhooks.fbclientcerts.com`:

1. Install the Meta outbound API CA certificate
2. Verify the client certificate against the CA certificate
3. Verify the common name (client.webhooks.fbclientcerts.com) of the client certificate

Note: Servers receiving Webhooks must be using HTTPS; and we are always verifying the certificate from your HTTPS server for security.

### Example

Depending on your server’s setup, the above steps vary in details. We illustrate by two examples, one for Nginx and one for AWS Application Load Balancer (ALB).

### Nginx

1. Download the Meta outbound API CA certificate (meta-outbound-api-ca-2025-12.pem) to your server, for example to `/etc/ssl/certs/meta-outbound-api-ca-2025-12.pem`

2. Turn on mTLS by Nginx directives


```
ssl_verify_client          on;
ssl_client_certificate     /etc/ssl/certs/meta-outbound-api-ca-2025-12.pem;
ssl_verify_depth           3;
```

3. Verify the CN from Nginx embedded variable `$ssl_client_s_dn` equals `"client.webhooks.fbclientcerts.com"` (


```
if ($ssl_client_s_dn ~ "CN=client.webhooks.fbclientcerts.com") {
       return 200 "$ssl_client_s_dn";
}
```


### AWS Application Load Balancer (ALB)

1. Download the Meta outbound API CA certificate (meta-outbound-api-ca-2025-12.pem) to an S3 bucket.
2. Configure the HTTPS listener on the ALB to enable mTLS with the trust store containing the Meta CA certificate in the S3 bucket.
3. In your application code, extract the CN from the HTTP header ["X-Amzn-Mtls-Clientcert-Subject"](https://l.facebook.com/l.php?u=https%3A%2F%2Fdocs.aws.amazon.com%2Felasticloadbalancing%2Flatest%2Fapplication%2Fmutual-authentication.html&h=AUBzC9kaK5jPBYM18_cyByocDAUQgeSBkB9cmt6eSbZNri6SbTA49GbxdF6Amxok1PNMBXSgAhxzRcx9MYN7AMAwpwbqo_kqhUVnLIxbwe6vcnevkz3zmP_q0Lpoi9SVpnadHUU_fpp6GA), and verify it equals `"client.webhooks.fbclientcerts.com"`.

### Downloadable CA certificate

[meta-outbound-api-ca-2025-12.pem](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/616047706_1570847757511995_2892285379725429023_n.zip?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=mHRe6jyQTYcQ7kNvwHpCeRi&_nc_oc=AdpQn5zpGxT8XQ3-1mJyCNDyLHtthW13WFbp4lQZQ4qJvrN7dlxDi2TdHDOaLfn3yfY&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ROPs3HtFyS6SatZVN5Zpug&_nc_ss=7b289&oh=00_Af62t1vFF4YswX6vGRV5U9Nsd7Xb_PrPe8zGnsY4R04o3Q&oe=6A2582A5)

## Next Steps

Now that you know how to set up Webhooks, you may want to refer our additional documents that describe the extra steps involved when setting up Webhooks for specific products:

- [Webhooks for Ad Accounts](https://developers.facebook.com/docs/development/create-an-app/marketing-api-use-cases#webhooks--optional-)
- [Webhooks for Instagram](https://developers.facebook.com/docs/development/create-an-app/instagram-use-case#ig-login)
- [Webhooks for Leads](https://developers.facebook.com/docs/development/create-an-app/marketing-api-use-cases#webhooks--optional-)
- [Webhooks for Messenger](https://developers.facebook.com/docs/graph-api/webhooks/docs/development/create-an-app/messenger-use-case#messenger-api-setup)
- [Webhooks for Pages](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages)
- [Webhooks for Payments](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-payments)
- [Webhooks for WhatsApp](https://developers.facebook.com/documentation/business-messaging/whatsapp/webhooks/overview)

On This Page

[Get started with webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#get-started-with-webhooks)

[Create an endpoint](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#create-an-endpoint)

[Verification Requests](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests)

[Event Notifications](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#event-notifications)

[Configure webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#configure-webhooks)

[mTLS for Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#mtls-for-webhooks)

[How to configure mTLS](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#how-to-configure-mtls)

[Client Certificate Verification](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#client-certificate-verification)

[Example](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#example)

[Nginx](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#nginx)

[AWS Application Load Balancer (ALB)](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#aws-application-load-balancer--alb-)

[Downloadable CA certificate](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#downloadable-ca-certificate)

[Next Steps](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#next-steps)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close