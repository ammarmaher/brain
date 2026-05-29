---
url: https://developers.facebook.com/docs/business-management-apis/businessmanager/support
title: Support - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2Fbusinessmanager%2Fsupport%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)

On This Page

[Support](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#support)

[Business Manager Questions](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#business-manager-questions)

[Permissions Questions](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#permissions-questions)

[More Questions](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#more-questions)

[Resources](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#resources)

# Support

## Business Manager Questions

[Why use Business Manager?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_589523284888993)

Facebook user accounts only have a single personal ad account. If you need additional ad accounts you should use Business Manager. Facebook no longer creates gray-accounts for anyone needing new, additional ad accounts.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_589523284888993)

[Do I need a Facebook Page?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_872248183107106)

To set up a Business Manager you need a Facebook page that represents your business. The page needs to be not owned by any other business

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_872248183107106)

[How do I access Business Manager APIs?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_439412163553622)

You need `ads_management`, `pages_read_engagement`, and [`business_management`](https://developers.facebook.com/docs/marketing-api/business-manager-api/) permission permissions from any clients to manage their ad accounts and pages. When you set up a Business Manager, you should claim your app or add your app to your Business Manager account using the App Advanced Settings panel.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_439412163553622)

[How is our app on Marketing API associated with a Business Manager?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_357787315091162)

Associate an app to your business under app settings in [developers.facebook.com](https://developers.facebook.com/). See [App Development](https://developers.facebook.com/docs/development/). Then you can use the [Marketing API](https://developers.facebook.com/docs/marketing-apiss).

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_357787315091162)

[Does our Business Manager need access to self-service accounts when clients run ads from their own accounts and use their own lines of credit?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_862567630748839)

You may need to for agencies or direct brand clients. If they authorize your app, you can take actions on their behalf, including reports and stats pulls. If you need long term access, without cleints logging into your app, you should ask them to grant your Business Manager the roles you need. You can then assign that role to your own system users. Typically you need the `Advertiser` roles from clients.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_862567630748839)

[When I request Connection Objects I get both personal assets and business assets. Can I limit the response to business assets only?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_296592764613841)

Yes. Pass the `business_id` parameter into the call with the appropriate Business ID. You can find more information about this in [Connection Objects](https://developers.facebook.com/docs/reference/ads-api/businessmanager#connection-objects).

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_296592764613841)

[To run app ads what do I provide in the advertiser accounts field in \`app settings\`?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_550022105521461)

Enter the Ad Account IDs to promote your app. This grant users access to those Ad Accounts using Business Manager and other Facebook tools.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_550022105521461)

[Can I add more than 25 ad accounts to a user?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_364900647475087)

No. Adding ad accounts to a user at `AD_ACCOUNT_ID/assigned_users` bypasses this limit. See [Business Manager, Ad Accounts](https://developers.facebook.com/docs/reference/ads-api/businessmanager#adaccounts-add-people).

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_364900647475087)

[Can I set my ad account to get no credit for my business credit line?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_2204100083003003)

Disable it from getting credit in [Ads Manager](https://www.facebook.com/ads/manager/accounts). There is no API support for this.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_2204100083003003)

## Permissions Questions

[Can people outside of a Business Manager be given access to reports for its ad accounts?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_424245685074451)

Yes. The Business should grant these people access to those ad accounts.

You can also grant permissions to another business with business-to-business permissions. Once a business has permissions to the ad accounts, their admin can then give permission to it's employees up to the permission level granted.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_424245685074451)

[Can I pass on permissions given to my Business to another Business?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_428681047967169)

You cannot relay permissions given to your Business to another Business.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_428681047967169)

[When someone uses Business Manager (https://business.facebook.com) and creates new ad account, do system users automatically get permissions to handle them?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_522725241591817)

No. Even though the admin system user can create ad accounts it won't automatically have access to any ad account in the business. Business admins or Admin system users have to assign roles for users or system users with Facebook tools or APIs.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_522725241591817)

## More Questions

[What is the difference between a user and a system user?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_416140272517883)

User represents real people taking an action, while a system user represents a machine taking action. Software action should be done through a system user.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_416140272517883)

[What permissions do I use for deferred user actions?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_356065691922031)

You should use business to business permissions which are long-term or use long-live user tokens. Business permissions has the ability for one business to give another business permissions to manage their business and the assets owned by that business.

Business permissions are [documented](https://developers.facebook.com/docs/reference/ads-api/businessmanager#b2b) here.

Long-lived user tokens are [documented](https://developers.facebook.com/docs/facebook-login/access-tokens/refreshing#long-via-code) here.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_356065691922031)

[Is system user a real user?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_666543703798630)

A system user is a machine or software taking programmatic action on behalf a business. You cannot use it Facebook, and it is associated with your Business Manager for greater security.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_666543703798630)

[When do I use system user admin versus system user?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_384116919104208)

An admin system user has access to everything in the business and there is only one admin system user per business. System users can have access restrictions set by the admin system user.

When you manage actual permissions for the business itself you should use the admin system user. For example use this when you grant a new employee permissions to appropriate assets. For all other actions such as creating ads for a specific ad account, you should use system user. System users have a higher level of security because, if compromised, they can only access what they are assigned.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_384116919104208)

[Can I manage a multiple accounts and create campaigns and ads if the accounts are claimed with AGENCY \`access\_type\` with one Business Manager access token?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_2333462656926490)

Access tokens are by user account, therefore any ad account they have general or admin access to will allow you to create campaigns, ads, and so on. This is regardless of whether the account is direct or agency.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_2333462656926490)

[What are the rate limits for system users? Will one system user be able to replace multiple gray users for automated actions?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_1369565839835176)

Rate limits for System Users are grouped by ad account and not by user.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_1369565839835176)

[Do our existing app secrets remain the same?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_819219285130173)

Yes.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_819219285130173)

[What access token do I need to create a system user?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_1284227928419842)

Create the system user and fetch its token using the [Business Manager](https://business.facebook.com/), under `Settings | System User`. You see this option if your Business owns an app that has ads-api access, or you own an app that is whitelisted by Facebook.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_1284227928419842)

[We manage all ad accounts for clients. Can we use the system user token for ad hoc API requests?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_1924677924308756)

You use a user token whenever an individual person is taking an action, and the system user token for machine initiated actions.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_1924677924308756)

[How many system users should I have?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_2283810288533996)

You can logically group ad accounts per system user based on your client or your read/write model. If you have many ad accounts, loading all of them in the UI may be slow.

You should create one system user for each set of 'access types' you need. And you should use the admin system user to maintain the right roles programmatically. You can be more certain that if a regular system user token is compromised, it has limited scope and cannot compromise more permissions. You should carefully safeguard your admin system user.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_2283810288533996)

[Why claim a page as an agency? What kind of access do would grant?](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_2695919373784081)

You can ask for access from a someone as a business owner or as an agency for the business. This enables you to target ads at people who like a third-party's page. You should use `AGENCY` only when you need access to another business's Page, and don't technically or legally own it.

For agency and Facebook Marketing Partners, you should get the client to _authorize_ your business by using an agency request. You can ask for any roles for the page. If you're advertising, you should get the "ADVERTISER" and "INSIGHTS\_ANALYST" roles. If you need to publish to the page beyond unpublished page posts, you should request additional roles. In your Business Manager you should assign each user only one role that is appropriate with their responsibilities.

[Permalink](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#faq_2695919373784081)

## Resources

- [Access](https://developers.facebook.com/docs/reference/ads-api/access) and [Authentication](https://developers.facebook.com/docs/marketing-apis/overview/authentication)
- [Business Asset Management](https://developers.facebook.com/docs/marketing-api/businessmanager/assets)
- [System User APIs](https://developers.facebook.com/docs/reference/ads-api/business-api-calls)
- [Business Manager Best Practices](https://developers.facebook.com/docs/reference/ads-api/businessmanager-bestpractice)

On This Page

[Support](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#support)

[Business Manager Questions](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#business-manager-questions)

[Permissions Questions](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#permissions-questions)

[More Questions](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#more-questions)

[Resources](https://developers.facebook.com/docs/business-management-apis/businessmanager/support#resources)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close