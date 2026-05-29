---
url: https://developers.facebook.com/docs/content-library-and-api/get-access/computing-platform-comparison
title: Secure computing platforms - Meta Content Library and API
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fcontent-library-and-api%2Fget-access%2Fcomputing-platform-comparison%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Content Library and API](https://developers.facebook.com/docs/content-library-and-api)

- [Get access](https://developers.facebook.com/docs/content-library-and-api/get-access)


  - [MCL application guide](https://developers.facebook.com/docs/content-library-and-api/get-access/mcl-application-guide)
  - [Secure computing platforms](https://developers.facebook.com/docs/content-library-and-api/get-access/computing-platform-comparison)

- [Quick links](https://developers.facebook.com/docs/content-library-and-api/quick-links)
- [Content Library](https://developers.facebook.com/docs/content-library-and-api/content-library)
- [Content Library API](https://developers.facebook.com/docs/content-library-and-api/content-library-api)
- [Appendix](https://developers.facebook.com/docs/content-library-and-api/appendix)
- [Support](https://developers.facebook.com/docs/content-library-and-api/support)
- [Disclosures and disclaimers](https://developers.facebook.com/docs/content-library-and-api/disclosures-disclaimers)
- [Citations](https://developers.facebook.com/docs/content-library-and-api/citations)
- [Changelog](https://developers.facebook.com/docs/content-library-and-api/changelog)

On This Page

[Secure computing platforms](https://developers.facebook.com/docs/content-library-and-api/get-access/computing-platform-comparison#secure-computing-platforms)

[Learn More](https://developers.facebook.com/docs/content-library-and-api/get-access/computing-platform-comparison#learn-more)

# Secure computing platforms

When you apply for access to Meta Content Library (MCL) API, you can choose whether to access the API hosted on [Meta Secure Research Environment (SRE)](https://developers.facebook.com/docs/secure-research-environment) or the [SOMAR Virtual Data Enclave](https://l.facebook.com/l.php?u=https%3A%2F%2Fsomar.atlassian.net%2Fwiki%2Fspaces%2Fsomardocs%2Fpages%2F249397299%2FSOMAR%2BData%2BAccess%2BApplication%2BGuide%23Virtual-Data-Enclave-%28VDE%29---data-access-only-available-in-a-secure-virtual-environment&h=AUAYwsb0BL-sK4IBV_Do0lRFe_57o09Kj-q8HeYxBUTA0Tb63bWxbBOI6RGEDWDQy-k5goQ148nloDqileDGstBYJEbtyQxBQ1yJqsGtxc6oYp2fyPPiGKL5gc5yMGhS7pIKkTib2Z6G1w). You will only be able to access MCL API on one secure computing platform based on the lead researcher’s selection in the MCL application. All collaborators under a single lead researcher must use the same secure computing platform to access MCL API. If you are approved for multiple research programs, you must use the same secure computing platform for all of these.

SRE offers a browser-based interface through Amazon WorkSpaces Secure Browser, without requiring a VPN. Researchers can use a Jupyter notebook environment with free computation, enabling analysis using familiar tools like Python and R. SRE also offers [automated export review](https://developers.facebook.com/docs/researcher-platform/features/notebook-export) for certain data types.

The following table summarizes the differences between the two platforms. Note that the features available on both platforms are subject to change.

| Feature | SOMAR Virtual Data Enclave | Meta Secure Research Environment |
| --- | --- | --- |
| Meta Content Library API data coverage | Full [data scope](https://developers.facebook.com/docs/content-library-and-api/content-library-api/overview) accessible | Full [data scope](https://developers.facebook.com/docs/content-library-and-api/content-library-api/overview) accessible |
| Platform and computation | - Access the cloud-based data enclave through a virtual desktop<br>  <br>- Use R, RStudio, Python, JupyterLab, Jupyter Notebooks and Stata | - Access SRE with a modified version of Jupyter within an Amazon WorkSpaces Secure Browser instance for browser-based computation<br>  <br>- Use R, Python and Stata |
| Available machine learning models | - Machine learning models available by request<br>  <br>- Models go through an ICPSR security review before upload to your VDE<br>  <br>- Requested models must align with ICPSR’s LLM Policy | - Download approved pre-trained machine learning models into your Jupyter environment from the Hugging Face® Hub |
| Available packages | - Install Python packages from PyPI with `pip`<br>- Install R packages with CRAN | - Install Python packages from PyPI with `pip`<br>- Install R packages with CRAN and `conda` |
| Available GPUs/CPU | - Offers CPU and GPU instances<br>  <br>- Free computation through December 31, 2025<br>  <br>- Starting January 2026, costs per research team will be:<br>   <br>  <br>  - 371 USD per month of VDE usage<br>    <br>  - 1000 USD one-time fee for new VDE projects, due at project start (applies only to VDEs created in January 2026 or later) | - Choose between CPU and GPU instances <br>- Access free computation |
| Export of research outputs | - Data disclosure review of all materials requested for export<br>  <br>- Email [somar-help@umich.edu](mailto:somar-help@umich.edu) to request an output review<br>  <br>- Can approve code, graphs, figures, charts, tables, abstracts and summary statistics<br>  <br>- Raw data export is not permitted | - Automated export of scrubbed notebooks that contain files of code, graphs, figures, charts and images (but not tables or summary statistics) <br>- Raw data export is not permitted<br>- Data disclosure review capabilities \[Anticipated early 2026\] |
| Code upload | - Code files can be uploaded by request, following a security review by SOMAR | - Paste code into the environment from the outside. <br>  Data upload review capabilities \[Anticipated early 2026\] |
| Data deletion | - Data that have been removed from Meta Content Library (for example, deleted posts) are required to be deleted every 180 days.<br>- Researchers delete respective data from their notebooks and certify their execution of deletion to SOMAR.<br>- This deletion requirement does not apply to researchers with approved research projects that contribute to the detection, identification, and understanding of systemic risks in the European Union. | - Meta will effectuate data deletion on researchers’ Jupyter notebooks every month. Removal of output cells and local files takes place automatically on the 1st of every month.<br>- This deletion requirement does not apply to researchers with approved research projects that contribute to the detection, identification, and understanding of systemic risks in the European Union. |
| Collaboration for research teams | - Collaborate with other members of your research team inside a shared enclave instance.<br>- Individuals receive their own home directories<br>- Share any file among your team members | - [Collaborate](https://developers.facebook.com/docs/researcher-platform/features/collaboration) and share notebooks and files with other members of your research team using a shared folder.<br>- Jupyter lab instances are individual. |

## Learn More

- [Meta Secure Research Environment](https://developers.facebook.com/docs/secure-research-environment)
- [SOMAR Virtual Data Enclave](https://l.facebook.com/l.php?u=https%3A%2F%2Fsomar.atlassian.net%2Fwiki%2Fspaces%2Fsomardocs%2Fpages%2F249397299%2FSOMAR%2BData%2BAccess%2BApplication%2BGuide%23Virtual-Data-Enclave-%28VDE%29---data-access-only-available-in-a-secure-virtual-environment&h=AUDHgyk45K7ZM3O_jFkjntW_aBB6-a3e_9eJ4MEjG117cJYkCwF7HZiqolccfLbR8Jv5x_ED4dBcZGYO86KV1dbydjpmyT97JQBdVbiJN0sLBhEBU9hWTOyz5Kc5zNu7V9bnuX0ZkrWycg)
- [Amazon Workspaces Secure Browser](https://developers.facebook.com/docs/researcher-platform/secure-browser)
- [Meta Content Library API](https://developers.facebook.com/docs/content-library-and-api/content-library-api)

On This Page

[Secure computing platforms](https://developers.facebook.com/docs/content-library-and-api/get-access/computing-platform-comparison#secure-computing-platforms)

[Learn More](https://developers.facebook.com/docs/content-library-and-api/get-access/computing-platform-comparison#learn-more)