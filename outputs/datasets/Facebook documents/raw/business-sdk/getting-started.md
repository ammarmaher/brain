---
url: https://developers.facebook.com/docs/business-sdk/getting-started
title: Get Started - Meta Business SDK
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

[LoginLoginLogin](https://business.facebook.com/business/loginpage/?is_work_accounts=true&login_options[0]=FB&login_options[1]=SSO&config_ref=biz_login_tool_flavor_dfc&app=436761779744620&next=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fbusiness-sdk%2Fgetting-started%3Fnav_ref%3Dbiz_unified_f3_login_page_to_dfc)

[Meta Business SDK](https://developers.facebook.com/docs/business-sdk)

- [Overview](https://developers.facebook.com/docs/business-sdk/overview)
- [Get Started](https://developers.facebook.com/docs/business-sdk/getting-started)
- [Ads Buying](https://developers.facebook.com/docs/business-sdk/common-scenarios/ads-buying)
- [Disable Crash Reports](https://developers.facebook.com/docs/business-sdk/guides/crash-reports)
- [Onboard Clients at Scale](https://developers.facebook.com/docs/business-sdk/common-scenarios/onboard-at-scale)
- [Switching Access Tokens](https://developers.facebook.com/docs/business-sdk/common-scenarios/token-switch)
- [Using Other APIs](https://developers.facebook.com/docs/business-sdk/common-scenarios/add-apis)
- [Support](https://developers.facebook.com/docs/business-sdk/faq)
- [Reference](https://developers.facebook.com/docs/business-sdk/reference)

On This Page

[Get Started with the Meta Business SDK](https://developers.facebook.com/docs/business-sdk/getting-started#get-started-with-the-meta-business-sdk)

[Before You Start](https://developers.facebook.com/docs/business-sdk/getting-started#before-you-start)

[Java](https://developers.facebook.com/docs/business-sdk/getting-started#java)

[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk)

[Create a Java Class](https://developers.facebook.com/docs/business-sdk/getting-started#create-a-java-class)

[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install)

[JavaScript (Node.js)](https://developers.facebook.com/docs/business-sdk/getting-started#js)

[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk-2)

[Modify the Project File](https://developers.facebook.com/docs/business-sdk/getting-started#modify-the-project-file)

[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install-2)

[PHP](https://developers.facebook.com/docs/business-sdk/getting-started#php)

[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk-3)

[Create a Project File](https://developers.facebook.com/docs/business-sdk/getting-started#create-a-project-file)

[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install-3)

[Python](https://developers.facebook.com/docs/business-sdk/getting-started#python)

[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk-4)

[Create a Project File](https://developers.facebook.com/docs/business-sdk/getting-started#create-a-project-file-2)

[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install-4)

[Ruby](https://developers.facebook.com/docs/business-sdk/getting-started#ruby)

[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk-5)

[Create a Project File](https://developers.facebook.com/docs/business-sdk/getting-started#create-a-project-file-3)

[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install-5)

[For Current Marketing API Users](https://developers.facebook.com/docs/business-sdk/getting-started#for-current-marketing-api-users)

[Java](https://developers.facebook.com/docs/business-sdk/getting-started#java-2)

[Nodejs](https://developers.facebook.com/docs/business-sdk/getting-started#nodejs)

[PHP](https://developers.facebook.com/docs/business-sdk/getting-started#php-2)

[Python](https://developers.facebook.com/docs/business-sdk/getting-started#python-2)

[Ruby](https://developers.facebook.com/docs/business-sdk/getting-started#ruby-2)

[Learn More](https://developers.facebook.com/docs/business-sdk/getting-started#learn-more)

# Get Started with the Meta Business SDK

This document explains how to install the Meta Business SDK and test the installation. SDKs are available for [Java](https://developers.facebook.com/docs/business-sdk/getting-started#java), [JavaScript](https://developers.facebook.com/docs/business-sdk/getting-started#js), [PHP](https://developers.facebook.com/docs/business-sdk/getting-started#php), [Python](https://developers.facebook.com/docs/business-sdk/getting-started#python), and [Ruby](https://developers.facebook.com/docs/business-sdk/getting-started#ruby). If you have the Marketing API already installed, learn how to [update to the Meta Business SDK](https://developers.facebook.com/docs/business-sdk/getting-started#for-current-marketing-api-users).

## Before You Start

You will need access to the following:

- A [Meta Developer Account](https://developers.facebook.com/docs/apps#register)

- A [registered](https://developers.facebook.com/docs/apps#app-id) Meta App with Basic settings configured

- Your [App Secret](https://developers.facebook.com/docs/facebook-login/security/#appsecret)

- An [Ad Account](https://www.facebook.com/ads/manager/accounts/)

- A [Page Access Token](https://developers.facebook.com/docs/facebook-login/access-tokens/)


## Java

For Java apps, you can use whatever development environment you like but it must support Maven builds.

### Install the SDK

To your Maven project, add the following XML code to the `dependency` section of your `pom.xml` file:

```xml
<!-- https://mvnrepository.com/artifact/com.facebook.business.sdk/facebook-java-business-sdk -->
<dependency>
    <groupId>com.facebook.business.sdk</groupId>
    <artifactId>facebook-java-business-sdk</artifactId>
    <version>[8.0.3,)</version>\
</dependency>\
```\
\
### Create a Java Class\
\
Under `src/main/java`, create a Java class called `TestFBJavaSDK`, and add the following code. Be sure to replace `{access-token}`, `{appsecret}`, and `{adaccount-id}` with your values.\
\
```java\
import com.facebook.ads.sdk.APIContext;\
import com.facebook.ads.sdk.APINodeList;\
import com.facebook.ads.sdk.AdAccount;\
import com.facebook.ads.sdk.Campaign;\
\
public class TestFBJavaSDK\
{\
    public static final APIContext context = new APIContext(\
            "{access-token}",\
            "{appsecret}"\
    );\
    public static void main(String[] args)\
    {\
        AdAccount account = new AdAccount("act_{{adaccount-id}}", context);\
        try {\
            APINodeList<Campaign> campaigns = account.getCampaigns().requestAllFields().execute();\
            for(Campaign campaign : campaigns) {\
                System.out.println(campaign.getFieldName());\
            }\
        } catch (Exception e) {\
            e.printStackTrace();\
        }\
    }}\
```\
\
### Test Your Install\
\
Build and run your app. You should see the result in your console logging window. If it complains about an expired token, request a new Page Access Token and retry.\
\
## JavaScript (Node.js)\
\
For JavaScript apps, the SDK is distributed as a [Node.js package](https://l.facebook.com/l.php?u=https%3A%2F%2Fdocs.npmjs.com%2Fgetting-started%2Finstalling-node&h=AUDZdW3ZHodqh9VYqV8ONhFoAtfS5y72bAw2pFNKjgX7IMyNoC5LIGw6zDiI3hwid1HIsV6ZdYKGUOG5ys25YpFk7tnXUy4rv-fNU2tfItBWXaruiTcbkDrJEfRMCbuWfvt-I_lSU771hQ).\
\
Open a command terminal window and create a new project folder. Create, configure, and install your project with the following command:\
\
```sh\
npm init\
```\
\
You can update your configuration settings later by editing the `package.json` file directly.\
\
### Install the SDK\
\
Install the SDK package with the following command:\
\
```sh\
npm install --save facebook-nodejs-business-sdk\
```\
\
### Modify the Project File\
\
Open the `index.js` file and add the following code. Replace `{access-token}`, and `{adaccount-id}` with your values.\
\
```js\
const bizSdk = require('facebook-nodejs-business-sdk');\
\
const accessToken = '{access-token}';\
const accountId = 'act_{{adaccount-id}}';\
\
const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);\
const AdAccount = bizSdk.AdAccount;\
const Campaign = bizSdk.Campaign;\
\
const account = new AdAccount(accountId);\
var campaigns;\
\
account.read([AdAccount.Fields.name])\
  .then((account) =>{\
    return account.getCampaigns([Campaign.Fields.name], { limit: 10 }) // fields array and params\
  })\
  .then((result) =>{\
    campaigns = result\
    campaigns.forEach((campaign) =>console.log(campaign.name))\
  }).catch(console.error);\
```\
\
### Test Your Install\
\
Test your install with the following command:\
\
```sh\
 node index.js\
```\
\
You should see the result in your terminal window. If it complains about an expired token, request a new Page Access Token and retry.\
\
## PHP\
\
For PHP apps, use [Composer](https://l.facebook.com/l.php?u=https%3A%2F%2Fgetcomposer.org%2Fdownload%2F&h=AUBRGO35cbnU9UeVxdxew7aYdLdmvwuAwOxq7OAYbvlMikG5vNZrri0QbA5lOnFpnZNKNXR2bE6zM_p-Aqmic-NxRpFX-Q1zU1wVWugsnmql5G98LfLOK5BmMArIyq7uQzPGtcaNqy_tIQ) to install the SDK.\
\
### Install the SDK\
\
In a new project folder, create `composer.json` with the following content. Replace `{project-name}`, `{Your Name}`, and `{your@email.com}` with your values.\
\
```js\
{\
    "name": "name/{project-name}",\
    "type": "project",\
    "require": {\
        "facebook/php-business-sdk": "^8.0.3"\
    },\
    "authors": [\
        {\
            "name": "{Your Name}",\
            "email": "{your@email.com}"\
        }\
    ]\
}\
```\
\
Install the SDK by running the following command in your terminal window:\
\
```sh\
composer install\
```\
\
### Create a Project File\
\
Create a `src/test.php` file with the following content. Replace `{app-id}`, `{access-token}`, `{appsecret}`, and `{adaccount-id}` with your values.\
\
```php\
<?php\
require_once __DIR__ . '/../vendor/autoload.php';\
use FacebookAds\Api;\
use FacebookAds\Logger\CurlLogger;\
use FacebookAds\Object\AdAccount;\
use FacebookAds\Object\Campaign;\
use FacebookAds\Object\Fields\CampaignFields;\
\
$app_id = "{app-id}";\
$app_secret = "{appsecret}";\
$access_token = "{access-token}";\
$account_id = "act_{{adaccount-id}}";\
\
Api::init($app_id, $app_secret, $access_token);\
\
$account = new AdAccount($account_id);\
$cursor = $account->getCampaigns();\
\
// Loop over objects\
foreach ($cursor as $campaign) {\
  echo $campaign->{CampaignFields::NAME}.PHP_EOL;\
}\
```\
\
### Test Your Install\
\
Test your install with the following command:\
\
```sh\
php src/test.php\
```\
\
You should see the result in your terminal window. If it complains about an expired token, request a new Page Access Token and retry.\
\
## Python\
\
For Python apps, the SDK is distributed as a [pypi module](https://l.facebook.com/l.php?u=https%3A%2F%2Fpip.pypa.io%2Fen%2Fstable%2Finstalling&h=AUB2jPfgDUz59OnAx8xZvEysZdajIFFoChp_qaCzoqPY6irG2xG2BVwdQQg4EmcqDSU_JhtJ2cMCQsurxEVHsWRUtYJaii8FGPbJboqh1m9luo5aEztJtfrn1rk_FIyNiygsMEBOudxnXA), so make sure to have pip installed. Depending on your system, you may need to setup `virtualenv`, `pyenv` or `conda`.\
\
### Install the SDK\
\
Install the SDK with the following command.\
\
```sh\
pip install facebook_business\
```\
\
### Create a Project File\
\
Create the `test.py` file with the following content. Replace `{app-id}`, `{access-token}`, `{appsecret}`, and `{adaccount-id}` with your values.\
\
```python\
from facebook_business.api import FacebookAdsApi\
from facebook_business.adobjects.adaccount import AdAccount\
\
my_app_id = '{app-id}'\
my_app_secret = '{appsecret}'\
my_access_token = '{access-token}'\
FacebookAdsApi.init(my_app_id, my_app_secret, my_access_token)\
my_account = AdAccount('act_{{adaccount-id}}')\
campaigns = my_account.get_campaigns()\
print(campaigns)\
```\
\
### Test Your Install\
\
Test your install with the following command:\
\
```sh\
python test.py\
```\
\
You should see the result in your terminal window. If it complains about an expired token, request a new Page Access Token and retry.\
\
## Ruby\
\
For Ruby, the SDK is distributed as a [RubyGem package](https://l.facebook.com/l.php?u=https%3A%2F%2Frubygems.org%2Fpages%2Fdownload&h=AUDv6s4lrhYh8smUBnvft2dLkW2_5RcKBSeg_UTVglFmT0M4myzD7RIqLovUuhzSyitD98ShNHiAooY3aRX2-9ord9mYfnT_qPbbw44FO5HUGP-n4o-9UEMqx8B1bH3thvc2yYpzEwqg9G5POVYWAqPmjUQ).\
\
### Install the SDK\
\
From a terminal window, run the following command from your project folder to install the Meta Business SDK for Ruby. Depending on your environment, you may need to setup rbenv or rvm, or use `sudo` before the command.\
\
```sh\
gem install facebookbusiness\
```\
\
### Create a Project File\
\
Create a `test.rb` file with the following content. Replace `{access-token}`, `{appsecret}`, and `{adaccount-id}` with your values.\
\
```ruby\
require 'facebookbusiness'\
FacebookAds.configure do |config|\
  config.access_token = '{access-token}'\
  config.app_secret = '{appsecret}'\
end\
\
ad_account = FacebookAds::AdAccount.get('act_{{adaccount-id}}', 'name')\
ad_account.campaigns(fields: 'name').each do |campaign|\
  puts campaign.name\
end\
```\
\
### Test Your Install\
\
Test your install with the following command:\
\
```sh\
ruby test.rb\
```\
\
You should see the result in your terminal window. If it complains about an expired token, request a new Page Access Token and retry.\
\
## For Current Marketing API Users\
\
To update to the Meta Business SDK from the Marketing API follow these steps.\
\
### Java\
\
In the the `pom.xml` file:\
\
- Update `groupId` from `com.facebook.ads.sdk` to `com.facebook.business.sdk`\
- Update `artifactId` from `facebook-java-ads-sdk` to `facebook-java-business-sdk`\
- Update `version` to `v8.0.3`\
\
### Nodejs\
\
In the `package.json` file:\
\
- Update `facebook-nodejs-ads-sdk` to `facebook-nodejs-business-sdk:v8.0.2`\
- Update all references of the package name `facebook-nodejs-ads-sdk`, such as `require('facebook-nodejs-ads-sdk')`, to `facebook-nodejs-business-sdk`\
- Run `npm install`\
\
### PHP\
\
In the `composer.json` file:\
\
- Update `facebook-ads-sdk` to `facebook-business-sdk` with version 8.0.3\
\
### Python\
\
- Run `pip install facebook_business`\
- Update all references to the namespace `facebookads` to `facebook_business`\
- If you have an `.egg-info` file, update it from `facebookads-*.egg-info` to the newly installed `egg-info` file such as `facebook_business-*.egg-info`\
\
### Ruby\
\
- Run `gem install facebookbusiness`\
- Update all references from `require('facebook_ads')` to `require('facebookbusiness')`\
\
## Learn More\
\
View the source code for the Meta Business SDK at Github.\
\
|     |     |\
| --- | --- |\
| - [Java Business SDK from Meta](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-java-business-sdk&h=AUCSLtMSGzam5cp-aKNWI6ZnJzHBxBfDrBdzPk2FsmzvrIQkJt_b2cKpLL7WmrlnxbGgu2qr4APdqyUkB9hWEy7SAtCiqs1e8XHLaF5Ln7YcLBxZMYV8eRlLSd7VHtx3KoQFx6VPKv-UAQ)<br>  <br>- [JavaScript Business SDK from Meta](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-nodejs-business-sdk&h=AUAs8_ydwmZIHeJjrmIPjCuMqR9Rclvb7s-bIRIhL3c-hT8Wmo-esyViZCI4Bzmo5x3NTIUVpEb-yAS4lieiiSWHfwSWXV6Khi_2T-JPuOt-zZaZr1aN0up-p9vEdYjaFmaQMHKoKGqm7w)<br>  <br>- [PHP Business SDK from Meta](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-php-business-sdk&h=AUBUUIUt9qTTzhE7-vpUoJX-b778iXWp2LyJjXKVLLlCO6DcQMg5_mNtnJ5haWJQDy5eOoAvxTbucAtqqYajW5qNHcD1j2MyQl54ECTJKpbnGyrHHn_GzDOACDNcXVnxFSyVB8dTkjzg4g) | - [Python Business SDK from Meta](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-python-business-sdk&h=AUDJW5eCY0F307d4VdokY8y-cJgr_z4N5OvO7tR-D5eNPJG1JXV930IgIitUQXuko_yX-q8OQFzSafwuIEzsvJfndjeJuepZMO8IjZV6FxfGmUUP09dSOT9B54ZsFLYK4V7vFG9MfuV32g)<br>  <br>- [Ruby Business SDK from Meta](https://l.facebook.com/l.php?u=https%3A%2F%2Fgithub.com%2Ffacebook%2Ffacebook-ruby-business-sdk&h=AUDXNxHjmnJMb3w5LYtDYvJ2aHJmfS4AAAyo12FgfxCp2u0yYhhubIfgoSanpt9ALZr5pQ19XauWuvP2wn8Asujyk00ThMP1xlDdGMFVxVp_zsjPjsvItEJZiBf64ibw02MQAIJjulOeNg) |\
\
On This Page\
\
[Get Started with the Meta Business SDK](https://developers.facebook.com/docs/business-sdk/getting-started#get-started-with-the-meta-business-sdk)\
\
[Before You Start](https://developers.facebook.com/docs/business-sdk/getting-started#before-you-start)\
\
[Java](https://developers.facebook.com/docs/business-sdk/getting-started#java)\
\
[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk)\
\
[Create a Java Class](https://developers.facebook.com/docs/business-sdk/getting-started#create-a-java-class)\
\
[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install)\
\
[JavaScript (Node.js)](https://developers.facebook.com/docs/business-sdk/getting-started#js)\
\
[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk-2)\
\
[Modify the Project File](https://developers.facebook.com/docs/business-sdk/getting-started#modify-the-project-file)\
\
[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install-2)\
\
[PHP](https://developers.facebook.com/docs/business-sdk/getting-started#php)\
\
[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk-3)\
\
[Create a Project File](https://developers.facebook.com/docs/business-sdk/getting-started#create-a-project-file)\
\
[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install-3)\
\
[Python](https://developers.facebook.com/docs/business-sdk/getting-started#python)\
\
[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk-4)\
\
[Create a Project File](https://developers.facebook.com/docs/business-sdk/getting-started#create-a-project-file-2)\
\
[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install-4)\
\
[Ruby](https://developers.facebook.com/docs/business-sdk/getting-started#ruby)\
\
[Install the SDK](https://developers.facebook.com/docs/business-sdk/getting-started#install-the-sdk-5)\
\
[Create a Project File](https://developers.facebook.com/docs/business-sdk/getting-started#create-a-project-file-3)\
\
[Test Your Install](https://developers.facebook.com/docs/business-sdk/getting-started#test-your-install-5)\
\
[For Current Marketing API Users](https://developers.facebook.com/docs/business-sdk/getting-started#for-current-marketing-api-users)\
\
[Java](https://developers.facebook.com/docs/business-sdk/getting-started#java-2)\
\
[Nodejs](https://developers.facebook.com/docs/business-sdk/getting-started#nodejs)\
\
[PHP](https://developers.facebook.com/docs/business-sdk/getting-started#php-2)\
\
[Python](https://developers.facebook.com/docs/business-sdk/getting-started#python-2)\
\
[Ruby](https://developers.facebook.com/docs/business-sdk/getting-started#ruby-2)\
\
[Learn More](https://developers.facebook.com/docs/business-sdk/getting-started#learn-more)