---
url: https://developers.facebook.com/docs/threads/threads-web-intents
title: Web Intents - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fthreads-web-intents%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)
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

[Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents#web-intents)

[Post Intent](https://developers.facebook.com/docs/threads/threads-web-intents#post-intent)

[URL Format](https://developers.facebook.com/docs/threads/threads-web-intents#url-format)

[Supported Parameters](https://developers.facebook.com/docs/threads/threads-web-intents#supported-parameters)

[Examples](https://developers.facebook.com/docs/threads/threads-web-intents#examples)

[Follow Intent](https://developers.facebook.com/docs/threads/threads-web-intents#follow-intent)

[URL Format](https://developers.facebook.com/docs/threads/threads-web-intents#url-format-2)

[Supported Parameters](https://developers.facebook.com/docs/threads/threads-web-intents#supported-parameters-2)

[Examples](https://developers.facebook.com/docs/threads/threads-web-intents#examples-2)

# Web Intents

Web intents offer a simple way for people to interact with Threads directly from your website, starting with the ability to quickly create posts and follow profiles.

When clicking on a Web intent URL, a new window opens and users are directed to Threads to complete the intended action. On mobile (iOS and Android), web intents will open the Threads app whenever it is installed. If they are not already logged-in, they will have the opportunity to sign in or create a Threads account.

When linking intents to an image, we recommend using the Threads logo available in our [Threads Brand Resources](https://about.meta.com/brand/resources/instagram/threads/).

## Post Intent

Post intents allow people to easily share their favorite content from your website directly to Threads, in order to increase your reach, spark conversations and drive traffic.

### URL Format

The URL format is [https://www.threads.com/intent/post](https://www.threads.com/intent/post).

### Supported Parameters

The post intent flow supports the following query string parameters.

| Name | Description |
| --- | --- |
| `text` | **Optional.**<br>The text that the post dialog should be prefilled with. |
| `url` | **Optional.**<br>The URL for an optional link attachment. |
| `tag` | **Optional.**<br>The topic tag that the post dialog should be prefilled with.<br>**Note:** Newlines, tabs, periods (.), and ampersands (&) are not allowed in topic tags. The maximum length of a valid topic tag is 50 characters. |
| `reply_control` | **Optional.**<br>The initial audience that is allowed to reply to a post.<br>**Values:**`everyone`, `accounts_you_follow`, `mentioned_only`, `followers_only` |
| `reply_post_shortcode` | **Optional.**<br>The shortcode of the parent post that you are replying to. When this parameter is included, it will open the Threads post composer in reply mode with the parent post visible. |
| `quote_post_shortcode` | **Optional.**<br>The shortcode of the post that is being quoted. When this parameter is included, it will open the Threads post composer with the quoted post attached. |

All parameter values should be encoded using [percent-encoding](https://l.facebook.com/l.php?u=https%3A%2F%2Fdatatracker.ietf.org%2Fdoc%2Fhtml%2Frfc3986%23section-2.1&h=AUDzkB5KY0Dzi9M2HC1MuOawo-rH7DuZA4271W8l-YNQdYCKwMssEqbFp6wSm_VbiMJtpGoJviYhqG0bbfmsTGwyR_zO7MHPjTjGDGpsdF8w8UKT_H4LYTRfUWbIkJY-BqfpTugIcSfQwA) ("URL encoding") so that the values can safely be passed via the URL.

### Examples

| Example | URL |
| --- | --- |
| Only text | [https://www.threads.com/intent/post?text=Say+more+with+Threads+%E2%80%94+Instagram%27s+new+text+app](https://www.threads.com/intent/post?text=Say+more+with+Threads+%E2%80%94+Instagram%27s+new+text+app) |
| Only link attachment | [https://www.threads.com/intent/post?url=https%3A%2F%2Fabout.fb.com%2Fnews%2F2023%2F07%2Fintroducing-threads-new-app-text-sharing%2F](https://www.threads.com/intent/post?url=https%3A%2F%2Fabout.fb.com%2Fnews%2F2023%2F07%2Fintroducing-threads-new-app-text-sharing%2F) |
| Link attachment and text | [https://www.threads.com/intent/post?url=https%3A%2F%2Fabout.fb.com%2Fnews%2F2023%2F07%2Fintroducing-threads-new-app-text-sharing%2F&text=Introducing+Threads%3A+A+New+Way+to+Share+With+Text](https://www.threads.com/intent/post?url=https%3A%2F%2Fabout.fb.com%2Fnews%2F2023%2F07%2Fintroducing-threads-new-app-text-sharing%2F&text=Introducing+Threads%3A+A+New+Way+to+Share+With+Text) |
| Only tag | [https://www.threads.com/intent/post?tag=Threads](https://www.threads.com/intent/post?tag=Threads) |
| Only reply audience | [https://www.threads.com/intent/post?reply\_control=followers\_only](https://www.threads.com/intent/post?reply_control=followers_only) |
| Reply audience, tag, link attachment, and text | [https://www.threads.com/intent/post?reply\_control=followers\_only&tag=Threads&url=https%3A%2F%2Fabout.fb.com%2Fnews%2F2023%2F07%2Fintroducing-threads-new-app-text-sharing%2F&text=Introducing%20Threads%3A%20A%20New%20Way%20to%20Share%20With%20Text](https://www.threads.com/intent/post?reply_control=followers_only&tag=Threads&url=https%3A%2F%2Fabout.fb.com%2Fnews%2F2023%2F07%2Fintroducing-threads-new-app-text-sharing%2F&text=Introducing%20Threads%3A%20A%20New%20Way%20to%20Share%20With%20Text) |
| Reply post and text | [https://www.threads.com/intent/post?reply\_post\_shortcode=DRM8DF9AGUc&text=Threads%3A%20A%20New%20Way%20to%20Share%20With%20Text](https://www.threads.com/intent/post?reply_post_shortcode=DRM8DF9AGUc&text=Threads%3A%20A%20New%20Way%20to%20Share%20With%20Text) |
| Quote post and text | [https://www.threads.com/intent/post?quote\_post\_shortcode=DPgzLZcAJPr&text=Threads%3A%20A%20New%20Way%20to%20Share%20With%20Text](https://www.threads.com/intent/post?quote_post_shortcode=DPgzLZcAJPr&text=Threads%3A%20A%20New%20Way%20to%20Share%20With%20Text) |
| Reply post, quote post, and text | [https://www.threads.com/intent/post?reply\_post\_shortcode=DRM8DF9AGUc&quote\_post\_shortcode=DPgzLZcAJPr&text=Threads%3A%20A%20New%20Way%20to%20Share%20With%20Text](https://www.threads.com/intent/post?reply_post_shortcode=DRM8DF9AGUc&quote_post_shortcode=DPgzLZcAJPr&text=Threads%3A%20A%20New%20Way%20to%20Share%20With%20Text) |

## Follow Intent

Follow intents allow people to easily follow a Threads account directly from your website.

### URL Format

The URL format is [https://www.threads.com/intent/follow](https://www.threads.com/intent/follow).

### Supported Parameters

| Name | Description |
| --- | --- |
| `username` | **Required.**<br>The username of the user to follow. |

### Examples

| Example | URL |
| --- | --- |
| The official @threads account | [https://www.threads.com/intent/follow?username=threads](https://www.threads.com/intent/follow?username=threads) |

On This Page

[Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents#web-intents)

[Post Intent](https://developers.facebook.com/docs/threads/threads-web-intents#post-intent)

[URL Format](https://developers.facebook.com/docs/threads/threads-web-intents#url-format)

[Supported Parameters](https://developers.facebook.com/docs/threads/threads-web-intents#supported-parameters)

[Examples](https://developers.facebook.com/docs/threads/threads-web-intents#examples)

[Follow Intent](https://developers.facebook.com/docs/threads/threads-web-intents#follow-intent)

[URL Format](https://developers.facebook.com/docs/threads/threads-web-intents#url-format-2)

[Supported Parameters](https://developers.facebook.com/docs/threads/threads-web-intents#supported-parameters-2)

[Examples](https://developers.facebook.com/docs/threads/threads-web-intents#examples-2)