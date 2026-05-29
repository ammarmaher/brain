---
url: https://developers.facebook.com/docs/instagram-messaging/get-started
title: Get Started - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-messaging%2Fget-started%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging)

- [Overview](https://developers.facebook.com/docs/instagram-messaging/overview)
- [Get Started](https://developers.facebook.com/docs/instagram-messaging/get-started)
- [Instagram Messaging Webhooks](https://developers.facebook.com/docs/instagram-messaging/webhooks)
- [Generic Template](https://developers.facebook.com/docs/instagram-messaging/generic-template)
- [Button Template](https://developers.facebook.com/docs/instagram-messaging/button-template)
- [Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing)
- [Human Agent Escalation](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation)
- [Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers)
- [ig.me links](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links)
- [Send a Message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message)
- [Sender Actions](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions)
- [Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu)
- [Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies)
- [Product Template](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template)
- [Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies)
- [Story Mention](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention)
- [Attachment Upload API](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload)
- [User Profile API](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile)
- [Moderate Conversations API](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations)
- [Sample Experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience)
- [App Review](https://developers.facebook.com/docs/messenger-platform/instagram/app-review)

On This Page

[Getting Started](https://developers.facebook.com/docs/instagram-messaging/get-started/#getting-started)

[Before You Start](https://developers.facebook.com/docs/instagram-messaging/get-started/#before-you-start)

[Login Flow](https://developers.facebook.com/docs/instagram-messaging/get-started/#login-flow)

[1\. Get a User Access Token](https://developers.facebook.com/docs/instagram-messaging/get-started/#1--get-a-user-access-token)

[2\. Get the User's Pages](https://developers.facebook.com/docs/instagram-messaging/get-started/#2--get-the-user-s-pages)

[3\. Get the Page Access Token](https://developers.facebook.com/docs/instagram-messaging/get-started/#3--get-the-page-access-token)

[3a. Get the Page Access Token via Instagram Developer Dashboard Tool](https://developers.facebook.com/docs/instagram-messaging/get-started/#app-dashboard)

[4\. Enable Message Control Connected Tools Settings](https://developers.facebook.com/docs/instagram-messaging/get-started/#connected-tools-toggle)

[5\. Get the Instagram professional account's Inbox Objects](https://developers.facebook.com/docs/instagram-messaging/get-started/#5--get-the-instagram-professional-account-s-inbox-objects)

[Next Steps](https://developers.facebook.com/docs/instagram-messaging/get-started/#next-steps)

# Getting Started

This document explains how to successfully call Messenger API support for Instagram (also known as Instagram Messaging API in our Developer Policies) with your app and get Instagram professional account messages.

**Note:** If your app users don't have a Facebook Page linked to their Instagram professional account, learn more about building an app with [the Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram/platform/instagram-api).

## Before You Start

You will need access to the following:

- An Instagram [professional account](https://www.facebook.com/help/instagram/138925576505882)
- A Facebook Page connected to that [account](https://developers.facebook.com/docs/instagram-api/overview#pages)
- A Meta Developer account that can perform the [`MODERATE` task](https://developers.facebook.com/docs/instagram-api/overview#tasks) on that Page
- A [Meta App](https://developers.facebook.com/docs/apps#register) created with the Facebook Login Use Case and with Basic settings configured

Developers that are new to the Messenger Platform

- Follow the step-by-step guide detailed below on how to generate Page Access Token, webhooks setup.

- Learn about the various [platform features](https://developers.facebook.com/docs/messenger-platform/instagram/features) and adopt those that suit your needs.


Developers with prior experience on the Messenger Platform

- Access token and webhooks concepts are similar. Messenger API support for Instagram will require `instagram_manage_messages` in the Page Access Token and Instagram topic webhooks subscribed.
- Most of the features are similar to Messenger API. Review the details on feature list and adopt those that suits your needs.

### Login Flow

You can use Facebook Login for Business or Business Login for Instagram to ask your app users for the need permissions.

The
[Business Login for Instagram](https://developers.facebook.com/docs/instagram/business-login-for-instagram) flow allows a person to complete the following during the login flow:


- convert their Instagram account to an Instagram professional account

- create a Facebook Page for their business

- connect that Page to their Instagram professional account


To implement Business Login for Instagram, visit our
[Business Login for Instagram guide](https://developers.facebook.com/docs/instagram/business-login-for-instagram) then return to this guide.


## 1\. Get a User Access Token

Make sure you are signed into your Facebook Developer account, then access your app and trigger the Facebook Login modal. Remember, your Facebook Developer account must be able to perform [Tasks](https://developers.facebook.com/docs/pages-api/overview#tasks) with at least "Moderate" level access on the [Facebook Page](https://developers.facebook.com/docs/pages-api/overview) connected to the Instagram account you want to query.

Once you have triggered the modal, click OK to grant your app the `instagram_basic`, `instagram_manage_messages`, and `pages_manage_metadata` permissions.

The API should return a User access token. Capture the token so your app can use it in the next few queries. If you are using the Graph API Explorer, it will be captured automatically and displayed in the Access Token field for reference:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/142020930_4059362647408614_1740112770862669549_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=kA0vJw2_kv4Q7kNvwELIhpj&_nc_oc=Ado9HpwDdlsOVI2aXt_2qojVlkw9FP5BOD-G13UFMoL-miotR0wFc232EaurzUxmcTo&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=AvcNM37sh-2pVF2fF1kq3w&_nc_ss=7b289&oh=00_Af7GP8cbt5J47TwuB1keDMh-TeZNTW1xmjhGHOcextKUxw&oe=6A24AB44)

## 2\. Get the User's Pages

Query the `GET /me/accounts` endpoint (this translates to `GET /{user-id}/accounts`, which perform a GET on the Facebook [User](https://developers.facebook.com/docs/graph-api/reference/user) node, based on your access token).

```curl
curl -i -X GET \
 "https://graph.facebook.com/v9.0/me/accounts?access_token={access-token}"
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

## 3\. Get the Page Access Token

In order to perform various Instagram Messaging API calls, you will need to use the associated Page Access Token (PAT) of the relevant Instagram professional account that has been previously granted via FB login flow.

Send a `GET` request to the `/{page-id}` endpoint using your User access token. For example:

```curl
curl -i -X GET "https://graph.facebook.com/{page-id}?
  fields=access_token&
  access_token={user-access-token}"
```

On success, your app gets this response:

```json
{
  "access_token":"{page-access-token}",
  "id":"{page-id}"
}
```

- If you used a short-lived User access token, the Page access token is valid for only 1 hour.
- If you used a long-lived User access token, the Page access token has no expiration date.

To generate a long-lived Page access token, you can follow the guide [here](https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing/#get-a-long-lived-page-access-token).

## 3a. Get the Page Access Token via Instagram Developer Dashboard Tool

This tool is currently being rolled out to all developers over the coming weeks. If you don't see the settings under the App Dashboard, you can leverage Step 1-5 above to generate Page Access Tokens.

Optionally, if you own the assets(Instagram account and FB page) that you want to onboard to Messenger API support for Instagram, you can leverage the Instagram setup tool under the Developer App Dashboard to allow you to easily setup Page Access Tokens and Webhooks. You can find the tool under Developer app dashboard → Messenger → Instagram Settings. Existing way of configuring tokens and webhook will still work, but this tool will give you an easier way to setup your environment.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/196275801_927883678049780_255440934045349593_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=tYx2pusrBugQ7kNvwFRB41z&_nc_oc=AdokmfRuM17aUBvuIAWhZySYnN2EstV3NDRDf5v_iQfv4_0cInVLxzLSoPWyePIizzw&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=AvcNM37sh-2pVF2fF1kq3w&_nc_ss=7b289&oh=00_Af6zf0JNPkbCJyuFnoL8LzGotaU5t2zO0xg-qzgVxQ1BTQ&oe=6A24D8C7)

## 4\. Enable Message Control Connected Tools Settings

In order to manage Instagram messages via API, Instagram professional accounts will need to enable the connected tools toggle under message controls settings. This setting can be found by going to:

**Instagram Settings > Messages and story replies >Message controls > Connected Tools > toggle Allow Access to Messages**

## 5\. Get the Instagram professional account's Inbox Objects

Use the Page ID you captured and the Page Access Token (PAT) to query the `GET /{page-id}/conversations?platform=instagram` endpoint:

```curl
curl -i -X GET \
 "https://graph.facebook.com/v9.0/17841405822304914/conversations?platform=instagram&access_token={access-token}"
```

This should return the IDs of all the thread objects on the Instagram user:

```json
{
  "data": [\
    {\
      "id": "aWdfZAG06MTpJR01lc3NhZA2VUaHJlYWQ6OTAwMTAxNDYyOTkyODI6MzQwMjgyMzY2ODQxNzEwMzAwOTQ5MTI4MTM2MDk5MDc1MzYyOTgx"\
    },\
    {\
      "id": "aWdfZAG06MTpJR01lc3NhZA2VUaHJlYWQ6OTAwMTAxNDYyOTkyODI6MzQwMjgyMzY2ODQxNzEwMzAwOTQ5MTI4MTYzMzQ2MzE5NjM1NDcy"\
    },\
    {\
      "id": "aWdfZAG06MTpJR01lc3NhZA2VUaHJlYWQ6OTAwMTAxNDYyOTkyODI6MzQwMjgyMzY2ODQxNzEwMzAwOTQ5MTI4MTk3MTY0NjI2NzAyMjMw"\
    },\
    {\
      "id": "aWdfZAG06MTpJR01lc3NhZA2VUaHJlYWQ6OTAwMTAxNDYyOTkyODI6MzQwMjgyMzY2ODQxNzEwMzAwOTQ5MTI4MzkzNDI5MDYzMzkyNjU0"\
    }\
}\
```\
\
If you can perform this final query successfully, you should be able to perform queries using any of the Messenger API support for Instagram endpoints - just refer to our various guides and references to learn what each endpoint can do and what permission they require.\
\
## Next Steps\
\
- [Develop your app further](https://developers.facebook.com/docs/messenger-platform/instagram/features) so it can successfully use any other endpoints it needs, and keep track of the permissions each endpoint requires\
- Complete the [webhook setup](https://developers.facebook.com/docs/messenger-platform/webhooks) so it can receive real time notifications whenever user sends a message to the Instagram professional account.\
- Complete the [App Review](https://developers.facebook.com/docs/messenger-platform/instagram/app-review/) process and request approval for all permissions your app will need so your app users can grant them while your app is in production.\
\
### Developer Support\
\
- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUDzIJ0ymyGQgnSK63_alnbnrepior_PUfRgxWjxK5XKw3B6zyWxSJq6wA6lxZtqJNt5VcEpy-XYuiSB8v4miZDbJRvvTPfmdSTuIvIy6aC1CpxZrKw9WjOmP_kWWpqTv2nu_fd7JUbG6g) to check for the status and outages of Meta business products.\
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.\
\
On This Page\
\
[Getting Started](https://developers.facebook.com/docs/instagram-messaging/get-started/#getting-started)\
\
[Before You Start](https://developers.facebook.com/docs/instagram-messaging/get-started/#before-you-start)\
\
[Login Flow](https://developers.facebook.com/docs/instagram-messaging/get-started/#login-flow)\
\
[1\. Get a User Access Token](https://developers.facebook.com/docs/instagram-messaging/get-started/#1--get-a-user-access-token)\
\
[2\. Get the User's Pages](https://developers.facebook.com/docs/instagram-messaging/get-started/#2--get-the-user-s-pages)\
\
[3\. Get the Page Access Token](https://developers.facebook.com/docs/instagram-messaging/get-started/#3--get-the-page-access-token)\
\
[3a. Get the Page Access Token via Instagram Developer Dashboard Tool](https://developers.facebook.com/docs/instagram-messaging/get-started/#app-dashboard)\
\
[4\. Enable Message Control Connected Tools Settings](https://developers.facebook.com/docs/instagram-messaging/get-started/#connected-tools-toggle)\
\
[5\. Get the Instagram professional account's Inbox Objects](https://developers.facebook.com/docs/instagram-messaging/get-started/#5--get-the-instagram-professional-account-s-inbox-objects)\
\
[Next Steps](https://developers.facebook.com/docs/instagram-messaging/get-started/#next-steps)