---
url: https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android
title: Android Guide - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Flayout-best-practices%2Fandroid%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


    - [Android Guide](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android)
    - [iOS Guide](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios)

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

[Audience Network Ad Layout Guideline for Android](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#audience-network-ad-layout-guideline-for-android)

[Prerequisites](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#prerequisites)

[Step 1: Including the ConstraintLayout Library](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#including)

[Step 2: Layout Top Part of Native Ad (including icons, title and label)](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#part1)

[Step 3: Layout MediaView of Native Ad](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#part2)

[Step 4: Layout Social Context, Ad Body and Action Button of Native Ad](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#part3)

[Sample: Complete XML Constraint Layout](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#layoutSample)

[Demo: Constraint Layout In Different Orientations and Screen Sizes](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#layoutDemo)

[Sample: Complete XML Constraint Layout](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#bativeBannerLayoutSample)

[Demo: Constraint Layout In Different Orientations and Screen Sizes](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#nativeBannerLayoutDemo)

[Bad Example for Clickable Elements](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#badExample)

[Good Example for Clickable Elements](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#goodExample)

[Next Steps](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#next_steps)

# Audience Network Ad Layout Guideline for Android

Android devices come in all different shapes and sizes, so you should be cautious of what your native ads will look like on different devices. To guarantee your native ad layout is consistent across devices, the layout needs to be flexible. That is, instead of defining your layout with static dimensions, your layout should be responsive to different screen sizes and orientations.

The best practice to create a responsive layout is to use `ConstraintLayout`, which is available in an API library that's compatible with `Android 2.3 (API level 9)` and higher. Also, with the latest version of `Android Studio`, it provides Layout Editor to simplify the process of building `ConstraintLayout`. Below is a tutorial on how to build the native ad UI with `ConstraintLayout` by Layout Editor.

Ensure you have completed the Audience Network [Getting Started](https://developers.facebook.com/docs/audience-network/getting-started) and [Android Getting Started](https://developers.facebook.com/docs/audience-network/android) guides before you proceed.

## Prerequisites

- Ensure you have completed the [Native Ad](https://developers.facebook.com/docs/audience-network/android-native) and [Native Banner Ad](https://developers.facebook.com/docs/audience-network/android-native-banner) example.
- Ensure you have read [Facebook Policy](https://developers.facebook.com/docs/audience-network/policy) to build a quality product.
- Ensure you have read [Build a Responsive UI with ConstraintLayout](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Ftraining%2Fconstraint-layout%2Findex.html&h=AUAIF6KTRy4XcQE0_gn-EzBRWWvn0EqARb6SJHA21ke51hr8UKw9Iwj0wsE9AfrNZrTFdxIIOPVXutMz83Uggs-yWp_5kRJ5DrW8uanMNdCE9M5gRJ3TnlNLFVjAmRTmvQAsnGXWAmA7vA).
- Ensure you have read [Build a UI with Layout Editor](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Fstudio%2Fwrite%2Flayout-editor.html&h=AUD59pIX4dDeGa5u9F0ooJV-WIxWR_hkTVmzuJPuN2qUzbHRQbhR4UIFGkS2B9EEr8GS-h_z7nSbSrzXpGpGjepknIlJDaDqIp1hBUS5vm1Y0e3gCkK_2Uq0DnVGW4umEt6TcKspnsQj9A).

## Native Ad Layout Creation Steps

#### [Step 1: Including the ConstraintLayout Library](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#including)

#### [Step 2: Layout Top Part of Native Ad (including icons, title and label)](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#part1)

#### [Step 3: Layout MediaView of Native Ad](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#part2)

#### [Step 4: Layout Social Context, Ad Body and Action Button of Native Ad](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#part3)

#### [Sample: Complete XML Constraint Layout](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#layoutSample)

#### [Demo: Constraint Layout In Different Orientations and Screen Sizes](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#layoutDemo)

## Native Banner Ad Sample Constraint XML Layout

#### [Sample: Complete XML Constraint Layout](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#bativeBannerLayoutSample)

#### [Demo: Constraint Layout In Different Orientations and Screen Sizes](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#nativeBannerLayoutDemo)

## Native Ad Policy

#### [Bad Example for Clickable Elements](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#badExample)

#### [Good Example for Clickable Elements](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android\#goodExample)

# Native Ad Layout Creation Steps

## Step 1: Including the `ConstraintLayout` Library

To use `ConstraintLayout` in your project, proceed as follows:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/29795749_783805011828611_1130270680311398400_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=9fYgJhmwXycQ7kNvwF822mT&_nc_oc=Ado_XafLzInOru_cZP3pJKTfztWIaSyiL9zXmMWLE2E66zEDrLIEZfzNpf-kGw6azdY&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af5__7WU6EhS5UTvBzXVMjidrdWGI5MI3rwP1x-O95iMCw&oe=6A257D55)

Add the following statement to your module-level `build.gradle` (not project!), to use the latest `ConstraintLayout` library:

```code
dependencies {
    ...
    implementation 'com.android.support.constraint:constraint-layout:1.0.2'
}
```

If there are issues resolving the `Constraint Layout Library`, make sure that you've synced your `Gradle` file and try restarting `Android Studio`.

Once you successfully finish syncing the `Gradle` file with the `ConstraintLayout` library, you should be able to create an `XML` layout file with `ConstraintLayout`:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/29664603_212265882839667_8547818018141372416_n.gif?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=OQuxb88OpaYQ7kNvwFFzRyM&_nc_oc=Adqt2C7ASQ2EHlXja52ujAMbcxGffbxhi-BKH7zAS_OMXsbJNbHxUVhI8mMNyPIEDic&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af4gqunv1g61afdfU8QSWAw_GF4gEbhgcRryEiehX0Wj1w&oe=6A25922B)

## Step 2: Layout Top Part of Native Ad (including icons, title and label)

First, add `Horizontal Guidelines` and set `layout_constraintGuide_begin` as `55dp`, which is used for constraining other views. Add an `com.facebook.ads.MediaView`, constrain its top and left sides to the parent layout, and constrain its bottom side to the guideline.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36272357_471505279963615_1502594488894226432_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=_p5LbGrkH_0Q7kNvwEo6_67&_nc_oc=AdqKRtdDtfgJFQD3GLRBuQNGEoG5PEqT5swltkjefKH09r1OAAzv9Bp63NQtmnpLgVw&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af5-TiWdYrQY1T5bhD_WPfaL7g99ChYc68NogGt30EWQ5Q&oe=6A2599A4)

```code
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:color/white">

    <com.facebook.ads.MediaView
        android:id="@+id/native_ad_icon"
        android:layout_width="35dp"
        android:layout_height="35dp"
        android:layout_marginStart="10dp"
        android:layout_marginTop="10dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <android.support.constraint.Guideline
        android:id="@+id/below_ad_icon_guideline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_begin="55dp" />
    ...
</android.support.constraint.ConstraintLayout>
```

Next, add another `Horizontal Guideline` set `layout_constraintGuide_begin` as `27.5dp`, which is used for separating advertiser name text and sponsor label. Add `native_advertiser_name` and `native_ad_sponsored_label` and `ad_choices_container` as follows:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36077426_211811479442268_2236507853210779648_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=fV_-dqf99gYQ7kNvwHkb-X_&_nc_oc=AdpWJgHHyFBBaouXbTZ255VP1eDB7LQvN8eLREvAOuubsFnm_cNkUPvJIp_Sk6YyJ0U&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af4h8qePQ487JHAVN73nKZqTwYn16jjhv3LVXydPuuH3bQ&oe=6A25910D)

```code
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout>
    ...
    <TextView
        android:id="@+id/native_advertiser_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="6dp"
        android:ellipsize="end"
        android:lines="1"
        android:textColor="@android:color/black"
        android:textSize="15sp"
        android:text="@string/placeholder"
        app:layout_constraintStart_toEndOf="@+id/native_ad_icon"
        app:layout_constraintBottom_toTopOf="@+id/separate_advertiser_name_guideline" />

    <android.support.constraint.Guideline
        android:id="@+id/separate_advertiser_name_guideline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_begin="27.5dp" />

    <TextView
        android:id="@+id/native_ad_sponsored_label"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:ellipsize="end"
        android:lines="1"
        android:textColor="@android:color/darker_gray"
        android:textSize="12sp"
        android:text="@string/placeholder"
        app:layout_constraintStart_toStartOf="@+id/native_advertiser_name"
        app:layout_constraintTop_toBottomOf="@+id/separate_advertiser_name_guideline" />

    <LinearLayout
        android:id="@+id/ad_choices_container"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:layout_marginEnd="10dp"
        android:orientation="horizontal"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent"/>
    ...
</android.support.constraint.ConstraintLayout>
```

## Step 3: Layout MediaView of Native Ad

Add `MediaView` and constrain it by the `Horizontal Guideline` created in Step 2 as follows:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36058830_264228864141531_287989737724051456_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=zojNH7VzCHoQ7kNvwHLrsug&_nc_oc=AdpmrONRWFeEJxtqe18IzA7j07PwktyjoR0AXXTb_uXXR1a8M4l-4zKYjdJEPQfpyvM&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af7Y1j9n3CUoRLxBInzPmW-pH2yBcCGSetosiyCew0mPtA&oe=6A2594DF)

```code
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout>
    ...
    <com.facebook.ads.MediaView
    android:id="@+id/native_ad_media"
    android:layout_width="0dp"
    android:layout_height="wrap_content"
    android:gravity="center"
    app:layout_constraintEnd_toEndOf="@+id/ad_choices_container"
    app:layout_constraintStart_toStartOf="@+id/native_ad_icon"
    app:layout_constraintTop_toTopOf="@+id/below_ad_icon_guideline" />
    ...
</android.support.constraint.ConstraintLayout>
```

## Step 4: Layout Social Context, Ad Body and Action Button of Native Ad

Add `native_ad_social_context`, `native_ad_body` and `native_ad_call_to_action` and constrain them below `MediaView`.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/36153728_238095020120772_6970386275324919808_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=8OY_timBE80Q7kNvwGxNEl_&_nc_oc=AdpvWw_La9iq6Klh-laWPkdM3B7fgaC0A0b69BS4UqA0Gw60CEtprzNKRKnDgUiK43c&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af7wsf3fNIoMweJlPcXS9_n0EnyiePthyJecTEXJJc2WqQ&oe=6A2598CF)

```code
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout>
    ...
    <TextView
        android:id="@+id/native_ad_social_context"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="5dp"
        android:layout_marginStart="3dp"
        android:ellipsize="end"
        android:lines="1"
        android:textColor="@android:color/darker_gray"
        android:textSize="12sp"
        android:text="@string/placeholder"
        app:layout_constraintStart_toStartOf="@+id/native_ad_media"
        app:layout_constraintTop_toBottomOf="@+id/native_ad_media" />

    <TextView
        android:id="@+id/native_ad_body"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:ellipsize="end"
        android:gravity="center_vertical"
        android:maxLines="2"
        android:textColor="@android:color/black"
        android:textSize="12sp"
        android:text="@string/placeholder"
        app:layout_constraintStart_toStartOf="@+id/native_ad_social_context"
        app:layout_constraintTop_toBottomOf="@+id/native_ad_social_context" />

    <Button
        android:id="@+id/native_ad_call_to_action"
        android:layout_width="wrap_content"
        android:layout_height="30dp"
        android:layout_marginTop="15dp"
        android:background="#4286F4"
        android:textSize="12sp"
        android:textColor="@android:color/white"
        android:text="@string/placeholder"
        android:paddingStart="20dp"
        android:paddingEnd="20dp"
        app:layout_constraintEnd_toEndOf="@id/native_ad_media"
        app:layout_constraintTop_toBottomOf="@+id/native_ad_media" />
    ...
</android.support.constraint.ConstraintLayout>
```

## Sample: Complete XML Constraint Layout

Here is a complete sample `XML` constraint layout for a native ad:

```code
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@android:color/white">

    <com.facebook.ads.MediaView
        android:id="@+id/native_ad_icon"
        android:layout_width="35dp"
        android:layout_height="35dp"
        android:layout_marginStart="10dp"
        android:layout_marginTop="10dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <android.support.constraint.Guideline
        android:id="@+id/below_ad_icon_guideline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_begin="55dp" />

    <TextView
        android:id="@+id/native_advertiser_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="6dp"
        android:ellipsize="end"
        android:lines="1"
        android:textColor="@android:color/black"
        android:textSize="15sp"
        android:text="@string/placeholder"
        app:layout_constraintStart_toEndOf="@+id/native_ad_icon"
        app:layout_constraintBottom_toTopOf="@+id/separate_advertiser_name_guideline" />

    <android.support.constraint.Guideline
        android:id="@+id/separate_advertiser_name_guideline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_begin="27.5dp" />

    <TextView
        android:id="@+id/native_ad_sponsored_label"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:ellipsize="end"
        android:lines="1"
        android:textColor="@android:color/darker_gray"
        android:textSize="12sp"
        android:text="@string/placeholder"
        app:layout_constraintStart_toStartOf="@+id/native_advertiser_name"
        app:layout_constraintTop_toBottomOf="@+id/separate_advertiser_name_guideline" />

    <LinearLayout
        android:id="@+id/ad_choices_container"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="10dp"
        android:layout_marginEnd="10dp"
        android:orientation="horizontal"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="parent"/>

    <com.facebook.ads.MediaView
        android:id="@+id/native_ad_media"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:gravity="center"
        app:layout_constraintEnd_toEndOf="@+id/ad_choices_container"
        app:layout_constraintStart_toStartOf="@+id/native_ad_icon"
        app:layout_constraintTop_toTopOf="@+id/below_ad_icon_guideline" />

    <TextView
        android:id="@+id/native_ad_social_context"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="5dp"
        android:layout_marginStart="3dp"
        android:ellipsize="end"
        android:lines="1"
        android:textColor="@android:color/darker_gray"
        android:textSize="12sp"
        android:text="@string/placeholder"
        app:layout_constraintStart_toStartOf="@+id/native_ad_media"
        app:layout_constraintTop_toBottomOf="@+id/native_ad_media" />

    <TextView
        android:id="@+id/native_ad_body"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginTop="8dp"
        android:ellipsize="end"
        android:gravity="center_vertical"
        android:maxLines="2"
        android:textColor="@android:color/black"
        android:textSize="12sp"
        android:text="@string/placeholder"
        app:layout_constraintStart_toStartOf="@+id/native_ad_social_context"
        app:layout_constraintTop_toBottomOf="@+id/native_ad_social_context" />

    <Button
        android:id="@+id/native_ad_call_to_action"
        android:layout_width="wrap_content"
        android:layout_height="30dp"
        android:layout_marginTop="15dp"
        android:background="#4286F4"
        android:textSize="12sp"
        android:textColor="@android:color/white"
        android:text="@string/placeholder"
        android:paddingStart="20dp"
        android:paddingEnd="20dp"
        app:layout_constraintEnd_toEndOf="@id/native_ad_media"
        app:layout_constraintTop_toBottomOf="@+id/native_ad_media" />

</android.support.constraint.ConstraintLayout>
```

## Demo: Constraint Layout In Different Orientations and Screen Sizes

You've already created a `ConstraintLayout` for your native ad, which will have the best user experience for different orientations screen sizes. The `ConstraintLayout` should look consistent on both `Android` phones and tablets. Note: the layout is inside `ScrollView`; it is scrollable in `Landscape` orientation of phones when the native ad is not displayed completely.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/36153831_224227021736782_6172300962825240576_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=cJWAzCfHAt4Q7kNvwE-_Pa1&_nc_oc=AdrlJ0hhh_Jnu6a0BvWvs_DBMrOkklKpqr4AcRuyePrts4ALgNt8t80S_zHRKf0pl_U&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af5h4EXXxWSSY_J4Y6Rum_vBtjGr_4HQTWlv7jtr9_0uXQ&oe=6A25706C)![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36222559_197253697600422_5667594661473026048_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=hDNsrODqXgwQ7kNvwFlQz3i&_nc_oc=AdqySZ_q-RvJomCyUf0073sVR5lOWeipqSTONzscSXTZjtSJzeg7ugKFnFXZgQ9kR3I&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af7yyZ4GWYCHfTV8rl4CHY31XIpxBXWNeyiIZaXmeHk38A&oe=6A2590AF)![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36077085_231681457457886_5754027639899684864_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=rNNT7tdcTIAQ7kNvwF9LoNY&_nc_oc=Ado3AttZ_JHPkwtP-7FW2gydj7f46FeaH6YlzDwwdERdTYtWNWXXvSdeSXDyL76x6S8&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af6mlTbdcnTcdxXUiILHDQy_FloFHdFAhcOIBn7zdLG8Zg&oe=6A258053)

# Native Banner Ad Sample Constraint Layout

[Native Banner Ad](https://developers.facebook.com/docs/audience-network/android-native-banner) has been available on latest Meta Audience Network SDK. The steps for creating native banner constraint layout are similar as `Native Ad`. You can follow the above steps to create the `Native Banner Ad` Layout, or copy the following sample XML layout code into your project.

## Sample: Complete XML Constraint Layout

Here is a complete sample `XML` constraint layout for a native banner ad:

```code
<?xml version="1.0" encoding="utf-8"?>
<android.support.constraint.ConstraintLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:padding="3dp">

    <RelativeLayout
        android:id="@+id/ad_choices_container"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="2dp"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintTop_toTopOf="parent" />

    <TextView
        android:id="@+id/native_ad_sponsored_label"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:ellipsize="end"
        android:lines="1"
        android:textColor="@android:color/darker_gray"
        android:textSize="12sp"
        android:text="Placeholder"
        app:layout_constraintStart_toEndOf="@id/ad_choices_container"
        app:layout_constraintTop_toTopOf="parent" />

    <com.facebook.ads.MediaView
        android:id="@+id/native_ad_icon"
        android:layout_width="50dp"
        android:layout_height="50dp"
        android:layout_marginTop="3dp"
        android:gravity="center"
        app:layout_constraintStart_toStartOf="@id/ad_choices_container"
        app:layout_constraintTop_toBottomOf="@id/ad_choices_container" />

    <TextView
        android:id="@+id/native_advertiser_name"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_marginStart="6dp"
        android:textColor="@android:color/black"
        android:textSize="15sp"
        android:textStyle="bold"
        android:ellipsize="end"
        android:lines="1"
        app:layout_constraintStart_toEndOf="@+id/native_ad_icon"
        app:layout_constraintBottom_toTopOf="@+id/separate_advertiser_name_guideline" />

    <android.support.constraint.Guideline
        android:id="@+id/separate_advertiser_name_guideline"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        app:layout_constraintGuide_begin="43dp" />

    <TextView
        android:id="@+id/native_ad_social_context"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:textSize="12sp"
        android:ellipsize="end"
        android:lines="1"
        app:layout_constraintStart_toStartOf="@+id/native_advertiser_name"
        app:layout_constraintTop_toBottomOf="@+id/separate_advertiser_name_guideline" />

    <Button
        android:id="@+id/native_ad_call_to_action"
        android:layout_width="80dp"
        android:layout_height="50dp"
        android:gravity="center"
        android:background="#4286F4"
        android:textSize="12sp"
        android:textColor="@android:color/white"
        android:paddingLeft="3dp"
        android:paddingRight="3dp"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintTop_toTopOf="@id/native_ad_icon" />

</android.support.constraint.ConstraintLayout>
```

## Demo: Constraint Layout In Different Orientations and Screen Sizes

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/36165963_237530163718738_1658762235670953984_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=aSkBmvwOVDgQ7kNvwEIj1tr&_nc_oc=AdqXipwrj_xAsXvK5FOif8-3npp5Pv2mzRSpyKsbxP2afEI15bplfqH6cVwbMmOci1o&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af5eJFN3hzDFCW2rz-G2NrvSErsroT-N3ikMwn2q7UAPOw&oe=6A257213)![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/34954646_353886761806047_8835970621025288192_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=WFdJKgXD-xkQ7kNvwEudVSR&_nc_oc=AdqnQJKxx6cGvpeJHtddDWSvhbUnN-vRSGxTvx_gI2Vs3-z7BCrLxJUWtTujuRcbihw&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af7Abj8kwC5g73DPJav6SfkYhIj1SKY1sYpAZm_0vUwvWA&oe=6A258243)![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/36244661_202088550447031_2375708851375702016_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=sbNLbHgcohYQ7kNvwHsZtPC&_nc_oc=AdoRHEmKpy9pbrB6BnKGoieRwBki_ujG8u-EKv0Nej21eNcfbk4T2kfsE2P0f2hNneQ&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af6Zowb9-O1CBh_oQObGTaHtC3nOEMHm6yXuBftCC4hIGA&oe=6A25698E)

# Native Ad Policy Compliance

In order to build a quality product, developers should follow [Meta Audience Network Policy](https://developers.facebook.com/docs/audience-network/policy) whenever you implement the Native Ad or Native Banner Ad Layout. You should always give users full control on clicking. Especially for clickable elements on the ad, you should ensure only ad titles, URLs, Call-to-Action and image assets are clickable. Moreover, white space in the title text or image views must not be clickable.

## Bad Example for Clickable Elements

Whenever you build your layout for native ad, you must not use fixed width and height for `TextView`, `AdIcon` and `MediaView` to avoid `white space` in ad titles. Below is a bad example you should never do:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/36165833_1818759354846790_3751428812345180160_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=UcajoUJWdFYQ7kNvwG2F56Y&_nc_oc=AdrZtSQnxBGl3sEJVzjmgFB-F9v_XrW0fJy3r3rcDsH3I8Wf1pKc1dW6ltMfmRfrdM0&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af5RprvFG_jbHS8ZLb_qUPRjQOa5635NtyjDoUV-vxksBA&oe=6A258572)

Here is how a wrong example looks like:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/35882042_1729116727172085_6093141356895535104_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=HIymKHGCcrgQ7kNvwFxbbWX&_nc_oc=AdrBI0P_Gmg-9NgS9GCLiYMeyerQmChSOt7yyQO2zsPZGm_nTVdwPNmZUgDL8hsLTPs&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af4BQapfbvBD2WWt0syDF6D2IYaiX4wRZBY2X_o8xcWQ-g&oe=6A257713)

## Good Example for Clickable Elements

To build a quality native ad, please follow the above steps to build a constraint layout for native ad or native banner ad. For example, you should always apply 'wrap\_content' to both width and height in `TextView`; you may assign fixed width or `match_parent` to an `AdIcon` or `MediaView`, but you should use `wrap_content` for the height. Below is how the layout looks like if you follow the [Meta Audience Network Policy](https://developers.facebook.com/docs/audience-network/policy):

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36077375_509678992816965_5346589729187954688_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=kzuyJYND2wYQ7kNvwFbC3Rb&_nc_oc=AdoYnBRBaqlDT74X1nSlpLZczUvq_LphMzW1J2uOY_vuyd4shZ5Kp7eEzeogtFQdQ_0&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af6LxatmomdoKPNZSDIyHOoBYNeGK8Os022JF3A9fq0yDQ&oe=6A258321)![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36223302_225522474725077_7598480746503733248_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=wo41qiWNoPYQ7kNvwFDjJzu&_nc_oc=Adq7CKvS-Iz-cIIr8BVZnla_kE9vfZqRe3bj_leXQcbQkinl_A7b_Bnh_uMGkyNkR8E&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=AM2wp0ohYKrj_9lHDgWdzw&_nc_ss=7b289&oh=00_Af55e_fcakPcV0TB3xvQGt1pO5CM61mZjeoJfN7TNE3bZA&oe=6A258327)

## Next Steps

- Follow our guides for integrating different Ad Formats in your app:


  - [Native Ads](https://developers.facebook.com/docs/audience-network/ios-native)
  - [Interstitial Ads](https://developers.facebook.com/docs/audience-network/ios-interstitial)
  - [Banners](https://developers.facebook.com/docs/audience-network/ios-banners)

- [Test ads integration](https://developers.facebook.com/docs/audience-network/testing) with your app

- Submit your app for [review](https://developers.facebook.com/docs/audience-network/getting-started#onboarding).

- As soon as we receive a request for an ad from your app or website, we'll review it to make sure it complies with [Audience Network policies](https://developers.facebook.com/docs/audience-network/policy) and the [Facebook community standards](https://www.facebook.com/communitystandards).


|     |
| --- |
| # More Resources |

|     |     |
| --- | --- |
| #### [Getting Started Guide](https://developers.facebook.com/docs/audience-network/getting-started)<br>Technical guide to getting started with Audience Network | #### [API Reference](https://developers.facebook.com/docs/reference/android/current)<br>Facebook SDK for Android Reference |

On This Page

[Audience Network Ad Layout Guideline for Android](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#audience-network-ad-layout-guideline-for-android)

[Prerequisites](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#prerequisites)

[Step 1: Including the ConstraintLayout Library](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#including)

[Step 2: Layout Top Part of Native Ad (including icons, title and label)](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#part1)

[Step 3: Layout MediaView of Native Ad](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#part2)

[Step 4: Layout Social Context, Ad Body and Action Button of Native Ad](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#part3)

[Sample: Complete XML Constraint Layout](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#layoutSample)

[Demo: Constraint Layout In Different Orientations and Screen Sizes](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#layoutDemo)

[Sample: Complete XML Constraint Layout](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#bativeBannerLayoutSample)

[Demo: Constraint Layout In Different Orientations and Screen Sizes](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#nativeBannerLayoutDemo)

[Bad Example for Clickable Elements](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#badExample)

[Good Example for Clickable Elements](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#goodExample)

[Next Steps](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/android#next_steps)