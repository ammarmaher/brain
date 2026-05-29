---
url: https://developers.facebook.com/docs/ios/
title: Facebook SDK for iOS
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fios%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook SDK for iOS](https://developers.facebook.com/docs/ios)

- [Component SDKs](https://developers.facebook.com/docs/ios/componentsdks)
- [Get Started](https://developers.facebook.com/docs/ios/getting-started)
- [Use Facebook Login](https://developers.facebook.com/docs/ios/use-facebook-login)
- [Get User Data](https://developers.facebook.com/docs/ios/get-user-data)
- [Share Photo](https://developers.facebook.com/docs/ios/share-photos)
- [Share Sample](https://developers.facebook.com/docs/ios/facebook-share-sample)
- [Sharing to Reels (Facebook)](https://developers.facebook.com/docs/ios/sharing-to-reels-facebook)
- [Sharing to Reels (Instagram)](https://developers.facebook.com/docs/ios/sharing-to-reels-instagram)
- [Advanced Topics](https://developers.facebook.com/docs/ios/advanced)
- [Create a Simulator Build](https://developers.facebook.com/docs/ios/create-a-simulator-build)
- [Calling the Graph API](https://developers.facebook.com/docs/ios/graph)
- [Error Handling](https://developers.facebook.com/docs/ios/errors)
- [Upgrade Guide](https://developers.facebook.com/docs/ios/upgrade-guide)
- [FAQ & Troubleshooting](https://developers.facebook.com/docs/ios/troubleshooting)
- [Reference](https://developers.facebook.com/docs/ios/reference_obj-c)

On This Page

[Facebook SDK for iOS](https://developers.facebook.com/docs/ios/#facebook-sdk-for-ios)

[Update Facebook and Audience Network SDK for iOS with Privacy Manifest for App Store Review Requirements](https://developers.facebook.com/docs/ios/#update-facebook-and-audience-network-sdk-for-ios-with-privacy-manifest-for-app-store-review-requirements)

[App Store Connect Requirements](https://developers.facebook.com/docs/ios/#app-store-connect-requirements)

[Documentation Contents](https://developers.facebook.com/docs/ios/#documentation-contents)

[See Also](https://developers.facebook.com/docs/ios/#see-also)

# Facebook SDK for iOS

## Update Facebook and Audience Network SDK for iOS with Privacy Manifest for App Store Review Requirements

Meta will provide [Privacy Manifests](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fbundleresources%2Fprivacy_manifest_files&h=AUADwDE3wJq1xC9tXLi4sMndDnkE7WIBrUaUq1yOFwFwwBMY7_wXndUMr215sMxiYByVdRocyUGy75PWzTUePVvxh38Xe6t48-5gnPcmGBBXmbhu1zjh58HNKoRxam0NSiD5yqj9HHDENX-bAVB8wVbmv94) for Facebook SDK for iOS and Audience Network SDK for iOS, starting with Privacy Manifests needed for advertising purposes.

- If you use Facebook SDK for iOS for advertising only, please update to the latest version.
- If you use the Audience Network SDK for iOS, please update to version 6.15.0. Refer more details [here](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/ios/add-sdk).
- If you use Facebook Login for iOS, please update to the latest version.
- If you use Facebook Sharing SDKs for iOS, please update to the latest version.
- If you use Facebook SDK for Unity on iOS, please update the Facebook SDK for Unity to the latest version.

Additional guidance for developers:

- Our Privacy Manifest only provides information collected by default and the SDKs that depend on the Core SDK for functionality may restate the data usage details of the Core SDK. Some app developers may choose to send us more or less information in code, or via the Events Manager or through Advanced matching functionality. These developers will need to provide details around additional data usage details in their Privacy Manifest or App Store Privacy Labels in accordance with their own practices. Refer to the following [article](https://developers.facebook.com/blog/post/2022/07/18/resources-for-completing-app-store-data-practice-questionnaires-apps-facebook-or-audience-network-sdk/) for more information on additional data that may be sent by developers through Meta’s SDKs.
- Note that we do not attempt to associate all collected data with Meta users.

- We have pre-populated the tracking domain field for the FBSDK in the Privacy Manifest to help ensure that our services continue to function properly. We do not advise manually adding domains. Listing “www.facebook.com” or subdomains of “facebook.com” in the tracking domain field of a Privacy Manifest may break functionality.


**Note**: Developers can find additional details around the tracking domain field in the Privacy Manifests for Meta SDKs. What is pre-populated in the tracking domain field is intended to receive traffic when a user has provided AppTrackingTransparency (ATT) permission to the app. If our check determines that a request or event from an iOS14.5+ device lacks ATT permission, then usage of such data will be restricted and we will use privacy preserving methods (like those available in [Aggregated Event Measurement](https://www.facebook.com/business/help/721422165168355?id=1877298665783613)) to remove or combine information before personalizing ads we show and measuring how they perform.

This documentation describes how to integrate your iOS app with Facebook to build engaging social apps by using the Facebook SDK for iOS. To learn more about using Facebook development tools, see [App Development](https://developers.facebook.com/docs/development).

The current version of the Facebook SDK for iOS is [available on GitHub](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-ios-sdk&h=AUBWVnM7cs3BuldeiW_M0HaJtKrW59_HJh9yRuuAq-1PMfidLErraszhWkMPZROBNjslxjulYkbkAPv1rkZ89YkriPln08cMbHOiMED6EkaO2QHsn_LyE7C1gFzm4-kFeShTUU-I6bgAog).

When you use the Facebook SDK for iOS, follow the Facebook Open Source [Terms of Use](https://opensource.facebook.com/legal/terms/) and [Privacy Policy](https://opensource.facebook.com/legal/privacy/).

Beginning with SDK v13.0 you must provide a [Client Token](https://developers.facebook.com/docs/ios/getting-started/#client-token) for all calls to the Graph API.

## App Store Connect Requirements

To provide functionality within the Facebook iOS SDK, we may receive and process certain contact, location, identifier, and device information associated with Facebook users and their use of your application. The information we receive depends on what SDK features third party applications use. Please visit the [Facebook for Developers blogpost](https://developers.facebook.com/blog/post/2020/10/22/preparing-for-apple-app-store-data-disclosure-requirements/) for more information about these SDK features.

## Documentation Contents

|     |     |
| --- | --- |
| #### [Component SDKs](https://developers.facebook.com/docs/ios/componentsdks)<br>Describes the component SDKs of the Facebook SDK for iOS. | #### [Get Started](https://developers.facebook.com/docs/ios/getting-started)<br>A short tutorial to get you up and running. |
| #### [Use Facebook Login](https://developers.facebook.com/docs/ios/use-facebook-login)<br>Enable users to to log into your iOS app with Facebook Login. | #### [Get Facebook User Data](https://developers.facebook.com/docs/ios/get-user-data)<br>Get Facebook user data in your iOS app if allowed by the user and your app permissions. |
| #### [Share a Photo](https://developers.facebook.com/docs/ios/share-photos)<br>Share a photo from your iOS app. | #### [Facebook Share Sample](https://developers.facebook.com/docs/ios/common-uses)<br>Source code and project files that you can build and run to learn how to share a photo or link to Facebook from your iOS app. |
| #### [Sharing to Reels](https://developers.facebook.com/docs/ios/sharing-to-reels)<br>Integrate sharing into your iOS app so that users can share video content to Facebook Reels. | #### [Advanced Topics](https://developers.facebook.com/docs/ios/advanced)<br>Create a simulator build of your app for the app review process. |
| #### [Create a Simulator Build](https://developers.facebook.com/docs/ios/create-a-simulator-build)<br>Create a simulator build of your app for the app review process. | #### [Calling the Graph API from iOS](https://developers.facebook.com/docs/ios/graph)<br>Learn how to call the Facebook Graph API from your iOS app. |
| #### [Error Handling](https://developers.facebook.com/docs/ios/errors)<br>Changelog and release notes for the Facebook SDK for iOS. | #### [Upgrade Guide](https://developers.facebook.com/docs/ios/upgrade-guide)<br>Instructions for upgrading your version of the Facebook SDK for iOS. |
| #### [FAQ & Troubleshooting](https://developers.facebook.com/docs/ios/troubleshooting)<br>Frequently asked questions and troubleshooting information for the Facebook SDK for iOS. | #### [Reference](https://developers.facebook.com/docs/ios/reference_obj-c)<br>Component and endpoint references. |

## See Also

- [Facebook SDK for Android](https://developers.facebook.com/docs/android)
- [Facebook Developer Documentation](https://developers.facebook.com/docs/)
- [Audience Network](https://developers.facebook.com/docs/audience-network)
- [Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner)
- [Interstitial Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial)
- [Add Native Ads to an iOS App](https://developers.facebook.com/docs/audience-network/ios/native-api)
- [Changelog](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-ios-sdk%2Fblob%2Fmaster%2FCHANGELOG.md&h=AUBr9kWxCCgKviDCFBOZsTv1POuu9_FCOTcwBzX_K5_5gsIRbAfyINoCjPnkpzfvw4zdwpq97UHXRCE5qHGBIYXpdvMMQ2uAwegdqY5KDOzHBfCVD9-JOleVcKcPjsSlkXxFDVN79jNUIA)

On This Page

[Facebook SDK for iOS](https://developers.facebook.com/docs/ios/#facebook-sdk-for-ios)

[Update Facebook and Audience Network SDK for iOS with Privacy Manifest for App Store Review Requirements](https://developers.facebook.com/docs/ios/#update-facebook-and-audience-network-sdk-for-ios-with-privacy-manifest-for-app-store-review-requirements)

[App Store Connect Requirements](https://developers.facebook.com/docs/ios/#app-store-connect-requirements)

[Documentation Contents](https://developers.facebook.com/docs/ios/#documentation-contents)

[See Also](https://developers.facebook.com/docs/ios/#see-also)