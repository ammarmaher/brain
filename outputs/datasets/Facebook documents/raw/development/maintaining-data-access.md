---
url: https://developers.facebook.com/docs/development/maintaining-data-access
title: Maintaining Data Access - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fmaintaining-data-access%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access#maintaining-data-access)

[Inactive Apps](https://developers.facebook.com/docs/development/maintaining-data-access#inactive-apps)

[Restoring Access](https://developers.facebook.com/docs/development/maintaining-data-access#restoring-access)

[Data Protection Assessment](https://developers.facebook.com/docs/development/maintaining-data-access#data-protection-assessment)

[Data Use Checkup](https://developers.facebook.com/docs/development/maintaining-data-access#data-use-checkup)

[Product Use Checkup](https://developers.facebook.com/docs/development/maintaining-data-access#product-use-checkup)

[Terms and Policies Violations](https://developers.facebook.com/docs/development/maintaining-data-access#terms-and-policies-violations)

# Maintaining Data Access

This document lists policies and procedures that can affect your app's ability to access Facebook data. If your app is in danger of losing access to Facebook data (or has already lost access to it) you will receive an **urgent** developer notification in your [alerts inbox](https://developers.facebook.com/docs/development/create-an-app/app-dashboard#alerts). You may also receive a corresponding email notification, depending on how you have configured your [developer settings](https://developers.facebook.com/docs/development/create-an-app/developer-settings).

Play

0:00

Mute

Enter Fullscreen

Sharing and reporting options

![](https://static.xx.fbcdn.net/rsrc.php/v4/y4/r/-PAXP-deijE.gif)

Something went wrong

We're having trouble playing this video.

[Learn more](https://www.facebook.com/help/396404120401278/list)

Find more video resources from [Data Protocol](https://l.facebook.com/l.php?u=https%3A%2F%2Fapp.dataprotocol.com%2Fchannels%2Fmeta&h=AUAkL-PkgzpG0ilTOTwP9ILvfnaRRvcl6qdS5FuJlRtiCF71HQVYpKtdEFxXSkNvIo9lBcWnFTuj-xsO98yIWXDeKjDSieaDzJUn-SqfCUZR5E-tSAAzZRZTeUf_fwAZoWASeBUhu_PBSA).

## Inactive Apps

An app may be deemed inactive if it satisfies the following conditions:

- no app users have logged into the app in the last 90 days
- the app has made no calls to either the Graph API or Marketing API in the last 90 days
- the app has received no webhook notifications in the last 90 days

Once an app has been deemed inactive, all access tokens associated with the app will be invalidated and the app will be prevented from accessing the Graph API and Marketing API until access is restored.

### Restoring Access

Admins of an inactive app who load the app in the App Dashboard will be given the option to restore the app. Restoring an app will:

- automatically upgrade it to the latest version of the Graph API and Marketing API
- re-enable webhooks notifications and upgrade them to the latest version

Old access tokens will still be invalid so new ones must be generated. Also, any permissions that were removed from the app due to disuse while it was inactive must be re-approved through the App Review process.

## Data Protection Assessment

Data Protection Assessment is a requirement for apps accessing advanced permissions that is designed to assess how developers use, share and protect Platform Data as described in the [Facebook Platform Terms](https://developers.facebook.com/terms). When enrolled, an administrator of the app will need to complete a questionnaire based on their app’s access to Platform Data.

Learn more about [Data Protection Assessment.](https://developers.facebook.com/docs/development/maintaining-data-access/data-protection-assessment)

## Data Use Checkup

Data Use Checkup is an annual requirement whereby you, or another app admin, must certify that your app still accesses our APIs and uses our products and data in compliance with our [Platform Terms](https://developers.facebook.com/terms) and [Developer Policies](https://developers.facebook.com/devpolicy).

Learn more about [Data Use Checkup](https://developers.facebook.com/docs/development/maintaining-data-access/data-use-checkup).

## Product Use Checkup

If you have added any [products](https://developers.facebook.com/docs/development/create-an-app/app-dashboard#products-2) that require Product Use Certification, you must annually recertify as part of the [Data Use Checkup](https://developers.facebook.com/docs/development/maintaining-data-access/data-use-checkup) process.

## Terms and Policies Violations

If you violate our [terms](https://developers.facebook.com/terms), [policies](https://developers.facebook.com/devpolicy), or allowed usages for individual [permissions](https://developers.facebook.com/docs/permissions/reference) and [features](https://developers.facebook.com/docs/apps/features-reference), your app will be [enforced](https://developers.facebook.com/docs/development/terms-and-policies/enforcement) upon. Enforcement actions can range from limiting your app's ability to access our APIs to revocation of individual permissions and features. You can find a list of our terms and policies in our [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies) documentation, as well as more information about enforcement actions and the appeals process.

On This Page

[Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access#maintaining-data-access)

[Inactive Apps](https://developers.facebook.com/docs/development/maintaining-data-access#inactive-apps)

[Restoring Access](https://developers.facebook.com/docs/development/maintaining-data-access#restoring-access)

[Data Protection Assessment](https://developers.facebook.com/docs/development/maintaining-data-access#data-protection-assessment)

[Data Use Checkup](https://developers.facebook.com/docs/development/maintaining-data-access#data-use-checkup)

[Product Use Checkup](https://developers.facebook.com/docs/development/maintaining-data-access#product-use-checkup)

[Terms and Policies Violations](https://developers.facebook.com/docs/development/maintaining-data-access#terms-and-policies-violations)