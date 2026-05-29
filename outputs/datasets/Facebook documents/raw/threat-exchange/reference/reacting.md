---
url: https://developers.facebook.com/docs/threat-exchange/reference/reacting
title: React to Data - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Freacting%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[React to Existing Data](https://developers.facebook.com/docs/threat-exchange/reference/reacting#react-to-existing-data)

[Values](https://developers.facebook.com/docs/threat-exchange/reference/reacting#values)

[React Using the UI](https://developers.facebook.com/docs/threat-exchange/reference/reacting#reacting-via-ui)

[Bulk React Using the UI](https://developers.facebook.com/docs/threat-exchange/reference/reacting#bulk-react-via-ui)

[React Using the API](https://developers.facebook.com/docs/threat-exchange/reference/reacting#react-via-api)

[Share Feedback](https://developers.facebook.com/docs/threat-exchange/reference/reacting#share-feedback)

# React to Existing Data

You can express a structured opinion on data you see on ThreatExchange by **reacting** to that data. This is a fully optional feature that can be used to provide more context or transparency about your ThreatExchange usage.

.

In general, `SAW_THIS_TOO`, `NON_MALICIOUS`, and `DISAGREE_WITH_TAGS` have well-undestood meaning, and are valuable contributions to any dataset. The rest are sometimes used as part of PrivacyGroup-specific conventions, or to provide a high level of transparency into your own usage of ThreatExchange data.

## Values

As of Jan 2023:

| Name | Usage Category | Description |
| --- | --- | --- |
| `SAW_THIS_TOO` | Ingestion status. | The object has been observed on-platform by the reactor. Using this reaction can help track platform spread. Implies `INGESTED`. |
| `NON_MALICIOUS` | Feedback after review. | The object has been reviewed and found to be non-malicious. This is equivalent to uploading the same object but with the [`StatusType`](https://developers.facebook.com/docs/threat-exchange/reference/apis/status-type) of `NON_MALICIOUS`. A reaction is often preferable, as it will not leave extra objects in ThreatExchange if the original object is later retracted. Implies `REVIEWED`. |
| `DISAGREE_WITH_TAGS` | Feedback after review. | The object has been reviewed and the reactor would have tagged it differently. Many PrivacyGroups use tags in order to categorize data by convention. `DISAGREE_WITH_TAGS` without an upload by the same reactor with their preference in tagging is equivalent to a `NON_MALICIOUS` report. If the owner of the object changes the tags, this reaction will automatically be removed. Implies `REVIEWED`. |
| `ACTION_TAKEN` | Feedback after review. | The reactor found harmful content associated with the signal, and as a result removed or blocked it from the platform. Implies `HELPFUL`. |
| `HELPFUL` | Ad-hoc feedback. | The object helped lead to the discovery of harmful content. Implies `REVIEWED`. |
| `NOT_HELPFUL` | Ad-hoc feedback. | The object seems to lead to non-malicious content. Implies `REVIEWED`. |
| `OUTDATED` | Ad-hoc feedback. | The object is outdated or can no longer be evaluated. Implies `INGESTED`. |
| `WANT_MORE_INFO` | Request for information. | More information requested about this object. Implies `INGESTED`. |
| `INGESTED` | Ingestion status. | The content was downloaded by the reactor and is awaiting further processing. |
| `ALREADY_KNOWN` | Ingestion status. | The object is equivalent to information already known to the reactor. Implies `SAW_THIS_TOO`. |
| `IN_REVIEW` | Ingestion status. | The object is being reviewed, or the object has been matched to content on platform that is being reviewed. Implies `SAW_THIS_TOO`. |
| `REVIEWED` | Ingestion status. | The object has been reviewed, or the object has been matched to content on platform that has been reviewed. Implies `SAW_THIS_TOO`. |
| `NOT_ON_PLATFORM` | Ingestion status. | The object does not exist on the reactors platform. Implies `INGESTED`. |

## React Using the UI

02. Search for threat descriptors using [any method of your choice](https://developers.facebook.com/docs/threat-exchange/reference/ui/descriptors#searching); for example, using the tag `testing-reaction-editing`.

05. You can react to threat descriptors owned by other apps (the **View** button), not to those owned by your app ( **Edit** button).

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=439807276736173&version=1675464900)

10. Click **Add Reaction**.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=180951849879523&version=1675464900)

15. Select your reactions and click **Save**.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=123423415767961&version=1675464900)

20. Dismiss the popup.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=2438695193107245&version=1675464900)

25. The next image shows being logged in as the owner app. Click **Edit** to view details.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=229864191383132&version=1675464900)

For the owner app the reactions are read-only, formatted as a table.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=626907194520685&version=1675464900)

## Bulk React Using the UI

You can update reactions for several descriptors at once.

02. Do any search; a search by tag.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=251783315883439&version=1675464900)

The **Bulk react** button applies to all checkboxed rows, where your app doesn't own.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=684937338950316&version=1675464900)

10. Select reactions to add to all rows or remove from all rows.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=3032524016833846&version=1675464900)

15. Click **OK** to commit:

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=258812001843025&version=1675464900)

20. Select **View** on any of the affected rows, where you can view the reaction.

![](https://lookaside.fbsbx.com/elementpath/media/?media_id=1119906405031641&version=1675464900)

## React Using the API

To express an opinion about descriptor 952030561511282 using the API, append your access token and issue a **POST** to:

```

https://graph.facebook.com/v4.0/952030561511282?reactions=HELPFUL,SAW_THIS_TOO
```

To retrieve the reactions of everyone else, append your access token and issue a `GET` to.

```

https://graph.facebook.com/v4.0/952030561511282?fields=id,my_reactions,reactions
```

The `my_reactions` field shows your own reactions, and the `reactions` field is a map from the possible [ReactionType](https://developers.facebook.com/docs/threat-exchange/reference/apis/reaction-type) to the apps that reacted with that type. If there are no reactions, the field is empty.

## Share Feedback

_Reactions_ are a growing feature. To provide feedback about reactions, contact threatexchange@fb.com, or use the bug nub in the TEUI.

On This Page

[React to Existing Data](https://developers.facebook.com/docs/threat-exchange/reference/reacting#react-to-existing-data)

[Values](https://developers.facebook.com/docs/threat-exchange/reference/reacting#values)

[React Using the UI](https://developers.facebook.com/docs/threat-exchange/reference/reacting#reacting-via-ui)

[Bulk React Using the UI](https://developers.facebook.com/docs/threat-exchange/reference/reacting#bulk-react-via-ui)

[React Using the API](https://developers.facebook.com/docs/threat-exchange/reference/reacting#react-via-api)

[Share Feedback](https://developers.facebook.com/docs/threat-exchange/reference/reacting#share-feedback)