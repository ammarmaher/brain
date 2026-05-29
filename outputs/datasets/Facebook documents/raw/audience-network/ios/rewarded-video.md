---
url: https://developers.facebook.com/docs/audience-network/ios/rewarded-video
title: Rewarded Video Ads - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fguides%2Fsetting-up%2Fad-setup%2Fios%2Frewarded-video%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Add Rewarded Video Ads to an iOS App](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#add-rewarded-video-ads-to-an-ios-app)

[Implementation](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#implementation)

[Server Side Reward Validation](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#server-side-reward-validation)

[Overview](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#overview)

[SDK Implementation](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#sdk-implementation)

[Next steps](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#see-also)

# Add Rewarded Video Ads to an iOS App

Rewarded video ads are a full screen experience where users opt-in to view a video ad in exchange for something of value, such as virtual currency, in-app items, exclusive content, and more. The ad experience is 15-30 second non-skippable and contains an end card with a call to action. Upon completion of the full video, you will receive a callback to grant the suggested reward to the user.

Below are details on how to implement rewarded video ads from Audience Network on iOS.

Please note, Rewarded Video is only supported for iOS 9 and above.

# Set up the SDK

The Audience Network Rewarded Video format is now included in the public SDK. Rewarded video will be available for all gaming apps soon. If you don’t see Rewarded Video in Monetization Manager and you're on the latest SDK, [apply now](mailto:publisherhelp@fb.com?subject=Publisher%20Application%20for%20Rewarded%20Video%20&body=Please%20add%20the%20following%20information%20for%20your%20application:%0D%0A%0D%0AApp%20id%20-%20from%20your%20Account:%0D%0ALink%20Appstore:%0D%0ADescription%20of%20what%20will%20be%20provided%20after%20watching%20the%20rewarded%20video:%0D%0A%0D%0APlease%20note%20that%20we%27ll%20review%20your%20application%20within%20the%20next%20weeks%20and%20come%20back%20to%20you%20if%20successful.).

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guides before you proceed.

## Implementation

Now, in your View Controller header file (or Swift file, if you are a Swift user), import `FBAudienceNetwork`, declare conformance to the `FBRewardedVideoAdDelegate` protocol, and add an instance variable for the rewarded video ad unit

SwiftObjective-C

```swift
import UIKit
import FBAudienceNetwork

class ViewController: UIViewController, FBRewardedVideoAdDelegate {
  private var rewardedVideoAd: FBRewardedVideoAd?
}
```

```m
#import <UIKit/UIKit.h>
@import FBAudienceNetwork;

@interface ViewController : UIViewController <FBRewardedVideoAdDelegate>

@property (nonatomic, strong) FBRewardedVideoAd *rewardedVideoAd;

@end
```

Add a function in your View Controller that initializes the rewarded video object and caches the video creative ahead of the time you want to show it

SwiftObjective-C

```swift
override func viewDidLoad() {
  super.viewDidLoad()

  // Instantiate an rewarded video object.
  // NOTE: the placement ID will eventually identify this as your app. You can ignore it while you are testing
  // and replace it later when you have signed up.
  // While you are using this temporary code you will only get test ads and if you release
  // your code like this to the App Store your users will not receive ads (you will get a 'No Fill' error).
  let rewardedVideoAd = FBRewardedVideoAd(placementID: "YOUR_PLACEMENT_ID")
  rewardedVideoAd.delegate = self

  // For auto play video ads, it's recommended to load the ad at least 30 seconds before it is shown
  rewardedVideoAd.load()

  self.rewardedVideoAd = rewardedVideoAd
}
```

```m
- (void) viewDidLoad
{
  [super viewDidLoad];
  // Instantiate a rewarded video ad object.
  // NOTE: the placement ID will eventually identify this as your app. You can ignore it while
  // you are testing and replace it later when you have signed up.
  // While you are using this temporary code you will only get test ads and if you release
  // your code like this to the App Store your users will not receive ads (you will get a 'No Fill' error).
  self.rewardedVideoAd = [[FBRewardedVideoAd alloc] initWithPlacementID:@"YOUR_PLACEMENT_ID"];
  self.rewardedVideoAd.delegate = self;

  // For auto play video ads, it's recommended to load the ad at least 30 seconds before it is shown
  [self.rewardedVideoAd loadAd];
}
```

The ID that displays at `YOUR_PLACEMENT_ID` is a temporary ID for test purposes only.

If you use this temporary ID in your live code, your users will not receive ads (they will get a **No Fill** error). You must return here after testing and replace this temporary ID with a live Placement ID.

To find out how the generate a live Placement ID, refer to [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup)

Now that you have added the code to load the ad, you can add functions which will handle various events.

_For example_:

- `rewardedVideoAdDidLoad` ensures your app is aware when the ad is cached and ready to be displayed
- `rewardedVideoAdVideoComplete` lets you know when to deliver your reward to the user after a completed video view

SwiftObjective-C

```swift
func rewardedVideoAdDidLoad(_ rewardedVideoAd: FBRewardedVideoAd) {
  print("Video ad is loaded and ready to be displayed")
}

func rewardedVideoAd(_ rewardedVideoAd: FBRewardedVideoAd, didFailWithError error: Error) {
  print("Rewarded video ad failed to load")
}

func rewardedVideoAdDidClick(_ rewardedVideoAd: FBRewardedVideoAd) {
  print("Video ad clicked")
}

func rewardedVideoAdDidClose(_ rewardedVideoAd: FBRewardedVideoAd) {
  print("Rewarded Video ad closed - this can be triggered by closing the application, or closing the video end card")
}

func rewardedVideoAdVideoComplete(_ rewardedVideoAd: FBRewardedVideoAd) {
  print("Rewarded Video ad video completed - this is called after a full video view, before the ad end card is shown. You can use this event to initialize your reward")
}
```

```m
- (void)rewardedVideoAdDidLoad:(FBRewardedVideoAd *)rewardedVideoAd
{
  NSLog(@"Video ad is loaded and ready to be displayed");
}

- (void)rewardedVideoAd:(FBRewardedVideoAd *)rewardedVideoAd didFailWithError:(NSError *)error
{
  NSLog(@"Rewarded video ad failed to load");
}

- (void)rewardedVideoAdDidClick:(FBRewardedVideoAd *)rewardedVideoAd
{
  NSLog(@"Video ad clicked");
}

- (void)rewardedVideoAdDidClose:(FBRewardedVideoAd *)rewardedVideoAd
{
  NSLog(@"Rewarded Video ad closed - this can be triggered by closing the application, or closing the video end card");
}

- (void)rewardedVideoAdVideoComplete:(FBRewardedVideoAd *)rewardedVideoAd;
{
  NSLog(@"Rewarded Video ad video completed - this is called after a full video view, before the ad end card is shown. You can use this event to initialize your reward");
}
```

Finally, when you are ready to show the rewarded video ad you can call the following code within your own reward function.

SwiftObjective-C

```swift
private func showRewardedVideoAd() {
  guard let rewardedVideoAd = rewardedVideoAd, rewardedVideoAd.isAdValid else {
    return
  }
  rewardedVideoAd.show(fromRootViewController: self)
}
```

```m
- (void)showRewardedVideoAd
{
  if (self.rewardedVideoAd && self.rewardedVideoAd.isAdValid) {
    [self.rewardedVideoAd showAdFromRootViewController:self];
  }
}
```

The method to show a rewarded video ad includes an `animated` boolean flag which allows you to animate the presentation. By default it is set to `YES` / `true`, but you can override it.

When running on the simulator, test ads will be shown by default. To enable test ads on a device, add the following line of code before loading an ad: `AdSettings.addTestDevice(HASHED ID)`. Use the hashed ID that is printed to the log cat when you first make a request to load an ad on a device.

Optionally, you can add the following additional functions to handle the cases where the rewarded video ad will close or when the rewarded video impression is being captured:

SwiftObjective-C

```swift
func rewardedVideoAdWillClose(_ rewardedVideoAd: FBRewardedVideoAd) {
  print("The user clicked on the close button, the ad is just about to close")
}

func rewardedVideoAdWillLogImpression(_ rewardedVideoAd: FBRewardedVideoAd) {
  print("Rewarded Video impression is being captured")
}
```

```m
- (void)rewardedVideoAdWillClose:(FBRewardedVideoAd *)rewardedVideoAd
{
  NSLog(@"The user clicked on the close button, the ad is just about to close");
}

- (void)rewardedVideoAdWillLogImpression:(FBRewardedVideoAd *)rewardedVideoAd
{
  NSLog(@"Rewarded Video impression is being captured");
}
```

## Server Side Reward Validation

### Overview

If you manage your user rewards server-side, then Facebook offers a solution for carrying this out securely by using a validation technique. Our server will communicate with a specified https endpoint to validate each ad impression and validate whether a reward should be granted.

1. Audience Network SDK requests a rewarded video ad with the following parameters:

   - Audience Network Placement ID
   - Unique User ID - an attribute you use to identify a unique user. For example, a numeric identifier
   - Reward Value - the value of the reward you would like to grant the user. For example, 100Coins specified end point, together with the [App Secret](https://developers.facebook.com/docs/facebook-login/security#appsecret).
2. Upon receipt, the server validates the request and responds as follows:

   - **200 response**: request is valid and the reward should be delivered
   - **Non 200 response**: request is not valid, and the reward should not be delivered.
3. Once the video is complete, the end card is presented and one of the following events will fire.

   - `onRewardServerSuccess` \- triggered only if a 200 response was received during step 3.
   - `onRewardServerFailed` \- triggered if a non 200 response was received during step 3.

An example of the URL which will hit your publisher end point, from Facebook's server.

https://www.your\_end\_point.com/? **token** =APP\_SECRET& **puid** =USER\_ID& **pc** =REWARD\_ID& **ptid** =UNIQUE\_TRANSACTION\_ID

Please provide your publisher end point to your Facebook representative in order to enable this feature.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/17365208_273188216455141_6379479237312643072_n.png?_nc_cat=102&ccb=1-7&_nc_sid=34156e&_nc_ohc=FBRgfG9I6-UQ7kNvwE_qxjE&_nc_oc=AdqIyUjQH0EKntlY5cBMOstqj0F2mfoRGiTFHkPwdbGsXz97icsR3gc4R9coMbryO_0&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=eVuURDOqEKI-ikhK5gcnig&_nc_ss=7b289&oh=00_Af7yEPNrkhX0-mej0rjXmxqDXpmbl657eNuxORiH_Ad8Ag&oe=6A112DBE)

### SDK Implementation

It is possible to set the Reward Data (`USER_ID` and `CURRENCY`) before, or after the `loadAd` method. Both are demonstrated in the code snippet below.

SwiftObjective-C

```swift
let rewardedVideoAd = FBRewardedVideoAd(placementID: "YOUR_PLACEMENT_ID")
rewardedVideoAd.delegate = self

// Set the rewarded ad data before or after `load` method is called
rewardedVideoAd.setRewardDataWithUserID("USER_ID", withCurrency: "CURRENCY")

// For auto play video ads, it's recommended to load the ad at least 30 seconds before it is shown
rewardedVideoAd.load()

self.rewardedVideoAd = rewardedVideoAd
```

```m
self.rewardedVideoAd = [[FBRewardedVideoAd alloc] initWithPlacementID:@"YOUR_PLACEMENT_ID"];
self.rewardedVideoAd.delegate = self;

// Set the rewarded ad data before or after `loadAd` method is called
[self.rewardedVideoAd setRewardDataWithUserID:@"USER_ID" withCurrency:@"CURRENCY"];

[self.rewardedVideoAd loadAd];
```

In addition to the functions noted above in the `FBRewardedVideoAdDelegate`, the following events should be used to hande the granting of rewards in your app. The following can be used alongise the events monetioned above.

SwiftObjective-C

```swift
func rewardedVideoAdServerRewardDidFail(_ rewardedVideoAd: FBRewardedVideoAd) {
  print("Rewarded video ad not validated, or no response from server")
}

func rewardedVideoAdServerRewardDidSucceed(_ rewardedVideoAd: FBRewardedVideoAd) {
  print("Rewarded video ad validated by server")
}
```

```m
- (void)rewardedVideoAdServerRewardDidSucceed:(FBRewardedVideoAd *)rewardedVideoAd
{
  NSLog(@"Rewarded video ad validated by server");
}

- (void)rewardedVideoAdServerRewardDidFail:(FBRewardedVideoAd *)rewardedVideoAd
{
  NSLog(@"Rewarded video ad not validated, or no response from server");
}
```

Please note - the server validation callbacks will only occur after the end card has been dismissed by a user. You should not deallocate the rewarded video object until after one of these callbacks.

## Next steps

Learn more about the [ad formats](https://developers.facebook.com/docs/audience-network/ad-formats/) available for Audience Network apps.

### See also

- Visit [our GitHub sample app repository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fios&h=AUAyxsuglRUq1xO-INl10Fk5njYpG5TXct8onyDOt0xCWlqYxSvHrFwP1GvCGjLesAS5BBWRE9NcjKs9z69rMDv0f84P_rPvWtZEmL0FW_7mMRNulF-dN2iiM5vOaJcIWelZsfyv8hwxNg) to view sample code.
- View the [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards) to ensure you app complies.

On This Page

[Add Rewarded Video Ads to an iOS App](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#add-rewarded-video-ads-to-an-ios-app)

[Implementation](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#implementation)

[Server Side Reward Validation](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#server-side-reward-validation)

[Overview](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#overview)

[SDK Implementation](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#sdk-implementation)

[Next steps](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/guides/setting-up/ad-setup/ios/rewarded-video#see-also)