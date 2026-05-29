---
url: https://developers.facebook.com/docs/graph-api/guides/upload
title: Upload a File or Video - Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fguides%2Fupload%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Upload a file](https://developers.facebook.com/docs/graph-api/guides/upload#upload-a-file)

[Step 1: Start an upload session](https://developers.facebook.com/docs/graph-api/guides/upload#step-1)

[Step 2: Start the upload](https://developers.facebook.com/docs/graph-api/guides/upload#step-2)

[Resume an interrupted upload](https://developers.facebook.com/docs/graph-api/guides/upload#resume-an-interrupted-upload)

[Next Steps](https://developers.facebook.com/docs/graph-api/guides/upload#next-steps)

# Upload a file

The Resumable Upload API allows you to upload large files to Meta's social graph and resume interrupted upload sessions without having to start over. Once you have uploaded your file, you can publish it.

References for endpoints that support uploaded file handles will indicate if the endpoints support handles returned by the Resumable Upload API.

### Before you start

This guide assumes you have read the [Graph API Overview](https://developers.facebook.com/docs/graph-api/overview) and the [Meta Development](https://developers.facebook.com/docs/development) guides and performed the necessary actions needed to develop with Meta.

You will need:

- A Meta app ID
- A file in one of the following formats:

  - `pdf`
  - `jpeg`
  - `jpg`
  - `png`
  - `mp4`
- A User access token

## Step 1: Start an upload session

To start an upload session send a `POST` request to the `/<APP_ID>/uploads` endpoint, where `<APP_ID>` is your app's Meta ID, with the following required parameters:

- `file_name` \- the name of your file
- `file_length` \- file size in bytes
- `file_type` \- The file's MIME type. Valid values are: `application/pdf`, `image/jpeg`, `image/jpg`, `image/png`, and `video/mp4`

#### Request Syntax

_Formatted for readability._

```http
curl -i -X POST "https://graph.facebook.com/v25.0/<APP_ID>/uploads
  ?file_name=<FILE_NAME>
  &file_length=<FILE_LENGTH>
  &file_type=<FILE_TYPE>
  &access_token=<USER_ACCESS_TOKEN>"
```

Upon success, your app will receive a JSON response with the upload session ID.

```json
{
  "id": "upload:<UPLOAD_SESSION_ID>"
}
```

## Step 2: Start the upload

Start uploading the file by sending a `POST` request to the `/upload:<UPLOAD_SESSION_ID>` endpoint with the following `file_offset` set to `0`.

#### Request Syntax

```html
curl -i -X POST "https://graph.facebook.com/v25.0/upload:<UPLOAD_SESSION_ID>"
  --header "Authorization: OAuth <USER_ACCESS_TOKEN>"
  --header "file_offset: 0"
  --data-binary @<FILE_NAME>
```

You must include the access token in the header or the call will fail.

On success, your app receives the file handle which you will use in your API calls to publish the file to your endpoint.

```json
{
  "h": "<UPLOADED_FILE_HANDLE>"
}
```

#### Sample Response

```json
{
    "h": "2:c2FtcGxl..."
}
```

### Resume an interrupted upload

If you have initiated an upload session but it is taking longer than expected or has been interrupted, send a `GET` request to the `/upload:<UPLOAD_SESSION_ID>` endpoint from [Step 1](https://developers.facebook.com/docs/graph-api/guides/upload#step-1).

```html
curl -i -X GET "https://graph.facebook.com/v25.0/upload:<UPLOAD_SESSION_ID>"
  --header "Authorization: OAuth <USER_ACCESS_TOKEN>"
```

Upon success, your app will receive a JSON response with the `file_offset` value that you can use to resume the upload process from the point of interruption.

```json
{
  "id": "upload:<UPLOAD_SESSION_ID>"
  "file_offset": "<FILE_OFFSET>"
}
```

Send another `POST` request, like the you sent in [Step 2](https://developers.facebook.com/docs/graph-api/guides/upload#step-2), with `file_offset` set to this `file_offset` value you just received. This will resume the upload process from the point of interruption.

```html
curl -i -X POST "https://graph.facebook.com/v25.0/upload:<UPLOAD_SESSION_ID>"
  --header "Authorization: OAuth <USER_ACCESS_TOKEN>"
  --header "file_offset: <FILE_OFFSET>"
  --data-binary @<FILE_NAME>
```

## Next Steps

- Visit the [Video API documentation](https://developers.facebook.com/docs/video-api/guides/publishing) to publish a video to a Facebook Page.

On This Page

[Upload a file](https://developers.facebook.com/docs/graph-api/guides/upload#upload-a-file)

[Step 1: Start an upload session](https://developers.facebook.com/docs/graph-api/guides/upload#step-1)

[Step 2: Start the upload](https://developers.facebook.com/docs/graph-api/guides/upload#step-2)

[Resume an interrupted upload](https://developers.facebook.com/docs/graph-api/guides/upload#resume-an-interrupted-upload)

[Next Steps](https://developers.facebook.com/docs/graph-api/guides/upload#next-steps)