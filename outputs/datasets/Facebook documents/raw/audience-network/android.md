---
url: https://developers.facebook.com/docs/audience-network/android
title: Get Started with Android - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Fplatform-setup%2Fandroid%2Fget-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)


  - [Android](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android)


    - [Get Started with Android](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started)
    - [Add the SDK](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/add-sdk)
    - [Initialize the SDK](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/initialize-sdk)
    - [API Reference](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/api-reference)
    - [Android Change Log](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/changelog)

  - [iOS](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/ios)
  - [Unity](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/unity)

- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)
- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Get Started with Android](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#get-started-with-android)

[Prerequisites](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#prerequisites)

[Code Sample](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#code-sample)

[Step 1: Creating a New Project](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#creating)

[Step 2: Including the SDK](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#including)

[Step 3: Integration Error Mode (optional)](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#error-mode)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#next_steps)

# Get Started with Android

**Audience Network is bidding only**

Audience Network exclusively uses bidding to serve ads in iOS and Android apps.

### Meta Audience Network enables you to monetize your Android apps using Facebook ads. This guide walks you through every step required to integrate the SDK.

## Prerequisites

Make sure you have [Android Studio installed](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Fstudio%2Finstall.html&h=AUCXbU22XrV5viOEcsC79t8l2HjhmBcWSNzvtuwD-NyYS6v8rLL8QklA972KCK8If6aIlbI3FRNLRLhdarsxNgsQtS6l7oo6hr5S3ZicQqkxOOcTXcwddr-ta9ovzfIInmiHVyUe51UMSA).

Please see the FAQ for [minimum OS version](https://developers.facebook.com/docs/audience-network/faq#faq_1070946399654496) supported by Audience Network SDK.

#### [Step 1: Creating a New Project](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started\#creating)

#### [Step 2: Including the SDK](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started\#including)

#### [Step 3: Integration Error Mode (optional)](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started\#error-mode)

## Code Sample

Java and Kotlin code samples are available in our [GitHub repository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmain%2Fsamples%2Fandroid&h=AUAnpGHg3osg5-a_t7lh1RfZ3hKdvvedui0TOXpr1Sf0iqwoswjB7DcwBxVmp6Y6sqbu9GSUPQTeMg2CbxS-GkhOHHCew2MwiGd0b1qdSk-ayeAxE136-I-NKrE9zjjpN8BG5EIWTbmYRg).

## Step 1: Creating a New Project

If you already have an existing project where you want to integrate Audience Network, you can skip this step.

Open Android Studio and select **New Project**.

Select a Empty Activity to add it to your project and then click **Next**.

Give your project a name and provide your company's domain.
The Package name serves as your app's unique identifier if you choose to publish it on the Google Play Store.

Configure the minimum Android SDK version. Audience Network requires `API 24` or higher.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=944650811719530&version=1778765562)

## Step 2: Including the SDK

The Audience Network SDK is bundled as part of the Facebook SDK. Complete the following steps to download and add it to your project:

##### Using Gradle

Add the following implementation statement to your app-level build.gradle file (not the project-level one) to pull in the latest Audience Network SDK:

```code
dependencies {
implementation 'com.facebook.android:audience-network-sdk:6.+'
}
```

If you encounter issues resolving the Audience Network SDK, verify that your Gradle file is synced and try restarting Android Studio.

##### Manual installation (Not Recommended)

Download and extract the [Audience Network SDK for Android](https://developers.facebook.com/docs/audience-network/download#android). Navigate to the `AudienceNetwork/bin` folder, copy the `AudienceNetwork.aar` file, and place it in the `/libs` folder within your project. You may need to create this directory if it does not already exist. Then, add the following lines to your app's build.gradle:

```code
repositories {
flatDir {
dirs 'libs'
}
}

dependencies {
...
implementation(name: 'AudienceNetwork', ext: 'aar')
}
```

The Audience Network SDK depends on Google Play Services (`play-services-ads-identifier` and `play-services-basement`) to retrieve the Advertising ID. Make sure your project is configured to use Google Play Services as described [here](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Fgoogle%2Fplay-services%2Fsetup.html&h=AUBV_nYGZUgdG_5Gozm6a92ACgLrWLpuqEdCFA-Qcs-CdMK_hjSZFk_7jr4YkMPVFklkU3hfRxLSrUk6P_8Dc63BMmu5hewZ4fuKS3zX4FU6Y96snaTA8rHoDZkbN-TXCfbiB_DEGs3_Ow).

## Step 3: Integration Error Mode (optional)

During Audience Network SDK integration, the integration error mode setting helps you verify that your implementation is working correctly. This method gives you control over how the SDK behaves when it detects incorrect usage.

- `INTEGRATION_ERROR_CRASH_DEBUG_MODE`: The app crashes if your build has the Android [FLAG\_DEBUGGABLE](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Freference%2Fandroid%2Fcontent%2Fpm%2FApplicationInfo.html%23FLAG_DEBUGGABLE&h=AUBkWob_ZxV_7Q-Ik_er9xPBJ_XOLZZwfufLIVYKEDIQDrW5RV-b84R7_7KRMFDwpBD46XSlW898HFug8fphIEUX_32ZsSATNrXT1zhvAeg89eAmG-mZwGXU-tKz4SUCjBnEb0j0A9zf8A) flag set. Otherwise, `INTEGRATION_ERROR_CALLBACK_MODE` is used instead (recommended during testing).
- `INTEGRATION_ERROR_CALLBACK_MODE`: The app invokes the `AdListener.onError(Ad, AdError)` callback whenever an integration error is detected.

```code
// Example for setting the SDK to crash when in debug mode
AdSettings.setIntegrationErrorMode(INTEGRATION_ERROR_CRASH_DEBUG_MODE);
```

## Next Steps

- Once your app has a link, you can [configure Audience Network](https://developers.facebook.com/docs/audience-network/bidding/partner-mediation/audience-network-setup/) in Monetization Manager to get ad format placement IDs.

- Follow our guides for integrating different ad formats in your app:


  - [Banner and Medium Rectangle Ads](https://developers.facebook.com/docs/audience-network/android-banners)
  - [Native Ads](https://developers.facebook.com/docs/audience-network/android-native)
  - [Native Banner Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/native-banner)
  - [Interstitial Ads](https://developers.facebook.com/docs/audience-network/android-interstitial)
  - [Rewarded Video Ads](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup/android/rewarded-video)

- Relevant code samples in both Swift and Objective-C are available on our [GitHub sample app respository](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffbsamples%2Faudience-network%2Ftree%2Fmaster%2Fsamples%2Fandroid&h=AUAxFG3vYtc4oiDRU37zisT7oZPdzogOy81ZN23Jj6Q7SJWo0QWnwG0hErEpy6mr5gLW7I2NUJvVNhFbbjxj0L3HDzK2ri9h8dzaTOKw4nqAO2SSKxQmV0WbP6_utl6K2RLO92ZBq6FznQ)

- [Test your ads integration](https://developers.facebook.com/docs/audience-network/setting-up/testing) with your app.

- As soon as we receive a request for an ad from your app or website, we'll review it to make sure it complies with [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards)


On This Page

[Get Started with Android](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#get-started-with-android)

[Prerequisites](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#prerequisites)

[Code Sample](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#code-sample)

[Step 1: Creating a New Project](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#creating)

[Step 2: Including the SDK](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#including)

[Step 3: Integration Error Mode (optional)](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#error-mode)

[Next Steps](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup/android/get-started#next_steps)