---
url: https://developers.facebook.com/docs/audience-network/testing
title: On the Platform - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Fsetting-up%2Ftesting%2Fplatform%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Test Your Implementation on the Platform](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-your-implementation-on-the-platform)

[Server Side Testing](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#server-side-testing)

[Add a Test Device](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-device)

[Add Test Users](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-users)

[Test Mobile Apps](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-mobile-apps)

[In This Section](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#in-this-section)

# Test Your Implementation on the Platform

Test your Meta Audience Network SDK implementation to verify the experience before pushing it to production.

## Server Side Testing

Server-side testing involves configuring the [Monetization Manager(MoMa)](https://business.facebook.com/pub/testing) without the need of writing any code in your app. You can test with a [device](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-device), to see both test ads and production ads, and [Test Users](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-users), to see demographically targeted production ads.

When testing your ad placements, Facebook will intentionally send a no-fill for about 20% of requests to allow you to test how your app handles the no-fill case.

## Add a Test Device

The quickest way to test your integration is to test with a device. This testing lets you see both test ads and production ads. Note, production ads are not demographically targeted. Use test users to test targeting.

1. In the [Monetization Manager](https://business.facebook.com/pub/home), hover over the left side navigation bar and select **Integration** -\> **Testing**. You must be signed into the Business Manager as an admin.
![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/69524580_640899583099474_2701603522322890752_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=Wy2pptaFS7IQ7kNvwHlyTGo&_nc_oc=AdqGcnyQsbURObH8C7PUmTCGEURKxwKHzNGcs-17J1Cd2gMXTBo6J0i0btgHCN13HWI&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=0oYgntZX7u1ZG5SQs6zLdA&_nc_ss=7b289&oh=00_Af7CwzQuuYeN_vJRwUYS9cyka2IfB_ML-0pskY-M4vyqkw&oe=6A258752)

2. Toggle the switch to **Testing enabled**. This toggle enables your devices to be treated as test devices by our ad system and not normal user devices.
3. Check the box to **Use real advertiser content** checkbox is checked. This enables you to see real Audience Network advertisements on your test devices. Our ad system will sample a list of ads with different creative types (i.e. videos, images, carousels) or even different locales so you can see how real ads look in your integration. These ads will not generate revenue from any impressions or clicks.
![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/69689258_508884949887552_7327171197173497856_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=Avtgd-AlytQQ7kNvwELgG1L&_nc_oc=Adp1Sp2eMe0LqwziBjHr9CWmF2M9S2U8vSe7srU39wxOJnEhQlDlnRoNUXrkSddztXo&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=0oYgntZX7u1ZG5SQs6zLdA&_nc_ss=7b289&oh=00_Af6hP5MD5bDFOrown2BWE9cIp16sY_gZkRIMZprErIES-w&oe=6A2569FF)

4. **Add test devices** either manually entering device IDs or by uploading a CSV. Enter the [Google Advertising ID (AAID)](https://l.facebook.com/l.php?u=https%3A%2F%2Fdevelopers.google.com%2Fandroid%2Freference%2Fcom%2Fgoogle%2Fandroid%2Fgms%2Fads%2Fidentifier%2FAdvertisingIdClient&h=AUCn0IFRlhDMOv3f9smOw8Dnd3XnWtVsFfddeHNgRBf7vb1_GXT8iUc88sR5aPOHYmKgyTwtWvAZhIlSCiKWjKURHesh5LjoDjwZQZ3fDhCuZe3eQL2Y-7o9a_EQSK9a3gcH7NbUCtpdsQ) for Android devices and the [Identifier for Advertising (IDFA)](https://l.facebook.com/l.php?u=https%3A%2F%2Fdeveloper.apple.com%2Fdocumentation%2Fadsupport%2Fasidentifiermanager&h=AUAKHbdJpZMMQ5hr7rhAUnwsOkD2RAYxzrh-cc4wDZLC4v5rvwvFcpEEljTTDnYTbX8_hVBtA7FUF9UVh9gzxuNHqGovdmkfYhbPMMoaMZ0YhA8rRnTWXeRWTndnXX6GguLmHy8NWg3x7w) for iOS devices and name each device.
![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/69739434_2343245599221696_3926475478713499648_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=1OrgxXSy1foQ7kNvwGygrjr&_nc_oc=AdrXXAyCMlMdN3hOGK4Mk-Qb29bqbK8SdqiDqUIGau9RQIsnrr78G3L6gy-r33_5qLM&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=0oYgntZX7u1ZG5SQs6zLdA&_nc_ss=7b289&oh=00_Af7cEUSOqwRSof5cCZvO8ldtB4uCgp96myOza-wCsvcQLw&oe=6A256D5C)

5. Once you have added a device you can **Select Ad Type** to be viewed on your device.
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/69482817_504906476942109_801909310861869056_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6EIdJw9O2jIQ7kNvwHHTDzj&_nc_oc=AdrnKyGLzwqpDf9Wjne673fqXWdZGcNkqU6aykWCEG3PrYUhnVT88tjFSmbroz52Zng&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=0oYgntZX7u1ZG5SQs6zLdA&_nc_ss=7b289&oh=00_Af4xzbOJ6vI9lSRtw3F3tIIEsQvcuRs-Tq4F0JSKphUmdg&oe=6A257727)
6. Click a **Test** link to view a specific media type on your device. The media type should appear on your device for 5 minutes after you selected it. Only one media type can be tested at one time.
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/69653568_727772231005480_6898784514756050944_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=-jFhjsxXzZAQ7kNvwFsGDGB&_nc_oc=Adq_JvOm2ya76_eUWcc01dw5EljPxKanaOFBK1jf875y_8Y4F6qr7XPs3dGHGh4kEOU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=0oYgntZX7u1ZG5SQs6zLdA&_nc_ss=7b289&oh=00_Af5fNX2Sr9wy1mOdRtVj9Zo5abmXxX_loR-pUsEdp1XzhQ&oe=6A258D88)

## Add Test Users

Add people to your property to test production ads that have been demographically targeted.

1. Go to your [Business Manager Settings](https://business.facebook.com/settings), navigate to **Users > People** in the left side navigation bar then click the **Add** button.
![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/69674847_710059259446440_7351902499332161536_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=7xEGX8HpxYoQ7kNvwEEW2dr&_nc_oc=Adp0ZBkwalTJ63YNpdc8m9SGiJ3sX5bk25JBb06RUkBziarQNSaf8G0LT_DAdfPId_E&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=0oYgntZX7u1ZG5SQs6zLdA&_nc_ss=7b289&oh=00_Af6LrmGtkLAyO4LwMRTE9SZLCqGdRsy74jxLN85U56skFw&oe=6A259EEE)

2. Enter the email or emails of the people you want to add to your app and click **Next**. All invitations give people employee access by default.
![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/69655121_478728419347759_7337479260417818624_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=6RieeIqZ7FAQ7kNvwH_q_OT&_nc_oc=Adruvpjpo54VTTS-3NJwLkGRGIIVrMHYRzjMDqmOEntdwh-S2LtGnkxpdFZpmaU7RgY&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=0oYgntZX7u1ZG5SQs6zLdA&_nc_ss=7b289&oh=00_Af5g3k5U96j0PqqKRR8_yPfea-azAYoE-umbtOxs-Yp1_g&oe=6A259C8E)

3. When the **Assign Access** dialog box is displayed, select one of the following from the left-side menu:



   - **Apps**. Select the app you are adding the tester to, and click the **Test app** toggle switch. Then, click **Invite**.

   - **Properties**. Select the property you are adding the tester to, and click the **Test property** toggle switch. Then click **Invite**.


![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/69950933_376350366340500_8272753688141889536_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=U_GbCa_cxGEQ7kNvwEYg4Wb&_nc_oc=Ado9-RuxBBsixAb7JSEMicXPl7sL67ChYTzBD2u_lUPUaKTaZLPBMKVvEFS2ABKX3KI&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=0oYgntZX7u1ZG5SQs6zLdA&_nc_ss=7b289&oh=00_Af68d38thel3IFmqxVX2fhjYrvvKmPDobagOtHH7eNu-vw&oe=6A2576C2)

If you are using any mediation layer, please make sure that the mediation layer is sending requests to Audience Network. If you have testing enabled on the mediation layer, it may not be sending any requests to our servers.

## Test Mobile Apps

1. Once you have [added a test user](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-users) and [added their test device](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-device), distribute your app to your test user's devices using your preferred distribution method.


2. Your test user must have the Facebook app installed on their device and login with the account you added as a test user. This is required to allow Facebook to serve your test user your ads.
3. Your test user can now trigger a test to see a production ad. See step 5 and 6 of the [**Add a Test Device**](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-device) section.

When using Testflight to distribute and test your app, you will not be able to see real ads in those test builds. Normally, the Identifier for Advertisers (IDFA) remains constant for a device until a user resets it manually. However, each time a Testflight-distributed app asks for the IDFA, it will get a different IDFA.

To resolve this issue, you can turn on test mode to allow the test ad to be shown.

Starting with iOS 14, you will need to implement the
[`setAdvertiserTrackingEnabled`](https://developers.facebook.com/docs/audience-network/guides/advertising-tracking-enabled/) flag, which also applies with test mode enabled.


## In This Section

|     |     |
| --- | --- |
| #### [Test with Client-Side Code Insertion](https://developers.facebook.com/docs/audience-network/guides/test/inserted-code)<br>Explains how to temporarily insert code into your app to test your Audience Network implementation on the client side. | #### [Validate Ad Requests with an SSL Proxy](https://developers.facebook.com/docs/audience-network/guides/test/validate-ad-requests)<br>Explains how to use a proxy app to view all of the SSL/HTTPS traffic between your app and the Audience Network ad server. |
| #### [Integration Checklist and Ads Request Error Codes](https://developers.facebook.com/docs/audience-network/guides/test/checklist-errors)<br>Describes how to verify your Audience Network integration and provides a list of possible error codes. |  |

On This Page

[Test Your Implementation on the Platform](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-your-implementation-on-the-platform)

[Server Side Testing](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#server-side-testing)

[Add a Test Device](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-device)

[Add Test Users](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-users)

[Test Mobile Apps](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#test-mobile-apps)

[In This Section](https://developers.facebook.com/docs/audience-network/setting-up/testing/platform#in-this-section)