---
url: https://developers.facebook.com/docs/games_payments
title: Game Payments
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgames_payments%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Game Payments](https://developers.facebook.com/docs/games_payments)

- [Taking Payments](https://developers.facebook.com/docs/games_payments/taking-payments)
- [Payments Lite (serverless)](https://developers.facebook.com/docs/games_payments/payments_lite)
- [Webhooks](https://developers.facebook.com/docs/games_payments/webhooks)
- [Testing](https://developers.facebook.com/docs/games_payments/testing)
- [Reports](https://developers.facebook.com/docs/games_payments/reports)
- [Reference](https://developers.facebook.com/docs/games_payments/reference)

On This Page

[Game Payments](https://developers.facebook.com/docs/games_payments#-game-payments-)

[Great Experience](https://developers.facebook.com/docs/games_payments#experience)

[The Payment Dialog](https://developers.facebook.com/docs/games_payments#dialog)

[Paying with Different Methods](https://developers.facebook.com/docs/games_payments#methods)

[Payments Features](https://developers.facebook.com/docs/games_payments#features)

[Easy Integration](https://developers.facebook.com/docs/games_payments#integration)

[Support for Virtual Currencies and Items](https://developers.facebook.com/docs/games_payments#support)

[Pricing Items in Specific Currencies](https://developers.facebook.com/docs/games_payments#pricing)

[Static and Dynamic Pricing](https://developers.facebook.com/docs/games_payments#static_and_dynamic)

[Secure Fulfillment of Purchases](https://developers.facebook.com/docs/games_payments#secure_fulfillment)

[Subscriptions](https://developers.facebook.com/docs/games_payments#subscriptions)

[Payer Conversion Tools](https://developers.facebook.com/docs/games_payments#conversion_tools)

[Game Cards](https://developers.facebook.com/docs/games_payments#game_cards)

[Desktop Ads For Virtual Items and Currencies](https://developers.facebook.com/docs/games_payments#virtualgoods_ads)

[Getting Started](https://developers.facebook.com/docs/games_payments#getting_started)

# Game Payments

Easily accept payments in your game on Facebook.

**Our documentation is moving!**

Please check out the latest documentation [here](https://developers.facebook.com/documentation/games). This documentation will be deprecated by end of June, 2026

Facebook Payments is available internationally and supports [80+ payment methods](https://www.facebook.com/help/203680236341574) in [55+ currencies](https://developers.facebook.com/docs/concepts/payments/currencies/). By implementing a pricing strategy tailored to regional markets, developers can optimize the performance of their business and create a native feeling user checkout experience.

People can feel comfortable storing their payment information with Facebook and buying with their credentials. Facebook takes steps to ensure the payment experience is safe, secure and trustworthy.

Facebook's Payments allows developers complete flexibility to price goods in any region specific local currency, at arbitrary price-points. This system simplifies the purchase experience for customers, improves the performance of the payment flow, and makes it easier for developers to price virtual goods for a global audience. To learn how Facebook supports developers, check out [Facebook for Business](https://www.facebook.com/business).

- For a technical outline of the product, see [Taking Payments for Games](https://developers.facebook.com/docs/games_payments/taking-payments).
- Also available is a series of 7 videos, which couple the guide linked above. Please see this [playlist of the videos.](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youtube.com%2Fplaylist%3Flist%3DPLb0IAmt7-GS3d8N0Yafl1vLbRTw2YsN9F&h=AUAGFjUxfH5JGFvnuTVhfwLzciMDmSIY-YMMC2hkb8qLUtGho94Ka7Ik6cXAcfxijgRIKRUJFxOTiHZCSikYERhplbzL18YwjUnaciU4mUXzzXWUo5ymG403bGa2mBsP8iSK10weWuLszA)
- For a complete set of policies and requirements to accept payments, please read the [Payments Terms document](https://developers.facebook.com/policy/payments_terms).

## Great Experience

### The Payment Dialog

|     |     |
| --- | --- |
| ![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/12765854_973778722676901_449785803_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=ubTQAteI9zYQ7kNvwHgjiAe&_nc_oc=AdpcP0cpHcS_nFAN7bd9Z0DO0E-tPdorC2WlVHScQqfxPq_1hCv3XxbkhAe2h_h25r4&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af4qfyVyYBsyTpjkoX1VkTNOKWnydJnLtCqlfG2BKKSGlQ&oe=6A257EDA) | On Facebook, payments are handled via the Pay Dialog, which is rendered as an overlay over your game. Developers integrating this dialog enable their players to pay for virtual items or currency via a variety of payment methods, including credit card, PayPal and mobile carrier billing among others. |

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/12679449_1521453501495046_2079846071_n.png?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=xKl27es38zIQ7kNvwGmCcsE&_nc_oc=AdqTtLNLjhXlYtyd2-rh9TKlfhEYK2GYo7RfwLp-GuR-pklKZ_j7869aVfhQXmUCIu4&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af51uEp6xvsK7ov-wjGD15-4So1c63laCqcgq3Jb37oE3w&oe=6A112113)

Payment Dialog

### Paying with Different Methods

Facebook payments will always display prices in the player's preferred currency, customizing the experience for people all over the world.

|     |     |
| --- | --- |
| ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12765847_225528891123952_1289234763_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=Gex-Pu9n450Q7kNvwGWZRUs&_nc_oc=AdoXN4h7vAH3ZCQHNqNLlkJwp2P7Hvy1ZVjcGySz1jacBuSC28Otn_PDX0u3CktJH_Y&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af6I1fGt4W9QA7rvcQ29p5pW68c46rTzSH46ecwgkV_HGg&oe=6A259511) | **Credit Cards**<br>If a player chooses to purchase with a credit card and they have previously purchased on Facebook with a credit card, they are given the option to continue with their previous credit card details. For the case where the player wishes to purchase with a credit card but does not have one on file with Facebook, the flow will allow them to enter new credit card details. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12330649_208244956196817_928448671_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=RH5mERzbnxYQ7kNvwFlXHT8&_nc_oc=AdoMqd-vxYO2jgfMgtkyCFS-tf2ctqNeXHlejvRvbIfYvOeHJb_aC6V4W6eQ7-G3Tsg&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af42JXA-8xaBgloFWZ4CNBhzpotS6GQSYQdsRSxfpdGCTA&oe=6A25713E) | **PayPal** If a player chooses to pay through a PayPal account and already have their PayPal details on file with Facebook, they will see their email below the PayPal option. Once they click **Okay**, their email address will be automatically entered into the PayPal login window. If the customer elects to use their PayPal account, but does not have one associated with Facebook already, they will have an option to associate their account first. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/12679492_745713265530561_1734800585_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=csl4xItoK6oQ7kNvwFcVI27&_nc_oc=AdqSKdggtaFlsOGGg1axnEMc88cmQjoMR7dulF3N51Ab9Fguuh69pgBVufC4Irc1Fyk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af7SxPCstayH4_EP9KlS9XQndzo_ZBh3ODJpa-t6fioohw&oe=6A257DAE) | **Mobile** In most regions, people can additionally choose to pay via their mobile carrier, where the charge will appear as part of their monthly carrier bill, either via a direct charge or via SMS. If the customer has not previously entered mobile details with Facebook, they will be prompted to enter that information before the transaction can continue. In order to confirm the mobile is valid, a code will be sent via SMS to the number provided. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12330648_991966924186544_1289073804_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=EOfDrgW4HMEQ7kNvwE7waKf&_nc_oc=AdqZvUuRHfwZjkAkSuQUr02EiAGbcaPj7fs9GHumPZsNnJotJC0QL08K6fi26Q2MrzQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af7lDOW0dVyHNocsw6YNMFFr6Lt6pHo-Mz5VFCdU35FsZw&oe=6A257544) | **Alternate Payment Methods** We also support alternate payment methods, such as Western Union and MoneyGram, which vary from country to country. See [this list of supported alternate payment methods by country](https://www.facebook.com/help/203680236341574/) for more information.<br>**Note**: This is currently available only on FB Web and not in Gameroom. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12601251_1685536448395230_1101603983_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=ulvkQe3cFmkQ7kNvwFys6FN&_nc_oc=Adp7mpEBP4u4XQpRTkFihxuA1wHhpIYrpGCsBh6bS17i36xpKZwpkxaXR_WPh-8kOoA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af4MYGPJXm8kaukW6wZVMWFBfGogkiDmFd2btEWLnfGb4w&oe=6A2576A1) | **Facebook Game Cards** Game Cards are available in over 20 countries and in approximately 130,000 retail locations worldwide. They enable players to redeem a Game Card for an equivalent Facebook-stored balance that can be used to purchase in-game currency and goods. |

## Payments Features

|     |     |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/12809189_905977252854234_2134870379_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=uYb4aAuY_CUQ7kNvwFnSHVb&_nc_oc=AdpZg72u68DZvnAcIC5sMkz3dn0eYqSqFY2ydLMJMxve8dj5R3o2vdp4C0WEHrOnECM&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af5d1j8iwhwP_iJce6IVkjpb7A96LZNfQW6QVKRqluCe_Q&oe=6A257A23) | ### Easy Integration<br>Developers who use our Graph API and dialogs will already be familiar with our Payments APIs. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/12431828_999195920160537_214789608_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=AwbHFnkELUUQ7kNvwH-YQE9&_nc_oc=Adq92f_es2peC6crsicvcvFh1epbQY7v8IKiasm3QRCSyzpNKxa0zhNULepNVWVqLBk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af62ufYPoLAnoIAlpJVikotl3JKkKOSATo0AvMHWBESxSQ&oe=6A256C0B) | ### Support for Virtual Currencies and Items<br>There are two common product offerings that developers make available within their app store, both of which are supported by the payments system.<br>The most common model is for developers to sell their own in-app virtual currency, such as "coins," through our payments system. This currency can then be used within the game in exchange for virtual goods. Alternatively, you may choose to sell individual, discrete products in your game at a set price. A simple example of this approach might be offering a "starter pack," which contains a number of goods at a discounted price. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/12809175_1666458596946933_1563429103_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=1yv48KUyFwwQ7kNvwHvrdw9&_nc_oc=AdqJME4QjGRMuRaTvfSbXkzH1QS57r86XsbiXfAcDNlk5ZMNQ1N2eRMTPV0CndWnvWo&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af4rPKQ5pMbyc-LVEE9JoQwB24bWSwVBX-lB5dl1XW_Vmg&oe=6A2589C9) | ### Pricing Items in Specific Currencies<br>Items may be priced specifically in different currencies, enabling full flexibility with pricing strategies across multiple regions. The ability to provide a price for the item in multiple currencies means you have complete flexibility to target each region with different pricing strategies and specify appropriately rounded prices that customers are familiar seeing. If you do not define a price point for a particular local currency, people who select that specific currency will have their price automatically calculated based upon the current exchange rate between the first currency you specify and that target currency.<br>This architecture provides the flexibility to price goods appropriate to each region in which you're selling, but gives the assurance that if you do not provide specific pricing detail for a given region, Facebook will generate and charge an appropriate price for you. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12809196_1583785431939936_210945505_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=9CeIb3y9IMMQ7kNvwEklrpc&_nc_oc=AdpwlF3UicKUhInatmIuA8yLpt0JNcaOo0cfT7i_2XaOPGN7KAPV6unnzizVqhe7hrU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af6niInCF4U4rDxwQ657XnYYv3lkBnISE6k-Dzd4BwiQtA&oe=6A257899) | ### Static and Dynamic Pricing<br>The simplest method for pricing a product is Static Pricing. You specify a fixed price for the item in any number of local currencies. Specifying the price up-front allows Facebook to cache the pricing data, enabling the ability to instantly [display the Pay Dialog](https://developers.facebook.com/docs/games_payments/taking-payments).<br>Items can also be priced dynamically, allowing for more control over pricing in real time. A common example of this feature is when implementing a flash sale, where you temporarily reduce the cost of items within your app by a small percentage or when A/B testing different price-points to optimize conversion. Alternatively, it can be valuable to price goods specifically to individual players, allowing you to implement loyalty discounts. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/12431828_1657728151161314_149891711_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=HfJ13gQqQ8cQ7kNvwFdhwH4&_nc_oc=AdqPId_VUeiQhaydYpnqAkP90liqwiimKQZWVUAo_Wg55Dlgp8QKOXE1aqtRrRsT4eE&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af7bM8t3HijtXBdk8DZBVVvbj11r_1-2vD3ex8gWl-S_GA&oe=6A2577DD) | ### Secure Fulfillment of Purchases<br>Facebook has streamlined the order fulfillment process to avoid all blocking requests required before the pay dialog is closed and a purchase completed. This makes the user experience of purchasing a virtual item more efficient, leading to higher conversion rates.<br>There are two primary methods through which you are notified of the outcome of the purchase and a further method by which you can verify any payment information. First, Facebook will return details of the order via a JavaScript callback. At the same time, Facebook will issue a Webhook update notifying the developer that a new order has completed. Also, the transaction's `payment_id` can be used to verify details of a transaction via the Graph API at any time.<br>More details around fulfillment can be found in the [payments fulfillment documentation](https://developers.facebook.com/docs/games_payments/fulfillment/). |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/12809191_564379137073582_930055572_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=jkGXgIMd-agQ7kNvwGhQ_aF&_nc_oc=AdologsreoqiCN3vsX43mIPlHFpsvE6nRxNae88yTO1O2P94JHGZoLVbyo-ET1T5wXI&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af7TMlaGC5gtrnUCiCc7NRYDJ70FROLbSYOhSEuJ1LTaJQ&oe=6A2578FC) | ### Subscriptions<br>Expand beyond one-time payments with a new, recurring revenue stream from subscriptions. Entice new subscribers with a free trial and offer the renewal cycle that works for your game, whether that's weekly, monthly, or another time period. Game developers offering subscriptions have grown incremental revenue and increased engagement in their games.<br>See the [subscriptions overview and best practices](https://developers.facebook.com/docs/games_payments/advanced/subscriptions/) for more information. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/12809189_905977252854234_2134870379_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=uYb4aAuY_CUQ7kNvwFnSHVb&_nc_oc=AdpZg72u68DZvnAcIC5sMkz3dn0eYqSqFY2ydLMJMxve8dj5R3o2vdp4C0WEHrOnECM&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af5d1j8iwhwP_iJce6IVkjpb7A96LZNfQW6QVKRqluCe_Q&oe=6A257A23) | ### Payer Conversion Tools<br>Specific features for mobile payments help you optimize your pricing and payment experience for people who want to charge purchases to their mobile phone bill. |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/12601251_1685536448395230_1101603983_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=ulvkQe3cFmkQ7kNvwFys6FN&_nc_oc=Adp7mpEBP4u4XQpRTkFihxuA1wHhpIYrpGCsBh6bS17i36xpKZwpkxaXR_WPh-8kOoA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af4MYGPJXm8kaukW6wZVMWFBfGogkiDmFd2btEWLnfGb4w&oe=6A2576A1) | ### Game Cards<br>Facebook Game Cards are a popular way of purchasing items within games. In addition to redeeming the value of a Game Card via the [Facebook Game Card](https://www.facebook.com/gamecards) website, developers can also opt to offer their own in-app redemption flow. This enables players to directly redeem the full value of any Facebook Game Card straight into a game’s in-app currency. |

|     |     |
| --- | --- |
| ![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/12809180_192966657738523_533108068_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=fjokBMXEo6AQ7kNvwGFqtHc&_nc_oc=AdpjPiYVHiJFw00DejY0QQfirTnXdlU2f6xUN7FExV4h8PSRUFGalHi6id4tzQeiTSI&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=ZdWLPrkpOsVtBtj404B4-Q&_nc_ss=7b289&oh=00_Af5OYC-3OwLMqoLmZMtRXLDQIqkpN5NDsOLQgYKsKR3eig&oe=6A25730D) | ### Desktop Ads For Virtual Items and Currencies<br>Desktop engagement ads are a great way to bring back players of your game or app.<br>You can create virtual good offers which appear in the Feed or the right column with a clear call to action. This allows your existing players to buy content and get redirected to your game after they complete the purchase flow.<br>See [Desktop App Ads for Virtual Goods](https://developers.facebook.com/docs/games_payments/advanced/virtualgoodsads) for more information. |

## Getting Started

Developers can start integrating with Facebook Payments right away.

- For a technical walk-through of the product, see [Facebook Payments - Implementation Guide](https://developers.facebook.com/docs/games_payments/taking-payments).
- Also available is a series of videos, which couple with the guide linked above. Please see this [playlist of the videos.](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.youtube.com%2Fplaylist%3Flist%3DPLb0IAmt7-GS3d8N0Yafl1vLbRTw2YsN9F&h=AUDlFeW6blisu3eg-mXqk6hDdKCFr81BjlcFerq_VzJq3J04aipyRgWKtfQDgcBsChyZyI6GfldgVxZm6F9Z3-nEna2H0h_ccUWl8h_tUyM0aEduJWfrjZqlo3jtHtIKkJc_qydygD80yg)
- Have a question or feedback? [Submit it to the Facebook Developer Support Team](https://www.facebook.com/help/contact/893439374033406).

On This Page

[Game Payments](https://developers.facebook.com/docs/games_payments#-game-payments-)

[Great Experience](https://developers.facebook.com/docs/games_payments#experience)

[The Payment Dialog](https://developers.facebook.com/docs/games_payments#dialog)

[Paying with Different Methods](https://developers.facebook.com/docs/games_payments#methods)

[Payments Features](https://developers.facebook.com/docs/games_payments#features)

[Easy Integration](https://developers.facebook.com/docs/games_payments#integration)

[Support for Virtual Currencies and Items](https://developers.facebook.com/docs/games_payments#support)

[Pricing Items in Specific Currencies](https://developers.facebook.com/docs/games_payments#pricing)

[Static and Dynamic Pricing](https://developers.facebook.com/docs/games_payments#static_and_dynamic)

[Secure Fulfillment of Purchases](https://developers.facebook.com/docs/games_payments#secure_fulfillment)

[Subscriptions](https://developers.facebook.com/docs/games_payments#subscriptions)

[Payer Conversion Tools](https://developers.facebook.com/docs/games_payments#conversion_tools)

[Game Cards](https://developers.facebook.com/docs/games_payments#game_cards)

[Desktop Ads For Virtual Items and Currencies](https://developers.facebook.com/docs/games_payments#virtualgoods_ads)

[Getting Started](https://developers.facebook.com/docs/games_payments#getting_started)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close