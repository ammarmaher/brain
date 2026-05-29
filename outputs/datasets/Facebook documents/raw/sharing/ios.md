---
url: https://developers.facebook.com/docs/sharing/ios
title: iOS - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fios%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Sharing](https://developers.facebook.com/docs/sharing)

- [Overview](https://developers.facebook.com/docs/sharing/overview)
- [iOS](https://developers.facebook.com/docs/sharing/ios)


  - [Share Button](https://developers.facebook.com/docs/sharing/ios/share-button)

- [Android](https://developers.facebook.com/docs/sharing/android)
- [Web](https://developers.facebook.com/docs/sharing/web)
- [Messenger](https://developers.facebook.com/docs/sharing/messenger)
- [Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories)
- [Webmasters](https://developers.facebook.com/docs/sharing/webmasters)
- [Domain Verification](https://developers.facebook.com/docs/sharing/domain-verification)
- [Best Practices](https://developers.facebook.com/docs/sharing/best-practices)

On This Page

[Sharing on iOS](https://developers.facebook.com/docs/sharing/ios#sharing-on-ios)

[Prerequisites](https://developers.facebook.com/docs/sharing/ios#prereqs)

[Modeling Content](https://developers.facebook.com/docs/sharing/ios#model)

[Links](https://developers.facebook.com/docs/sharing/ios#links)

[Photos](https://developers.facebook.com/docs/sharing/ios#photos)

[Videos](https://developers.facebook.com/docs/sharing/ios#videos)

[Multimedia](https://developers.facebook.com/docs/sharing/ios#multimedia)

[Sharing Methods](https://developers.facebook.com/docs/sharing/ios#triggering)

[Buttons](https://developers.facebook.com/docs/sharing/ios#buttons)

[Share Dialog](https://developers.facebook.com/docs/sharing/ios#share_dialog)

[Message Dialog](https://developers.facebook.com/docs/sharing/ios#message)

[iOS Integration](https://developers.facebook.com/docs/sharing/ios#ios-integration)

[Hashtags](https://developers.facebook.com/docs/sharing/ios#hashtags)

[Advanced Topics](https://developers.facebook.com/docs/sharing/ios#Advanced)

[App Links](https://developers.facebook.com/docs/sharing/ios#app_links)

[iOS Simulator and Testing](https://developers.facebook.com/docs/sharing/ios#simulator)

# Sharing on iOS

After you integrate Facebook Login, Facebook Sharing, or Facebook Gaming, certain App Events are automatically logged and collected for [Events Manager](https://www.facebook.com/events_manager), unless you disable Automatic App Event Logging. We recommend all app developers using Facebook Login, Facebook Sharing, or Facebook Gaming to understand how this functionality works. For details about what information is collected and how to disable Automatic App Event Logging, see [Automatic App Event Logging.](https://www.developers.facebook.com/docs/app-events/automatic-event-collection-detail)

Additional details for FB iOS SDK can be found [here](https://developers.facebook.com/docs/ios/).

This guide details how to enable sharing from your iOS app to Facebook. When someone shares from your app, their content appears in their Timeline and in their friends' Feeds.

![](https://scontent-lga3-3.xx.fbcdn.net/v/t39.2365-6/12057255_613970612090235_364736053_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=ZcywL9vv1MAQ7kNvwG4K6s4&_nc_oc=AdqgdfLeTmx7ihTbEDucEi2_llG68KVx_P9CVBFcQnUM2PdaCyA4mnVQTIqqapf90Zo&_nc_zt=14&_nc_ht=scontent-lga3-3.xx&_nc_gid=L53-nljxRYprJyNSNewyAg&_nc_ss=7b289&oh=00_Af7_IjdZZ-xUYP2GOE2OUiJASWhyOQtaXoHsNQXBlpxuLA&oe=6A2568BD)

## Prerequisites

Before you add sharing to your app you need to:

- Add the **[Facebook SDK for iOS](https://developers.facebook.com/docs/ios)** to your mobile development environment
- Configure and link your **[Facebook app ID](https://developers.facebook.com/apps)**
- Add your app ID, display name, and human-readable reason for photo access to your app's `.plist` file.
- Link the `FBSDKShareKit.framework` to your project.

Your app should not pre-fill any content to be shared. This is inconsistent with Facebook Platform Policy, see [Developer Policies](https://developers.facebook.com/devpolicy/#control).

[iOS SDK Getting Started](https://developers.facebook.com/docs/ios/getting-started/)

## Modeling Content

Each type of content has a interface you can use to represent it which conforms to `SharingContent`. After you model the content, add a sharing interface to your app which conforms to `Sharing` or use the provided `ShareDialog` class.

### Links

When people share links from your app to Facebook it includes a `contentURL` with the link to be shared. Build your share content for links with the `ShareLinkContent` model.

Here's an example of how you can trigger the share:

```code
guard let url = URL(string: "https://developers.facebook.com") else {
    // handle and return
}

let content = ShareLinkContent()
content.contentURL = url

let dialog = ShareDialog(
    viewController: self,
    content: content,
    delegate: self
)
dialog.show()
```

Note: If your app share links to the iTunes or Google Play stores, we do not post any images or descriptions that you specify in the share. Instead we post some app information we scrape from the app store directly with the Webcrawler. This may not include images. To preview a link share to iTunes or Google Play, enter your URL into the [Sharing Debugger](https://developers.facebook.com/tools/debug/).

### Photos

People can share photos from your app to Facebook with the Share Dialog or with a custom interface:

- Photos must be less than 12MB in size
- People need the native Facebook for iOS app installed, version 7.0 or higher

Build your share content for photos with the `SharePhotoContent` model.

```code
func imagePickerController(
    _ picker: UIImagePickerController,
    didFinishPickingMediaWithInfo
    info: [UIImagePickerController.InfoKey : Any]
) {
    guard let image = info[.originalImage] as? UIImage else {
        // handle and return
        return
    }
    let photo = SharePhoto(
        image: image,
        userGenerated: true
    )
    var content = SharePhotoContent()
    content.photos = [photo]
    // use the content
}
```

### Videos

People using your app can share videos to Facebook with the Share dialog or with your own custom interface:

- The videos must be less than 50MB in size.
- People who share should have Facebook for iOS client installed, version 26.0 or higher.

Build your share content for videos with the `FBSDKShareVideoContent` model. For a list of all attributes, see [`FBSDKShareVideoContent` reference](https://developers.facebook.com/docs/reference/ios/current/class/FBSDKShareVideoContent).

```code
func imagePickerController(
    _ picker: UIImagePickerController,
    didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]
) {
    let video: ShareVideo

    if #available(iOS 11, *) {
        guard let videoAsset = info[.phAsset] as? PHAsset else {
            return
        }
        video = ShareVideo(videoAsset: videoAsset)
    } else {
        guard let url = info[.referenceURL] as? URL else {
            return
        }
        video = ShareVideo(videoURL: url)
    }
}
```

### Multimedia

People using your app can share a combination of photos and videos to Facebook with the Share dialog. Note the following:

- People who share should have Facebook for iOS client installed.
- Photos must be less than 12MB and video must be less than 50MB in size.
- People can share a maximum of 1 video plus up to 29 photos or 30 photos.

Build your multimedia share content with the `ShareMediaContent` model.

```code
let photo = SharePhoto(...)
let video = ShareVideo(...)

var content = ShareMediaContent()
content.media = [photo, video]
```

## Sharing Methods

After you handle content by building a model, you can either trigger the Share or Message dialogs.

### Buttons

On iOS, Facebook has native buttons to trigger shares.

* * *

#### Share Button

With the Share Button you will allow people to share content to their Facebook timeline, to a friend's timeline or in a group. The Share button will call a [Share dialog](https://developers.facebook.com/docs/sharing/ios#share_dialog). To add a Share button to your view add the following code snippet to your view:

```code
var button = FBShareButton()
button.shareContent = content
// Add button to view
```

* * *

#### Send Button

The Send button lets people privately send photos, videos and links to their friends and contacts using the [Facebook Messenger](https://l.facebook.com/l.php?u=https%3A%2F%2Fitunes.apple.com%2Fus%2Fapp%2Ffacebook-messenger%2Fid454638411&h=AUDsoXxHpXQfpIycDYSV3tXHUB6nVQDQhgJJyYfStNEyYXc5_b4GbOqj4h5xm7G9vMGvKZ9gnA3OuIT9gcQlgEd8mqepkcajnNwroaoDdV-Z7T5rrf5tOgeW00O38TI-fhr3pFWrkY6bCg) app. The Send button will call a [Message dialog](https://developers.facebook.com/docs/sharing/ios#message). To add a Send button to your view add the following code snippet to your view:

```code
var button = SendButton()
button.shareContent = content
// Add button to view
```

If the Messenger app is not installed, the Send button will be dimmed. To inspect whether the Send button can be used on the current device use the `SendButton` property `isImplicitlyDisabled`:

### Share Dialog

To use the Facebook-built sharing experiences, you want to define your content as in the [modeling content](https://developers.facebook.com/docs/sharing/ios#model) section above, and then call the Share Dialog. For example, to share a link with the Share Dialog:

```code
guard let url = URL(string: "https://developers.facebook.com") else {
    // handle and return
}

let content = ShareLinkContent()
content.contentURL = url

let dialog = ShareDialog(
    viewController: self,
    content: content,
    delegate: self
)
dialog.show()
```

In past versions of the SDK for iOS, your app had to check for a native, installed Facebook app before it could open the Share Dialog. If the person didn't have the app installed, you had to provide your own code to call a fallback dialog.

Now the SDK automatically checks for the native Facebook app. If it isn't installed, the SDK switches people to their default browser and opens the [Feed Dialog](https://developers.facebook.com/docs/sharing/reference/feed-dialog).

If the native Facebook app is installed, people will see the iOS Share Sheet instead of being switched to the native Facebook for iOS app.

### Message Dialog

The Message Dialog switches to the native Messenger for iOS app, then returns control to your app after a post is published.

```code
MessageDialog(content: content, delegate: delegate).show()
```

Note: Currently the Message Dialog is not supported on iPads.

### iOS Integration

iOS includes a native share sheet that lets people post status updates, photos, videos and links to Facebook and includes support for setting the audience for the post and tagging the post with a location. The Facebook SDK supports the use of this native controller; this experience is what people will see in most cases when you call the Facebook Share Dialog.

Use of the iOS share sheet is subject to [Developer Policies](https://developers.facebook.com/devpolicy/#control), including section 2.3 which states that apps may not pre-fill in the context of the share sheet. This means apps may not pre-fill the share sheet's initialText field with content that wasn't entered by the user of the app.

This API also uses the same style block as other parts of the Facebook SDK. To show the native iOS share dialog, use:

```code
let dialog = ShareDialog(
    viewController: self,
    content: content,
    delegate: nil
)
dialog.mode = .shareSheet
dialog.show()
```

Note that the `viewController` argument is required in order for the share sheet to present.

## Hashtags

You can specify a single hashtag to appear with a shared photo, link, or video. This hashtag also appears in the Share dialog, and people have the the opportunity to remove it before publishing.

The following is an example of adding a hashtag to a link share.

```code
let content = ShareLinkContent()
guard let url = URL(string: "https://developers.facebook.com") else { return }

content.contentURL = url
content.hashtag = Hashtag("#MadeWithHackbook")
```

## Advanced Topics

### App Links

With [App Links](https://developers.facebook.com/docs/applinks/ios) you can link back to your app from Facebook posts published from your app.

When people click a Facebook post published from your app, it opens your app and you can even link to specific content within the app.

### iOS Simulator and Testing

If you are using Simulator to test sharing in your application, you will see errors if you try to share videos or Photos. This is because you need Facebook for iOS installed which provides the Share Dialog. We do not support this for Simulator.

In the case of link shares, you do not need Facebook for iOS installed so this test case is possible. To test other Sharing scenarios, set up an actual test device with with Facebook for iOS installed.

On This Page

[Sharing on iOS](https://developers.facebook.com/docs/sharing/ios#sharing-on-ios)

[Prerequisites](https://developers.facebook.com/docs/sharing/ios#prereqs)

[Modeling Content](https://developers.facebook.com/docs/sharing/ios#model)

[Links](https://developers.facebook.com/docs/sharing/ios#links)

[Photos](https://developers.facebook.com/docs/sharing/ios#photos)

[Videos](https://developers.facebook.com/docs/sharing/ios#videos)

[Multimedia](https://developers.facebook.com/docs/sharing/ios#multimedia)

[Sharing Methods](https://developers.facebook.com/docs/sharing/ios#triggering)

[Buttons](https://developers.facebook.com/docs/sharing/ios#buttons)

[Share Dialog](https://developers.facebook.com/docs/sharing/ios#share_dialog)

[Message Dialog](https://developers.facebook.com/docs/sharing/ios#message)

[iOS Integration](https://developers.facebook.com/docs/sharing/ios#ios-integration)

[Hashtags](https://developers.facebook.com/docs/sharing/ios#hashtags)

[Advanced Topics](https://developers.facebook.com/docs/sharing/ios#Advanced)

[App Links](https://developers.facebook.com/docs/sharing/ios#app_links)

[iOS Simulator and Testing](https://developers.facebook.com/docs/sharing/ios#simulator)

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

You can opt out of seeing online interest-based ads from Meta and other participating companies through the [Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Foptout.aboutads.info%2F&h=AUCPIfugOfXp4A-h1XQqnvwzQSLFRaLjTRO_iDirsYnY7mc950475TMJhmyQc9zcBFZ1bExNOQSK8b03ZKNGKIvqSQ8JOPhlt6A5t55-ETjTLNl5xgdGcVevZ_5QMGoGrwNeBzZLsWP41A) in the US, the [Digital Advertising Alliance of Canada](https://l.facebook.com/l.php?u=https%3A%2F%2Fyouradchoices.ca%2F&h=AUADYWEvBiiPohX98G9v7uyN3Wq7DBV0pki0oySrPkN-Oc5P1tc3VCrLfl3rOyBWn1jfWN_WWWcf3Y0JmEOZnetam1FZWbxEoTz0BjtUrPh9XxOxn3WbeCRbVafDDQKn0KR_NpBLyouGJw) in Canada or the [European Interactive Digital Advertising Alliance](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youronlinechoices.com%2F&h=AUD1OYaH1U1x_xcnhBZaPt9-rKO-jgP1M9LfRTYjDzQM4-VZY7JSuYNokUWfz3GZrFHjzcSO5dLC-q9o04IgxSQMiiaBXr4eNvrQVfhPSPyKfeRter89GJal2BSfJs1V0PtKBwavybPROA) in Europe, or through your mobile device settings, if you are using Android, iOS 13 or an earlier version of iOS. Please note that ad blockers and tools that restrict our cookie use may interfere with these controls.

Controlling cookies with browser settings

Your browser or device may offer settings that allow you to choose whether browser cookies are set and to delete them. These controls vary by browser, and manufacturers may change both the settings they make available and how they work at any time. As of 5 October 2020, you may find additional information about the controls offered by popular browsers at the links below. Certain parts of Meta Products may not work properly if you have disabled browser cookies. Please be aware that these controls are distinct from the controls that Facebook offers.

- [Google Chrome](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fchrome%2Fanswer%2F95647&h=AUAk9pSDFYT9LLPpE2Xlreu2PprxMATFljGeY7WpTCghppJBq7UMCx30IslhGCGPL7j6QSovkNuB1jvAgkui_l-kLZ9VkzXfvi1-6fN8HgwSCysV3WLwouLJ2VGIqwEaZCGAKk29-7oXmA)
- [Internet Explorer](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.microsoft.com%2Fen-ie%2Fhelp%2F17442%2Fwindows-internet-explorer-delete-manage-cookies&h=AUDxjLi6uW0pEsLN-G8uhv_xsGKS-UtbWPcKfKIvx1gsesLlv2AZoSN1PxaS3pIv7EFjk9DeeyzGRsIK7jkhaJUnHiU0W3Nyjb0YzfyN-N77cfqb8iP8Yi8KgBKFkHhxon2kFiA3c6sz-w)
- [Firefox](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.mozilla.org%2Fen-US%2Fkb%2Fenable-and-disable-cookies-website-preferences&h=AUDzvp8bY2hi2nq0HPh9R75Rb7elGT6Vmpo8OptQBSRJX8U_1fC3v-6Cb3ukv0-cNSfv4nxP5hV2i31XNERAdGtaAt539xFKIhXGUew6L2dYoZFTvrjuc-Gugl2fM--jMCrmUWNrV7IePA)
- [Safari](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-ie%2Fguide%2Fsafari%2Fsfri11471%2Fmac&h=AUDYIcChlxw4thS98-YHcHRFxuW3DhpyYSyfhzb60K6OH9LSS76pwJZNBSITckIPARl75a9mqP6mIrpTWbwihGEB_6k5nna7zAD-9s-K4_CS2N-xINXESqa3iNjGg2102GtZs-fbTVqNWw)
- [Safari Mobile](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.apple.com%2Fen-us%2FHT201265&h=AUC_d4pIVlabYNkGHhJARWOYDVWdF1xA6wmodFT6SOrYVuBZm7scr_AG7fd2MmAlAzFHV3X18Cvs-lG1-VXX6cnx-4s_OOCAPpU9vUEjfsS2l4_i8tY3HdQ6IU3rRhXRJmwkJU36jMA_sA)
- [Opera](https://l.facebook.com/l.php?u=https%3A%2F%2Fblogs.opera.com%2Fnews%2F2015%2F08%2Fhow-to-manage-cookies-in-opera%2F&h=AUBJoRyrwZffju7gzAjxqNPZFc7nqKYBzODsXQVFodnU0VJuFuzTc1tl_K_EIMboPzzo442fhybWiTAZmjqoSIV-8eD3KcdlEzPvjT3nWrcAuL2mzQwm8_Gtx-BxfXtrVC50jQh2tpEdvg)

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