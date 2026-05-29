---
url: https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking
title: Conversion Tracking - Meta Pixel
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmeta-pixel%2Fimplementation%2Fconversion-tracking%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Conversion Tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#conversion-tracking)

[Standard Events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#standard-events)

[Tracking Standard Events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#tracking-standard-events)

[Custom Events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-events)

[Tracking Custom Events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#tracking-custom-events)

[Custom Conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-conversions)

[Creating Custom Conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#creating-custom-conversions)

[Rule-Based Custom Conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#rule-based-custom-conversions)

[Custom Conversions Insights](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-conversions-insights)

[Custom Conversions Limitations](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-conversions-limitations)

[Flagged custom conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#flagged-custom-conversions)

[Track Offsite Conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#track-offsite-conversions)

[Parameters](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#parameters)

[Object Properties](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#object-properites)

[Custom Properties](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-properties)

[Next Steps](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#next-steps)

[Learn More](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#learn-more)

# Conversion Tracking

You can use the Meta Pixel to track your website visitors' actions also known as conversion tracking. Tracked conversions appear in the [Facebook Ads Manager](https://www.facebook.com/adsmanager) and the [Facebook Events Manager](https://www.facebook.com/events_manager2), where they can be used to analyze the effectiveness of your conversion funnel and to calculate your return on ad investment. You can also use tracked conversions to define [custom audiences](https://developers.facebook.com/docs/facebook-pixel/implementation/custom-audiences) for ad optimization and [Advantage+ catalog ads](https://developers.facebook.com/docs/facebook-pixel/implementation/dynamic-ads) campaigns. Once you have defined custom audiences, we can use them to identify other Facebook users who are likely to convert and target them with your ads.

There are three ways to track conversions with the Pixel:

- [standard events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#standard-events), which are visitor actions that we have defined and that you report by calling a Pixel function
- [custom events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-events), which are visitor actions that you have defined and that you report by calling a Pixel function
- [custom conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-conversions), which are visitor actions that are tracked automatically by parsing your website's referrer URLs

Beginning September 2, 2025, we will start to roll out more proactive restrictions on custom conversions that may suggest information not permitted under [our terms](https://www.facebook.com/legal/terms/businesstools?_rdr). For example, any custom conversion suggesting specific health conditions (e.g., "arthritis", "diabetes") or financial status (e.g., "credit score", "high income") will be flagged and prevented from being used to run ad campaigns.

**What these restrictions mean for your campaigns:**

- You won’t be able to use flagged custom conversions when creating new campaigns.
- If you have an active campaign using flagged custom conversions, you should either create a new campaign or duplicate your campaign and use a non-impacted custom conversion to avoid performance and optimization issues.

**For API developers:**

- Beginning September 2, 2025, the field `is_unavailable` will return `true` to signal if your custom conversions have been flagged.

More information on this update and how to resolve flagged custom conversions can be found [here](https://www.facebook.com/business/help/2455915321411996).

### Requirements

The Pixel's [base code](https://developers.facebook.com/docs/facebook-pixel/implementation#base-code) must already be installed on every page where you want to track conversions.

## Standard Events

[Standard events](https://developers.facebook.com/docs/facebook-pixel/reference#standard-events) are predefined visitor actions that correspond to common, conversion-related activities, such as searching for a product, viewing a product, or purchasing a product. Standard events support [parameters](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#parameters), which allow you to include an object containing additional information about an event, such as product IDs, categories, and the number of products purchased.

For a full list of [Standard events](https://developers.facebook.com/docs/facebook-pixel/reference#standard-events) visit the [Pixel Standard Events Reference](https://developers.facebook.com/docs/facebook-pixel/reference#standard-events). Learn more about conversion tracking and standard events with [Blueprint](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fpath%2F219710-technical-implementation-meta-pixel%3Fcontent_id%3Den4RqCL2PfBZrUU&h=AUAj8EFlllhXPvT2bism1dRMaLCUpPB7GmqgQNxGIAC53Z89eKFjJFYjPfkD56TQ8YOHBqR7mGghytK92TiUNB8Qo6o5eksKHQvfUyr55HQO_Me6ljREUR43PJJrcfOGfKrS3bzKS1tjcw).

### Tracking Standard Events

All standard events are tracked by calling the Pixel's `fbq('track')` function, with the event name, and (optionally) a JSON object as its parameters. For example, here's a function call to track when a visitor has completed a purchase event, with currency and value included as a parameter:

```js
fbq('track', 'Purchase', {currency: "USD", value: 30.00});
```

If you called that function, it would be tracked as a purchase event in the Events Manager:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/39949625_1790839247617931_4027789432194072576_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=imRjePAbgz4Q7kNvwE9GEIu&_nc_oc=Adon-DV-lEDMJd4aX1NyINejfc0EormbDTNgDLe7c5Ms7WE6qAtw4KgYyLDZ5ORJbTs&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=bZolngfnxBRzlUCFO9sZEg&_nc_ss=7b289&oh=00_Af5HmnxAEzYa9_IkB18dNo3bx9y7JA4aVv_pUM-oFNw_zw&oe=6A25439C)

You can call the `fbq('track')` function anywhere between your web page's opening and closing `<body>` tags, either when the page loads, or when a visitor completes an action, such as clicking a button.

For example, if you wanted to track a standard purchase event _after a visitor has completed the purchase_, you could call the `fbq('track')` function on your _purchase confirmation page_, like this:

```js
<body>
  ...
  <script>
    fbq('track', 'Purchase', {currency: "USD", value: 30.00});
  </script>
  ...
</body>
```

If instead you wanted to track a standard purchase event _when the visitor clicks a purchase button_, you could tie the `fbq('track')` function call to the purchase button _on your checkout page_, like this:

```js
<button id="addToCartButton">Purchase</button>
<script type="text/javascript">
  $('#addToCartButton').click(function() {
    fbq('track', 'Purchase', {currency: "USD", value: 30.00});
  });
</script>
```

Note that the example above uses jQuery to trigger the function call, but you could trigger the function call using any method you wish.

## Custom Events

If our predefined standard events aren't suitable for your needs, you can track your own custom events, which also can be used to define [custom audiences](https://developers.facebook.com/docs/facebook-pixel/implementation/custom-audiences) for ad optimization. Custom events also support [parameters](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#parameters), which you can include to provide additional information about each custom event.

Learn more about conversion tracking and custom events with [Blueprint](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fpath%2F219710-technical-implementation-meta-pixel%3Fcontent_id%3Den4RqCL2PfBZrUU&h=AUATS3m95N58EocBdd0P9j2vwQx12VeAVnItWKXzJVW_LedKIGJ6WW9YM7iDD3tA5wCq4KwdyF86vr-a2xd9xsot3zDbt7Ja_WyselP9LV7bMGdIRJicanewbRiUf-YMwdXCYLQTDKkNIw).

### Tracking Custom Events

You can track custom events by calling the Pixel's `fbq('trackCustom')` function, with your custom event name and (optionally) a JSON object as its parameters. Just like standard events, you can call the `fbq('trackCustom')` function anywhere between your webpage's opening and closing `<body>` tags, either when your page loads, or when a visitor performs an action like clicking a button.

For example, let's say you wanted to track visitors who share a promotion in order to get a discount. You could track them using a custom event like this:

```js
fbq('trackCustom', 'ShareDiscount', {promotion: 'share_discount_10%'});
```

Custom event names must be strings, and cannot exceed 50 characters in length.

## Custom Conversions

Each time the Pixel loads, it automatically calls `fbq('track', 'PageView')` to track a PageView standard event. PageView standard events record the referrer URL of the page that triggered the function call. You can use these recorded URLs in the Events Manager to define visitor actions that should be tracked.

For example, let's say that you send visitors who subscribe to your mailing list to a thank you page. You could set up a custom conversion that tracks website visitors who have viewed any page that has `/thank-you` in its URL. Assuming your thank you page is the only page with `/thank-you` in its URL, and you've installed the Pixel on that page, anyone who views it will be tracked using that custom conversion.

Once tracked, custom conversions can be used to optimize your ad campaigns, to define [custom audiences](https://developers.facebook.com/docs/facebook-pixel/implementation/custom-audiences), and to further refine custom audiences that rely on standard or custom events. Learn more about custom conversions with [Blueprint](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fpath%2F219710-technical-implementation-meta-pixel%3Fcontent_id%3Den4RqCL2PfBZrUU&h=AUAdzSnBCBYslVahZQtiD-Xe8AEXNUkxyBLhjDOZuFXs1LdbBEoDYvkGfOEGXh4wOGnsNnB6CSLyKFWzGxk4_HyzmLXjUHLU6tWyWnsaNmac-hWlppSng3J-S1TjCk6JBPbxr3S05Q6v-Q).

Since custom conversions rely on complete or partial URLs, you should make sure that you can define visitor actions exclusively based on unique strings in your website URLs.

### Creating Custom Conversions

Custom conversions are created entirely within the Events Manager. Refer to our [Advertiser Help document](https://www.facebook.com/business/help/434245993430255) to learn how.

### Rule-Based Custom Conversions

Optimize for actions and track them without adding anything to your Meta Pixel base code. You can do this beyond the 17 standard events.

1. Create a custom conversion at `/{AD_ACCOUNT_ID}/customconversions`.
2. Specify a URL, or partial URL, representing an event in `pixel_rule`. For example, `thankyou.html` is a page appearing after purchase.

This records a `PURCHASE` conversion when `'thankyou.html'` displays:

You can then create your campaign using the `CONVERSIONS` objective.

At the ad set level, specify the same custom conversion (`pixel_id`, `pixel_rule`, `custom_event_type`) in `promoted_object`.

### Custom Conversions Insights

[Ads Insights](https://developers.facebook.com/docs/marketing-api/insights-api) returns information about Custom Conversions:

```code
curl -i -G \
-d 'fields=actions,action_values' \
-d 'access_token=<ACCESS_TOKEN>' \
https://graph.facebook.com/v2.7/<AD_ID>/insights
```

Returns both standard and custom conversions:

```code
{
  "data": [\
    {\
      "actions": [\
        {\
          "action_type": "offsite_conversion.custom.17067367629523",\
          "value": 1225\
        },\
        {\
          "action_type": "offsite_conversion.fb_pixel_purchase",\
          "value": 205\
        }\
      ],\
      "action_values": [\
        {\
          "action_type": "offsite_conversion.custom.1706736762929507",\
          "value": 29390.89\
        },\
        {\
          "action_type": "offsite_conversion.fb_pixel_purchase",\
          "value": 29390.89\
        }\
      ],\
      "date_start": "2016-07-28",\
      "date_stop": "2016-08-26"\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "MAZDZD",
      "after": "MjQZD"
    },
    "next": "https://graph.facebook.com/v2.7/<AD_ID>/insights?access_token=<ACCESS_TOKEN>&amp;pretty=0&amp;fields=actions%2Caction_values&amp;date_preset=last_30_days&amp;level=adset&amp;limit=25&amp;after=MjQZD"
  }
}
```

Custom conversions have unique IDs; query it for a specific conversion, such as a rule-based one:

```code
curl -i -G \
-d 'fields=name,pixel,pixel_aggregation_rule' \
-d 'access_token=ACCESS-TOKEN' \
https://graph.facebook.com/v2.7/<CUSTOM_CONVERSION_ID>
```

### Custom Conversions Limitations

The maximum number of custom conversions per ad account is 100. If you use Ads Insights API to get metrics on custom conversions:

- Getting product ID breakdowns are not supported.
- Getting unique action counts are not supported.

### Flagged custom conversions

If a custom conversion is flagged, the `is_unavailable` field will be set to `true`.

```html
{
  "is_unavailable": true,
  "id": "30141209892193360"
}
```

#### To resolve flagged custom conversions

If any of your custom conversions are flagged for suggesting information that is not allowed under our terms, you may want to consider the following options:

To resolve a flagged custom conversion in a new campaign creation:

- **Create new custom conversion**: Use a new custom conversion and make sure that it does not include information that is not allowed under our terms.
- **Choose a different custom conversion**: Select a different existing custom conversion and make sure it does not include information that is not allowed under our terms.

To resolve a flagged custom conversion in an existing campaign:

- **Duplicate your campaign and select an existing custom conversion**: If you have a running campaign that is flagged due to a flagged custom conversion, consider duplicating the campaign and selecting a different custom conversion that is not flagged before publishing the new duplicated campaign. **Note:** Once the campaign is published, you cannot remove or select a different custom conversion.

#### Request a review

If you believe your custom conversion has been flagged in error and doesn't include non-permitted information, you can request a review via Ads Manager under the campaigns table, or in Events Manager under the custom conversions page.

## Track Offsite Conversions

Track offsite conversions with your Pixels by adding the `fb_pixel` field to the `tracking_spec` parameter of your ad. [Learn more.](https://developers.facebook.com/docs/marketing-api/tracking-specs)

## Parameters

Parameters are optional, JSON-formatted objects that you can include when tracking standard and custom events. They allow you to provide additional information about your website visitors' actions. Once tracked, parameters can be used to further define any custom audiences you create. Learn more about parameters with [Blueprint](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fpath%2F219710-technical-implementation-meta-pixel%3Fcontent_id%3Den4RqCL2PfBZrUU&h=AUAMzBxeP8uLPWoaObo_ervLsPKaBzDje7U3ytLgpAlD7Kos7OEFN0uTaHGWxWiF-APSCpHKeRIi3P0tjRrX69zgX8kNPJDPs4uP_PzpUtZDaJEj4OmcsQbhdcwz_c951k1F32uVyv-HtA).

To include a parameter object with a standard or custom event, format your parameter data as an object using JSON, then include it as the third function parameter when calling the `fbq('track')` or `fbq('trackCustom')` functions.

For example, let's say you wanted to track a visitor who purchased multiple products as a result of your promotion. You could do this:

```js
fbq('track', 'Purchase',
  // begin parameter object data
  {
    value: 115.00,
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
    content_type: 'product'
  }
  // end parameter object data
);
```

Note that if you want to use data included in event parameters when defining custom audiences, **key values must not contain any spaces**.

### Object Properties

You can include the following predefined object properties with any custom events and any [standard events that support them](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#standard-events). Format your parameter object data using JSON.

| Property Key | Value Type | Parameter Description |
| --- | --- | --- |
| `content_category` | string | Category of the page or product. |
| `content_ids` | array of integers or strings | Product IDs associated with the event, such as SKUs. Example: `['ABC123', 'XYZ789']`. |
| `content_name` | string | Name of the page/product. |
| `content_type` | string | Can be `product` or `product_group` based on the `content_ids` or `contents` being passed. If the IDs being passed in the `content_ids` or `contents` parameter are IDs of products, then the value should be `product`. If product group IDs are being passed, then the value should be `product_group`. |
| `contents` | array of objects | Array of JSON objects that contains the International Article Number (EAN) when applicable or other product or content identifier(s) associated with the event, and quantities and prices of the products. **Required**: `id` and `quantity`.<br>Example: `[{'id': 'ABC123', 'quantity': 2}, {'id': 'XYZ789', 'quantity': 2}]` |
| `currency` | string | Currency for the `value` specified. |
| `delivery_category` | string | Category of the delivery. Supported values:<br>- `in_store` — Purchase requires customer to enter to the store.<br>- `curbside` — Purchase requires curbside pickup<br>- `home_delivery` — Purchase is delivered to the customer. |
| `num_items` | integer | Number of items when checkout was initiated. Used with the `InitiateCheckout` event. |
| `predicted_ltv` | integer, float | Predicted lifetime value of a subscriber as defined by the advertiser and expressed as an exact value. |
| `search_string` | string | String entered by the user for the search. Used with the `Search` event. |
| `status` | Boolean | Used with the `CompleteRegistration` event, to show the status of the registration. |
| `value` | integer or float | Required for purchase events or any events that utilize value optimization. A numeric value associated with the event. This must represent a monetary amount. |

### Custom Properties

If our predefined object properties don't suit your needs, you can include your own, custom properties. Custom properties can be used with both standard and custom events, and can help you further define custom audiences.

For example, let's say you wanted to track a visitor who purchased multiple products after having first compared them to other products. You could do this:

```js
fbq('track', 'Purchase',
  // begin parameter object data
  {
    value: 115.00,
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
    content_type: 'product',
    compared_product: 'recommended-banner-shoes',  // custom property
    delivery_category: 'in_store'
  }
  // end parameter object data
);
```

## Next Steps

Now that you're tracking conversions, we recommend that you use them to define [custom audiences](https://developers.facebook.com/docs/facebook-pixel/implementation/custom-audiences), so you can optimize your ads for website conversions.

## Learn More

- Learn more about conversion tracking with [Blueprint](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookblueprint.com%2Fstudent%2Fpath%2F219710-technical-implementation-meta-pixel%3Fcontent_id%3Den4RqCL2PfBZrUU&h=AUB6QP2m1OzmYF4r8bGG1FptvntZPUAYY0knS6DSzlc3CvN6gGNUtTvuRKmwhwtDj39K8SDhdRY3JYFEf2hxDAFyQ59HH1-Q_WXYkNziHyoUtzCmnagYR-K_ptig5paYVvS84OhZwZhsbA).

On This Page

[Conversion Tracking](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#conversion-tracking)

[Standard Events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#standard-events)

[Tracking Standard Events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#tracking-standard-events)

[Custom Events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-events)

[Tracking Custom Events](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#tracking-custom-events)

[Custom Conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-conversions)

[Creating Custom Conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#creating-custom-conversions)

[Rule-Based Custom Conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#rule-based-custom-conversions)

[Custom Conversions Insights](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-conversions-insights)

[Custom Conversions Limitations](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-conversions-limitations)

[Flagged custom conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#flagged-custom-conversions)

[Track Offsite Conversions](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#track-offsite-conversions)

[Parameters](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#parameters)

[Object Properties](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#object-properites)

[Custom Properties](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#custom-properties)

[Next Steps](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#next-steps)

[Learn More](https://developers.facebook.com/docs/meta-pixel/implementation/conversion-tracking#learn-more)