---
url: https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices/android
title: Android - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Faudio-best-practices%2Fandroid%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

On This Page

[Audio on Android](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices/android#audio-on-android)

[Audio Guide for Android](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices/android#audio-android)

# Audio on Android

## Audio Guide for Android

1. We create a media player instance that can play a music file when the Activity is loaded as following:


```code
class AudioDemoActivity extends AppCompatActivity {

       protected  MediaPlayer mMediaPlayer;

       @Override
       protected void onCreate(@Nullable Bundle savedInstanceState) {
           super.onCreate(savedInstanceState);
           this.setContentView(R.layout.activity_native_ad);

           // Create MediaPlayer Instance by Audio File in the res/raw Folder
           this.mMediaPlayer = MediaPlayer.create(this, R.raw.background_theme);
           this.mMediaPlayer.start();
       }
}

```

2. We create a native ad instance that will be loaded when `loadNativeAd` is called. For testing purpose, we can fetch for a video test ad by initializing the placement ID with `VID_HD_9_16_39S_APP_INSTALL#YOUR_PLACEMENT_ID`. You should fill YOUR\_PLACEMENT\_ID with the one created from your app dashboard.




Please refer to [How to Use Test Mode](https://developers.facebook.com/docs/audience-network/testing#testing-testAd) for more information.




```code
private NativeAd mNativeAd;

protected void loadNativeAd() {

       NativeAd nativeAd = new NativeAd(this, "VID_HD_9_16_39S_APP_INSTALL#YOUR_PLACEMENT_ID");

       // Initiate a request to load an ad with cache all media
       // and a listener to get notified when the ad was loaded.
       nativeAd.loadAd(NativeAd.MediaCacheFlag.ALL);
       nativeAd.loadAd(
               nativeAd.buildLoadAdConfig()
                       .withAdListener(this)
                       .withMediaCacheFlag(NativeAdBase.MediaCacheFlag.ALL)
                       .build());
}
```

3. Implement AudioDemoActivity with `AdListener` and `MediaViewListener`.


    Declare `mAdCoverMediaView` property with `MediaView` type in order to show video ad.


    When `onAdLoaded` is called to `AdListener`, set `mNativeAd` property to `mAdCoverMediaView` property in order to render the video ad. Please refer to [Native Ad Integration](https://developers.facebook.com/docs/audience-network/android-native) for more details about showing the native ad in your app.




    Implement `onVolumeChange` method defined in `AdListener`. When a video ad plays with sound, the volume will be greater than 0. The music file playing in your app can be paused. when the video ad is stopped, the volume will be 0 and your app can resume music file playing.



```code
class AudioDemoActivity extends AppCompatActivity implements AdListener, MediaViewListener {

       protected MediaView mAdCoverMediaView;

       /**
        * Ad Listener Implementation
        */
       @Override
       public void onAdLoaded(Ad ad) {

           if (this.mNativeAd != null) {
               this.mNativeAd.unregisterView();
           }

           this.mNativeAd = (NativeAd) ad;

           // Create native UI using the ad metadata.
           this.mAdCoverMediaView.setNativeAd(this.mNativeAd);
           this.mAdCoverMediaView.setListener(this);

           // Follow Audience Network Native Ad implementation for creating and rendering other ad assets  including ad icon, ad title, ad CTA button and more.
       }

       /**
        * MediaViewListener Implementation
        */
       @Override
       public void onVolumeChange(MediaView mediaView, float volume) {
           if (volume > 0) {
               // Pause music playing if video ad plays with sound
               this.mMediaPlayer.pause();
           } else {
               // Resume music playing
               this.mMediaPlayer.start();
           }
       }
}
```

4. For bringing optimal user experience for showing the rewarded video ad, you should implement `RewardedVideoAdListener` in your activity. You should pause the music file playing before presenting the rewarded video ad in full screen. After the rewarded video ad is closed, you should resume the music file playing. Please refer to [Rewarded Video Ad Integration](https://developers.facebook.com/docs/audience-network/android/rewarded-video) for more details about showing the native ad in your app.



```code
class AudioDemoActivity extends AppCompatActivity implements RewardedVideoAdListener {

       protected MediaPlayer mMediaPlayer;
       protected RewardedVideoAd mRewardedVideoAd;

       /**
        * RewardedVideoAdListener Implementation
        */
       @Override
       public void onRewardedVideoClosed() {
           this.mMediaPlayer.start();
       }

       @Override
       public void onAdLoaded(Ad ad) {
           this.mMediaPlayer.pause();

           // Ad is ready, present it!
           this.mRewardedVideoAd.show();
       }
}
```


On This Page

[Audio on Android](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices/android#audio-on-android)

[Audio Guide for Android](https://developers.facebook.com/docs/audience-network/optimization/audio-best-practices/android#audio-android)