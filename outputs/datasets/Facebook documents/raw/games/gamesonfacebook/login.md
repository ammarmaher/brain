---
url: https://developers.facebook.com/docs/games/gamesonfacebook/login/
title: Login for Games on Facebook - Facebook Games
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgames%2Fbuild%2Flegacy-web-games%2Fget-started%2Flogin%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Build](https://developers.facebook.com/docs/games/build)

- [Instant Games](https://developers.facebook.com/docs/games/build/instant-games)
- [Gaming Services](https://developers.facebook.com/docs/games/build/gaming-services)
- [Cross Play](https://developers.facebook.com/docs/games/build/crossplay)
- [Legacy Web Games](https://developers.facebook.com/docs/games/build/legacy-web-games)


  - [Get Started](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started)


    - [Login](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login)
    - [Porting from Mobile](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/porting)
    - [Web Tech (HTML5)](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/webtech)
    - [Hosting](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/hosting)
    - [Optimization](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/optimization)

  - [Monetization](https://developers.facebook.com/docs/games/build/legacy-web-games/monetization)
  - [Gaming Services](https://developers.facebook.com/docs/games/build/legacy-web-games/gaming-services)
  - [Best Practices](https://developers.facebook.com/docs/games/build/legacy-web-games/best-practices)
  - [FAQ](https://developers.facebook.com/docs/games/build/legacy-web-games/faq)

- [Gaming Insights](https://developers.facebook.com/docs/games/build/fbs-insights)
- [Assets](https://developers.facebook.com/docs/games/build/assets)

On This Page

[Login for Games on Facebook](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#login-for-games-on-facebook)

[Overview](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#overview)

[Authentication Sources](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#authenticationsources)

[App Center Authentication](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#appcenterauthentication)

[Authentication on another platform](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#authonotherplatform)

[Detecting Login Status](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#detectingloginstatus)

[Using the Facebook SDK for JavaScript](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#usingjssdk)

[Using a Signed Request](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#usingsignedrequest)

[First-time Authentication](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#firsttimeauth)

[Client-side Login via JS SDK](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#clientsidelogin)

[Server-side Login via OAuth](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#serversidelogin)

[Next Steps](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#nextsteps)

# Login for Games on Facebook

## Overview

When you build a game for to be played on Facebook.com, you're building a web app which will be served inside an `iframe` container on Facebook.com. Since Facebook only serves games to logged in players, this means that you are guaranteed to have a logged in Facebook user available for authentication.

As such, you should always build **Facebook Login** support into your game, to provide you with a consistent ID on which to sync and persist game progress, and for implementing the social features that gamers expect in the games they play. If your game exists on multiple platforms, you can use this same ID to synchronise the game state for your players across the devices they use.

This document outlines the various approaches for using Facebook Login and how you can make best use of them in your game.

## Authentication Sources

There are a number of ways that a player can authenticate for the first time, and several approaches for verifying identity after the first authentication.

### App Center Authentication

When players launch your game via the **Play Now** button in App Center, they're authing your app for a specific set of permissions as configured in the App Details tab in App Dashboard.

%FB(devsite:markdown-wiki:image-card {
src: 'https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/12057109\_1513564935609558\_1360912395\_n.png?\_nc\_cat=103&ccb=1-7&\_nc\_sid=34156e&\_nc\_ohc=p9VqB4fdXGEQ7kNvwEp5L21&\_nc\_oc=Ado8DOKBEKclxks2829rRn9nIYQFjC2P9kmLiqrE9OgzSQZSz8gshxTJXGATjYS43Js&\_nc\_zt=14&\_nc\_ht=scontent-lax3-2.xx&\_nc\_gid=FvkHR9EgU9GeBYgqx61AKg&\_nc\_ss=7b289&oh=00\_Af7EDim5uSJ6xLM-RF49wq0IYbMK0hi-WGwpp8kXLFgQUg&oe=6A111F7C',
caption: 'The Play Now button in App Center',
})

Given that a high percentage of players will come to your app via App Center, this will be a common authentication path. To ensure smooth login from App Center, you should configure the set of permissions granted via App Center to match the permissions your game expects on Facebook.com and on mobile.

See the [App Center guide](https://developers.facebook.com/docs/games/appcenter#authorization) for more details.

### Authentication on another platform

If your game exists on mobile platforms, and supports Facebook Login in the mobile version, it's possible that some of your players will already be authenticated when they come to play your game on Facebook.com. It's important to make sure that the version of your game on Facebook.com expects the same set of permissions as your mobile game.

## Detecting Login Status

As described above, players will come to your game in either a **logged in** or **not logged in** state, depending on whether they've authed your game in the past, either by playing your game on Facebook previously, via App Center, or via a mobile version of your game.

You can detect whether a player has previously logged into your game in one of two ways:

- Client-side, using the JS SDK `FB.getLoginStatus()` method
- Server-side, by decoding a `signed_request`

### Using the Facebook SDK for JavaScript

By calling [`FB.getLoginStatus()`](https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/) on document load, you can ensure that a player is immediately logged in when they load the game. You can then use [`FB.api()`](https://developers.facebook.com/docs/javascript/reference/FB.api/) to access the player's game state via their user ID, and to retrieve information used for [personalization](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#personalization), such as the player's name, profile picture and friend list.

```
FB.getLoginStatus(function(response) {
  if (response.status === 'connected') {
    // the user is logged in and has authenticated your
    // app, and response.authResponse supplies
    // the user's ID, a valid access token, a signed
    // request, and the time the access token
    // and signed request each expire
    var uid = response.authResponse.userID;
    var accessToken = response.authResponse.accessToken;
  } else if (response.status === 'not_authorized') {
    // the user is logged in to Facebook,
    // but has not authenticated your app
  } else {
    // the user isn't logged in to Facebook.
  }
 });
```

If the player hasn't logged in, you can call [`FB.login(...)`](https://developers.facebook.com/docs/reference/javascript/FB.login/) to show a modal version of the login dialog on top of your game's initial screen. The callback for this dialog should be the same method call that you use when calling FB.getLoginStatus

### Using a Signed Request

When your game is loaded on Facebook.com, a HTTP POST request is made to your specified Canvas URL. This POST request will contain some parameters, including the `signed_request` parameter which you can use for authorisation.

The `signed_request` is base64url encoded and signed with an HMAC version of your **App Secret**, based on the OAuth 2.0 spec.

What this means is that when it is POSTed to your app, you will need to parse and verify it before it can be used. This is performed in three steps:

1. Split the signed request into two parts delineated by a '.' character (eg. `238fsdfsd.oijdoifjsidf899`)
2. Decode the first part - the **encoded signature** \- from base64url
3. Decode the second part - the **payload** \- from base64url and then decode the resultant JSON object

These steps are possible in any modern programming language. Below is an example in PHP:

```
function parse_signed_request($signed_request) {
  list($encoded_sig, $payload) = explode('.', $signed_request, 2);

  $secret = "appsecret"; // Use your app secret here

  // decode the data
  $sig = base64_url_decode($encoded_sig);
  $data = json_decode(base64_url_decode($payload), true);

  // confirm the signature
  $expected_sig = hash_hmac('sha256', $payload, $secret, $raw = true);
  if ($sig !== $expected_sig) {
    error_log('Bad Signed JSON signature!');
    return null;
  }

  return $data;
}

function base64_url_decode($input) {
  return base64_decode(strtr($input, '-_', '+/'));
}
```

This will produce a JSON object that looks something like this:

```
`{
   "oauth_token": "{user-access-token}",
   "algorithm": "HMAC-SHA256",
   "expires": 1291840400,
   "issued_at": 1291836800,
   "user_id": "218471"
}`
```

By parsing the `signed_request` parameter, you'll be able to detect whether the current player has authenticated your game. If they have, the `signed_request` will contain the player's user ID, which you can use for retrieving personalization information and game state. You can exchange this `signed_request` for an access token, and use that to access the Graph API for deeper personalisation.

If the player hasn't authenticated your game, you can instruct the browser to redirect to the Facebook OAuth endpoint, so the player can authenticate the game. See [Server-side Login via Oauth](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#serversidelogin) for more details

## First-time Authentication

The first time a player comes to your game, you should invite them to authenticate by presenting the Login Dialog. You can do this in two different ways

1. Client-side login via Javascript
2. Server-side login via OAuth Redirect.

Client-side Login via Javascript SDK is the recommended login flow for authentication. Historically, \[Server-side Login via OAuth\] been popular amongst developers, but client-side login gives developer extra control of the login flow. For example, developers can show simple game graphics before launching a login dialog and after canceling the dialog.

%FB(devsite:markdown-wiki:image-card {
src: 'https://scontent-lax3-2.xx.fbcdn.net/v/t39.2178-6/12057246\_1639170299681095\_350049336\_n.png?\_nc\_cat=100&ccb=1-7&\_nc\_sid=34156e&\_nc\_ohc=n2m4y95Ih7gQ7kNvwFgBOAM&\_nc\_oc=Adrtbj6cegGQR4npWYgvCfmJ5gttMam3ys-1Vfbp7qgsnE7vF5r0xb2d0qf03hfb3kk&\_nc\_zt=14&\_nc\_ht=scontent-lax3-2.xx&\_nc\_gid=FvkHR9EgU9GeBYgqx61AKg&\_nc\_ss=7b289&oh=00\_Af7wj0uRp8P8Gk694sO\_6U0ZrjpustktKThHNd6uU4j3Ug&oe=6A10FA48',
caption: 'Happy Acres, which uses a custom background on login',
})

### Client-side Login via JS SDK

Unique to games on Facebook, the JavaScript version of the Login Dialog will be triggered in `async` mode within the `iframe`. This means that it appears as a modal popup over the rest of the game contents, rather than as a separate popup browser window.

This is important, as it means that the dialog can be invoked directly from code, and not as part of a UI event, without being blocked by a browser's popup blocking detection methods.

As a result, you can use `FB.getLoginStatus()` to check if the current player has authenticated your game before, and if not, immediately display the Login Dialog on top of your game content by calling `FB.login()`, without needing to show a 'Log In' button.

See below for an example:

```
// Place following code after FB.init call.

function onLogin(response) {
  if (response.status == 'connected') {
    FB.api('/me?fields=first_name', function(data) {
      var welcomeBlock = document.getElementById('fb-welcome');
      welcomeBlock.innerHTML = 'Hello, ' + data.first_name + '!';
    });
  }
}

FB.getLoginStatus(function(response) {
  // Check login status on load, and if the user is
  // already logged in, go directly to the welcome message.
  if (response.status == 'connected') {
    onLogin(response);
  } else {
    // Otherwise, show Login dialog first.
    FB.login(function(response) {
      onLogin(response);
    }, {scope: 'user_friends, email'});
  }
});
```

### Server-side Login via OAuth

If you prefer to handle login verification on your server, you can use Server-side login via OAuth. With this flow, you'll redirect the player's browser to the OAuth Login Dialog to authenticate:

```
https://www.facebook.com/{version}/dialog/oauth?
    client_id={app-id}&
    redirect_uri={redirect-uri}&
    scope={permissions}
```

The dialog will redirect back to a URL you control, which is usually your Canvas URL. Once this round-trip completes, the HTTP POST call to your Canvas URL will contain a `signed_request` parameter, which you can use for personalization.

Please read [this doc](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow) for full implementation details, or see below for a basic example:

```
<?php
    require 'facebook.php';

    $app_id = 'APP_ID';
    $app_secret = 'APP_SECRET';
    $app_namespace = 'APP_NAMESPACE';
    $app_url = 'https://apps.facebook.com/' . $app_namespace . '/';
    $scope = 'email,publish_actions';

    // Init the Facebook SDK
    $facebook = new Facebook(array(
         'appId'  => $app_id,
         'secret' => $app_secret,
));

// Get the current user
$user = $facebook->getUser();

// If the user has not installed the app, redirect them to the Login Dialog
if (!$user) {
        $loginUrl = $facebook->getLoginUrl(array(
        'scope' => $scope,
        'redirect_uri' => $app_url,
        ));

        print('<script> top.location.href=\'' . $loginUrl . '\'</script>');
}
?>
```

You must do this redirect in JS and target the top frame via `top.location`, otherwise the redirect won't work.

## Next Steps

Whichever method you choose to use for login, having a real identity in your game will help you build great social features that will help with retention and distribution of your game.

Login is the first step towards many of these features, and you can build them using the products below:

- [Game Requests](https://developers.facebook.com/docs/games/services/gamerequests)
- [Scores & Achievements](https://developers.facebook.com/docs/games/services/scores-achievements)
- [App-to-User Notifications](https://developers.facebook.com/docs/games/services/appnotifications)

Take a look at the [Best Practices for Games on Facebook](https://developers.facebook.com/docs/games/gamesonfacebook/bestpractices) for more tips on using Facebook Login effectively in your game.

On This Page

[Login for Games on Facebook](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#login-for-games-on-facebook)

[Overview](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#overview)

[Authentication Sources](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#authenticationsources)

[App Center Authentication](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#appcenterauthentication)

[Authentication on another platform](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#authonotherplatform)

[Detecting Login Status](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#detectingloginstatus)

[Using the Facebook SDK for JavaScript](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#usingjssdk)

[Using a Signed Request](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#usingsignedrequest)

[First-time Authentication](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#firsttimeauth)

[Client-side Login via JS SDK](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#clientsidelogin)

[Server-side Login via OAuth](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#serversidelogin)

[Next Steps](https://developers.facebook.com/docs/games/build/legacy-web-games/get-started/login#nextsteps)