---
url: https://developers.facebook.com/docs/facebook-login/permissions/overview
title: Permissions with Facebook Login | Developer Documentation
status: 200
---

Facebook Login

Facebook Login

[Facebook Login](https://developers.facebook.com/documentation/facebook-login)

[Overview](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Overview](https://developers.facebook.com/documentation/facebook-login/overview)

[Authentication Versus Data Access](https://developers.facebook.com/documentation/facebook-login/auth-vs-data)

[Login Security](https://developers.facebook.com/documentation/facebook-login/security)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens)

[Get Long-Lived Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived)

[OIDC Token with Manual Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/oidc-token)

[Get an OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-oidc)

[Get Session Info Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-session-info)

[Security](https://developers.facebook.com/documentation/facebook-login/access-tokens/security)

[Portability](https://developers.facebook.com/documentation/facebook-login/access-tokens/portability)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions)

[Request & Revoke](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke)

[Handle Declined Permissions](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined)

[Review](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review)

[Create an app](https://developers.facebook.com/documentation/facebook-login/create-an-app)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business)

[Conversions API Partner Integration Template](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/conversions-api-integration-template/)

[Business Integration Webhooks](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/integration-webhooks)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/managed-accounts)

[FAQ](https://developers.facebook.com/documentation/facebook-login/managed-accounts/faq)

[For Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

[Re-Authentication](https://developers.facebook.com/documentation/facebook-login/guides/advanced/re-authentication)

[Map Users Across Apps and Pages](https://developers.facebook.com/documentation/facebook-login/guides/map-users)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/test)

[Test User Data Access](https://developers.facebook.com/documentation/facebook-login/guides/test/data-access)

[Manually Build a Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow)

[iOS](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/permissions)

[Advanced](https://developers.facebook.com/documentation/facebook-login/ios/advanced)

[Limited Facebook Login](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios/limited-login)

[Unity](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/unity)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token)

[Validating the Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token/validating)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/permissions)

[FAQ](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/faq)

[Android](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Android](https://developers.facebook.com/documentation/facebook-login/android)

[Access Tokens and Profiles](https://developers.facebook.com/documentation/facebook-login/android/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/android/permissions)

[Troubleshooting](https://developers.facebook.com/documentation/facebook-login/android/troubleshooting)

[Web](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Web](https://developers.facebook.com/documentation/facebook-login/web)

[Login Button](https://developers.facebook.com/documentation/facebook-login/web/login-button)

[Access Tokens](https://developers.facebook.com/documentation/facebook-login/web/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/web/permissions)

[Enabling HTTPS](https://developers.facebook.com/documentation/facebook-login/web/enabling-https)

[JS Example](https://developers.facebook.com/documentation/facebook-login/web/js-example)

[Best Practices](https://developers.facebook.com/documentation/facebook-login/best-practices)

[User Experience Design](https://developers.facebook.com/documentation/facebook-login/userexperience)

[Login Connect with Messenger](https://developers.facebook.com/documentation/facebook-login/guides/permissions#)

[Overview](https://developers.facebook.com/documentation/facebook-login/login-connect)

[Implementing](https://developers.facebook.com/documentation/facebook-login/login-connect/implementing)

[FAQ](https://developers.facebook.com/documentation/facebook-login/login-connect/faq)

# Permissions with Facebook Login

Updated:Mar 3, 2026

When a person logs into your app via Facebook Login you can access a subset of that person’s data stored on Facebook. _Permissions_ are how you ask someone if you can access that data. A person’s privacy settings combined with what you ask for will determine what you can access.

[Requesting & Revoking](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke)

[Review](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review)

[Permissions Reference](https://developers.facebook.com/docs/facebook-login/permissions)

## Facebook Login Example

Permissions are strings that are passed along with a login request or an API call. For example, if you add the [login button](https://developers.facebook.com/documentation/facebook-login/web/login-button) to a web app and ask for `pages_show_list` via the `scope` parameter, a person would be prompted with this dialog when logging in for the first time. We provide similar mechanisms for iOS and Android. Links are provided for each platform in the [Requesting and Revoking](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke) guide.

## When to ask for Permissions

Your app can ask for additional permissions at any time, even after a person logs in for the first time. For example, the `user_photos` permission allows your app to get a person’s published photos. It’s recommended you ask for this permission only when your app needs to show the person their published photos. When you ask for new permissions, the person using your app will be asked about those new permissions and has the ability to opt out. For more information, see [Optimizing Permissions Requests](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke#optimizing).

Permissions only need to be granted once per app, i.e. permissions granted on one platform are effectively granted on all the platforms your app supports.

## User Control

Facebook Login allows **a person to grant only a subset of permissions** that you ask for to your app, except for public profile, which is always required. This is available as a separate screen in the login dialog when you ask for permissions. Your app should handle the case where someone had declined to grant your app one of the permissions you requested.

#### Revoked Permissions

People can also revoke permissions granted to your app in Facebook’s interface at any time after they have logged in. It is important that your app regularly checks which permissions have been granted, especially when launching on a new platform. We provide methods for you to [check what permissions are currently granted to your app](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke#checking).

## Granular Permissions

People can grant your app permissions for Pages and business assets they manage at the individual level. For example, someone who manages several Pages, may grant your app permission for only a particular Page or for only some of their Pages.

People choose which permissions they grant through a permission request flow. For example, if an app requests Page permissions, people receive a request to grant those permissions in the login dialog. If they don’t grant all the requested permisions, they can manage what sorts of permissions they grant and the assets, such as permission to a specific Page if they manage many, the app can access with those permissions.

If someone initially grants only some of the requested permissions, they can later change which permissions they allow through the app settings page. However, if they update this to grant all permissions, they will no longer be able to use the app settings page to change the permissions they have granted.

People can manage the following permissions at the individual level:

[All Page permissions](https://developers.facebook.com/docs/pages/overview#permissions)
[`business_management` permission](https://developers.facebook.com/docs/facebook-login/permissions#reference-business_management)

## Expiration of Permissions

If your app does not use a permission for 90 days, that permission may expire. This is true even if the permission was approved through app review.

Did you find this page helpful?

![Thumbs up icon](https://static.xx.fbcdn.net/rsrc.php/yR/r/OEXJ0_DJeZv.svg)

![Thumbs down icon](https://static.xx.fbcdn.net/rsrc.php/yb/r/qKPgNVNeatU.svg)

ON THIS PAGE

Facebook Login Example

When to ask for Permissions

User Control

Revoked Permissions

Granular Permissions

Expiration of Permissions

* * *