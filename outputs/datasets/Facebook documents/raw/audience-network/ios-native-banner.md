---
url: https://developers.facebook.com/docs/audience-network/ios-native-banner
title: Native Banner Ads - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fios%2Fnative-banner%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Add Native Banner Ads to an iOS App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#add-native-banner-ads-to-an-ios-app)

[Step 1: Create Native Banner Ad Views in Storyboard](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#ui)

[Step 2: Load and Show Native Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#load)

[Controlling Clickable Area](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#controlling-clickable-area)

[Step 3: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#logging)

[Step 4: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#debug)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#see-also)

# Add Native Banner Ads to an iOS App

The Audience Network allows you to monetize your iOS apps with Facebook ads. This guide explains how to create an iOS app that shows native banner ads. The Native Banner Ad API allows you to build a customized experience for the ads you show in your app. When using the Native Banner Ad API, instead of receiving an ad ready to be displayed, you will receive a group of ad properties such as a title, an image, a call to action, and you will have to use them to construct a custom UIView where the ad is shown.

Let's implement the following native banner ad placement. You will create the following views to our native banner ad.

|     |     |
| --- | --- |
| #### View \#1: ad icon image view<br>#### View \#2: ad choices view<br>#### View \#3: ad advertiser name label | #### View \#4: ad sponsored label<br>#### View \#5: ad call to action button |

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/32736279_1230074457128881_4182385079206543360_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=DlLdaXi9VBsQ7kNvwHWDTeV&_nc_oc=AdrvleQtzsZFfa8wfnlCYiD3EL2U8yABl0QyPkNoc7TIf6nwZ7fKdaRg5OjLtDvJcJ8&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HsIF4pjYixxuo5B4SCwLjw&_nc_ss=7b289&oh=00_Af6N2cDfjaZYD--ACNI4E9NtaajRxbJ4hEOmsKYxTOcmNA&oe=6A2599CF)

#### [Step 1: Create Native Banner Ad Views in Storyboard](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner\#ui)

#### [Step 2: Load and Show Native Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner\#load)

#### [Step 3: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner\#logging)

#### [Step 4: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner\#debug)

#### [Step 5: Test Ads Integration](https://developers.facebook.com/docs/audience-network/testing)

#### [See Known Issues in the Change Log](https://developers.facebook.com/docs/audience-network/changelog-ios)

## Step 1: Create Native Banner Ad Views in Storyboard

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guides before you proceed.

When designing native ads and banner ads, ensure you have followed [iOS layout guideline](https://developers.facebook.com/docs/audience-network/ios-layout-guideline) for optimal user experience.

1. After you have created a new project from [iOS Getting Started](https://developers.facebook.com/docs/audience-network/ios) guides, open `Main.storyboard`. Add a UIView element to the main View element and name it to `adUIView`.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/29918837_227208928028938_5317411027048988672_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=fJ5wlF5rIVkQ7kNvwHhPrUs&_nc_oc=AdrU-or8cyMrWUNqLgXBIOu0Ia6Dny0nMoShF5YOx6C1usRs-Cu9xE5Kb4IA3ZnlbrU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HsIF4pjYixxuo5B4SCwLjw&_nc_ss=7b289&oh=00_Af7SZ5NyaLonHzAdqF8suEWra-lD9mYuZ9dWlFNtTB2YGQ&oe=6A258FA3)

5. In addition, add `adIconImageView` (FBMediaView), `adChoicesView` (FBAdChoicesView), `adAdvertiserNameLabel` (UILabel), `adSponsoredLabel` (UILabel), `adCallToActionButton` (UIButton) under `adUIView` as illustrated in the image below.

    ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/32745602_180349889456862_5244941975144103936_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=87flcWaxaBgQ7kNvwHeMht1&_nc_oc=AdogO-iyjiJfX7pLnh0ZTZLi7jyNsZ_JnmdU2Ri2gq9KKvzNC8ciGnCv1TDV3ID67jY&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=HsIF4pjYixxuo5B4SCwLjw&_nc_ss=7b289&oh=00_Af7yChAuwGO3Z0b6ueJzq3o3Q2CnaNTEpC01n_WYZ-korA&oe=6A25821C)

6. You may notice that there is a red arrow nearby **View Controller Scene**. This usually means that there are missing constraints in your layout.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/15011709_261819484216014_9143250925186449408_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=apNikxNb4YwQ7kNvwF_rC6d&_nc_oc=Ado3oAFIDxjB8c-v_BuMVu8B8UxCL2SmqZOPC_kowoImWT83HW_LkA2bsp5fTIV6ytA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HsIF4pjYixxuo5B4SCwLjw&_nc_ss=7b289&oh=00_Af7j74RDzZmeNHDRuo0dSWONZNBabma7aif7if43plI3gQ&oe=6A258B3F)





    You would need to select all the view objects in your scene and click the "resolve layout issue" icon to add missing constraints.



![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/14989953_179237405870106_8559349661733748736_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=NVBaNaZ3_HQQ7kNvwEhJSLh&_nc_oc=AdoGQ2DoMGvPJ9lo1RiBG97Ac9tsj9EhdwKT8cN54LtM1GJsaV_nDDtJn577Hhmg_YU&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=HsIF4pjYixxuo5B4SCwLjw&_nc_ss=7b289&oh=00_Af7QD9oZXn6FCABHzLvrQ3CF0kSMPjk0M0xkucurDaPtaA&oe=6A2567A9)

7. Now that you have created all the UI elements for showing a native banner ad, you will need to reference these UI elements in the ViewController interface. First open the `ViewController.m` (`ViewController.swift` if you are a Swift user), then hold down the Control key and drag `adUIView` inside the ViewController interface object. You can name it as `adUIView`. After, you will need to do the same thing for `adIconImageView` , `adChoicesView`, `adAdvertiserNameLabel`, `adSponsoredLabel`, and `adCallToActionButton`.


![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/32697980_127865791412100_7870203896889606144_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=8-dKiFpDpNYQ7kNvwGdyeS3&_nc_oc=AdoxkZMnxTKfhriGy_X0E86PkqTzQKFz76g8GAyw3L5U5kYMrh43m4iodghsQ3VVLCg&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=HsIF4pjYixxuo5B4SCwLjw&_nc_ss=7b289&oh=00_Af6Kko_ngGFcjQZx0HhoCevXvMnyaK5dkDWCtj1Fge6tiQ&oe=6A25868E)

8. Build and run the project. You should see from your device or simulator empty content as follows:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/32737647_1063002020517917_3971030949751160832_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=RSz9hANXEzEQ7kNvwGt9hvJ&_nc_oc=AdrPzcU2HKUwxOejyTVd5dV7WRekEz1-doEKKe9uvJmOq0A0PLfUpeb9emfsL-A_tpw&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=HsIF4pjYixxuo5B4SCwLjw&_nc_ss=7b289&oh=00_Af45NITHyfV4Lyx4Zpil-kqTpa99Pk1fcO4mYBQSC-6vMA&oe=6A258E28)

Now that you have created all the UI elements to show native banner ads, the next step is to load the native banner ad and bind the contents to the UI elements.

## Step 2: Load and Show Native Banner Ad

1. Now, in your View Controller header file (or Swift file, if you are a Swift user), import `FBAudienceNetwork`, declare conformance to the `FBNativeBannerAdDelegate` protocol, and add an instance variable for the ad unit



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


3. In `viewDidLoad` method, add the following lines of code to load native ad content



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

4.
    The next step is to show ad when content is ready. You would need your View Controller to implement the `nativeBannerAdDidLoad` method




SwiftObjective-C





```swift
func nativeBannerAdDidLoad(_ nativeBannerAd: FBNativeBannerAd) {

     if let previousAd = self.nativeBannerAd, previousAd.isAdValid {
       previousAd.unregisterView()
     }

     self.nativeBannerAd = nativeBannerAd

     adAdvertiserNameLabel.text = nativeBannerAd.advertiserName
     adSponsoredLabel.text = nativeBannerAd.sponsoredTranslation

     if let callToAction = nativeBannerAd.callToAction {
       adCallToActionButton.isHidden = false
       adCallToActionButton.setTitle(callToAction, for: .normal)
     } else {
       adCallToActionButton.isHidden = true
     }

     // Set native banner ad view tags to declare roles of your views for better analysis in future
     // We will be able to provide you statistics how often these views were clicked by users
     // Views provided by Facebook already have appropriate tag set
     self.adAdvertiserNameLabel.nativeAdViewTag = .title
     self.adCallToActionButton.nativeAdViewTag = .callToAction

     // Specify the clickable areas. View you were using to set ad view tags should be clickable.
     let clickableViews: [UIView] = [adCallToActionButton]
     nativeBannerAd.registerView(
       forInteraction: adUIView,
       iconView: adIconImageView,
       viewController: self,
       clickableViews: clickableViews
     )

     /*
      // If you don't want to provide native ad view tags you can simply
      // Wire up UIView with the native banner ad; the whole UIView will be clickable.
      nativeBannerAd.registerView(
      forInteraction: adUIView,
      iconView: adIconImageView,
      viewController: self
      )
      */

     adChoicesView.corner = .topLeft
     adChoicesView.nativeAd = nativeBannerAd
}
```















```m
- (void)nativeBannerAdDidLoad:(FBNativeBannerAd *)nativeBannerAd
{
if (self.nativeBannerAd && self.nativeBannerAd.isAdValid) {
    [self.nativeBannerAd unregisterView];
}

self.nativeBannerAd = nativeBannerAd;

// Render native banner ads onto UIView
self.adAdvertiserNameLabel.text = self.nativeBannerAd.advertiserName;
self.adSponsoredLabel.text = self.nativeBannerAd.sponsoredTranslation;

if (self.nativeBannerAd.callToAction) {
[self.adCallToActionButton setHidden:NO];
[self.adCallToActionButton setTitle:self.nativeBannerAd.callToAction forState:UIControlStateNormal];
} else {
    [self.adCallToActionButton setHidden:YES];
}

// Set native banner ad view tags to declare roles of your views for better analysis in future
// We will be able to provide you statistics how often these views were clicked by users
// Views provided by Facebook already have appropriate tag set
self.adAdvertiserNameLabel.nativeAdViewTag = FBNativeAdViewTagTitle;
self.adCallToActionButton.nativeAdViewTag = FBNativeAdViewTagCallToAction;

// Specify the clickable areas. View you were using to set ad view tags should be clickable.
NSArray<UIView *> *clickableViews = @[self.adCallToActionButton];
[nativeBannerAd registerViewForInteraction:self.adUIView\
                                    iconView:self.adIconImageView\
                              viewController:self\
                              clickableViews:clickableViews];

// If you don't want to provide native ad view tags you can simply
// Wire up UIView with the native banner ad; the whole UIView will be clickable.
// [nativeBannerAd registerViewForInteraction:self.adUIView\
//                                   iconView:self.adIconView\
//                             viewController:self];

self.adChoicesView.corner = UIRectCornerTopLeft;
self.adChoicesView.nativeAd = nativeBannerAd;
}
```

First, you need to check if there is an existing valid `FBNativeBannerAd` object. If there is, you will need to unregister it your register the new ad object

### Controlling Clickable Area

For a better user experience and better results, you should always consider controlling the clickable area of your ad to avoid unintentional clicks. Please refer to [Audience Network SDK Policy](https://developers.facebook.com/docs/audience-network/policy) page for more details about white space unclickable enforcement.


What `registerViewForInteraction` mainly does is register what views will be tappable and what the delegate is to notify when a registered view is tapped. In this case, `adCallToActionButton` will be tappable and when the view is tapped, `ViewController` will be notified through `FBNativeBannerAdDelegate`.


5. Choose your build target to be device and run the above code, you should see something like this:



![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/32762517_224839771637151_8550022968451792896_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=3ZRt3BgzKtEQ7kNvwHTjY_6&_nc_oc=AdoytUDPzBcV8mX8-8d5zYxyAR5sfGmXqee975DdjeROzq7DKDO6id2iPrbNfVPx-uU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=HsIF4pjYixxuo5B4SCwLjw&_nc_ss=7b289&oh=00_Af5VKFwWPCG4XajDQ7_RpEhwTF9StWjtYG-MqLM-0r0Veg&oe=6A25890E)


When running ads in the simulator, change the setting to test mode to view test ads. Please go to [How to Use Test Mode](https://developers.facebook.com/docs/audience-network/testing#testing-testAd) for more information.

## Step 3: Verify Impression and Click Logging

Optionally, you can add the following functions to handle the cases where the native banner ad is closed or when the user clicks on it:

SwiftObjective-C

```swift
func nativeBannerAdDidClick(_ nativeBannerAd: FBNativeBannerAd) {
  print("Native banner ad was clicked.")
}

func nativeBannerAdDidFinishHandlingClick(_ nativeBannerAd: FBNativeBannerAd) {
  print("Native banner ad did finish click handling.")
}

func nativeBannerAdWillLogImpression(_ nativeBannerAd: FBNativeBannerAd) {
  print("Native banner ad impression is being captured.")
}
```

```m
- (void)nativeBannerAdDidClick:(FBNativeBannerAd *)nativeBannerAd
{
    NSLog(@"Native banner ad was clicked.");
}

- (void)nativeBannerAdDidFinishHandlingClick:(FBNativeBannerAd *)nativeBannerAd
{
    NSLog(@"Native banner ad did finish click handling.");
}

- (void)nativeBannerAdWillLogImpression:(FBNativeBannerAd *)nativeBannerAd
{
    NSLog(@"Native banner ad impression is being captured.");
}
```

## Step 4: How to Debug When Ad Not Shown

Add and implement the following function in your View Controller to handle ad loading failures

SwiftObjective-C

```swift
func nativeBannerAd(_ nativeBannerAd: FBNativeBannerAd, didFailWithError error: Error) {
  print("Native banner ad failed to load with error: \(error.localizedDescription)")
}
```

```m
- (void)nativeBannerAd:(FBNativeBannerAd *)nativeBannerAd didFailWithError:(NSError *)error
{
    NSLog(@"Native banner ad failed to load with error: %@", error);
}
```

## Next steps

Learn more about the [ad formats](https://developers.facebook.com/docs/audience-network/ad-formats/) available for Audience Network apps.

### See also

- Visit [our GitHub sample app repository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fios&h=AUCXvPzsxtmt5i89poYwJyjIj4AFV1Q44dFVrmu5a9J2K27pWtcGSu2LxAlUh6pkwN5WEl2jtX1aUA-7vo1Tsgsj8DUlr3SiKjB9Bbawq7tikLhQap2ykiUbxRmrS9juVhDKFuV5vHrQdA) to view sample code.
- View the [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards) to ensure you app complies.

|     |
| --- |
| # More Resources |

|     |     |
| --- | --- |
| #### [Getting Started Guide](https://developers.facebook.com/docs/audience-network/getting-started)<br>Technical guide to get started with the Audience Network<br>#### [Code Samples](https://developers.facebook.com/docs/audience-network/samples)<br>Audience Network Ads Integration Samples | #### [FAQ](https://developers.facebook.com/docs/audience-network/faq)<br>Audience Network FAQ<br>#### [Native Ads Template](https://developers.facebook.com/docs/audience-network/ios/nativeadtemplate)<br>A more hands off approach when integrating Native Ads |

On This Page

[Add Native Banner Ads to an iOS App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#add-native-banner-ads-to-an-ios-app)

[Step 1: Create Native Banner Ad Views in Storyboard](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#ui)

[Step 2: Load and Show Native Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#load)

[Controlling Clickable Area](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#controlling-clickable-area)

[Step 3: Verify Impression and Click Logging](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#logging)

[Step 4: How to Debug When Ad Not Shown](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#debug)

[Next steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#next-steps)

[See also](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios/native-banner#see-also)