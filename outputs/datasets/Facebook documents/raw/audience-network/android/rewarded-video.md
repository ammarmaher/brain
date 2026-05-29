---
url: https://developers.facebook.com/docs/audience-network/android/rewarded-video
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fandroid%2Frewarded-video%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)


  - [Android](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android)


    - [Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner)
    - [Interstitial Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/interstitial)
    - [Native Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native)
    - [Native Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner)
    - [Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video)
    - [Rewarded Interstitial Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-interstitial)

  - [iOS](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/ios)
  - [Unity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/unity)

- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)
- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Add Rewarded Video Ads to an Android App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#add-rewarded-video-ads-to-an-android-app)

[Step-by-Step](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#step-by-step)

[Initialize the Audience Network SDK](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#initialize-the-audience-network-sdk)

[Step 1: Initializing Rewarded Video Ads in your Activity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#implementation)

[Step 2: Showing Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#showing)

[Server Side Reward Validation](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#server-side-reward-validation)

[Overview](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#overview)

[Implementation](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#implementation-2)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#next_steps)

# Add Rewarded Video Ads to an Android App

The Audience Network allows you to monetize your Android apps with Facebook ads. Rewarded video ads are a full screen experience where users opt-in to view a video ad in exchange for something of value, such as virtual currency, in-app items, exclusive content, and more. The ad experience is 15-30 second non-skippable and contains an end card with a call to action. Upon completion of the full video, you will receive a callback to grant the suggested reward to the user.

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [Android Getting Started](https://developers.facebook.com/docs/audience-network/android) guides before you proceed.

## Step-by-Step

#### [Step 1: Initializing Rewarded Video Ads in your Activity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video\#implementation)

#### [Step 2: Showing Rewarded Video Ads in your Activity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video\#showing)

## Initialize the Audience Network SDK

This method was added in the Android Audience Network SDK version 5.1.

Explicit initialization of the Audience Network Android SDK is required for version `5.3.0` and greater. Please refer to [this document](https://developers.facebook.com/docs/audience-network/android-sdk-initialize/) about how to initialize the Audience Network Android SDK.

Before creating an ad object and loading ads, you should initialize the Audience Network SDK. It is recommended to do this at app launch.

```code
public class YourApplication extends Application {
    ...
    @Override
    public void onCreate() {
        super.onCreate();
        // Initialize the Audience Network SDK
        AudienceNetworkAds.initialize(this);
    }
    ...
}
```

## Step 1: Initializing Rewarded Video Ads in your Activity

Add the following code at the top of your Activity in order to import the Facebook Ads SDK:

```code
import com.facebook.ads.*;
```

Then, initialize the rewarded video object, set the listener and load the video creative. The rewarded video ad requires a `RewardedVideoAdListener` interface which implements the following methods in the sample code to handle various events. For example in your activity:

```code
private final String TAG = RewardedVideoAdActivity.class.getSimpleName();
private RewardedVideoAd rewardedVideoAd;

@Override
public void onCreate(Bundle savedInstanceState) {
    ...
    // Instantiate a RewardedVideoAd object.
    // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
    // now, while you are testing and replace it later when you have signed up.
    // While you are using this temporary code you will only get test ads and if you release
    // your code like this to the Google Play your users will not receive ads (you will get
    // a no fill error).
    rewardedVideoAd = new RewardedVideoAd(this, "YOUR_PLACEMENT_ID");
    RewardedVideoAdListener rewardedVideoAdListener = new RewardedVideoAdListener() {
        @Override
        public void onError(Ad ad, AdError error) {
            // Rewarded video ad failed to load
            Log.e(TAG, "Rewarded video ad failed to load: " + error.getErrorMessage());
        }

        @Override
        public void onAdLoaded(Ad ad) {
            // Rewarded video ad is loaded and ready to be displayed
            Log.d(TAG, "Rewarded video ad is loaded and ready to be displayed!");
        }

        @Override
        public void onAdClicked(Ad ad) {
            // Rewarded video ad clicked
            Log.d(TAG, "Rewarded video ad clicked!");
        }

        @Override
        public void onLoggingImpression(Ad ad) {
            // Rewarded Video ad impression - the event will fire when the
            // video starts playing
            Log.d(TAG, "Rewarded video ad impression logged!");
        }

        @Override
        public void onRewardedVideoCompleted() {
            // Rewarded Video View Complete - the video has been played to the end.
            // You can use this event to initialize your reward
            Log.d(TAG, "Rewarded video completed!");

            // Call method to give reward
            // giveReward();
        }

        @Override
        public void onRewardedVideoClosed() {
            // The Rewarded Video ad was closed - this can occur during the video
            // by closing the app, or closing the end card.
            Log.d(TAG, "Rewarded video ad closed!");
        }
    };
    rewardedVideoAd.loadAd(
            rewardedVideoAd.buildLoadAdConfig()
                    .withAdListener(rewardedVideoAdListener)
                    .build());
    ...
}
```

## Step 2: Showing Rewarded Video Ads

#### Scenario 1: Immediately display the ad once it is loaded successfully. Modify the onAdLoaded() method above to display it as follows:

```code
private RewardedVideoAd rewardedVideoAd;

@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    ...
    // Instantiate a RewardedVideoAd object.
    // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
    // now, while you are testing and replace it later when you have signed up.
    // While you are using this temporary code you will only get test ads and if you release
    // your code like this to the Google Play your users will not receive ads (you will get
    // a no fill error).
    rewardedVideoAd = new RewardedVideoAd(this, "YOUR_PLACEMENT_ID");
    RewardedVideoAdListener rewardedVideoAdListener = new RewardedVideoAdListener() {
        ...
        @Override
        public void onAdLoaded(Ad ad) {
            // Rewarded video ad is loaded and ready to be displayed
            rewardedVideoAd.show();
        }
        ...
    };
    rewardedVideoAd.loadAd(
            rewardedVideoAd.buildLoadAdConfig()
                    .withAdListener(rewardedVideoAdListener)
                    .build());
    ...
}
```

#### Scenario 2: Display the ad in a few seconds or minutes after it is successfully loaded. You should check whether the ad has been invalidated before displaying it.

In case of not showing the ad immediately after the ad has been **loaded**, the developer is responsible for checking whether or not the ad has been invalidated. Once the ad is successfully loaded, the ad will be valid for **60 mins**. You will **not** get **paid** if you are showing an **invalidated** ad. You should call `isAdInvalidated()` to validate the ad.

You should follow the idea below, but please do not copy the code into your project since it is just an example:

```code
private RewardedVideoAd rewardedVideoAd;

@Override
protected void onCreate(@Nullable Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    ...
    // Instantiate a RewardedVideoAd object.
    // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
    // now, while you are testing and replace it later when you have signed up.
    // While you are using this temporary code you will only get test ads and if you release
    // your code like this to the Google Play your users will not receive ads (you will get
    // a no fill error).
    rewardedVideoAd = new RewardedVideoAd(this, "YOUR_PLACEMENT_ID");
    RewardedVideoAdListener rewardedVideoAdListener = new RewardedVideoAdListener() {
        ...
    };
    // load the ad
    rewardedVideoAd.loadAd(
            rewardedVideoAd.buildLoadAdConfig()
                    .withAdListener(rewardedVideoAdListener)
                    .build());

    // Here is just an example for displaying the ad with delay
    // Please call this method at appropriate timing in your project
    showAdWithDelay();
}

private void showAdWithDelay() {
    /**
     * Here is an example for displaying the ad with delay;
     * Please do not copy the Handler into your project
     */
    // Handler handler = new Handler();
    handler.postDelayed(new Runnable() {
        public void run() {
            // Check if rewardedVideoAd has been loaded successfully
            if (rewardedVideoAd == null || !rewardedVideoAd.isAdLoaded()) {
                return;
            }
            // Check if ad is already expired or invalidated, and do not show ad if that is the case. You will not get paid to show an invalidated ad.
            if (rewardedVideoAd.isAdInvalidated()) {
                return;
            }
            rewardedVideoAd.show();
        }
    }, 1000 * 60 * 15); // Show the ad after 15 minutes
}
```

If you are using the default Google Android emulator, you'll add the following line of code before loading a test ad:

`AdSettings.addTestDevice("HASHED ID");`.

Use the hashed ID that is printed to logcat when you first make a request to load an ad on a device.

Genymotion and physical devices do not need this step. If you would like to test with real ads, please consult our [Testing Guide](https://developers.facebook.com/docs/audience-network/testing).

Finally, clean up the object with its `destroy` method in your activity's `onDestroy` method. Note that you should also use the `destroy` method to clean up old ad objects before assigning it to a new instance to avoid memory leak.

```code
@Override
protected void onDestroy() {
    if (rewardedVideoAd != null) {
        rewardedVideoAd.destroy();
        rewardedVideoAd = null;
    }
    super.onDestroy();
}
```

# Hardware Acceleration for Video Ads

Videos ads in Audience Network requires the [hardware accelerated rendering](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Fguide%2Ftopics%2Fgraphics%2Fhardware-accel.html&h=AUAhi7TcdQdenmMgRnbRhEf87kgDt0hVqVVohXhR-RsRPugYo219imr_L8c5SFBs_eZbh2w8XJ50rVqrpXkKjg-qrKvbWQtJpQy0AJCEmuNQXFymB-v6d2lXgohPnEtHOd-cU3epcNkyEA) to be enabled, otherwise you might experience a black screen in the video views. This applies to

- Videos creatives in Native Ads

- Videos creatives in Interstitials

- In-stream Video ads

- Rewarded Videos


Hardware acceleration is enabled by default if your Target API level is >=14 (Ice Cream Sandwich, Android 4.0.1), but you can also explicitly enable this feature at the application level or activity level.

## Application Level

In your Android manifest file, add the following attribute to the `<application>` tag to enable hardware acceleration for your entire application:

```
<application android:hardwareAccelerated="true" ...>
```

## Activity Level

If you only want to enable the feature for specific activities in your application, in your Android manifest file, you can add the following feature to the `<activity>` tag. The following example will enable the hardware acceleration for the `AudienceNetworkActivity` which is used for rendering interstitial ads and rewarded videos:

```
<activity android:name="com.facebook.ads.AudienceNetworkActivity" android:hardwareAccelerated="true" .../>
```

## Server Side Reward Validation

This is optional! You don't have to implement server side reward validation to make use of rewarded video ads.
This is only required if you decide to validate rewards on your own server to improve the security by introducing a validation step at your own server.
Please provide your publisher end point to your Facebook representative in order to enable this feature.

### Overview

If you manage your user rewards server-side, then Facebook offers a solution for carrying this out securely by using a validation technique. Our server will communicate with a specified https endpoint to validate each ad impression and validate whether a reward should be granted.

1. Audience Network SDK requests a rewarded video ad with the following parameters:

   - Audience Network Placement ID
   - Unique User ID - an attribute you use to identify a unique user. For example, a numeric identifier
   - Reward Value - the value of the reward you would like to grant the user. For example, 100Coins
2. Upon video completion, the Facebook Server relays these values to your specified end point, together with the App Secret and a Unique Transaction ID.
3. Upon receipt, the server validates the request and responds as follows:

   - 200 response: request is valid and the reward should be delivered
   - Non 200 response: request is not valid, and the reward should not be delivered.
4. Once the video is complete, the end card is presented and one of the following events will fire.

   - `onRewardServerSuccess` \- triggered only if a 200 response was received during step 3.
   - `onRewardServerFailed` \- triggered if a non 200 response was received during step 3.

An example of the URL which will hit your publisher end point, from Facebook's server:
https://www.your\_end\_point.com/?token=APP\_SECRET&puid=USER\_ID&pc=REWARD\_ID&ptid=UNIQUE\_TRANSACTION\_ID

The workflow will look like this:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/21624464_133082333991738_1115107113589276672_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=cHOnrKk63EMQ7kNvwE3h-ho&_nc_oc=AdrqnxDBP8xyaLQ51yrh2Mkixt9bxuT_F4opCnkpODU4sw4ZTqVmAL2YMWOuNk2_R98&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=mOztvWVDMpKa4XF5mFI8Ug&_nc_ss=7b289&oh=00_Af6GWO-Lt7oo94yGhH2B-EgG3Yu_P--LXjXZ5SPBKYDtMg&oe=6A257B9C)

### Implementation

After initializing the rewarded video object, you will need to pass in a User ID and Reward amount into the rewarded ad data before loading an ad. Both User ID and Reward amount are strings. For example:

```code
private RewardedVideoAd rewardedVideoAd;

private void loadRewardedVideoAd {
    // Instantiate a RewardedVideoAd object.
    // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
    // now, while you are testing and replace it later when you have signed up.
    // While you are using this temporary code you will only get test ads and if you release
    // your code like this to the Google Play your users will not receive ads (you will get
    // a no fill error).
    rewardedVideoAd = new RewardedVideoAd(this, "YOUR_PLACEMENT_ID");
    RewardedVideoAdListener rewardedVideoAdListener = new RewardedVideoAdListener() {
        ...
    };

    // Create the rewarded ad data
    RewardData rewardData = new RewardData("YOUR_USER_ID", "YOUR_REWARD");

    rewardedVideoAd.loadAd(
            rewardedVideoAd.buildLoadAdConfig()
                    .withAdListener(rewardedVideoAdListener)
                    .withRewardData(rewardData)
                    .build());
}
```

In order for your app to be notified whether the reward was validated or not, you will need to implement the `S2SRewardedVideoAdListener` interface. This includes all of the events noted above in the `RewardedVideoAdListener` interface, as well as two additional events. The following can be used alongise the events monetioned above.

```code
@Override
public void onRewardServerSuccess() {
    // Rewarded video ad validated
}

@Override
public void onRewardServerFailed() {
    // Rewarded video ad not validated or no response from server
}
```

Please note - the server validation callbacks might occur after the end card has been dismissed by a user. You should not deallocate the rewarded video object until after one of these callbacks.

## Next Steps

- Once your app has a link, you can [configure Audience Network](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup/) in Monetization Manager to get ad format placement IDs.

- Follow our guides for integrating different ad formats in your app:


  - [Banner and Medium Rectangle Ads](https://developers.facebook.com/docs/audience-network/android-banners)
  - [Native Ads](https://developers.facebook.com/docs/audience-network/android-native)
  - [Native Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner)
  - [Interstitial Ads](https://developers.facebook.com/docs/audience-network/android-interstitial)
  - [Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video)

- Relevant code samples in both Swift and Objective-C are available on our [GitHub sample app respository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fandroid&h=AUD3eGb9O8b7n8V7vcZ4A_CwNEHjsgAUNUN5tSZbGq11YxfjevzDIe-DTr2bAE-oMcPUnHLXQ8jTgG748elGDga7JNnhARcKPnKYmipyM1J9-2z91hfkoS65v519rYFg2cGfCMVuucbKXQ)

- [Test your ads integration](https://developers.facebook.com/docs/audience-network/setting-up/testing) with your app.

- As soon as we receive a request for an ad from your app or website, we'll review it to make sure it complies with [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards)


On This Page

[Add Rewarded Video Ads to an Android App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#add-rewarded-video-ads-to-an-android-app)

[Step-by-Step](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#step-by-step)

[Initialize the Audience Network SDK](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#initialize-the-audience-network-sdk)

[Step 1: Initializing Rewarded Video Ads in your Activity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#implementation)

[Step 2: Showing Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#showing)

[Server Side Reward Validation](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#server-side-reward-validation)

[Overview](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#overview)

[Implementation](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#implementation-2)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video#next_steps)