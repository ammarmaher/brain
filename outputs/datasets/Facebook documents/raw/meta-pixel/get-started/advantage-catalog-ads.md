---
url: https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads
title: Pixel for Advantage+ Catalog Ads - Meta Pixel
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmeta-pixel%2Fget-started%2Fadvantage-catalog-ads%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Meta Pixel for Advantage+ Catalog Ads](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#meta-pixel-for-advantage--catalog-ads)

[Standard Events](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#standard-events)

[Object Properties](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#object-properties)

[content\_ids](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#content-ids)

[contents](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#contents)

[Commerce Manager](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#commerce-manager)

# Meta Pixel for Advantage+ Catalog Ads

Advantage+ catalog ads are dynamically created by populating an ad template with product information found in a data feed. This allows you to create thousands of ads without having to configure each of them individually. You can also use Advantage+ catalog ads to target visitors based on how they have interacted with your website in the past.

The general steps for creating Advantage+ catalog ads are:

1. Set up conversion tracking for the specific [standard events](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#standard-events) and their parameter [object properties](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#object-properties) listed below, then
2. Use the Commerce Manager to [set up a Advantage+ catalog ad set](https://www.facebook.com/business/help/1132465490107046?helpref=page_content) that targets those events

### Requirements

- You must have a Facebook Page for the business that your Advantage+ catalog ads will apply to.
- The Pixel [base code](https://developers.facebook.com/docs/facebook-pixel/implementation#base-code) must already be installed.
- You must have access to the [Facebook Ads Manager](https://www.facebook.com/adsmanager).

Learn more about connecting your Pixel to a commerce catalog with [Blueprint](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fcollection%2F240330%2Fpath%2F210141%3Fcontent_id%3DE0G2EVplyh1dDB1&h=AUBzeXnJ4HagVzIsfra3SOqUq-HdFN8L-oRRKsx8OYAR2HoAHgb3p4zVqLtyIMUSdNXCItaC0IYjV4tntam1sRX_Q2PVDeCUoyPDMcX9I5UNMYUJ77CuYLS0_KkGV-PQRj-KjK0Wkoxalw).

## Standard Events

Before you can set up Advantage+ catalog ads, you must first be tracking the following [standard events](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking#standard-events). You must also include a parameter object with specific object properties with each tracked event.

| Required Event | Required Object Properties |
| --- | --- |
| `AddToCart` | Either `content_ids` or `contents` |
| `Purchase` | Either `content_ids` or `contents` |
| `ViewContent` | Either `content_ids` or `contents` |

Refer to the [Object Properties](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#object-properties) section below to learn what values to assign to the required object properties.

## Object Properties

### `content_ids`

If you are using the `content_ids` property in your parameter object, its value should correspond to the product ID or product IDs associated with the action. **IDs must match the IDs found in your product catalog**. Values can be either single IDs, or an array of IDs.

For example, here's how to track a visitor who has added products with the IDs `201` and `301` to a shopping cart. The IDs match the IDs for those products in the product catalog.

```code
fbq('track', 'AddToCart',
  // begin required parameter object
  {
    value: .5,
    currency: 'USD',
    content_ids: ['201', '301'] // required property, if not using 'contents' property
  }
  // end required parameter object
);
```

### `contents`

If you are using the `contents` property in your parameter object, in a sub-object, you must include the `id` property, with the product ID or product IDs as its value, and include the `quantity` property with a number of product items being added to cart or purchased. **IDs must match the IDs found in your product catalog**. `contents` property value must be an array of objects.

For example, here's how to track a visitor who has added a product with the ID `301`, and two products with the ID `401`, to a shopping cart. The IDs match the IDs for those products in the product catalog.

```code
fbq('track', 'AddToCart', {
  value: .5,
  currency: 'USD',
  contents: [\
    {\
      id: '301',\
      quantity: 1\
    },\
    {\
      id: '401',\
      quantity: 2\
    }],
});
```

## Commerce Manager

Once you have confirmed that the Events Manager is tracking your standard events correctly, use the [Commerce Manager](https://business.facebook.com/products) to set up your product catalog and Advantage+ catalog ad template, and target the standard events. Follow our [Create an Advantage+ Catalog Ad](https://www.facebook.com/business/help/1132465490107046) help document to do this.

After you complete all of the steps outlined in the document, be sure to use the Commerce Manager to verify that your catalog [recognizes your Pixel's events as a data source](https://www.facebook.com/business/help/946671458738854).

Note that it can take up to 24 hours for the Commerce Manager's **Events Data Sources** tab to recognize your tracked events.

On This Page

[Meta Pixel for Advantage+ Catalog Ads](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#meta-pixel-for-advantage--catalog-ads)

[Standard Events](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#standard-events)

[Object Properties](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#object-properties)

[content\_ids](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#content-ids)

[contents](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#contents)

[Commerce Manager](https://developers.facebook.com/docs/meta-pixel/get-started/advantage-catalog-ads#commerce-manager)