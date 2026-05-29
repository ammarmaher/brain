---
url: https://developers.facebook.com/docs/development/release/business-verification
title: Business Verification - App Development with Meta
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fdevelopment%2Frelease%2Fbusiness-verification%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[App Development with Meta](https://developers.facebook.com/docs/development)

- [Register](https://developers.facebook.com/docs/development/register)
- [Features Reference](https://developers.facebook.com/docs/features-reference)
- [Permissions Reference](https://developers.facebook.com/docs/permissions)
- [Create an App](https://developers.facebook.com/docs/development/create-an-app)
- [Use Case Customization](https://developers.facebook.com/docs/development/app-customization)
- [App Dashboard](https://developers.facebook.com/docs/development/create-an-app/app-dashboard)
- [Build and Test](https://developers.facebook.com/docs/development/build-and-test)
- [Release](https://developers.facebook.com/docs/development/release)


  - [Access Levels](https://developers.facebook.com/docs/graph-api/overview/access-levels)
  - [Access Verification](https://developers.facebook.com/docs/development/release/access-verification)
  - [Business Verification](https://developers.facebook.com/docs/development/release/business-verification)

- [Transfer Ownership](https://developers.facebook.com/docs/development/create-an-app/transfer-an-app)
- [Maintaining Data Access](https://developers.facebook.com/docs/development/maintaining-data-access)
- [Terms and Policies](https://developers.facebook.com/docs/development/terms-and-policies)
- [Support](https://developers.facebook.com/docs/development/support)
- [Trust Center](https://developers.facebook.com/docs/development/trust-center)

On This Page

[Business Verification](https://developers.facebook.com/docs/development/release/business-verification#business-verification)

[Step 1: Connect your app to a Business](https://developers.facebook.com/docs/development/release/business-verification#step-1--connect-your-app-to-a-business)

[Step 2: Verify your Business](https://developers.facebook.com/docs/development/release/business-verification#step-2--verify-your-business)

# Business Verification

**[Advanced Access](https://developers.facebook.com/docs/graph-api/overview/access-levels/#advanced-access) now requires Business Verification.**

As of February 1, 2023, if your app requires advanced level access to permissions, you might need to complete [Business Verification](https://developers.facebook.com/docs/development/release/business-verification). [See this blog post for more information.](https://developers.facebook.com/blog/post/2023/02/01/developer-platform-requiring-business-verification-for-advanced-access/)

Business Verification is a process that allows us to gather information about you and your Business so we can verify your identity as a business entity.

Apps that request [advanced access](https://developers.facebook.com/docs/graph-api/overview/access-levels/#advanced-access) for permissions and apps that allow other [Businesses](https://business.facebook.com/) to access their own data must be connected to a Business that has completed Business Verification. Until then, app users from other Businesses will be unable to grant these apps [permissions](https://developers.facebook.com/docs/permissions/reference) and all [features](https://developers.facebook.com/docs/apps/features-reference) will be inactive.

If your app will only be used by app users who have a [role](https://developers.facebook.com/docs/development/build-and-test/app-roles) on the app itself you do not need to complete verification; these users can grant your app any permissions at any time and all features are always active.

You can use the App Dashboard to connect your app to a Business that you're an Admin of, regardless of whether or not the Business has been verified, but the verification process itself must be completed in the Facebook Business Manager. If you do not have a Business, you will be given the option to create one.

Note that anyone with an Administrator role on your app can connect it to a Business, but only someone with an Admin role in the Business will be able to complete the verification process.

## Step 1: Connect your app to a Business

Load your app in the App Dashboard and go to **Settings** \> **Basic** \> **Verification** and click the Start Verification button or the **\+ Business Verification** link if you have previously completed Individual Verification.

![Verification section in the Basic Settings panel.](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/143865101_957211231353134_6810255425904105080_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=6f7WSFRJY24Q7kNvwF35xdR&_nc_oc=Adqsfx0MZdbStQSqOMEsnK7tEjTPT2T-Nmoy9OwUtNtckLktNFYQLA_UqM6pT-N0JVE&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=OYHlDNCDGO2gMV1p_gwJKA&_nc_ss=7b289&oh=00_Af6LyCxXpcJfDLXxdICdXgdmzOsrYTZBn-xhyixKkcON4g&oe=6A2568E7)

If your Facebook developer account is already associated with a Facebook Business account, you will be given the option to select a Business within it:

![Business selection modal with a verified Business selected.](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/144081810_241994877493212_2655917975499900173_n.png?_nc_cat=102&ccb=1-7&_nc_sid=e280be&_nc_ohc=dAmeUR6Qf_YQ7kNvwHgisKv&_nc_oc=AdrGctbyFxLu2EGME6wpvZr1zW8_aAb8pon6UCbGgsA45B2ZbwG-YJ-iaMVkN4PoM9E&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=OYHlDNCDGO2gMV1p_gwJKA&_nc_ss=7b289&oh=00_Af7IjESHwNNO_3PSTtjRyAH-sktALBRxsh95DZZW0wxKUg&oe=6A2584AE)

If you don't have a Facebook Business account, or if your account contains no Businesses, you will be prompted to create one.

Connecting your app to a verified Business completes the connection process and there's nothing else you have to do. The **Verification** section should show that your app is now connected to a verified Business:

![Verification section showing 'Verified' alongside the name of the Business that has been connected to the app.](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/142987006_267806678357731_3713867277959890685_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=s2z5SniyVkoQ7kNvwFMlGkX&_nc_oc=AdqOnOhmnfSbFIopsepLjCT8wD_Xrwzr5Z1gaRSsx1ajfbsDRzs6IVxAMJGsFg_rcwo&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=OYHlDNCDGO2gMV1p_gwJKA&_nc_ss=7b289&oh=00_Af5e1metaMNvZjcjy-qYrjQbN1VxSIUBNM868RqXrN9sag&oe=6A257571)

If, however, you connected your app to an unverified Business, you must complete the verification process in the Business Manager.

## Step 2: Verify your Business

If you connected your app to an unverified Business, you or Admin of the Business must complete the verification process within the Business Manager.

![Business selection modal with an unverified Business selected.](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/143769130_241837180871082_6770952626487554480_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=eKQnoFodfcAQ7kNvwFY6ZFO&_nc_oc=AdoDBaHMHwJRKDtACDEAvREbp8GaqQPin6Zcd_FNZhtVGi7uS99ZwuXmyQWsS1gWGeI&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=OYHlDNCDGO2gMV1p_gwJKA&_nc_ss=7b289&oh=00_Af6PEJlJ8zlPpluHsfmNqeaGW1n_R5Cd1Q4WtNmv3Kbmpw&oe=6A256905)

Click Start Business Verification to load the unverified Business in the Business Manager and complete the verification process.

Refer to our Business Manager Help Center's [About Business Verification](https://www.facebook.com/business/help/1095661473946872) topic for an explanation of the process and a list of documents you will need.

Once you have completed verification, return to the Basic Settings panel. You should see that your app is now connected to a verified Business:

![Verification section showing 'Verified' alongside the name of the Business that has been connected to the app.](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/144376827_121772393150711_6581279437038461255_n.png?_nc_cat=110&ccb=1-7&_nc_sid=e280be&_nc_ohc=zC-tA4YjeSwQ7kNvwFS5ZPb&_nc_oc=AdqI7vG_ofOdQXVIN3A9YoXYq9ypfLYAkExi6nLjGgspZ5AYkl3eigSkObcOTBF6us0&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=OYHlDNCDGO2gMV1p_gwJKA&_nc_ss=7b289&oh=00_Af5g0qitRVn1bFVlGPFXSpE-3f238RpGG_E7U1nAocbWdA&oe=6A2599B8)

On This Page

[Business Verification](https://developers.facebook.com/docs/development/release/business-verification#business-verification)

[Step 1: Connect your app to a Business](https://developers.facebook.com/docs/development/release/business-verification#step-1--connect-your-app-to-a-business)

[Step 2: Verify your Business](https://developers.facebook.com/docs/development/release/business-verification#step-2--verify-your-business)