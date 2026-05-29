---
url: https://developers.facebook.com/docs/graph-api/guides/error-handling
title: Handle Errors - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fguides%2Ferror-handling%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Handling Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling#handling-errors)

[Error Responses](https://developers.facebook.com/docs/graph-api/guides/error-handling#receiving-errorcodes)

[Error Codes](https://developers.facebook.com/docs/graph-api/guides/error-handling#errorcodes)

[Authentication Error Subcodes](https://developers.facebook.com/docs/graph-api/guides/error-handling#errorsubcodes)

[Rate Limiting Error Codes](https://developers.facebook.com/docs/graph-api/guides/error-handling#rate-limiting-error-codes)

# Handling Errors

Requests made to our APIs can result in several different error responses. The following document describes the recovery tactics and provides a list of error values with a map to the most common recovery tactic to use.

## Error Responses

The following represents a common error response resulting from a failed API request:

```js
{
  "error": {
    "message": "Message describing the error",
    "type": "OAuthException",
    "code": 190,
    "error_subcode": 460,
    "error_user_title": "A title",
    "error_user_msg": "A message",
    "fbtrace_id": "EJplcsCHuLu"
  }
}
```

- `message`: A human-readable description of the error.
- `code`: An error code. Common values are listed below, along with common recovery tactics.
- `error_subcode`: Additional information about the error. Common values are listed below.
- `error_user_msg`: The message to display to the user. The language of the message is based on the locale of the API request.
- `error_user_title`: The title of the dialog, if shown. The language of the message is based on the locale of the API request.
- `fbtrace_id`: Internal support identifier. When [reporting a bug](https://developers.facebook.com/bugs/) related to a Graph API call, include the `fbtrace_id` to help us find log data for debugging. However, this ID will expire shortly. To help the support team reproduce your issue, please attach a saved [graph explorer session](https://developers.facebook.com/tools/explorer/).

### Error Codes

| Code or Type | Name | What To Do |
| --- | --- | --- |
| OAuthException |  | If no subcode is present, the login status or access token has expired, been revoked, or is otherwise invalid. [Get a new access token](https://developers.facebook.com/docs/facebook-login/access-tokens#errors).<br>If a subcode is present, see the subcode. |
| 102 | API Session | If no subcode is present, the login status or access token has expired, been revoked, or is otherwise invalid. [Get a new access token](https://developers.facebook.com/docs/facebook-login/access-tokens#errors).<br>If a subcode is present, see the subcode. |
| 1 | API Unknown | Possibly a temporary issue due to downtime. Wait and retry the operation. If it occurs again, check that you are requesting an existing API. |
| 2 | API Service | Temporary issue due to downtime. Wait and retry the operation. |
| 3 | API Method | Capability or permissions issue. Make sure your app has the necessary capability or permissions to make this call. |
| 4 | API Too Many Calls | Temporary issue due to throttling. Wait and retry the operation, or examine your API request volume. |
| 17 | API User Too Many Calls | Temporary issue due to throttling. Wait and retry the operation, or examine your API request volume. |
| 10 | API Permission Denied | Permission is either not granted or has been removed. [Handle the missing permissions](https://developers.facebook.com/docs/facebook-login/permissions#handling). |
| 190 | Access token has expired | [Get a new access token](https://developers.facebook.com/docs/facebook-login/access-tokens#errors). |
| 200-299 | API Permission (Multiple values depending on permission) | Permission is either not granted or has been removed. [Handle the missing permissions](https://developers.facebook.com/docs/facebook-login/permissions#handling). |
| 341 | Application limit reached | Temporary issue due to downtime or throttling. Wait and retry the operation, or examine your API request volume. |
| 368 | Temporarily blocked for policies violations | Wait and retry the operation. |
| 506 | Duplicate Post | Duplicate posts cannot be published consecutively. Change the content of the post and try again. |
| 1609005 | Error Posting Link | There was a problem scraping data from the provided link. Check the URL and try again. |

### Authentication Error Subcodes

| Code | Name | What To Do |
| --- | --- | --- |
| 458 | App Not Installed | The User has not logged into your app. Reauthenticate the User. |
| 459 | User Checkpointed | The User needs to log in at https://www.facebook.com or https://m.facebook.com to correct an issue. |
| 460 | Password Changed | On iOS 6 and above, if the person logged in using the OS-integrated flow, direct them to Facebook OS settings on the device to update their password. Otherwise, they must log in to the app again. |
| 463 | Expired | Login status or access token has expired, been revoked, or is otherwise invalid. [Handle expired access tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#errors). |
| 464 | Unconfirmed User | The User needs to log in at https://www.facebook.com or https://m.facebook.com to correct an issue. |
| 467 | Invalid Access Token | Access token has expired, been revoked, or is otherwise invalid. [Handle expired access tokens](https://developers.facebook.com/docs/facebook-login/access-tokens#errors). |
| 492 | Invalid Session | User associated with the Page access token does not have an appropriate role on the Page. |

### Rate Limiting Error Codes

Visit the [Graph API Rate Limits guide](https://developers.facebook.com/docs/graph-api/overview/rate-limiting) for more information about Rate Limiting Error Codes.

On This Page

[Handling Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling#handling-errors)

[Error Responses](https://developers.facebook.com/docs/graph-api/guides/error-handling#receiving-errorcodes)

[Error Codes](https://developers.facebook.com/docs/graph-api/guides/error-handling#errorcodes)

[Authentication Error Subcodes](https://developers.facebook.com/docs/graph-api/guides/error-handling#errorsubcodes)

[Rate Limiting Error Codes](https://developers.facebook.com/docs/graph-api/guides/error-handling#rate-limiting-error-codes)