---
url: https://developers.facebook.com/docs/facebook-login/security/
title: Login Security | Developer Documentation
status: 200
---

Facebook Login

Facebook Login

[Facebook Login](https://developers.facebook.com/documentation/facebook-login)

[Overview](https://developers.facebook.com/documentation/facebook-login/security#)

[Overview](https://developers.facebook.com/documentation/facebook-login/overview)

[Authentication Versus Data Access](https://developers.facebook.com/documentation/facebook-login/auth-vs-data)

[Login Security](https://developers.facebook.com/documentation/facebook-login/security)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/security#)

[Access Token Guide](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens)

[Get Long-Lived Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-long-lived)

[OIDC Token with Manual Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/oidc-token)

[Get an OIDC Token](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-oidc)

[Get Session Info Tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens/get-session-info)

[Security](https://developers.facebook.com/documentation/facebook-login/access-tokens/security)

[Portability](https://developers.facebook.com/documentation/facebook-login/access-tokens/portability)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/security#)

[Permissions Guide](https://developers.facebook.com/documentation/facebook-login/guides/permissions)

[Request & Revoke](https://developers.facebook.com/documentation/facebook-login/guides/permissions/request-revoke)

[Handle Declined Permissions](https://developers.facebook.com/documentation/facebook-login/guides/permissions/handle-declined)

[Review](https://developers.facebook.com/documentation/facebook-login/guides/permissions/review)

[Create an app](https://developers.facebook.com/documentation/facebook-login/create-an-app)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/security#)

[Facebook Login for Business](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business)

[Conversions API Partner Integration Template](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/conversions-api-integration-template/)

[Business Integration Webhooks](https://developers.facebook.com/documentation/facebook-login/facebook-login-for-business/integration-webhooks)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/security#)

[Managed Meta Accounts & Third-party Integrations](https://developers.facebook.com/documentation/facebook-login/managed-accounts)

[FAQ](https://developers.facebook.com/documentation/facebook-login/managed-accounts/faq)

[For Devices](https://developers.facebook.com/documentation/facebook-login/for-devices)

[Re-Authentication](https://developers.facebook.com/documentation/facebook-login/guides/advanced/re-authentication)

[Map Users Across Apps and Pages](https://developers.facebook.com/documentation/facebook-login/guides/map-users)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/security#)

[Test Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/test)

[Test User Data Access](https://developers.facebook.com/documentation/facebook-login/guides/test/data-access)

[Manually Build a Login Flow](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow)

[iOS](https://developers.facebook.com/documentation/facebook-login/security#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/permissions)

[Advanced](https://developers.facebook.com/documentation/facebook-login/ios/advanced)

[Limited Facebook Login](https://developers.facebook.com/documentation/facebook-login/security#)

[Overview](https://developers.facebook.com/documentation/facebook-login/ios/limited-login)

[Unity](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/unity)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/security#)

[OIDC Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token)

[Validating the Token](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/token/validating)

[Permissions](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/permissions)

[FAQ](https://developers.facebook.com/documentation/facebook-login/ios/limited-login/faq)

[Android](https://developers.facebook.com/documentation/facebook-login/security#)

[Android](https://developers.facebook.com/documentation/facebook-login/android)

[Access Tokens and Profiles](https://developers.facebook.com/documentation/facebook-login/android/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/android/permissions)

[Troubleshooting](https://developers.facebook.com/documentation/facebook-login/android/troubleshooting)

[Web](https://developers.facebook.com/documentation/facebook-login/security#)

[Web](https://developers.facebook.com/documentation/facebook-login/web)

[Login Button](https://developers.facebook.com/documentation/facebook-login/web/login-button)

[Access Tokens](https://developers.facebook.com/documentation/facebook-login/web/accesstokens)

[Permissions](https://developers.facebook.com/documentation/facebook-login/web/permissions)

[Enabling HTTPS](https://developers.facebook.com/documentation/facebook-login/web/enabling-https)

[JS Example](https://developers.facebook.com/documentation/facebook-login/web/js-example)

[Best Practices](https://developers.facebook.com/documentation/facebook-login/best-practices)

[User Experience Design](https://developers.facebook.com/documentation/facebook-login/userexperience)

[Login Connect with Messenger](https://developers.facebook.com/documentation/facebook-login/security#)

[Overview](https://developers.facebook.com/documentation/facebook-login/login-connect)

[Implementing](https://developers.facebook.com/documentation/facebook-login/login-connect/implementing)

[FAQ](https://developers.facebook.com/documentation/facebook-login/login-connect/faq)

# Login Security

Updated:Oct 16, 2024

The features of Facebook Login such as [access tokens](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens) and [permissions](https://developers.facebook.com/docs/facebook-login/permissions) make it safe and secure for people and apps to use, but there are some security steps that apps need to implement themselves.

[Security Checklist](https://developers.facebook.com/documentation/facebook-login/security#checklist)
[The App Secret](https://developers.facebook.com/documentation/facebook-login/security#appsecret)
[Secure Server-side Calls with `appsecret_proof`](https://developers.facebook.com/documentation/facebook-login/security#proof)
[Secure Client-side Calls with Short-term Tokens and Code Flow](https://developers.facebook.com/documentation/facebook-login/security#codeflow)
[Token Hijacking](https://developers.facebook.com/documentation/facebook-login/security#tokenhijacking)
[Check Access Token Validity Regularly](https://developers.facebook.com/documentation/facebook-login/security#checktokenvalidity)
[State Parameter](https://developers.facebook.com/documentation/facebook-login/security#stateparam)
[Enable Strict Mode](https://developers.facebook.com/documentation/facebook-login/security#strict_mode)
[Use Https](https://developers.facebook.com/documentation/facebook-login/security#https)
[Enable JavaScript SDK for Facebook Login](https://developers.facebook.com/documentation/facebook-login/security#enablejssdk)
[How Redirect URI Checking Works](https://developers.facebook.com/documentation/facebook-login/security#howredirectworks)
[Lock Down Your Facebook App Settings](https://developers.facebook.com/documentation/facebook-login/security#surfacearea)

## Security Checklist

This list below should be considered the absolute minimum that all apps using Facebook Login should implement. Other features will be unique to your app and you will need to always think about how to make your app as secure as possible. Apps that are not secure will lose the trust of their audience and people will stop using them.

✅ [Never include your App Secret in client-side or decompilable code](https://developers.facebook.com/documentation/facebook-login/security#appsecret).

✅ [Sign all server-to-server Graph API calls with your App Secret](https://developers.facebook.com/documentation/facebook-login/security#proof).

✅ [Use unique short-term tokens on clients](https://developers.facebook.com/documentation/facebook-login/security#codeflow).

✅ [Don’t trust that access tokens in use by your app were actually generated by your app](https://developers.facebook.com/documentation/facebook-login/security#tokenhijacking).

✅ [Use the state parameter when using the login dialog](https://developers.facebook.com/documentation/facebook-login/security#stateparam).

✅ [Use our official SDKs where possible](https://developers.facebook.com/documentation/facebook-login#loginflow).

✅ [Reduce your app’s attack surface area by locking down your Facebook app settings](https://developers.facebook.com/documentation/facebook-login/security#surfacearea).

✅ [Use HTTPS](https://developers.facebook.com/documentation/facebook-login/security#https).

## The App Secret

The App Secret is used in some of the Login flows to generate access tokens and the Secret itself is intended to secure usage of your App to only those that are trusted. The secret can be used to easily create an App Access Token which can make API requests on behalf of any user of the app, which makes it extremely important that an App Secret is not compromised.

Therefore the App Secret or an App Access token should never be included in any code.

We recommend that App Access Tokens should only be used directly from your app’s servers in order to provide the best security. For native apps, we suggest that the app communicates with your own server and the server then makes the API requests to Facebook using the App Access Token. For this reason, if your ‘App Type’ under [Advanced Settings in the App Dashboard](https://developers.facebook.com/apps/) is set to `Native/Desktop` we assume that your native app contains the App Secret or an App Access Token in the binary, and we do not allow calls signed with an App Access Token to proceed. The API will behave as though no access token was provided.

## Secure Server-side Calls with `appsecret_proof`

You can reduce your exposure to malware and spammers by requiring server-to-server calls to Facebook’s API be signed with the `appsecret_proof` parameter. The app secret proof is a sha256 hash of your access token, using your app secret as the key. The app secret can be found in your app dashboard in **Settings > Basic**.

### Generate the Proof

The following code example is what the call looks like in PHP:

```
$appsecret_proof= hash_hmac('sha256', $access_token.'|'.time(), $app_secret);
```

Some Operating Systems and programming languages will return a timestamp that is a float. Be sure to convert to an integer value before calculating the app-secret proof. Some programming languages create the hash as a digest object. Be sure to express the hash as a hexadecimal object.

### Add the Proof

You add the result as an `appsecret_proof` parameter with the `appsecret_time` set to the timestamp you used when hashing the app secret to each call you make:

```
curl \
  -F 'access_token=ACCESS-TOKEN' \
  -F 'appsecret_proof=APP-SECRET-PROOF' \
  -F 'appsecret_time=APP-SECRET-TIME' \
  -F 'batch=[{"method":"GET", "relative_url":"me"},{"method":"GET", "relative_url":"me/accounts"}]' \
  https://graph.facebook.com
```

Time-stamped app secret proofs will be considered expired after 5 minutes, so it’s recommended that you generate a new proof in-line when making each Graph API call.

### Require the Proof

To enable **Require App Secret** for all your API calls, go to the Meta App Dashboard and click **App Settings > Advanced** in the left side menu. Scroll to the **Security** section, and click the **Require App Secret** toggle.

If this setting is enabled, all client-initiated calls must be proxied through your backend where the `appsecret_proof` parameter can be added to the request before sending it to the Graph API, or the call will fail.

## Secure Client-side Calls with Short-term Tokens and Code Flow

In some configurations, apps will reuse a long-term token across multiple clients. Don’t do this. Instead use short-term tokens that are generated with the code flow, as described [in our access token documentation](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens#short-from-long).

## Token Hijacking

To understand how this happens, imagine a native iOS app that wants to make API calls, but instead of doing it directly, communicates with a server owned by the same app and passes that server a token generated using the iOS SDK. The server would then use the token to make API calls.

The endpoint that the server uses to receive the token could be compromised and others could pass access tokens for completely different apps to it. This would be obviously insecure, but there is a way to protect against this - access tokens should never be assumed to be from the app that is using them, instead they should be [checked using debugging endpoints](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens#debug).

## Check Access Token Validity Regularly

If you don’t use the Facebook SDKs, regularly check whether the access token is valid. Although access tokens have a scheduled expiration, tokens can be caused to expire early for security reasons. If you don’t use the Facebook SDKs in your app, it is extremely important that you manually implement frequent checks of the token validity — at least daily — to ensure that your app is not relying on a token that has expired early for security reasons.

## State Parameter

If you’re using the Facebook [login dialog](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow#logindialog) on your website, the `state` parameter is a unique string that guards your application against [Cross-site Request Forgery⁠](https://l.facebook.com/l.php?u=http%3A%2F%2Fen.wikipedia.org%2Fwiki%2FCross-site_request_forgery&h=AUAQ5z9mM9e8sPAlPnAvNku8Wy5Gzx-kTYFejEZ3oP0MtaYGvl8XPxAPZhWiET4sZ5MFgoHma2fcrwNn_5fLpoNrUCJPREqtONZStOoenkQiSE9g0Qh0PgrvtLRtwEhuWxj9BZMOOLfO9Q) attacks.

## Enable Strict Mode

Strict Mode keeps apps safe by preventing bad actors from hijacking your redirect. Enabling Strict Mode is required for all apps.

Before turning on Strict Mode in the App Dashboard, ensure your current redirect traffic still works by taking the following actions in Facebook Login settings:

For apps with **dynamic redirect URIs**, use the [state parameter](https://developers.facebook.com/documentation/facebook-login/guides/advanced/manual-flow#logindialog)
to pass back the dynamic information to a limited number of redirect URIs. Then add each of the limited redirect URIs to the **Valid OAuth redirect URIs** list.

For apps with a **limited number of redirect URIs**, add each one to the **Valid OAuth redirect URIs** list.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/618367991_1414612830397367_6682993336704754495_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=fIHUi1pS0QMQ7kNvwExC0MJ&_nc_oc=AdqTpYlYm1Mn9HTSEM5_c-YaptzPIE2E7uznGuv3P6vmq5cz4EaISyZyyiVF7tNDYqk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=YTm6SOmrXgeY1RknWGL8lg&_nc_ss=7b289&oh=00_Af6TMTKSP9DlrNZCwbUbZd_sE4TYJeAGIReouWa7NMyasA&oe=6A2400F7)

For apps **using only the Facebook JavaScript SDK**, redirect traffic is already protected. No further action is needed.

After taking these actions, make sure to enable strict mode.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/20915038_1907309902856521_593202955730026496_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=FH0dN5AUB9QQ7kNvwFT2-4W&_nc_oc=AdpIUbgLxf6WbJiUJM5dxJk-Mn-D1L9rf2ozmr3Ylhb_ZVYhc3r4diRjrSc22l8UWuw&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=YTm6SOmrXgeY1RknWGL8lg&_nc_ss=7b289&oh=00_Af4vkAwCRkWc1-helZ3oXRKvV1Kw6RrShAJZTRtkXvGLIw&oe=6A23FD1B)

### How Strict Mode Works

Strict Mode prevents hijacking of your redirect URIs by requiring an exact match from your **Valid OAuth redirect URIs** list. For example, if your list contains _www.example.com_, then Strict Mode won’t allow _www.example.com/token_ as a valid redirect. It also won’t allow any extra query parameters not present in your **Valid OAuth redirect URIs** list.

## Use HTTPS

Use HTTPS, instead of HTTP, as an internet protocol, because it uses encryption. HTTPS keeps transmitted data private and guards against eavesdropping attacks. It also prevents data from being tampered with during transmission by, for example, introducing advertisements or malicious code.

On October 6, 2018, all apps will be required to use HTTPS.

## Enable JavaScript SDK for Facebook Login

When you indicate that you are using the JavaScript SDK for login by setting the **Login with the JavaScript SDK** toggle to “yes”, the domain of your page that hosts the SDK must match one of the entries in **Allowed Domains for the JavaScript SDK** list. This ensures that access tokens are only returned to callbacks in authorized domains. Only https pages are supported for authentication actions with the Facebook JavaScript SDK.

For existing JSSDK integrations created until August 10th, 2021, this list is backfilled with values based on current usage. No further action is required.

For new integrations created after August 10th, 2021, you must add values to this list.

If you see your App’s JSSDK domain field contains urls that starts with `*.` , please change it such that it’s replaced with absolute domain urls for extra security.

## How Redirect URI Checking Works

Open redirect attacks occur when a bad actor provides an unauthorized redirect\_uri parameter in the login request, leading to the potential for sensitive information like an access token to leak through the query string or fragment in the redirect URI.

For custom web integrations, you should provide authorized redirect URIs in your app settings to prevent such attacks. While fulfilling a login request, the redirect\_uri parameter will be checked against entries in this list. The full URI must be an exact match, including all parameters, with the exception of the optional state parameter, the value of which is ignored.

### In-App Browsers and the JavaScript SDK

The JavaScript SDK normally relies on popups and callbacks to complete a Login. For some in-app browsers that suppress popups, this can fail. When this happens, the SDK will automatically attempt to redirect, with an access token, to the page that invoked it. It can only do this redirect safely if the full URI of the page is listed in the Valid OAuth Redirect URIs.

If in-app browser scenarios are important for your web app, you should add the domain of your login page to the Allowed Domains and also its full URI (including the path and query parameters) to the Valid OAuth Redirect URIs. If you have a lot of variation in the URIs where Login happens for your app, you can manually specify a fallback\_redirect\_uri as an option in the FB.login() call so you only need to add that one entry to your Valid OAuth Redirect URIs list.

## Lock Down Your Facebook App Settings

Enable and/or disable any authentication flows that the app does not use to minimize attack surface area.

**Use code-generated short-term access tokens in clients instead of client-generated tokens or server-provided long-term tokens.** The code-generated short-term access tokens flow requires the app server to exchange the code for a token, which is more secure than obtaining a token in the browser. Apps should prefer using this flow whenever possible to be more secure – if an app only enables this flow, malware running on a user’s computer cannot obtain an access token to abuse. Learn more in our [access tokens documentation](https://developers.facebook.com/documentation/facebook-login/guides/access-tokens#short-from-long).

**Disable Client OAuth Login if your app does not use it.** Client OAuth Login is the global on-off switch for using OAuth client token flows. If your app does not use any client OAuth flows, which include Facebook login SDKs, you should disable this flow. Note, though, that you can’t request permissions for an access token if you have Client OAuth Login disabled. This setting is found in the **Products** \> **Facebook Login** \> **Settings** section of the App Dashboard.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/618326054_1414612710397379_3427645368962409135_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=vj3P6L-jbWwQ7kNvwErgVlg&_nc_oc=Adqg4Zwsf-AGeVyK1X-l68BGD4izgwPr_-f3Dxr4XeAwqu75Ky7lzxxZ_7nc7tWbyTc&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=YTm6SOmrXgeY1RknWGL8lg&_nc_ss=7b289&oh=00_Af64qHDmq4fjQH0dAKDSdWjfmP9wsy8cLmAeOU-1Or7iHQ&oe=6A23E890)

**Disable Web OAuth Flow or Specify a Redirect Allow List.** Web OAuth Login settings enables any OAuth client token flows that use the Facebook web login dialog to return tokens to your own website. This setting is in the **Products** \> **Facebook Login** \> **Settings** section of the App Dashboard. Disable this setting if you are not building a custom web login flow or using the Facebook Login SDK on the web.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/619946595_1414612863730697_2185534615295376576_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=c0cT3-Q4SZoQ7kNvwFOwCHl&_nc_oc=AdqWf2A58aHHmxOfgvQueqttaGks4Skos0TV-sjCsTPgfjLR1WBqdBMIko8kDc0jGw0&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=YTm6SOmrXgeY1RknWGL8lg&_nc_ss=7b289&oh=00_Af7ViR1YG-fgI2MAfboXtTZA2F5DGRtsvN9Wsi-Yr_eP6g&oe=6A23FA77)

**Enforce HTTPS**. This setting requires HTTPS for OAuth Redirects, and it requires and Facebook JavaScript SDK calls that return or require an access token are only from HTTPS pages. All new apps created as of March 2018 have this setting on by default, and you should plan to migrate any existing apps to use only HTTPS URLs by October 6, 2018. Most major cloud application hosts provide free and automatic configuration of TLS certificates for your applications. If you self-host your app or your hosting service doesn’t offer HTTPS by default, you can obtain a free certificate for your domain(s) from [Let’s Encrypt⁠](https://l.facebook.com/l.php?u=https%3A%2F%2Fletsencrypt.org%2F&h=AUAQ5z9mM9e8sPAlPnAvNku8Wy5Gzx-kTYFejEZ3oP0MtaYGvl8XPxAPZhWiET4sZ5MFgoHma2fcrwNn_5fLpoNrUCJPREqtONZStOoenkQiSE9g0Qh0PgrvtLRtwEhuWxj9BZMOOLfO9Q).

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/28418612_1185684154899637_8036368996091559936_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=EqR6xnfEvvkQ7kNvwFIq-PF&_nc_oc=Adrtg2CHJEL_PqHOr_56KrKoIPyZG_b6dFSEI-osK9LPQVuclshZV3qQOVeTWwiRtf8&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=YTm6SOmrXgeY1RknWGL8lg&_nc_ss=7b289&oh=00_Af5RvJU_1gmqK-C9GpAlK0829LWLX5aCggMirgjJbxQzBw&oe=6A240BC8)

**Disable embedded browser OAuth flow if your app does not use it.** Some desktop and mobile native apps authenticate users by doing the OAuth client flow inside an embedded webview. If your app does not do this, then disable the setting in **Products** \> **Facebook Login** \> **Settings** section of the App Dashboard.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/616042157_1414612720397378_1636126804963015263_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=DEdMTECP9rAQ7kNvwGWftt6&_nc_oc=Adqz1McAHwNMEZzbSfRlAAeUJEH7YGRWqqWWElxOOl06pGzCwDnzY3_UIrfWIKFFUUE&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=YTm6SOmrXgeY1RknWGL8lg&_nc_ss=7b289&oh=00_Af7ymfhFAbVEY6NMKT8bovlQNeVUTomF-Nzzuk_HV8fVtA&oe=6A23EB82)

**Disable mobile single sign on flows if your app does not use them.** If your app does not use iOS or Android Login, disable the ‘Single Sign On’ setting in the iOS and Android sections of **Settings** \> **Basic** .

The [App Dashboard](https://developers.facebook.com/apps) contains a number of additional settings which allow developers to shut down areas of attack that might otherwise lead to security issues:

**Basic > App Secret** if your app secret is ever compromised, you can reset it here.
**Basic > App Domains** use this to lock down the domains and subdomains which can be used to perform Facebook Login on behalf of your app.
**Advanced > App Type** when you create a native app for mobile or desktop and include the app secret within, set this to `Native/Desktop` to protect against your app being decompiled and your app secret stolen.
**Advanced > Server IP Allow List** specifies a list of IP addresses from which Graph API calls can be made with your app secret. Graph API calls made with your app secret from outside of this range will fail. Calls made with user access tokens are not affected by this setting.
**Advanced > Update Settings IP Allow List** locks down the IP addresses from which someone can modify these app settings to a specific range. Take care setting an IP allow list on residential broadband. If your IP address changes you will lose the ability to edit your app’s settings.
**Advanced > Update Notification Email** notifies an email address whenever any app setting is changed in the App Dashboard.
**Advanced > Stream post URL security** this will stop your app from publishing any URLs that don’t point back to a domain it owns. This will not always be useful, specifically if you know your app will publish links to other sites.

Did you find this page helpful?

![Thumbs up icon](https://static.xx.fbcdn.net/rsrc.php/yR/r/OEXJ0_DJeZv.svg)

![Thumbs down icon](https://static.xx.fbcdn.net/rsrc.php/yb/r/qKPgNVNeatU.svg)

ON THIS PAGE

Security Checklist

The App Secret

Secure Server-side Calls with appsecret\_proof

Generate the Proof

Add the Proof

Require the Proof

Secure Client-side Calls with Short-term Tokens and Code Flow

Token Hijacking

Check Access Token Validity Regularly

State Parameter

Enable Strict Mode

How Strict Mode Works

Use HTTPS

Enable JavaScript SDK for Facebook Login

How Redirect URI Checking Works

In-App Browsers and the JavaScript SDK

Lock Down Your Facebook App Settings

* * *