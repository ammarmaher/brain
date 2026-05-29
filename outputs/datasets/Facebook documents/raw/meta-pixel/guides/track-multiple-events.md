---
url: https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events
title: Track Multiple Events - Meta Pixel
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmeta-pixel%2Fguides%2Ftrack-multiple-events%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Pixel](https://developers.facebook.com/docs/meta-pixel)

- [Get Started](https://developers.facebook.com/docs/meta-pixel/get-started)
- [Guides](https://developers.facebook.com/docs/meta-pixel/guides)


  - [Track Multiple Events](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events)
  - [Advanced](https://developers.facebook.com/docs/meta-pixel/advanced)
  - [Advanced Matching](https://developers.facebook.com/docs/meta-pixel/advanced/advanced-matching)
  - [Custom Audiences](https://developers.facebook.com/docs/meta-pixel/implementation/custom-audiences)
  - [Tagging SPAs](https://developers.facebook.com/docs/meta-pixel/implementation/tag_spa)
  - [Terms and Policies](https://developers.facebook.com/docs/meta-pixel/guides/terms-and-policies)

- [Support](https://developers.facebook.com/docs/meta-pixel/support)
- [Reference](https://developers.facebook.com/docs/meta-pixel/reference)

On This Page

[Track Multiple Events with Meta Pixels](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#track-multiple-events-with-meta-pixels)

[Multiple Pixels](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#multiple-pixels)

[Unexpected Behavior](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#unexpected-behavior)

[Example: Two Pixels in Two Base Codes](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#example--two-pixels-in-two-base-codes)

[Example: Two Pixel IDs in a Single Base Code](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#example--two-pixel-ids-in-a-single-base-code)

[Why do the above snippets yield unexpected results?](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#why-do-the-above-snippets-yield-unexpected-results-)

[New Capabilities—trackSingle and trackSingleCustom](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#new-capabilities-tracksingle-and-tracksinglecustom)

[Takeaways](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#takeaways)

# Track Multiple Events with Meta Pixels

Implementing a Pixel is one of the cornerstones of Meta Marketing to help you measure, optimize your ads and create the most relevant audiences for your business. Quite often, planning the optimal setup for your site may simply be getting the base Pixel code on to your site and tagging key elements or critical parts of your funnel. But in some cases, you may legitimately need to have multiple Pixels on the site to satisfy business realities.

## Multiple Pixels

There are instances where multiple Pixels could be a viable option to manage your marketing needs—especially when there are multiple stakeholders involved.

Imagine your large organization deals with one agency (Agency A) for performance marketing and another agency for branding activity (Agency B). Agency A and B have different processes to update their tags (for example, tag managers/containers and ownership) and plan all their activity separately.

In this scenario, what would be the best recommendation to consolidate these multiple codes to reduce the maintenance burden, ensure the most accurate tracking and minimize the possibility of technical errors?

## Unexpected Behavior

The two following examples demonstrate instances where there may be unexpected behavior or extraneous Pixel events firing. This firing could skew reporting and yield undesirable results when working with multiple codes.

Consider the scenario where Agency A wants to track a Purchase in Pixel A and Agency B wants to track a custom event (Step4) on Pixel B. They've installed two base codes on the same page to fire when it loads.

### Example: Two Pixels in Two Base Codes

The following code is installed:

```htm
<script>
  //... base code truncated
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL-A');
  fbq('track', 'PageView');
  fbq('track', 'Purchase', {
                  'value': 4,
                  'currency': 'GBP'
  });
</script>

<script>
  // ... base code truncated
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL-B');
  fbq('track', 'PageView');
  fbq('trackCustom', 'Step4'); //fires for both Pixel A and B
</script>
```

You expect Purchase events to be captured in Pixel A and Step4 to be captured in Pixel B; however, this isn't the case. The end result is summarized in the table:

| Pixel | PageView Event | Purchase Event | Step4 Event |
| --- | --- | --- | --- |
| Pixel A | Fired | Fired | Fired (Why?) |
| Pixel B | Fired | - | Fired |

Even if there are two base Pixel codes, the `fbevents.js` code only downloads or loads once.

### Example: Two Pixel IDs in a Single Base Code

The following (modified) code is installed:

```htm
<script>
  // ... base code truncated
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL-A');
  fbq('track', 'PageView');
  fbq('track', 'Purchase', {
                  'value': 4,
                  'currency': 'GBP'
  });

  fbq('init', 'PIXEL-B');
  fbq('track', 'PageView');
  fbq('trackCustom', 'Step4'); //fires for both Pixel A and B
</script>
```

Nevertheless, the above code still yields the exact same overfiring behavior as above.

### Why do the above snippets yield unexpected results?

When the init function is called against a Pixel ID, it stores it in a global `queue` structure where any subsequent call to track or `trackCustom` is fired for any Pixel that was previously initialized.

In the previous example, this is why the `Step4` custom event is fired for Pixel A, even when the trackCustom call is inserted after the initialization call for Pixel B. If unaware of this behavior, you may be firing extra events that may inadvertently affect reporting.

### New Capabilities—`trackSingle` and `trackSingleCustom`

In early November 2017, two new capabilities (`trackSingle` and `trackSingleCustom`) were added to the Pixel. These options enable you to selectively fire events for a specific Pixel—even when multiple Pixels are initialized on the page—without unexpected consequences.

For example, to fire the `Purchase` standard event only on Pixel A and `Step4` custom event only on Pixel B, you can use the `trackSingle` or `trackSingleCustom` feature.

The following snippet selectively fires events on each Pixel by specifying the specific Pixel ID and the events or parameters required:

```htm
<script>
  //... base code truncated
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL-A');
  fbq('init', 'PIXEL-B');
  fbq('track', 'PageView'); //fire PageView for both initialized pixels

  // only fire the Purchase event for Pixel A
  fbq('trackSingle', 'PIXEL-A', 'Purchase', {
        value: 4,
        currency: 'GBP',
  });

  // only fire the custom event Step4 for Pixel B
  fbq('trackSingleCustom', 'PIXEL-B', 'Step4',{
    //optional parameters
  });

</script>
```

| Pixel | PageView Event | Purchase Event | Step4 Event |
| --- | --- | --- | --- |
| Pixel A | Fired | Fired | - |
| Pixel B | Fired | - | Fired |

## Takeaways

Understanding the behavioral differences among track, `trackSingle` or `trackSingleCustom` is important when there's a possibility of multiple Pixels interacting on your page.

Using these new capabilities allows accurate tracking for multiple Pixels and ensures there's no conflicting or unexpected behavior when events are defined to fire.

On This Page

[Track Multiple Events with Meta Pixels](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#track-multiple-events-with-meta-pixels)

[Multiple Pixels](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#multiple-pixels)

[Unexpected Behavior](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#unexpected-behavior)

[Example: Two Pixels in Two Base Codes](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#example--two-pixels-in-two-base-codes)

[Example: Two Pixel IDs in a Single Base Code](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#example--two-pixel-ids-in-a-single-base-code)

[Why do the above snippets yield unexpected results?](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#why-do-the-above-snippets-yield-unexpected-results-)

[New Capabilities—trackSingle and trackSingleCustom](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#new-capabilities-tracksingle-and-tracksinglecustom)

[Takeaways](https://developers.facebook.com/docs/meta-pixel/guides/track-multiple-events#takeaways)