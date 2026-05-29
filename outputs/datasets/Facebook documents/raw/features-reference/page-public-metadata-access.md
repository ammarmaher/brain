---
url: https://developers.facebook.com/docs/features-reference/page-public-metadata-access
title: Page Public Metadata Access - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Ffeatures-reference%2Fpage-public-metadata-access%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)


  - [Ad Targeting Data Access](https://developers.facebook.com/docs/features-reference/ad-targeting-data-access)
  - [Ads Management Standard Access](https://developers.facebook.com/docs/features-reference/ads-management-standard-access)
  - [Business Asset User Profile Access](https://developers.facebook.com/docs/features-reference/business-asset-user-profile-access)
  - [Human Agent](https://developers.facebook.com/docs/features-reference/human-agent)
  - [Instagram Public Content Access](https://developers.facebook.com/docs/features-reference/instagram-public-content-access)
  - [Instant Games Zero Permission Access](https://developers.facebook.com/docs/features-reference/instant-games-zero-permission-access)
  - [Live Video API](https://developers.facebook.com/docs/features-reference/live-video-api)
  - [Meta oEmbed Read](https://developers.facebook.com/docs/features-reference/meta-oembed-read)
  - [oEmbed Read](https://developers.facebook.com/docs/features-reference/oembed-read)
  - [Page Mentioning](https://developers.facebook.com/docs/features-reference/page-mentioning)
  - [Page Public Content Access](https://developers.facebook.com/docs/features-reference/page-public-content-access)
  - [Page Public Metadata Access](https://developers.facebook.com/docs/features-reference/page-public-metadata-access)
  - [Threads oEmbed Read](https://developers.facebook.com/docs/features-reference/threads-oembed-read)
  - [Threat Exchange](https://developers.facebook.com/docs/features-reference/threat-exchange)

- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)
- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)
- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)
- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)
- [Release](https://developers.facebook.com/docs/development/release)
- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Page Public Metadata Access](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#page-public-metadata-access)

[Allowed Usage](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#allowed-usage)

[Common Endpoints](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#common-endpoints)

[Additional Details](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#additional-details)

# Page Public Metadata Access

_Requires [App Review](https://developers.facebook.com/docs/app-review)._

The **Page Public Metadata Access** allows your app access to the [Pages Search API](https://developers.facebook.com/docs/pages/searching) and to read public data for Pages for which you lack the [pages\_read\_engagement permission](https://developers.facebook.com/docs/permissions/reference/pages_read_engagement) and the [pages\_read\_user\_content permission](https://developers.facebook.com/docs/permissions/reference/pages_read_user_content). The allowed usage for this feature is to analyze engagement with public Pages by viewing Like and follower counts, or aggregate public-facing **About** Page information from multiple, disparate pages. You may also use this permission to request analytics insights to improve your app and for marketing or advertising purposes, through the use of aggregated and de-identified or anonymized information (provided such data cannot be re-identified).

## Allowed Usage

- Analyze engagement with public Pages by viewing Like and follower counts.

- Aggregate public-facing "about" Page information from multiple, disparate pages.


## Common Endpoints

[/page](https://developers.facebook.com/docs/graph-api/reference/page)

## Additional Details

- This permission or feature requires successful completion of the App Review process before your app can access live data. [Learn More.](https://developers.facebook.com/docs/app-review)

- This permission or feature is only available with business verification. You may also need to sign additional contracts before your app can access data. [Learn More Here](https://developers.facebook.com/docs/development/release/business-verification)

- If your app also needs to read the [Page Feed](https://developers.facebook.com/docs/graph-api/reference/page/feed) edge, or [Comments](https://developers.facebook.com/docs/graph-api/reference/comment) on a Page's [Posts](https://developers.facebook.com/docs/graph-api/reference/post), request the [Page Public Content Access](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#page-public-content-access) feature instead.

- This feature is superseded by the Page Public Content Access (PPCA) feature. If your App Review submission includes PPCA, or your app has already been approved for PPCA, you cannot request this permission.

- If your app also needs to create, update, or delete data on a Page, request the [`pages_read_engagement`](https://developers.facebook.com/docs/permission/reference/pages_read_engagement) permission instead.


On This Page

[Page Public Metadata Access](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#page-public-metadata-access)

[Allowed Usage](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#allowed-usage)

[Common Endpoints](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#common-endpoints)

[Additional Details](https://developers.facebook.com/docs/features-reference/page-public-metadata-access#additional-details)