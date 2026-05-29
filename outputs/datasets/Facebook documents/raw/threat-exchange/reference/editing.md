---
url: https://developers.facebook.com/docs/threat-exchange/reference/editing
title: Editing Existing Data - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fediting%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[ThreatExchange](https://developers.facebook.com/docs/threat-exchange)

- [Get Access](https://developers.facebook.com/docs/threat-exchange/getting-access)
- [Get Started](https://developers.facebook.com/docs/threat-exchange/getting-started)
- [Best Practices](https://developers.facebook.com/docs/threat-exchange/best-practices)
- [UI Overview](https://developers.facebook.com/docs/threat-exchange/ui)
- [UI Reference](https://developers.facebook.com/docs/threat-exchange/reference/ui)
- [API Overview](https://developers.facebook.com/docs/threat-exchange/api)
- [API Structure](https://developers.facebook.com/docs/threat-exchange/api-structure)
- [API Reference](https://developers.facebook.com/docs/threat-exchange/reference/apis)
- [Privacy Controls](https://developers.facebook.com/docs/threat-exchange/reference/privacy)
- [Submit Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting)
- [Editing Existing Data](https://developers.facebook.com/docs/threat-exchange/reference/editing)
- [Delete Data](https://developers.facebook.com/docs/threat-exchange/reference/deleting)
- [Reshare Controls](https://developers.facebook.com/docs/threat-exchange/reference/resharing)
- [React to Data](https://developers.facebook.com/docs/threat-exchange/reference/reacting)
- [Submit Connections](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections)
- [Vendors](https://developers.facebook.com/docs/threat-exchange/reference/vendors)
- [FAQ](https://developers.facebook.com/docs/threat-exchange/FAQ)
- [Changelog](https://developers.facebook.com/docs/threat-exchange/reference/changelog)

On This Page

[Editing existing data](https://developers.facebook.com/docs/threat-exchange/reference/editing#editing_existing_data)

[Editing single threat descriptors using the UI](https://developers.facebook.com/docs/threat-exchange/reference/editing#editing-single-threat-descriptors-using-the-ui)

[Bulk-editing using the UI](https://developers.facebook.com/docs/threat-exchange/reference/editing#bulk-editing-using-the-ui)

[Cloning and duplicating](https://developers.facebook.com/docs/threat-exchange/reference/editing#cloning-and-duplicating)

[Using the API, option 1](https://developers.facebook.com/docs/threat-exchange/reference/editing#using-the-api--option-1)

[Using the API, option 2](https://developers.facebook.com/docs/threat-exchange/reference/editing#using-the-api--option-2)

# Editing existing data

The ThreatExchange API allows for editing existing [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) objects. As with all Facebook Graph APIs, editing is performed via an HTTP POST request to the object's unique ID URL.

## Editing single threat descriptors using the UI

Using any of various search mechanisms, identify a descriptor you own and click the Edit button:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/72676586_2435678220037426_4788489455268790272_n.png?_nc_cat=110&ccb=1-7&_nc_sid=f537c7&_nc_ohc=8HhdvoK_WM0Q7kNvwE-tfwT&_nc_oc=Adq5ci_lVc_4aHBoOEmOstetfI1DpUn2WadcJ60YvKlc12wNVUmB8C0UmQCT2PKk-Go&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af6Z57ERO6jAqNRJjznrNpyQLHwDV3OS0LPXaWZtwzIzqQ&oe=6A10F780)

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/73523221_1711104992356549_1544356027871264768_n.png?_nc_cat=109&ccb=1-7&_nc_sid=f537c7&_nc_ohc=1oHERoMcJK8Q7kNvwGrHG8x&_nc_oc=AdojSUPvTsQD0Hbh19KCUD6dM88DcaHLRDxc7MMBM1o1A5yOmeT9_0FA4M9s0ilZ-b0&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af6o4WMNWKMOKFpOUeWJLwRWthxRGy-4ueDD3_-pMDOvxQ&oe=6A110EF9)

Then, fields are editable as in the Create pop-up:

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/72791998_537079773501712_1639682436163960832_n.png?_nc_cat=104&ccb=1-7&_nc_sid=f537c7&_nc_ohc=Oe9KkpE_1YoQ7kNvwGFbTJr&_nc_oc=Adol5H21ngCTt1Kvh68tyKRt7EjiEkvKJNWlQPI9hey_aLzIzwjEA9V3icCcCLQZf8s&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af5BLno8ay6ErBydpi3g-fYSMwf4R6pGuZBP7vwwNukMJQ&oe=6A110F77)

## Bulk-editing using the UI

First, perform any descriptor-search, then choose "Bulk edit". All descriptors in the search that are owned by you (if any) will be bulk-editable.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/82982018_704764803392774_3806316475753431040_n.png?_nc_cat=102&ccb=1-7&_nc_sid=f537c7&_nc_ohc=MzSH9u5FqAsQ7kNvwGDW7gq&_nc_oc=AdqI6RESEwBQXpXngtb7MMOEFz80IEQ4X9KV8BK0bVWmEAgRi4a-aWiVfICjIWNSbo4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af7IHEeW4syRp0nC9V_QABnIakRhx72xv_sjdF1TIFFj6A&oe=6A111F5A)

Choose "Select all", then "Bulk-revise selected items".

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/82472765_514219312778063_3027736362091544576_n.png?_nc_cat=108&ccb=1-7&_nc_sid=f537c7&_nc_ohc=yOfRXUj9RrsQ7kNvwFuk4hQ&_nc_oc=AdrwTAUO0OSxP6d1GvxGhgwLM3Mbz97WNpfzYe6AAYhe8p95WYhLh6s_y96q9gk-Eo8&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af4wJW93EN50uvGqQ8uFT8Vno6HlcL25V-ZVZtrugQlU5w&oe=6A10FE06)

At this point you can edit various attributes. Here, we show that the collection being edited has multiple values for Severity; we can set them all to the same value if we like -- say, INFO. To continue the example, let's add a new tag -- `testing-bulk-edit-for-doc` \-\- to all selected descriptors.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.8562-6/82868947_458626238144406_8183476084155613184_n.png?_nc_cat=100&ccb=1-7&_nc_sid=f537c7&_nc_ohc=kTHdXrVbadYQ7kNvwEoh4sn&_nc_oc=Adr-4gQU9voTxGmebF69J-AzYLXWzS0Nz9wpcCXlXuwsKVjBr8nzKxZ2DOtUiyUytRc&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af5jcQf036rAGV7aSaf0RnnnPyJyTcC672u2JncqgBlhyQ&oe=6A111D15)

In the create-tag popup we can fill out the attributes and then hit OK.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/82807038_2686058038128977_8053256661470543872_n.png?_nc_cat=108&ccb=1-7&_nc_sid=f537c7&_nc_ohc=r4r2U8T_voUQ7kNvwHU3bdY&_nc_oc=AdpMnFIWZd1BfNIdc4vAKs8dVYxMUIxvyGkNbMvyjWgMQqyz6IBMkxl5rvsrodkbo_4&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af5TNjiO1oE9QmmMdFNjGepssHQljJ_sFhooFk824QQ-RA&oe=6A111A41)

Having bulk-edited some attributes, we can OK the bulk-edit popup.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.8562-6/82475003_2304477649842647_732263057492803584_n.png?_nc_cat=100&ccb=1-7&_nc_sid=f537c7&_nc_ohc=G9pVu_HoY3YQ7kNvwGRbDhI&_nc_oc=AdqH1IpPtux_GOO5JIyoyJVHlbBKERDfQ_Hm9i9xTpkSAVAr0YNx1L08Yk7gbzqOXjw&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af5yPE1IoHbZlCe3B-BsLk2tikCcz4De1hEA981zdR5LZQ&oe=6A111167)

We can now continue editing if we like -- perhaps select any particular descriptor and revise it further using the "Revise" button on a given row. (Or we can abandon the edits entirely -- they're still browser-local only, not yet saved to ThreatExchange.) Instead, let's go ahead and save our changes.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.8562-6/82435726_781223942381987_7922247544623595520_n.png?_nc_cat=103&ccb=1-7&_nc_sid=f537c7&_nc_ohc=a7v6dp2EIMEQ7kNvwGcYI8s&_nc_oc=AdrQIp_cj8qt7sRKSoyFBzYaZPNo_jESfrHtI6jTmbEN7GKMxMwTdkX3odG-A_x-2l8&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af7d5tGc3WattgM1u6u9QsQuzI5m04albJDkzSWSshL4Yg&oe=6A1103A6)

We now see the committed descriptors along with their IDs.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.8562-6/82517247_2581853465404565_1219055913541828608_n.png?_nc_cat=105&ccb=1-7&_nc_sid=f537c7&_nc_ohc=JeKz8B24-G0Q7kNvwHW1W_6&_nc_oc=AdqIpXASCmEpj4Hk0PAf_vU4gxivet32T_t9fBWxSQd84sSV2nLJ20J3vMOOSowrJdg&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af5Qfom2M8HhM6BIQTPtgXTzgSu87Tx3sBrlJXG1ssh5sA&oe=6A10F1C7)

## Cloning and duplicating

Once you've found a threat descriptor, you may wish to publish a modified copy of it. We use the terms "cloning" for making a copy of your own descriptor (perhaps changing the indicator-text, for example) and "duplicating" for making a copy of someone else's (perhaps changing subjective parameters such as your view of the malicious, the first-active-timestamp, etc.). Regardless, though, Clone and Duplicate both create new threat descriptors owned by you.

Here we search for descriptors visible to us with tag `testing`, then select one to clone.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/82648013_2548215208639160_2984107440053682176_n.png?_nc_cat=109&ccb=1-7&_nc_sid=f537c7&_nc_ohc=Tzo-GhEh6VoQ7kNvwF2zja-&_nc_oc=AdqfjmOhxluu9zUdS6hvPHxO4EnfWRjr1LfZiIM7qLCnyq14HrAM_XlQWRRgc6CKcC0&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af7An4JV4Owhou9qw7TSkYJuuTFac5wvgpuDONGwGa-2pw&oe=6A111A0D)

The clone popup is simply a create-descriptor popup -- pre-populated with the cloned-from descriptor's attributes. We can edit whatever we like, then hit OK.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/82522224_761316141048558_2390402299567538176_n.png?_nc_cat=109&ccb=1-7&_nc_sid=f537c7&_nc_ohc=vB5k7RsZktYQ7kNvwGw3MqF&_nc_oc=AdpgJGamDEAoEaKYU1ZWBUOmr7xldFWfO1Tv1HMiD8Uwh94WQ3ao6oa_-4TdOUtYvb8&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af4wpxqksEkyxl2sD4_-OUcAmLfhoYPCbzVCz3gJC40btg&oe=6A111012)

Once we hit OK we've got a new descriptor owned by us. We can then go on to duplicate it, if we like.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.8562-6/82917926_2984460101566156_4126957413855133696_n.png?_nc_cat=100&ccb=1-7&_nc_sid=f537c7&_nc_ohc=WzfL31LOlkoQ7kNvwH2PBxZ&_nc_oc=AdoP4lZlwHksr2ZciH0nDU7tbzsZ1jnbp6bB5mzLPHfV5Z0Guq1TliBIxnq3CL1vtZQ&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=y8gIpeqWZYU9qYiOvPH1HA&_nc_ss=7b289&oh=00_Af7G5t3P5kCGIG4w659U3wb20oyXhsojkKH8OYGcUf1BBQ&oe=6A111EA1)

## Using the API, option 1

In this example, we are updating the description field of [ThreatDescriptor](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-descriptor) object with ID `3047058802049882`:

```code
curl -s -X POST \
'https://graph.facebook.com/v4.0/3047058802049882/'\
'?access_token=REDACTED'\
'&description=Updating+description'
```

Data returned:

```code
{
"success": true
}
```

## Using the API, option 2

You can use the same API call as in [Submitting Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting).

- If you do that -- resubmit data with the same indicator-type and indicator-text, but different values for other fields -- the same threat descriptor will be edited.

- It will insist that you pass it all the minimum parameters necessary for creating a new descriptor even if you only want to edit one attribute of an existing descriptor.

- Thus, option 1 is preferred if you want to only specify a single attribute to update.


On This Page

[Editing existing data](https://developers.facebook.com/docs/threat-exchange/reference/editing#editing_existing_data)

[Editing single threat descriptors using the UI](https://developers.facebook.com/docs/threat-exchange/reference/editing#editing-single-threat-descriptors-using-the-ui)

[Bulk-editing using the UI](https://developers.facebook.com/docs/threat-exchange/reference/editing#bulk-editing-using-the-ui)

[Cloning and duplicating](https://developers.facebook.com/docs/threat-exchange/reference/editing#cloning-and-duplicating)

[Using the API, option 1](https://developers.facebook.com/docs/threat-exchange/reference/editing#using-the-api--option-1)

[Using the API, option 2](https://developers.facebook.com/docs/threat-exchange/reference/editing#using-the-api--option-2)