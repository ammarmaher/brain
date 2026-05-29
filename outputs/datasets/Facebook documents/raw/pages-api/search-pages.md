---
url: https://developers.facebook.com/docs/pages-api/search-pages/
title: Search Pages - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2Fsearch-pages%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Search for a Page](https://developers.facebook.com/docs/pages-api/search-pages/#search-for-a-page)

[Before You Start](https://developers.facebook.com/docs/pages-api/search-pages/#before-you-start)

[Sample Request](https://developers.facebook.com/docs/pages-api/search-pages/#sample-request)

[Sample Response](https://developers.facebook.com/docs/pages-api/search-pages/#sample-response)

[Fields](https://developers.facebook.com/docs/pages-api/search-pages/#fields)

[Limitations](https://developers.facebook.com/docs/pages-api/search-pages/#limitations)

[Learn More](https://developers.facebook.com/docs/pages-api/search-pages/#learn-more)

# Search for a Page

This guide explains how to get information about Facebook Pages including names, locations, and more. Find Pages to [@Mention](https://developers.facebook.com/docs/pages/mentions), Page locations, and tag a Page to show [branded content](https://www.facebook.com/business/help/788160621327601).

## Before You Start

You will need:

- A [User access token](https://developers.facebook.com/docs/facebook-login/access-tokens#usertokens) and the [app secret](https://developers.facebook.com/docs/facebook-login/security/#appsecret) if the app user is logged into Facebook.
- An [App access token](https://developers.facebook.com/docs/facebook-login/access-tokens) with the [Page Public Metadata Access](https://developers.facebook.com/docs/apps/features-reference#page-public-metadata-access) feature if the app user is not logged into Facebook and is searching for public Page information.
- An [App access token](https://developers.facebook.com/docs/facebook-login/access-tokens) with the [Page Public Content Access](https://developers.facebook.com/docs/apps/features-reference#page-public-content-access) feature if the app user is not logged into Facebook and is searching Pages to conduct competitve analysis.

### Sample Request

```code
curl -i -X GET \
  "https://graph.facebook.com/pages/search?q=Facebook
  &fields=id,name,location,link
  &access_token={access-token}"
```

Returns a list of [Pages](https://developers.facebook.com/docs/graph-api/reference/page) that meet the query's criteria. Set the `q` parameter value to a keyword or search term (e.g. `q=Facebook`). Use the `fields` parameter to list any [fields](https://developers.facebook.com/docs/pages-api/search-pages/#fields) you want included with each Page returned in the response.

### Sample Response

```code
{
  "data": [\
    {\
      "id": "309968765748101",\
      "name": "Facebook HQ",\
      "location": {\
        "city": "Menlo Park",\
        "country": "United States",\
        "latitude": 37.483183,\
        "longitude": -122.149999,\
        "state": "CA",\
        "street": "1 Hacker Way",\
        "zip": "94025"\
      },\
      "link": "https://www.facebook.com/Facebook-HQ-166793820034304/"\
    },\
    {\
      "id": "194776097220801",\
      "name": "Facebook Seattle",\
      "location": {\
        "city": "Seattle",\
        "country": "United States",\
        "latitude": 47.628293260721,\
        "longitude": -122.34263420105,\
        "state": "WA",\
        "street": "1101 Dexter Ave N",\
        "zip": "98109"\
      },\
      "link": "https://www.facebook.com/fbseattle/"\
    },\
    ...\
  ]
}
```

## Fields

| Field Name | Description |
| --- | --- |
| `id`<br> _int_ | The ID of the Facebook Page. |
| `is_eligible_for_branded_content`<br> _boolean_ | Display whether the Facebook Page is eligible to post [branded content](https://www.facebook.com/business/help/788160621327601?id=1912903575666924). |
| `is_unclaimed`<br> _boolean_ | Display whether [a Facebook Page that was automatically generated has been claimed](https://business.facebook.com/help/168172433243582) by the business it represents, `is_unclaimed=false`, or not, `is_unclaimed=true`. |
| `link`<br> _uri_ | The link to the Facebook Page. |
| `location`<br> _array_ | The physical location of the business represented by the Facebook Page, if applicable. |
| `city`<br> _string_ | The city where the business represented by the Facebook Page is located. |
| `country`<br> _string_ | The country where the business represented by the Facebook Page is located. |
| `latitude`<br> _float_ | The latitude of the business represented by the Facebook Page. |
| `longitude`<br> _float_ | The longitude of the business represented by the Facebook Page. |
| `state`<br> _string_ | The state where the business represented by the Facebook Page is located. |
| `street`<br> _string_ | The street on which the business represented by the Facebook Page is located. |
| `zip`<br> _int_ | The postal code of the business represented by the Facebook Page. |
| `name`<br> _string_ | The name of the Facebook Page. |
| `verification_status`<br> _string_ | The [verification status of the Facebook Page](https://www.facebook.com/help/1288173394636262) that represents a business, `blue_verified` or `not_verified`. |

## Limitations

- The `GET /search?type=place` endpoint is deprecated in v8.0+ and in all versions on Nov. 2, 2020.
- This endpoint does not return a Page's profile picture. Please see the [Page Reference](https://developers.facebook.com/docs/graph-api/reference/page/picture/) for information on getting a Page's profile picture.
- Alias-based searches are not strongly supported and might not return pages that have a low fan following.

## Learn More

- [Branded Content Guide](https://developers.facebook.com/docs/marketing-api/guides/branded-content)

- [Getting Started Guide](https://developers.facebook.com/docs/pages/)

- [@Mention Guide](https://developers.facebook.com/docs/pages/mentions)

- [Page Locations Reference Doc](https://developers.facebook.com/docs/graph-api/reference/page/locations)

- [Page Reference Doc](https://developers.facebook.com/docs/graph-api/reference/page/)

- [Rate Limit Guide](https://developers.facebook.com/docs/graph-api/overview/rate-limiting)


On This Page

[Search for a Page](https://developers.facebook.com/docs/pages-api/search-pages/#search-for-a-page)

[Before You Start](https://developers.facebook.com/docs/pages-api/search-pages/#before-you-start)

[Sample Request](https://developers.facebook.com/docs/pages-api/search-pages/#sample-request)

[Sample Response](https://developers.facebook.com/docs/pages-api/search-pages/#sample-response)

[Fields](https://developers.facebook.com/docs/pages-api/search-pages/#fields)

[Limitations](https://developers.facebook.com/docs/pages-api/search-pages/#limitations)

[Learn More](https://developers.facebook.com/docs/pages-api/search-pages/#learn-more)