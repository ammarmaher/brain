---
url: https://developers.facebook.com/docs/sharing/webmasters
title: Webmasters - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fwebmasters%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters#a-guide-to-sharing-for-webmasters)

[Open Graph Markup](https://developers.facebook.com/docs/sharing/webmasters#markup)

[Markup Example](https://developers.facebook.com/docs/sharing/webmasters#markup-example)

[Basic Tags](https://developers.facebook.com/docs/sharing/webmasters#basic)

[Test Your Markup](https://developers.facebook.com/docs/sharing/webmasters#testing)

[Test Whether Facebook User-Agent Is Handled Properly](https://developers.facebook.com/docs/sharing/webmasters#user-agent)

[Media Content Types](https://developers.facebook.com/docs/sharing/webmasters#media)

[Video](https://developers.facebook.com/docs/sharing/webmasters#video)

[Images](https://developers.facebook.com/docs/sharing/webmasters#images)

[3D Assets](https://developers.facebook.com/docs/sharing/webmasters#3d-assets)

[Additional Resources](https://developers.facebook.com/docs/sharing/webmasters#additional-resources)

# A Guide to Sharing for Webmasters

This document describes how you optimize web-hosted content that people share to Facebook, regardless of whether it's shared from the desktop or mobile web or a mobile app.

This document provides info about:

- **[Open Graph markup](https://developers.facebook.com/docs/sharing/webmasters#markup)**
- **[Testing Your Markup](https://developers.facebook.com/docs/sharing/webmasters#testing)**
- **[Test Whether Facebook User-Agent Is Handled Properly](https://developers.facebook.com/docs/sharing/webmasters#user-agent)**
- **[Media Content Types](https://developers.facebook.com/docs/sharing/webmasters#media)**

## Open Graph Markup

Most content is shared to Facebook as a URL, so it's important that you mark up your website with Open Graph tags to take control over how your content appears on Facebook. For your website to be shared correctly by our crawler, your server must also use the **gzip** and **deflate** encodings.

Without these Open Graph tags, the [Facebook Crawler](https://developers.facebook.com/docs/sharing/webmasters/crawler) uses internal heuristics to make a best guess about the title, description, and preview image for your content. Designate this info explicitly with Open Graph tags to ensure the highest quality posts on Facebook.

Here's an example of content formatted with Open Graph tags for optimal display on Facebook:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/10956906_396737803821010_168799778_n.png?_nc_cat=107&ccb=1-7&_nc_sid=34156e&_nc_ohc=TImVNuT1YykQ7kNvwHL8G4I&_nc_oc=Adqtuvq_6iL6s2Cz5pKCp-t2Inkjun8niVcEBrcbGisVZh5XtF3w2pSp6zcv7WUnU9E&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=Gf0KXi9DO6oQSZriyf-Xww&_nc_ss=7b289&oh=00_Af52PgPkQIWsoXM_6vJ2duBWdte_7JWfXgTuyNflu_ZzKQ&oe=6A107080)

### Markup Example

For example, here's how to mark up an article, news story or blog post with `og:type="article"` and several additional properties:

```code
<meta property="og:url"                content="http://www.nytimes.com/2015/02/19/arts/international/when-great-minds-dont-think-alike.html" />
<meta property="og:type"               content="article" />
<meta property="og:title"              content="When Great Minds Don’t Think Alike" />
<meta property="og:description"        content="How much does culture influence creative thinking?" />
<meta property="og:image"              content="http://static01.nyt.com/images/2015/02/19/arts/international/19iht-btnumbers19A/19iht-btnumbers19A-facebookJumbo-v2.jpg" />
```

The properties include descriptive meta-data about the article that we specifically want to present when someone shares the article.

### Basic Tags

These are the most basic meta tags that you should use for all content types:

| Tag | Description |
| --- | --- |
| `og:url` | The [canonical URL](https://developers.facebook.com/docs/sharing/webmasters/getting-started/versioned-link) for your page. This should be the undecorated URL, without session variables, user identifying parameters, or counters. Likes and Shares for this URL will aggregate at this URL. For example, mobile domain URLs should point to the desktop version of the URL as the canonical URL to aggregate Likes and Shares across different versions of the page. |
| `og:title` | The title of your article without any branding such as your site name. |
| `og:description` | A brief description of the content, usually between 2 and 4 sentences. This will displayed below the title of the post on Facebook. |
| `og:image` | The URL of the image that appears when someone shares the content to Facebook. See [below](https://developers.facebook.com/docs/sharing/webmasters#images) for more info, and check out our [best practices guide](https://developers.facebook.com/docs/sharing/best-practices#images) to learn how to specify a high quality preview image. |
| `fb:app_id` | In order to use [Facebook Insights](https://developers.facebook.com/docs/sharing/referral-insights) you must add the app ID to your page. Insights lets you view analytics for traffic to your site from Facebook. Find the app ID in your [App Dashboard](https://developers.facebook.com/apps/redirect/dashboard). |

You may also want to add two additional tags to improve distribution of your content and more engagement:

| Tag | Description |
| --- | --- |
| `og:type` | The type of media of your content. This tag impacts how your content shows up in Feed. If you don't specify a type,the default is `website`. Each URL should be a single object, so multiple `og:type` values are not possible. Find the full list of object types in [Object Types Reference](https://l.facebook.com/l.php?u=http%3A%2F%2Fogp.me%2F%23types&h=AUDt1xILZ6js1_9PvsPclZwBLdVa7PRnkLgTKnvI-04qnwy9Q1dTO7iu7KTX3JZarQKNKq09osaVqr5R1WXwRc9CQAB2eg8I112ZIBdvbimseKDLFRp2I3avMtTtYyyUlcEXjDFQzBT2t18cZneKF1byB-M) |
| `og:locale` | The locale of the resource. Defaults to `en_US`. You can also use `og:locale:alternate` if you have other available language translations available. Learn about the locales we support in our [documentation on localization](https://developers.facebook.com/docs/internationalization#locales). |

The full list of standard object properties is in our [Object Properties Reference](https://developers.facebook.com/docs/sharing/opengraph/object-properties#standard).

## Test Your Markup

To see how your markup appears to the [Facebook Crawler](https://developers.facebook.com/docs/sharing/webmasters/crawler) enter a URL into [Sharing Debugger](https://developers.facebook.com/tools/debug/). It will show which meta tags the crawler scrapes as well as any errors or warnings.

The debugger also triggers a scrape of your page, so if you do have errors in your HTML you can use the debugger to update your content. See [Updating Objects](https://developers.facebook.com/docs/sharing/opengraph/using-objects#update) to learn more.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/15323871_1007179786076658_1749334613383184384_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=xrPqeUTGTCMQ7kNvwGVxgoC&_nc_oc=AdrL_Yi9JzfN3OVt8m7Z4DDyRjDeG-AfYmqDv3qBChSRfwVhKvkF501ThtRQwwIc69U&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=Gf0KXi9DO6oQSZriyf-Xww&_nc_ss=7b289&oh=00_Af7Ew49JL-k47qKWg0IuMJrRZ9fXmAe74LphSdl_C3pQKg&oe=6A24D0E0)

## Test Whether Facebook User-Agent Is Handled Properly

1. Open your browser.

2. Change the user-agent to match FB user-agent. For more information on changing the user-agent, see [http://osxdaily.com/2013/01/16/change-user-agent-chrome-safari-firefox/](https://l.facebook.com/l.php?u=https%3A%2F%2Fosxdaily.com%2F2013%2F01%2F16%2Fchange-user-agent-chrome-safari-firefox%2F&h=AUDM_kfieXuG4CNoPd6BnKaeEBnfuNm7CMrapA7VY1vOdIW1tmX2O0ozWRI_PqU-v5bkcFfxNCDwHw3jswD-pt3OG5EpAlayey-kmordoU5L6Jn9eOqroa7EQ4gHa3oDAFtrs0isW40ehg):

   - **Develop Menu** \> **User-Agent** \> **Other**

   - Set user-agent to: `facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
     `
3. Load the problem URL.

4. Set the user-agent to that of a mobile browser, say Safari - iPhone:


**Develop Menu** \> **User-Agent** \> **Safari — iOS 10 — iPhone**
5. Load the problem URL.

6. If this is a user-agent issue, the page will load correctly in Step 5 but not Step 3.


## Media Content Types

You can add additional markup if your content includes audio, video, or location information. See all standard object properties in our [Object Types Reference](https://developers.facebook.com/docs/reference/opengraph/#object-type).

### Video

You can use `og:video` for all content types. This section describes how to use additional tags to optimize the look of videos on Facebook. Facebook supports both mp4 and Flash videos.

Use a secure URL for both the `og:video:url` and `og:video:secure_url` tags to make your video eligible to play in-line in Feed. Note that your video is not guaranteed to play in-line based on a variety of factors.

| Meta tag | Description |
| --- | --- |
| `og:video` | The URL for the video. If you want the video to play in-line in Feed, you should use the https:// URL if possible. |
| `og:video:url` | Equivalent to `og:video` |
| `og:video:secure_url` | Secure URL for the video. Include this even if you set the secure URL in `og:video`. |
| `og:video:type` | MIME type of the video. Either `application/x-shockwave-flash` or `video/mp4`. |
| `og:video:width` | Width of video in pixels. This property is required for videos. |
| `og:video:height` | Height of video in pixels. This property is required for videos. |
| `og:image` | Specify an image for a high quality preview in Feed |

### Images

Use this set of properties for content that contains more than one image. See [Sharing Best Practices](https://developers.facebook.com/docs/sharing/best-practices#images) for guidance on how best to use `og:image`.

| Meta tag | Description |
| --- | --- |
| `og:image` | URL for the image. To update an image after it's been published, use a new URL for the new image. **Images are cached based on the URL and won't be updated unless the URL changes.** |
| `og:image:url` | Equivalent to `og:image` |
| `og:image:secure_url` | https:// URL for the image |
| `og:image:type` | MIME type of the image. One of `image/jpeg`, `image/gif` or `image/png` |
| `og:image:width` | Width of image in pixels. Specify height and width for your image to ensure that the image loads properly the first time it's shared. |
| `og:image:height` | Height of image in pixels. Specify height and width for your image to ensure that the image loads properly the first time it's shared. |

### 3D Assets

Please refer to our 3D Posts [Open Graph Sharing document](https://developers.facebook.com/docs/sharing/3d-posts/open-graph-sharing).

## Additional Resources

- [Facebook Crawler](https://developers.facebook.com/docs/sharing/webmasters/crawler)
- [Optimizing Metadata](https://developers.facebook.com/docs/sharing/webmasters/optimizing)
- [Object Type Reference](https://l.facebook.com/l.php?u=http%3A%2F%2Fogp.me%2F%23types&h=AUCzOvszAeqY8A0kuIJlcbNSHb1aFd4qHchslXFOU5vpcnj8zCZvGaruNHsa0VvZb7HLDN0mSRj4ul-1bAn1LqZqTd5lccJGso1lEhfWdh6vNp9lLvq6aurtYE4xDd38szHq1YDPFe9DyA)
- [Sharing Best Practices](https://developers.facebook.com/docs/sharing/best-practices)
- [Updating Objects](https://developers.facebook.com/docs/sharing/opengraph/using-objects#update)

On This Page

[A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters#a-guide-to-sharing-for-webmasters)

[Open Graph Markup](https://developers.facebook.com/docs/sharing/webmasters#markup)

[Markup Example](https://developers.facebook.com/docs/sharing/webmasters#markup-example)

[Basic Tags](https://developers.facebook.com/docs/sharing/webmasters#basic)

[Test Your Markup](https://developers.facebook.com/docs/sharing/webmasters#testing)

[Test Whether Facebook User-Agent Is Handled Properly](https://developers.facebook.com/docs/sharing/webmasters#user-agent)

[Media Content Types](https://developers.facebook.com/docs/sharing/webmasters#media)

[Video](https://developers.facebook.com/docs/sharing/webmasters#video)

[Images](https://developers.facebook.com/docs/sharing/webmasters#images)

[3D Assets](https://developers.facebook.com/docs/sharing/webmasters#3d-assets)

[Additional Resources](https://developers.facebook.com/docs/sharing/webmasters#additional-resources)