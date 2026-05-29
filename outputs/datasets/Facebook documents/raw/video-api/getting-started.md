---
url: https://developers.facebook.com/docs/video-api/getting-started
title: Get Started - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fvideo-api%2Fgetting-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Get Started](https://developers.facebook.com/docs/video-api/getting-started#get-started)

[Before You Start](https://developers.facebook.com/docs/video-api/getting-started#before-you-start)

[Step 1: Get an access token](https://developers.facebook.com/docs/video-api/getting-started#step-1--get-an-access-token)

[Step 2: Get your Page ID and token](https://developers.facebook.com/docs/video-api/getting-started#step-2--get-your-page-id-and-token)

[Step 3. Publish the video to your Page](https://developers.facebook.com/docs/video-api/getting-started#step-3--publish-the-video-to-your-page)

# Get Started

The Get Started with the Facebook Video API from Meta guide shows you how to obtain a permissions, a Page access token, and a Page ID using the Graph API Explorer.

## Before You Start

You will need:

- [A Meta app](https://developers.facebook.com/docs/development/create-an-app)

- [A Facebook Page](https://developers.facebook.com/docs/pages-api/overview#tasks) that you are able to perform the `CREATE_CONTENT` task



- [The Graph API Explorer tool](https://developers.facebook.com/docs/graph-api/guides/explorer) to run API requests


- A Video handle ID for the video that you have uploaded to Meta servers using the
[Resumble Upload API.](https://developers.facebook.com/docs/graph-api/guides/upload)






The `graph-video.facebook.com` host for video uploads has been deprecated. Use the `graph.facebook.com` host for API requests when uploading videos to Meta servers.


## Step 1: Get an access token

In this section you will beusing the Graph API Explorer to get an access token for your Page with the necessary permissions

1. Load the [**Graph API Explorer**![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwHfDYXI&_nc_oc=Adq9y5tMv40o5-rg3Oe8pqTqm-LlmRgTg9Z83DKaiTm90UOndLIyLjd17lxNpUzIQzI&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=BkuT8aCdlxHOitG3AEKoaQ&_nc_ss=7b289&oh=00_Af6NiSSzaqro4YU8HWx4C_UIWqra14b5O9EjSycKfsiDtg&oe=6A2592E2) in a new window.](https://developers.facebook.com/tools/explorer/)
2. Select your app from the **Meta App** dropdown menu.
3. In the **User or Page** drop-down menu, select **User Token**.
4. In the **Permissions** section, use the **Add a permission** search field to search for and select the following permissions:

   - `pages_manage_engagement`

   - `pages_read_user_content`

   - `pages_show_list`
5. Click **Generate Access Token**.
6. In the pop-up window that appears, select the Page where you want to publish your video and complete the pop-up window flow.

You now have a User access token that you can use to make API requests. You can copy and paste this token to test your app and click the **i** icon to view details about this token including permissions and expiry.

## Step 2: Get your Page ID and token

1. In the Graph API Explorer, update the query string field a request to the `GET /me/accounts` endpoint. **`me`** represents the ID for the User or Page that requested the access token, in this query the ID is your User ID.

2. Click **Submit** in the upper right. A list of Page objects will be returned, including the name, Page ID, and Page access token, for Facebook pages on which you can perform a task.

3. Copy the ID for your Page and Page access token.

```json
{
  "data": [\
    {\
      "access_token": "EBACf...",  //Copy your Page Access Token\
      "category": "Media",\
      "category_list": [\
        {\
          "id": "163003840417682",\
          "name": "Media"\
        }\
      ],\
      "name": "Metricsaurus",\
      "id": "1755847768034402",  //Copy your Page ID\
      "tasks": [\
        "ANALYZE",\
        "ADVERTISE",\
        "MODERATE",\
        "CREATE_CONTENT",\
        "MANAGE"\
      ]\
    }\
  ],
  "paging": {
    "cursors": {
      "before": "MTc1NTg0Nzc2ODAzNDQwMgZDZD",
      "after": "MTc1NTg0Nzc2ODAzNDQwMgZDZD"
    }
  }
}
```

## Step 3. Publish the video to your Page

1. In the explorer, replace **`me`** with your Page ID.
2. Replace the access token with your Page access token.

On This Page

[Get Started](https://developers.facebook.com/docs/video-api/getting-started#get-started)

[Before You Start](https://developers.facebook.com/docs/video-api/getting-started#before-you-start)

[Step 1: Get an access token](https://developers.facebook.com/docs/video-api/getting-started#step-1--get-an-access-token)

[Step 2: Get your Page ID and token](https://developers.facebook.com/docs/video-api/getting-started#step-2--get-your-page-id-and-token)

[Step 3. Publish the video to your Page](https://developers.facebook.com/docs/video-api/getting-started#step-3--publish-the-video-to-your-page)