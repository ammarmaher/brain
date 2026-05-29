---
url: https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/
title: Facebook Marketplace - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fcontent-library-api%2Fguides%2Ffb-marketplace%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Content Library and API](https://developers.facebook.com/docs/content-library-and-api)

- [Get access](https://developers.facebook.com/docs/content-library-and-api/get-access)
- [Quick links](https://developers.facebook.com/docs/content-library-and-api/quick-links)
- [Content Library](https://developers.facebook.com/docs/content-library-and-api/content-library)
- [Content Library API](https://developers.facebook.com/docs/content-library-and-api/content-library-api)
- [Appendix](https://developers.facebook.com/docs/content-library-and-api/appendix)
- [Support](https://developers.facebook.com/docs/content-library-and-api/support)
- [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers)
- [Citations](https://developers.facebook.com/docs/content-library-and-api/citations)
- [Changelog](https://developers.facebook.com/docs/content-library-and-api/changelog)

On This Page

[Guide to Facebook Marketplace data](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#guide-to-facebook-marketplace-data)

[Parameters](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#parameters)

[Sample queries](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#sample-queries)

[Search for listings by keyword](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#search-for-listings-by-keyword)

[Search for listings by price](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#search-for-listings-by-price)

[Search for listings by categories](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#search-for-listings-by-categories)

[Including multimedia in search results](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#including-multimedia-in-search-results)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#learn-more)

# Guide to Facebook Marketplace data

You can perform Facebook Marketplace searches by calling the Meta Content Library API client `get()` method with the `facebook/marketplace-listings/preview` path. This document describes the parameters, and shows how to perform basic queries using the method.

All of the examples in this document are taken from a Secure Research Environment use case and assume you have created a Jupyter notebook and a client object. See [Getting started](https://developers.facebook.com/docs/content-library-api/quick-start) to learn more.

See [Data dictionary](https://developers.facebook.com/docs/content-library-api/data#dd-fb-market) for detailed information about the fields that are available on a Facebook Marketplace node.

## Parameters

| Parameter | Type | Description |
| --- | --- | --- |
| `Q`<br>_Optional_ | String | Keyword(s) to search for. Searches listing `listing_details.title` and `description` fields. See [Advanced search guidelines](https://developers.facebook.com/docs/content-library-api/adv-search) for information about how multiple keyword searches with Boolean operators are handled. |
| `CATEGORIES`<br>_Optional_ | List | Comma-separated list of listing category names to include in the search. Keywords can be used to match categories. Categories are visible in the Meta Content Library UI and in the Facebook Marketplace mobile app. |
| `FIELDS`<br>_Optional_ | List | Comma-separated list of Marketplace listing fields you want included in search results. See [Data dictionary](https://developers.facebook.com/docs/content-library-api/data#dd-fb-market) for descriptions of all available fields. |
| `CONTENT_TYPES`<br>_Optional_ | List | Comma-separated list of content types to be included in the search results. Available content types are `photos` and `videos` (which includes photos). |
| `LISTING_COUNTRIES`<br>_Optional_ | List | Comma-separated list of countries to include. Takes ISO Alpha-2 Country Code in 2-letter uppercase format. |
| `SORT`<br>_Optional_ | Enum | Sort mode specifying the order in which listings are returned (only available for synchronous searches). Available options:<br>- `most_to_least_views`: Listings are returned based on the number of views (most views first). <br>- `newest_to_oldest`: Listings are returned in reverse chronological order (newest first).<br>- `oldest_to_newest`: Listings are returned in chronological order (oldest first).<br>Additional available options when the `listing_countries` parameter specifies only one country:<br>- `highest_to_lowest_price`: Listings are returned based on the price (highest price first). <br>- `lowest_to_highest_price`: Listings are returned based on the price (lowest price first). <br>Default: `most_to_least_views` |
| `PRICE_MIN` _Optional_ | Integer | Minimum price for the search in the currency of the listing country when only a single listing country is included. Not valid when the `listing_countries` parameter specifies multiple countries or when the `listing_countries` parameter is omitted. |
| `PRICE_MAX`<br>_Optional_ | Integer | Maximum price for the search in the currency of the listing country when only a single listing country is included. Not valid when the `listing_countries` parameter specifies multiple countries or when the `listing_countries` parameter is omitted. |
| `VIEWS_BUCKET_START`<br>_Optional_ | Integer | Marketplace listings with view counts larger than or equal to this number match the search criteria. Range is from 0 to the maximum of more than 100 million. Used with `views_bucket_end` to define a range.<br>Views are the number of times the listing was on screen, not including times it appeared on the seller’s screen. View counts for Marketplace listings are refreshed every 2-3 days. |
| `VIEWS_BUCKET_END` _Optional_ | Integer | Marketplace listings with view counts smaller than or equal to this number match the search criteria. Range is from 0 to the maximum of more than 100 million. Used with `views_bucket_start` to define a range.<br>Views are the number of times the listing was on screen, not including times it appeared on the seller’s screen. View counts for Marketplace listings are refreshed every 2-3 days. |
| `SINCE`<br>_Optional_ | String or Integer | Date in YYYY-MM-DD (date only) or UNIX timestamp (translates to a date and time to the second) format. Marketplace listings created on or after this date or timestamp are returned (used with `UNTIL` to define a time range). `SINCE` and `UNTIL` are based on UTC time zone, regardless of the local time zone of the seller who made the listing.<br>- If both `SINCE` and `UNTIL` are included, the search includes the time range defined by those values.<br>- If `SINCE` is included and `UNTIL` is omitted, the search includes the `SINCE` time through the present time. <br>- If `SINCE` is omitted and `UNTIL` is included, the search goes from the beginning of Facebook time through the `UNTIL` time. <br>- If `SINCE` and `UNTIL` are both omitted, the search goes from the beginning of Facebook time to the present time.<br>- If `SINCE` and `UNTIL` are the same UNIX timestamp, the search includes the `SINCE` time through the `SINCE` time plus one hour.<br>- If `SINCE` and `UNTIL` are the same date (YYYY-MM-DD), the search includes the `SINCE` date through the `SINCE` date plus one day. |
| `UNTIL`<br>_Optional_ | String or Integer | Date in YYYY-MM-DD (date only) or UNIX timestamp (translates to a date and time to the second) format. Marketplace listings created on or before this date or timestamp are returned (used with `SINCE` to define a time range). `SINCE` and `UNTIL` are based on UTC time zone, regardless of the local time zone of the seller who made the listing.<br>- If both `SINCE` and `UNTIL` are included, the search includes the time range defined by those values.<br>- If `SINCE` is included and `UNTIL` is omitted, the search includes the `SINCE` time through the present time.<br>- If `SINCE` is omitted and `UNTIL` is included, the search goes from the beginning of Facebook time through the `UNTIL` time.<br>- If `SINCE` and `UNTIL` are both omitted, the search goes from the beginning of Facebook time to the present time.<br>- If `SINCE` and `UNTIL` are the same UNIX timestamp, the search includes the `SINCE` time through the `SINCE` time plus one hour.<br>- If `SINCE` and `UNTIL` are the same date (YYYY-MM-DD), the search includes the `SINCE` date through the `SINCE` date plus one day. |

## Sample queries

### Search for listings by keyword

To search for all public listings on Facebook Marketplace that contain specific keywords, use the `q` parameter. See [Advanced search guidelines](https://developers.facebook.com/docs/content-library-api/adv-search) for information about how multiple keyword searches are handled.

RPython

```r
library(reticulate)
client <- import("metacontentlibraryapi")$MetaContentLibraryAPIClient

client$set_default_version(client$LATEST_VERSION)

response <- client$get(path="facebook/marketplace-listings/preview", params=list("q"="rentals"))
jsonlite::fromJSON(response$text, flatten=TRUE) # Display first page
```

```py
from metacontentlibraryapi import MetaContentLibraryAPIClient as client

client.set_default_version(client.LATEST_VERSION)

response = client.get(
    path="facebook/marketplace-listings/preview",
    params={"q":"rentals"},
)
display(response.json()) # Display first page
```

### Search for listings by price

Use the `price_max` parameter to specify the highest price you want included in search results. Remember that this parameter is only valid when a single country is specified using the `listing_countries` parameter.

RPython

```r
response <- client$get(path="facebook/marketplace-listings/preview", params=list("listing_countries"="US", "price_max"="10000", "q"="rentals"))
jsonlite::fromJSON(response$text, flatten=TRUE) # Display first page
```

```py
response = client.get(
    path="facebook/marketplace-listings/preview",
    params={"listing_countries":["US"],"price_max":"10000","q":"rentals"},
)
display(response.json()) # Display first page
```

### Search for listings by categories

To search for listings in specific categories, use the `categories` parameter to specify the list of categories to include in the results.

RPython

```r
response <- client$get(path="facebook/marketplace-listings/preview", params=list("categories"="Clothing, Shoes & Accessories,Rentals,Books, Movies & Music", "q"="rentals"))
jsonlite::fromJSON(response$text, flatten=TRUE) # Display first page
```

```py
response = client.get(
    path="facebook/marketplace-listings/preview",
    params={"categories":["Clothing, Shoes & Accessories","Rentals","Books, Movies & Music"],"q":"rentals"},
)
display(response.json()) # Display first page
```

## Including multimedia in search results

Multimedia in responses to queries on Secure Research Environment include the type of media (photo, video), a Meta Content Library ID, the duration and any user tags. You can get the URL for the media by querying for `”fields”=”multimedia{url}”`.

Multimedia is not included in responses to queries in third-party cleanrooms by default. Third-party cleanroom users can get multimedia by querying for `”fields”=”multimedia”`. In addition to the type, Meta Content Library ID, duration and user tags, the URL is included in multimedia responses in third-party cleanrooms. Multimedia is available in posts from Facebook Pages, profiles, groups, and events.

- Include the keyword `multimedia` in your query (`fields` parameter) on third-party cleanrooms, because multimedia is not included by default.

- Include the keyword `multimedia{url}` in your query (`fields` parameter) on Secure Research Environment to obtain the media URL, because the URL is not included by default.

- To display multimedia in Secure Research Environment use `display_media()`.

- The number of calls allowed that include multimedia is controlled by a multimedia query budget specific to the third-party cleanroom environment. See [Rate limiting and query budgeting for multimedia](https://developers.facebook.com/docs/content-library-api/rate-limiting#multimedia-query-limit) for more information.
To download multimedia content, use `download_multimedia_by_content_ids()` with a list of known content IDs. See [Guide to ID-based retrieval](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/id-based-retrieval) for information on how to retrieve content IDs.


RPython

```r
# Load required libraries
library(reticulate)
meta_content_library_api <- import("metacontentlibraryapi")
utils <- meta_content_library_api$MetaContentLibraryAPIMultimediaUtils
# Provide a comma-separated list of content ids as strings
ids_to_download <- c("553170087752425", "681021651202495")
# Download the multimedia content
utils$download_multimedia_by_content_ids(ids_to_download)
# The file path is displayed when the above command is run
utils$display_media(<FILE_PATH>)
```

```py
from metacontentlibraryapi import MetaContentLibraryAPIMultimediaUtils as utils
from typing import List
# Provide a comma-separated list of content ids as strings
ids_to_download: List[str] = ['553170087752425', '681021651202495'] # List of IDs to download
# You will receive the path of each content id as output
# You can also view multimedia in media folder with path media/<content_id>/
utils.download_multimedia_by_content_ids(ids_to_download, response=response)
# The file path is displayed when the above command is run
utils.display_media(<FILE_PATH>)
```

## Learn more

- [Advanced search guidelines](https://developers.facebook.com/docs/content-library-api/adv-search)
- [Data dictionary](https://developers.facebook.com/docs/content-library-api/data#dd-fb-market)

On This Page

[Guide to Facebook Marketplace data](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#guide-to-facebook-marketplace-data)

[Parameters](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#parameters)

[Sample queries](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#sample-queries)

[Search for listings by keyword](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#search-for-listings-by-keyword)

[Search for listings by price](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#search-for-listings-by-price)

[Search for listings by categories](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#search-for-listings-by-categories)

[Including multimedia in search results](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#including-multimedia-in-search-results)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-marketplace/#learn-more)