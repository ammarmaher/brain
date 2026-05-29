---
url: https://developers.facebook.com/docs/development/create-an-app/
title: Create an App - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Fcreate-an-app%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Create an App with Meta](https://developers.facebook.com/docs/development/create-an-app/#create-an-app-with-meta)

[Before you start](https://developers.facebook.com/docs/development/create-an-app/#before-you-start)

[Overview](https://developers.facebook.com/docs/development/create-an-app/#overview)

[What are use cases?](https://developers.facebook.com/docs/development/create-an-app/#what-are-use-cases-)

[Available use cases](https://developers.facebook.com/docs/development/create-an-app/#available-use-cases)

[What are permissions and features?](https://developers.facebook.com/docs/development/create-an-app/#what-are-permissions-and-features-)

[What is a business portfolio?](https://developers.facebook.com/docs/development/create-an-app/#what-is-a-business-portfolio-)

[What is App Review?](https://developers.facebook.com/docs/development/create-an-app/#what-is-app-review-)

[App creation video](https://developers.facebook.com/docs/development/create-an-app/#app-creation-video)

[App creation steps](https://developers.facebook.com/docs/development/create-an-app/#app-creation-steps)

[Start](https://developers.facebook.com/docs/development/create-an-app/#start)

[App details](https://developers.facebook.com/docs/development/create-an-app/#app-details)

[Use cases](https://developers.facebook.com/docs/development/create-an-app/#use-cases)

[Business](https://developers.facebook.com/docs/development/create-an-app/#business)

[Requirements](https://developers.facebook.com/docs/development/create-an-app/#requirements)

[Overview](https://developers.facebook.com/docs/development/create-an-app/#overview-2)

[Troubleshooting](https://developers.facebook.com/docs/development/create-an-app/#troubleshooting)

[Next Steps](https://developers.facebook.com/docs/development/create-an-app/#next-steps)

# Create an App with Meta

Creating an app with Meta is a crucial first step for any developer looking to integrate with Meta’s products, SDKs, or APIs. This process ensures your app is properly identified, configured, and authorized to interact with Meta’s platform and services.

## Before you start

To create an app with Meta, you must first [**register as a developer**](https://developers.facebook.com/docs/development/register) and be [logged into your developer account](https://facebook.com/).

## Overview

You need to create an app to be able to:

- **Enable Integration:** Gain access to Meta’s SDKs and APIs, allowing your app to interact with Facebook, Instagram, and other Meta products.
- **Manage Permissions and Data Access:** Review and comply with requirements for accessing user data, ensuring your app meets Meta’s privacy and security standards.
- **Obtain Credentials:** Receive a unique App ID and App Secret, which are required for authentication and generating access tokens for testing and production use.

### What are use cases?

**Use cases define the main ways your app will interact with Meta’s platform, such as authenticating users, accessing social features, or managing business assets.**

When you add a use case to your app, permissions, features, and products are automatically added to your app that provide the use case's functionality to your app. For example, if you select the **Manage everything on your Page** use case, the `business_management`, `pages_show_list`, and `public_profile` are added. These permissions that are required for this use case to work properly, and can't be removed. Additionally, the `pages_manage_engagement` permission is added by default but it can be removed if your app doesn't need it to function as you want it to. You can also add optional permissions, such as `pages_read_engagement`, and the Business Asset User Profile Access feature if your app needs it to function the way you want it to.

You can add multiple use cases to a single app, provided they are compatible with each other. For example, you can add the **Access Threads API** use case to an app with the **Manage everything on your Page** use case, but you can't add the **Authenticate and request data from users with Facebook Login** use case since it is incompatible. During initial app creation, after you select a use case, **_incompatible use cases are greyed out._**

**Note:** [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business/) and [Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts) might automatically be added to your app.

Additionally, you can **Create an app without a use case** to obtain an app ID, but this app will not have any permissions, features, or products associated with it.

Once your app has been created, you can customize each use case, and add compatible use cases. If you choose to add additional use cases later, **_only compatible use cases are displayed_**.

**Use cases cannot be removed** after you create your app. You can add compatible use cases to an existing app, however, once added, a use case cannot be removed.

### Available use cases

| Use Case | Description |
| --- | --- |
| Create & manage app ads with Meta Ads Manager | Promote your mobile app and drive installs. Create and manage campaigns that encourage users to download and install your app. Does not include access to Marketing API. |
| Advertise on your app with Meta Audience Network | Join Meta Audience Network to monetize your app and grow revenue with ads from Meta advertisers. Get insights using the Reporting API. |
| Manage products with Catalog API | Manage catalogs and the products you want to promote across Meta technologies. |
| Allow users to transfer their data to other apps | Give users the ability to transfer their information from Meta apps to other services. |
| Authenticate and request data from users with Facebook Login | Our most common use case. A secure, fast way for users to log into your app or game and for the app to ask for permissions to access their data to personalize their experience. |
| Share or create fundraisers on Facebook and Instagram | Raise money and reach more people with Meta’s Fundraiser API. Create or share existing fundraising campaigns on Facebook and Instagram. |
| Launch an Instant Game on Facebook and Messenger | Launch an Instant Game that players can find and play directly in their Feed or messages/conversations, on both desktop and mobile devices. |
| Embed Facebook, Instagram and Threads content in other websites | Use the oEmbed API to embed Facebook, Instagram, and Threads content, such as photos and videos, in other websites. |
| Manage everything on your Page | Publish content and videos, moderate posts and comments from followers on your Page and get insights on engagement. |
| Access the Threads API | Use the Threads API and choose to authenticate users, retrieve user information, post threads, reply to threads, manage reply settings and/or gather insights for a Threads profile you own or manage on behalf of others. |
| Join ThreatExchange | Join ThreatExchange to share signals with other members about online threats, including terrorism, malware, CSAM, and other harmful content, to help keep people safe on the internet. |
| Measure ad performance data with Marketing API | Maximize ROI with ad performance data to optimize ad budgets, creatives and create custom audiences, connect customers to product catalogs and improve reach. |
| Create & manage ads with Marketing API | Create, manage and optimize ad campaigns across Meta technologies. Programmatically extend, stop or update ad campaigns and more. |
| Capture & manage ad leads with Marketing API | Give potential customers a quick and safe way to sign up to get info about your business or products. |
| Engage with customers on Messenger from Meta | Respond to messages sent to your business’ Facebook Page. You can set up automatic replies or use a human agent to respond. |
| Connect with customers through WhatsApp | Start a WhatsApp conversation, send notifications, create ads that click-to-WhatsApp and provide support. Business portfolio required. |
| Manage messaging & content on Instagram | Publish posts, share stories, respond to comments, answer direct messages and more with the Instagram API. |

### What are permissions and features?

**Permissions** are how your app asks someone if it can access their data stored on Meta's servers. [Learn more.](https://developers.facebook.com/docs/facebook-login/guides/permissions/)

**Features** are authorization mechanisms that allow your app to access specific endpoints that don’t require explicit consent from your app users in order to access the user’s data for a specific purpose. [Learn more.](https://developers.facebook.com/docs/features-reference/)

When customizing a use case, you will see a list of permissions and features that are available for the use case. A use case has permissions that are required for the use case to work proper. These required permission can't be removed. A use case might also have optional permissions that you can add that provide additional functionality. Optional permissions can be added or removed at any time during development. **Only add optional permissions that your app needs in order to work the way you want it to.**

#### Use Case Permission Mapping

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

### What is a business portfolio?

**A business portfolio allows organizations to bring their Facebook Pages, Instagram accounts, ad accounts, catalogs and other business assets together so you can manage them, and the people who access them, from one place using business tools such as Meta Business Suite and Business Manager.** [Learn more about business portfolios.](https://www.facebook.com/business/help/486932075688253)

If your app will access data that you don't own or manage, you must connect your app to a business portfolio. You can connect a business portfolio at any time during development.

#### What is a verified business?

To access certain products and features, Meta may ask you to verify your business. This process helps us confirm that your business portfolio belongs to a legitimate business or organization. Not all businesses need to or may have the option to complete verification. [Learn more about business verification.](https://www.facebook.com/business/help/1095661473946872)

### What is App Review?

App Review is the process that enables Meta to ensure that apps use Meta APIs, SDKs, and products appropriately. It is required if your app will be used by people without a role on your app or a role on the business that is connected to your app. [Learn more about App Review.](https://developers.facebook.com/docs/resp-plat-initiatives)

### App creation video

Play

0:00

Mute

Enter Fullscreen

Sharing and reporting options

![](https://static.xx.fbcdn.net/rsrc.php/v4/y4/r/-PAXP-deijE.gif)

Something went wrong

We're having trouble playing this video.

[Learn more](https://www.facebook.com/help/396404120401278/list)

## App creation steps

### Start

1. Navigate to **[https://developers.facebook.com/apps/creation/](https://developers.facebook.com/apps/creation/)** to begin the app creation process.

### App details

1. Enter your **app’s name** and a **contact email address**.
2. Click **Next**.

### Use cases

1. Select one or more use cases for your app. You can add additional, compatible use cases now or at any time during development.

   - **Incompatible use cases are greyed out.**
   - If you choose to add additional use cases later, only compatible use cases are displayed.
   - Some products, such as [Facebook Login for Business](https://developers.facebook.com/docs/facebook-login/facebook-login-for-business/) or [Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-ad-accounts), might be automatically included in your use case.
   - If you need a use case not listed, select **Other** and following the instructions in [our Other App Types guide](https://developers.facebook.com/docs/development/create-an-app/other-app-types).
2. Click **Next**.

### Business

1. Select an option:

   - A verified business portfolio
   - An unverified business portfolio
   - **I don't want to connect a business portfolio yet.**
   - **Create a business portfolio**
     - Add your information in the pop-up.
     - You can submit your business portfolio for verification now, Meta's Business Manager will open in a new browser window, or later.
     - When complete, return to the dashboard and select your new business portfolio.
2. Click **Next**.

### Requirements

Your app might need to complete certain requirements, such as [App Review](https://developers.facebook.com/docs/resp-plat-initiatives/individual-processes/app-review/), to get and maintain data access for your app's use cases.

1. Click **Next**.

### Overview

1. **Review** your app's details, use cases, connected business, and requirements.

   - If you need to make any changes, you can click **App details**, **Use cases**, **Business**, or **Requirements** at the top of the page or the **Previous** button in the lower-right.
   - You can also review the [Meta Platform Terms](https://developers.facebook.com/terms/) and [Developer Policies](https://developers.facebook.com/devpolicy/) by following the links at the bottom of the page.
2. Click **Go to dashboard** to finalized the app creation process.


You are redirected to the dashboard and can now customize each use case you've selected for your app.

## Troubleshooting

If you are unable to create an app, you might have reached the app limit. You are permitted to have a **developer or administrator role on a maximum of 15 apps** that are not already connected to a [Meta Verified Business Account](https://www.facebook.com/business/help/308979828303560). If you have reached the app limit and are unable to create an application or accept a new pending role, take the following steps in the dashboard:

- Connect a [verified business portfolio](https://developers.facebook.com/docs/development/release/business-verification) to any apps that are not already connected to one.
- Remove any old or unused apps – Archived apps count towards the app limit; if you no longer require these apps, we suggest removing them.
- Remove yourself as an administrator or developer from an app.

## Next Steps

**Customize your use cases:** Now that you have created your app, you can [customize your use cases](https://developers.facebook.com/docs/development/app-customization/).

On This Page

[Create an App with Meta](https://developers.facebook.com/docs/development/create-an-app/#create-an-app-with-meta)

[Before you start](https://developers.facebook.com/docs/development/create-an-app/#before-you-start)

[Overview](https://developers.facebook.com/docs/development/create-an-app/#overview)

[What are use cases?](https://developers.facebook.com/docs/development/create-an-app/#what-are-use-cases-)

[Available use cases](https://developers.facebook.com/docs/development/create-an-app/#available-use-cases)

[What are permissions and features?](https://developers.facebook.com/docs/development/create-an-app/#what-are-permissions-and-features-)

[What is a business portfolio?](https://developers.facebook.com/docs/development/create-an-app/#what-is-a-business-portfolio-)

[What is App Review?](https://developers.facebook.com/docs/development/create-an-app/#what-is-app-review-)

[App creation video](https://developers.facebook.com/docs/development/create-an-app/#app-creation-video)

[App creation steps](https://developers.facebook.com/docs/development/create-an-app/#app-creation-steps)

[Start](https://developers.facebook.com/docs/development/create-an-app/#start)

[App details](https://developers.facebook.com/docs/development/create-an-app/#app-details)

[Use cases](https://developers.facebook.com/docs/development/create-an-app/#use-cases)

[Business](https://developers.facebook.com/docs/development/create-an-app/#business)

[Requirements](https://developers.facebook.com/docs/development/create-an-app/#requirements)

[Overview](https://developers.facebook.com/docs/development/create-an-app/#overview-2)

[Troubleshooting](https://developers.facebook.com/docs/development/create-an-app/#troubleshooting)

[Next Steps](https://developers.facebook.com/docs/development/create-an-app/#next-steps)