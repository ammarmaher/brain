---
url: https://developers.facebook.com/docs/threads/posts/accessibility
title: Accessibility - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fposts%2Faccessibility%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)


  - [Posts](https://developers.facebook.com/docs/threads/posts)
  - [Create Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies)
  - [Reposts](https://developers.facebook.com/docs/threads/posts/reposts)
  - [Quote Posts](https://developers.facebook.com/docs/threads/posts/quote-posts)
  - [Ghost Posts](https://developers.facebook.com/docs/threads/create-posts/ghost-posts)
  - [Polls](https://developers.facebook.com/docs/threads/create-posts/polls)
  - [Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers)
  - [Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments)
  - [Share to Instagram Stories](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories)
  - [Location Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging)
  - [Geo-Gated Content](https://developers.facebook.com/docs/threads/posts/geo-gating)
  - [Accessibility](https://developers.facebook.com/docs/threads/posts/accessibility)

- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)
- [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts)
- [Profiles](https://developers.facebook.com/docs/threads/threads-profiles)
- [Insights](https://developers.facebook.com/docs/threads/insights)
- [Webhooks](https://developers.facebook.com/docs/threads/webhooks)
- [oEmbed](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post)
- [Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents)
- [Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting)
- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Accessibility](https://developers.facebook.com/docs/threads/posts/accessibility#accessibility)

[Publishing](https://developers.facebook.com/docs/threads/posts/accessibility#publishing)

[Example Request](https://developers.facebook.com/docs/threads/posts/accessibility#example-request)

[Example Response](https://developers.facebook.com/docs/threads/posts/accessibility#example-response)

[Media Retrieval](https://developers.facebook.com/docs/threads/posts/accessibility#media-retrieval)

[Example Request](https://developers.facebook.com/docs/threads/posts/accessibility#example-request-2)

[Example Response](https://developers.facebook.com/docs/threads/posts/accessibility#example-response-2)

# Accessibility

To aid users who are visually impaired, you can use Threads API to set the accessibility label or alt text for each image or video that is attached to your post.

### Limitations

This feature isn't available for text-only posts. It will only work on image, video, and carousel posts.

## Publishing

Alt text can be configured when making a request to the `POST /threads` endpoint to [create a media object](https://developers.facebook.com/docs/threads/posts#step-1--create-a-threads-media-container). Make sure to include the following parameter with your API request:

- `alt_text` — (For images and videos only.) The accessibility text label or description for an image or video in a Threads post.

### Example Request

```code
curl -i -X POST \
  "https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads?media_type=IMAGE&image_url=https://www.example.com/images/bronz-fonz.jpg&text=BronzFonz&access_token=<ACCESS_TOKEN>"
  -d alt_text="Photograph of Bronze Fonz Statue"
```

### Example Response

```code
{
  "id": "1234567" // Threads Media Container ID
}
```

The request above creates a Threads post container that, [once published](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container), will add a custom accessibility label to your media.

## Media Retrieval

The value for alt text can be retrieved when making a request to the `GET /threads` or `GET /{threads_media_id}` endpoint to retrieve media object(s). Make sure to include the following field with your API request:

- `alt_text` — The accessibility text label or description for an image or video in a Threads post.

### Example Request

```code
curl -s -X GET \
  "https://graph.threads.net/v1.0/<THREADS_MEDIA_ID>?fields=id,alt_text&access_token=<ACCESS_TOKEN>"
```

### Example Response

```code
{
   "id": "12312312312123",
   "alt_text": "Photograph of Bronze Fonz Statue",
}
```

On This Page

[Accessibility](https://developers.facebook.com/docs/threads/posts/accessibility#accessibility)

[Publishing](https://developers.facebook.com/docs/threads/posts/accessibility#publishing)

[Example Request](https://developers.facebook.com/docs/threads/posts/accessibility#example-request)

[Example Response](https://developers.facebook.com/docs/threads/posts/accessibility#example-response)

[Media Retrieval](https://developers.facebook.com/docs/threads/posts/accessibility#media-retrieval)

[Example Request](https://developers.facebook.com/docs/threads/posts/accessibility#example-request-2)

[Example Response](https://developers.facebook.com/docs/threads/posts/accessibility#example-response-2)

Allow the use of cookies by Facebook on this browser?

We use cookies and similar technologies to help provide and improve content on [Meta Products](https://www.facebook.com/help/1561485474074139). We also use them to provide a safer experience by using information we receive from cookies on and off Facebook, and to provide and improve Meta Products for people who have an account.

- Essential cookies: These cookies are required to use Meta Products and are necessary for our sites to work as intended.
- Cookies from other companies: We use these cookies to show you ads off of Meta Products and to provide features like maps and videos on Meta Products. These cookies are optional.

You have control over the optional cookies we use. Learn more about cookies and how we use them, and review or change your choices at any time in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

* * *

## About cookies

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_1.png)

What are cookies?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_2.png)

Why do we use cookies?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_3.png)

What are Meta Products?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_4.png)

Your cookie choices

Learn more

* * *

## Cookies from other companies

We use cookies from [other companies](https://www.facebook.com/privacy/policies/cookies/?annotations[0]=explanation%2F3_companies_list) in order to show you ads off of our Products, and provide features like maps, payment services and video.

How we use these cookies

We use cookies from other companies on our Products:

- To show you ads about our Products and features on other companies’ apps and websites.
- To provide features on our Products such as maps, payment services and video.
- For analytics.

If you allow these cookies

- Features you use on Meta Products will not be affected.
- We'll be able to better personalize ads for you off of Meta Products, and measure their performance.
- Other companies will receive information about you by using their cookies.

If you don't allow these cookies

- Some features on our products may not work.
- We won't use cookies from other companies to personalize ads for you off of Meta products, or measure their performance.

## Other ways you can control your information

Manage your ad experience in Accounts Center

You can manage your ad experience by visiting the following settings.

Ad preferences

In your ad preferences you can choose whether we show you ads and make choices about the information used to show you ads.

Ad settings

If we show you ads, we use data that advertisers and other partners provide us about your activity off Meta Company Products, including websites and apps, to show you better ads. You can control whether we use this data to show you ads in your [ad settings](https://www.facebook.com/settings/ads/).

More information about online advertising

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUCJRfZ6KUow-kwLHsBfwTyUbdy9FYHGaD2XOFTb_WHvuurt2WPjSibwBO1xdfNWiF-s9-fAq_aJRCHmfSy6O-PF-JhAi7lfwiMJW_s0tHDlrlHTaRCi9vOGv6LS1OBY_4R5ooEdDDLzpQ) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUA4QomsHWkwLSofiDlXnGMcu6Wm-wXTK2FEao_ss5KHOEZxptELw29Q-bosgRFsGhqENg-hmq2lQHhdyE4m1X1nkqO23Y-LPGYmxW_NgrlRNHEITHre1AFa2_R-7saiWyNH37VmFiKDrA) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUCevip0EexJeQsxVMb6h84PgzLAtBpVB5R8YzuSaWvKroaYlCJd2xImdemjl-mTun5oGK0WnLGdEnKPw6LojCt87demBE487HYaqaDTCRA-X3eXOoPvLuiDcwWNLt3mtcZ_qDtxnfTV2Q) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUAKzKHpwjlKxh3-ZHMjvTxoaqzsWGbhNaXemoNRcuKw6FLECB58ZGg1LwD-2QQIzWtrZJJ5fxnWLRrcmBq7ioHRVtkAL9_OsVtWY5ZIeq7wzOTxtCDeR-dVNUA1kQ-ydDpjXqF2sffq9g)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDhPQ2v1IzyRRFKAsbYX0XOIfyPx66GCeiJvbtCFFCu8ryOt4pMX7TLpqPgS4HNdoREv-QYy2EJBudqlaULF2dlgSouJ5Hz5lPrF0iObx86GJQSsZKJAaVl_nduNsjrE2yc4M8w6Mhxtg)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUB3J64VbcREC8TU-5K6ipqtUJpP7l7C-uz6XBnkcqW9FLBx8nwGNGnrgJqcEtN5VV7X0Mq88rUYYyxgbJMTn1nyWv7tyQ-zrmB9yBOZdXZlxbp_BiROILAdtvini-_j8leHUFyWiIun0w)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUDwVfM7PoFF8bkjmfbrw3ZuTYYUm0syKWhdakjzPJTHv5-3oSKcw8POrxWn6lhBLfmiwgR_TTqDgnffml7nzn-dOO0FqjMN_Od5spTVyF6lNnuzBBpMTcpHhwUtZkdew5P-v1yx88Fw4A)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUB458UO2EomCQgYQYHQJ0eEGdtgBjZm_nnptCG9IjBiDjhEezj0xs7Gw53Yaejq0AcdyX2YEBnFQ4Rt62wO9k8KPn7yAWDenVtU6O15XtEAnNThpG-jD7PCD9Qxegc_60NtG0kf1qIINA)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBW4eXLcrVrrR9POU9yhAUnbeubjpm-FDd9SJaYoK2IHoTlkcGTWx93r9f4DlY32mRctZqv-hMfkTsD-IB4Dt3JC-ChA2FUk5vPacQZrZ6PZJCp5Yj2EtvY7QjdtePvEMsP-net0VBweLkqQi22CMekFZU)

Decline optional cookiesAllow all cookies

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_1.png)

## What are cookies?

Cookies are small pieces of text that are used to store and receive identifiers on a web browser. We use cookies and similar technologies to offer Meta Products and understand information we receive about users, like their activity on other websites and apps.

If you don't have an account, we don't use cookies to personalize ads for you, and activity we receive will be used only for the security and integrity of our Products.

Learn more about cookies and the similar technologies we use in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_2.png)

## Why do we use cookies?

Cookies help us provide, protect and improve the Meta Products, such as by personalizing content, tailoring and measuring ads, and providing a safer experience.

While the cookies that we use may change from time to time as we improve and update the Meta Products, we use them for the following purposes:

- Authentication to keep users logged in
- To ensure security, site and product integrity
- To provide advertising, recommendations, insights and measurement, if we show you ads
- To provide site features and services
- To understand our Products' performance
- To enable analytics and research
- On third-party websites and apps to help companies that incorporate Meta technologies to share information with us about activity on their apps and websites.

Learn more about cookies and how we use them in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_3.png)

## What are Meta Products?

Meta Products include the Facebook, Instagram and Messenger apps, and any other features, apps, technologies, software or services offered by Meta under our Privacy Policy.

You can learn more about [Meta Products in our Privacy Policy](https://www.facebook.com/privacy/policy/?annotations[0]=0.ex.0-WhatProductsDoesThis&entry_point=cookie_consent_modal_what_are_meta_products).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_4.png)

## Your cookie choices

You have control over optional cookies we use:

- Our cookies on other apps and websites owned by companies that use Meta technologies, such as the Like button and Meta Pixel, can be used to personalize your ads, if we show you ads.
- We use cookies from other companies to show you ads off of Meta Products, and to provide features like maps and video on Meta Products.

You can review or change your choices at any time in your Cookies settings.