---
url: https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code
title: Get API Code - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fappendix%2Fget-api-code%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Get API Code](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#get-api-code)

[In Content Library](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#in-content-library)

[Define your search](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#define-your-search)

[Open the Get API Code tool](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#open-the-get-api-code-tool)

[Select Python or R](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#select-python-or-r)

[Copy the code snippet](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#copy-the-code-snippet)

[Go to Content Library API](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#go-to-content-library-api)

[In Content Library API](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#in-content-library-api)

[Paste the snippet into a notebook cell](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#paste-the-snippet-into-a-notebook-cell)

[Run the code](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#run-the-code)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#learn-more)

# Get API Code

Get API Code is a tool within [Meta Content Library](https://www.facebook.com/transparency-tools/content-library) that automatically generates a Python or R code snippet corresponding to your current search that you can copy and paste into your Meta Content Library API Jupyter notebook. **NOTE: This feature is only available if you are using Content Library API in the Secure Research Environment.**

Alternatively, you can create an API search ID that you can use to perform the same search in Content Library API and also share with other users who have the same account type that you have. See [Share searches](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/api-search-id) for more information about that option.

**Remember the limits**

If you submit a synchronous query in the Content Library API that would return more than 1000 results, you will only see the top 1000.

If you submit an asynchronous query in the API that would return more than 100,000 results, the API will give you an error message and will not complete the query.

The automatically generated R or Python code might return more than 100,000 results. Be sure to check the very top of the Content Library search results to see the size of the results before you use the same search in the API.

## In Content Library

### Define your search

Select the parameters for your search. The [**About**](https://www.facebook.com/transparency-tools/content-library/dataset/1119037145491882/about/) page in the web UI describes all the filters that are available.

### Open the Get API Code tool

Click **</>** in the top menu bar (mouse over the button to see the label).

### Select Python or R

A new window opens in which your search parameters are listed, and the automatically-generated Python and R code that corresponds to your current search parameters is displayed in a tabbed code block. Click the tab corresponding to your language selection.

### Copy the code snippet

With the correct tab selected, click **Copy to Clipboard** below the code block.

The code block also includes instructions for submitting the code to the API as an asynchronous search which processes in the background. See [Search guide](https://developers.facebook.com/docs/content-library-api/guide-search-object) to learn about the difference between synchronous (default) and asynchronous searches.

### Go to Content Library API

At the bottom of the **Get API Code** window, there is a **Go to Content Library API** button that launches the Content Library API sign-in window.

WorkSpaces Secure Browser connection is required for Content Library API:

- The **Go to Content Library API** button is clickable if you are connected.

- If you believe you are connected, but the button is not clickable, try refreshing your browser.

- For Content Library API getting started information including access, see [Getting started](https://developers.facebook.com/docs/content-library-api/quick-start).


## In Content Library API

### Paste the snippet into a notebook cell

Paste the code representing your search (query) into a blank cell in your Jupyter notebook. Be sure the language (R or Python) of the notebook matches the language of the code you copied. If you have not already set up your Jupyter environment, see [Getting started](https://developers.facebook.com/docs/content-library-api/quick-start) for guidance.

### Run the code

Click the triangular run button to run the code and display the results.

## Learn more

- [Content Library API documentation](https://developers.facebook.com/docs/content-library-api)
- [Search guide](https://developers.facebook.com/docs/content-library-api/guide-search-object)
- [Getting started](https://developers.facebook.com/docs/content-library-api/quick-start)
- [Share searches](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/api-search-id) in Content Library API

On This Page

[Get API Code](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#get-api-code)

[In Content Library](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#in-content-library)

[Define your search](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#define-your-search)

[Open the Get API Code tool](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#open-the-get-api-code-tool)

[Select Python or R](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#select-python-or-r)

[Copy the code snippet](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#copy-the-code-snippet)

[Go to Content Library API](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#go-to-content-library-api)

[In Content Library API](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#in-content-library-api)

[Paste the snippet into a notebook cell](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#paste-the-snippet-into-a-notebook-cell)

[Run the code](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#run-the-code)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code#learn-more)