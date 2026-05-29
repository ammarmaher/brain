---
url: https://developers.facebook.com/docs/graph-api/webhooks/sample-apps
title: Sample Apps - Webhooks from Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fwebhooks%2Fsample-apps%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Webhooks from Meta](https://developers.facebook.com/docs/graph-api/webhooks)

- [Getting Started](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)
- [Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps)
- [Subscriptions Edge](https://developers.facebook.com/docs/graph-api/webhooks/subscriptions-edge)
- [Reference](https://developers.facebook.com/docs/graph-api/webhooks/reference)

On This Page

[Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps#sample-apps)

# Sample Apps

We provide [sample apps on GitHub](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Fgraph-api-webhooks-samples&h=AUCON9PULTc43osXnqh6tmS91TTUTWAtm-SD-yto_ZWVzgii6GPp4IDgRqC29uoGfSAs0w_9ZiUeJPGtSgR1j2pw6CLunO35yHL-IOs6lyW_3w1LvKsudTsz9r77l0OqNqxE7OZJENCvKQ), which you can set up and repurpose, or which you can use to quickly test your Webhooks configuration.

## Setting up the Sample App

Let's walk through setting up a sample app on [Heroku](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.heroku.com%2F&h=AUDOrK3utz4BkYMJysfjtdXuSAzxpC2xHpPsHu4TJIF1CRxcK85YHIvSHHR0_aEFQrWgNmYEabRK_VksaACUwMM9iuACB2TSmeR_NHqeUl84J484R93gPDTm0ySdPlue88rXABxYZq_gWg):

1. Create a free Heroku account if you don't already have one, then sign into it.
2. While signed in, go to [GitHub](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Fgraph-api-webhooks-samples%2Ftree%2Fmaster%2Fheroku&h=AUBVkAkd3MaQfYuea8Gkxl1Wwsx0pkrHQjT4tRQdnhEmccO5ANl00TrZWcgTRoB9gu1ThnSq_ZW_8nNLMQGMkxoSkhSLtwg7L5O5jh8n2Zr8Nka9GaPrLVxowmHmpEBQC1BVGeYx4jp_3Q) and deploy the app to Heroku. The app name you choose will be a part of your Callback URL, so choose something you can remember. Deploying will take a few seconds.
3. In a new browser tab, go to your app's [App Dashboard](https://developers.facebook.com/apps) Settings, and copy your app's App Secret.
4. In your Heroku app's settings, set up two config vars: `APP_SECRET` and `TOKEN`. Assign (paste) your App Secret to the `APP_SECRET` config var, and assign any string to `TOKEN`. We will include this string in any verification requests when you configure the Webhooks product in the App Dashboard (the app will validate the request on its own).

Your app should now be ready to go. Before you return to your App Dashboard to [configure the Webhooks product](https://developers.facebook.com/docs/graph-api/webhooks/getting-started#configure-webhooks-product):

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

On This Page

[Sample Apps](https://developers.facebook.com/docs/graph-api/webhooks/sample-apps#sample-apps)