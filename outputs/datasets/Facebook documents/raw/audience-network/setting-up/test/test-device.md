---
url: https://developers.facebook.com/docs/audience-network/setting-up/test/test-device
title: On a Test Device - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Ftest%2Ftest-device%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)


  - [On the Platform](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform)
  - [On a Test Device](https://developers.facebook.com/docs/audience-network/setting-up/test/test-device)
  - [Onboarding Debugger](https://developers.facebook.com/docs/audience-network/setting-up/test/onboarding-debugger)
  - [Bid Token Debugger](https://developers.facebook.com/docs/audience-network/setting-up/test/bid-token-debugger)
  - [Validate Ad Requests](https://developers.facebook.com/docs/audience-network/setting-up/test/validate-ad-requests)
  - [Integration Checklist and Error Codes](https://developers.facebook.com/docs/audience-network/setting-up/test/checklist-errors)

- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)
- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Test Your Implementation on a Test Device](https://developers.facebook.com/docs/audience-network/setting-up/test/test-device#test-your-implementation-on-a-test-device)

[iOS Device Testing](https://developers.facebook.com/docs/audience-network/setting-up/test/test-device#ios-device-testing)

[Learn More](https://developers.facebook.com/docs/audience-network/setting-up/test/test-device#learn-more)

# Test Your Implementation on a Test Device

To test your Audience Network implementation on the client-side, you temporarily insert code into your app. This code allows you to test production ads on your physical devices before releasing your app to the public. This testing allows you to test any type of ad; a carousel ad, an image ad, or a landscape or portrait video ad.

### Requirements

- [Add your test user in Business Manager](https://developers.facebook.com/docs/audience-network/testing#test-users)


To request a test ad, you will use the following test ad type string to concatenate the placement ID with '#' when initializing any Facebook ad object. The placement ID template for requesting test ads is TEST\_AD\_TYPE#YOUR\_PLACEMENT\_ID.

You should never ship your app to the public with the above test code as it will cause only test ads to be shown. You should instead use a preprocessor macro such as `DEBUG` or `TESTING` and then use `#ifdef` to distinguish a test build from a release build.

### Test Ad Types

| Test Ad Type | Description | Supported Ad Format |
| --- | --- | --- |
| `CAROUSEL_IMG_SQUARE_APP_INSTALL` | carousel ad with square image and app install CTA option | Interstitial, Native |
| `CAROUSEL_IMG_SQUARE_LINK` | carousel ad with square image and link CTA option | Interstitial, Native |
| `IMG_16_9_APP_INSTALL` | 16x9 image ad with app install CTA option | Banner, Interstitial, Native |
| `IMG_16_9_LINK` | 16x9 image ad with link CTA option | Banner, Interstitial, Native |
| `PLAYABLE` | Playable ad with app install CTA option | Interstitial, Rewarded Video |
| `VID_HD_9_16_39S_APP_INSTALL` | 9x16 HD video 39 sec ad with app install CTA option | Interstitial, Native, Rewarded Video |
| `VID_HD_9_16_39S_LINK` | 9x16 HD video 39 sec ad with link CTA option | Interstitial, Native, Rewarded Video |
| `VID_HD_16_9_15S_APP_INSTALL` | 16x9 HD video 15 sec ad with app install CTA option | Interstitial, Native, Rewarded Video |
| `VID_HD_16_9_15S_LINK` | 16x9 HD video 15 sec ad with link CTA option | Interstitial, Native, Rewarded Video |
| `VID_HD_16_9_46S_APP_INSTALL` | 16x9 HD video 46 sec ad with app install CTA option | Interstitial, Native, Rewarded Video |
| `VID_HD_16_9_46S_LINK` | 16x9 HD video 46 sec ad with link CTA option | Interstitial, Native, Rewarded Video |

Be sure the format of the ad you are requesting is supported by the test ad type or you will get a [`Code=1011 “Display Format Mismatch”` error](https://developers.facebook.com/docs/audience-network/testing/checklist-errors).

## iOS Device Testing

To test a native ad on your iOS device, you can initialize an `FBNativeAd` object.

#### Sample Code

The following sample requests a video test ad with a 9:16 aspect ratio and an app install CTA button.

```code
[FBNativeAd *nativeAd = [[FBNativeAd alloc] initWithPlacementID:@"VID_HD_9_16_39S_APP_INSTALL#{your-placement-id}"];\
```\
\
When testing your app with Facebook ad units, you must specify the device hashed ID to ensure the delivery of test ads.\
\
```code\
#ifdef DEBUG\
[FBAdSettings setLogLevel:FBAdLogLevelLog];\
[FBAdSettings addTestDevice:@"{hashed-id}"];\
#endif\
```\
\
You can run the above code, substituting `{your-placement-id}` with your placement ID and `{hash-id}` with your test device hash ID, to request a test ad in the NativeAdSample project from the Audience Network SDK sample folder.\
\
![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/18280487_433075287067755_3953446142460559360_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=53kswTbkqJAQ7kNvwGMBZXI&_nc_oc=AdpQ_mIqxXfyrrQihSwOr4qqUYSykydoieKhjbs4UAOxYxxhh0UrsjgU0lMqhTt2Zsk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=jOvnHoi3nst_-TBqaLK0kA&_nc_ss=7b289&oh=00_Af5X0X60B97JLuV-ZDInlRZu-ZoOEZPwxEI7cqLRK3jh9Q&oe=6A256F4B)\
\
After you have finished testing you should clear the test device setting.\
\
#### Sample Code\
\
```code\
[FBAdSettings clearTestDevice:[FBAdSettings testDeviceHash]];\
```\
\
## Android Testing\
\
To test a native ad on your Android device, you can initialize a `NativeAd` object.\
\
#### Sample Code\
\
The following sample requests a video test ad with a 9:16 aspect ratio and app install CTA button.\
\
```code\
nativeAd = new NativeAd(this, "VID_HD_9_16_39S_APP_INSTALL#{your-placement-id}");\
```\
\
You can run the above code, substituting `{your-placement-id}` with your placement ID.\
\
Get the test device hashed ID from the Logcat. The log will look like the following:\
\
```json\
Log: When testing your app with Facebook's ad units you\
must specify the device hashed ID to ensure the delivery\
of test ads, add the following code before loading an ad: `AdSettings.addTestDevice("{hashed-id}");`\
```\
\
Then, enable test ads on a device by adding the following line of code before loading an ad:\
\
```json\
AdSettings.addTestDevice("{hashed-id}");\
```\
\
If you wish to add multiple test devices, then create a list of strings to be added before loading an ad.\
\
```code\
List<String> testDevices = new ArrayList<>();\
testDevices.add("{hashed-id-1}");\
testDevices.add("{hashed-id-2}");\
AdSettings.addTestDevices(testDevices);\
```\
\
When you are finished testing you should clear the test device setting using this line of code:\
\
```code\
AdSettings.clearTestDevices();\
```\
\
## Mediation Dashboard\
\
In addition to requesting the test ad from code, you can configure the placement ID value with test ad type from your mediation dashboard if your app uses mediation. For example, if your app uses MoPub, you can edit Facebook network and set the placement ID value for the native ad to be `VID_HD_9_16_39S_APP_INSTALL#{your-placement-id}`. Your app will receive a video test ad with a 9:16 aspect ratio and app install CTA button.\
\
![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/21276075_148524595745600_6709546353023778816_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=ojV_BiY9WmMQ7kNvwELOt5a&_nc_oc=AdoSAXh9xeyJK5qv8sK1Ej9v19mOrihtjL433wpxYgUEFiVLEtl1Iew4O6wklBnul_s&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=jOvnHoi3nst_-TBqaLK0kA&_nc_ss=7b289&oh=00_Af4VW9KH8QxDK1FTrxXsn5g106j1BhI1kxD1wRv4TazRBQ&oe=6A258B77)\
\
## Learn More\
\
- [Audience Network Integration Checklist and Ads Request Error Codes](https://developers.facebook.com/docs/audience-network/testing/checklist-errors), for a testing checklist and for error codes.\
- [Troubleshooting with the Android SDK Debugger](https://developers.facebook.com/docs/audience-network/android/troubleshooting), for troubleshooting your Android SDK integration.\
\
On This Page\
\
[Test Your Implementation on a Test Device](https://developers.facebook.com/docs/audience-network/setting-up/test/test-device#test-your-implementation-on-a-test-device)\
\
[iOS Device Testing](https://developers.facebook.com/docs/audience-network/setting-up/test/test-device#ios-device-testing)\
\
[Learn More](https://developers.facebook.com/docs/audience-network/setting-up/test/test-device#learn-more)