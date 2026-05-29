---
url: https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fad-setup%2Fandroid%2Fbanner%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Add Banner and Medium Rectangle Ads to an Android App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#add-banner-and-medium-rectangle-ads-to-an-android-app)

[Banner and Medium Rectangle Ad Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#banner-and-medium-rectangle-ad-steps)

[Step 1: Adding a Layout Container for the Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#container)

[Step 2: Implementing the Banner in your Activity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#implementation)

[Step 3: Adding an Ad Listener](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#listener)

[Ad Banner Sizes](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#bannersizes)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#next_steps)

# Add Banner and Medium Rectangle Ads to an Android App

The Audience Network allows you to monetize your Android apps with Facebook ads. This guide explains how to add banner and medium rectangle ads to your app.

[How do I choose Medium Rectangle?](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#faq_565178374868141)

You can change placements in Monetization Manager to the Medium Rectangle format if these were previously configured as Banner for bidding. Similarly, for any new medium rectangle placements, navigate to the [placement settings page](https://business.facebook.com/pub/property/adspace/placement/settings) in Monetization Manager and select **Medium Rectangle** (not Banner).

Placements will deliver as normal even if they are not changed to the medium rectangle format. However, to avoid confusion, we recommend that you change these placements to medium rectangle.

[Permalink](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#faq_565178374868141)

If you're interested in other kinds of ad units, see the [list of available types](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup).

Ensure you have completed the [Android Setup Guides](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android) guides before you proceed.

## Banner and Medium Rectangle Ad Steps

#### [Step 1: Adding a Layout Container for the Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner\#container)

#### [Step 2: Implementing the Banner in your Activity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner\#implementation)

#### [Step 3: Adding an Ad Listener](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner\#listener)

## Step 1: Adding a Layout Container for the Banner Ad

In your layout file (for example: `/res/layout/activity_main.xml`), add a layout that will act as a container for your Ad.

Remember the id you set here as you will be referencing it in the code later.

```code
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout
...
>
...
<LinearLayout
android:id="@+id/banner_container"
android:layout_width="match_parent"
android:layout_height="wrap_content"
android:layout_alignParentBottom="true"
android:orientation="vertical"
app:layout_constraintBottom_toBottomOf="parent"
/>
...
</RelativeLayout>
```

## Step 2: Implementing the Banner in your Activity

Add the following code at the top of your Activity in order to import the Facebook Ads SDK:

```code
import com.facebook.ads.*;
```

Next, instantiate an `AdView` object and make a request to load an ad. Since `AdView` is a subclass of `View`, you can add it to your view hierarchy just as with any other view:

```code
private AdView adView;

@Override
public void onCreate(Bundle savedInstanceState) {
...
// Instantiate an AdView object.
// NOTE: The placement ID from the Facebook Monetization Manager identifies your App.
// To get test ads, add IMG_16_9_APP_INSTALL# to your placement id. Remove this when your app is ready to serve real ads.

adView = new AdView(this, "IMG_16_9_APP_INSTALL#YOUR_PLACEMENT_ID", AdSize.BANNER_HEIGHT_50);

// Find the Ad Container
LinearLayout adContainer = (LinearLayout) findViewById(R.id.banner_container);

// Add the ad view to your activity layout
adContainer.addView(adView);

// Request an ad
adView.loadAd();
}
```

If you are building your app for tablet, consider using the `AdSize.BANNER_HEIGHT_90` size instead. In all cases, the banner width is flexible with a minimum of 320px.

Lastly, add the following code to your activity's `onDestroy()` function to release resources the `AdView` uses:

```code
@Override
protected void onDestroy() {
if (adView != null) {
adView.destroy();
}
super.onDestroy();
}
```

Once you run the above, you should see something like this:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/15119779_1762198104033951_2034270371661742080_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=tmdoCCqhFeQQ7kNvwEkP3MB&_nc_oc=Adqjlv14az2LKfdy67_G4YacZFw4a66qqME-3wy0QaU1g7QwFfB_uXh6XOVWyT7CBrg&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=Cw6IxDXSkgQ2uidW09pJjg&_nc_ss=7b289&oh=00_Af6vSzESgtGtdqpbhWaA2HhD3CNqAx1ickfpkE9_AnTJTQ&oe=6A2589D6)

If you are using the default Google Android emulator, you'll add the following line of code before loading a test ad:

`AdSettings.addTestDevice("HASHED ID");`.

Use the hashed ID that is printed to logcat when you first make a request to load an ad on a device.

Genymotion and physical devices do not need this step. If you would like to test with real ads, please consult our [Testing Guide](https://developers.facebook.com/docs/audience-network/testing).

## Step 3: Adding an Ad Listener

Now that you have the basic code running, you can set an `AdListener` to your `AdView` to listen for specific events:

```code
import android.widget.Toast;
...

protected void onCreate(Bundle savedInstanceState) {
...
AdListener adListener = new AdListener() {
@Override
public void onError(Ad ad, AdError adError) {
// Ad error callback
Toast.makeText(
MainActivity.this,
"Error: " + adError.getErrorMessage(),
Toast.LENGTH_LONG)
.show();
}

@Override
public void onAdLoaded(Ad ad) {
// Ad loaded callback
}

@Override
public void onAdClicked(Ad ad) {
// Ad clicked callback
}

@Override
public void onLoggingImpression(Ad ad) {
// Ad impression logged callback
// Please refer to Monetization Manager or Reporting API for final impression numbers
}
};

// Request an ad
adView.loadAd(adView.buildLoadAdConfig().withAdListener(adListener).build());
}
```

## Ad Banner Sizes

Audience Network supports three ad sizes to be used in your `AdView`. The Banner unit's width is flexible with a minimum of 320px, and only the height is defined.

| Ad Format | AdSize Reference | Size | Recommendation |
| --- | --- | --- | --- |
| Standard Banner | `BANNER_50` | 320x50 | This banner is best suited to phones |
| Large Banner | `BANNER_90` | 320x90 | This banner is best suited to tablets and larger devices |
| Medium Rectangle | `RECTANGLE_HEIGHT_250` | 300x250 | This format is best suited for scrollable feeds or end-of-level screens |

## Next Steps

- Once your app has a link, you can [configure Audience Network](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup/) in Monetization Manager to get ad format placement IDs.

- Follow our guides for integrating different ad formats in your app:


  - [Banner and Medium Rectangle Ads](https://developers.facebook.com/docs/audience-network/android-banners)
  - [Native Ads](https://developers.facebook.com/docs/audience-network/android-native)
  - [Native Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner)
  - [Interstitial Ads](https://developers.facebook.com/docs/audience-network/android-interstitial)
  - [Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video)

- Relevant code samples in both Swift and Objective-C are available on our [GitHub sample app respository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fandroid&h=AUCbznC3X0IILAc4uDyG4RY92f3ZAZsHrKHAVhbpwLaR0nKo1DEMn9QDyXszainmtH0odvS_6fbq201u3Fi0c9YygcR_Hgd6OT50aP_LmqKeDD1izDdo_fBheshhL8DtbQbm3AjGH4UMEw)

- [Test your ads integration](https://developers.facebook.com/docs/audience-network/setting-up/testing) with your app.

- As soon as we receive a request for an ad from your app or website, we'll review it to make sure it complies with [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards)


On This Page

[Add Banner and Medium Rectangle Ads to an Android App](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#add-banner-and-medium-rectangle-ads-to-an-android-app)

[Banner and Medium Rectangle Ad Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#banner-and-medium-rectangle-ad-steps)

[Step 1: Adding a Layout Container for the Banner Ad](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#container)

[Step 2: Implementing the Banner in your Activity](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#implementation)

[Step 3: Adding an Ad Listener](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#listener)

[Ad Banner Sizes](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#bannersizes)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/banner#next_steps)