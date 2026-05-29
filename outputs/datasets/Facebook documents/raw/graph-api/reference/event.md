---
url: https://developers.facebook.com/docs/graph-api/reference/event
title: Event - Graph API Reference
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fevent%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Graph API](https://developers.facebook.com/docs/graph-api)

- [Overview](https://developers.facebook.com/docs/graph-api/overview)
- [Get Started](https://developers.facebook.com/docs/graph-api/get-started)
- [Batch Requests](https://developers.facebook.com/docs/graph-api/batch-requests)
- [Debug Requests](https://developers.facebook.com/docs/graph-api/guides/debugging)
- [Handle Errors](https://developers.facebook.com/docs/graph-api/guides/error-handling)
- [Field Expansion](https://developers.facebook.com/docs/graph-api/guides/field-expansion)
- [Secure Requests](https://developers.facebook.com/docs/graph-api/guides/secure-requests)
- [Changelog](https://developers.facebook.com/docs/graph-api/changelog)
- [Reference](https://developers.facebook.com/docs/graph-api/reference)

On This Page

[Event](https://developers.facebook.com/docs/graph-api/reference/event#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/event#Reading)

[Requirements](https://developers.facebook.com/docs/graph-api/reference/event#requirements)

[Example](https://developers.facebook.com/docs/graph-api/reference/event#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/event#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/event#fields)

[Edges](https://developers.facebook.com/docs/graph-api/reference/event#edges)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/event#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/event#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/event#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/event#Deleting)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/event#)

# Event

Represents an [Event](https://www.facebook.com/help/572885262883136/).

### Limitations

Access to Events on [Users](https://developers.facebook.com/docs/graph-api/reference/user) and [Pages](https://developers.facebook.com/docs/graph-api/reference/page) is only available to Facebook Marketing Partners.

## Reading

Get fields and edges on an Event.

### Requirements

For Events on an [App](https://developers.facebook.com/docs/graph-api/reference/application):

- An App access token of an App that created the Event.

For Events on a [Group](https://developers.facebook.com/docs/graph-api/reference/group):

- A User access token of an Admin of the Event.
- The [Groups API](https://developers.facebook.com/docs/apps/review/feature#reference-GROUPS_ACCESS) feature.

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bevent-id%7D&version=v25.0)

```
GET /v25.0/{event-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{event-id}',
    '{access-token}'
  );
} catch(Facebook\Exceptions\FacebookResponseException $e) {
  echo 'Graph returned an error: ' . $e->getMessage();
  exit;
} catch(Facebook\Exceptions\FacebookSDKException $e) {
  echo 'Facebook SDK returned an error: ' . $e->getMessage();
  exit;
}
$graphNode = $response->getGraphNode();
/* handle the result */
```

```
/* make the API call */
FB.api(
    "/{event-id}",
    function (response) {
      if (response && !response.error) {
        /* handle the result */
      }
    }
);
```

```
/* make the API call */
new GraphRequest(
    AccessToken.getCurrentAccessToken(),
    "/{event-id}",
    null,
    HttpMethod.GET,
    new GraphRequest.Callback() {
        public void onCompleted(GraphResponse response) {
            /* handle the result */
        }
    }
).executeAsync();
```

```
/* make the API call */
FBSDKGraphRequest *request = [[FBSDKGraphRequest alloc]\
                               initWithGraphPath:@"/{event-id}"\
                                      parameters:params\
                                      HTTPMethod:@"GET"];
[request startWithCompletionHandler:^(FBSDKGraphRequestConnection *connection,\
                                      id result,\
                                      NSError *error) {\
    // Handle the result\
}];
```

If you want to learn how to use the Graph API, read our [Using Graph API guide](https://developers.facebook.com/docs/graph-api/using-graph-api/).

### Parameters

This endpoint doesn't have any parameters.

### Fields

| Field | Description |
| --- | --- |
| `id`<br>numeric string | The event ID |
| `attending_count`<br>int32 | Number of people attending the event |
| `can_guests_invite`<br>bool | Can guests invite friends. Requires an access token of an Admin of the Event |
| `category`<br>enum {CLASSIC\_LITERATURE, COMEDY, CRAFTS, DANCE, DRINKS, FITNESS\_AND\_WORKOUTS, FOODS, GAMES, GARDENING, HEALTH\_AND\_MEDICAL, HEALTHY\_LIVING\_AND\_SELF\_CARE, HOME\_AND\_GARDEN, MUSIC\_AND\_AUDIO, PARTIES, PROFESSIONAL\_NETWORKING, RELIGIONS, SHOPPING\_EVENT, SOCIAL\_ISSUES, SPORTS, THEATER, TV\_AND\_MOVIES, VISUAL\_ARTS} | The category of the event |
| `cover`<br>[CoverPhoto](https://developers.facebook.com/docs/graph-api/reference/cover-photo/) | Cover picture |
| `created_time`<br>datetime | created\_time |
| `declined_count`<br>int32 | Number of people who declined the event |
| `description`<br>string | Long-form description<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `discount_code_enabled`<br>bool | Is discount code enabled for this event |
| `end_time`<br>string | End time, if one has been set<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `event_times`<br>list<ChildEvent> | Array of times of a multi-instance event<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `guest_list_enabled`<br>bool | Can see guest list. Requires an access token of an Admin of the Event |
| `interested_count`<br>int32 | Number of people interested in the event |
| `is_canceled`<br>bool | Whether or not the event has been marked as canceled |
| `is_draft`<br>bool | Whether the event is in draft mode or published. Requires an access token of an Admin of the Event |
| `is_online`<br>bool | Whether the event is online or not. Required to pass the 'address' (city name) parameter for online events. |
| `is_page_owned`<br>bool | Whether the event is created by page or not |
| `maybe_count`<br>int32 | Number of people who maybe going to the event |
| `name`<br>string | Event name<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `noreply_count`<br>int32 | Number of people who did not reply to the event |
| `online_event_format`<br>enum {messenger\_room, third\_party, fb\_live, horizon\_event, other, none} | Type of online event - Live, Link or Other |
| `online_event_third_party_url`<br>string | Third party streaming url associated with Link events |
| `owner` | The profile that created the event |
| `place`<br>[Place](https://developers.facebook.com/docs/graph-api/reference/place/) | Event Place information<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `scheduled_publish_time`<br>string | Time when event is scheduled to be published |
| `start_time`<br>string | Start time<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `ticket_uri`<br>string | The link users can visit to buy a ticket to this event |
| `ticket_uri_start_sales_time`<br>string | Time when tickets go on sale |
| `ticketing_privacy_uri`<br>string | URI to seller's privacy policy for ticket purchases |
| `ticketing_terms_uri`<br>string | URI to seller's terms of service for ticket purchases |
| `timezone`<br>enum | Timezone |
| `type`<br>enum {private, public, group, community, friends, work\_company, messenger\_community} | The type of the event |
| `updated_time`<br>datetime | Last update time (ISO 8601 formatted) |

### Edges

| Edge | Description |
| --- | --- |
| [`roles`](https://developers.facebook.com/docs/graph-api/reference/event/roles/)<br>Edge<Profile> | List of profiles having roles on the event. Requires an access token of an Admin of the Event |
| [`ticket_tiers`](https://developers.facebook.com/docs/graph-api/reference/event/ticket_tiers/)<br>Edge<EventTicketTier> | List of ticket tiers. Requires an access token of an Admin of the Event |

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 104 | Incorrect signature |

## Creating

You can't perform this operation on this endpoint.

## Updating

You can't perform this operation on this endpoint.

## Deleting

You can't perform this operation on this endpoint.

On This Page

[Event](https://developers.facebook.com/docs/graph-api/reference/event#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/event#Reading)

[Requirements](https://developers.facebook.com/docs/graph-api/reference/event#requirements)

[Example](https://developers.facebook.com/docs/graph-api/reference/event#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/event#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/event#fields)

[Edges](https://developers.facebook.com/docs/graph-api/reference/event#edges)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/event#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/event#Creating)

[Updating](https://developers.facebook.com/docs/graph-api/reference/event#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/event#Deleting)