---
url: https://developers.facebook.com/docs/graph-api/get-started/
title: Get Started - Graph API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Fget-started%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)
- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)


  - [Graph Explorer Guide](https://developers.facebook.com/docs/graph-api/guides/explorer)

- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)
- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Get Started](https://developers.facebook.com/docs/graph-api/get-started/#get-started)

[Before You Start](https://developers.facebook.com/docs/graph-api/get-started/#before-you-start)

[Your First Request](https://developers.facebook.com/docs/graph-api/get-started/#your-first-request)

[Step 1: Open the Graph API Explorer tool](https://developers.facebook.com/docs/graph-api/get-started/#step-1--open-the-graph-api-explorer-tool)

[Step 2. Generate an Access Token](https://developers.facebook.com/docs/graph-api/get-started/#step-2--generate-an-access-token)

[Step 3. Submit the Request](https://developers.facebook.com/docs/graph-api/get-started/#step-3--submit-the-request)

[Your Second Request](https://developers.facebook.com/docs/graph-api/get-started/#your-second-request)

[Step 1. Let's Add a Field](https://developers.facebook.com/docs/graph-api/get-started/#step-1--let-s-add-a-field)

[Step 2. Add a Permission](https://developers.facebook.com/docs/graph-api/get-started/#step-2--add-a-permission)

[Let's Look at an Edge](https://developers.facebook.com/docs/graph-api/get-started/#let-s-look-at-an-edge)

[Get the Code for your Request](https://developers.facebook.com/docs/graph-api/get-started/#get-the-code-for-your-request)

[Learn More](https://developers.facebook.com/docs/graph-api/get-started/#learn-more)

# Get Started

This guide explains how to get started with receiving data from the Facebook Social Graph.

## Before You Start

You will need:

- [Register as a Meta Developer](https://developers.facebook.com/docs/development/register)

- A [Meta App](https://developers.facebook.com/docs/development/create-an-app) – This app will be for testing so there is no need to involve your app code when creating this Meta App.

- The [Graph API Explorer tool](https://developers.facebook.com/tools/explorer) open in a separate browser window

- A brief understanding of the structure of the Meta's social graph from our [Graph API Overview](https://developers.facebook.com/docs/graph-api/overview#nodes) guide


## Your First Request

### Step 1: Open the Graph API Explorer tool

[Open the Graph API Explorer in a new browser window.](https://developers.facebook.com/tools/explorer) This allows you to execute the examples as you read this tutorial.

The explorer loads with a default query with the `GET` method, the lastest version of the Graph API, the `/me` node and the `id` and `name` fields in the [Query String Field](https://developers.facebook.com/docs/graph-api/guides/explorer#query-string-field), and your Facebook App.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/232068365_563091814813799_6070357364579520404_n.png?_nc_cat=100&ccb=1-7&_nc_sid=e280be&_nc_ohc=JgtE4WkGrRsQ7kNvwEWDQm7&_nc_oc=AdrtzC_KHWDk1q8t66aj4fIL7uq84VgUEHGCBXdnbHuIjklSptda-khi89w2nAA38gA&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=9cash2Pr4OSeQIrtlR2EAw&_nc_ss=7b289&oh=00_Af5DNIWfNFjKOSlyd0UiGD6mZkal4gxm2y6gXiTMrD69Fg&oe=6A251864)

### Step 2. Generate an Access Token

Click the **Generate Access Token** button. A **Log in With Facebook** window will pop up. This popup is your app asking for your permission to get your name and profile picture from Facebook.

|     |     |
| --- | --- |
| This flow is our [Facebook Login](https://developers.facebook.com/docs/facebook-login) product that allows a person to log into an app using their Facebook credentials. Facebook Login allows an app to ask a person to access the person's Facebook data, and for the person to accept or decline access. Your name and profile picture are public, to allow people to find you on Facebook, so no additional requirements are needed to run this request.<br>Click **Continue as...**<br>A User Access Token is created. This token contains information such as the app making the request, the person using the app to make a request, if the access token is still valid (it expires in about an hour), the expiration time, and the scope of data the app can request. In this request the scope is `public_profile` which includes your name and profile picture. | ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/231956490_308313234407833_1605768375436620205_n.png?_nc_cat=106&ccb=1-7&_nc_sid=e280be&_nc_ohc=z2T1mDH5pscQ7kNvwGiKQOG&_nc_oc=AdrGQ2rjflMSoN4S7mKw2ezAY_6V_wFhZQxB-jEN923EDQxf89S0mycK3RopMPDFhMk&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=9cash2Pr4OSeQIrtlR2EAw&_nc_ss=7b289&oh=00_Af64L-k75zrSm2oavAMjEKUpB4mStrFRLc-ivEc3VArbNA&oe=6A24FD2E) |

|     |     |
| --- | --- |
| ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/232991718_592378688435455_3147910228443606263_n.png?_nc_cat=109&ccb=1-7&_nc_sid=e280be&_nc_ohc=K9Eua_PsDfUQ7kNvwEzjogB&_nc_oc=AdpP8zdE5Lmpz6faG0qywBo00oMMyZGY2Fq0lBzJN2_rtsBmrgdNU9UJojLa3vROSnY&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9cash2Pr4OSeQIrtlR2EAw&_nc_ss=7b289&oh=00_Af7hIwRPjU01RWVmm77hy76n6phzBrsT0KfqJm5y_tMLQQ&oe=6A2501B4) | Click the information circle icon next to the acces token to view the token's information. |

### Step 3. Submit the Request

Click the **Submit** button in the upper right corner.

#### What You Should See

In the [Response Window](https://developers.facebook.com/docs/graph-api/guides/explorer#response-window), you will see a JSON response with your Facebook User ID and your name.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/232902382_904467853476103_7217229934737479641_n.png?_nc_cat=105&ccb=1-7&_nc_sid=e280be&_nc_ohc=Ei-cwhQsYEMQ7kNvwEugy4b&_nc_oc=AdpM_5YEv5pgbutXEP6lvKdoWlLMZl1IaDexUce3nVs9weL63Jlyee5fhEXjVfIIvvU&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=9cash2Pr4OSeQIrtlR2EAw&_nc_ss=7b289&oh=00_Af5WUfNRsfQG5pb2_U0LN73ljmft1nC-g1ak8xSYYwPkGw&oe=6A252D23)

If you remove `?fields=id,name` from the query string field and click **Submit**, you will see the same result since `name` and `id` are the User node fields returned by default.

## Your Second Request

### Step 1. Let's Add a Field

Let's make the First Request a little more complex by adding another field, `email`. There are two ways to add fields:

- Click the search dropdown menu in the [Node Field Viewer](https://developers.facebook.com/docs/graph-api/guides/explorer#node-field-viewer) to the left of the response window
- Start typing in the query string field.

Let's add the `email` field and click **Submit**.

#### What You Should See

While the call did not fail, only the `name` and `id` fields were returned along with a debug message. Click the (Show) link to debug the request.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/233410295_959323958245691_7180707304587023135_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=WXIGaHFMpkkQ7kNvwEOrhH6&_nc_oc=Adq7S41f73Sjp2YH3CmI0GZPkorp9USr6v2FPvs64IKNk_Kkzqs12bfQoRCza0q8A7s&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9cash2Pr4OSeQIrtlR2EAw&_nc_ss=7b289&oh=00_Af6Ph5gV5NIDrA49VcFt1sSjzi5ITphmSSrgr5aCFJxUdQ&oe=6A252B16)

Almost all nodes and fields need a specific permission to access them. The debug message is telling you that you need to give your app permission to access the email address that you have associated with your Facebook account.

### Step 2. Add a Permission

|     |     |
| --- | --- |
| In the right side panel, under **Permissions**, click the **Add a Permission** dropdown menu. Click **User Data Permissions** and select **email**.<br>#### Generate A New User Access Token<br>Because you are changing the scope of the access token, you need to create a new one. Click **Generate Access Token**. Just like your first request, you must give your app permission to access your email in the Facebook Login dialog.<br>Once the new token has been created, click **Submit**. Now all fields in your request will be returned. | ![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.2365-6/234580746_367949518031866_340317674627083357_n.png?_nc_cat=104&ccb=1-7&_nc_sid=e280be&_nc_ohc=I9O0-3gW8sgQ7kNvwGe9a0O&_nc_oc=AdqBR7F95iwvcqs2D-Lu0l75GT4rdbcoy4WSLrNzvr1R2jWg_yH98bfv5onrjAIeWvk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=9cash2Pr4OSeQIrtlR2EAw&_nc_ss=7b289&oh=00_Af6mZKfjgiphldJBPF-J51tA-d7qpnWMZAM-z86mjMvKgg&oe=6A25135E) |

Try getting your Facebook posts.

[See the steps.](https://developers.facebook.com/docs/graph-api/get-started/#)

#### Links in the Response

Notice that `id` values returned in the response window are links. These links can represent nodes, such as User, Page, or Post. If you click on a link, the ID will replace the contents of the query string field. Now you can run requests on that node. Because this node is connected to the parent node, a Post of a User, you may not need to add permissions. You can click on a Post ID now since we will be using it in the next example.

Notice: Some IDs are a combination of the parent ID and a new ID string. For example, a User's Post will have a Post ID that looks something like this: `1028223264288_102224043055529` where `1028223264288` is the User ID.

## Let's Look at an Edge

The User node does not have many edges that can return data. Access to User objects can only be given by the User who owns the object. In most cases, a User owns an object if they created it.

For example, if you publish a post you can see information about the post such as when it was created, text, photos, and links shared in the post, and the number of reactions the post received. If you comment on your post, you will be able to get that comment, but if another person publishes a comment on your post, you will not be able to see the comment or who published it.

Try getting the number of reactions for one of your posts. You will want to take a look at the
[Object Reactions reference.](https://developers.facebook.com/docs/graph-api/reference/v13.0/object/reactions)
[See the steps.](https://developers.facebook.com/docs/graph-api/get-started/#)

## Get the Code for your Request

The explorer tool lets you test requests and once you have a successful response, you can get the code to insert into your app code. At the bottom of the response window, click **Get Code**. The explorer offers Android, iOS, JavaScript, PHP, and cURL code. The code is pre-selected so you can just copy and paste.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.2365-6/231948896_1065545040645743_5920314088559660186_n.png?_nc_cat=101&ccb=1-7&_nc_sid=e280be&_nc_ohc=6oicxQjGBP0Q7kNvwFErW6_&_nc_oc=Adom8HKoDa9Vw2yKtyuaOrfw1gvi8OQhWdLFGb9NawYFYVIJckSiYpoz57GX1UAFS3o&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=9cash2Pr4OSeQIrtlR2EAw&_nc_ss=7b289&oh=00_Af4XQcziJnNHaTGONF4jBENdVArqM1pu9Jxu2BBdFnr12g&oe=6A2518EC)

We recommend that you implement the Facebook SDK for your app. This SDK will include Facebook Login which allows your app to ask for permissions and get access tokens.

## Learn More

You can use the Graph API Explorer to test any request for Users, Pages, Groups, and more. Visit the [reference](https://developers.facebook.com/docs/graph-api/reference) for each node or edge to determine the permission and access token type required.

|     |     |
| --- | --- |
| - [Access Token](https://developers.facebook.com/docs/facebook-login/access-tokens)<br>- [Facebook Login](https://developers.facebook.com/docs/facebook-login)<br>- [Facebook SDKs](https://developers.facebook.com/docs#apis-and-sdks) | - [Graph API References](https://developers.facebook.com/docs/graph-api/reference)<br>- [Graph API Explorer Guide](https://developers.facebook.com/docs/graph-api/guides/explorer)<br>- [Login Security](https://developers.facebook.com/docs/facebook-login/security)<br>- [Permissions Reference](https://developers.facebook.com/docs/permissions/reference) |

On This Page

[Get Started](https://developers.facebook.com/docs/graph-api/get-started/#get-started)

[Before You Start](https://developers.facebook.com/docs/graph-api/get-started/#before-you-start)

[Your First Request](https://developers.facebook.com/docs/graph-api/get-started/#your-first-request)

[Step 1: Open the Graph API Explorer tool](https://developers.facebook.com/docs/graph-api/get-started/#step-1--open-the-graph-api-explorer-tool)

[Step 2. Generate an Access Token](https://developers.facebook.com/docs/graph-api/get-started/#step-2--generate-an-access-token)

[Step 3. Submit the Request](https://developers.facebook.com/docs/graph-api/get-started/#step-3--submit-the-request)

[Your Second Request](https://developers.facebook.com/docs/graph-api/get-started/#your-second-request)

[Step 1. Let's Add a Field](https://developers.facebook.com/docs/graph-api/get-started/#step-1--let-s-add-a-field)

[Step 2. Add a Permission](https://developers.facebook.com/docs/graph-api/get-started/#step-2--add-a-permission)

[Let's Look at an Edge](https://developers.facebook.com/docs/graph-api/get-started/#let-s-look-at-an-edge)

[Get the Code for your Request](https://developers.facebook.com/docs/graph-api/get-started/#get-the-code-for-your-request)

[Learn More](https://developers.facebook.com/docs/graph-api/get-started/#learn-more)