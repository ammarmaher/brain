---
url: https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support
title: Support - Business Management APIs
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-management-apis%2F2tier-bm-solution%2Fsupport%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Business Management APIs](https://developers.facebook.com/docs/business-management-apis)

- [Business Manager](https://developers.facebook.com/docs/business-management-apis/business-manager-api)
- [System Users](https://developers.facebook.com/docs/business-management-apis/system-users)
- [Business Asset Management](https://developers.facebook.com/docs/business-management-apis/business-asset-management)
- [Business Creative Asset Management](https://developers.facebook.com/docs/business-management-apis/business-creative-asset-management)
- [2-Tier Business Manager Solution](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution)


  - [Overview](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/overview)
  - [Prerequisites](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/prerequisites)
  - [Pre-app Review Development](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/pre-app-review-development)
  - [Get Started](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/get-started)
  - [Guides](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/guides)
  - [Supported Operations](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/supported-operations)
  - [Support](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support)

On This Page

[Support](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#support)

# Support

Use this support for troubleshooting and FAQs.

[I am unable to create an ad account under the Business Manager after creating a child Business Manager. What should I do if I see this error? "(#200) Cannot access an object not managed by the business owning this app.","type":"OAuthException","code":200](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_297811994470891)

This error usually means you need to:

1. Get `business_management`, `ads_management`, and standard tier access for your app.
2. Mark your app as a non-development app.
3. Apply for App Review for the app to use the APIs.

Without standard-tier access, you can't use certain features of the Marketing APIs.

```code
curl -i -X GET \
 "https://graph.facebook.com/<API_VERSION>/<extended credit line id>?fields=receiving_business&access_token=<access_token>"
```

Each child Business Manager will have a unique allocation config whose ID you can extract from the API call above. Now use the allocation config ID in the API call below:

```code
curl -i -X POST \
  -d “amount=<amount>” \
  "https://graph.facebook.com/<API_VERSION>/<allocation config id>?fields=access_token=<access token> "
```

Alternatively, you can just delete the config and create a new one:

```code
curl -i -X DELETE \
 "https://graph.facebook.com/<API_VERSION>/<allocation config id>?fields=access_token=<Access_token> "
```

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_297811994470891)

[I keep getting a \`MANAGE\_PERMISSIONS\` error when trying to read all businesses from the following:](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_991927754495494)

```code
GET  <graph>/<API_VERSION>/<BUSINESS_ID>/owned_businesses?client_user_id=<app_scoped_user_id>
```

```code
{
  "error": {
    "message": "(#10) You do not have permission to perform this action. This action requires that you can MANAGE_PERMISSIONS for this business account.",
    "type": "OAuthException",
    "code": 10,
    "fbtrace_id": "alphanumeric string"
  }
}
```

Most likely the access token you used is not an admin of the parent Business Manager. You should not use the client’s user access token or the child Business Manager admin system user token.

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_991927754495494)

[I want to create multiple child Business Managers for the client; however, I keep getting an error message.](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_519740715247315)

```code
{
  "error": {
    "message": "The Facebook Page you've tried to add is already owned by another Business Manager. You can still request access to this Page, but your request will need to be approved by the Business Manager that owns it.",
    "type": "OAuthException",
    "code": 3918,
    "error_subcode": 1690024,
    "is_transient": false,
    "error_user_title": "Facebook Page Already Belongs to a Business",
    "error_user_msg": "The Facebook Page you've tried to add is already owned by another business. You can still request access to this Page, but your request will need to be approved by the business that owns it.",
    "fbtrace_id": "alphanumeric string"
  }
  }
```

The primary page has already been set on another Business Manager. It could be that the page has been set on a user’s Business Manager or is connected to an Instagram profile. To solve this, you can use the `shared_page_id` field when creating the business or updating the business.

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_519740715247315)

[Can I use this solution if I don't have a line of credit open?](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_1271515026343022)

Currently, we only support a line of credit payment method for this setup through the API.

1. Create a child Business Manager and ad account.
2. Add the user to the Business Manager or ad account as a Finance Editor.
3. Send the user to the UI for the ad account or Business Manager.
4. Ask the user to manually enter the credit card.

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_1271515026343022)

[What should I be storing?](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_477137206250177)

We recommend storing information associated with the user, including:

- Child Business Manager ID, created with the \`/business\_id/owned\_businesses\` endpoint

- Child Business Manager Admin system user token, created with the \`child\_bm/access\_token\` endpoint


This recommendation makes it easier to manage and reduces overhead.

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_477137206250177)

[How can I get started with testing and development on these APIs?](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_689947074755260)

1. Log in to your app dashboard.
2. Add a test user with **http://developers.facebook.com/apps/app\_id/roles/test-users/?business\_id=bmid**

    (Replace \`bmid\` and \`app\_id\` with actual IDs)
3. Click **Edit** and generate and access token with the 'business\_management' and 'ads\_management' permissions.
4. Generate an access token for that test user by clicking **Edit** \> **Get an access token for this test user**.
5. Create a Facebook page or use one that already exists for testing.
6. Add this newly created user as an admin to that test page:
   - Go to **https://www.facebook.com/page\_id/settings/?tab=admin\_roles** (Replace \`page\_id\` with an actual page ID)

   - Click **Assign a new Page role**

   - Select **Page Admin**.
7. Now use the test user in the API calls.

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_689947074755260)

[Can a user have more than one child Business Manager?](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_320960541906378)

Yes. A user can be associated with more than one child Business Manager per partner. Each existing child under the partner must have an assigned primary page.

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_320960541906378)

[Can I add a user to the child Business Manager?](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_577017572805646)

Yes, the parent Business Manager can grant access to a user if they choose to do so.

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_577017572805646)

[How can I test creating child Business Managers while my app is still pending approval for 'business\_management' permissions?](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_848383535517445)

While your app is waiting for business\_management, ads\_management, and Ads Management Standard Access permissions, you can still test end-to-end:

1. Go to the [**App dashboard**](https://developers.facebook.com/apps).
2. Go to **Roles** \> **Test Users**.
3. Click **Add** to create a new test user.
4. Mark **Authorize Test Users for This App?** as **yes**.
5. In **Login Permissions**, add \`ads\_management\` and \`business\_management\` to the list of permissions.
6. Click **Create Test User**.
7. Once created, click **Edit** next to the user and select **Get an access token for this test user**. You can use this test user to replicate a client.
**You need your app to be approved first to make the API calls.**

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_848383535517445)

[How do I get real-time notification on an ad account while being disabled through Webhooks?](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_1191985280968843)

You must meet these prerequisites:

- Your app has [**Business Management permissions**](https://developers.facebook.com/docs/marketing-api/review/sample-submission/#adding-permissions).

- Your app is a standard tier App.

- The child Business Managers should own the ad accounts that roll up into the parent Business Manager.

- Any ad account directly under the parent Business will also send out Webhook notifications.


To set up a Heroku server that listens for notifications on Webhooks:

1. Create an account on Heroku. Any other server should also work.
2. Deploy the \`webhooks\_test\` code to the Heroku server.
3. For Heroku, in the **Setting** session, set up the **Config Variables**. You can get \`APP\_SECRET\` from your Facebook [**App dashboard**](https://developers.facebook.com/apps/).

You need this to verify that an update came from a Facebook server. \`VERIFY\_TOKEN\` is your password to set up a Webhooks subscription.
4. Add the Webhooks to your app by visiting \*\*https://developers.facebook.com/apps/{app\_id}/webhooks/\*\*.
5. From the selector, select **Application**, and click **Subscribe to the topic**.
6. Use the Webhook address and input the \`VERIFY\_TOKEN\` that you set.
7. Find the \`ad\_account\` and subscribe to it.


You can now make a test call through the Webhook UI.


[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_1191985280968843)

[How do I modify the extended credit amount limit set while sharing the LOC to child Business Manager?](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_2326540694073200)

You can either delete the allocation config of the shared extended credit and create a new one or modify the existing one. The allocation config ID is the ID returned at the time of sharing the LOC. You alternatively can fetch it via the API later with this API call that returns allocation config IDs for the extended credit.

[Permalink](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#faq_2326540694073200)

On This Page

[Support](https://developers.facebook.com/docs/business-management-apis/2tier-bm-solution/support#support)