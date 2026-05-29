---
url: https://developers.facebook.com/docs/facebook-login
title: Facebook Login | Developer Documentation
status: 200
---

Facebook Login

Facebook Login

[Facebook Login](https://developers.facebook.com/documentation/facebook-login)

[Overview](https://developers.facebook.com/documentation/facebook-login#)

[Overview](https://developers.facebook.com/documentation/facebook-login/overview)

[Authentication Versus Data Access](https://developers.facebook.com/documentation/facebook-login/auth-vs-data)

[Login Security](https://developers.facebook.com/documentation/facebook-login/security)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login#)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens)

[Get Long-Lived Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived)

[OIDC Token with Manual Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/oidc-token)

[Get an OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-oidc)

[Get Session Info Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-session-info)

[Security](https://developers.facebook.com/documentation/facebook-login/access-tokens/security)

[Portability](https://developers.facebook.com/documentation/facebook-login/access-tokens/portability)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login#)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions)

[Request & Revoke](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke)

[Handle Declined Permissions](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined)

[Review](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review)

[Create an app](https://developers.facebook.com/documentation/facebook-login/create-an-app)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login#)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business)

[Conversions API Partner Integration Template](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/conversions-api-integration-template/)

[Business Integration Webhooks](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/integration-webhooks)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login#)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/managed-accounts)

[FAQ](https://developers.facebook.com/documentation/facebook-login/managed-accounts/faq)

[For Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

[Re-Authentication](https://developers.facebook.com/documentation/facebook-login/guides/advanced/re-authentication)

[Map Users Across Apps and Pages](https://developers.facebook.com/documentation/facebook-login/guides/map-users)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login#)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/test)

[Test User Data Access](https://developers.facebook.com/documentation/facebook-login/guides/test/data-access)

[Manually Build a Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow)

[iOS](https://developers.facebook.com/documentation/facebook-login#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/permissions)

[Advanced](https://developers.facebook.com/documentation/facebook-login/ios/advanced)

[Limited Facebook Login](https://developers.facebook.com/documentation/facebook-login#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios/limited-login)

[Unity](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/unity)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login#)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token)

[Validating the Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token/validating)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/permissions)

[FAQ](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/faq)

[Android](https://developers.facebook.com/documentation/facebook-login#)

[Android](https://developers.facebook.com/documentation/facebook-login/android)

[Access Tokens and Profiles](https://developers.facebook.com/documentation/facebook-login/android/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/android/permissions)

[Troubleshooting](https://developers.facebook.com/documentation/facebook-login/android/troubleshooting)

[Web](https://developers.facebook.com/documentation/facebook-login#)

[Web](https://developers.facebook.com/documentation/facebook-login/web)

[Login Button](https://developers.facebook.com/documentation/facebook-login/web/login-button)

[Access Tokens](https://developers.facebook.com/documentation/facebook-login/web/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/web/permissions)

[Enabling HTTPS](https://developers.facebook.com/documentation/facebook-login/web/enabling-https)

[JS Example](https://developers.facebook.com/documentation/facebook-login/web/js-example)

[Best Practices](https://developers.facebook.com/documentation/facebook-login/best-practices)

[User Experience Design](https://developers.facebook.com/documentation/facebook-login/userexperience)

[Login Connect with Messenger](https://developers.facebook.com/documentation/facebook-login#)

[Overview](https://developers.facebook.com/documentation/facebook-login/login-connect)

[Implementing](https://developers.facebook.com/documentation/facebook-login/login-connect/implementing)

[FAQ](https://developers.facebook.com/documentation/facebook-login/login-connect/faq)

# Facebook Login

Updated:Mar 3, 2026

If you are a Facebook user and are having trouble signing into your account, visit our [Help Center⁠](https://www.facebook.com/help/1573156092981768/).

After you integrate Facebook Login, certain App Events are automatically logged and collected for [Events Manager⁠](https://www.facebook.com/events_manager), unless you disable Automatic App Event Logging. We recommend all app developers using Facebook Login to understand how this functionality works. In particular, when launching an app in Korea, please note that Automatic App Event Logging can be disabled. For details, see [Automatic App Event Logging](https://developers.facebook.com/docs/app-events/automatic-event-collection-detail).

A secure, fast, and convenient way for users to log into your app, and for your app to ask for permissions to access data

![Image](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/653702356_1459945779197405_8088740957725660993_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=qgA7bF9XpzMQ7kNvwHpAAQl&_nc_oc=AdqBCQ-MNQWuZCyu9X5n_WRwIbPbkKYPgdRJomgE91I4-ae89ywkd5-SrxGZo9sq6IY&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=3D5xt6BfOaztHRmXzEORZQ&_nc_ss=7b289&oh=00_Af4nzpgORwusOx-JX6yJMIX-82x1d_fnvGsT9YE6gsKRag&oe=6A257E25)[iOS](https://developers.facebook.com/documentation/facebook-login/ios)

![Android icon](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/656208083_1464926558699327_7755667800092215991_n.svg?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=rev21nG-_2AQ7kNvwHnvcwn&_nc_oc=AdpFvylsa8jHBSeP3ohVW7AJ4ccA8Jkp1FvpYecHuNIjLwBwMRDZorfHnud9fSZtqQg&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=3D5xt6BfOaztHRmXzEORZQ&_nc_ss=7b289&oh=00_Af6fJ6w9l-vsbrwIxcVTMgw81_jjk6MdnP0h8yKgpy_XmA&oe=6A258542)[Android](https://developers.facebook.com/documentation/facebook-login/android)

![Image](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/651786604_1459945759197407_9178621867751036031_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=XwGb1XTI86gQ7kNvwH9RTsW&_nc_oc=AdrznqUyz1t5hoInuTAoVgbfFttjcNFdTEtqdsAQb0cN_biS5eAOa68_As2Lh8oxvgE&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=3D5xt6BfOaztHRmXzEORZQ&_nc_ss=7b289&oh=00_Af6sWfalJYLyDr9QFHYzMeAPstNv4LVQMTBAB-0Ze3O-vA&oe=6A2561E7)[Websites or mobile websites](https://developers.facebook.com/documentation/facebook-login/web)

![Image](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/652101292_1459945745864075_5688850988089145636_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=4CVMP0rStR8Q7kNvwHWLPR9&_nc_oc=Adoxa9xzqOO_g5tkFbiKxCvObKXf1buuj9SukX7ZzvOkfDxMgYZG1AqqtlkPPbaovTs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=3D5xt6BfOaztHRmXzEORZQ&_nc_ss=7b289&oh=00_Af7wO0sAlXhdAOI00eTNyDnrOfotDvVuoFXQY1HKTvdrOg&oe=6A257296)[Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

![Facebook Login illustration](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/16327940_1453393128004653_1075455936857899008_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=F0qpi-IBI84Q7kNvwFkQ7Mq&_nc_oc=Ado3BhCClEk2KBX1FDoc48WIhdOExA2Py0Le_pT5bWn3iYFe6bpWK7XjmyR1iFbbRIE&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=3D5xt6BfOaztHRmXzEORZQ&_nc_ss=7b289&oh=00_Af7AGFyh-vhZH8eWVPyYSkfRRHKQ7ato2LIM34tHvR1pyQ&oe=6A256ABB)

### Changes to Social Plugins in the European Region

You may start to see some impact to Social Plugins due to an updated cookies consent prompt that will be shown to people using Facebook products in the European Region.
We will no longer support the ‘Like’ and ‘Comment’ Social Plugins for European Region users, unless they are both 1) Logged into their Facebook account, and 2) have provided consent to the “App and Website Cookies” control. If both of these requirements are met, the user will be able to see and interact with plugins such as the ‘Like’ or ‘Comment’ button. If either of the requirements above are not met, the user will not be able to see the plugins.

#### The European Region is a specific list of countries including:

**The European Union (EU):** Austria, Belgium, Bulgaria, Croatia, Republic of Cyprus, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, Netherlands, Poland, Portugal, Romania, Slovakia, Slovenia, Spain, Sweden

**Non-EU Members, but in EEA-Only/EFTA or Customs Union:** \[EEA Only/EFTA\] Iceland, Liechtenstein and Norway;Switzerland: \[EU Customs Union\] all Channel Islands, Isle of Man, Monaco; UK sovereign bases in Cyprus; \[European Customs Union\] Andorra, San Marino, Vatican City.
**Non-EU members, but part of European Outermost Regions (OMR):** Martinique, Mayotte, Guadeloupe, French Guiana, Réunion, Saint-Martin, Madeira, The Azores, Canary Islands.
**United Kingdom** (all British Isles)

## Get Started

#### [Overview](https://developers.facebook.com/documentation/facebook-login/overview)

Core use cases and features for Facebook Login.

## Plan

#### OS-Specific Integration

How to integrate Facebook Login into your app on various platforms:

[iOS](https://developers.facebook.com/documentation/facebook-login/ios)
[Android](https://developers.facebook.com/documentation/facebook-login/android)
[Web](https://developers.facebook.com/documentation/facebook-login/web)
[For Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

#### [Best Practices](https://developers.facebook.com/documentation/facebook-login/best-practices), [User Experience Design](https://developers.facebook.com/documentation/facebook-login/userexperience), [Login Security](https://developers.facebook.com/documentation/facebook-login/security)

Foundations for building a successful app with Facebook Login.

#### [Permissions](https://developers.facebook.com/documentation/facebook-login/guides/permissions)

Asking for user data.

#### [Access Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens), [Authentication Versus Data Access](https://developers.facebook.com/documentation/facebook-login/auth-vs-data)

Access tokens, their expiration periods, and their relationship to data access.

## Review and Test

#### [Testing](https://developers.facebook.com/documentation/facebook-login/guides/test)

Making sure your integration works as intended.

## Submit Your App for Review and Approval

#### [App Review](https://developers.facebook.com/docs/facebook-login/review)

Submitting your app for review of the permissions it requests.

## Advanced

#### [Changelog](https://developers.facebook.com/docs/facebook-login/changelog)

See what’s changed in different releases of Facebook Login.

## Business Results

#### [Success Stories](https://developers.facebook.com/success-stories)

Learn how implementing Facebook Login in apps has improved login rates and enhanced customer experience. In particular, see the following case study:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/13311282_1007186976025896_1933768039_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=rEkkzipaFcQQ7kNvwHjUrZI&_nc_oc=Adptp74310zgfXWnxl_FTgkNqcorBkdP2zCQZSaVMdP31N9fLRVh1ieZddSdz6eTc4k&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=3D5xt6BfOaztHRmXzEORZQ&_nc_ss=7b289&oh=00_Af5lxZpVbglvZ0qIqP_UUA2fQbvVCUrqlOMrCDRIEtbNrw&oe=6A2587B1)

[Skyscanner](https://developers.facebook.com/success-stories/skyscanner) — 100% increase in Facebook Login conversions.

## Further Resources

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/290685728_725708695301954_3657236838974303579_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=O-M-aR8Z8FIQ7kNvwH3BM71&_nc_oc=AdonVTX4hQWag2BoCmumvaj21x1GNwh2r3E8ogSCGSheWDTsZM_cKmKfXay0j8aUH3E&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=3D5xt6BfOaztHRmXzEORZQ&_nc_ss=7b289&oh=00_Af6iD9tD1wFgz09GCrcCON0IisC909c3hL6b-DT0pT_WPQ&oe=6A25949C)

[Data Protocol⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fdataprotocol.com%2Ffacebook-login&h=AUBF5G16BGDk6-uFb0vqzIpdEYDYK3t4--4zlinYkz32WrEnO-Jh-hZ5HlTHXBpSwxqlQklkQMQf26c5P9vZyZCPIsGlhH9rDDFVoPVp8aF15hIxqnZbPtUUGXpvZyJJarvZfhLA2i5uNA) Short video tutorials and trainings.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/22880499_168732097044909_1891283213796507648_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=uf66wM6JElwQ7kNvwFN2M5e&_nc_oc=AdqK0pTWoIPCOWrpNiA8L-v0rX43hk4FSqirZXACSoEC_qTzI9JSvgwPfzy75PISSFU&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=3D5xt6BfOaztHRmXzEORZQ&_nc_ss=7b289&oh=00_Af7zvDBATbre7C4rVd6DEgMIhY60MLoymD36-Esm49227w&oe=6A25623F)

[GitHub example⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-android-sdk%2Ftree%2Fmaster%2Fsamples%2FFBLoginSample&h=AUBF5G16BGDk6-uFb0vqzIpdEYDYK3t4--4zlinYkz32WrEnO-Jh-hZ5HlTHXBpSwxqlQklkQMQf26c5P9vZyZCPIsGlhH9rDDFVoPVp8aF15hIxqnZbPtUUGXpvZyJJarvZfhLA2i5uNA) of an Android implementation of Facebook Login.

Did you find this page helpful?

![Thumbs up icon](https://static.xx.fbcdn.net/rsrc.php/yR/r/OEXJ0_DJeZv.svg)

![Thumbs down icon](https://static.xx.fbcdn.net/rsrc.php/yb/r/qKPgNVNeatU.svg)

ON THIS PAGE

Changes to Social Plugins in the European Region

The European Region is a specific list of countries including:

Get Started

Overview

Plan

OS-Specific Integration

Best Practices, User Experience Design, Login Security

Permissions

Access Tokens, Authentication Versus Data Access

Review and Test

Testing

Submit Your App for Review and Approval

App Review

Advanced

Changelog

Business Results

Success Stories

Further Resources

* * *