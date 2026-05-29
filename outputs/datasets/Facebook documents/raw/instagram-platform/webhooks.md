---
url: https://developers.facebook.com/docs/instagram-platform/webhooks/
title: Webhooks - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Fwebhooks%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)


  - [Instagram Post Shares: New Attachment Type and Transition Period](https://developers.facebook.com/docs/instagram-platform/webhooks/new)
  - [Examples](https://developers.facebook.com/docs/instagram-platform/webhooks/examples)

- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)
- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [Comment Moderation](https://developers.facebook.com/docs/instagram-platform/comment-moderation)
- [Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies)
- [Insights](https://developers.facebook.com/docs/instagram-platform/insights)
- [Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed)
- [Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories)
- [oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed)
- [Embed Button](https://developers.facebook.com/docs/instagram-platform/embed-button)
- [Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging)
- [API Reference](https://developers.facebook.com/docs/instagram-platform/reference)
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Setup Webhooks Subscriptions](https://developers.facebook.com/docs/instagram-platform/webhooks/#setup-webhooks-subscriptions)

[Requirements](https://developers.facebook.com/docs/instagram-platform/webhooks/#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/webhooks/#limitations)

[Create an endpoint](https://developers.facebook.com/docs/instagram-platform/webhooks/#create-an-endpoint)

[Verification Requests](https://developers.facebook.com/docs/instagram-platform/webhooks/#verification-requests)

[Event Notifications](https://developers.facebook.com/docs/instagram-platform/webhooks/#event-notifications)

[Enable Subscriptions](https://developers.facebook.com/docs/instagram-platform/webhooks/#enable-subscriptions)

[Subscribe to webhook fields](https://developers.facebook.com/docs/instagram-platform/webhooks/#fields)

[mTLS for Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks/#mtls-for-webhooks)

[How to configure mTLS](https://developers.facebook.com/docs/instagram-platform/webhooks/#how-to-configure-mtls)

[Client Certificate Verification](https://developers.facebook.com/docs/instagram-platform/webhooks/#client-certificate-verification)

[Example](https://developers.facebook.com/docs/instagram-platform/webhooks/#example)

[Nginx](https://developers.facebook.com/docs/instagram-platform/webhooks/#nginx)

[AWS Application Load Balancer (ALB)](https://developers.facebook.com/docs/instagram-platform/webhooks/#aws-application-load-balancer--alb-)

[Downloadable CA certificate](https://developers.facebook.com/docs/instagram-platform/webhooks/#downloadable-ca-certificate)

[Test setup](https://developers.facebook.com/docs/instagram-platform/webhooks/#test-setup)

[Next steps](https://developers.facebook.com/docs/instagram-platform/webhooks/#next-steps)

[See also](https://developers.facebook.com/docs/instagram-platform/webhooks/#see-also)

# Setup Webhooks Subscriptions

This document shows you how to create an endpoint on your server to receive webhook notifications from Meta and subscribe to webhook fields for an Instagram professional account using your app. This allows you to receive real-time notifications whenever someone comments on the Media objects of the Instagram professional account using your app, @mentions your app users, when your app users' Stories expire, or when a Instagram user sends a message to that Instagram professional account.

## The steps

The steps required to receive webhook notifications are as follows:

- **Step 1.** [Create an endpoint](https://developers.facebook.com/docs/instagram-platform/webhooks/#create-an-endpoint)on your server to receive webhooks from Meta


  - Verify requests from Meta – Occurs in the Meta App Dashboard
  - Accept and validate JSON payloads from Meta – Occurs on your server
- **Step 2.** Subscribe your app to webhook fields – Occurs in the Meta App Dashboard
- **Step 3.** Enable your app user's Instagram professional account to receive notifications via an API call to Meta
- **Step 4.** Test the setup by sending a message to your Instagram professional account.

### Sample app on Github

We provide a
[sample app on GitHub](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Fgraph-api-webhooks-samples&h=AUB2oxNiP5QZiwUnlNcngfIcpmq0sueSg2adw8ugsPeTNrmTLZP2SwvRZx0I0l1Hs5YUHRsG-ZpcAoMFUn9I3jzvwd0pgNSlzKaUfABoOfNYDwrl5L-3x9t3FG7NCbF28k2Yaxb-BK4Gxw)
that deploys on
[Heroku](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.heroku.com%2F&h=AUDw7Jj62zvHNDtGWekZIaGYfAbHPeip8aXjgDvxM0iPWFZPwsr2PpUIbcm7O_7huz_FNTLoWM_wGDC8Q3gVFYC-F5x4VpXV0_GH3tlnsMzDDIG_g79rEm_9s4v6oQMF5fa0kz3wIzOUNw)
which you can set up and repurpose, or which you can use to quickly test your Webhooks configuration.


You need the following:

- A free Heroku account,
- Your app's App Secret found on Meta App Dashboard **App settings > Basic**
- A Verify token which is a string. In your Heroku app's settings, set up two config vars: `APP_SECRET` and `TOKEN`. Set `APP_SECRET` to your app's App Secret and `TOKEN` to your password. We will include this string in any verification requests when you configure the Webhooks product in the App Dashboard (the app will validate the request on its own).

- View your Heroku app in a web browser. You should see an empty array (`[]`). This page will display newly received update notification data, so reload it throughout testing.

- Your app's Callback URL will be your Heroku app's URL with `/facebook` added to the end. You will need this Callback URL during product configuration.
- Copy the `TOKEN` value you set above; you'll also need this during product configuration.

#### What's in the Heroku sample app?

The app uses Node.js and these packages:

- `body-parser` (for parsing JSON)
- `express` (for routes)
- `express-x-hub` (for SHA1 support)

## Verifying the Sample App

You can easily verify that your sample app can receive Webhook events.

1. Under the **Webhooks** product in your App Dashboard, click the **Test** button for any of the Webhook fields.
2. A pop-up dialog will appear showing a sample of what will be sent. Click **Send to My Server**.
3. You should now see the Webhook information at the Heroku app's URL, or use `curl https://<your-subdomain>.herokuapp.com` in a terminal window.

## Requirements

You will need:

- Your app must be set to **Live** in the App Dashboard for Meta to send webhook notifications

| Component | Business Login for Instagram | Facebook Login for Business | Instagram Messaging via Messenger Platform |
| --- | --- | --- | --- |
| **Access level** | Advanced Access | Advanced Access for `comments` and `live_comments` | Advanced Access |
| **Access tokens** | Instagram User access token | Facebook User or Page access token | Facebook User or Page access token |
| **Business Verification** | Required | Required | Required |
| **Base URL** | `graph.instagram.com` | `graph.facebook.com` | `graph.facebook.com` |
| **Endpoints** | [`/<INSTAGRAM_ACCOUNT_ID>`](https://developers.facebook.com/docs/instagram-api/reference/ig-user) or `/me` – Represents your app user's Instagram profession account | [`/<PAGE_ID>`](https://developers.facebook.com/docs/instagram-api/reference/ig-user) or `/me` – Represents the Facebook Page linked to your app user's Instagram professional account | [`/<PAGE_ID>`](https://developers.facebook.com/docs/instagram-api/reference/ig-user) or `/me` – Represents the Facebook Page linked to your app user's Instagram professional account |
| **IDs** | The ID of your app user's Instagram professional account | The ID of the Facebook Page linked to your app user's Instagram professional account | The ID of the Facebook Page linked to your app user's Instagram professional account |
| **Basic Permission** | `instagram_business_basic` | `instagram_basic` | `instagram_basic` |
| **Field Specific Permissions** | Refer the [Instagram fields table](https://developers.facebook.com/docs/instagram-platform/webhooks/#fields) | Refer the [Instagram fields table](https://developers.facebook.com/docs/instagram-platform/webhooks/#fields) | Refer the [Instagram fields table](https://developers.facebook.com/docs/instagram-platform/webhooks/#fields) |

### Limitations

- Apps must be set to **Live** in the App Dashboard to receive webhook notifications.


- Advanced Access is required to receive `comments` and `live_comments` webhook notifications.


- The Instagram professional account that owns the media objects
[must be public to receive notifications for comments or @mentions.](https://www.facebook.com/help/instagram/448523408565555)

- Notifications for Comments on
[Live media](https://developers.facebook.com/docs/instagram-api/reference/ig-media)
are only sent during the live broadcast.


- Account level webhooks customization is not supported. If your app user is subscribed to any Instagram webhook field, your app receives notifications for all fields the app is subscribed to.


- Album IDs are not included in webhook notifications. Use the Comment ID received in the notification to get the album ID.



- The ad ID will not be returned for media used in dynamic ads.


- Notifications for `story_insights` events will only show metrics for the first 24 hours, before the story expires, even if the story is a highlight.



## Create an endpoint

This step must be completed before you can subscribe to any webhook fields in the App Dashboard.

Your endpoint must be able to process two types of HTTPS requests: [Verification Requests](https://developers.facebook.com/docs/instagram-platform/webhooks/#verification-requests) and [Event Notifications](https://developers.facebook.com/docs/instagram-platform/webhooks/#event-notifications). Since both requests use HTTPs, your server must have a valid TLS or SSL certificate correctly configured and installed. Self-signed certificates are not supported.

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
| `hub.verify_token` | `meatyhamhock` | A string that we grab from the **Verify Token** field in your app's App Dashboard. You will set this string when you complete the [Webhooks configuration settings](https://developers.facebook.com/docs/instagram-platform/webhooks/#the-steps) steps. |

**Note:** [PHP converts periods (.) to underscores (\_) in parameter names](https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.php.net%2Fmanual%2Fen%2Flanguage.variables.external.php&h=AUAz1DpbelBjL5NTrZVV71Wo13DPs-JPc8tMw677A56DtzHijtfRFogMQdUdKVKt8kVSj9TU9DWKKxqpgd__VdgOujY94GgFQJAgR2MtimP4ICaGzKvKRuLk1xcQemVUUGe8RCGFF9o81g).

#### Validating Verification Requests

Whenever your endpoint receives a verification request, it must:

- Verify that the `hub.verify_token` value matches the string you set in the **Verify Token** field when you [configure the Webhooks product](https://developers.facebook.com/docs/instagram-platform/webhooks/#the-steps) in your App Dashboard (you haven't set up this token string yet).
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

Payloads will contain an object describing the change. When you [configure the webhooks product](https://developers.facebook.com/docs/instagram-platform/webhooks/#the-steps), you can indicate if payloads should only contain the names of changed fields, or if payloads should include the new values as well.

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

## Enable Subscriptions

Your app must enable subscriptions by sending a `POST` request to the `/me/subscribed_apps` endpoint with the `subscribed_fields` parameter set to a comma-separated list of webhooks fields.

#### Request Syntax

_Formatted for readability._

```http
POST /me/subscribed_apps
  ?subscribed_fields=<LIST_OF_WEBHOOK_FIELDS>
  &<ACCESS_TOKEN>
```

#### Request Parameters

| Value Placeholder | Value Description |
| --- | --- |
| `/me` | Represents your app user's Instagram professional account ID or the Facebook Page ID that is linked to your app user's Instagram professional account |
| `<ACCESS_TOKEN>` | App user's Instagram User access token or Facebook Page access token. |
| `<LIST_OF_WEBHOOK_FIELDS>` | A comma-separated list of webhook fields that your app is subscribed to. |

#### Example Request

_Formatted for readability._

```curl
curl -i -X POST \
  "https://graph.instagram.com/v25.0/1755847768034402/subscribed_apps
  ?subscribed_fields=comments,messages
  &access_token=EAAFB..."
```

On success, your app receives a JSON response with `success` set to `true`.

```json
{
  "success": true
}
```

## Subscribe to webhook fields

You can subscribe to the following fields to receive notifications for events that take place on Instagram.

| Instagram Webhook field | Instagram API setup with Instagram Login permissions | Instagram API setup with Facebook Login permissions | Instagram Messaging API <br> (Messenger Platform) permissions |
| --- | --- | --- | --- |
| `comments` | - `instagram_business_basic`<br>- `instagram_business_manage_comments` | - `instagram_basic`<br>- `instagram_manage_comments`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` | x |
| `live_comments` | - `instagram_business_basic`<br>- `instagram_business_manage_comments` | - `instagram_basic`<br>- `instagram_manage_comments`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` | x |
| `mentions` | Included in the `comments` webhook notification | - `instagram_basic`<br>- `instagram_manage_comments`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` | x |
| `message_echoes` | - `instagram_business_basic`<br>- `instagram_business_manage_comments` | x | Included in the `messages` webhook notification |
| `message_reactions` | - `instagram_business_basic`<br>- `instagram_business_manage_messages` | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `messages` | - `instagram_business_basic`<br>- `instagram_business_manage_messages` | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `messaging_handover` | - `instagram_business_basic`<br>- `instagram_business_manage_messages` | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `messaging_optins` | - `instagram_business_basic`<br>- `instagram_business_manage_messages` | x | x |
| `messaging_policy_enforcement` | x | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `messaging_postbacks` | - `instagram_business_basic`<br>- `instagram_business_manage_messages` | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `messaging_referral` | - `instagram_business_basic`<br>- `instagram_business_manage_messages` | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `messaging_seen` | - `instagram_business_basic`<br>- `instagram_business_manage_messages` | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `response_feedback` | x | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `standby` | - `instagram_business_basic`<br>- `instagram_business_manage_messages` | x | - `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` |
| `story_insights` | x | - `instagram_basic`<br>- `instagram_manage_insights`<br>- `pages_manage_metadata`<br>- `pages_read_engagement`<br>- `pages_show_list` | x |

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
3. In your application code, extract the CN from the HTTP header ["X-Amzn-Mtls-Clientcert-Subject"](https://l.facebook.com/l.php?u=https%3A%2F%2Fdocs.aws.amazon.com%2Felasticloadbalancing%2Flatest%2Fapplication%2Fmutual-authentication.html&h=AUB80NHLsjxe1wL-wv6nE-NHtJR9Wm2R3dH6hVMpia8WRo8rMXm7Wj98k9GhRy5jvog6pt68KtjcOcn_5qnylezI1_BkJQ-OXV8HzCKaUh0plnUfvwuuI_Hop0pDLKVhuyM6raOXfuowSQ), and verify it equals `"client.webhooks.fbclientcerts.com"`.

### Downloadable CA certificate

[meta-outbound-api-ca-2025-12.pem](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/616047706_1570847757511995_2892285379725429023_n.zip?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=mHRe6jyQTYcQ7kNvwG67DqK&_nc_oc=AdpYClAb8LuKgsGjwPlLk35zIFOjkptQpYY45dejWiHjSRUgx3rPnN8xLjXRsqhxvIw&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=iWQDPSf5IecQFERdIkU5qA&_nc_ss=7b289&oh=00_Af7we6SFVIqkbYWD-Ca8HGlQ0pFKxFe6t_YL2SEP1XtrMw&oe=6A24A1A5)

## Test setup

1. Send your Instagram professional account a test message (the public account added in the Meta App Dashboard for testing). This should trigger a `messages` webhook event. The notification should contain the `recipient.id`, set to your Instagram professional account's Instagram-scoped ID, and the `is_echo` and `is_self` properties, both set to `true`, within the `messaging` array.
2. Send a response to your Instagram-scoped ID using the API.

## Next steps

Learn how to [send and receive messages from Instagram professional accounts](https://developers.facebook.com/docs/instagram/messaging-api)

## See also

- [Webhooks from Meta \| Developer Documentation](https://developers.facebook.com/docs/graph-api/webhooks)


On This Page

[Setup Webhooks Subscriptions](https://developers.facebook.com/docs/instagram-platform/webhooks/#setup-webhooks-subscriptions)

[Requirements](https://developers.facebook.com/docs/instagram-platform/webhooks/#requirements)

[Limitations](https://developers.facebook.com/docs/instagram-platform/webhooks/#limitations)

[Create an endpoint](https://developers.facebook.com/docs/instagram-platform/webhooks/#create-an-endpoint)

[Verification Requests](https://developers.facebook.com/docs/instagram-platform/webhooks/#verification-requests)

[Event Notifications](https://developers.facebook.com/docs/instagram-platform/webhooks/#event-notifications)

[Enable Subscriptions](https://developers.facebook.com/docs/instagram-platform/webhooks/#enable-subscriptions)

[Subscribe to webhook fields](https://developers.facebook.com/docs/instagram-platform/webhooks/#fields)

[mTLS for Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks/#mtls-for-webhooks)

[How to configure mTLS](https://developers.facebook.com/docs/instagram-platform/webhooks/#how-to-configure-mtls)

[Client Certificate Verification](https://developers.facebook.com/docs/instagram-platform/webhooks/#client-certificate-verification)

[Example](https://developers.facebook.com/docs/instagram-platform/webhooks/#example)

[Nginx](https://developers.facebook.com/docs/instagram-platform/webhooks/#nginx)

[AWS Application Load Balancer (ALB)](https://developers.facebook.com/docs/instagram-platform/webhooks/#aws-application-load-balancer--alb-)

[Downloadable CA certificate](https://developers.facebook.com/docs/instagram-platform/webhooks/#downloadable-ca-certificate)

[Test setup](https://developers.facebook.com/docs/instagram-platform/webhooks/#test-setup)

[Next steps](https://developers.facebook.com/docs/instagram-platform/webhooks/#next-steps)

[See also](https://developers.facebook.com/docs/instagram-platform/webhooks/#see-also)