---
url: https://developers.facebook.com/docs/facebook-login/userexperience
title: User Experience Design | Developer Documentation
status: 200
---

Facebook Login

Facebook Login

[Facebook Login](https://developers.facebook.com/documentation/facebook-login)

[Overview](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Overview](https://developers.facebook.com/documentation/facebook-login/overview)

[Authentication Versus Data Access](https://developers.facebook.com/documentation/facebook-login/auth-vs-data)

[Login Security](https://developers.facebook.com/documentation/facebook-login/security)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens)

[Get Long-Lived Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived)

[OIDC Token with Manual Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/oidc-token)

[Get an OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-oidc)

[Get Session Info Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-session-info)

[Security](https://developers.facebook.com/documentation/facebook-login/access-tokens/security)

[Portability](https://developers.facebook.com/documentation/facebook-login/access-tokens/portability)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions)

[Request & Revoke](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke)

[Handle Declined Permissions](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined)

[Review](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review)

[Create an app](https://developers.facebook.com/documentation/facebook-login/create-an-app)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business)

[Conversions API Partner Integration Template](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/conversions-api-integration-template/)

[Business Integration Webhooks](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/integration-webhooks)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/managed-accounts)

[FAQ](https://developers.facebook.com/documentation/facebook-login/managed-accounts/faq)

[For Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

[Re-Authentication](https://developers.facebook.com/documentation/facebook-login/guides/advanced/re-authentication)

[Map Users Across Apps and Pages](https://developers.facebook.com/documentation/facebook-login/guides/map-users)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/test)

[Test User Data Access](https://developers.facebook.com/documentation/facebook-login/guides/test/data-access)

[Manually Build a Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow)

[iOS](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/permissions)

[Advanced](https://developers.facebook.com/documentation/facebook-login/ios/advanced)

[Limited Facebook Login](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios/limited-login)

[Unity](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/unity)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token)

[Validating the Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token/validating)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/permissions)

[FAQ](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/faq)

[Android](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Android](https://developers.facebook.com/documentation/facebook-login/android)

[Access Tokens and Profiles](https://developers.facebook.com/documentation/facebook-login/android/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/android/permissions)

[Troubleshooting](https://developers.facebook.com/documentation/facebook-login/android/troubleshooting)

[Web](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Web](https://developers.facebook.com/documentation/facebook-login/web)

[Login Button](https://developers.facebook.com/documentation/facebook-login/web/login-button)

[Access Tokens](https://developers.facebook.com/documentation/facebook-login/web/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/web/permissions)

[Enabling HTTPS](https://developers.facebook.com/documentation/facebook-login/web/enabling-https)

[JS Example](https://developers.facebook.com/documentation/facebook-login/web/js-example)

[Best Practices](https://developers.facebook.com/documentation/facebook-login/best-practices)

[User Experience Design](https://developers.facebook.com/documentation/facebook-login/userexperience)

[Login Connect with Messenger](https://developers.facebook.com/documentation/facebook-login/userexperience#)

[Overview](https://developers.facebook.com/documentation/facebook-login/login-connect)

[Implementing](https://developers.facebook.com/documentation/facebook-login/login-connect/implementing)

[FAQ](https://developers.facebook.com/documentation/facebook-login/login-connect/faq)

# User Experience Design

Updated:Mar 16, 2026

The onboarding experience is one of the most important user experiences in your app. A high quality onboarding experience can lead to conversion rates above 90% and encourages people to become more engaged and profitable.

Facebook Login lets people start using your app quickly and easily, and enjoy more personalized and meaningful experiences. In this doc, we offer tips and considerations to create a great login user experience with Facebook Login.

[Show value first](https://developers.facebook.com/documentation/facebook-login/userexperience#showvaluefirst)
[Avoid unnecessary steps](https://developers.facebook.com/documentation/facebook-login/userexperience#avoidunnecessarysteps)
[Button design](https://developers.facebook.com/documentation/facebook-login/userexperience#buttondesign)
[Permissions](https://developers.facebook.com/documentation/facebook-login/userexperience#permissions)
[Provide a way to log out](https://developers.facebook.com/documentation/facebook-login/userexperience#loggingout)
[Test and measure](https://developers.facebook.com/documentation/facebook-login/userexperience#testing)

## 1\. Show value before prompting people to login

When deciding where in the user experience to prompt people to log in, ask yourself at what point will people appreciate what your app has to offer enough to trust it with their information.

This is often influenced by what people experience before even downloading the app, but there is a lot you can do to further influence this by design within the app.

Here are a few design approaches to encourage more people to log in:

Provide a clear and succinct statement of what your app has to offer
Provide a glimpse of the content they’ll get after they’re logged in
Provide a new user experience
Allow people to experience your app without an account

### Provide a clear and succinct statement of what your app has to offer

Provide a clear, succinct and compelling statement about what your app has to offer. It might have been a while since they downloaded the app or read about it in the app store.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/18853685_793461504169530_595604250470383616_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=GZSbtsQv4wEQ7kNvwFd624l&_nc_oc=AdqTi9yU6gGmsZRVU-6oHBM-WupKKLwmd6xDyUuVbgvu4cw_MuxKi6ofQgp8545FUP0&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=NRp746D7t4dmGj9nOjjE0Q&_nc_ss=7b289&oh=00_Af6dfuHVfQYxBq2TtfBr5i72G_GJ6KgsqXXcRNOow4pXcw&oe=6A258E14)

### Provide a glimpse of the content they’ll get after they log in

Provide a glimpse of the content available to people prior to logging in, like the background photo in this example. It doesn’t have to be detailed, even blurred out images of Pinterest’s pinboard encourages more people to log into Pinterest.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/19085411_1932698890278599_609064407393107968_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=CQo3vCLWMDkQ7kNvwGKiBdP&_nc_oc=AdqU-OwYZA7o9Kktw5TYtsjKxVzz9Emlt-Sri4224xKaBo-u0t_7-a4Pz_ynDf08NGQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=NRp746D7t4dmGj9nOjjE0Q&_nc_ss=7b289&oh=00_Af6qiJqYr6JAquyza-n7Vw_r1r6lP9h23AzaD6cotR0lqA&oe=6A258FFA)

### Provide a new user experience

If your app requires additional education to have the best experience, include a multi step demo above your Login button. This gives people the option to either learn more or log in immediately if they’re ready.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/18853645_1838914009762991_5958627649814265856_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=AYFnQVpz9NcQ7kNvwES4Fu5&_nc_oc=AdqAipVsnDBBO01NK-uKi5hUvK6Z-NBy4ZdZ_KDmO0IKTLUdXLGjQTRLt2UI8HAW174&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=NRp746D7t4dmGj9nOjjE0Q&_nc_ss=7b289&oh=00_Af7BiB5olyLmJQN6vy5cghhmQyNp7bWae5AIJ4sLDDt4UA&oe=6A257899)

### Allow people to experience your app before logging in

If possible, allow people experience your app before prompting them to log in. For example, many ecommerce apps such as Zulily don’t require people to log in until they’re ready to check out.

## 2\. Avoid unnecessary steps

Reducing unnecessary steps is one of the most effective ways to improve your conversion rate.

Avoid asking users to first tap “Login” or “Register” to get to the Facebook login button. With Facebook Login, this is an unnecessary step. There’s no need for people to even have stop to think about if they have an account or not.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/18853685_793461504169530_595604250470383616_n.png?_nc_cat=103&ccb=1-7&_nc_sid=e280be&_nc_ohc=GZSbtsQv4wEQ7kNvwFd624l&_nc_oc=AdqTi9yU6gGmsZRVU-6oHBM-WupKKLwmd6xDyUuVbgvu4cw_MuxKi6ofQgp8545FUP0&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=NRp746D7t4dmGj9nOjjE0Q&_nc_ss=7b289&oh=00_Af6dfuHVfQYxBq2TtfBr5i72G_GJ6KgsqXXcRNOow4pXcw&oe=6A258E14)

In addition, after people have logged in with Facebook, don’t prompt them to create a username or password. One of the most popular reasons people log in with Facebook is because “it’s fast and easy and I don’t have to enter a password”. After logging in with Facebook, people especially do not want to have to create a username or password.

## 3\. Button design

### Logo

In order to build recognition and trust, always use the [approved “f” Logo⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.facebookbrand.com%2Fassets%2Ff-logo%2F%3Faudience%3Dadvertisers&h=AUDClEbeOK5VKk_XpbhwGsAfh8F5i5iv18J1u33L54IK_I0WIewLRgvFa7q7UfsndPdm3xWTdsiszZLV1mWmVjk_6apEOY0ArC0IKpaNVJQUsIzkL27IDaRfRVM5LbiDtmi1TIH0CAe6nQ) available on the [Facebook Brand Resource Center⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookbrand.com%2F&h=AUDClEbeOK5VKk_XpbhwGsAfh8F5i5iv18J1u33L54IK_I0WIewLRgvFa7q7UfsndPdm3xWTdsiszZLV1mWmVjk_6apEOY0ArC0IKpaNVJQUsIzkL27IDaRfRVM5LbiDtmi1TIH0CAe6nQ).

When using the “f” Logo in the login button design, it should appear before the call to action. Don’t use it as part of the call to action by saying “Login with “f” Logo.

### Color

Color is one of the best ways for people to recognize something quickly. From a usability perspective, the more quickly people recognize what your button is and does, the faster they want to tap on it and the more seamless the experience.

Button colors are white and Facebook blue: 5890FF. Around the world, when people talk about Facebook Login they often refer to it as “the blue button”. If you are unable to use Facebook blue, revert to black and white.

**FACEBOOK BLUE COLOR VALUES**

CMYK Coated: 83 / 52 / 00 / 00
CMYK Uncoated: 77 / 36 / 00 / 00
PMS 2727C
PMS 2382U
Hex #1877F2
R = 24 G = 119 B = 242

![Image](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/653709925_1459945739197409_1556449356053532260_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=5jKHc0iSkRMQ7kNvwE1UDwS&_nc_oc=Adpxc0junZu-FldrjckGKiPcDTqM26O20igpM-muWkxgBPJ7VbUlug7SGNHAoV5R4uA&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=NRp746D7t4dmGj9nOjjE0Q&_nc_ss=7b289&oh=00_Af7PRWvLui8p5sZGwwB0rOVGaDnSU95bUNiufiMuhe1E4g&oe=6A25656F)

### Text

The preferred labels are either “Continue with Facebook” or “Login with Facebook” depending on the context. When using the [“f” Logo⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.facebookbrand.com%2Fassets%2Ff-logo%2F%3Faudience%3Dadvertisers&h=AUDClEbeOK5VKk_XpbhwGsAfh8F5i5iv18J1u33L54IK_I0WIewLRgvFa7q7UfsndPdm3xWTdsiszZLV1mWmVjk_6apEOY0ArC0IKpaNVJQUsIzkL27IDaRfRVM5LbiDtmi1TIH0CAe6nQ) with a call to action, use the official version available for download on the Facebook [Facebook Brand Resource Center⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookbrand.com%2F&h=AUDClEbeOK5VKk_XpbhwGsAfh8F5i5iv18J1u33L54IK_I0WIewLRgvFa7q7UfsndPdm3xWTdsiszZLV1mWmVjk_6apEOY0ArC0IKpaNVJQUsIzkL27IDaRfRVM5LbiDtmi1TIH0CAe6nQ).

Place the call to action copy within the login button, it should not be outside of the button.

Choose the font, font weight, and kerning that looks best in your app, but optimize for easy legibility.

![Image](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/653880421_1459945765864073_3792559234865676829_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=qWf-D1TKjFcQ7kNvwEPPKgQ&_nc_oc=AdqSP0sHITUUksWHjkKcAWwa6Ph2zr7AIyXOd5EPAoI5N1-ofDIHBykCTsnebtBA3Pk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=NRp746D7t4dmGj9nOjjE0Q&_nc_ss=7b289&oh=00_Af5vUx_5o46fe8s1oKiyd-YwXs88zfTYoYA_vQen5tRmYQ&oe=6A257F8B)

### Placement

Your login button should be as fast and easy to recognize and tap as possible. On a mobile device, this means close to the thumb and large enough to tap easily. It’s simplistic but true; larger buttons convert better than small buttons.

The “f” Logo is provided in various sizes for button scaling purposes, but the proportions and typography style must stay consistent.

### Do’s and Dont’ts

**DO** use the approved [“f” Logo⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.facebookbrand.com%2Fassets%2Ff-logo%2F%3Faudience%3Dadvertisers&h=AUDClEbeOK5VKk_XpbhwGsAfh8F5i5iv18J1u33L54IK_I0WIewLRgvFa7q7UfsndPdm3xWTdsiszZLV1mWmVjk_6apEOY0ArC0IKpaNVJQUsIzkL27IDaRfRVM5LbiDtmi1TIH0CAe6nQ) provided on the Facebook [Facebook Brand Resource Center⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.facebookbrand.com%2F&h=AUDClEbeOK5VKk_XpbhwGsAfh8F5i5iv18J1u33L54IK_I0WIewLRgvFa7q7UfsndPdm3xWTdsiszZLV1mWmVjk_6apEOY0ArC0IKpaNVJQUsIzkL27IDaRfRVM5LbiDtmi1TIH0CAe6nQ) and follow the guidelines for use.

**DO** use the preferred label “Continue with Facebook” or “Login with Facebook” on the login button depending on the context, and ensure the copy resides inside the button design.

**DON’T** modify the “f” logo in any way, such as by changing the design, scale, color or any other custom variation. If you can’t use the correct color due to technical limitations, use black and white.

**DON’T** use the “f” logo on a button without an appropriate call to action, preferably “Continue with Facebook” or “Login with Facebook”

**DON’T** place the call to action copy (example: Continue with Facebook) outside of the login button.

## 4\. Permissions

### Only ask for the permissions you need

The fewer permissions you ask for, the easier it is for people to feel comfortable granting them. We’ve seen that asking for fewer permissions typically results in greater conversion.

You can always ask for additional permissions later after people have had a chance to try out your app.

An additional benefit of asking for fewer permissions is that you might not need to submit your app for [Login Review](https://developers.facebook.com/docs/facebook-login/review). You only need to submit for Login Review if you’re requesting permissions other than `public_profile` and `email`.

### Ask for permissions in context and explain why

People are most likely to accept permission requests when they understand why your app needs that information to offer a better experience. So trigger permission requests when people are trying to accomplish an action in your app which requires that specific permission.

For example, the Facebook app only asks for Location Services when people explicitly tap on the location button when updating their status.

## 5\. Provide a way to log out

Once people are logged in, you also need to give them a way to log out, disconnect their account, or delete it all together. In addition to being a courtesy, this is also a requirement of our [Developer Policies for Login](https://developers.facebook.com/devpolicy/#login).

The dating app Tinder, for example, gives you the option to hide your profile card to prevent people from finding you, log out, or delete your account entirely.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/18853684_1972355499664306_464661615422210048_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=jCeK9-jCg8oQ7kNvwEt5DVd&_nc_oc=Adp1l4pX8dxXXzvzi8S1-FE2IcWL5S8IAp3bQJrHM2blPk_x_Cldp3xBB4NoKjfVpvU&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=NRp746D7t4dmGj9nOjjE0Q&_nc_ss=7b289&oh=00_Af4lcNsDLEOfA34riTC768-cPyJTOk0ip--n74VgInR2AQ&oe=6A258916)

## 6\. Test and measure

Not even the best designers get their onboarding flow right on the first try. Great onboarding experiences are usually the result of thoughtful design and testing, with multiple iterations.

Before launching your app, run a qualitative usability test to understand how people are reacting to what they see. It doesn’t have to be formal to be useful, but make sure to watch people run through the experience.

In addition to qualitative testing, use analytics to understand if people are completing the process and their overall conversion rates. Best practice apps can see conversion rates of over 90%.

Did you find this page helpful?

![Thumbs up icon](https://static.xx.fbcdn.net/rsrc.php/yR/r/OEXJ0_DJeZv.svg)

![Thumbs down icon](https://static.xx.fbcdn.net/rsrc.php/yb/r/qKPgNVNeatU.svg)

ON THIS PAGE

1\. Show value before prompting people to login

Provide a clear and succinct statement of what your app has to offer

Provide a glimpse of the content they’ll get after they log in

Provide a new user experience

Allow people to experience your app before logging in

2\. Avoid unnecessary steps

3\. Button design

Logo

Color

Text

Placement

Do’s and Dont’ts

4\. Permissions

Only ask for the permissions you need

Ask for permissions in context and explain why

5\. Provide a way to log out

6\. Test and measure

* * *