---
url: https://developers.facebook.com/docs/graph-api/reference/photo/
title: Graph API Photo Node
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fgraph-api%2Freference%2Fphoto%2F%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Photo](https://developers.facebook.com/docs/graph-api/reference/photo/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/photo/#Reading)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/photo/#permissions)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/photo/#new-page-experience)

[Feature Permissions](https://developers.facebook.com/docs/graph-api/reference/photo/#feature-permissions)

[Example](https://developers.facebook.com/docs/graph-api/reference/photo/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/photo/#fields)

[Edges](https://developers.facebook.com/docs/graph-api/reference/photo/#edges)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/photo/#Creating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/photo/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/photo/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/photo/#Deleting)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/photo/#permissions-2)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/#parameters-3)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/photo/#return-type-2)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/#error-codes-3)

Graph API Version

[v25.0](https://developers.facebook.com/docs/graph-api/reference/photo/#)

# Photo

Represents an individual photo on Facebook.

## Reading

This represents a Photo on Facebook.

### Permissions

- Any valid access token can read photos on a public Page.

- A page access token can read all photos posted to or posted by that Page.

- The current user's photos can be read if the user has granted the `user_photos` or `user_posts` permission.

- A user access token may read a photo that the current user is tagged in if they have granted the `user_photos` or `user_posts` permission. However, in some cases the photo's owner's privacy settings may not allow your application to access it.

- A User access token for an Admin of a Group can read Group-owned Photos.

- A User access token for an Admin of an Event can read Event-owned Photos if required after April 30, 2018.


### New Page Experience

This endpoint is supported for [New Page Experience](https://developers.facebook.com/docs/pages/new-pages-experience/).

### Feature Permissions

| Name | Description |
| --- | --- |
| Page Public Content Access | This [feature permission](https://developers.facebook.com/docs/apps/review/feature/) may be required. |

### Example

HTTPPHP SDKJavaScript SDKAndroid SDKiOS SDK [Graph API Explorer](https://developers.facebook.com/tools/explorer/?method=GET&path=%7Bphoto-id%7D&version=v25.0)

```
GET /v25.0/{photo-id} HTTP/1.1
Host: graph.facebook.com
```

```
/* PHP SDK v5.0.0 */
/* make the API call */
try {
  // Returns a `Facebook\FacebookResponse` object
  $response = $fb->get(
    '/{photo-id}',
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
    "/{photo-id}",
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
    "/{photo-id}",
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
                               initWithGraphPath:@"/{photo-id}"\
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
| `id`<br>numeric string | The photo ID |
| `alt_text`<br>string | Accessible alternative description for an image |
| `alt_text_custom`<br>string | User provided accessible alternative description for an image |
| `backdated_time`<br>datetime | A user-specified time for when this object was created |
| `backdated_time_granularity`<br>enum | How accurate the backdated time is |
| `can_backdate`<br>bool | Indicates whether the viewer can backdate the photo |
| `can_delete`<br>bool | Indicates whether the viewer can delete the photo |
| `can_tag`<br>bool | Indicates whether the viewer can tag the photo |
| `created_time`<br>datetime | The time this photo was published<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `event`<br>[Event](https://developers.facebook.com/docs/graph-api/reference/event/) | If this object has a place, the event associated with the place |
| `from`<br>User\|Page | The profile (user or page) that uploaded this photo |
| `height`<br>unsigned int32 | The height of this photo in pixels |
| `icon`<br>string | The icon that Facebook displays when photos are published to News Feed |
| `images`<br>[list<PlatformImageSource>](https://developers.facebook.com/docs/graph-api/reference/platform-image-source/) | The different stored representations of the photo. Can vary in number based upon the size of the original photo. |
| `link`<br>string | A link to the photo on Facebook |
| `name`<br>string | The user-provided caption given to this photo. Corresponds to `caption` when creating photos<br>[Default](https://developers.facebook.com/docs/graph-api/using-graph-api/#fields) |
| `name_tags`<br>[list<EntityAtTextRange>](https://developers.facebook.com/docs/graph-api/reference/entity-at-text-range/) | An array containing an array of objects mentioned in the name field which contain the id, name, and type of each object as well as the offset and length which can be used to match it up with its corresponding string in the name field |
| `page_story_id`<br>string | ID of the page story this corresponds to. May not be on all photos. Applies only to published photos |
| `place`<br>[Place](https://developers.facebook.com/docs/graph-api/reference/place/) | Place info |
| `position`<br>unsigned int32 | Deprecated. Returns 0<br>Deprecated |
| `source`<br>string | Deprecated. Use `images` instead<br>Deprecated |
| `target`<br>[Profile](https://developers.facebook.com/docs/graph-api/reference/profile/) | The target this photo is published to |
| `updated_time`<br>datetime | The last time the photo was updated |
| `webp_images`<br>[list<PlatformImageSource>](https://developers.facebook.com/docs/graph-api/reference/platform-image-source/) | The different stored representations of the photo in webp format. Can vary in number based upon the size of the original photo. |
| `width`<br>unsigned int32 | The width of this photo in pixels |

### Edges

| Edge | Description |
| --- | --- |
| [`insights`](https://developers.facebook.com/docs/graph-api/reference/photo/insights/)<br>Edge<InsightsResult> | Insights data |
| [`likes`](https://developers.facebook.com/docs/graph-api/reference/photo/likes/)<br>Edge<Profile> | People who like this |
| [`picture`](https://developers.facebook.com/docs/graph-api/reference/photo/picture/)<br>Edge<ProfilePictureSource> | Link to the 100px wide representation of this photo |
| [`sponsor_tags`](https://developers.facebook.com/docs/graph-api/reference/photo/sponsor_tags/)<br>Edge<Page> | Sponsor pages tagged in the photo. |

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 80001 | There have been too many calls to this Page account. Wait a bit and try again. For more info, please refer to https://developers.facebook.com/docs/graph-api/overview/rate-limiting. |
| 200 | Permissions error |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 190 | Invalid OAuth 2.0 Access Token |
| 104 | Incorrect signature |
| 459 | The session is invalid because the user has been checkpointed |

## Creating

Animated photos are not supported, and a photo must be less than 10MB in size.

Note: the `post_id` value is not returned for photos added to Albums.

You can make a POST request to `photos` edge from the following paths:

- [`/{page_id}/photos`](https://developers.facebook.com/docs/graph-api/reference/page/photos/)

When posting to this edge, a [Photo](https://developers.facebook.com/docs/graph-api/reference/photo/) will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `aid`<br>string | Legacy album ID. Deprecated |
| `allow_spherical_photo`<br>boolean | Default value: `false`<br>Indicates that we should allow this photo to be treated as a spherical photo. This will not change the behavior unless the server is able to interpret the photo as spherical, such as via Photosphere XMP metadata. Regular non-spherical photos will still be treated as regular photos even if this parameter is true. |
| `alt_text_custom`<br>string | Accessible alternative description for an image |
| `android_key_hash`<br>string | Android key hash |
| `application_id`<br>non-empty string | iTunes App ID. This is used by the native Share dialog that's part of iOS |
| `attempt`<br>int64 | Default value: `0`<br>Number of attempts that have been made to upload this photo |
| `audience_exp`<br>boolean | Default value: `false`<br>Audience exp |
| `backdated_time`<br>datetime | A user-specified creation time for this photo |
| `backdated_time_granularity`<br>enum{year, month, day, hour, min, none} | Default value: `none`<br>Use only the part of the `backdated_time` parameter to the specified granularity |
| `caption`<br>UTF-8 string | The description of the photo<br>Supports Emoji |
| `composer_session_id`<br>string | Composer session ID |
| `direct_share_status`<br>int64 | The status to allow sponsor directly boost the post. |
| `feed_targeting`<br>feed target | Object that controls [News Feed targeting](https://www.facebook.com/help/352402648173466) for this post. Anyone in these groups will be more likely to see this post. People not in these groups will be less likely to see this post, but may still see it anyway. Any of the targeting fields shown here can be used, but none are required. `feed_targeting` applies to Pages only. |
| `geo_locations`<br>Object |  |
| `countries`<br>list<string> |  |
| `regions`<br>list<Object> |  |
| `key`<br>int64 |  |
| `cities`<br>list<Object> |  |
| `key`<br>int64 |  |
| `zips`<br>list<Object> |  |
| `key`<br>string |  |
| `locales`<br>list<string> | Values for targeted locales. Use `type` of `adlocale` to [find Targeting Options](https://developers.facebook.com/docs/marketing-api/targeting-search) and use the returned key to specify. |
| `age_min`<br>int64 | Must be `13` or higher. Default is 0. |
| `age_max`<br>int64 | Maximum age. |
| `genders`<br>list<int64> | Target specific genders. `1` targets all male viewers and `2` females. Default is to target both. |
| `college_years`<br>list<int64> | Array of integers. Represent graduation years from college. |
| `education_statuses`<br>list<int64> | Array of integers which represent current educational status. Use `1` for high school, `2` for undergraduate, and `3` for alum (or localized equivalents). |
| `interested_in`<br>list<int64> | Deprecated. Please see the [Graph API Changelog](https://developers.facebook.com/docs/graph-api/changelog/breaking-changes#2-7-2018) for more information.<br>Deprecated |
| `relationship_statuses`<br>list<int64> | Array of integers for targeting based on relationship status. Use `1` for single, `2` for 'in a relationship', `3` for married, and `4` for engaged. Default is all types. |
| `interests`<br>list<int64> | One or more IDs of pages to target fans of pages.Use `type` of `page` to get possible IDs as [find Targeting Options](https://developers.facebook.com/docs/marketing-api/targeting-search) and use the returned id to specify. |
| `filter_type`<br>int64 | Default value: `-1`<br>Unused? |
| `full_res_is_coming_later`<br>boolean | Default value: `false`<br>Full res is coming later |
| `initial_view_heading_override_degrees`<br>int64 | Manually specify the initial view heading in degrees from 0 to 360. This overrides any value present in the photo embedded metadata or provided in the spherical\_metadata parameter |
| `initial_view_pitch_override_degrees`<br>int64 | Manually specify the initial view pitch in degrees from -90 to 90. This overrides any value present in the photo embedded metadata or provided in the spherical\_metadata parameter |
| `initial_view_vertical_fov_override_degrees`<br>int64 | Manually specify the initial view vertical FOV in degrees from 60 to 120. This overrides any value present in the photo embedded metadata or provided in the spherical\_metadata parameter |
| `ios_bundle_id`<br>string | iOS Bundle ID |
| `is_explicit_location`<br>boolean | Is this an explicit location? |
| `is_explicit_place`<br>boolean | If set to `true`, the tag is a place, not a person |
| `location_source_id`<br>numeric string or integer | ID of a page or a page set that provides location informationto enable Local Extensions |
| `manual_privacy`<br>boolean | Default value: `false`<br>Manual privacy |
| `message`<br>string | Deprecated. Please use the caption param instead. |
| `name`<br>string | Deprecated. Please use the caption param instead. |
| `nectar_module`<br>string | Nectar module. Internal apps only |
| `no_story`<br>boolean | If set to `true`, this will suppress the News Feed story that is automatically generated on a profile when people upload a photo using your app. Useful for adding old photos where you may not want to generate a story |
| `offline_id`<br>int64 | Default value: `0`<br>Offline ID |
| `og_action_type_id`<br>numeric string or integer | The Open Graph action type |
| `og_icon_id`<br>numeric string or integer | The Open Graph icon |
| `og_object_id`<br>OG object ID or URL string | The Open Graph object ID |
| `og_phrase`<br>string | The Open Graph phrase |
| `og_set_profile_badge`<br>boolean | Default value: `false`<br>Flag to set if the post should create a profile badge |
| `og_suggestion_mechanism`<br>string | The Open Graph suggestion |
| `place`<br>place tag | Page ID of a place associated with the photo |
| `privacy`<br>Privacy Parameter | Determines the privacy settings of the photo. If not supplied, this defaults to the privacy level granted to the app in the Login dialog. This field cannot be used to set a more open privacy setting than the one granted |
| `profile_id`<br>int | Deprecated. Use `target_id` instead<br>Deprecated |
| `provenance_info`<br>JSON object | provenance\_info |
| `is_gen_ai`<br>boolean | is\_gen\_ai<br>Required |
| `provenance_type`<br>enum {C2PA, IPTC, EXPLICIT, INVISIBLE\_WATERMARK, C2PA\_METADATA\_EDITED, IPTC\_METADATA\_EDITED, EXPLICIT\_IMAGINE, EXPLICIT\_IMAGINE\_ME, EXPLICIT\_RESTYLE, EXPLICIT\_ANIMATE, EXPLICIT\_FACE\_SWAP, EXPLICIT\_WARDROBE, EXPLICIT\_DROP\_IN} | provenance\_type<br>Required |
| `source`<br>string | source |
| `proxied_app_id`<br>numeric string or integer | Proxied app ID |
| `published`<br>boolean | Default value: `true`<br>Set to `false` if you don't want the photo to be published immediately |
| `qn`<br>string | Photos waterfall ID |
| `scheduled_publish_time`<br>int64 | Time at which an unpublished post should be published (Unix timestamp). Applies to Pages only |
| `spherical_metadata`<br>JSON object | A set of params describing an uploaded spherical photo. This field is not required; if it is not present we will try to generate spherical metadata from the metadata embedded in the image. If it is present, it takes precedence over any embedded metadata. Please click to the left to expand this list and see more information on each parameter. See also the Google Photo Sphere spec for more info on the meaning of the params: https://developers.google.com/streetview/spherical-metadata |
| `ProjectionType`<br>string | Accepted values include equirectangular (full spherical photo),<br>cylindrical (panorama), and cubestrip (also known as cubemap, e.g.<br>for synthetic or rendered content; stacked vertically with 6 faces).<br>Required |
| `CroppedAreaImageWidthPixels`<br>int64 | \-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: Very similar to equirectangular.<br>This value should be equal to the actual width of the image, and<br>together with FullPanoWidthPixels, it describes the horizontal FOV<br>of content of the image: HorizontalFOV = 360 \*<br>CroppedAreaImageWidthPixels / FullPanoWidthPixels.<br>\-\-\- In cubestrip projection: This has no relationship to the pixel<br>dimensions of the image. It is simply a representation of the<br>horizontal FOV of the content of the image.<br>HorizontalFOV = CroppedAreaImageWidthPixels / PixelsPerDegree,<br>where PixelsPerDegree is defined by FullPanoWidthPixels.<br>Required |
| `CroppedAreaImageHeightPixels`<br>int64 | \-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: This value will NOT be equal to<br>the actual height of the image. Instead, together with<br>FullPanoHeightPixels, it describes the vertical FOV of the image:<br>VerticalFOV = 180 \* CroppedAreaImageHeightPixels /<br>FullPanoHeightPixels. In other words, this value is equal to the<br>CroppedAreaImageHeightPixels value that this image would have, if it<br>were projected into equirectangular format while maintaining the<br>same FullPanoWidthPixels.<br>\-\-\- In cubestrip projection: This has no relationship to the pixel<br>dimensions of the image. It is simply a representation of the<br>vertical FOV of the content of the image.<br>VerticalFOV = CroppedAreaImageHeightPixels / PixelsPerDegree,<br>where PixelsPerDegree is defined by FullPanoWidthPixels.<br>Required |
| `FullPanoWidthPixels`<br>int64 | \-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: Very similar to<br>equirectangular. This value defines a ratio of horizontal pixels to<br>degrees in the space of the image, and in general the pixel to degree<br>ratio in the scope of the metadata object. Concretely, PixelsPerDegree =<br>FullPanoWidthPixels / 360. This is also equivalent to the<br>circumference of the cylinder used to model this projection.<br>\-\-\- In cubestrip projection: This value has<br>no relationship to the pixel dimensions of the image. It only defines<br>the pixel to degree ratio in the scope of the metadata object. It<br>represents the number of pixels in 360 degrees, so pixels per degree<br>is then given by: PixelsPerDegree = FullPanoWidthPixels / 360. As an<br>example, if FullPanoWidthPixels were chosen to be 3600, we would have<br>PixelsPerDegree = 3600 / 360 = 10. An image with a vertical field of<br>view of 65 degrees would then have a CroppedAreaImageHeightPixels value<br>of 65 \* 10 = 650.<br>Required |
| `FullPanoHeightPixels`<br>int64 | \-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: This value is equal<br>to the FullPanoHeightPixels value that this image would have, if it<br>were projected into equirectangular format while maintaining the<br>same FullPanoWidthPixels. It is always equal to<br>FullPanoWidthPixels / 2.<br>\-\-\- In cubestrip projection: This value has<br>no relationship to the pixel dimensions of the image. It is a second,<br>redundant representation of PixelsPerDegree.<br>FullPanoHeightPixels = 180 \* PixelsPerDegree. It must be consistent<br>with FullPanoWidthPixels:<br>FullPanoHeightPixels = FullPanoWidthPixels / 2.<br>Required |
| `CroppedAreaLeftPixels`<br>int64 | Default value: `0`<br>\-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: This value is equal<br>to the CroppedAreaLeftPixels value that this image would have, if it<br>were projected into equirectangular format while maintaining the<br>same FullPanoWidthPixels. It is just a representation of the same<br>angular offset that it represents in equirectangular projection in the<br>Google Photo Sphere spec.<br>Concretely, AngularOffsetFromLeftDegrees = CroppedAreaLeftPixels /<br>PixelsPerDegree, where PixelsPerDegree is defined by<br>FullPanoWidthPixels.<br>\-\-\- In cubestrip projection: This value has<br>no relationship to the pixel dimensions of the image. It is just a<br>representation of the same angular offset that it represents in<br>equirectangular projection in the Google Photo Sphere spec.<br>AngularOffsetFromLeftDegrees = CroppedAreaLeftPixels / PixelsPerDegree,<br>where PixelsPerDegree is defined by FullPanoWidthPixels. |
| `CroppedAreaTopPixels`<br>int64 | Default value: `0`<br>\-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: This value is equal<br>to the CroppedAreaTopPixels value that this image would have, if it<br>were projected into equirectangular format while maintaining the<br>same FullPanoWidthPixels. It is just a representation of the same<br>angular offset that it represents in equirectangular projection in the<br>Google Photo Sphere spec.<br>Concretely, AngularOffsetFromTopDegrees = CroppedAreaTopPixels /<br>PixelsPerDegree, where PixelsPerDegree is defined by<br>FullPanoWidthPixels.<br>\-\-\- In cubestrip projection: This value has<br>no relationship to the pixel dimensions of the image. It is just a<br>representation of the same angular offset that it represents in<br>equirectangular projection in the Google Photo Sphere spec.<br>AngularOffsetFromTopDegrees = CroppedAreaTopPixels / PixelsPerDegree,<br>where PixelsPerDegree is defined by FullPanoWidthPixels. |
| `PoseHeadingDegrees`<br>float |  |
| `PosePitchDegrees`<br>float |  |
| `PoseRollDegrees`<br>float |  |
| `InitialViewHeadingDegrees`<br>float |  |
| `InitialViewPitchDegrees`<br>float |  |
| `InitialViewRollDegrees`<br>float | This is not currently supported |
| `InitialViewVerticalFOVDegrees`<br>float | This is deprecated. Please use InitialVerticalFOVDegrees. |
| `InitialVerticalFOVDegrees`<br>float | You can set the intial vertical FOV of the image. You can set either<br>this field or InitialHorizontalFOVDegrees. |
| `InitialHorizontalFOVDegrees`<br>float | You can set the intial horizontal FOV of the image. You can set either<br>this field or InitialVerticalFOVDegrees. |
| `PreProcessCropLeftPixels`<br>int64 |  |
| `PreProcessCropRightPixels`<br>int64 |  |
| `sponsor_id`<br>numeric string or integer | Facebook Page id that is tagged as sponsor in the photo post |
| `sponsor_relationship`<br>int64 | Sponsor Relationship, such as Presented By or Paid PartnershipWith |
| `tags`<br>list<Object> | Default value: `Vec`<br>Tags on this photo |
| `x`<br>float | The x-axis offset for the tag |
| `y`<br>float | The y-axis offset for the tag |
| `tag_uid`<br>int | The user\_id of the tagged person |
| `tag_text`<br>string | Text associated with the tag |
| `target_id`<br>int | Don't use this. Specifying a `target_id` allows you to post the photo to an object that's not the user in the access token. It only works when posting directly to the `/photos` endpoint. Instead of using this parameter you should be using the edge on an object directly, like `/page/photos`. |
| `targeting`<br>target | Allows you to target posts to specific audiences. Applies to Pages only |
| `geo_locations`<br>Object |  |
| `countries`<br>list<string> |  |
| `regions`<br>list<Object> |  |
| `key`<br>int64 |  |
| `cities`<br>list<Object> |  |
| `key`<br>int64 |  |
| `zips`<br>list<Object> |  |
| `key`<br>string |  |
| `locales`<br>list<string> |  |
| `excluded_countries`<br>list<string> |  |
| `excluded_regions`<br>list<int64> |  |
| `excluded_cities`<br>list<int64> |  |
| `excluded_zipcodes`<br>list<string> |  |
| `timezones`<br>list<int64> |  |
| `age_min`<br>enum {13, 15, 18, 21, 25} |  |
| `temporary`<br>boolean | Default value: `false`<br>This is a temporary photo. `published` must be false, and you can't set `scheduled_publish_time` |
| `time_since_original_post`<br>int64 | Same as `backdated_time` but with a time delta instead of absolute time |
| `uid`<br>int | Deprecated |
| `unpublished_content_type`<br>enum {SCHEDULED, SCHEDULED\_RECURRING, DRAFT, PUBLISH\_PENDING, ADS\_POST, INLINE\_CREATED, PUBLISHED, REVIEWABLE\_BRANDED\_CONTENT} | Content type of the unpublished content type |
| `url`<br>URL | The URL of a photo that is already uploaded to the Internet. You must specify this or a file attachment |
| `user_selected_tags`<br>boolean | Default value: `false`<br>User selected tags |
| `vault_image_id`<br>numeric string or integer | A vault image ID to use for a photo. You can use only one of `url`, a file attachment, `vault_image_id`, or `sync_object_uuid` |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node represented by `id` in the return type.

Struct {

`id`: numeric string,

`post_id`: string,

}

### Error Codes

| Error | Description |
| --- | --- |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 324 | Missing or invalid image file |
| 200 | Permissions error |
| 190 | Invalid OAuth 2.0 Access Token |
| 100 | Invalid parameter |
| 240 | Desktop applications cannot call this function for other users |
| 283 | That action requires the extended permission pages\_read\_engagement and/or pages\_read\_user\_content and/or pages\_manage\_ads and/or pages\_manage\_metadata |

You can make a POST request to `photos` edge from the following paths:

- [`/{album_id}/photos`](https://developers.facebook.com/docs/graph-api/reference/album/photos/)

When posting to this edge, a [Photo](https://developers.facebook.com/docs/graph-api/reference/photo/) will be created.

### Parameters

| Parameter | Description |
| --- | --- |
| `aid`<br>string | Legacy album ID. Deprecated |
| `allow_spherical_photo`<br>boolean | Default value: `false`<br>Indicates that we should allow this photo to be treated as a spherical photo. This will not change the behavior unless the server is able to interpret the photo as spherical, such as via Photosphere XMP metadata. Regular non-spherical photos will still be treated as regular photos even if this parameter is true. |
| `alt_text_custom`<br>string | Accessible alternative description for an image |
| `android_key_hash`<br>string | Android key hash |
| `application_id`<br>non-empty string | iTunes App ID. This is used by the native Share dialog that's part of iOS |
| `attempt`<br>int64 | Default value: `0`<br>Number of attempts that have been made to upload this photo |
| `audience_exp`<br>boolean | Default value: `false`<br>Audience exp |
| `backdated_time`<br>datetime/timestamp | A user-specified creation time for this photo |
| `backdated_time_granularity`<br>enum{year, month, day, hour, min, none} | Default value: `none`<br>Use only the part of the `backdated_time` parameter to the specified granularity |
| `caption`<br>string | The description of the photo |
| `composer_session_id`<br>string | Composer session ID |
| `direct_share_status`<br>int64 | The status to allow sponsor directly boost the post. |
| `feed_targeting`<br>feed target | Object that controls [News Feed targeting](https://www.facebook.com/help/352402648173466) for this post. Anyone in these groups will be more likely to see this post. People not in these groups will be less likely to see this post, but may still see it anyway. Any of the targeting fields shown here can be used, but none are required. `feed_targeting` applies to Pages only. |
| `geo_locations`<br>Object |  |
| `countries`<br>list<string> |  |
| `regions`<br>list<Object> |  |
| `key`<br>int64 |  |
| `cities`<br>list<Object> |  |
| `key`<br>int64 |  |
| `zips`<br>list<Object> |  |
| `key`<br>string |  |
| `locales`<br>list<string> | Values for targeted locales. Use `type` of `adlocale` to [find Targeting Options](https://developers.facebook.com/docs/marketing-api/targeting-search) and use the returned key to specify. |
| `age_min`<br>int64 | Must be `13` or higher. Default is 0. |
| `age_max`<br>int64 | Maximum age. |
| `genders`<br>list<int64> | Target specific genders. `1` targets all male viewers and `2` females. Default is to target both. |
| `college_years`<br>list<int64> | Array of integers. Represent graduation years from college. |
| `education_statuses`<br>list<int64> | Array of integers which represent current educational status. Use `1` for high school, `2` for undergraduate, and `3` for alum (or localized equivalents). |
| `interested_in`<br>list<int64> | Deprecated. Please see the [Graph API Changelog](https://developers.facebook.com/docs/graph-api/changelog/breaking-changes#2-7-2018) for more information.<br>Deprecated |
| `relationship_statuses`<br>list<int64> | Array of integers for targeting based on relationship status. Use `1` for single, `2` for 'in a relationship', `3` for married, and `4` for engaged. Default is all types. |
| `interests`<br>list<int64> | One or more IDs of pages to target fans of pages.Use `type` of `page` to get possible IDs as [find Targeting Options](https://developers.facebook.com/docs/marketing-api/targeting-search) and use the returned id to specify. |
| `filter_type`<br>int64 | Default value: `-1`<br>Unused? |
| `full_res_is_coming_later`<br>boolean | Default value: `false`<br>Full res is coming later |
| `initial_view_heading_override_degrees`<br>int64 | Manually specify the initial view heading in degrees from 0 to 360. This overrides any value present in the photo embedded metadata or provided in the spherical\_metadata parameter |
| `initial_view_pitch_override_degrees`<br>int64 | Manually specify the initial view pitch in degrees from -90 to 90. This overrides any value present in the photo embedded metadata or provided in the spherical\_metadata parameter |
| `initial_view_vertical_fov_override_degrees`<br>int64 | Manually specify the initial view vertical FOV in degrees from 60 to 120. This overrides any value present in the photo embedded metadata or provided in the spherical\_metadata parameter |
| `ios_bundle_id`<br>string | iOS Bundle ID |
| `is_explicit_location`<br>boolean | Is this an explicit location? |
| `is_explicit_place`<br>boolean | If set to `true`, the tag is a place, not a person |
| `manual_privacy`<br>boolean | Default value: `false`<br>Manual privacy |
| `message`<br>string | Deprecated. Please use the caption param instead. |
| `name`<br>string | Deprecated. Please use the caption param instead. |
| `no_story`<br>boolean | If set to `true`, this will suppress the News Feed story that is automatically generated on a profile when people upload a photo using your app. Useful for adding old photos where you may not want to generate a story |
| `offline_id`<br>int64 | Default value: `0`<br>Offline ID |
| `og_action_type_id`<br>numeric string | The Open Graph action type |
| `og_icon_id`<br>numeric string | The Open Graph icon |
| `og_object_id`<br>OG object ID or URL string | The Open Graph object ID |
| `og_phrase`<br>string | The Open Graph phrase |
| `og_set_profile_badge`<br>boolean | Default value: `false`<br>Flag to set if the post should create a profile badge |
| `og_suggestion_mechanism`<br>string | The Open Graph suggestion |
| `place`<br>place tag | Page ID of a place associated with the photo |
| `privacy`<br>Privacy Parameter | Determines the privacy settings of the photo. If not supplied, this defaults to the privacy level granted to the app in the Login dialog. This field cannot be used to set a more open privacy setting than the one granted |
| `profile_id`<br>int | Deprecated. Use `target_id` instead<br>Deprecated |
| `provenance_info`<br>JSON object | provenance\_info |
| `is_gen_ai`<br>boolean | is\_gen\_ai<br>Required |
| `provenance_type`<br>enum {C2PA, IPTC, EXPLICIT, INVISIBLE\_WATERMARK, C2PA\_METADATA\_EDITED, IPTC\_METADATA\_EDITED, EXPLICIT\_IMAGINE, EXPLICIT\_IMAGINE\_ME, EXPLICIT\_RESTYLE, EXPLICIT\_ANIMATE, EXPLICIT\_FACE\_SWAP, EXPLICIT\_WARDROBE, EXPLICIT\_DROP\_IN} | provenance\_type<br>Required |
| `source`<br>string | source |
| `proxied_app_id`<br>numeric string or integer | Proxied app ID |
| `published`<br>boolean | Default value: `true`<br>Set to `false` if you don't want the photo to be published immediately |
| `qn`<br>string | Photos waterfall ID |
| `spherical_metadata`<br>JSON object | A set of params describing an uploaded spherical photo. This field is not required; if it is not present we will try to generate spherical metadata from the metadata embedded in the image. If it is present, it takes precedence over any embedded metadata. Please click to the left to expand this list and see more information on each parameter. See also the Google Photo Sphere spec for more info on the meaning of the params: https://developers.google.com/streetview/spherical-metadata |
| `ProjectionType`<br>string | Accepted values include equirectangular (full spherical photo),<br>cylindrical (panorama), and cubestrip (also known as cubemap, e.g.<br>for synthetic or rendered content; stacked vertically with 6 faces).<br>Required |
| `CroppedAreaImageWidthPixels`<br>int64 | \-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: Very similar to equirectangular.<br>This value should be equal to the actual width of the image, and<br>together with FullPanoWidthPixels, it describes the horizontal FOV<br>of content of the image: HorizontalFOV = 360 \*<br>CroppedAreaImageWidthPixels / FullPanoWidthPixels.<br>\-\-\- In cubestrip projection: This has no relationship to the pixel<br>dimensions of the image. It is simply a representation of the<br>horizontal FOV of the content of the image.<br>HorizontalFOV = CroppedAreaImageWidthPixels / PixelsPerDegree,<br>where PixelsPerDegree is defined by FullPanoWidthPixels.<br>Required |
| `CroppedAreaImageHeightPixels`<br>int64 | \-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: This value will NOT be equal to<br>the actual height of the image. Instead, together with<br>FullPanoHeightPixels, it describes the vertical FOV of the image:<br>VerticalFOV = 180 \* CroppedAreaImageHeightPixels /<br>FullPanoHeightPixels. In other words, this value is equal to the<br>CroppedAreaImageHeightPixels value that this image would have, if it<br>were projected into equirectangular format while maintaining the<br>same FullPanoWidthPixels.<br>\-\-\- In cubestrip projection: This has no relationship to the pixel<br>dimensions of the image. It is simply a representation of the<br>vertical FOV of the content of the image.<br>VerticalFOV = CroppedAreaImageHeightPixels / PixelsPerDegree,<br>where PixelsPerDegree is defined by FullPanoWidthPixels.<br>Required |
| `FullPanoWidthPixels`<br>int64 | \-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: Very similar to<br>equirectangular. This value defines a ratio of horizontal pixels to<br>degrees in the space of the image, and in general the pixel to degree<br>ratio in the scope of the metadata object. Concretely, PixelsPerDegree =<br>FullPanoWidthPixels / 360. This is also equivalent to the<br>circumference of the cylinder used to model this projection.<br>\-\-\- In cubestrip projection: This value has<br>no relationship to the pixel dimensions of the image. It only defines<br>the pixel to degree ratio in the scope of the metadata object. It<br>represents the number of pixels in 360 degrees, so pixels per degree<br>is then given by: PixelsPerDegree = FullPanoWidthPixels / 360. As an<br>example, if FullPanoWidthPixels were chosen to be 3600, we would have<br>PixelsPerDegree = 3600 / 360 = 10. An image with a vertical field of<br>view of 65 degrees would then have a CroppedAreaImageHeightPixels value<br>of 65 \* 10 = 650.<br>Required |
| `FullPanoHeightPixels`<br>int64 | \-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: This value is equal<br>to the FullPanoHeightPixels value that this image would have, if it<br>were projected into equirectangular format while maintaining the<br>same FullPanoWidthPixels. It is always equal to<br>FullPanoWidthPixels / 2.<br>\-\-\- In cubestrip projection: This value has<br>no relationship to the pixel dimensions of the image. It is a second,<br>redundant representation of PixelsPerDegree.<br>FullPanoHeightPixels = 180 \* PixelsPerDegree. It must be consistent<br>with FullPanoWidthPixels:<br>FullPanoHeightPixels = FullPanoWidthPixels / 2.<br>Required |
| `CroppedAreaLeftPixels`<br>int64 | Default value: `0`<br>\-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: This value is equal<br>to the CroppedAreaLeftPixels value that this image would have, if it<br>were projected into equirectangular format while maintaining the<br>same FullPanoWidthPixels. It is just a representation of the same<br>angular offset that it represents in equirectangular projection in the<br>Google Photo Sphere spec.<br>Concretely, AngularOffsetFromLeftDegrees = CroppedAreaLeftPixels /<br>PixelsPerDegree, where PixelsPerDegree is defined by<br>FullPanoWidthPixels.<br>\-\-\- In cubestrip projection: This value has<br>no relationship to the pixel dimensions of the image. It is just a<br>representation of the same angular offset that it represents in<br>equirectangular projection in the Google Photo Sphere spec.<br>AngularOffsetFromLeftDegrees = CroppedAreaLeftPixels / PixelsPerDegree,<br>where PixelsPerDegree is defined by FullPanoWidthPixels. |
| `CroppedAreaTopPixels`<br>int64 | Default value: `0`<br>\-\-\- In equirectangular projection: As described in Google Photo Sphere<br>XMP Metadata spec.<br>\-\-\- In cylindrical projection: This value is equal<br>to the CroppedAreaTopPixels value that this image would have, if it<br>were projected into equirectangular format while maintaining the<br>same FullPanoWidthPixels. It is just a representation of the same<br>angular offset that it represents in equirectangular projection in the<br>Google Photo Sphere spec.<br>Concretely, AngularOffsetFromTopDegrees = CroppedAreaTopPixels /<br>PixelsPerDegree, where PixelsPerDegree is defined by<br>FullPanoWidthPixels.<br>\-\-\- In cubestrip projection: This value has<br>no relationship to the pixel dimensions of the image. It is just a<br>representation of the same angular offset that it represents in<br>equirectangular projection in the Google Photo Sphere spec.<br>AngularOffsetFromTopDegrees = CroppedAreaTopPixels / PixelsPerDegree,<br>where PixelsPerDegree is defined by FullPanoWidthPixels. |
| `PoseHeadingDegrees`<br>float |  |
| `PosePitchDegrees`<br>float |  |
| `PoseRollDegrees`<br>float |  |
| `InitialViewHeadingDegrees`<br>float |  |
| `InitialViewPitchDegrees`<br>float |  |
| `InitialViewRollDegrees`<br>float | This is not currently supported |
| `InitialViewVerticalFOVDegrees`<br>float | This is deprecated. Please use InitialVerticalFOVDegrees. |
| `InitialVerticalFOVDegrees`<br>float | You can set the intial vertical FOV of the image. You can set either<br>this field or InitialHorizontalFOVDegrees. |
| `InitialHorizontalFOVDegrees`<br>float | You can set the intial horizontal FOV of the image. You can set either<br>this field or InitialVerticalFOVDegrees. |
| `PreProcessCropLeftPixels`<br>int64 |  |
| `PreProcessCropRightPixels`<br>int64 |  |
| `sponsor_id`<br>numeric string or integer | Facebook Page id that is tagged as sponsor in the photo post |
| `sponsor_relationship`<br>int64 | Sponsor Relationship, such as Presented By or Paid PartnershipWith |
| `tags`<br>list<Object> | Tags on this photo |
| `x`<br>float | The x-axis offset for the tag |
| `y`<br>float | The y-axis offset for the tag |
| `tag_uid`<br>int | The user\_id of the tagged person |
| `tag_text`<br>string | Text associated with the tag |
| `target_id`<br>int | Don't use this. Specifying a `target_id` allows you to post the photo to an object that's not the user in the access token. It only works when posting directly to the `/photos` endpoint. Instead of using this parameter you should be using the edge on an object directly, like `/page/photos`. |
| `targeting`<br>target | Allows you to target posts to specific audiences. Applies to Pages only |
| `geo_locations`<br>Object |  |
| `countries`<br>list<string> |  |
| `regions`<br>list<Object> |  |
| `key`<br>int64 |  |
| `cities`<br>list<Object> |  |
| `key`<br>int64 |  |
| `zips`<br>list<Object> |  |
| `key`<br>string |  |
| `locales`<br>list<string> |  |
| `excluded_countries`<br>list<string> |  |
| `excluded_regions`<br>list<int64> |  |
| `excluded_cities`<br>list<int64> |  |
| `excluded_zipcodes`<br>list<string> |  |
| `timezones`<br>list<int64> |  |
| `age_min`<br>enum {13, 15, 18, 21, 25} |  |
| `time_since_original_post`<br>int64 | Same as `backdated_time` but with a time delta instead of absolute time |
| `uid`<br>int | Deprecated |
| `unpublished_content_type`<br>enum {SCHEDULED, SCHEDULED\_RECURRING, DRAFT, PUBLISH\_PENDING, ADS\_POST, INLINE\_CREATED, PUBLISHED, REVIEWABLE\_BRANDED\_CONTENT} | Content type of the unpublished content type |
| `url`<br>string | The URL of a photo that is already uploaded to the Internet. You must specify this or a file attachment |
| `user_selected_tags`<br>boolean | Default value: `false`<br>User selected tags |
| `vault_image_id`<br>numeric string or integer | A vault image ID to use for a photo. You can use only one of `url`, a file attachment, `vault_image_id`, or `sync_object_uuid` |

### Return Type

This endpoint supports [read-after-write](https://developers.facebook.com/docs/graph-api/overview/#read-after-write) and will read the node represented by `id` in the return type.

Struct {

`id`: numeric string,

`post_id`: token with structure: Post ID,

}

### Error Codes

| Error | Description |
| --- | --- |
| 190 | Invalid OAuth 2.0 Access Token |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 200 | Permissions error |
| 100 | Invalid parameter |
| 220 | Album or albums not visible |
| 324 | Missing or invalid image file |

## Updating

You can't perform this operation on this endpoint.

## Deleting

An app can delete any photos it published, or a page-management app can delete a Photo published to a page that the app manages.

### Permissions

- To delete a User's photo, a User access token with `publish_actions` [permission](https://developers.facebook.com/docs/authentication/permissions/) is required.

- To delete a Page's photo a Page access token and `publish_pages` [permission](https://developers.facebook.com/docs/authentication/permissions/) is required.

- To delete a User's photo on a Page a Page access token is required.


You can delete a [Photo](https://developers.facebook.com/docs/graph-api/reference/photo/) by making a DELETE request to [`/{photo_id}`](https://developers.facebook.com/docs/graph-api/reference/photo/).

### Parameters

This endpoint doesn't have any parameters.

### Return Type

Struct {

`success`: bool,

}

### Error Codes

| Error | Description |
| --- | --- |
| 100 | Invalid parameter |
| 190 | Invalid OAuth 2.0 Access Token |
| 368 | The action attempted has been deemed abusive or is otherwise disallowed |
| 200 | Permissions error |

On This Page

[Photo](https://developers.facebook.com/docs/graph-api/reference/photo/#overview)

[Reading](https://developers.facebook.com/docs/graph-api/reference/photo/#Reading)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/photo/#permissions)

[New Page Experience](https://developers.facebook.com/docs/graph-api/reference/photo/#new-page-experience)

[Feature Permissions](https://developers.facebook.com/docs/graph-api/reference/photo/#feature-permissions)

[Example](https://developers.facebook.com/docs/graph-api/reference/photo/#example)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/#parameters)

[Fields](https://developers.facebook.com/docs/graph-api/reference/photo/#fields)

[Edges](https://developers.facebook.com/docs/graph-api/reference/photo/#edges)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/#error-codes)

[Creating](https://developers.facebook.com/docs/graph-api/reference/photo/#Creating)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/#parameters-2)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/photo/#return-type)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/#error-codes-2)

[Updating](https://developers.facebook.com/docs/graph-api/reference/photo/#Updating)

[Deleting](https://developers.facebook.com/docs/graph-api/reference/photo/#Deleting)

[Permissions](https://developers.facebook.com/docs/graph-api/reference/photo/#permissions-2)

[Parameters](https://developers.facebook.com/docs/graph-api/reference/photo/#parameters-3)

[Return Type](https://developers.facebook.com/docs/graph-api/reference/photo/#return-type-2)

[Error Codes](https://developers.facebook.com/docs/graph-api/reference/photo/#error-codes-3)