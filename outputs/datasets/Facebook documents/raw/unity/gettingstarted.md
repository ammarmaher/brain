---
url: https://developers.facebook.com/docs/unity/gettingstarted
title: Getting Started - Unity SDK
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Funity%2Fgettingstarted%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Unity SDK](https://developers.facebook.com/docs/unity)

- [Getting Started](https://developers.facebook.com/docs/unity/gettingstarted)


  - [iOS](https://developers.facebook.com/docs/unity/getting-started/ios)
  - [Android](https://developers.facebook.com/docs/unity/getting-started/android)
  - [Facebook Web Games](https://developers.facebook.com/docs/unity/getting-started/canvas)

- [Examples](https://developers.facebook.com/docs/unity/examples)
- [Changelog](https://developers.facebook.com/docs/unity/change-log)
- [Upgrade Guide](https://developers.facebook.com/docs/unity/upgrading-7.x)
- [Reference](https://developers.facebook.com/docs/unity/reference/current)
- [Downloads](https://developers.facebook.com/docs/unity/downloads)
- [FAQ & Troubleshooting](https://developers.facebook.com/docs/unity/troubleshooting)

On This Page

[Getting Started with the Facebook Unity SDK](https://developers.facebook.com/docs/unity/gettingstarted#getting-started-with-the-facebook-unity-sdk)

[Before You Start](https://developers.facebook.com/docs/unity/gettingstarted#before-you-start)

[Get Your Facebook App ID](https://developers.facebook.com/docs/unity/gettingstarted#get-your-facebook-app-id)

[Add the SDK to your Unity project](https://developers.facebook.com/docs/unity/gettingstarted#addsdk)

[Run the sample project](https://developers.facebook.com/docs/unity/gettingstarted#sampleproject)

[Next Steps](https://developers.facebook.com/docs/unity/gettingstarted#platform)

# Getting Started with the Facebook Unity SDK

This guide provides step-by-step instructions to implement the Facebook Unity SDK.

The Facebook Unity SDK works with Unity 5.0 and above.

## Before You Start

You will need the following:

- [A Facebook Developer Account](https://developers.facebook.com/docs/apps/register).

- [A Facebook App](https://developers.facebook.com/docs/apps#register) with Basic Settings configured. This app should be in [Development Mode.](https://developers.facebook.com/docs/apps#development-mode)


## Get Your Facebook App ID

In your [app dashboard](https://developers.facebook.com/apps) under **Settings > Basic**, copy your **App ID**.

## Add the SDK to your Unity project

**Step 1:** Create a new project in the Unity Editor.

![Create an new Unity project](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/11891334_1908692079356243_579307504_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=34156e&_nc_ohc=Q6jjuZVcleMQ7kNvwFrtO7T&_nc_oc=AdpaIKZuDHmZCjTxtGFchJoMbPZZY2txflG2yJ5-8qdBUdrwzzXtJse_ETxtL-H8h5A&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af61Pjdu6ikTfyj0V6ZNRIdnewXChS9vLNJLUJxHimfbCQ&oe=6A1116C8)

**Step 2:** [Download the latest Facebook SDK](https://developers.facebook.com/docs/unity/downloads/). Unzip this package after downloading. The code for this sample project will be included.

**Step 3:** In the Unity editor, select **Assets > Import Package > Custom Package…** Navigate to the directory where you downloaded the Facebook for Unity SDK and select `FacebookSDK.unitypackage`. **Note:** You will need to remove previously integrated Facebook SDK packages before importing a newer version.

![Import package](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/11891378_1023622374337169_1737934185_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=34156e&_nc_ohc=YE7A6UT5NJgQ7kNvwEZr_3t&_nc_oc=AdqxZEWcERfIGGKpkhZlnzVOceiu0L16F32niC9gpK-O64Kgxr4RoKqG2r8zoZIOGgI&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af7iM1fKjHcNJF19Ga25xKeQVqvBfWtzHUxgoUhw4KhDsg&oe=6A11236D)

**Step 4:** Import all assets in the package.

![Import package](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/11891351_872635976161294_27582272_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=34156e&_nc_ohc=IKM7gtcArD0Q7kNvwEiIVQW&_nc_oc=Adr9JAS_jKPZ0MEMDqactFNFwIZE_xS-M2KtBMbToqSsjcPijzT24tY20wZ1HUpuW_A&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af7nrxXRK4tm0H09b8oDZW9kabErCyF09z9XgSQjHFNrIA&oe=6A111CA8)

**Step 5:** Save your project. A post-build script will add a **Facebook** menu item to the Unity editor. If you don't see this, check your build for compilation errors and try building again.

**Step 6:** In the Unity editor, select **Facebook > Edit Settings**.

![Facebook Unity settings](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/11891342_1472465829748071_1211712710_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=34156e&_nc_ohc=KaDkzLjdDtcQ7kNvwH9EEzA&_nc_oc=Adpyo46JGIdgG3irTKDc1XP3b3DjGlG21YlroAeF2izYW3ZFXHWBCaJs7t5fcjjVxm4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af7cZF3Ex5M1HW-Y5NS27DaR2nR7IqcCUQHBMdZgQ26nKw&oe=6A111237)

In the **Inspector FacebookSettings**, paste in your [Facebook App ID](https://developers.facebook.com/docs/unity/gettingstarted#get-your-facebook-app-id).

![Facebook Unity settings](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/11891333_913196445421649_73723444_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=34156e&_nc_ohc=rOpaEL8hcpQQ7kNvwHpfz7X&_nc_oc=AdpMqEW8Dw3wsW9tbRXp_IOQPMEa-gC8xIm2jaXIQqyKfZBG03InqXatkloKRLRE8wo&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af7SApG67zkJxn5GJxlW1RKXcZWkhfTd0bmt6SqV8rl-sQ&oe=6A110F96)

**Step 7:** In your app dashboard under **Settings > Advanced**, copy your **Client token**.

Paste it beneath your Facebook App ID in the Unity Editor.

## Run the sample project

**Step 1:** In the **Project** panel, under **Assets > FacebookSDK**, you will find all the files for the Facebook Unity SDK. Open the folder titled **Examples**. Double click on the **MainMenu** scene to open the sample project menu.

![Open the sample project](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/12385800_1041503982538677_1684039026_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=koTdW9ftNuUQ7kNvwG70ROQ&_nc_oc=AdqoNIXOAL6JQo10Y0eSHXnITlkMu1L-vsw-Yn-YPTUUffDyxz4f1n7oZAWuoVCiePo&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af7pm5ByqwDSc1XmvswpC7puEtvgjRsB_TjsCE0mzokkIw&oe=6A1105BF)

**Step 2:** In the Unity editor, select **File >Build Settings**.

![Unity Build Settings](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/11891339_745891495534293_308064985_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=34156e&_nc_ohc=UQysvWyEKa8Q7kNvwFAvgX_&_nc_oc=AdoLywZB9KUgQZ8zZAVW6cTYVhNVGVLXC4CsvKBzY8B04a5NuxWHljeK4_1UuqNEoic&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af5yyREYqg_GIBmg9WD_K0M_9cSPXkeXJIBBN3DQSvjyrg&oe=6A110E20)

Select all the Unity Scenes in the **Examples** folder and drag them over to the **Build Settings** panel. Drop them in **Scenes In Build**. Drag the **MainMenu** scene to the `0` position, the first position in the list.

![Unity Build Settings](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/12385795_1658253027795930_751268130_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=34156e&_nc_ohc=1MPs7fbPp2wQ7kNvwFENq53&_nc_oc=Adqhbpf3Pj6bsUdLzgHK6H54GVGbsaVGHSU4FRAMbUgJamriMABn2XBvUResqVLJwL4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af6uAPaTFWEShpVnzDE4BDkXKoFfR6X17hSI-OZktjN8JQ&oe=6A110990)

**Step 3:** Enter **Play mode** to run our example code for a simple demo of the Facebook SDK functionality.

![Unity Play Mode](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/11891374_1650116108570272_88568760_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=avdbIIduJYMQ7kNvwFDxEu5&_nc_oc=AdqQnKIM6E27od0CzJDsv0oDlFsO0uhEGkkU_rbnNud5Ddz_10-k94aF9O51bKXJbdY&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af6IGcLfqzXrMPKDN_R4a8KXFnC-qQxF5Kjbs_R-_K7RYQ&oe=6A110E7C)![Facebook Unity example](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/12385810_1583468388542361_1835710496_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=34156e&_nc_ohc=62stqjPBJpIQ7kNvwEe4rPE&_nc_oc=AdqVp5SOUq7BWEHHnyBKDKXSGw7D2o9aTdvqFlxD_i01-51Wzuo79ix-_OeOCKFCoWk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9bkZXls22SIWxFjyuF82sw&_nc_ss=7b289&oh=00_Af4hzag6mIGH-xenLf4s8LkeHM26WqCOmHMZK0pfTa3tUg&oe=6A10FCBD)

**Note:** The Unity editor environment offers limited functionality, and all the functions are stubbed. It is safe to ignore any warnings or errors regarding the inability of the example game to reach Facebook.

## Next Steps

After the basic configuration of the Unity SDK refer to the guides below to continue with platform specific configurations.

- [Unity for Android](https://developers.facebook.com/docs/unity/getting-started/android)
- [Unity for iOS](https://developers.facebook.com/docs/unity/getting-started/ios)
- [Unity for Web](https://developers.facebook.com/docs/unity/getting-started/canvas)

On This Page

[Getting Started with the Facebook Unity SDK](https://developers.facebook.com/docs/unity/gettingstarted#getting-started-with-the-facebook-unity-sdk)

[Before You Start](https://developers.facebook.com/docs/unity/gettingstarted#before-you-start)

[Get Your Facebook App ID](https://developers.facebook.com/docs/unity/gettingstarted#get-your-facebook-app-id)

[Add the SDK to your Unity project](https://developers.facebook.com/docs/unity/gettingstarted#addsdk)

[Run the sample project](https://developers.facebook.com/docs/unity/gettingstarted#sampleproject)

[Next Steps](https://developers.facebook.com/docs/unity/gettingstarted#platform)