---
url: https://developers.facebook.com/docs/pages-api/integrity-webhook
title: Page Integrity API & Webhook - Facebook Pages API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fpages-api%2Fintegrity-webhook%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook#page-integrity-api---webhook)

[How It Works](https://developers.facebook.com/docs/pages-api/integrity-webhook#how-it-works)

[Before You Start](https://developers.facebook.com/docs/pages-api/integrity-webhook#before-you-start)

[Limitations](https://developers.facebook.com/docs/pages-api/integrity-webhook#limitations)

[Integrity Fields Available via the Page Integrity API and Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook#integrity-fields-available-via-the-page-integrity-api-and-webhook)

[Page Integrity API](https://developers.facebook.com/docs/pages-api/integrity-webhook#page-integrity-api)

[Sample Request](https://developers.facebook.com/docs/pages-api/integrity-webhook#sample-request)

[Page Integrity Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook#page-integrity-webhook)

[Example webhook: New Violation](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--new-violation)

[Example webhook: New Violation and Restrictions](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--new-violation-and-restrictions)

[Example webhook: New Restriction for Suspended Page](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--new-restriction-for-suspended-page)

[Example webhook: Restriction is Lifted](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--restriction-is-lifted)

[Example webhook: Administrator Requests an Appeal](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--administrator-requests-an-appeal)

[Example webhook: Appeal Is Resolved](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--appeal-is-resolved)

[See Also](https://developers.facebook.com/docs/pages-api/integrity-webhook#see-also)

# Page Integrity API & Webhook

As pages interact with users on various Meta apps, Meta may
[flag pages for violating](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.meta.com%2Fenforcement%2Fdetecting-violations%2F&h=AUAM6t-DIjMZeg6azSc02djl2HEmqqqiQgSg91yPEFRuTA7jcuCBR1vILFxu-830IFt-YOb1Z4HPu6fgQYMFGdL0e06bFHJYpkSz6yR4PSIqS_is8ImF4bIREouaBcEMJqufHy90enUIKw)
the various
[community standards](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.meta.com%2Fpolicies%2Fcommunity-standards%2F&h=AUARaULkUZMRYlgaMCauSrzXCQvDg6IxdiR2kdsK3rQmkkm8AGnH7HOsVVahZgjmdM8g26PMAM7WEFpDAdeU5yuKBixSSf6EpyjtgNtxhmj8t8ClHOk7zijlpaO6cYBz7ZMVD9kfijLXiA)
and other
[policies](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.meta.com%2Fpolicies%2F&h=AUD230tvRHpKbfWaUTdk5fYHUNNsLHvfnmrA8Sb85apvt1YVHdtv6ACu_jx8QgOM4ZOhrTb3CNFhHYUI-D4GYgH-45V6q048WSbfUC4EUtfP3dV4u2OaoT1VJRXObgzK4am4R_VpAK0wlg).
When violations are detected, Meta may warn or restrict pages from performing various actions. Restrictions may range from not being able to change the name of a page for a few days to more severe ones, such as being unable to message users, use Meta platform APIs, or having the page completely disabled and unpublished.


The APIs documented in this page provide apps with API access to the integrity status of a page, any violation(s) for which a page has been flagged, restrictions that Meta has applied because of the violation(s), along with recommended material to educate the page administrators on the violation, restriction, what actions they can take to resolve the restriction, and how to prevent them in the future.


## How It Works

1. The page interacts with users on Meta's apps (e.g., Facebook).

2. Meta flags the page for one or more violations of Meta's
    [Community Standards](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.meta.com%2Fpolicies%2Fcommunity-standards%2F&h=AUBIyGx8tD2HamVX7CaeBDWy1pbd-syPeFvgLR7l_cVVuC9epFQv27lu2ZVJfgfjVs2L_2eOo5U0egXmzrbNLhvLC6uWf-rgUDhze1Ixn2yVmThvD1Tw_SQl1wKblk6ybQccjhJHHrieMg) and may apply one or more restrictions depending on the violation.
    - a. webhook is triggered to the subscribed third-party app with the violation and/or restriction.
3. The third-party app can notify the page administrator of the violation and/or restriction.

4. The page administrator logs in to the third-party app to see more information about the violation and recommended actions.
   - a. The third-party app retrieves the additional information from the Page Integrity API.
5. The page administrator is redirected to various Meta surfaces (Page Status, Business Support Home, Business Help Center, Developer Support) to learn more about the violation, file an appeal, file support tickets, etc.

6. The app repeats steps 2.a (Integrity Webhook) and 4.a (Integrity API) to keep the page administrator updated on the latest integrity status.


![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1448856746850217&version=1769816304)

## Before You Start

This guide assumes you have set up your webhooks server to receive notifications and subscribed to the **business\_integrity** field.

You need the following:

- The ID for the Page sending the message

- A Page access token from your app user

- Your app user has granted your app the `pages_manage_metadata` permission


### Limitations

- The webhook provide information only for Pages you have access to with the required permissions


## Integrity Fields Available via the Page Integrity API and Webhook

- **id** \- the page ID for which the information is provided

- **timestamp** \- the time of the request and when the information was retrieved

- **status** \- the current integrity status of the page. It can be:


  - **ok** \- the page is OK, with no active violations or restrictions

  - **warning** \- the page is not restricted but may be restricted soon due to potential violations

  - **restricted** \- the page is currently restricted because of one or more violations

  - **suspended** \- the page is suspended due to severe violations


- **violations** \- the list of active violations for the page


  - **type** \- the type of violation corresponding to the [community standards](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.meta.com%2Fpolicies%2Fcommunity-standards%2F&h=AUDaBy49AfTS3825-_RcRt01E8dso_fR1kIOM49gCsjzW8j52ZFohvB7hA2UxXORTMSPfw_fMuj3kVCnB8loS0B6vpmJA1tEvxy1zD2pvATpYfEgAq8K-htLyJ1Hvy_VcnmvtvXglMWuSg)

  - **description** \- user-friendly short description of the violation

  - **url** \- the link where to learn more about the violation


- **restrictions** \- the list of active restrictions of the page


  - **feature** \- the restricted feature. This can be one of:


    - **page\_publish** \- this feature means the page is unpublished from Meta's platform due to serious violations.

    - **page\_read\_only** \- an enforcement action that prevents the page from posting new content or making changes for a specified period of time.

    - **page\_messaging** \- this feature limit blocks the Page from sending any messages to users via Messenger

    - **page\_messaging\_api** \- this feature blocks the Page from sending messages via the Messenger Platform API


  - **description** \- user-friendly short description of the restriction

  - **status** \- current status of the restriction. This can be one of:


    - **RESTRICTED** \- the restriction is currently enforced

    - **UNRESTRICTED** \- the restriction is currently not enforced


  - **applied\_time** \- the time when the restriction was applied

  - **expiration\_time** \- the time when the restriction will expire


- **recommended\_actions** \- the list of recommended actions for the page administrators


  - **action\_type** \- the type of action that the business can take. This can be one of:


    - **LEARN\_MORE** \- action with a link to an article where the admin can learn more about the violation, restriction, and what to do next.

    - **FILE\_APPEAL** \- an action with a link to the Page Status or Business Support Home website where the administrator can file an appeal.

    - **SUPPORT\_TICKET** \- an action with a link where the administrator or developer can file a support ticket.


  - **url** \- the link where the admin should be redirected for the recommended action. This can be one of:


    - Link to Meta's Page Status

    - Link to Business Support Home

    - Link to Business Help Center

    - Link to Developer Support Page


  - **violation\_type** \- the violation that caused the restriction to be applied.


- **actions\_events**

  - **type** \- the type of action. This can be one of:


    - **LEARN\_MORE** \- action with link to an article where the admin can learn more about the violation, restriction, and what to do next

    - **FILE\_APPEAL** \- an action with a link to the Page Status or Business Support Home website where the administrator can file an appeal.

    - **SUPPORT\_TICKET** \- an action with a link where the administrator or developer can file a support ticket.


  - **status** \- the status of the action


    - **OPEN** \- the action (e.g. support ticket or appeal) has been created

    - **PENDING** \- the action is still pending (e.g. being reviewed). This will only be available for the GET API (not webhook).

    - **CLOSED** \- the action has been resolved or closed


  - **created\_time** \- the time when the action was taken (e.g. ticket created, appeal filed)

  - **updated\_time** \- the last time the action was updated


## Page Integrity API

The page integrity API is the main API for providing integrity information about a page. This includes the overall status, the active violations, the active restrictions applied due to the violations, recommended actions to be taken by the page administrators, and the latest status on the most recent actions that were previously taken by the page.


### Sample Request

To get the latest integrity information about a page, make a GET request to the `/pages_status` API.


```json
curl -X GET "https://graph.facebook.com/v24.0/{PAGE_ID}/page_status?access_token={ACCESS_TOKEN}"
```

On success, your app receives the JSON response with all the integrity information about the page:


```json
{
  "id": "{PAGE_ID}",
  "timestamp": 1763665904,
  "status": "restricted",
  "violations": [\
    {\
      "type": "SPAM",\
      "description": "Page posted content that violates spam policies.",\
      "url": "https://www.facebook.com/policy/spam"\
    }\
  ],
  "restrictions": [\
    {\
      "feature": "page_messaging_api",\
      "description": "This page is restricted from sending messages via Messenger Platform for 3 days",\
      "applied_time": 1763665904,\
      "expiration_time": 1763675775,\
      "violation_type": [\
        "SPAM"\
      ]\
    },\
    {\
      "feature": "page_publish",\
      "description": "We suspended your Page",\
      "applied_time": 1763665904,\
      "expiration_time": 1763675775,\
      "violation_type": [\
        "SPAM"\
      ]\
    }\
  ],
  "recommended_actions": [\
    {\
      "action_type": "FILE_APPEAL",\
      "url": "https://www.facebook.com/help/contact/appeal",\
      "violation_type": [\
        "SPAM"\
      ]\
    }\
  ],
  "actions_events": [\
    {\
      "type": "FILE_APPEAL",\
      "status": "OPEN",\
      "created_time": 1763666000,\
      "updated_time": 1763667000,\
      "violation_type": [\
        "SPAM"\
      ]\
    }\
  ]
}
```

## Page Integrity Webhook

The page integrity webhook provides the same information as the Page Integrity API but it does so with incremental events that can be used to notify the page administrator of any integrity updates (e.g. new violations, restrictions, resolutions, action updates) in real-time.


To get real-time integrity updates, the app needs to set up webhooks and subscribe to the **business\_integrity** field. The page should have granted the necessary `pages_manage_metadata` permission


When a violation or restriction occurs, your webhook will receive a payload similar to the following:


### Example webhook: New Violation

The following webhook shows an example of a page status being changed to restricted due to a cybersecurity violation.

```json
{
 "object": "page",
 "entry": [\
   {\
     "time": 1761804073668,\
     "id": "{PAGE_ID}",\
     "messaging": [\
       {\
         "timestamp": 1761803759,\
         "status": "restricted",\
         "violations": [\
           {\
             "type": "CYBERSECURITY",\
             "description": "The Page may try to gather sensitive information from others.",\
             "url": "https://www.transparency.meta.com/policies/community-standards/cybersecurity/"\
           }\
         ]\
       }\
     ]\
   }\
 ]
}
```

### Example webhook: New Violation and Restrictions

The following response shows an example of a page being restricted from sending messages via the Messaging APIs due to a SPAM violation.

```json
{
  "object": "page",
  "entry": [\
    {\
      "time": 1760978707275,\
      "id": "{PAGE_ID}",\
      "messaging": [\
        {\
          "timestamp": 1760977876,\
          "status": "ok",\
          "violations": [\
            {\
              "type": "SPAM",\
              "description": "We don't allow people to take actions at high volume that might bother others.",\
              "url": "https://transparency.meta.com/policies/community-standards/spam/"\
            }\
          ]\
        }\
      ],\
      "restrictions": [\
        {\
          "feature": "page_messaging_api",\
          "status": "RESTRICTED",\
          "description": "This page is restricted from sending messages via Messenger Platform for 1 day",\
          "applied_time": 1760977876,\
          "expiration_time": 1761064276\
        },\
        {\
          "feature": "page_messaging",\
          "status": "RESTRICTED",\
          "description": "This page is restricted from sending messages via Messenger Platform for 1 day",\
          "applied_time": 1760977876,\
          "expiration_time": 1761064276\
        }\
      ]\
    }\
  ]
}
```

### Example webhook: New Restriction for Suspended Page

The following webhook shows an example of a page being suspended / unpublished from Meta's apps.

```json
{
  "object": "page",
  "entry": [\
    {\
      "time": 1761251584556,\
      "id": "{PAGE_ID}",\
      "messaging": [\
        {\
          "timestamp": 1761251502,\
          "status": "suspended",\
          "violations": [\
            {\
              "type": "NUDITY",\
              "description": "The Page may show nudity.",\
              "link": "https://www.meta.com/policies/community-standards/adult-nudity-sexual-activity/"\
            }\
          ],\
          "restrictions": [\
            {\
              "feature": "page_publish",\
              "status": "RESTRICTED",\
              "description": "We suspended your Page",\
              "applied_time": 1761251502\
            }\
          ]\
        }\
      ]\
    }\
  ]
}
```

### Example webhook: Restriction is Lifted

The following webhook shows an example of a page restriction being lifted and the page is now able to send messages via the Messaging API.

```json
{
  "object": "page",
  "entry": [\
    {\
      "time": 1760978542664,\
      "id": "{PAGE_ID}",\
      "messaging": [\
        {\
          "timestamp": 1760978516,\
          "status": "ok",\
          "restrictions": [\
            {\
              "feature": "page_messaging_api",\
              "status": "UNRESTRICTED",\
              "description": "this page is no longer restricted from sending messages",\
              "applied_time": 1760978516\
            }\
          ]\
        }\
      ]\
    }\
  ]
}
```

### Example webhook: Administrator Requests an Appeal

The following example shows the page getting a webhook notification after filing a new appeal with Meta.

```json
{
 "object": "page",
 "entry": [\
   {\
     "time": 1761672505662,\
     "id": "{PAGE_ID}",\
     "messaging": [\
       {\
         "timestamp": 1761672452,\
         "status": "restricted",\
         "action_events": [\
           {\
             "type": "FILE_APPEAL",\
             "status": "OPEN",\
             "created_time": 1761672452,\
             "updated_time": 1761672452\
           }\
         ]\
       }\
     ]\
   }\
 ]
}
```

### Example webhook: Appeal Is Resolved

The following webhook shows an example of the appeal being resolved after Meta finished reviewing it. This may or may not remove the restriction, but the webhook lets the administrator know that the appeal is no longer in progress.

```json
{
 "object": "page",
 "entry": [\
   {\
     "time": 1761672786564,\
     "id": "{PAGE_ID}",\
     "messaging": [\
       {\
         "timestamp": 1761672720,\
         "status": "restricted",\
         "action_events": [\
           {\
             "type": "FILE_APPEAL",\
             "status": "CLOSED",\
             "created_time": 1761672452,\
             "updated_time": 1761672720\
           }\
         ]\
       }\
     ]\
   }\
 ]
}
```

## See Also

- [Community Standards](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.meta.com%2Fpolicies%2Fcommunity-standards%2F&h=AUBXG7YIcHkU2NINIxqa-ybanBSYdRlbo6WAvqUS-i2DjbpuJDHUKNeWCNwHEWlzpzgUAMloX54VPO92j4gfz4nAcrN3rz-BJmMsHT6Z-OUhrjzhRmIfDRCJolZWHhk1Y0UkGgIC8VIscA)

- [Detecting Violations](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.meta.com%2Fenforcement%2Fdetecting-violations%2F&h=AUCX51wEIYyE1KMurbS3xH4EgOZv8Z7X04OU8P2PEPUEQ5g78vaQ1jRvuAInuHYK_m_Q6DWgzH_5-PdPoBKWqlqUCMRlkI8aDeZEHGLgxdP864QipmVdvIpkT6zv9jbhIhui-CF8H6ShFw)

- [Webhooks Documentation](https://developers.facebook.com/docs/graph-api/webhooks/)

- [Page Access Tokens](https://developers.facebook.com/docs/pages/access-tokens)


On This Page

[Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook#page-integrity-api---webhook)

[How It Works](https://developers.facebook.com/docs/pages-api/integrity-webhook#how-it-works)

[Before You Start](https://developers.facebook.com/docs/pages-api/integrity-webhook#before-you-start)

[Limitations](https://developers.facebook.com/docs/pages-api/integrity-webhook#limitations)

[Integrity Fields Available via the Page Integrity API and Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook#integrity-fields-available-via-the-page-integrity-api-and-webhook)

[Page Integrity API](https://developers.facebook.com/docs/pages-api/integrity-webhook#page-integrity-api)

[Sample Request](https://developers.facebook.com/docs/pages-api/integrity-webhook#sample-request)

[Page Integrity Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook#page-integrity-webhook)

[Example webhook: New Violation](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--new-violation)

[Example webhook: New Violation and Restrictions](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--new-violation-and-restrictions)

[Example webhook: New Restriction for Suspended Page](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--new-restriction-for-suspended-page)

[Example webhook: Restriction is Lifted](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--restriction-is-lifted)

[Example webhook: Administrator Requests an Appeal](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--administrator-requests-an-appeal)

[Example webhook: Appeal Is Resolved](https://developers.facebook.com/docs/pages-api/integrity-webhook#example-webhook--appeal-is-resolved)

[See Also](https://developers.facebook.com/docs/pages-api/integrity-webhook#see-also)