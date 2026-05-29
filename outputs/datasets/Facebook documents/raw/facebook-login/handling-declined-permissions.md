---
url: https://developers.facebook.com/docs/facebook-login/handling-declined-permissions
title: Handling Declined Permissions | Developer Documentation
status: 200
---

Facebook Login

Facebook Login

[Facebook Login](https://developers.facebook.com/documentation/facebook-login)

[Overview](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Overview](https://developers.facebook.com/documentation/facebook-login/overview)

[Authentication Versus Data Access](https://developers.facebook.com/documentation/facebook-login/auth-vs-data)

[Login Security](https://developers.facebook.com/documentation/facebook-login/security)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens)

[Get Long-Lived Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived)

[OIDC Token with Manual Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/oidc-token)

[Get an OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-oidc)

[Get Session Info Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-session-info)

[Security](https://developers.facebook.com/documentation/facebook-login/access-tokens/security)

[Portability](https://developers.facebook.com/documentation/facebook-login/access-tokens/portability)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions)

[Request & Revoke](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke)

[Handle Declined Permissions](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined)

[Review](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review)

[Create an app](https://developers.facebook.com/documentation/facebook-login/create-an-app)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business)

[Conversions API Partner Integration Template](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/conversions-api-integration-template/)

[Business Integration Webhooks](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/integration-webhooks)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/managed-accounts)

[FAQ](https://developers.facebook.com/documentation/facebook-login/managed-accounts/faq)

[For Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

[Re-Authentication](https://developers.facebook.com/documentation/facebook-login/guides/advanced/re-authentication)

[Map Users Across Apps and Pages](https://developers.facebook.com/documentation/facebook-login/guides/map-users)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/test)

[Test User Data Access](https://developers.facebook.com/documentation/facebook-login/guides/test/data-access)

[Manually Build a Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow)

[iOS](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/permissions)

[Advanced](https://developers.facebook.com/documentation/facebook-login/ios/advanced)

[Limited Facebook Login](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios/limited-login)

[Unity](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/unity)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token)

[Validating the Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token/validating)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/permissions)

[FAQ](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/faq)

[Android](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Android](https://developers.facebook.com/documentation/facebook-login/android)

[Access Tokens and Profiles](https://developers.facebook.com/documentation/facebook-login/android/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/android/permissions)

[Troubleshooting](https://developers.facebook.com/documentation/facebook-login/android/troubleshooting)

[Web](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Web](https://developers.facebook.com/documentation/facebook-login/web)

[Login Button](https://developers.facebook.com/documentation/facebook-login/web/login-button)

[Access Tokens](https://developers.facebook.com/documentation/facebook-login/web/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/web/permissions)

[Enabling HTTPS](https://developers.facebook.com/documentation/facebook-login/web/enabling-https)

[JS Example](https://developers.facebook.com/documentation/facebook-login/web/js-example)

[Best Practices](https://developers.facebook.com/documentation/facebook-login/best-practices)

[User Experience Design](https://developers.facebook.com/documentation/facebook-login/userexperience)

[Login Connect with Messenger](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#)

[Overview](https://developers.facebook.com/documentation/facebook-login/login-connect)

[Implementing](https://developers.facebook.com/documentation/facebook-login/login-connect/implementing)

[FAQ](https://developers.facebook.com/documentation/facebook-login/login-connect/faq)

# Handling Declined Permissions

Updated:Apr 6, 2022

When people create accounts or log into your app using Facebook Login, they have the opportunity to grant the [permissions you request](https://developers.facebook.com/docs/facebook-login/permissions). But people also have an opportunity to decline all permissions except their public profile. People may choose to do this if they feel uncomfortable sharing this information with your app, or they don’t understand how that information will be used to enhance their experience.

When people choose to decline permissions, its important your app respects their choice and still provides a great experience for people.

In general, your app may react in one of three ways:

[Continue on without the information](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#continue-without)
[Explain why you need the information and reprompt for it](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#reprompt)
[Collect the information yourself](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined#collect-yourself)

## Continue Without the Information

In some cases, a certain requested permission may not be required for your app to function. In this case, the simpliest thing to do is to respect permission decline and continue to lead them into the app.

In the example below, _Flick Finder_ might be able to provide enhanced movie recommendations if it had access to the `user_likes` permission. But since the person declined that permission, _Flick Finder_ just presents more generic recommendations.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/646679294_1448583553666961_5127453827548094494_n.gif?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=0YNM7jgK2r8Q7kNvwF-_xCK&_nc_oc=AdrGvnjG5FD_hdc4HxnrW8_o8lsKpBc_nD7V0xW7EMcShyvVbgZjJ0KidbU613XeEtw&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=L-at-GKMJH4LO6YJmKh6kg&_nc_ss=7b289&oh=00_Af5D6bNwTr37jmFfzlvAKNpztKJXf0nujMTfabJmdqNvTA&oe=6A258BC7)

This is the simplest option, and provides a great respectful experience to people who choose to decline certain permissions.

## Explain Why and Reprompt

People may decline a permission because they don’t understand why your app needs that information. In this case, your app could display a dialog explaining why you need the information and how it’ll be used to enhance the experience.

In the example below _Flick Finder_ displays a dialog explaining that with an email address, the app can send you updated when new movies become available. The “Add Email” button takes the person back to the Facebook Login flow where they can grant the `email` permission.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/646703215_1448583583666958_1909482690993375723_n.gif?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=TwsfeSgW2bYQ7kNvwFZ1T42&_nc_oc=AdrlmT-1hEWv14xT9QjW1v7rWK3sdSbLu4MKszu0p9vhgtUeFEq845J_OgnDCjBDkKw&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=L-at-GKMJH4LO6YJmKh6kg&_nc_ss=7b289&oh=00_Af6FEgFl9TKt2_GoVb_odqTuGs8iXbemfSpDSSrC7HJjTg&oe=6A2590A2)

Note that in this example, the person still has the opportunity not to grant the `email` permission.

This strategy can be used for permission which is critical or highly desirable for the functionality of your app.

## Collect the Information Yourself

Some pieces of information may be simple enough to collect for yourself.

In this example, _Flick Finder_ wants to collect a person’s birthday so it can recommend age-appropriate movies. If a person has declined to share their birthday when they logged in with Facebook, _Flick Finder_ can still create a place to collect the information inside the app, separate from the Facebook Login flow. We recommend doing this after a person has had some time to familiarize themselves with your app, so they have a better understanding of how the permission will improve their experience.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/646688096_1448583590333624_7816773087280346602_n.gif?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=b3ZnFr2aSNgQ7kNvwGr_xBg&_nc_oc=AdrEZUvkz5v4O83a9rq3y9keWRVSgtWc91rOKv2gn9HlxGxDJ-Ov4Z9mBfy0BatGuTw&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=L-at-GKMJH4LO6YJmKh6kg&_nc_ss=7b289&oh=00_Af44tUtb7TQ7WIFtzYChuNFG9suq9CLqpZ198sG1CLFQhw&oe=6A25979F)

Examples of information which might be collected this way includes `user_hometown`, `user_location`, `user_birthday` or even `email`.

## Detecting Declined Permissions

When people decline permissions as part of a Facebook Login flow, we make it easy for your app to detect this and react using one of the strategies outlined above.

### Android SDK

On Android, you can call the [`getDeclinedPermissions`](https://developers.facebook.com/docs/reference/android/current/class/AccessToken#getDeclinedPermissions) method on the [`AccessToken`](https://developers.facebook.com/docs/reference/android/current/class/AccessToken) object in the [Facebook SDK for Android](https://developers.facebook.com/documentation/android).

### iOS SDK

On iOS, you can call the [`[FBSDKAccessToken declinedPermissions]`](https://developers.facebook.com/docs/reference/ios/current/class/FBSDKAccessToken#declinedPermissions) method in the [Facebook SDK for iOS](https://developers.facebook.com/documentation/ios).

### JavaScript SDK

To detect declined permissions, you can call the `permissions` edge on the `User` object of the Graph API. You can collect any declined permissions by iterating through the response:

```
FB.api('/me/permissions', function(response) {
  var declined = [];
  for (i = 0; i < response.data.length; i++) {
    if (response.data[i].status == 'declined') {
      declined.push(response.data[i].permission)
    }
  }
  alert(declined.toString())
});
```

### API

To detect declined permissions, you can call the `permissions` edge on the `User` object of the Graph API:

```
GET https://graph.facebook.com/me/permissions?access_token=USER_ACCESS_TOKEN
```

which yeilds a response of the form:

```
{ "data": [\
    {\
      "permission": "user_birthday",\
      "status": "granted"\
    },\
    {\
      "permission": "public_profile",\
      "status": "granted"\
    },\
    {\
      "permission": "email",\
      "status": "declined"\
    }\
]}
```

This tells your app that the person granted the `user_birthday` and `public_profile` permissions, but chose to decline the `email` permission.

## Summary

Elegantly handling declined permissions is an important part of providing a great Facebook Login experience to people.

Implementing one of the above strategies will ensure the people who download and install your app are able to log in without encountering disruptive and frustrating experience which affect your app’s reputation and app store rating.

Did you find this page helpful?

![Thumbs up icon](https://static.xx.fbcdn.net/rsrc.php/yR/r/OEXJ0_DJeZv.svg)

![Thumbs down icon](https://static.xx.fbcdn.net/rsrc.php/yb/r/qKPgNVNeatU.svg)

ON THIS PAGE

Continue Without the Information

Explain Why and Reprompt

Collect the Information Yourself

Detecting Declined Permissions

Android SDK

iOS SDK

JavaScript SDK

API

Summary

* * *