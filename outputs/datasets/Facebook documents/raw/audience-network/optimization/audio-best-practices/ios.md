---
url: https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices/ios
title: iOS - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Faudio-best-practices%2Fios%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)


  - [Layout Guidelines](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices)
  - [Audio Guidelines](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices)


    - [Android](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices/android)
    - [iOS](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices/ios)

  - [Policy](https://developers.facebook.com/docs/audience-network/optimization/best-practices/an-policy)
  - [Ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers)
  - [App-ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads)
  - [Data Processing Options for US Users](https://developers.facebook.com/docs/audience-network/optimization/best-practices/data-processing-options)
  - [COPPA](https://developers.facebook.com/docs/audience-network/optimization/best-practices/coppa)

- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

# Audio on iOS

## Audio Guide for iOS

1. We create an audio player instance that can play a music file when the view controller is loaded as following:


```code
@property (strong, nonatomic) AVAudioPlayer *audioPlayer;

- (void)viewDidLoad
{
    [super viewDidLoad];

    NSString *backgroundMusicPath = [[NSBundle mainBundle] pathForResource:@"BackgroundTheme" ofType:@"mp3"];
    NSURL *backgroundMusicURL = [NSURL fileURLWithPath:backgroundMusicPath];
    self.audioPlayer = [[AVAudioPlayer alloc] initWithContentsOfURL:backgroundMusicURL error:nil];
    [self.audioPlayer play];
}
```

2. We create a native ad instance that will be loaded when `loadNativeAd` is called. For testing purposes, we can fetch a video test ad by initializing the placement ID with `VID_HD_9_16_39S_APP_INSTALL#YOUR_PLACEMENT_ID`. You should fill YOUR\_PLACEMENT\_ID with the one created from your app dashboard.




Please refer to [How to Use Test Mode](https://developers.facebook.com/docs/audience-network/testing#testing-testAd) for more information.




```code
@property (strong, nonatomic) FBNativeAd *_nativeAd;

- (void)loadNativeAd
{
    FBNativeAd *nativeAd = [[FBNativeAd alloc] initWithPlacementID:@"VID_HD_9_16_39S_APP_INSTALL#YOUR_PLACEMENT_ID"];

    // Set a delegate to get notified when the ad was loaded.
    nativeAd.delegate = self;

    // Configure native ad to wait to call nativeAdDidLoad: until all ad assets are loaded
    nativeAd.mediaCachePolicy = FBNativeAdsCachePolicyAll;

    // Initiate a request to load an ad.
    [nativeAd loadAd];
}
```

3. Implement ViewContorller with `FBNativeAdDelegate` and `FBMediaViewDelegate`.


    Declare `adCoverMediaView` property with `FBMediaView` type in order to show video ad.


    When `nativeAdDidLoad` is called to `FBNativeAdDelegate`, set `nativeAd` property to `adCoverMediaView` property in order to render the video ad. Please refer to [Native Ad Integration](https://developers.facebook.com/docs/audience-network/ios-native) for more details about showing the native ad in your app.




    Implement `videoVolumeDidChange` method defined in `FBMediaViewDelegate` delegate. When a video ad plays with sound, the volume will be greater than 0. The music file playing in your app can be paused. When the video ad has stopped, the volume will be 0 and your app can resume music file playing.



```code
@interface ViewController : UIViewController <FBNativeAdDelegate, FBMediaViewDelegate>
@property (weak, nonatomic) IBOutlet FBMediaView *adCoverMediaView;
@end

#pragma mark - FBNativeAdDelegate
- (void)nativeAdDidLoad:(FBNativeAd *)nativeAd
{
    NSLog(@"Native ad was loaded, constructing native UI...");

    if (self._nativeAd) {
        [self._nativeAd unregisterView];
    }

    self._nativeAd = nativeAd;

    // Create native UI using the ad metadata.
    [self.adCoverMediaView setNativeAd:nativeAd];
    self.adCoverMediaView.delegate = self;

    // Follow Audience Network Native Ad implementation for creating and rendering other ad assets including ad icon, ad title, ad CTA button and more.
}

#pragma mark - FBMediaViewDelegate
- (void)mediaView:(FBMediaView *)mediaView videoVolumeDidChange:(float)volume
{
    if (volume > 0) {
         // Pause music playing if video ad plays with sound
        [self.audioPlayer pause];
    } else {
        // Resume music playing
        [self.audioPlayer play];
    }
}
```

4. For bringing optimal user experience for showing the rewarded video ad, you should implement `FBRewardedVideoAdDelegate` in your View Controller. You should pause the music file playing before presenting the rewarded video ad in full screen. After the rewarded video ad is closed, you should resume the music file playing. Please refer to [Rewarded Video Ad Integration](https://developers.facebook.com/docs/audience-network/ios/rewarded-video) for more details about showing the native ad in your app.





```code
@interface ViewController : UIViewController <FBRewardedVideoAdDelegate>
@property (nonatomic, strong) FBRewardedVideoAd *rewardedVideoAd;
@end

- (IBAction)showAd
{
    [self.audioPlayer pause];
    // Ad is ready, present it!
    [self.rewardedVideoAd showAdFromRootViewController:self animated:NO];
}
}


- (void)rewardedVideoAdDidClose:(FBRewardedVideoAd *)rewardedVideoAd
{
    [self.audioPlayer play];
}

```