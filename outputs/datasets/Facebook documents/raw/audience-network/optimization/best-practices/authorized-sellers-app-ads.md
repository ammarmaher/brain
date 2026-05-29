---
url: https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads
title: App-ads.txt - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Fbest-practices%2Fauthorized-sellers-app-ads%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)


  - [Layout Guidelines](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices)
  - [Audio Guidelines](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices)
  - [Policy](https://developers.facebook.com/docs/audience-network/optimization/best-practices/an-policy)
  - [Ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers)
  - [App-ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads)


    - [Troubleshoot](https://developers.facebook.com/docs/audience-network/optimization/best-practices/troubleshoot-app-ads)

  - [Data Processing Options for US Users](https://developers.facebook.com/docs/audience-network/optimization/best-practices/data-processing-options)
  - [COPPA](https://developers.facebook.com/docs/audience-network/optimization/best-practices/coppa)

- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Identifying Authorized Sellers with app-ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#identifying-authorized-sellers-with-app-ads-txt)

[app-ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#app-ads-txt)

[Example for Publishers Working with Audience Network](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#example-for-publishers-working-with-audience-network)

[Adding Facebook with Property IDs](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#adding-facebook-with-property-ids)

[Adding Facebook with a Business ID](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#adding-facebook-with-a-business-id)

# Identifying Authorized Sellers with app-ads.txt

As part of its commitment to more transparency and security in the mobile advertising ecosystem, Facebook has adopted the IAB Tech Lab's
[App-ads.txt Specification](https://l.facebook.com/l.php?u=https%3A%2F%2Fiabtechlab.com%2Fwp-content%2Fuploads%2F2019%2F03%2Fapp-ads.txt-v1.0-final-.pdf&h=AUA868aWH9dRF0m79Epn2RLBll27AKwEAx8dGkYzgQY56WhE6WpNl-VhqRn6YM3eYY7vEN5wlOj-IF_qgDpVYYbn8fPT6D8XAYaUsxNHM4-9aEfGRodcYNu_6-F0N5M4CqC5v4Ow9XHtOg). It’s important both ad networks and developers do their part to participate in this movement to help remove fraud.

Like [`ads.txt`](https://developers.facebook.com/docs/audience-network/guides/authorized-sellers), `app-ads.txt` is a text file that app devs upload to their publisher website.

## app-ads.txt

An `app-ads.txt` record consists of a single line comprised of four fields separated by commas. The app-ads.txt record has the following fields.

| Field | Description | Value |
| --- | --- | --- |
| Ad System Domain | (Required) The canonical domain name of the advertising system to which the bidder connects. | facebook.com |
| Publisher Account ID | (Required) The identifier associated with your direct account or the reseller account within the advertising system. | Your property ID, Business ID, or app ID |
| Account Type/Relationship | (Required) An enumeration of the type of account.<br>If you use third party resellers to sell your inventory, they should be listed as reseller. | DIRECT or RESELLER |
| Certificate Authority ID | An ID that uniquely identifies the advertising system within a certification authority. | c3e20eee3f780d68 |

## Example for Publishers Working with Audience Network

To add Facebook to your `app-ads.txt`, you have the option of using property ID, business ID, or app ID. In all cases, you must list your developer website URL in the GooglePlay and iTunes app stores. You must have a valid developer website URL in all app stores hosting your apps.

Upload the app-ads.txt file to the root of your website domain (for example, `https://example.com/app-ads.txt`).

This is the domain of the URL that you listed in the app stores, and it hosts your app-ads.txt file. If you have not listed a URL, it can take up to 7 days for the app listing to be updated.

Please ensure you wait 24 hours after updating the app-ads.txt before running authentication again.

### Adding Facebook with Property IDs

To add Facebook to your `app-ads.txt` with property IDs, copy and paste the following string to each of your properties. (Note: You must also update the property ID for each string.)

```code
facebook.com, Property ID, RESELLER, c3e20eee3f780d68
```

The following is an example.

```code
[...]
facebook.com, 1000001, RESELLER, c3e20eee3f780d68
facebook.com, 1000002, RESELLER, c3e20eee3f780d68
facebook.com, 1000003, RESELLER, c3e20eee3f780d68[...]
```

### Adding Facebook with a Business ID

To add Facebook to your `app-ads.txt` with a business ID, copy and paste the following string containing your Business ID. This is the option for publishers with several property IDs.

```code
facebook.com, Business ID, RESELLER, c3e20eee3f780d68
```

For more information, see IAB Tech Lab's [App-ads.txt Specification](https://l.facebook.com/l.php?u=https%3A%2F%2Fiabtechlab.com%2Fwp-content%2Fuploads%2F2019%2F03%2Fapp-ads.txt-v1.0-final-.pdf&h=AUBL-tOd8hu6lS8zc5zoravvtVkwAZlqMU4p5g4Tb211EG7iPmqJYlM4nN7B1X2k_PmYuqo2PRZcn_LFGf5ekHYnvvgW1lKg-CUXS6zLZRJrB5FPHFHfUHIX2OtycaXOp6Uik_AUNlQ1Pw).

For help with troubleshooting common issues, go to [Troubleshoot issues with app-ads.txt](https://developers.facebook.com/docs/audience-network/guides/troubleshoot-app-ads)

On This Page

[Identifying Authorized Sellers with app-ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#identifying-authorized-sellers-with-app-ads-txt)

[app-ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#app-ads-txt)

[Example for Publishers Working with Audience Network](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#example-for-publishers-working-with-audience-network)

[Adding Facebook with Property IDs](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#adding-facebook-with-property-ids)

[Adding Facebook with a Business ID](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads#adding-facebook-with-a-business-id)