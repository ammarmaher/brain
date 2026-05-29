---
url: https://developers.facebook.com/docs/sharing/android
title: Android - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fandroid%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Sharing](https://developers.facebook.com/docs/sharing)

- [Overview](https://developers.facebook.com/docs/sharing/overview)
- [iOS](https://developers.facebook.com/docs/sharing/ios)
- [Android](https://developers.facebook.com/docs/sharing/android)
- [Web](https://developers.facebook.com/docs/sharing/web)
- [Messenger](https://developers.facebook.com/docs/sharing/messenger)
- [Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories)
- [Webmasters](https://developers.facebook.com/docs/sharing/webmasters)
- [Domain Verification](https://developers.facebook.com/docs/sharing/domain-verification)
- [Best Practices](https://developers.facebook.com/docs/sharing/best-practices)

On This Page

[Sharing on Android](https://developers.facebook.com/docs/sharing/android#sharing-on-android)

[Getting Started with Sharing](https://developers.facebook.com/docs/sharing/android#prereqs)

[Modeling Content](https://developers.facebook.com/docs/sharing/android#model)

[Links](https://developers.facebook.com/docs/sharing/android#links)

[Photos](https://developers.facebook.com/docs/sharing/android#photos)

[Videos](https://developers.facebook.com/docs/sharing/android#videos)

[Multimedia](https://developers.facebook.com/docs/sharing/android#multimedia)

[Add Sharing Interfaces](https://developers.facebook.com/docs/sharing/android#triggering)

[Buttons](https://developers.facebook.com/docs/sharing/android#buttons)

[Share Dialog](https://developers.facebook.com/docs/sharing/android#share_dialog)

[Message Dialog](https://developers.facebook.com/docs/sharing/android#message)

[Hashtags](https://developers.facebook.com/docs/sharing/android#hashtags)

[Advanced Topics](https://developers.facebook.com/docs/sharing/android#advanced)

[Built-In Share Fallbacks](https://developers.facebook.com/docs/sharing/android#fallback)

[App Links](https://developers.facebook.com/docs/sharing/android#app_links)

# Sharing on Android

After you integrate Facebook Login, Facebook Sharing, or Facebook Gaming, certain App Events are automatically logged and collected for [Events Manager](https://www.facebook.com/events_manager), unless you disable Automatic App Event Logging. We recommend all app developers using Facebook Login, Facebook Sharing, or Facebook Gaming to understand how this functionality works. For details about what information is collected and how to disable Automatic App Event Logging, see [Automatic App Event Logging.](https://www.developers.facebook.com/docs/app-events/automatic-event-collection-detail)

This guide explains how to enable users of your Android app to share from your app to Facebook. When someone shares from your app, the content that they share appears on their Timeline. Content that your users share to their Timeline can also appear in the Feeds of their friends. Users can also share content from your app to Facebook Messenger.

When you implement sharing, your app should not pre-fill any content to share. Pre-filling content is inconsistent with the [Developer Policies](https://developers.facebook.com/devpolicy/#control).

The following example photos show the sharing dialog in your app on the left and the resulting post in the Facebook app on the right.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/11057184_822163927854102_637828047_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=34156e&_nc_ohc=JN1S9l6LbPcQ7kNvwGpTLmA&_nc_oc=AdoTR3rHpMxZ0FkgYNeJkHXtazG1-Ak2L4b8WXPXXoFh8oYbr3R7VZtJiYhuuFRNLAs&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=_ErKEIYCs6tcHuhnFr72UQ&_nc_ss=7b289&oh=00_Af6pikYatsNaHr1cAo54ld_GuHP-QjhmuvUD7-4sG32egA&oe=6A11241B)

## Getting Started with Sharing

The Sharing SDK for Android is a component of the [Facebook SDK for Android](https://developers.facebook.com/docs/android).

To use the Facebook Sharing SDK in your project, make it a dependency in Maven.

1. In your project, open **your\_app \| Gradle Scripts \| build.gradle (Project)** and add the following repository to the `buildscript { repositories {}}` section:


```
mavenCentral()
```

2. In your project, open **your\_app \| Gradle Scripts \| build.gradle (Module: app)** and add the following compile statement to the `dependencies{}` section:


```
compile 'com.facebook.android:facebook-share:latest.release'
```

3. Build your project.

4. Get your Facebook App ID properly configured and linked to your Android app.

   - If you don't have a Facebook App ID for your app yet, see [Facebook SDK Quick Start for Android](https://developers.facebook.com/docs/android/getting-started#quick-start).
   - Find your Facebook App ID on the [Apps](https://developers.facebook.com/apps) page of the developer portal and then see [Add Your Facebook App ID and Client Token](https://developers.facebook.com/docs/android/getting-started#app_id).
5. Generate an Android development key hash and add it to the **Sample Apps** page of your [developer settings](https://developers.facebook.com/settings/developer/sample-app/). For details, see [Create a Development Key Hash](https://developers.facebook.com/docs/android/getting-started#create_hash) and [Running Sample Apps](https://developers.facebook.com/docs/android/getting-started#samples).

6. Add a `ContentProvider` to your `AndroidManifest.xml` file and set `{APP_ID}` to your app ID:


```
<provider android:authorities="com.facebook.app.FacebookContentProvider{APP_ID}"
android:name="com.facebook.FacebookContentProvider"
android:exported="true"/>
```

7. If your application targets Android 11 or later, add the following queries block to your `AndroidManifest.xml` file to [make the Facebook App visible to your App](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Ftraining%2Fpackage-visibility&h=AUDpG1QVbsJb6BTsa4RPztOElucCD_bUhlgIBrcypvZIYO2RrNcyvM3KJDYVFe2DarfpcLMfoE84k0a-KyA0Co1rzoNGa8RKR_9LjbJOskKMZuV51hZTjIPLmNDbVMb90iI0d3hCA6u2TA):


```
<queries>
<provider android:authorities="com.facebook.katana.provider.PlatformProvider" />
</queries>
```

8. Add a `Facebook Activity` to your project and include it in your `AndroidManifest.xml` file.


## Modeling Content

Versions 4.0+ of the Facebook SDKs have new models for sharing content. Each type of content people want to share has a class you can use to represent it. After you model the content, add a sharing interface to your app.

### Links

When people share links from your app to Facebook, it includes a `contentURL` with the link to be shared. Build your share content for links into the `ShareLinkContent` model. For a list of all attributes, see [`ShareLinkContent` reference](https://developers.facebook.com/docs/reference/android/current/class/ShareLinkContent).

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/11057106_610131042456334_1908341011_n.png?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=rHmNkiqe7JEQ7kNvwHvA8y-&_nc_oc=AdqqmCOPDrbk8huuHGS1-3DhRewDxoiXs-bwQJkn98cg64ZwhNa9rjy6GS7vkuv8cug&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=_ErKEIYCs6tcHuhnFr72UQ&_nc_ss=7b289&oh=00_Af5domDDKJoi0u-lzK3HQs3IXs9oSEydfWqSpr0LLV0ybA&oe=6A111847)

Here's an example of how you can trigger the share:

```code
ShareLinkContent content = new ShareLinkContent.Builder()
        .setContentUrl(Uri.parse("https://developers.facebook.com"))
        .build();
```

To preview a link share to Google Play or the App Store, enter your URL into the [Sharing Debugger](https://developers.facebook.com/tools/debug/).

If your app share contains a link to any app on Google Play or the App Store, the description and image included in the share will be ignored. Instead, we will scrape the store directly for that app's title and image (and if there is no image, the share won't include one).

### Photos

People can share photos from your app to Facebook with the Share Dialog. In order to share, they must have the native Facebook for Android app installed, version 7.0 or higher.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/11057187_452840318213330_337249962_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=34156e&_nc_ohc=ZdpYBQgy5LQQ7kNvwEcTJk8&_nc_oc=AdrqkDboIG8dWsqhC_gWMZ3sJ270RfYmB-UIvguQhCh2ruHupDq5qVbxaAxCIW9A_sg&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=_ErKEIYCs6tcHuhnFr72UQ&_nc_ss=7b289&oh=00_Af6Zk0DLIjWGNPg9MgYBIMWYoXI-QVAgKfvK0SU3x56yjQ&oe=6A10FE15)

Build your share content for photos into the `SharePhotoContent` model. For a list of all attributes, see [`SharePhotoContent` reference](https://developers.facebook.com/docs/reference/android/current/class/SharePhotoContent).

```code
Bitmap image = ...
SharePhoto photo = new SharePhoto.Builder()
        .setBitmap(image)
        .build();
SharePhotoContent content = new SharePhotoContent.Builder()
        .addPhoto(photo)
        .build();
```

### Videos

People using your app can share videos to Facebook with the Share dialog.

Build your share content for videos into the `ShareVideoContent` model. For a list of all attributes, see [`ShareVideoContent` reference](https://developers.facebook.com/docs/reference/android/current/class/ShareVideoContent).

```code
Uri videoFileUri = ...
ShareVideo = new ShareVideo.Builder()
        .setLocalUrl(videoUrl)
        .build();
ShareVideoContent content = new ShareVideoContent.Builder()
        .setVideo(video)
        .build();
```

### Multimedia

People can share a combination of photos and videos from your app to Facebook with the Share Dialog. Note the following:

- People need the native Facebook for Android app installed, version 71 or higher.
- People can share a maximum of 6 photos and videos at a time.

Build your multimedia share content with the `ShareMediaContent` model. For a list of all attributes, see [`ShareMediaContent` reference](https://developers.facebook.com/docs/reference/android/current/class/ShareMediaContent).

```code
SharePhoto sharePhoto1 = new SharePhoto.Builder()
    .setBitmap(...)
    .build();
SharePhoto sharePhoto2 = new SharePhoto.Builder()
    .setBitmap(...)
    .build();
ShareVideo shareVideo1 = new ShareVideo.Builder()
    .setLocalUrl(...)
    .build();
ShareVideo shareVideo2 = new ShareVideo.Builder()
    .setLocalUrl(...)
    .build();

ShareContent shareContent = new ShareMediaContent.Builder()
    .addMedium(sharePhoto1)
    .addMedium(sharePhoto2)
    .addMedium(shareVideo1)
    .addMedium(shareVideo2)
    .build();

ShareDialog shareDialog = new ShareDialog(...);
shareDialog.show(shareContent, Mode.AUTOMATIC);
```

## Add Sharing Interfaces

After you handle content by building a model, trigger a Facebook sharing interface.

### Buttons

Facebook offers native buttons for Android for triggering sharing.

* * *

#### Share Button

The Share button will call a [Share dialog](https://developers.facebook.com/docs/sharing/android#share_dialog). To add a Share button add the following code snippet to your view:

```code
ShareButton shareButton = (ShareButton)findViewById(R.id.fb_share_button);
shareButton.setShareContent(content);
```

* * *

### Share Dialog

The Share dialog switches to the native Facebook for Android app, then returns control to your app after a post is published. Depending on the SDK you're using, people may need tap the back arrow icon to return to your app. If the Facebook app is not installed, the Share dialog automatically falls back to the web-based dialog.

```code
ShareDialog.show(activityOrFragment, content);
```

For example, to show the `ShareDialog` for a link in your activity, create a `ShareDialog` instance in your `onCreate` method:

```code
public class MainActivity extends FragmentActivity {
    CallbackManager callbackManager;
    ShareDialog shareDialog;
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        callbackManager = CallbackManager.Factory.create();
        shareDialog = new ShareDialog(this);
        // this part is optional
        shareDialog.registerCallback(callbackManager, new FacebookCallback<Sharer.Result>() { ... });
    }
```

Then show the ShareDialog:

```code
if (ShareDialog.canShow(ShareLinkContent.class)) {
    ShareLinkContent linkContent = new ShareLinkContent.Builder()
            .setContentUrl(Uri.parse("http://developers.facebook.com/android"))
            .build();
    shareDialog.show(linkContent);
}
```

Finally call the SDK's `callbackManager` in your `onActivityResult` to handle the response:

```code
@Override
protected void onActivityResult(final int requestCode, final int resultCode, final Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    callbackManager.onActivityResult(requestCode, resultCode, data);
}
```

If you are using AndroidX activities or fragments, you don't have to override `onActivityResult`.

### Message Dialog

The Message dialog switches to the native Messenger for Android app, then returns control to your app after a post is published. Depending on the SDK you're using, people may need tap the back arrow icon to return to your app.

```code
MessageDialog.show(activityOrFragment, content);
```

## Hashtags

You can specify a single hashtag to appear with a shared photo, link, or video. This hashtag also appears in the Share dialog, and people have the the opportunity to remove it before publishing.

The following is an example of adding a hashtag to a link share.

```code
ShareLinkContent content = new ShareLinkContent.Builder()
        .setContentUrl(Uri.parse("https://developers.facebook.com"))
        .setShareHashtag(new ShareHashtag.Builder()
                .setHashtag("#ConnectTheWorld")
                .build());
        .build();
```

## Advanced Topics

### Built-In Share Fallbacks

In past versions of the Facebook SDK for Android, your app had to check for a native, installed Facebook app before it could open the Share Dialog. If the person didn't have the app installed, you had to provide your own code to call a fallback dialog.

Now the SDK automatically checks for the native Facebook app. If it isn't installed, the SDK switches people to their default browser and opens the [Feed Dialog](https://developers.facebook.com/docs/sharing/reference/feed-dialog).

### App Links

With [App Links](https://developers.facebook.com/docs/applinks/android) you link back to your app from Facebook posts published from your app. When people click a Facebook post published from your app, it opens your app, and you can even link to specific content within the app.

On This Page

[Sharing on Android](https://developers.facebook.com/docs/sharing/android#sharing-on-android)

[Getting Started with Sharing](https://developers.facebook.com/docs/sharing/android#prereqs)

[Modeling Content](https://developers.facebook.com/docs/sharing/android#model)

[Links](https://developers.facebook.com/docs/sharing/android#links)

[Photos](https://developers.facebook.com/docs/sharing/android#photos)

[Videos](https://developers.facebook.com/docs/sharing/android#videos)

[Multimedia](https://developers.facebook.com/docs/sharing/android#multimedia)

[Add Sharing Interfaces](https://developers.facebook.com/docs/sharing/android#triggering)

[Buttons](https://developers.facebook.com/docs/sharing/android#buttons)

[Share Dialog](https://developers.facebook.com/docs/sharing/android#share_dialog)

[Message Dialog](https://developers.facebook.com/docs/sharing/android#message)

[Hashtags](https://developers.facebook.com/docs/sharing/android#hashtags)

[Advanced Topics](https://developers.facebook.com/docs/sharing/android#advanced)

[Built-In Share Fallbacks](https://developers.facebook.com/docs/sharing/android#fallback)

[App Links](https://developers.facebook.com/docs/sharing/android#app_links)