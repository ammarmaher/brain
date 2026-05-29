---
url: https://developers.facebook.com/docs/whatsapp/on-premises/sunset
title: On-Premises API Sunset
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fwhatsapp%2Fon-premises%2Fsunset%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[On-Premises API Sunset](https://developers.facebook.com/docs/whatsapp/on-premises/sunset)

On This Page

[On-Premises API sunset](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#on-premises-api-sunset)

[Why Cloud API?](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#why-cloud-api-)

[Sunset timeline](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#sunset-timeline)

[January 9, 2024](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#january-9--2024)

[July 1, 2024](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#july-1--2024)

[October 23, 2025](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#october-23--2025)

[Terms and Conditions](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#terms-and-conditions)

# On-Premises API sunset

The final supported version of the On-Premise API client expired on October 23, 2025. On-Premises API can't be used to send messages to WhatsApp users anymore. Please use Cloud API on the [WhatsApp Business Platform](https://developers.facebook.com/documentation/business-messaging/whatsapp/overview) instead.

## Why Cloud API?

Since its launch in 2022, Cloud API has seen strong adoption and better performance than On-Premises API. Some of the reasons for this include:

- **Cost-effective**: Reduced setup, hosting and maintenance costs. For example, some partners have experienced a [90%+ reduction in infrastructure costs](https://l.facebook.com/l.php?u=https%3A%2F%2Fbusiness.whatsapp.com%2Fresources%2Fsuccess-stories%2Fzendesk&h=AUAz1oOvtHyG8aIkC634qt2EXBC1_V2AIWJc_GLC-Fu-GS-LjYD1EcMJ_nYo5Aah5e0m9Nj4z3RhgSaQlbmBX07KFb-1YHEAHONG-OrEjE6ON0qQGkbBiT6WxmdUtPyS_BxQOM1SzQI7dA) after moving to Cloud API.
- **More Scalable**: Cloud API is our fastest throughput platform, offering up to 1,000 messages per second (4x the level of On-Premises API).
- **Better Reliability**: Cloud API consistently experiences 99.9% uptime and < 5 seconds p99 latency. View our [WhatsApp Business API Status Page](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2Fwhatsapp-business-api&h=AUAfW_wcdSQ0lC3l-QRvaIq15cKhkepMvN6aepGt_DaHxXrK2K6bvOOn_yqtvvsvsuUUOyudmvTvcyke_d5W0M67DmH_FIIsoizeSmCGaQmucv9IHB31ewp2gm_60fS2a8gHccRb1OgY_g) for uptime and latency statuses.
- **Secure and certified**: Cloud API has enterprise-grade security features and certifications, including GDPR and LGPD compliance, SOC2 and SOC3 certification, and we are currently pursuing ISO 27001. See our [Cloud API Compliance Center](https://www.facebook.com/business/business-messaging/compliance) and our [security](https://www.facebook.com/business/f/549322723470743) and [encryption](https://l.facebook.com/l.php?u=https%3A%2F%2Fwww.whatsapp.com%2Fsecurity%2FWhatsApp-Security-Whitepaper.pdf&h=AUAd56yGPqbQE-08PHwjZj_zNFrCI2Fe0gX6vevKoQpkV3usPHBnWK7xWiLJ8360MoiJAHDcd13OthbqocIRRBudD2sbK3576vujON8dDgY2Lj2gLtqLgpYJGb05ra1KeET4ZzdGlhhTzw) whitepapers.
- Local storage options: Cloud API now supports [local storage](https://developers.facebook.com/docs/whatsapp/cloud-api/overview/local-storage/), giving you the option to control where message data is stored at rest.
- Cloud-only features: Cloud API offers more functionality than On-Premises API, with newly released functionality and upcoming functionality only available on Cloud API.

With these enterprise-grade messaging foundations in place, we have decided to transition to a fully cloud-hosted WhatsApp Business Platform.

## Sunset timeline

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/472766297_642679394762962_1645436236121446456_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=7cI9GZj9vtsQ7kNvwHnoBRV&_nc_oc=Adp4glyw1zWjRYkjUXieAGk4nvmNlvHyAHWqCMtDL7xKPJJTQ58R965euVWSQ9j-O0E&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=qj-1rbFhQainLFuadAEW-g&_nc_ss=7b289&oh=00_Af5vKQeBMOtZoJtZ2WvAT-QMKFh_UVxhu7AUCAGhVfmgFQ&oe=6A2503F7)

### January 9, 2024

Starting after the release of On-Premises API v2.53 in January 2024, all new feature updates will ship exclusively to Cloud API. The On-Premise API client will continue to receive quarterly version releases, but will only address bug fixes and security patches.

### July 1, 2024

Business phone numbers can only be registered for use with Cloud API. Attempting to [register a number for use with On-Premises API](https://developers.facebook.com/docs/whatsapp/on-premises/reference/account) will return error code `1005`.

### October 23, 2025

The final version of On-Premises API (v2.63) will expire. Messages sent to or from business numbers still registered for use with On-Premises API will not be delivered.

## Terms and Conditions

See [Cloud API Terms](https://www.facebook.com/legal/Meta-Hosting-Terms-Cloud-API).

On This Page

[On-Premises API sunset](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#on-premises-api-sunset)

[Why Cloud API?](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#why-cloud-api-)

[Sunset timeline](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#sunset-timeline)

[January 9, 2024](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#january-9--2024)

[July 1, 2024](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#july-1--2024)

[October 23, 2025](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#october-23--2025)

[Terms and Conditions](https://developers.facebook.com/docs/whatsapp/on-premises/sunset/#terms-and-conditions)