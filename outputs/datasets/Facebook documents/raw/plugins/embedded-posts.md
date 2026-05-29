---
url: https://developers.facebook.com/docs/plugins/embedded-posts
title: Embedded Posts - Social Plugins
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2Fembedded-posts%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Social Plugins](https://developers.facebook.com/docs/plugins)

- [Embedded Posts](https://developers.facebook.com/docs/plugins/embedded-posts)
- [Page Plugin](https://developers.facebook.com/docs/plugins/page-plugin)
- [Share Button](https://developers.facebook.com/docs/plugins/share-button)
- [Child-Directed Sites](https://developers.facebook.com/docs/plugins/restrictions)
- [Best Practices](https://developers.facebook.com/docs/plugins/best-practices)

On This Page

[Embedded Posts](https://developers.facebook.com/docs/plugins/embedded-posts#embedded-posts)

[Code Generator](https://developers.facebook.com/docs/plugins/embedded-posts#code-generator)

[Settings](https://developers.facebook.com/docs/plugins/embedded-posts#settings)

[Getting your Code from a Post](https://developers.facebook.com/docs/plugins/embedded-posts#getting-your-code-from-a-post)

[1\. Navigate to your Post](https://developers.facebook.com/docs/plugins/embedded-posts#1--navigate-to-your-post)

[2\. Copy and Paste Code](https://developers.facebook.com/docs/plugins/embedded-posts#2--copy-and-paste-code)

[Add Code Manually](https://developers.facebook.com/docs/plugins/embedded-posts#add-code-manually)

[1\. Get Post URL](https://developers.facebook.com/docs/plugins/embedded-posts#1--get-post-url)

[2\. Load JavaScript SDK](https://developers.facebook.com/docs/plugins/embedded-posts#2--load-javascript-sdk)

[3\. Place Embedded Post Tag](https://developers.facebook.com/docs/plugins/embedded-posts#3--place-embedded-post-tag)

[4\. Testing](https://developers.facebook.com/docs/plugins/embedded-posts#4--testing)

[5\. Customizing](https://developers.facebook.com/docs/plugins/embedded-posts#5--customizing)

[Getting a post's URL](https://developers.facebook.com/docs/plugins/embedded-posts#how-to-get-a-posts-url)

[Via Graph API](https://developers.facebook.com/docs/plugins/embedded-posts#via-graph-api)

[WordPress](https://developers.facebook.com/docs/plugins/embedded-posts#wordpress)

[FAQ](https://developers.facebook.com/docs/plugins/embedded-posts#faq)

# Embedded Posts

Embedded Posts are a simple way to put public posts - by a Page or a person on Facebook - into the content of your web site or web page. Only public posts from Facebook Pages and profiles can be embedded.

## Code Generator

href

width

show\_text

[Get code](https://developers.facebook.com/plugins/code?path=post&href=https%3A%2F%2Fwww.facebook.com%2F20531316728%2Fposts%2F10154009990506729%2F&width=500&show_text=true)

## Settings

| Setting | Description | Default |
| --- | --- | --- |
| `data-href` | The absolute URL of the post. | `n/a` |
| `data-lazy` | `true` means use the browser's lazy-loading mechanism by setting the `loading="lazy"` iframe attribute. The effect is that the browser does not render the plugin if it's not close to the viewport and might never be seen. Can be one of `true` or `false` (default). | `false` |
| `data-width` | The width of the post. Min. `350` pixel; Max. `750` pixel. Leave empty to use fluid width. | fluid width |
| `data-show-text` | Applied to photo post. Set to `true` to include the text from the Facebook post, if any. | `false` |

## Getting your Code from a Post

### 1\. Navigate to your Post

You can get the embed code directly from the post itself. If the post is **public**, click on the icon that appears in the top right corner of the post on Facebook.

**Choose `Embed Post` from the drop down menu:**

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/10734320_340409306154791_1088700682_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=34156e&_nc_ohc=g87xwtWhMlUQ7kNvwGpKBiB&_nc_oc=AdpT0CFuvDmmeJtUVXIYTPJbXiQFSxrEZRjR1KoGN4epI5bTKjeuOoeVBl7eJd28aOg&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=JVpFe6Q6-ykFoXoWKbvPTw&_nc_ss=7b289&oh=00_Af5agniqvfgc2SBzogztKRP5yZasn5qrgkPGqecLPf6_Rw&oe=6A112742)

**For photo posts select the `Embed Post` button on the bottom right:**

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/10956900_1564320000510960_367110831_n.png?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=7ApR0NhbWCkQ7kNvwHrnrk1&_nc_oc=AdrfA5zzUG8XicVNkM9UCyJAhX8XsVCd0oKx3NrxWGgFzifW42hjzJevVOVVTgAvU7E&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=JVpFe6Q6-ykFoXoWKbvPTw&_nc_ss=7b289&oh=00_Af6uMDVL3erFr33bq3_8V0-dVXtrl3BHzDxuq8pQY_AdnQ&oe=6A111318)

### 2\. Copy and Paste Code

You will see a dialog appear with the code to embed your post in it. Copy and paste this code into your web page in the place where you want it to appear.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12726927_460738097457654_855104592_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=ddoEGabPu4YQ7kNvwG5HBV6&_nc_oc=AdrLQuyS3ns0iQ6Q4s3CSfZDbfOWVzwPhgjl5KtVOW5pceHKBvQUgv4wtH80vXkkxBc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=JVpFe6Q6-ykFoXoWKbvPTw&_nc_ss=7b289&oh=00_Af6AbR2Pi9OQHDVkKNu3bRTHTdK7fiUmgaemDPHW7-rE4A&oe=6A2591A7)

For technical details please refer to the section [Add Code Manually](https://developers.facebook.com/docs/plugins/embedded-posts#add-code-manually)

## Add Code Manually

Besides the [Code Generator](https://developers.facebook.com/docs/plugins/embedded-posts#code-generator), you can also embed the code manually.

### 1\. Get Post URL

First you need to **[get the URL of a post](https://developers.facebook.com/docs/plugins/embedded-posts#how-to-get-a-posts-url)** you wish to share. The post **must** be public, which is indicated by the gray world icon, right next the post's publishing time:

![Public Post Icon](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/10935995_793057267438983_1193272981_n.png?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=hJ3htthGoxUQ7kNvwFghBnt&_nc_oc=AdpwFhD3sqdzpSu78lBARkMcBEpPgabTXA3BgD8QkvH0GwFqn0CxBobm9_xAgpaKtTU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=JVpFe6Q6-ykFoXoWKbvPTw&_nc_ss=7b289&oh=00_Af40zun3K4kvz0k9cZXQ2HR1wKOgQgTgZsmQVqHHCNjslw&oe=6A11144A)

For testing you can use this **example URL**:

```code
"https://www.facebook.com/20531316728/posts/10154009990506729/"
```

### 2\. Load JavaScript SDK

To use the Embedded Posts Plugin, or any other Social Plugin, you need to add the [Facebook JavaScript SDK](https://developers.facebook.com/docs/javascript/) to your website. You need to load the SDK only once on a page, ideally right after the opening `<body>` tag:

```code
<div id="fb-root"></div>
<script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"></script>
```

You can find more help on implementing the JavaScript SDK in the [JavaScript SDK - Quickstart](https://developers.facebook.com/docs/javascript/quickstart/).

### 3\. Place Embedded Post Tag

Next place the Embedded Post tag at any place of your website. Replace `{your-post-url}` with your posts' URL.

```code
<div class="fb-post" data-href="{your-post-url}"></div>
```

### 4\. Testing

Once you completed these steps you're able to test your Embedded Post. A completed integration will look like something like this:

```code
<html>
  <title>My Website</title>
<body>
  <script async defer src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.2"></script>
  <div class="fb-post"
      data-href="https://www.facebook.com/20531316728/posts/10154009990506729/"
      data-width="500"></div>
</body>
</html>
```

The result of our test example is shown in the screenshot below.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12679489_1117425714966840_1476571871_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=-4-dRx4EjJ0Q7kNvwHPItGI&_nc_oc=AdqeMKhHfZXwgxRvV4ANjwKgOh5ao5_BsuMzwwMk08oAnoLVFQ8TNXChErYQym-nFW8&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=JVpFe6Q6-ykFoXoWKbvPTw&_nc_ss=7b289&oh=00_Af67JNY_mJQx5TgqGg597NIQeQ1XOUiaNM7N2dEd8lrpTQ&oe=6A259BCA)

### 5\. Customizing

Follow the instructions further down this page to adjust size, language and other settings.

## Getting a post's URL

There may be scenarios in which your embed code is created by a CMS and you just need the raw post URL. There are two ways to get a post's URL:

1. Copy the URL of the permalink from your **browser's address bar**.
2. Right-click the post's **publishing time** and copy the link address.

Both methods are highlighted in red in the screenshot below.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/10935979_524978690976943_1419366838_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=ch7dXw6aLSsQ7kNvwEA17V7&_nc_oc=Adou4VZGFkrdY-_KCNQ-Ezmo1b4SKoFUK0R92PYDOC0OB-MwAmlV2NcJRHnDXKFunHc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=JVpFe6Q6-ykFoXoWKbvPTw&_nc_ss=7b289&oh=00_Af5HaKHLcvw5Xq-bEbIm9Y0b04ze_PYmtsmzJPxjMAg13Q&oe=6A111682)

### Via Graph API

If you wish to automatically integrate embedded posts into your website, you probably use the Graph API to aggregate posts. For example you may use the [Page Feed API endpoint](https://developers.facebook.com/docs/graph-api/reference/page/feed/) and the `fields` parameter `permalink_url`.

The response to your request to `/{page-id}/feed?fields=permalink_url` will send you a response like this:

```code
{
  "data": [\
    {\
      "id": "1234567890_3456789012",\
      "permalink_url": "https://www.facebook.com/1234567890/posts/3456789012"\
    }\
  ]
}
```

## Layout on Desktop

You can adjust the width of Embedded Posts on desktop via the `data-width` attribute in the Embed Post tag as shown in the example below. Chose a value between `350` and `750` pixels.

Do not use CSS style tags to adjust the size of a plugin. It may result into display errors.

```code
<!-- WRONG! -->
<style type="text/css">
.fb-post {
  width: 500px;
}
</style>
<div
  class="fb-post"
  data-href="{your-post-url}">
</div>

<!-- CORRECT -->
<div
  class="fb-post"
  data-width="500"
  data-href="{your-post-url}">
</div>
```

* * *

## Layout on Mobile Web

On mobile web, Embedded Posts automatically scale to the width of the container.

## WordPress

If you are already using the Facebook SDK for JavaScript in your WordPress site you can use the Embedded Posts plugin by simply adding the `fb-post` tag to your WordPress post:

```code
<div class="fb-post" data-href="https://www.facebook.com/20531316728/posts/10154009990506729/" data-width="500"></div>
```

If you are not using the Facebook SDK for JavaScript and embed a Post via the copy&paste snippet, which you can get from each Facebook post, the Embedded Posts plugin will most likely not render as WordPress will convert all `&` chars to `#038;` and break the plugin.

Instead use the following code to add the plugin:

```code
<script>
  window.fbAsyncInit = function() {
    FB.init({
      xfbml      : true,
      version    : 'v25.0'
    });
  };
</script>
<script async defer src="https://connect.facebook.net/en_US/sdk.js"></script>

<div
  class="fb-post"
  data-href="https://www.facebook.com/20531316728/posts/10154009990506729/"
  data-width="500"></div>
```

A new, easy WordPress integration will be released in the near future.

## FAQ

[How do I display Social Plugins in different languages?](https://developers.facebook.com/docs/plugins/embedded-posts#faq_126643264408159)

If you are using the HTML5 or XFBML versions, you should include the language code when you instantiate the library.

When you load the SDK, change the value of `js.src` to use your locale. Replace `en_US` with your locale, e.g., `fr_FR` for French (France):

```js
// Example 1:
'https://connect.facebook.net/fr_FR/sdk.js';

// Example 2:
js.src = "https://connect.facebook.net/fr_FR/sdk.js#xfbml=1&version=v2.6";
```

Supported locales are referenced in the [Facebook Locales XML file](https://www.facebook.com/translations/FacebookLocales.xml).

You may need to adjust the width of a Social Plugin to accommodate different languages. Find more information on our [Localization & Translation](https://developers.facebook.com/docs/internationalization) page.

[Permalink](https://developers.facebook.com/docs/plugins/embedded-posts#faq_126643264408159)

[What do people see in Embedded Posts?](https://developers.facebook.com/docs/plugins/embedded-posts#faq_1019078628176460)

The embedded post will show any media attached to it, as well as the number of likes, shares, and comments that the post has. Embedding posts will let people using your web site see the same rich information that is shown on Facebook.com, and they will enable people to follow or like content authors or Pages directly from the embed.

[Permalink](https://developers.facebook.com/docs/plugins/embedded-posts#faq_1019078628176460)

[What happens if someone deletes a post or changes a post's audience selector?](https://developers.facebook.com/docs/plugins/embedded-posts#faq_2053606004864944)

The following message will display in place of the embedded post:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/13311284_226484464404139_781153082_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=G9bd-4ne1PsQ7kNvwGOutV0&_nc_oc=AdoA41jJSiFgQ0-7LYip9HrAjPLUCXQF4zvTmMQYeH18ZeX8jB6VQGKVRyMrCrNtybk&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=JVpFe6Q6-ykFoXoWKbvPTw&_nc_ss=7b289&oh=00_Af5bBVGL3RmwKSboHOwTbS3B4xr40ltyb6Z9StfbpmCeMA&oe=6A25984D)

[Permalink](https://developers.facebook.com/docs/plugins/embedded-posts#faq_2053606004864944)

On This Page

[Embedded Posts](https://developers.facebook.com/docs/plugins/embedded-posts#embedded-posts)

[Code Generator](https://developers.facebook.com/docs/plugins/embedded-posts#code-generator)

[Settings](https://developers.facebook.com/docs/plugins/embedded-posts#settings)

[Getting your Code from a Post](https://developers.facebook.com/docs/plugins/embedded-posts#getting-your-code-from-a-post)

[1\. Navigate to your Post](https://developers.facebook.com/docs/plugins/embedded-posts#1--navigate-to-your-post)

[2\. Copy and Paste Code](https://developers.facebook.com/docs/plugins/embedded-posts#2--copy-and-paste-code)

[Add Code Manually](https://developers.facebook.com/docs/plugins/embedded-posts#add-code-manually)

[1\. Get Post URL](https://developers.facebook.com/docs/plugins/embedded-posts#1--get-post-url)

[2\. Load JavaScript SDK](https://developers.facebook.com/docs/plugins/embedded-posts#2--load-javascript-sdk)

[3\. Place Embedded Post Tag](https://developers.facebook.com/docs/plugins/embedded-posts#3--place-embedded-post-tag)

[4\. Testing](https://developers.facebook.com/docs/plugins/embedded-posts#4--testing)

[5\. Customizing](https://developers.facebook.com/docs/plugins/embedded-posts#5--customizing)

[Getting a post's URL](https://developers.facebook.com/docs/plugins/embedded-posts#how-to-get-a-posts-url)

[Via Graph API](https://developers.facebook.com/docs/plugins/embedded-posts#via-graph-api)

[WordPress](https://developers.facebook.com/docs/plugins/embedded-posts#wordpress)

[FAQ](https://developers.facebook.com/docs/plugins/embedded-posts#faq)