---
url: https://developers.facebook.com/docs/sharing/sharing-to-stories
title: Sharing to Stories
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Fsharing-to-stories%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Sharing](https://developers.facebook.com/docs/sharing)

- [Overview](https://developers.facebook.com/docs/sharing/overview)
- [iOS](https://developers.facebook.com/docs/sharing/ios)
- [Android](https://developers.facebook.com/docs/sharing/android)
- [Web](https://developers.facebook.com/docs/sharing/web)
- [Messenger](https://developers.facebook.com/docs/sharing/messenger)
- [Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories)


  - [Android Developers](https://developers.facebook.com/docs/sharing/sharing-to-stories/android-developers)
  - [iOS Developers](https://developers.facebook.com/docs/sharing/sharing-to-stories/ios-developers)

- [Webmasters](https://developers.facebook.com/docs/sharing/webmasters)
- [Domain Verification](https://developers.facebook.com/docs/sharing/domain-verification)
- [Best Practices](https://developers.facebook.com/docs/sharing/best-practices)

On This Page

[Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories#-----------sharing-to-stories-------)

[Overview](https://developers.facebook.com/docs/sharing/sharing-to-stories#overview)

[Get Started](https://developers.facebook.com/docs/sharing/sharing-to-stories#get-started)

[Design Principles](https://developers.facebook.com/docs/sharing/sharing-to-stories#design-principles)

[Design Guidelines](https://developers.facebook.com/docs/sharing/sharing-to-stories#design-guidelines)

[Canvas](https://developers.facebook.com/docs/sharing/sharing-to-stories#canvas)

[Safe Area](https://developers.facebook.com/docs/sharing/sharing-to-stories#safe-area)

[Layering Elements](https://developers.facebook.com/docs/sharing/sharing-to-stories#layering-elements)

[Context](https://developers.facebook.com/docs/sharing/sharing-to-stories#context)

[Accessibility: Color and Contrast](https://developers.facebook.com/docs/sharing/sharing-to-stories#accessibility--color-and-contrast)

[Accessibility: Text](https://developers.facebook.com/docs/sharing/sharing-to-stories#accessibility--text)

[Design System](https://developers.facebook.com/docs/sharing/sharing-to-stories#design-system)

[Other Recommendations](https://developers.facebook.com/docs/sharing/sharing-to-stories#other-recommendations)

[Implementation](https://developers.facebook.com/docs/sharing/sharing-to-stories#implementation)

[Sharing to Instagram Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories#sharing-to-instagram-stories)

# Sharing to Stories

Sharing your content as a Facebook Story.


|     |
| --- |
| With Sharing to Stories, you can allow your app's users to share your content as a Facebook Story. |

## Overview

By using Android **Implicit Intents** and iOS **Custom URL Schemes**, your app can pass photos, videos, and stickers to the Facebook app. The Facebook app will receive this content and load it in the Story Composer so the user can publish it to their Facebook Stories.

|     |     |
| --- | --- |
| ![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/124434142_794885681078288_1538783544453021683_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=CCtbSOFyFIUQ7kNvwHJ553f&_nc_oc=AdoY4cUudSP_3OQ5dHx6Uq-eUOi9zOfOrK61_nY9Tp_VQqx0QyqN65lx-qfra9hNV-8&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af5jLh-oFP_MIB3WT-wCNRWsigEao6u-3GpeBskKQbBFOQ&oe=6A258D07) | The Facebook app's Story Composer is comprised of a background layer and a sticker layer.<br>#### Background Layer<br>The background layer fills the screen and you can customize it with a photo, video, solid color, or color gradient.<br>#### Sticker Layer<br>The optional sticker layer can contain an image, text, or both, and can be further customized by the user within the Story Composer. |

## Get Started

Before implementing sharing to Stories, review our [Facebook Platform Terms](https://developers.facebook.com/terms) and [Developer Policies](https://developers.facebook.com/devpolicy).

## Design Principles

#### Focus on what people want to share

Your design should be straightforward and match the user’s expectations. It should be free of competing visual elements that may seem tappable or interactive. Content should be transparent and accurate to the viewing experience.

#### Value the stories experience

Consider the overarching story experience while creating your visual style. Remember that people only have about 5 seconds to view a story.
Bring the most essential information to the forefront and reduce distractions.

#### Strive for clarity

Design with simplicity in mind. The focal point of your story should be the media that the user wants to share. Content should be minimal and complement the visual element in a relevant way.

## Design Guidelines

### **Canvas**

|     |     |
| --- | --- |
| Start your project with our standard story's canvas, which you can find [here](https://developers.facebook.com/resources/sharing-to-stories-sketch-template.zip). | ![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/124440478_2658821624367501_4492190897333017281_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=dc9yOz_xmb8Q7kNvwELgauS&_nc_oc=AdpOOotXqZ9JjDeDeUBrG0oyszkzLKgoBO_vE5Tjo5mMC607eN55vRV1r_cUoTUOSnQ&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af6LXfHoy8OW5kWh_d_Aj8_aBB5d5QXhrs2Mc2LlGmFSLQ&oe=6A256FD9) |

### **Safe Area**

|     |     |
| --- | --- |
| Be mindful of users with smaller devices (Androids or iPhone 8 and older). Reserve the top and bottom of your story for the Facebook Stories UI. | ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/151719243_788122555420039_184913910830014132_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=v27myPPb3eEQ7kNvwGERzEL&_nc_oc=Adon-gjHrlfuxFF38tXHDRTeOPwAklUm99eHZbhy_9bw7mLBSQS_AZk-wK4Sq5yGRYs&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af6S05TArKCZ8iDmRqbryG_o0JbJ_bjGQlrzRXKznwLeTA&oe=6A256AE9) |

### **Layering Elements**

|     |     |
| --- | --- |
| Your design should be informational rather than interactive. Designing a simple visual experience ensures that users can focus on the shared media itself.<br>Avoid using elements that resemble call-to action buttons (CTAs) or other UI components that users cannot interact with. | ![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/161362299_1961729657317558_8685147561486344304_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=NDAFK-RSEkwQ7kNvwHmUZTe&_nc_oc=AdoLcZkUVo0ptKgKxMfnGI7-cy-xZUvXjOpseSyEq8xsMwpG4HIlGG-f1djN-oMdDSI&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af4U6_Xk-EXY6PUm_35G5nQ4Ddf_ufGSC3aQkImvyqsjBw&oe=6A2592A6) |

### **Context**

|     |     |
| --- | --- |
| It’s important to consider where the user is while viewing the story. Aim to keep additional content to a minimum. Content should be contextually relevant and supplement the shared media.<br>Avoid adding unnecessary or inaccurate context. This may include stating that a video is playing when the image is static. | ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/160718776_430326618056414_1661374547216842864_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=Nc2N0V93mHMQ7kNvwFPGn34&_nc_oc=AdoFAmK-zGP1-u8k6kzZ_lpu_y_l4DD14cf3hXv-zZTMIc5zySi11PGTNkmVoyOjLpA&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af48jn807nLEwoI1Etjfb4WZZjEZsTPUaUw4cRHM1UexOQ&oe=6A256815) |

### **Accessibility: Color and Contrast**

|     |     |
| --- | --- |
| Use a clean and minimalist background to ensure the focus is on the media being shared.<br>The Web Content Accessibility Guidelines recommend a color contrast of **4.5:1 for text** and **3:1 for headings or graphics**.<br>All designs should follow the [Web Content Accessibility Guidelines](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FWAI%2Fstandards-guidelines%2Fwcag%2F&h=AUB1T8pIl08dblIdhCa_hvZ8YLN2sIIfapY2WUXyYMLEE-eS73IiZXxP2fEYe7PcszGTHoflqMrmrOExPDIbAorJ4o93f-p-mh-EIqccyAj8Xfv8bd5zMKtD98FnaeQa1k8rNx6XJGU6OQ). | ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/152074129_557916018517317_7049801673197451951_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=1dMDjj9CXI0Q7kNvwHDMkx1&_nc_oc=AdrTqS7uhBvHaXT8LNksUchyTodYnhOMS5h64bI1thVYILbQGE9NOwwxH_n5l8x-LYo&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af47GP1hy9TUhhbcIyepjXIZn1ed_DzD2zIevirZWArapQ&oe=6A259217) |

### **Accessibility: Text**

|     |     |
| --- | --- |
| Differentiate text from the background by using the appropriate color contrast principles.<br>The Web Content Accessibility Guidelines recommend a color contrast of **4.5:1 for text** and **3:1 for headings or graphics**.<br>All designs should follow the [Web Content Accessibility Guidelines](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.w3.org%2FWAI%2Fstandards-guidelines%2Fwcag%2F&h=AUD6csojqp8PjutYvJi5eVNEI0c4WL7Dxwyrk6JdDU63RWnMr2ZnRaFIcgzCFfLrXF-OPsp-nNGPfZDXKVvlma-eim8gvB1ct2LiBU7u9O8IJRidQKgTRvaLLCE_9A1b_npttgu1qgUupQ). | ![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/161805770_809140326388352_6595236365926108632_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=5NRenzNC6n0Q7kNvwFix6tp&_nc_oc=Ado6Pi5XtrNY22Pj1XjUqurU9E7FZdgrjmQ4A-nDKSpYUG1-ca2uTL6Dp8K7LM-EIRs&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af502auyeNTTiM_uIqFU3i4H8cIt7QMTDcSlM3I-bRJaEg&oe=6A257424) |

### **Design System**

|     |     |
| --- | --- |
| Infuse your design with your company’s brand! Clearly differentiate your design by avoiding elements or colors that resemble Facebook’s brand. | ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/159607101_882692475921512_92481894849176546_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=UhR6D5NNs9MQ7kNvwE9BbUX&_nc_oc=AdrpWlezHZe1zjpc34FU32q6ooTBLMCPA2OsUeluA1Ly-IziDv_IglIRwYlf5uvbLC4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af4NiQlXf3EmkiPkFPbOjuCjbmeciWW2A02BAvMbqT3ZbA&oe=6A256F0A) |

### **Other Recommendations**

|     |     |
| --- | --- |
| #### Container<br>When possible, make sure to use rounded corners on the container. This will unify your design and make it more appealing. | ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/315742261_861828971501494_7639034412322727008_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=mygmnf6p15oQ7kNvwEfT_FX&_nc_oc=Adp1wYf-BmywPf8o6QoErzMjbq_ysiVrDU1nzrDan1H5YDAW6kXFYHRr3KeBLCz11MQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=eTuyo2-NmavvBM5Uor2E2w&_nc_ss=7b289&oh=00_Af4IVZZa0WODF_Pgt9yvKVW2b3Rksj6_t2Btu1Moe7oodQ&oe=6A256A6F) |

## Implementation

- [Sharing to Stories for Android Developers](https://developers.facebook.com/docs/sharing/sharing-to-stories/android-developers)
- [Sharing to Stories for iOS Developers](https://developers.facebook.com/docs/sharing/sharing-to-stories/ios-developers)

## Sharing to Instagram Stories

You can also allow your app's users to share your content as an Instagram Story. To learn how to do this, refer to our Instagram [Sharing to Stories documentation](https://developers.facebook.com/docs/instagram/sharing-to-stories/).

On This Page

[Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories#-----------sharing-to-stories-------)

[Overview](https://developers.facebook.com/docs/sharing/sharing-to-stories#overview)

[Get Started](https://developers.facebook.com/docs/sharing/sharing-to-stories#get-started)

[Design Principles](https://developers.facebook.com/docs/sharing/sharing-to-stories#design-principles)

[Design Guidelines](https://developers.facebook.com/docs/sharing/sharing-to-stories#design-guidelines)

[Canvas](https://developers.facebook.com/docs/sharing/sharing-to-stories#canvas)

[Safe Area](https://developers.facebook.com/docs/sharing/sharing-to-stories#safe-area)

[Layering Elements](https://developers.facebook.com/docs/sharing/sharing-to-stories#layering-elements)

[Context](https://developers.facebook.com/docs/sharing/sharing-to-stories#context)

[Accessibility: Color and Contrast](https://developers.facebook.com/docs/sharing/sharing-to-stories#accessibility--color-and-contrast)

[Accessibility: Text](https://developers.facebook.com/docs/sharing/sharing-to-stories#accessibility--text)

[Design System](https://developers.facebook.com/docs/sharing/sharing-to-stories#design-system)

[Other Recommendations](https://developers.facebook.com/docs/sharing/sharing-to-stories#other-recommendations)

[Implementation](https://developers.facebook.com/docs/sharing/sharing-to-stories#implementation)

[Sharing to Instagram Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories#sharing-to-instagram-stories)