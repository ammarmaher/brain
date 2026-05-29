---
url: https://developers.facebook.com/docs/audience-network/ios-native
title: Native Ads - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fios%2Fnative%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


      - [iOS Template](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template)

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

[Adding Native Ads to your iOS App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#adding-native-ads-to-your-ios-app)

[Step 1: Create Native Ad Views in Storyboard](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#ui)

[Step 2: Load and Show Native Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#load)

[Controlling Clickable Area](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#controlling-clickable-area)

[Step 3: How to Get the Aspect Ratio of the Content and Apply Natural Width and Height](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#aspectRatio)

[Step 4: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#logging)

[Step 5: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#debug)

[Step 6: Load Ad without Auto Cache](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#mediaCachePolicy)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#see-also)

# Adding Native Ads to your iOS App

The Native Ad API allows you to build a customized experience for the ads you show in your app. When using the Native Ad API, instead of receiving an ad ready to be displayed, you will receive a group of ad properties such as a title, an image, a call to action, and you will have to use them to construct a custom UIView where the ad is shown.

Please consult our [native ads guide](https://developers.facebook.com/docs/audience-network/guidelines/native-ads#native) when designing native ads in your app.

Let's implement the following native ad placement. You will create the following views to our native ad.

|     |     |
| --- | --- |
| #### View \#1: advertiser icon<br>#### View \#2: ad title<br>#### View \#3: sponsored label<br>#### View \#4: advertiser choice | #### View \#5: ad media view<br>#### View \#6: social context<br>#### View \#7: ad body<br>#### View \#8: ad call to action button |

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/42521210_351346438936188_3537153512423030784_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=I74C44tt01sQ7kNvwFSBVti&_nc_oc=AdoXGQap5gtCOPY1uGL-ZP_mANXWQgzXHC9yq0kmce5pVwlvWXXfIjEh9b6zI8N1fB0&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=VHMruS4cvtkPEpr9Abx_bg&_nc_ss=7b289&oh=00_Af50BbkC9JAxbMbB6fX0G7IAiBpwlskGGQIDsXOOm_5POw&oe=6A259401)

#### [Step 1: Create Native Ad Views in Storyboard](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native\#ui)

#### [Step 2: Load and Show Native Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native\#load)

#### [Step 3: How to Get Aspect Ratio of the Content and Apply Natural Width and Height](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native\#aspectRatio)

#### [Step 4: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native\#logging)

#### [Step 5: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native\#debug)

#### [Step 6: Load Ad without Auto Cache](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native\#mediaCachePolicy)

#### [Step 7: Test Ads Integration](https://developers.facebook.com/docs/audience-network/testing)

#### [See Known Issues in the Change Log](https://developers.facebook.com/docs/audience-network/changelog-ios)

## Step 1: Create Native Ad Views in Storyboard

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guides before you proceed.

When designing native ads and banner ads, ensure you have followed [iOS layout guideline](https://developers.facebook.com/docs/audience-network/ios-layout-guideline) for optimal user experience.

1. After you have created a new project from [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guides, open `Main.storyboard`. Add a UIView element to the main View element and name it to `adUIView`.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/35857895_875043349370717_2848523388467544064_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=lggd-pGLLm4Q7kNvwGLFugb&_nc_oc=AdrOhYXQy61XxF6IdsAUgfUrzUD-fRAm3MKxTADvRMmB5xxlmlV4CtZNhgB2j-dxmZ0&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=VHMruS4cvtkPEpr9Abx_bg&_nc_ss=7b289&oh=00_Af7vBGrfyO-5LKICuOtcVN8iistSJljbHuA0MoqOziK1tA&oe=6A259091)

2. In addition, add `adIconImageView` (FBMediaView), `adTitleLabel` (UILabel), `adCoverMediaView` (FBMediaView), `adSocialContext` (UILabel), `adCallToActionButton` (UIButton), `adOptionsView` (FBAdOptionsView), `adBodyLabel` (UILabel), `sponsoredLabel` (UILabel) under `adUIView` as illustrated in the image below.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/35912709_599424193777402_539325404205285376_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=pAYOHOE_aFQQ7kNvwHmPX-8&_nc_oc=Adov9VQuTccikNxRutaEASRgRGmjdwLLc59rqjT3lwn5pOrrdiRzVhP6jc-1Wy9EKWg&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=VHMruS4cvtkPEpr9Abx_bg&_nc_ss=7b289&oh=00_Af6WOp0Q-OBl95QCR8smgf0wozGBYLppiu2O6zGUgcAhbQ&oe=6A25687C)

3. You may notice that there is a red arrow nearby **View Controller Scene**. This usually means that there are missing constraints in your layout.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/15011709_261819484216014_9143250925186449408_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=apNikxNb4YwQ7kNvwFrwmuW&_nc_oc=AdrEI0CVY7nAmtpFDrb2OhkPv4wGAlb8NGSqH5d0i_e_SormK8yRmYQUc6-tOwSR2LQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=VHMruS4cvtkPEpr9Abx_bg&_nc_ss=7b289&oh=00_Af6KeJ6pmLQstBNpHD4-1U569m7UeQP-e2ysKzSstQzYig&oe=6A258B3F)





    You would need to select all the view objects in your scene and click the "resolve layout issue" icon to add missing constraints.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/14989953_179237405870106_8559349661733748736_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=NVBaNaZ3_HQQ7kNvwFERZE9&_nc_oc=AdrOEGKDgYHlpDUA9fpGXF3E7WuFmWok8lJYa4FbHDcCs_wKI_vrdqSRRK4wkuZFNlg&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=VHMruS4cvtkPEpr9Abx_bg&_nc_ss=7b289&oh=00_Af72WFI2ENfolwOHlHZ5QsJVbqvcahG0XyDwupOiiBfDKQ&oe=6A2567A9)

4. Now that you have created all the UI elements for showing a native ad, you will need to reference these UI elements in the ViewController interface. First open the `ViewController.m` (`ViewController.swift` if you are using Swift), then drag `adUIView` inside the ViewController object. You can name it as `adUIView`. After, you will need to do the same thing for `adIconImageView` , `adTitleLabel`, `adCoverMediaView`, `adSocialContext`, `adCallToActionButton`, `adOptionsView`, `adBodyLabel`, `sponsoredLabel`.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/35884363_452973308462469_1853698199802347520_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=AJFbPQeMpjsQ7kNvwGNrdFy&_nc_oc=AdoioPhVp-NnBr2zEvTgDZbuEVMrFpVYx9S6Rza62_3g3TjpBEnO8NgWtXUESOloS9Q&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=VHMruS4cvtkPEpr9Abx_bg&_nc_ss=7b289&oh=00_Af5B9dpyYGzepZpwDeDHSdad3T6JX5M_JTGKNyeb_aFLKA&oe=6A258C8F)

5. Build and run the project. You should see from your device or simulator empty content as follows:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/15186225_1112058292183318_3645203031185686528_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=T4l7uLmZJhoQ7kNvwEIgshb&_nc_oc=AdoVCvRoWK8FwPFTp0bBtoD4alHvCEV9hfwMFFFML2l4yNLMRqEIsYCmMcORWV5c1_E&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=VHMruS4cvtkPEpr9Abx_bg&_nc_ss=7b289&oh=00_Af4EVY6Dkr0j0jkjsqJAccekeJja-pWv0H_Dwcb3ZxH7xw&oe=6A258599)

Now that you have created all the UI elements to show native ads, the next step is to load the native ad and bind the contents to the UI elements.

## Step 2: Load and Show Native Ad

1. In your View Controller source file, import the SDK, declare that `ViewController` conforms to the `FBNativeAdDelegate` protocol, and add a `FBNativeAd` instance variable




SwiftObjective-C





```swift
import UIKit
import FBAudienceNetwork

class ViewController: UIViewController, FBNativeAdDelegate {

     private var nativeAd: FBNativeAd?
}
```















```m
#import <UIKit/UIKit.h>
@import FBAudienceNetwork;

@interface ViewController () <FBNativeAdDelegate>

@property (strong, nonatomic) FBNativeAd *nativeAd;

@end
```


3. In the `viewDidLoad` method, add the following lines of code to load the native ad content




SwiftObjective-C





```swift
override func viewDidLoad() {
     super.viewDidLoad()

     let nativeAd = FBNativeAd(placementID: "YOUR_PLACEMENT_ID")
     nativeAd.delegate = self
     nativeAd.loadAd()
}
```















```m
- (void)viewDidLoad
{
[super viewDidLoad];

FBNativeAd *nativeAd = [[FBNativeAd alloc] initWithPlacementID:@"YOUR_PLACEMENT_ID"];
nativeAd.delegate = self;
[nativeAd loadAd];
}
```

The ID that displays at `YOUR_PLACEMENT_ID` is a temporary ID for test purposes only.

If you use this temporary ID in your live code, your users will not receive ads (they will get a **No Fill** error). You must return here after testing and replace this temporary ID with a live Placement ID.

To find out how the generate a live Placement ID, refer to [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup)

4.
    The next step is to show the ad when the content is ready. You would need your `ViewController` to implement the `nativeAdDidLoad` delegate method




SwiftObjective-C





```swift
func nativeAdDidLoad(_ nativeAd: FBNativeAd) {

     // 1. If there is an existing valid native ad, unregister the view
     if let previousNativeAd = self.nativeAd, previousNativeAd.isAdValid {
       previousNativeAd.unregisterView()
     }

     // 2. Retain a reference to the native ad object
     self.nativeAd = nativeAd

     // 3. Register what views will be tappable and what the delegate is to notify when a registered view is tapped
     // Here only the call-to-action button and the media view are tappable, and the delegate is the view controller
     nativeAd.registerView(
       forInteraction: adUIView,
       mediaView: adCoverMediaView,
       iconView: adIconImageView,
       viewController: self,
       clickableViews: [adCallToActionButton, adCoverMediaView]
     )

     // 4. Render the ad content onto the view
     adTitleLabel.text = nativeAd.advertiserName
     adBodyLabel.text = nativeAd.bodyText
     adSocialContextLabel.text = nativeAd.socialContext
     sponsoredLabel.text = nativeAd.sponsoredTranslation
     adCallToActionButton.setTitle(nativeAd.callToAction, for: .normal)
     adOptionsView.nativeAd = nativeAd
}
```















```m
- (void)nativeAdDidLoad:(FBNativeAd *)nativeAd
{
// 1. If there is an existing valid native ad, unregister the view
if (self.nativeAd && self.nativeAd.isAdValid) {
    [self.nativeAd unregisterView];
}

// 2. Retain a reference to the native ad object
self.nativeAd = nativeAd;

// 3. Register what views will be tappable and what the delegate is to notify when a registered view is tapped
// Here only the call-to-action button and the media view are tappable, and the delegate is the view controller
[self.nativeAd registerViewForInteraction:self.adUIView\
                                  mediaView:self.adCoverMediaView\
                                   iconView:self.adIconImageView\
                             viewController:self\
                             clickableViews:@[self.adCallToActionButton, self.adCoverMediaView]];

// 4. Render the ad content onto the view
self.adTitleLabel.text = self.nativeAd.advertiserName;
self.adBodyLabel.text = self.nativeAd.bodyText;
self.adSocialContextLabel.text = self.nativeAd.socialContext;
self.sponsoredLabel.text = self.nativeAd.sponsoredTranslation;
[self.adCallToActionButton setTitle:self.nativeAd.callToAction forState:UIControlStateNormal];
self.adOptionsView.nativeAd = self.nativeAd;
}
```

### Controlling Clickable Area

For a better user experience and better results, you should always consider controlling the clickable area of your ad to avoid unintentional clicks. Please refer to [Audience Network SDK Policy](https://developers.facebook.com/docs/audience-network/policy) page for more details about white space unclickable enforcement.

9. Choose your build target to be device and run the above code, you should see something like this:



![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/15186234_216025858806976_1785369809903419392_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=F84Ww1d5rkwQ7kNvwG1IxIa&_nc_oc=AdpKOFL6t7qMv2Xknh-g2ft0MlUpui8UD1JEvOPxdIXwB9xGODMtSmJPu7D6dyy6C5M&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=VHMruS4cvtkPEpr9Abx_bg&_nc_ss=7b289&oh=00_Af61vyHDn_6gSPIeAqddLEf58_gSuBGhvI0bGgIszJUJWQ&oe=6A256B0A)


When running ads in the simulator, change the setting to test mode to view test ads. Please go to [How to Use Test Mode](https://developers.facebook.com/docs/audience-network/testing#testing-testAd) for more information.

## Step 3: How to Get the Aspect Ratio of the Content and Apply Natural Width and Height

In the example above, the media content of the ad is shown in `adCoverMediaView` and its object type is `FBMediaView`. From previous step, we have shown how to use FBMediaView to load media content from a given `FBNativeAd` object. This view takes the place of manually loading a cover image. When creating the `FBMediaView`, its width and height can be either determined by the auto layout constraints set in the storyboard, or they can be hard-coded. However, the width and height of the view may not be fit with the actual cover image of the ad downloaded later. To fix this, the example following shows how to get the aspect ratio of the content and apply natural width and height:

1. Declare that your View Controller implements the `FBMediaViewDelegate` protocol



SwiftObjective-C





```swift
class ViewController: UIViewController, FBNativeAdDelegate, FBMediaViewDelegate {
     ...
}
```















```m
@interface ViewController : UIViewController <FBNativeAdDelegate, FBMediaViewDelegate>
...
@end
```


3. When the native ad is loaded, set the delegate of `FBMediaView` object to be your view controller



SwiftObjective-C





```swift
func nativeAdDidLoad(_ nativeAd: FBNativeAd) {
     adCoverMediaView.delegate = self
}
```















```m
- (void)nativeAdDidLoad:(FBNativeAd *)nativeAd
{
self.adCoverMediaView.delegate = self;
}
```

5. Implement `mediaViewDidLoad` method in your view controller



SwiftObjective-C





```swift
func mediaViewDidLoad(_ mediaView: FBMediaView) {
     let currentAspect = mediaView.frame.size.width / mediaView.frame.size.height
     print(currentAspect)

     let actualAspect = mediaView.aspectRatio
     print(actualAspect)
}
```















```m
- (void)mediaViewDidLoad:(FBMediaView *)mediaView
{
CGFloat currentAspect = mediaView.frame.size.width / mediaView.frame.size.height;
NSLog(@"current aspect of media view: %f", currentAspect);

CGFloat actualAspect = mediaView.aspectRatio;
NSLog(@"actual aspect of media view: %f", actualAspect);
}
```

`mediaView.aspectRatio` returns a positive CGFloat, or 0.0 if no ad is currently loaded. Its value is valid after media view is loaded. There are convenience methods that will set the width and height of the FBMediaView object respecting its apsect ratio of the media content loaded. You can call `applyNaturalWidth` or `applyNaturalHeight` to update the `FBMediaView` object's width or height to respect the media content's aspect ratio.


## Step 4: Verify Impression and Click Logging

Optionally, you can add the following functions to handle the cases where the native ad is closed or when the user clicks on it

SwiftObjective-C

```swift
func nativeAdDidClick(_ nativeAd: FBNativeAd) {
  print("Native ad was clicked.")
}

func nativeAdDidFinishHandlingClick(_ nativeAd: FBNativeAd) {
  print("Native ad did finish click handling.")
}

func nativeAdWillLogImpression(_ nativeAd: FBNativeAd) {
  print("Native ad impression is being captured.")
}
```

```m
- (void)nativeAdDidClick:(FBNativeAd *)nativeAd
{
  NSLog(@"Native ad was clicked.");
}

- (void)nativeAdDidFinishHandlingClick:(FBNativeAd *)nativeAd
{
  NSLog(@"Native ad did finish click handling.");
}

- (void)nativeAdWillLogImpression:(FBNativeAd *)nativeAd
{
  NSLog(@"Native ad impression is being captured.");
}
```

## Step 5: How to Debug When Ad Not Shown

Add and implement the following function in your view controller to handle ad loading failures

SwiftObjective-C

```swift
func nativeAd(_ nativeAd: FBNativeAd, didFailWithError error: Error) {
  print("Native ad failed to load with error: \(error.localizedDescription)")
}
```

```m
- (void)nativeAd:(FBNativeAd *)nativeAd didFailWithError:(NSError *)error
{
  NSLog(@"Native ad failed to load with error: %@", error);
}
```

## Step 6: Load Ad without Auto Cache

1. We strongly recommend to leave media caching on by default in all cases. However, we allow you to override the default. Please be very careful if you decide to override our default media caching



SwiftObjective-C





```swift
let nativeAd = FBNativeAd(placementID: "YOUR_PLACEMENT_ID")
nativeAd.delegate = self
nativeAd.loadAd(withMediaCachePolicy: .none)
```















```m
FBNativeAd *nativeAd = [[FBNativeAd alloc] initWithPlacementID:@"YOUR_PLACEMENT_ID"];
nativeAd.delegate = self;
[nativeAd loadAdWithMediaCachePolicy:FBNativeAdsCachePolicyNone];
```


3. First, you will need to manually download all media for the native ad



SwiftObjective-C





```swift
func nativeAdDidLoad(_ nativeAd: FBNativeAd) {

     ...

     self.adCoverMediaView.delegate = self
     nativeAd.downloadMedia()
     self.nativeAd = nativeAd

     ...
}
```















```m
- (void)nativeAdDidLoad:(FBNativeAd *)nativeAd
{
...

self.adCoverMediaView.delegate = self;
[nativeAd downloadMedia];
self.nativeAd = nativeAd;

...
}
```

5. Next, you should only call `registerViewForInteraction` and display the ad after `mediaViewDidLoad` callback. All media has to be loaded and displayed for an eligible impression



SwiftObjective-C





```swift
func mediaViewDidLoad(_ mediaView: FBMediaView) {
     guard let nativeAd = nativeAd else {
       return
     }

     // 1. Register what views will be tappable and what the delegate is to notify when a registered view is tapped
     // Here only the call-to-action button and the media view are tappable, and the delegate is the view controller
     nativeAd.registerView(
       forInteraction: adUIView,
       mediaView: mediaView,
       iconView: adIconImageView,
       viewController: self,
       clickableViews: [adCallToActionButton, mediaView]
     )

     // 2. Render the ad content onto the view
     adTitleLabel.text = nativeAd.advertiserName
     adBodyLabel.text = nativeAd.bodyText
     adSocialContextLabel.text = nativeAd.socialContext
     sponsoredLabel.text = nativeAd.sponsoredTranslation
     adCallToActionButton.setTitle(nativeAd.callToAction, for: .normal)
     adOptionsView.nativeAd = nativeAd
}
```















```m
- (void)mediaViewDidLoad:(FBMediaView *)mediaView
{
if (!self.nativeAd) {
    return;
}

// 1. Register what views will be tappable and what the delegate is to notify when a registered view is tapped
// Here only the call-to-action button and the media view are tappable, and the delegate is the view controller
[self.nativeAd registerViewForInteraction:self.adUIView\
                                  mediaView:mediaView\
                                   iconView:self.adIconImageView\
                          viewController:self\
                         clickableViews:@[self.adCallToActionButton, mediaView]];

// 2. Render the ad content onto the view
self.adTitleLabel.text = self.nativeAd.advertiserName;
self.adBodyLabel.text = self.nativeAd.bodyText;
self.adSocialContextLabel.text = self.nativeAd.socialContext;
self.sponsoredLabel.text = self.nativeAd.sponsoredTranslation;
[self.adCallToActionButton setTitle:self.nativeAd.callToAction forState:UIControlStateNormal];
self.adOptionsView.nativeAd = self.nativeAd;
}
```

## Next steps

Learn more about the [ad formats](https://developers.facebook.com/docs/audience-network/ad-formats/) available for Audience Network apps.

### See also

- Visit [our GitHub sample app repository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fios&h=AUBVwWQfWB7-RJoOVtEkX4dfRfT8Ch1mtVC2Q0wLCQe7xnMc2Z8SP1nQ6OiOI2uKfYbOWa80dYsLHOhLmal1Q3fFakc26YzDecisvZm5d-i7ogZKJXDR_e-eoAgWDHjMhFUz4uT3NwTG4w) to view sample code.
- View the [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards) to ensure you app complies.

|     |
| --- |
| # More Resources |

|     |     |
| --- | --- |
| #### [Getting Started Guide](https://developers.facebook.com/docs/audience-network/getting-started)<br>Technical guide to get started with the Audience Network<br>#### [Code Samples](https://developers.facebook.com/docs/audience-network/samples)<br>Audience Network Ads Integration Samples | #### [FAQ](https://developers.facebook.com/docs/audience-network/faq)<br>Audience Network FAQ<br>#### [Native Ads Template](https://developers.facebook.com/docs/audience-network/ios/nativeadtemplate)<br>A more hands off approach when integrating Native Ads |

On This Page

[Adding Native Ads to your iOS App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#adding-native-ads-to-your-ios-app)

[Step 1: Create Native Ad Views in Storyboard](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#ui)

[Step 2: Load and Show Native Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#load)

[Controlling Clickable Area](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#controlling-clickable-area)

[Step 3: How to Get the Aspect Ratio of the Content and Apply Natural Width and Height](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#aspectRatio)

[Step 4: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#logging)

[Step 5: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#debug)

[Step 6: Load Ad without Auto Cache](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#mediaCachePolicy)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native#see-also)