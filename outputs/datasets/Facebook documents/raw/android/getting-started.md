---
url: https://developers.facebook.com/docs/android/getting-started
title: Getting Started - Facebook SDK for Android
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fandroid%2Fgetting-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook SDK for Android](https://developers.facebook.com/docs/android)

- [Component SDKs](https://developers.facebook.com/docs/android/componentsdks)
- [Getting Started](https://developers.facebook.com/docs/android/getting-started)
- [Sharing to Reels (Facebook)](https://developers.facebook.com/docs/android/sharing-to-reels-facebook)
- [Sharing to Reels (Instagram)](https://developers.facebook.com/docs/android/sharing-to-reels-instagram)
- [FAQ & Troubleshooting](https://developers.facebook.com/docs/android/troubleshooting)
- [Changelog](https://developers.facebook.com/docs/android/change-log-4x)
- [Upgrade Guide](https://developers.facebook.com/docs/android/upgrading-4x)
- [Downloads](https://developers.facebook.com/docs/android/downloads)

On This Page

[Getting Started with the Facebook SDK for Android](https://developers.facebook.com/docs/android/getting-started#getting-started-with-the-facebook-sdk-for-android)

[Quick Start](https://developers.facebook.com/docs/android/getting-started#quick-start)

[Before You Start](https://developers.facebook.com/docs/android/getting-started#before-you-start)

[Understand the Advertising ID Permission](https://developers.facebook.com/docs/android/getting-started#ad-id-permissions)

[Android Studio Setup](https://developers.facebook.com/docs/android/getting-started#androidstudio)

[Create Your Project](https://developers.facebook.com/docs/android/getting-started#create)

[Update Your Manifest](https://developers.facebook.com/docs/android/getting-started#add-app_id)

[Enable Sharing](https://developers.facebook.com/docs/android/getting-started#images_videos)

[Running Sample Apps](https://developers.facebook.com/docs/android/getting-started#samples)

[Create a Development Key Hash](https://developers.facebook.com/docs/android/getting-started#create_hash)

[Create a Release Key Hash](https://developers.facebook.com/docs/android/getting-started#release-key-hash)

[Use the Facebook SDK for Android with Maven](https://developers.facebook.com/docs/android/getting-started#maven)

[Troubleshooting Sample Apps](https://developers.facebook.com/docs/android/getting-started#troubleshooting)

[See Also](https://developers.facebook.com/docs/android/getting-started#see-also)

# Getting Started with the Facebook SDK for Android

This documentation explains how to get started integrating your Android app with Facebook by using the Facebook SDK for Android. The current version of the Facebook SDK for Android is version 12.0.0 and requires the Android API 15. For more information about versions and features, see [Facebook SDK for Android](https://developers.facebook.com/docs/android).

When you use the Facebook SDK, some events in your app are automatically logged and collected unless you disable automatic event logging. For details about what information is collected and how to disable automatic event logging, see [Automatic App Event Logging](https://developers.facebook.com/docs/app-events/getting-started-app-events-android#auto-events).

You can set up your app to use the Facebook SDK for Android in the following ways:

- By using the Quick Start.
- By setting up your project with the Facebook SDK for Android.

## Quick Start

To get a Facebook App ID, configure your app's settings, and import the Facebook SDK for Android, click on the button below and follow the instructions.

[Quick Start for Android](https://developers.facebook.com/quickstarts/?platform=android)

## Before You Start

You will need:

- [Your Meta App ID](https://developers.facebook.com/docs/development/create-an-app/)
- [Your Meta App Client Token](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#clienttokens)

## Understand the Advertising ID Permission

Beginning with version 13.0.0, each app that you create by using the Facebook SDK for Android automatically adds the Advertising ID Permission to your app. For more information, see [Advertising ID - Play Console Help](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fgoogleplay%2Fandroid-developer%2Fanswer%2F6048248&h=AUDa1wS9-vI3GeXP29AZX_AnaDMe305JH4yKMmeQm2CMtV3YeGGmmPJJJgXt9apKzPj2HFrXFg__a9s-BDU5up-7Zhdb-3ptNYXZ40CvmpBa3bX2J9HH5QecncetE1F3Nt08kDAvXa-gCA).

In some cases, you might want to opt out of including the Advertising ID permission in your app. For example, if the customers for your app are [children and families](https://l.facebook.com/l.php?u=https%3A%2F%2Fsupport.google.com%2Fgoogleplay%2Fandroid-developer%2Fanswer%2F9893335&h=AUAe1WkNs5tz_5hPzgC6z0bhb-NAg3BHK9w6bMCrZ4bpnycFDEmVmUIblvu_1V1pJl_1vjEvpITDs9Xxyc0P7ntL8BpJmQZXchdJt57VgzorGZJ2FRtw4n_T8i-9XSrCkMFf5SOkmMWYgg), the Advertising ID Permission might not be relevant. To exclude the Advertising ID Permission from your app, follow the instructions later in this documentation.

## Android Studio Setup

### Create Your Project

To use the Facebook SDK in an Android Studio project, add the SDK as a build dependency and import the SDK.

1. Go to **Android Studio \| New Project \| Minimum SDK**.

2. Select **API 15: Android 4.0.3 (IceCreamSandwich)** or higher and create your new project.

3. Open the file `Gradle Scripts | build.gradle (Project: <your_project>)` and add the following:


```
mavenCentral()
```

4. Save and close the `build.gradle (Project: <your_project>)` file.

5. Open the file `Gradle Scripts | build.gradle (Module: app)` and add the following to the `dependencies` section:


```
implementation 'com.facebook.android:facebook-android-sdk:latest.release'
```

6. Save and close the `build.gradle (Module: app)` file.

7. Build your project. Now you can import `com.facebook.FacebookSdk` into your app.


### Update Your Manifest

Add your [App ID](https://developers.facebook.com/docs/android/getting-started#app-id) and [Client Token](https://developers.facebook.com/docs/android/getting-started#client-token) to your project's string file and update the manifest file. Do the following:

1. Open the `/app/res/values/strings.xml` file in your app project.

2. Add `string` elements with the names `facebook_app_id` and `facebook_client_token`, and set the values to your [App ID](https://developers.facebook.com/docs/android/getting-started#app-id) and [Client Token](https://developers.facebook.com/docs/android/getting-started#client-token). For example, if your app ID is `1234` and your client token is `56789` your code looks like the following:


```
<string name="facebook_app_id">1234</string>
<string name="facebook_client_token">56789</string>
```

3. Open the `/app/manifests/AndroidManifest.xml` file in your app project.

4. Add `meta-data` elements to the `application` element for your app ID and client token:


```
<application android:label="@string/app_name" ...>
       ...
       <meta-data android:name="com.facebook.sdk.ApplicationId" android:value="@string/facebook_app_id"/>
       <meta-data android:name="com.facebook.sdk.ClientToken" android:value="@string/facebook_client_token"/>
       ...
</application>
```

5. Add a `uses-permission` element to the manifest after the `application` element:


```
<uses-permission android:name="android.permission.INTERNET"/>
```

6. (Optional) To opt out of the [Advertising ID Permission](https://developers.facebook.com/docs/android/getting-started#ad-id-permissions), add a `uses-permission` element to the manifest after the `application` element:


```
<uses-permission android:name="com.google.android.gms.permission.AD_ID" tools:node="remove"/>
```

7. Build your project.


### Enable Sharing

If you share links, images, or video from your app, declare the `FacebookContentProvider` authority in the manifest. Do the following:

1. Open the `/app/manifests/AndroidManifest.xml` file in your app project.

2. Add a `provider` element to the manifest for the `FacebookContentProvider` authority. Append your [app ID](https://developers.facebook.com/docs/android/getting-started#app-id) to the end of the `authorities` value. For example, if your app id is `1234`, the declaration looks like the following:


```
<provider android:authorities="com.facebook.app.FacebookContentProvider1234"
       android:name="com.facebook.FacebookContentProvider"
       android:exported="true" />
```

3. Build your project.


## Running Sample Apps

The following samples come with the Facebook SDK for Android:

- [HelloFacebookSample](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-android-sdk%2Ftree%2Fmaster%2Fsamples%2FHelloFacebookSample&h=AUBTZ7MvhvC6fwJ3tYiRoMY5yvlpfihhA5kFe1nwKQIfEBK1ALMnNHQe1lVp28FvriOfxE7Wni7TXAcrrdzptf9F6ZkUBAp6RMTrRnSUdtLojvJL5NZ2I1njW3Svh8UFXV2zB9wzIkXfwA) — Demonstrates profile access, status updates and photo upload.

You can experiment with samples by importing the Facebook SDK into an Android Studio project. The samples have a project dependency rather than a central repository dependency via maven central or jcenter. This is so that when a local copy of the SDK gets updates, the samples reflect the changes.

To run samples apps quickly, you can generate key hashes for your development environments. Add these to your [Facebook developer profile](https://developers.facebook.com/settings/developer/sample-app/) for the sample apps. Keytool, for generating the key hashes, is included with the Java SE Development Kit (JDK) that you installed as part of setting up your development environment. OpenSSL is available for download from [OpenSSL](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.openssl.org%2Fsource%2F&h=AUA4_1xEyi1Yu_4NGrR5lcRwP7sn6U1Q2uKZC1hYoS0g7GYJBrVFfuBGj5RuOcMwQ9H3rjzq5yGzidaMYA8FsQYq3Y3CuYPEZZmPWaPY9Fs-pSgOfIrH0iS3kgNLKhtBsQa4n_MbAMeFTA).

On OS X, run:

```bsh
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64
```

On Windows, you need the following:

- Key and Certificate Management Tool (`keytool`) from the Java Development Kit

- [OpenSSL for Windows Library](https://l.facebook.com/l.php?u=https%3A%2F%2Fcode.google.com%2Farchive%2Fp%2Fopenssl-for-windows%2Fdownloads&h=AUAXhSS3vuu3jChVqF0HWxzgfmPr5U2FRTEPvneEgAS2ZQLGgeQruPM3_a4HWG-N1mIWS9Jbvh01Kd4uJaUD0Dpg8-yS6ZkYTR-CRkQ93EQXQ1n5C0jM--Ou-tM1QnWhWwLzx35Rinw9oQ) from the [Google Code Archive](https://l.facebook.com/l.php?u=https%3A%2F%2Fcode.google.com%2Farchive%2Fp%2Fopenssl-for-windows%2Fdownloads&h=AUBEXoWjgYbXxoKQmZ4gElg7wt2MttygxNPkd9ymZsj-5oVYpQcZf6h3dACImHWziI03AsKTnoBfU5U0G1LRjQ3FE3Zr1MyHZI6GyQy6S6BVnGebRTvfy3qobGZen6rLKlMv1AQH_jItAw)


Run the following command in a command prompt in the Java SDK folder. This generates a 28 character string.

```code
keytool -exportcert -alias androiddebugkey -keystore %HOMEPATH%\.android\debug.keystore | openssl sha1 -binary | openssl
base64
```

Go to [the Facebook Developer site](https://developers.facebook.com/). Log into Facebook and, using the dropdown menu in the top-right, go to **Developer Settings**:

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2178-6/10333117_740840152604510_1585872848_n.png?_nc_cat=101&ccb=1-7&_nc_sid=34156e&_nc_ohc=tIUCqI8ZKV0Q7kNvwGrjowa&_nc_oc=AdqW3_B3vtC9TuWjzewufislYyxUghO3wNW1b1ydoOODRLEZC3JFIDpaC01JZhVlWLY&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=FnP-V5l7JbSzAfxMPk3dfQ&_nc_ss=7b289&oh=00_Af5JfeRy5LxMFTcqSr-504TllUUKvurRMNYp6_XQS6QO4A&oe=6A1100BF)

In your developer settings, select **Sample App** from the menu, and add and save your key hash into your profile:

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/851540_402120286596647_185544644_n.png?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=3DhWwfQcCE4Q7kNvwFFNqGi&_nc_oc=AdreLgeAz5ucFMqYzMlLzyTpu5LTexb80ThNQjBUZ9tYNyuGWrfSPYvLutcQ0HgF1mc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=FnP-V5l7JbSzAfxMPk3dfQ&_nc_ss=7b289&oh=00_Af4sXuYGluf4nc3ESuyGtyAo7vED8TO_-x8HUq6KAv3KEA&oe=6A111D01)

You can add multiple key hashes if you develop with multiple machines.

You can now compile and run all of the samples - including those that use Facebook Login.

## Create a Development Key Hash

Facebook uses the key hash to authenticate interactions between your app and the Facebook app. If you run apps that use Facebook Login, you need to add your Android development key hash to your Facebook developer profile.

For the version of your app that you release to you also need to [generate and set a Release Key Hash](https://developers.facebook.com/docs/android/getting-started#release-key-hash).

On either OS X or Windows you can get a key hash by generating it or by using the value returned by `Settings.getApplicationSignature(Context)`. For instructions, see [Running Sample Apps](https://developers.facebook.com/docs/android/getting-started#samples).

## Create a Release Key Hash

To authenticate the exchange of information between your app and the Facebook, you need to generate a release key hash and add this to the Android settings within your Facebook App ID. Without this, your Facebook integration may not work properly when you release your app to the store.

In a previous step, you should have updated your [Facebook Developer Settings](https://developers.facebook.com/settings/developer/sample-app/) with the key hashes for your development environments.

When publishing your app, it is [typically signed with a different signature](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Ftools%2Fpublishing%2Fapp-signing.html&h=AUCOgXWk9w5MWVtaAfFmhrn9y6dI6fygDDCSUJ56wL0MpeFB5qDNcbnkaA_LotJx91tTx7L1FHmUnTfYQ-PFWq8jqHAdXvcRSu_oOub0WHnSx-jIKzWETaYRwD4iX9Sm4QA6FUjt81NNCg) to your development environment. Therefore, you want to make sure you create a Release Key Hash and add this to the Android settings for Facebook App ID.

To generate a hash of your release key, run the following command on Mac or Windows substituting your release key alias and the path to your keystore.

On Mac OS, run:

```code
keytool -exportcert -alias <RELEASE_KEY_ALIAS> -keystore <RELEASE_KEY_PATH> | openssl sha1 -binary | openssl base64
```

On Windows, you need the following:

- Key and Certificate Management Tool (`keytool`) from the Java Development Kit

- [OpenSSL for Windows Library](https://l.facebook.com/l.php?u=https%3A%2F%2Fcode.google.com%2Farchive%2Fp%2Fopenssl-for-windows%2Fdownloads&h=AUBIyjf3qNpt2KY4Vg_STOv4G0q1Qi7SWusf5IWoKRLd5_2S3UlJAmPMqe2WvTMRkmLyzMdKJMuwM8Z1WEYlW5x-9g0P9bG8G0AOhGUV-JJ3N3_SMZqZe6M5q7EpJeY0OAoe08IvRoyt9A) from the [Google Code Archive](https://l.facebook.com/l.php?u=https%3A%2F%2Fcode.google.com%2Farchive%2Fp%2Fopenssl-for-windows%2Fdownloads&h=AUCh9D1hgU-1Tixf_CutluDVHco7sPBDBLLxt_YOUByAl7C0hj-teuEyQl08lyS0oh4F_oVFLVmEQ_YPSS3yoiNYIoyFTX0eo0MxR6UChmCCJT5swuGEidyU7QDLhV-DHQQo2IXvlgaSqw)


Run the following command in a command prompt in the Java SDK folder:

```code
keytool -exportcert -alias <RELEASE_KEY_ALIAS> -keystore <RELEASE_KEY_PATH> | PATH_TO_OPENSSL_LIBRARY\bin\openssl sha1 -binary | PATH_TO_OPENSSL_LIBRARY\bin\openssl base64
```

Make sure to use the password that you set when you first created the release key.

This command should generate a 28 characher string. Copy and paste this Release Key Hash into your Facebook App ID's Android settings.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/851568_627654437290708_1803108402_n.png?_nc_cat=104&ccb=1-7&_nc_sid=34156e&_nc_ohc=tqdJupuQswsQ7kNvwFZnSgZ&_nc_oc=Adr6ZBtEuUe2xrUfXrOa4PtfgY07JSoE_R29TYZ-lHEvqfl9MLC6dmhb-gMPphJSiA4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=FnP-V5l7JbSzAfxMPk3dfQ&_nc_ss=7b289&oh=00_Af7j7xR1mKMdY0Kz9tBIe3hoPHNwQq_yH2-z1nQfgKD6yg&oe=6A10F79D)

You should also check that your Facebook App ID's Android setting also contain the correct package name and main activity class for your Android package.

## Use the Facebook SDK for Android with Maven

You can declare the Maven dependency with the latest available version of the Facebook SDK for Android.

```code
<dependency>
  <groupId>com.facebook.android</groupId>
  <artifactId>facebook-android-sdk</artifactId>
  <version>PUT_LATEST_VERSION_HERE</version>
</dependency>
```

## Troubleshooting Sample Apps

If you have a problem running a sample app, it may be related to the key hash. You may see one of the following scenarios:

- A native Login Dialog appears but after accepting the permissions you are still in a logged out state. The logcat also contains an exception:

```code
12-20 10:23:24.507: W/fb4a:fb:OrcaServiceQueue(504):
com.facebook.orca.protocol.base.ApiException: remote_app_id does not match stored id
```

- A non-native Login Dialog appears with an error message: ''..App is Misconfigured for facebook login...''.

Check your key hash and you can make sure you use the correct key hash. I

You can also manually modify the sample code to use the right key hash. For example in `HelloFacebookSampleActivity` class make a temporary change to the `onCreate()`:

```code
@Override
public void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);

    // Add code to print out the key hash
    try {
        PackageInfo info = getPackageManager().getPackageInfo(
                "com.facebook.samples.hellofacebook",
                PackageManager.GET_SIGNATURES);
        for (Signature signature : info.signatures) {
            MessageDigest md = MessageDigest.getInstance("SHA");
            md.update(signature.toByteArray());
            Log.d("KeyHash:", Base64.encodeToString(md.digest(), Base64.DEFAULT));
            }
    } catch (NameNotFoundException e) {

    } catch (NoSuchAlgorithmException e) {

    }

    ...
```

Save your changes and re-run the sample. Check your logcat output for a message similar to this:

```code
12-20 10:47:37.747: D/KeyHash:(936): 478uEnKQV+fMQT8Dy4AKvHkYibo=
```

Save the key hash in your [developer profile](https://developers.facebook.com/settings/developer/sample-app/). Re-run the samples and verify that you can log in successfully.

## See Also

- [Shrink, obfuscate, and optimize your app](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.android.com%2Fstudio%2Fbuild%2Fshrink-code.html&h=AUCYh_-y686VquG4P2tEjsWdAi-7v2OyfDReIhgyeA8_S0Uq-q0qSpGWtj2pnrLRnuN0UeKvj6rN2g0fcZ_hC4SNtIubt5O0bqEeKmFjjfJS7b_cQlGnGmdnkJ55fP1cHaO8nACeMt2LSw)

On This Page

[Getting Started with the Facebook SDK for Android](https://developers.facebook.com/docs/android/getting-started#getting-started-with-the-facebook-sdk-for-android)

[Quick Start](https://developers.facebook.com/docs/android/getting-started#quick-start)

[Before You Start](https://developers.facebook.com/docs/android/getting-started#before-you-start)

[Understand the Advertising ID Permission](https://developers.facebook.com/docs/android/getting-started#ad-id-permissions)

[Android Studio Setup](https://developers.facebook.com/docs/android/getting-started#androidstudio)

[Create Your Project](https://developers.facebook.com/docs/android/getting-started#create)

[Update Your Manifest](https://developers.facebook.com/docs/android/getting-started#add-app_id)

[Enable Sharing](https://developers.facebook.com/docs/android/getting-started#images_videos)

[Running Sample Apps](https://developers.facebook.com/docs/android/getting-started#samples)

[Create a Development Key Hash](https://developers.facebook.com/docs/android/getting-started#create_hash)

[Create a Release Key Hash](https://developers.facebook.com/docs/android/getting-started#release-key-hash)

[Use the Facebook SDK for Android with Maven](https://developers.facebook.com/docs/android/getting-started#maven)

[Troubleshooting Sample Apps](https://developers.facebook.com/docs/android/getting-started#troubleshooting)

[See Also](https://developers.facebook.com/docs/android/getting-started#see-also)