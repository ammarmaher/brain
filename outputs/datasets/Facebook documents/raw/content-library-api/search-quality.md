---
url: https://developers.facebook.com/docs/content-library-api/search-quality
title: Search quality  - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fappendix%2Fsearch-quality%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Content Library and API](https://developers.facebook.com/docs/content-library-and-api)

- [Get access](https://developers.facebook.com/docs/content-library-and-api/get-access)
- [Quick links](https://developers.facebook.com/docs/content-library-and-api/quick-links)
- [Content Library](https://developers.facebook.com/docs/content-library-and-api/content-library)
- [Content Library API](https://developers.facebook.com/docs/content-library-and-api/content-library-api)
- [Appendix](https://developers.facebook.com/docs/content-library-and-api/appendix)


  - [Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary)
  - [Field expansion](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion)
  - [Search quality](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality)
  - [Get API Code](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code)
  - [Share producer list](https://developers.facebook.com/docs/content-library-and-api/appendix/share-producer-list)
  - [Share API search ID](https://developers.facebook.com/docs/content-library-and-api/appendix/api-search-id)

- [Support](https://developers.facebook.com/docs/content-library-and-api/support)
- [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers)
- [Citations](https://developers.facebook.com/docs/content-library-and-api/citations)
- [Changelog](https://developers.facebook.com/docs/content-library-and-api/changelog)

On This Page

[Search quality approach](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#search-quality-approach)

[Definitions](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#definitions)

[Search overview](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#search-overview)

[Initial testing](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#initial-testing)

[Methods](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#methods)

[Recall](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#recall)

[Rank recall](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#rank-recall)

[Precision](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#precision)

[Representativeness](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#representativeness)

[Search quality measurement expansion](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#search-quality-measurement-expansion)

[Other languages](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#other-languages)

[Advanced search](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#advanced-search)

[Downloadable public data](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#downloadable-public-data)

[Caveats and known limitations](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#caveats)

[Factors affecting recall](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#recallfactors)

[Factors affecting precision](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#precisionfactors)

[Factors affecting representativeness](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#representativeness-2)

[Appendix](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#appendix)

[Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#disclosures-and-disclaimers)

[Test search scope for endpoints](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#scope)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#learn-more)

# Search quality approach

This document describes Meta's approach to search quality for Meta Content Library and API.

## Definitions

- **Entities** Objects in the social graph returned by Meta Content Library and Meta Content Library API which generate or contain content and are associated with a unique ID in internal systems. Includes Facebook Pages, groups, events, profiles and posts, as well as Instagram accounts and posts.

- **Content** Text and other data associated with entities, returned as fields in Meta Content Library and API.

- **Eligible / Visible** Entities or content surfaced via Meta Content Library and API that meet our standards and is consistent with what is publicly accessible information. See [Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary) for details on the scope of included data.

- **Endpoint** Meta Content Library or API endpoint corresponding to a specific type of entity.


## Search overview

Queries in Meta Content Library and API are powered by a version of Facebook’s [search engine infrastructure](https://research.facebook.com/publications/unicorn-a-system-for-searching-the-social-graph/), which relies on a combination of indexing and ranking to return relevant entities. The retrieval function combines matched and ranked IDs from a query using the same distributed [memory caching layer](https://l.facebook.com/l.php?u=https%3A%2F%2Fengineering.fb.com%2F2013%2F06%2F25%2Fcore-data%2Ftao-the-power-of-the-graph%2F&h=AUAOTUlEBsycJdvZN5_L-cpsd4vqJbJZrkHsSuOZGck_VOIsdQkZ1JlLFrW3ViTpON7q9XlILdhREOPMcDnM4FuByyEiCY4RVF5KLGhq9hYeyKMqLl01ZUzv4alkLrkZMxNGHPwu3Lyhlw) which serves live platform content. This ensures that results represent the most current state of content on the platform and meet privacy-preserving visibility criteria (see [Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary) for details).

As content is created or modified on Meta platforms, associated entities are registered to a search index built from individual words extracted from text fields as _tokens_. Tokenization generally isolates words separated by spaces or punctuation ( ?@$%^\*()+=~\[{}\];:"<>\|. ), with some URL normalization and locale-specific adjustments for non-English languages. Tokenization is exact, in that it does not introduce additional word variants ("cats" will not be tokenized to "cat"). Direct mentions of users or other platform entities (via @) are not tokenized and are scrubbed from returned text fields, and are thus not searchable.

At query time, relevant content is identified by exact matching between tokens and individual search terms. Candidate matches are then subject to additional filtering via Boolean query logic (see [Advanced search guidelines](https://developers.facebook.com/docs/content-library-api/adv-search)) and other selected filters. Matching is performed independently by word in a query, meaning that searching by phrase is not supported (queries “All for one” and “One for all” are equivalent).

## Initial testing

We expect our search quality measurement methodology to evolve over time. Here we outline a set of initial tests of search quality in the Meta Content Library and API. The systems which underlie search are complex and the data models as well as privacy rules which determine content visibility evolve over time, meaning that quality regressions can occur. Furthermore, as we develop the research tools, we welcome feedback about bugs or unexpected behavior from the user community. See [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers) for details on reporting issues.

### Methods

#### Initial test queries

We generated test search results for each endpoint (Facebook Pages, groups, events, profiles and posts, Instagram accounts and posts, and the downloadable portion of Facebook posts and Instagram posts) using a sample of approximately 50 terms including common words such as _spray_, neutral words such as _sugar_ and socially charged words such as _transphobic_. These initial test queries consisted of single terms all in English with no non-Latin characters or symbols (for example, ‘, #, $ or @). Additional query parameters for each endpoint are listed in [Test search scope for endpoints](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#scope). Test queries resulting in > 100,000 results were excluded from further analysis.

#### Validation data

Lists of expected entities for test queries were generated from regex-based full-text searches on a SQL-like database backend. Tables in this database are built from periodic snapshots of logged platform content and thus are known to differ slightly from what is available in Meta Content Library UI and API at search time due to time lags and incomplete visibility filters. This dataset thus constitutes a secondary validation channel rather than source of truth and regressions in quality metrics may be a composite of both true indexing errors and/or measurement noise. See [Caveats and known limitations](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#caveats).

### Recall

In principle, entities should be returned when (a) there is an exact match with search term(s), (b) the content is eligible to be retrieved, and (c) the total corpus of matching results does not exceed the technical query limit of 100,000 results.

We measured recall as follows:

(entities returned) ∩ (entities expected) / (entities expected)

The following table shows the average of daily recall values across test queries from December 1st to December 5th, 2024.

| Endpoint | 20th percentile recall | Median |
| --- | --- | --- |
| Facebook Page | 99% | 99% |
| Facebook group | 99% | 99% |
| Facebook event | 99% | 99% |
| Facebook profile | 99% | 99% |
| Facebook post | 97% | 99% |
| Instagram account | 99% | 99% |
| Instagram post | 96% | 99% |

### Rank recall

Results which represent the _top N_ results ordered by creation time or views should also be complete. For Meta Content Library, which returns a truncated list of ranked results, we generated a _ranked_ version of recall which is calculated as follows:

(top N entities) ∩ (top N expected entities) / (top N expected entities)

The following table shows the average of daily recall values for the top 1000 results ranked by creation time and view across test queries from December 1st to December 5th, 2024.

| Endpoint | 20th percentile ranked recall | Median ranked recall |
| --- | --- | --- |
| Facebook post (ranked by creation time) | 99% | 99% |
| Instagram post (ranked by creation time) | 96% | 99% |
| Facebook post (ranked by view) | 95% | 99% |
| Instagram post (ranked by view) | 99% | 99% |

### Precision

Only results which exactly match search terms should be returned, excluding, for instance, partial index matches (broom → broomstick) or fuzzy matches (broom → mop). Precision was measured as:

(returned entities matching query exactly) / (all returned entities)

The following table shows the range in average daily precision values across test queries by endpoint from December 1st to December 5th, 2024.

| Endpoint | 20th percentile precision | Median precision |
| --- | --- | --- |
| Facebook Page | 99% | 99% |
| Facebook group | 99% | 99% |
| Facebook event | 99% | 99% |
| Facebook profile | 98% | 99% |
| Facebook post | 99% | 99% |
| Instagram account | 98% | 99% |
| Instagram post | 98% | 99% |

### Representativeness

In cases where incomplete results are returned (recall < 100%), results may be useful provided they are not overly biased (that is, they are consistent with a random uniform sample of the complete results). We measured representativeness using a series of statistical tests for bias at the individual query level.

#### Query-level bias

For each test query we compared whether a summary statistic (mean, for example) calculated using the results from the Meta Content Library API reasonably approximated results obtained from the validation dataset (which has high recall). Across several data dimensions including engagement, exposure, and creator demographics, we performed a series of t-tests comparing means derived from the Meta Content Library API to means derived from the validation dataset. We then calculated the percent of queries which lacked statistically significant evidence of bias (p > 0.05). Finally, we calculated the mean of metrics across all dimensions.

We performed two versions of this test using methods which differed in their level of sensitivity to small differences between Meta Content Library API results and validation data. In the first version, we used a Welch’s T-test, which is appropriate for detecting major distributional differences between datasets that might affect inference about population-level traits. It is less sensitive to small differences between datasets and we expect most appropriate for research use cases involving trends and summaries.

The following table shows average daily percent of test queries generating non-biased results using a Welch’s T-test across endpoints from December 1st to December 5th, 2024.

| Endpoint | Representativeness - Welch t-test |
| --- | --- |
| Facebook Page | 94% |
| Facebook group | 93% |
| Facebook event | 81% |
| Facebook profile | 92% |
| Facebook post | 60% |
| Instagram account | 99% |
| Instagram post | 95% |

In the second version of the query-level bias test we compared Meta Content Library API and validation datasets using a pairwise t-test (incorporating covariance between samples). This test is more powered to detect differences between datasets and is appropriate for assessing whether small subsets of entities may be missing or over-represented. For instance, this metric could highlight significant bias even with 98% recall and a negligible difference in means, due to any imbalance in the remaining data. Given known issues with the validation dataset failing to exclude some ineligible entities based on visibility criteria, we expect these measures to be more conservative and likely underestimates of representativeness.

The following table shows percent of test queries generating non-biased results using a paired t-test across endpoints from December 1st to December 5th, 2024.

| Endpoint | Representativeness - paired t-test |
| --- | --- |
| Facebook Page | 71% |
| Facebook group | 53% |
| Facebook event | 64% |
| Facebook profile | 47% |
| Facebook post | 54% |
| Instagram account | 56% |
| Instagram post | 67% |

## Search quality measurement expansion

While in initial testing we focused on English to measure the search quality, in our expansion, we extended the exact same methodology to other languages and advanced search (search with logic operators AND, OR and NOT).

### Other languages

We used the same methodology to measure the search quality of the queries in Arabic, German and Hindi. These languages were selected based on the language features that the team believe are most likely to impact search quality. The features that the team considered are diacritics (for example, accents), non-Roman characters, and right-to-left. We also wanted to cover at least one non-English European language.

Based on the analysis, we learned:

- The overall search quality of all the new languages is about the same level as English single keywords.

- Since the search quality is reasonable for these languages, we expect to see very similar results for most other languages too.


The following table shows all average daily metric values across test queries by language and endpoint from December 1st to December 5th, 2024. Representativeness is an average across all dimensions that are mentioned in the representativeness section.

| Language | Endpoint | Recall | Precision | Representativeness - paired t-test | Representativeness - Welch t-test |
| --- | --- | --- | --- | --- | --- |
| Arabic | Facebook Page | 99% | 99% | 64% | 82% |
| Arabic | Facebook group | 99% | 99% | 40% | 67% |
| Arabic | Facebook event | 99% | 99% | 56% | 91% |
| Arabic | Facebook profile | 99% | 99% | 67% | 88% |
| Arabic | Facebook post | 99% | 99% | 57% | 62% |
| Arabic | Instagram account | 99% | 99% | 67% | 88% |
| Arabic | Instagram post | 99% | 99% | 60% | 82% |
| German | Facebook Page | 99% | 99% | 50% | 78% |
| German | Facebook group | 99% | 99% | 58% | 91% |
| German | Facebook event | 99% | 99% | 64% | 91% |
| German | Facebook profile | 99% | 99% | 70% | 91% |
| German | Facebook post | 98% | 99% | 65% | 67% |
| German | Instagram account | 98% | 99% | 46% | 84% |
| German | Instagram post | 99% | 98% | 53% | 76% |
| Hindi | Facebook Page | 99% | 99% | 57% | 78% |
| Hindi | Facebook group | 99% | 99% | 50% | 80% |
| Hindi | Facebook event | 99% | 99% | 65% | 88% |
| Hindi | Facebook profile | 99% | 99% | 56% | 83% |
| Hindi | Facebook post | 98% | 99% | 60% | 65% |
| Hindi | Instagram account | 99% | 99% | 65% | 87% |
| Hindi | Instagram post | 99% | 99% | 60% | 78% |

We are also aware of a few limitations that our system has for other languages. The limitations are as follows:

- Meta Content Library API does not read any keywords with “ß” in German or semi-space (half-space) in Arabic.

- In Arabic, a word can be written with and without diacritics. Content Library API can only find the exact match for each form. Thus, if a researcher wants to find all posts related to that keyword, they have to search all forms of those keywords to get full results. For example, if a researcher needs to find all posts related to term مهاجر, they need to search مُهاجِر or مُهاجر or مهاجِر or مهاجر to get all the results.


### Advanced search

Advanced search includes searching keyword combinations with logic operators AND, OR and NOT.

The following table shows average daily metric values across advanced search test queries by endpoint from December 1st to 5th, 2024. Representativeness is an average across all dimensions that are mentioned in the representativeness section.

| Entity type | Recall | Representativeness - Paired t-test | Representativeness - Welch t-test |
| --- | --- | --- | --- |
| Facebook Page | 99% | 67% | 92% |
| Facebook group | 99% | 59% | 92% |
| Facebook event | 99% | 52% | 92% |
| Facebook profile | 98% | 72% | 86% |
| Facebook post | 94% | 57% | 60% |
| Instagram account | 98% | 84% | 99% |
| Instagram post | 95% | 71% | 92% |

### Downloadable public data

We also extended the same methodology to measure the quality of downloadable public data. Since downloadable public data is a subset of Facebook posts and profiles as well as Instagram accounts and posts, and we continuously measure the quality of these datasets, we only measure the quality of downloadable public data periodically and expect the same quality as the original datasets.

The following table shows average daily metric values across test queries by endpoint from October 27 to October 31, 2024.

| Endpoint | Recall | Precision |
| --- | --- | --- |
| Downloadable Facebook posts | 91% | 99% |
| Downloadable Instagram posts | 91% | 98% |

## Caveats and known limitations

#### Why would results be inconsistent from one time point to another?

Inconsistencies between identical searches made at separate time points can be caused by entity visibility changes over time, which may be due to content being created, deleted or modified. There may also occasionally be short lags between when content is created or modified and when it is indexed.

#### Why am I not seeing an entity I can find on the platform?

Apart from coverage gaps or delivery issues mentioned below (see [Factors affecting recall](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#recallfactors)), it is possible the content is not eligible to be visible in the Meta Content Library and API. The visibility rules for content are complex and constantly evolving with new policies and regulations, making it possible that some content could be theoretically viewed by an individual on the platform but not exposed via the Meta Content Library and API. For instance, visibility of some content is geographically restricted to users from the country where the content was produced. Also, direct mentions (via @) are not searchable, meaning that a result will not be returned if a matching term is only found in a direct mention.

#### Why would a search result not match my query?

Apart from tokenization issues listed below (see [Factors affecting precision](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#precisionfactors)), it is possible that the content actually does contain the search terms, but they are found in different text fields or far apart within the text. Search matches query terms independently and scans all text fields visible from the UI. It also does not support phrase searching. Thus a search for “Walter Payton” could match a page listing basketball players “Walter Williams” and “Gary Payton” without reference to a “Walter Payton” anywhere in the text.

#### Media search

We do not cover media search in search quality measurement so none of the above metrics apply to media search.

### Factors affecting recall

- **False positives in the validation data (denominator of recall equation)**. In our tests, we have found that the validation dataset may occasionally include non-eligible entities for a given search term due to lags between real-time content visibility and privacy status and their representation in the databases used for validation (see validation data presented earlier). This means that true recall estimates are likely underestimated.

- **Edge cases or gaps in coverage (true negatives)**. Indexing data at the scale at which Meta operates means that occasionally some content may be imperfectly indexed or missed. Furthermore, internal data models may change, such as when new features for creating and sharing content on platform are added. Thus there may be a lag between when content is available on platforms and when it is indexed. As we improve and scale the product, we appreciate any reported cases of missing data from search (see [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers) for information on reporting).

- **Asynchronous delivery issues**. The Meta Content Library and API entity loading mechanisms are complex and memory-intensive at scale. Occasionally, the loading process for an entity can become too memory-intensive and fail, resulting in the exclusion of that entity from the returned results.


### Factors affecting precision

- **String-matching used to validate precision is unable to approximate tokenization rules**. Precision is checked using basic regular expression searches with strict definitions of word boundaries. However tokenization may be more flexible, especially with different language localizations, text involving unicode, URLs, and other patterns. The existence of these edge cases means that precision will be under-estimated to some extent.

- **The search term was tokenized in a context-specific way**. Occasionally words with unicode symbols, non-English characters, accent marks or URLs may be tokenized in a form that differs from its presented value. For instance, the content with the French word `congrégation` may be returned for a query on the English word `congregation`, despite the literal difference between the acute accented é and its English counterpart.


### Factors affecting representativeness

- **Representativeness issues generally stem from the same factors affecting recall**. In these cases there is a population of entities which are either (a) not returned by the Meta Content Library API due to gaps in indexing / delivery, or (b) incorrectly included in the validation dataset adding noise to the calculation. If these groups of entities have similar properties along the data dimensions tested they can influence the representativeness metrics.

- **The per-query bias test uses a probabilistic statistical test which uses an alpha = 0.05 cutoff by convention**. Thus for each test term there is a 5% probability that the test will be a false positive (Type I error rate).


## Appendix

### Disclosures and disclaimers

See [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers).

### Test search scope for endpoints

The following table summarizes the test search scope for all endpoints.

| Endpoint | Test search scope |
| --- | --- |
| Facebook Page | Eligible Facebook pages created within the year prior to the query date |
| Facebook group | All eligible Facebook groups |
| Facebook event | Eligible Facebook events created within the year prior to the query date |
| Facebook profile | Eligible Facebook profiles |
| Facebook post | Eligible posts created within two days prior to the given query date |
| Instagram account | Eligible Instagram Creator and Business accounts created within a year prior to the query date |
| Instagram post | Eligible posts created within a day prior to the given query date |

## Learn more

- [Facebook's search engine infrastructure](https://research.facebook.com/publications/unicorn-a-system-for-searching-the-social-graph/)

- [Distributed memory caching layer](https://l.facebook.com/l.php?u=https%3A%2F%2Fengineering.fb.com%2F2013%2F06%2F25%2Fcore-data%2Ftao-the-power-of-the-graph%2F&h=AUA1mCA5DL97H_jvuJX9dBa7kjFCmBtsqCMev4vl7oQ-fIW5VDiKcsIENy5XZWG4W5aYkzHC5xBCuHgXVa_IMO4v06wj3kU71wOfeUxxfS6IsjvNx_mDWW7-k33ej0zAGA76hc59ZyIRKA)

- [Advanced search guidelines](https://developers.facebook.com/docs/content-library-api/adv-search)

- [Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary)

- [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library/disclosures-disclaimers)


On This Page

[Search quality approach](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#search-quality-approach)

[Definitions](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#definitions)

[Search overview](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#search-overview)

[Initial testing](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#initial-testing)

[Methods](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#methods)

[Recall](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#recall)

[Rank recall](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#rank-recall)

[Precision](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#precision)

[Representativeness](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#representativeness)

[Search quality measurement expansion](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#search-quality-measurement-expansion)

[Other languages](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#other-languages)

[Advanced search](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#advanced-search)

[Downloadable public data](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#downloadable-public-data)

[Caveats and known limitations](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#caveats)

[Factors affecting recall](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#recallfactors)

[Factors affecting precision](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#precisionfactors)

[Factors affecting representativeness](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#representativeness-2)

[Appendix](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#appendix)

[Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#disclosures-and-disclaimers)

[Test search scope for endpoints](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#scope)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality#learn-more)