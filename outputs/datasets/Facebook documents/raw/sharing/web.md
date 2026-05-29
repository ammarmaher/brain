---
url: https://developers.facebook.com/docs/sharing/web
title: Web - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fweb%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Sharing](https://developers.facebook.com/docs/sharing)

- [Overview](https://developers.facebook.com/docs/sharing/overview)
- [iOS](https://developers.facebook.com/docs/sharing/ios)
- [Android](https://developers.facebook.com/docs/sharing/android)
- [Web](https://developers.facebook.com/docs/sharing/web)


  - [Share Dialog](https://developers.facebook.com/docs/sharing/reference/share-dialog)
  - [Feed Dialog](https://developers.facebook.com/docs/sharing/reference/feed-dialog)
  - [Send Dialog](https://developers.facebook.com/docs/sharing/reference/send-dialog)

- [Messenger](https://developers.facebook.com/docs/sharing/messenger)
- [Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories)
- [Webmasters](https://developers.facebook.com/docs/sharing/webmasters)
- [Domain Verification](https://developers.facebook.com/docs/sharing/domain-verification)
- [Best Practices](https://developers.facebook.com/docs/sharing/best-practices)

On This Page

[Sharing on the Web](https://developers.facebook.com/docs/sharing/web#sharing-on-the-web)

[Prerequisites](https://developers.facebook.com/docs/sharing/web#prereqs)

[Share Content](https://developers.facebook.com/docs/sharing/web#sharecontent)

[Social Plugins](https://developers.facebook.com/docs/sharing/web#linktrigger)

[Using Web Dialogs](https://developers.facebook.com/docs/sharing/web#usingsharedialog)

# Sharing on the Web

You can add quick and simple ways for people to post content from your website to Facebook. When people share from your site, your site gets attribution as a link to your site embedded in the shared post.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12601310_1528649967444698_1002859386_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=7QjSrpWqWZUQ7kNvwF-qU7F&_nc_oc=AdpX3wEMrYg7GP7LrEoOJ6ccLi5E7olB3uV4biM44Ve9_KBPDdMimLbc4_r9mM9TT6Y&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=30qcBMo_A0D_6J426mFFwA&_nc_ss=7b289&oh=00_Af4DSEKlBOrIXE4chIMeg3zbuLszT98CJ3P2Qf2o6JeOUA&oe=6A257A56)

People can share different types of content from the web, though basic links are the most common:

- **Links** \- Share articles, photos, videos and other content as a URL that points to the page where your content lives.
- **Open Graph Stories** \- You can use Open Graph to let people publish rich, structured stories using your app, such as _Julie read a book on Goodreads_. See [Open Graph Stories](https://developers.facebook.com/docs/opengraph).

## Prerequisites

#### Open Graph Markup

Before you enable sharing, you should mark up your page's HTML with [Open Graph tags](https://developers.facebook.com/docs/sharing/webmasters#markup).

This helps make sure that when people share from your site, your content appears the way you want on Facebook, with a title, description, and image thumbnail.

If you have a mobile subdomain, you can optimize your content by [Optimizing for a Mobile Subdomain](https://developers.facebook.com/docs/sharing/webmasters#optimize).

Note: If your app share links to the iTunes or Google Play stores, we do not post any images or descriptions that you specify in the share. Instead we post some app information we scrape from the app store directly with the Webcrawler. This may not include images. To preview a link share to iTunes or Google Play, enter your URL into the [Sharing Debugger](https://developers.facebook.com/tools/debug/).

#### Learn more

- [Webmasters Guide](https://developers.facebook.com/docs/sharing/webmasters)
- [Sharing Best Practices](https://developers.facebook.com/docs/sharing/best-practices)

## Share Content

You can enable sharing from your website using social plugins or your own UI that opens Facebook sharing dialogs.

### Social Plugins

If you want to enabling sharing on the web, use the [Share Button](https://developers.facebook.com/docs/plugins/share-button/), which gives people the ability to choose where they want to share, including in groups and private messages on Messenger

### Using Web Dialogs

If a plugin doesn't work for your site, you also have the option of opening our dialogs directly. You will create a button on your site and call the dialog. Most commonly, you will use either:

- [Share dialog](https://developers.facebook.com/docs/sharing/reference/share-dialog), which gives people the most flexibility. They can choose where they want to share, including in groups and private messages on Messenger
- [Send dialog](https://developers.facebook.com/docs/sharing/reference/send-dialog)
- [Feed dialog](https://developers.facebook.com/docs/sharing/reference/feed-dialog/)

On This Page

[Sharing on the Web](https://developers.facebook.com/docs/sharing/web#sharing-on-the-web)

[Prerequisites](https://developers.facebook.com/docs/sharing/web#prereqs)

[Share Content](https://developers.facebook.com/docs/sharing/web#sharecontent)

[Social Plugins](https://developers.facebook.com/docs/sharing/web#linktrigger)

[Using Web Dialogs](https://developers.facebook.com/docs/sharing/web#usingsharedialog)