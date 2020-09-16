# Sample Extension for devtoberfest
This Chrome extension will simplify working with the XSUAA and its provided JWTs. The extension will add two buttons within the service instance view of the cockpit to get either a JWT with the **client credential flow** or the **authorization code flow**.

This is **NOT** an official Chrome Extension supported by SAP. This only serves as a sample extension for the devtoberfest. 

# How to install

1. Open the url chrome://extensions in your browser
2. Enable developer mode as this extension is not officially in the store
3. Click on "Load unpacked"
4. Select the cloned Git repository 
5. There is no 5th step

# Prerequisites

Your XSUAA instance needs to be able to redirect to *http://localhost:8080* 

Please add the redirect url to your xs-security.json! 

Example: 

```json
{
  "xsappname": " apptosolvethetravelingsalesmanproblem ",
  "tenant-mode": "dedicated",
  "description": "Security profile of called application",
  "scopes": [
    {
      "name": "uaa.user",
      "description": "UAA"
    }
  ],
  "role-templates": [
    {
      "name": "Token_Exchange",
      "description": "UAA",
      "scope-references": ["uaa.user"]
    }
  ],
  "oauth2-configuration": {
    "token-validity": 900,
    "redirect-uris": [
      "http*://*.applicationstudio.cloud.sap/**",
      "http*://**-apptosolvethetravelingsalesmanproblem-approuter.cfapps.sap.hana.ondemand.com/**",
      "http://localhost:8080"
    ]
  }
}
```

# Known issues

As the cockpit is a SPA there might be errors when navigating from one service instance to another. Just make a reload and everything should work like before. 

## Permissions

Right now the extension is restricted to work with the following urls: 

**Cockpit:**
- https://account.int.sap.hana.ondemand.com/*
- https://account.hana.ondemand.com/*
- https://account.int.sap.hana.ondemand.com/cockpit*
- https://account.hana.ondemand.com/cockpit*

**XSUAA**
- https://*.authentication.sap.hana.ondemand.com
- https://*.authentication.eu10.hana.ondemand.com/


If your XSUAA instance and/or cockpit is NOT within these URLs please maintain the content_scripts section and permissions section of the manifest.json to fulfill your needs! 

