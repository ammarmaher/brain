---
url: https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu
title: Persistent Menu - Instagram Messaging
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fmessenger-platform%2Finstagram%2Ffeatures%2Fpersistent-menu%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Instagram Messaging](https://developers.facebook.com/docs/instagram-messaging)

- [Overview](https://developers.facebook.com/docs/instagram-messaging/overview)
- [Get Started](https://developers.facebook.com/docs/instagram-messaging/get-started)
- [Instagram Messaging Webhooks](https://developers.facebook.com/docs/instagram-messaging/webhooks)
- [Generic Template](https://developers.facebook.com/docs/instagram-messaging/generic-template)
- [Button Template](https://developers.facebook.com/docs/instagram-messaging/button-template)
- [Conversation Routing](https://developers.facebook.com/docs/messenger-platform/instagram/features/conversation-routing)
- [Human Agent Escalation](https://developers.facebook.com/docs/messenger-platform/instagram/features/human-agent-escalation)
- [Ice Breakers](https://developers.facebook.com/docs/messenger-platform/instagram/features/ice-breakers)
- [ig.me links](https://developers.facebook.com/docs/messenger-platform/instagram/features/ig-me-links)
- [Send a Message](https://developers.facebook.com/docs/messenger-platform/instagram/features/send-message)
- [Sender Actions](https://developers.facebook.com/docs/messenger-platform/instagram/features/sender-actions)
- [Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu)
- [Private Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/private-replies)
- [Product Template](https://developers.facebook.com/docs/messenger-platform/instagram/features/product-template)
- [Quick Replies](https://developers.facebook.com/docs/messenger-platform/instagram/features/quick-replies)
- [Story Mention](https://developers.facebook.com/docs/messenger-platform/instagram/features/story-mention)
- [Attachment Upload API](https://developers.facebook.com/docs/messenger-platform/instagram/features/attachment-upload)
- [User Profile API](https://developers.facebook.com/docs/messenger-platform/instagram/features/user-profile)
- [Moderate Conversations API](https://developers.facebook.com/docs/messenger-platform/instagram/features/moderate-conversations)
- [Sample Experience](https://developers.facebook.com/docs/messenger-platform/instagram/sample-experience)
- [App Review](https://developers.facebook.com/docs/messenger-platform/instagram/app-review)

On This Page

[The Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#the-persistent-menu)

[Requirements](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#requirements)

[Supported Buttons](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#supported_buttons)

[Setting the Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#set_menu)

[Localization](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#localization)

[Request Examples](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#request-examples)

[GET](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#get)

[DELETE](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#delete)

[Best Practices](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#best_practices)

# The Persistent Menu

This documents shows you how to programmatically add the Persistent Menu to your Instagram messaging experience.

|     |     |
| --- | --- |
| ## How It Works<br>The Persistent Menu allows you to create and send a menu of the main features of your business, such as hours of operation, store locations, and products, is always visible in a person's Messenger conversation with your business.<br>When a person clicks an item in the menu, a `postback` webhook notification is sent to your server, with information about what item was select and by whom, and the standard messaging window opens. You have 24 hours to respond to the person after the CTA. | ![](https://lookaside.fbsbx.com/elementpath/media/?media_id=507543547396763&version=1773084167) |

## Limitations

- A menu is not updated in real time

  - Existing conversations will not see an updated menu unless a person refreshes their inbox; new conversations will see updated menus. Be sure your app can handle deprecated menu items.
- The `composer_input_disabled` parameter is not available
- The `webview_height_ratio` parameter is not available
- You can not customize a menu based on the recipient's Page-scoped ID (PSID)

## Requirements

For the persistent menu to appear, the following criteria must be satisfied:

- You are running Messenger API support for Instagram v226 or above on iOS or Android.
- You have set up your Instagram professional account, Page, Developer account, and app to [successfully call Messenger API support for Instagram](https://developers.facebook.com/docs/messenger-platform/instagram/get-started).

## Supported Buttons

The persistent menu is composed of an array of [buttons](https://developers.facebook.com/docs/messenger-platform/send-messages/buttons). The following button types are supported in the persistent menu:

- `web_url`: Specifies the item is a [URL button](https://developers.facebook.com/docs/messenger-platform/send-api-reference/url-button).
- `postback`: Specifies the item is a [postback button](https://developers.facebook.com/docs/messenger-platform/send-api-reference/postback-button).

## Setting the Persistent Menu

To set the persistent menu, send a `POST` request to the [Messenger Profile API](https://developers.facebook.com/docs/messenger-platform/reference/messenger-profile-api) to set the `persistent_menu` property.

**Note:** To view recent changes to the persistent menu within the Instagram app, go to the messages inbox and swipe down to refresh.

```curl
curl -X POST -H "Content-Type: application/json" -d
'{
    "persistent_menu": [\
        {\
            "locale": "default",\
            "call_to_actions": [\
                {\
                    "type": "postback",\
                    "title": "Talk to an agent",\
                    "payload": "CARE_HELP"\
                },\
                {access_token=<ACCESS_TOKEN>\
                    "type": "postback",\
                    "title": "Outfit suggestions",\
                    "payload": "CURATION"\
                },\
                {\
                    "type": "web_url",\
                    "title": "Shop now",\
                    "url": "https://www.originalcoastclothing.com/"\
\
                }\
            ]\
        }\
    ]
}' "https://graph.facebook.com/v25.0/me/messenger_profile?platform=instagram&access_token=<ACCESS_TOKEN>"
```

## Localization

You may provide default and localized button text for the persistent menu that will be displayed based on a person's locale.

To do this, specify separate objects in the `persistent_menu` array for each locale by setting the `locale` property to a [supported locale](https://developers.facebook.com/docs/messenger-platform/messenger-profile/supported-locales):

```regex
{
  "locale":"default",
  "call_to_actions":[...]
},
{
  "locale: "zh_CN",
  "call_to_actions":[...]
}
```

## Request Examples

### GET

```code
curl -X GET "https://graph.facebook.com/v12.0/me/messenger_profile?fields=persistent_menu&platform=instagram"
```

Result

```code
{
    "data": [\
      {\
        "persistent_menu": [\
            {\
              "locale": "default",\
              "call_to_actions": [\
                  {\
                      "type": "postback",\
                      "title": "Talk to an agent",\
                      "payload": "CARE_HELP"\
                  },\
                  {\
                      "type": "postback",\
                      "title": "Outfit suggestions",\
                      "payload": "CURATION"\
                  },\
                  {\
                      "type": "web_url",\
                      "title": "Shop now",\
                      "url": "https://www.originalcoastclothing.com/"\
\
                  }\
              ]\
            }\
        ]\
      }\
  ]
}
```

### DELETE

```code
curl -X DELETE "https://graph.facebook.com/v12.0/me/messenger_profile?fields=["persistent_menu"]&platform=instagram"
```

## Best Practices

Just like with buttons, menu items can produce a webview or postback.

Use the menu as entry points for your Page's main features.

Be descriptive: your menu lets people know what your Page's features are. It instantly lets users know how they can interact with your Page.

Be selective: limit menu items to 5 for best user experience.

Don't expect the menu to contain user-specific data. The menu can be localized, but will not contain user-specific data.

Don't put a "Menu" button in the menu that sends the user a message containing a menu. Just put that content directly in the menu — that's what it's for!

Don't put generic actions like "Restart" in the menu.

Don't use prime menu real estate for secondary, "colophon" style info like _about_, _terms of service_, _privacy policy_, or _powered by_. These take focus away from accentuating the core features of your Page.

### Developer Support

- Use the [Meta Status tool](https://l.facebook.com/l.php?u=https%3A%2F%2Fmetastatus.com%2F&h=AUDAO2ju_x1JKDe9DYXObwyt-tok0V14dpULpp8AQQuMAaUcPtgCuefS111IAYFIlHYzK0rr5mbiGzeyKr29JB4NOJuY_XNRiPVhYv7hGAHSLNWZlEHhxFQiSSSQezwMqwoeezNsHYoIRw) to check for the status and outages of Meta business products.
- Use the [Meta Developer Support tool](https://developers.facebook.com/support) to report bugs and view reported bugs, get help with Ads or Business Manager, and more.

On This Page

[The Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#the-persistent-menu)

[Requirements](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#requirements)

[Supported Buttons](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#supported_buttons)

[Setting the Persistent Menu](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#set_menu)

[Localization](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#localization)

[Request Examples](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#request-examples)

[GET](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#get)

[DELETE](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#delete)

[Best Practices](https://developers.facebook.com/docs/messenger-platform/instagram/features/persistent-menu#best_practices)