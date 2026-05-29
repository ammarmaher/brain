---
url: https://developers.facebook.com/docs/pages-api/getting-started/
title: Get Started - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2Fgetting-started%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Facebook Pages API](https://developers.facebook.com/docs/pages-api)

- [Overview](https://developers.facebook.com/docs/pages-api/overview)
- [Create an app](https://developers.facebook.com/docs/pages-api/create-an-app)
- [Webhooks](https://developers.facebook.com/docs/pages-api/webhooks-for-pages)
- [Get Started](https://developers.facebook.com/docs/pages-api/getting-started)
- [Manage a Page](https://developers.facebook.com/docs/pages-api/manage-pages)
- [Upcoming Changes](https://developers.facebook.com/docs/pages/upcoming-changes)
- [Comments and @Mentions](https://developers.facebook.com/docs/pages-api/comments-mentions)
- [Posts](https://developers.facebook.com/docs/pages-api/posts)
- [Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook)
- [Insights](https://developers.facebook.com/docs/platforminsights/page)
- [Search Pages](https://developers.facebook.com/docs/pages-api/search-pages)
- [Error Codes](https://developers.facebook.com/docs/pages-api/error-codes)
- [Changelog](https://developers.facebook.com/docs/pages-api/changelog)

On This Page

[Get Started](https://developers.facebook.com/docs/pages-api/getting-started/#get-started)

[Before You Start](https://developers.facebook.com/docs/pages-api/getting-started/#before-you-start)

[Best Practices](https://developers.facebook.com/docs/pages-api/getting-started/#best-practices)

[Step 1. Get Your Page ID](https://developers.facebook.com/docs/pages-api/getting-started/#step-1--get-your-page-id)

[Step 2. Publish a post](https://developers.facebook.com/docs/pages-api/getting-started/#post)

[Step 3. Verify Your Post](https://developers.facebook.com/docs/pages-api/getting-started/#step-3--verify-your-post)

[Use the Graph Explorer](https://developers.facebook.com/docs/pages-api/getting-started/#use-the-graph-explorer)

[Step 1. Get Your Page ID](https://developers.facebook.com/docs/pages-api/getting-started/#step-1--get-your-page-id-2)

[Step 2. Post as a Page](https://developers.facebook.com/docs/pages-api/getting-started/#step-2--post-as-a-page)

[Step 3. Verify Your Post](https://developers.facebook.com/docs/pages-api/getting-started/#step-3--verify-your-post-2)

[Next steps](https://developers.facebook.com/docs/pages-api/getting-started/#next-steps)

[See Also](https://developers.facebook.com/docs/pages-api/getting-started/#see-also)

# Get Started

This document explains how to successfully call the Pages API to post to your Page.

## Before You Start

You will need the following:

- A Facebook Page, this can be an unpublished or published Page on which you can perform the `CREATE_CONTENT` task.
- A Page access token for the Page
- The following permissions:

  - `pages_manage_metadata`
  - `pages_manage_posts`
  - `pages_manage_read_engagement`
  - `pages_show_list`

### Best Practices

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

## Step 1. Get Your Page ID

To get a list of IDs and Page access tokens for Facebook Pages on which you can perform a task, send a `GET` request to `/user_id/accounts` endpoint where `user_id` is your user ID.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_id**, with your values._

```curl
curl -i -X GET "https://graph.facebook.com/v25.0/user_id/accounts?access_token=user_access_token"
```

On success, your app receives the following JSON response that includes an array of objects. Each object contains information about a specific Page including the name, ID, a short-lived Page access token, tasks you can perform on the Page, and more:

```json
{
  "data": [\
    {\
      "access_token": "page_access_token",\
      "category": "Internet Company",\
      "category_list": [\
        {\
          "id": "2256",\
          "name": "Internet Company"\
        }\
      ],\
      "name": "Name of this Page",\
      "id": "page_id",\
      "tasks": [\
        "ANALYZE",\
        "ADVERTISE",\
        "MODERATE",\
        "CREATE_CONTENT"\
      ]\
    },\
...\
```\
\
## Step 2. Publish a post\
\
To publish a post, send a `POST` request to the `/page_id/feed` endpoint, where `page_id` is the ID for the Page you are publishing to, with the `message` parameter set to your message content and the `access_token` parameter set to the Page access token:\
\
#### Example Request\
\
_Formatted for readability. Replace **bold, italics values**, such as **page\_id**, with your values._\
\
```curl\
curl -X POST "https://graph.facebook.com/v25.0/page_id/feed" \\
     -H "Content-Type: application/json" \\
     -d '{\
           "message":"your_message_text",\
           "access_token":"page_access_token",\
         }'\
```\
\
Your post will be published immediately.\
\
On success, your app receives the following JSON response with the ID for the post:\
\
```json\
{\
  "id": "page_post_id"\
}\
```\
\
Visit your\
[Facebook Page \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://www.facebook.com/)\
to view the post.\
\
\
## Step 3. Verify Your Post\
\
To verify that the post was published to your Page, send a `GET` request to the `/page_id/feed` endpoint:\
\
#### Example Request\
\
_Formatted for readability. Replace **bold, italics values**, such as **page\_id**, with your values._\
\
```code\
      curl -i -X GET "https://graph.facebook.com/v25.0/page_id/feed?access_token=page_access_token"\
```\
\
On success, your app will receive the following JSON response with an array of objects. Each object includes the post ID, the message content, and the time the post was created:\
\
```code\
{\
  "data": [\
    {\
      "created_time": "2020-03-25T17:33:34+0000",\
      "message": "Hello World!",\
      "id": "422575694827569_917077345377399"\
    },\
...\
  ]\
}\
```\
\
## Use the Graph Explorer\
\
The [Graph Explorer tool](https://developers.facebook.com/tools/explorer) is a UI that allows you to experiment with Facebook APIs without adding code to your app or website. You can select permissions, get access tokens, test `GET`, `POST`, and `DELETE` methods, and get code snippets of these queries for Android, iOS, JavaScript, PHP, and cURL.\
\
Note, you will need a [Facebook App ID](https://developers.facebook.com/docs/apps#register) to use the Graph Explorer.\
\
### Step 1. Get Your Page ID\
\
Select the the `pages_manage_metadata`, `pages_manage_posts`, `pages_manage_read_engagement`, and `pages_show_list` permissions, which ever appear within the Permission dropdown menu, set the `GET` request to the `/me/accounts` endpoint in the query box, and click **Submit**.\
\
![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/90753453_681635615710365_5353285943979671552_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=nPHcbN4b9QQQ7kNvwFEXmm5&_nc_oc=AdpDJE9AONCZSJvIk2kkeeQ1qAVmmgsYeF4wrz6tugUi_RiA8ToDKFFqaRcyRd_34EE&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af6YlT8x2S6LP_SP3ZlHOU2dgbDD1zEUZarosZJ0etAcZg&oe=6A2460AF)\
\
Click on the ID of your Page, displayed directly beneath the name of your Page, to move the ID to the query box.\
\
### Step 2. Post as a Page\
\
Under the **User or Page** drop down menu, select the Page access token for your Page. Next, set the method to `POST` with a request to the `/{page-id}/feed` endpoint, then set the **Params**`key` to `message` and the `value` to your post text. Click **Submit**.\
\
On success, the Graph Explorer will show the ID of the Page post.\
\
![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/90633006_2691623697632705_6919549723854503936_n.png?_nc_cat=108&ccb=1-7&_nc_sid=e280be&_nc_ohc=8vkmXLnt4-wQ7kNvwHNSL2H&_nc_oc=Adq7qtJIFMv787cfyQ866hbgN6EU-2feDT-QG2ThoupEJQuMePGb9SdUi36x73tHJyw&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af4HGs3rejBYHPja1pzZbaBOJOF4bNVwX87VWcVwH0yz5Q&oe=6A246353)\
\
Visit your [Facebook Page](https://www.facebook.com/) to view the post.\
\
### Step 3. Verify Your Post\
\
Send a `GET` request to the `/page-id/feed` endpoint.\
\
On success, the Graph Explorer will display the time the post was created, the text of the post, and the ID of the Page post.\
\
![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/91310472_212075259856088_1405481786523254784_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=vUT258czCG4Q7kNvwFDQ_qt&_nc_oc=AdqE_w-0DqvibPrVCbtU4ImlbE-U-yJImgZatrARz0mlAaS2mOdcu4LbYExlaVK-zNM&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af6JIxTd3eCT-0OwzjIH5H34QHdnwc8KBAhALaaWlUVV6g&oe=6A244CE2)\
\
## Next steps\
\
Learn how to get and update information about your Facebook Page include Page details, access tokens, blocked users, and user recommendations, using the [Manage a Facebook Page guide](https://developers.facebook.com/docs/pages-api/manage-pages).\
\
Learn how to [publish links, photos, and videos to your Page](https://developers.facebook.com/docs/pages-api/posts).\
\
## See Also\
\
|     |     |\
| --- | --- |\
| #### Graph API guides<br>- [Access Tokens \<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/facebook-login/guides/access-tokens)<br>  <br>- [Graph API User Guide \<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/graph-api/using-graph-api)<br>  <br>- [Graph Explorer User Guide \<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/graph-api/explorer)<br>  <br>- [Pages API Overview – Tasks\<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/pages/overview#tasks) | #### References<br>- [Page Reference \<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/graph-api/reference/page)<br>  <br>- [Page Feed Reference \<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/graph-api/reference/page/feed)<br>  <br>- [Page Post Reference \<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/graph-api/reference/page-post)<br>  <br>- [Permissions Reference \<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/permissions)<br>  <br>- [User Accounts Reference \<br>   ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwEHKPRe&_nc_oc=AdpOWbmzerqQinkypoiGBVgeVxfbFibETQdtiJsPal75iBvUX6J1g-WJFssj8Ggoqho&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=e-uP5IJMjtW0X2SEs6Zlug&_nc_ss=7b289&oh=00_Af5twI-nRPcXV1B9IIJNpgNXPPY08sDyfbWJXbSHVLHIMA&oe=6A2479A2)](https://developers.facebook.com/docs/graph-api/reference/user/accounts) |\
\
On This Page\
\
[Get Started](https://developers.facebook.com/docs/pages-api/getting-started/#get-started)\
\
[Before You Start](https://developers.facebook.com/docs/pages-api/getting-started/#before-you-start)\
\
[Best Practices](https://developers.facebook.com/docs/pages-api/getting-started/#best-practices)\
\
[Step 1. Get Your Page ID](https://developers.facebook.com/docs/pages-api/getting-started/#step-1--get-your-page-id)\
\
[Step 2. Publish a post](https://developers.facebook.com/docs/pages-api/getting-started/#post)\
\
[Step 3. Verify Your Post](https://developers.facebook.com/docs/pages-api/getting-started/#step-3--verify-your-post)\
\
[Use the Graph Explorer](https://developers.facebook.com/docs/pages-api/getting-started/#use-the-graph-explorer)\
\
[Step 1. Get Your Page ID](https://developers.facebook.com/docs/pages-api/getting-started/#step-1--get-your-page-id-2)\
\
[Step 2. Post as a Page](https://developers.facebook.com/docs/pages-api/getting-started/#step-2--post-as-a-page)\
\
[Step 3. Verify Your Post](https://developers.facebook.com/docs/pages-api/getting-started/#step-3--verify-your-post-2)\
\
[Next steps](https://developers.facebook.com/docs/pages-api/getting-started/#next-steps)\
\
[See Also](https://developers.facebook.com/docs/pages-api/getting-started/#see-also)