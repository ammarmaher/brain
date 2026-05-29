---
url: https://developers.facebook.com/docs/sharing/reference/share-dialog/
title: Share Dialog - Sharing
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fsharing%2Freference%2Fshare-dialog%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Sharing](https://developers.facebook.com/docs/sharing)

- [Overview](https://developers.facebook.com/docs/sharing/overview)
- [iOS](https://developers.facebook.com/docs/sharing/ios)
- [Android](https://developers.facebook.com/docs/sharing/android)
- [Web](https://developers.facebook.com/docs/sharing/web)


  - [Share Dialog](https://developers.facebook.com/docs/sharing/reference/share-dialog)
  - [Feed Dialog](https://developers.facebook.com/docs/sharing/reference/feed-dialog)
  - [Send Dialog](https://developers.facebook.com/docs/sharing/reference/send-dialog)

- [Messenger](https://developers.facebook.com/docs/sharing/messenger)
- [Sharing to Stories](https://developers.facebook.com/docs/sharing/sharing-to-stories)
- [Webmasters](https://developers.facebook.com/docs/sharing/webmasters)
- [Domain Verification](https://developers.facebook.com/docs/sharing/domain-verification)
- [Best Practices](https://developers.facebook.com/docs/sharing/best-practices)

On This Page

[Share Dialog](https://developers.facebook.com/docs/sharing/reference/share-dialog/#share-dialog)

[Share by Using URL Redirection](https://developers.facebook.com/docs/sharing/reference/share-dialog/#redirect)

[Share by Using the Facebook SDK for JavaScript](https://developers.facebook.com/docs/sharing/reference/share-dialog/#integrating)

[Parameters](https://developers.facebook.com/docs/sharing/reference/share-dialog/#params)

[Response Data](https://developers.facebook.com/docs/sharing/reference/share-dialog/#response)

[See Also](https://developers.facebook.com/docs/sharing/reference/share-dialog/#see-also)

# Share Dialog

The Share dialog gives people the ability to publish an individual story to their timeline. This documentation describes how to implement the Share dialog on the Web. To implement the Share dialog in a mobile app, see [Sharing on iOS](https://developers.facebook.com/docs/sharing/ios) and [Sharing on Android](https://developers.facebook.com/docs/sharing/android).

The following is an example of the Share dialog that is sharing a link to a user's timeline.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/462397049_2831345450366183_8279845218954457248_n.png?_nc_cat=108&ccb=1-7&_nc_sid=f537c7&_nc_ohc=BTq9ILWYSSYQ7kNvwE87w2L&_nc_oc=Adpq7_O8q6MPCMgtZCNYk3F_Y3RUs_Jkh2hOsv-m5Ega7Pm1-ew0fbE4U-YVngv6QlM&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=l9QZrrP4IKm30Ga_Jti7Bw&_nc_ss=7b289&oh=00_Af7luLO9XParONqd4pTm66twfLI02__1kMqOAAEPL2erQQ&oe=6A102127)

If you are the Webmaster for a page that is shared to Facebook, include [open graph meta tags](https://developers.facebook.com/docs/web/webmasters/) to customize the story that is shared back to Facebook. It's important that you mark up your website with Open Graph tags to take control over how your content appears on Facebook. For more information, see [A Guide to Sharing for Webmasters](https://developers.facebook.com/docs/sharing/webmasters).

## Share by Using URL Redirection

To share a link by using URL redirection, use the following code. Line breaks are included for ease of reading. Remove the line breaks when you use this code.

```code
https://www.facebook.com/dialog/share?
  app_id=145634995501895
  &display=popup
  &href=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2F
  &redirect_uri=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer
```

## Share by Using the Facebook SDK for JavaScript

The Share dialog is available in the Facebook SDK for JavaScript by using the [FB.ui function](https://developers.facebook.com/docs/reference/javascript/FB.ui/) with the `share` method parameter. Use the following code snippet to open the Share dialog.

```code
FB.ui({
  method: 'share',
  href: 'https://developers.facebook.com/docs/',
}, function(response){});
```

[![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/12532984_192879307770536_469518167_n.png?_nc_cat=111&ccb=1-7&_nc_sid=e280be&_nc_ohc=fVB-YayZzfUQ7kNvwFz7MAC&_nc_oc=Ado5ZF2Vq7pDQ5JBpQFvkBVqrAH-XnOLm5y-w92VGzyCdjR7RAHF3iUqb2sUO4yi0WI&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=l9QZrrP4IKm30Ga_Jti7Bw&_nc_ss=7b289&oh=00_Af4zcUlh8HpCPaJEeCNDKagZ5gPqSkFDQJITXP1fPZV6pw&oe=6A24B554)Try it yourself!](https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.fbrell.com%2FSharing%2F2%2520-%2520FB.ui%2520Dialogs&h=AUB8g6fho9Wg7k2TlZw8JVCbS_DfjSrV8mE9wyWXZvuPxSAkvGENxH0lNT8v16pEnEjxa5Iwtk9oIdggByX4Z0VZadzgcDoegCP6guavNgadldzZbp5H5DdDy35xXbzgouvJ9VISK0oqsA)

## Parameters

The following are the parameters for the Share dialog.

| Parameter | Description | Required? |
| --- | --- | --- |
| `app_id` | Your app's unique identifier. | Yes. Provided automatically when you use the SDK. |
| `display` | How the Share dialog is rendered.<br>- **URL Redirection** – The `display` value is `page`. The Share dialog is a full page that appears within Facebook.com.<br>  <br>- **Facebook SDK for JavaScript** – The display value is one of the following:<br>  <br>  <br>  - a modal `iframe` for people logged into your app<br>  - `async` when using within a game on Facebook.com <br>  - a `popup` window for everyone else<br>If necessary, you can force the `popup` type when when you use the Facebook SDK for JavaScript.<br>- **Mobile Web Apps** – The `display` value is always `touch`.<br>  <br>- **Facebook SDK for iOS or Android** – The SDK specifies `display` automatically and chooses an appropriate display type for the device. | Yes. Provided automatically when you use the SDK. |
| `hashtag` | A hashtag to add to the shared content. People can remove the hashtag in the Share dialog. The hashtag should include the hash symbol, for example `#facebook`. The default value is `null`. | No |
| `href` | The link to share. The default value is the current URL. | Required when you use the SDK. |
| ~~`redirect_uri`~~ <br>Deprecated | ~~The URL to redirect to after a person clicks a button on the Share dialog.~~ | ~~Yes. Provided automatically when you use the SDK.~~ |
| ~~`mobile_iframe`~~ <br>Deprecated | ~~`true` to open the share dialog in an iframe on top of your website. This option is only available for mobile, not desktop~~ | ~~`false`~~ |

## Response Data

A response only occurs if the user is logged into your app using Facebook Login.

| Parameter | Description |
| --- | --- |
| `error_message` | An error message. |

## See Also

- [Best Practices for Sharing](https://developers.facebook.com/docs/sharing/best-practices)

On This Page

[Share Dialog](https://developers.facebook.com/docs/sharing/reference/share-dialog/#share-dialog)

[Share by Using URL Redirection](https://developers.facebook.com/docs/sharing/reference/share-dialog/#redirect)

[Share by Using the Facebook SDK for JavaScript](https://developers.facebook.com/docs/sharing/reference/share-dialog/#integrating)

[Parameters](https://developers.facebook.com/docs/sharing/reference/share-dialog/#params)

[Response Data](https://developers.facebook.com/docs/sharing/reference/share-dialog/#response)

[See Also](https://developers.facebook.com/docs/sharing/reference/share-dialog/#see-also)