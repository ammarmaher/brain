---
url: https://developers.facebook.com/docs/content-library-and-api/appendix/share-producer-list
title: Share producer list - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fappendix%2Fshare-producer-list%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Content Library and API](https://developers.facebook.com/docs/content-library-and-api)

- [Get access](https://developers.facebook.com/docs/content-library-and-api/get-access)
- [Quick links](https://developers.facebook.com/docs/content-library-and-api/quick-links)
- [Content Library](https://developers.facebook.com/docs/content-library-and-api/content-library)
- [Content Library API](https://developers.facebook.com/docs/content-library-and-api/content-library-api)
- [Appendix](https://developers.facebook.com/docs/content-library-and-api/appendix)


  - [Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary)
  - [Field expansion](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion)
  - [Search quality](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality)
  - [Get API Code](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code)
  - [Share producer list](https://developers.facebook.com/docs/content-library-and-api/appendix/share-producer-list)
  - [Share API search ID](https://developers.facebook.com/docs/content-library-and-api/appendix/api-search-id)

- [Support](https://developers.facebook.com/docs/content-library-and-api/support)
- [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers)
- [Citations](https://developers.facebook.com/docs/content-library-and-api/citations)
- [Changelog](https://developers.facebook.com/docs/content-library-and-api/changelog)

On This Page

[Share producer lists between the UI and API](https://developers.facebook.com/docs/content-library-and-api/appendix/share-producer-list#share-producer-lists-between-the-ui-and-api)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/share-producer-list#learn-more)

# Share producer lists between the UI and API

Producer lists can be shared between Meta Content Library and Content Library API. Researchers can see their producer lists in the [Producer lists](https://www.facebook.com/transparency-tools/content-library/producer-lists) tab in Content Library. You can only share producer lists with users who have the same account type as yours.

**Note**: This feature is only available from version 4.0 onwards.

To create an API list ID to share a producer list between the UI and API:

- Select **Producers lists** from the left navigation bar.

- Click **View** in the card for the producer list you want to share.

- Click the down arrow button next to the **Share** button. The dropdown menu displays.

- Select **Create API list ID** to get an API Producer list ID.

- You’ll see a dialog with the ID which you can use to access the producer list in the API with the path received through the user interface.

The syntax of the snapshot of the producer list that can be accessed on the API is:

```code
/lists/producers/<api_producer_list_id>
```

### Request

| Name | Type | Description |
| --- | --- | --- |
| `api_producer_list_id` | String | Unique ID created in Meta Content Library representing a snapshot of the producer list |

See [Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-lists-producers) for information on data included in responses.

### Sample queries

RPython

```r
library(reticulate)
client <- import("metacontentlibraryapi")$MetaContentLibraryAPIClient

# set default version to latest
client$set_default_version(client$LATEST_VERSION)

# Get the response by using the API ID received by UI
response <- client$get(path="lists/producers/<api_producer_list_id>")

# Display the json response
jsonlite::fromJSON(response$text, flatten=TRUE)
```

```py
from metacontentlibraryapi import MetaContentLibraryAPIClient as client

# set default version to latest
client.set_default_version(client.LATEST_VERSION)

# Get the response by using the API ID received by UI
response = client.get(
                      path="lists/producers/<api_producer_list_id>")

# Display the json response
display(response.json())
```

## Learn more

- [Content Library API documentation](https://developers.facebook.com/docs/content-library-api)
- [Search guide](https://developers.facebook.com/docs/content-library-api/guide-search-object)
- [Getting started](https://developers.facebook.com/docs/content-library-api/quick-start)

On This Page

[Share producer lists between the UI and API](https://developers.facebook.com/docs/content-library-and-api/appendix/share-producer-list#share-producer-lists-between-the-ui-and-api)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/share-producer-list#learn-more)