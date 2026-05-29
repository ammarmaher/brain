---
url: https://developers.facebook.com/docs/marketing-api/reference/adcreative
title: Graph API Reference v25.0: Ad Creative
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmarketing-api%2Freference%2Fadcreative%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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
- [Changelog](https://developers.facebook.com/docs/marketing-api/marketing-api-changelog)

On This Page

[Ad Creative](https://developers.facebook.com/docs/marketing-api/reference/adcreative#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/adcreative#Reading)

[Read Thumbnail](https://developers.facebook.com/docs/marketing-api/reference/adcreative#read_examples)

[Example](https://developers.facebook.com/docs/marketing-api/reference/adcreative#example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/adcreative#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/adcreative#fields)

[Edges](https://developers.facebook.com/docs/marketing-api/reference/adcreative#edges)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/adcreative#error-codes)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/adcreative#Creating)

[Partnership Ads Posts](https://developers.facebook.com/docs/marketing-api/reference/adcreative#partnership-ads-posts)

[Inline Page Post Creation](https://developers.facebook.com/docs/marketing-api/reference/adcreative#inline_post)

[Get Related Objects](https://developers.facebook.com/docs/marketing-api/reference/adcreative#obtaining_objects)

[Examples](https://developers.facebook.com/docs/marketing-api/reference/adcreative#create_example)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/adcreative#Updating)

[Examples](https://developers.facebook.com/docs/marketing-api/reference/adcreative#update_example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/adcreative#parameters-2)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/adcreative#return-type)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/adcreative#error-codes-2)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/adcreative#Deleting)

[Examples](https://developers.facebook.com/docs/marketing-api/reference/adcreative#delete_examples)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/adcreative#parameters-3)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/adcreative#return-type-2)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/adcreative#error-codes-3)

Graph API Version

[v25.0](https://developers.facebook.com/docs/marketing-api/reference/adcreative#)

# Ad Creative

Format which provides layout and contains content for the ad. To see available ad creatives, visit [Ads Guide](https://www.facebook.com/business/ads-guide). The guide also contains information on size requirements for each ad unit. See also [Facebook for Business](https://www.facebook.com/business/overview) and [Inline page post creation blog post](https://developers.facebook.com/ads/blog/post/2014/08/28/creative-page-post-api).

### Ads About Social Issues, Elections, and Politics

Advertisers running ads about social issues, elections, and politics need to specify [`special_ad_categories`](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category) while creating an ad campaign. In addition, businesses still have to set `authorization_category` to flag at the ad creative level. [Learn more about the requirements.](https://developers.facebook.com/docs/marketing-api/audiences/special-ad-category/#issues-elections-politics)

### Examples

For example, get information about an ad creative, such as the ID of the newly created unpublished page post:

```code
curl -G \
  -d 'fields=name,object_story_id' \
  -d 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/<CREATIVE_ID>
```

Create a link ad:

```code
curl \
  -F 'name=Sample Creative' \
  -F 'object_story_spec={
    "link_data": {
      "image_hash": "<IMAGE_HASH>",
      "link": "<URL>",
      "message": "try it out"
    },
    "page_id": "<PAGE_ID>"
  }' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

You can replace `picture` with `image_hash` to specify an image from your ad account's image library. You can also specify image cropping with `image_crops` in `link_data`. See [Image Crop, Reference](https://developers.facebook.com/docs/reference/ads-api/image-crops/).

To create a political ad creative, use the field `authorization_category` with value `POLITICAL`. For example:

```code
curl \
  -F 'authorization_category=POLITICAL' \
  -F 'object_story_spec={
    ...
  }' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

Beginning January 9, 2024, to create an issue, electoral, or political ad creative that uses media that is digitally created or altered, use the `authorization_category` field with the `POLITICAL_WITH_DIGITALLY_CREATED_MEDIA` value. For example:


```code
curl \
  -F 'authorization_category=POLITICAL_WITH_DIGITALLY_CREATED_MEDIA' \
  -F 'object_story_spec={
    ...
  }' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

For guidelines on Facebook ads see [Ad Guidelines](https://www.facebook.com/ad_guidelines.php).

## Related Resources

- [App Ads](https://developers.facebook.com/docs/marketing-api/mobile-app-ads)

- [Video & Carousel Ads](https://developers.facebook.com/docs/marketing-api/guides/videoads)

- [Advantage+ Catalog Ads](https://developers.facebook.com/docs/marketing-api/advantage-catalog-ads)

- [Instagram Ads](https://developers.facebook.com/docs/marketing-api/guides/instagramads)

- [Ads that Click to WhatsApp](https://developers.facebook.com/docs/marketing-api/ad-creative/messaging-ads/click-to-whatsapp)

- [Lead Ads](https://developers.facebook.com/docs/marketing-api/guides/lead-ads)


## Limits

Only returns 50,000 ad creatives, pagination past this is unavailable.

### Fields-Level Limits

| Limit | Value |
| --- | --- |
| Maximum ad title length | 25 characters, recommended |
| Minimum ad title length | 1 character |
| Maximum ad body length | 90 characters, recommended |
| Minimum ad body length | 1 character |
| Maximum length of a URL | 1000 characters |
| Maximum length of an individual word in title or body | 30 characters, recommended |

### Title and Body Limits

- Should be between minimum and maximum title and body lengths.

- Cannot start with punctuation `\ / ! . ? - * ( ) , ; :`

- Cannot have consecutive punctuation except of three full-stops `...`

- Words no longer than 30 characters

- Only three 1-character words allowed


The following characters are not allowed:

- IPA Symbols. Except: &#601;, &#602;, &#603;, &#604;, &#605;, &#606;, &#607;

- Diacritical Marks. Precomposed version of a character + diacritical mark are allowed. Standalone diacritical marks are not allowed.

- Superscript and subscript characters except &#8482; and &#8480;

- These characters `^~_={}[]|<>`


### Exceptions

- **Link Ads** cannot use special characters

- **Page Posts Ads** allow special characters such as `★`


### Placement

See [Placement](https://developers.facebook.com/docs/marketing-api/creative/#placements) for restrictions on placement of your ad based on creative.

## Reading

An ad creative object is an instance of a specific creative which is being used to define the `creative` field of one or more [ads](https://developers.facebook.com/docs/marketing-api/adgroup/)

### Read Thumbnail

Request the thumbnail URL and dimensions:

```code
curl -G \
  -d 'thumbnail_width=150' \
  -d 'thumbnail_height=120' \
  -d 'fields=thumbnail_url' \
  -d 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/<CREATIVE_ID>
```

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDKcURL [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%3CCREATIVE_ID%3E%2F%3Ffields%3Dasset_feed_spec&version=v25.0)

```
GET /v25.0/<CREATIVE_ID>/?fields=asset_feed_spec HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/<CREATIVE_ID>/?fields=asset_feed_spec',
    '{access-token}'
  );
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphNode = $response->getGraphNode();
/* handle the result */
```

```
/* make the API call */
FB.api(
    "/<CREATIVE_ID>/",
    {
        "fields": "asset_feed_spec"
    },
    function (response) {
      if (response && !response.error) {
        /* handle the result */
      }
    }
);
```

```
Bundle params = new Bundle();
params.putString("fields", "asset_feed_spec");
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/<CREATIVE_ID>/",
    params,
    HttpMethod.GET,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
NSDictionary *params = @{
  @"fields": @"asset_feed_spec",
};
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/<CREATIVE_ID>/"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

```
curl -X GET -G \
  -d 'fields="asset_feed_spec"' \
  -d 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/<CREATIVE_ID>/
```

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

### Parameters

| Parameter | Description |
| --- | --- |
| `thumbnail_height`<br>int64 | Default value: `64`<br>Rendered height of thumbnails provided in thumbnail\_url, in pixels |
| `thumbnail_width`<br>int64 | Default value: `64`<br>Rendered width of thumbnails accessible in thumbnail\_url, in pixels |

### Fields

| Field | Description |
| --- | --- |
| `id`<br>numeric string | Unique ID for an ad creative, numeric string. |
| `account_id`<br>numeric string | Ad account ID for the account this ad creative belongs to. |
| `actor_id`<br>numeric string | The actor ID (Page ID) of this creative |
| `ad_disclaimer_spec`<br>[AdCreativeAdDisclaimer](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-ad-disclaimer/) | Ad disclaimer data on creative for additional information on ads. |
| `adlabels`<br>[list<AdLabel>](https://developers.facebook.com/docs/marketing-api/reference/ad-label/) | [Ad Labels](https://developers.facebook.com/docs/marketing-api/reference/ad-label) associated with this creative. Used to group it with related ad objects. |
| `applink_treatment`<br>enum | Used for [Dynamic Ads](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads/ads-management). Specify what action should occur if a person clicks a link in the ad, but the business' app is not installed on their device. For example, open a webpage displaying the product, or open the app in an app store on the person's mobile device. |
| `asset_feed_spec`<br>[AdAssetFeedSpec](https://developers.facebook.com/docs/marketing-api/reference/ad-asset-feed-spec/) | Used for [Dynamic Creative](https://developers.facebook.com/docs/marketing-api/dynamic-creative/dynamic-creative-optimization) to automatically experiment and deliver different variations of an ad's creative. Specifies an asset feed with multiple images, text and other assets used to generate variations of an ad. Formatted as a JSON string. |
| `authorization_category`<br>enum | Specifies whether ad was configured to be labeled as a political ad or not.<br>See [Facebook Advertising Policies](https://www.facebook.com/policies/ads). This field cannot be used for [Dynamic Ads](https://developers.facebook.com/docs/marketing-api/dynamic-ad). |
| `body`<br>string | The body of the ad. Not supported for video post creatives |
| `branded_content`<br>[AdCreativeBrandedContentAds](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-branded-content-ads/) | branded\_content |
| `branded_content_sponsor_page_id`<br>numeric string | ID for page representing business which runs Branded Content ads. See [Creating Branded Content Ads](https://developers.facebook.com/docs/marketing-api/guides/branded-content). |
| `bundle_folder_id`<br>numeric string | The [Dynamic Ad's](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads) bundle folder ID |
| `call_to_action`<br>[AdCreativeLinkDataCallToAction](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-link-data-call-to-action/) | Call to action for an ad created from existing Instagram post |
| `call_to_action_type`<br>enum {OPEN\_LINK, LIKE\_PAGE, SHOP\_NOW, PLAY\_GAME, INSTALL\_APP, USE\_APP, CALL, CALL\_ME, VIDEO\_CALL, INSTALL\_MOBILE\_APP, USE\_MOBILE\_APP, MOBILE\_DOWNLOAD, BOOK\_TRAVEL, LISTEN\_MUSIC, WATCH\_VIDEO, LEARN\_MORE, SIGN\_UP, DOWNLOAD, WATCH\_MORE, NO\_BUTTON, VISIT\_PAGES\_FEED, CALL\_NOW, APPLY\_NOW, CONTACT, BUY\_NOW, GET\_OFFER, GET\_OFFER\_VIEW, BUY\_TICKETS, UPDATE\_APP, GET\_DIRECTIONS, BUY, SEND\_UPDATES, MESSAGE\_PAGE, DONATE, SUBSCRIBE, SAY\_THANKS, SELL\_NOW, SHARE, DONATE\_NOW, GET\_QUOTE, CONTACT\_US, ORDER\_NOW, START\_ORDER, ADD\_TO\_CART, VIEW\_CART, VIEW\_IN\_CART, VIDEO\_ANNOTATION, RECORD\_NOW, INQUIRE\_NOW, CONFIRM, REFER\_FRIENDS, REQUEST\_TIME, GET\_SHOWTIMES, LISTEN\_NOW, TRY\_DEMO, WOODHENGE\_SUPPORT, SOTTO\_SUBSCRIBE, FOLLOW\_USER, RAISE\_MONEY, SEE\_SHOP, GET\_DETAILS, FIND\_OUT\_MORE, VISIT\_WEBSITE, BROWSE\_SHOP, EVENT\_RSVP, WHATSAPP\_MESSAGE, FOLLOW\_NEWS\_STORYLINE, SEE\_MORE, BOOK\_NOW, FIND\_A\_GROUP, FIND\_YOUR\_GROUPS, PAY\_TO\_ACCESS, PURCHASE\_GIFT\_CARDS, FOLLOW\_PAGE, SEND\_A\_GIFT, SWIPE\_UP\_SHOP, SWIPE\_UP\_PRODUCT, SEND\_GIFT\_MONEY, PLAY\_GAME\_ON\_FACEBOOK, GET\_STARTED, OPEN\_INSTANT\_APP, AUDIO\_CALL, GET\_PROMOTIONS, JOIN\_CHANNEL, MAKE\_AN\_APPOINTMENT, ASK\_ABOUT\_SERVICES, BOOK\_A\_CONSULTATION, GET\_A\_QUOTE, BUY\_VIA\_MESSAGE, ASK\_FOR\_MORE\_INFO, CHAT\_WITH\_US, VIEW\_PRODUCT, VIEW\_CHANNEL, GET\_IN\_TOUCH, ASK\_A\_QUESTION, START\_A\_CHAT, CHAT\_NOW, ASK\_US, WATCH\_LIVE\_VIDEO, JOIN\_LIVE\_VIDEO, SHOP\_WITH\_AI, TRY\_ON\_WITH\_AI} | Type of call to action button in your ad. This determines the button text and header text for your ad. See [Ads Guide](https://www.facebook.com/business/ads-guide/) for [campaign objectives](https://developers.facebook.com/docs/marketing-api/adcampaign/) and permitted call to action types. |
| `categorization_criteria`<br>enum | The [Dynamic Category Ad's](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads) categorization field, e.g. brand |
| `category_media_source`<br>enum | The [Dynamic Ad's](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads) rendering mode for category ads |
| `collaborative_ads_lsb_image_bank_id`<br>numeric string | Used for CPAS local delivery image bank |
| `contextual_multi_ads`<br>AdCreativeContextualMultiAds | contextual\_multi\_ads |
| `creative_sourcing_spec`<br>[AdCreativeSourcingSpec](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-sourcing-spec/) | creative\_sourcing\_spec |
| `degrees_of_freedom_spec`<br>[AdCreativeDegreesOfFreedomSpec](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-degrees-of-freedom-spec/) | Specifies the types of transformations that are enabled for the given creative |
| `destination_set_id`<br>numeric string | The ID of the Product Set for a Destination Catalog that will be used to link with Travel Catalogs |
| `dynamic_ad_voice`<br>string | Used for [Store Traffic Objective inside Dynamic Ads](https://developers.facebook.com/docs/marketing-api/guides/dynamic-ad/store-visits). Allows you to control the voice of your ad. If set to `DYNAMIC`, page name and profile picture in your ad post come from the nearest page location. If set to `STORY_OWNER`, page name and profile picture in your ad post come from the main page location. |
| `effective_authorization_category`<br>enum | Specifies whether ad is a political ad or not.<br>See [Facebook Advertising Policies](https://www.facebook.com/policies/ads). This field cannot be used for [Dynamic Ads](https://developers.facebook.com/docs/marketing-api/dynamic-ad).<br>This value can be different than the authorization\_category value in case our systems have identified the ad as political even though it was not configured to be labeled as such. |
| `effective_instagram_media_id`<br>numeric string | The ID of an Instagram post to use in an ad |
| `effective_object_story_id`<br>token with structure: Post ID | The ID of a page post to use in an ad, regardless of whether it's an organic or unpublished page post |
| `enable_direct_install`<br>bool | Whether Direct Install should be enabled on supported devices |
| `enable_launch_instant_app`<br>bool | Whether Instant App should be enabled on supported devices |
| `existing_post_title`<br>string | existing\_post\_title |
| `facebook_branded_content`<br>AdCreativeFacebookBrandedContent | Stores fields for Facebook Branded Content |
| `format_transformation_spec`<br>list<AdCreativeFormatTransformationSpec> | format\_transformation\_spec |
| `generative_asset_spec`<br>AdCreativeGenerativeAssetSpec | generative\_asset\_spec |
| `image_crops`<br>[AdsImageCrops](https://developers.facebook.com/docs/marketing-api/reference/ads-image-crops/) | A JSON object defining crop dimensions for the image specified. See [image crop reference](https://developers.facebook.com/docs/marketing-api/image-crops/) for more details |
| `image_hash`<br>string | Image hash for ad creative. If provided, do not add `image_url`. See [image library](https://developers.facebook.com/docs/marketing-api/adimage/) for more details. |
| `image_url`<br>string | A URL for the image for this creative. We save the image at this URL to the ad account's image library. If provided, do not include `image_hash`. |
| `instagram_permalink_url`<br>string | URL for a post on Instagram you want to run as an ad. Also known as Instagram media. |
| `instagram_user_id`<br>numeric string | Instagram actor ID |
| `interactive_components_spec`<br>[AdCreativeInteractiveComponentsSpec](https://developers.facebook.com/docs/graph-api/reference/ad-creative-interactive-components-spec/) | Specification for all the interactive components that would show up on the ad |
| `link_destination_display_url`<br>string | Overwrites the display URL for link ads when `object_url` is set to a click tag |
| `link_og_id`<br>numeric string | The Open Graph (OG) ID for the link in this creative if the landing page has OG tags |
| `link_url`<br>string | Identify a specific landing tab on your Facebook page by the Page tab's URL. See [connection objects](https://developers.facebook.com/docs/reference/ads-api/connectionobjects/) for retrieving Page tab URLs. You can add [app\_data](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow) parameters to the URL to pass data to a Page's tab. |
| `marketing_message_structured_spec`<br>AdCreativeMarketingMessageStructuredSpec | marketing\_message\_structured\_spec |
| `media_sourcing_spec`<br>[AdCreativeMediaSourcingSpec](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-media-sourcing-spec/) | media\_sourcing\_spec |
| `messenger_sponsored_message`<br>string | Used for Messenger sponsored message. JSON string with message for this ad creative. See [Messenger Platform, Send API Reference](https://developers.facebook.com/docs/marketing-api/reference/docs/messenger-platform/reference/send-api). |
| `name`<br>string | Name of this ad creative as seen in the ad account's library. This field has a limit of 100 characters. |
| `object_id`<br>numeric string | ID for Facebook object being promoted with ads or relevant to the ad or ad type. For example a page ID if you are running ads to generate Page Likes. See [promoted\_object](https://developers.facebook.com/docs/marketing-api/reference/ad-campaign/promoted-object). |
| `object_store_url`<br>string | iTunes or Google Play of the destination of an app ad |
| `object_story_id`<br>token with structure: Post ID | ID of a Facebook Page post to use in an ad. You can get this ID by [querying the posts of the page](https://developers.facebook.com/docs/graph-api/reference/page/feed/). If this post includes an image, it should not exceed 8 MB. Facebook will upload the image from the post to your ad account's [image library](https://developers.facebook.com/docs/marketing-api/adimage). If you create an unpublished page post via `object_story_spec` at the same time as creating the ad, this ID will be null. However, the `effective_object_story_id` will be the ID of the page post regardless of whether it's an organic or unpublished page post. |
| `object_story_spec`<br>[AdCreativeObjectStorySpec](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-object-story-spec/) | Use if you want to create a new unpublished page post and turn the post into an ad. The Page ID and the content to create a new unpublished page post. Specify `link_data`, `photo_data`, `video_data`, `text_data` or `template_data` with the content. |
| `object_type`<br>enum {APPLICATION, DOMAIN, EVENT, OFFER, PAGE, PHOTO, SHARE, STATUS, STORE\_ITEM, VIDEO, INVALID, PRIVACY\_CHECK\_FAIL, POST\_DELETED} | The type of Facebook object you want to advertise. Allowed values are:<br>`PAGE`<br>`DOMAIN`<br>`EVENT`<br>`STORE_ITEM`: refers to an iTunes or Google Play store destination<br>`SHARE`: from a page<br>`PHOTO`<br>`STATUS`: of a page<br>`VIDEO`<br>`APPLICATION`: app on Facebook<br>`INVALID`: when an invalid object\_id was specified such as a deleted object or if you do not have permission to see the object. In very few cases, this field may be empty if Facebook is unable to identify the type of advertised object<br>`PRIVACY_CHECK_FAIL`: you are missing the permission to load this object type<br>`POST_DELETED`: this object\_type has been deleted |
| `object_url`<br>string | URL that opens if someone clicks your link on a link ad. This URL is not connected to a Facebook page. |
| `page_welcome_message`<br>string | Page welcome message for CTM ads |
| `photo_album_source_object_story_id`<br>string | photo\_album\_source\_object\_story\_id |
| `place_page_set_id`<br>numeric string | The ID of the page set for this creative. See the [Local Awareness guide](https://developers.facebook.com/docs/marketing-api/guides/local-awareness) |
| `platform_customizations`<br>[AdCreativePlatformCustomization](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-platform-customization/) | Use this field to specify the exact media to use on different Facebook [placements](https://developers.facebook.com/docs/marketing-api/targeting-specs/#placement). You can currently use this setting for images and videos. Facebook replaces the media originally defined in ad creative with this media when the ad displays in a specific placements. For example, if you define a media here for `instagram`, Facebook uses that media instead of the media defined in the ad creative when the ad appears on Instagram. |
| `playable_asset_id`<br>numeric string | The ID of the playable asset in this creative |
| `portrait_customizations`<br>AdCreativePortraitCustomizations | This field describes the rendering customizations selected for portrait mode ads like IG Stories, FB Stories, IGTV, etc |
| `product_data`<br>list<AdCreativeProductData> | product\_data |
| `product_set_id`<br>numeric string | Used for [Dynamic Ad](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads). An ID for a product set, which groups related products or other items being advertised. |
| `product_suggestion_settings`<br>AdCreativeProductSuggestionSettings | product\_suggestion\_settings |
| `recommender_settings`<br>AdCreativeRecommenderSettings | Used for [Dynamic Ads](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads). Settings to display Dynamic ads based on product recommendations. |
| `referral_id`<br>numeric string | The ID of Referral Ad Configuration in this creative |
| `source_facebook_post_id`<br>numeric string | source\_facebook\_post\_id |
| `source_instagram_media_id`<br>numeric string | The ID of an Instagram post for creating ads |
| `status`<br>enum {ACTIVE, IN\_PROCESS, WITH\_ISSUES, DELETED} | The status of the creative. `WITH_ISSUES` and `IN_PROCESS` are available for 4.0 or higher |
| `template_url`<br>string | Used for [Dynamic Ads](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads) when you want to use third-party click tracking. See [Dynamic Ads, Click Tracking and Templates](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads/ads-management#adtemplate). |
| `template_url_spec`<br>[AdCreativeTemplateURLSpec](https://developers.facebook.com/docs/marketing-api/reference/ad-creative-template-url-spec/) | Used for [Dynamic Ads](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads) when you want to use third-party click tracking. See [Dynamic Ads, Click Tracking and Templates](https://developers.facebook.com/docs/marketing-api/dynamic-product-ads/ads-management#adtemplate). |
| `threads_media_id`<br>numeric string | threads\_media\_id |
| `threads_user_id`<br>numeric string | threads\_user\_id |
| `thumbnail_id`<br>numeric string | thumbnail\_id |
| `thumbnail_url`<br>string | URL for a thumbnail image for this ad creative. You can provide dimensions for this with `thumbnail_width` and `thumbnail_height`. [See example](https://developers.facebook.com/docs/marketing-api/reference/ad-creative#thumbnail-example). |
| `title`<br>string | Title for link ad, which does not belong to a page. |
| `url_tags`<br>string | A set of query string parameters which will replace or be appended to urls clicked from page post ads, message of the post, and canvas app install creatives only |
| `use_page_actor_override`<br>bool | Used for [App Ads](https://developers.facebook.com/docs/app-ads). If `true`, we display the Facebook page associated with the app ads. |
| `video_id`<br>numeric string | Facebook object ID for video in this ad creative. |
| `wamo_whatsapp_identity_spec`<br>AdCreativeWAMOWhatsAppIdentitySpec | wamo\_whatsapp\_identity\_spec |

### Edges

| Edge | Description |
| --- | --- |
| [`previews`](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/previews/)<br>Edge<AdPreview> | The HTML Snippets for previewing this creative |

### Error Codes

| Error | Description |
| --- | --- |
| 2635 | You are calling a deprecated version of the Ads API. Please update to the latest version. |
| 80004 | There have been too many calls to this ad-account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting#ads-management. |
| 100 | Invalid parameter |
| 613 | Calls to this api have exceeded the rate limit. |
| 2500 | Error parsing graph query |
| 270 | This Ads API request is not allowed for apps with development access level (Development access is by default for all apps, please request for upgrade). Make sure that the access token belongs to a user that is both admin of the app and admin of the ad account |
| 190 | Invalid OAuth 2.0 Access Token |
| 200 | Permissions error |

## Creating

Define creative as part of an ad set or standalone. In either case, we store your ad creative in your ad account's creative library to use in ads. If you try to add an creative that isn't unique, we do not generate it and return the creative ID of the existing ad creative. For example, create a Link Ad with a call to action:

```code
curl \
  -F 'name=Sample Creative' \
  -F 'object_story_spec={
    "link_data": {
      "call_to_action": {"type":"SIGN_UP","value":{"link":"<URL>"}},
      "link": "<URL>",
      "message": "try it out"
    },
    "page_id": "<PAGE_ID>"
  }' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

You use `link_caption` to pass the call to action object. By doing this, you can customize the call to action caption. To customize the call to action description, pass `link_description` in the call to action object.

Create a [carousel ad](https://developers.facebook.com/docs/reference/ads-api/multi-product-ads)

```code
curl \
  -F 'name=Sample Creative' \
  -F 'object_story_spec={
    "link_data": {
      "child_attachments": [\
        {\
          "description": "$8.99",\
          "image_hash": "<IMAGE_HASH>",\
          "link": "https:\/\/www.link.com\/product1",\
          "name": "Product 1",\
          "video_id": "<VIDEO_ID>"\
        },\
        {\
          "description": "$9.99",\
          "image_hash": "<IMAGE_HASH>",\
          "link": "https:\/\/www.link.com\/product2",\
          "name": "Product 2",\
          "video_id": "<VIDEO_ID>"\
        },\
        {\
          "description": "$10.99",\
          "image_hash": "<IMAGE_HASH>",\
          "link": "https:\/\/www.link.com\/product3",\
          "name": "Product 3"\
        }\
      ],
      "link": "<URL>"
    },
    "page_id": "<PAGE_ID>"
  }' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

### Partnership Ads Posts

As a partnership ads sponsor, you can create ads with posts where your brand is tagged. Create a campaign, ad set, as ads as your normally do. The only difference is in the ad creative.

Set the `sponsor_page_id` field for `facebook_branded_content` and/or the `sponsor_id` field for `instagram_branded_content` in the ad creative. For example:

```code
curl \
 -F 'access_token=<TOKEN>' \
 -F 'facebook_branded_content':{'sponsor_page_id=<PAGE_ID>'}\
 // OR
 -F 'instagram_branded_content':{'sponsor_id=<Instagram_user_ID>'}\
 -F 'object_story_id=<OBJECT_STORY_ID>' \
https://graph.facebook.com/<VERSION>/<ACCOUNT_ID>/adcreatives
```

Where `object_story_id` is the post id in the format of: `postOwnerID_postID`.

### Inline Page Post Creation

Most ad creatives rely on page posts for creative content. While you may create page posts separately then reference them by ID, it is easier to create them in the same call you use to provide ad creative. Specify the page post content with `object_story_spec` which creates an unpublished page post. See [Inline Page Post, Blog](https://developers.facebook.com/ads/blog/post/2014/08/28/creative-page-post-api).

You can get the new ID by retrieving `object_story_id` from the ad creative. To get post ids created with `object_story_spec` through [`/promotable_posts`](https://developers.facebook.com/docs/graph-api/reference/page/feed/), pass `include_inline=true` in your `HTTP GET`. If `include_inline` value is `false`, we don't return any ids.

### Get Related Objects

Many ad creatives require `object_id` for a relevant Facebook object, app ID, or page tab's URL. See [Connection Objects](https://developers.facebook.com/docs/reference/ads-api/connectionobjects/) for more information.

### Examples

Create a Video Page Like ad:

```code
curl \
  -F 'name=Sample Creative' \
  -F 'object_story_spec={
    "page_id": "<PAGE_ID>",
    "video_data": {
      "call_to_action": {"type":"LIKE_PAGE","value":{"page":"<PAGE_ID>"}},
      "image_url": "<THUMBNAIL_URL>",
      "video_id": "<VIDEO_ID>"
    }
  }' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

Create an ad from an existing page post

```code
curl \
  -F 'name=Sample Promoted Post' \
  -F 'object_story_id=<POST_ID>' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

Create a Photo Ad with [Branded Content](https://www.facebook.com/business/news/branded-content-update) from another page. This is available for photo, video, and link ads.

```code
curl \
  -F 'name=Sample Creative' \
  -F 'object_story_spec={
    "page_id": "<PAGE_ID>",
    "photo_data": {
      "branded_content_sponsor_page_id": "<SPONSOR_PAGE_ID>",
      "image_hash": "<IMAGE_HASH>"
    }
  }' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

Adding `url_tags` to an ad

```code
curl \
  -F 'object_story_id=<POST_ID>' \
  -F 'url_tags=key1=val1&key2=val2' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/act_<AD_ACCOUNT_ID>/adcreatives
```

You can't perform this operation on this endpoint.

## Updating

### Examples

```code
curl \
  -F 'name=New creative name 1517287550' \
  -F 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/<CREATIVE_ID>
```

You can update an [AdCreative](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/) by making a POST request to [`/{ad_creative_id}`](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/).

### Parameters

| Parameter | Description |
| --- | --- |
| `account_id`<br>numeric string | Ad account ID for the account this ad creative belongs to. |
| `adlabels`<br>list<Object> | [Ad Labels](https://developers.facebook.com/docs/marketing-api/reference/ad-label) associated with this creative. Used to group it with related ad objects. |
| `name`<br>string | The name of the creative in the creative library. This field takes a string of up to 100 characters. |
| `status`<br>enum {ACTIVE, IN\_PROCESS, WITH\_ISSUES, DELETED} | The status of this ad creative. See [Storing and Retrieving Ad Objects](https://developers.facebook.com/docs/marketing-api/best-practices/storing_adobjects). |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node to which you POSTed.

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 200 | Permissions error |
| 100 | Invalid parameter |

## Deleting

### Examples

```code
curl -X DELETE \
  -d 'access_token=<ACCESS_TOKEN>' \
  https://graph.facebook.com/v25.0/<CREATIVE_ID>/
```

You can delete an [AdCreative](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/) by making a DELETE request to [`/{ad_creative_id}`](https://developers.facebook.com/docs/marketing-api/reference/ad-creative/).

### Parameters

| Parameter | Description |
| --- | --- |
| `account_id`<br>numeric string | Ad account ID for the account this ad creative belongs to. |
| `adlabels`<br>list<Object> | [Ad Labels](https://developers.facebook.com/docs/marketing-api/reference/ad-label) associated with this creative. Used to group it with related ad objects. |
| `name`<br>string | Name of this ad creative as seen in the ad account's library. |
| `status`<br>enum {ACTIVE, IN\_PROCESS, WITH\_ISSUES, DELETED} | The status of this ad creative. See [Storing and Retrieving Ad Objects](https://developers.facebook.com/docs/marketing-api/best-practices/storing_adobjects). |

### Return Type

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 200 | Permissions error |
| 80004 | There have been too many calls to this ad-account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting#ads-management. |
| 100 | Invalid parameter |

On This Page

[Ad Creative](https://developers.facebook.com/docs/marketing-api/reference/adcreative#overview)

[Reading](https://developers.facebook.com/docs/marketing-api/reference/adcreative#Reading)

[Read Thumbnail](https://developers.facebook.com/docs/marketing-api/reference/adcreative#read_examples)

[Example](https://developers.facebook.com/docs/marketing-api/reference/adcreative#example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/adcreative#parameters)

[Fields](https://developers.facebook.com/docs/marketing-api/reference/adcreative#fields)

[Edges](https://developers.facebook.com/docs/marketing-api/reference/adcreative#edges)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/adcreative#error-codes)

[Creating](https://developers.facebook.com/docs/marketing-api/reference/adcreative#Creating)

[Partnership Ads Posts](https://developers.facebook.com/docs/marketing-api/reference/adcreative#partnership-ads-posts)

[Inline Page Post Creation](https://developers.facebook.com/docs/marketing-api/reference/adcreative#inline_post)

[Get Related Objects](https://developers.facebook.com/docs/marketing-api/reference/adcreative#obtaining_objects)

[Examples](https://developers.facebook.com/docs/marketing-api/reference/adcreative#create_example)

[Updating](https://developers.facebook.com/docs/marketing-api/reference/adcreative#Updating)

[Examples](https://developers.facebook.com/docs/marketing-api/reference/adcreative#update_example)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/adcreative#parameters-2)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/adcreative#return-type)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/adcreative#error-codes-2)

[Deleting](https://developers.facebook.com/docs/marketing-api/reference/adcreative#Deleting)

[Examples](https://developers.facebook.com/docs/marketing-api/reference/adcreative#delete_examples)

[Parameters](https://developers.facebook.com/docs/marketing-api/reference/adcreative#parameters-3)

[Return Type](https://developers.facebook.com/docs/marketing-api/reference/adcreative#return-type-2)

[Error Codes](https://developers.facebook.com/docs/marketing-api/reference/adcreative#error-codes-3)

Allow the use of cookies by Facebook on this browser?

We use cookies and similar technologies to help provide and improve content on [Meta Products](https://www.facebook.com/help/1561485474074139). We also use them to provide a safer experience by using information we receive from cookies on and off Facebook, and to provide and improve Meta Products for people who have an account.

- Essential cookies: These cookies are required to use Meta Products and are necessary for our sites to work as intended.
- Cookies from other companies: We use these cookies to show you ads off of Meta Products and to provide features like maps and videos on Meta Products. These cookies are optional.

You have control over the optional cookies we use. Learn more about cookies and how we use them, and review or change your choices at any time in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

* * *

## About cookies

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_1.png)

What are cookies?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_2.png)

Why do we use cookies?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_3.png)

What are Meta Products?

Learn more

![background image](https://www.facebook.com/images/cookies/cookie_info_card_image_4.png)

Your cookie choices

Learn more

* * *

## Cookies from other companies

We use cookies from [other companies](https://www.facebook.com/privacy/policies/cookies/?annotations[0]=explanation%2F3_companies_list) in order to show you ads off of our Products, and provide features like maps, payment services and video.

How we use these cookies

We use cookies from other companies on our Products:

- To show you ads about our Products and features on other companies’ apps and websites.
- To provide features on our Products such as maps, payment services and video.
- For analytics.

If you allow these cookies

- Features you use on Meta Products will not be affected.
- We'll be able to better personalize ads for you off of Meta Products, and measure their performance.
- Other companies will receive information about you by using their cookies.

If you don't allow these cookies

- Some features on our products may not work.
- We won't use cookies from other companies to personalize ads for you off of Meta products, or measure their performance.

## Other ways you can control your information

Manage your ad experience in Accounts Center

You can manage your ad experience by visiting the following settings.

Ad preferences

In your ad preferences you can choose whether we show you ads and make choices about the information used to show you ads.

Ad settings

If we show you ads, we use data that advertisers and other partners provide us about your activity off Meta Company Products, including websites and apps, to show you better ads. You can control whether we use this data to show you ads in your [ad settings](https://www.facebook.com/settings/ads/).

More information about online advertising

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUDH7CADhYvGCQ5K8JgB0k8PnB26FUQ5tnDWtWzhsbErivKbupm6eUAROHcaMZXYxbu1qPdzEttndotLVr24GXt0LeaYIcfGj8dOTrNsdyoTMkFWjeTwBWio-Ww95P66wyjXdERFR8d4fA) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUBiKzct3MjQ1yOUeF94HDs348H45X__ex8PLoq0umfbugM52B0QIL3Hc0I4HbAd2mGV-aFGvt_mA_-NPavEyuXpgwfTh5GbgT7TkSxQCERH7WdRvgb1ukVYrbZB9vYHYcqoMg9OrPTjtQ) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUBd0uIv8A_JjDrzyyGsOzFaKGgz1zm9ebz8m9KofRai9OCUsFjrqiFh-72Fimo1A_frC2qNrzecUZkcOKqJ0-ql4gStmLa0Mwm4yGLAYW_tznv5HiWpfH736zqZXM43YIjSsOAWQ1XILA) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUDWKQAOhiIDZF7ZBG3kNx7dxQvpYOqqFF87XC3odZ-bfeyrJ1U0sFEVjfWVxjVr2NpK_B7o9A1-nEdwIbTHxyKFi53gyPGDxep9w6bBhZVuyvUVSrJ3UgOstfH9k2_vTBLGXS0HD4ttbg)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUBzz7PczUGY29c5Yj7rgY7J3U2MAvY0soDbZ_vPS2orJtNrz89Hxs4DHNBK9jNiuXAgDYbZXIABkVS1becw64Xvy1MIHj1kLpqrkU9zhVeWtVX4_wNSvF47i1ZkyJTNXv6lgqCtHQB8iQ)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUAN5TPrLPUVlYBd6I-7af6-zkdUqB4KkLfcRAltdF7p6WjzIV6q8WiNp3Gro5BI62WXu90ptYx9AefSe5YGgG4UpX_jql5l_5SWVXTeyrYz9N2G5Rtaup4rCIrhgHE7r4SkKf7hXoknBA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUCiK01etIF9P4EjbhGa5F1OEK7RoA4sf7AnDbrv4ZsXgmC9G5ckeeANQyUmt5H4joDWNLr4qzopuoqqUDLLV9ozAd4AFoxquFyadBMgdxcgU7BYeaq_uoQmiKU_HYtLMgt3EOhkmMAaUw)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUC1CHVsVJzu21MmbUWcSKhb1pQAg4PFaUHkGUk9BCHT04koFhmHMdXGxksAKLq3bRgz-6LPwXd6xf7xaNbvaTHtcIBGATp-Ekq8eOfo4_GPECJU1B3LObgzmoDj1_HHZNPgSiqeglnHEw)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBg1AUcwD6CWqB4LiXfzbU5KthcDtcds-69MuNlOI-a3vrSy-G3dKj9k62TZX6A1yuAyXdTyZ9Du8Qfvkl9PFSMaoYje3JWrgvnl2i0xAuXwnHOgYakBIm1D3xw-CSFZfIXWDuZK5iWSg)

Decline optional cookiesAllow all cookies

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_1.png)

## What are cookies?

Cookies are small pieces of text that are used to store and receive identifiers on a web browser. We use cookies and similar technologies to offer Meta Products and understand information we receive about users, like their activity on other websites and apps.

If you don't have an account, we don't use cookies to personalize ads for you, and activity we receive will be used only for the security and integrity of our Products.

Learn more about cookies and the similar technologies we use in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_2.png)

## Why do we use cookies?

Cookies help us provide, protect and improve the Meta Products, such as by personalizing content, tailoring and measuring ads, and providing a safer experience.

While the cookies that we use may change from time to time as we improve and update the Meta Products, we use them for the following purposes:

- Authentication to keep users logged in
- To ensure security, site and product integrity
- To provide advertising, recommendations, insights and measurement, if we show you ads
- To provide site features and services
- To understand our Products' performance
- To enable analytics and research
- On third-party websites and apps to help companies that incorporate Meta technologies to share information with us about activity on their apps and websites.

Learn more about cookies and how we use them in our [Cookies Policy](https://www.facebook.com/privacy/policies/cookies).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_3.png)

## What are Meta Products?

Meta Products include the Facebook, Instagram and Messenger apps, and any other features, apps, technologies, software or services offered by Meta under our Privacy Policy.

You can learn more about [Meta Products in our Privacy Policy](https://www.facebook.com/privacy/policy/?annotations[0]=0.ex.0-WhatProductsDoesThis&entry_point=cookie_consent_modal_what_are_meta_products).

![background image](https://www.facebook.com/images/cookies/cookie_info_popup_image_4.png)

## Your cookie choices

You have control over optional cookies we use:

- Our cookies on other apps and websites owned by companies that use Meta technologies, such as the Like button and Meta Pixel, can be used to personalize your ads, if we show you ads.
- We use cookies from other companies to show you ads off of Meta Products, and to provide features like maps and video on Meta Products.

You can review or change your choices at any time in your Cookies settings.