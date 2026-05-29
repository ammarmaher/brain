---
url: https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers
title: Ads.txt - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Fbest-practices%2Fauthorized-sellers%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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
  - [Data Processing Options for US Users](https://developers.facebook.com/docs/audience-network/optimization/best-practices/data-processing-options)
  - [COPPA](https://developers.facebook.com/docs/audience-network/optimization/best-practices/coppa)

- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Identifying Authorized Sellers with ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers#identifying-authorized-sellers-with-ads-txt)

[ads.txt Record Format](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers#ads-txt-record-format)

[Example for Publishers Working with Audience Network](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers#example-for-publishers-working-with-audience-network)

# Identifying Authorized Sellers with ads.txt

Facebook has committed to reducing ad fraud by adopting the [ADS.TXT - Authorized Digital Sellers](https://l.facebook.com/l.php?u=https%3A%2F%2Fiabtechlab.com%2Fads-txt%2F&h=AUB-tp8MzAb-B8N8WGeTxg2WFcp-uenS--u2KrEJBxb83UgtKKsvCMY5FcHnfQSY5Pg8KjZpuuen433VCS6j_LFGxj8z_Bfm_OCKCf5tOBCSaudJ0nHLVC0FPs8bMJ6TJv3vgFtzmkE-ug) initiative. As an Audience Network publisher, you are required to participate in this initiative by placing a crawlable `ads.txt` file on your site and adding a record in the file that identifies facebook.com as an authorized reseller of your ads.

## ads.txt Record Format

An ads.txt record consists of a single line comprised of four fields separated by commas.

The ads.txt record fields are as follows:

| Field | Description | Value |
| --- | --- | --- |
| `Ad System Domain` | (Required) The canonical domain name of the advertising system to which the bidder connects. | `facebook.com` |
| `Publisher Account ID` | (Required) The identifier associated with the reseller account within the advertising system. | Your property IDs or Business ID |
| `Account Type/Relationship` | (Required) An enumeration of the type of account. | `RESELLER` |
| `Certificate Authority ID` | An ID that uniquely identifies the<br>advertising system within a certification authority. | `c3e20eee3f780d68` |

### Example for Publishers Working with Audience Network

To add Facebook to your ads.txt, you have the option of using either property IDs or your business ID. In either case, the ads.txt file must be located at `http://yourdomain.com/ads.txt` and be visible to web crawlers.

#### Adding Facebook with Property IDs

To add Facebook to your ads.text with property IDs, copy and paste the following string to each of your properties. (Note: You must also update the property ID for each string.)

```txt
facebook.com, Property ID, RESELLER, c3e20eee3f780d68
```

The following is an example.

```txt
[...]
facebook.com, 1000001, RESELLER, c3e20eee3f780d68
facebook.com, 1000002, RESELLER, c3e20eee3f780d68
facebook.com, 1000003, RESELLER, c3e20eee3f780d68
[...]
```

#### Adding Facebook with a Business ID

To add Facebook to your ads.txt with a business ID, copy and paste the following string containing your Business ID. This is the option for publishers with several property IDs.

```txt
facebook.com, Business ID, RESELLER, c3e20eee3f780d68
```

For more information on the format of the ads.txt file, see [IAB Tech Lab, Ads.txt Specification](https://l.facebook.com/l.php?u=https%3A%2F%2Fiabtechlab.com%2Fwp-content%2Fuploads%2F2019%2F03%2FIAB-OpenRTB-Ads.txt-Public-Spec-1.0.2.pdf&h=AUAXJaj8uXkCNdXhi88CXQbX1PfeLZTySUi0QchVrhsq-iyGo3BMuezZ52VfPl8o-PbD53KIwByqIRbpeW6hPJyLWFaeBbZZcRxJI_B5ofpLTPPXj9AiJOq4ZAy7_FnYNzPi-E-lwGCsjg).

On This Page

[Identifying Authorized Sellers with ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers#identifying-authorized-sellers-with-ads-txt)

[ads.txt Record Format](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers#ads-txt-record-format)

[Example for Publishers Working with Audience Network](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers#example-for-publishers-working-with-audience-network)