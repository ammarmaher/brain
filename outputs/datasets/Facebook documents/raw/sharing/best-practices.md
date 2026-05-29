---
url: https://developers.facebook.com/docs/sharing/best-practices/
title: Best Practices - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fbest-practices%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Sharing](https://developers.facebook.com/docs/sharing)

- [Overview](https://developers.facebook.com/docs/sharing/overview)
- [iOS](https://developers.facebook.com/docs/sharing/ios)
- [Android](https://developers.facebook.com/docs/sharing/android)
- [Web](https://developers.facebook.com/docs/sharing/web)
- [Messenger](https://developers.facebook.com/docs/sharing/messenger)
- [Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories)
- [Webmasters](https://developers.facebook.com/docs/sharing/webmasters)
- [Domain Verification](https://developers.facebook.com/docs/sharing/domain-verification)
- [Best Practices](https://developers.facebook.com/docs/sharing/best-practices)

On This Page

[Best Practices](https://developers.facebook.com/docs/sharing/best-practices/#best-practices)

[Recommendations for Websites](https://developers.facebook.com/docs/sharing/best-practices/#recommendations-for-websites)

[Images](https://developers.facebook.com/docs/sharing/best-practices/#images)

[Recommendations for Mobile](https://developers.facebook.com/docs/sharing/best-practices/#recommendations-for-mobile)

# Best Practices

Learn about the best practices for implementing Facebook Sharing for your websites and mobile apps to build app experiences that people understand and trust.

## Recommendations for Websites

- Implement the [Facebook Crawler](https://developers.facebook.com/docs/sharing/webmasters/crawler) to generate a preview of your publicly available Facebook content.

- You must enable **GZIP** and/or **deflate encoding** on your web server to ensure that your website is shared correctly by our crawler.

- Use [Open Graph meta tags](https://developers.facebook.com/docs/sharing/webmasters#markup) to ensure the Facebook Crawler scrapes useful information, such as title, description, and preview image, about your website when it is shared on Facebook.

- Use the [Sharing Debugger tool](https://developers.facebook.com/tools/debug) to test how your websites are viewed by our scraper. The debug tool also refreshes any scraped content we have for your websites, so it can be useful if you need to update them more often than the standard 24 hour update period.

- Track the interactions of people on your website as they happen with the [Facebook SDK for JavaScript](https://developers.facebook.com/docs/reference/javascript/). You can subscribe to events such as someone clicking on a Like button, sending a message with the Send button, or making a comment. The [`FB.Event.subscribe` reference guide](https://developers.facebook.com/docs/reference/javascript/FB.Event.subscribe/) to learn how to track these events.

- Turn on Follow to allow your content creators to share public updates with their followers, while saving personal updates for friends only. For example, journalists can allow readers or viewers to follow their public content, like photos taken on location or links to published articles. Follow is a simple, effective way for your audience to connect with you and keep up with your content, without adding you as a friend.

  - Enable Follow - Go to your Page Account Settings and click on the Followers tab. Check the box to allow followers, and if you’d like, you can adjust your settings for follower comments and notifications.
  - Fill out your timeline - Make sure your timeline looks professional: add a cover photo, your title and work history, key career milestones, and life events.
  - Observe – Follow other journalists, photographers, authors, and anyone else who has built up a large follower base. Visit their timelines and check out the types of content they share.
  - Post to your followers - Share interesting photos, links to your content, and updates about what you’re working on, etc. Any post you set to Public will be shown to your followers in Feed.

### Images

- Use images that are at least 1080 pixels in width for best display on high resolution devices. At the minimum, you should use images that are 600 pixels in width to display image link ads. We recommend using 1:1 images in your ad creatives for better performance with image link ads.
- Pre-cache your images by running the URL through the [URL Sharing Debugger tool](https://developers.facebook.com/tools/debug) to pre-fetch metadata for the website. You should also do this if you update the image for a piece of content.
- Use `og:image:width` and `og:image:height` Open Graph tags to specify the image dimensions to the crawler so that it can render the image immediately without having to asynchronously download and process it.

#### Images for Game Apps

- [Open Graph Stories images](https://developers.facebook.com/docs/games/opengraph) appear in a square format. Image ratios for these apps should be 600x600px.
- Non-open Graph Stories images appear in a rectangular format. You should use a 1.91:1 image ratio, such as 600x314px.

## Recommendations for Mobile

- Use [App Links](https://developers.facebook.com/docs/applinks/overview) to link to a specific location in your app from Facebook to enable a seamless experience.

- Use Message Dialog for private sharing. This allows people to share stories with content from your app in a more personal way to a more specific, limited audience using Facebook Messenger.

- Track your app events with [Facebook Events Manager](https://www.facebook.com/events_manager2).

- Use the HTTP User-Agent Header to track mobile referral traffic to your website from Facebook on iOS or Android. This is especially common when people share links to your site to Newfeed and their contacts click on these links on mobile. Your app should:

  - Watch for an HTTP Referer header with a value including `facebook.com`.
  - See if referral traffic originates from Facebook on iOS, Android, or on a mobile web browser on these channels. Check for a `HTTP User-Agent` with the value `FB_IAB/FB4A` for Android and `FBAN/FBIOS` for iOS.

On This Page

[Best Practices](https://developers.facebook.com/docs/sharing/best-practices/#best-practices)

[Recommendations for Websites](https://developers.facebook.com/docs/sharing/best-practices/#recommendations-for-websites)

[Images](https://developers.facebook.com/docs/sharing/best-practices/#images)

[Recommendations for Mobile](https://developers.facebook.com/docs/sharing/best-practices/#recommendations-for-mobile)