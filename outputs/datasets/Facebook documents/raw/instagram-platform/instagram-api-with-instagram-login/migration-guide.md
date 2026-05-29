---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/
title: Migration Guide - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-instagram-login%2Fmigration-guide%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Migrate your App](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#migrate-your-app)

[Why migrate your app](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#why-migrate-your-app)

[Should you migrate your app](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#should-you-migrate-your-app)

[Migration Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#migration-steps)

[Step 1. Add Instagram](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#step-1--add-instagram)

[Step 2. Update your code](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#step-2--update-your-code)

# Migrate your App

This guide will help you determine whether you should migrate your existing app to the new Instagram product and how to implement it.

## Why migrate your app

The Instagram API with Instagram Login offers a streamlined and efficient way for your app users to manage their Instagram professional accounts without the need for a Facebook Page or Facebook presence. With only two permissions required for each functionality – `instagram_business_basic` and the permission specific to messaging, comment moderation, or content publishing – the onboarding process has been significantly simplified, going from an average of 12 steps to just two. As a result, we've seen a significant improvement in onboarding success rates.

## Should you migrate your app

Use the following table to determine if you should implement the Instagram product into your app:

| Component | [Instagram API setup with Instagram Login](https://developers.facebook.com/docs/instagram/platform/instagram-api) | [Instagram API setup with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-graph-api) |
| --- | --- | --- |
| **Access token type** | Instagram User | Facebook User or Page |
| **Authorization type** | [Business Login for Instagram](https://developers.facebook.com/docs/instagram/platform/instagram-api/business-login) | [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business/) |
| **Comment moderation** |  |  |
| **Content publishing** |  |  |
| **Facebook Page** | x | Required |
| **Hashtag search** | x |  |
| [**Insights**](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/insights) |  |  |
| **Mentions** |  |  |
| **Messaging** |  | [via Messenger Platform](https://developers.facebook.com/docs/messenger-platform/instagram) |
| [**Product tagging**](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/product-tagging) | x |  |
| [**Partnership Ads**](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/partnership-ads) | x |  |

## Migration Steps

You will need to take the following steps to migrate your app.

### Step 1. Add Instagram

Follow the [Create a Meta app with Instagram guide \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEKBi73&_nc_oc=Adq4CpfBfxsHfP6EsgA_4dD-5vAX-IyqQoGbsheWLq3egACoxpMuRqKoWcgSaGZnRng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=tIjXgsUx4HhuyQ30qwm6Sg&_nc_ss=7b289&oh=00_Af7AzYCeUnPZMccKUalliDl_eRGr4SbQFvaM8bljbLKaSA&oe=6A240922)](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/create-a-meta-app-with-instagram/) to add the Instagram product to your existing business type app.

If your current Meta app type is **not** a Business type app you will need to create a new app and [select **Business** during the creation process.![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEKBi73&_nc_oc=Adq4CpfBfxsHfP6EsgA_4dD-5vAX-IyqQoGbsheWLq3egACoxpMuRqKoWcgSaGZnRng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=tIjXgsUx4HhuyQ30qwm6Sg&_nc_ss=7b289&oh=00_Af7AzYCeUnPZMccKUalliDl_eRGr4SbQFvaM8bljbLKaSA&oe=6A240922)](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/create-a-meta-app-with-instagram#step-4--select-your-app-type)

If this new app needs Advanced Access, [App Review ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEKBi73&_nc_oc=Adq4CpfBfxsHfP6EsgA_4dD-5vAX-IyqQoGbsheWLq3egACoxpMuRqKoWcgSaGZnRng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=tIjXgsUx4HhuyQ30qwm6Sg&_nc_ss=7b289&oh=00_Af7AzYCeUnPZMccKUalliDl_eRGr4SbQFvaM8bljbLKaSA&oe=6A240922)](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/create-a-meta-app-with-instagram#step-10--complete-app-review) is required and will be handled within the Instagram product flow instead of the App Review item in the left side dashboard menu.



You will configure:

- Instagram Login for Business
- Permissions and features
- Webhooks

### Step 2. Update your code

1. Copy and paste the **Embed URL** in an anchor tag or button on your app or website to launch the Business Login for Instagram flow. This flow will give your app an Instagram User access token.
2. Update the host URL in your code so that your API calls use `graph.instagram.com`.
3. Update your API calls to use an Instagram User access token. This will update the `/me` endpoint calls to use an Instagram Professional account ID instead of a Facebook Page ID
4. Replace your Meta app ID and app secret with the Instagram app ID and secret found in the app dashboard; **Instagram > API setup with Instagram login > 3. Set up Instagram business login > Business login settings**.

On This Page

[Migrate your App](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#migrate-your-app)

[Why migrate your app](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#why-migrate-your-app)

[Should you migrate your app](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#should-you-migrate-your-app)

[Migration Steps](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#migration-steps)

[Step 1. Add Instagram](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#step-1--add-instagram)

[Step 2. Update your code](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login/migration-guide/#step-2--update-your-code)