---
url: https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/
title: Graph API Reference v25.0: Whats App Business Account Message Templates
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fwhats-app-business-account%2Fmessage_templates%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Whats App Business Account Message Templates](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Reading)

[Requirements](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#requirements)

[Request Syntax](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#request-syntax)

[Path Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#path-parameters)

[Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#response)

[Sample Request](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-request)

[Sample Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-response)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Creating)

[Request Syntax](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#request-syntax-2)

[Path Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#path-parameters-2)

[Post Body](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#post-body)

[Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#response-2)

[Sample Request](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-request-2)

[Sample Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-response-2)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Deleting)

[Request Syntax](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#request-syntax-3)

[Path Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#path-parameters-3)

[Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#response-3)

[Sample Request](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-request-3)

[Sample Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-response-3)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#parameters-3)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#return-type-2)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#error-codes-3)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#)

# Whats App Business Account Message Templates

Represents a collection of templates on a [WhatsApp Business Account](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/). See [Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates).

## Reading

Get a list of templates on a WhatsApp Business Account.

### Requirements

| Type | Description |
| --- | --- |
| Access Tokens | [User](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#user-access-tokens), [System User](https://developers.facebook.com/docs/whatsapp/access-tokens#system-user-access-tokens), or [Business Integration System User](https://developers.facebook.com/docs/whatsapp/access-tokens#business-integration-system-user-access-tokens) |
| Permissions | [whatsapp\_business\_management](https://developers.facebook.com/docs/permissions#w) |

### Request Syntax

```http
GET /<WHATSAPP_BUSINESS_ACCOUNT_ID>/message_templates
  ?category=<CATEGORY>,
  &content=<CONTENT>,
  &language=<LANGUAGE>,
  &name=<NAME>,
  &name_or_content=<NAME_OR_CONTENT>,
  &quality_score=<QUALITY_SCORE>,
  &status=<STATUS>
```

### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<WHATSAPP_BUSINESS_ACCOUNT_ID>` | WhatsApp Business Account ID. |

### Response

A list of [WhatsApp Message Template](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-hsm/) nodes.

### Sample Request

```curl
curl 'https://graph.facebook.com/v16.0/102290129340398/message_templates?category=utility' \
-H 'Authorization: Bearer EAAJB...'
```

### Sample Response

```json
{
  "data": [\
    {\
      "name": "order_delivery_update",\
      "components": [\
        {\
          "type": "HEADER",\
          "format": "LOCATION"\
        },\
        {\
          "type": "BODY",\
          "text": "Good news {{1}}! Your order #{{2}} is on its way to the location above. Thank you for your order!",\
          "example": {\
            "body_text": [\
              [\
                "Mark",\
                "566701"\
              ]\
            ]\
          }\
        },\
        {\
          "type": "FOOTER",\
          "text": "To stop receiving delivery updates, tap the button below."\
        },\
        {\
          "type": "BUTTONS",\
          "buttons": [\
            {\
              "type": "QUICK_REPLY",\
              "text": "Stop Delivery Updates"\
            }\
          ]\
        }\
      ],\
      "language": "en_US",\
      "status": "APPROVED",\
      "category": "UTILITY",\
      "id": "1667192013751005"\
    },\
    ...\
  ],
  "paging": {
    "cursors": {
      "before": "MAZDZD",
      "after": "MjQZD"
    }
  }
}
```

### Parameters

| Parameter | Description |
| --- | --- |
| `category`<br>array<enum {ACCOUNT\_UPDATE, PAYMENT\_UPDATE, PERSONAL\_FINANCE\_UPDATE, SHIPPING\_UPDATE, RESERVATION\_UPDATE, ISSUE\_RESOLUTION, APPOINTMENT\_UPDATE, TRANSPORTATION\_UPDATE, TICKET\_UPDATE, ALERT\_UPDATE, AUTO\_REPLY, TRANSACTIONAL, OTP, UTILITY, MARKETING, AUTHENTICATION, FREE\_SERVICE}> | The category for a template |
| `content`<br>string | The content for a template |
| `language`<br>array<string> | A list of supported languages that are available for each template |
| `name`<br>string | The name for a message template |
| `name_or_content`<br>string | Returns a list of message templates where the value for `name` or `content` match this value |
| `quality_score`<br>array<enum {GREEN, YELLOW, RED, UNKNOWN}> | The quality score for a template |
| `since`<br>datetime/timestamp | Query param to fetch templates based on last\_updated\_time since a given unix timestamp |
| `status`<br>array<enum {APPROVED, IN\_APPEAL, PENDING, REJECTED, PENDING\_DELETION, DELETED, DISABLED, PAUSED, LIMIT\_EXCEEDED, ARCHIVED}> | The review status for a template |
| `until`<br>datetime/timestamp | Query param to fetch templates based on last\_updated\_time until a given unix timestamp |

### Fields

Reading from this edge will return a JSON formatted result:

```
{
    "data": [],
    "paging": {},
    "summary": {}
}
```

#### `data`

A list of [WhatsAppMessageTemplate](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-hsm/) nodes.

#### `paging`

For more details about pagination, see the [Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/#paging).

#### `summary`

Aggregated information about the edge, such as counts. Specify the fields to fetch in the summary param (like `summary=total_count`).

| Field | Description |
| --- | --- |
| `total_count`<br>unsigned int32 | The total number of message templates that belong to a WhatsApp Business Account |
| `message_template_count`<br>int32 | The current number of message templates that belong to the WhatsApp Business Account |
| `message_template_limit`<br>int32 | The maximum number of message templates that can belong to a WhatsApp Business Account |
| `are_translations_complete`<br>bool | The status for template translations |

### Error Codes

| Error | Description |
| --- | --- |
| 80008 | There have been too many calls to this WhatsApp Business account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |
| 100 | Invalid parameter |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |

## Creating

You can make a POST request to `message_templates` edge from the following paths:

- [`/{whats_app_business_account_id}/message_templates`](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/)

When posting to this edge, a [WhatsAppMessageTemplate](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-hsm/) will be created.

| Type | Description |
| --- | --- |
| Access Tokens | [User](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#user-access-tokens), [System User](https://developers.facebook.com/docs/whatsapp/access-tokens#system-user-access-tokens), or [Business Integration System User](https://developers.facebook.com/docs/whatsapp/access-tokens#business-integration-system-user-access-tokens) |
| Permissions | [whatsapp\_business\_management](https://developers.facebook.com/docs/permissions#w) |

### Request Syntax

```https
POST /<WHATSAPP_BUSINESS_ACCOUNT_ID>/message_templates
```

### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<WHATSAPP_BUSINESS_ACCOUNT_ID>` | ID of the WhatsApp Business Account to create the template on. |

### Post Body

See [Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#parameters-2) for property descriptions.

```json
{
  "allow_category_change": <ALLOW_CATEGORY_CHANGE>,
  "name": "<NAME>",
  "language": "<LANGUAGE>",
  "category": "<CATEGORY>",
  "components": [<COMPONENTS>]
}
```

### Response

See [Return Type](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#return-type).

### Sample Request

```curl
curl 'https://graph.facebook.com/v25.0/102290129340398/message_templates' \
-H 'Content-Type: application/json' \
-H 'Authorization: Bearer EAAJB...' \
-d '
{
  "name": "seasonal_promotion",
  "language": "en",
  "category": "MARKETING",
  "components": [\
    {\
      "type": "HEADER",\
      "format": "TEXT",\
      "text": "Our {{1}} is on!",\
      "example": {\
        "header_text": [\
          "Summer Sale"\
        ]\
      }\
    },\
    {\
      "type": "BODY",\
      "text": "Shop now through {{1}} and use code {{2}} to get {{3}} off of all merchandise.",\
      "example": {\
        "body_text": [\
          [\
            "the end of August","25OFF","25%"\
          ]\
        ]\
      }\
    },\
    {\
      "type": "FOOTER",\
      "text": "Use the buttons below to manage your marketing subscriptions"\
    },\
    {\
      "type":"BUTTONS",\
      "buttons": [\
        {\
          "type": "QUICK_REPLY",\
          "text": "Unsubcribe from Promos"\
        },\
        {\
          "type":"QUICK_REPLY",\
          "text": "Unsubscribe from All"\
        }\
      ]\
    }\
  ]
}'
```

### Sample Response

```json
{
    "id": "594425479261596",
    "status": "PENDING",
    "category": "MARKETING"
}
```

### Parameters

| Parameter | Description |
| --- | --- |
| `allow_category_change`<br>boolean | Set to `true` to allow us to assign a category based on our [template guidelines](https://developers.facebook.com/docs/whatsapp/updates-to-pricing/new-template-guidelines) and the template's contents. This can prevent the template `status` from immediately being set to `REJECTED` upon creation due to miscategorization.<br>If omitted, template will not be auto-assigned a category and its status may be set to `REJECTED` if determined to be miscategorized.<br>See [Template Categories](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/#categories). |
| `category`<br>enum {UTILITY, MARKETING, AUTHENTICATION} | Template category. See [Template Categories](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/#categories).<br>Required |
| `components`<br>array<JSON object> | Array of components that make up the template. See [Template Components](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/components).<br>For types `HEADER`, `BODY`, `FOOTER`, `text` is required. |
| `type`<br>enum {GREETING, HEADER, BODY, FOOTER, BUTTONS, CAROUSEL, ALBUM, LIMITED\_TIME\_OFFER, CALL\_PERMISSION\_REQUEST, TAP\_TARGET\_CONFIGURATION, ATTACHMENT} | Component type.<br>Required |
| `format`<br>enum {TEXT, IMAGE, DOCUMENT, VIDEO, LOCATION, GIF, COLLECTION} | Component format. |
| `text`<br>string | **Required for components with type `HEADER`,`BODY`**<br>Component text. |
| `buttons`<br>array<JSON object> | Button components to be used in the template. |
| `type`<br>enum {QUICK\_REPLY, URL, PHONE\_NUMBER, OTP, MPM, CATALOG, FLOW, VOICE\_CALL, VIDEO\_CALL, POSTBACK, BOOKING\_STATUS, PAYMENT\_REQUEST, REQUEST\_CONTACT\_INFO} | Button type.<br>Required |
| `text`<br>string | Button text. |
| `url`<br>URI | url |
| `phone_number`<br>phone number string | phone\_number |
| `example`<br>array<string> | example |
| `flow_id`<br>int64 | flow\_id |
| `zero_tap_terms_accepted`<br>boolean | zero\_tap\_terms\_accepted |
| `flow_action`<br>enum {NAVIGATE, DATA\_EXCHANGE} | flow\_action |
| `navigate_screen`<br>string | navigate\_screen |
| `supported_apps`<br>array<JSON object> | supported\_apps |
| `package_name`<br>string | package\_name<br>Required |
| `signature_hash`<br>string | signature\_hash<br>Required |
| `ttl_minutes`<br>int64 | ttl\_minutes |
| `flow_name`<br>string | flow\_name |
| `flow_json`<br>string | flow\_json |
| `icon`<br>enum {DOCUMENT, PROMOTION, REVIEW} | icon |
| `endpoint_uri`<br>URI | endpoint\_uri |
| `example`<br>JSON object | Placeholder examples. Templates will not be approved without examples. |
| `header_text`<br>array<string> | header\_text |
| `body_text`<br>array<array<string>> | body\_text |
| `header_handle`<br>array<string> | header\_handle |
| `header_text_named_params`<br>array<JSON object> | header\_text\_named\_params |
| `param_name`<br>string | param\_name<br>Required |
| `example`<br>string | example<br>Required |
| `body_text_named_params`<br>array<JSON object> | body\_text\_named\_params |
| `param_name`<br>string | param\_name<br>Required |
| `example`<br>string | example<br>Required |
| `creative_sourcing_spec`<br>JSON object | Defines the ACO dimensions specification the Biz can opt in or out of. |
| `associated_product_set_id`<br>numeric string | The associated product set id |
| `is_primary_device_delivery_only`<br>boolean | is\_primary\_device\_delivery only |
| `language`<br>string | Template [location and locale code](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates/supported-languages).<br>Required |
| `library_template_body_inputs`<br>JSON object | Optional data during creation of a template from a library template. These are optional fields for the body component. |
| `add_contact_number`<br>boolean | add\_contact\_number |
| `add_learn_more_link`<br>boolean | add\_learn\_more\_link |
| `add_security_recommendation`<br>boolean | add\_security\_recommendation |
| `add_track_package_link`<br>boolean | add\_track\_package\_link |
| `code_expiration_minutes`<br>int64 | code\_expiration\_minutes |
| `library_template_button_inputs`<br>array<JSON object> | Optional data during creation of a template from a library template. These are optional fields for the button component. |
| `type`<br>enum {QUICK\_REPLY, URL, PHONE\_NUMBER, OTP, MPM, CATALOG, FLOW, VOICE\_CALL, VIDEO\_CALL, POSTBACK, BOOKING\_STATUS, PAYMENT\_REQUEST, REQUEST\_CONTACT\_INFO} | type<br>Required |
| `phone_number`<br>string | phone\_number |
| `url`<br>JSON object | url |
| `base_url`<br>string | base\_url<br>Required |
| `url_suffix_example`<br>string | url\_suffix\_example |
| `otp_type`<br>enum {COPY\_CODE, ONE\_TAP, ZERO\_TAP, NO\_BUTTONS} | otp\_type |
| `zero_tap_terms_accepted`<br>boolean | zero\_tap\_terms\_accepted |
| `supported_apps`<br>array<JSON object> | supported\_apps |
| `package_name`<br>string | package\_name<br>Required |
| `signature_hash`<br>string | signature\_hash<br>Required |
| `booking_url`<br>JSON object | booking\_url |
| `base_url`<br>string | base\_url<br>Required |
| `url_suffix_example`<br>string | url\_suffix\_example |
| `booking_management_url`<br>JSON object | booking\_management\_url |
| `base_url`<br>string | base\_url<br>Required |
| `url_suffix_example`<br>string | url\_suffix\_example |
| `notes`<br>JSON object | notes |
| `text`<br>string | text<br>Required |
| `positional_params`<br>array<string> | positional\_params |
| `named_params`<br>array<JSON object> | named\_params |
| `param_name`<br>string | param\_name<br>Required |
| `example`<br>string | example<br>Required |
| `library_template_name`<br>string | library\_template\_name |
| `message_send_ttl_seconds`<br>int64 | Time to live for message template sent. If users are offline for more than TTL duration after message template is sent, we will retry the delivery for a period of time known as a time-to-live, TTL, or the message validity period.<br>TTL can be configured for certain message types. See [Time-To-Live](https://developers.facebook.com/docs/whatsapp/business-management-api/message-templates#time-to-live--ttl---customization--defaults--min-max-values--and-compatibility). |
| `name`<br>string | Template name.<br>Required |
| `optimization_spec`<br>JSON object | optimization\_spec |
| `parameter_format`<br>enum {NAMED, POSITIONAL} | The parameter format of the template |
| `product_set_id`<br>numeric string | \[Coming soon\] This will let you connect a product set (from your catalog) to the template and send messages without needing to specify products in the send API call. Our product recommendation engine will select the products your customers are most interested in and likely to convert. This feature is called Dynamic Product Message.<br>Note: This is still in development. |
| `sub_category`<br>enum {ORDER\_DETAILS, ORDER\_STATUS, RICH\_ORDER\_STATUS} | Sub category of the template |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node to which you POSTed.

Struct {

`id`: numeric string,

`status`: enum,

`category`: enum,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 80008 | There have been too many calls to this WhatsApp Business account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |
| 131009 | Parameter value is not valid |
| 192 | Invalid phone number |
| 200 | Permissions error |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 200002 | HSM Template creation failed |
| 139000 | Blocked by Integrity |

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can dissociate a [WhatsAppMessageTemplate](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-hsm/) from a [WhatsAppBusinessAccount](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/) by making a DELETE request to [`/{whats_app_business_account_id}/message_templates`](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/).

| Type | Description |
| --- | --- |
| Access Tokens | [User](https://developers.facebook.com/docs/whatsapp/business-management-api/get-started#user-access-tokens), [System User](https://developers.facebook.com/docs/whatsapp/access-tokens#system-user-access-tokens), or [Business Integration System User](https://developers.facebook.com/docs/whatsapp/access-tokens#business-integration-system-user-access-tokens) |
| Permissions | [whatsapp\_business\_management](https://developers.facebook.com/docs/permissions#w) |

### Request Syntax

```https
DELETE /<WHATSAPP_BUSINESS_ACCOUNT_ID>/message_templates
```

### Path Parameters

| Placeholder | Value |
| --- | --- |
| `<WHATSAPP_BUSINESS_ACCOUNT_ID>` | ID of the WhatsApp Business Account that owns the template. |

### Response

See [Return Type](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#return-type-2).

### Sample Request

```curl
curl -X DELETE 'https://graph.facebook.com/v25.0/102290129340398/message_templates?name=order_confirmation' \
-H 'Authorization: Bearer EAAJB...'
```

### Sample Response

```json
{
  "success": true
}
```

### Parameters

| Parameter | Description |
| --- | --- |
| `hsm_id`<br>numeric string | ID of template to be deleted. Required with name if deleting a specific template by ID. |
| `hsm_ids`<br>array<numeric string> | IDs of all the templates for bulk deletion. Required if you wish to delete templates in bulk |
| `name`<br>string | Name of template to be deleted. Deletes templates matching the name in all languages |

### Return Type

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |
| 80008 | There have been too many calls to this WhatsApp Business account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |

On This Page

[Whats App Business Account Message Templates](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Reading)

[Requirements](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#requirements)

[Request Syntax](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#request-syntax)

[Path Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#path-parameters)

[Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#response)

[Sample Request](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-request)

[Sample Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-response)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#fields)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Creating)

[Request Syntax](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#request-syntax-2)

[Path Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#path-parameters-2)

[Post Body](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#post-body)

[Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#response-2)

[Sample Request](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-request-2)

[Sample Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-response-2)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#Deleting)

[Request Syntax](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#request-syntax-3)

[Path Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#path-parameters-3)

[Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#response-3)

[Sample Request](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-request-3)

[Sample Response](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#sample-response-3)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#parameters-3)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#return-type-2)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/whats-app-business-account/message_templates/#error-codes-3)