---
url: https://developers.facebook.com/docs/plugins/restrictions
title: Child-Directed Sites - Social Plugins
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2Frestrictions%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Social Plugins](https://developers.facebook.com/docs/plugins)

- [Embedded Posts](https://developers.facebook.com/docs/plugins/embedded-posts)
- [Page Plugin](https://developers.facebook.com/docs/plugins/page-plugin)
- [Share Button](https://developers.facebook.com/docs/plugins/share-button)
- [Child-Directed Sites](https://developers.facebook.com/docs/plugins/restrictions)
- [Best Practices](https://developers.facebook.com/docs/plugins/best-practices)

On This Page

[Information for Child-Directed Sites and Services](https://developers.facebook.com/docs/plugins/restrictions#Information)

[Primarily Child-Directed or Mixed Audience Without Age Gate](https://developers.facebook.com/docs/plugins/restrictions#child-directed)

[kid\_directed\_site Parameter for the Like Button (iframe version)](https://developers.facebook.com/docs/plugins/restrictions#kdsparam1)

[kidDirectedSite Parameter for the Like Button (JavaScript SDK version)](https://developers.facebook.com/docs/plugins/restrictions#kdsparamjs1)

[Mixed Audience with Age Gate](https://developers.facebook.com/docs/plugins/restrictions#mixed-with-age-gate)

[Individuals Represent as 13+](https://developers.facebook.com/docs/plugins/restrictions#-individuals-represent-as-13-)

[Individuals Represent as <13](https://developers.facebook.com/docs/plugins/restrictions#individuals-represent-as--13)

# Information for Child-Directed Sites and Services

When you use Social Plugins or the Facebook SDK for JavaScript on sites or services, including apps, that are directed to children, or on sites, apps or services where you knowingly collect personal information from children, you are responsible for complying with all applicable laws.

For example, in the United States, operators of websites, apps or services that are directed to children under 13 or that knowingly collect personal information from children under 13 must comply with the [U.S. Children’s Online Privacy Protection Act](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fprivacy-and-security%2Fchildrens-privacy&h=AUATQt3aZOYVZVYxTWY2lnfwahPaZ21Ia34Ya_4hwixBJbBJ0KNaZtFY5bE0VQ3XCfhtwycSdK_iyXtFe_d55_FdCbUsPLxUMz2mPqhYsrAcL8AtpEKNl3s4VhDqtsPLZZs98hZV2QmmBA). This document includes the alternative code that you are required to use for our Social Plugins and the Facebook SDK for JavaScript in the United States and any other country or state where applicable laws require child-directed sites and services to distinguish themselves from other general audience sites, apps or services.

The social plugins that you may use depends on your determination of which of the following categories applies to your site, app or service:

1. **[Primarily child-directed](https://developers.facebook.com/docs/plugins/restrictions#child-directed)**. Your site, app or service is [directed to children](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUD16yBjj9SygSxiwAnxnzGq19FvtbdTQyyXvUwane1nsMNEyEpYm6xNwQDKe9rBY4rMitKIz4mcJKFPEe-_aWSfE5pMSl1vSivSk9cik-RcNIa-wDXxsHtmWeWie465TNFN75pGFLpjNQ) whose primary target audience is children under the age of 13.
2. **[Mixed audience without age gate](https://developers.facebook.com/docs/plugins/restrictions#child-directed)**. Your site, app or service is [directed to children](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUBN8K6EI2LkHWiusGBiiDiAYkKshdpDyNQjTn-uLfl7xP-Qno4ika5q9ShyiBnGwxAuLINLftB62ZjJsrGU73llZllY8RVUtd4Y_5_8If7PUgbgejws1Hn-uCfkvvI7KS0o8XpFgobGrg) but its primary target audience is people who are at least 13 years old. Your site, app or service does not include an age gate. An “age gate” generally is a mechanism that asks users to provide their age or date of birth in a non-leading way before they access a website or service. For more information [click here](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUBVbm7mUdazSvoTRk_AlJy4HjZ8Saz1LjSYLjifOrdlx8RVf4tzFCjpz7DOLm3czAMkWBkyN0xRl9lgBPhFEoee0DEnqaOqNODyuvhQOsgrZ-nkLtUBIVtJLm0jElTev8WYrQXTnVZDcg).
3. **[Mixed audience with age gate](https://developers.facebook.com/docs/plugins/restrictions#mixed-with-age-gate)**. Your site, app or service is [directed to children](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUAPuQfhvRTHNRvZh9CMI3-z58VgKW_Fers-m1rcgHBfX160oeg1Gp_lB-BEaCU-9E1_St40Sqowf8s0LTB1BYx1XcKZKdEESnDqJrgXzIS37ggPj7hqef4lRSVqVIdTtHyxfUoZXKak6A) but its primary target audience is people who are at least 13 years old. Your site, app or service uses an age gate. An “age gate” generally is a mechanism that asks users to provide their age or date of birth in a non-leading way before they access a website or service. For more information [click here](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUAT9Ug7nPViXNsZAa_ioog4ynnZOnJ191GqfW1kiLVX2sonQG3qzVeVtdFmRrBW68FjczhCRuMc2J32GJIIl84O9P7P1ZAS8yBD43qlEBTkF0JFXUtJHU04EW1l7pk5CMtT9FIkPILw9A).

Social plugins that are not included in the applicable category for your site, app or service should not be used.

## Primarily Child-Directed or Mixed Audience Without Age Gate

You offer either (1) a [child-directed](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.ftc.gov%2Fdocuments%2FComplying-with-COPPA-Frequently-Asked-Questions&h=AUCJkdoPjKksNFPaIOFRBcdDe1RtsQOO9gtHZ-ztRUkzK1fWQ9mIMu_g8mcQWgF00P-Y499icJ8NW6bEz94ips1x0aa75ELpEOsNiaZ9KrreKGJ2e7u6SfxedFqDUiJcenaq54qOubXWKQ) site, app or service whose primary target audience is individuals under the age of 13; or (2) a site, app or service that is directed to children, but its primary target audience is people who are at least 13 years old, and your site, app, or service does not include an age gate.

- Use only the Like Button.

- If using the iframe version of the Like Button, set the `kid_directed_site` parameter to true as shown below.

- If using the Javascript SDK version of the Like Button, set `kidDirectedSite` to true in the `FB.init()` call as shown below.


### `kid_directed_site` Parameter for the Like Button (iframe version)

If you are using the iframe version of the Like button, append the `kid_directed_site` parameter to the URL in the src attribute:

```code
<iframe
src="//www.facebook.com/plugins/like?href=http%3A%2F%2Fexample.com%2F&amp;amp;kid_directed_site=true"
  scrolling="no"
  frameborder="0"
  style="border:none; overflow:hidden; width:450px; height:80px"
  allowTransparency="true">
</iframe>
```

### `kidDirectedSite` Parameter for the Like Button (JavaScript SDK version)

If you are using the JavaScript SDK version of the Like button, you must modify how you initialize the Facebook SDK for JavaScript to include a parameter `kidDirectedSite`. You can do this in one of two ways, depending on how you currently initialize the SDK.

#### FB.init() parameter

Before:

```code
FB.init({ appID: <APP_ID>, status: true, xfbml: true });
```

After:

```code
FB.init({ appID: <APP_ID>, status: true, xfbml: true, kidDirectedSite: true });
```

#### URL Fragment

Before:

```code
https://connect.facebook.net/en_US/sdk.js#xfbml=1
```

After:

```code
https://connect.facebook.net/en_US/sdk.js#xfbml=1&amp;kidDirectedSite=1
```

## Mixed Audience with Age Gate

Your site, app or service is directed to children but its primary target audience is people who are at least 13 years old. Your site or app includes an age gate.

### Individuals Represent as 13+

When users of your site, app or service that tell you they are at least 13 years old, you may use any of our [standard general audience plugins](https://developers.facebook.com/docs/plugins).

### Individuals Represent as <13

Where users have affirmatively represented to you that they are under 13, you should not use our plugins for those users. If you want to continue using our plugins on sites, apps or services where your users are both over and under 13, you must take the following steps for those users that you know are under 13 years old. When implemented, they will prevent the plugins that you otherwise use for your site, app or service from loading to the page for the under 13 user.

- Exclude any iframes with a facebook.com domain as the src.


This works to prevent any social context being loaded from Facebook.

- Remove any social plugins tags such as `&lt;div class="fb-like" /&gt;` or `&lt;div class="fb-comments" /&gt;`.


This works to remove any social plugins that are loaded using XFBML.

- Remove the Facebook SDK for JavaScript.


This works to stop the SDK from rendering any XFBML tags (which may be social plugins) on a page.


If you offer a general audience site, app or service that implements age gates, and as a result know that specific users are under 13, you must follow the same restrictions that are outlined in this section for those under 13 users.

On This Page

[Information for Child-Directed Sites and Services](https://developers.facebook.com/docs/plugins/restrictions#Information)

[Primarily Child-Directed or Mixed Audience Without Age Gate](https://developers.facebook.com/docs/plugins/restrictions#child-directed)

[kid\_directed\_site Parameter for the Like Button (iframe version)](https://developers.facebook.com/docs/plugins/restrictions#kdsparam1)

[kidDirectedSite Parameter for the Like Button (JavaScript SDK version)](https://developers.facebook.com/docs/plugins/restrictions#kdsparamjs1)

[Mixed Audience with Age Gate](https://developers.facebook.com/docs/plugins/restrictions#mixed-with-age-gate)

[Individuals Represent as 13+](https://developers.facebook.com/docs/plugins/restrictions#-individuals-represent-as-13-)

[Individuals Represent as <13](https://developers.facebook.com/docs/plugins/restrictions#individuals-represent-as--13)