---
url: https://developers.facebook.com/docs/meta-pixel/get-started
title: Get Started - Meta Pixel
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmeta-pixel%2Fget-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Pixel](https://developers.facebook.com/docs/meta-pixel)

- [Get Started](https://developers.facebook.com/docs/meta-pixel/get-started)


  - [Conversion Tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking)
  - [Pixel for Collaborative Ads](https://developers.facebook.com/docs/meta-pixel/implementation/pixel-for-collaborative-ads)
  - [Pixel for Advantage+ Catalog Ads](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads)
  - [Pixel for Marketing API](https://developers.facebook.com/docs/meta-pixel/implementation/marketing-api)
  - [Pixel for Movies](https://developers.facebook.com/docs/meta-pixel/implementation/pixel-for-movies)

- [Guides](https://developers.facebook.com/docs/meta-pixel/guides)
- [Support](https://developers.facebook.com/docs/meta-pixel/support)
- [Reference](https://developers.facebook.com/docs/meta-pixel/reference)

On This Page

[Get Started](https://developers.facebook.com/docs/meta-pixel/get-started#get-started)

[Base Code](https://developers.facebook.com/docs/meta-pixel/get-started#base-code)

[Installing The Pixel](https://developers.facebook.com/docs/meta-pixel/get-started#installing-the-pixel)

[Installing Using a Tag Manager](https://developers.facebook.com/docs/meta-pixel/get-started#tag-manager)

[Installing Using an IMG Tag](https://developers.facebook.com/docs/meta-pixel/get-started#img-tag)

[Mobile Websites](https://developers.facebook.com/docs/meta-pixel/get-started#mobile-websites)

[Pixel Helper](https://developers.facebook.com/docs/meta-pixel/get-started#pixel-helper)

[Next Steps](https://developers.facebook.com/docs/meta-pixel/get-started#next-steps)

[Resources](https://developers.facebook.com/docs/meta-pixel/get-started#resources)

# Get Started

The Meta Pixel is a snippet of JavaScript code that loads a small library of functions you can use to track Facebook ad-driven visitor activity on your website. It relies on [Facebook cookies](https://www.facebook.com/policies/cookies/), which enable us to match your website visitors to their respective Facebook User accounts. Once matched, we can tally their actions in the Facebook Ads Manager so you can use the data to analyze your website's conversion flows and optimize your ad campaigns.

By default, the Pixel will track URLs visited, domains visited, and the devices your visitors use. In addition, you can use the Pixel's library of functions to:

- [track conversions](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking), so you can measure ad effectiveness
- define [custom audiences](https://developers.facebook.com/docs/facebook-pixel/implementation/custom-audiences), so you can target visitors who are more likely to convert
- set up [Advantage+ catalog ads](https://developers.facebook.com/docs/facebook-pixel/implementation/dynamic-ads) campaigns

### Requirements

In order to implement the Pixel, you will need:

- access to your website's code base
- your Pixel's [base code](https://developers.facebook.com/docs/facebook-pixel/implementation) or its ID
- access to the [Facebook Ads Manager](https://www.facebook.com/adsmanager)

In addition, depending on where you conduct business, you may have to comply with [General Data Protection Regulation](https://developers.facebook.com/docs/facebook-pixel/implementation/gdpr).

Ready? [Let's get started](https://developers.facebook.com/docs/facebook-pixel/implementation).

## Base Code

Before you can install the Pixel, you will need your Pixel's base code, which you can find in the [Ads Manager > Events Manager](https://business.facebook.com/events_manager). If you have not created a Pixel, [follow these instructions](https://www.facebook.com/business/help/952192354843755) to create one — all you will need is the Pixel's base code (step 1).

The base Pixel code contains your Pixel's ID in two places and looks like this:

```code
<!-- Facebook Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', '{your-pixel-id-goes-here}');
  fbq('track', 'PageView');
</script>
<noscript>
  <img height="1" width="1" style="display:none"
       src="https://www.facebook.com/tr?id={your-pixel-id-goes-here}&ev=PageView&noscript=1"/>
</noscript>
<!-- End Facebook Pixel Code -->
```

When run, this code will download a library of functions which you can then use for [conversion tracking](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking). It also automatically tracks a single `PageView` conversion by calling the `fbq()` function each time it loads. _We recommend that you leave this function call intact_.

## Installing The Pixel

To install the Pixel, we highly recommend that you add its base code between the opening and closing `<head>` tags on every page where you will be tracking website visitor actions. Most developers add it to their website's persistent header, so it can be used on all pages.

Placing the code within your `<head>` tags reduces the chances of browsers or third-party code blocking the Pixel's execution. It also executes the code sooner, increasing the chance that your visitors are tracked before they leave your page.

Once you have added it to your website, load a page that has the Pixel. This should call `fbq('track', 'PageView')`, which will be tracked as a `PageView` event in the Events Manager.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/40918111_2211034969153925_7326281962849566720_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=ScWlpjlAYr4Q7kNvwFdwwQ6&_nc_oc=Adq7UDvh7v_jyVuDycjLKsHwUlTVipED6QHQAA0kPXEikWoZ_s6Tl3_80g64qQdsLOQ&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=VlC6O_dQLzqnRTr8GMgtkg&_nc_ss=7b289&oh=00_Af5BENY7qJbnK8tMN4yJHx4vdlrdL3jR_JhTHIhxPqapvA&oe=6A256BE5)

Verify that this event was tracked by going to your Events Manager. Locate your Pixel and click its details — if you see a new `PageView` event, you have successfully installed the Pixel. If you do not see it, wait a few minutes and refresh the page. If your Pixel is still not working, use the [Pixel Helper](https://developers.facebook.com/docs/meta-pixel/get-started#pixel-helper) to track down the problem.

### Installing Using a Tag Manager

Although we recommend adding the Pixel directly to your website's `<head>` tags, the Pixel will work in most tag management and tag container solutions. For specific advice on implementing the Pixel using your tag manager, please refer to your tag manager's documentation.

### Installing Using an IMG Tag

Although not recommended, you can alternately [install the Pixel using an `<img>` tag](https://developers.facebook.com/docs/facebook-pixel/advanced#installing-the-pixel-using-an-img-tag).

### Mobile Websites

If your mobile website is separate from your desktop website, we recommend that you add the Pixel to both. This will allow you to easily remarket to your mobile visitors, exclude them, or create lookalikes audiences.

## Pixel Helper

We highly recommend that you install our [Pixel Helper](https://developers.facebook.com/docs/facebook-pixel/support/pixel-helper) Chrome extension. The Pixel Helper provides extremely valuable feedback that can help you verify that your Pixel is working correctly, especially when you start tracking conversions, where you can easily encounter formatting errors.

## Next Steps

Once you have verified that the Pixel is installed and tracking the `PageView` event correctly, you can use the Pixel to:

- [track conversions](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking)
- create [custom audiences](https://developers.facebook.com/docs/facebook-pixel/implementation/custom-audiences)
- set up [Advantage+ catalog ads](https://developers.facebook.com/docs/facebook-pixel/implementation/dynamic-ads)

Learn more about implementing the Pixel with [Blueprint](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fcollection%2F240330%2Fpath%2F210139%3Fcontent_id%3DyyTGMzFI48JBDxv&h=AUAyP5yzGOAv6bSq1PruO4yLSyQ3bzxOiLepTxOGV8Drj_pLme0JBErhn_pRYpHFs7L7x5IW37-zoQBCkugYFLjKSMpZ-iZiYoUH-WnBJs5SnddEPM_Ar9-2xBQImxng22IR36ZQu04IiA).

## Resources

- Meta Blueprint: [Learn more about implementing the pixel](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fpath%2F219710-technical-implementation-meta-pixel%3Fcontent_id%3Den4RqCL2PfBZrUU&h=AUBMfsZbs0P3oSvXTLeu4W_lTEmP0BNZ20yL37j_chxhFQYfTZEb2zlUdLQaDR6vgajvrI_LoBHc3O837qN6f78b8ZFV7DoforxcDU2RqZzjY3osBsr10z5wbjQezgvN-ioYaYKf3Y7DUw)

On This Page

[Get Started](https://developers.facebook.com/docs/meta-pixel/get-started#get-started)

[Base Code](https://developers.facebook.com/docs/meta-pixel/get-started#base-code)

[Installing The Pixel](https://developers.facebook.com/docs/meta-pixel/get-started#installing-the-pixel)

[Installing Using a Tag Manager](https://developers.facebook.com/docs/meta-pixel/get-started#tag-manager)

[Installing Using an IMG Tag](https://developers.facebook.com/docs/meta-pixel/get-started#img-tag)

[Mobile Websites](https://developers.facebook.com/docs/meta-pixel/get-started#mobile-websites)

[Pixel Helper](https://developers.facebook.com/docs/meta-pixel/get-started#pixel-helper)

[Next Steps](https://developers.facebook.com/docs/meta-pixel/get-started#next-steps)

[Resources](https://developers.facebook.com/docs/meta-pixel/get-started#resources)