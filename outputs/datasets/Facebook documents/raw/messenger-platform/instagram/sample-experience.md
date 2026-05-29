---
url: https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience
title: Sample Experience - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Fsample-experience%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Sample Instagram Experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#sample-instagram-experience)

[Platform features](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#platform_features)

[Requirements to deploy an Instagram app](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#requirements)

[Setup Steps](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#setup)

[One-click deploy using Heroku or Glitch](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#one-click)

[Deploy locally using ngrok](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#ngrok)

[Deploy using Heroku](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#heroku)

[Connect your webhook](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#webhook)

[Test that your app setup is successful](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#test)

[Troubleshooting](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#troubleshooting)

[The app only replies to me, but not someone else](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#app_in_dev_mode)

[Other Issues](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#issues)

# Sample Instagram Experience

|     |     |
| --- | --- |
| Original Coast Clothing is a fictional clothing brand created to showcase the key features of the Instagram Platform delivering a great customer experience. Using this demo as inspiration, anyone can create a delightful Messenger API support for Instagram experience that leverages both automation and live customer support. [Open-source code](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Foriginal-coast-clothing-ig&h=AUBk2swHc5TSp-K7b8gu0fwvQv_l9qA0BqTeaCZGF9orAMfGBMkB7XCWs5uorLAdgKJT4tTf-Zt__Rl1HuEOAL2CBq2JZgHwwVHBrO6TzAT_LsyMk2s8JNVoJSlNKI-uOwmATjOtxq53-g) for the app and a guide on how to deploy the experience on your local environment or remote server are provided.<br>Try it now by messaging **[@originalcoastclothing](https://l.facebook.com/l.php?u=https%3A%2F%2Finstagram.com%2Foriginalcoastclothing%3Fref%3DDEVDOCS&h=AUCUoqmbFmcP1TrKbUTOSX0l0hVvRpiKSko64yRSMisn4_nN7DoBz1y6gHAC9Yu9bihsiihKbrhL0byXzr1ovQNMooGUTlWsy1SvH0GqLNIaHnVS3HixYxAs3ykqiS9Jjsv8fQU3XFdVmg)** or **[commenting on a post](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fp%2FCNaLh5xgppt%2F&h=AUB9_ZGZorpjxyNzGgzQzqdI4fFKXGVlSop0VSAowJrBnXFggfBHOiFgS0VCdbzowEizFg7AxvSTBD6Z8SIiYhh2WcGl9wyit06OCS5CIXzBmwdCqQp4psraX3AmrFbIrJ_LLu2TrapgNg)**. | ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=304344607958444&version=1776231144) |

## Platform features

This experience leverages the following platform features. If you decide to [deploy the experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#deploy) on your Page, the code will use them all:

- [Messaging](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message)
  - Text, Image, and link previews
  - Generic templates
- [Webhooks](https://developers.facebook.com/docs/messenger-platform/webhook)
- [Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies)
- [User Profiles](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile)
- [Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies)
- [Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers)

# Deploy this experience on Instagram

By the end of this guide, you'll have a full Instagram app running on your server, answering messages from your account.

The code that powers this experience is open-source. Anyone can easily get started with developing a great messaging experience.

The code is released under the BSD License, allowing you to use it freely for your needs. The code is hosted on [GitHub](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Foriginal-coast-clothing-ig&h=AUBzC4QAM_3o9voHjNzqdLPWzNcFU1WwIt89uSIa_DDWXQu4PQxGwzSSqYGq_xQlNMJ4ADM8UQA4Mk5MPKfwrG-DypeIIKAEzePUuIrbi4wK_a0gRPq3-1OctzLhc2VMhZIgqjUZO7p6kQ) for further reference.

## Requirements to deploy an Instagram app

- An **[Instagram Professional Account](https://www.facebook.com/help/instagram/138925576505882)** (either Creator or Business account).
- A **Facebook Page** [connected to that Instagram account](https://developers.facebook.com/docs/instagram-api/overview#pages). Make sure that you have a Facebook Page that represents your Instagram Professional account identity when connecting with users. To create a new Page, visit [https://www.facebook.com/pages/create](https://www.facebook.com/pages/create), you can also set up a test Page to start.
- A **Developer Account** that can perform [Tasks](https://developers.facebook.com/docs/instagram-api/overview#tasks) on your Page. A Developer Account allows you to create new apps, which are the core of any Facebook integration. You can register as a developer by going to the [Facebook Developers website](https://developers.facebook.com/) and clicking the "Get Started" button.
- A **[Facebook app](https://developers.facebook.com/docs/development/create-an-app)** with Basic settings configured. To create a new app, visit [https://developers.facebook.com/](https://developers.facebook.com/) and click on **Add New App**

### Setup Steps

The objective of this section is to gather all the access tokens and ids necessary for the Instagram app to successfully send and receive messages. Before you begin, make sure you have completed all of the requirements listed above. At this point you should have a Page, a registered Facebook app, and an Instagram Professional account.

If you just created a new Facebook app, it is probably in **development mode**. Note that apps in this mode are only allowed to message people connected to the app (Admins, Developers and Testers). You can continue with this guide in this mode, but once your app is ready to be public, the app needs to go through app review for the [`instagram_manage_messages`](https://developers.facebook.com/docs/permissions/reference/instagram_manage_messages) permission. For more info, see [App Review](https://developers.facebook.com/docs/apps/review/)

1. Configure your Instagram integration by following the [Getting Started](https://developers.facebook.com/docs/messenger-platform/instagram/get-started) documentation.
2. Add some Instagram test accounts that you'll use to test the experience.

At this point you should have the following

- App ID
- App Secret
- Page ID
- Page Access Token
- Instagram Account connected to Page
- Instagram Account(s) registered as test accounts

# Installation

You will need:

- [Node](https://l.facebook.com/l.php?u=https%3A%2F%2Fnodejs.org%2Fen%2F&h=AUAo3Gsd797OlyJTEdxjKbl5nkaZah6kgMjB7TMQlrpZf0WgDbgvC2Y_OFtp99lbw_9TUnKEKKN_0hsC0pcxg1hVmu_yeFApcLsPXSIHW6SICuwD5eT0Lz_8XNjJOK7w70FEa5KqjgmF4g) 10.x or higher
- A server for your code. Options include:

  - Local tunneling service such as [ngrok](https://l.facebook.com/l.php?u=https%3A%2F%2Fngrok.com%2F&h=AUBxQy6pZ2nZ0vfapM6rDd0GV5Tdal2ftkjcb4LhpIOLyuUMEszz1NyGaEYwZ9EdSXhXKZXekKl2af4lx04veS5v4X6WDP6VqDWiNOiHx7f_vNtaCUXCNM--waLShrnffSM0hQzTQh-59A)
  - Remote server service such as [Heroku](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.heroku.com%2F&h=AUDHufjxzmZ-_E6ss99sJIcu69Yn5wTk8B_Pqi81XczeVVmUfKa2tXlyp2qeu_3ni6AnPSxwBdAZ7eZoxtH2im8BS-HsFRogU8_zR9_RZlGmi_6uVhgQHivmOjbOHKOxOSjUwE_yV5Y6DA) or [Glitch](https://l.facebook.com/l.php?u=http%3A%2F%2Fglitch.com%2F&h=AUAh_aIqMZ8Os_kr3XzVScdXGxc-W4ZxnqQ0PeNXMPiTZA6t9RgYwL4aPLRw_oY1fuk5CDEBABBSOeHZi_32jt7bk6EhfjbtNWB30AWrhujAnlb4CVo4HeNpfqwjSQqrIerdRx3eGEVISQ)
  - Your own webserver

## One-click deploy using Heroku or Glitch

The experience can be automatically deployed to Heroku or Glitch using the following buttons. You will be prompted to enter the needed environment variables to complete the setup.

[Deploy on Heroku](https://l.facebook.com/l.php?u=https%3A%2F%2Fbit.ly%2F3vU744Q&h=AUAFejcCKMmCY5XnUXPYWbrRvRODUzU8HwMbcGdt1ypcosR8lTsrSVoLhTzTKPcJXCinsU-VH2KZ7X-LJ64VnTlqBJIcaPcKIUAJYsoeFZBXK60iXVMfxd6Nm-Mj0ej1LPO8VrgS3SGCrA) [Deploy on Glitch](https://l.facebook.com/l.php?u=https%3A%2F%2Fbit.ly%2F3wB07G1&h=AUCbV7W8gIshYY2mE2JNpuTFdEP2gthDR9lifqaffH9Eg_0ge8kamV5kfoTZ5Pgisr5PzYBSuwJ2oXew-4FVYsB_NRSAy_vsCvFLFt3z5fGJk_1VKpGbp8O2ysiWcBOijXv1JHwAD2f_bQ)

## Deploy locally using ngrok

A tunneling service exposes your local webserver to an external URL that can be reached by Facebook webhooks. There are many such services. In this example, we will use ngrok.

**1\. Clone the repo**

Clone the repository to your local machine:

```code
git clone https://github.com/fbsamples/original-coast-clothing-ig.git
cd original-coast-clothing-ig
```

**2\. Install tunneling service**

If not already installed, install ngrok via [download](https://l.facebook.com/l.php?u=https%3A%2F%2Fngrok.com%2Fdownload&h=AUAaqSv0ldY4Awy_kSYu8pnt41ejoPSIwNdF25wllot8gbKon-PGLAiGACI415Mwoik2awy7T7IdUAoPspjaDaRsGBAitkTJiLOTgcS-vlPe00YSrd7F_lqDiiqDPuNkeaaZF2DyNIUqOg) or via command line:

```bash
$ npm install -g ngrok
```

In the directory of this repo, request a tunnel to your local server with your preferred port

```bash
$ ngrok http 3000
```

The screen should show the ngrok status:

```
Session Status                online
Account                       Redacted (Plan:iuluufkccebegkhifrlgfhudrtbthgln Free)
Version                       2.3.35
Region                        United States (us)
Web Interface                 http://127.0.0.1:4040
Forwarding                    http://1c3b838deacb.ngrok.io -> http://localhost:3000
Forwarding                    https://1c3b838deacb.ngrok.io -> http://localhost:3000
```

Note the https URL of the external server that is fowarded to your local machine. In the above example, it is `https://1c3b838deacb.ngrok.io`.

**3\. Install the dependencies**

Open a new terminal tab, also in the repo directiory.

```bash
$ npm install
```

Alternatively, you can use [Yarn](https://l.facebook.com/l.php?u=https%3A%2F%2Fyarnpkg.com%2Fen%2F&h=AUCenWHTdkxOlBsbda3FvOT4dAbnEiGQvy7BEINeNonbjbyRFTfvYy-lfnzL7soaMA8icHAS-FAbTx5IRuqj5OFcosLKkDQaY5Ki1PPXTuDQ4NuIWECv-rcxAMywP5cUijSa5h8Vtq9M5g):

```bash
$ yarn install
```

**4\. Set up .env file**

Copy the file `.sample.env` to `.env`

```bash
$ cp .sample.env .env
```

Edit the `.env` file to add all the values for your app and page.

**5\. Run your app locally**

```bash
$ node app.js
```

You should now be able to access the default page of the application in your browser at [http://localhost:3000](https://l.facebook.com/l.php?u=http%3A%2F%2Flocalhost%3A3000%2F&h=AUBoLsi3-rHr7iq23jRuWC4RW0vpaBSXf_kyH44YSug9rtGSatDbKGjzbVDSCZ1CZCI-ObO6_SVf8qMV5z9-a3pNJ-pXkLlQaaQaMvpBdJmDNHDtgumjOCSLzTUtSTTEggFL_lQvl_D0DQ)

Confirm that you can also access the application at the external URL from step 2.

## Deploy using Heroku

**1\. Clone the repo**

Clone the repository to your local machine:

```code
git clone https://github.com/fbsamples/original-coast-clothing-ig.git
cd original-coast-clothing-ig
```

**2\. Install the Heroku CLI**

If the directory is not already a git repo, create one:

```bash
$ git init
Initialized empty Git repository in .git/
$ git add .
$ git commit -m "My first commit"
```

**3\. Install the Heroku CLI**

If not already installed, download and install the [Heroku CLI](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevcenter.heroku.com%2Farticles%2Fheroku-cli&h=AUC881OQffFIY6_4pLqQXpLvfJDeLpduAN7khA32HYVVkAixP4KvZp09xF26rSmysK-ypc3qWxfp25o9OY0abBm5wTT-yGk5MlSdTI1Jumx36R-FJXyimOUMgnasUsupV8AIlNNcby2rBg)

**4\. Create an app from the CLI**

```bash
$ heroku apps:create

Creating app... done, ⬢ mystic-wind-83
Created http://mystic-wind-83.herokuapp.com/ | git@heroku.com:mystic-wind-83.git
```

Note the name given to your app. In this example, it was `mystic-wind-83`.

**5\. Set your environment variables**

On the [Heroku App Dashboard](https://l.facebook.com/l.php?u=https%3A%2F%2Fdashboard.heroku.com%2F&h=AUAdWUYVk3eXFrDI9z6WY13NSFFCR-bNISPiK4QrWOCqR8gBgGiIip6eLxLXcediIijMnY7h80LEGgSmAznU1voN5lfocz-e82LyZvwRp4l-LPchOsP3FBn-La0xb1Rq3fZPigEjLS-y7A), find your app and set up the config vars following the comments in the file `.sample.env`

Alternatively, you can set env variables from the command line like this:

```bash
$ heroku config:set PAGE_ID=XXXX
```

**6\. Deploy the code**

```bash
$ git push heroku master
```

**7\. View log output**

```bash
$ heroku logs --tail
```

## Connect your webhook

Now that your server is running, your webhook endpoint is at the path `/webhook`. In the Heroku example above, this would be `http://mystic-wind-83.herokuapp.com/webhook`.

Set up your webhook by following the \[Messenger Platform Webhooks guide\](/docs/messenger-platform/webhooks

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=312657300216396&version=1776231144)

After the webhook subscription is validated, subscribe to the following events:

- comments
- messages
- messaging\_postbacks

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1360607740982161&version=1776231144)

Test the webhooks by clicking the "Test" buttons next to the subscribed events. You should see the test events in the log output of your server.

## Test that your app setup is successful

While logged in to an account with the role of "Instagram Tester", try sending a message to the Instagram account connected to your Page, or leaving a comment on a post.

If you see a response to your message in Instagram, you have fully set up your app! Voilà!

## Troubleshooting

### The app only replies to me, but not someone else

The Facebook app is likely still in Development Mode. You can add someone as a tester of the app, if they accept, the app will be able to message them. Once ready, you may request the `instagram_manage_messages` permission to be able to reply to anyone.

### Other Issues

Is this guide wrong? [Let us know by filing an Issue](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Foriginal-coast-clothing%2Fissues&h=AUCGwp6BAbyxmxta4bqiIyJyILjnXdqdi4hc9x5Su6sr11t1NwGiWAYhIKDTeVvDU6Nt3QkMa3Bfq999k67MjqodFY1OQDx1NBFnA1zVkCR_EIuhKuFK0EYcI768PFaRWEZptse62gI_7g)

On This Page

[Sample Instagram Experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#sample-instagram-experience)

[Platform features](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#platform_features)

[Requirements to deploy an Instagram app](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#requirements)

[Setup Steps](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#setup)

[One-click deploy using Heroku or Glitch](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#one-click)

[Deploy locally using ngrok](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#ngrok)

[Deploy using Heroku](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#heroku)

[Connect your webhook](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#webhook)

[Test that your app setup is successful](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#test)

[Troubleshooting](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#troubleshooting)

[The app only replies to me, but not someone else](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#app_in_dev_mode)

[Other Issues](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience#issues)