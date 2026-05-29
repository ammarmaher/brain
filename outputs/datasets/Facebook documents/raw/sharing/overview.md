---
url: https://developers.facebook.com/docs/sharing/overview
title: Overview - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Foverview%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Sharing on Facebook](https://developers.facebook.com/docs/sharing/overview#sharing-on-facebook)

[The Sharing Ecosystem](https://developers.facebook.com/docs/sharing/overview#ecosystem)

[Content Types](https://developers.facebook.com/docs/sharing/overview#content)

[App Links](https://developers.facebook.com/docs/sharing/overview#app_links)

[Hashtags](https://developers.facebook.com/docs/sharing/overview#hashtags)

[Ways to Share](https://developers.facebook.com/docs/sharing/overview#methods)

[Buttons](https://developers.facebook.com/docs/sharing/overview#button_option)

[Native Dialogs](https://developers.facebook.com/docs/sharing/overview#dialogs)

[Sharing to Stories](https://developers.facebook.com/docs/sharing/overview#sharing-to-stories)

[Optimizing Your Content](https://developers.facebook.com/docs/sharing/overview#optimize)

[Markup](https://developers.facebook.com/docs/sharing/overview#markup)

[Updating URLs](https://developers.facebook.com/docs/sharing/overview#updating-urls)

# Sharing on Facebook

After you integrate Facebook Login, Facebook Sharing, or Facebook Gaming, certain App Events are automatically logged and collected for [Events Manager](https://www.facebook.com/events_manager), unless you disable Automatic App Event Logging. We recommend all app developers using Facebook Login, Facebook Sharing, or Facebook Gaming to understand how this functionality works. For details about what information is collected and how to disable Automatic App Event Logging, see [Automatic App Event Logging.](https://www.developers.facebook.com/docs/app-events/automatic-event-collection-detail)

Sharing is a simple way of letting people bring content from your website or mobile app to Facebook. Sharing is triggered when someone clicks a [social plugin](https://developers.facebook.com/docs/plugins) like the Share or Send button. This launches the corresponding Share or Message dialog. You can also choose to design your own button to launch one of these dialogs.

This document describes:

- The **[types of content](https://developers.facebook.com/docs/sharing/overview#content)** people can share to Facebook
- **[Ways to share](https://developers.facebook.com/docs/sharing/overview#methods)** content from your app
- How to **[optimize your content](https://developers.facebook.com/docs/sharing/overview#optimize)** for sharing

## The Sharing Ecosystem

Sharing on Facebook depends on a few core components:

**URLs**: In most cases, including sharing from mobile apps, your content is shared on Facebook as a link, whether it's an article, image, video, or something else

**The Facebook Crawler**: When someone shares your content, our crawler will scrape the page to render a preview on Facebook

**Open Graph Tags**: Adding Open Graph meta tags to the `<head>` of your web page HTML will provide the crawler with structured info like a title, description, and thumbnail image for the content

**Sharing Interfaces**: There are a few different end-user experiences you can choose from to let people share from your website or app to Facebook. Here's an overview of how it works:

| Button Trigger | Sharing Interface Launched | Publishing Behavior |
| --- | --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/11057204_1603676239877385_1347380891_n.png?_nc_cat=108&ccb=1-7&_nc_sid=34156e&_nc_ohc=zc3opiP2KvUQ7kNvwHjuyyC&_nc_oc=AdpDD1nK3qYt8AK5Pf5E2kI5C14NHFsmp-CHuec6RMIiKxtXHWS6gHbdRXqq-tn6ET4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=LaMw9n_XImnoxhjrVl3wGw&_nc_ss=7b289&oh=00_Af6uAvefKJ1P0AcmVgXCAqf002TG5fwYAOQX-2dgDS2Q0g&oe=6A10F9E2)<br>**[Share button](https://developers.facebook.com/docs/plugins/share-button)** | **Web:** [Share dialog](https://developers.facebook.com/docs/sharing/overview#share)<br>**Mobile:** Fast-app switch to native Share dialog | Appears in Timeline and Activity Log.<br>May appear in Feed. |
| ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=596644435649508&version=1778768854)<br>**[Send to Messenger button](https://developers.facebook.com/docs/messenger-platform/discovery/send-to-messenger-plugin)** | **Web:** [Message dialog](https://developers.facebook.com/docs/sharing/overview#message)<br>**Mobile:** Fast-app switch to native Message dialog | Sent as a Facebook message |
| Custom Button | Can launch:<br>Share dialog<br>Message dialog | Follows the publishing behavior of the Share dialog. |

## Content Types

People can share the following kinds of content to Facebook:

- **Links** \- Most content is a URL which references an HTML page. To provide the most relevant information, you should mark up your page with Facebook-specific meta tags. See [A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters).

- **Photos** \- Directly upload one or more user-generated photos.

- **Videos** \- Directly upload a user-generated video.

- **Multimedia** \- Directly upload a combination of photos and videos.

- **[Open Graph Stories](https://developers.facebook.com/docs/sharing/opengraph)** \- Use Open Graph actions and objects to create rich stories through a strongly-typed API.


### App Links

You can link back to your app from the content people share in Feed. [App Links](https://developers.facebook.com/docs/applinks/overview) launch your app from shared content. You can even link to a specific context within your app.

### Hashtags

You can associate a hashtag with a shared link, photo, or video.

## Ways to Share

We want to make it as easy and as flexible as possible for people to share content from your app with the audience they want. With these options, you can first choose the sharing experience for people using your app, and then choose an implementation method.

### Buttons

When you want the simplest sharing integration with Facebook, you should use buttons that trigger our [dialogs](https://developers.facebook.com/docs/sharing/overview#dialogs). The Facebook SDKs provide buttons that you can use. None of these options requires you to implement Facebook Login.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=5768437033275854&version=1778768854)

#### Web

You can use [Social Plugins](https://developers.facebook.com/docs/plugins) such as the Like, Share and Send buttons. These are available for desktop and mobile web.

#### Mobile

We also have native Like, Share, and Send buttons for [iOS](https://developers.facebook.com/docs/sharing/ios#buttons) and [Android](https://developers.facebook.com/docs/sharing/android#buttons).

#### Custom

You can also create your own custom button to trigger a Like, Share, or Send, across all platforms.

### Native Dialogs

When you use native Facebook dialogs you can enable sharing without adding Facebook Login. Like our native buttons, they offer out-of-the-box implementation.

The Share Dialog is an easy way to let people share content without requiring them to log into your app or grant any permissions. It works on Web, Android, and iOS.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/10935987_381745888663465_624580494_n.png?_nc_cat=101&ccb=1-7&_nc_sid=34156e&_nc_ohc=Z1yj-z_IhUEQ7kNvwE2nNYU&_nc_oc=AdplmIuyVnfZZycKjvhsImSabaRrgvGyieGrsRCUDiB9Oy26hynPurL2n46mLeT6cuw&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=LaMw9n_XImnoxhjrVl3wGw&_nc_ss=7b289&oh=00_Af7Us_c1O1HRP3z4NFF_pFvRHWwoydKuhF3HR-bomTN4-g&oe=6A1110EC)

On mobile, when someone shares with the Share Dialog, the dialog makes a fast app-switch to the Facebook app on their device. We also have a web dialog as a fallback if someone doesn't have the native Facebook app installed.

#### Message Dialog

Use the Message dialog to let people privately share content to Messenger. Like the Share dialog, it's a native sharing component that doesn't require you to implement Facebook Login.

The Message dialog enables people to share links, images and Open Graph stories. On mobile, someone must have the native Messenger app installed.

### Sharing to Stories

You can use Android implicit intents and iOS custom URL schemes to pass photos, videos, and stickers to the Facebook app. The Facebook app will receive this content and load it in the Story Composer so the User can publish it to their Facebook Stories.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/31741492_822647327931412_2825487507469107200_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=02LnQ8BVFWIQ7kNvwHRqFro&_nc_oc=Adqsgzl3GsExigL17km3cbsmxH9J-aHc2l7qqc6vM63eGFCsnnea0NT1H1SgEKEWsoc&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=LaMw9n_XImnoxhjrVl3wGw&_nc_ss=7b289&oh=00_Af7pOdnT_KWJVGk2D7Ms9tTo-A-ZMvG8vVP86la0CKGeYg&oe=6A2596E9)

## Optimizing Your Content

### Markup

It's important to mark up your website's HTML with Open Graph tags to manage how your content appears on Facebook. Without these tags, the Facebook crawler will do its best to identify content such as title, description, and image for your content.

Optimize your content for sharing to Facebook by adding Open Graph tags to the `<head>` of your page's HTML. These tags describe the content shared. This includes content type such as image, video, or article and any additional attributes.

Learn about tags you should include with your content in [Markup for Sharing](https://developers.facebook.com/docs/sharing/webmasters#markup).

### Updating URLs

If you move content to a new URL, the Likes, Shares, and Comments on that original URL won’t automatically migrate. To continue aggregating these actions at a new URL, you should point the Facebook crawler to the old page that represents the canonical URL for your content. Learn how in [this doc for webmasters](https://developers.facebook.com/docs/sharing/webmasters/getting-started/versioned-link).

On This Page

[Sharing on Facebook](https://developers.facebook.com/docs/sharing/overview#sharing-on-facebook)

[The Sharing Ecosystem](https://developers.facebook.com/docs/sharing/overview#ecosystem)

[Content Types](https://developers.facebook.com/docs/sharing/overview#content)

[App Links](https://developers.facebook.com/docs/sharing/overview#app_links)

[Hashtags](https://developers.facebook.com/docs/sharing/overview#hashtags)

[Ways to Share](https://developers.facebook.com/docs/sharing/overview#methods)

[Buttons](https://developers.facebook.com/docs/sharing/overview#button_option)

[Native Dialogs](https://developers.facebook.com/docs/sharing/overview#dialogs)

[Sharing to Stories](https://developers.facebook.com/docs/sharing/overview#sharing-to-stories)

[Optimizing Your Content](https://developers.facebook.com/docs/sharing/overview#optimize)

[Markup](https://developers.facebook.com/docs/sharing/overview#markup)

[Updating URLs](https://developers.facebook.com/docs/sharing/overview#updating-urls)