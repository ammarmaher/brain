---
url: https://developers.facebook.com/docs/ios/getting-started
title: Get Started - Facebook SDK for iOS
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fios%2Fgetting-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Getting Started with the Facebook SDK for iOS](https://developers.facebook.com/docs/ios/getting-started#getting-started-with-the-facebook-sdk-for-ios)

[Before You Start](https://developers.facebook.com/docs/ios/getting-started#before-you-start)

[Step 1: Set Up Your Development Environment](https://developers.facebook.com/docs/ios/getting-started#step-1--set-up-your-development-environment)

[Step 2: Configure Your Project](https://developers.facebook.com/docs/ios/getting-started#configure-your-project)

[Step 3: Connect the App Delegate](https://developers.facebook.com/docs/ios/getting-started#step-3--connect-the-app-delegate)

[Step 4: Build and Then Run Your Project in the Simulator](https://developers.facebook.com/docs/ios/getting-started#step-4--build-and-then-run-your-project-in-the-simulator)

[Step 5: See the Results in Events Manager](https://developers.facebook.com/docs/ios/getting-started#step-5--see-the-results-in-events-manager)

[Next Steps](https://developers.facebook.com/docs/ios/getting-started#next-steps)

# Getting Started with the Facebook SDK for iOS

This guide shows you how to integrate your iOS app with Facebook using the Facebook SDK for iOS.

The Facebook SDK enables:

- [Facebook Login](https://developers.facebook.com/docs/facebook-login/ios) \- Authenticate people with their Facebook credentials.
- [Share and Send dialogs](https://developers.facebook.com/docs/ios/sharing) \- Enable sharing content from your app to Facebook.
- [App Events](https://developers.facebook.com/docs/app-events/getting-started-app-events-ios) \- Log events in your application.
- [Graph API](https://developers.facebook.com/docs/graph-api) \- Read and write to Graph API.

## Before You Start

You will need:

- A [Meta Developer account](https://developers.facebook.com/docs/development/register)
- A [Meta App ID](https://developers.facebook.com/docs/development/create-an-app)
- A [Client Token](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/advanced-settings#client-token)
- A project with **UIKit App Delegate** selected for **Life Cycle**

## Step 1: Set Up Your Development Environment

1. In Xcode, click **File > Swift Packages > Add Package Dependency**.

2. In the dialog that appears, enter the repository URL: [https://github.com/facebook/facebook-ios-sdk](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-ios-sdk&h=AUDdeSUVZ5LoQAaU6Sh19NQQbMhyUqIxNiY-kz7gljlzw2wm5AYCtR2AvkndQuLrjC2Ksj9hRCl7YDIo9OasAuFKq1xx83UXPFZZX7bkNrJBfBNM6oUxmN1tumR6VrJKqXGlkX9PxGW2bA).


![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2176728382628688&version=1775836791)
3. In **Version**, select **Up to Next Major** and the default option.
    ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2782675755084172&version=1775836791)
4. Complete the prompts to select the libraries you want to use in your project.

| If You Want To | Add This Package to your project |
| --- | --- |
| Allow your app to use the Facebook services | `FBSDKCoreKit` |
| Allow users to log into your app and for your app to ask for permissions to access data | `FBSDKLoginKit` |
| Allow your app to share content on Facebook | `FBSDKShareKit` |
| Allow users to log into your app to enable engagement and promote social features | `FBSDKGamingServicesKit` |

## Step 2: Configure Your Project

Configure the `Info.plist` file with an XML snippet that contains data about your app.

After you integrate Facebook Login, certain App Events are automatically logged and collected for [Events Manager](https://www.facebook.com/events_manager), unless you disable Automatic App Event Logging. In particular, when launching an app in Korea, please note that Automatic App Event Logging can be disabled. For details about what information is collected and how to disable automatic app event logging, see [Automatic App Event Logging](https://developers.facebook.com/docs/app-events/automatic-event-collection-detail).

1. Right-click `Info.plist`, and choose **Open As ▸ Source Code**.

2. Copy and paste the following XML snippet into the body of your file ( `<dict>...</dict>`).


```code
<key>CFBundleURLTypes</key>
<array>
     <dict>
     <key>CFBundleURLSchemes</key>
     <array>
       <string>fbAPP-ID</string>
     </array>
     </dict>
</array>
<key>FacebookAppID</key>
<string>APP-ID</string>
<key>FacebookClientToken</key>
<string>CLIENT-TOKEN</string>
<key>FacebookDisplayName</key>
<string>APP-NAME</string>
```

3. In `<array><string>` in the key `[CFBundleURLSchemes]`, replace _APP-ID_ with your App ID.
4. In `<string>` in the key `FacebookAppID`, replace _APP-ID_ with your App ID.
5. In `<string>` in the key `FacebookClientToken`, replace _CLIENT-TOKEN_ with the value found under **Settings** \> **Advanced** \> **Client Token** in your App Dashboard.
6. In `<string>` in the key `FacebookDisplayName`, replace _APP-NAME_ with the name of your app.
7. To use any of the Facebook dialogs (e.g., Login, Share, App Invites, etc.) that can perform an app switch to Facebook apps, your application's `Info.plist` also needs to include the following:



```code
<key>LSApplicationQueriesSchemes</key>
<array>
     <string>fbapi</string>
     <string>fb-messenger-share-api</string>
</array>
```


You may directly set the automatic collection of App Events to “true” or “false” by adding `FacebookAutoLogAppEventsEnabled` as a key in `Info.plist`.

Your project will need to include the Keychain Sharing capability in order for login to work in Mac Catalyst applications.

1. Select the **\+ Capability** button in the **Signing & Capabilities** tab when configuring your app target.

    ![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/278742602_667239674363001_1951911614515101302_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=bEvMxxtvHREQ7kNvwEb0zeJ&_nc_oc=Adp3vjB9Fn4Oe-ftiJPDXmxhMKBBsi_PW1vBtaf6sxfUp4OEAMwpEXd3_Lwo1hRIJ5M&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=jDzpLEMLfXtms8FP-xsDMQ&_nc_ss=7b289&oh=00_Af5PTad_eSKd81bUC4qFp6aybG55MaWHW5uZVE5sF6E0Nw&oe=6A258897)
2. Find and select the **Keychain Sharing** capability.

    ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/278977484_316218193957481_4146090580916671096_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=4eRTqtc2kLYQ7kNvwHAWAOs&_nc_oc=AdqQiA0Vq8C_LSbNvmFm-hoC-48k2p--P1Z9GFJVex4oqjRrBaUkRE4N5-r5nRFkRM4&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=jDzpLEMLfXtms8FP-xsDMQ&_nc_ss=7b289&oh=00_Af4Zgq9fuiE8Ms4SHRhcGnpfyrPchEgdUDgJ773sHm2_sg&oe=6A258C1D)
3. Ensure that the **Keychain Sharing** capability is listed for the target.

    ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/278896933_1610746765962570_3644799075929561990_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=rawwfdrI8zYQ7kNvwGvyFsM&_nc_oc=Adoo5cm8gw2jqwgIpo_Ea5BtiOQXUTVtjElxL0jg6cV25cxLveWaJ3GEZ9DKKZnkvQA&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=jDzpLEMLfXtms8FP-xsDMQ&_nc_ss=7b289&oh=00_Af6zNaRYCf-nGB621t9uG1blTTgCkQC0keyMf82m2KXIVg&oe=6A2578F6)

## Step 3: Connect the App Delegate

Replace the code in `AppDelegate.swift` method with the following code. This code initializes the SDK when your app launches, and allows the SDK to handle logins and sharing from the native Facebook app when you perform a Login or Share action. Otherwise, the user must be logged into Facebook to use the in-app browser to login.

```code

// AppDelegate.swift
import UIKit
import FBSDKCoreKit

@UIApplicationMain
class AppDelegate: UIResponder, UIApplicationDelegate {
    func application(
        _ application: UIApplication,
        didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
    ) -> Bool {
        ApplicationDelegate.shared.application(
            application,
            didFinishLaunchingWithOptions: launchOptions
        )

        return true
    }

    func application(
        _ app: UIApplication,
        open url: URL,
        options: [UIApplication.OpenURLOptionsKey : Any] = [:]
    ) -> Bool {
        ApplicationDelegate.shared.application(
            app,
            open: url,
            sourceApplication: options[UIApplication.OpenURLOptionsKey.sourceApplication] as? String,
            annotation: options[UIApplication.OpenURLOptionsKey.annotation]
        )
    }
}
```

iOS 13 moved opening URL functionality to the `SceneDelegate`. If you are using iOS 13, add the following method to your `SceneDelegate` so that operations like logging in or sharing function as intended:

```code

// SceneDelegate.swift
import FBSDKCoreKit
  ...
func scene(_ scene: UIScene, openURLContexts URLContexts: Set<UIOpenURLContext>) {
    guard let url = URLContexts.first?.url else {
        return
    }

    ApplicationDelegate.shared.application(
        UIApplication.shared,
        open: url,
        sourceApplication: nil,
        annotation: [UIApplication.OpenURLOptionsKey.annotation]
    )
}
```

## Step 4: Build and Then Run Your Project in the Simulator

In Xcode, select an iOS simulator and click **Run**. Xcode builds your project and then launches the most recent version of your app running in Simulator.

## Step 5: See the Results in Events Manager

The [Events Manager](https://www.facebook.com/events_manager2/) displays the events you send to Facebook. If this is the first time you launched your app with this code, you may have to wait at least 20 minutes before your events appear.

**Note:** Events may take up to 20 minutes to appear in the dashboard.

## Next Steps

To learn how to implement App Events and other Facebook products to your app, click one of the buttons below.

[Sharing in iOS](https://developers.facebook.com/docs/ios/share) [Add Facebook Login](https://developers.facebook.com/docs/facebook-login/ios) [Add App Events](https://developers.facebook.com/docs/ios/app-events/) [Use Graph API](https://developers.facebook.com/docs/ios/graph)

* * *

[Advanced Configuration](https://developers.facebook.com/docs/ios/getting-started/advanced)

On This Page

[Getting Started with the Facebook SDK for iOS](https://developers.facebook.com/docs/ios/getting-started#getting-started-with-the-facebook-sdk-for-ios)

[Before You Start](https://developers.facebook.com/docs/ios/getting-started#before-you-start)

[Step 1: Set Up Your Development Environment](https://developers.facebook.com/docs/ios/getting-started#step-1--set-up-your-development-environment)

[Step 2: Configure Your Project](https://developers.facebook.com/docs/ios/getting-started#configure-your-project)

[Step 3: Connect the App Delegate](https://developers.facebook.com/docs/ios/getting-started#step-3--connect-the-app-delegate)

[Step 4: Build and Then Run Your Project in the Simulator](https://developers.facebook.com/docs/ios/getting-started#step-4--build-and-then-run-your-project-in-the-simulator)

[Step 5: See the Results in Events Manager](https://developers.facebook.com/docs/ios/getting-started#step-5--see-the-results-in-events-manager)

[Next Steps](https://developers.facebook.com/docs/ios/getting-started#next-steps)