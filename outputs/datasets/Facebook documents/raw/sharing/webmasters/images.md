---
url: https://developers.facebook.com/docs/sharing/webmasters/images/
title: Images in Link Shares - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fwebmasters%2Fimages%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images/#images-in-link-shares)

# Images in Link Shares

## The Open Graph meta-tag

The `og:image` tag can be used to specify the URL of the image that appears when someone shares the content to Facebook. The full list of image properties can be found [here](https://developers.facebook.com/docs/sharing/opengraph/object-properties#image).

## Requirements

- The minimum allowed image dimension is 200 x 200 pixels.
- The size of the image file must not exceed 8 MB.
- Use images that are at least 1200 x 630 pixels for the best display on high resolution devices. At the minimum, you should use images that are 600 x 315 pixels to display link page posts with larger images.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/851562_1376970469205025_523101852_n.png?_nc_cat=101&ccb=1-7&_nc_sid=34156e&_nc_ohc=2DRzQFFpHaMQ7kNvwEJQYWR&_nc_oc=Adqtkh8Mg2B3P9NMiO7AYCFEmTQtTx74-DGFz5rAaXqEAoe31anBcgQU5NZM_WoK2l8&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=5j_gMtq1M5RSqaMfIZzDlQ&_nc_ss=7b289&oh=00_Af6kcOPI6CtKb4Iwg_aeji6OTcqW4i9B9DYoFHrDgMgffw&oe=6A0F08B4)

- If your image is smaller than 600 x 315 px, it will still display in the link page post, but the size will be much smaller.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/851560_389589627833470_1903099476_n.png?_nc_cat=107&ccb=1-7&_nc_sid=34156e&_nc_ohc=L1GGQ8ldu0kQ7kNvwEtGHMQ&_nc_oc=AdrBN2MFxKFCEgu53w1HYJx7NiuplgPQZATpa4594yGaNjg_QPpvRhnpjrRVj9A0IrA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=5j_gMtq1M5RSqaMfIZzDlQ&_nc_ss=7b289&oh=00_Af4CZZEpHKEZUUHDGw2sFI_Cf8-jOgKYhgLfOLB4xRXJBA&oe=6A0F03E4)

- We've also re-designed link page posts so that the aspect ratio for images is the same across desktop and mobile Feed. Try to keep your images as close to 1.91:1 aspect ratio as possible to display the full image in Feed without any cropping.
- Our crawler only accepts **gzip** and **deflate** encodings, so make sure your server uses the right encoding.

## Pre-caching images

When content is shared for the first time, the [Facebook crawler](https://developers.facebook.com/docs/sharing/webmasters/crawler) will scrape and cache the metadata from the URL shared. The crawler has to see an image at least once before it can be rendered. This means that the first person who shares a piece of content won't see a rendered image:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/10734301_667829036664367_516015575_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=oSRjOVjcQigQ7kNvwFQbEU9&_nc_oc=Adp4rGm4aDUXbd8f87aLmBEl_1DBjK34EVRGQmIs36qgLE_SG60k2Ln-I1lhxhvuj7M&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=5j_gMtq1M5RSqaMfIZzDlQ&_nc_ss=7b289&oh=00_Af6uwUoKDFAxYALNXM_Sh6jFC8XP_doZx3Pn2O5wmSHuDQ&oe=6A0EF3ED)

There are three ways to avoid this and have images render on the first Like or Share action:

1. **Pre-cache the image with the [Sharing Debugger](https://developers.facebook.com/tools/debug):**
Run the URL through the URL debugger to pre-fetch metadata for the page. This can also be used to update the image for a piece of content.

2. **Pre-cache the image using [Graph API](https://developers.facebook.com/docs/sharing/opengraph/using-objects#update)**: Perform a force-scrape of the URL programmatically using the Graph API to pre-fetch metadata for the page . This can also be used to update the image for a piece of content.

3. **Use `og:image:width` and `og:image:height` Open Graph tags**:
Using these tags will specify the image dimensions to the crawler so that it can render the image immediately without having to asynchronously download and process it.


## Updating images

We cache all images referenced based on each image's URL, so if you replace an image:

- **Use a new URL for the new image** or the image won't be updated
- Don't remove old images, as there maybe existing stories that reference the old image
- Follow the instructions in the section [above](https://developers.facebook.com/docs/sharing/webmasters/images/#precaching) to ensure that the new image has been downloaded by our crawler.

Note that updating the image for a URL will not automatically update the preview for old shares. To do this, you must refresh the share as described [here](https://developers.facebook.com/docs/sharing/webmasters/faq#faq_1131343433556264).

## Troubleshooting

If you have any problems with images not being displayed correctly for a URL, try plugging in the **image URL** in the [Sharing Debugger](https://developers.facebook.com/tools/debug) for any errors. If you think there's an issue on our side, consider [filing a bug report](https://developers.facebook.com/support/bugs/) to us.

On This Page

[Images in Link Shares](https://developers.facebook.com/docs/sharing/webmasters/images/#images-in-link-shares)