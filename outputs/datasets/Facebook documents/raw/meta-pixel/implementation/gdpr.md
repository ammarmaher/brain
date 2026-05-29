---
url: https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/
title: General Data Protection Regulation - Meta Pixel
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmeta-pixel%2Fimplementation%2Fgdpr%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Pixel](https://developers.facebook.com/docs/meta-pixel)

- [Get Started](https://developers.facebook.com/docs/meta-pixel/get-started)
- [Guides](https://developers.facebook.com/docs/meta-pixel/guides)
- [Support](https://developers.facebook.com/docs/meta-pixel/support)
- [Reference](https://developers.facebook.com/docs/meta-pixel/reference)

On This Page

[General Data Protection Regulation](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/#general-data-protection-regulation)

[Cookie Consent](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/#cookieconsent)

[Learn more](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/#learn-more)

# General Data Protection Regulation

The General Data Protection Regulation (GDPR) creates consistent data protection rules across Europe. It applies to companies (regardless of where they are based) who process personal data about individuals in the EU.

While many of the principles build on current EU data protection rules, the GDPR has a wider scope, more prescriptive standards and substantial fines. For example, it requires a higher standard of consent for using some types of data and broadens individuals' rights with respect to accessing and porting their data.

Businesses who advertise with the Facebook companies can continue to use Facebook platforms and solutions in the same way they do today. Each company is responsible for ensuring their own compliance with the GDPR, just as they are responsible for compliance with the laws that apply to them today.

## Cookie Consent

Businesses may want to implement code that creates a banner and requires affirmative consent (for example, an “I agree” checkbox at the top of the page) to use the Pixel. If you already have a system in place that addresses this need, such as a tag manager, you can make this code optional.

Use the following API to pause sending Pixel fires to Facebook, and once cookie consent is granted, send Pixel fires to Facebook. You need to call revoke on every page.

```code
fbq('consent', 'revoke');
fbq('consent', 'grant');
```

For example:

```code
// Revoke consent before 'init' is called
fbq('consent', 'revoke');
fbq('init', '<your pixel ID>');
fbq('track', 'PageView');
```

```code
// Once affirmative consent has been granted
fbq('consent', 'grant');
```

See our [Cookie Policy](https://www.facebook.com/policies/cookies/) for details about the cookies used and the data received. The Meta Pixel receives these types of data:

- **Http Headers** – Anything that is generally present in HTTP headers, a standard web protocol sent between any browser request and any server on the internet. This information may include data like IP addresses, information about the web browser, page location, document, referrer and person using the website.
- **Pixel-specific Data** – Includes Pixel ID and the Facebook Cookie.
- **Button Click Data** – Includes any buttons clicked by site visitors, the labels of those buttons and any pages visited as a result of the button clicks.
- **Optional Values** – Developers and marketers can optionally choose to send additional information about the visit through [conversion tracking](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking). Example custom data events are conversion value, page type, and more.
- **Form Field Names** – Includes website field names like ‘email’, ‘address’, ‘quantity’ for when you purchase a product or service. We don't capture field values unless you include them as part of [Advanced Matching](https://developers.facebook.com/docs/facebook-pixel/advanced/advanced-matching), or [conversion tracking](https://developers.facebook.com/docs/facebook-pixel/implementation/conversion-tracking).

## Learn more

- [Advertiser Help](https://www.facebook.com/business/help/225009134722945)
- [Facebook's GDPR microsite](https://www.facebook.com/business/gdpr)

On This Page

[General Data Protection Regulation](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/#general-data-protection-regulation)

[Cookie Consent](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/#cookieconsent)

[Learn more](https://developers.facebook.com/docs/meta-pixel/implementation/gdpr/#learn-more)