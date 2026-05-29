---
url: https://developers.facebook.com/docs/plugins/page-plugin/
title: Page Plugin - Social Plugins
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2Fpage-plugin%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Social Plugins](https://developers.facebook.com/docs/plugins)

- [Embedded Posts](https://developers.facebook.com/docs/plugins/embedded-posts)
- [Page Plugin](https://developers.facebook.com/docs/plugins/page-plugin)
- [Share Button](https://developers.facebook.com/docs/plugins/share-button)
- [Child-Directed Sites](https://developers.facebook.com/docs/plugins/restrictions)
- [Best Practices](https://developers.facebook.com/docs/plugins/best-practices)

On This Page

[Page Plugin](https://developers.facebook.com/docs/plugins/page-plugin/#page-plugin)

[Settings](https://developers.facebook.com/docs/plugins/page-plugin/#settings)

[Adding the Page Plugin to a Website](https://developers.facebook.com/docs/plugins/page-plugin/#how-to)

[Call to Action](https://developers.facebook.com/docs/plugins/page-plugin/#cta)

[Page Tabs: Timeline, Events & Messages](https://developers.facebook.com/docs/plugins/page-plugin/#page-tabs)

[Adding Multiple Tabs](https://developers.facebook.com/docs/plugins/page-plugin/#adding-multiple-tabs)

[Single Tab](https://developers.facebook.com/docs/plugins/page-plugin/#single-tab)

[Adaptive Width](https://developers.facebook.com/docs/plugins/page-plugin/#adaptive-width)

[No Dynamic Resizing](https://developers.facebook.com/docs/plugins/page-plugin/#resizing)

[Show Friend's Faces](https://developers.facebook.com/docs/plugins/page-plugin/#friends-faces)

[Privacy Restricted Pages](https://developers.facebook.com/docs/plugins/page-plugin/#privacy)

[Changing the Language](https://developers.facebook.com/docs/plugins/page-plugin/#language)

# Page Plugin

The Page plugin lets you easily embed and promote any public Facebook Page on your website. Just like on Facebook, your visitors can like and share the Page without leaving your site. You can use the Page plugin for any Page that is not restricted, for example, by country or age.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/11057178_955752887777717_1517751206_n.png?_nc_cat=106&ccb=1-7&_nc_sid=34156e&_nc_ohc=1lmmfjhgULYQ7kNvwG3LPIr&_nc_oc=Adpj2xvYx1pBowH2zr-6WbFdA1AbbmJqb906s9OQEYylrrloSF-FyzJ8dW8qZIHWVwE&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=B4mFtuY6CZ3R37cOTNVbXw&_nc_ss=7b289&oh=00_Af4Sap6P3WQShoB1YKyH5DzFb7JldESq6T-SjuwagKE5OA&oe=6A1017EF)

Related Topics: [Social Plugins FAQs](https://developers.facebook.com/docs/plugins/faqs/) \| [Other Social Plugins](https://developers.facebook.com/docs/plugins/)

href

tabs

width

height

small\_header

adapt\_container\_width

hide\_cover

show\_facepile

[Get code](https://developers.facebook.com/plugins/code?path=page&href=https%3A%2F%2Fwww.facebook.com%2Ffacebook&tabs=timeline&width=&height=&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true)

## Settings

In addition to the settings above, you can also change the following:

| Setting | HTML5 Attribute | Description | Default |
| --- | --- | --- | --- |
| `href` | `data-href` | The URL of the Facebook Page | None |
| `width` | `data-width` | The pixel width of the plugin. Min. is `180` & Max. is `500` | `340` |
| `height` | `data-height` | The pixel height of the plugin. Min. is `70` | `500` |
| `tabs` | `data-tabs` | Tabs to render i.e. `timeline`, `events`, `messages`. Use a comma-separated list to add multiple tabs, i.e. `timeline, events`. | `timeline` |
| `hide_cover` | `data-hide-cover` | Hide cover photo in the header | `false` |
| `show_facepile` | `data-show-facepile` | Show profile photos when friends like this | `true` |
| `hide_cta` | `data-hide-cta` | Hide the custom call to action button (if available) | `false` |
| `small_header` | `data-small-header` | Use the small header instead | `false` |
| `adapt_container_width` | `data-adapt-container-width` | Try to fit inside the container width | `true` |
| `lazy` | `data-lazy` | `true` means use the browser's lazy-loading mechanism by setting the `loading="lazy"` iframe attribute. The effect is that the browser does not render the plugin if it's not close to the viewport and might never be seen. Can be one of `true` or `false` (default). | `false` |

* * *

#### Deprecated Attributes

- The attribute `data-show-posts` is deprecated. Please use the attribute `tabs`/`data-tabs` and use the value `timeline` to show posts from the Page's timeline.

## Adding the Page Plugin to a Website

The standard configuration of the Page plugin includes only the header and a cover photo. This size is ideal for promoting your Page in a small space, such as the top of a sidebar.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/11057196_814547138621382_2035500267_n.png?_nc_cat=102&ccb=1-7&_nc_sid=34156e&_nc_ohc=fXJgFvZr6UgQ7kNvwGuw2fo&_nc_oc=AdosSx8P0G0oRWODU4oFnVFQwaGC9rRxMRgIGXlQk91PEv0htdgt7rnwc-WJtXC1Q9E&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=B4mFtuY6CZ3R37cOTNVbXw&_nc_ss=7b289&oh=00_Af4e7HKEN2V4tbHIzNtpYvqmyXGIal_vtYkCUIMLVG0MVw&oe=6A102BD3)

```code
<div class="fb-page"
data-href="https://www.facebook.com/facebook"
data-width="380"
data-hide-cover="false"
data-show-facepile="false"></div>
```

## Call to Action

If your page has a custom call to action button, it will be shown instead of the default call to action which is a Share button.

If the width of the plugin is less than 280px, the default Share button will be shown to prevent design misalignment in different translations.

## Page Tabs: Timeline, Events & Messages

You can now have **timeline**, **events** and **messages** tabs on the plugin:

- **Timeline Tab**: Will show the most recent posts of your Facebook Page timeline.
- **Events Tab**: People can follow your page events and subscribe to events from the plugin.
- **Messages Tab**: People can message your page directly from your website. People need to be logged in to use this feature.

#### Enabling Messaging on your Page

To **enable messaging** on your Facebook page go to your Page `Settings`. In the row `Messages` check _Allow people to contact my Page privately by showing the Message button_ (Direct Link: `https://www.facebook.com/{your-page-name}/settings/?tab=settings&section=messages&view`).

### Adding Multiple Tabs

Use a comma-separated list within the `data-tabs` attribute to add multiple tabs:

```code
<div class="fb-page"
data-tabs="timeline,events,messages"
data-href="https://www.facebook.com/YoloBookStore"
data-width="380"
data-hide-cover="false"></div>
```

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/12057237_1662622527318962_131547157_n.png?_nc_cat=101&ccb=1-7&_nc_sid=34156e&_nc_ohc=c7EMrAl6LpEQ7kNvwGMIR5T&_nc_oc=AdpPQia7v_sT-xiZYQhmksp1AdkWdjhlcxnWLl_dJJTkwe2wrZVr5dcwgmhvo_sn4Ss&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=B4mFtuY6CZ3R37cOTNVbXw&_nc_ss=7b289&oh=00_Af6Y2zA4Y94V7nYNLBYKAnSI3wRjTcol1pe-fCEOtT-Xlw&oe=6A0FFB61)![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/12057061_1644168045832714_875341193_n.png?_nc_cat=101&ccb=1-7&_nc_sid=34156e&_nc_ohc=PQkh3a1KVroQ7kNvwEWr1-A&_nc_oc=AdptaqbuY0EQWB53d1Jkv5nObqXCyvFmPJASARBIsAHSLhyyaXi_FkyCsb7alGJxtrg&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=B4mFtuY6CZ3R37cOTNVbXw&_nc_ss=7b289&oh=00_Af4F7dMXMmPEsVPzpH2kLg3U0KHmQ2HvuoCZ-J-9JRzq5w&oe=6A1013B6)

### Single Tab

You can also just add a single tab showing either the `timeline`, `events` or `messages`:

```code
<div class="fb-page"
data-tabs="events"
data-href="https://www.facebook.com/YoloBookStore"
data-width="380"></div>
```

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/12057124_775374362608456_95209275_n.png?_nc_cat=108&ccb=1-7&_nc_sid=34156e&_nc_ohc=4B4ppBqWCecQ7kNvwF_xdwI&_nc_oc=Adrj8pxtAFd0j5zXkDZw9n2g631Uw5gft4NxGhka5HCjASTDnQr0Bsqq4VhzMNmMSyU&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=B4mFtuY6CZ3R37cOTNVbXw&_nc_ss=7b289&oh=00_Af6uMKO4CgR5Xmlhk9Vw-MFrWFyszsHEg5c13O3pOoLvLQ&oe=6A0FFBD2)

## Adaptive Width

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/11057181_383155111880231_558429982_n.png?_nc_cat=101&ccb=1-7&_nc_sid=34156e&_nc_ohc=LEvitmEpOC4Q7kNvwEMY4ZO&_nc_oc=AdpuTSZiYBBJoZqV5aEOBAMd-U6QyXRo5mJSb2JN7KYEloSQQ7xzqJxGb6qpCjgLauM&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=B4mFtuY6CZ3R37cOTNVbXw&_nc_ss=7b289&oh=00_Af5Q5GSoJZA_XBp64aGBIypL3n0BDwdP_bvBOt9WGavcgQ&oe=6A1011F7)

The plugin will by default adapt to the `width` of its parent container **on page load** (min. `180px` / max. `500px`), useful for changing layout:

```code
<div style="width: 190px;">
<!-- Page plugin's width will be 190px -->
<div class="fb-page" data-href="{url}" data-width="420"></div>
</div>
```

If the `width` of the parent element is bigger than the Page plugin's `width` it will maintain the value defined in `data-width`:

```code
<div style="width: 600px;">
<!-- Page plugin's width will be 500px -->
<div class="fb-page" data-href="{url}" data-width="500"></div>
</div>
```

The plugin will never be smaller than `180px`:

```code
<div style="width: 100px;">
<!-- Page plugin's width will be 180px -->
<div class="fb-page" data-href="{url}" data-width="320"></div>
</div>
```

Adaptive width can be switched off by unchecking **Adapt to plugin container width** and the plugin will rendered at the specified width irrespective of the parent container.

### No Dynamic Resizing

The Page plugin works with responsive, fluid and static layouts. You can use media queries or other methods to set the `width` of the parent element, yet:

- The plugin will determine its `width` **on page load**
- It will **not** react changes to the [box model](https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.w3schools.com%2Fcss%2Fcss_boxmodel.asp&h=AUCdmcZIPGTswufmR1WdEhtjzQdRZie_WsDV2fEZEOi4CHVWQsz1LkLqSeIR-_Xv1mN4axY-YzGZ2ZMsOG8sr4jdPXcgWk4r8j2_9luynK-iHlSQBmrkL9Ch4pUbk_C5fLRVFHMn-mtx9A) **after page load**.

If you want to adjust the plugin's `width` on window resize, you manually need to rerender the plugin.

## Show Friend's Faces

Show who likes your Page with real people's profile images rather than just a number. People visting your Page will see a count of friends that like the Page as well as their profile photos.

This option can be activated by checking `Show Friend's Faces` in the configurator.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/11057084_1449730138650837_1049443498_n.png?_nc_cat=100&ccb=1-7&_nc_sid=34156e&_nc_ohc=JDJOkJvFAEEQ7kNvwEBC_WS&_nc_oc=AdrldrjzVv69w7-ckmlBmVzY1VyNIjnKSqa-Uev8GBwJugQr63Z-FyN1_Si8-CgLnLk&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=B4mFtuY6CZ3R37cOTNVbXw&_nc_ss=7b289&oh=00_Af6JHBmVvvBhkl8-F68VG2B0b_CNgQtWHk04WabxV18kFQ&oe=6A10262F)

```code
<div class="fb-page"
data-href="https://www.facebook.com/imdb"
data-width="340"
data-hide-cover="false"
data-show-facepile="true"></div>
```

## Privacy Restricted Pages

Facebook Pages with privacy restrictions cannot be embedded.

## Changing the Language

You can change the language of the Page plugin plugin by loading a localized version of the Facebook JavaScript SDK. When you load the SDK, change the value of `js.src` to use your locale. Replace `en_US` with your locale, e.g., `ru_RU` for Russian (Russia):

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/11414408_1609358342662230_177361670_n.png?_nc_cat=106&ccb=1-7&_nc_sid=34156e&_nc_ohc=yrjP1rb4ZIoQ7kNvwHl0Tl_&_nc_oc=AdqJN7drqtiAa9YWz1IImkuuuMXYb5bJEAQP9XfcsdVuktLinYkfYfPQEea5P8pZx1A&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=B4mFtuY6CZ3R37cOTNVbXw&_nc_ss=7b289&oh=00_Af5tKt8181q5I81ipifzhsqk04Msscoufjpf2z1WP8IVkg&oe=6A1010F4)

Example

```code
js.src = "https://connect.facebook.net/ru_RU/sdk.js#xfbml=1&amp;version=v2.5";
```

Supported locales are referenced in the [Facebook Locales XML file](https://www.facebook.com/translations/FacebookLocales.xml).
You may need to adjust the width of a Social Plugin to accommodate different languages. You may find more information on our [Localization & Translation](https://developers.facebook.com/docs/internationalization) page.

On This Page

[Page Plugin](https://developers.facebook.com/docs/plugins/page-plugin/#page-plugin)

[Settings](https://developers.facebook.com/docs/plugins/page-plugin/#settings)

[Adding the Page Plugin to a Website](https://developers.facebook.com/docs/plugins/page-plugin/#how-to)

[Call to Action](https://developers.facebook.com/docs/plugins/page-plugin/#cta)

[Page Tabs: Timeline, Events & Messages](https://developers.facebook.com/docs/plugins/page-plugin/#page-tabs)

[Adding Multiple Tabs](https://developers.facebook.com/docs/plugins/page-plugin/#adding-multiple-tabs)

[Single Tab](https://developers.facebook.com/docs/plugins/page-plugin/#single-tab)

[Adaptive Width](https://developers.facebook.com/docs/plugins/page-plugin/#adaptive-width)

[No Dynamic Resizing](https://developers.facebook.com/docs/plugins/page-plugin/#resizing)

[Show Friend's Faces](https://developers.facebook.com/docs/plugins/page-plugin/#friends-faces)

[Privacy Restricted Pages](https://developers.facebook.com/docs/plugins/page-plugin/#privacy)

[Changing the Language](https://developers.facebook.com/docs/plugins/page-plugin/#language)