---
url: https://developers.facebook.com/docs/video-api/ab-testing
title: A/B Testing - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Fab-testing%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[A/B Testing API for Reels and Videos](https://developers.facebook.com/docs/video-api/ab-testing#a-b-testing-api-for-reels-and-videos)

[Before You Start](https://developers.facebook.com/docs/video-api/ab-testing#before-you-start)

[Limitations](https://developers.facebook.com/docs/video-api/ab-testing#limitations)

[Create an A/B Test](https://developers.facebook.com/docs/video-api/ab-testing#create-an-a-b-test)

[Example Request](https://developers.facebook.com/docs/video-api/ab-testing#example-request)

[Get A/B Test Results](https://developers.facebook.com/docs/video-api/ab-testing#get-a-b-test-results)

[For a specific test](https://developers.facebook.com/docs/video-api/ab-testing#for-a-specific-test)

[For All Tests on a Page](https://developers.facebook.com/docs/video-api/ab-testing#for-all-tests-on-a-page)

[Delete an A/B test](https://developers.facebook.com/docs/video-api/ab-testing#delete-an-a-b-test)

[References](https://developers.facebook.com/docs/video-api/ab-testing#references)

[More Resources](https://developers.facebook.com/docs/video-api/ab-testing#more-resources)

# A/B Testing API for Reels and Videos

This document shows you how to create an A/B test for reels and videos published on a Facebook Page.

You can run up to 50 tests at once with a minimum of 2 posts and a maximum of 4 posts per test.

## Before You Start

You need the following:

- The ID for the Facebook Page where the test is being conducted
- A Page access token requested from a user who can perform the `CREATE_CONTENT` task on the Page
- The user must grant your app the following permissions using Facebook Login:

  - `pages_manage_engagement`
  - `pages_show_list`
  - `pages_manage_posts`
  - `pages_read_engagement`
  - `pages_read_user_content`
- The IDs for the reels or videos, in draft status, that you want to compare

  - The reels or videos must be uploaded to Meta servers but not yet published

### Limitations

- An A/B test can only be created on Facebook Pages
- A reel or video that has already been published can not be used in an A/B test
- A reel or video cannot be used in multiple A/B tests

## Create an A/B Test

To create an A/B test, send a `POST` request to the `/` **_`PAGE`_**`/ab_tests` endpoint, where **_`PAGE`_** is the ID for the Facebook Page, and include the following parameters:

_Required_

- `control_video_id` – the ID for the video that, in the event of a tie, will be selected as the winning video
- `description` – the description for your experiment
- `experiment_video_ids` – the IDs for the videos you are comparing
- `name` – the name for your experiment
- `optimization_goal` – the goal of your experiment must be one of the following:

|     |     |     |
| --- | --- | --- |
| - `AVG_TIME_WATCHED`<br>- `COMMENTS`<br>- `IMPRESSIONS` | - `IMPRESSIONS_UNIQUE`<br>- `LINK_CLICKS`<br>- `REACTIONS` | - `REELS_PLAYS`<br>- `SHARES`<br>- `VIDEO_VIEWS_60S` |

_Optional_

- `duration`– the length of time, in seconds, to run the test


  - minimum duration is 30 minutes (1800 seconds)
  - maximum duration is 1 week (604800 seconds)
- `scheduled_experiment_timestamp`– the UNIX timestamp for the time to start the test,


  - default to the time you create the test

### Example Request

_Formatted for readability. Replace bold, italics values, such as **`PAGE`**, with your values._

```curl
curl -X POST "https://graph.facebook.com/v25.0/YOUR_PAGE_ID/ab_tests"
     -H "Content-type: application/json"
     -d '{
           "name": "YOUR_TEST_NAME",
           "description": "YOUR_TEST_DESCRIPTION",
           "optimization_goal": "YOUR_OPTIMIZATION_GOAL",
           "experiment_video_ids": [YOUR_EXPERIMENTAL_VIDEO_ID_1, YOUR_EXPERIMENTAL_VIDEO_ID_2],
           "control_video_id": YOUR_EXPERIMENTAL_VIDEO_ID_1_AS_CONTROL
         ,
           "duration": 1800,
}'
```

On success your app will receive a JSON response with the ID for your A/B test.

```json
{
  "id": "AB_TEST_ID"
}
```

## Get A/B Test Results

You can get data about an A/B test during the experiment or after it has concluded.

### For a specific test

To get data about a specific A/B test, send a `GET` request to the **_`/AB_TEST_ID`_** enpoint where **_`AB_TEST_ID`_** is the ID for the test you are interested in.

```json
curl -i -X GET "https://graph.facebook.com/AB_TEST_ID"
```

On success your app will receive a JSON response with details about the experiment such as the name, goal, IDs for the videos, published status, videos insights for each test video, and a declaration for which video performed the best. In the example here, EXPERIMENTAL\_VIDEO\_ID\_1 performed the best.

```json
{
  "id": YOUR_AB_TEST_ID,
  "name": "YOUR_AB_TEST_NAME",
  "description": "YOUR_AB_TEST_DESCRIPTION",
  "optimization_goal": "REELS_PLAYS",
  "experiment_video_ids": [YOUR_EXPERIMENTAL_VIDEO_ID_1, YOUR_EXPERIMENTAL_VIDEO_ID_2],
  "control_video_id": VIDEO_ID_1_AS_CONTROL,
  "publish_status": "LIVE",
  "creation_time": "1686665092",
  "updated_time": "1686665092",
  "scheduled_experiment_timestamp": "1686665092",
  "test_insights": {
      "timestamp": "1686665092",
      "videos": {
          YOUR_EXPERIMENTAL_VIDEO_ID_1: {
              "plays": 10,
              "impressions": 1,
              "fan_impressions": 1,
              "link_clicks": 1,
              "comments": 1,
              "shares": 1,
              "reactions": 1,
              "video_views_60s": 1,
              "video_views_3s": 1,
              "video_views_15s": 1,
              "avg_video_views": 1,
              "video_views": 1,
              "instream_ads_earnings": 1,
              "avg_time_watched": 1,
              "video_retention_graph": {
                  "0": 1,
                  "1": 1,
                  "2": 0.5,
                  "3": 0.2
              }
          }
          YOUR_EXPERIMENTAL_VIDEO_ID_2: {
              "plays": 5,
              "impressions": 1,
              "fan_impressions": 1,
              "link_clicks": 1,
              "comments": 0,
              "shares": 0,
              "reactions": 1,
              "video_views_60s": 1,
              "video_views_3s": 1,
              "video_views_15s": 1,
              "avg_video_views": 1,
              "video_views": 1,
              "instream_ads_earnings": 0,
              "avg_time_watched": 1,
              "video_retention_graph": {
                  "0": 1,
                  "1": 1,
                  "2": 0.5,
                  "3": 0.2
              }
          }
      },
      "declared_winning_video": YOUR_EXPERIMENTAL_VIDEO_ID_1,
  }
}
```

### For All Tests on a Page

To get a list of all A/B tests conducted on your Facebook Page, send a `GET` request to the `/***PAGE***/ab_tests` endpoint where **_`PAGE`_** is the ID for the Page you are interested in. Add the `since` and `unti` parameters to get data for tests run during a specific time period.

**Note:** When using the `since` and `until` parameters in your `GET` request, the date for `until` must be a date after the date for `since`. For example, if `since` is 2023-01-31, `until` must be after 2023-01-31. You can use both parameters, or one or the other. Date formats can be any of the following:

- `today`, `yesterday`

- Epoch timestamps (`1676057525`)

- dd mmm yyyy (`31 jan 2023`) or dd-mm-yyyy (`31-1-2023`)


```curl
curl -X GET "https://graph.facebook.com/v25.0/PAGE/ab_tests"
```

On success your app receives a JSON response with an array of test objects.

```json
{
  "data": [\
  ... {AB_TEST_RESPONSE_OBJECT_1},\
  ... {AB_TEST_RESPONSE_OBJECT_2},\
  ... {AB_TEST_RESPONSE_OBJECT_3}\
  ],
  "cursors": {
    "before":"QVFIUkxLWWtMb3BSQV91aF81NkN4c1RYczJZAQ0NQOHpQ",
    "after":"QVFIUkxLWWtMb3BSQV91aF81NkN4c1RYczJZAQ0NQOH"
  }
}
```

## Delete an A/B test

You can delete an A/B test once it has concluded.

To delete an A/B test, send a `DELETE` request to the `AB_TEST_ID` endpoint where ID is the ID for the A/B test you want to delete.

```curl
curl -X DELETE "https://graph.facebook.com/v25.0/AB_TEST_ID"
```

Note that the posts in the A/B test will not be deleted.

## References

| Endpoint | Description |
| --- | --- |
| `/page/ab_tests` | Create and read A/B tests for a specific Facebook Page |
| `/AB_TEST_ID` | A specific A/B test |

## More Resources

- [Graph API Overview](https://developers.facebook.com/docs/graph-api/overview)![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH31UFo&_nc_oc=AdpQ2_Uc_YYGjk0Aen8SABHWeoTTXLPQOAUufUtfiwmZqh3w8oDZqxEDKG3-UslJDws&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=gZyCAlWVEM4tZofk9Gprdw&_nc_ss=7b289&oh=00_Af6ZDrgcjYGAFL9TYJpYy3xf8HiuL0b8lbGby4Bs5CBeKw&oe=6A2592E2) – Learn more about the Graph API from Meta


- [Facebook Login\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH31UFo&_nc_oc=AdpQ2_Uc_YYGjk0Aen8SABHWeoTTXLPQOAUufUtfiwmZqh3w8oDZqxEDKG3-UslJDws&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=gZyCAlWVEM4tZofk9Gprdw&_nc_ss=7b289&oh=00_Af6ZDrgcjYGAFL9TYJpYy3xf8HiuL0b8lbGby4Bs5CBeKw&oe=6A2592E2)](https://developers.facebook.com/docs/facebook-login) – Learn how to implement Facebook Login to ask for permissions from a person


- [Facebook Page Tasks\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH31UFo&_nc_oc=AdpQ2_Uc_YYGjk0Aen8SABHWeoTTXLPQOAUufUtfiwmZqh3w8oDZqxEDKG3-UslJDws&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=gZyCAlWVEM4tZofk9Gprdw&_nc_ss=7b289&oh=00_Af6ZDrgcjYGAFL9TYJpYy3xf8HiuL0b8lbGby4Bs5CBeKw&oe=6A2592E2)](https://developers.facebook.com/docs/pages/overview/permissions-features#tasks) – Learn more about the tasks a person can perform on a Facebook Page


- [Page Access Tokens\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH31UFo&_nc_oc=AdpQ2_Uc_YYGjk0Aen8SABHWeoTTXLPQOAUufUtfiwmZqh3w8oDZqxEDKG3-UslJDws&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=gZyCAlWVEM4tZofk9Gprdw&_nc_ss=7b289&oh=00_Af6ZDrgcjYGAFL9TYJpYy3xf8HiuL0b8lbGby4Bs5CBeKw&oe=6A2592E2)](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#pagetokens) – Learn more about Page access tokens and securing API calls


- [Paginated Results\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH31UFo&_nc_oc=AdpQ2_Uc_YYGjk0Aen8SABHWeoTTXLPQOAUufUtfiwmZqh3w8oDZqxEDKG3-UslJDws&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=gZyCAlWVEM4tZofk9Gprdw&_nc_ss=7b289&oh=00_Af6ZDrgcjYGAFL9TYJpYy3xf8HiuL0b8lbGby4Bs5CBeKw&oe=6A2592E2)](https://developers.facebook.com/docs/graph-api/results) – Learn more about paginated results returned via the Graph API


- [Permissions\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH31UFo&_nc_oc=AdpQ2_Uc_YYGjk0Aen8SABHWeoTTXLPQOAUufUtfiwmZqh3w8oDZqxEDKG3-UslJDws&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=gZyCAlWVEM4tZofk9Gprdw&_nc_ss=7b289&oh=00_Af6ZDrgcjYGAFL9TYJpYy3xf8HiuL0b8lbGby4Bs5CBeKw&oe=6A2592E2)](https://developers.facebook.com/docs/permissions) – Learn about permissions needed to access API endpoints


- [Upload a Video\\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwH31UFo&_nc_oc=AdpQ2_Uc_YYGjk0Aen8SABHWeoTTXLPQOAUufUtfiwmZqh3w8oDZqxEDKG3-UslJDws&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=gZyCAlWVEM4tZofk9Gprdw&_nc_ss=7b289&oh=00_Af6ZDrgcjYGAFL9TYJpYy3xf8HiuL0b8lbGby4Bs5CBeKw&oe=6A2592E2)](https://developers.facebook.com/docs/video-api/getting-started) – Learn how to upload videos to the Meta servers



On This Page

[A/B Testing API for Reels and Videos](https://developers.facebook.com/docs/video-api/ab-testing#a-b-testing-api-for-reels-and-videos)

[Before You Start](https://developers.facebook.com/docs/video-api/ab-testing#before-you-start)

[Limitations](https://developers.facebook.com/docs/video-api/ab-testing#limitations)

[Create an A/B Test](https://developers.facebook.com/docs/video-api/ab-testing#create-an-a-b-test)

[Example Request](https://developers.facebook.com/docs/video-api/ab-testing#example-request)

[Get A/B Test Results](https://developers.facebook.com/docs/video-api/ab-testing#get-a-b-test-results)

[For a specific test](https://developers.facebook.com/docs/video-api/ab-testing#for-a-specific-test)

[For All Tests on a Page](https://developers.facebook.com/docs/video-api/ab-testing#for-all-tests-on-a-page)

[Delete an A/B test](https://developers.facebook.com/docs/video-api/ab-testing#delete-an-a-b-test)

[References](https://developers.facebook.com/docs/video-api/ab-testing#references)

[More Resources](https://developers.facebook.com/docs/video-api/ab-testing#more-resources)