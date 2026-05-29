---
url: https://developers.facebook.com/docs/facebook-login/permissions/review
title: Permissions / Login Review | Developer Documentation
status: 200
---

Facebook Login

Facebook Login

[Facebook Login](https://developers.facebook.com/documentation/facebook-login)

[Overview](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Overview](https://developers.facebook.com/documentation/facebook-login/overview)

[Authentication Versus Data Access](https://developers.facebook.com/documentation/facebook-login/auth-vs-data)

[Login Security](https://developers.facebook.com/documentation/facebook-login/security)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens)

[Get Long-Lived Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived)

[OIDC Token with Manual Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/oidc-token)

[Get an OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-oidc)

[Get Session Info Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-session-info)

[Security](https://developers.facebook.com/documentation/facebook-login/access-tokens/security)

[Portability](https://developers.facebook.com/documentation/facebook-login/access-tokens/portability)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions)

[Request & Revoke](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke)

[Handle Declined Permissions](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined)

[Review](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review)

[Create an app](https://developers.facebook.com/documentation/facebook-login/create-an-app)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business)

[Conversions API Partner Integration Template](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/conversions-api-integration-template/)

[Business Integration Webhooks](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/integration-webhooks)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/managed-accounts)

[FAQ](https://developers.facebook.com/documentation/facebook-login/managed-accounts/faq)

[For Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

[Re-Authentication](https://developers.facebook.com/documentation/facebook-login/guides/advanced/re-authentication)

[Map Users Across Apps and Pages](https://developers.facebook.com/documentation/facebook-login/guides/map-users)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/test)

[Test User Data Access](https://developers.facebook.com/documentation/facebook-login/guides/test/data-access)

[Manually Build a Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow)

[iOS](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/permissions)

[Advanced](https://developers.facebook.com/documentation/facebook-login/ios/advanced)

[Limited Facebook Login](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios/limited-login)

[Unity](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/unity)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token)

[Validating the Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token/validating)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/permissions)

[FAQ](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/faq)

[Android](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Android](https://developers.facebook.com/documentation/facebook-login/android)

[Access Tokens and Profiles](https://developers.facebook.com/documentation/facebook-login/android/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/android/permissions)

[Troubleshooting](https://developers.facebook.com/documentation/facebook-login/android/troubleshooting)

[Web](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Web](https://developers.facebook.com/documentation/facebook-login/web)

[Login Button](https://developers.facebook.com/documentation/facebook-login/web/login-button)

[Access Tokens](https://developers.facebook.com/documentation/facebook-login/web/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/web/permissions)

[Enabling HTTPS](https://developers.facebook.com/documentation/facebook-login/web/enabling-https)

[JS Example](https://developers.facebook.com/documentation/facebook-login/web/js-example)

[Best Practices](https://developers.facebook.com/documentation/facebook-login/best-practices)

[User Experience Design](https://developers.facebook.com/documentation/facebook-login/userexperience)

[Login Connect with Messenger](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review#)

[Overview](https://developers.facebook.com/documentation/facebook-login/login-connect)

[Implementing](https://developers.facebook.com/documentation/facebook-login/login-connect/implementing)

[FAQ](https://developers.facebook.com/documentation/facebook-login/login-connect/faq)

# Permissions / Login Review

Updated:Mar 14, 2026

If your app asks for more than than `public_profile` and `email`, it will require review by Facebook before your app can be used by people other than the app’s developers.

Due to changes to the review process and the high volume of submissions expected, it may take several weeks for submitted apps to complete review.

[Login Review Guide](https://developers.facebook.com/docs/facebook-login/review)

## Categories

Permissions are placed into categories that reflect how they are presented to people and the review process.

Some sets of permissions are more sensitive than others and people can opt-out of providing access to them, even if you ask. Optional permissions show up on a separate dialog during the login process, and the person can press the ‘Skip’ button to not grant your app permission to access that set of data.

### Permissions That Do Not Require Review

[Public profile (default) permissions](https://developers.facebook.com/docs/permissions/reference/public_profile). The default includes some basic attributes about the person, which are part of a person’s public profile on Facebook. The default permissions are included as part of every permissions request, but require slightly different handling on the web and native mobile platforms.
[Email permissions](https://developers.facebook.com/docs/permissions/reference/email). This gives you access to the person’s primary email address.

### Permissions That Require Review

Permissions that require review are generally reviewed within 3 business days. Some permissions may take up to 7 days to review, and are marked as such in the reference.

[App friends](https://developers.facebook.com/docs/permissions/reference/user_friends). This optional permission grants your app the ability to read a list of friends who also use your app.
[Extended profile properties](https://developers.facebook.com/docs/facebook-login/permissions). These permissions are all sensitive properties that may or may not be part of a person’s public profile.
[Extended permissions](https://developers.facebook.com/docs/facebook-login/permissions). These include the most sensitive pieces of profile information. One of the these permissions is publishing stories to a person’s Facebook profile. All extended permissions appear on a separate screen during the login flow so a person can decide if they want to grant them.
[Page permissions](https://developers.facebook.com/docs/permissions/reference/manage_pages). This permission allows you to administer any Facebook Pages that the person manages.

Did you find this page helpful?

![Thumbs up icon](https://static.xx.fbcdn.net/rsrc.php/yR/r/OEXJ0_DJeZv.svg)

![Thumbs down icon](https://static.xx.fbcdn.net/rsrc.php/yb/r/qKPgNVNeatU.svg)

ON THIS PAGE

Categories

Permissions That Do Not Require Review

Permissions That Require Review

* * *