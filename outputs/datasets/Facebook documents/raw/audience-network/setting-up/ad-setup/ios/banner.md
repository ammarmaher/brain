---
url: https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner
title: Banner Ads - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fios%2Fbanner%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Add Banner and Medium Rectangle Ads to an iOS App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#add-banner-and-medium-rectangle-ads-to-an-ios-app)

[Banner and Medium Rectangle Ad Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#banner-and-medium-rectangle-ad-steps)

[Step 1: Load and Show The Ad View](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#load)

[Step 2: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#logging)

[Step 3: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#debug)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#see-also)

# Add Banner and Medium Rectangle Ads to an iOS App

The Audience Network allows you to monetize your iOS apps with Facebook ads. This guide explains how to create an iOS app that shows banner and medium rectangle ads.

[How do I choose Medium Rectangle?](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#faq_565178374868141)

You can change placements in Monetization Manager to the Medium Rectangle format if these were previously configured as Banner for bidding. Similarly, for any new medium rectangle placements, navigate to the [placement settings page](https://business.facebook.com/pub/property/adspace/placement/settings) in Monetization Manager and select **Medium Rectangle** (not Banner).

Placements will deliver as normal even if they are not changed to the medium rectangle format. However, to avoid confusion, we recommend that you change these placements to medium rectangle.

[Permalink](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#faq_565178374868141)

If you're interested in other kinds of ad units, see the [list of available types](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup).

## Banner and Medium Rectangle Ad Steps

Let's implement the following banner ad placement.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/28228222_263951407477245_4248197279694979072_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=7wbgTX3rvTcQ7kNvwHPyEii&_nc_oc=AdqXmCz_wmbjUG3eYe32r-qY--ZiyHHBTiThAoiYNd7FKDXglJwL3-9s4zy4XniwDxs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=QJ0YBRRcW5nRwIYBpaKYcg&_nc_ss=7b289&oh=00_Af5Wjy_Pu2SWf3oOOKlVdfHGetRt5xfMA1MfozyEBLvurQ&oe=6A258D81)

#### [Step 1: Load and Show The Ad View](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner\#load)

#### [Step 2: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner\#logging)

#### [Step 3: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner\#debug)

#### [Step 4: Test Ads Integration](https://developers.facebook.com/docs/audience-network/testing)

## Step 1: Load and Show The Ad View

Ensure you have completed the [iOS Setup Guides](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/ios) guide before you proceed.

When designing native ads and banner ads, ensure you have followed [iOS layout guideline](https://developers.facebook.com/docs/audience-network/ios-layout-guideline) for optimal user experience.

1.
    After you have created a new project from [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guides, open Main.storyboard. Add a UIView element to the main View element and name it to `adContainer`.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/35912648_478790965885692_8684226329786187776_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=RhR9Ae7m-7YQ7kNvwH2M7xw&_nc_oc=AdoO9o6ECgUvHRC6Kcut63WVJxbD7VUbw2bkQq0QwuKFoSrezTgPZXZAzcSL_Cv3sKs&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=QJ0YBRRcW5nRwIYBpaKYcg&_nc_ss=7b289&oh=00_Af6ltZw02EaHgKUQ7ZlDCybgo_MT5nwmNg-SjFXxBAB_hw&oe=6A2588C7)
2.
    Now, in your View Controller header file (or Swift file, if you are a Swift user), import `FBAudienceNetwork`, declare conformance to the `FBAdViewDelegate` protocol, and add an instance variable for the ad unit



SwiftObjective-C





```swift
import UIKit
import FBAudienceNetwork

class ViewController: UIViewController, FBAdViewDelegate {

     @IBOutlet private var adContainer: UIView!

     private var adView: FBAdView?
}
```















```m
#import <UIKit/UIKit.h>
@import FBAudienceNetwork;

@interface ViewController : UIViewController <FBAdViewDelegate>

@property (nonatomic, weak) IBOutlet UIView *adContainer;
@property (nonatomic, strong) FBAdView *adView;

@end
```


4. Add the code below to `viewDidLoad`; Create a new instance of `FBAdView` and add it to the view. `FBAdView` is a subclass of `UIView`. You can add it to your view hierarchy just like any other view.




SwiftObjective-C





```swift
override func viewDidLoad() {
     super.viewDidLoad()

     // Instantiate an AdView object.
     // NOTE: the placement ID will eventually identify this as your app, you can ignore while you
     // are testing and replace it later when you have signed up.
     // While you are using this temporary code you will only get test ads and if you release
     // your code like this to the App Store your users will not receive ads (you will get a 'No Fill' error).
     let adView = FBAdView(placementID: "YOUR_PLACEMENT_ID", adSize: kFBAdSizeHeight50Banner, rootViewController: self)
     adView.frame = CGRect(x: 0, y: 0, width: 320, height: 250)
     adView.delegate = self
     adView.loadAd()
     self.adView = adView
}
```















```m
- (void)viewDidLoad
{
[super viewDidLoad];
// Instantiate an AdView object.
// NOTE: the placement ID will eventually identify this as your App, you can ignore it for
// now, while you are testing and replace it later when you have signed up.
// While you are using this temporary code you will only get test ads and if you release
// your code like this to the App Store your users will not receive ads (you will get a no fill error).
self.adView = [[FBAdView alloc] initWithPlacementID:@"YOUR_PLACEMENT_ID" adSize:kFBAdSizeHeight50Banner rootViewController:self];
self.adView.frame = CGRectMake(0, 0, 320, 250);
self.adView.delegate = self;
[self.adView loadAd];
}
```

To add a Medium Rectangle ad instead, you just need to provide `kFBAdSizeHeight250Rectangle` in the adSize parameter to `FBAdView`.



Audience Network supports three ad sizes to be used in your `FBAdView`. A unit's width is flexible with a minimum of 320px, and only the height is defined.

| Ad Format | AdSize Reference | Size | Recommendation |
| --- | --- | --- | --- |
| Medium Rectangle | `kFBAdSizeHeight<br>250Rectangle` | 300x250 | This format is highly recommended because it provides higher performance, higher quality, and more CPU efficient |
| Standard Banner | `kFBAdSizeHeight<br>50Banner` | 320x50 | This format is suited to phones but not recommended because of poor performance and quality |
| Large Banner | `kFBAdSizeHeight<br>90Banner` | 320x90 | This format is suited to tablets and larger devices but not recommended because of poor performance and quality |

5. Replace `YOUR_PLACEMENT_ID` with your own placement id string. If you don't have a placement id or don't know how to get one, refer to the [Getting Started Guide](https://developers.facebook.com/docs/audience-network/getting-started#placement_ids).


    Choose your build target to be device and run the above code, you should see something like this:



![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/28126735_393542491108304_7265990646467395584_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=IUd8_HiKc3YQ7kNvwFn5ctV&_nc_oc=Adq98_wu-LcoznjDN3LAmHE-1v9pYTQ8IytVwlbdutMQWfkfnSqHO-zfvjuGfiE4Zl0&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=QJ0YBRRcW5nRwIYBpaKYcg&_nc_ss=7b289&oh=00_Af5Y76hF65UO3ESuUHry9488BAvvKSuv_cSQm57EScdI4Q&oe=6A256FB1)


When running ads in the simulator, change the setting to test mode to view test ads. Please go to [How to Use Test Mode](https://developers.facebook.com/docs/audience-network/testing#testing-testAd) for more information.

## Step 2: Verify Impression and Click Logging

Optionally, you can add the following functions to handle the cases where the ad is closed or when the user clicks on it:

SwiftObjective-C

```swift
func adViewDidClick(_ adView: FBAdView) {
  print("Ad was clicked.")
}

func adViewDidFinishHandlingClick(_ adView: FBAdView) {
  print("Ad did finish click handling.")
}

func adViewWillLogImpression(_ adView: FBAdView) {
  print("Ad impression is being captured.")
}
```

```m
- (void)adViewDidClick:(FBAdView *)adView
{
  NSLog(@"Ad was clicked.");
}

- (void)adViewDidFinishHandlingClick:(FBAdView *)adView
{
  NSLog(@"Ad did finish click handling.");
}

- (void)adViewWillLogImpression:(FBAdView *)adView
{
  NSLog(@"Ad impression is being captured.");
}
```

## Step 3: How to Debug When Ad Not Shown

Add and implement the following two delegate functions in your View Controller to handle ad loading failures:

SwiftObjective-C

```swift
func adView(_ adView: FBAdView, didFailWithError error: Error) {
  print("Ad failed to load with error: \(error.localizedDescription)")
}

func adViewDidLoad(_ adView: FBAdView) {
  print("Ad was loaded and ready to be displayed")
  showAd()
}

private func showAd() {
  guard let adView = adView, adView.isAdValid else {
    return
  }
  adContainer.addSubview(adView)
}
```

```m
- (void)adView:(FBAdView *)adView didFailWithError:(NSError *)error
{
  NSLog(@"Ad failed to load with error: %@", error);
}

- (void)adViewDidLoad:(FBAdView *)adView
{
  NSLog(@"Ad was loaded and ready to be displayed");
  [self showAd];
}

- (void)showAd
{
  if (self.adView && self.adView.isAdValid) {
    [self.adContainer addSubview:self.adView];
  }
}
```

When there is no ad to show, the `adView:didFailWithError:` will be called with `error.code` set to `1001`. If you use your own custom reporting or mediation layer, you may want to check the code value and detect this case. You can fallback to another ad network in this case, but do not re-request an ad immediately after.

## Next steps

Learn more about the [ad formats](https://developers.facebook.com/docs/audience-network/ad-formats/) available for Audience Network apps.

### See also

- Visit [our GitHub sample app repository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fios&h=AUCwA5CycF1D4JR9z0WFq32SfpSvy_BM7dTk-S8cnMpyQ-8MIwitn1aomENzFRaMQm76hMH_1gwcP2nJ5QQfVTiaxDjmZKlOrzcpk5MNzFAAUfcb7ZAn7Dub0FXUpXZJ6IxwfsYIHBgE4g) to view sample code.
- View the [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards) to ensure you app complies.

On This Page

[Add Banner and Medium Rectangle Ads to an iOS App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#add-banner-and-medium-rectangle-ads-to-an-ios-app)

[Banner and Medium Rectangle Ad Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#banner-and-medium-rectangle-ad-steps)

[Step 1: Load and Show The Ad View](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#load)

[Step 2: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#logging)

[Step 3: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#debug)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/banner#see-also)