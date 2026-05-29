---
url: https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary
title: Data dictionary - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fappendix%2Fdata-dictionary%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Content Library and API](https://developers.facebook.com/docs/content-library-and-api)

- [Get access](https://developers.facebook.com/docs/content-library-and-api/get-access)
- [Quick links](https://developers.facebook.com/docs/content-library-and-api/quick-links)
- [Content Library](https://developers.facebook.com/docs/content-library-and-api/content-library)
- [Content Library API](https://developers.facebook.com/docs/content-library-and-api/content-library-api)
- [Appendix](https://developers.facebook.com/docs/content-library-and-api/appendix)


  - [Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary)
  - [Field expansion](https://developers.facebook.com/docs/content-library-and-api/appendix/field-expansion)
  - [Search quality](https://developers.facebook.com/docs/content-library-and-api/appendix/search-quality)
  - [Get API Code](https://developers.facebook.com/docs/content-library-and-api/appendix/get-api-code)
  - [Share producer list](https://developers.facebook.com/docs/content-library-and-api/appendix/share-producer-list)
  - [Share API search ID](https://developers.facebook.com/docs/content-library-and-api/appendix/api-search-id)

- [Support](https://developers.facebook.com/docs/content-library-and-api/support)
- [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers)
- [Citations](https://developers.facebook.com/docs/content-library-and-api/citations)
- [Changelog](https://developers.facebook.com/docs/content-library-and-api/changelog)

On This Page

[Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#data-dictionary)

[Scope of data included in Meta Content Library and API](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data)

[Facebook](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook)

[Facebook Marketplace](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook-marketplace)

[Facebook fundraisers](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook-fundraisers)

[Facebook channels](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook-channels)

[Instagram](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#instagram)

[Instagram fundraisers](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#instagram-fundraisers)

[Instagram channels](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#instagram-channels)

[Threads](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#threads)

[WhatsApp channels](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#whatsapp-channels)

[Facebook](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook-2)

[Instagram](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#instagram-2)

[Threads](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#threads-2)

[WhatsApp](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#whatsapp)

[Share search collections](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-coll-shared-search)

[Share producer lists](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-lists-producers)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#learn-more)

# Data dictionary

This data dictionary describes the data names displayed in the Meta Content Library web UI (the Name column) if
applicable, and the corresponding API fields returned in Meta Content Library API search responses (the API
field column). In the API field column, some fields have nested fields indicated by a dot notation. These are referred to as _expanded fields_. See [Field expansion](https://developers.facebook.com/docs/content-library-api/field-expansion) for information about how to include some or all of a parent field's expanded fields in your queries.

## Scope of data included in Meta Content Library and API

### Facebook

#### Public content dataset

Posts to the following:

- Pages, groups and events
- Profiles with 100 or more followers
- Profiles that are [verified](https://www.facebook.com/help/196050490547892)

Meta Content Library surfaces posts by original producers only (excludes collaborators).

#### Downloadable subset

Posts to the above surfaces from the following:

- Pages with 15,000 or more likes or followers
- Profiles with 100 or more followers
- Profiles that are [verified](https://www.facebook.com/help/196050490547892)

**Note**: Downloads are only available if the Inter-university Consortium for Political and Social Research (ICPSR) or Secure Data Access Center (CASD)has approved your Meta Content Library application and you have consented to the [Meta Research Tools Terms and Conditions](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.fb.com%2Fresearchtools%2Fproduct-terms-meta-research&h=AUAlJboYgKqLzT_E1mGP7QNU3Q7pM96TJAVQ6_O6u66hHgKQNAwcMNowp-B3YF6mCis0v8Grz98laPS3KGm4mKRLS9nKpQ8XSKBzSwOhBYnXndghV1-zKzxQ3NdLkQZ5YJ5jWT7calNQ_g).

### Facebook Marketplace

#### Public content dataset

Public listings on Facebook Marketplace from Pages or profiles, excluding the following:

- Listings marked as sold more than 1 month ago.
- Listings that have not been updated in the last 6 months.
- Listings with a privacy setting enabled, such as hiding a listing from friends.
- Job listings in some locations. See [About jobs on Facebook](https://www.facebook.com/help/2203257093390031) for more information.

### Facebook fundraisers

#### Public content dataset

- Public fundraisers on Facebook
- Fundraisers attached to public posts
- Reshares of public fundraisers (available in the posts data subset)

### Facebook channels

#### Public content dataset:

- Active channels with audience set to “anyone” or “followers” as long as the creator of the channel meets the criteria for inclusion in the Facebook public content dataset.
- All channel messages within public channels.

### Instagram

#### Public content dataset

Posts from the following:

- Business and creator accounts
- Personal accounts with 100 or more followers
- Personal accounts that are [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F733907830039577%3Fhelpref%3Dfaq_content&h=AUCO05eWjdCADhCkqNvlJsn8vnKPndBJSNEenRC5oRuh94d-WsN78z7c7vrP9hAsZPht79VBUqE1gem8SZ-jULpHiViYM1OoVlt9af1qBI5LmXd3r3SjKSwNlE0G7jMzPTEkiPAN38kWHw)

#### Downloadable subset

Posts from the following:

- Business and creator accounts with 100 or more followers
- Personal accounts with 100 or more followers
- Business, creator and personal accounts that are [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F733907830039577%3Fhelpref%3Dfaq_content&h=AUCvkvmZCDepc_C6l7CfWM3TLsBD6B0PYtupJXJlvRzLyF1P5akva9IZzVbWzb_YpV8eHCLfD_IVAXAYubq6_aegGNXXknQPh0Ix89W4IUSP19T-jnkoIgX6WCaGwJy05Ser2f3N5QHRuQ)

Meta Content Library surfaces posts by original producers only (excludes collaborators).

**Note**: Downloads are only available if the Inter-university Consortium for Political and Social Research (ICPSR) or Secure Data Access Center (CASD)has approved your Meta Content Library application and you have consented to the [Meta Research Tools Terms and Conditions](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.fb.com%2Fresearchtools%2Fproduct-terms-meta-research&h=AUAJpdU6bkTJDNcedN06j24QTtPITHZ0Acqdm_7VI3ofWqrRiUnJ51N3w6ZBcvBMmIaagPqZstb_DiUh_WrratVfoN5mGO_aJT4RrkblGj0y4xrBffOKc05RQPfyeuJUoKb1Yr9cbgRD_w).

### Instagram fundraisers

#### Public content dataset:

- Fundraisers created by public Instagram accounts

- Reshares of fundraisers (available in the posts data subset)


### Instagram channels

#### Public content dataset:

- Active channels with audience set to “anyone” or “followers” as long as the creator of the channel meets the criteria for inclusion in the Instagram public content dataset.

- All channel messages within public channels.


### Threads

#### Public content dataset:

- Posts shared by public profiles with 100 or more followers

**Note**: Threads content is not available for download while this dataset is in development as data quality may have significant variation.

### WhatsApp channels

- Active channels that have either a verified badge or 100 or more followers.
- All channel updates from the last 30 days within eligible channels.

## Facebook

- [Page](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-page)
- [Group](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-group)
- [Event](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-event)
- [Profile](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-profile)
- [Post](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-post)
- [Post multimedia content](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-post-3pcleanroom)
- [Marketplace](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-market)
- [Marketplace multimedia content](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-market-3pcleanroom)
- [Fundraiser](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-fundraiser)
- [Channel](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-channel)
- [Channel message](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-channel-message)
- [Channel message multimedia content](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-channel-message-mm-content)
- [Donation](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-donation)
- [Comment](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-fb-comment)
- [Comment multimedia content](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary##dd-fb-comment-3pcleanroom)

**Facebook Page**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a Facebook Page; cannot be used to search on Meta technologies. | Content Library API |
| Name | name | The name of the Facebook Page. | Content Library<br>Content Library API |
| Username | username | The username of the Facebook Page, if available. | Content Library API |
| About | about | The short paragraph from the Facebook Page About section. | Content Library<br>Content Library API |
| Website | website | The external URL from the Facebook Page About section. | Content Library API |
| Description | description | The long paragraph from the Facebook Page About section. | Content Library<br>Content Library API |
| Verification status | verification\_status | The verification status of the Facebook Page. [Learn more about verified Pages and profiles.](https://www.facebook.com/help/196050490547892) | Content Library<br>Content Library API |
| Page categories | page\_categories | The list of up to three categories of the Facebook Page, selected by the Page<br>manager. | Content Library<br>Content Library API |
| Location city | location.city | The self-reported, publicly accessible city location associated with the Facebook<br>Page. | Content Library API |
| Location country | location.country | The self-reported, publicly accessible country location associated with the Facebook<br>Page. | Content Library API |
| Location country code | location.country\_code | The self-reported, publicly accessible country code location associated with the Facebook<br>Page. | Content Library API |
| Location name | location.name | The self-reported, publicly accessible location name associated with the Facebook<br>Page. | Content Library API |
| Location region | location.region | The self-reported, publicly accessible region location associated with the Facebook<br>Page. | Content Library API |
| Location zip | location.zip | The self-reported, publicly accessible location zip associated with the Facebook<br>Page. | Content Library API |
| Location street | location.street | The self-reported, publicly accessible street location associated with the Facebook<br>Page. | Content Library API |
| Location state | location.state | The self-reported, publicly accessible state location associated with the Facebook<br>Page. | Content Library API |
| Page name change date | page\_transparency.page\_name\_changes.data.date | The date of Facebook Page name change. | Content Library API |
| Page name old | page\_transparency.page\_name\_changes.data.old\_name | The old name of the Facebook Page prior to the name change. | Content Library API |
| Page name new | page\_transparency.page\_name\_changes.data.new\_name | The new name of the Facebook Page, following the name change. | Content Library API |
| Page merged date | page\_transparency.page\_merges.data.date | The date another Facebook Page merged with this Page. | Content Library API |
| Page merged | page\_transparency.page\_merges.data.page\_merged | The name of the Facebook Page that merged with this Page. | Content Library API |
| Creation date | creation\_date | The date the Facebook Page was created. | Content Library<br>Content Library API |
| Page manager countries | page\_transparency.admin\_countries.data.country | The predicted primary country locations of people who manage this Facebook<br>Page. See [What location information does Meta receive?](https://www.facebook.com/privacy/dialog/what-location-information-does-meta-receive) for more information. | Content Library<br>Content Library API |
| Count of Page managers by countries | page\_transparency.admin\_countries.data.count | The number of people who manage this Facebook Page predicted to be from the associated<br>country. | Content Library<br>Content Library API |
| Page owner | page\_transparency.confirmed\_page\_owner | The confirmed owner associated with the Facebook Page. | Content Library API |
| Has active ads | page\_transparency.has\_active\_ads | Whether the Facebook Page has active ads or not. | Content Library API |
| Has run political ads | page\_transparency.has\_run\_political\_ads | Whether the Facebook Page has run political ads or not. | Content Library API |
| Followers | follower\_count | The number of followers of the Facebook Page. | Content Library<br>Content Library API |
| Page likes | like\_count | The number of likes of the Facebook Page. | Content Library API |

**Facebook group**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a Facebook group; cannot be used to search on Meta technologies. | Content Library API |
| Name | name | The name of the Facebook group. | Content Library<br>Content Library API |
| Username | username | The username (group name identifier) of the Facebook group, if available. | Content Library API |
| Description | description | The description of the Facebook group. | Content Library<br>Content Library API |
| Creation date | creation\_date | The date the Facebook group was created. | Content Library<br>Content Library API |
| Group original name | group\_transparency.original\_name | The original name of the Facebook group. | Content Library API |
| Group name change date | group\_transparency.name\_changes.data.date | The date the name of the Facebook group changed. | Content Library<br>Content Library API |
| Group name new | group\_transparency.name\_changes.data.new\_name | The new name of the Facebook group. | Content Library API |
| Group admin and moderator Page Meta Content Library IDs | group\_transparency.admin\_and\_moderator\_page\_ids | The list of Unique IDs linked to the Facebook Pages that are admins or moderators of the Facebook group. These unique IDs cannot be used to search on Meta technologies. | Content Library API |
| Group owner type | group\_owners.data.type | The type of the group owner associated with the Facebook group.This field will display if<br>the group owner is a professional profile or Page. | Content Library API |
| Group owner Meta Content Library ID | group\_owners.data.id | Unique ID of the Facebook group owners. This field will display if the group owner<br>is a professional profile or Page. | Content Library API |
| Picture URL | picture\_url | The photo URL of the Facebook group. | Content Library API |
| Group members | member\_count | The number of members of the Facebook group. | Content Library<br>Content Library API |

**Facebook event**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a Facebook event; cannot be used to search on Meta technologies. | Content Library API |
| Name | name | The name of the Facebook event. | Content Library<br>Content Library API |
| Description | description | The description of the Facebook event. | Content Library<br>Content Library API |
| Creation time | creation\_time | The time the Facebook event was created. | Content Library API |
| Event start time | event\_start\_time | The start time of the Facebook event. Not available if the event is the parent of recurring event instances. [Learn more about recurring events](https://developers.facebook.com/docs/content-library-api/guide-fb-events#recurring). | Content Library<br>Content Library API |
| Event end time | event\_end\_time | The end time of the Facebook event. Not available if the event is the parent of recurring event instances. [Learn more about recurring events](https://developers.facebook.com/docs/content-library-api/guide-fb-events#recurring). | Content Library API |
| Going responses | going\_count | The number of Going responses on a Facebook event. Not available if the event is the parent of recurring event instances. [Learn more about recurring events](https://developers.facebook.com/docs/content-library-api/guide-fb-events#recurring). | Content Library<br>Content Library API |
| Interested responses | interested\_count | The number of Interested responses on a Facebook event. Not available if the event is the parent of recurring event instances. [Learn more about recurring events](https://developers.facebook.com/docs/content-library-api/guide-fb-events#recurring). | Content Library<br>Content Library API |
| Event type | event\_type | The type of Facebook event. Event types include single instance, recurring or instance of<br>recurring. | Content Library API |
| Recurring event Meta Content Library IDs | recurring\_event\_ids | The list of unique Meta Content Library IDs of the recurring instances of the Facebook event, if the event is recurring; these unique IDs cannot be used to search on Meta technologies. Only available if the event is the parent of recurring event instances. [Learn more about recurring events](https://developers.facebook.com/docs/content-library-api/guide-fb-events#recurring). | Content Library API |
| Parent event ID | parent\_event\_id | The unique ID of the parent event of the Facebook event, if the event is recurring; cannot be used to search on Meta technologies. Only available if the event is an instance of a recurring event. [Learn more about recurring events](https://developers.facebook.com/docs/content-library-api/guide-fb-events#recurring). | Content Library API |
| Event owners type | event\_owners.data.type | The type of the event owner associated with the Facebook event. | Content Library API |
| Event owners Meta Content Library ID | event\_owners.data.id | The unique ID of the event owner associated with the Facebook event; cannot be used to search on Meta technologies. This field will display if the event owner is a group, professional profile or Page. For events owned by professional profiles or Pages, only the Meta Content Library Page ID will be shared. | Content Library API |
| Place name | place.name | The self-reported, publicly accessible name of the place where the Facebook event is<br>located. | Content Library API |
| Place location city | place.location.city | The self-reported, publicly accessible city where the Facebook event is<br>located. | Content Library API |
| Place location country | place.location.country | The self-reported, publicly accessible country where the Facebook event is<br>located. | Content Library API |
| Place location country code | place.location.country\_code | The self-reported, publicly accessible country code of the Facebook event’s<br>location. | Content Library API |
| Place location name | place.location.name | The self-reported, publicly accessible name of the Facebook event’s<br>location. | Content Library API |
| Place location region | place.location.region | The self-reported, publicly accessible region where the Facebook event is<br>located. | Content Library API |
| Place location state | place.location.state | The self-reported, publicly accessible state where the Facebook event is<br>located. | Content Library API |
| Place location street | place.location.street | The self-reported, publicly accessible street where the Facebook event is<br>located. | Content Library API |
| Place location zip | place.location.zip | The self-reported, publicly accessible zip of the Facebook event’s<br>location. | Content Library API |

**Facebook profile**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a Facebook profile; cannot be used to search on Meta technologies. | Content Library API |
| Name | name | The name of the Facebook profile, if the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Username | username | The username of the Facebook profile, if available and profile meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library API |
| About | about | Text of the 'About' section. | Content Library<br>Content Library API |
| Follower count | follower\_count | The number of followers of the Facebook profile. | Content Library<br>Content Library API |
| Intro | intro | Text of intro. | Content Library<br>Content Library API |
| Verification status | verification\_status | Verification status. Possible values: not\_verified and blue\_verified. | Content Library<br>Content Library API |
| Creation date | creation\_date | The date the Facebook profile was created. | Content Library<br>Content Library API |
| Profile categories | profile\_categories | The list of up to three categories of the Facebook profile, selected by the profile owner. | Content Library<br>Content Library API |
| Admin countries | profile\_transparency.admin\_countries | List of predicted primary country locations of the Facebook profile owner. See [What location information does Meta receive?](https://www.facebook.com/privacy/dialog/what-location-information-does-meta-receive) for more information. | Content Library<br>Content Library API |
| Has active ads | profile\_transparency.has\_active\_ads | Whether the Facebook profile has active ads or not. | Content Library<br>Content Library API |
| Picture height | picture.height | Height of the photo URL of the Facebook profile. | Content Library<br>Content Library API |
| Picture URL | picture.url | The photo URL of the Facebook profile. | Content Library<br>Content Library API |
| Picture width | picture.width | Width of the photo URL of the Facebook profile. | Content Library<br>Content Library API |
| Websites | websites | The external URLs from the Facebook profile’s 'About' section. | Content Library<br>Content Library API |

**Facebook post**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a Facebook post; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Text | text | The text of the Facebook post. Tags are excluded. Not applicable to stories. | Content Library<br>Content Library API |
| Match type | match\_type | List of match types for text searches in text, images and stories. Match types include:<br>- `post_text` for posts that match based on text in text-only posts<br>- `image_text` for posts that match based on text-in-image posts<br>- `multimedia_text` for story highlights that match based on text search | Content Library<br>Content Library API |
| Activity type | activities.type | Type of activity represented in a post. Activity types include `streaming` and `playing` (of a gaming video). | Content Library<br>Content Library API |
| Is verified | is\_verified | Whether the post was made from a Facebook surface that is verified (only Pages and profiles can be verified). | Content Library<br>Content Library API |
| Activity name | activities.name | Name of the activity represented in a post. For example, if the activity type is `streaming` or `playing` (of a gaming video), this would be the name of the game being played. | Content Library<br>Content Library API |
| Creation time | creation\_time | The time the Facebook post was created. | Content Library<br>Content Library API |
| Modified time | modified\_time | The time the Facebook post was most recently modified. | Content Library API |
| Language | lang | The content language of the Facebook post. Returns ISO 639-1 language code in 2-letter<br>lowercase format. | Content Library (Filter only)<br>Content Library API |
| Likes | statistics.like\_count | The number of like reactions on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Love reactions | statistics.love\_count | The number of love reactions on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Wow reactions | statistics.wow\_count | The number of wow reactions on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Haha reactions | statistics.haha\_count | The number of haha reactions on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Sad reactions | statistics.sad\_count | The number of sad reactions on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Angry reactions | statistics.angry\_count | The number of angry reactions on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Comments | statistics.comment\_count | The number of comments on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Reactions | statistics.reaction\_count | The total number of reactions on the post. Reactions include: Like, Love, Care, Haha,<br>Wow, Sad or Angry. Not applicable to stories. | Content Library<br>Content Library API |
| Shares | statistics.share\_count | The number of times the post was shared. Not applicable to stories. | Content Library<br>Content Library API |
| Care reactions | statistics.care\_count | The number of care reactions on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Views | statistics.views | Number of times the post was on screen, not including times it appeared on the post owner’s screen. For video posts, views are counted whether the video was played or not.<br>Only posts with more than 100 views display the view count. A post displays no view count value if there were fewer than 100 views as of the last refresh.<br>View counts for posts created within the last 180 days are refreshed approximately every 24 hours, provided the post has accumulated more than 10 views within that 24 hour period. If not, view counts are refreshed every 5-7 days. View counts for posts created more than 180 days ago are refreshed every 5-7 days.<br>View counts are not available for posts created before January 1, 2017.<br>Views of content may register differently on Instagram and Facebook:<br>- On Facebook, a content view is logged when content is either fully visible or covers at least 50% of the screen height for 250ms.<br>- On Instagram, the content needs to be at least 50% visible for the same duration to register a content view. | Content Library<br>Content Library API |
| View counts last refreshed date | view\_date\_last\_refreshed | The date the view count was last refreshed. See Views definition for refresh schedule. | Content Library<br>Content Library API |
| Post owner type | post\_owner.data.type | The type of post owner associated with the Facebook post. Post owner types include:<br>Pages and profiles. | Content Library<br>Content Library API |
| Post owner Meta Content Library ID | post\_owner.data.id | Unique ID linked to the owner associated with the Facebook post. These unique IDs cannot be used to search on Meta technologies. | Content Library API |
| Post owner name | post\_owner.data.name | The name of the post owner associated with the Facebook post, if post owner meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Post owner username | post\_owner.data.username | The username of the post owner associated with the Facebook post, [if available](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data) and post owner meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library API |
| Post surface type | surface.type | The type of surface of the Facebook post. Post surface types include: Pages, profiles, groups and events. | Content Library<br>Content Library API |
| Post surface Meta Content Library ID | surface.id | Unique ID linked to the surface of the Facebook post. These unique IDs cannot be used to search on Meta technologies. | Content Library API |
| Post surface name | surface.name | The name of the surface of the Facebook post, if user meets the [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Media type (deprecated as of version 5.0) | media\_type | The media type included in the Facebook Post. Media types include photos, videos, albums, links, status and reshares. | Content Library API |
| Content type | content\_type | The content type included in the Facebook post. Content types include photos, albums, videos (including gaming videos) and reels, stories and miscellaneous (including links, reshares and text-only posts). | Content Library |
| Content type | content\_type | The content type included in the Facebook post. Content types include photos, videos (including gaming videos), albums, stories, links, status and reshares. | Content Library API |
| Branded content Page Meta Content Library ID | branded\_content\_page\_id | Unique ID linked to the Page associated with the Facebook post; cannot be used to search on Meta technologies. Included if the post has<br>branded content. [Learn more about branded content](https://www.facebook.com/business/help/788160621327601?id=1912903575666924) | Content Library API |
| Is branded content | is\_branded\_content | Whether the Facebook post has branded content or not. [Learn more about branded content](https://www.facebook.com/business/help/788160621327601?id=1912903575666924) | Content Library API |
| Link attachment fields description | link\_attachment\_fields.description | The description of the link attachment included in the Facebook post. Not applicable to stories. | Content Library API |
| Link attachment fields link | link\_attachment\_fields.link | The URL of the link attachment included in the Facebook post. Not applicable to stories. | Content Library API |
| Link attachment fields name | link\_attachment\_fields.name | The name of the link attachment included in the Facebook post. Not applicable to stories. | Content Library API |
| Link attachment fields caption | link\_attachment\_fields.caption | The caption of the link attachment included in the Facebook post. Not applicable to stories. | Content Library API |
| Shared post Meta Content Library ID | shared\_post\_id | Unique ID linked to the reshared post included in the Facebook post; cannot be used to search on Meta technologies. | Content Library API |

**Facebook post multimedia content**

The items in the following data dictionary entries are returned by default on Secure Research Environment unless otherwise noted. Third-party cleanroom users can get these items by querying for `”fields”=”multimedia{url}”`.

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Multimedia type | multimedia.type | The type (photo or video) of the multimedia content. | Content Library API |
| Multimedia Meta Content Library ID | multimedia.id | Unique ID linked to the photo or video content. These unique IDs cannot be used to search on Meta technologies. These IDs are not available on Secure Research Environment. | Content Library API |
| Multimedia URL | multimedia.url | URL within a storage location to which the multimedia content has been downloaded by the third-party cleanroom if the cleanroom system is unable to provide the multimedia directly in the search results. This value is returned by default for third-party cleanrooms. It is not returned by default on Secure Research Environment. Pass `multimedia{url}` to the `fields` parameter from Secure Research Environment to get them. | Content Library API |
| Multimedia duration | multimedia.duration | The amount of time the video lasts. Displayed as the entire number to the hundredths decimal place. Returned when multimedia.type=video. | Content Library API |
| Multimedia user tags | multimedia.user\_tags | User-created tags. Markers added by the user to identify specific pieces of information within a larger context. Hashtags are not included as tags. | Content Library API |

**Facebook Marketplace listing**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a Facebook Marketplace listing; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Description | description | The description of the Facebook Marketplace listing. | Content Library<br>Content Library API |
| Creation time | creation\_time | The time the Facebook Marketplace listing was created. | Content Library<br>Content Library API |
| Modified time | modified\_time | The time the Facebook Marketplace listing was most recently modified. | Content Library API |
| Views | statistics.views | The number of times the listing was on screen, not including times it appeared on the seller’s screen. View counts are refreshed every 2-3 days. | Content Library<br>Content Library API |
| View counts last refreshed date | view\_date\_last\_refreshed | The date the view count was last refreshed. See Views definition for the refresh schedule. | Content Library<br>Content Library API |
| Content type | content\_type | The content type included in the Facebook Marketplace listing. Content types include photos (listings with only photos) and videos (listings with photos and videos). | Content Library<br>Content Library API |
| Listing title | listing\_details.title | The title of the Marketplace listing. | Content Library<br>Content Library API |
| Listing location | listing\_details.location | The location where the listing was made. Can include the city if available. | Content Library<br>Content Library API |
| Listing category | listing\_details.category | The Facebook Marketplace listing category. | Content Library<br>Content Library API |
| Listing price amount | listing\_details.price.amount | The price numeric value in the currency specified in `Listing price currency`. | Content Library<br>Content Library API |
| Listing price currency | listing\_details.price.currency | The ISO 4217 currency code of the listing's currency. | Content Library<br>Content Library API |
| Listing availability | listing\_details.availability | The availability of the item in the listing. | Content Library<br>Content Library API |
| Listing condition | listing\_details.condition | The condition of the item in the listing. | Content Library<br>Content Library API |
| Listing vehicle make | listing\_details.vehicle\_info.make | The make of the listed vehicle. | Content Library<br>Content Library API |
| Listing vehicle model | listing\_details.vehicle\_info.model | The model of the listed vehicle. | Content Library<br>Content Library API |
| Listing vehicle type | listing\_details.vehicle\_info.type | The type of the listed vehicle, such as sedan or SUV. | Content Library<br>Content Library API |
| Listing vehicle year | listing\_details.vehicle\_info.year | The year of the listed vehicle. | Content Library<br>Content Library API |
| Listing vehicle fuel type | listing\_details.vehicle\_info.fuel\_type | The type of fuel required by the listed vehicle, such as diesel or gasoline. | Content Library<br>Content Library API |
| Listing vehicle mileage value | listing\_details.vehicle\_info.mileage.value | The mileage of the listed vehicle, in the units specified in `Listing vehicle mileage unit`. | Content Library<br>Content Library API |
| Listing vehicle mileage unit | listing\_details.vehicle\_info.mileage.unit | The units (miles or kilometers) of the mileage specified in `Listing vehicle mileage value`. | Content Library<br>Content Library API |
| Listing property type | listing\_details.property\_info.type | The type of listed property, such as house, apartment or townhouse. | Content Library<br>Content Library API |
| Listing property number of bedrooms | listing\_details.property\_info.bedrooms\_number | The number of bedrooms in the listed property. | Content Library<br>Content Library API |
| Listing property number of bathrooms | listing\_details.property\_info.bathrooms\_number | The number of bathrooms in the listed property. | Content Library<br>Content Library API |

**Facebook Marketplace listing multimedia content**

The items in the following data dictionary entries are returned by default on Secure Research Environment unless otherwise noted. Third-party cleanroom users can get these items by querying for `”fields”=”multimedia{url}”`.

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Multimedia type | multimedia.type | The type (photo or video) of the multimedia content. | Content Library API |
| Multimedia Meta Content Library ID | multimedia.id | Unique ID linked to the photo or video content. These unique IDs cannot be used to search on Meta technologies. These IDs are not available on Secure Research Environment. | Content Library API |
| Multimedia URL | multimedia.url | URL within a storage location to which the multimedia content has been downloaded by the third-party cleanroom if the cleanroom system is unable to provide the multimedia directly in the search results. This value is returned by default for third-party cleanrooms. It is not returned by default on Secure Research Environment. Pass `multimedia{url}` to the `fields` parameter from Secure Research Environment to get them. | Content Library API |
| Multimedia duration | multimedia.duration | The amount of time the video lasts. Displayed as the entire number to the hundredths decimal place. Returned when multimedia.type=video. | Content Library API |
| Multimedia user tags | multimedia.user\_tags | User-created tags. Markers added by the user to identify specific pieces of information within a larger context. Hashtags are not included as tags. | Content Library API |

**Facebook fundraiser**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a fundraiser; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Fundraiser title | title | The title of the fundraiser. | Content Library<br>Content Library API |
| Description | description | The description of the fundraiser. | Content Library<br>Content Library API |
| Creation time | creation\_time | Creation date and time of the fundraiser. | Content Library<br>Content Library API |
| Has fundraiser ended | has\_fundraiser\_ended | Value of true or false based on whether the fundraiser has ended. | Content Library<br>Content Library API |
| End time | end\_time | Planned ending date and time of the fundraiser. Only available for fundraisers that are still in progress. | Content Library<br>Content Library API |
| Fundraiser type | fundraiser\_type | Type of the fundraiser. Types include:<br>- nonprofit\_fundraiser (beneficiary is a nonprofit)<br>- personal\_fundraiser (beneficiary is a person)<br>- fundraiser\_post (fundraiser only exists in a post) | Content Library<br>Content Library API |
| Goal amount | goal\_amount | The goal amount for this fundraiser. Not all fundraisers have a goal. | Content Library<br>Content Library API |
| Amount raised | amount\_raised | The current amount being raised towards this fundraiser. | Content Library<br>Content Library API |
| Currency | currency | The ISO 4217 currency code of the original currency of the fundraiser. | Content Library<br>Content Library API |
| Owner Meta Content Library ID | owner.id | Unique ID linked to a producer; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Owner type | owner.type | Type of fundraiser producer. Types include profile (public profile), Page and private (private profile). | Content Library API |
| Owner name | owner.name | Name of the fundraiser producer. Available for producers whose type is Page or public (public profile). For producers whose type is private:<br>- In Content Library: Shown if the producer meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). For profiles that do not meet eligibility criteria, the producer name will display as "Facebook profile".<br>  <br>- In Content Library API: Shown if the producer meets eligibility criteria. | Content Library<br>Content Library API |
| Owner username | owner.username | The producer’s username, if available and profile or Page meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Beneficiary Meta Content Library ID | beneficiary.id | Unique ID linked to a beneficiary; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Beneficiary type | beneficiary.type | Type of beneficiary. Types include: private, profile, page and other (for custom beneficiaries).<br>**Note**: Only available when nonprofit is null. | Content Library<br>Content Library API |
| Beneficiary name | beneficiary.name | Name of the beneficiary that receives donations from this fundraiser. Can be a person or a custom beneficiary. If the beneficiary is a person, shown only if the name is available and meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data).<br>**Note**: Only available when nonprofit is null. | Content Library<br>Content Library API |
| Beneficiary username | beneficiary.username | Beneficiary’s username if available and the profile meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data).<br>**Note**: Only available when nonprofit is null. | Content Library<br>Content Library API |
| Nonprofit Meta Content Library ID | nonprofit.id | Unique ID linked to a nonprofit; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Nonprofit name | nonprofit.name | Name of the nonprofit. | Content Library<br>Content Library API |
| Nonprofit description | nonprofit.description | Description of the nonprofit. | Content Library<br>Content Library API |
| Nonprofit category | nonprofit.category | Nonprofit category. | Content Library<br>Content Library API |
| Nonprofit country | nonprofit.country | Country in which the nonprofit is based. | Content Library<br>Content Library API |
| Nonprofit URL | nonprofit.nonprofit\_url | Nonprofit’s URL. | Content Library<br>Content Library API |
| Share count | statistics.share\_count | Number of times the fundraiser was shared. | Content Library<br>Content Library API |
| Invite count | statistics.invite\_count | Number of Facebook users invited to contribute to the fundraiser. | Content Library<br>Content Library API |
| Donor count | statistics.donor\_count | Number of contributors to the fundraiser. | Content Library<br>Content Library API |

**Facebook channel**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a Facebook channel. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Name | name | The name of the Facebook channel. | Content Library<br>Content Library API |
| Description | description | The description of the Facebook channel. | Content Library<br>Content Library API |
| Creation time | creation\_time | The date and time the channel was created. | Content Library<br>Content Library API |
| Is admin verified | is\_admin\_verified | Whether the channel admin’s Facebook Page or profile is verified. | Content Library<br>Content Library API |
| Member count | member\_count | The number of members in the channel. | Content Library<br>Content Library API |
| Member count date last refreshed | member\_count\_date\_last\_refreshed | The date the member count was last refreshed | Content Library<br>Content Library API |
| Admin ID | admin.id | Unique ID linked to the admin of the Facebook channel. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Admin type | admin.type | The type of admin associated with the Facebook channel. Admin types include: Page or profile. | Content Library<br>Content Library API |
| Admin username | admin.username | The username of the admin associated with the Facebook channel, if the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Admin name | admin.name | The name of the admin associated with the Facebook channel, if available and user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |

**Facebook channel message**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to the channel message. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Text | text | The text of the channel message. | Content Library<br>Content Library API |
| Content type | content\_type | The content type included in the channel message. Content types are text, photo, video, album, audio, link, poll, prompt and unknown (for messages not rendered). | Content Library<br>Content Library API |
| Creation time | creation\_time | The date and time the channel message was created. | Content Library<br>Content Library API |
| Channel ID | channel.id | Unique ID linked to the channel in which the message was sent. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Channel name | channel.name | The name of the channel in which the message was sent. | Content Library<br>Content Library API |
|  |  | T | Content Library<br>Content Library API |
| Owner ID | owner.id | Unique ID linked to the owner associated with the channel message. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Owner type | owner.type | The type of message owner associated with the channel message. Message owner types include: page or profile. | Content Library<br>Content Library API |
| Owner username | owner.username | The username of the channel message owner associated with the message, if the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Owner name | owner.name | The name of the channel message owner associated with the message, if available and the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Top reactions | statistics.top\_reactions | List of the top five reactions to the message. Each reaction object will have two fields associated with it: one that describes the reaction and one that specifies the count for that reaction. | Content Library<br>Content Library API |
|  |  | T | Content Library<br>Content Library API |
|  |  | T | Content Library<br>Content Library API |
| Reaction | statistics.top\_reactions\[\].reaction | Reaction of a particular type (such as ♥️) to the message. | Content Library<br>Content Library API |
| Reaction count | statistics.top\_reactions\[\].count | Number of reactions of a particular type (such as ♥️) to the message. | Content Library<br>Content Library API |
| Total reactions count | statistics.reactions\_count | Total number of reactions of all types to the message. | Content Library<br>Content Library API |
| Link attachment name | link\_attachment.name | The name of the link attachment included in the channel message. | Content Library<br>Content Library API |
| Link attachment description | link\_attachment.description | The description of the link attachment. | Content Library<br>Content Library API |
| Link attachment URL | link\_attachment.url | The URL of the link attachment included in the channel message. | Content Library<br>Content Library API |
| Poll attachment question | poll\_attachment.question | The question associated with the poll. | Content Library<br>Content Library API |
| Poll attachment options text | poll\_attachment.options\[\].text | The text of the poll option. | Content Library<br>Content Library API |
| Poll attachment option vote count | poll\_attachment.options\[\].vote\_count | The number of votes received by the poll option. | Content Library<br>Content Library API |

**Facebook channel message multimedia content**

The items in the following data dictionary entries are returned by default on Secure Research Environment unless otherwise noted. Third-party cleanroom users can get these items by querying for `”fields”=”multimedia{url}”`.

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Multimedia type | multimedia.type | The type (photo, video or audio) of the multimedia content. | Content Library API |
| Multimedia Meta Content Library ID | multimedia.id | Unique ID linked to the photo, video or audio content. These unique IDs cannot be used to search on Meta technologies. These IDs are available in the third-party cleanroom hosted by ICPSR. They are not available in Secure Research Environment. | Content Library<br>Content Library API |
| Multimedia URL | multimedia.url | URL within a storage location to which the multimedia content has been downloaded by the third-party cleanroom if the cleanroom system is unable to provide the multimedia directly in the search results. This value is returned by default for the third-party cleanroom hosted by ICPSR. It is not returned by default on Secure Research Environment. Pass `multimedia{url}` to the `fields` parameter from Secure Research Environment to get them. | Content Library API |
| Multimedia duration | multimedia.duration | The amount of time the video lasts. Displayed as the entire number to the hundredths decimal place. Returned when `multimedia.type=video`. | Content Library API |
| Multimedia user tags | multimedia.user\_tags | User-created tags. Markers added by the user to identify specific pieces of information within a larger context. Hashtags are not included as tags. | Content Library API |

**Facebook donation**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Owner ID | owner.id | Unique ID linked to the owner associated with the Facebook donation. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Owner type | owner.type | The type of owner associated with the Facebook donation. Owner types include: profile (public profile), Page and private (private profile). | Content Library<br>Content Library API |
| Owner name | owner.name | The name of the owner associated with the Facebook donation, if the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Owner username | owner.username | The username of the owner associated with the Facebook donation, if available and the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Donation time | donation\_time | Date and time the donation was made. | Content Library<br>Content Library API |
| Reaction count | statistics.reaction\_count | Number of reactions to the donation. | Content Library<br>Content Library API |
| Reply count | statistics.reply\_count | Number of replies to the donation. | Content Library<br>Content Library API |

**Facebook comment**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a Facebook comment; cannot be used to search on Meta technologies. | Content Library API |
| Owner ID | owner.id | Unique ID linked to the owner associated with the Facebook comment; cannot be used to search on Meta technologies. | Content Library API |
| Owner type | owner.type | The type of comment owner associated with the Facebook comment. Comment owner types include: page, profile and private. | Content Library API |
| Owner username | owner.username | The username of the comment owner associated with the Facebook comment, if available and user meets the [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library API |
| Owner name | owner.name | The name of the comment owner associated with the Facebook comment. if user meets the [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library API |
| Post ID | post\_id | Unique ID linked to a Facebook comment; cannot be used to search on Meta technologies. | Content Library API |
| Parent Comment Meta Content Library ID | parent\_comment\_id | Unique ID associated with the Facebook comment, that the comment was shared as a reply; cannot be used to search on Meta technologies. Non-existing field if comment has no parent comment. | Content Library API |
| Text | text | The text of the Facebook comment. Tags are excluded. | Content Library API |
| Creation time | creation\_time | The time the Facebook comment was created. | Content Library API |
| Language | lang | The content language of the Facebook comment. Returns ISO 639-1 language code in 2-letter lowercase format. | Content Library API |
| Link attachment fields link | link\_attachment.url | The URL of the link attachment included in the Facebook comment. | Content Library API |
| Link attachment fields name | link\_attachment.name | The name of the link attachment included in the Facebook comment. | Content Library API |
| Link attachment caption | link\_attachment.caption | The caption of the link attachment included in the Facebook comment. | Content Library API |
| Link attachment description | link\_attachment.description | The description of the link attachment included in the Facebook comment. | Content Library API |
| Likes | statistics.like\_count | The number of like reactions on the comment. | Content Library API |
| Love reactions | statistics.love\_count | The number of love reactions on the comment. | Content Library API |
| Wow reactions | statistics.wow\_count | The number of wow reactions on the comment. | Content Library API |
| Haha reactions | statistics.haha\_count | The number of haha reactions on the comment. | Content Library API |
| Sad reactions | statistics.sad\_count | The number of sad reactions on the comment. | Content Library API |
| Angry reactions | statistics.angry\_count | The number of angry reactions on the comment. | Content Library API |
| Care reactions | statistics.care\_count | The number of care reactions on the comment. | Content Library API |
| Reaction count | statistics.reaction\_count | The total number of reactions on the comment. Reactions include Like, Love, Care, Haha, Wow, Sad or Angry. | Content Library API |
| Comment count | statistics.comment\_count | The total number of all replies to a comment. | Content Library API |
| Top-level reply count | statistics.top\_level\_reply\_count | The total number of top-level replies of a comment. | Content Library API |

**Facebook comment multimedia content**

The items in the following data dictionary entries are returned by default on Secure Research Environment unless otherwise noted. Third-party cleanroom users can get these items by querying for `”fields”=”multimedia{url}”`.

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Multimedia type | multimedia.type | The type (photo or video) of the multimedia content. | Content Library API |
| Multimedia Meta Content Library ID | multimedia.id | Unique ID linked to the photo or video content. These unique IDs cannot be used to search on Meta technologies. These IDs are not available on Secure Research Environment. | Content Library API |
| Multimedia URL | multimedia.url | URL within a storage location to which the multimedia content has been downloaded by the third-party cleanroom if the cleanroom system is unable to provide the multimedia directly in the search results. This value is returned by default for third-party cleanrooms. It is not returned by default on Secure Research Environment. Pass `multimedia{url}` to the `fields` parameter from Secure Research Environment to get them. | Content Library API |
| Multimedia duration | multimedia.duration | The amount of time the video lasts. Displayed as the entire number to the hundredths decimal place. Returned when multimedia.type=video. | Content Library API |
| Multimedia user tags | multimedia.user\_tags | User-created tags. Markers added by the user to identify specific pieces of information within a larger context. Hashtags are not included as tags. | Content Library API |

## Instagram

- [Account](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-ig-account)
- [Post](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-ig-post)
- [Post multimedia content](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-ig-post-3pcleanroom)
- [Comment](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-ig-comment)
- [Fundraiser](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-ig-fundraiser)
- [Channel](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-ig-channel)
- [Channel message](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-ig-channel-message)
- [Channel message multimedia content](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-ig-channel-message-3pcleanroom)

**Instagram account**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to an Instagram account; cannot be used to search on Meta technologies. | Content Library API |
| Account type | account\_type | The type of public Instagram account. Creator, business and personal accounts are valid types. <br>Public Instagram accounts include professional accounts for businesses and creators. They also include a subset of personal accounts that have privacy [set to public](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F517073653436611&h=AUBr_AceBXY2nYT3A1t1SKhtv-HbbO1t80lgtRvrUlpUyiRmc-kMT0nALSXAP4dMnfnqlS0vPKX1XXeIw6p3i2DXqMebHkU7vgn_Glsbtv_gB_iE51Vnax1n2UaIbI6pJyKaZ82QiWlgeQ) and are either [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F733907830039577%3Fhelpref%3Dfaq_content&h=AUDMVOJj_jCPI_4Itsq1XncNsA54XAtpz1O-qqrLqWFcfcelbnxVhP423V6QkSiKctCNG-GkInVg22jJ4fTreNwwpeSUmXRsxg_s5K320byGkfMsM0jRdtfYJF3ZZEihxeWcq7TnQcJ2Mw) or have 25,000 or more followers for downloadable public data or 100 or more followers for view-only data. | Content Library API |
| Is verified | is\_verified | Whether the Instagram account is [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F854227311295302&h=AUD5Mw7lEvu55CyzupifS3rDWsHyMKJs-8DKnwu_PjxWX8ROcUGrs5i6-qXwm6PnOXVmhBt1xeYLEIP9YkFEBTQaQQZNeL1-Zr30oxyXcvGYd7oOZnLe6oKwAYlGAAaphG_Fg-YZo7aVwA). | Content Library<br>Content Library API |
| Followers | follower\_count | The number of followers of the Instagram account. | Content Library<br>Content Library API |
| Following | following\_count | The number of accounts the Instagram account is following. | Content Library API |
| Website | website | The external website URL of the Instagram account. | Content Library API |
| Username | username | The username of the Instagram account. | Content Library API |
| Name | name | The name of the Instagram account, if available. | Content Library<br>Content Library API |
| Biography | biography | The description of the Instagram account. | Content Library<br>Content Library API |
| Creation date | creation\_date | The date the Instagram account was created. | Content Library API |

**Instagram post**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to an Instagram post; cannot be used to search on Meta technologies. | Content Library API |
| Text | text | The text of the Instagram post. Tags are excluded. Not applicable to stories. | Content Library<br>Content Library API |
| Match type | match\_type | List of match types for text searches in text, images and stories. Can include one or more of the following match types:<br>- `post_text` for posts that match based on text in text-only posts<br>  <br>- `image_text` for posts that match based on text-in-image posts<br>  <br>- `multimedia_text` for story highlights that match based on text search | Content Library<br>Content Library API |
| Is verified | is\_verified | Whether the post was made from a<br> [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F854227311295302&h=AUBhW1BEuOVbOe6gLgsFKfEaWwkXWQUOyjsw0n2OPCaXtQoHKGWE9dV4E0sCFa_sY5jml0aOwfuARY4eVkBYmYeDVpj9US2y-AyMqiLZN7jeCSR1fsBSvY4BhxR5RFNjD-0FEbykwHb_7w) <br>account. | Content Library<br>Content Library API |
| Creation time | creation\_time | The time the Instagram post was published. **Note**: It is possible for a post to already have views when it is published due to pre-publishing viewings by the post collaborators. This affects less than 1% of Instagram posts. | Content Library<br>Content Library API |
| Modified time | modified\_time | The time the Instagram post was most recently modified. | Content Library API |
| Language | lang | The content language of the Instagram post. Returns ISO 639-1 language code in 2-letter lowercase format. | Content Library API |
| Comments | statistics.comment\_count | The number of comments on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Likes | statistics.like\_count | The number of like reactions on the post. Not applicable to stories. | Content Library<br>Content Library API |
| Views | statistics.views | Number of times the post was on screen, not including times it appeared on the post owner’s screen. For video posts, views are counted whether the video was played or not. A post can accumulate views prior to being published. See Creation time.<br>Only posts with more than 100 views display the view count. A post displays no view count value if there were fewer than 100 views as of the last refresh.<br>View counts for posts created within the last 180 days are refreshed approximately every 24 hours, provided the post has accumulated more than 10 views within that 24 hour period. If not, view counts are refreshed every 3-5 days. View counts for posts created more than 180 days ago are refreshed every 3-5 days.<br>View counts are not available for posts made before October 1, 2022.<br>Views of content may register differently on Instagram and Facebook:<br>- On Facebook, a content view is logged when content is either fully visible or covers at least 50% of the screen height for 250ms.<br>- On Instagram, the content needs to be at least 50% visible for the same duration to register a content view.<br>Note that this metric differs from the [Views metric](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F788388387972460&h=AUDfkTrtTk6LtfrDdF98X42QwBqeLnS-aFKsWZsUtk2-GM4MrpeScziR38OmbVGrWRQdqSSzFF3z43dmZlSHJt2WKtR5rSK7swmEjcXgYbiQJ0H0dOAIb76p6PWQUnBG2zZhpn6VvOklQQ) displayed on Instagram, which measures the number of times a reel started to play and the number of times a non-reel displayed on a person’s screen. | Content Library<br>Content Library API |
| View counts last refreshed date | view\_date\_last\_refreshed | The date the view count was last refreshed. See Views definition for refresh schedule. | Content Library<br>Content Library API |
| Post owner account type | post\_owner.type | The account type of the post owner associated with the Instagram post. Post owner types include business, creator and personal. For personal accounts, only those with privacy [set to public](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F517073653436611&h=AUDt5Twy8ll6tjqOeb9R0beNFrpSFGbhLVJlqmuVH9eBAvpSCJ39IfcWtdCr3IWoYTC7VgiptujaMV8QN5YTyF0v8PjGSaPuPhZtGIoYg160MKbgLO8p4EQQnOTcQDIHE01xt--UKxHcaQ) and that are either [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F733907830039577%3Fhelpref%3Dfaq_content&h=AUDFnG0OrfkmoLOK28h5VUhcyDiA2Pfj3T4cRE9P4gHrugcg68pMlPFA7_kZSiASVzVVo44jvaLVOnQxBGF30lPymhs2cxgBNc2d-fp21LZEnbgJ5mk2x9S1bSB6PekDuEKHi0KmHxStZw) or have 25,000 or more followers (for downloadable public data) or 100 or more followers (for view-only data) are included. | Content Library API |
| Post owner Meta Content Library ID | post\_owner.id | Unique ID linked to the owner associated with the Instagram post; cannot be used to search on Meta technologies. | Content Library API |
| Post owner username | post\_owner.username | Username of the owner associated with the Instagram post, if meeting [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library API |
| Post owner Name | post\_owner.name | Name of the owner associated with the Instagram post, if available and meeting [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Is branded content | is\_branded\_content | Whether the Instagram post has branded content or not. [Learn more about branded content](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F1123581461537025%2F&h=AUAsmPVge0X_81ylFDftrrqTdT37zhip0hlAjZ2b2TBHTSBoOostZrXEEtwn8ABhLq__9GZ8KZL2VhuhU8k9-4LTZUqH3v_yWCrqCGKJTd33VVnt696wUGSTGPzn0YechzX6t5XeF-3AZw) | Content Library API |
| Media type (deprecated as of version 5.0) | media\_type | The media type included in the Instagram post. Media types include albums, photos, videos and reels. | Content Library<br>Content Library API |
| Content type | content\_type | The media type included in the Instagram post. Media types include albums, photos, stories, and videos and reels. | Content Library<br>Content Library API |
| Hashtags | hashtags | The list of hashtags included in the Instagram post. Not applicable to stories. | Content Library<br>Content Library API |

**Instagram post multimedia content**

The items in the following data dictionary entries are returned by default on Secure Research Environment unless otherwise noted. Third-party cleanroom users can get these items by querying for `”fields”=”multimedia{url}”`.

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Multimedia type | multimedia.type | The type (photo or video) of the multimedia content. | Content Library API |
| Multimedia Meta Content Library ID | multimedia.id | Unique ID linked to the photo or video content. These unique IDs cannot be used to search on Meta technologies. These IDs are not available on Secure Research Environment. | Content Library API |
| Multimedia URL | multimedia.url | URL within a storage location to which the multimedia content has been downloaded by the third-party cleanroom if the cleanroom system is unable to provide the multimedia directly in the search results. This value is returned by default for third-party cleanrooms. It is not returned by default on Secure Research Environment. Pass `multimedia{url}` to the `fields` parameter from Secure Research Environment to get them. | Content Library API |
| Multimedia duration | multimedia.duration | The amount of time the video lasts. Displayed as the entire number to the hundredths decimal place. Returned when multimedia.type=video. | Content Library API |
| Multimedia user tags | multimedia.user\_tags | User-created tags. Markers added by the user to identify specific pieces of information within a larger context. Hashtags are not included as tags. | Content Library API |

**Instagram comment**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to an Instagram comment. This unique ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Owner ID | owner.id | Unique ID linked to the owner associated with the Instagram comment. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Owner type | owner.type | The type of comment owner associated with the Instagram comment. Comment owner types include: creator, business, personal and private. | Content Library API |
| Owner username | owner.username | The username of the comment owner associated with the Instagram comment, if user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Owner name | owner.name | The name of the comment owner associated with the Instagram comment, if available and user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Post ID | post\_id | Unique ID linked to an Instagram comment. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Parent Comment Meta Content Library ID | parent\_comment\_id | Unique ID associated with the Instagram comment ifthe comment was shared as a reply; cannot be used to search on Meta technologies. Non existent field if comment has no parent comment. | Content Library<br>Content Library API |
| Text | text | The text of the Instagram comment. Tags are excluded. | Content Library<br>Content Library API |
| Creation time | creation\_time | The time the Instagram comment was created. | Content Library<br>Content Library API |
| Language | lang | The content language of the Instagram comment. Returns ISO 639-1 language code in 2-letter lowercase format. | Content Library API |
| Link attachment | link\_attachment.url | The URL of the link attachment included in the Instagram comment. | Content Library<br>Content Library API |
| Likes | statistics.like\_count | The number of like reactions on the comment. | Content Library<br>Content Library API |
| Comment count | statistics.comment\_count | The total number of replies to a comment. | Content Library<br>Content Library API |
| Top-level reply count | statistics.top\_level\_reply\_count | The number of top-level replies to a comment. | Content Library API |

**Instagram fundraiser**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to an fundraiser; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Fundraiser title | title | Title of the fundraiser. | Content Library<br>Content Library API |
| Description | description | Description of the fundraiser. | Content Library<br>Content Library API |
| Creation time | creation\_time | Creation date and time of the fundraiser. | Content Library<br>Content Library API |
| Has fundraiser ended | has\_fundraiser\_ended | Value of true or false based on whether the fundraiser has ended. | Content Library<br>Content Library API |
| End time | end\_time | Ending date and time of the fundraiser. Only available for fundraisers that are still in progress. | Content Library<br>Content Library API |
| Goal amount | goal\_amount | The goal amount for this fundraiser. Not all fundraisers have a goal. | Content Library<br>Content Library API |
| Amount raised | amount\_raised | The current amount being raised towards this fundraiser. | Content Library<br>Content Library API |
| Currency | currency | The ISO 4217 currency code of the original currency of the fundraiser. | Content Library<br>Content Library API |
| Owner Meta Content Library ID | owner.id | Unique ID linked to a producer; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Owner type | owner.type | Account type of the fundraiser producer. Types include Business, Creator and Personal. | Content Library API |
| Owner name | owner.name | Name of the fundraiser producer. Available for producers whose type is Business or Creator. For producers whose type is Personal, only available if producer meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Owner username | owner.username | The producer’s username, if available and account meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Nonprofit Meta Content Library ID | nonprofit.id | Unique ID linked to a nonprofit; cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Nonprofit name | nonprofit.name | Name of the nonprofit. | Content Library<br>Content Library API |
| Nonprofit description | nonprofit.description | Description of the nonprofit. | Content Library<br>Content Library API |
| Nonprofit category | nonprofit.category | Nonprofit category. | Content Library<br>Content Library API |
| Nonprofit country | nonprofit.country | Country in which the nonprofit is based. | Content Library<br>Content Library API |
| Nonprofit URL | nonprofit.nonprofit\_url | Nonprofit’s URL. | Content Library<br>Content Library API |
| Donation count | statistics.donation\_count | Number of contributions to the fundraiser. | Content Library<br>Content Library API |

**Instagram channel**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to an Instagram channel. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Name | name | Instagram channel name. | Content Library<br>Content Library API |
| Creation time | creation\_time | The date and time the channel was created. | Content Library<br>Content Library API |
| Is admin verified | is\_admin\_verified | Whether the channel admin’s Instagram account is [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F854227311295302&h=AUC_npoN-pn9EeAbVXEVjfzb7A8URZoIHZFb6BsuMF2PuuFYh04TFHGxhmbK9QuoLk2s4R6FO66c4-kJYvRoIrjQ3-a8bkUFcjTJA5wujbZgPekHYJH080daga5nKTOZ2c0eeKLwqcBXPw). | Content Library<br>Content Library API |
| Member count | member\_count | The number of members in the channel. | Content Library<br>Content Library API |
| Admin ID | admin.id | Unique ID linked to the admin of the Instagram channel. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Admin type | admin.type | The type of admin associated with the Instagram channel. Admin types include: creator, business and personal. | Content Library<br>Content Library API |
| Admin username | admin.username | The username of the admin associated with the Instagram channel, if the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Admin name | admin.name | The name of the admin associated with the Instagram channel, if available and user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Collaborator ID | collaborators\[\].id | Unique ID linked to a collaborator of the Instagram channel. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Collaborator type | collaborators\[\].type | Collaborator type associated with the Instagram channel collaborator. Channel collaborator types include: creator, business, personal and private. | Content Library<br>Content Library API |
| Collaborator username | collaborators\[\].username | Collaborator username associated with the Instagram channel collaborator, for users that meet [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Collaborator name | collaborators\[\].name | Collaborator name associated with the Instagram channel collaborator, if available and the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Moderator ID | moderators\[\].id | Unique ID linked to the moderator of the Instagram channel. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Moderator type | moderators\[\].type | Moderator type associated with the Instagram channel moderator. Moderator types include: creator, business, personal and private. | Content Library<br>Content Library API |
| Moderator username | moderators\[\].username | Moderator username associated with the Instagram channel moderator, for users that meet [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Moderator name | moderators\[\].name | Moderator name associated with the Instagram channel moderator, if available and the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |

**Instagram channel message**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to the channel message. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Text | text | The text of the channel message. | Content Library<br>Content Library API |
| Content type | content\_type | The content type included in the channel message. Content types are text, photo, video, album, audio, link, poll, daily\_prompt and unknown (for messages not rendered). | Content Library<br>Content Library API |
| Creation time | creation\_time | The date and time the channel message was created. | Content Library<br>Content Library API |
| Channel ID | channel.id | Unique ID linked to the channel in which the message was sent. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Channel name | channel.name | The name of the channel in which the message was sent. | Content Library<br>Content Library API |
| Owner ID | owner.id | Unique ID linked to the owner associated with the channel message. This ID cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Owner type | owner.type | The type of message owner associated with the channel message. Message owner types include: creator, business, personal and private. | Content Library<br>Content Library API |
| Owner username | owner.username | The username of the channel message owner associated with the message, if the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Owner name | owner.name | The name of the channel message owner associated with the message, if available and the user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library<br>Content Library API |
| Top reactions | statistics.top\_reactions | List of the top five reactions to the message. Each reaction object will have two fields associated with it: one that describes the reaction and one that specifies the count for that reaction. | Content Library<br>Content Library API |
| Reaction | statistics.top\_reactions\[\].reaction | Reaction of a particular type (such as ♥️) to the message. | Content Library<br>Content Library API |
| Reaction count | statistics.top\_reactions\[\].count | Number of reactions of a particular type (such as ♥️) to the message. | Content Library<br>Content Library API |
| Total reactions count | statistics.reactions\_count | Total number of reactions of all types to the message. | Content Library<br>Content Library API |
| Replies count | statistics.replies\_count | Total number of replies to the message. | Content Library<br>Content Library API |
| Link attachment name | link\_attachment.name | The name of the link attachment included in the channel message. | Content Library<br>Content Library API |
| Link attachment description | link\_attachment.description | Description of the link attachment. | Content Library<br>Content Library API |
| Link attachment URL | link\_attachment.url | The URL of the link attachment included in the channel message. | Content Library<br>Content Library API |
| Poll attachment question | poll\_attachment.question | The question associated with the poll. | Content Library<br>Content Library API |
| Poll attachment options text | poll\_attachment.options\[\].text | The text of the poll option. | Content Library<br>Content Library API |
| Poll attachment option vote count | poll\_attachment.options\[\].vote\_count | The number of votes received by the poll option. | Content Library<br>Content Library API |
| Daily prompt attachment | daily\_prompt\_attachment.text | The text of the prompt. | Content Library<br>Content Library API |
| Shared Instagram post ID | shared\_instagram\_post\_id | Unique ID linked to the shared Instagram post in the message. These unique IDs cannot be used to search on Meta technologies. | Content Library<br>Content Library API |
| Message replied to ID | message\_replied\_to\_id | Unique ID linked to the message the current message is a reply to. These unique IDs cannot be used to search on Meta technologies. | Content Library<br>Content Library API |

**Instagram channel message multimedia content**

The items in the following data dictionary entries are returned by default on Secure Research Environment unless otherwise noted. Third-party cleanroom users can get these items by querying for `”fields”=”multimedia{url}”`.

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Multimedia type | multimedia.type | The type (photo or video) of the multimedia content. | Content Library API |
| Multimedia Meta Content Library ID | multimedia.id | Unique ID linked to the photo or video content. These unique IDs cannot be used to search on Meta technologies. These IDs are not available on Secure Research Environment. | Content Library API |
| Multimedia URL | multimedia.url | URL within a storage location to which the multimedia content has been downloaded by the third-party cleanroom if the cleanroom system is unable to provide the multimedia directly in the search results. This value is returned by default for third-party cleanrooms. It is not returned by default on Secure Research Environment. Pass `multimedia{url}` to the `fields` parameter from Secure Research Environment to get them. | Content Library API |
| Multimedia duration | multimedia.duration | The amount of time the video lasts. Displayed as the entire number to the hundredths decimal place. Returned when multimedia.type=video. | Content Library API |
| Multimedia user tags | multimedia.user\_tags | User-created tags. Markers added by the user to identify specific pieces of information within a larger context. Hashtags are not included as tags. | Content Library API |

## Threads

- [Post](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-threads-post)
- [Profile](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-threads-profile)
- [Reply](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-threads-reply)

**Threads post**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Likes | N/A | Number of like reactions on the post. | Content Library |
| Replies | N/A | Number of replies on the post, including replies to previous replies. Replies on the post can be accessed by clicking the **View replies link**. This includes replies from all producers who responded to the post. | Content Library |
| Reposts | N/A | Number of times the content was reposted. | Content Library |
| Is account verified | is\_account\_verified | Whether the post was made from a<br> [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F670007651663317%3Ffbclid%3DIwY2xjawRN9z9leHRuA2FlbQIxMQBicmlkETF6aEhUMGZaNld5dEhBdlVjc3J0YwZhcHBfaWQBMAABHooauS8v1uxJR0z5wIAcYK1KrDUcvppUkHpBKT6tvm0OhLXOwsXNexzFfEuV_aem_mmnD2S7w2eGfdiySyT0MFg&h=AUABht0_qtWX8WevI5usXpaLQwR5KKi0atIbkYOZGNGLvDVi6cQooxZw3vjkKRsrN5ZnZiW_J2Vj4i771WCepNW6FDvSTKmnbZuuVXn9K6rynWAjnfd_SALRAWCoKA-cQfWJaRxQG1IDlw) <br>account. | Content Library |
| Views | N/A | Number of times the post was on screen, not including times it appeared on the post owner’s screen. For original posts, view counts include views of the post itself but do not include views of reposts or quotes of the post. For quotes, view counts include views of the quote but do not include views of the original post or reposts. For replies, view counts include views of the reply but do not include views of the original post, quotes or reposts. For video posts, views are counted whether the video was played or not.<br>Only posts with more than 100 views display the view count. A post displays no view count value if there were fewer than 100 views as of the last refresh.<br>View counts for posts created within the last 180 days are refreshed every 24 hours, provided the post has accumulated more than 10 views within a 24 hour period after September 17, 2024. View counts for posts created more than 180 days ago are refreshed every 2 days.<br>View counts are not available for posts created before March 17, 2024. | Content Library |
| Post owner | N/A | Original producer of the post. | Content Library |
| Post owner name | N/A | Name of the owner associated with the Threads post, if available and meeting [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library |
| Post owner username | N/A | Username of the owner associated with the Threads post, if available and meeting [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library |
| Post date | N/A | Date posted to Threads. | Content Library |
| Text | N/A | The text of the Threads post. | Content Library |
| Content type | N/A | The content type included in the Threads post. Content types include albums, photos, videos and miscellaneous (including text-only posts and links). | Content Library |
| Language | N/A | The content language of the Instagram post. Returns ISO 639-1 language code in 2-letter lowercase format. | Content Library |
| View counts last refreshed date | N/A | The date the view count was last refreshed. See Views definition for refresh schedule. | Content Library |

**Threads profile**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Name | N/A | Number of the Threads profile, if available. | Content Library |
| Followers | N/A | The number of followers of the Threads profile. | Content Library |
| Following | N/A | The number of profiles the Threads profile is following. | Content Library |
| Is verified | N/A | Whether the Threads profile is [verified](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F670007651663317&h=AUAys1-Syo80cEd8FsHdb-yYMRsjHMHaZKtU45gYGhVwmk7P-0_iffKvo56WLUYgTBFZigQXzA4Gvk5eedEYL9Rg1qssSgoJjXRimJvtN92qrc2LyB2vAh4vXYwnsyVuQgcK6ZShFiLBag). | Content Library |
| Username | N/A | Username of the Threads profile. | Content Library |
| Biography | N/A | The description of the Threads profile. | Content Library |
| Creation date | N/A | The date the Threads profile was created. | Content Library |

**Threads reply**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Text | N/A | The text of the Threads reply. | Content Library |
| Likes | N/A | The number of like reactions on the reply. | Content Library |
| Reply count | N/A | The total number of replies to a reply. | Content Library |
| Owner name | N/A | The name of the reply owner associated with the Threads reply, if available and user meets [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library |
| Owner username | N/A | The username of the reply owner associated with the Threads reply, if the user meets the [eligibility criteria](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data). | Content Library |
| Post ID | N/A | Unique ID linked to the Threads reply. This ID cannot be used to search on Meta technologies. | Content Library |
| Creation time | N/A | The time the Threads reply was created. | Content Library |
| Top-level reply count | N/A | The number of top-level replies to a reply. | Content Library |
| Meta Content Library ID | N/A | Unique ID linked to a Threads reply. This unique ID cannot be used to search on Meta technologies. | Content Library |
| Owner ID | N/A | Unique ID linked to the owner associated with the Threads reply. This ID cannot be used to search on Meta technologies. | Content Library |

## WhatsApp

- [Channel](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-wa-channel)
- [Channel update](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-wa-channel-update)

**WhatsApp channel**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to a WhatsApp channel. This ID is not connected with other Meta technologies. | Content Library<br>Content Library API |
| Name | name | WhatsApp channel name. | Content Library<br>Content Library API |
| Description | description | The description of the WhatsApp channel. | Content Library<br>Content Library API |
| Creation time | creation\_time | The date and time the channel was created. | Content Library<br>Content Library API |
| Categories | categories\[\] | List of channel categories. | Content Library<br>Content Library API |
| Is verified | is\_verified | Whether the WhatsApp channel has a verified badge. Learn more about [verified badges](https://l.facebook.com/l.php?u=https%3A%2F%2Ffaq.whatsapp.com%2F794517045178057&h=AUBDeSC3SyBxeMkDcB32-IFhfFYWOHp5nJ8ZaqrRnTmyi29Hv3OkJWbpl1dfRW0hrS4PErhvhgIKrLAYyj5UoJtLBl0Z5FfqIDOsRI_LDZs_vcj1zb2Dkg9bJ19kjuhlbftYOqL8u8P63A). | Content Library<br>Content Library API |
| Follower count | follower\_count | The number of followers of the WhatsApp channel. | Content Library<br>Content Library API |
| Categories | categories | The category labels associated with the WhatsApp channel. Returns an array of category strings. | Content Library<br>Content Library API |

**WhatsApp channel update**

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Meta Content Library ID | id | Unique ID linked to the channel update. This ID is not connected with other Meta Company Products. | Content Library<br>Content Library API |
| Text | text | The text of the channel update. | Content Library<br>Content Library API |
| Content type | content\_type | The content type included in the channel update. Content types are text, photo, video, gif, sticker, audio, link, poll, quiz, question, question\_reply, forwarded\_poll, forwarded\_quiz, and unknown (for updates not rendered). | Content Library<br>Content Library API |
| Creation time | creation\_time | The date and time the channel update was created. | Content Library<br>Content Library API |
| Channel ID | channel.id | Unique ID linked to the channel in which the update was sent. This ID is not connected with other Meta technologies. | Content Library<br>Content Library API |
| Channel name | channel.name | The name of the channel in which the update was sent. | Content Library<br>Content Library API |
| Admin profile name | admin\_profile.name | The name of the channel admin who posted the update. | Content Library<br>Content Library API |
| Forwarded update info channel ID | forwarded\_update\_info.id | Unique ID linked to the channel from which the update was forwarded. This ID is not connected with other Meta Company Products. | Content Library<br>Content Library API |
| Forwarded update info channel name | forwarded\_update\_info.name | The name of the channel from which the update was forwarded. | Content Library<br>Content Library API |
| Top reactions | statistics.top\_reactions | List of the top five reactions to the channel update. Each reaction object will have two fields associated with it: one that describes the reaction and one that specifies the count for that reaction. | Content Library<br>Content Library API |
| Reaction | statistics.top\_reactions\[\].reaction | Reaction of a particular type (such as ♥️) to the channel update. | Content Library<br>Content Library API |
| Reaction count | statistics.top\_reactions\[\].count | Number of reactions of a particular type (such as ♥️) to the channel update. | Content Library<br>Content Library API |
| Total reactions count | statistics.reactions\_count | Total number of reactions of all types to the channel update. | Content Library<br>Content Library API |
| Forwards count | statistics.forward\_count | Total number of times the channel update has been forwarded. Only applicable to original updates. This field returns null for forwarded updates. | Content Library<br>Content Library API |
| Link attachment name | link\_attachment.name | The name of the link attachment included in the channel update. | Content Library<br>Content Library API |
| Link attachment description | link\_attachment.description | Description of the link attachment. | Content Library<br>Content Library API |
| Link attachment URL | link\_attachment.url | The URL of the link attachment included in the channel update. | Content Library<br>Content Library API |
| Poll attachment question | poll\_attachment.question | The question associated with the poll | Content Library<br>Content Library API |
| Poll attachment options text | poll\_attachment.options\[\].text | The text of the poll option. | Content Library<br>Content Library API |
| Poll attachment option vote count | poll\_attachment.options\[\].vote\_count | The number of votes received by the poll option. | Content Library<br>Content Library API |
| Quiz attachment question | quiz\_attachment.question | The question associated with the quiz. | Content Library<br>Content Library API |
| Quiz attachment options text | quiz\_attachment.options\[\].text | The text of the quiz option. | Content Library<br>Content Library API |
| Quiz attachment option vote count | quiz\_attachment.options\[\].vote\_count | The number of votes received by the quiz option. | Content Library<br>Content Library API |
| Quiz attachment option is correct | quiz\_attachment.options\[\].is\_correct\_answer | Whether the quiz option is the correct answer. | Content Library<br>Content Library API |
| Question reply quoted question | question\_reply\_attachment.quoted\_question\_text | The text of the original question this channel update is replying to. | Content Library<br>Content Library API |
| Question reply user response | question\_reply\_attachment.user\_response\_text | The user's response text to the question. | Content Library<br>Content Library API |
| Update multimedia content | multimedia | Multimedia content attached to the channel update. | Content Library<br>Content Library API |

**WhatsApp channel multimedia content**

The items in the following data dictionary entries are returned by default on Secure Research Environment unless otherwise noted. Third-party cleanroom users can get these items by querying for `”fields”=”multimedia{url}”`.

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Multimedia type | multimedia.type | The type (photo, video or audio) of the multimedia content. | Content Library API |
| Multimedia Meta Content Library ID | multimedia.id | Unique ID linked to the photo or video content. These unique IDs cannot be used to search on Meta technologies. These IDs are not available on Secure Research Environment. | Content Library API |
| Multimedia URL | multimedia.url | URL within a storage location to which the multimedia content has been downloaded by the third-party cleanroom if the cleanroom system is unable to provide the multimedia directly in the search results. This value is returned by default for third-party cleanrooms. It is not returned by default on Secure Research Environment. Pass `multimedia{url}` to the `fields` parameter from Secure Research Environment to get them. | Content Library API |

## Share search collections

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Search ID | id | API search ID generated in Content Library. | Content Library<br>Content Library API |
| Creation time | creation\_time | The time the shared search was created in Content Library. | Content Library<br>Content Library API |
| Search platform | platform | The Platform (Facebook or Instagram) associated with the shared search. | Content Library<br>Content Library API |
| Asynchronous filters | filters\_async\_search | Filters associated with the shared search, validated and formatted for an asynchronous API search call. | Content Library<br>Content Library API |
| Synchronous filters | filters\_sync\_search | Filters associated with the shared search, validated and formatted for a synchronous API search call. | Content Library<br>Content Library API |
| API version | version | Latest version of Meta Content Library API at the time the shared search was created. | Content Library<br>Content Library API |

## Share producer lists

| Name | API field | Description | Products |
| --- | --- | --- | --- |
| Producer API list ID | id | API list ID generated in Content Library for the producer list. | Content Library<br>Content Library API |
| Producer list name | name | The name of the shared producer list. | Content Library<br>Content Library API |
| Producer list platform | platform | The Platform (Facebook or Instagram) associated with the shared producer list. | Content Library<br>Content Library API |
| Producer ID | producers.data\[\].id | Content Library ID of the producer in the producer list. | Content Library<br>Content Library API |
| Producer type | producers.data\[\].type | The type of producer. Producer types include Facebook Pages, groups, events or profiles, or Instagram accounts. | Content Library<br>Content Library API |
| Producer name | producers.data\[\].name | Name of the producer | Content Library<br>Content Library API |

## Learn more

- [Field expansion](https://developers.facebook.com/docs/content-library-api/field-expansion)
- [Meta Research Tools Terms and Conditions](https://l.facebook.com/l.php?u=https%3A%2F%2Ftransparency.fb.com%2Fresearchtools%2Fproduct-terms-meta-research&h=AUAm64SQ38hafm9Moz90n1nqbI6HDe8L6seWWPo09SJ-lnOwqlrzP_BAQ-bVvkNd4X-6lnjv1I9rq5GrQS1oV8ZSL1GzacIViPtjveKRAYF8djtSAmJQULLrthkZBma0s46gk8TCQXzZGw)
- [Verified Facebook Pages and profiles](https://www.facebook.com/help/196050490547892)
- [Verified badges on Instagram](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F733907830039577%3Fhelpref%3Dfaq_content&h=AUBMEJaBRRjs6I5sWfdCFz9TJ9IZ-Un0SHObruhuBCxmt1dIiOJCBq-JeTOAe5ucMspOn7uWT5y86rfYCL7AwmPmfFkQ-oZ8aBclJP5m_PiBPzG9wV8eMeLmY9N9S3U6yJ3bC6eEx1SJrQ)
- [Meta verified on Threads](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F670007651663317&h=AUDl-pp0paFQjAeRb3q1mXe__9bcs3Cm05lR9QuMBgorjFOGOdLOaPobHt9vUXpIPzBDVutWp4nSvM-_Zm1XUOLiFd7tsrpiVE3MTgFPXj155P5ufmDz_ro3PFif9S5xXlixuNfM35qAmw)
- [Branded content on Facebook](https://www.facebook.com/business/help/788160621327601?id=1912903575666924)
- [Branded content on Instagram](https://l.facebook.com/l.php?u=https%3A%2F%2Fhelp.instagram.com%2F1123581461537025%2F&h=AUDWJj353hXfnW35JAcOCLhB6LEh0lpdLHu_g7BKJrWxwmLR9xxMD5slKQYRWfctne_ye3ktXFSGExiXe51K7KwlIxPWkkYjZCm2maWWw28fdhRFympjLJm5xjRUYqFLv4Ysnnee9upWgA)
- [Recurring events](https://developers.facebook.com/docs/content-library-api/guide-fb-events#recurring)
\_ [About verified business accounts](https://l.facebook.com/l.php?u=https%3A%2F%2Ffaq.whatsapp.com%2F794517045178057&h=AUD9eemJuHlO_ShnuaP73z8qIBqyy_bWPyfRJs8lQuuh1su0MofLJ0QiG1lFV3CUi1H1hNOvcNrqE9619VGkrXFdo1eqJlhsb9V2Djuu-xHoZrg5m9fddfkoUKJA1v_QaEB--DasO6LbfA)

On This Page

[Data dictionary](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#data-dictionary)

[Scope of data included in Meta Content Library and API](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#available-public-data)

[Facebook](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook)

[Facebook Marketplace](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook-marketplace)

[Facebook fundraisers](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook-fundraisers)

[Facebook channels](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook-channels)

[Instagram](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#instagram)

[Instagram fundraisers](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#instagram-fundraisers)

[Instagram channels](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#instagram-channels)

[Threads](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#threads)

[WhatsApp channels](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#whatsapp-channels)

[Facebook](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#facebook-2)

[Instagram](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#instagram-2)

[Threads](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#threads-2)

[WhatsApp](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#whatsapp)

[Share search collections](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-coll-shared-search)

[Share producer lists](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#dd-lists-producers)

[Learn more](https://developers.facebook.com/docs/content-library-and-api/appendix/data-dictionary#learn-more)