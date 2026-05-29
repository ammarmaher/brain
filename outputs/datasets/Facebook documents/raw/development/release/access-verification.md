---
url: https://developers.facebook.com/docs/development/release/access-verification
title: Access Verification - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Frelease%2Faccess-verification%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)
- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)
- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)
- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)
- [Release](https://developers.facebook.com/docs/development/release)


  - [Access Levels](https://developers.facebook.com/docs/graph-api/overview/access-levels)
  - [Access Verification](https://developers.facebook.com/docs/development/release/access-verification)
  - [Business Verification](https://developers.facebook.com/docs/development/release/business-verification)

- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Access Verification](https://developers.facebook.com/docs/development/release/access-verification#access-verification)

[Which businesses require access verification?](https://developers.facebook.com/docs/development/release/access-verification#which-businesses-require-access-verification-)

[Permissions](https://developers.facebook.com/docs/development/release/access-verification#permissions)

[Verification Check](https://developers.facebook.com/docs/development/release/access-verification#verification-check)

[How to complete access verification](https://developers.facebook.com/docs/development/release/access-verification#how-to-complete-access-verification)

[Prerequisites](https://developers.facebook.com/docs/development/release/access-verification#prerequisites)

[Existing Business](https://developers.facebook.com/docs/development/release/access-verification#existing-business)

[Losing Verified Status](https://developers.facebook.com/docs/development/release/access-verification#losing-verified-status)

[See Also](https://developers.facebook.com/docs/development/release/access-verification#see-also)

# Access Verification

To ensure that only [businesses](https://business.facebook.com/) with a legitimate use case can access another business's business data, some API endpoints perform a [verification check](https://developers.facebook.com/docs/development/release/access-verification#verification-check) when called by an app that has been created or claimed by a business, or by a [business app](https://developers.facebook.com/docs/development/create-an-app/app-dashboard/app-types#business) that has yet to be connected to a business. If the business that created, claimed, or is connected to the app has been verified as a [Tech Provider](https://developers.facebook.com/docs/development/release/tech-providers), the endpoints will process the request normally. If the business has not been verified as a Tech Provider, however, the endpoints will reject the call and return an error.

Access verification is the process we use to determine if a business operates as a Tech Provider.

## Which businesses require access verification?

Any business that has created or claimed an app that will be used by other businesses and requires any of the permissions listed below must be verified as a Tech Provider before other businesses can use the app.

Note that access verification is independent of [App Review](https://developers.facebook.com/docs/resp-plat-initiatives/app-review) and permission [access levels](https://developers.facebook.com/docs/graph-api/overview/access-levels).

## [Permissions](https://developers.facebook.com/docs/permissions/)

|     |     |
| --- | --- |
| - `ads_management`<br>- `ads_read`<br>- `attribution_read`<br>- `business_management`<br>- `catalog_management`<br>- `facebook_creator_marketplace_discovery`<br>- `instagram_basic`<br>- `instagram_business_basic`<br>- `instagram_business_content_publish`<br>- `instagram_content_publish`<br>- `instagram_creator_marketplace_discovery`<br>- `instagram_manage_insights`<br>- `leads_retrieval`<br>- `manage_app_solution`<br>- `page_events`<br>- `pages_manage_ads`<br>- `pages_manage_cta`<br>- `pages_manage_engagement` | - `pages_manage_instant_articles`<br>- `pages_manage_posts`<br>- `pages_read_engagement`<br>- `pages_read_user_content`<br>- `pages_show_list`<br>- `pages_utility_messaging`<br>- `publish_video`<br>- `read_insights`<br>- `threads_basic`<br>- `threads_content_publish`<br>- `threads_keyword_search`<br>- `threads_manage_insights`<br>- `threads_manage_mentions`<br>- `threads_manage_replies`<br>- `threads_read_replies`<br>- `whatsapp_business_management` |

## Verification Check

When an app claimed by a business calls an endpoint that requires any of the permissions listed above, the endpoint first checks if the person who granted the permission has a [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on the app itself. If the person **does** have a role on the app, the endpoint accepts the call and continues processing the request.

If the person **does not** have a role on the app, however, the endpoint checks if the app's claimant business has been verified as a Tech Provider. If the business has been verified as a Tech Provider, the endpoint processes the request normally, otherwise, it rejects the call and returns the following error:

- Error code: `100`
- Description: `Unsupported get request. Object with ID` <OBJECT\_ID> `does not exist, cannot be loaded due to missing permissions, or does not support this operation.`

Refer to the [Marketing API Error Codes](https://developers.facebook.com/docs/marketing-api/error-reference) documentation for more information about error codes.

Note that the verification check is performed on the app's claimant business but is only triggered when an app it has claimed calls an endpoint that has implemented the verification check. This means that once a business has been verified as a Tech Provider, any apps that it claims will pass the verification check.

## How to complete access verification

[Business admins](https://www.facebook.com/business/help/442345745885606) of an unverified Tech Provider business that claims a new app will receive an email notification about the access verification requirement whenever an [app administrator](https://developers.facebook.com/docs/development/build-and-test/app-roles#administrator) requests [Advanced Access](https://developers.facebook.com/docs/graph-api/overview/access-levels#advanced-access) for any of the permissions listed above.

The email will include a link to the verification form, but the form can also be accessed from the [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard) by navigating to the **Basics** \> **Verifications** \> **Access verification** panel.

To complete verification, any person with Admin access on the business must categorize and describe how the business uses other businesses' data to provide a service for those businesses.

Once a business admin has completed the process a decision will be made within approximately 5 days.

If the business is verified as a Tech Provider, business admins will receive a confirmation email and app admins will receive a confirmation developer alert. Verified businesses won't have to verify again, however, under certain conditions a business may temporarily [lose its verified status](https://developers.facebook.com/docs/development/release/access-verification#losing-verified-status).

If the business is denied Tech Provider verification, business admins will receive a rejection email and app admins will receive a rejection developer alert, and all calls to endpoints that require the permissions above will fail if the app user has no [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on the calling app.

If the rejected businesses's use case changes, a business admin may complete the process again to be reconsidered.

### Prerequisites

Before a business admin can begin the access verification process:

- a business admin must complete [Business Verification](https://developers.facebook.com/docs/development/release/business-verification)
- there must be no [restrictions](https://www.facebook.com/business/help/422289316306981) on the business account

## Existing Business

Admins of businesses that have already claimed apps that are used by other businesses and require any of the permissions above will automatically be sent an email about the access verification requirement. App administrators will also receive a developer alert about this requirement.

Once the email has been sent, business admins will have 60 days to complete the verification process. If the process is not completed within 60 days, all calls to endpoints that require any of the permission above will gradually be subjected to [verification checks](https://developers.facebook.com/docs/development/release/access-verification#verification-check).

## Losing Verified Status

A business that has been verified as a Tech Provider will be considered unverified under these conditions:

- The business's [verification](https://developers.facebook.com/docs/development/release/business-verification) status changes to **unverified**
- The app becomes disconnected from the business that created or claimed it
- The business account becomes [restricted](https://www.facebook.com/business/help/422289316306981)

Once these conditions are reversed the business will automatically be considered to be a verified Tech Provider again.

## See Also

- [Tech Providers](https://developers.facebook.com/docs/development/release/tech-providers)

On This Page

[Access Verification](https://developers.facebook.com/docs/development/release/access-verification#access-verification)

[Which businesses require access verification?](https://developers.facebook.com/docs/development/release/access-verification#which-businesses-require-access-verification-)

[Permissions](https://developers.facebook.com/docs/development/release/access-verification#permissions)

[Verification Check](https://developers.facebook.com/docs/development/release/access-verification#verification-check)

[How to complete access verification](https://developers.facebook.com/docs/development/release/access-verification#how-to-complete-access-verification)

[Prerequisites](https://developers.facebook.com/docs/development/release/access-verification#prerequisites)

[Existing Business](https://developers.facebook.com/docs/development/release/access-verification#existing-business)

[Losing Verified Status](https://developers.facebook.com/docs/development/release/access-verification#losing-verified-status)

[See Also](https://developers.facebook.com/docs/development/release/access-verification#see-also)