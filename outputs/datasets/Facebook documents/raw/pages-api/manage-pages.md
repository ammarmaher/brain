---
url: https://developers.facebook.com/docs/pages-api/manage-pages?locale=zh_CN
title: 管理公共主页 - Facebook 公共主页 API - 文档 - Meta 开发者
status: 200
---

![](https://facebook.com/security/hsts-pixel.gif)

[Facebook 公共主页 API](https://developers.facebook.com/docs/pages-api)

- [概览](https://developers.facebook.com/docs/pages-api/overview)
- [Create an app](https://developers.facebook.com/docs/pages-api/create-an-app)
- [Webhook](https://developers.facebook.com/docs/pages-api/webhooks-for-pages)
- [入门指南](https://developers.facebook.com/docs/pages-api/getting-started)
- [管理公共主页](https://developers.facebook.com/docs/pages-api/manage-pages)
- [Upcoming Changes](https://developers.facebook.com/docs/pages/upcoming-changes)
- [Comments and @Mentions](https://developers.facebook.com/docs/pages-api/comments-mentions)
- [帖子](https://developers.facebook.com/docs/pages-api/posts)
- [Page Integrity API & Webhook](https://developers.facebook.com/docs/pages-api/integrity-webhook)
- [成效分析](https://developers.facebook.com/docs/platforminsights/page)
- [Search Pages](https://developers.facebook.com/docs/pages-api/search-pages)
- [Error Codes](https://developers.facebook.com/docs/pages-api/error-codes)
- [Changelog](https://developers.facebook.com/docs/pages-api/changelog)

# 管理公共主页

本文档将介绍如何在 Facebook 公共主页上执行以下任务：

- 获取您可以在其上执行任务的公共主页的清单，其中包括：



  - 您可以在每个公共主页上执行的特定任务

  - 每个公共主页的公共主页访问口令（可用于测试 API 调用）


- 获取并更新公共主页详细信息

- 获取并更新公共主页设置

- 接收 Meta 将在公共主页上实现的更改建议相关的通知



  - 接受或拒绝这些建议的更改


- 获取对公共主页的点评

- 在公共主页上屏蔽用户


## 前期准备

本指南假设您已阅读 [公共主页 API 概览](https://developers.facebook.com/docs/pages/overview)。

对于能够在公共主页上执行任务的用户，您需要实现企业版 Facebook 登录，以请求以下权限并接收用户访问口令或公共主页访问口令：

- `pages_manage_engagement`

- `pages_manage_metadata`

- `pages_manage_posts`

- `pages_read_engagement`

- `pages_read_user_engagement`

- `pages_show_list`

- `publish_video` 权限（如果您要在公共主页发布视频）


如要在 API 请求中使用企业系统用户，则需要 `business_management` 权限。

您的应用用户必须能够在 API 请求中涉及的公共主页上执行 `CREATE_CONTENT`、`MANAGE` 和/或 `MODERATE` 任务。

### 最佳实践

测试 API 调用时，您可以在调用中加入 `access_token` 参数，并将其设为您的访问口令。但是，从您的应用发出安全调用时，应使用 [访问口令类](https://developers.facebook.com/docs/facebook-login/guides/access-tokens#portabletokens)。


_为方便阅读，请求示例的格式已经过调整。请将 **粗体、斜体值**（例如 **page\_id**）替换为您的值。_

## 公共主页、任务和口令

对于您可以在其上执行任务的公共主页，调用一次 API 可为您提供大量与该公共主页相关的信息。

### 获取公共主页

如要获取您可以在其上执行任务的公共主页完整清单、您可以在每个公共主页上执行的所有任务以及每个公共主页的短期公共主页访问口令，请使用用户访问口令向 `/user_id/accounts` 端点发送 `GET` 请求。

#### 请求示例

```curl
curl -i -X GET
     "https://graph.facebook.com/user_id/accounts"
```

若请求成功，应用收到的 JSON 响应中将包含一个公共主页对象数组。每个公共主页对象都包含：

- 公共主页名称

- 公共主页编号

- 公共主页类别、类别名称和编号

- 短期公共主页访问口令

- 用户可在公共主页上执行的所有任务


#### 响应示例

```json
{
  "data": [\
    {\
      "access_token": "{facebook-for-developers-page-access-token}",\
      "category": "Internet Company",\
      "category_list": [\
        {\
          "id": "2256",\
          "name": "Internet Company"\
        }\
      ],\
      "name": "Facebook for Developers",\
      "id": "{facebook-for-developers-page-id}",\
      "tasks": [\
        "ANALYZE",\
        "ADVERTISE",\
        "MODERATE",\
        "CREATE_CONTENT"\
      ]\
    },\
    {\
      "access_token": "{my-outlandish-stories-page-access-token}",\
      "category": "Blogger",\
      "category_list": [\
        {\
          "id": "361282040719868",\
          "name": "Blogger"\
        }\
      ],\
      "name": "My Outlandish Stories",\
      "id": "{my-outlandish-stories-page-id}",\
      "tasks": [\
        "ANALYZE",\
        "ADVERTISE",\
        "MODERATE",\
        "CREATE_CONTENT",\
        "MANAGE"\
      ]\
    },\
...\
  ]
}
```

### 获取其他用户的任务

如果您可以在某个公共主页上执行 `MANAGE` 任务，您可以获得可在该公共主页上执行任务（包括每个用户都可以执行的任务）的其他用户名单。

如要获取用户名单和他们可以在该公共主页上执行的任务清单，请向 `/page_id/roles` 端点发送 `GET` 请求。

#### 请求示例

```curl
curl -i -X GET "https://graph.facebook.com/page_id/roles"
```

若请求成功，应用收到的 JSON 响应中将包含用户的姓名、其公共主页范围编号以及每个用户都可以在该公共主页上执行的任务。

#### 响应示例

```json
{
  "data": [\
    {\
      "name": "Person One",\
      "id": "page_scoped_id_for_one"\
        "tasks": [\
          "ANALYZE"\
        ]\
    },\
    {\
      "name": "Person Two",\
      "id": "page_scoped_id_for_two",\
      "tasks": [\
        "ANALYZE",\
        "ADVERTISE",\
        "MODERATE",\
        "CREATE_CONTENT",\
        "MANAGE"\
      ]\
    },\
...\
  ],
}
```

## 公共主页详细信息

如果您可以在某个公共主页上执行 `MANAGE` 任务，您就可以使用公共主页访问口令（或者，如果您的应用已获批使用公共主页公开内容访问权限功能，您就可以使用用户访问口令）来查看该公共主页的详细信息，如简介、邮件、营业时间等。

### 获取详细信息

如要获取公共主页的详细信息，请向 `/page_id` 端点发送 `GET` 请求，在其中加入 `fields` 参数，并将值设为要查看的公共主页详细信息。

**注意：** 在使用公共主页公开内容访问权限功能时，您可以使用 `/pages/search` 端点找到公共主页编号。

#### 请求示例

```curl
curl -i -X GET "https://graph.facebook.com/page_id \
     ?fields=about,attire,bio,location,parking,hours,emails,website"
```

若请求成功，应用收到的 JSON 响应中将包含您请求获得的字段值。如果系统未在响应中以某个字段作出回应，则说明未对公共主页设置此值。例如，如果未对公共主页设置 `attire` 字段，则不会在响应中以此字段作出回应。

### 更新详细信息

如果您可以在某个公共主页上执行 `MANAGE` 任务，您就可以使用公共主页访问口令向 `/page_id` 端点发送 `POST` 请求，并在其中加入要更新的参数，如 `about` 参数。

#### 请求示例

```curl
curl -i -X POST "https://graph.facebook.com/v25.0/page_id" \
     -H "Content-Type: application/json" \
     -d '{
           "about":"This is an awesome cafe located downtown!",
         }'
```

若请求成功，应用收到的 JSON 响应中将包含 `success`，值已设为 `true`。

### Meta 建议的更改

有时，Meta 会针对您的公共主页详细信息提出更改建议，如纠正错别字或更新您公共主页上的类别，使人们更容易找到您的公共主页。如要获得这些通知，您必须订阅 `page_upcoming_change` 和/或 `page_change_proposal` Webhooks。

收到通知后，您可以立即执行以下操作之一：

- 不采取任何操作，更改会在通知中指定的时间自动生效

- 主动接受更改，更改立即生效

- 主动拒绝更改，不做任何更改


#### 接受或拒绝更改建议

如要主动接受或拒绝更改建议，请向 `/page_change_proposal_id` 端点发送 `POST` 请求，并在其中加入 `accept` 字段（将值设为 `true` 为接受更改；将值设为 `false` 为拒绝更改）。`page_change_proposal_id` 是您在 `page_upcoming_change` Webhooks 通知中收到的 `proposal.id` 值或您在 `page_change_proposal` Webhooks 通知中收到的 `value.id` 值。

```code
curl -i -X POST "https://graph.facebook.com/v25.0/page_change_proposal_id" \
     -H "Content-Type: application/json" \
     -d '{
           "accept":"true",
         }'
```

若请求成功，应用收到的 JSON 响应中将包含 `success`，值已设为 `true`。

## 公共主页设置

如果您可以在某个公共主页上执行 `MANAGE` 任务，您就可以使用公共主页访问口令向 `/page_id/settings` 端点发送 `GET` 请求，以获取该公共主页的完整设置清单。

#### 请求示例

```curl
curl -i -X GET "https://graph.facebook.com/v25.0/page_id/settings"
```

若请求成功，应用收到的 JSON 响应中将包含一个对象数组，其中每个对象的 `setting` 都已设为一项公共主页设置和值（`true` 或 `false`）的组合。

#### 响应示例

```json
{
  "data": [\
    {\
      "setting": "USERS_CAN_POST",\
      "value": false\
    },\
    {\
      "setting": "USERS_CAN_MESSAGE",\
      "value": true\
    },\
    {\
      "setting": "USERS_CAN_POST_PHOTOS",\
      "value": true\
    },\
    ...\
  ]
}
```

### 更新设置

如要更新公共主页设置，请向 `/page_id/settings` 端点发送 `POST` 请求，在其中加入 `option` 参数，并将其值设为要更新的公共主页设置。

#### 请求示例

```code
curl -i -X POST "https://graph.facebook.com/v25.0/page_id/settings" \
     -H "Content-Type: application/json" \
     -d '{
           "option":{"USERS_CAN_MESSAGE": "true"},
         }'
```

若请求成功，应用收到的 JSON 响应中将包含 `success`，值已设为 `true`。

## 获取点评

您可以获取对公共主页的点评（包括点评人的姓名、其公共主页范围编号、是否是正面或负面建议以及点评文本），通过向 `/page_id/ratings` 端点发送 `GET` 请求即可获取。

#### 请求示例

```curl
curl -i -X GET "https://graph.facebook.com/page_id/ratings"
```

若请求成功，您的应用会收到一个 JSON 数组，其中包含多个点评对象。每个对象都包含：

- `created_time`，设置为点评的创建时间

- `recommendation_type`，设置为 `positive` 或 `negative`

- `review_text`，设置为点评内容

- `reviewer` 对象，其中包含该点评用户的 `name` 和 `id`


```code
{
  "data": [\
    {\
      "created_time": "unixtimestamp",\
      "recommendation_type": "positive",\
      "review_text": "I love this page!",\
      "reviewer": {\
        "name": "Person One",\
        "id": "psid_for_one"\
      }\
    },\
    {\
      "created_time": "unixtimestamp",\
      "recommendation_type": "positive",\
      "review_text": "This page is wonderful!",\
      "reviewer": {\
        "name": "Person Two",\
        "id": "psid_for_two"\
      }\
    },\
...\
  ]
}
```

## 屏蔽用户

如要屏蔽某位用户，禁止其在某个公共主页上发表评论，请向 `/page_id/blocked` 端点发送 `POST` 请求，在其中加入 `user` 参数，并将值设为要屏蔽的用户的公共主页范围编号。

#### 请求示例

```curl
curl -i -X POST "https://graph.facebook.com/v25.0/page_id/blocked"
     -H "Content-Type: application/json" \
     -d '{
           "user":"psid_to_block",
         }'
```

若请求成功，应用收到的 JSON 响应中将包含公共主页范围编号，值已设为 `true`。

```code
{
 "psid_to_block": true
}
```

## 后续步骤

了解如何 [向您的公共主页发布链接、照片和视频](https://developers.facebook.com/docs/pages-api/posts)。

## 另请参阅

- [Meta 公共主页专用 Webhooks](https://developers.facebook.com/docs/graph-api/webhooks/getting-started/webhooks-for-pages)![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)

- [Meta Business 帮助中心 – 企业系统用户](https://www.facebook.com/business/help/327596604689624)![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)


#### 参考文档

- [公共主页参考文档 ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)](https://developers.facebook.com/docs/graph-api/reference/page)

- [被屏蔽公共主页参考文档](https://developers.facebook.com/docs/graph-api/reference/page/blocked)

- [主页动态参考文档 ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)](https://developers.facebook.com/docs/graph-api/reference/page/feed)

- [公共主页帖子参考文档 ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)](https://developers.facebook.com/docs/graph-api/reference/page-post)

- [公共主页设置](https://developers.facebook.com/docs/graph-api/reference/page/settings)![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)

- [公共主页近期更改参考文档](https://developers.facebook.com/docs/graph-api/reference/page-upcoming-change)![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)

- [权限参考文档 ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)](https://developers.facebook.com/docs/permissions)

- [用户账户参考文档 ![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.2365-6/310307727_3347317042262105_1088877051262827250_n.png?_nc_cat=107&ccb=1-7&_nc_sid=e280be&_nc_ohc=6-EiTikHxt4Q7kNvwGG5qrU&_nc_oc=AdoXIwPpNb-ixRU8juRjdeiY0bdT502zCiY1IpyuqWrHPdMS2ZbAP2qRI9VkkyF9WxU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=CsUUq2Vuyxqr1p7Uei9k7Q&_nc_ss=7b289&oh=00_Af7TCamXLXEZ4aDGdzmittPdpNEVNo4VC98yBbH8E1z36w&oe=6A255AA2)](https://developers.facebook.com/docs/graph-api/reference/user/accounts)


``

``