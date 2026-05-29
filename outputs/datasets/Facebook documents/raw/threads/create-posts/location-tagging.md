---
url: https://developers.facebook.com/docs/threads/create-posts/location-tagging
title: Location Tagging - Threads API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreads%2Fcreate-posts%2Flocation-tagging%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Threads API](https://developers.facebook.com/docs/threads)

- [Overview](https://developers.facebook.com/docs/threads/overview)
- [Get Started](https://developers.facebook.com/docs/threads/get-started)
- [Create Posts](https://developers.facebook.com/docs/threads/create-posts)


  - [Posts](https://developers.facebook.com/docs/threads/posts)
  - [Create Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies/create-replies)
  - [Reposts](https://developers.facebook.com/docs/threads/posts/reposts)
  - [Quote Posts](https://developers.facebook.com/docs/threads/posts/quote-posts)
  - [Ghost Posts](https://developers.facebook.com/docs/threads/create-posts/ghost-posts)
  - [Polls](https://developers.facebook.com/docs/threads/create-posts/polls)
  - [Spoilers](https://developers.facebook.com/docs/threads/create-posts/spoilers)
  - [Text Attachments](https://developers.facebook.com/docs/threads/create-posts/text-attachments)
  - [Share to Instagram Stories](https://developers.facebook.com/docs/threads/create-posts/share-to-ig-stories)
  - [Location Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging)
  - [Geo-Gated Content](https://developers.facebook.com/docs/threads/posts/geo-gating)
  - [Accessibility](https://developers.facebook.com/docs/threads/posts/accessibility)

- [Retrieve and Discover Posts](https://developers.facebook.com/docs/threads/retrieve-and-discover-posts)
- [Retrieve and Manage Replies](https://developers.facebook.com/docs/threads/retrieve-and-manage-replies)
- [Delete Posts](https://developers.facebook.com/docs/threads/posts/delete-posts)
- [Profiles](https://developers.facebook.com/docs/threads/threads-profiles)
- [Insights](https://developers.facebook.com/docs/threads/insights)
- [Webhooks](https://developers.facebook.com/docs/threads/webhooks)
- [oEmbed](https://developers.facebook.com/docs/threads/tools-and-resources/embed-a-threads-post)
- [Web Intents](https://developers.facebook.com/docs/threads/threads-web-intents)
- [Troubleshooting](https://developers.facebook.com/docs/threads/troubleshooting)
- [Reference](https://developers.facebook.com/docs/threads/reference)
- [Tools and Resources](https://developers.facebook.com/docs/threads/tools-and-resources)
- [Changelog](https://developers.facebook.com/docs/threads/changelog)

On This Page

[Location Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging#location-tagging)

[Search](https://developers.facebook.com/docs/threads/create-posts/location-tagging#search)

[Example request with query](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request-with-query)

[Example request with latitude and longitude](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request-with----latitude-and-longitude)

[Example response](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-response)

[Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging#tagging)

[Example request](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request)

[Example response](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-response-2)

[Media Retrieval](https://developers.facebook.com/docs/threads/create-posts/location-tagging#media-retrieval)

[Example request](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request-2)

[Example response](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-response-3)

[Location Retrieval](https://developers.facebook.com/docs/threads/create-posts/location-tagging#location-retrieval)

[Available Fields](https://developers.facebook.com/docs/threads/create-posts/location-tagging#available-fields)

[Example request](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request-3)

[Example response](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-response-4)

# Location Tagging

You can use the Threads API to search for and tag locations when creating media.

### Permissions

The Threads Location Search and Tagging API requires an appropriate access token and permissions. While you are testing, you can easily generate tokens and grant your app permissions by using the Graph API Explorer.

- `threads_basic` — Required for making any calls to all Threads API endpoints.
- `threads_location_tagging` — Required for making GET calls to the location search endpoint and for making POST calls to the publishing endpoints with a location tag.

## Search

You can search for locations by sending a request to the [`GET /location_search` endpoint](https://developers.facebook.com/docs/threads/reference/location-search). Include the parameter(s) from one of the following options in your request:

- `q` – A query to search for locations by.


or
- `latitude` – The latitude of a location.
- `longitude` – The longitude of a location.

At least one of the above parameter options must be provided in the request. All three may be used together as well.

**Note:** If your app has not been approved for the `threads_location_tagging` permission, the search will be performed only on the query "Menlo Park". After approval, all queries will be searchable.

### Example request with query

```code
curl -i -X GET \
  "https://graph.threads.net/v1.0/location_search?access_token=<ACCESS_TOKEN>" \
  -d q="some place"
```

### Example request with latitude and longitude

```code
curl -i -X GET \
  "https://graph.threads.net/v1.0/location_search?access_token=<ACCESS_TOKEN>" \
  -d latitude=12.3456 \
  -d longitude=12.3456
```

### Example response

```code
{
  "data": [\
    {\
      "id": 12345,\
      "name": "Facebook Headquarters",\
      "address": "1 Hacker Way",\
      "city": "Menlo Park",\
      "country": "USA",\
      "latitude": 37.48375115774628,\
      "longitude": -122.14892131843617,\
      "postal_code": "94025",\
    },\
    ...\
  ]
}
```

The requests above will return a list of locations based on the search parameters. This response is not paginated.

## Tagging

You can attach a location tag when making a request to the `POST /threads` endpoint to create a media object. Include the following parameter in your request:

- `location_id` – The ID of the location being tagged.

### Example request

```code
curl -i -X POST \
  "https://graph.threads.net/v1.0/<THREADS_USER_ID>/threads?media_type=TEXT&text=<TEXT>&access_token=<ACCESS_TOKEN>" \
  -d location_id=12345
```

### Example response

```code
{
  "id": "1234567" // Threads Media Container ID
}
```

The request above creates a Threads post media container that, once [published](https://developers.facebook.com/docs/threads/posts#step-2--publish-a-threads-media-container), will contain a location tag.

## Media Retrieval

Make a request to the `GET /threads` or `GET /{threads-media-id}` endpoint to retrieve media object(s). Make sure to include the following fields with your API request:

- `location_id` – The ID of the location tagged to the media.
- `location` – The location tagged to the media.

### Example request

```code
curl -i -X GET \
  "https://graph.threads.net/v1.0/<THREADS_MEDIA_ID>&access_token=<ACCESS_TOKEN>" \
  -d fields=id,location_id,location{id,address,city,country,name,latitude,longitude,postal_code}
```

### Example response

```code
{
  "id": "12345", // Threads Media ID
  "location_id": "12345", // Location Tag ID
  "location": { // Location Tag Object
    "id": "12345",
    "address": "1 Hacker Way",
    "name": "Facebook Headquarters",
    "city": "Menlo Park",
    "country": "USA"
    "latitude": 37.48375115774628,
    "longitude": -122.14892131843617,
    "postal_code": "94025",
  }
}
```

## Location Retrieval

Make a request to the [`GET /{location-id}` endpoint](https://developers.facebook.com/docs/threads/reference/locations) to retrieve a location object.

### Available Fields

| Name | Description |
| --- | --- |
| `id` | The location's ID. |
| `address` | Address of the location. |
| `name` | Name of the location. |
| `city` | City of the location. |
| `country` | Country of the location. |
| `latitude` | Latitude of the location. |
| `longitude` | Longitude of the location. |
| `postal_code` | Postal Code of the location. |

### Example request

```code
curl -i -X GET \
  "https://graph.threads.net/v1.0/<THREADS_LOCATION_ID>&access_token=<ACCESS_TOKEN>" \
  -d fields=id,address,name,city,country,latitude,longitude,postal_code
```

### Example response

```code
{
    "id": "12345",
    "address": "1 Hacker Way",
    "name": "Facebook Headquarters",
    "city": "Menlo Park",
    "country": "USA"
    "latitude": 37.48375115774628,
    "longitude": -122.14892131843617,
    "postal_code": "94025",
  }
```

On This Page

[Location Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging#location-tagging)

[Search](https://developers.facebook.com/docs/threads/create-posts/location-tagging#search)

[Example request with query](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request-with-query)

[Example request with latitude and longitude](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request-with----latitude-and-longitude)

[Example response](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-response)

[Tagging](https://developers.facebook.com/docs/threads/create-posts/location-tagging#tagging)

[Example request](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request)

[Example response](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-response-2)

[Media Retrieval](https://developers.facebook.com/docs/threads/create-posts/location-tagging#media-retrieval)

[Example request](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request-2)

[Example response](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-response-3)

[Location Retrieval](https://developers.facebook.com/docs/threads/create-posts/location-tagging#location-retrieval)

[Available Fields](https://developers.facebook.com/docs/threads/create-posts/location-tagging#available-fields)

[Example request](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-request-3)

[Example response](https://developers.facebook.com/docs/threads/create-posts/location-tagging#example-response-4)