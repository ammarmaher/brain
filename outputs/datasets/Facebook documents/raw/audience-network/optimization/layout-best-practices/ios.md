---
url: https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios
title: iOS Guide - Meta Audience Network
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Faudience-network%2Foptimization%2Flayout-best-practices%2Fios%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Audience Network](https://developers.facebook.com/docs/audience-network)

- [How To Use This Site](https://developers.facebook.com/docs/audience-network/how-to-use-this-site)
- [Bidding Integration](https://developers.facebook.com/docs/audience-network/bidding-integration)
- [Ad Formats](https://developers.facebook.com/docs/audience-network/ad-formats)
- [Get Started](https://developers.facebook.com/docs/audience-network/get-started)
- [Platform Setup](https://developers.facebook.com/docs/audience-network/setting-up/platform-setup)
- [Ad Setup](https://developers.facebook.com/docs/audience-network/setting-up/ad-setup)
- [Testing Your Setup](https://developers.facebook.com/docs/audience-network/setting-up/testing)
- [Best Practices](https://developers.facebook.com/docs/audience-network/optimization/best-practices)
- [APIs](https://developers.facebook.com/docs/audience-network/optimization/apis)
- [Instant Games](https://developers.facebook.com/docs/audience-network/instant-games)
- [Help](https://developers.facebook.com/docs/audience-network/support)

On This Page

[Audience Network Ad Layout Guide for iOS](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#audience-network-ad-layout-guide-for-ios)

[Prerequisites](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#prerequisites)

[iOS 11+: Safe Area Layout Guide](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#safeAreaLayoutGuide)

[Previous iOS Versions: Top and Bottom Layout Guide](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#topBottomLayoutGuide)

[Next Steps](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#next_steps)

# Audience Network Ad Layout Guide for iOS

When an ad is visible on screen, it is not an optimal user experience to keep the portion of the ad covered by navigation bars, tab bars, tool bars, and other ancestor views. The example below on the left shows an ad displayed at the top of the iPhone X's screen and partially covered by the top edge. The example on the right shows a better design with the right amount of space between the top edge of the iPhone X's screen and the ad view.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/26656171_833557130175256_3364817863771684864_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=JrHxSK2sx1QQ7kNvwHJxyMj&_nc_oc=AdqE4wHKah2NBP1Us1HTE0njtbtcZRXR3noD1RVABhhhl2sMsFCICL2O5cmtNbyavTQ&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af7eJ6Kg_cGyuwYLHUZDt0odlEtwubldxE965HNs5-6lqA&oe=6A258B0C)

iOS 11 and above introduced a new layout guide called safeAreaLayoutGuide which will be used for defining a safe region to draw your app content including the ad you want to render on the screen. The safe region is defined by the green color boundary box in the example above. Using this new layout guide, let's walk through a technical implementation of rendering a native ad in your app. You can apply the same method for rendering banner ads.

Please consult our [native ads guide](https://developers.facebook.com/docs/audience-network/guidelines/native-ads#native) when designing native ads in your app.

## Prerequisites

Ensure you have completed the [Native Ad](https://developers.facebook.com/docs/audience-network/ios-native), [Native Banner Ad](https://developers.facebook.com/docs/audience-network/ios-native-banner),or [Banner Ad](https://developers.facebook.com/docs/audience-network/ios-banners) example.

#### [iOS 11+: Safe Area Layout Guide](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios\#safeAreaLayoutGuide)

#### [Previous iOS Versions: Top and Bottom Layout Guide](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios\#topBottomLayoutGuide)

## iOS 11+: Safe Area Layout Guide

1. If your app uses Interface Builder with Xcode 9+ and targeting iOS 11+, you should enable Safe Area layout guides. Open your Interface Builder and click on your view controller scene. You will see the Interface Builder Document options on the right. Check **Use Safe Area Layout Guides**.



![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/20044880_678748815847971_3194348674763194368_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=YPQ9u4lIU_wQ7kNvwHHOaYn&_nc_oc=AdpYU8zfGuYLSSvLCF8DL4oIbnFr2PBRBuozcAhlsf21_wksw7UY6NBhMvSKVVfG1qE&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af4Xfgk8ZKYt7dLQFRATr3b1W5W436aipyz6HcmxlBMmbg&oe=6A2584EB)
2. Select the Ad UI view from the View Controller Scene and browse to Size Inspector. Add left, right, top, bottom spacing between the safety layout and give an optimal spacing values show as the following:



![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/20044810_198222837582223_5943727209968566272_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=n7hK2EdjImIQ7kNvwHlk0Sd&_nc_oc=AdoOswIwcqHXFh0VGMNFFAKKKiiG6re_xHr9mNYVvg-lv54zHd8KCXpk1_kXnViKzO0&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af69oMHj8UbHFeY1gWC6GCYj2fpWG_UfjjX2oRVMJ9bk8A&oe=6A256EAE)
3. Build and run your app, you will see the ad shown on screen that has optimal space between the rounded corner, sensors and status bar on the screen.



![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/20273904_162645937717016_3431453383720960000_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=dKrYn0EfDe8Q7kNvwGc6CvF&_nc_oc=AdrjDSWPgFWnHiwJfmgkpaC19GIx77xfuSLGo0y4cN3qLN_ggc7DhG4bxmj7xpcYvGo&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af7QHv7Su0ih-BavriGKFkq3V8ZI_xBWOYx-EUtcVV-tvw&oe=6A25782A)

## Previous iOS Versions: Top and Bottom Layout Guide

1. To support iOS versions before iOS 11, use top and bottom layout guide for addressing the safe area issue. Ensure top and bottom layout guides are included in the View Controller scene shown as the following:



![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/19565118_1936132489744519_1931789956603183104_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=TkMF6fRrRuQQ7kNvwH3f_Sl&_nc_oc=AdpboX1V8pTgHoiHz1pebBW24XmS4rdW1UkzJzAcjM6kmNFmzwqGKue8hOqSxNvu1QE&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af5tT-E2e7FVNt3HdpHcemLWOtyVYElEUWImLyj0tAkFfg&oe=6A2580EF)
2. Select the Ad UI view from the View Controller Scene and browse to Size Inspector. Add top and bottom spacing between the top and bottom layout and give an optimal spacing values show as the following:



![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/26804180_140728146734532_348715451393507328_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=iMFYD6mNcHcQ7kNvwFi7Jrd&_nc_oc=AdpYj6kGo-iLyqdUkFDI-lu4MM3l3V1rsXLl8r7E8909DyXDXK5IwVP3LZ7iMV_WuaU&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af4CjF_6Eaz6-MEVuN84IdXRkGBWw4qooikK_Sa1fDUHKQ&oe=6A258EB0)

# Native Ad Policy Compliance

In order to build a quality product, developers should follow [Meta Audience Network Policy](https://developers.facebook.com/docs/audience-network/policy) whenever you implement the Native Ad or Native Banner Ad Layout. You should always give users full control on clicking. Especially for clickable elements on the ad, you should ensure only ad titles, URLs, Call-to-Action and image assets are clickable. Moreover, white space in the title text or image views must not be clickable.

## Bad Example for Clickable Elements

Whenever you build your layout for native ad or native banner ad, you must not use fixed width and height for `UILabel` to avoid `white space` in ad title, ad body, ad social context, and ad sponsored label. Below is a bad example you should never do:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/35166676_771681639887651_5739996918046523392_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=ioHAAK6GKq0Q7kNvwHd_suk&_nc_oc=AdoUg3URfKUj8bIah6S8xpGrIVkm0UP3mHp0KPzmX7HuA63np5o5tTedZKLSCj1ogsk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af48O41kYZzvA6Gju1de46ex0_flms-SrWGshm5E72Nm_g&oe=6A258647)![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/36222980_427499387718250_7523130205334929408_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=t59dqAjDzE4Q7kNvwFbUPRY&_nc_oc=Adp_A6pfKBERb5SWlvUPPYuMmFgRkLQZWDIyk6kq4AV-Sxy7ku8x6ARV7-mgJbiKFIM&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af5MYN0zGO6QN6KrnT0W2T_frsCqLRYQewC4Tf3JN-BUJw&oe=6A25896F)

## Good Example for Clickable Elements

To build a quality native ad, please build a dynamic constraint layout for native ad or native banner ad. For example, if you are using storyboard auto layout, you could use `Trailing Space >= x` instead of `Trailing Space = x` or `Width <= y` instead of `Width = y`. Below is how the layout should look like if you follow the [Meta Audience Network Policy](https://developers.facebook.com/docs/audience-network/policy):

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36227092_246776762775902_8685155468651266048_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=z1VaFTcMhM4Q7kNvwF2qyXi&_nc_oc=AdqsJRgEbpbvx-s9x5DWR6qB9zkSzxldZdbio_iC5SjjlrqvL0AakSi2vLZB-x-v3Xs&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af4PlAtIHczmseJ7wcEPDsS-jwmZeO6VXE3M-8zApDqjGQ&oe=6A257586)![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/36225674_870919073101774_5501971995165720576_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=QgSYd4GY4ZMQ7kNvwH9Kx9k&_nc_oc=AdoGDaBaRKvYXf0viekd__E4XUgeOoRWYelI12yT9NmxLtuvcXPhtcdi6rNeDFUSTHE&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=c1s57BybXrRMbHFkReBZgw&_nc_ss=7b289&oh=00_Af6JLbDWfqYvI-J7yUvC27DLrOMGMIn-ptxqY05zCUsCcQ&oe=6A25899A)

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
| #### [Getting Started Guide](https://developers.facebook.com/docs/audience-network/getting-started)<br>Technical guide to get started with the Audience Network | #### [API Reference](https://developers.facebook.com/docs/reference/ios/current)<br>Facebook SDK for iOS Reference |

On This Page

[Audience Network Ad Layout Guide for iOS](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#audience-network-ad-layout-guide-for-ios)

[Prerequisites](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#prerequisites)

[iOS 11+: Safe Area Layout Guide](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#safeAreaLayoutGuide)

[Previous iOS Versions: Top and Bottom Layout Guide](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#topBottomLayoutGuide)

[Next Steps](https://developers.facebook.com/docs/audience-network/optimization/layout-best-practices/ios#next_steps)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close