---
url: https://developers.facebook.com/docs/plugins/embedded-video-player/
title: Embedded Videos
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2Fembedded-video-player%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Embedded Videos](https://developers.facebook.com/docs/plugins/embedded-video-player)

- [API](https://developers.facebook.com/docs/plugins/embedded-video-player/api)

On This Page

[Embedded Video & Live Video Player](https://developers.facebook.com/docs/plugins/embedded-video-player/#embedded-video---live-video-player)

[Step-by-Step](https://developers.facebook.com/docs/plugins/embedded-video-player/#step-by-step)

[Embedded Video Player Configurator](https://developers.facebook.com/docs/plugins/embedded-video-player/#configurator)

[Full Code Example](https://developers.facebook.com/docs/plugins/embedded-video-player/#example)

[Settings](https://developers.facebook.com/docs/plugins/embedded-video-player/#settings)

[Example Configuration](https://developers.facebook.com/docs/plugins/embedded-video-player/#example-configuration)

[Getting your Code from a Video Post](https://developers.facebook.com/docs/plugins/embedded-video-player/#video-url-from-post)

[1\. Navigate to your Video Post](https://developers.facebook.com/docs/plugins/embedded-video-player/#1--navigate-to-your-video-post)

[For Pages only](https://developers.facebook.com/docs/plugins/embedded-video-player/#for-pages-only)

[2\. Copy and Paste Code](https://developers.facebook.com/docs/plugins/embedded-video-player/#2--copy-and-paste-code)

[Add Code Manually](https://developers.facebook.com/docs/plugins/embedded-video-player/#add-code-manually)

[1\. Get Video Post URL](https://developers.facebook.com/docs/plugins/embedded-video-player/#1--get-video-post-url)

[2\. Load JavaScript SDK](https://developers.facebook.com/docs/plugins/embedded-video-player/#2--load-javascript-sdk)

[3\. Place Embedded Video Player Tag](https://developers.facebook.com/docs/plugins/embedded-video-player/#3--place-embedded-video-player-tag)

[4\. Testing](https://developers.facebook.com/docs/plugins/embedded-video-player/#4--testing)

[5\. Customizing](https://developers.facebook.com/docs/plugins/embedded-video-player/#customizing)

[Getting a video post's URL](https://developers.facebook.com/docs/plugins/embedded-video-player/#how-to-get-a-video-posts-url)

[Via Graph API](https://developers.facebook.com/docs/plugins/embedded-video-player/#via-graph-api)

[Changing the Language](https://developers.facebook.com/docs/plugins/embedded-video-player/#language)

[Wordpress](https://developers.facebook.com/docs/plugins/embedded-video-player/#wordpress)

[FAQ](https://developers.facebook.com/docs/plugins/embedded-video-player/#faq)

[Can I use the Graph API video property embed\_html?](https://developers.facebook.com/docs/plugins/embedded-video-player/#embed_html)

# Embedded Video & Live Video Player

With the embedded video player you can easily add **Facebook videos** and **Facebook live videos** to your website. You can use any public video post by a Page or a person as video or live video source.

[Embedded Video Player Configurator](https://developers.facebook.com/docs/plugins/embedded-video-player/#configurator) [Code Example](https://developers.facebook.com/docs/plugins/embedded-video-player/#example) [Settings](https://developers.facebook.com/docs/plugins/embedded-video-player/#settings) [Add Code Manually](https://developers.facebook.com/docs/plugins/embedded-video-player/#add-code-manually)

## Step-by-Step

#### 1\. Choose URL or Page

Pick the URL of a Facebook video you want to embed.

#### 2\. Code Configurator

Paste the URL to the [Code Configurator](https://developers.facebook.com/docs/plugins/embedded-video-player/#configurator) and click the **"Get Code"** button to generate your embedded video player code.

#### 3\. Copy & Paste HTML snippet

Copy and paste the snippet into the HTML of the destination website.

## Embedded Video Player Configurator

href

width

show\_text

[Get code](https://developers.facebook.com/plugins/code?path=video&href=https%3A%2F%2Fwww.facebook.com%2Ffacebook%2Fvideos%2F10153231379946729%2F&width=500&show_text=false)

## Full Code Example

Copy & paste the code example to your website. Adjust the value `data-href` to your video URL. Control the player size using the attribute `data-width`.

```code
<html>
<head>
  <title>Your Website Title</title>
</head>
<body>

  <!-- Load Facebook SDK for JavaScript -->
  <div id="fb-root"></div>
  <script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"></script>

  <!-- Your embedded video player code -->
  <div class="fb-video" data-href="https://www.facebook.com/facebook/videos/10153231379946729/" data-width="500" data-show-text="false">
    <div class="fb-xfbml-parse-ignore">
      <blockquote cite="https://www.facebook.com/facebook/videos/10153231379946729/">
        <a href="https://www.facebook.com/facebook/videos/10153231379946729/">How to Share With Just Friends</a>
        <p>How to share with just friends.</p>
        Posted by <a href="https://www.facebook.com/facebook/">Facebook</a> on Friday, December 5, 2014
      </blockquote>
    </div>
  </div>

</body>
</html>
```

## Settings

The configurator above doesn't include all of the possible settings for the embedded video player. You can also change the following settings:

| Setting | Description | Default |
| --- | --- | --- |
| `data-href` | The absolute URL of the video. | `n/a` |
| `data-allowfullscreen` | Allow the video to be played in fullscreen mode. Can be `false` or `true`. | `false` |
| `data-autoplay` | Automatically start playing the video when the page loads. The video will be played **without sound** (muted). People can turn on sound via the video player controls. This setting does not apply to mobile devices. Can be `false` or `true`. | `false` |
| `data-lazy` | `true` means use the browser's lazy-loading mechanism by setting the `loading="lazy"` iframe attribute. The effect is that the browser does not render the plugin if it's not close to the viewport and might never be seen. Can be one of `true` or `false` (default). | `false` |
| `data-width` | The width of the video container. Min. `220px`. | `auto` |
| `data-show-text` | Set to `true` to include the text from the Facebook post associated with the video, if any. Only available for desktop sites. | `false` |
| `data-show-captions` | Set to `true` to show captions (if available) by default. Captions are only available on desktop. | `false` |

### Example Configuration

```code
<div class="fb-video"
  data-href="https://www.facebook.com/FacebookDevelopers/posts/10151471074398553"
  data-width="500"
  data-allowfullscreen="true"
  data-autoplay="true"
  data-show-captions="true"></div>
```

## Getting your Code from a Video Post

### 1\. Navigate to your Video Post

If you post a **public** video ( [see FAQ](https://developers.facebook.com/docs/plugins/faqs#faq_102965230133489)), you can get the embed code directly from the video post itself.

**Choose `Embed Video` from the options menu:**

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/11057099_497862977034576_111296041_n.png?_nc_cat=110&ccb=1-7&_nc_sid=34156e&_nc_ohc=QDCIN_M5ZK4Q7kNvwG5ElB0&_nc_oc=Adrq_9FRVaTleUTjUHzogzQ9KD87P9dPInhGqGY5OKd1IilOhZywRbch4nog8YGxghA&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=83bMZMWFyBdzisWBLdRebA&_nc_ss=7b289&oh=00_Af6DrGXBT0RoOaW49MWGgfwrPl19XxpkBLrLuP_SRGa6bg&oe=6A1121C9)

**Or when viewing a video in the full-page view select the `Embed Video` button on the bottom right:**

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/10956886_1580934195507674_377584945_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=34156e&_nc_ohc=8OPL2eDUITgQ7kNvwGl4T_R&_nc_oc=AdoJ-lj3Xbzui-FWMYFXo_DaX5v9xYanf9t2j8O42VISkuTL1-LTR25xqPKvYeY1S-s&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=83bMZMWFyBdzisWBLdRebA&_nc_ss=7b289&oh=00_Af68UxKBoAiUOBZ3m-1Q96NqriEog_9xJ1sfWe55hGfUIg&oe=6A111366)

### For Pages only

When posting a **public video on a Page** ( [see FAQ](https://developers.facebook.com/docs/plugins/faqs#faq_102965230133489)) you can get the embed code directly from the Timeline. Click on the icon that appears in the top right corner of the post on Facebook.

**Choose `Embed Video` from the drop down menu:** (For Pages only)

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/10956915_840861902638743_1347350695_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=34156e&_nc_ohc=V2zL5AK_zPwQ7kNvwEBd38q&_nc_oc=Adq-VP-_EM7hqJ7hKqoPInXLEELAorY8VaunCpZG5m3y5dRSS15-V9Wb7ob79GJ3Xrc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=83bMZMWFyBdzisWBLdRebA&_nc_ss=7b289&oh=00_Af7w1Nrxh9o0xdisYwsxuK_XGNn4sezDPn6Go0L9NceAug&oe=6A11207E)

### 2\. Copy and Paste Code

You will see a dialog appear with the code to embed your video post in it. Copy and paste this code into your web page in the place where you want it to appear.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/10956915_857930470910242_318679294_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=34156e&_nc_ohc=ypDHjlKCEAAQ7kNvwFY_hCC&_nc_oc=Ado4ekOh90oViC7s1k0f-a4N_URjnbNfyuIM1c2gfjep59VarOoIGL8N3CnN-KFN01g&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=83bMZMWFyBdzisWBLdRebA&_nc_ss=7b289&oh=00_Af6dO7-IEQ4WSyTF3PZtyeamJD8-rPWgOYWW--WbFvFjWw&oe=6A112C59)

For technical details please refer to the section [Add Code Manually](https://developers.facebook.com/docs/plugins/embedded-video-player/#add-code-manually)

## Add Code Manually

Besides the [Code Generator](https://developers.facebook.com/docs/plugins/embedded-video-player/#code-generator), you can also embed the code manually.

### 1\. Get Video Post URL

First you need to **[get the URL of a video post](https://developers.facebook.com/docs/plugins/embedded-video-player/#how-to-get-a-video-posts-url)** you wish to share. The video post **must** be public ( [see FAQ](https://developers.facebook.com/docs/plugins/faqs#faq_102965230133489)), which is indicated by the gray world icon, right next the post's publishing time: ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/10935995_793057267438983_1193272981_n.png?_nc_cat=103&ccb=1-7&_nc_ohc=hJ3htthGoxUQ7kNvwHX1WEO&_nc_oc=Adq8_JIpJtiF_kGWcKuB-wYnPIXWRzILB5FfxUWTV1nQK7YuYrfL7S0dfX-henmvtA4&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=83bMZMWFyBdzisWBLdRebA&_nc_ss=7b289&stp=dst-emg0_fr_q75_tt6&ur=34156e&_nc_sid=3fabc8&oh=00_Af5F7Hx4lloaOsZA3nmhunwLX4WeDpu3ugSEydssLr2thw&oe=6A11144A)

For testing you can use this **example URL**:

```code
"https://www.facebook.com/FacebookDevelopers/videos/10152454700553553/"
```

### 2\. Load JavaScript SDK

To use the Embedded Video Player Plugin, or any other Social Plugin, you need to add the [Facebook JavaScript SDK](https://developers.facebook.com/docs/javascript/) to your website. You need to load the SDK only once on a page, ideally right after the opening `<body>` tag:

```code
<div id="fb-root"></div>
<script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"></script>
```

You can find more help on implementing the JavaScript SDK in the [JavaScript SDK - Quickstart](https://developers.facebook.com/docs/javascript/quickstart/).

### 3\. Place Embedded Video Player Tag

Next place the Embedded Video Player tag at any place of your website. Replace `{your-video-post-url}` with your posts' URL.

```code
<div class="fb-video" data-href="{your-video-post-url}"
  data-allowfullscreen="true" data-width="500"></div>
```

### 4\. Testing

Once you completed these steps you're able to test your Embedded Video Player. A completed integration will look like something like this:

```code
<html>
  <title>My Website</title>
<body>
  <div id="fb-root"></div>
  <script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"></script>
  <h1>My Video Player</h1>
  <div class="fb-video"
    data-href="https://www.facebook.com/FacebookDevelopers/posts/10151471074398553"
    data-width="500"
    data-allowfullscreen="true"></div>
</body>
</html>
```

The result of our test example is shown in the screenshot below.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/11057090_869551563086172_830482901_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=34156e&_nc_ohc=ZI1q8YtBJecQ7kNvwFgfj2z&_nc_oc=AdpgacekOooATDEiaegzgd7GIFt55oDbEukZyXobAurKQLdKyVrcy7UYaDYs5gMIjrE&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=83bMZMWFyBdzisWBLdRebA&_nc_ss=7b289&oh=00_Af7TI0vTqTaRWgThpYwJHYMIKcODwsUKKjkkVDT0sSFawA&oe=6A111D20)

### 5\. Customizing

Follow the instructions further down this page to adjust size, language and other settings.

## Getting a video post's URL

There may be scenarios in which your embed code is created by a CMS and you just need the raw post URL. There are two ways to get a post's URL:

1. Copy the URL of the permalink from your **browser's address bar**.
2. Right-click the post's **publishing time** and copy the link address.

Both methods are highlighted in red in the screenshot below.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/11057025_433517003484374_292988490_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=34156e&_nc_ohc=9Gr65h3_QcAQ7kNvwEBQb2A&_nc_oc=Adp6L3L6yR8XLg53YcTpasmr99YFguKg_XhbVaXitcQr3aiSMqf3YCi3WC0HxLNMVi0&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=83bMZMWFyBdzisWBLdRebA&_nc_ss=7b289&oh=00_Af5HSoZBhXMq9rqXThVIyMwTFUYleS8690fr9Mf3lqMgrQ&oe=6A110F09)

### Via Graph API

If you wish to automatically integrate embedded video players into your website, you probably use the Graph API to aggregate videos. For example you may use the [Page Videos API endpoint](https://developers.facebook.com/docs/graph-api/reference/page/videos/), which will send you a response for your request to `/{page-id}/videos` in the following format (shortend):

```code
{
  "data": [\
    {\
      "id": "1234567890",\
      "created_time": "2015-02-25T23:22:06+0000",\
      "description": "My Video Caption",\
      "embed_html": "<iframe src=\"https://www.facebook.com/video/embed?video_id=1234567890\" width=\"1280\" height=\"720\" frameborder=\"0\"></iframe>",\
      "format": []\
    }\
   ]
}
```

**To get the video's URL:**

Use the `id` value to create a URL following the structure:

```code
"https://www.facebook.com/video.php?v={id}"
```

Do not use the property `embed_html` for embedding videos. For more information about this topic, please refer to the [FAQ section](https://developers.facebook.com/docs/plugins/embedded-video-player/#faq)

## Layout on Desktop

You can adjust the width of Embedded Video Player on desktop via the `data-width` attribute in the Embedded Video Player tag as shown in the example below. The value must at least by `220`. There is no limit on the upper end, yet the player will never become bigger than its parent element.

Do not use CSS style tags to adjust the size of a plugin. It may result into display errors.

```code
<!-- WRONG! -->
<style type="text/css">
.fb-video {
  width: 500px;
}
</style>
<div class="fb-post" data-href="{your-video-post-url}"></div>

<!-- CORRECT -->
<div class="fb-video" data-href="{your-video-post-url}"
  data-allowfullscreen="true" data-width="500"></div>
```

* * *

#### Fullscreen

You can add the property `data-allowfullscreen="true"` to allow the video to be played in fullscreen mode.

## Layout on Mobile Web

On mobile web, the Embedded Video Player automatically scales to the inner width of its parent element.

## Changing the Language

You can change the language of the Embedded Video Player plugin by loading a localized version of the Facebook JavaScript SDK. When you load the SDK, change the value of `src` to use your locale. Replace `en_US` with your locale, e.g., `fr_FR` for French (France):

```code
src="https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v3.2"
```

You may need to adjust the width of a Social Plugin to accommodate different languages. You may find more information on our [Localization & Translation](https://developers.facebook.com/docs/internationalization) page.

## Wordpress

If you are already using the Facebook SDK for JavaScript in your Wordpress site you can use the Embedded Video Player plugin by simply adding the `fb-video` tag to your post:

```code
<div class="fb-video" data-href="https://www.facebook.com/video.php?v=10152795258318553"
  data-width="500" data-allowfullscreen="true"></div>
```

If you are not using the Facebook SDK for JavaScript and embed a video via the copy&paste snippet, which you can get from each video post, the Embedded Video Player plugin will most likly not render as Wordpress will convert all `&` chars to `#038;` and break the player.

Instead use the following code to add the plugin:

```code
<script>window.fbAsyncInit = function() {
  FB.init({
    xfbml      : true,
    version    : 'v3.2'
  });
  }; (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));</script>
<div class="fb-video" data-href="https://www.facebook.com/video.php?v=10152795258318553" data-width="500" data-allowfullscreen="true"></div>
```

A new, easy Wordpress integration will be released in the near future.

## FAQ

### Can I use the Graph API `video` property `embed_html`?

No, you should not use the property `embed_html`. Use the Embedded Video Player plugin instead!

#### About the `embed_html` property:

The [Graph API endpoint `video`](https://developers.facebook.com/docs/graph-api/reference/video) will serve a property named `embed_html`. Its value will contain an HTML element that may be embedded in a Web page to play the requested video.

This value is not to be confused with the Embedded Video Player plugin. We do recommend to **not use** this property anymore - use the Embedded Video Player plugin instead!

If you use the `embed_html` property's value, your video player will:

- Not work on mobile devices and tablets
- Not contain any additional information like views, video title, etc.

#### Example for `embed_html` property (deprecated):

```code
{
  "embed_html":
    "<iframe
      src=\"https://www.facebook.com/video/embed?video_id=1234567890\"
      width=\"1280\"
      height=\"720\"
      frameborder=\"0\">
    </iframe>"
}
```

On This Page

[Embedded Video & Live Video Player](https://developers.facebook.com/docs/plugins/embedded-video-player/#embedded-video---live-video-player)

[Step-by-Step](https://developers.facebook.com/docs/plugins/embedded-video-player/#step-by-step)

[Embedded Video Player Configurator](https://developers.facebook.com/docs/plugins/embedded-video-player/#configurator)

[Full Code Example](https://developers.facebook.com/docs/plugins/embedded-video-player/#example)

[Settings](https://developers.facebook.com/docs/plugins/embedded-video-player/#settings)

[Example Configuration](https://developers.facebook.com/docs/plugins/embedded-video-player/#example-configuration)

[Getting your Code from a Video Post](https://developers.facebook.com/docs/plugins/embedded-video-player/#video-url-from-post)

[1\. Navigate to your Video Post](https://developers.facebook.com/docs/plugins/embedded-video-player/#1--navigate-to-your-video-post)

[For Pages only](https://developers.facebook.com/docs/plugins/embedded-video-player/#for-pages-only)

[2\. Copy and Paste Code](https://developers.facebook.com/docs/plugins/embedded-video-player/#2--copy-and-paste-code)

[Add Code Manually](https://developers.facebook.com/docs/plugins/embedded-video-player/#add-code-manually)

[1\. Get Video Post URL](https://developers.facebook.com/docs/plugins/embedded-video-player/#1--get-video-post-url)

[2\. Load JavaScript SDK](https://developers.facebook.com/docs/plugins/embedded-video-player/#2--load-javascript-sdk)

[3\. Place Embedded Video Player Tag](https://developers.facebook.com/docs/plugins/embedded-video-player/#3--place-embedded-video-player-tag)

[4\. Testing](https://developers.facebook.com/docs/plugins/embedded-video-player/#4--testing)

[5\. Customizing](https://developers.facebook.com/docs/plugins/embedded-video-player/#customizing)

[Getting a video post's URL](https://developers.facebook.com/docs/plugins/embedded-video-player/#how-to-get-a-video-posts-url)

[Via Graph API](https://developers.facebook.com/docs/plugins/embedded-video-player/#via-graph-api)

[Changing the Language](https://developers.facebook.com/docs/plugins/embedded-video-player/#language)

[Wordpress](https://developers.facebook.com/docs/plugins/embedded-video-player/#wordpress)

[FAQ](https://developers.facebook.com/docs/plugins/embedded-video-player/#faq)

[Can I use the Graph API video property embed\_html?](https://developers.facebook.com/docs/plugins/embedded-video-player/#embed_html)