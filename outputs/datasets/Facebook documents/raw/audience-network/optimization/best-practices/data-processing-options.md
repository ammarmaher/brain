---
url: https://developers.facebook.com/docs/audience-network/optimization/best-practices/data-processing-options
title: Data Processing Options for US Users - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Fbest-practices%2Fdata-processing-options%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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
  - [Policy](https://developers.facebook.com/docs/audience-network/optimization/best-practices/an-policy)
  - [Ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers)
  - [App-ads.txt](https://developers.facebook.com/docs/audience-network/optimization/best-practices/authorized-sellers-app-ads)
  - [Data Processing Options for US Users](https://developers.facebook.com/docs/audience-network/optimization/best-practices/data-processing-options)
  - [COPPA](https://developers.facebook.com/docs/audience-network/optimization/best-practices/coppa)

- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Data Processing Options for US Users](https://developers.facebook.com/docs/audience-network/optimization/best-practices/data-processing-options#data-processing-options-for-us-users)

# Data Processing Options for US Users

Limited Data Use is a data processing option that gives you more control over how your data is used in Meta’s systems and better supports your compliance efforts with various US state privacy regulations.
To utilize this feature, you must proactively enable Limited Data Use. When Meta receives data with Limited Data Use enabled from people in the states where Limited Data Use applies, we will process that data in accordance with our role as a service provider or processor, as applicable, and limit the use of that data as specified in our [State-Specific Terms](https://www.facebook.com/legal/terms/state-specific).

For [Business Tools](https://www.facebook.com/help/331509497253087) and Audience Network, Limited Data Use is available only for people in California, Colorado, Connecticut, Florida, Texas, Oregon, or Montana. If a business enables Limited Data Use but does not set the location parameters to US and California, Colorado, Connecticut, Florida, Texas, Oregon, or Montana we will determine if the event is from one of those states. If Limited Data Use is enabled for an event in California, Colorado, Connecticut, Florida, Texas, Oregon, or Montana we will process data in accordance with our role as a service provider or processor and limit the use of that data in accordance with our [State-Specific Terms](https://www.facebook.com/legal/terms/state-specific).

Businesses may notice an impact to campaign performance and effectiveness, and retargeting and measurement capabilities will be limited when Limited Data Use is enabled.

We recommend using our latest Audience Network SDK versions to ensure the functionality of Data Processing Options. The below implementation instructions are accurate for Audience Network SDK versions 5.10 and above.

As of July 1, 2023, we are ending the Transition Period for older versions of Audience Network SDK, whereby we limited the data for all personal information that businesses share about people in California and the ability to enable default Limited Data Use will not be available for Audience Network SDK versions below 5.10. If you choose to use Limited Data Use to indicate a person in California, Colorado, Connecticut, Florida, Texas, or Oregon or on or after July 1, 2023, you must update your SDK and implement Data Processing Options as set forth in this document.

| Implementation | Adding Data Processing Options |
| --- | --- |
| Facebook SDK for iOS, v5.10+ | Use `FBAdSettings setDataProcessingOptions`.<br>To explicitly not enable Limited Data Use (LDU), use:<br>```code<br>[FBAdSettings setDataProcessingOptions:@[]];<br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location<br>- **State:**`0` to request that we determine the location<br>```code<br>[FBAdSettings setDataProcessingOptions:@[@"LDU"] country:0 state:0];<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>[FBAdSettings setDataProcessingOptions:@[@"LDU"] country:1 state:1000];<br>``` |
| Facebook SDK for Android, v5.10+ | Use the `setDataProcessingOptions` method.<br>To explicitly not enable Limited Data Use (LDU), use:<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {}) <br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location <br>- **State:**`0` to request that we determine the location <br>```code<br>AdSettings.setDataProcessingOptions(new String[] {"LDU"}, 0, 0);<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {"LDU"}, 1, 1000);<br>``` |
| Unity SDK, v5.10+ ( **not** using the Audience Network-supplied Unity wrapper) | If you are **not** using the Audience Network-supplied Unity wrapper, enter the following code.<br>```code<br>using UnityEngine;<br>using System.Runtime.InteropServices;<br>namespace AudienceNetwork<br>{<br>public static class AdSettings<br>{<br>public static void SetDataProcessingOptions(string[] dataProcessingOptions)<br>{<br>#if UNITY_ANDROID<br>AndroidJavaClass adSettings = new AndroidJavaClass("com.facebook.ads.AdSettings");<br>adSettings.CallStatic("setDataProcessingOptions", (object)dataProcessingOptions);<br>#endif<br>#if UNITY_IOS<br>FBAdSettingsBridgeSetDataProcessingOptions(dataProcessingOptions, dataProcessingOptions.Length);<br>#endif<br>}<br>public static void SetDataProcessingOptions(string[] dataProcessingOptions, int country, int state)<br>{<br>#if UNITY_ANDROID<br>AndroidJavaClass adSettings = new AndroidJavaClass("com.facebook.ads.AdSettings");<br>adSettings.CallStatic("setDataProcessingOptions", (object)dataProcessingOptions, country, state);<br>#endif<br>#if UNITY_IOS<br>FBAdSettingsBridgeSetDetailedDataProcessingOptions(dataProcessingOptions, dataProcessingOptions.Length, country, state);<br>#endif<br>}<br>#if UNITY_IOS<br>[DllImport("__Internal")]<br>private static extern void FBAdSettingsBridgeSetDataProcessingOptions(string[] dataProcessingOptions, int length);<br>[DllImport("__Internal")]<br>private static extern void FBAdSettingsBridgeSetDetailedDataProcessingOptions(string[] dataProcessingOptions, int length, int country, int state);<br>#endif<br>}<br>}<br>```<br>After entering this code, you can follow the Unity SDK instructions in the row below as if you are using the Unity wrapper. |
| Unity SDK, v5.10+ (using the Audience Network-supplied Unity wrapper) | If you are using the Audience Network-supplied Unity wrapper, use the following `SetDataProcessingOptions`.<br>To explicitly not enable LDU, use:<br>```code<br>AdSettings.SetDataProcessingOptions(new string[]{})<br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location<br>- **State:**`0` to request that we determine the location<br>```code<br>AdSettings.SetDataProcessingOptions(new string[] {"LDU"}, 0, 0);<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>AdSettings.SetDataProcessingOptions(new string[] {"LDU"}, 1, 1000);<br>``` |

Publishers using a Mediation Partner must set the Data Processing Options (Limited Data Use) on the Meta Audience Network SDK before initializing the Mediation SDK so that it is received by us in the bidding request.

| Implementation | Adding Data Processing Options |
| --- | --- |
| Android | To explicitly not enable LDU for the event, use:<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {}) <br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location <br>- **State:**`0` to request that we determine the location <br>```code<br>AdSettings.setDataProcessingOptions(new String[] {"LDU"}, 0, 0);<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {"LDU"}, 1, 1000);<br>```<br>After setting LDU, initialize the Mediation Partner SDK as per usual. |
| iOS | To explicitly not enable Limited Data Use (LDU), use:<br>```code<br>FBAdSettings setDataProcessingOptions:@[]];<br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location <br>- **State:**`0` to request that we determine the location<br>```code<br>[FBAdSettings setDataProcessingOptions:@[@"LDU"] country:0 state:0];<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>[FBAdSettings setDataProcessingOptions:@[@"LDU"] country:1 state:1000];<br>```<br>After setting the LDU for the event, initialize the Mediation Partner SDK as per usual. |

For publishers that are working with us through Bidding Kit and other Server-side Bidding, please follow the implementation methods below.

| Implementation | Adding Data Processing Options |
| --- | --- |
| Android/Bidding Kit 2.0 | To explicitly not enable LDU, use:<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {})<br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location <br>- **State:**`0` to request that we determine the location<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {"LDU"}, 0, 0);<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {"LDU"}, 1, 1000);<br>```<br>After setting the LDU for the event, generate the bidder token:<br>```code<br>String token = BidderTokenProvider.getBidderToken(Context);<br>``` |
| iOS/Bidding Kit 2.0 | To explicitly not enable Limited Data Use (LDU), use:<br>```code<br>[FBAdSettings setDataProcessingOptions:@[]];<br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location <br>- **State:**`0` to request that we determine the location <br>```code<br>[FBAdSettings setDataProcessingOptions:@[@"LDU"] country:0 state:0];<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>[FBAdSettings setDataProcessingOptions:@[@"LDU"] country:1 state:1000];<br>```<br>After setting the LDU for the event, generate the bidder token:<br>```code<br>NSString *token = [FBAdSettings bidderToken];<br>``` |
| Other Server-Side Bidding | For each platform follow the instructions below to specify LDU for the event and retrieve the bidder token before making the server-side bid request.<br>**For Android client:**<br>To explicitly not enable LDU, use:<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {}) <br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location<br>- **State:**`0` to request that we determine the location<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {"LDU"}, 0, 0);<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>AdSettings.setDataProcessingOptions(new String[] {"LDU"}, 1, 1000);<br>```<br>After setting the LDU for the event, generate the bidder token:<br>```code<br>String token = BidderTokenProvider.getBidderToken(Context);<br>```<br>**For iOS client:**<br>To explicitly not enable Limited Data Use (LDU), use:<br>```code<br>[FBAdSettings setDataProcessingOptions:@[]];<br>```<br>To enable LDU and have Meta perform geolocation, use:<br>- **Country:**`0` to request that we determine the location <br>- **State:**`0` to request that we determine the location <br>```code<br>[FBAdSettings setDataProcessingOptions:@[@"LDU"] country:0 state:0];<br>```<br>To enable LDU and manually specify the location, use:<br>- **Country:**`1` to indicate USA <br>- **State:**`1000` to indicate California, `1001` for Colorado, `1002` for Connecticut, `1003` for Florida, `1004` for Oregon, `1005` for Texas, `1006` for Montana, `1007` for Delaware, `1008` for Nebraska, `1009` for New Hampshire, `1010` for New Jersey, `1011` for Minnesota, `1012` for Maryland, `1013` for Rhode Island<br>```code<br>[FBAdSettings setDataProcessingOptions:@[@"LDU"] country:1 state:1000];<br>```<br>After setting the LDU for the event, generate the bidder token:<br>```code<br>NSString *token = [FBAdSettings bidderToken];<br>``` |

On This Page

[Data Processing Options for US Users](https://developers.facebook.com/docs/audience-network/optimization/best-practices/data-processing-options#data-processing-options-for-us-users)