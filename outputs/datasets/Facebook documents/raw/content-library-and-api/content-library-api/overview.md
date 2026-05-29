---
url: https://developers.facebook.com/docs/content-library-and-api/content-library-api/overview
title: Overview - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fcontent-library-api%2Foverview%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Overview](https://developers.facebook.com/docs/content-library-and-api/content-library-api/overview#overview)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/content-library-api/overview#learn-more)

# Overview

Use Meta Content Library API to query and analyze the Meta public content archive. Conduct data analysis in Python or R using [Secure Research Environment](https://developers.facebook.com/docs/researcher-platform), a secure digital cleanroom. The API can also be used in an approved third-party cleanroom. The following third-party cleanroom environments are approved as of Content Library API version 6.0:

- Inter-university Consortium for Political and Social Research (ICPSR) at the University of Michigan

User documentation for third-party cleanroom interfaces is outside the scope of the Meta Content Library API documentation and can instead be provided by the third-party's system administrator.

The Content Library API provides access to the following public Facebook, Instagram and WhatsApp data:

- Facebook public Pages
- Facebook public groups
- Facebook public events
- Facebook public profiles
- Facebook posts from Facebook public Pages, profiles, groups and events
- Facebook Marketplace listings from public Pages and profiles
- Facebook public fundraisers and donations
- Facebook public comments
- Facebook channels and channel messages
- Instagram public creator, business and personal accounts
- Instagram posts from Instagram public creator, business and a subset of personal accounts
- Instagram public fundraisers
- Instagram public comments
- Instagram public channels and channel messages
- WhatsApp channels and channel updates

Facebook profiles must be set to public and either be [verified](https://www.facebook.com/help/196050490547892) or have a threshold number of followers to be included. See [Guide to Facebook profiles data](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/fb-profiles) for the threshold number of followers by API version.

Public Instagram accounts include professional accounts for businesses and creators. They also include a subset of personal accounts that that have their privacy [set to public](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F517073653436611&h=AUC9IaqEH0cNli4_IIwlLA5eE_exZtXKY34DgV4PNjfN500GqtiTaYnUK8DgSqw9PWFde-eTfH61XO-S-Bw_NNCqlAroE9dvfqFxyzfbCNYCbGJTz3GDlLqexIYVMAVT4km8TynAIVDAwQ) and be either [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F733907830039577%3Fhelpref%3Dfaq_content&h=AUAcd2I935u9Gx4W3XjMaO7KdORG51k4BNqYh6pX8h0EsGLVN0VuWcKXiFUYSDYbTastDJ99t4Q5U8z7NtXXfK-_PxcTa6OdDA_xwXVNkFQc33anTQQg5cIBEV53YgOoEyFXDle1DSJmAQ) or a have threshold number of followers. See [Guide to Instagram accounts data](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/ig-accounts) for the threshold number of followers by API version.

WhatsApp channel updates include all updates from the last 30 days within qualifying WhatsApp channels. Qualifying WhatsApp channels are active channels that are either verified or have a threshold number of followers. See [Guide to WhatsApp channel data](https://developers.facebook.com/docs/content-library-and-api/content-library-api/guides/wa-channel) for the threshold number of followers by API version.

**Downloading data from the API is not permitted**

Downloading of Facebook, Instagram, Threads and WhatsApp data from the Content Library API by any means is not permitted, regardless of whether you are accessing the API through Secure Research Environment or a third-party cleanroom such as the one provided by ICPSR.

## Geographic scope

Public data from public Facebook Pages, groups, events and profiles, and from WhatsApp channels and from public Instagram accounts from most countries/territories. Public data/content will be excluded from these countries:

- China
- North Korea
- South Korea
- Togo

This means that:

1. At least one admin of a public Facebook Page, group, event or profile or WhatsApp channel must have a stated location that is in a non-excluded country or region for information about that Page, group, event, profile, or channel to be accessible. The owner of a public Instagram account must have a primary country or region that is in a non-excluded country or region for information about that account to be accessible.

2. Of the Facebook Pages, groups, events, and profiles, and Instagram accounts and WhatsApp channels that qualify based on #1, only content made by users in non-excluded countries/territories are in scope.


## Audience-restricted content

Facebook and Instagram content can have age-based or location-based audience restrictions. This can affect the data surfaced in Meta Content Library user interface (UI) and API as follows:

### Age restrictions

Age restrictions may be imposed by producers on their content, or restrictions can be based on the classification of content as less appropriate for certain age groups.

Meta Content Library UI and API may not surface age-restricted content as it is not considered publicly accessible.

### Location restrictions

Location restrictions may be imposed for a variety of reasons, such as producers limiting visibility of their content, local laws, legal actions, etc. For example, see [Content Restrictions Based on Local Law](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.meta.com%2Freports%2Fcontent-restrictions%2F&h=AUBKkZKtyYuZpayTn97aPHwOY2ZNj04qWTmajLiL-1LTnnZqGfjTBzvmNTP8x1Jj-NPthDBRadza_RFoCSnmzEl_SZvcbuXTeIjY2GMOZ6pt7GmdrfOBvhz6oVZMMh2MkyiZMRjUPwUG-g).

#### Facebook

- Meta Content Library UI does not surface location-restricted content to users accessing the tool in that restricted location.

- Location-restricted content is unavailable to users accessing Meta Content Library API using a cleanroom that is in a restricted location.


#### Instagram

- Location-restricted content is not publicly accessible and will not be surfaced in Meta Content Library UI or API.

#### WhatsApp

- Location-restricted content is not publicly accessible and will not be surfaced in Meta Content Library UI or API.

## Language scope

Search results in all languages are included unless the search is filtered based on language.

## Meta Content Library

[Meta Content Library](https://www.facebook.com/transparency-tools/content-library/dataset/1119037145491882/about/) is a web-based tool that allows researchers to explore and understand data across Facebook and Instagram by offering a comprehensive, visual, searchable collection of publicly accessible content—the same content that is also accessible through the Content Library API. The web-based user interface allows you to explore data, test out search parameters, and assess whether the resulting data is appropriate for your planned research. No knowledge of query or programming languages is needed.

## Learn more

- [Frequently asked questions](https://developers.facebook.com/docs/content-library-api/disclosures)

- [Search quality approach](https://developers.facebook.com/docs/content-library-api/search-quality)

- [Secure Research Environment](https://developers.facebook.com/docs/researcher-platform)

- [Meta Content Library](https://www.facebook.com/transparency-tools/content-library/dataset/1119037145491882/about/)


On This Page

[Overview](https://developers.facebook.com/docs/content-library-and-api/content-library-api/overview#overview)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/content-library-api/overview#learn-more)