---
url: https://developers.facebook.com/docs/instagram-platform/oembed
title: oEmbed - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Foembed%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
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

[Embed an Instagram Post](https://developers.facebook.com/docs/instagram-platform/oembed#embed-an-instagram-post)

[Requirements](https://developers.facebook.com/docs/instagram-platform/oembed#requirements)

[Common uses](https://developers.facebook.com/docs/instagram-platform/oembed#common-uses)

[Limitations](https://developers.facebook.com/docs/instagram-platform/oembed#limitations)

[Rate limits](https://developers.facebook.com/docs/instagram-platform/oembed#rate-limits)

[Get an embed HTML](https://developers.facebook.com/docs/instagram-platform/oembed#get-an-embed-html)

[Sample requests](https://developers.facebook.com/docs/instagram-platform/oembed#sample-requests)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/oembed#sample-response)

[URL Formats](https://developers.facebook.com/docs/instagram-platform/oembed#url-formats)

[Embed JS](https://developers.facebook.com/docs/instagram-platform/oembed#embed-js)

[Post Size](https://developers.facebook.com/docs/instagram-platform/oembed#post-size)

# Embed an Instagram Post

You can query the Instagram oEmbed endpoint to get an Instagram post’s embed HTML and basic metadata in order to display the post in another website or app. Supports photo, video, Reel, and Feed posts.

Visit the [Instagram Help Center](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F620154495870484&h=AUCO9w11J8MrFFa5vIzMquynUFdv5lNzojhUYH_QsTJz5k2OXCdRW4ZshC1zg4PmWnaWM_Zqai1rrIisQmVxilkqBlZLWnvqnoHA73En8txross4hd7tmHNPX5hbtunGat7T5oskoHpm7Q) to learn how to get the embed code from a public Instagram post or profile.

### Common uses

- Embed a post in a blog
- Embed a post in a website
- Render a post in a content management system
- Render a post in a messaging app

## Requirements

#### Base URL

All endpoints can be accessed via the `graph.facebook.com` host.

#### Endpoints

- [`GET /instagram_oembed`](https://developers.facebook.com/docs/graph-api/reference/instagram-oembed)


### Limitations

- The Instagram oEmbed endpoint is **only** meant to be used for embedding Instagram content in websites and apps. It is not to be used for any other purpose. **Using metadata and page, post, or video content (or their derivations) from the endpoint for any purpose other than providing a front-end view of the page, post, or video is strictly prohibited**. This prohibition encompasses consuming, manipulating, extracting, or persisting the metadata and content, including but not limited to deriving information about pages, posts, and videos from the metadata for analytics purposes.
- Posts on private, inactive, and age-restricted Instagram accounts are not supported.
- Accounts that have [disabled **Embeds**](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F252460186989212%2F&h=AUA2IR1spwxVjoNf4j2lfWG56XEOYN9daMeMeDIrZWO8Auv5ZQ16FxEf3qHMEhRYj1wbwTIf1IwKHH6-TYQDdwtcCTQM24Jx9Y2xeDz1bsoo3bTGuAxgp2UPPDYKpKo7zuQHnkPsMjEC9Q) are not supported.
- Stories are not supported.
- Shadow DOM is not supported.

### Rate limits

You can make up to 1,000 requests every hour.

## Get an embed HTML

You can get an embed HTML programmatically or [in the Instagram app.\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEuT_V0&_nc_oc=Adri6MCFL8CpLUYcK-KKkJESFLts72H3dM9-VVA48uh_SjCmQACDk0sQiLmc480KK6E&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HexL3_imzQ4JrSni8EtO9Q&_nc_ss=7b289&oh=00_Af7yvWWbQoyrtD8u9SOmxJLKwetfhKHmGx2L-YxKn-LmUw&oe=6A22EFE2)](https://developers.facebook.com/docs/instagram-platform/embed-button)

To programmatically get an Instagram post's embed HTML, send a request to:

```json
GET /instagram_oembed?url=<URL_OF_THE_POST>
```

Replace `<URL_OF_THE_POST>` with the [URL](https://developers.facebook.com/docs/instagram-platform/oembed#url-formats) of the Instagram post that you want to query.

Upon success, the API will respond with a JSON object containing the post's embed HTML and additional data. The embed HTML will be assigned to the `html` property.

Refer to the [Instagram oEmbed reference![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEuT_V0&_nc_oc=Adri6MCFL8CpLUYcK-KKkJESFLts72H3dM9-VVA48uh_SjCmQACDk0sQiLmc480KK6E&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HexL3_imzQ4JrSni8EtO9Q&_nc_ss=7b289&oh=00_Af7yvWWbQoyrtD8u9SOmxJLKwetfhKHmGx2L-YxKn-LmUw&oe=6A22EFE2)](https://developers.facebook.com/docs/graph-api/reference/instagram-oembed) for a list of [query string parameters![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEuT_V0&_nc_oc=Adri6MCFL8CpLUYcK-KKkJESFLts72H3dM9-VVA48uh_SjCmQACDk0sQiLmc480KK6E&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HexL3_imzQ4JrSni8EtO9Q&_nc_ss=7b289&oh=00_Af7yvWWbQoyrtD8u9SOmxJLKwetfhKHmGx2L-YxKn-LmUw&oe=6A22EFE2)](https://developers.facebook.com/docs/graph-api/reference/instagram-oembed#parameters) you can include to augment the request. You may also include the `fields` query string parameter to specify which [fields![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEuT_V0&_nc_oc=Adri6MCFL8CpLUYcK-KKkJESFLts72H3dM9-VVA48uh_SjCmQACDk0sQiLmc480KK6E&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HexL3_imzQ4JrSni8EtO9Q&_nc_ss=7b289&oh=00_Af7yvWWbQoyrtD8u9SOmxJLKwetfhKHmGx2L-YxKn-LmUw&oe=6A22EFE2)](https://developers.facebook.com/docs/graph-api/reference/instagram-oembed#fields) you want returned. If omitted, all default Fields will be included in the response.

### Sample requests

```curl
curl -X GET \
  "https://graph.facebook.com/v25.0/instagram_oembed?url=https://www.instagram.com/p/fA9uwTtkSN/"
```

```curl
curl -i -X GET \
     "https://graph.facebook.com/v25.0/instagram_oembed?url=https%3A%2F%2Fwww.instagram.com%2Fp%2FfA9uwTtkSN"
```

### Sample Response

Some values truncated with an ellipsis (`...`) for readability.

```json
{
  "version": "1.0",
  "provider_name": "Instagram",
  "provider_url": "https://www.instagram.com/",
  "type": "rich",
  "width": 658,
  "html": "<blockquote class=\"instagram-media\" data-instgrm-ca...",
}
```

### URL Formats

The `url` query string parameter accepts the following URL formats:

- Single image and carousel posts: `https://www.instagram.com/p/{media-shortcode}/`
- Videos/Reels: `https://www.instagram.com/reel/{media-shortcode}/`
- Profiles: `https://www.instagram.com/{username}`

### Embed JS

The embed HTML contains a reference to the Instagram [embed.js](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.instagram.com%2Fembed.js&h=AUATwLSlENsgXzdQzK5OkEbsFt8Et_j61oS-YCBV6N9_hdl4w5d1G7QFLfkXJXkswJXF0ab9OrMZyi-izKFBlW6Mz55SSdy7gkTOgL4d3RvoCGc5h0qd-3jfCN29zZuFE7egKxK-ahv84g) JavaScript library. When the library loads, it scans the page for the post HTML and generates the fully rendered post. If you want to load the library separately, include the `omitscript=true` query string parameter in your request. To manually initialize the embed HTML, call the `instgrm.Embeds.process()` function after loading the library.

### Post Size

The embedded post is responsive and will adapt to the size of its container. This means that the height will vary depending on the container width and the length of the caption. You can set the maximum width by including the `maxwidth` query string parameter in your request.

On This Page

[Embed an Instagram Post](https://developers.facebook.com/docs/instagram-platform/oembed#embed-an-instagram-post)

[Requirements](https://developers.facebook.com/docs/instagram-platform/oembed#requirements)

[Common uses](https://developers.facebook.com/docs/instagram-platform/oembed#common-uses)

[Limitations](https://developers.facebook.com/docs/instagram-platform/oembed#limitations)

[Rate limits](https://developers.facebook.com/docs/instagram-platform/oembed#rate-limits)

[Get an embed HTML](https://developers.facebook.com/docs/instagram-platform/oembed#get-an-embed-html)

[Sample requests](https://developers.facebook.com/docs/instagram-platform/oembed#sample-requests)

[Sample Response](https://developers.facebook.com/docs/instagram-platform/oembed#sample-response)

[URL Formats](https://developers.facebook.com/docs/instagram-platform/oembed#url-formats)

[Embed JS](https://developers.facebook.com/docs/instagram-platform/oembed#embed-js)

[Post Size](https://developers.facebook.com/docs/instagram-platform/oembed#post-size)