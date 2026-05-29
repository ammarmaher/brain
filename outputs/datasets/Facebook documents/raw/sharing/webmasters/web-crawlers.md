---
url: https://developers.facebook.com/docs/sharing/webmasters/web-crawlers
title: Meta Web Crawlers - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fwebmasters%2Fweb-crawlers%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Sharing](https://developers.facebook.com/docs/sharing)

- [Overview](https://developers.facebook.com/docs/sharing/overview)
- [iOS](https://developers.facebook.com/docs/sharing/ios)
- [Android](https://developers.facebook.com/docs/sharing/android)
- [Web](https://developers.facebook.com/docs/sharing/web)
- [Messenger](https://developers.facebook.com/docs/sharing/messenger)
- [Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories)
- [Webmasters](https://developers.facebook.com/docs/sharing/webmasters)


  - [Getting Started](https://developers.facebook.com/docs/sharing/webmasters/getting-started)
  - [Link Sharing FAQ](https://developers.facebook.com/docs/sharing/webmasters/faq)
  - [Meta Web Crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers)
  - [Optimization](https://developers.facebook.com/docs/sharing/webmasters/optimizing)
  - [Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images)

- [Domain Verification](https://developers.facebook.com/docs/sharing/domain-verification)
- [Best Practices](https://developers.facebook.com/docs/sharing/best-practices)

On This Page

[Meta Web Crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#meta-web-crawlers)

[FacebookExternalHit](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify)

[Crawler Requirements](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#crawler-requirements)

[Troubleshooting](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#troubleshooting)

[Meta-WebIndexer](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#meta-webindexer)

[Meta-ExternalAds](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#meta-externalads)

[Meta-ExternalAgent](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify-2)

[Meta-ExternalFetcher](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify-3)

[The robots.txt file](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify-4)

[Crawler IPs](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify-5)

[Example Response](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#example-response)

[Contact us](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#contact-us)

# Meta Web Crawlers

Meta uses web crawlers (software which fetches content from websites or web apps) for a number of different purposes. This page lists the User Agent (UA) strings that identify Meta’s most common web crawlers and what each of those crawlers are used for.

We make it easy for site managers and content owners to indicate their preferences by using industry-standard practices like robots.txt rather than non-standard formats like NoAI tags. This page provides guidance on how to configure your robots.txt file so that our crawlers interact properly with your site.

## FacebookExternalHit

The primary purpose of FacebookExternalHit is to crawl the content of an app or website that was shared on one of Meta’s family of apps, such as Facebook, Instagram, or Messenger. The link might have been shared by copying and pasting or by using the [Facebook social plugin](https://developers.facebook.com/docs/plugins). This crawler gathers, caches, and displays information about the app or website such as its title, description, and thumbnail image.

The specific UA string that you will see in your log files will be similar to one of the following:

- `facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)`
- `facebookexternalhit/1.1`

Note that the FacebookExternalHit crawler might bypass robots.txt when performing security or integrity checks, such as checking for malware or malicious content.

### Crawler Requirements

- Your server must use **gzip** and **deflate** encodings.
- Any Open Graph properties need to be listed before the first 1 MB of your website or app, or it will be cutoff.
- Ensure that the content can be crawled by the crawler within a few seconds or Facebook will be unable to display the content.
- Your app or website should either generate and return a response with all required properties according to the bytes specified in the `Range` header of the crawler request or it should ignore the `Range` header altogether.
- Add to your allow list either the [user agent strings or the IP addresses](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify) (more secure) used by the crawler.

### Troubleshooting

If your app or website content is not available at the time of crawling, you can force a crawl once it becomes available either by passing the URL through the [Sharing Debugger tool](https://developers.facebook.com/tools/debug) or by using the [Sharing API](https://developers.facebook.com/docs/sharing/opengraph/using-objects#update).

You can simulate a crawler request with the following code:

```code
curl -v --compressed -H "Range: bytes=0-524288" -H "Connection: close" -A "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" "$URL"
```

## Meta-WebIndexer

The Meta-WebIndexer crawler navigates the web to improve Meta AI search result quality for users. In doing so, Meta analyzes online content to enhance the relevance and accuracy of Meta AI. Allowing Meta-WebIndexer in your robots.txt file helps us cite and link to your content in Meta AI's responses.

The specific UA string that you will see in your log files will be similar to one of the following:

- `meta-webindexer/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)`
- `meta-webindexer/1.1`

## Meta-ExternalAds

The Meta-ExternalAds crawler crawls the web for use cases such as improving advertising and other business-related products and services.

The specific UA string that you will see in your log files will be similar to one of the following:

- `meta-externalads/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)`
- `meta-externalads/1.1`

## Meta-ExternalAgent

The Meta-ExternalAgent crawler crawls the web for use cases such as training foundation AI models or improving products by indexing content directly.

The specific UA string that you will see in your log files will be similar to one of the following:

- `meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)`
- `meta-externalagent/1.1`

## Meta-ExternalFetcher

The Meta-ExternalFetcher crawler fetches individual links at a user's request and supports product functions such as evaluating and improving agentic AI capabilities—including helping AI navigate websites to complete tasks for users. Accordingly, this crawler may bypass robots.txt rules.

The specific UA string that you will see in your log files will be similar to one of the following:

- `meta-externalfetcher/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)`
- `meta-externalfetcher/1.1`

## The robots.txt file

By configuring the robots.txt file on your website, you can specify to the Meta web crawlers how you would prefer them to interact with your site. In order to block these crawlers, add a disallow for the relevant crawler to robots.txt. The Meta-ExternalFetcher crawler may bypass robots.txt because it performs fetches that were requested by the user. Also, the FacebookExternalHit crawler might bypass robots.txt when performing security or integrity checks.

```code
User-agent: meta-externalagent
Allow: /                    # Allow everything
Disallow: /private/         # Disallow a specific directory
```

Please allow up to 24 hours for changes to `robots.txt` to take effect because crawlers may cache the contents of `robots.txt` for up to 24 hours.

## Crawler IPs

If a crawler has a source IP address that is on the list generated by the following command, it indicates that the crawler is coming from Meta.

```code
whois -h whois.radb.net -- '-i origin AS32934' | grep ^route
```

Note that these IP addresses change often. For more information, please go to our [Peering webpage](https://www.facebook.com/peering) or the related [downloadable data](https://www.facebook.com/peering/geofeed) (CSV format).

### Example Response

```code
...
route:      69.63.176.0/21
route:      69.63.184.0/21
route:      66.220.144.0/20
route:      69.63.176.0/20
route6:     2620:0:1c00::/40
route6:     2a03:2880::/32
route6:     2a03:2880:fffe::/48
route6:     2a03:2880:ffff::/48
route6:     2620:0:1cff::/48
...
```

## Contact us

If you have questions or concerns, please contact us at [webmasters@meta.com](mailto:webmasters@meta.com) (Meta Web Masters).

On This Page

[Meta Web Crawlers](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#meta-web-crawlers)

[FacebookExternalHit](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify)

[Crawler Requirements](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#crawler-requirements)

[Troubleshooting](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#troubleshooting)

[Meta-WebIndexer](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#meta-webindexer)

[Meta-ExternalAds](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#meta-externalads)

[Meta-ExternalAgent](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify-2)

[Meta-ExternalFetcher](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify-3)

[The robots.txt file](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify-4)

[Crawler IPs](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#identify-5)

[Example Response](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#example-response)

[Contact us](https://developers.facebook.com/docs/sharing/webmasters/web-crawlers/#contact-us)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUBIShb5-9RDMZQCjmFguHhA1E7MYiTLeFcxa4HU2Sa1ubVodYXDKAc4kFHDihmPgand4CEc01Cu-efzeCC2d871Wjg_pjS56XptdtEXd0YP2X6x2vse8SXie8st3LZjsic3HKE-L2SeHA) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUCfV9pLvx_-E0rgu8Zc4ZKifEtz_nu8Atw4kYJDogEMEDsz_y-m-f-M9pwOyFzJkTpAn9xtPpSueEIU6hqaf3kYS6z51JsSR76M9uI1eezTWB2ANupGPdhvvk8BrExYVmyi7YuMhO-LFw) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUBL0BF2hLj9QdF8d44oGGDHv2bRm28E3cmQisUYYNzQM9ZTSApKmjiUEkAiLjgMX8lbKnisYAAilndIp8KpKlXmu0YAlTNpDroFxuacRyynKdcmY2SxA0HQNdPnpEJe-FALhZI7sPvO3LRz4YhiTvBgDZY) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUACQh68Z7d2ai5-yrJiLWZd4adLL4zM9bS5eBZZ8mPnOzBXnBhRk8LkSRyeagyrenx_gTPFtWzXY0QUbVH69e84Om-xCjdjUAv12KN9iwRr0AJ5kiEkMd077UDYnJYd2RDzmdocA0Hpbw)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUCMbqzKdunVbgBZ7TB8vguRJH40_WsEyyaprGM6Nr2OimxfJOPWkS5-wQ1dH0XbAU6jvirIgbBjitIl38NKVRXeIeTwMr7gUBXA7YCjz3Oq9jtNVQ1wue0Yg5SpLXkLKiIa2IALRk7pzg)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUB92X2zDaFFv795xlSo_u9EMUVigJ6tY5P9dLB3-OujG8htK3fr485m3l5MKjEy1H6CGN9E1BKN6YM3xQSXmE2EMidDlKnWhxNQGgSefpqZDYQx_EzscBSNNFNww3wAvYn2rupz4SXT4Q)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCiprLM6swRv9pSpwyEWcOEropf3I9IoMQvpPq-p6oNqbfsE-kcEd2ceE6NIwyj_2jBgoONsT1YW--2Jno-cJLRShJ50EiheMn6Agd0uM3MKjzWiBj-ijtWnIhJViJKu6X0impE0iDmDA)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUAw57NhSEVvFL2XTKOF51VZQl_JVBrD7X7MvIqV8ZxKuaiNRUf6GLBVlnUDK0E_XmtSos63y_xQC1MWSWBenD8j8ChluNpNpKqQiy-W-Wn-BRipMqd6LPVkpYHj75wSSEu8j6pRvAjnGg)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUAtnwH5F2ncFuRfaZsOmEz5-PCQAtpOBXKu15eniSjG401UXe9Lf-2xSuqWB8nSpbEjOSqJkuhBfscDaDeABm9M4y80LIHWzXmqpQVMthxN9D6TUwsFmWmOj0DXLeNc1Tm8tX9cIPmNHQ)

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