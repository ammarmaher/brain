---
url: https://developers.facebook.com/docs/development/terms-and-policies/separate-ad-accounts
title: Separate Ad Accounts Policy - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fterms-and-policies%2Fseparate-ad-accounts%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)
- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)
- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)
- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)
- [Release](https://developers.facebook.com/docs/development/release)
- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)


  - [Enforcement](https://developers.facebook.com/docs/development/terms-and-policies/enforcement)
  - [Automated Data Collection](https://developers.facebook.com/docs/development/terms-and-policies/automated-data-collection)
  - [Privacy Policy Expectations](https://developers.facebook.com/docs/development/terms-and-policies/privacy-policy)
  - [Separate Ad Accounts Policy](https://developers.facebook.com/docs/development/terms-and-policies/separate-ad-accounts)
  - [Terms and Policies FAQs](https://developers.facebook.com/docs/development/terms-and-policies/faqs)

- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Developer Policy](https://developers.facebook.com/docs/development/terms-and-policies/separate-ad-accounts#developer-policy)

# Developer Policy

Note: The following serves as supplementary material to complement the official Developer Policies. To ensure that you keep your app’s policy compliant, please review the [Developer Policies](https://developers.facebook.com/devpolicy) and
[Platform Terms](https://developers.facebook.com/terms/dfc_platform_terms).

Developer Policy 10.5 states: _“Don't combine multiple end advertisers or their Meta business assets in the same ad account, unless you meet the requirements described here or as otherwise approved by Meta in writing”._

This policy requires you to maintain a clear separation between each end advertiser and their assets, so that you can easily identify and track ownership and accountability for ad content, spend, and data for every end advertiser. This policy also helps reduce disruption to other end advertisers when an issue related to one end advertiser (or its assets) requires enforcement action.

Alternative to Maintaining Separate Accounts: If you implement a `vendor_id` and/or `brand` field in your Product Catalog, and/or in your Meta Pixel and Conversions (CAPI) integrations, you will be considered to be in compliance with Developer Policy 10.5, provided you properly implement such fields and remain in compliance with all Meta terms, conditions, and policies related to the foregoing. Meta reserves the right to revoke this alternative at any time if, in our sole discretion, we determine that it is necessary to protect Meta, its users, or the integrity of its products.

### **Required signals**

Implement **at least one** of:

- **vendor\_id**
- **brand**

### **Required surfaces**

You must include the chosen signal(s) in **at least one** of:

- **Product Catalog data**
- **Meta Pixel/CAPI event data**

On This Page

[Developer Policy](https://developers.facebook.com/docs/development/terms-and-policies/separate-ad-accounts#developer-policy)