---
url: https://developers.facebook.com/docs/live-video-api/guides/speed-test
title: Speed Test - Live Video API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Flive-video-api%2Fguides%2Fspeed-test%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Live Video API](https://developers.facebook.com/docs/live-video-api)

- [Overview](https://developers.facebook.com/docs/live-video-api/overview)
- [Get Started](https://developers.facebook.com/docs/live-video-api/getting-started)
- [Broadcast a video](https://developers.facebook.com/docs/live-video-api/guides/streaming)
- [Schedule a video](https://developers.facebook.com/docs/live-video-api/guides/scheduling)
- [Create a Backup Stream](https://developers.facebook.com/docs/live-video-api/backup_stream)
- [Crosspost a video](https://developers.facebook.com/docs/live-video-api/guides/crossposting)
- [Target an Audience](https://developers.facebook.com/docs/live-video-api/audience-targeting)
- [Interact with viewers](https://developers.facebook.com/docs/live-video-api/interact-with-viewers)
- [Poll viewers](https://developers.facebook.com/docs/live-video-api/polls)
- [Speed Test](https://developers.facebook.com/docs/live-video-api/guides/speed-test)
- [Automatic Encoder Configuration API](https://developers.facebook.com/docs/live-video-api/guides/automatic-encoder-configuration-api)
- [Copyrighted Content](https://developers.facebook.com/docs/live-video-api/guides/copyrighted-content)
- [Best Practices](https://developers.facebook.com/docs/live-video-api/best-practices)
- [Support](https://developers.facebook.com/docs/live-video-api/support)
- [Reference](https://developers.facebook.com/docs/live-video-api/reference)
- [Changelog](https://developers.facebook.com/docs/live-video-api/changelog)

On This Page

[Speed Test](https://developers.facebook.com/docs/live-video-api/guides/speed-test#speed-test)

[Step 1: Start a New Test Session](https://developers.facebook.com/docs/live-video-api/guides/speed-test#start)

[Step 2: Test Each Destination URL](https://developers.facebook.com/docs/live-video-api/guides/speed-test#test)

[Step 3: Request Another Set Of Destination URLs](https://developers.facebook.com/docs/live-video-api/guides/speed-test#more-tests)

[Step 4: Get an Optimal Stream URL](https://developers.facebook.com/docs/live-video-api/guides/speed-test#target-token)

[Best Practices](https://developers.facebook.com/docs/live-video-api/guides/speed-test#best-practices)

# Speed Test

Facebook has live video ingestion servers throughout the world used to broadcast your live videos. Use speed testing to choose the best video ingestion server for your broadcast.

Performing a speed test involves sending a binary file to a set of destination URLs in order in which they have been received. Each test evaluates your connectivity to a specific Facebook video ingestion server. The server responds with details about the measured connection speed, the time it takes to send and receive, and other important factors. Including these results in each successive test allows Facebook to choose the next set of destination URLs until the best ingestion server is determined. The API then responds with a target token. Once you have a target token, include it whenever you create a live video broadcast and the API responds with a stream URL optimized for your connection.

You can also use the [Facebook Live Ingests Tool](https://www.facebook.com/live/ingests/) instead of the Speed Test API to determine the optimal ingestion servers for your live video broadcast.

## Step 1: Start a New Test Session

To start a new test session, send a request to:

```code
GET /traffic_speedtest?fields=target_token,next_tests,upload_bandwidth_estimate_bits_per_second
```

The endpoint responds with a JSON object containing a list of test cases. Each test case contains a destination URL and a byte count.

**Sample Request**

```code
curl -i -X GET "https://graph.facebook.com/v3.3/traffic_speedtest \
 ?fields=target_token,next_tests,upload_bandwidth_estimate_bits_per_second \
 &access_token={access-token}"
```

**Sample Response**

```json
{                        //Formatted for clarity
 "next_tests": [\
   {\
     "byte_count": 3145728,\
     "url": "https://edge-star-kut.xx.fbcdn.net/upload-speed-test-api"\
   },\
   {\
     "byte_count": 3145728,\
     "url": "https://edge-star-mad.xx.fbcdn.net/upload-speed-test-api"\
   },\
   {\
     "byte_count": 3145728,\
     "url": "https://edge-star-ort.xx.fbcdn.net/upload-speed-test-api"\
   },\
   {\
     "byte_count": 3145728,\
     "url": "https://edge-star-eze.xx.fbcdn.net/upload-speed-test-api"\
   }\
 ]
}
```

## Step 2: Test Each Destination URL

To test each case, upload a binary file of the size designated by the byte\_count to its corresponding destination URL.

```code
POST /{destination-url}/upload-speed-test
```

**Sample Request**

In this example, `{binary-file}` is a file of containing 3145728 random bytes which matches the byte count from the response.

```code
curl --data-binary @{binary-file} https://edge-star-kut.xx.fbcdn.net/upload-speed-test-api
```

**Sample Response**

An opaque string is returned.

```json
eyJzdGFydFRpbWVNUyI6IjE1NjIxMDk4NDg3ODAiLCJydHQiO...   //Truncated for brevity
```

Create an array named `previous_results` containing a JSON object comprised of the following properties and values:

```json
previous_results=[\
 {\
   "test_url": "{destination-url}",\
   "result_string": "{opaque-string}"\
 }\
]
```

**Note:** Treat `result_string` as an opaque string. Do not attempt to interpret the response from the test endpoint. If the encoder is unable to reach the destination URL, omit that single entry in the `previous_results` list.

| Parameter | Description |
| --- | --- |
| `{destination-url}` | The destination URL you tested. |
| `{opaque-string}` | The test result string returned by the URL. |

**Sample Array with Single Test Response**

```json
previous_results=[           // JSON formatted for clarity\
 {\
   "test_url": "https://edge-star-kut.xx.fbcdn.net/upload-speed-test-api",\
   "result_string": "eyJzdGFydFRpbWVNUyI6IjE1NjIxMDk4NDg3ODAiLCJydHQiO..."   //Truncated for brevity\
 }\
]
```

Append each destination URL and test response to the `previous_results` array.

**Caveats**

- Run each test in the order it was received. Running tests in parallel could reduce the accuracy of the results.
- Always use the number of bytes specified in each test case. Some test cases require different numbers of bytes. For example, an early test case may use a small upload to narrow the set of eligible locations while later test cases may use larger uploads to establish higher-confidence estimates.
- Always use random bytes to ensure the request cannot be compressed. Non-random bytes may be compressible, and compressed requests reduce the accuracy of speed testing.

## Step 3: Request Another Set Of Destination URLs

After testing the first set of URLs, request another set and include the previous results.

```code
GET /traffic_speedtest?fields=target_token,next_tests,upload_bandwidth_estimate_bits_per_second&previous_results={previous-results}
```

Replace `{previous-results}` with the array of test results which you have stored.

**Sample Request**

```code
curl -i -X GET 'https://graph.facebook.com/v3.3/traffic_speedtest \
 ?fields=target_token,next_tests,upload_bandwidth_estimate_bits_per_second \
 &access_token={access-token} \
 &previous_results=[   // JSON formatted for clarity\
   {\
     "test_url":"https://edge-star-kut.xx.fbcdn.net/upload-speed-test-api",\
     "result_string":\
       {\
          "eyJzdGFydFRpbWVNUyI6IjE1NjIxMDk4NDg3ODAiLCJydHQiO..."   //Truncated for brevity\
       }\
   },\
   {\
     "test_url":"https://edge-star-bru.xx.fbcdn.net/upload-speed-test-api",\
     "result_string":\
       {\
          "eyJzdGFydFRpbWVNUyI6IjE1NjIxMDk4NDg3ODAiLCJydHQiO..."   //Truncated for brevity\
       }\
   },\
   ...  //Truncated for brevity\
 ]'
```

The endpoint returns either a new list of test cases or a target token. If it replies with more cases, test each one, then request another set. Keep doing this until it replies with a token. If it replies with a token, this indicates the test session is complete.

**Sample Response with Token**

```json
{
 "target_token": "atl",   //Testing is complete
 "upload_bandwidth_estimate_bits_per_second": 173557406  //Suggested bps
}
```

| Property | Description |
| --- | --- |
| `target_token` | A string to include when using the Live Video APIs. When a target token is included, the Live Video API will return stream URLs that are optimized for your connection. |
| `upload_bandwidth_estimate_bits_per_second` | The estimated upstream bandwidth from the device to Facebook. You can use this to configure the maximum bitrate for your video encoder.<br>For example, if this value is 10000000, you can configure the encoder to output an 8Mbps video stream. |

**Note:** The upload bandwidth is an estimate and may change dramatically as network conditions change. For example, if the stream is sent to a different location to manage capacity or to avoid shared points of failure between input streams upload bandwidth may change.

## Step 4: Get an Optimal Stream URL

Create a live video broadcast as you normally would, then query the live video ID and include your target token:

```code
GET /{broadcast-id}?fields=secure_stream_url&target_token={target-token}
```

The endpoint responds with a secure stream URL optimized for your connection.

**Sample Request**

In this example, the target\_token that the speed test returned is atl.

```code
curl -i -X GET \
"https://graph.facebook.com/v3.3/{broadcast-id} \
  ?fields=secure_stream_url&target_token=atl \
  &access_token={access-token}"
```

**Sample Response**

```json
{
 “secure_stream_url”: “rtmps://...”,  //Optimized stream URL
 “id”: “{broadcast-id}”
}
```

## Best Practices

Run each speed test case in the order they are received, sequentially, not in parallel. Running multiple speed test cases at the same time will give you inaccurate results.

When using target tokens to get stream URLs, start a new speed test session for each live video broadcast. Do not reuse old test results. Test URLs, test URL responses, and target tokens may change.

We recommend rerunning a speed test when any of the following conditions occur:

- Your network connectivity changes. For example, moving from wifi to a wired connection.
- Your app has been idle for some time.
- Your app detects that network conditions have changed. For example, send buffers are filling, or you are unable to stream at the estimated bandwidth.
- Your connection quality changes. For example, a link between two ISPs becomes congested.

When a new target token is returned, stop using the current stream URL, and start using the new stream URL returned by the new token.

If the network conditions are too poor to provide a reliable stream, your app should warn the video publisher they can improve their network connectivity. For example, make sure no other app is using bandwidth, switch from a wireless connection to a wired connection, increase your Internet bandwidth, or ask your Internet provider to [connect directly to Facebook](https://www.facebook.com/peering).

On This Page

[Speed Test](https://developers.facebook.com/docs/live-video-api/guides/speed-test#speed-test)

[Step 1: Start a New Test Session](https://developers.facebook.com/docs/live-video-api/guides/speed-test#start)

[Step 2: Test Each Destination URL](https://developers.facebook.com/docs/live-video-api/guides/speed-test#test)

[Step 3: Request Another Set Of Destination URLs](https://developers.facebook.com/docs/live-video-api/guides/speed-test#more-tests)

[Step 4: Get an Optimal Stream URL](https://developers.facebook.com/docs/live-video-api/guides/speed-test#target-token)

[Best Practices](https://developers.facebook.com/docs/live-video-api/guides/speed-test#best-practices)