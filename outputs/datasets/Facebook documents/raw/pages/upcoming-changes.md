---
url: https://developers.facebook.com/docs/pages/upcoming-changes
title: Upcoming Changes - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages%2Fupcoming-changes%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Page Upcoming Changes API](https://developers.facebook.com/docs/pages/upcoming-changes#page-upcoming-changes-api)

[Before You Start](https://developers.facebook.com/docs/pages/upcoming-changes#before-you-start)

[Get Proposed Changes](https://developers.facebook.com/docs/pages/upcoming-changes#get-proposed-changes)

[Accept or Reject a Proposed Change](https://developers.facebook.com/docs/pages/upcoming-changes#accept-or-reject-a-proposed-change)

[Page Change Webhooks](https://developers.facebook.com/docs/pages/upcoming-changes#page-change-webhooks)

[Reference](https://developers.facebook.com/docs/pages/upcoming-changes#reference)

[Webhooks](https://developers.facebook.com/docs/pages/upcoming-changes#webhooks)

[Page Change Proposal Categories](https://developers.facebook.com/docs/pages/upcoming-changes#page-change-proposal-categories)

[See Also](https://developers.facebook.com/docs/pages/upcoming-changes#see-also)

# Page Upcoming Changes API

This document explains how to use the Page Upcoming Changes API to view and accept or reject changes suggested by Facebook to fix possible errors on your Facebook Page.

## Before You Start

You will need:

- the [`pages_manage_metadata` permission](https://developers.facebook.com/docs/pages/overview-1#permissions)

- a [Page access token](https://developers.facebook.com/docs/pages/access-tokens/) requested by a person who is able to perform the [`MODERATE` task](https://developers.facebook.com/docs/pages/access-tokens#page-tasks) on the Page that is being queried


## Get Proposed Changes

Send a `GET` request to the `/{page-id}`:

```code
curl -i -X GET "https://graph.facebook.com/{page-id}
    ?access_token={page-access-token}"
```

On success, your app receives the following response:

```code
{
  "data": [\
    {\
      "id": "{proposed-change-1-id}",\
      "page": {\
        "name": "My Page",\
        "id": "{page-id}"\
      },\
      "effective_time": "2017-10-16T10:19:49+0000",\
      "timer_status": "stopped",           //this proposal was accepted or rejected\
      "change_type": "knowledge_proposal",\
      "proposal": {\
        "id": "1570719759662530",\
        "category": "category",\
        "current_value": "273819889375819, 161516070564222, 152142351517013",\
        "proposed_value": "273819889375819, 161516070564222, 152142351517013, 273819889375819"\
      }\
    },\
    {\
      "id": "{proposed-change-2-id}",\
      "page": {\
        "name": "My Page",\
        "id": "{page-id}"\
      },\
      "effective_time": "2017-11-21T07:03:54+0000",\
      "timer_status": "already_fired",   //this proposal was automatically accepted\
      "change_type": "knowledge_proposal",\
      "proposal": {\
        "id": "1603101113091061",\
        "category": "category",\
        "current_value": "273819889375819, 161516070564222, 152142351517013",\
        "proposed_value": "273819889375819, 161516070564222, 152142351517013, 273819889375819",\
        "acceptance_status": "accepted"\
      }\
    }\
  ]
}
```

## Accept or Reject a Proposed Change

Send a `POST` request to the `/{proposal-id}` endpoint with the `accept` field set to `true` to accept the change or `false` to reject it:

```code
curl -i -X POST "https://graph.facebook.com/{proposal-id}
     ?accept=true
     &access_token={page-access-token}"
```

On success, your app receives the following response:

```code
{
  "succeed": true
}
```

## Page Change Webhooks

[Subscribe](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages) to the `page_upcoming_change` and/or the `page_change_proposal`.

Your callback URL will receive the following notification for the `page_upcoming_change` webhook:

```code
{
  "field": "page_upcoming_change",
  "action": "pending", // can also be accepted_manually, accepted_automatically and rejected_manually
  "value": {
    "id": "123456", // id of upcoming change
    "page": {
      "id": "7878832", // id of page where the action is taken
      "name": "Page Name"
    },
    "effective_time": "2017-03-01 12:00:00",
    "change_type": "knowledge_proposal",
    "timer_status": "active",
    "proposal": {
      "id": "id of the page change proposal",
      "category": "menu link",
      "acceptance_status": "pending", // can also be accepted or rejected
      "current_value": "https://www.oldmenu.com/",
      "proposed_value": "https://www.newmenu.com/"
    }
  }
}
```

Your callback URL will receive the following notification for the `page_change_proposal` webhook:

```code
{
  "field": "page_change_proposal",
  "action": "created",
  "value": {
    "id": "{change-proposal-id}",
    "category": "menu link",
    "current_value": "https://www.menuold.com/",
    "proposed_value": "https://www.menunew.com/",
    "acceptance_status": "pending"
  }
}
```

## Reference

### Webhooks

| Webhook Field | Description |
| --- | --- |
| [`page_change_proposal`](https://developers.facebook.com/docs/graph-api/webhooks/reference/page#page_change_proposal) | Get real-time notifications of proposed changes suggested by Facebook for your Facebook Page. |
| [`page_upcoming_change`](https://developers.facebook.com/docs/graph-api/webhooks/reference/page#page_upcoming_change) | Get real-time notifications about upcoming changes that will occur on your Facebook Page. These changes have been suggested by Facebook and may or may not have a deadline to accept or reject before automatically taking affect. |

### Page Change Proposal Categories

A **Page Change Proposal** is a change proposed for your Page. It contains information such as category, the current page value, and the proposed value.

| Category Name | Parameter | Example Values |
| --- | --- | --- |
| Hotel Booking Service Link | `place_scraped_hotel_booking_website` | Current Value is always `-`, proposed value is a link to a hotel booking service. |
| Business Address | `place_address` | An array with format:<br>`{"street" : "{street-change}",`<br>`"zip" : "{zip-code-change}",`<br>`"city" : "{city-name-change}"}`<br>Only changed fields are shown in the response. |
| Business Type | `page_business_type` | `E-commerce`, `Service Area`, `Public Storefront`, `Workplace`, etc. |
| Category | `place_topic` | `Financial Service`, `Restaurant`, etc. |
| Coordinates | `place_coordinates` | Coordinates of the physical store. |
| Cover Photo | `timeline_cover_photo` | Link of the cover photo. |
| Email | `page_email` | Ex. mypagebiz@email.com |
| Meal Type Served | `place_restaurant_good_for` | `Breakfast`, `Lunch`, `Dinner`, and `Coffee` |
| Menu Link | `place_scraped_menu` | Current Value is always `-`, proposed value is a link to a restaurant's menu. |
| Open Hours | `place_hours` | `Always Open`, `Permanently Closed` or `Hours Not Available` or the values shown in the [`hours` field](https://developers.facebook.com/docs/graph-api/reference/page/). |
| Phone | `page_phone` | Ex. 650-555-1000 |
| Place Price Range | `place_price_range` | `$`, `$$`, `$$$`, `$$$$` |
| General Services Website | `place_scraped_service_website` | Current Value is always `-`. proposed value is a website. |
| Website | `page_website` | Ex. https://MyWebsite.com |

## See Also

- [Page Upcoming Change Reference Guide](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change)


On This Page

[Page Upcoming Changes API](https://developers.facebook.com/docs/pages/upcoming-changes#page-upcoming-changes-api)

[Before You Start](https://developers.facebook.com/docs/pages/upcoming-changes#before-you-start)

[Get Proposed Changes](https://developers.facebook.com/docs/pages/upcoming-changes#get-proposed-changes)

[Accept or Reject a Proposed Change](https://developers.facebook.com/docs/pages/upcoming-changes#accept-or-reject-a-proposed-change)

[Page Change Webhooks](https://developers.facebook.com/docs/pages/upcoming-changes#page-change-webhooks)

[Reference](https://developers.facebook.com/docs/pages/upcoming-changes#reference)

[Webhooks](https://developers.facebook.com/docs/pages/upcoming-changes#webhooks)

[Page Change Proposal Categories](https://developers.facebook.com/docs/pages/upcoming-changes#page-change-proposal-categories)

[See Also](https://developers.facebook.com/docs/pages/upcoming-changes#see-also)