---
url: https://developers.facebook.com/docs/games/services/appnotifications/
title: App-to-User Notifications - Facebook Games
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgames%2Fbuild%2Flegacy-web-games%2Fgaming-services%2Fappnotifications%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Build](https://developers.facebook.com/docs/games/build)

- [Instant Games](https://developers.facebook.com/docs/games/build/instant-games)
- [Gaming Services](https://developers.facebook.com/docs/games/build/gaming-services)
- [Cross Play](https://developers.facebook.com/docs/games/build/crossplay)
- [Legacy Web Games](https://developers.facebook.com/docs/games/build/legacy-web-games)


  - [Get Started](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started)
  - [Monetization](https://developers.facebook.com/docs/games/build/legacy-web-games/monetization)
  - [Gaming Services](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services)


    - [Sharing](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/sharing)
    - [Game Requests](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/gamerequests)
    - [App-to-User Notifications](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications)

  - [Best Practices](https://developers.facebook.com/docs/games/build/legacy-web-games/best-practices)
  - [FAQ](https://developers.facebook.com/docs/games/build/legacy-web-games/faq)

- [Gaming Insights](https://developers.facebook.com/docs/games/build/fbs-insights)
- [Assets](https://developers.facebook.com/docs/games/build/assets)

On This Page

[App-to-User Notifications](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#app-to-user-notifications)

[Overview](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#overview)

[Implementation](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#implementation)

[Sending notifications](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#sendingnotifications)

[Parameters](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#parameters)

[Handling Return Values](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#handlingreturnvalues)

[Message Templates](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#messagetemplates)

[Plain Text Messages](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#plaintextmessages)

[Personalized Message Templates](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#personalizedmessagetemplates)

[Tracking Performance](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#trackingperformance)

[Minimum Click-to-impression Ratio](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#minimumcti)

[Using ref parameters in App Analytics](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#usingrefparams)

[Manual Optimisation](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#manual-optimisation)

[Localization of Message Template](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#localization)

[Send timing](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#sendtiming)

[Best Practices](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#bestpractices)

# App-to-User Notifications

## Overview

App-to-User Notifications are short free-form messages you can send to people using your app to reengage them. They are one of the most effective ways to communicate important events, invites from friends or actions people need to take. You use these notifications to send messages to people who have authorized your app.

App-to-User Notifications are available to all apps on Facebook.com, not only games. The notifications are only surfaced on the desktop web version of Facebook. Apps can send notifications to people who have authorised the app. No special or extended permission is required.

When a notification is delivered, it lights the notifications jewel on Facebook and appears in the drop down. Notifications appear with the app icon to the left, interspersed with other notifications based on chronological sorting.

Notifications themselves are short — up to 180 characters — strings of custom text. You can reference people by their FB app-scoped IDs. These will be expanded to show people's actual names, but the names won't be clickable. See the message template section below for more details.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/12057061_533833823448604_2011025726_n.png?_nc_cat=108&ccb=1-7&_nc_sid=34156e&_nc_ohc=hwSvmXSx7zMQ7kNvwFNlbE5&_nc_oc=Adqykl1C6UqCjw9eIJiWrDl-VCyVzwuSGvBP0v1v-mrQTyuZppwhHUl5KgvJVEldf5M&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=PZuWwuAXCAD951OjXTStEw&_nc_ss=7b289&oh=00_Af6KNZffNa8Vvbvw1zWqmDDq_7NvKey0pa9cEZHIIfYgXQ&oe=6A11253F)

When people click the notification, they'll be taken to a URL you specify with the notification.

## Implementation

### Sending notifications

Apps can generate notifications by issuing a `HTTP POST` request to the `/user_id/notifications` Graph API, with an `app access_token`. You may find more details by referring to the [Graph API notifications edge](https://developers.facebook.com/docs/graph-api/reference/user/notifications).

```
POST /{recipient_userid}/notifications?access_token= … &template= … &href= …
```

### Parameters

| Parameter | Description |
| --- | --- |
| `href` | The relative path or GET params of the target (for example, `index.html?gift_id=123`, or `?gift_id=123`). This will be used to construct an absolute target URL based on your app settings. The logic is that, on web, if the setting exists for games on Facebook.com, the target URL will comprise Game App URL + `href`. If not, the notification will not be shown. The absolute URL will include some special tracking params (`fb_source`, `notif_id`, `notif_t`) to the target URL for developers to track at their side. |
| `template` | The customised text of the notification. See the [message template](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#templating) section below for more details. |
| `ref` | Separate your notifications into groups so they can be tracked independently in App Analytics. |

### Handling Return Values

If the call is successful, the Graph API gives the following response:

```
{
  "success": true
}
```

If not, the Graph API response will include an error with a corresponding exception message.

If the user you're trying to send to has not authenticated your app, you will get a response like the following:

```
{
   "error": {
      "message": "(#200) Cannot send notifications to a user who has not installed the app",
      "type": "OAuthException",
      "code": 200
   }
}
```

If a person you're trying to tag has not authenticated your app, you will get the following response:

```
{
   "error": {
      "message": "(#200) Cannot tag users who have not installed the app",
      "type": "OAuthException",
      "code": 200
   }
}
```

If your template text contains more than 180 characters, the API will return an error as follows:

```
{
   "error": {
      "message": "(#100) template parameter cannot be longer than 180 characters.",
      "type": "OAuthException",
      "code": 100
   }
}
```

**Note:** If people turn off notifications from your app, posting will still succeed but the notification just will not appear in the UI.

### Message Templates

Notification messages are free-form text. The Graph API enforces a maximum of 180 characters in the `message` field.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/12057111_962033007251422_843658877_n.png?_nc_cat=106&ccb=1-7&_nc_sid=34156e&_nc_ohc=jXV78oc_iCUQ7kNvwFIP5yh&_nc_oc=AdoTDH9db84rJvvD-WPnyE6b3DKAddEDl4PBLLNg6RWWzUw_YozMjFHDNHGdhQOASlM&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=PZuWwuAXCAD951OjXTStEw&_nc_ss=7b289&oh=00_Af7wbCWxJZDlYRc8gmKHG0CpxubXYR6q1FtnC7F3-egVNA&oe=6A11239E)

### Plain Text Messages

This notification can be generated with the following graph API call:

```
POST /{recipient_userid}/notifications?
     access_token= … &
     href= … &
     template=You have people waiting to play with you, play now!
```

### Personalized Message Templates

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/12057085_1507268539568518_556310443_n.png?_nc_cat=103&ccb=1-7&_nc_sid=34156e&_nc_ohc=LfwABzAdYcUQ7kNvwHfQxHZ&_nc_oc=AdqcltbIt-acNTzIvbBdVTSigPjbIs2aSFfTe4TkIiOEDxBsQu5vDf7wnN9vCr2RKKA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=PZuWwuAXCAD951OjXTStEw&_nc_ss=7b289&oh=00_Af5MNqclPVX_QqKyMd_Fi-0QzBYJNnwYUmxX8PejrwjB3w&oe=6A10FB03)

You use `@[USER_ID]` to include user\_ids, which will be replace with the person's full name and highlight it at rendering time.

The notification above can be generated by formatting the template with the user IDs as shown in the code below.

```
POST /{recipient_userid}/notifications?
     access_token= … &
     href= … &
     template=@[596824621] started a game with you, play now!
```

Similarly, the notification above also uses the `@[USER_ID]` syntax but has more than one actor (person) in the template.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2178-6/12057237_559404904216414_2129762709_n.png?_nc_cat=108&ccb=1-7&_nc_sid=34156e&_nc_ohc=VFrlWok6O2kQ7kNvwEEPnY2&_nc_oc=AdrluvjIqbw2A1IuHVUXaulWnNHeB04Po9KgF7Jk9nR8mz8kZrOH5AeYk01byw6ITJQ&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=PZuWwuAXCAD951OjXTStEw&_nc_ss=7b289&oh=00_Af416wzRwq9lFlzQMjEAeTCvH-Tyo_EiK-oZhtkam3Os1g&oe=6A1107F4)

```
POST /{recipient_userid}/notifications?
     access_token= … &
     href= … &
     template=@[596824621] and @[10149999096285761] started a game with you!
```

The Graph API verifies each `USER_ID` to make sure it is valid Facebook user and has already authenticated your app. If any are invalid, the API call will fail.

## Tracking Performance

### Minimum Click-to-impression Ratio

The click-to-impression (CTI) ratio is one of the most important measure of the effectiveness of your notifications. Notifications that have a high CTI are interesting and engaging to people. Notifications with a low CTI are considered poor quality. Over time, people will tend to ignore or disable low CTI notifications, hurting performance of your app's performance and others, too.

To ensure the notifications channel remains interesting to people on Facebook, apps that send more than 50,000 notifications in a week are required to maintain at least a 17% weekly click-to-impression (CTI) ratio. Data shows that people engage for longer when apps maintain this ratio or higher. Apps that do not maintain this rate on a weekly basis may be temporarily disabled.

Most applications can maintain this rate quite easily if they follow the [simple best practices](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#best_practices) in the section below.

### Using ref parameters in App Analytics

In Facebook Analytics, you can track the performance of your notifications in Integrations > App Notifications. By selecting **Show By Ref Parameter**, you can see how different notification campaigns perform. Ref parameters are groups that can be defined by the developer when notifications are posted to the Graph API. For more information, please refer to the above section on Sending Notifications.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/12057115_1012205785469262_1452760219_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=34156e&_nc_ohc=LndSMUv67CwQ7kNvwGCxqH0&_nc_oc=AdrTkxJZc77Xz3SuNb1cLOnte00db2wFwMbRZAirVP79LL2pIIDUVXEgqWOLlRX0-3s&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=PZuWwuAXCAD951OjXTStEw&_nc_ss=7b289&oh=00_Af4x-9hZzktUFgYkoSPgNoprDHzoLORjbIcqQgDk6RoSuw&oe=6A1125D8)

## Manual Optimisation

### Localization of Message Template

To send non-English notification, developers need to manually track the locale of person. After the person has logged in, the locale can be accessed via the [Graph API edge /{user-id}?fields=locale](https://developers.facebook.com/docs/graph-api/reference/user/#Reading). For games on Facebook.com, the locale information can be retrieved from the HTTP post request. With knowledge of the locale, developers can manually create message templates that corresponds to the user's locale.

### Send timing

Developers can better optimise the notifications to be sent in the person's waking hours. After the person has logged in, the timezone can be accessed via the [Graph API edge /{user-id}?fields=timezone](https://developers.facebook.com/docs/graph-api/reference/user/#Reading). With timezone information and using ref parameters, developers can better target and optimise for the best timing to send notifications to people.

## Best Practices

Since quality is so important, recipients on Facebook can easily turn off notifications they don't like or report them as spam. We use these signals to promote notifications people like and reduce distribution for notifications people don't like. This helps to keep notifications useful for everyone.

People don’t differentiate notifications from the rest of their experience on Facebook, so each message has a lot of power. One unwanted message can make someone start ignoring notifications or turn them off entirely.

To help you create clear and compelling notifications, we’ve put these best practices together.

1. **No inactive people.** Your app should not send notifications to people who have not used it in the last 28 days. Data shows that engagement among this group is significantly lower. They are also the most likely to report your notifications as spam. Apps that receive a high degree of spam reports may be disabled.
2. **Start small.** Even if you have a large app, start by testing your notifications on a few people so you stay below the 50,000-per-week threshold. This way you can experiment with your notifications until you learn what works best for people.
3. **Only send one or two notifications to people each day.** After two notifications in one day, many people stop responding or mark apps as spam.
4. **Don't fatigue your audience.** It is generally not good practice to send too many notifications to the same person within a short period of time. By using App Analytics, developers can find the sweet spot to re-engage players by comparing results using ref parameters of different timings - 2 hours, 6 hours, 1 day, 3 days, 1 week or even up to 2 weeks.

On This Page

[App-to-User Notifications](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#app-to-user-notifications)

[Overview](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#overview)

[Implementation](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#implementation)

[Sending notifications](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#sendingnotifications)

[Parameters](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#parameters)

[Handling Return Values](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#handlingreturnvalues)

[Message Templates](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#messagetemplates)

[Plain Text Messages](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#plaintextmessages)

[Personalized Message Templates](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#personalizedmessagetemplates)

[Tracking Performance](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#trackingperformance)

[Minimum Click-to-impression Ratio](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#minimumcti)

[Using ref parameters in App Analytics](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#usingrefparams)

[Manual Optimisation](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#manual-optimisation)

[Localization of Message Template](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#localization)

[Send timing](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#sendtiming)

[Best Practices](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services/appnotifications#bestpractices)