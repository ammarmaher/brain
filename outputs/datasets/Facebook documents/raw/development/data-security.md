---
url: https://developers.facebook.com/docs/development/data-security
title: Developer Data Security Best Practices - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fdata-security%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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


  - [Developer Data Security Best Practices](https://developers.facebook.com/docs/development/data-security)

On This Page

[Developer Data Security Best Practices](https://developers.facebook.com/docs/development/data-security#developer-data-security-best-practices)

# Developer Data Security Best Practices

If you use Platform as a developer, you are responsible for securing Platform Data in a way that meets or exceeds industry standards given the data’s sensitivity. Below are some key principles and industry best practices that developers may find helpful when deciding on security measures for Platform Data. These best practices are provided as guidance only and cannot guarantee you have met your obligations under Meta’s Platform Terms, as they do not (and cannot) cover every conceivable scenario. Whether you have met or exceeded industry standards will depend on the sensitivity of the Platform Data you access and/or process and your unique technical circumstances.

| Principle | Best Practices |
| --- | --- |
| Secure Communication (data in transit) | - Use trusted certificate authorities (CAs)<br>- Ensure certificates are configured properly<br>- Use the most updated versions of Transport Layer Security (TLS) possible<br>- Enforce encryption for all network connections<br>- Test to verify network connections are not accidentally sending data in the clear<br>- Verify that metadata in HTTP headers doesn’t include personal information |
| Secure Data at Rest | - Use standard encryption; don’t roll your own or rely on data encoding or obfuscation<br>- Enable any platform level controls where available<br>- Verify that the data is encrypted<br>- Protect all systems against malware |
| Manage Keys and Passwords | - Don’t keep passwords in the clear or embed them in code<br>- Don’t use vendor-supplied defaults for system passwords<br>- Use key management systems when available<br>- Have a system for maintaining keys (assigning, revoking, rotating, deleting)<br>- Utilize two-factor authentication when available<br>- Provide two-factor as an option to users |
| Employ Access Controls and Account Management | - Separate roles and functions with different accounts and credentials<br>- Have a system for maintaining accounts (assigning, revoking, reviewing access and privileges, removing) |
| Apply Updates and Patches | - Have a system for keeping system code and environments updated, including servers, virtual machines (VMs), distributions, libraries, packages, and anti-virus software/programs<br>- Have a system for maintaining and patching production facing systems including <br>  <br>  - Core libraries<br>  - Web services<br>  - Outward facing services |
| Monitor and Log | - Have a system in place for logging access to user data, tracing where user data was sent and stored<br>- Monitor transfers of user data and key points where user data can leave the system (e.g., third parties, public endpoints) |
| Application Security and Securing APIs | - Be familiar with basic app security practices including<br>  <br>  - Assessing permissions and data needs (aligning data access to purpose of use)<br>  - Testing APIs and endpoints for data leakage<br>  - Testing transmissions to and from third parties for data leakage<br>  - Scanning app and code for common security flaws before deployment<br>- Be familiar with basic coding practices to address fundamental security concerns<br>- Regularly test security systems and processes |

On This Page

[Developer Data Security Best Practices](https://developers.facebook.com/docs/development/data-security#developer-data-security-best-practices)