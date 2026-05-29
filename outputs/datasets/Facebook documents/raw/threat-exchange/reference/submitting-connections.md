---
url: https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections
title: Submit Connections - ThreatExchange
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fthreat-exchange%2Freference%2Fsubmitting-connections%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

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

[Submit Connections Between Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#submit-connections-between-data)

[Use the UI](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#using-ui)

[Use the UI for Bulk Relations](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#ui-bulk-relations)

[Use the UI for Bulk Upload](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#ui-bulk-upload)

[Use the API](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#api-upload)

# Submit Connections Between Data

ThreatExchange supports creating connections (also known as **edges** or **relations**) between [ThreatIndicator](https://developers.facebook.com/docs/threat-exchange/reference/apis/threat-indicator) objects to express relationships. Examples of when this can be useful are for describing URL redirect chains or domain-to-IP-address relationships.

## Use the UI

When you connect one descriptor to another, you must own one or the other.

02. Within the **View**/ **Edit** popup for a given descriptor, you need the IDs of the descriptors to connect to. Start with any search results. In this case, `testing-relation-editing`.
03. Connect the first one to the next 2.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.8562-6/92026828_2297644133870665_8601004234550280192_n.png?_nc_cat=103&ccb=1-7&_nc_sid=f537c7&_nc_ohc=3dh0jaYd2_4Q7kNvwFm7dyG&_nc_oc=AdqkUzojiA43p0dFeWs_obclfmueq77wn3FtcjpUp7CZU-NM4ON6jtnoSP2okC2qm4g&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=0hfmq6oBnz-ZTaUDzvbqyA&_nc_ss=7b289&oh=00_Af4BCzmSpGdH5yp_iyH-scp1PLuu3cgWXyp8jMj5jG21lQ&oe=6A110D98)

08. Select the IDs of the next 2 descriptors and click **Copy IDs to clipboard**.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.8562-6/92439169_841961262956239_5393906812657336320_n.png?_nc_cat=100&ccb=1-7&_nc_sid=f537c7&_nc_ohc=cK_K868W-KUQ7kNvwG-kfOE&_nc_oc=Adpe95AGaWjI1V4hcaDrkh2U4XR9DFwFzQcWO7lqinWoGnKNP7ed1FE4cfyeXzkUFww&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=0hfmq6oBnz-ZTaUDzvbqyA&_nc_ss=7b289&oh=00_Af7xYMdyq7mbjQj1orcsReqnDti3dV6Q-LdRnhJM9aFHhA&oe=6A10FFB5)

13. Click **View**/ **Edit** on the first descriptor, paste the IDs, and then click **Add Relation** \> **OK**.

![](https://scontent-lax3-2.xx.fbcdn.net/v/t39.8562-6/92767151_223941412212809_57636923514028032_n.png?_nc_cat=103&ccb=1-7&_nc_sid=f537c7&_nc_ohc=ADjqLC_i2AEQ7kNvwEU_6X7&_nc_oc=AdoPLKsQHOq_x-7hr_yArrJqA8_GI3cEDMpx9a3QQAuD__AC3uJlSTH0oqfmz02EtkU&_nc_zt=14&_nc_ht=scontent-lax3-2.xx&_nc_gid=0hfmq6oBnz-ZTaUDzvbqyA&_nc_ss=7b289&oh=00_Af7TchvuNHx09Jap3yv9X1gfaZYxiKzNTd1EK_VCuo3Q8g&oe=6A111633)

The results are saved as in the following example.

![](https://scontent-lax7-1.xx.fbcdn.net/v/t39.8562-6/93211049_208682287228833_1893954374216974336_n.png?_nc_cat=101&ccb=1-7&_nc_sid=f537c7&_nc_ohc=1fc1w9evgXMQ7kNvwEISncJ&_nc_oc=AdrnS-3IUFFl9yhzA04teGF2i-kuG1J2k2KFvSgt4sLU7zjwpjtiBGYXKOEoygg_Eh8&_nc_zt=14&_nc_ht=scontent-lax7-1.xx&_nc_gid=0hfmq6oBnz-ZTaUDzvbqyA&_nc_ss=7b289&oh=00_Af58cIy9HFbiXVOQzp0XxnvirCYKF0fevakJd59tajZO6A&oe=6A11048D)

## Use the UI for Bulk Relations

Just as in the [Use the UI](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#using-ui) topic, you can assume that multiple descriptors are related to another one.

02. In the next example, do a query for a particular tag (can be any set of descriptors).
03. Click **Bulk relate**.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/101238717_550824072487381_6303279606879223808_n.png?_nc_cat=102&ccb=1-7&_nc_sid=f537c7&_nc_ohc=buk3B4qi9YoQ7kNvwHMwcPB&_nc_oc=Adq4ftYHZcjoH2O7tesVAX4iPp0d7kgNPOELzG-AfmIwYENpSd_md-oVEzupa8B7_Nw&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=0hfmq6oBnz-ZTaUDzvbqyA&_nc_ss=7b289&oh=00_Af5u-W12fHB_qwTLQUk3Nt46-1sKHAaPUOm_JL9jfcT-zQ&oe=6A11180B)

08. Supply the ID of the related-to indicator and click **OK**.

![](https://scontent-lax3-1.xx.fbcdn.net/v/t39.8562-6/101210326_253834952366085_2013443559847362560_n.png?_nc_cat=102&ccb=1-7&_nc_sid=f537c7&_nc_ohc=YkAQIvr-6w0Q7kNvwFy06Ss&_nc_oc=AdqAhpmStG5DhXz_9RHcdTbPzqyo4yL2lx5bsc5JDi_fWcRXW0YQR7lbTff60qHVkbk&_nc_zt=14&_nc_ht=scontent-lax3-1.xx&_nc_gid=0hfmq6oBnz-ZTaUDzvbqyA&_nc_ss=7b289&oh=00_Af5RMzDRr3drKnDkG1NoGARngkBFR1xxTvqLv5pfE7oQkw&oe=6A1117AC)

## Use the UI for Bulk Upload

These are optional columns you can use to bulk-relate (see also [Submit Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting):

- The descriptors you want to relate your new one to must already exist.
- You can specify the relate-to descriptors by ID using the `td_related_ids_for_upload` column.
- Alternatively, you can specify the related-to descriptors using the `td_related_triples_for_upload` column. Provide the owner-app ID, indicator type, and indicator text, which will uniquely identify the linked-to descriptors.

#### CSV Example (written vertically for convenience):

`td_description                Testing bulk upload
td_status                     NON_MALICIOUS
td_confidence                 100
td_severity                   INFO
td_share_level                AMBER
td_indicator_type             HASH_MD5
td_raw_indicator              e8b19da37825a3056e84c522f05eb000
td_visibility                 HAS_WHITELIST
td_subjective_tags            testing
td_whitelist_apps             494491891138576:Media Hash Sharing RF Test
td_privacy_groups
td_review_status              REVIEWED_MANUALLY
td_related_ids_for_upload     2515798535123892,2376386079125415
td_related_triples_for_upload

td_description                Testing bulk upload
td_status                     NON_MALICIOUS
td_confidence                 100
td_severity                   INFO
td_share_level                AMBER
td_indicator_type             HASH_MD5
td_raw_indicator              e8b19da37825a3056e84c522f05eb001
td_visibility                 HAS_WHITELIST
td_subjective_tags            pwny;testing
td_whitelist_apps             494491891138576:Media Hash Sharing RF Test
td_privacy_groups
td_review_status              REVIEWED_MANUALLY
td_related_ids_for_upload
td_related_triples_for_upload 494491891138576:HASH_MD5:e8b19da37825a3056e84c522f05eb000,494491891138576:HASH_MD5:e8b19da37825a3056e84c522f05eb002

`

#### JSON Example:

`[\
{\
    "td_description": "Testing bulk upload/relate",\
    "td_status": "NON_MALICIOUS",\
    "td_confidence": 100,\
    "td_severity": "INFO",\
    "td_share_level": "AMBER",\
    "td_indicator_type": "HASH_MD5",\
    "td_raw_indicator": "e8b19da37825a3056e84c522f05eb000",\
    "td_visibility": "HAS_WHITELIST",\
    "td_subjective_tags": ["testing"],\
    "td_whitelist_apps": [\
      {\
        "id": "494491891138576",\
        "name": "Media Hash Sharing RF Test"\
      }\
    ],\
    "td_privacy_groups": [],\
    "td_review_status": "REVIEWED_MANUALLY",\
    "td_related_ids_for_upload": ["2515798535123892","2376386079125415"]\
},\
{\
    "td_description": "Testing bulk upload/relate",\
    "td_status": "NON_MALICIOUS",\
    "td_confidence": 100,\
    "td_severity": "INFO",\
    "td_share_level": "AMBER",\
    "td_indicator_type": "HASH_MD5",\
    "td_raw_indicator": "e8b19da37825a3056e84c522f05eb001",\
    "td_visibility": "HAS_WHITELIST",\
    "td_subjective_tags": ["pwny", "testing"],\
    "td_whitelist_apps": [\
      {\
        "id": "494491891138576",\
        "name": "Media Hash Sharing RF Test"\
      }\
    ],\
    "td_privacy_groups": [],\
    "td_review_status": "REVIEWED_MANUALLY",\
    "td_related_triples_for_upload": [\
      {\
        "owner_app_id": "494491891138576",\
        "td_indicator_type": "HASH_MD5",\
        "td_raw_indicator": "e8b19da37825a3056e84c522f05eb000"\
      },\
      {\
        "owner_app_id": "494491891138576",\
        "td_indicator_type": "HASH_MD5",\
        "td_raw_indicator": "e8b19da37825a3056e84c522f05eb002"\
      }\
    ]\
}\
]

`

## Use the API

Using the API, you can create connections via an `HTTP POST` request to the `/related` URI for a specific object:

```code
https://graph.facebook.com/v2.8/<object_id>/related
```

In this example, create a connection between the `facebook.com` domain object (`788497497903212`) and the 173.252.120.6 IP address object (`1061383593887032`), which `facebook.com` can resolve to via DNS.

```code
https://graph.facebook.com/v2.8/788497497903212/related

POST DATA:
related_id=1061383593887032
&amp;access_token=<access_token>
```

Data returned:

```code
{
"success": true
}
```

On This Page

[Submit Connections Between Data](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#submit-connections-between-data)

[Use the UI](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#using-ui)

[Use the UI for Bulk Relations](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#ui-bulk-relations)

[Use the UI for Bulk Upload](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#ui-bulk-upload)

[Use the API](https://developers.facebook.com/docs/threat-exchange/reference/submitting-connections#api-upload)