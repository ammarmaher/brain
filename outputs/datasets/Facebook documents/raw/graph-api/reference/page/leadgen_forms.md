---
url: https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/
title: Lead Gen Forms
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fpage%2Fleadgen_forms%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)
- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)
- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)
- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Page Leadgen Forms](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#Reading)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#Creating)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#permissions)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#parameters)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#error-codes)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#)

# Page Leadgen Forms

## Reading

You can't perform this operation on this endpoint.

## Creating

You can make a POST request to `leadgen_forms` edge from the following paths:

- [`/{page_id}/leadgen_forms`](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/)

When posting to this edge, a [Page](https://developers.facebook.com/docs/graph-api/reference/page/) will be created.

#### Additional Errors

In addition to the errors listed below, you may receive unknown errors for `privacy_policy` if the URL is invalid or the `link_text` exceeds 70 characters.



### Permissions

If you upload an image by specifying `cover_photo` parameter, the `access_token` accompanying the request must include the `pages_manage_posts` permission.

### Parameters

| Parameter | Description |
| --- | --- |
| `allow_organic_lead_retrieval`<br>boolean | Default value: `true`<br>Previously, this flag controlled whether any leads submitted in a non-Ad context were retrievable. Now this flag will not be considered and it will be deprecated entirely. To control visibility of Lead Forms in a non-Ad context you should use 'block\_display\_for\_non\_targeted\_viewer' |
| `block_display_for_non_targeted_viewer`<br>boolean | Whether to make the organic post invisible to viewers in non-Ad context |
| `context_card`<br>Object | Optional context card shown as the intro page<br>Supports Emoji |
| `title`<br>string |  |
| `style`<br>enum {LIST\_STYLE, PARAGRAPH\_STYLE} |  |
| `content`<br>array<string> |  |
| `button_text`<br>string |  |
| `cover_photo_id`<br>numeric string |  |
| `cover_photo`<br>file | Custom cover photo for context card |
| `custom_disclaimer`<br>Object | Customized disclaimer including title, body content with inline links, and consent checkboxes<br>Supports Emoji |
| `title`<br>string |  |
| `body`<br>Object | Supports Emoji |
| `text`<br>string | Required |
| `url_entities`<br>array<JSON object> |  |
| `checkboxes`<br>list<Object> |  |
| `is_required`<br>boolean | Default value: `true` |
| `is_checked_by_default`<br>boolean | Default value: `false` |
| `text`<br>string | RequiredSupports Emoji |
| `key`<br>string | Supports Emoji |
| `follow_up_action_url`<br>URI | The final destination URL that user will go to when clicking view website button |
| `is_for_canvas`<br>boolean | Default value: `false`<br>Flag to indicate that the form is going to be used under a canvas |
| `is_optimized_for_quality`<br>boolean | Default value: `false`<br>Flag to indicate whether the form will be optimized for quality |
| `is_phone_sms_verify_enabled`<br>boolean | Default value: `false`<br>Whether the form requires phone sms verification when user submits |
| `locale`<br>enum {AR\_AR, CS\_CZ, DA\_DK, DE\_DE, EL\_GR, EN\_GB, EN\_US, ES\_ES, ES\_LA, FI\_FI, FR\_FR, HE\_IL, HI\_IN, HU\_HU, ID\_ID, IT\_IT, JA\_JP, KO\_KR, NB\_NO, NL\_NL, PL\_PL, PT\_BR, PT\_PT, RO\_RO, RU\_RU, SV\_SE, TH\_TH, TR\_TR, VI\_VN, ZH\_CN, ZH\_HK, ZH\_TW} | The locale of the form. Pre-defined questions renders in this locale |
| `name`<br>string | The name that will help identity the form<br>Required |
| `privacy_policy`<br>Object | The url and link\_text of the privacy policy of advertiser. link\_text is limited to a maximum of 70 characters.<br>Supports Emoji |
| `url`<br>string |  |
| `link_text`<br>string |  |
| `question_page_custom_headline`<br>string | The custom headline for the question page within the form |
| `questions`<br>list<Object> | An array of questions of the form<br>Required |
| `key`<br>string |  |
| `label`<br>string |  |
| `type`<br>enum {CUSTOM, CITY, COMPANY\_NAME, COUNTRY, DOB, EMAIL, GENDER, FIRST\_NAME, FULL\_NAME, JOB\_TITLE, LAST\_NAME, MARITIAL\_STATUS, WHATSAPP\_NUMBER, EDUCATION\_LEVEL, WEBSITE, PHONE, PHONE\_OTP, POST\_CODE, PROVINCE, RELATIONSHIP\_STATUS, STATE, STREET\_ADDRESS, ZIP, WORK\_EMAIL, MILITARY\_STATUS, WORK\_PHONE\_NUMBER, SLIDER, STORE\_LOOKUP, STORE\_LOOKUP\_WITH\_TYPEAHEAD, DATE\_TIME, ID\_CPF, ID\_AR\_DNI, ID\_CL\_RUT, ID\_CO\_CC, ID\_EC\_CI, ID\_PE\_DNI, ID\_MX\_RFC, JOIN\_CODE, USER\_PROVIDED\_PHONE\_NUMBER, FACEBOOK\_LEAD\_ID, EMAIL\_ALIAS, MESSENGER, VIN, LICENSE\_PLATE, THREAD\_LINK, ADDRESS\_LINE\_TWO} | Required |
| `inline_context`<br>string |  |
| `options`<br>array<JSON object> |  |
| `dependent_conditional_questions`<br>array<JSON object> |  |
| `conditional_questions_group_id`<br>numeric string |  |
| `should_enforce_work_email`<br>boolean | Whether to enable work email enforcement. |
| `thank_you_page`<br>Object | Optional customized thank you page displayed post submission<br>Supports Emoji |
| `title`<br>string | Required |
| `body`<br>string |  |
| `short_message`<br>string |  |
| `button_text`<br>string |  |
| `button_description`<br>string |  |
| `business_phone_number`<br>phone number string |  |
| `enable_messenger`<br>boolean | Default value: `false` |
| `website_url`<br>string |  |
| `button_type`<br>enum {VIEW\_WEBSITE, CALL\_BUSINESS, MESSAGE\_BUSINESS, DOWNLOAD, SCHEDULE\_APPOINTMENT, VIEW\_ON\_FACEBOOK, PROMO\_CODE, NONE, WHATSAPP, P2B\_MESSENGER, BOOK\_ON\_WEBSITE} | Required |
| `country_code`<br>string |  |
| `gated_file`<br>JSON object |  |
| `id`<br>numeric string | id |
| `tracking_parameters`<br>JSON object {string : string} | Map for additional tracking parameters to include with the form's field data |
| `upload_gated_file`<br>file | When using Meta's marketing API to create a lead ad, you can use this field to create a gated content thank you page. This field would be the file that you'd like to use as the gated file, and the thank you page button type should be VIEW\_ON\_FACEBOOK |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node represented by `id` in the return type.

Struct {

`id`: numeric string,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 192 | Invalid phone number |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 80005 | There have been too many leadgen api calls to this Page account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |
| 200 | Permissions error |
| 105 | The number of parameters exceeded the maximum for this operation |
| 190 | Invalid OAuth 2.0 Access Token |

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Page Leadgen Forms](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#Reading)

[Creating](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#Creating)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#permissions)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#parameters)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#error-codes)

[Updating](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/page/leadgen_forms/#Deleting)