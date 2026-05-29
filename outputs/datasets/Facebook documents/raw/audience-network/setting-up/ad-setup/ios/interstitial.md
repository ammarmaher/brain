---
url: https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial
title: Interstitial Ads - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fios%2Finterstitial%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)


  - [Android](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android)
  - [iOS](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios)


    - [Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner)
    - [Interstitial Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial)
    - [Native Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native)
    - [Native Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner)
    - [Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video)
    - [Rewarded Interstitial Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/rewarded-interstitial)

  - [Unity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/unity)

- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)
- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Add Interstitial Ads to an iOS App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#add-interstitial-ads-to-an-ios-app)

[Step 1: Load and Show Interstitial Ad View](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#load)

[Step 2: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#logging)

[Step 3: Debugging When Ad Is Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#debug)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#see-also)

# Add Interstitial Ads to an iOS App

The Audience Network allows you to monetize your iOS apps with Facebook ads. An interstitial ad is a full screen ad that you can show in your app. Follow this guide to display this type of ad unit. Or, if you're interested in other kinds of ad units, see a [list of available types](https://developers.facebook.com/docs/audience-network/ad-examples).

Let's implement the following interstitial ad placement.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/15186322_1150921328318322_7119415331189161984_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=Ise0JZrO7FoQ7kNvwEah7OS&_nc_oc=AdphNDYCVk9pwbmdgODX2r5syof0L7RFutUfq1OA5qOvIcJDP7hRnOK_xjx0Xqu2XLA&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ERlgjbWFTo8Sh6-evqZH3w&_nc_ss=7b289&oh=00_Af5H1201wYFmCT7UE7JoTrDQZkvstN0m2e7uZ1ClmtnjBg&oe=6A25A008)

#### [Step 1: Load and Show Interstitial Ad View](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial\#load)

#### [Step 2: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial\#logging)

#### [Step 3: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial\#debug)

#### [Step 4: Test Ads Integration](https://developers.facebook.com/docs/audience-network/testing)

## Step 1: Load and Show Interstitial Ad View

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guides before you proceed.

1. After you have created a new project from [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guide, import `FBAudienceNetwork`, declare that `ViewController` implements the `FBInterstitialAdDelegate` protocol, and add an instance variable for the interstitial ad unit



SwiftObjective-C





```swift
import UIKit
import FBAudienceNetwork

class ViewController: UIViewController, FBInterstitialAdDelegate {
     private var interstitialAd: FBInterstitialAd?
}
```















```m
#import <UIKit/UIKit.h>
@import FBAudienceNetwork;

@interface ViewController : UIViewController <FBInterstitialAdDelegate>
@property (nonatomic, strong) FBInterstitialAd *interstitialAd;
@end
```


3.
Next, instantiate the ad object in the view controller's `viewDidLoad` method, and implement `interstitialAdDidLoad`


SwiftObjective-C





```swift
override func viewDidLoad() {
     super.viewDidLoad()

     // Instantiate an InterstitialAd object.
     // NOTE: the placement ID will eventually identify this as your app. You can ignore it while you are testing
     // and replace it later when you have signed up.
     // While you are using this temporary code you will only get test ads and if you release
     // your code like this to the App Store your users will not receive ads (you will get a 'No Fill' error).
     let interstitialAd = FBInterstitialAd(placementID: "YOUR_PLACEMENT_ID")
     interstitialAd.delegate = self

     // For auto play video ads, it's recommended to load the ad at least 30 seconds before it is shown
     interstitialAd.load()

     self.interstitialAd = interstitialAd
}

func interstitialAdDidLoad(_ interstitialAd: FBInterstitialAd) {
     guard interstitialAd.isAdValid else {
       return
     }
     print("Ad is loaded and ready to be displayed")
     interstitialAd.show(fromRootViewController: self)
}
```















```m
- (void)viewDidLoad
{
[super viewDidLoad];

// Instantiate an InterstitialAd object.
// NOTE: the placement ID will eventually identify this as your app. You can ignore it while you are testing
// and replace it later when you have signed up.
// While you are using this temporary code you will only get test ads and if you release
// your code like this to the App Store your users will not receive ads (you will get a 'No Fill' error).
self.interstitialAd = [[FBInterstitialAd alloc] initWithPlacementID:@"YOUR_PLACEMENT_ID"];

self.interstitialAd.delegate = self;

// For auto play video ads, it's recommended to load the ad at least 30 seconds before it is shown
[self.interstitialAd loadAd];
}

- (void)interstitialAdDidLoad:(FBInterstitialAd *)interstitialAd
{
NSLog(@"Ad is loaded and ready to be displayed");

if (interstitialAd && interstitialAd.isAdValid) {
    // You can now display the full screen ad using this code:
    [interstitialAd showAdFromRootViewController:self];
}
}
```

4. The ID that displays at `YOUR_PLACEMENT_ID` is a temporary ID for test purposes only.

If you use this temporary ID in your live code, your users will not receive ads (they will get a **No Fill** error). You must return here after testing and replace this temporary ID with a live Placement ID.

To find out how the generate a live Placement ID, refer to [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup)


Choose your build target to be device and run the above code, you should see something like this:



![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/15186322_1150921328318322_7119415331189161984_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=Ise0JZrO7FoQ7kNvwEah7OS&_nc_oc=AdphNDYCVk9pwbmdgODX2r5syof0L7RFutUfq1OA5qOvIcJDP7hRnOK_xjx0Xqu2XLA&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ERlgjbWFTo8Sh6-evqZH3w&_nc_ss=7b289&oh=00_Af5H1201wYFmCT7UE7JoTrDQZkvstN0m2e7uZ1ClmtnjBg&oe=6A25A008)

When running ads in the simulator, change the setting to test mode to view test ads. Please go to [How to Use Test Mode](https://developers.facebook.com/docs/audience-network/testing#testing-testAd) for more information.

Do not call `loadAd` on the FBInterstitialAd while the ad is being shown on the screen. If you need to load another FBInterstitialAd for future use, you can do so after the user closed the current one, for example in the `interstitialAdDidClose` callback.

## Step 2: Verify Impression and Click Logging

Optionally, you can add the following functions to handle the cases when the ad is shown, clicked or closed by users

SwiftObjective-C

```swift
func interstitialAdWillLogImpression(_ interstitialAd: FBInterstitialAd) {
  print("The user sees the ad")
  // Use this function as indication for a user's impression on the ad.
}

func interstitialAdDidClick(_ interstitialAd: FBInterstitialAd) {
  print("The user clicked on the ad and will be taken to its destination")
  // Use this function as indication for a user's click on the ad.
}

func interstitialAdWillClose(_ interstitialAd: FBInterstitialAd) {
  print("The user clicked on the close button, the ad is just about to close")
  // Consider to add code here to resume your app's flow
}

func interstitialAdDidClose(_ interstitialAd: FBInterstitialAd) {
  print("The user clicked on the close button, the ad is just about to close")
  // Consider to add code here to resume your app's flow
}
```

```m
- (void)interstitialAdWillLogImpression:(FBInterstitialAd *)interstitialAd
{
  NSLog(@"The user sees the ad");
  // Use this function as indication for a user's impression on the ad.
}

- (void)interstitialAdDidClick:(FBInterstitialAd *)interstitialAd
{
  NSLog(@"The user clicked on the ad and will be taken to its destination");
  // Use this function as indication for a user's click on the ad.
}

- (void)interstitialAdWillClose:(FBInterstitialAd *)interstitialAd
{
  NSLog(@"The user clicked on the close button, the ad is just about to close");
  // Consider to add code here to resume your app's flow
}

- (void)interstitialAdDidClose:(FBInterstitialAd *)interstitialAd
{
  NSLog(@"Interstitial had been closed");
  // Consider to add code here to resume your app's flow
}
```

## Step 3: Debugging When Ad Is Not Shown

Add and implement the following function in your View Controller implementation file to handle ad loading failures

SwiftObjective-C

```swift
func interstitialAd(_ interstitialAd: FBInterstitialAd, didFailWithError error: Error) {
  print("Interstitial ad failed to load with error: \(error.localizedDescription)")
}
```

```m
- (void)interstitialAd:(FBInterstitialAd *)interstitialAd didFailWithError:(NSError *)error
{
  NSLog(@"Interstitial ad failed to load with error: %@", error);
}
```

When there is no ad to show, the `interstitialAd:didFailWithError:` will be called with `error.code` set to `1001`. If you use your own custom reporting or mediation layer you might want to check the code value and detect this case. You can fallback to another ad network in this case, but do not re-request an ad immediately after.

## Next steps

Learn more about the [ad formats](https://developers.facebook.com/docs/audience-network/ad-formats/) available for Audience Network apps.

### See also

- Visit [our GitHub sample app repository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fios&h=AUB4AtWsoFFcozD9krDSUL39Mc8Qc1wNHGAb6MFIiuzWrw0vAJSJla-q_zE7Zg9oVqusCYRZ-qjwm8N1foAhvN6avNr8tNEwWbEPLzhSItgyPgicEO0_T-uxUdZoRHX4CJzV8WMaYPJMzg) to view sample code.
- View the [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards) to ensure you app complies.

On This Page

[Add Interstitial Ads to an iOS App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#add-interstitial-ads-to-an-ios-app)

[Step 1: Load and Show Interstitial Ad View](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#load)

[Step 2: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#logging)

[Step 3: Debugging When Ad Is Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#debug)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/interstitial#see-also)