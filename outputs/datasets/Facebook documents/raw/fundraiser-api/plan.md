---
url: https://developers.facebook.com/docs/fundraiser-api/plan
title: Plan - Fundraiser API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Ffundraiser-api%2Fplan%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Fundraiser API](https://developers.facebook.com/docs/fundraiser-api)

- [Learn](https://developers.facebook.com/docs/fundraiser-api/learn)
- [Plan](https://developers.facebook.com/docs/fundraiser-api/plan)
- [Create an app](https://developers.facebook.com/docs/fundraiser-api/create-an-app)
- [Integrate](https://developers.facebook.com/docs/fundraiser-api/integrate)
- [Reporting](https://developers.facebook.com/docs/fundraiser-api/reporting)
- [FAQ](https://developers.facebook.com/docs/fundraiser-api/faq)

On This Page

[Plan for Fundraiser API](https://developers.facebook.com/docs/fundraiser-api/plan#plan-for-fundraiser-api)

[Refunds](https://developers.facebook.com/docs/fundraiser-api/plan#refunds)

[Transaction Reports](https://developers.facebook.com/docs/fundraiser-api/plan#transaction_reports)

[Known Issues](https://developers.facebook.com/docs/fundraiser-api/plan#known-issues)

[Bug Reports](https://developers.facebook.com/docs/fundraiser-api/plan#bug-reports)

[Feature Requests](https://developers.facebook.com/docs/fundraiser-api/plan#feature-requests)

[Useful References](https://developers.facebook.com/docs/fundraiser-api/plan#references)

[Recommended Tools](https://developers.facebook.com/docs/fundraiser-api/plan#recommended_tools)

[Get Nonprofit or Donations Help](https://developers.facebook.com/docs/fundraiser-api/plan#get-nonprofit-or-donations-help)

[Create a Business Manager on Facebook](https://developers.facebook.com/docs/fundraiser-api/plan#create_business)

[Add App to a Business](https://developers.facebook.com/docs/fundraiser-api/plan#add_app_to_a_business)

[Regain Lost App Admin Access](https://developers.facebook.com/docs/fundraiser-api/plan#regain_lost_app_admin_access)

[Overview](https://developers.facebook.com/docs/fundraiser-api/plan#overview)

[Become Admin of Your Page](https://developers.facebook.com/docs/fundraiser-api/plan#become_admin)

[Create a Business Manager Account](https://developers.facebook.com/docs/fundraiser-api/plan#create_business_manager_account)

[Create a Developers Account](https://developers.facebook.com/docs/fundraiser-api/plan#create_developer_account)

[Complete Lost App Access Form](https://developers.facebook.com/docs/fundraiser-api/plan#lost_app_access_form)

# Plan for Fundraiser API

The Fundraiser API allows a fundraising website to integrate with Facebook to extend the effectiveness, reach and visibility of their campaigns. Campaigns on the fundraising website can be mirrored on Facebook allowing people to raise money on their Facebook fundraiser, while keeping donation information in sync between the mirrored campaigns.

When you understand how the Fundraiser API can fit into your existing site, you can find the integration details here: [**https://developers.facebook.com/docs/fundraiser-api/integrate**](https://developers.facebook.com/docs/fundraiser-api/integrate)

# Getting Started

## Preparing to Integrate

**Prerequisites**

All charitable fundraising platforms that utilize the Fundraiser API must provide the option for people creating a fundraiser for a nonprofit to share their contact information (name and email address, at a minimum) with the nonprofit beneficiary of the fundraiser. This is a mandatory requirement.

* * *

# Site Planning

Once you have access to the Fundraiser API and at least one app configured to manage nonprofit pages, you can start using the API to create and manage fundraisers. Although integrations may vary, we recommend handling the following [flows](https://developers.facebook.com/docs/fundraiser-api/plan#flows) at a minimum.

Each call to the Fundraiser API requires using either a user access token or app access token. We include recommendations of which type of token to use for each call below.

**If you’re new to using Facebook’s Graph API**, we recommend reading up on [how it works](https://developers.facebook.com/docs/fundraiser-api/plan#references) and using the [recommended tools](https://developers.facebook.com/docs/fundraiser-api/plan#recommended_tools) in our appendix.

## Flows

These are recommendations of where the Fundraiser API typically fits into fundraising flows. Each recommended event is indicated by a bullet point, and some flows have sub-flows indicated by indented bullets.

Additionally, anywhere we recommend logging an AppEvent, any event analytics logging can be used. We recommend using Facebook Analytics AppEvents due to the fact that FB Login is already integrated, the number of unique users, in addition to total events, are counted, and conversion funnels are easy to configure.

#### Fundraising Page Created / Registration Complete

_Upon completion of the last step of the registration flow that creates a fundraising page_

- Log AppEvent: “Registration Complete”
- Show post-registration dialog
- Log AppEvent: “Post-Reg Dialog Shown”
- If “Connect with Facebook” button is clicked

  - Log AppEvent: “Post-Reg Dialog Clicked”
  - Call [Facebook Login](https://developers.facebook.com/docs/facebook-login/web/) with `manage_fundraisers` permission to obtain a user token
  - If the login response is “connected”

    - [Create the Facebook Fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate/#create_fundraiser) using the API with the user token
    - Log AppEvent: “Fundraiser Connected”
    - Change the dashboard widget into a link to the Facebook Fundraiser at [https://www.facebook.com/donate/<fundraiser\_id>](https://www.facebook.com/donate/fundraiser_id)
- If “Later” button is clicked

  - Log AppEvent: “Post-Reg Dialog Dismissed”

#### Fundraising Dashboard / Participant Center Visited

_When a person visits their fundraising dashboard or participant center_

- Show dashboard widget
- Log AppEvent: “Dashboard Widget Shown”
- If “Connect with Facebook” button is clicked

  - Log AppEvent: “Dashboard Widget Clicked”
  - Call [Facebook Login](https://developers.facebook.com/docs/facebook-login/web/) with `manage_fundraisers` permission to obtain a user token
  - If the login response is “connected”

    - [Create the Facebook Fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate/#create_fundraiser) using the API with the user token
    - Log AppEvent: “Fundraiser Connected”
    - Change the dashboard widget into a link to the Facebook Fundraiser at [https://www.facebook.com/donate/<fundraiser\_id>](https://www.facebook.com/donate/fundraiser_id)

#### Fundraising Page Edited

_When a person makes an edit to their external fundraising page_

**Note:** Editing the goal amount and end time are expected to update the Facebook fundraiser. Edits to title and description are typically best not to update unless the creator performs them during the creation flow but after creating the Facebook Fundraiser.

- If the edit is expected to update their Facebook Fundraiser

  - [Update the Facebook Fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate/#update_fundraiser) using the API with the user or app token

#### Fundraising Page Stops Accepting Donations

_When the external fundraising page stops accepting donations before the end date_

**Note:** Facebook fundraisers can be ended or deleted. The Facebook fundraisers end after the end time provided when creating or updating the fundraiser and can no longer accept donations but can still be accessed on Facebook. Deleted fundraisers are permanently deleted and can no longer accept donations or be accessed on Facebook. Deleting a fundraiser must be performed by the user on Facebook.

- If the fundraiser ends normally

  - The Facebook Fundraiser will end automatically after the end time provided when creating or updating the fundraiser
- If the fundraiser needs to be ended before the end date

  - [End the Facebook Fundraiser](https://developers.facebook.com/docs/fundraiser-api/integrate/#end_fundraiser) using the API with the app token

#### External Donation Received

_When a donation received off Facebook is added to the fundraising page total or thermometer_

**Note:** Due to how external donations are processed on Facebook, posting and deleting external donations to the same fundraiser should be separated by at least 3 seconds. This case typically only occurs when connecting a fundraising page with existing donations and refunds that are attempted to be added and deleted as a batch job.

- [Post an external donation](https://developers.facebook.com/docs/fundraiser-api/integrate/#external_donations) to the Facebook fundraiser using the API with the app token

#### External Donation Refunded

_When a donation received off Facebook is refunded_

**Note:** Due to how external donations are processed on Facebook, posting and deleting external donations to the same fundraiser should be separated by at least 3 seconds. This case typically only occurs when connecting a fundraising page with existing donations and refunds that are attempted to be added and deleted as a batch job.

- For full refunds

  - [Delete the external donation](https://developers.facebook.com/docs/fundraisers/#external_donations) previously posted using the API with the app token
- For partial refunds

  - [Delete the external donation](https://developers.facebook.com/docs/fundraisers/#external_donations) previously posted using the API with the app token
  - [Post an external donation](https://developers.facebook.com/docs/fundraisers/#external_donations) to the Facebook fundraiser with the updated amount using the API with the app token

#### Facebook Donation Received

- When a person donates to synced Facebook fundraiser\*

**Note:** The names of Facebook donors aren’t included in the webhook and shouldn’t be shown on an external honor roll to respect the donor’s privacy. If the fundraising page has an honor roll, we recommend adding a persistent top row called “Facebook Donors” upon receiving the first Facebook donation, which reflects the total amount raised on Facebook and links to the Facebook Fundraiser at [https://www.facebook.com/donate/fundraiser\_id](https://www.facebook.com/donate/fundraiser_id).

- [Receive a webhook](https://developers.facebook.com/docs/fundraisers/#webhook) by subscribing to the Application’s `fundraiser_donations` field
- Update the thermometer on the fundraising page
- If the fundraising page has an honor roll

  - Add or update the amount reflected in the Facebook Donors row

**Testing Note:** To protect donor privacy, `fundraiser_donations` webhooks are only sent to apps in live mode. More information on the difference between live and development mode apps can be found in our FAQ. As such, webhooks should be tested in two steps:

1. Keep the app in development mode and click the “Test” button to receive a test payload webhook. Verify the server receives the webhook and attempts to process it correctly.
2. Create a fundraiser while the app is in development mode, to prevent the fundraiser from being public. After creating the fundraiser, switch the app to live mode to begin receiving webhooks in real-time. Make a donation to the Facebook fundraiser and ensure the server processes the webhook correctly.

#### App Deauthorized

_When a person deauthorizes the Facebook app_

- [Receive a webhook](https://developers.facebook.com/docs/graph-api/webhooks/reference/permissions/) with status disconnected by subscribing to the Permission’s `connected` field
- Change the dashboard widget back to the original “Connect Fundraiser to Facebook” widget

#### App Reauthorized \[Optional\]

_When a person reauthorizes the Facebook app_

- [Receive a webhook](https://developers.facebook.com/docs/graph-api/webhooks/reference/permissions/) with status connected by subscribing to the Permission’s `connected` field
- Make a GET call to the previously created Facebook fundraiser using the API with the user token to see if it still exists
- If it still exists

  - Change the dashboard widget back into a link to the Facebook fundraiser at [https://www.facebook.com/donate/fundraiser\_id](https://www.facebook.com/donate/fundraiser_id)

## Unhandled Flows

These flows not currently handled by Facebook, so workarounds are provided.

#### Facebook Fundraiser Updated

_When a person updates their fundraiser on Facebook_

- Currently there is no notification or webhook event sent when a person updates their fundraiser on Facebook.

#### Facebook Fundraiser Ended

_When a person ends their fundraiser on Facebook_

- Currently there is no notification or webhook event sent when a person ends their fundraiser on Facebook.

#### Facebook Fundraiser Deleted

_When a person deletes their fundraiser on Facebook_

- If you receive a GraphMethodException with a message like “Unsupported post request. Object with ID 'fundraiser\_id' does not exist, cannot be loaded due to missing permissions…”

  - Check the Graph API call to make sure it’s not a coding error
  - If the call is correct, it’s likely that the user deleted the fundraiser on Facebook
  - Change the dashboard widget back to the original “Connect Fundraiser to Facebook” widget

#### Facebook Donation Refunded

_When a donation is refunded on Facebook_

- Currently, when a donation is refunded, the fundraiser on Facebook won't reflect the refund and the total amount raised will stay the same. No webhook event will be sent to notify you of the refund.

* * *

## AppEvents

We recommend implementing Facebook Analytics AppEvents to track conversion rates over time and for A/B tests.

* * *

## Testing

More information about testing Fundraiser API integrations can be found in our [FAQ](https://developers.facebook.com/docs/fundraiser-api/faq).

## Refunds

Refunds appear in [transaction reports](https://developers.facebook.com/docs/fundraiser-api/plan#transaction_reports), but are not reflected on the Facebook fundraising page or sent via webhook. More information about how refunds are handled can be found in our [FAQ](https://developers.facebook.com/docs/fundraiser-api/faq).

## Transaction Reports

Admins can download transaction reports from the organization's page. You can find more information [here](https://www.facebook.com/help/1787615158233986).

## Known Issues

#### Test Users Not Supported

Calls to the Fundraiser API with a test user token, will return an error. Make sure to use an actual user to test the integration.

#### Test Donations Not Supported

There’s no way to test the [Facebook Donation Received](https://developers.facebook.com/docs/fundraiser-api/plan#facebook_donation_received) flow without making an actual donation. We recommend testing using the minimum donation amount then and requesting a refund [here](https://www.facebook.com/help/contact/513795398968461).

#### Unhandled Flows

The Fundraiser API is in beta, and we do not yet handle the uncommon [Facebook Fundraiser Updated](https://developers.facebook.com/docs/fundraiser-api/plan#facebook_fundraiser_updated), [Facebook Fundraiser Ended](https://developers.facebook.com/docs/fundraiser-api/plan#facebook_fundraiser_ended), or [Facebook Fundraiser Deleted](https://developers.facebook.com/docs/fundraiser-api/facebook_fundraiser_deleted) flows well, but plan to add support soon.

#### Non-Atomic External App Donations

If external donations to the same fundraiser are posted and deleted in quick succession (less than 3 seconds apart), the external amount reflected on the Facebook fundraiser may become out of sync. Calls to POST and DELETE external donations on the same fundraiser should be separated by at least 3 seconds. This case typically only occurs when connecting a fundraising page with existing donations and refunds that are attempted to be added and deleted as a batch job.

## Bug Reports

If you find any issues with this documentation or the Fundraiser API, you can submit bug reports [here](https://www.facebook.com/help/contact/513795398968461), and we will attempt to help resolve the issue.

## Feature Requests

If you have feature requests, we suggest you submit them [here](https://www.facebook.com/help/contact/513795398968461). It’s useful for us to hear which features are frequently requested.

# Appendix

## Useful References

- [Facebook Login](https://developers.facebook.com/docs/facebook-login/)
- [Webhooks](https://developers.facebook.com/docs/graph-api/webhooks)

## Recommended Tools

- [Facebook SDKs](https://developers.facebook.com/docs/graph-api/using-graph-api/using-with-sdks)\- Highly recommended unless you’re an experienced Facebook app developer


  - [Using the Facebook JavaScript SDK for Login](https://developers.facebook.com/docs/facebook-login/web)
- [Graph API](https://developers.facebook.com/docs/graph-api/)
  - [Graph API Explorer](https://developers.facebook.com/tools/explorer) \- Useful for making and debugging basic Graph API calls

## Get Nonprofit or Donations Help

Nonprofit / Charity Support Form: [https://www.facebook.com/help/contact/513795398968461](https://www.facebook.com/help/contact/513795398968461)

## Create a Business Manager on Facebook

Follow these [instructions](https://www.facebook.com/business/help/1710077379203657?id=180505742745347).

## Add App to a Business

Follow these [instructions](https://www.facebook.com/business/help/2199735813629697?id=420299598837059).

## Regain Lost App Admin Access

If at all possible, contact a current app admin to be added as an admin of the app. If you've exhausted all other methods to contact current app admins in order to regain app admin access, please follow the steps below to reach out to Facebook support. Once you've submitted the additional documentation, this process may take up to a week for you to get a response.
**You must use your real Facebook account**

### Overview

If you've lost access to your app, you will need to fill out this form [https://www.facebook.com/help/contact/1838825039720902](https://www.facebook.com/help/contact/1838825039720902). To help fill out this form, follow the steps below:

1. [Become Admin of Your Page](https://developers.facebook.com/docs/fundraiser-api/plan#become_admin)
2. [Create a Business Manager Account](https://developers.facebook.com/docs/fundraiser-api/plan#create_business_manager_account)
3. [Create a Developers Account](https://developers.facebook.com/docs/fundraiser-api/plan#create_developer_account)
4. [Complete Lost App Access Form](https://developers.facebook.com/docs/fundraiser-api/plan#lost_app_access_form)

### Become Admin of Your Page

If you're not already an admin of your page, you'll need to ask a current admin to add your Facebook account as an admin before continuing. Facebook we will not accept fake accounts to be added as admins. Keep in mind any account created just for the purpose of admining this page will be rejected. **You must use your real Facebook account**.

### Create a Business Manager Account

Creating a Business Manager account enables you to **receive support** for any issues you might experience with your page. **Your page needs a business manager account in order to see the “Lost App Access” form linked below**. If you don't already have an existing Business Manager account, follow the steps below.

1. From a user with admin access to their page, go to [https://business.facebook.com](https://business.facebook.com/). If you're already part of a different business, you can create a business account for your nonprofit here: [https://business.facebook.com/overview](https://business.facebook.com/overview).
2. Create Account > Enter Business name, Admin's name, email
3. Add Page > Add Page
4. Search for page or paste page's url
5. Add Page (Page admins will be approved automatically)

### Create a Developers Account

1. Go to [https://developers.facebook.com](https://developers.facebook.com/)
2. Click Get Started in upper right > Next
3. Enter phone > Send as Text > Enter confirmation code
4. Confirm contact email > Next (don't worry about what the App Name is)
5. Select Developer or appropriate role > Add Your First Product

### Complete Lost App Access Form

1. Complete the “My business has lost access to our app” form here: [https://www.facebook.com/help/contact/1838825039720902](https://www.facebook.com/help/contact/1838825039720902). If you can't see this page, make sure you've completed the Create a Business Manager Account step above.
2. All fields are mandatory since Facebook takes proper app ownership seriously.
3. You can find Business ID by looking in the address bar after going to [https://business.facebook.com](https://business.facebook.com/)
4. You can enter “Not sure” for current admin and current admin's original relationship to app.
5. Uploading government-issued ID is mandatory.
6. Uploading a notarized document to support the change in business relationship is mandatory.
7. For instance a notarized letter explaining that you hired an external developer to integrate your app with Facebook and no longer have the contact information of that app developer.

On This Page

[Plan for Fundraiser API](https://developers.facebook.com/docs/fundraiser-api/plan#plan-for-fundraiser-api)

[Refunds](https://developers.facebook.com/docs/fundraiser-api/plan#refunds)

[Transaction Reports](https://developers.facebook.com/docs/fundraiser-api/plan#transaction_reports)

[Known Issues](https://developers.facebook.com/docs/fundraiser-api/plan#known-issues)

[Bug Reports](https://developers.facebook.com/docs/fundraiser-api/plan#bug-reports)

[Feature Requests](https://developers.facebook.com/docs/fundraiser-api/plan#feature-requests)

[Useful References](https://developers.facebook.com/docs/fundraiser-api/plan#references)

[Recommended Tools](https://developers.facebook.com/docs/fundraiser-api/plan#recommended_tools)

[Get Nonprofit or Donations Help](https://developers.facebook.com/docs/fundraiser-api/plan#get-nonprofit-or-donations-help)

[Create a Business Manager on Facebook](https://developers.facebook.com/docs/fundraiser-api/plan#create_business)

[Add App to a Business](https://developers.facebook.com/docs/fundraiser-api/plan#add_app_to_a_business)

[Regain Lost App Admin Access](https://developers.facebook.com/docs/fundraiser-api/plan#regain_lost_app_admin_access)

[Overview](https://developers.facebook.com/docs/fundraiser-api/plan#overview)

[Become Admin of Your Page](https://developers.facebook.com/docs/fundraiser-api/plan#become_admin)

[Create a Business Manager Account](https://developers.facebook.com/docs/fundraiser-api/plan#create_business_manager_account)

[Create a Developers Account](https://developers.facebook.com/docs/fundraiser-api/plan#create_developer_account)

[Complete Lost App Access Form](https://developers.facebook.com/docs/fundraiser-api/plan#lost_app_access_form)