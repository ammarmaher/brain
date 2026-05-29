---
url: https://developers.facebook.com/docs/audience-network/android-native-banner
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fandroid%2Fnative-banner%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Add Native Banner Ads to an Android App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#add-native-banner-ads-to-an-android-app)

[Native Banner Ad Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#native-banner-ad-steps)

[Initialize the Audience Network SDK](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#initialize-the-audience-network-sdk)

[Step 1: Requesting a Native Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#request)

[Step 2: Creating your Native Banner Ad Layout](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#layout)

[Step 3: Populating your Layout Using the Ad's Metadata](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#populating)

[Controlling Clickable Area](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#controlling-clickable-area)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#next_steps)

# Add Native Banner Ads to an Android App

The native banner ad API allows you to build a customized experience for showing a native ad **without** the advertiser's creative assets, such as image, video, or carousel content. Similar to native ads, you will receive a group of **Ad Properties** such as a title, an icon, and a call-to-action, and you will use them to construct a custom view where the ad is shown. However, unlike banner ads, **native banner ad** API provides a **native layout** experience so you have full control of customizing the layout for components inside the ad.

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [Android Getting Started](https://developers.facebook.com/docs/audience-network/android) guides before you proceed.

In this guide we will implement the following native banner ad placement. You will create a native banner ad with the following components:

|     |     |
| --- | --- |
| #### View \#1: AdOptionsView<br>#### View \#2: Sponsored Label<br>#### View \#3: Ad Icon | #### View \#4: Ad Title<br>#### View \#5: Social Context<br>#### View \#6: Call-to-Action button |

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/48839377_517350905416264_4773896775599652864_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=k37zbnJgLAYQ7kNvwE6XRO5&_nc_oc=AdohpPXcoFxLd0W6EkTH7hR49lecReX88EaE4QbAM7jl_-2xgSXNdaJ4TWCTG8ciH2c&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=esD-n0JmP_l-wd7Ap5Jkrg&_nc_ss=7b289&oh=00_Af4bB3kZnosEtD2FPge-1X0ncYD9x453_5EJ0MP-URhuEw&oe=6A2573A9)

## Native Banner Ad Steps

#### [Step 1: Requesting a Native Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner\#request)

#### [Step 2: Creating your Native Banner Ad Layout](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner\#layout)

#### [Step 3: Populating your Layout Using the Ad's Metadata](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner\#populating)

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

## Step 1: Requesting a Native Banner Ad

Add the following code at the top of your Activity to import the Facebook Ads SDK:

```code
import com.facebook.ads.*;
```

Then, instantiate a `NativeBannerAd` object, create an `AdListener`, and call `loadAd(...)` in your Activity:

```code
public class NativeBannerAdActivity extends Activity {

    private final String TAG = NativeBannerAdActivity.class.getSimpleName();
    private NativeBannerAd nativeBannerAd;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Instantiate a NativeBannerAd object.
        // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
        // now, while you are testing and replace it later when you have signed up.
        // While you are using this temporary code you will only get test ads and if you release
        // your code like this to the Google Play your users will not receive ads (you will get a no fill error).
        nativeBannerAd = new NativeBannerAd(this, "YOUR_PLACEMENT_ID");
        NativeAdListener nativeAdListener = new NativeAdListener() {

            @Override
            public void onMediaDownloaded(Ad ad) {
                // Native ad finished downloading all assets
                Log.e(TAG, "Native ad finished downloading all assets.");
            }

            @Override
            public void onError(Ad ad, AdError adError) {
                // Native ad failed to load
                Log.e(TAG, "Native ad failed to load: " + adError.getErrorMessage());
            }

            @Override
            public void onAdLoaded(Ad ad) {
                // Native ad is loaded and ready to be displayed
                Log.d(TAG, "Native ad is loaded and ready to be displayed!");
            }

            @Override
            public void onAdClicked(Ad ad) {
                // Native ad clicked
                Log.d(TAG, "Native ad clicked!");
            }

            @Override
            public void onLoggingImpression(Ad ad) {
                // Native ad impression
                Log.d(TAG, "Native ad impression logged!");
            }
        });
        // load the ad
        nativeBannerAd.loadAd(
                nativeBannerAd.buildLoadAdConfig()
                        .withAdListener(nativeAdListener)
                        .build());
    }
}
```

We will be coming back later to add code to the `onAdLoaded()` method.

## Step 2: Creating your Native Banner Ad Layout

The next step is to extract the ad metadata and use its properties to build your customized native UI.
You can either create your custom view in a layout .xml, or you can add elements in code.

Please consult [our guidelines for native ads](https://developers.facebook.com/docs/audience-network/guidelines/native-ads#banner) when designing native banner ads in your app.

In your Activity's layout `activity_main.xml`, add a container for your native banner ad. The container should be a com.facebook.ads.NativeAdLayout which is a wrapper on top of a FrameLayout with some extra functionality that enabled us to render a native Ad Reporting Flow on top of the ad. Later, in `onAdLoaded()` method, you will need populate your native ad view into this container.

```code
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    ...
    <com.facebook.ads.NativeAdLayout
        android:id="@+id/native_banner_ad_container"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true" />
    ...
</RelativeLayout>
```

Create a custom layout `native_banner_ad_unit.xml` for your Native Banner Ad:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/29795646_2146821975588206_9035957617020633088_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=aUgVmYaOddkQ7kNvwFhjmrH&_nc_oc=AdqIJcgvT4ydoldwZRqhpmZ-L3iK2w56ZazlpoVWWzQwkJ4kOSCfZPVxltn61KpEsng&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=esD-n0JmP_l-wd7Ap5Jkrg&_nc_ss=7b289&oh=00_Af5kqwy1xmqVMAS-KFRUgsLn75q-VaBJSVmV0FWGJudILg&oe=6A256F7A)

Below is an example custom layout for your native banner ad:

```code
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:orientation="vertical">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal">

        <RelativeLayout
            android:id="@+id/ad_choices_container"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:padding="2dp" />

        <TextView
            android:id="@+id/native_ad_sponsored_label"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_gravity="center_vertical"
            android:ellipsize="end"
            android:lines="1"
            android:padding="2dp"
            android:textColor="@android:color/darker_gray"
            android:textSize="12sp" />
    </LinearLayout>

    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:background="@android:color/white">

        <com.facebook.ads.MediaView
            android:id="@+id/native_icon_view"
            android:layout_width="50dp"
            android:layout_height="50dp"
            android:layout_alignParentLeft="true"
            android:layout_alignParentStart="true"
            android:gravity="center" />

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_centerVertical="true"
            android:orientation="vertical"
            android:paddingLeft="53dp"
            android:paddingRight="83dp">

            <TextView
                android:id="@+id/native_ad_title"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:ellipsize="end"
                android:lines="1"
                android:textColor="@android:color/black"
                android:textSize="15sp"
                android:textStyle="bold" />

            <TextView
                android:id="@+id/native_ad_social_context"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:ellipsize="end"
                android:lines="1"
                android:textSize="12sp" />
        </LinearLayout>

        <Button
            android:id="@+id/native_ad_call_to_action"
            android:layout_width="80dp"
            android:layout_height="50dp"
            android:layout_alignParentEnd="true"
            android:layout_alignParentRight="true"
            android:background="#4286F4"
            android:gravity="center"
            android:paddingLeft="3dp"
            android:paddingRight="3dp"
            android:textColor="@android:color/white"
            android:textSize="12sp"
            android:visibility="gone" />

    </RelativeLayout>
</LinearLayout>
```

## Step 3: Populating your Layout Using the Ad's Metadata

#### Scenario 1: Immediately display the ad once it is loaded successfully. Modify the `onAdLoaded()` method above to retrieve the `Native Banner Ad's` properties and display it as follows:

```code
public class NativeBannerAdActivity extends Activity {

    private NativeAdLayout nativeAdLayout;
    private LinearLayout adView;
    private NativeBannerAd nativeBannerAd;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Instantiate a NativeBannerAd object.
        // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
        // now, while you are testing and replace it later when you have signed up.
        // While you are using this temporary code you will only get test ads and if you release
        // your code like this to the Google Play your users will not receive ads (you will get a no fill error).
        nativeBannerAd = new NativeBannerAd(this, "YOUR_PLACEMENT_ID");
        NativeAdListener nativeAdListener = new NativeAdListener() {
            ...
            @Override
            public void onAdLoaded(Ad ad) {
                // Race condition, load() called again before last ad was displayed
                if (nativeBannerAd == null || nativeBannerAd != ad) {
                    return;
                 }
                // Inflate Native Banner Ad into Container
                inflateAd(nativeBannerAd);
            }
            ...
        });
        // load the ad
        nativeBannerAd.loadAd(
                nativeBannerAd.buildLoadAdConfig()
                        .withAdListener(nativeAdListener)
                        .build());
    }

    private void inflateAd(NativeBannerAd nativeBannerAd) {
        // Unregister last ad
        nativeBannerAd.unregisterView();

        // Add the Ad view into the ad container.
        nativeAdLayout = findViewById(R.id.native_banner_ad_container);
        LayoutInflater inflater = LayoutInflater.from(NativeBannerAdActivity.this);
        // Inflate the Ad view.  The layout referenced is the one you created in the last step.
        adView = (LinearLayout) inflater.inflate(R.layout.native_banner_ad_layout, nativeAdLayout, false);
        nativeAdLayout.addView(adView);

        // Add the AdChoices icon
        RelativeLayout adChoicesContainer = adView.findViewById(R.id.ad_choices_container);
        AdOptionsView adOptionsView = new AdOptionsView(NativeBannerAdActivity.this, nativeBannerAd, nativeAdLayout);
        adChoicesContainer.removeAllViews();
        adChoicesContainer.addView(adOptionsView, 0);

        // Create native UI using the ad metadata.
        TextView nativeAdTitle = adView.findViewById(R.id.native_ad_title);
        TextView nativeAdSocialContext = adView.findViewById(R.id.native_ad_social_context);
        TextView sponsoredLabel = adView.findViewById(R.id.native_ad_sponsored_label);
        MediaView nativeAdIconView = adView.findViewById(R.id.native_icon_view);
        Button nativeAdCallToAction = adView.findViewById(R.id.native_ad_call_to_action);

        // Set the Text.
        nativeAdCallToAction.setText(nativeBannerAd.getAdCallToAction());
        nativeAdCallToAction.setVisibility(
                nativeBannerAd.hasCallToAction() ? View.VISIBLE : View.INVISIBLE);
        nativeAdTitle.setText(nativeBannerAd.getAdvertiserName());
        nativeAdSocialContext.setText(nativeBannerAd.getAdSocialContext());
        sponsoredLabel.setText(nativeBannerAd.getSponsoredTranslation());

        // Register the Title and CTA button to listen for clicks.
        List<View> clickableViews = new ArrayList<>();
        clickableViews.add(nativeAdTitle);
        clickableViews.add(nativeAdCallToAction);
        nativeBannerAd.registerViewForInteraction(adView, nativeAdIconView, clickableViews);
    }
}
```

The SDK will log the impression and handle the click automatically. Please note that you must register the ad's view with the `NativeBannerAd` instance to enable that. To make the elements of your ad clickable, register it using:

```code
registerViewForInteraction(View view, MediaView adIconView)
```

#### Scenario 2: Display the ad in a few seconds or minutes after it is successfully loaded. You should check whether the ad has been invalidated before displaying it.

In case of not showing the ad immediately after the ad has been **loaded**, the developer is responsible for checking whether or not the ad has been invalidated. Once the ad is successfully loaded, the ad will be valid for **60 mins**. You will **not** get **paid** if you are showing an **invalidated** ad. You should call `isAdInvalidated()` to validate the ad.

You should follow the idea below, but please do not copy the code into your project since it is just an example:

```code
public class NativeBannerAdActivity extends Activity {

    private NativeBannerAd nativeBannerAd;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        // Instantiate a NativeBannerAd object.
        // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
        // now, while you are testing and replace it later when you have signed up.
        // While you are using this temporary code you will only get test ads and if you release
        // your code like this to the Google Play your users will not receive ads (you will get a no fill error).
        nativeBannerAd = new NativeBannerAd(this, "YOUR_PLACEMENT_ID");
         NativeAdListener nativeAdListener = new NativeAdListener() {
            ...
        });
        // load the ad
        nativeBannerAd.loadAd(
                nativeBannerAd.buildLoadAdConfig()
                        .withAdListener(nativeAdListener)
                        .build());
    }

    private void showAdWithDelay() {
       /**
        * Here is an example for displaying the ad with delay;
        * Please do not copy the Handler into your project
       */
       // Handler handler = new Handler();
       handler.postDelayed(new Runnable() {
           public void run() {
             // Check if nativeBannerAd has been loaded successfully
               if(nativeBannerAd == null || !nativeBannerAd.isAdLoaded()) {
                   return;
               }
             // Check if ad is already expired or invalidated, and do not show ad if that is the case. You will not get paid to show an invalidated ad.
               if(nativeBannerAd.isAdInvalidated()) {
                   return;
               }
               inflateAd(nativeBannerAd); // Inflate Native Banner Ad into Container same as in previous code example
           }
       }, 1000 * 60 * 15); // Show the ad after 15 minutes
    }
}
```

## Controlling Clickable Area

For a better user experience and better results, you should always consider controlling the clickable area of your ad to avoid unintentional clicks. Please refer to [Audience Network SDK Policy](https://developers.facebook.com/docs/audience-network/policy) page for more details about white space unclickable enforcement.

For finer control of what is clickable, you can use the `registerViewForInteraction(View view, MediaView adIconView, List<View> clickableViews)` to register a list of views that can be clicked. For example, if you only want to make the ad title and the call-to-action button clickable in the previous example, you can write it like this:

```code
@Override
public void onAdLoaded(Ad ad) {
  ...
  List<View> clickableViews = new ArrayList<>();
  clickableViews.add(nativeAdTitle);
  clickableViews.add(nativeAdCallToAction);
  nativeBannerAd.registerViewForInteraction(mAdView, nativeAdIconView, clickableViews);
  ...
}
```

In cases where you reuse the view to show different ads over time, make sure to call `unregisterView()` before registering the same view with a different instance of `NativeBannerAd`.

Run the code and you should see a Native Banner Ad:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/29795656_1651299961622164_7377778831182004224_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=7VtjGOGYaa4Q7kNvwFN2Ihu&_nc_oc=Adozs3g-sd0BLMt8IjDIaDzxhmA7ovZlA7No-rDu8JxYNz0qerYWEvP6hSEYmFweP8s&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=esD-n0JmP_l-wd7Ap5Jkrg&_nc_ss=7b289&oh=00_Af5iCnIiJ9Pwv-9aIcYjof4v0TDiODmZc2nV4hElsBfv8w&oe=6A2567AF)

When an ad is loaded, the following properties will include some value: `title`, `icon` and `callToAction`. Other properties might be null or empty. Make sure your code is robust enough to handle these cases.

When there is no ad to show, `onError` will be called with an `error.code`. If you use your own custom reporting or mediation layer you might want to check the code value and detect this case. You can fallback to another ad network in this case, but do not resend request an ad immediately after.

Ad metadata that you receive can be cached and re-used for up to 30 minutes. If you plan to use the metadata after this time period, make a call to load a new ad.

## Next Steps

- Once your app has a link, you can [configure Audience Network](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup/) in Monetization Manager to get ad format placement IDs.

- Follow our guides for integrating different ad formats in your app:


  - [Banner and Medium Rectangle Ads](https://developers.facebook.com/docs/audience-network/android-banners)
  - [Native Ads](https://developers.facebook.com/docs/audience-network/android-native)
  - [Native Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner)
  - [Interstitial Ads](https://developers.facebook.com/docs/audience-network/android-interstitial)
  - [Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video)

- Relevant code samples in both Swift and Objective-C are available on our [GitHub sample app respository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fandroid&h=AUDAfNBQtvjj9yv_0MZRnwbbbufOW8zox4Uhi-qdPKp3fdhUIc5cqmjCPwxV6iYjkeFLZyX6yL4K1CvZtGGX7o_l2uiwTYC6QWgz5WuzJhXVvEBPGB_9lbS40s8-BiYawpuOkVKFvHr_JQ)

- [Test your ads integration](https://developers.facebook.com/docs/audience-network/setting-up/testing) with your app.

- As soon as we receive a request for an ad from your app or website, we'll review it to make sure it complies with [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards)


- See the [Native Ad Template](https://developers.facebook.com/docs/audience-network/android/nativeadtemplate/) guide to add native ads in your app.

- Explore our code samples which demonstrate how to use native ads. The `NativeBannerAdSample` is available as part of the SDK and can be found under the `AudienceNetwork/samples` folder. Import the project to your IDE and run it either on a device or the emulator.


|     |
| --- |
| # More Resources |

|     |     |
| --- | --- |
| #### [Getting Started Guide](https://developers.facebook.com/docs/audience-network/getting-started)<br>Technical guide to get started with Audience Network<br>#### [Code Samples](https://developers.facebook.com/docs/audience-network/samples)<br>Audience Network Ads Integration Samples | #### [FAQ](https://developers.facebook.com/docs/audience-network/faq)<br>Audience Network FAQ<br>#### [Native Ads Template](https://developers.facebook.com/docs/audience-network/android/nativeadtemplate)<br>A more hands off approach when integrating Native Ads |

On This Page

[Add Native Banner Ads to an Android App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#add-native-banner-ads-to-an-android-app)

[Native Banner Ad Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#native-banner-ad-steps)

[Initialize the Audience Network SDK](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#initialize-the-audience-network-sdk)

[Step 1: Requesting a Native Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#request)

[Step 2: Creating your Native Banner Ad Layout](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#layout)

[Step 3: Populating your Layout Using the Ad's Metadata](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#populating)

[Controlling Clickable Area](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#controlling-clickable-area)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner#next_steps)