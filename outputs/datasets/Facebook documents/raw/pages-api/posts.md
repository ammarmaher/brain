---
url: https://developers.facebook.com/docs/pages-api/posts
title: Posts - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2Fposts%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Posts](https://developers.facebook.com/docs/pages-api/posts/#posts)

[Before you start](https://developers.facebook.com/docs/pages-api/posts/#before-you-start)

[Best practices](https://developers.facebook.com/docs/pages-api/posts/#best-practices)

[Publish posts](https://developers.facebook.com/docs/pages-api/posts/#publish-posts)

[Add audience targeting](https://developers.facebook.com/docs/pages-api/posts/#add-audience-targeting)

[Publish Media Posts](https://developers.facebook.com/docs/pages-api/posts/#publish-media-posts)

[Publish a photo](https://developers.facebook.com/docs/pages-api/posts/#publish-a-photo)

[Publish a video](https://developers.facebook.com/docs/pages-api/posts/#publish-a-video)

[Get Posts](https://developers.facebook.com/docs/pages-api/posts/#posts-2)

[Update a Post](https://developers.facebook.com/docs/pages-api/posts/#update-a-post)

[Delete a Post](https://developers.facebook.com/docs/pages-api/posts/#delete-a-post)

[Next Steps](https://developers.facebook.com/docs/pages-api/posts/#next-steps)

[See Also](https://developers.facebook.com/docs/pages-api/posts/#see-also)

# Posts

This guide explains how to create, publish, and update a post, and reply to a post on your Facebook Page as the Page, and delete a post using the Pages API from Meta.

## Before you start

This guide assumes you have read the [Overview](https://developers.facebook.com/docs/pages/overview)

For a person who can perform tasks on the page, you will need to implement Facebook Login to ask for the following permissions and receive a Page access token:

- `pages_manage_engagement`
- `pages_manage_posts`
- `pages_read_engagement`
- `pages_read_user_engagement`
- `publish_video` permission, if you are publishing a video to the Page

Your app user must be able to perform the `CREATE_CONTENT`, `MANAGE`, and `MODERATE` tasks on the Page in the API requests.

If your app users do not own or manage the Page in the API requests, your app will need a User access token and the following features:

- Page Public Content Access

### Best practices

When testing an API call, you can include the `access_token` parameter set to your access token. However, when making secure calls from your app, use the [access token class.](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)

## Publish posts

To publish a post to a Page, send a `POST` request to the `/page_id/feed` endpoint, where `page_id` is the ID for your Page, with the following parameters:

- `message` set to the text for your post
- `link` set to your URL if you want to post a link
- `published` set to `true` to publish the post immediately (default) or `false` to publish later


  - Include `scheduled_publish_time` if set to `false` with the date in one of the following formats:


    - An integer UNIX timestamp \[in seconds\] (e.g. `1530432000`)
    - An [ISO 8061](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FISO_8601&h=AUDpXR-embjUxaZOwpygT_MFG6DFFMe7ZditWtbc6oTTdtFbgroXWC7DUH5qffnDgvYTuADBNap3rKpbmx2qiWQUVgxNIeRfGbDyY-KQFhvxSn5AiJDhJBIyt_0B5K2aAhNV60swVzXqHQ) timestamp string (e.g. `2018-09-01T10:15:30+01:00`)
    - Any string otherwise parsable by PHP's [`strtotime()`](https://l.facebook.com/l.php?u=http%3A%2F%2Fphp.net%2Fmanual%2Fen%2Ffunction.strtotime.php&h=AUAlzOrRSnIwYWqoym2tUzppa-3LPg6ylHgM3qKZjgX9-54WUm0PvZmydH142EmkVCJtNSwx239mMrmi8Se17_43wQMWt-aG60XHk4kcGg8uPCJgw3W2cNsn7g--MhTCxcjYqLUet9-zkQ) (e.g. `+2 weeks`, `tomorrow`)

#### Notes about scheduled posts

- The publish date must be between 10 minutes and 30 days from the time of the API request.
- If you are relying on `strtotime()`'s relative date strings you can [read-after-write](https://developers.facebook.com/docs/graph-api/advanced#read-after-write) the `scheduled_publish_time` of the created post to make sure it is what is expected.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_id**, with your values._

```curl
curl -X POST "https://graph.facebook.com/v25.0/page_id/feed" \
     -H "Content-Type: application/json" \
     -d '{
           "message":"your_message_text",
           "link":"your_url",
           "published":"false",
           "scheduled_publish_time":"unix_time_stamp_of_a_future_date",
         }'
```

On success, your app receives the following JSON response with the ID for the post:

```json
{
  "id": "page_post_id"
}
```

### Add audience targeting

To limit who can see a Page post, you can add the `targeting.geo_locations` object or `feed_targeting.geo_locations` parameter in your `POST` request.

```curl
-d '{
      ...
      "targeting": {
        "geo_locations": {
          "countries": [\
            "CA"\
          ],
          "cities": [\
            {\
              "key": "296875",\
              "name": "Toronto"\
            }\
          ]
        }
      },
      ...
    }'
```

#### Troubleshooting

In some cases using both a country and a region within that country will result in an error: "Some of your locations overlap. Try removing a location." In these cases target the region or the country depending on the coverage you want.

## Publish Media Posts

You can publish photos and videos to a Page.

### Publish a photo

To publish a photo to a Page, send a `POST` request to the `/page_id/photos` endpoint, where `page_id` is the ID for your Page, with the `url` parameter set to the photo for your post.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_id**, with your values._

```curl
curl -X POST "https://graph.facebook.com/v25.0/page_id/photos" \
     -H "Content-Type: application/json" \
     -d '{
           "url":"path_to_photo",
```

On success, your app receives the following JSON response with the ID for the photo and the ID for the post:

```json
{
  "id":"photo_id",
  "post_id":"page_post_id"
}
```

### Publish a video

Please visit the [**Video API documentation** to publish a video post to your Page](https://developers.facebook.com/docs/video-api/guides/publishing).

## Get Posts

To get a list of Page posts, send a `GET` request to the `/page_id/feed` endpoint.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_id**, with your values._

```curl
curl -i -X GET "https://graph.facebook.com/v25.0/page_id/feed"
```

On success, your app receives the following JSON response with an array of objects that include the post ID, the time the post was created, and the content for the post, for each post on your Page:

```json
{
  "data": [\
    {\
      "created_time": "2019-01-02T18:31:28+0000",\
      "message": "This is my test post on my Page.",\
      "id": "page_post_id"\
    }\
  ],
...
}
```

#### Limitations

- **Live Videos** \- If a Page post contains a video that has expired, such as a live broadcast, you can get some post fields but not fields related to the video. The video has its own privacy rules. If the video has expired, you must be the page admin to view its information.

- **Message CTA** \- Any access token can be used to request publicly shared Page posts as long as your app has been approved for the [Page Public Content Access Feature](https://developers.facebook.com/docs/apps/review/feature/#reference-PAGES_ACCESS). However, posts with message CTAs cannot be accessed using another Page's access token since pages cannot message other pages.


### Page Post URLs

The URL, or permalink, for a Page post is `https://www.facebook.com/` **_`page_post_id`_**.

## Update a Post

To update a Page post, send a `POST` request to the `/page_post_id` endpoint with the parameters you want to update set to the new content.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_post\_id**, with your values._

```curl
curl -X POST "https://graph.facebook.com/v25.0/page_post_id" \
     -H "Content-Type: application/json" \
     -d '{
           "message":"I am updating my Page post",
         }'
```

On success, your app receives the following JSON response with `success` set to true:

```json
{
  "success": true
}
```

#### Limitations

An app can only update a Page post if the post was made using that app.

## Delete a Post

To delete a Page post, send a `DELETE` request to the `/page_post_id` endpoint where `page_post_id` is the ID for post you want to delete.

#### Example Request

_Formatted for readability. Replace **bold, italics values**, such as **page\_post\_id**, with your values._

```code
curl -i -X DELETE "https://graph.facebook.com/v25.0/page_post_id"
```

On success, your app receives the following JSON response with `success` set to `true`:

```json
{
  "success": true
}
```

## Next Steps

Learn how to [comment on Page posts and @mention](https://developers.facebook.com/docs/pages/comments) a specific person or Page who posted or commented on your Page.

## See Also

#### Video API guides

- [Video Uploads Guide \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/video-api/guides/publishing)

- [Video API Guide \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/graph-api/video)


#### References

- [Page Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/graph-api/reference/page)

- [Page Feed Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/graph-api/reference/page/feed)

- [Page Post Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/graph-api/reference/page-post)

- [Permissions Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/permissions)

- [Photo Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/graph-api/reference/photo)

- [Page Tasks \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/pages/overview#tasks)

- [Video Reference \\
![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwFh4Osw&_nc_oc=AdpGcOBAvNYPcihK5CS8UQ_n4Era50SRvqxJIeT8cmJb0tYuavFaSxQTuLNfi_cndqs&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=bfIOa35uxv-BQM7AoVqktQ&_nc_ss=7b289&oh=00_Af5xfwWspQkJoIpAsuTOoUrGrDY4zuxxoX7PQ8KGYe57Uw&oe=6A252262)](https://developers.facebook.com/docs/graph-api/reference/video)


On This Page

[Posts](https://developers.facebook.com/docs/pages-api/posts/#posts)

[Before you start](https://developers.facebook.com/docs/pages-api/posts/#before-you-start)

[Best practices](https://developers.facebook.com/docs/pages-api/posts/#best-practices)

[Publish posts](https://developers.facebook.com/docs/pages-api/posts/#publish-posts)

[Add audience targeting](https://developers.facebook.com/docs/pages-api/posts/#add-audience-targeting)

[Publish Media Posts](https://developers.facebook.com/docs/pages-api/posts/#publish-media-posts)

[Publish a photo](https://developers.facebook.com/docs/pages-api/posts/#publish-a-photo)

[Publish a video](https://developers.facebook.com/docs/pages-api/posts/#publish-a-video)

[Get Posts](https://developers.facebook.com/docs/pages-api/posts/#posts-2)

[Update a Post](https://developers.facebook.com/docs/pages-api/posts/#update-a-post)

[Delete a Post](https://developers.facebook.com/docs/pages-api/posts/#delete-a-post)

[Next Steps](https://developers.facebook.com/docs/pages-api/posts/#next-steps)

[See Also](https://developers.facebook.com/docs/pages-api/posts/#see-also)