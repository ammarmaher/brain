---
url: https://developers.facebook.com/docs/sharing/messenger
title: Messenger - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fmessenger%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Sharing to Messenger for iOS and Android](https://developers.facebook.com/docs/sharing/messenger#sharing-to-messenger-for-ios-and-android)

[Share Types](https://developers.facebook.com/docs/sharing/messenger#share-types)

[Linking App and Page IDs](https://developers.facebook.com/docs/sharing/messenger#app-page-id)

[Registering Domains](https://developers.facebook.com/docs/sharing/messenger#allowlisting)

[iOS](https://developers.facebook.com/docs/sharing/messenger#ios)

[Prerequisites](https://developers.facebook.com/docs/sharing/messenger#prerequisites)

[Limitations](https://developers.facebook.com/docs/sharing/messenger#limitations)

[Link Share Example](https://developers.facebook.com/docs/sharing/messenger#link-share-example)

[Photo Share Example](https://developers.facebook.com/docs/sharing/messenger#photo-share-example)

[Video Share Example](https://developers.facebook.com/docs/sharing/messenger#video-share-example)

[Android](https://developers.facebook.com/docs/sharing/messenger#android)

[Prerequisites](https://developers.facebook.com/docs/sharing/messenger#prerequisites-2)

[Related Topic](https://developers.facebook.com/docs/sharing/messenger#related-topic)

# Sharing to Messenger for iOS and Android

When you develop with the Facebook SDK for iOS or Android version 4.29.0 or later, you can enable people to share both links and media from your apps to Messenger. When a user shares to Messenger you can trigger your [chat extensions](https://developers.facebook.com/docs/messenger-platform/guides/chat-extensions) through the attribution link. Your chat extensions appear in the **More** section of the sharing interface.

For more information, see the following sections:

- **[Share Types](https://developers.facebook.com/docs/sharing/messenger#share-types)**
- **[Linking App and Page IDs](https://developers.facebook.com/docs/sharing/messenger#app-page-id)**
- **[Registering Domains](https://developers.facebook.com/docs/sharing/messenger#allowlisting)**
- **[iOS](https://developers.facebook.com/docs/sharing/messenger#ios)**
- **[Android](https://developers.facebook.com/docs/sharing/messenger#android)**

For implementing sharing to Messenger for the web, see [Sharing to Messenger for the Web](https://developers.facebook.com/docs/sharing/messenger/web).

## Share Types

The Facebook SDK provides the following share types:

- Link Share (The same as the existing link share but with a `pageID` for attribution)
- Photo (Unattributed)

The following table lists all the share types supported in sharing to Messenger, along with whether a Page or App ID is required.

| Share Type | Page ID Required? | Applications |
| --- | --- | --- |
| Link Share | Optional | - Link without attribution<br>- Link with attribution |
| Photo | Not supported | - Photos<br>- Photo from library |

## Linking App and Page IDs

Developers can specify a Page ID in the share flow, and when people share content from an app to messenger by way of the Sharing SDK, the content is attributed to the Page. Page administrators, in turn, can prevent false attributions by controlling which apps can use a share attribution for their Pages. To grant an app share attribution, the administrator links the app's ID with the Page ID.

To link an app ID and Page ID:

1. Go to the **Settings** for the Page.
2. Click on the **Messenger Platform** section.
3. Go to the **Link an App** section in **General Settings”**.
4. Enter the app ID and click the **Link** button.
5. If this app was NOT in the **Subscribed Apps** table already, it will show up in the table with the “share attribution” role associated with it. If the app was already in the table, the new “share attribution” role will be added for that app.

Page administrators can also remove an app's permission to use share attribution.

To remove the “share attribution” role for a given app:

1. In the **Subscribed Apps** table, click on the dropdown in the “role” column for the app.
2. Click on the “share attribution” to deselect the role.
3. If “share attribution” was the only role for the app, the row for the app is removed from the table. Otherwise, the row remains but the “share attribution” row is deselected.

## Registering Domains

If you use a URL button in the Share SDK and want to enable Messenger Extension for your URL when opened in Messenger, you have to register the URL domain for the share to work correctly.

To register a domain:

1. View the Page.
2. Navigate to **Settings** \> **Advanced Messaging**.
3. Add the domain to the **Whitelisted Domains** field.

For more information, see [Messenger Extensions SDK - Required Domain Whitelisting](https://developers.facebook.com/docs/messenger-platform/webview#whitelisting).

## iOS

### Prerequisites

Before you add sharing to Messenger to your app, complete the following steps:

- Add the **[Facebook SDK for iOS](https://developers.facebook.com/docs/ios)** to your mobile development environment
- Configure and link your **[Facebook app ID](https://developers.facebook.com/apps)** to your Page ID with the [Messenger Platform tool](https://www.facebook.com/page_tabs/?redirection=settings%2F%3Ftab%3Dmessenger_platform).
- Add your app ID, display name, and human-readable reason for photo access to your app's `.plist` file.
- Link the `FBSDKShareKit.framework` to your project.

For more information, see [Getting Started with the Facebook SDK for iOS](https://developers.facebook.com/docs/ios/getting-started/)

Also make sure your app calls `canShow` or `validate` on the `MessageDialog` instance to determine whether people have a compatible version of Messenger installed on their devices.

### Limitations

The quote property is not supported.

### Link Share Example

```code
guard let url = URL(string: "https://newsroom.fb.com/") else {
    preconditionFailure("URL is invalid")
}

let content = ShareLinkContent()
content.contentURL = url

let dialog = MessageDialog(content: content, delegate: self)

do {
    try dialog.validate()
} catch {
    print(error)
}

dialog.show()
```

### Photo Share Example

```code
// Assumes your assets contain an image named "puppy"
guard let image = UIImage(named: "puppy") else {
    return
}

let photo = SharePhoto(image: image, userGenerated: true)
let content = SharePhotoContent()
        content.photos = [photo]

let dialog = MessageDialog(content: content, delegate: self)

// Recommended to validate before trying to display the dialog
do {
    try dialog.validate()
} catch {
    print(error)
}

dialog.show()
```

### Video Share Example

```code
// Assuming you have a URL for a PHAsset
let video = ShareVideo(videoURL: assetURL)
let content = ShareVideoContent()
content.video = video

let dialog = MessageDialog(content: content, delegate: self)

// Recommended to validate before trying to display the dialog
do {
    try dialog.validate()
} catch {
    print(error)
}

dialog.show()
```

## Android

### Prerequisites

Follow the instructions in [Sharing on Android](https://developers.facebook.com/docs/sharing/android), summarized below:

- To use the Facebook [Sharing SDK](https://developers.facebook.com/docs/android/componentsdks) in your project, make it a dependency in Maven, or download it.
- Get a **[Facebook App ID](https://developers.facebook.com/apps)** properly configured and linked to your Android app.
- Configure and link your **[Facebook app ID](https://developers.facebook.com/apps)** to your Page ID with the [Messenger Platform tool](https://www.facebook.com/page_tabs/?redirection=settings%2F%3Ftab%3Dmessenger_platform).
- Generate an **Android [Key Hash](https://developers.facebook.com/docs/android/getting-started#create_hash)** and add it to your [developer profile](https://developers.facebook.com/settings/developer/contact/).
- Add a Facebook Activity and include it in your AndroidManifest.xml

Also make sure your app calls `MessageDialog.canshow({template})` to determine whether people have a compatible version of Messenger installed on their devices.

## Related Topic

[Sharing to Messenger for the Web](https://developers.facebook.com/docs/sharing/messenger/web)

On This Page

[Sharing to Messenger for iOS and Android](https://developers.facebook.com/docs/sharing/messenger#sharing-to-messenger-for-ios-and-android)

[Share Types](https://developers.facebook.com/docs/sharing/messenger#share-types)

[Linking App and Page IDs](https://developers.facebook.com/docs/sharing/messenger#app-page-id)

[Registering Domains](https://developers.facebook.com/docs/sharing/messenger#allowlisting)

[iOS](https://developers.facebook.com/docs/sharing/messenger#ios)

[Prerequisites](https://developers.facebook.com/docs/sharing/messenger#prerequisites)

[Limitations](https://developers.facebook.com/docs/sharing/messenger#limitations)

[Link Share Example](https://developers.facebook.com/docs/sharing/messenger#link-share-example)

[Photo Share Example](https://developers.facebook.com/docs/sharing/messenger#photo-share-example)

[Video Share Example](https://developers.facebook.com/docs/sharing/messenger#video-share-example)

[Android](https://developers.facebook.com/docs/sharing/messenger#android)

[Prerequisites](https://developers.facebook.com/docs/sharing/messenger#prerequisites-2)

[Related Topic](https://developers.facebook.com/docs/sharing/messenger#related-topic)