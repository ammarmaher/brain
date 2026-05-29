---
url: https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template
title: iOS Template - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fios%2Fnative%2Ftemplate%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)

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

On This Page

[Use the Native Ads Template in iOS](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template#use-the-native-ads-template-in-ios)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template#see-also)

# Use the Native Ads Template in iOS

Publishers seeking a more hands off approach when integrating Native Ads can leverage a custom Audience Network Native Ads template. Customize a native ad's size, color, and font to match the look and feel of your app.

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guides before you proceed.

To utilize this guide effectively, you should be familiar with implementing [Native Ads](https://developers.facebook.com/docs/audience-network/ios-native).

#### [Step 1: Template Implementation](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template\#template_implementation)

- [Native Ads](https://developers.facebook.com/docs/audience-network/ios/nativeadtemplate#native-ad)

- [Native Banner Ads](https://developers.facebook.com/docs/audience-network/ios/nativeadtemplate#native-banner-ad)


#### [Step 2: Further Customization](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template\#further_customization)

- [Native Ads](https://developers.facebook.com/docs/audience-network/ios/nativeadtemplate#native-ad-custom)

- [Native Banner Ads](https://developers.facebook.com/docs/audience-network/ios/nativeadtemplate#native-banner-ad-custom)


## Step 1: Template Implementation

## •   Implementation for Native Ads

Now, in your View Controller header file (or Swift file, if you are a Swift user), import `FBAudienceNetwork`, declare conformance to the `FBNativeAdDelegate` protocol, and add an instance variable for the ad unit:

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

@interface ViewController : UIViewController <FBNativeAdDelegate>

@property (nonatomic, strong) FBNativeAd *nativeAd;

@end
```

Then, add a method in your View Controller's implementation file that initializes `FBNativeAd` and request an ad to load:

SwiftObjective-C

```swift
override func viewDidLoad() {
  super.viewDidLoad()

  // Instantiate the ad object.
  // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
  // now, while you are testing and replace it later when you have signed up.
  // While you are using this temporary code you will only get test ads and if you release
  // your code like this to the App Store your users will not receive ads (you will get a 'No Fill' error).
  let nativeAd = FBNativeAd(placementID: "YOUR_PLACEMENT_ID")
  nativeAd.delegate = self
  nativeAd.loadAd()
}
```

```m
- (void)viewDidLoad
{
  [super viewDidLoad];
  // Instantiate a NativeAd object.
  // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
  // now, while you are testing and replace it later when you have signed up.
  // While you are using this temporary code you will only get test ads and if you release
  // your code like this to the App Store your users will not receive ads (you will get a no fill error).
  FBNativeAd *nativeAd = [[FBNativeAd alloc] initWithPlacementID:@"YOUR_PLACEMENT_ID"];
  nativeAd.delegate = self;
  [nativeAd loadAd];
}
```

The ID that displays at `YOUR_PLACEMENT_ID` is a temporary ID for test purposes only.

If you use this temporary ID in your live code, your users will not receive ads (they will get a **No Fill** error). You must return here after testing and replace this temporary ID with a live Placement ID.

To find out how the generate a live Placement ID, refer to [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup)

Now that you have added the code to load the ad, add the following functions to construct the ad once it has loaded:

SwiftObjective-C

```swift
func nativeAdDidLoad(_ nativeAd: FBNativeAd) {

  if let previousNativeAd = self.nativeAd, previousNativeAd.isAdValid {
    previousNativeAd.unregisterView()
  }

  self.nativeAd = nativeAd

  let adView = FBNativeAdView(nativeAd: nativeAd, with: .genericHeight300)

  view.addSubview(adView)

  let size = view.bounds.size
  let xOffset: CGFloat = size.width / 2 - 160
  let yOffset: CGFloat = (size.height > size.width) ? 100 : 20
  adView.frame = CGRect(x: xOffset, y: yOffset, width: 320, height: 300)
}
```

```m
- (void)nativeAdDidLoad:(FBNativeAd *)nativeAd
{
  self.nativeAd = nativeAd;
  [self showNativeAd];
}

- (void)showNativeAd
{
  if (self.nativeAd && self.nativeAd.isAdValid) {
    [self.nativeAd unregisterView];
  }

  FBNativeAdView *adView = [FBNativeAdView nativeAdViewWithNativeAd:self.nativeAd withType:FBNativeAdViewTypeGenericHeight300];

  [self.view addSubview:adView];

  CGSize size = self.view.bounds.size;
  CGFloat xOffset = size.width / 2 - 160;
  CGFloat yOffset = (size.height > size.width) ? 100 : 20;
  adView.frame = CGRectMake(xOffset, yOffset, 320, 300);
}
```

Choose your build target to be device and run the above code, you should see something like this:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/15615550_191348398002384_5059139155888439296_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=Pzfr_f-0ucIQ7kNvwFl0Rgn&_nc_oc=AdqbkXFf0skcMIhLKP6hymXQMT5vjlejm3MuqC9KSCEcDzhgcl-Ze3wyXDwpHruiIzo&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HOV6P9405QPW-xQDXlO4ZA&_nc_ss=7b289&oh=00_Af6fmMe70CbgpHKnFiImiI7mXTeJ6F9nSExh8ntutEhD-Q&oe=6A258871)

Custom Ad Formats come in two templates:

| Template View Type | Height | Width | Attributes Included |
| --- | --- | --- | --- |
| `FBNativeAdView<br>TypeGenericHeight300` | 300dp | Flexible width | Image, icon, title, context, description, and CTA button |
| `FBNativeAdView<br>TypeGenericHeight400` | 400dp | Flexible width | Image, icon, title, subtitle, context, description and CTA button |

## •   Implementation for Native Banner Ads

To shown a native banner ad using templates with height 100 and 120 options, you need to create a `FBNativeBannerAd` instance and show it in `FBNativeBannerAdView` view instance as following:

In your View Controller header file (or Swift file, if you are a Swift user), import `FBAudienceNetwork`, declare conformance to the `FBNativeBannerAdDelegate` protocol, and add an instance variable for the ad unit

SwiftObjective-C

```swift
import UIKit
import FBAudienceNetwork

class ViewController: UIViewController, FBNativeBannerAdDelegate {
  private var nativeBannerAd: FBNativeBannerAd?
}
```

```m
#import <UIKit/UIKit.h>
@import FBAudienceNetwork;

@interface ViewController : UIViewController <FBNativeBannerAdDelegate>

@property (nonatomic, strong) FBNativeBannerAd *nativeBannerAd;

@end
```

Then, add a method in your View Controller's implementation file that initializes `FBNativeBannerAd` and request an ad to load:

SwiftObjective-C

```swift
override func viewDidLoad() {
  super.viewDidLoad()

  // Instantiate a native banner ad object.
  // NOTE: the placement ID will eventually identify this as your app. You can ignore it while you are testing
  // and replace it later when you have signed up.
  // While you are using this temporary code you will only get test ads and if you release
  // your code like this to the App Store your users will not receive ads (you will get a ‘No Fill’ error).
  let nativeBannerAd = FBNativeBannerAd(placementID: "YOUR_PLACEMENT_ID")

  // Set a delegate to get notified when the ad was loaded.
  nativeBannerAd.delegate = self

  // Initiate a request to load an ad.
  nativeBannerAd.loadAd()
}
```

```m
- (void)viewDidLoad
{
  [super viewDidLoad];

  // Instantiate a native banner ad object.
  // NOTE: the placement ID will eventually identify this as your app. You can ignore it while you are testing
  // and replace it later when you have signed up.
  // While you are using this temporary code you will only get test ads and if you release
  // your code like this to the App Store your users will not receive ads (you will get a ‘No Fill’ error).
  // your code like this to the App Store your users will not receive ads (you will get a ‘No Fill’ error).
  FBNativeBannerAd *nativeBannerAd = [[FBNativeBannerAd alloc] initWithPlacementID:@"YOUR_PLACEMENT_ID"];

  // Set a delegate to get notified when the ad was loaded.
  nativeBannerAd.delegate = self;

  // Initiate a request to load an ad.
  [nativeBannerAd loadAd];
}
```

The ID that displays at `YOUR_PLACEMENT_ID` is a temporary ID for test purposes only.

If you use this temporary ID in your live code, your users will not receive ads (they will get a **No Fill** error). You must return here after testing and replace this temporary ID with a live Placement ID.

To find out how the generate a live Placement ID, refer to [Audience Network Setup](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup)

Now that you have added the code to load the ad, add the following functions to construct the ad once it has loaded:

SwiftObjective-C

```swift
func nativeBannerAdDidLoad(_ nativeBannerAd: FBNativeBannerAd) {

  // 1. If there is an existing valid ad, unregister the view
  if let previousAd = self.nativeBannerAd, previousAd.isAdValid {
    previousAd.unregisterView()
  }

  // 2. Retain a reference to the ad object
  self.nativeBannerAd = nativeBannerAd

  // 3. Instantiate the ad view
  let adView = FBNativeBannerAdView(nativeBannerAd: nativeBannerAd, with: .genericHeight100)
  view.addSubview(adView)

  // 4. Set the frame of the ad view (either manually or using constraints)
  let size = view.bounds.size
  let xOffset: CGFloat = size.width / 2 - 160
  let yOffset: CGFloat = (size.height > size.width) ? 100 : 20
  adView.frame = CGRect(x: xOffset, y: yOffset, width: 320, height: 300)
}
```

```m
- (void)nativeBannerAdDidLoad:(FBNativeBannerAd *)nativeBannerAd
{
  if (self.nativeBannerAd && self.nativeBannerAd.isAdValid) {
    [self.nativeBannerAd unregisterView];
  }

  self.nativeBannerAd = nativeBannerAd;

  FBNativeBannerAdView *adView = [FBNativeBannerAdView nativeBannerAdViewWithNativeBannerAd:self.nativeBannerAd\
                                                                                   withType:FBNativeBannerAdViewTypeGenericHeight100];

  [self.view addSubview:adView];

  CGSize size = self.view.bounds.size;
  CGFloat xOffset = size.width / 2 - 160;
  CGFloat yOffset = (size.height > size.width) ? 100 : 20;
  adView.frame = CGRectMake(xOffset, yOffset, 320, 100);
}
```

Custom Ad Formats come in two templates:

| Template View Type | Height | Width | Attributes Included |
| --- | --- | --- | --- |
| `FBNativeBannerAdView<br>TypeGenericHeight100` | 100dp | Flexible width | Icon, title, context, and CTA button |
| `FBNativeBannerAdView<br>TypeGenericHeight120` | 120dp | Flexible width | Icon, title, context, description, and CTA button |

## Step 2: Further Customization

With a native custom template, you can customize the following elements:

- Height
- Width
- Background Color
- Title Color
- Title Font
- Description Color
- Description Font
- Button Color
- Button Title Color
- Button Title Font
- Button Border Color

If you want to customize certain elements, then it is recommended to use a design that fits in with your app's layouts and themes.

You will need to build `FBNativeAdViewAttributes` object and provide a loaded native ad to render these elements:

## •   Example For Native Ads

SwiftObjective-C

```swift
func nativeAdDidLoad(_ nativeAd: FBNativeAd) {

  // Instantiate the attributes to customize the view
  let attributes = FBNativeAdViewAttributes()
  attributes.backgroundColor = UIColor(white: 0.9, alpha: 1)
  attributes.buttonColor = UIColor(red: 66 / 255.0, green: 108 / 255.0, blue: 173 / 255.0, alpha: 1)
  attributes.buttonTitleColor = .white

  // Feed the attributes to the view
  let adView = FBNativeAdView(nativeAd: nativeAd, with: .genericHeight300, with: attributes)

  ... Rest of implementation ...
}
```

```m
- (void)nativeAdDidLoad:(FBNativeAd *)nativeAd
{
  // Instantiate the attributes to customize the view
  FBNativeAdViewAttributes *attributes = [[FBNativeAdViewAttributes alloc] init];

  attributes.backgroundColor = [UIColor colorWithRed:0.9 green:0.9 blue:0.9 alpha:1];
  attributes.buttonColor = [UIColor colorWithRed:66/255.0 green:108/255.0 blue:173/255.0 alpha:1];
  attributes.buttonTitleColor = [UIColor whiteColor];

  // Feed the attributes to the view
  FBNativeAdView *adView = [FBNativeAdView nativeAdViewWithNativeAd:nativeAd\
      withType:FBNativeAdViewTypeGenericHeight300 withAttributes:attributes];

  ... Rest of implementation ...
}
```

The above code will render an ad that looks like this:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/15608930_236949886738452_6903015779097116672_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=aCrP2a3UETEQ7kNvwF1cEiZ&_nc_oc=AdqwwNLDVJCmc2NNEuuZJEXxOzy0c-4iCbZ2-GzcC67aOTFTbocRGqqf674xnVjySY8&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=HOV6P9405QPW-xQDXlO4ZA&_nc_ss=7b289&oh=00_Af6Y5gIiTjLjCdmNcEWTajsZJ2TEL2O5wqZiZ3zHbun6jg&oe=6A2575D2)

## •   Example For Native Banner Ads

SwiftObjective-C

```swift
func nativeBannerAdDidLoad(_ nativeBannerAd: FBNativeBannerAd) {

  // Instantiate the attributes to customize the view
  let attributes = FBNativeAdViewAttributes()
  attributes.backgroundColor = UIColor(white: 0.9, alpha: 1)
  attributes.buttonColor = UIColor(red: 66 / 255.0, green: 108 / 255.0, blue: 173 / 255.0, alpha: 1)
  attributes.buttonTitleColor = .white

  // Instantiate the view and feed the attributes to the initializer
  let adView = FBNativeBannerAdView(nativeBannerAd: nativeBannerAd, with: .genericHeight100, with: attributes)

  ... Rest of implementation ...
}
```

```m
- (void)nativeBannerAdDidLoad:(FBNativeBannerAd *)nativeAd
{
  // Instantiate the attributes to customize the view
  FBNativeAdViewAttributes *attributes = [[FBNativeAdViewAttributes alloc] init];
  attributes.backgroundColor = [UIColor colorWithRed:0.9 green:0.9 blue:0.9 alpha:1];
  attributes.buttonColor = [UIColor colorWithRed:66/255.0 green:108/255.0 blue:173/255.0 alpha:1];
  attributes.buttonTitleColor = [UIColor whiteColor];

  // Instantiate the view and feed the attributes to the initializer
  FBNativeBannerAdView *adView = [FBNativeBannerAdView nativeBannerAdViewWithNativeBannerAd :nativeAd\
      withType:FBNativeBannerAdViewTypeGenericHeight100 withAttributes:attributes];

  ... Rest of implementation ...
}
```

## Next steps

Learn more about the [ad formats](https://developers.facebook.com/docs/audience-network/ad-formats/) available for Audience Network apps.

### See also

- Visit [our GitHub sample app repository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fios&h=AUAFZXMpeN8DIAI2x5yebarW483Tn4bMczdMCj_yURWkInnL85V4GAB7lea0_MLzXXcrqXuff3KGaNBXi9DYfFlvQ_HNZqfZbJ0rRNuGK0lPo4qZrSxEjVBvv-hX9bDmD9VdR4Lb9S8SAA) to view sample code.
- View the [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards) to ensure you app complies.

On This Page

[Use the Native Ads Template in iOS](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template#use-the-native-ads-template-in-ios)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native/template#see-also)