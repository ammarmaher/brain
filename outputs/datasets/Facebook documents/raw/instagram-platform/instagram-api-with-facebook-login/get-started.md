---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/
title: Get Started - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-facebook-login%2Fget-started%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)


  - [Get Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started)
  - [Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram)
  - [Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery)
  - [Creator Marketplace API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/creator-marketplace)
  - [Copyright Detection](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection)
  - [Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search)
  - [Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions)
  - [Product Tagging](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/product-tagging)
  - [Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events)
  - [Collaboration](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration)

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

[Getting Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#getting-started)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#before-you-start)

[1\. Configure Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#1--configure-facebook-login-for-business)

[2\. Implement Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#2--implement-facebook-login-for-business)

[3\. Get a User Access Token](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#3--get-a-user-access-token)

[4\. Get the User's Pages](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#4--get-the-user-s-pages)

[5\. Get the Page's Instagram Business Account](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#5--get-the-page-s-instagram-business-account)

[6\. Get the Instagram Business Account's Media Objects](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#6--get-the-instagram-business-account-s-media-objects)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#next-steps)

# Getting Started

This document explains how to successfully call the Instagram API with Facebook Login for Business with your app and get an Instagram Business or Creator Account's media objects. It assumes you are familiar with and how to perform REST API calls. If you do not have an app yet, you can use the [Graph API Explorer](https://developers.facebook.com/tools/explorer) instead and skip steps 1 and 2.

## Before You Start

You will need access to the following:

- An [Instagram Business Account](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F502981923235522&h=AUAkF1dh3lXcBC63UibyfPRK4y67LN9DLE1fZfXMFI3pQRzIzI9S89pU44YUp4OpT-93Rp3XeczvNdrSksdw_YRy0_AsK1PZq3EP5J8RrRfPGSOWUJGNdnTfDVoCMQmxLcVA1d311iq-vg) or [Instagram Creator Account](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F1158274571010880&h=AUCKWt4liy-5HefVAnuLHuMrkTmNPln4bgNiknPpFlUinROqOOKNSWmKV8X8tEv8JprclKud_7cUKCSskwmW_zXJxp91jSVM07loQQQRy0_PXaGuHTw-ZGF9Ue08nO7ON5-Qibl5Fkfiqw)
- A [Facebook Page connected to that account](https://developers.facebook.com/docs/instagram-api/overview#pages)
- A Facebook Developer account that can perform [Tasks on that Page](https://developers.facebook.com/docs/instagram-api/overview#tasks)
- A [registered Facebook App](https://developers.facebook.com/docs/development/register) with **Basic** settings configured

## 1\. Configure Facebook Login for Business

Add the Facebook Login product to your app in the App Dashboard.

You can leave all settings on their defaults. If you are implementing Facebook Login for Business manually (which we don't recommend), enter your `redirect_uri` in the **Valid OAuth redirect URIs** field. If you will be using one of our SDKs, you can leave it blank.

## 2\. Implement Facebook Login for Business

Follow our [Facebook Login for Business documentation](https://developers.facebook.com/docs/facebook-login-for-business) for your platform and implement the login into your app. Set up your implementation to request these permissions:

- [`instagram_basic`](https://developers.facebook.com/docs/apps/review/login-permissions#instagram-basic)
- [`pages_show_list`](https://developers.facebook.com/docs/apps/review/login-permissions#pages-show-list)

## 3\. Get a User Access Token

Once you've implemented Facebook Login for Business, make sure you are signed into your Facebook Developer account, then access your app and trigger the Facebook Login for Business modal. Remember, your Facebook Developer account must be able to perform [Tasks](https://developers.facebook.com/docs/instagram-api/overview#tasks) on the [Facebook Page](https://developers.facebook.com/docs/instagram-api/overview#pages) connected to the Instagram account you want to query.

Once you have triggered the modal, click **OK** to grant your app the `instagram_basic` and `pages_show_list` permissions.

The API should return a User access token. Capture the token so your app can use it in the next few queries. If you are using the Graph API Explorer, it will be captured automatically and displayed in the **Access Token** field for reference:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/57308062_276123556625959_4652658984229011456_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=b6aGdcFyAOoQ7kNvwEzSCDW&_nc_oc=AdpQQxA-btTpb9JQLO4M-9M-MdJjS7EUgZNcGP-Ue5dEBBHg-7FiUvOjb9CyCiPMJxM&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=66KKkXF46jal12xmTszxzA&_nc_ss=7b289&oh=00_Af7OMMYiF9sC--X5AkITP6cpyCobERZ-HUKheW0EhIr-kg&oe=6A24585F)

## 4\. Get the User's Pages

Query the `GET /me/accounts` endpoint (this translates to `GET /{user-id}/accounts`, which perform a `GET` on the Facebook [User](https://developers.facebook.com/docs/graph-api/reference/user) node, based on your access token).

```curl
curl -i -X GET \
 "https://graph.facebook.com/v25.0/me/accounts?access_token={access-token}"
```

This should return a collection of Facebook Pages that the current Facebook User can perform the `MANAGE`, `CREATE_CONTENT`, `MODERATE`, or `ADVERTISE` tasks on:

```json
{
  "data": [\
    {\
      "access_token": "EAAJjmJ...",\
      "category": "App Page",\
      "category_list": [\
        {\
          "id": "2301",\
          "name": "App Page"\
        }\
      ],\
      "name": "Metricsaurus",\
      "id": "134895793791914",  // capture the Page ID\
      "tasks": [\
        "ANALYZE",\
        "ADVERTISE",\
        "MODERATE",\
        "CREATE_CONTENT",\
        "MANAGE"\
      ]\
    }\
  ]
}
```

Capture the ID of the Facebook Page that's connected to the Instagram account that you want to query. Keep in mind that your app users may be able to perform tasks on multiple pages, so you eventually will have to introduce logic that can determine the correct Page ID to capture (or devise a UI where your app users can identify the correct Page for you).

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/57437240_2085096038272793_3947769475595501568_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=aJSg5kAkPzAQ7kNvwFxwsxr&_nc_oc=AdpYvvhey-5T61WlMKrbi5KNGzsJTusmrrU4lCHikCUlcEGKxgbJ4YC3J--NDyQq5TA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=66KKkXF46jal12xmTszxzA&_nc_ss=7b289&oh=00_Af64he5X6tQzYsM3hE4tXAXzjO6DErK3EhyINBw0apFCxg&oe=6A247FC6)

## 5\. Get the Page's Instagram Business Account

Use the Page ID you captured to query the `GET /{page-id}?fields=instagram_business_account` endpoint:

```curl
curl -i -X GET \
 "https://graph.facebook.com/v25.0/134895793791914?fields=instagram_business_account&access_token={access-token}"
```

This should return the [IG User](https://developers.facebook.com/docs/instagram-api/reference/ig-user) — an Instagram Business or Creator Account — that's connected to the Facebook Page.

```json
{
  "instagram_business_account": {
    "id": "17841405822304914"  // Connected IG User ID
  },
  "id": "134895793791914"  // Facebook Page ID
}
```

Capture the [IG User](https://developers.facebook.com/docs/instagram-api/reference/ig-user) ID.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/57462471_316665542380805_102061440998834176_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=V_fwwS6YUq4Q7kNvwFomn-F&_nc_oc=AdpDcvO6zV6ICplitO_9e1JWKH14dy_abN3bHeJgZPu3pgnk8v3yNaOzmyCtFNLNqUM&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=66KKkXF46jal12xmTszxzA&_nc_ss=7b289&oh=00_Af4S8mqKdfdM3okorR1syzkAPFVARlHM-j2OzfxTwYpR9w&oe=6A2464F9)

## 6\. Get the Instagram Business Account's Media Objects

Use the [IG User](https://developers.facebook.com/docs/instagram-api/reference/ig-user) ID you captured to query the `GET /{ig-user-id}/media` endpoint:

```curl
curl -i -X GET \
 "https://graph.facebook.com/v25.0/17841405822304914/media?access_token={access-token}"
```

This should return the IDs of all the [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects on the [IG User](https://developers.facebook.com/docs/instagram-api/reference/ig-user):

```json
{
  "data": [\
    {\
      "id": "17918195224117851"\
    },\
    {\
      "id": "17895695668004550"\
    },\
    {\
      "id": "17899305451014820"\
    },\
    {\
      "id": "17896450804038745"\
    },\
    {\
      "id": "17881042411086627"\
    },\
    {\
      "id": "17869102915168123"\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "QVFIUkdGRXA2eHNNTUs4T1ZAXNGFxQTAtd3U4QjBLd1B2NXRMM1NkcnhqRFdBcEUzSDVJZATFoLWtXMWZAGU2VrRTk2RHVtTVlDckI2NjN0UERFa2JrUk4yMW13",
      "after": "QVFIUmlwbnFsM3N2cV9lZAFdCa0hDeV9qMVliT0VuMmJyNENxZA180c0t6VjFQVEJaTE9XV085aU92OUFLNFB6Szd2amo5aV9rTlVBcnNlWmEtMzYxcE1HSFR3"
    }
  }
}
```

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/57261700_588761411631102_2933352179429277696_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=l6lE2wopBsUQ7kNvwGrokUX&_nc_oc=AdpyQLG1TBaYmLnstJ6_4kSvb1JyHEKy8nP7qLO77wUHXzPZs1TwZUgaH0HaenpauCY&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=66KKkXF46jal12xmTszxzA&_nc_ss=7b289&oh=00_Af4Cfwg8XTMYqTx573pQA8nRakIDwZp8X_XO19I9IhVBCg&oe=6A245CFD)

If you are able to perform this final query successfully, you should be able to perform queries using any of the Instagram Platform endpoints — just refer to our various guides and references to learn what each endpoint can do and what permissions they require.

## Next Steps

- Develop your app further so it can successfully use any other endpoints it needs, and keep track of the permissions each endpoint requires

  - If you plan to implement [Instagram Messaging from Messenger Platform](https://developers.facebook.com/docs/messenger-platform/instagram) you will need additional permissions
- Complete the [App Review](https://developers.facebook.com/docs/instagram-api/overview#app-review) process and request approval for all of the permissions your app will need so your app users can grant them while your app is in [Live Mode](https://developers.facebook.com/docs/development/build-and-test/app-modes#live-mode)
- Switch your app to Live Mode and market it to potential users

Once your app is in Live Mode, any Facebook User who you've made your app available to can access an Instagram Business or Creator Account's data, as long as they have a Facebook User account that can perform Tasks on the Page connected to that Instagram Business or Creator Account.

On This Page

[Getting Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#getting-started)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#before-you-start)

[1\. Configure Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#1--configure-facebook-login-for-business)

[2\. Implement Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#2--implement-facebook-login-for-business)

[3\. Get a User Access Token](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#3--get-a-user-access-token)

[4\. Get the User's Pages](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#4--get-the-user-s-pages)

[5\. Get the Page's Instagram Business Account](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#5--get-the-page-s-instagram-business-account)

[6\. Get the Instagram Business Account's Media Objects](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#6--get-the-instagram-business-account-s-media-objects)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started/#next-steps)