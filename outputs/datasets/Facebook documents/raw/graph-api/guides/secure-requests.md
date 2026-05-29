---
url: https://developers.facebook.com/docs/graph-api/guides/secure-requests
title: Secure Requests - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fguides%2Fsecure-requests%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Secure Graph API Calls](https://developers.facebook.com/docs/graph-api/guides/secure-requests#secure-graph-api-calls)

[Meta Crawler](https://developers.facebook.com/docs/graph-api/guides/secure-requests#meta-crawler)

[Login Security](https://developers.facebook.com/docs/graph-api/guides/secure-requests#login-security)

[Server Allow List](https://developers.facebook.com/docs/graph-api/guides/secure-requests#server-allow-list)

[Social Plugin Confirmation Steps](https://developers.facebook.com/docs/graph-api/guides/secure-requests#confirm_steps)

[Encryption](https://developers.facebook.com/docs/graph-api/guides/secure-requests#encryption)

[Verify Graph API Calls with appsecret\_proof](https://developers.facebook.com/docs/graph-api/guides/secure-requests#appsecret_proof)

[Generate the Proof](https://developers.facebook.com/docs/graph-api/guides/secure-requests#generate-the-proof)

[Add the Proof](https://developers.facebook.com/docs/graph-api/guides/secure-requests#add-the-proof)

[Require the Proof](https://developers.facebook.com/docs/graph-api/guides/secure-requests#require-the-proof)

# Secure Graph API Calls

Almost every Graph API call requires an [access token](https://developers.facebook.com/docs/facebook-login/access-tokens/). Malicious developers can steal access tokens and use them to send spam from your app. Meta has automated systems to detect this, but you can help us secure your app. This document covers some of the ways you can improve security in your app.

## Meta Crawler

A number of platform services such as Social Plugins and Open Graph require our systems to be able to reach your web pages. We recognize that there are situations where you might not want these pages on the public web, during testing or for other security reasons.

We've provided information on IP allow lists and User Agent strings for Meta's crawlers in our [Meta Crawler guide](https://developers.facebook.com/docs/sharing/webmasters/crawler).

## Login Security

There are a large number of settings you can change to improve the security of your app. Please see our [Login Security](https://developers.facebook.com/docs/facebook-login/security/) documentation for a checklist of things you can do.

It's also worth looking at our [access token](https://developers.facebook.com/docs/facebook-login/access-tokens/) documentation which covers various architectures and the security trade-offs that you should consider.

## Server Allow List

We also enable you to restrict some of your API calls to come from a list of servers that you have allowed to make calls. Learn more in our [login security](https://developers.facebook.com/docs/facebook-login/security#surfacearea) documentation.

## Social Plugin Confirmation Steps

In order to protect users from unintentionally liking content around the web, our systems will occasionally require them to confirm that they intended to interact with one of our Social Plugins via a "confirm" dialog. This is expected behavior and once the system has verified your site as a good actor, the step will be removed automatically.

## Encryption

When connecting to our servers your client must use TLS and be able to verify a certificate signed using [`sha256WithRSAEncryption`](https://l.facebook.com/l.php?u=http%3A%2F%2Fwww.alvestrand.no%2Fobjectid%2F1.2.840.113549.1.1.11.html&h=AUCXC1dyVoZaxkmQyTOelyaYhFdPv-ybB7Tu9W4dKczLsRUpyA5TdJvgKKVtZ6NJYnpd1U0h5zNWdzKK1Yc1-pDyeTQ0hvrTAOjgujfQPIaD8kxfjw5YVNM9OV8JcTk520O71e56g4bLUA).

Graph API supports TLS 1.2 and 1.3 and non-static RSA cipher suites. We are currently deprecating support for older TLS versions and static RSA cipher suites. Version 16.0 no longer supports TLS versions older than 1.1 or static RSA cipher suites. This change will apply to all API versions on May 3, 2023.

## Verify Graph API Calls with `appsecret_proof`

Access tokens are portable. It's possible to take an access token generated on a client by Meta's SDK, send it to a server and then make calls from that server on behalf of the client. An access token can also be stolen by malicious software on a person's computer or a man in the middle attack. Then that access token can be used from an entirely different system that's not the client and not your server, generating spam or stealing data.

Calls from a server can be better secured by adding a parameter called `appsecret_proof`. The app secret proof is a sha256 hash of your access token, using your app secret as the key. The app secret can be found in your app dashboard in **Settings > Basic**.

If you're using the official PHP SDK, the `appsecret_proof` parameter is automatically added.

### Generate the Proof

The following code example is what the call looks like in PHP:

```code
$appsecret_proof= hash_hmac('sha256', $access_token, $app_secret);
```

### Add the Proof

You add the result as an `appsecret_proof` parameter to each call you make:

```code
curl \
  -F 'access_token=<access_token>' \
  -F 'appsecret_proof=<app secret proof>' \
  -F 'batch=[{"method":"GET", "relative_url":"me"},{"method":"GET", "relative_url":"me/friends?limit=50"}]' \
  https://graph.facebook.com
```

### Require the Proof

To enable **Require App Secret** for all your API calls, go to the Meta App Dashboard and click **App Settings > Advanced** in the left side menu. Scroll to the **Security** section, and click the **Require App Secret** toggle.

If this setting is enabled, all client-initiated calls must be proxied through your backend where the `appsecret_proof` parameter can be added to the request before sending it to the Graph API, or the call will fail.

On This Page

[Secure Graph API Calls](https://developers.facebook.com/docs/graph-api/guides/secure-requests#secure-graph-api-calls)

[Meta Crawler](https://developers.facebook.com/docs/graph-api/guides/secure-requests#meta-crawler)

[Login Security](https://developers.facebook.com/docs/graph-api/guides/secure-requests#login-security)

[Server Allow List](https://developers.facebook.com/docs/graph-api/guides/secure-requests#server-allow-list)

[Social Plugin Confirmation Steps](https://developers.facebook.com/docs/graph-api/guides/secure-requests#confirm_steps)

[Encryption](https://developers.facebook.com/docs/graph-api/guides/secure-requests#encryption)

[Verify Graph API Calls with appsecret\_proof](https://developers.facebook.com/docs/graph-api/guides/secure-requests#appsecret_proof)

[Generate the Proof](https://developers.facebook.com/docs/graph-api/guides/secure-requests#generate-the-proof)

[Add the Proof](https://developers.facebook.com/docs/graph-api/guides/secure-requests#add-the-proof)

[Require the Proof](https://developers.facebook.com/docs/graph-api/guides/secure-requests#require-the-proof)

### This content is no longer available

Close

The content you requested cannot be displayed right now. It may be temporarily unavailable, the link you clicked on may have expired, or you may not have permission to view this page.

Close