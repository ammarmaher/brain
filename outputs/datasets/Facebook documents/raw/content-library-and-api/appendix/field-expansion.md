---
url: https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion
title: Field expansion - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fappendix%2Ffield-expansion%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Field expansion](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion#field-expansion)

[Specifying multiple fields](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion#specifying-multiple-fields)

[Specifying expanded fields](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion#specifying-expanded-fields)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion#learn-more)

# Field expansion

There are a number of fields in the data available through the Meta Content Library API that are nested. For example, the `statistics` field contains the `like_count`, `haha_count`, and several other fields. When you create search objects, you might want to include some or all of the nested fields in your search. _Field expansion_ allows you to perform queries for multiple fields and their nested fields in a single call. We refer to the nested fields as _expanded fields_.

In the [Data dictionary](https://developers.facebook.com/docs/content-library-api/data), expanded fields are indicated by a dot notation. For example, `statistics.like_count` indicates that `like_count` is available within `statistics`. To specify expanded fields in your search objects, you can either use this dot notation or you can append the names of the expanded fields in curly braces after the parent field. See the examples in this section.

## Specifying multiple fields

You can specify which multiple fields you want returned on any associated data by using the `fields` parameter, with the field names separated by commas.

RPython

```r
# Return specific list of fields
response <- client$get(
      path="facebook/posts/preview",
      params = list("q"="cybercrime", "fields"="id,text,lang")
)
```

```py
# Return specific list of fields
response = client.get(
    path="facebook/posts/preview",
    params={"q": "cybercrime", "fields": "id,text,lang"}
)
display(response.json()) # Display first page
```

## Specifying expanded fields

You can specify which expanded fields you want returned on any associated data by appending a comma-separated list of expanded field names wrapped in curly braces to the end of any parent field name.

RPython

```r
# Return specific list of fields
response <- client$get(
      path="facebook/posts/preview",
      params = list("q"="cybercrime", "fields"="statistics{like_count,haha_count}")
)
```

```py
# Return specific list of fields
response = client.get(
    path="facebook/posts/preview",
    params={"q": "cybercrime", "fields": "statistics{like_count,haha_count}"}
)
display(response.json()) # Display first page
```

If you specify a field but do not specify any of its expanded fields, default expanded fields on the associated entity are included in the response. If you omit the `fields` parameter altogether, default expanded fields on default parent fields on the associated data are included in the response.

## Learn more

- [Data dictionary](https://developers.facebook.com/docs/content-library-api/data)

On This Page

[Field expansion](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion#field-expansion)

[Specifying multiple fields](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion#specifying-multiple-fields)

[Specifying expanded fields](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion#specifying-expanded-fields)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion#learn-more)