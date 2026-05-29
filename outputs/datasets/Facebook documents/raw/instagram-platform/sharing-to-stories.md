---
url: https://developers.facebook.com/docs/instagram-platform/sharing-to-stories
title: Sharing to Stories - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Fsharing-to-stories%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)
- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [Comment Moderation](https://developers.facebook.com/docs/instagram-platform/comment-moderation)
- [Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies)
- [Insights](https://developers.facebook.com/docs/instagram-platform/insights)
- [Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed)
- [Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories)
- [oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed)
- [Embed Button](https://developers.facebook.com/docs/instagram-platform/embed-button)
- [Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging)
- [API Reference](https://developers.facebook.com/docs/instagram-platform/reference)
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-to-stories)

[Overview](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#overview)

[Android Developers](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#android-developers)

[Data](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#data)

[Sharing a Background Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-background-asset)

[Sharing a Sticker Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-sticker-asset)

[Sharing a Background Asset and a Sticker Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-background-asset-and-a-sticker-asset)

[iOS Developers](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#ios-developers)

[Data](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#data-2)

[Register Instagram's Custom URL Scheme](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#register-instagram-s-custom-url-scheme)

[Sharing a Background Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-background-asset-2)

[Sharing a Sticker Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-sticker-asset-2)

[Sharing a Background Asset and Sticker Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-background-asset-and-sticker-asset)

[Sharing to Facebook Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-to-facebook-stories)

# Sharing to Stories

You can integrate sharing into your Android and iOS apps so that users can share your content as an Instagram story. To create a new app, see [Getting Started with the Facebook SDK for Android](https://developers.facebook.com/docs/android/getting-started) and [Getting Started with the Facebook SDK for iOS](https://developers.facebook.com/docs/ios/getting-started).

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/31816930_171774670197369_7104973267433160704_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=NMnOBT8JIbIQ7kNvwE2xes0&_nc_oc=AdrVfpFAjANYlMS9nZIBN9OTchR_7CZSZmn_Lce49CQ5_1hqDmtgQRcaOPCZ5v7ExIE&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=TNp2fDotHNFtExrc-AHRZA&_nc_ss=7b289&oh=00_Af49hYy7swTg3puijstqtYvQIm3j1nLmMFCJg3-mmkZefA&oe=6A23FFFD)

Beginning in January 2023, you must provide a Facebook AppID to share content to Instagram Stories. For more information, see [Introducing an important update to Instagram Sharing to Stories](https://developers.facebook.com/blog/post/2022/10/10/introducing-important-update-to-Instagram-sharing-to-stories/). If you don't provide an AppID, your users see the error message "The app you shared from doesn't currently support sharing to Stories" when they attempt to share their content to Instagram. To find your App ID, see [Get Your App ID (Android)](https://developers.facebook.com/docs/android/getting-started#app-id) and [Get Your App ID (iOS)](https://developers.facebook.com/docs/ios/getting-started#app-id).

## Overview

By using Android **Implicit Intents** and iOS **Custom URL Schemes**, your app can send photos, videos, and stickers to the Instagram app. The Instagram app receives this content and load it in the story composer so the User can publish it to their Instagram Stories.

|     |     |
| --- | --- |
| ![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/124434142_794885681078288_1538783544453021683_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=CCtbSOFyFIUQ7kNvwEcFcgg&_nc_oc=AdpSdRRlHFGhgSFMq8PZPcatgAkXzQw443G-2J9XJliOnE57mixw7IFWalncJ3bYkzg&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=TNp2fDotHNFtExrc-AHRZA&_nc_ss=7b289&oh=00_Af5mIggv8AwqeA-ky-KPHgEo7ORy6beN4B9K8HoR7dSy2A&oe=6A240347) | The Instagram app's story composer is comprised of a background layer and a sticker layer.<br>#### Background Layer<br>The background layer fills the screen and you can customize it with a photo, video, solid color, or color gradient.<br>#### Sticker Layer<br>The sticker layer can contain an image, and the layer can be further customized by the User within the story composer. |

## Android Developers

Android implementations use implicit intents to launch the Instagram app and pass it content. In general, your sharing flow should:

1. Instantiate an implicit intent with the content you want to pass to the Instagram app.
2. Start an activity and check that it can resolve the implicit intent.
3. Resolve the activity if it is able to.

### Data

You send the following data when you share to Stories.

| Content | Type | Description |
| --- | --- | --- |
| Facebook App ID | String | Your [Facebook App ID](https://developers.facebook.com/docs/android/getting-started#app-id). |
| Background asset | [Uri](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Freference%2Fandroid%2Fnet%2FUri&h=AUBx4AM_2BqnbQ4U73AMGV_LnE5wlBd-JUlvPlYFrd21Rwv4pAI277iIEe5A38EFnJAURCzfDfNz9EnRiWO7GumL1gj2V9T0t0wzSZMoFVCV_exJbWPoq1u6hYS4BjHQ6HENCGUVXwKCRw) | Uri to an image asset (JPG, PNG) or video asset (H.264, H.265, WebM). Minimum dimensions 720x1280. Recommended image ratios 9:16 or 9:18. Videos can be 1080p and up to 20 seconds in duration. **The Uri needs to be a content Uri to a local file on the device**. You must send a background asset, a sticker asset, or both. |
| Sticker asset | [Uri](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Freference%2Fandroid%2Fnet%2FUri&h=AUAVou_ErSErIyRTV3ObghjREBi96HrLH9WuCuDL9oeTHLpnXfrtPVuyy0au1v3Xn17QYMBEGASZpnGWTMgrYhvZAhV8CPO9UKNK_T_qSMfrpqVB3v-43MzfcRIfXZELtbFuQ9wgBK6faQ) | Uri to an image asset (JPG, PNG). Recommended dimensions: 640x480. This image appears as a sticker over the background. **The Uri needs to be a content Uri to a local file on the device**. You must send a background asset, a sticker asset, or both. |
| Background layer top color | String | A hex string color value used in conjunction with the background layer bottom color value. If both values are the same, the background layer is a solid color. If they differ, they are used to generate a gradient. If you specify a background asset, the asset is used and this value is ignored. |
| Background layer bottom color | String | A hex string color value used in conjunction with the background layer top color value. If both values are the same, the background layer is a solid color. If they differ, they are used to generate a gradient. If you specify a background asset, the asset is used and this value is ignored. |

### Sharing a Background Asset

The following code example sends an image to Instagram so the user can publish it to their Instagram Stories.

```code
// Instantiate an intent
Intent intent = new Intent("com.instagram.share.ADD_TO_STORY");

// Attach your App ID to the intent
String sourceApplication = "1234567"; // This is your application's FB ID
intent.putExtra("source_application", sourceApplication);

// Attach your image to the intent from a URI
Uri backgroundAssetUri = Uri.parse("your-image-asset-uri-goes-here");
intent.setDataAndType(backgroundAssetUri, MEDIA_TYPE_JPEG);

// Grant URI permissions for the image
intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

// Instantiate an activity
Activity activity = getActivity();

// Verify that the activity resolves the intent and start it
if (activity.getPackageManager().resolveActivity(intent, 0) != null) {
  activity.startActivityForResult(intent, 0);
}
```

### Sharing a Sticker Asset

This example sends a sticker layer image asset and a set of background layer colors to Instagram. If you don't specify the background layer colors, the background layer color is `#222222`.

```code
// Instantiate an intent
Intent intent = new Intent("com.instagram.share.ADD_TO_STORY");

// Attach your App ID to the intent
String sourceApplication = "1234567"; // This is your application's FB ID
intent.putExtra("source_application", sourceApplication);

// Attach your sticker to the intent from a URI, and set background colors
Uri stickerAssetUri = Uri.parse("your-image-asset-uri-goes-here");
intent.setType(MEDIA_TYPE_JPEG);
intent.putExtra("interactive_asset_uri", stickerAssetUri);
intent.putExtra("top_background_color", "#33FF33");
intent.putExtra("bottom_background_color", "#FF00FF");

// Instantiate an activity
Activity activity = getActivity();

// Grant URI permissions for the sticker
activity.grantUriPermission(
    "com.instagram.android", stickerAssetUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);

// Verify that the activity resolves the intent and start it
if (activity.getPackageManager().resolveActivity(intent, 0) != null) {
  activity.startActivityForResult(intent, 0);
}
```

### Sharing a Background Asset and a Sticker Asset

This example sends a background layer image asset and a sticker layer image asset to Instagram.

```code
// Instantiate an intent
Intent intent = new Intent("com.instagram.share.ADD_TO_STORY");

// Attach your App ID to the intent
String sourceApplication = "1234567"; // This is your application's FB ID
intent.putExtra("source_application", sourceApplication);

// Attach your image to the intent from a URI
Uri backgroundAssetUri = Uri.parse("your-background-image-asset-uri-goes-here");
intent.setDataAndType(backgroundAssetUri, MEDIA_TYPE_JPEG);

// Attach your sticker to the intent from a URI
Uri stickerAssetUri = Uri.parse("your-sticker-image-asset-uri-goes-here");
intent.putExtra("interactive_asset_uri", stickerAssetUri);

// Grant URI permissions for the image
intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);

// Instantiate an activity
Activity activity = getActivity();

// Grant URI permissions for the sticker
activity.grantUriPermission(
    "com.instagram.android", stickerAssetUri, Intent.FLAG_GRANT_READ_URI_PERMISSION);

// Verify that the activity resolves the intent and start it
if (activity.getPackageManager().resolveActivity(intent, 0) != null) {
  activity.startActivityForResult(intent, 0);
}
```

## iOS Developers

iOS implementations use a **custom URL scheme** to launch the Instagram app and pass it content. In general, your sharing flow should:

1. Check that your app can resolve Instagram's custom URL scheme.
2. Assign the content that you want to share to the pasteboard.
3. Resolve the custom URL scheme if your app is able to.

### Data

You send the following data when you share to Stories.

| Content | Type | Description |
| --- | --- | --- |
| Facebook App ID | [NSString \*](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Ffoundation%2Fnsstring%2F&h=AUAj8qIX8gDARn-uiMAG6WTVc-vihkUUr8UcFNzWzd4dz3yKlpFhMtz0rOdfFz5KbsCRv2bsBwP_HT0ilcaLfUl-KxrUzonCOwE0KVkV6-fpRdAVOVImRKxf1A7xYu6OLfyf1Vv_-Cpd_w) | Your [Facebook App ID](https://developers.facebook.com/docs/ios/getting-started#app-id). |
| Background image asset | [NSData \*](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Ffoundation%2Fnsdata%2F&h=AUB9nxD1AEmn2CEdSGuAlqSrjC2VYJxvJoi-ejyxKtZXOMfnZR4ipVdeVedrzZT7tsLp2w2kZBPVjta3SXevDIZCQTxdI4HIGvft2eQ_8shHxXwF69gjbr7qBwUy9q6rYjRRd05kEtqESA) | Data for an image asset in a supported format (JPG, PNG). Minimum dimensions 720x1280. Recommended image ratios 9:16 or 9:18. You must pass the Instagram app a background asset (image or video), a sticker asset, or both. |
| Background video asset | [NSData \*](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Ffoundation%2Fnsdata%2F&h=AUCDwi5r4R9UFlT4yIDTuubol8yyObpMD5wMqRTWoMncBrKEwUpKVAaZEJvXRoZkJvPN7xWpKFRFtTsPG_5piYPPSnppMjCQlXPrdw2rRh8ZT9HTgX5hlhYphE3cphf_cjXC38_9-noCgQ) | Data for video asset in a supported format (H.264, H.265, WebM). Videos can be 1080p and up to 20 seconds in duration. Under 50 MB recommended. You must pass the Instagram app a background asset (image or video), a sticker asset, or both. |
| Sticker asset | [NSData \*](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Ffoundation%2Fnsdata%2F&h=AUDf-F7vW0cI3v4VwGKEZKgyDutxxhAOiBk7XJSPHPxwC5Q4fPEh2HUxIZaJFzFFs6aXK0ibME1D3ONuzQkve1NbF2vWk0QobW1QHLlJDfwHwdsEguWPhrNl-yxLKr6DkUamNRaqqzc-Uw) | Data for an image asset in a supported format (JPG, PNG). Recommended dimensions: 640x480. This image appears as a sticker over the background. You must pass the Instagram app a background asset (image or video), a sticker asset, or both. |
| Background layer top color | [NSString \*](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Ffoundation%2Fnsstring%2F&h=AUDw2L45xdjg6nzS-H_DnGb7R9gkxvCIOkflQTKltVpdlobwDeDQyOhYqniqOvyMes6XzESLPChHg-AtmYx8MpBq28HxBZA89yzm2aleAhXnuOFgyo9WHSUTkYbcZFq3GQaEcGXRUCgSfg) | A hex string color value used in conjunction with the background layer bottom color value. If both values are the same, the background layer is a solid color. If they differ, they are used to generate a gradient. |
| Background layer bottom color | [NSString \*](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Ffoundation%2Fnsstring%2F&h=AUBa_p-GW94UMBQCV3qeMbEbvewfTPfGePQwiLVByu13zw0jk1kn0j6P_ZznT4s3ptNrHAMbKlhKUGlmG8gTty2pIV2UxRAlUUQRq_rOmQMaLMrv2bnNeYR63w3-sty-UjxKDI9Cy3c_Vw) | A hex string color value used in conjunction with the background layer bottom color value. If both values are the same, the background layer is a solid color. If they differ, they are used to generate a gradient. |

### Register Instagram's Custom URL Scheme

You need to register Instagram's custom URL scheme before your app use it. Add `instagram-stories` to the `LSApplicationQueriesSchemes` key in your app's `Info.plist`.

### Sharing a Background Asset

The following code example sends a background layer image asset to Instagram so the user can edit and publish it to their Instagram Stories.

```code
- (void)shareBackgroundImage
{
  // Identify your App ID
  NSString *const appIDString = @"1234567890";

  // Call method to share image
  [self backgroundImage:UIImagePNGRepresentation([UIImage imageNamed:@"backgroundImage"])\
        appID:appIDString];
}

// Method to share image
- (void)backgroundImage:(NSData *)backgroundImage
        appID:(NSString *)appID
{
  NSURL *urlScheme = [NSURL URLWithString:[NSString stringWithFormat:@"instagram-stories://share?source_application=%@", appID]];

  if ([[UIApplication sharedApplication] canOpenURL:urlScheme])
  {
    // Attach the pasteboard items
    NSArray *pasteboardItems = @[@{@"com.instagram.sharedSticker.backgroundImage" : backgroundImage}];

    // Set pasteboard options
    NSDictionary *pasteboardOptions = @{UIPasteboardOptionExpirationDate : [[NSDate date] dateByAddingTimeInterval:60 * 5]};

    // This call is iOS 10+, can use 'setItems' depending on what versions you support
    [[UIPasteboard generalPasteboard] setItems:pasteboardItems options:pasteboardOptions];

    [[UIApplication sharedApplication] openURL:urlScheme options:@{} completionHandler:nil];
  }
  else
  {
      // Handle error cases
  }
}
```

### Sharing a Sticker Asset

This sample code shows how to pass the Instagram app a sticker layer image asset and a set of background layer colors. If you don't specify the background layer colors, the background layer color is `#222222`.

```code
- (void)shareStickerImage
{
  // Identify your App ID
  NSString *const appIDString = @"1234567890";

  // Call method to share sticker
  [self stickerImage:UIImagePNGRepresentation([UIImage imageNamed:@"stickerImage"])\
        backgroundTopColor:@"#444444"\
        backgroundBottomColor:@"#333333"\
        appID:appIDString];
}

// Method to share sticker
- (void)stickerImage:(NSData *)stickerImage
        backgroundTopColor:(NSString *)backgroundTopColor
        backgroundBottomColor:(NSString *)backgroundBottomColor
        appID:(NSString *)appID
{
  NSURL *urlScheme = [NSURL URLWithString:[NSString stringWithFormat:@"instagram-stories://share?source_application=%@", appID]];

  if ([[UIApplication sharedApplication] canOpenURL:urlScheme])
  {
    // Attach the pasteboard items
    NSArray *pasteboardItems = @[@{@"com.instagram.sharedSticker.stickerImage" : stickerImage,\
                                   @"com.instagram.sharedSticker.backgroundTopColor" : backgroundTopColor,\
                                   @"com.instagram.sharedSticker.backgroundBottomColor" : backgroundBottomColor}];

    // Set pasteboard options
    NSDictionary *pasteboardOptions = @{UIPasteboardOptionExpirationDate : [[NSDate date] dateByAddingTimeInterval:60 * 5]};

    // This call is iOS 10+, can use 'setItems' depending on what versions you support
    [[UIPasteboard generalPasteboard] setItems:pasteboardItems options:pasteboardOptions];

    [[UIApplication sharedApplication] openURL:urlScheme options:@{} completionHandler:nil];
  }
  else
  {
      // Handle error cases
  }
}
```

### Sharing a Background Asset and Sticker Asset

This sample code shows how to pass the Instagram app a background layer image asset and a sticker layer image asset.

```code
- (void)shareBackgroundAndStickerImage
{
  // Identify your App ID
  NSString *const appIDString = @"1234567890";

  // Call method to share image and sticker
  [self backgroundImage:UIImagePNGRepresentation([UIImage imageNamed:@"backgroundImage"])\
        stickerImage:UIImagePNGRepresentation([UIImage imageNamed:@"stickerImage"])\
        appID:appIDString];
}

// Method to share image and sticker
- (void)backgroundImage:(NSData *)backgroundImage
        stickerImage:(NSData *)stickerImage
        appID:(NSString *)appID
{
  NSURL *urlScheme = [NSURL URLWithString:[NSString stringWithFormat:@"instagram-stories://share?source_application=%@", appID]];

  if ([[UIApplication sharedApplication] canOpenURL:urlScheme])
  {
    // Attach the pasteboard items
    NSArray *pasteboardItems = @[@{@"com.instagram.sharedSticker.backgroundImage" : backgroundImage,\
                                   @"com.instagram.sharedSticker.stickerImage" : stickerImage}];

    // Set pasteboard options
    NSDictionary *pasteboardOptions = @{UIPasteboardOptionExpirationDate : [[NSDate date] dateByAddingTimeInterval:60 * 5]};

    // This call is iOS 10+, can use 'setItems' depending on what versions you support
    [[UIPasteboard generalPasteboard] setItems:pasteboardItems options:pasteboardOptions];

    [[UIApplication sharedApplication] openURL:urlScheme options:@{} completionHandler:nil];
  }
  else
  {
      // Handle error cases
  }
}
```

## Sharing to Facebook Stories

You can also allow your app's Users to share your content as a Facebook story. To learn how to do this, please refer to our Facebook [Sharing to Stories documentation](https://developers.facebook.com/docs/sharing/sharing-to-stories).

On This Page

[Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-to-stories)

[Overview](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#overview)

[Android Developers](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#android-developers)

[Data](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#data)

[Sharing a Background Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-background-asset)

[Sharing a Sticker Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-sticker-asset)

[Sharing a Background Asset and a Sticker Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-background-asset-and-a-sticker-asset)

[iOS Developers](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#ios-developers)

[Data](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#data-2)

[Register Instagram's Custom URL Scheme](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#register-instagram-s-custom-url-scheme)

[Sharing a Background Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-background-asset-2)

[Sharing a Sticker Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-sticker-asset-2)

[Sharing a Background Asset and Sticker Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-a-background-asset-and-sticker-asset)

[Sharing to Facebook Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories#sharing-to-facebook-stories)