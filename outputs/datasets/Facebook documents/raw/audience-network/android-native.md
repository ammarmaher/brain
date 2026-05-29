---
url: https://developers.facebook.com/docs/audience-network/android-native
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fandroid%2Fnative%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


      - [Android Template](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native/template)

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

[Add Native Ads to an Android App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#add-native-ads-to-an-android-app)

[Native Ad Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#native-ad-steps)

[Initialize the Audience Network SDK](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#initialize-the-audience-network-sdk)

[Step 1: Requesting a Native Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#request)

[Step 2: Creating your Native Ad Layout](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#layout)

[Step 3: Populating your Layout Using the Ad's Metadata](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#populating)

[Controlling Clickable Area](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#controlling-clickable-area)

[Step 4: Using MediaView](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#mediaview)

[Step 5: Load Ad without Auto Cache](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#mediaCachePolicy)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#next_steps)

# Add Native Ads to an Android App

The Native Ad API allows you to build a customized experience for the ads you show in your app. When using the Native Ad API, instead of receiving an ad ready to be displayed, you will receive a group of _ad properties_ such as a title, an image, a call to action, and you will have to use them to construct a custom view where the ad is shown.

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [Android Getting Started](https://developers.facebook.com/docs/audience-network/android) guides before you proceed.

In this guide we will implement the following native ad placement. You will create a native ad with the following components:

|     |     |
| --- | --- |
| #### View \#1: Ad Icon<br>#### View \#2: Ad Title<br>#### View \#3: Sponsored Label<br>#### View \#4: AdOptionsView | #### View \#5: MediaView<br>#### View \#6: Social Context<br>#### View \#7: Ad Body<br>#### View \#8: Call to Action button |

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/42517978_2173749832947693_7723854771769049088_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=w4OY2Gn3_mYQ7kNvwHFrTTa&_nc_oc=Adptfhn7Rj-7r2_vSOOIrkyxoLUqL7KUsktiYfrBHqgTVs9ajutWNAuwk8pV_LauR8M&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=WA5jvAlBNrS107jaBw3KQg&_nc_ss=7b289&oh=00_Af4pWXtaVKUUyd9kB_eNjqUzuIlSwAqh9gzPk26urnrQOw&oe=6A258B54)

## Native Ad Steps

#### [Step 1: Requesting a Native Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native\#request)

#### [Step 2: Creating your Native Ad Layout](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native\#layout)

#### [Step 3: Populating your Layout Using the Ad's Metadata](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native\#populating)

#### [Step 4: Using MediaView](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native\#mediaview)

#### [Setp 5: Load Ad without Auto Cache](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native\#mediaCachePolicy)

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

## Step 1: Requesting a Native Ad

Add the following code at the top of your Activity to import the Facebook Ads SDK:

```code
import com.facebook.ads.*;
```

Then, instantiate a `NativeAd` object, create a `NativeAdListener`, and call `loadAd()` with the ad listener:

```code
private final String TAG = "NativeAdActivity".getClass().getSimpleName();
private NativeAd nativeAd;

private void loadNativeAd() {
    // Instantiate a NativeAd object.
    // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
    // now, while you are testing and replace it later when you have signed up.
    // While you are using this temporary code you will only get test ads and if you release
    // your code like this to the Google Play your users will not receive ads (you will get a no fill error).
    nativeAd = new NativeAd(this, "YOUR_PLACEMENT_ID");

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
    };

    // Request an ad
    nativeAd.loadAd(
            nativeAd.buildLoadAdConfig()
                    .withAdListener(nativeAdListener)
                    .build());
}
```

We will be coming back later to add code to the `onAdLoaded()` method.

## Step 2: Creating your Native Ad Layout

The next step is to extract the ad metadata and use its properties to build your customized native UI.
You can either create your custom view in a layout .xml, or you can add elements in code.

Please consult [our guidelines for native ads](https://developers.facebook.com/docs/audience-network/guidelines/native-ads#native) when designing native ads in your app.

In your Activity's layout `activity_main.xml`, add a container for your `Native Ad`. The container should be a `com.facebook.ads.NativeAdLayout` which is a wrapper on top of a `FrameLayout` with some extra functionality that enabled us to render a native Ad Reporting Flow on top of the ad.

```code
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:gravity="center_horizontal"
    android:paddingTop="50dp">
    ...
    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:paddingBottom="50dp">

        <com.facebook.ads.NativeAdLayout
             android:id="@+id/native_ad_container"
             android:layout_width="match_parent"
             android:layout_height="wrap_content"
             android:orientation="vertical" />
     </ScrollView>
    ...
</RelativeLayout>
```

Create a custom layout `native_ad_layout.xml` for your native ad:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/15216313_331113363929728_6113299712884867072_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=QmgpQFSjzuQQ7kNvwHeveLn&_nc_oc=AdrBCAZHhiXbpKrpSWEgbbsSBMSaJzKCM2E3FYcBHq0lA90gVOYFDu6LFzEd7jbCqs0&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=WA5jvAlBNrS107jaBw3KQg&_nc_ss=7b289&oh=00_Af662HWc13in6ECMPSj3CI9-jLLA3PdLpKpD5iY9ey7HGw&oe=6A2579C4)

Below is an example custom layout for your Native Ad:

```code
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/ad_unit"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:background="@android:color/white"
    android:orientation="vertical"
    android:paddingLeft="10dp"
    android:paddingRight="10dp">

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:paddingBottom="10dp"
        android:paddingTop="10dp">

        <com.facebook.ads.MediaView
            android:id="@+id/native_ad_icon"
            android:layout_width="35dp"
            android:layout_height="35dp" />

        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:paddingLeft="5dp"
            android:paddingRight="5dp">

        <TextView
            android:id="@+id/native_ad_title"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:ellipsize="end"
            android:lines="1"
            android:textColor="@android:color/black"
            android:textSize="15sp" />

        <TextView
            android:id="@+id/native_ad_sponsored_label"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:ellipsize="end"
            android:lines="1"
            android:textColor="@android:color/darker_gray"
            android:textSize="12sp" />

    </LinearLayout>

    <LinearLayout
        android:id="@+id/ad_choices_container"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="end"
        android:orientation="horizontal" />

    </LinearLayout>

    <com.facebook.ads.MediaView
        android:id="@+id/native_ad_media"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:gravity="center" />

    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:padding="5dp">

        <LinearLayout
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_weight="3"
            android:orientation="vertical">

            <TextView
                android:id="@+id/native_ad_social_context"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:ellipsize="end"
                android:lines="1"
                android:textColor="@android:color/darker_gray"
                android:textSize="12sp" />

            <TextView
                android:id="@+id/native_ad_body"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:ellipsize="end"
                android:gravity="center_vertical"
                android:lines="2"
                android:textColor="@android:color/black"
                android:textSize="12sp" />

        </LinearLayout>

        <Button
            android:id="@+id/native_ad_call_to_action"
            android:layout_width="100dp"
            android:layout_height="30dp"
            android:layout_gravity="center_vertical"
            android:layout_weight="1"
            android:background="#4286F4"
            android:paddingLeft="3dp"
            android:paddingRight="3dp"
            android:textColor="@android:color/white"
            android:textSize="12sp"
            android:visibility="gone" />

    </LinearLayout>

</LinearLayout>
```

## Step 3: Populating your Layout Using the Ad's Metadata

#### Scenario 1: Immediately display the ad once it is loaded successfully. Modify the `onAdLoaded()` method above to retrieve the `Native Ad's` properties and display it as follows:

```code
private NativeAdLayout nativeAdLayout;
private LinearLayout adView;
private NativeAd nativeAd;

private void loadNativeAd() {
    // Instantiate a NativeAd object.
    // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
    // now, while you are testing and replace it later when you have signed up.
    // While you are using this temporary code you will only get test ads and if you release
    // your code like this to the Google Play your users will not receive ads (you will get a no fill error).
    nativeAd = new NativeAd(this, "YOUR_PLACEMENT_ID");

    NativeAdListener nativeAdListener = new NativeAdListener() {
        ...
        @Override
        public void onAdLoaded(Ad ad) {
            // Race condition, load() called again before last ad was displayed
            if (nativeAd == null || nativeAd != ad) {
                return;
            }
            // Inflate Native Ad into Container
            inflateAd(nativeAd);
        }
        ...
    };

    // Request an ad
    nativeAd.loadAd(
            nativeAd.buildLoadAdConfig()
                    .withAdListener(nativeAdListener)
                    .build());
}

private void inflateAd(NativeAd nativeAd) {

    nativeAd.unregisterView();

    // Add the Ad view into the ad container.
    nativeAdLayout = findViewById(R.id.native_ad_container);
    LayoutInflater inflater = LayoutInflater.from(NativeAdActivity.this);
    // Inflate the Ad view.  The layout referenced should be the one you created in the last step.
    adView = (LinearLayout) inflater.inflate(R.layout.native_ad_layout_1, nativeAdLayout, false);
    nativeAdLayout.addView(adView);

    // Add the AdOptionsView
    LinearLayout adChoicesContainer = findViewById(R.id.ad_choices_container);
    AdOptionsView adOptionsView = new AdOptionsView(NativeAdActivity.this, nativeAd, nativeAdLayout);
    adChoicesContainer.removeAllViews();
    adChoicesContainer.addView(adOptionsView, 0);

    // Create native UI using the ad metadata.
    MediaView nativeAdIcon = adView.findViewById(R.id.native_ad_icon);
    TextView nativeAdTitle = adView.findViewById(R.id.native_ad_title);
    MediaView nativeAdMedia = adView.findViewById(R.id.native_ad_media);
    TextView nativeAdSocialContext = adView.findViewById(R.id.native_ad_social_context);
    TextView nativeAdBody = adView.findViewById(R.id.native_ad_body);
    TextView sponsoredLabel = adView.findViewById(R.id.native_ad_sponsored_label);
    Button nativeAdCallToAction = adView.findViewById(R.id.native_ad_call_to_action);

    // Set the Text.
    nativeAdTitle.setText(nativeAd.getAdvertiserName());
    nativeAdBody.setText(nativeAd.getAdBodyText());
    nativeAdSocialContext.setText(nativeAd.getAdSocialContext());
    nativeAdCallToAction.setVisibility(nativeAd.hasCallToAction() ? View.VISIBLE : View.INVISIBLE);
    nativeAdCallToAction.setText(nativeAd.getAdCallToAction());
    sponsoredLabel.setText(nativeAd.getSponsoredTranslation());

    // Create a list of clickable views
    List<View> clickableViews = new ArrayList<>();
    clickableViews.add(nativeAdTitle);
    clickableViews.add(nativeAdCallToAction);

    // Register the Title and CTA button to listen for clicks.
    nativeAd.registerViewForInteraction(
            adView, nativeAdMedia, nativeAdIcon, clickableViews);
}
```

The SDK will log the impression and handle the click automatically. Please note that you must register the ad's view with the `NativeAd` instance to enable that. To make all ad elements of the view clickable register it using:

```code
registerViewForInteraction(View view, MediaView adMediaView, MediaView adIconView)
```

When using registerViewForInteraction with NativeAds, the SDK checks that the call is running on the Main Thread, to avoid race conditions. We perform our check using `Preconditions.checkIsOnMainThread()`. Please ensure that your implementation conforms to this standard as your app will crash if you try to call registerViewForInteraction from a Background Thread.

#### Scenario 2: Display the ad in a few seconds or minutes after it is successfully loaded. You should check whether the ad has been invalidated before displaying it.

In case of not showing the ad immediately after the ad has been **loaded**, the developer is responsible for checking whether or not the ad has been invalidated. Once the ad is successfully loaded, the ad will be valid for **60 mins**. You will **not** get **paid** if you are showing an **invalidated** ad. You should call `isAdInvalidated()` to validate the ad.

You should follow the idea below, but please do not copy the code into your project since it is just an example:

```code
private NativeAd nativeAd;

private void loadNativeAd() {
    // Instantiate a NativeAd object.
    // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
    // now, while you are testing and replace it later when you have signed up.
    // While you are using this temporary code you will only get test ads and if you release
    // your code like this to the Google Play your users will not receive ads (you will get a no fill error).
    nativeAd = new NativeAd(this, "YOUR_PLACEMENT_ID");

    NativeAdListener nativeAdListener = new NativeAdListener() {
        ...
    };

    // Request an ad
    nativeAd.loadAd(
            nativeAd.buildLoadAdConfig()
                    .withAdListener(nativeAdListener)
                    .build());

    // Here is just an example for displaying the ad with delay
    // Please call this method at appropriate timing in your project
    showNativeAdWithDelay();
}

private void showNativeAdWithDelay() {
    /**
     * Here is an example for displaying the ad with delay;
     * Please do not copy the Handler into your project
     */
    Handler handler = new Handler();
    handler.postDelayed(new Runnable() {
        public void run() {
            // Check if nativeAd has been loaded successfully
            if(nativeAd == null || !nativeAd.isAdLoaded()) {
                return;
            }
            // Check if ad is already expired or invalidated, and do not show ad if that is the case. You will not get paid to show an invalidated ad.
            if(nativeAd.isAdInvalidated()) {
                return;
            }
            inflateAd(nativeAd); // Inflate NativeAd into a container, same as in previous code examples
        }
    }, 1000 * 60 * 15); // Show the ad after 15 minutes
}
```

### Controlling Clickable Area

For a better user experience and better results, you should always consider controlling the clickable area of your ad to avoid unintentional clicks. Please refer to [Audience Network SDK Policy](https://developers.facebook.com/docs/audience-network/policy) page for more details about white space unclickable enforcement.

For finer control of what is clickable, you can use the `registerViewForInteraction(View view, MediaView adMediaView, MediaView adIconView, List<View> clickableViews)` to register a list of views that can be clicked. For example, if we only want to make the ad title and the call-to-action button clickable in the previous example, you can write it like this:

```code
@Override
public void onAdLoaded(Ad ad) {
    ...
    // Create a list of clickable views
    List<View> clickableViews = new ArrayList<>();
    clickableViews.add(nativeAdTitle);
    clickableViews.add(nativeAdCallToAction);

    // Register the Title and CTA button to listen for clicks.
    nativeAd.registerViewForInteraction(
            adView, nativeAdMedia, nativeAdIcon, clickableViews);
    ...
}
```

In cases where you reuse the view to show different ads over time, make sure to call `unregisterView()` before registering the same view with a different instance of `NativeAd`.

Run the code and you should see a Native Ad:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/42440234_692900974403985_5830502839729782784_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=penDmgqsycAQ7kNvwEbkmzE&_nc_oc=AdpcDvvY5LOQSiYzu20dmiZjcI178BbmcLM22Lac8puob5S6cmtE_UiqYTkKIx2CKOA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=WA5jvAlBNrS107jaBw3KQg&_nc_ss=7b289&oh=00_Af5UHD1VWt2JDgo31CJ_KRW98a6prTlrnDnejV5SFo948w&oe=6A256A71)

## Step 4: Using MediaView

For displaying the native ad cover image, it is mandatory to use the Meta Audience Network [MediaView](https://developers.facebook.com/docs/reference/android/current/class/MediaView/) which can display both image and video assets. You can review our design guidelines for native video ad units [here](https://developers.facebook.com/docs/audience-network/guidelines/native-ads#nativevideo).

By default, image and video assets are **all pre-cached** when loading native ads, which enables the `MediaView` to play videos immediately after `nativeAd` finishes loading.

```code
private void loadNativeAd() {
    ...
    nativeAd.loadAd();
}
```

Also, you can explicitly specify `NativeAd.MediaCacheFlag.ALL` when loading native ads.

```code
private void loadNativeAd() {
    ...
    nativeAd.loadAd(
            nativeAd.buildLoadAdConfig()
                    .withMediaCacheFlag(NativeAdBase.MediaCacheFlag.ALL)
                    .build());
}
```

Audience Network supports two cache options in native ads as defined in the `NativeAd.MediaCacheFlag` enum:

| Cache Constants | Description |
| --- | --- |
| `ALL` | Pre-cache all (icon, images, and video), default |
| `NONE` | No pre-caching |

When an ad is loaded, the following properties will include some value: `title`, `icon`, `coverImage` and `callToAction`. Other properties might be null or empty. Make sure your code is robust enough to handle these cases.

When there is no ad to show, `onError` will be called with an `error.code`. If you use your own custom reporting or mediation layer you might want to check the code value and detect this case. You can fallback to another ad network in this case, but do not re-request an ad immediately after.

Ad metadata that you receive can be cached and re-used for up to 1 hour. If you plan to use the metadata after this time period, make a call to load a new ad.

## Step 5: Load Ad without Auto Cache

- We strongly recommend to leave media caching on by default in all cases. However, we allow you to override the default by using the `MediaCacheFlag.NONE` in the `loadAd` method. Please be very careful if you decide to override our default media caching.

```code
private final String TAG = NativeAdActivity.class.getSimpleName();
private NativeAd nativeAd;

private void loadNativeAd() {
    // Instantiate a NativeAd object.
    // NOTE: the placement ID will eventually identify this as your App, you can ignore it for
    // now, while you are testing and replace it later when you have signed up.
    // While you are using this temporary code you will only get test ads and if you release
    // your code like this to the Google Play your users will not receive ads (you will get a no fill error).
    nativeAd = new NativeAd(this, "YOUR_PLACEMENT_ID");
    NativeAdListener nativeAdListener = new NativeAdListener() {
        ...
    };

    // Request an ad without auto cache
    nativeAd.loadAd(
            nativeAd.buildLoadAdConfig()
                    .withAdListener(nativeAdListener)
                    .withMediaCacheFlag(NativeAdBase.MediaCacheFlag.NONE)
                    .build());
}
```

- After the `onAdLoaded` is successfully invoked on your ad, you can manually call the `downloadMedia` method to start downloading all media for the native ad when appropriate.

```code
@Override
public void onAdLoaded(Ad ad) {
    if (nativeAd == null || nativeAd != ad) {
        return;
    }

    nativeAd.downloadMedia();
}
```

- Finally, you can call `registerViewForInteraction` method and display the ad when the media finished loading in the `onMediaDownloaded` callback.

```code
@Override
public void onMediaDownloaded(Ad ad) {
    if (nativeAd == null || nativeAd != ad) {
        return;
    }

    inflateAd(nativeAd); // Inflate NativeAd into a container, same as in previous code examples
}
```

If you loaded the ad without auto cache and didn't manually call `downloadMedia` to start the download, the media will only start to be downloaded when `registerViewForInteraction` is called. All media need to be loaded and displayed for an eligible impression.

# Hardware Acceleration for Video Ads

Videos ads in Audience Network requires the [hardware accelerated rendering](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Fguide%2Ftopics%2Fgraphics%2Fhardware-accel.html&h=AUCMjrmpSM81kEEp2GTvf5HQcOe8Dy8kbTNGQGLcKWeD8fB7EGaNnZ4P5U3TptsDfiJDcWizKYfs1Nli9OUJ2wszPhDgiQLmGyPL7l-o1rWk_QShPhGgotuyaf_xRaDi1Pial11XtDmTSw) to be enabled, otherwise you might experience a black screen in the video views. This applies to

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

## Next Steps

- Once your app has a link, you can [configure Audience Network](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup/) in Monetization Manager to get ad format placement IDs.

- Follow our guides for integrating different ad formats in your app:


  - [Banner and Medium Rectangle Ads](https://developers.facebook.com/docs/audience-network/android-banners)
  - [Native Ads](https://developers.facebook.com/docs/audience-network/android-native)
  - [Native Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner)
  - [Interstitial Ads](https://developers.facebook.com/docs/audience-network/android-interstitial)
  - [Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video)

- Relevant code samples in both Swift and Objective-C are available on our [GitHub sample app respository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fandroid&h=AUAgjqNpwTvugjBbKhZJx1DraMLi9SkNzTi0gSxTlcfqjWpV8y4JdCn7ravGVFiV0kqZCrCF_KRnCjVJNflswE41AJCUeNHqU0qHOm4ufXjV1AW_JucF_Rv0DRkXnFGVI9shz06_z9WdQQ)

- [Test your ads integration](https://developers.facebook.com/docs/audience-network/setting-up/testing) with your app.

- As soon as we receive a request for an ad from your app or website, we'll review it to make sure it complies with [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards)


- See the [Native Ad Template](https://developers.facebook.com/docs/audience-network/android/nativeadtemplate/) guide to add native ads in your app.

- Explore our code samples which demonstrate how to use native ads. The `NativeAdSample` is available as part of the SDK and can be found under the `AudienceNetwork/samples` folder. Import the project to your IDE and run it either on a device or the emulator.


|     |
| --- |
| # More Resources |

|     |     |
| --- | --- |
| #### [Getting Started Guide](https://developers.facebook.com/docs/audience-network/getting-started)<br>Technical guide to get started with Audience Network<br>#### [Code Samples](https://developers.facebook.com/docs/audience-network/samples)<br>Audience Network Ads Integration Samples | #### [FAQ](https://developers.facebook.com/docs/audience-network/faq)<br>Audience Network FAQ<br>#### [Native Ads Template](https://developers.facebook.com/docs/audience-network/android/nativeadtemplate)<br>A more hands off approach when integrating Native Ads |

On This Page

[Add Native Ads to an Android App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#add-native-ads-to-an-android-app)

[Native Ad Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#native-ad-steps)

[Initialize the Audience Network SDK](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#initialize-the-audience-network-sdk)

[Step 1: Requesting a Native Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#request)

[Step 2: Creating your Native Ad Layout](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#layout)

[Step 3: Populating your Layout Using the Ad's Metadata](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#populating)

[Controlling Clickable Area](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#controlling-clickable-area)

[Step 4: Using MediaView](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#mediaview)

[Step 5: Load Ad without Auto Cache](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#mediaCachePolicy)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native#next_steps)