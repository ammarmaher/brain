---
url: https://developers.facebook.com/docs/video-api/guides/music-recommendations
title: Music Recommendations - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Fguides%2Fmusic-recommendations%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Video API](https://developers.facebook.com/docs/video-api)

- [Overview](https://developers.facebook.com/docs/video-api/overview)
- [Get Started](https://developers.facebook.com/docs/video-api/getting-started)
- [A/B Testing](https://developers.facebook.com/docs/video-api/ab-testing)
- [Crossposting](https://developers.facebook.com/docs/video-api/guides/crossposting)
- [Get Videos](https://developers.facebook.com/docs/video-api/guides/get-videos)
- [Get Insights](https://developers.facebook.com/docs/video-api/guides/insights)
- [Music Recommendations](https://developers.facebook.com/docs/video-api/guides/music-recommendations)
- [Upload a File or Video](https://developers.facebook.com/docs/graph-api/guides/upload)
- [Splitting](https://developers.facebook.com/docs/video-api/guides/splitting)
- [Publish a Video](https://developers.facebook.com/docs/video-api/guides/publishing)
- [Publish a Reel](https://developers.facebook.com/docs/video-api/guides/reels-publishing)
- [Rights Manager API](https://developers.facebook.com/docs/graph-api/rights-manager-api)
- [Slideshows](https://developers.facebook.com/docs/video-api/guides/slideshows)
- [Stories](https://developers.facebook.com/docs/page-stories-api)
- [Reference](https://developers.facebook.com/docs/video-api/reference)

On This Page

[Music Recommendations for Videos and Reels](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-recommendations-for-videos-and-reels)

[Before You Start](https://developers.facebook.com/docs/video-api/guides/music-recommendations#before-you-start)

[Limitations](https://developers.facebook.com/docs/video-api/guides/music-recommendations#limitations)

[Music Recommendations](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-recommendations)

[Music Popular on Facebook](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-popular-on-facebook)

[New Music on Facebook](https://developers.facebook.com/docs/video-api/guides/music-recommendations#new-music-on-facebook)

[Music for You](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-for-you)

[Example API Response](https://developers.facebook.com/docs/video-api/guides/music-recommendations#example-api-response)

[Error Codes](https://developers.facebook.com/docs/video-api/guides/music-recommendations#error-codes)

# Music Recommendations for Videos and Reels

Get music recommendations for your videos and reels you post to Facebook and Instagram. Learn what music is performing well on Meta's apps.

## Before You Start

You will need:

- A Page or User access token
- Your app must have the following permissions:

  - `pages_read_engagement`

### Limitations

- Business Facebook Pages may see limited results returned

## Music Recommendations

### Music Popular on Facebook

To get a list of popular songs on Meta’s apps, send a `GET` request to the `/audio/recommendations` endpoint with the `type` parameter set to `FACEBOOK_POPULAR_MUSIC`.

#### Example Request

_Formatted for readability._

```curl
curl -i -X GET "https://graph.facebook.com/v25.0/audio/recommendations
    ?type=FACEBOOK_POPULAR_MUSIC
    &access_token=ACCESS_TOKEN"
```

### New Music on Facebook

To get a list of recent additions to Meta’s music library, send a `GET` request to the `/audio/recommendations` endpoint with the `type` parameter set to `FACEBOOK_NEW_MUSIC`.

#### Example Request

_Formatted for readability._

```curl
curl -i -X GET "https://graph.facebook.com/v25.0/audio/recommendations
    ?type=FACEBOOK_NEW_MUSIC
    &access_token=ACCESS_TOKEN"
```

### Music for You

To get personalized music recommendations for you, send a `GET` request to the `/audio/recommendations` endpoint with the `type` parameter set to `FACEBOOK_FOR_YOU`.

#### Example Request

_Formatted for readability._

```curl
curl -i -X GET "https://graph.facebook.com/v25.0/audio/recommendations
    ?type=FACEBOOK_FOR_YOU
    &access_token=ACCESS_TOKEN"
```

You can also get popular music for a specific country or countries by adding the `available_countries` parameter with a comma separated list of two letter Alpha-2 ISO Country Code abbreviations.

### Example API Response

On success, your app receives a JSON response with a list of objects that contain the title of a song, the artist, and a link to the album artwork that has been uploaded to Facebook.

```json
{
  "data": [\
    {\
      "title": "Song Title A",\
      "artist": "Artist Name A",\
      "display_image_uri": "urlToAlbumArtA.com"\
    },\
    {\
      "title": "Song Title B",\
      "artist": "Artist Name B",\
      "display_image_uri": "urlToAlbumArtB.com"\
    },\
    {\
      "title": "Song Title C",\
      "artist": "Artist Name C",\
      "display_image_uri": "urlToAlbumArtC.com"\
    }\
  ]
}
```

## Error Codes

| Code – Subcode | Description |
| --- | --- |
| 100 – 4138001 | Invalid country code, country code must be a valid alpha-2 ISO country code |

On This Page

[Music Recommendations for Videos and Reels](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-recommendations-for-videos-and-reels)

[Before You Start](https://developers.facebook.com/docs/video-api/guides/music-recommendations#before-you-start)

[Limitations](https://developers.facebook.com/docs/video-api/guides/music-recommendations#limitations)

[Music Recommendations](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-recommendations)

[Music Popular on Facebook](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-popular-on-facebook)

[New Music on Facebook](https://developers.facebook.com/docs/video-api/guides/music-recommendations#new-music-on-facebook)

[Music for You](https://developers.facebook.com/docs/video-api/guides/music-recommendations#music-for-you)

[Example API Response](https://developers.facebook.com/docs/video-api/guides/music-recommendations#example-api-response)

[Error Codes](https://developers.facebook.com/docs/video-api/guides/music-recommendations#error-codes)