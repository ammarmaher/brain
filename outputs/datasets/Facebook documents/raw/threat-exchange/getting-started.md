---
url: https://developers.facebook.com/docs/threat-exchange/getting-started
title: Get Started - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Fgetting-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Get Started with ThreatExchange](https://developers.facebook.com/docs/threat-exchange/getting-started#get-started-with-threatexchange)

[What is Signal Sharing?](https://developers.facebook.com/docs/threat-exchange/getting-started#signal-sharing)

[Why Would I Contribute?](https://developers.facebook.com/docs/threat-exchange/getting-started#contribute)

[What Signals are Commonly Shared?](https://developers.facebook.com/docs/threat-exchange/getting-started#signals-shared)

[Indicator Types](https://developers.facebook.com/docs/threat-exchange/getting-started#indicator-types)

[I joined ThreatExchange, but where are the signals?](https://developers.facebook.com/docs/threat-exchange/getting-started#find-signals)

[What is the Cost of Integration?](https://developers.facebook.com/docs/threat-exchange/getting-started#cost-integration)

[How do I Start Reading and Sharing Signals?](https://developers.facebook.com/docs/threat-exchange/getting-started#read-share-signals)

# Get Started with ThreatExchange

This page will give you an overview of ThreatExchange and its core concepts.

ThreatExchange is a simple-to-use platform that supports signal sharing among predefined groups of members in a secure, privacy-compliant, and automated way. Today, ThreatExchange (aka TX or TE) is used by multiple companies to share signals on a variety of topics intended to prevent real world harm. Some examples of how TX is currently used include sharing malware, phishing scams, and terrorism signals with the goal of helping all participating organizations tackle these problems based on their terms of service.

ThreatExchange is built on these core concepts:

1. [Membership](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-member) \- Organizations on ThreatExchange that can use the platform.
2. [Signals (aka ThreatIndicators)](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/) \- A signal is a digital signature or indicator of harm that can be used to discover harmful content or actors.
3. [Opinions about signals (aka ThreatDescriptors)](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor/) \- All signals shared on ThreatExchange are owned by the members that uploaded them, which including an opinion on whether the signal matches harmful content or actors, and what type of harm it corresponds to.
4. [Who can see signals (aka Visibility)](https://developers.facebook.com/docs/threat-exchange/reference/privacy)\- Each member has control over which other members can see their data.


   - [Program (aka PrivacyGroup)](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group) \- the most common sharing paradigm, in which one member acts as the administrator of a group of members sharing between each other.

These concepts allow a group of ThreatExchange members to share signals, give feedback on each other's signals, and decide individually on how a signal aligns with their policies.

## What is Signal Sharing?

Signal sharing is a tactic to prevent harm on the internet where platforms work together to combat global threats like malware, terrorism, and other harmful content. Platforms help each other by sharing signals from content that they found and labeled on their platform. For example, Platform A might find a video of terrorism on their platform. By sharing the hash of that video (a type of signal) with Platform B, Platform B can find and review that video, which they might have otherwise missed. By sharing signals, the platforms can compound their individual trust & safety efforts and prevent more harm faster.

Signal Sharing is **not** a way for platforms to align on content policies or to coordinate on what content they remove. Each platform reviews content independently according to its own community standards policies and takes actions according to those standards.

## Why Would I Contribute?

There are many problems in the Trust & Safety space that affect all platforms jointly, and lead to real world harm. Signal sharing on ThreatExchange tries to reduce this harm by helping platforms find and remove more harmful content. Platforms come in all shapes and sizes, and not all can afford to hire a myriad of reviewers or invest millions in specialized machine learning models. For these platforms, investing in ThreatExchange can be an effective way to use their trust and safety resources.

Even for platform’s which already have robust trust and safety programs, there are still tangible benefits to joining and contributing to ThreatExchange. Namely, the harmful content found on those platform often doesn’t go away, it just goes somewhere else. A rising tide lifts all boats, and by all pitching in, we can improve the baseline safety level for the entire internet. Even if you aren’t uploading new signals to ThreatExchange simply confirming (or disputing!) labels will improve that baseline, build trust in our platforms, and help make the internet safer.

There are many ways to contribute to ThreatExchange or a signal sharing program in ways that help make sharing more effective, and doing any one of them makes you a contributor. Your organization may evaluate these options differently, but you should strive to do at least one! You can remember the different types of contributions with the mnemonic " **UOMF**" pronounced - "oomf", as in, "give your sharing some oomf!"

1. **U** pload novel signals: Share net new signals that you have discovered while protecting your platform.
2. Share **O** utcomes that came from sharing: Using the [ImpactReport](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-exchange-impact-report) feature, share how much harm you were able to remove or prevent as a result from sharing.
3. Provide **F** eedback on signals shared by others: Using the [reaction](https://developers.facebook.com/docs/threat-exchange/reference/reacting) feature, or by uploading a [ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor) on a signal shared by someone else.
4. Certify which signals you have **M** atched: Using the [`SAW_THIS_TOO`](https://developers.facebook.com/docs/threat-exchange/reference/apis/reaction-type) reaction, help others understand how harmful content spreads between platforms by indicating which signals you have found matching content or actors for.

## What Signals are Commonly Shared?

In ThreatExchange, we refer to the signals being shared as [Indicators](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator/). Over 80 types of Indicators can be shared on ThreatExchange and the full list can be found [here](https://developers.facebook.com/docs/threat-exchange/reference/apis/indicator-type). There are, however, a few data types that are particularly common.

### Indicator Types

| Match Text | Indicator Type |
| --- | --- |
| Raw Text | `TEXT_STRING` |
| Trend Queries (keywords+regex) | `TREND_QUERY` |

| Match URLs | Indicator Type |
| --- | --- |
| URLs | `URI` |
| Domains | `DOMAIN` |

| Match Photos | Indicator Type |
| --- | --- |
| PDQ Hashes [details](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fpdq&h=AUBxFJj4qTI2qMcD_8GpylkZif1ylDg19xeq3lU-cPUywcodMbPBjY0Sd5mQlWhtHuSg_fy5A-lfEOMc44ed-d795cSuPULCgl4NWQomF-ZRAn52hnQcw436F6KA9m-V4AxpxUEZPa1ffw) | `HASH_PDQ` |
| PDQ Hashes + [OCR](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FOptical_character_recognition&h=AUDvTypMHlX19Uh05clcgLKK8DPc8FKbpHx9_O5J_j0ddOwFBzTqkDvE8zHXEm2gWQ1_6bBPuCwBGUMjsEaxiwXOU1Bfci0qdrCdwHgaGntaey_asejDMrc8kv3lbjb-KpFBgiEMoGcGpQ) Text | `HASH_PDQ_OCR` |

| Match Videos | Indicator Type |
| --- | --- |
| MD5 Hash [details](https://l.facebook.com/l.php?u=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FMD5&h=AUBNhAkm-jeBp6eudXlEXwbSQGwYfQVpI94U31OgKuQ6yfNO-yda891jfw0PAkb4mS4cGrycGNCnjb4I0dNcC9ioCkQf_q9dhKAkvqigA1eHiGyRHzi-kfLqvpYYK9DcggbBdluyFOgZmA) | `HASH_MD5` |
| TMK+PDQF Hash [details](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Ftmk&h=AUCVnuUSUUbjhXShEOQet9Tv9Jx3bcwCK9u3K8-NDaPL8NePdnoQDy4vMAEWKGjCYMIYKWDq9oaDmlTDpTKGp8tsPLAN5V7x15jwRe7yiPUSIYt5kBFMUr1XEhMpWQksIyOzQ1pb79rRIw) | `HASH_TMK` |

## I joined ThreatExchange, but where are the signals?

While ThreatExchange has an option to share to all members ( [public visibility](https://developers.facebook.com/docs/threat-exchange/reference/privacy)), most sharing happens in [PrivacyGroups](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-privacy-group) that are invitation-only. Many signal sharing programs publicly advertise that they are hosted on ThreatExchange, and you can also find programs to join at the botton of the [UI Home Page](https://developers.facebook.com/docs/threat-exchange/reference/ui/collaborations/).

Lastly, if you are interested with sharing with an individual member, you can reach out to them by email using their contact information listed on the [UI Members page](https://developers.facebook.com/docs/threat-exchange/reference/ui/members).

## What is the Cost of Integration?

Partners who have onboarded have reported the process takes take 1-2 weeks of engineering time to get a basic integration plus another 1-2 weeks for fully automated ingestion and contribution. The cost will vary by company and will depend on a number of factors including the maturity of internal systems and the number of signal types you are attempting to use.

Some questions that might be useful in determining how long it will take your company to integrate are:

- Which of the above signal types are you planning to integrate with? (Text tends to be quick, photos moderate)
- Can you currently search your platform for matches of those signal types? (You can likely piggyback on existing infrastructure, saving time)

## How do I Start Reading and Sharing Signals?

Here are the ways to share signals on ThreatExchange:

- **UI**: ThreatExchange has a graphical user interface you can use to quickly and interactively do things like read and share signals and run queries. This is the best place to quickly explore the data in ThreatExchange. Learn more about [ThreatExchange](https://developers.facebook.com/docs/threat-exchange/ui).

- **Python**: To build an inital integration and to preform validation we recommend using the python [open source library](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2FThreatExchange%2Ftree%2Fmaster%2Fpython-threatexchange&h=AUCv_8XHEi7EhV7vALLFe5yjgAZB-kEiHt7q9_otmKytUND2qE6ayc51tbEDjXqC7mh-4wDShid_Gj_rQoNERw_6cA4wmfn_dssVVBbSbT-YxHSsDXY78ckDN9BCupyuN61n1yhViZ1EYg) we’ve developed. This allows you fetch a copy of shared signals in a simple format.

- **API**: Lastly, there is also a powerful HTTP API which has greater functionality than the python wrapper for an advanced integration. Learn more about these [APIs](https://developers.facebook.com/docs/threat-exchange/reference/apis).

To use any of these methods you will first need to get access to ThreatExchange. ThreatExchange requires you (or someone on your team) to have a Facebook account, or to create one, and then will require creating a new application. Afterwards, you can apply for access to ThreatExchange, which requires you to confirm that your application belongs to your business. After that, you can add more accounts to the application, or store a token to gain access to the API.

Follow [these steps](https://developers.facebook.com/docs/threat-exchange/reference/ui/app-review) to create an App and get access to ThreatExchange.

On This Page

[Get Started with ThreatExchange](https://developers.facebook.com/docs/threat-exchange/getting-started#get-started-with-threatexchange)

[What is Signal Sharing?](https://developers.facebook.com/docs/threat-exchange/getting-started#signal-sharing)

[Why Would I Contribute?](https://developers.facebook.com/docs/threat-exchange/getting-started#contribute)

[What Signals are Commonly Shared?](https://developers.facebook.com/docs/threat-exchange/getting-started#signals-shared)

[Indicator Types](https://developers.facebook.com/docs/threat-exchange/getting-started#indicator-types)

[I joined ThreatExchange, but where are the signals?](https://developers.facebook.com/docs/threat-exchange/getting-started#find-signals)

[What is the Cost of Integration?](https://developers.facebook.com/docs/threat-exchange/getting-started#cost-integration)

[How do I Start Reading and Sharing Signals?](https://developers.facebook.com/docs/threat-exchange/getting-started#read-share-signals)