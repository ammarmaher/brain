---
url: https://developers.facebook.com/docs/development/create-an-app/use-cases-permission-mapping
title: Permission Mapping - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fcreate-an-app%2Fuse-cases-permission-mapping%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)


  - [No Use Case](https://developers.facebook.com/docs/development/create-an-app/no-use-case)
  - [Other App Types](https://developers.facebook.com/docs/development/create-an-app/other-app-types)
  - [Instagram Platform](https://developers.facebook.com/docs/development/create-an-app/other-app-types/instagram-apis)
  - [Server-to-Server Apps](https://developers.facebook.com/docs/development/create-an-app/server-to-server-apps)
  - [Permission Mapping](https://developers.facebook.com/docs/development/create-an-app/use-cases-permission-mapping)

- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)
- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)
- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)
- [Release](https://developers.facebook.com/docs/development/release)
- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Use Case Permission Mapping](https://developers.facebook.com/docs/development/create-an-app/use-cases-permission-mapping#use-case-permission-mapping)

# Use Case Permission Mapping

The following table shows you the permissions and features that are both required for a particular use case and additional, optional permissions and features that are available for that use case.

| Use Case | Required Permissions/Features | Optional Permissions/Features |
| --- | --- | --- |
| Access the Threads API | - `threads_basic` | - `threads_read_replies`<br>- `threads_manage_replies`<br>- `threads_content_publish`<br>- `threads_manage_insights`<br>- `threads_keyword_search`<br>- `threads_profile_discovery`<br>- `threads_manage_mentions`<br>- `threads_delete`<br>- `threads_location_tagging`<br>- `threads_share_to_instagram` |
| Advertise on your app with Meta Audience Network | - `public_profile` |  |
| Authenticate and request data from users with Facebook Login | - `public_profile` | - `email`<br>- `user_hometown`<br>- `user_birthday`<br>- `user_age_range`<br>- `user_gender`<br>- `user_link`<br>- `user_friends`<br>- `user_location`<br>- `user_likes`<br>- `user_photos`<br>- `user_videos`<br>- `user_posts` |
| Capture & manage ad leads with Marketing API | - `public_profile`<br>- `ads_management`<br>- `ads_read`<br>- Ads Management Standard Access<br>- `business_management`<br>- `leads_retrieval`<br>- `pages_manage_ads`<br>- `pages_read_engagement`<br>- `pages_show_list` | - `email`<br>- `pages_manage_metadata`<br>- Business Asset User Profile Access |
| Connect with customers through WhatsApp | - `whatsapp_business_messaging`<br>- `whatsapp_business_management`<br>- `public_profile` | - `business_management`<br>- `whatsapp_business_manage_events`<br>- `email`<br>- `manage_app_solution` |
| Create & manage ads with Marketing API | - `public_profile`<br>- `ads_management`<br>- `ads_read`<br>- Ads Management Standard Access<br>- `business_management`<br>- `pages_read_engagement`<br>- `pages_show_list` | - `catalog_management`<br>- `pages_manage_ads`<br>- `email`<br>- `threads_business_basic`<br>- Business Asset User Profile Access |
| Embed Facebook, Instagram and Threads content in other websites |  | - Meta oEmbed Read<br>- Threads oEmbed Read |
| Engage with customers on Messenger from Meta | - `public_profile`<br>- `business_management`<br>- `pages_manage_metadata`<br>- `pages_messaging`<br>- `pages_show_list` | - `email`<br>- `ads_management`<br>- `instagram_basic`<br>- `instagram_manage_messages`<br>- `pages_user_gender`<br>- `pages_user_locale`<br>- `pages_user_timezone`<br>- `pages_utility_messaging`<br>- `pages_read_engagement`<br>- `paid_marketing_messages`<br>- Business Asset User Profile Access<br>- `marketing_messages_messenger` |
| Join ThreatExchange |  | - ThreatExchange |
| Launch an Instant Game on Facebook and Messenger | - `gaming_profile`<br>- `gaming_user_picture` | - `gaming_user_locale`<br>- `email`<br>- Instant Games Zero Permission Access |
| Manage everything on your Page | - `business_management`<br>- `pages_show_list`<br>- `public_profile` | - `email`<br>- `pages_read_engagement`<br>- `pages_read_user_content`<br>- `pages_manage_engagement`<br>- `pages_manage_posts`<br>- `pages_manage_metadata`<br>- `read_insights`<br>- Business Asset User Profile Access<br>- `facebook_branded_content_ads_brand`<br>- `facebook_creator_marketplace_discovery`<br>- Live Video API |
| Manage messaging & content on Instagram | - `public_profile` | - `email`<br>- `ads_management`<br>- `ads_read`<br>- `business_management`<br>- `catalog_management`<br>- Human Agent<br>- `instagram_basic`<br>- `instagram_business_basic`<br>- `instagram_branded_content_ads_brand`<br>- `instagram_branded_content_brand`<br>- `instagram_branded_content_creator`<br>- `instagram_creator_marketplace_discovery`<br>- `instagram_creator_marketplace_messaging`<br>- `instagram_business_content_publish`<br>- `instagram_business_manage_comments`<br>- `instagram_business_manage_insights`<br>- `instagram_business_manage_messages`<br>- `instagram_content_publish`<br>- `instagram_manage_comments`<br>- `instagram_manage_contents`<br>- `instagram_manage_engagement`<br>- `instagram_manage_insights`<br>- `instagram_manage_messages`<br>- `instagram_manage_upcoming_events`<br>- Instagram Public Content Access<br>- `instagram_shopping_tag_products`<br>- `pages_read_engagement`<br>- `pages_show_list`<br>- Business Asset User Profile Access |
| Manage products with Catalog API | - `public_profile`<br>- `catalog_management` | - `email` |
| Measure ad performance data with Marketing API | - `public_profile`<br>- `ads_read`<br>- `ads_management`<br>- Ads Management Standard Access<br>- `business_management`<br>- `pages_read_engagement`<br>- `pages_show_list` | - `email`<br>- Business Asset User Profile Access |
| Share or create fundraisers on Facebook and Instagram | - `public_profile`<br>- `manage_fundraisers` | - `email` |

On This Page

[Use Case Permission Mapping](https://developers.facebook.com/docs/development/create-an-app/use-cases-permission-mapping#use-case-permission-mapping)