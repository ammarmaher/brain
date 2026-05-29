---
url: https://developers.facebook.com/docs/plugins/embedded-video-player/api
title: API - Embedded Videos
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2Fembedded-video-player%2Fapi%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Embedded Videos](https://developers.facebook.com/docs/plugins/embedded-video-player)

- [API](https://developers.facebook.com/docs/plugins/embedded-video-player/api)

On This Page

[Embedded Video Player API](https://developers.facebook.com/docs/plugins/embedded-video-player/api#embedded-video-player-api)

[Setup](https://developers.facebook.com/docs/plugins/embedded-video-player/api#setup)

[Handling Multiple Players](https://developers.facebook.com/docs/plugins/embedded-video-player/api#multiple-players)

[Player Controls](https://developers.facebook.com/docs/plugins/embedded-video-player/api#controls)

[Usage Examples](https://developers.facebook.com/docs/plugins/embedded-video-player/api#usage-examples)

[Subscribing to Events](https://developers.facebook.com/docs/plugins/embedded-video-player/api#event-subscription)

[Player Controls Reference](https://developers.facebook.com/docs/plugins/embedded-video-player/api#control-reference)

[Event Reference](https://developers.facebook.com/docs/plugins/embedded-video-player/api#event-reference)

# Embedded Video Player API

Using the Embedded Video Player API you can control the [embedded video player](https://developers.facebook.com/docs/plugins/embedded-video-player) as well as observe events triggered by the player. For example, you may listen to the event when a video is paused or start the video playback using a custom button.

To get started follow the sections below:

- [Setup](https://developers.facebook.com/docs/plugins/embedded-video-player/api#setup)
- [Player Controls](https://developers.facebook.com/docs/plugins/embedded-video-player/api#controls)
- [Subscribe to Events](https://developers.facebook.com/docs/plugins/embedded-video-player/api#event-subscription)
- [Player Controls Reference](https://developers.facebook.com/docs/plugins/embedded-video-player/api#control-reference)

## Setup

#### 1\. Configure Plugin

Read the [embedded video player documentation](https://developers.facebook.com/docs/plugins/embedded-video-player) to learn how to setup the plugin.

#### 2\. Get Embedded Video Player API Instance

To get the embedded video player API instance Listen to `xfbml.ready`. If the message `type` is `video`, the `ready` event was fired by the embedded video player.

```code
var my_video_player;
FB.Event.subscribe('xfbml.ready', function(msg) {
  if (msg.type === 'video') {
    my_video_player = msg.instance;
  }
});
```

#### 3\. Full Code Example

In the code sample below we assume you are using an app ID when initalizing the [Facebook SDK for JavaScript](https://developers.facebook.com/docs/javascript). If you don't have an app ID yet, read the docs for [creating an app ID](https://developers.facebook.com/docs/apps/register).

In the code sample below replace `{your-app-id}` by your app ID and `data-href` with your video URL. Make sure that you check for the `xfbml.ready` event after calling the function `FB.init()`.

```code
<html>
<head>
  <title>Your Website Title</title>
</head>
<body>

  <!-- Load Facebook SDK for JavaScript -->
  <script>
    window.fbAsyncInit = function() {
      FB.init({
        appId      : '{your-app-id}',
        xfbml      : true,
        version    : 'v3.2'
      });

      // Get Embedded Video Player API Instance
      var my_video_player;
      FB.Event.subscribe('xfbml.ready', function(msg) {
        if (msg.type === 'video') {
          my_video_player = msg.instance;
        }
      });
    };
  </script>
  <div id="fb-root"></div>
  <script async defer src="https://connect.facebook.net/en_US/sdk.js"></script>

  <!-- Your embedded video player code -->
  <div
    class="fb-video"
    data-href="https://www.facebook.com/facebook/videos/10153231379946729/"
    data-width="500"
    data-allowfullscreen="true"></div>

</body>
</html>
```

### Handling Multiple Players

If you are using multiple players on one page you can identify a video player by adding an `id` attribute to the video player tag and checking for its `id` in the `msg` object:

```code
<div id="my-video-player-id" ... />
<script>
FB.Event.subscribe('xfbml.ready', function(msg) {
  if (msg.type === 'video' && msg.id === 'my-video-player-id') {
     // True for <div id="my-video-player-id" ...
     my_video_player = msg.instance;
  }
});
</script>
```

## Player Controls

You can call a [set of functions](https://developers.facebook.com/docs/plugins/embedded-video-player/api#function-reference) to control your video player or get its current status, e.g. the current playback position.

### Usage Examples

```code
// Start video playback
my_video_player.play();

// Check whether video is muted
if (my_video_player.isMuted()) {
  // Video is muted
}

// Jump to second 5 of the video
my_video_player.seek(5);
```

[Player Controls Reference](https://developers.facebook.com/docs/plugins/embedded-video-player/api#control-reference)

## Subscribing to Events

The function `subscribe()` adds a listener function for a specified event, e.g. `startedPlaying`.

```code
var myEventHandler = my_video_player.subscribe('startedPlaying', function(e) {
  // Video started playing ...
});
```

### Remove Event Subscriptions

The function `subscribe()` returns a token with a `release` method that when called, will remove the listener again from the event.

```code
myEventHandler.release('startedPlaying');
```

[Event Reference](https://developers.facebook.com/docs/plugins/embedded-video-player/api#event-reference)

## Player Controls Reference

You can call a set of functions to control your video player or get its current status, e.g. the current playback position.

| Function | Description | Arguments (Type) |
| --- | --- | --- |
| `play()` | Plays the video. |  |
| `pause()` | Pauses the video. |  |
| `seek(seconds)` | Seeks to specified position. | `seconds` (`number`) |
| `mute()` | Mute the video. |  |
| `unmute()` | Unmute the video. |  |
| `isMuted()` | `true` if video is muted, `false` if not. |  |
| `setVolume(volume)` | Sets the volume to specified number (`float`, scale from `0` to `1`). | `volume` (`float`) |
| `getVolume()` | Returns the video's current volume (`float`, scale from `0` to `1`). |  |
| `getCurrentPosition()` | Returns current video time position in seconds. |  |
| `getDuration()` | Returns the video duration in seconds. |  |
| `subscribe(event, eventCallback)` | Adds a listener function for the specified event. For details about events, refer to the section [Subscribing to Events](https://developers.facebook.com/docs/plugins/embedded-video-player/api#event-subscription). <br>Returns a token with a `release` method that when called, will remove the listener again from the event. | `event` (`string`), `eventCallback` (`function`) |

## Event Reference

| Event | Description |
| --- | --- |
| `startedPlaying` | Fired when video starts to play. |
| `paused` | Fired when video pauses. |
| `finishedPlaying` | Fired when video finishes playing. |
| `startedBuffering` | Fired when video starts to buffer. |
| `finishedBuffering` | Fired when video recovers from buffering. |
| `error` | Fired when an error occurs on the video. |

On This Page

[Embedded Video Player API](https://developers.facebook.com/docs/plugins/embedded-video-player/api#embedded-video-player-api)

[Setup](https://developers.facebook.com/docs/plugins/embedded-video-player/api#setup)

[Handling Multiple Players](https://developers.facebook.com/docs/plugins/embedded-video-player/api#multiple-players)

[Player Controls](https://developers.facebook.com/docs/plugins/embedded-video-player/api#controls)

[Usage Examples](https://developers.facebook.com/docs/plugins/embedded-video-player/api#usage-examples)

[Subscribing to Events](https://developers.facebook.com/docs/plugins/embedded-video-player/api#event-subscription)

[Player Controls Reference](https://developers.facebook.com/docs/plugins/embedded-video-player/api#control-reference)

[Event Reference](https://developers.facebook.com/docs/plugins/embedded-video-player/api#event-reference)