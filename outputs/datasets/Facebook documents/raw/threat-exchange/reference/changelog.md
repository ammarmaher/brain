---
url: https://developers.facebook.com/docs/threat-exchange/reference/changelog
title: Changelog - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fchangelog%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[ThreatExchange](https://developers.facebook.com/docs/threat-exchange)

- [Get Access](https://developers.facebook.com/docs/threat-exchange/getting-access)
- [Get Started](https://developers.facebook.com/docs/threat-exchange/getting-started)
- [Best Practices](https://developers.facebook.com/docs/threat-exchange/best-practices)
- [UI Overview](https://developers.facebook.com/docs/threat-exchange/ui)
- [UI Reference](https://developers.facebook.com/docs/threat-exchange/reference/ui)
- [API Overview](https://developers.facebook.com/docs/threat-exchange/api)
- [API Structure](https://developers.facebook.com/docs/threat-exchange/api-structure)
- [API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis)
- [Privacy Controls](https://developers.facebook.com/docs/threat-exchange/reference/privacy)
- [Submit Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting)
- [Editing Existing Data](https://developers.facebook.com/docs/threat-exchange/reference/editing)
- [Delete Data](https://developers.facebook.com/docs/threat-exchange/reference/deleting)
- [Reshare Controls](https://developers.facebook.com/docs/threat-exchange/reference/resharing)
- [React to Data](https://developers.facebook.com/docs/threat-exchange/reference/reacting)
- [Submit Connections](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections)
- [Vendors](https://developers.facebook.com/docs/threat-exchange/reference/vendors)
- [FAQ](https://developers.facebook.com/docs/threat-exchange/FAQ)
- [Changelog](https://developers.facebook.com/docs/threat-exchange/reference/changelog)

On This Page

[Changelog](https://developers.facebook.com/docs/threat-exchange/reference/changelog#change_log)

[Changes as of August 21, 2023](https://developers.facebook.com/docs/threat-exchange/reference/changelog#changes-as-of-august-21--2023)

[Changes as of May 23, 2023](https://developers.facebook.com/docs/threat-exchange/reference/changelog#changes-as-of-may-23--2023)

[Changes as of January 9, 2023](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2023-01-09)

[Changes in API Version 10.0 (Feb 23 2021)](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2021-02-23)

[Changes as of June 2, 2020](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2020-06-02)

[Changes as of May 28, 2020](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2020-05-28)

[Changes as of April 9th, 2020](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2020-04-09)

[Changes as of January 8th, 2020](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2020-01-08)

[Changes as of October 9th, 2019](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2019-10-09)

[Changes as of February 13th, 2017](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2017-02-13)

[Changes in API Version 2.8 (Oct 5th 2016)](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2.8)

[Changes in API Version 2.4](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2.4)

# Changelog

## Changes as of August 21, 2023

Malware Analyses Endpoint Removed

The `/malware_analyses` endpoint has been removed and is no longer available on any versions.

## Changes as of May 23, 2023

**Malware Analyses Endpoint Deprecated**

- The `/malware_analyses` endpoint is deprecated. It is not available on v17 or later and will be removed for all versions on August 21, 2023.

## Changes as of January 9, 2023

**Malware Endpoint Removal**

- Malware endpoints on threatexchange, such as `/malware_analyses` and `/malware_families`, as well as assoicated malware objects are being removed, and will soon be unavailable on all versions.

- These endpoints and objects have not been in use for some time now, and removing them allows us to simplify the API.

- If you still would like to exchange information about Malware, [ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/v15.0) objects can be used to upload malware hashes and other indicators.


## Changes in API Version 10.0 (Feb 23 2021)

**Permanent deletion of expired data**

- Beginning 90 days after the launch of Graph API version 10.0, **all expired data will be deleted**.

- Data uploaded to ThreatExchange with a non-zero `expire_time` will be **permanently deleted** at the expiration time indicated and will no longer be visible.

- If you wish to delete data that is no longer valid, set the `expired_on` field to the current time to have the data deleted immediately.

- In the past, we used a ‘soft’ delete approach where we labeled expired content as expired. We no longer support soft deletes. Expired content will now be permanently deleted.

- Additionally, all non-Facebook ThreatDescriptors will be permanently deleted once they reach the expiration date set by the creator.

- If your application currently has expired ThreatDescriptors that you don’t want deleted, you must extend the expiration date or set it to ‘0’ to ensure that the data never expires.


## Changes as of June 2, 2020

**New tooling for a new generation**

- Our te-tag-query reference design now has [**Python**](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmain%2Fapi-reference-examples%2Fpython&h=AUBXpDOAwpxRlX_usW_rjpAUMvDzwhvNkEG2KpiU7VsCAtC71bG1SxaO-lew2IOHKCCvGhuA_E2Reu5Mr8LTRku-pNYFR6qSolaG7oVVYwHu0MLCKTlVO-jW0aJK32Jkh6XPdVKu_phvHw) and [**Ruby**](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fapi-reference-examples%2Fruby&h=AUD6KnXVeB4yGuG9wM9Xg5TZqpncHtKyACw-IxJ5Rg0lZrVQQi8dOjo5Nce5LoVD4Moo_V8EZ5xGOvuACGkVj-6vSTSi32LQ241wqk-vXhipOHIEN0m45yYDQTRrlI6a-yjLpqaqq-2dog) reference implementations in addition to the existing [**Java**](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fapi-reference-examples%2Fjava&h=AUB7dADqAPxFzkCstcw1sF_h6I4kcEY7KkIZWEsfEtdaDvjkOsM5KMaCO__NrKS1dgNF0LL_ymMRAV9equL-N1rZvy0-_hqx8wPdLMclqPYqql22kp3-_soTMV9jw4cqvEKXGlB-eTaInw) version. (In response to feedback we've also split out [**curl-only**](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fapi-reference-examples%2Fcurl&h=AUAWcfBeGTZoKWtlKM9wxvC6n_Ji_2kFR9aCuYolveh86JLK2XI_iswyrpsXHgrcEJFZRx-FzEI6MKSxjNfUP0aM1OwMHdctEdEj2mBE28syt56fU4mJJNFTBOTqQS5wQqxvZfVP1CCJcQ) documentation for the tag-query recipe.)

- The common context to all these is that for the last couple years ThreatExchange has moved beyond malware/phishing into cross-company integrity-signal sharing. This newer tooling largely overlaps the old (such as [pytx](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmain%2Fapi-reference-examples%2Fpython%2Fpytx&h=AUB50jwYRJg2gMFiF_hh2aGba-ArIU3E6D_JX9_sfCjIw6m2ULKfW5pBMYsnaEJ9P960hmCMS0NKyrQLHj5yttubAbAIQQtqRC7ILpEsDrNWXvjMw77D98UQv9kZ1hq40UWeKmgaijVNKg)), but with an added focus on


  - more interactive tooling for a broader, more diverse userbase;

  - a strong threat-descriptor focus (vs malware analyses);

  - enhanced support for cross-company feedback mechanisms.


- While the Java version now has a little catch-up to do, the Python and Ruby reference designs encapsulate the same kinds of bulk-relate, bulk-react, copy-and-modify, and other workflows as already described for the UI in our May 28 update.

- We find that for folks in some PM/DS/policy roles, the UI is the main interface; for engineers, the UI is a helpful tool but truly scalable processing implementations require the API -- as well as high-level-language support. Today's Python/Ruby releases are milestones for the latter.

- These flows have been built due to demand from a cross-company userbase which is more engaged and feedback-focused than ever. Please keep the feedback coming at threatexchange@fb.com, and/or on Slack channels you may have open with us.


## Changes as of May 28, 2020

This round of updates is all about bulk!

- The new time-saving [**create-with-templates**](https://developers.facebook.com/docs/threat-exchange/reference/submitting#creating-with-templates) feature allows you to submit a batch of descriptors, identical in all but the hash/indicator values, without needing to import from CSV.

- You can now do [**bulk relations**](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#ui-bulk-relate) and
[**bulk reactions**](https://developers.facebook.com/docs/threat-exchange/reference/reacting#bulk_reacting_via_ui).

- The [**bulk uploader**](https://developers.facebook.com/docs/threat-exchange/reference/submitting#uploading) used to be balky/laggy for uploads of more than a few hundred descriptors -- it's now performant and interactive for file sizes of up to 8,000 descriptors.

- Similarly, search results now use a **lighter-weight rendering** (fewer click-to-copy, fewer colors, etc) for result-sizes over a thousand descriptors. (You can configure the simplified-render threshold in the Customization tab.) This helps you more comfortably navigate larger datasets.

- You can now power-search for descriptors having an **"and" of several tags**, not just an "or" as before.

- While true previous-page/next-page support is still in development, there is now a **search-older button** allowing you to traverse larger search-result sets.


## Changes as of April 9th, 2020

In response to more great feedback on the ThreatExchange UI, we're proud to announce the following updates:

- You can now [**submit connections**](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections) in the UI, as well as the API. These help you trace connections between things like domains, URLs, and so on.

- You can now [**broaden your searches**](https://developers.facebook.com/docs/threat-exchange/reference/ui/descriptors#fanout) by fanning out to more descriptors on the same objective data, or more descriptors that have connections to them.

- We now have support for [**saved searches**](https://developers.facebook.com/docs/threat-exchange/reference/ui/descriptors#saved_searches) \-\- you can bookmark your searches, or share them with collaborators.


## Changes as of January 8th, 2020

In response to lots of great feedback on the ThreatExchange UI, we're proud to announce the following updates:

- [**Power-search**](https://developers.facebook.com/docs/threat-exchange/getting-started#searching-data-using-the-ui): you can now do complex queries involving status, indicator type, owner-apps, tags, text, and more. (Next-page support is still under development.)

- [**Bulk upload from CSV or JSON files**](https://developers.facebook.com/docs/threat-exchange/reference/submitting#uploading).

- [**Bulk edit**](https://developers.facebook.com/docs/threat-exchange/reference/editing#bulk-editing-using-the-ui): bulk updates for various metadata including status, severity, tags, and more.

- [**Duplicate**](https://developers.facebook.com/docs/threat-exchange/reference/editing#cloning-and-duplicating): add your own opinions to IOCs submitted to other companies; keystroke-saving for creating more of your own.

- **Click-to-sort** on table-column headers for descriptors, tags, privacy groups, and TE members.

- UI support for the **source\_uri** threat-descriptor field.

- Bug fix with review\_status field not saved to downloaded CSV/JSON.

- Tags, privacy groups, and apps on an allow list can now be comma-separated as well as semicolon-separated in CSV files.

- More detailed documentation on [**threat-descriptor attributes**](https://developers.facebook.com/docs/threat-exchange/reference/submitting#parameters).


Thanks for the great feedback, and please keep hitting the bugnub at the upper-right-hand corner of the UI and let us know how we can improve ThreatExchange!

## Changes as of October 9th, 2019

- We are proud to release a beta user interface at developers.facebook.com/apps: please see [**the UI docs**](https://developers.facebook.com/docs/threat-exchange/ui) for more information. Please contact us at threatexchange@fb.com with any and all feedback.

- Thanks for your continued patience as we revamp our app-approval process. Stay tuned for updates coming soon!


## Changes as of February 13th, 2017

New Features

- You can now [**react**](https://developers.facebook.com/docs/threat-exchange/reference/reacting/v2.5) to data you consume in ThreatExchange. Descriptors can be marked as 'HELPFUL', 'NOT\_HELPFUL', 'OUTDATED', 'SAW\_THIS\_TOO', and 'WANT MORE INFO' by anyone who can see them.

- A new edge, [**/similar\_malware**](https://developers.facebook.com/docs/threat-exchange/reference/apis/similar-malware/v2.5), can now be used to identify malware samples we believe are related.

- We've also rolled out additional [**Webhooks**](https://developers.facebook.com/docs/threat-exchange/webhooks) support for [**ThreatIndicators**](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) and [**ThreatTags**](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags), so your servers can be notified in real-time when new threat intel is available.


Changes

- Our **strict\_text** search parameter now limits search result to _exactly_ the search term you have submitted. For example, before this change, if you did a search for threat indicators with strict text enabled for 'google.com', you would get a lot of results, including things like “http://google\[.\]com/fusiontables” and ”http://google.com-136\[.\]net/DE/1/?subid=1485323323mb29920939890”. The new search will return results for _only_ google.com, i.e. ID 826838047363868. When searching for threat descriptors, you can still use other parameters to limit the search results (e.g. owner or status). If you want to find [www.google.com](https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.google.com%2F&h=AUD39HyDRu72m6dHklCJWunWD36tXMDwXyqH8IrQIdN_MjQsusyd0QwIIUmS8ekYwvfwByeHPcbMVqsDEZPEYw8BpfAKWGI5r9etoLMJ5VzNbzhIiSKkaYA1NV_YzunRybpz_UkkO00Z7A), you have to search for that separately. A strict-text search for [google.com](https://l.facebook.com/l.php?u=http%3A%2F%2Fgoogle.com%2F&h=AUDfrGTL0MmSTr55KwBysMkMaqynmsyhqg3fAV0tcN5cM6YcqvsUtn82jithpx8dyiWchdifsvlYqPiJSt3Wklfn87O7d2C71eP7nMW6F_X0RT9ybE3sn64oCbMa6myzGWm8Iv7gtFtJ_A) will not return [www.google.com](https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.google.com%2F&h=AUDtrEkz12Egy9MsNgGiCrrzJv_8V1FP73Sdf_jid9vnVxK9wK27MqFSA_RTT7PFMSgkRid18rd2ONGmsC0t8MZGfnL9CKyb4wTGy3oN5wD7pfMRngEp2eyrAymLqq1J-VSaWJhW8Lixdw).


## Changes in API Version 2.8 (Oct 5th 2016)

New Features

- You can now add [**ThreatTags**](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags) to [**MalwareAnalyses**](https://developers.facebook.com/docs/threat-exchange/reference/apis/malware), [**ThreatDescriptors**](https://developers.facebook.com/docs/threat-exchange/reference/docs/threat-exchange/reference/apis/threat-descriptor), and [**MalwareFamilies**](https://developers.facebook.com/docs/threat-exchange/reference/apis/malware-family). You can also filter search results by tags and find a list of tags people are using in ThreatExchange via the [**/threat\_tags**](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-tags) endpoint.

- ThreatExchange now supports [**Webhooks**](https://developers.facebook.com/docs/graph-api/webhooks). With Webhooks support for [**MalwareAnalyses**](https://developers.facebook.com/docs/threat-exchange/reference/apis/malware), [ThreatDescriptors](https://developers.facebook.com/docs/threat-exchange/reference/docs/threat-exchange/reference/apis/threat-descriptor), and [**MalwareFamilies**](https://developers.facebook.com/docs/threat-exchange/reference/apis/malware-family), your server can be notified in realtime when new threat intelligence is added to ThreatExchange. Please see our [**Webhooks For ThreatExchange Guide**](https://developers.facebook.com/docs/threat-exchange/webhooks) for plug-and-play code.

- A new parameter in Threatexchange, **sort\_by**, allows you to choose whether to sort search results by RELEVANCE or by CREATE\_TIME. When sorting by RELEVANCE, your query will return results sorted by similarity against your text query.


Deprecations

- AttackType and ThreatType are being deprecated in favor of [**ThreatTags**](https://developers.facebook.com/docs/threat-exchange/reference/apis/threattags). If you publish or read threat data using these fields, you will need to change your code to use ThreatTags instead. Starting December 5th 2016 these fields will no longer be accessible on all versions of the Graph API. To ease the transition, during the interim you'll be able to continue the use of these types on previous versions of the Graph API, alongside tags. We are also making the existing threat\_type or attack\_type data values available through tags. More specifically, if existing or new threat data has value to these types, the object will automatically be tagged with the equivalent string value. By the end of this period, you'll need to fully transition to use tags instead of threat\_type or attack\_type.


## Changes in API Version 2.4

There were a large number of changes made in Platform version 2.4. You may continue to use Platform version 2.3, without those changes, until 8 Dec 2015. On that day support for version 2.3 will be disabled.

The most important change in version 2.4 was was the introduction of the descriptor model. On version 2.3 and below, all data was stored on the indicator. Beginning with version 2.4, we split information into objective and subjective categories. Objective information is data which everybody can see and agree upon. It may change over time, but everybody sees the same data. For example, the WHOIS registration for a domain name is objective. Subjective information represents somebody's opinion on the data. Different people may have different opinions. For example, the status of a domain as being MALICIOUS or NON\_MALICIOUS.

Objective information will remain stored on indicators. For the most part, Facebook will be the only party updating objective information. Subjective information is now stored on a new structure called a descriptor. We have added API calls to create, edit, and search for descriptors. Each AppID may have one descriptor per indicator. Each descriptor has an edge connecting it to a threat indicator. Each indicator has edges to one or more descriptors.

We currently do not support connections between descriptors. Connections between indicators will remain the only way to associate threat information for the time being.

On This Page

[Changelog](https://developers.facebook.com/docs/threat-exchange/reference/changelog#change_log)

[Changes as of August 21, 2023](https://developers.facebook.com/docs/threat-exchange/reference/changelog#changes-as-of-august-21--2023)

[Changes as of May 23, 2023](https://developers.facebook.com/docs/threat-exchange/reference/changelog#changes-as-of-may-23--2023)

[Changes as of January 9, 2023](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2023-01-09)

[Changes in API Version 10.0 (Feb 23 2021)](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2021-02-23)

[Changes as of June 2, 2020](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2020-06-02)

[Changes as of May 28, 2020](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2020-05-28)

[Changes as of April 9th, 2020](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2020-04-09)

[Changes as of January 8th, 2020](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2020-01-08)

[Changes as of October 9th, 2019](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2019-10-09)

[Changes as of February 13th, 2017](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2017-02-13)

[Changes in API Version 2.8 (Oct 5th 2016)](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2.8)

[Changes in API Version 2.4](https://developers.facebook.com/docs/threat-exchange/reference/changelog#2.4)