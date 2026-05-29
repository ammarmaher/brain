---
url: https://developers.facebook.com/docs/instagram-platform/sharing-to-feed
title: Sharing to Feed - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Fsharing-to-feed%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#sharing-to-feed)

[Overview](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#overview)

[Android Developers](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#android-developers)

[Shareable Content](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#shareable-content)

[Sharing an Image Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#sharing-an-image-asset)

[Sharing a Video Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#sharing-a-video-asset)

[iOS Developers](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#ios-developers)

[Universal Links](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#universal-links)

[Sample Objective-C Code](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#sample-objective-c-code)

[Document Interaction](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#document-interaction)

# Sharing to Feed

With Sharing to Feed, you can allow your app's Users to share your content to their Instagram Feed.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/31739640_2065459473743293_5455162868888502272_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=o9YwF616TK8Q7kNvwF5Han5&_nc_oc=AdoLh9t9kjkNL5VlIKF0bATLpyLgKDzBqi04jgY9s4XOUJ9e5Xhs5yazZWpPMoOKa_s&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=qXjvzXe37SPp8twfAx5qSQ&_nc_ss=7b289&oh=00_Af4K1x5MchPwTDBSOb10XKilt1SkyN-AShBP3vPWIX_-7Q&oe=6A25874F)

## Overview

By using Android **Implicit Intents** and iOS **Universal Links** or **Document Interaction**, your app can pass photos and videos to the Instagram app. The Instagram app will receive this content and load it in the feed composer so the User can publish it to their Instagram Feed.

## Android Developers

Android implementations use implicit intents with the EXTRA\_STREAM extra to prompt the User to select the Instagram app. Once selected, the intent will launch the Instagram app and pass it your content, which the Instagram App will then load in the Feed Composer.

In general, your sharing flow should:

1. Instantiate an implicit intent with the content you want to pass to the Instagram app.
2. Start an activity and check that it can resolve the implicit intent.
3. Resolve the activity if it is able to.

### Shareable Content

You can pass the following content to the Instagram app:

| Content | File Types | Description |
| --- | --- | --- |
| Image asset | JPEG, GIF, or PNG | - |
| File asset | MKV, MP4 | Minimum duration: 3 seconds<br>Maximum duration: 10 minutes<br>Minimum dimentions: 640x640 pixels |

### Sharing an Image Asset

```code
String type = "image/*";
String filename = "/myPhoto.jpg";
String mediaPath = Environment.getExternalStorageDirectory() + filename;

createInstagramIntent(type, mediaPath);

private void createInstagramIntent(String type, String mediaPath){

    // Create the new Intent using the 'Send' action.
    Intent share = new Intent(Intent.ACTION_SEND);

    // Set the MIME type
    share.setType(type);

    // Create the URI from the media
    File media = new File(mediaPath);
    Uri uri = Uri.fromFile(media);

    // Add the URI to the Intent.
    share.putExtra(Intent.EXTRA_STREAM, uri);

    // Broadcast the Intent.
    startActivity(Intent.createChooser(share, "Share to"));
}
```

### Sharing a Video Asset

```code
String type = "video/*";
String filename = "/myVideo.mp4";
String mediaPath = Environment.getExternalStorageDirectory() + filename;

createInstagramIntent(type, mediaPath);

private void createInstagramIntent(String type, String mediaPath){

    // Create the new Intent using the 'Send' action.
    Intent share = new Intent(Intent.ACTION_SEND);

    // Set the MIME type
    share.setType(type);

    // Create the URI from the media
    File media = new File(mediaPath);
    Uri uri = Uri.fromFile(media);

    // Add the URI to the Intent.
    share.putExtra(Intent.EXTRA_STREAM, uri);

    // Broadcast the Intent.
    startActivity(Intent.createChooser(share, "Share to"));
}
```

## iOS Developers

iOS implementations can use universal links to launch the Instagram app and pass it content, or have it perform a specific action.

### Universal Links

Use the [universal links](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fxcode%2Fallowing-apps-and-websites-to-link-to-your-content&h=AUBwQQqhqEZs7_uJljkCFkv78SnSNlAB4ScR1OCLYy_Z_9raYLaiuWkd5eEEr_7Be9B5UdqGTI4CmGSLiXzVm_6WzFeInrbwMLnWrc0yR0hrN8K1MgEQnxD8-HoNKqc43Ye6WYXrVSLGOg) listed in the following table to perform actions in the Instagram app.

| Universal link | Action |
| --- | --- |
| https://www.instagram.com | Launch the Instagram app. |
| https://www.instagram.com/create/story | Launch the Instagram app with the camera view or photo library on non-camera devices. |
| https://www.instagram.com/p/{media\_id} | Launch the Instagram app and load the post that matches the specified ID value (`int`). |
| https://www.instagram.com/{username} | Launch the Instagram app and load the Instagram user that matches the specified username value (`string`). |
| https://www.instagram.com/explore/locations/{location\_id} | Launch the Instagram app and load the location feed that matches the specified ID value (`int`). |
| https://www.instagram.com/explore/tags/{tag\_name} | Launch the Instagram app and load the page for the hashtag that matches the specified name value (`string`). |

### Sample Objective-C Code

The following example in Objective-C launches the Instagram app with the camera view.

```code
NSURL *instagramURL = [NSURL URLWithString:@"https://www.instagram.com/create/story"];
if ([[UIApplication sharedApplication] canOpenURL:instagramURL]) {
    [[UIApplication sharedApplication] openURL:instagramURL];
}
```

### Document Interaction

If your application creates photos and you'd like your users to share these photos using Instagram, you can use the [Document Interaction API](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Flibrary%2Fcontent%2Fdocumentation%2FFileManagement%2FConceptual%2FDocumentInteraction_TopicsForIOS%2FIntroduction%2FIntroduction.html&h=AUDfiQi5h08H_218CozgSQSeSTS9hmryikfSoZams2HGFyp0JixXCm4ivK8up4JTVVZSZ6EcF0GQkePjIiiDrDlChgaRVkOs6uY-ZSGMoISUR5a8V0M-e1YqbyjX23teg7f7fuyzzybdOyCj-mY4SeHoZhw) to open your photo in Instagram's sharing flow.

You must first save your file in PNG or JPEG (preferred) format and use the filename extension `.ig`. Using the iOS Document Interaction APIs you can trigger the photo to be opened by Instagram. The Identifier for our Document Interaction UTI is `com.instagram.photo`, and it conforms to the _public/jpeg_ and _public/png_ UTIs. See the Apple documentation articles: [Previewing and Opening Files](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Flibrary%2Fcontent%2Fdocumentation%2FFileManagement%2FConceptual%2FDocumentInteraction_TopicsForIOS%2FArticles%2FPreviewingandOpeningItems.html%23%2F%2Fapple_ref%2Fdoc%2Fuid%2FTP40010410-SW1&h=AUBBCarTOSEpvOl7degLCZC7u4o1RxxOoiSVRn-FjBZNZlvIvvqKcpbTG0mUBD45FrE2CjAkORVTaELQp197biq47mQMOK569hjR5OUdcg8zIiO0e8Fn-7azG6vixB5SB2FsthLj_2u-iw) and the [UIDocumentInteractionController Class Reference](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Flibrary%2Fcontent%2F%23documentation%2FUIKit%2FReference%2FUIDocumentInteractionController_class%2FReference%2FReference.html&h=AUDXZCyJ2DhTA56nb_vVL74Q4vNgtcMtiyYqFigqX6KVlwdXn0PjaRY9Ack9te3vYjKsnwsUvKr8Tuw3H0NwH2m-YembIzU7_sGNyHF6I62P-xOoPHN6dyECkZsiM0vkrUdnOfKOMFtE3g) for more information.

Alternatively, if you want to show **only** Instagram in the application list (instead of Instagram plus any other _public/jpeg_-conforming apps) you can specify the extension class `igo`, which is of type `com.instagram.exclusivegram`.

When triggered, Instagram will immediately present the user with our filter screen. The image is preloaded and sized appropriately for Instagram. For best results, Instagram prefers opening a JPEG that is 640px by 640px square. If the image is larger, it will be resized dynamically.

On This Page

[Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#sharing-to-feed)

[Overview](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#overview)

[Android Developers](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#android-developers)

[Shareable Content](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#shareable-content)

[Sharing an Image Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#sharing-an-image-asset)

[Sharing a Video Asset](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#sharing-a-video-asset)

[iOS Developers](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#ios-developers)

[Universal Links](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#universal-links)

[Sample Objective-C Code](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#sample-objective-c-code)

[Document Interaction](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed#document-interaction)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close