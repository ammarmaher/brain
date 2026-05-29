---
url: https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/
title: Graph API Reference v25.0: Ad Asset Feed Spec
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmarketing-api%2Freference%2Fad-asset-feed-spec%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Marketing API](https://developers.facebook.com/docs/marketing-api)

- [Overview](https://developers.facebook.com/docs/marketing-api/overview)
- [Get Started](https://developers.facebook.com/docs/marketing-api/get-started)
- [Ad Creative](https://developers.facebook.com/docs/marketing-api/creative)
- [Bidding](https://developers.facebook.com/docs/marketing-api/bidding)
- [Ad Rules Engine](https://developers.facebook.com/docs/marketing-api/ad-rules)
- [Audiences](https://developers.facebook.com/docs/marketing-api/audiences)
- [Insights API](https://developers.facebook.com/docs/marketing-api/insights)
- [Brand Safety and Suitability](https://developers.facebook.com/docs/marketing-api/brand-safety-and-suitability)
- [Best Practices](https://developers.facebook.com/docs/marketing-api/best-practices)
- [Troubleshooting](https://developers.facebook.com/docs/marketing-api/troubleshooting)
- [API Reference](https://developers.facebook.com/docs/marketing-api/reference)


  - [Ad Account](https://developers.facebook.com/docs/marketing-api/reference/ad-account)
  - [Ad Image](https://developers.facebook.com/docs/marketing-api/reference/ad-image)
  - [Ad Previews](https://developers.facebook.com/docs/marketing-api/generatepreview)
  - [Ad Preview Plugin](https://developers.facebook.com/docs/marketing-api/ad-preview-plugin)
  - [Business](https://developers.facebook.com/docs/marketing-api/reference/business)
  - [Business Role Request](https://developers.facebook.com/docs/marketing-api/reference/business-role-request)
  - [Business User](https://developers.facebook.com/docs/marketing-api/reference/business-user)
  - [Currencies](https://developers.facebook.com/docs/marketing-api/currencies)
  - [High Demand Period](https://developers.facebook.com/docs/marketing-api/reference/high-demand-period)
  - [Image Crop](https://developers.facebook.com/docs/marketing-api/image-crops)
  - [Product Catalog](https://developers.facebook.com/docs/marketing-api/reference/product-catalog)
  - [System User](https://developers.facebook.com/docs/marketing-api/reference/system-user)

- [Changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)

On This Page

[Ad Asset Feed Spec](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#Reading)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#fields)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#Creating)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#Updating)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#)

# Ad Asset Feed Spec

## Reading

Asset feed spec including specs of different ad assets, formats and call to actions

### Parameters

This endpoint doesn't have any parameters.

### Fields

| Field | Description |
| --- | --- |
| `ad_formats`<br>list<enum> | Ad format spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `additional_data`<br>[AdAssetFeedAdditionalData](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-additional-data/) | Additional data for the asset feed<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `app_product_page_id`<br>string | Custom Product Page / Custom Store Listing ID for App Install ads. **Note**: Do not put the full URL into the field. Put only the ID.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `asset_customization_rules`<br>[list<AdAssetFeedSpecAssetCustomizationRule>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-asset-customization-rule/) | Target rules spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `audios`<br>list<AdAssetAudios> | The audio asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `autotranslate`<br>list<string> | List of auto translated languages<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `bodies`<br>[list<AdAssetFeedSpecBody>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-body/) | Ad body asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `call_ads_configuration`<br>AdAssetCallAdsConfigurationFeedSpec | call\_ads\_configuration<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `call_to_action_types`<br>list<enum {OPEN\_LINK, LIKE\_PAGE, SHOP\_NOW, PLAY\_GAME, INSTALL\_APP, USE\_APP, CALL, CALL\_ME, VIDEO\_CALL, INSTALL\_MOBILE\_APP, USE\_MOBILE\_APP, MOBILE\_DOWNLOAD, BOOK\_TRAVEL, LISTEN\_MUSIC, WATCH\_VIDEO, LEARN\_MORE, SIGN\_UP, DOWNLOAD, WATCH\_MORE, NO\_BUTTON, VISIT\_PAGES\_FEED, CALL\_NOW, APPLY\_NOW, CONTACT, BUY\_NOW, GET\_OFFER, GET\_OFFER\_VIEW, BUY\_TICKETS, UPDATE\_APP, GET\_DIRECTIONS, BUY, SEND\_UPDATES, MESSAGE\_PAGE, DONATE, SUBSCRIBE, SAY\_THANKS, SELL\_NOW, SHARE, DONATE\_NOW, GET\_QUOTE, CONTACT\_US, ORDER\_NOW, START\_ORDER, ADD\_TO\_CART, VIEW\_CART, VIEW\_IN\_CART, VIDEO\_ANNOTATION, RECORD\_NOW, INQUIRE\_NOW, CONFIRM, REFER\_FRIENDS, REQUEST\_TIME, GET\_SHOWTIMES, LISTEN\_NOW, TRY\_DEMO, WOODHENGE\_SUPPORT, SOTTO\_SUBSCRIBE, FOLLOW\_USER, RAISE\_MONEY, SEE\_SHOP, GET\_DETAILS, FIND\_OUT\_MORE, VISIT\_WEBSITE, BROWSE\_SHOP, EVENT\_RSVP, WHATSAPP\_MESSAGE, FOLLOW\_NEWS\_STORYLINE, SEE\_MORE, BOOK\_NOW, FIND\_A\_GROUP, FIND\_YOUR\_GROUPS, PAY\_TO\_ACCESS, PURCHASE\_GIFT\_CARDS, FOLLOW\_PAGE, SEND\_A\_GIFT, SWIPE\_UP\_SHOP, SWIPE\_UP\_PRODUCT, SEND\_GIFT\_MONEY, PLAY\_GAME\_ON\_FACEBOOK, GET\_STARTED, OPEN\_INSTANT\_APP, AUDIO\_CALL, GET\_PROMOTIONS, JOIN\_CHANNEL, MAKE\_AN\_APPOINTMENT, ASK\_ABOUT\_SERVICES, BOOK\_A\_CONSULTATION, GET\_A\_QUOTE, BUY\_VIA\_MESSAGE, ASK\_FOR\_MORE\_INFO, CHAT\_WITH\_US, VIEW\_PRODUCT, VIEW\_CHANNEL, GET\_IN\_TOUCH, ASK\_A\_QUESTION, START\_A\_CHAT, CHAT\_NOW, ASK\_US, WATCH\_LIVE\_VIDEO, JOIN\_LIVE\_VIDEO, SHOP\_WITH\_AI, TRY\_ON\_WITH\_AI}> | Ad call to action spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `call_to_actions`<br>[list<AdAssetFeedSpecCallToAction>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-call-to-action/) | Ad call to action spec in asset feed spec<br>Visible only to intern apps or Special Ad Categories asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `captions`<br>[list<AdAssetFeedSpecCaption>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-caption/) | Ad caption asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `ctwa_consent_data`<br>list<AdAssetCtwaConsentData> | Ctwa consent data asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `descriptions`<br>[list<AdAssetFeedSpecDescription>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-description/) | Ad description asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `events`<br>list<AdAssetFeedSpecEvents> | Ad event asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `groups`<br>[list<AdAssetFeedSpecGroupRule>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-group-rule/) | Groups spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `images`<br>[list<AdAssetFeedSpecImage>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-image/) | Ad image asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `link_urls`<br>[list<AdAssetFeedSpecLinkURL>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-link-url/) | Ad link urls asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `message_extensions`<br>list<AdAssetMessageExtensions> | message extensions indicates if advertisers opted in message extension feature<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `optimization_type`<br>enum | Optimization type used in asset feed. Possible values are [`ASSET_CUSTOMIZATION`](https://developers.facebook.com/docs/marketing-api/dyn-language-optimization#custom), [`LANGUAGE`](https://developers.facebook.com/docs/marketing-api/dyn-language-optimization), [`PLACEMENT`](https://developers.facebook.com/docs/marketing-api/buying-api/ad-units#placements), [`REGULAR`](https://developers.facebook.com/docs/marketing-api/asset-feed/), and [`FORMAT_AUTOMATION`](https://developers.facebook.com/docs/marketing-api/dynamic-ads-format-personalization).<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `promotional_metadata`<br>[AdAssetPromotionalMetadata](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-promotional-metadata/) | Used to highlight promo codes to maximize conversions and optimize ad spend. Campaigns created with “highlight your promo codes” have shown a 9% median reduction in cost per purchase and a 10% median increase in conversions rate for website purchases.<br>When someone interacts with your ad that has this feature on, the promo code will be highlighted to them. If someone then goes to check out on your website within the in-app browser, the promo code can be automatically applied or easily copy-pasted to be applied at checkout.<br>The promo codes that are highlighted and applied are sourced from your ad creative, existing ad inventory, your website and/or any synced offers in your Commerce Manager. Meta will also automatically update active and eligible promo codes for the duration of your ad campaign.<br>Only supported for sales campaign with web (IAB) conversion location.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `titles`<br>[list<AdAssetFeedSpecTitle>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-title/) | Ad title asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `translations`<br>list<AdAssetTranslations> | translations<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `videos`<br>[list<AdAssetFeedSpecVideo>](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec-video/) | Ad video asset spec in asset feed spec<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `web_destination_spec`<br>AdAssetWebDestinationSpec | This field contains web destination spec for app promotion campaigns.<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Ad Asset Feed Spec](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#Reading)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#fields)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#Creating)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#Updating)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/#Deleting)