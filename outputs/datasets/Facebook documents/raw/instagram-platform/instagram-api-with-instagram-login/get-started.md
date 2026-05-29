---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/
title: Get started - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-instagram-login%2Fget-started%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)


  - [Migration Guide](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide)
  - [Business Login for Instagram](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/business-login)
  - [Get started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started)
  - [Messaging](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/messaging-api)
  - [Welcome message ads](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/welcome-message-ads)
  - [Conversations API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/conversations-api)
  - [Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/mentions)

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

[Get Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#get-started)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#before-you-start)

[Get an access token](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#get-an-access-token)

[Get the app user ID & username](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#get-the-app-user-id---username)

[Example request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#example-request)

[Fields](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#fields)

[Get an app user's media objects](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#posts)

[Example request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#example-request-2)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#next-steps)

# Get Started

This document explains how to make your first call using the Instagram API with Instagram Login to obtain information about your Instagram professional account, including your User ID, username, and media objects.

## Before You Start

This guide assumes you have read the [Instagram Platform Overview](https://developers.facebook.com/docs/instagram-platform/overview) and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

If your current Meta app type is **not** a Business type app you will need to create a new app and [select **Business** during the creation process.![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH0nu_S&_nc_oc=AdoqbGC9JMVlkKK9-cIZRXtbZJzRUlBkUwWfRrdNLWtfrLJ79L6A1r143B6ZoaJaad0&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=a2SAkXL-tcVG39ItQb7XIg&_nc_ss=7b289&oh=00_Af6Yy_EW3kthAzr8G3Qk5MuZOz-mQtztikG3hLIRwGEckQ&oe=6A2479A2)](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/create-a-meta-app-with-instagram#step-4--select-your-app-type) If this new app needs Advanced Access, App Review is required.


## Get an access token

An access token contains information about the app making the request, the token's expiration date, the app user's Instagram User ID and the permissions the user has granted the app. You can get an Instagram user access token using one of the following methods:

**[Business Login for Instagram\**\
**![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH0nu_S&_nc_oc=AdoqbGC9JMVlkKK9-cIZRXtbZJzRUlBkUwWfRrdNLWtfrLJ79L6A1r143B6ZoaJaad0&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=a2SAkXL-tcVG39ItQb7XIg&_nc_ss=7b289&oh=00_Af6Yy_EW3kthAzr8G3Qk5MuZOz-mQtztikG3hLIRwGEckQ&oe=6A2479A2)](https://developers.facebook.com/docs/instagram/platform/instagram-api/business-login)**

If you have implemented Business Login for Instagram into your app, log in to your app.

**[App Dashboard\**\
**![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH0nu_S&_nc_oc=AdoqbGC9JMVlkKK9-cIZRXtbZJzRUlBkUwWfRrdNLWtfrLJ79L6A1r143B6ZoaJaad0&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=a2SAkXL-tcVG39ItQb7XIg&_nc_ss=7b289&oh=00_Af6Yy_EW3kthAzr8G3Qk5MuZOz-mQtztikG3hLIRwGEckQ&oe=6A2479A2)](https://developers.facebook.com/apps)**

If you have not implemented Business Login for Instagram, Get an access token via the App Dashboard.

1. In your app dashboard, click **Instagram > API setup with Instagram business login** in the left side menu.
2. Click **Generate token** next to the Instagram account you want to access.
3. Log into Instagram.
4. Copy the access token.

Access tokens from the business login flow are short-lived and valid for 1 hour. Access tokens from the App Dashboard are long-lived and are valid for 60 days. [Learn how to extend the expiry of any access token.](https://developers.facebook.com/docs/instagram/platform/instagram-api/business-login#get-a-long-lived-access-token)

## Get the app user ID & username

To obtain your app user's Instagram professional account user ID and username, send a `GET` request to the `/me` endpoint with the following parameters:

- `fields` set to a comma-separated list with `user_id` and `username`
- `access_token` set to the access token from the app dashboard

**Note:** The `/me` endpoint represents the app user's ID received from the access token, in this example, your user ID.

### Example request

_Formatted for readability._

```html
curl -i -X GET \
 "https://graph.instagram.com/v25.0/me
      ?fields=user_id,username
      &access_token=Ealkdfj..."
```

On success, your app receives a JSON object with the app user's Instagram user ID and the username of the Instagram professional account.

```html
{
  "data": [\
    {\
      "user_id": "<IG_ID>"\
      "username": "<IG_USERNAME>"\
    }\
  ]
}
```

### Fields

You can use the `fields` query string parameter to request the following fields on a User.

| Field Name | Description |
| --- | --- |
| `id` | The app user's app-scoped ID |
| `user_id` | The Instagram professional acount ID, `<IG_ID>`, for your app user. This ID is value of the `id` field received in webhook notifications for this account. |
| `username` | The app user's Instagram username. |
| `name` | The app user's name |
| `account_type` | The app user's account type. Can be `Business` or `Media_Creator`. |
| `profile_picture_url` | The URL for the app user's profile picture. |
| `followers_count` | The number of followers of the app user's Instagram professional account |
| `follows_count` | The number of Instagram accounts the app user's Instagram professional account follows |
| `media_count` | The number of Media object on the User |

## Get an app user's media objects

To get media objects, send a `GET` request to the `/<IG_ID>/media` endpoint.

### Example request

_Formatted for readability._

```html
curl -i -X GET \
 "https://graph.instagram.com/v25.0/<IG_ID>/media?access_token=<INSTAGRAM_USER_ACCESS_TOKEN>"
```

On success your app receives a JSON object with the IDs of all the [IG Media](https://developers.facebook.com/docs/instagram-api/reference/ig-media) objects on the [IG User](https://developers.facebook.com/docs/instagram-api/reference/ig-user):

```html
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

If you are able to perform this final query successfully, you should be able to perform queries using any of the Instagram API with Instagram Login endpoints — just see our various guides and references to learn what each endpoint can do and what permissions they require.

## Next Steps

Now that you know how to get access tokens and Instagram User IDs for your app users, learn how to [subscribe your app users to Instagram webhooks notifications.](https://developers.facebook.com/docs/instagram/platform/instagram-api/webhooks)

On This Page

[Get Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#get-started)

[Before You Start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#before-you-start)

[Get an access token](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#get-an-access-token)

[Get the app user ID & username](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#get-the-app-user-id---username)

[Example request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#example-request)

[Fields](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#fields)

[Get an app user's media objects](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#posts)

[Example request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#example-request-2)

[Next Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/get-started/#next-steps)