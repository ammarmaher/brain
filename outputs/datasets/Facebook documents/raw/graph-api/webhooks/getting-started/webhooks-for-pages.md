---
url: https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/
title: Pages - Webhooks from Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Fgetting-started%2Fwebhooks-for-pages%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Webhooks for Pages](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#webhooks-for-pages)

[Setting Up Your Endpoint and Webhook Product](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#set-up-endpoint-and-product)

[Install Your App](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#install-app)

[Requirements](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#requirements)

[Common Uses](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#common-uses)

[Getting Page Feed Details](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#getting-page-feed-details)

# Webhooks for Pages

Webhooks for [Pages](https://developers.facebook.com/docs/pages) can send you real-time notifications of changes to your Pages. For example, you can receive real-time updates whenever users post to your feed, comment on a post, or like your posts.

To set up a Page Webhook:

1. [Set up your endpoint and configure the Webhooks product](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#set-up-endpoint-and-product).
2. [Install your app](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#install-app) using your Facebook page.

## Setting Up Your Endpoint and Webhook Product

Follow our [Getting Started guide](https://developers.facebook.com/docs/graph-api/webhooks/getting-started) to create your endpoint and configure the Webhooks product. During configuration, make sure to choose the **Page** object and subscribe to one or more of the Pages fields below.

| Field | Description |
| --- | --- |
| `feed` | Notifies you when an Page's feed has changed; posts, reactions, shares, etc. |
| `messages` | Notifies you when your page has received a message via Messenger. See the [Webhooks for Messenger guide](https://developers.facebook.com/docs/messenger-platform/webhook#events) for a list of all available messages webhooks fields |

## Install Your App

Webhook notifications will only be sent if your Page has installed your Webhooks configured-app, and if the Page has not disabled the **App** platform in its [App Settings](https://www.facebook.com/settings?tab=applications). To get your Page to install the app, have your app send a `POST` request to the Page's [subscribed\_apps](https://developers.facebook.com/docs/graph-api/reference/page/subscribed_apps) edge using the Page's acccess token.

### Requirements

- A Page access token requested from a person who can perform the
[`CREATE_CONTENT`, `MANAGE`, or\\
`MODERATE` \\
task](https://developers.facebook.com/docs/pages/overview#tasks) on the Page being queried


- The
[`pages_manage_metadata` \\
and \\
`pages_show_list` \\
permissions](https://developers.facebook.com/docs/pages/overview/permissions-features#permission-dependencies)
are required for the `feed` webhooks

- The [`pages_messaging`](https://developers.facebook.com/docs/pages/overview/permissions-features#permission-dependencies) is also required for the `messages`


For the messages related fields only

- A Page access token requested from a person who can perform the [`MESSAGING` task](https://developers.facebook.com/docs/pages/overview#tasks) on the Page being queried
- [`pages_messaging`](https://developers.facebook.com/docs/permissions/reference/pages_messaging)

#### Sample Request

```code
curl -i -X POST "https://graph.facebook.com/{page-id}/subscribed_apps
  ?subscribed_fields=feed
  &access_token={page-access-token}"

```

#### Sample Response

```js
{
  "success": "true"
}
```

To see which app's your Page has installed, send a `GET` request instead:

#### Sample Request

```html
curl -i -X GET "https://graph.facebook.com/{page-id}/subscribed_apps
  &access_token={page-access-token}
```

#### Sample Response

```js
{
  "data": [\
    {\
      "category": "Business",\
      "link": "https://my-clever-domain-name.com/app",\
      "name": "My Sample App",\
      "id": "{page-id}"\
    }\
  ]
}
```

If your Page has not installed any apps, the API will return an empty data set.

#### Graph API Explorer

If you don't want to install your app programmatically, you can easily do it with the [Graph API Explorer](https://developers.facebook.com/tools/explorer) instead:

1. Select your app in the **Application** dropdown menu. This will return your app's access token.
2. Click the **Get Token** dropdown and select **Get User Access Token**, then choose the `pages_manage_metadata` permission. This will exchange your app token for a User access token with the `pages_manage_metadata` permission granted.
3. Click **Get Token** again and select your Page. This will exchange your User access token for a Page access token.
4. Change the operation method by clicking the `GET` dropdown menu and selecting `POST`.
5. Replace the default `me?fields=id,name` query with the Page's **id** followed by `/subscribed_apps`, then submit the query.

## Common Uses

### Getting Page Feed Details

Your app can subscribe to a Page's Feed and get notified anytime any Feed-related change occurs. For example, here's a notification sent when a User posted to a Page.

#### Sample Webhook Response

```js
[\
  {\
    "entry": [\
      {\
        "changes": [\
          {\
            "field": "feed",\
            "value": {\
              "from": {\
                "id": "{user-id}",\
                "name": "Cinderella Hoover"\
              },\
              "item": "post",\
              "post_id": "{page-post-id}",\
              "verb": "add",\
              "created_time": 1520544814,\
              "is_hidden": false,\
              "message": "It's Thursday and I want to eat cake."\
            }\
          }\
        ],\
        "id": "{page-id}",\
        "time": 1520544816\
      }\
    ],\
    "object": "page"\
  }\
]
```

Use the `post_id` from the notification to [comment on that Page post](https://developers.facebook.com/docs/pages/publishing#comment_on_post).

#### Sample API Request

```curl
curl -i -X POST   "https://graph.facebook.com/{page-post-id}/comments
  ?message=I%20want%20chocolate%20cake%20!
  &access_token=page-access-token"
```

#### Sample API Response

```js
{
  "id": "{comment-id}"
}
```

On This Page

[Webhooks for Pages](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#webhooks-for-pages)

[Setting Up Your Endpoint and Webhook Product](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#set-up-endpoint-and-product)

[Install Your App](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#install-app)

[Requirements](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#requirements)

[Common Uses](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#common-uses)

[Getting Page Feed Details](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages/#getting-page-feed-details)