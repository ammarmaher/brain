---
url: https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started
title: Getting started - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fcontent-library-api%2Fgetting-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Content Library and API](https://developers.facebook.com/docs/content-library-and-api)

- [Get access](https://developers.facebook.com/docs/content-library-and-api/get-access)
- [Quick links](https://developers.facebook.com/docs/content-library-and-api/quick-links)
- [Content Library](https://developers.facebook.com/docs/content-library-and-api/content-library)
- [Content Library API](https://developers.facebook.com/docs/content-library-and-api/content-library-api)


  - [Overview](https://developers.facebook.com/docs/content-library-and-api/content-library-api/overview)
  - [Getting started](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started)
  - [Guides](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides)

- [Appendix](https://developers.facebook.com/docs/content-library-and-api/appendix)
- [Support](https://developers.facebook.com/docs/content-library-and-api/support)
- [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers)
- [Citations](https://developers.facebook.com/docs/content-library-and-api/citations)
- [Changelog](https://developers.facebook.com/docs/content-library-and-api/changelog)

On This Page

[Getting started](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#getting-started)

[Log in to the Secure Research Environment URL](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#log-in-api)

[Create a Jupyter notebook](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#notebook-cl-api)

[Import the Content Library API client](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#client-library)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#learn-more)

# Getting started

You can work with Meta Content Library API within Meta Secure Research Environment or within an approved third-party cleanroom environment. The getting started procedure documented here is specific to Secure Research Environment which runs a modified version of Jupyter within an Amazon WorkSpaces Secure Browser instance and provides you with a virtual data cleanroom where you can securely search for and analyze data. If you are accessing the Content Library API through a third-party cleanroom environment, you will be provided with getting started instructions from the cleanroom's system administrator.

**If you are accessing the Content Library API through a third-party cleanroom environment such as the one provided by the Inter-university Consortium for Political and Social Research (ICPSR), you will be provided with getting started instructions from the cleanroom's system administrator. Please be sure to follow their instructions as this page only provides information relevant to the Meta Secure Research Environment cleanroom.**

To get up and running with Content Library API in Secure Research Environment:

- [Log in to the Secure Research Environment URL](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#log-in-api)
- [Create a Jupyter notebook](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#notebook-cl-api)
- [Import the Content Library API client](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#client-library)
- [Test with a basic search](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#test-basic-example)

## Log in to the Secure Research Environment URL

Use one of the two available Amazon WorkSpaces Secure Browser portals to access Content Library API in Secure Research Environment. For the best user experience and platform performance, select the portal closest to your location:

- [United States portal](https://l.facebook.com/l.php?u=https%3A%2F%2Fus-content-library-api.fb-researchtool.com%2F&h=AUBA7A0JDZUzoE8O1fyFbxY5Ngf42zRkSia8mx3aK-A_mnXUevkk50g6GJvkmI75kbJ72QTTj1KkAQ6-qwnTCIsZwbNJZcfEUGlIEoRb14_h_-WNDFBd49e_YykbWolUVjwvtYgZ0pNqCQ)
- [Ireland portal](https://l.facebook.com/l.php?u=https%3A%2F%2Fcontent-library-api.fb-researchtool.com%2F&h=AUBTUhvVmMtS__f-ZhKX6V5xOI_LQ36OMooOOPV2Txi2_r3FOAY_XVlRgwLQo-0iuVrGUgkvwXbjdvWXB4rboSj99vmAIdSvNfr6THro8Vy8IOC40X_P4Mm5FOa8E5iB8_dlWvsEvyQZyg)

See [WorkSpaces Secure Browser](https://developers.facebook.com/docs/researcher-platform/secure-browser/?locale=en_US&draft=1278916996629684) in the Secure Research Environment user documentation for more information about WorkSpaces Secure Browser.

Log into the site using your Facebook credentials. This will spin up an instance of JupyterHub server for your use in Secure Research Environment.

You will be offered the choice of CPU or GPU server. See [GPU server](https://developers.facebook.com/docs/researcher-platform/features/GPU) to learn about the difference between the two. See [Secure Research Environment](https://developers.facebook.com/docs/researcher-platform) for complete Secure Research Environment documentation.

## Create a Jupyter notebook

In the Launcher window, click the icon for **Python3** or **R**. This will create a new Jupyter Notebook in a new browser tab. To rename the notebook, right-click the notebook in the left navigation bar and select **Rename**.

You enter queries in the blank cells of the notebook. To run a query, click the run icon in the top toolbar.

## Import the Content Library API client

All calls are made using the Content Library API client. You only need to import the Content Library API client once per Jupyter notebook server session.

In code block examples in this documentation, select the R or Python tab to see the corresponding code. You can copy the code and paste it into your notebook.

RPython

```r
library(reticulate)
client <- import("metacontentlibraryapi")$MetaContentLibraryAPIClient

# Set specific MCL_API_VERSION, or use client$LATEST_VERSION to get the latest
client$set_default_version(client$LATEST_VERSION)
```

```py
from metacontentlibraryapi import MetaContentLibraryAPIClient as client

# Set specific MCL_API_VERSION, or use client.LATEST_VERSION to get the latest
client.set_default_version(client.LATEST_VERSION)
```

## Test with a basic search

Test your setup by running a basic search query. Here is an example to try for Facebook Pages:

RPython

```r
library(reticulate)
client <- import("metacontentlibraryapi")$MetaContentLibraryAPIClient

client$set_default_version(client$LATEST_VERSION)

# Search for Facebook Pages
pages_response <- client$get(
        path="facebook/pages/preview",
        params = list("q"="mountains")
)

jsonlite::fromJSON(pages_response$text, flatten=TRUE) # Display first page
```

```py
from metacontentlibraryapi import MetaContentLibraryAPIClient as client

client.set_default_version(client.LATEST_VERSION)

# Search for Facebook Pages
pages_response = client.get(
    path="facebook/pages/preview",
    params={"q": "mountains"}
)

display(pages_response.json()) # Display first page
```

## Test fetching by Meta Content Library ID

Test fetching an entity by its ID (obtained from the results of a previous search) such as one of the Pages from the previous query:

RPython

```r
pages_data <- jsonlite::fromJSON(pages_response$text, flatten=TRUE)$data
page_mcl_id <- pages_data[c('id')][1,]

# Fetch by Meta Content Library ID
response <- client$get(path=paste0("facebook/pages/", page_mcl_id))

jsonlite::fromJSON(response$text, flatten=TRUE)
```

```py
page_mcl_id = pages_response.json()['data'][0]['id']

# Fetch by Meta Content Library ID
single_page_response = client.get(
    path="facebook/pages/" + page_mcl_id,
)

display(single_page_response.json())
```

## Learn more

- [Jupyter](https://l.facebook.com/l.php?u=https%3A%2F%2Fjupyter.org%2F&h=AUAJchZe7qwNHPbGtqGnI3cCmmqTS4zN33sSItioVvT5Q93S3WHN7IRRoyytyfKlIuWZwktyRc8d2q1mB6ZMyzzzENwQHwKU_MygG3L_l386Mhe8m8oPSrHdKDFMlI2LCBLGDugW5_glYg)

- [JupyterLab documentation](https://l.facebook.com/l.php?u=https%3A%2F%2Fjupyterlab.readthedocs.io%2Fen%2Fstable%2F&h=AUCRID1ehmR3OrQqrYYHsMcw8XqO2Y2YkyIdPET-Bm-dqFNaLyTp7Qbl_2PwdF1E3v2wp1pkEXLuTFKijz0JocC6WbMuenoDmK2M4aGSZCCpSmDRlxhPZHtgJJ808tgrHn8qUuyGD3SAuA)

- [Jupyter Notebook basics](https://l.facebook.com/l.php?u=https%3A%2F%2Fjupyter-notebook.readthedocs.io%2Fen%2Fstable%2Fexamples%2FNotebook%2FNotebook%2520Basics.html&h=AUBPEvEXCzhc3L__TKFvnjHg3pXejZFOLiJHxQnawN4i4I9TnvaZz5NvWpjh3SdnBMgopiP9ROO2sb4gdozdZ7oA2OzLJs9IxaFpoD9GGkeFazlY0MLlduamIvl8Cw4-iSU02glRVmshWQ)

- [Secure Research Environment documentation](https://developers.facebook.com/docs/researcher-platform)


On This Page

[Getting started](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#getting-started)

[Log in to the Secure Research Environment URL](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#log-in-api)

[Create a Jupyter notebook](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#notebook-cl-api)

[Import the Content Library API client](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#client-library)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/content-library-api/getting-started#learn-more)