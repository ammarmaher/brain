---
url: https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection
title: Copyright Detection - Instagram Platform
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Finstagram-platform%2Finstagram-api-with-facebook-login%2Fcopyright-detection%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Platform](https://developers.facebook.com/docs/instagram-platform)

- [Overview](https://developers.facebook.com/docs/instagram-platform/overview)
- [Webhooks](https://developers.facebook.com/docs/instagram-platform/webhooks)
- [Create an App](https://developers.facebook.com/docs/instagram-platform/create-an-instagram-app)
- [Instagram API with Instagram Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-instagram-login)
- [Instagram API with Facebook Login](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login)


  - [Get Started](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/get-started)
  - [Facebook Login for Business](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-login-for-instagram)
  - [Business Discovery](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/business-discovery)
  - [Creator Marketplace API](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/creator-marketplace)
  - [Copyright Detection](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection)
  - [Hashtag Search](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/hashtag-search)
  - [Mentions](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/mentions)
  - [Product Tagging](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/product-tagging)
  - [Upcoming Events](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/upcoming-events)
  - [Collaboration](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/collaboration)

- [Publish Content](https://developers.facebook.com/docs/instagram-platform/content-publishing)
- [Comment Moderation](https://developers.facebook.com/docs/instagram-platform/comment-moderation)
- [Private Replies](https://developers.facebook.com/docs/instagram-platform/private-replies)
- [Insights](https://developers.facebook.com/docs/instagram-platform/insights)
- [Sharing to Feed](https://developers.facebook.com/docs/instagram-platform/sharing-to-feed)
- [Sharing to Stories](https://developers.facebook.com/docs/instagram-platform/sharing-to-stories)
- [oEmbed](https://developers.facebook.com/docs/instagram-platform/oembed)
- [Embed Button](https://developers.facebook.com/docs/instagram-platform/embed-button)
- [Self Messaging](https://developers.facebook.com/docs/instagram-platform/self-messaging)
- [API Reference](https://developers.facebook.com/docs/instagram-platform/reference)
- [App Review](https://developers.facebook.com/docs/instagram-platform/app-review)
- [Support](https://developers.facebook.com/docs/instagram-platform/support)
- [Changelog](https://developers.facebook.com/docs/instagram-platform/changelog)

On This Page

[Copyright Detection](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#copyright-detection)

[Before you start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#before-you-start)

[Best practices](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#best-practices)

[Check an uploaded video](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#check-an-uploaded-video)

[Sample Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#sample-request)

[Sample Responses](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#sample-responses)

[Check a published video](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#check-a-published-video)

[Sample Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#sample-request-2)

[Sample Responses](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#sample-responses-2)

[See also](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#see-also)

# Copyright Detection

This guide shows you how to detect copyright violations for a video uploaded or published to Instagram using the Instagram Graph API.

We only support Instagram media created via the content publishing API for early copyright detection.

## Before you start

Before you start you will need the following:

- All requirements and limitations for accessing the Instagram Container and Instagram Media endpoints apply

### Best practices

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

## Check an uploaded video

To check the copyright status for a video that have been uploaded, but not yet published, send a `GET` request to the `/{ig-containter-id}` endpoint with the `fields` parameter set to `copyright_check_status`.

### Sample Request

```curl
curl -i -X GET "https://graph.facebook.com/v25.0/{ig-containter-id}?fields=copyright_check_status"

```

On success, your app receives a JSON response with a `copyright_check_status` object with the following key-value pairs:

- `status` set to `completed`, `error`, `in_progress`, or `not_started`
- `matches_found`set to:


  - `false` if none are detected
  - `true` if violations are detected and `author`, `content_title`, `matched_segments`, and `owner_copyright_policy` values

### Sample Responses

|     |     |
| --- | --- |
| #### Violation found<br>```json<br>{<br>  "copyright_check_status": {<br>    "status": "complete",<br>    "matches_found": true<br>  },<br>  "id": "{ig-containter-id}"<br>}<br>``` | #### No violation found<br>```json<br>{<br>  "copyright_check_status": {<br>      "status": "in_progress",<br>      "matches_found": false<br>  }<br>}<br>``` |

## Check a published video

To check the copyright status for a video that has been published, send a `GET` request to the `/{ig-media-id}` endpoint with the `fields` parameter set to `copyright_check_information`.

### Sample Request

```curl
curl -i -X GET "https://graph.facebook.com/v25.0/{ig-media-id}?fields=copyright_check_information"

```

On success, your app receives a JSON response with the `id` set to the video being checked and the `copyright_check_information` object with the following:

- `status` set to a `status` object set to `completed`, `error`, `in_progress`, or `not_started`
- `copyright_matches`set to:


  - `false` – Returned when no copyright violations are detected
  - `true` – Returned when copyright violations are detected and includes the `copyright_check_information` object that contains information about the copyright owner, policy, mitigation steps, and sections of the media that violated the copyright.

### Sample Responses

|     |     |
| --- | --- |
| #### Violation found<br>```json<br>{<br>  "copyright_check_information": {<br>     "status": {<br>       "status": "complete",<br>       "matches_found": true<br>     },<br>     "copyright_matches": [<br>       {<br>         "content_title": "In My Feelings",<br>         "author": "Drake",<br>         "owner_copyright_policy": {<br>           "name": "UMG",<br>           "actions": [<br>             {<br>               "action": "BLOCK",<br>               "territories": "3",<br>               "geos": [<br>                 "Canada",<br>                 "India",<br>                 "United States of America"<br>               ]<br>             },<br>             {<br>               "action": "MUTE",<br>               "territories": "4",<br>               "geos": [<br>                 "Taiwan",<br>                 "Tanzania",<br>                 "Saudi Arabia",<br>                 "United Kingdom of Great Britain and Northern Ireland"<br>               ]<br>             }<br>           ]<br>         },<br>         "matched_segments": [<br>          {<br>            "start_time_in_seconds": 2.4,<br>            "duration_in_seconds": 5.1,<br>            "segment_type": "AUDIO"<br>          },<br>          {<br>            "start_time_in_seconds": 10.2,<br>            "duration_in_seconds": 4.5,<br>            "segment_type": "VIDEO"<br>          }<br>        ]<br>      }<br>    ]<br>  },<br>  "id": "90012800291314"<br>}<br>``` | #### No violation found<br>```json<br>{<br>  "copyright_check_information": {<br>    "status": {<br>      "status": "complete",<br>      "matches_found": false<br>    }<br>  },<br>  "id": "{ig-media-id}"<br>}<br>``` |

## See also

- [Instagram Container Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwHAIUCq&_nc_oc=Adr_NEco9X8HSyawm4DTvBieeWO2PDGwUq72W7a1N2LWGBO7MdGWDTBQYcBTAmwy2ss&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=oESu1STygRchLWbL3cNFJQ&_nc_ss=7b289&oh=00_Af4VtuuT_3B88Epmg7U5t95amBSID4vlDe6_rbdhRJav3g&oe=6A2592E2)](https://developers.facebook.com/docs/instagram-api/reference/ig-container)

- [Instagram Media Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwHAIUCq&_nc_oc=Adr_NEco9X8HSyawm4DTvBieeWO2PDGwUq72W7a1N2LWGBO7MdGWDTBQYcBTAmwy2ss&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=oESu1STygRchLWbL3cNFJQ&_nc_ss=7b289&oh=00_Af4VtuuT_3B88Epmg7U5t95amBSID4vlDe6_rbdhRJav3g&oe=6A2592E2)](https://developers.facebook.com/docs/instagram-api/reference/ig-media)


On This Page

[Copyright Detection](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#copyright-detection)

[Before you start](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#before-you-start)

[Best practices](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#best-practices)

[Check an uploaded video](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#check-an-uploaded-video)

[Sample Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#sample-request)

[Sample Responses](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#sample-responses)

[Check a published video](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#check-a-published-video)

[Sample Request](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#sample-request-2)

[Sample Responses](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#sample-responses-2)

[See also](https://developers.facebook.com/docs/instagram-platform/instagram-api-with-facebook-login/copyright-detection#see-also)