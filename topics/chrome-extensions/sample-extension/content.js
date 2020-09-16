// content.js
var clientId;
var clientSecret;
var url;
var buttonAdded = false
var identityZone;
var uaaDomain;
var credentialElement;
var parentElement
var jwtClientCredentialsButton
var jwtUserButton
var jwtText
var jwtioLink


var receivedJWTClient
var receivedJWTUser

document.addEventListener("DOMSubtreeModified", function (event) {

    if (buttonAdded || document.getElementsByClassName("sapMInputBaseContentWrapper sapMInputBaseReadonlyWrapper") == null)
        return;

    let matches = document.querySelectorAll("div[id$='--credentials']")
    if (matches.length > 0 && !buttonAdded) {

        credentialElement = matches[0]
        parentElement = credentialElement.parentElement
        let indexOfString = credentialElement.textContent.lastIndexOf("}")
        let jsonRaw = credentialElement.textContent.substring(0, indexOfString + 1)

        // this happens only if a service has been selected with xsuaa credentials 
        let credentials
        if (jsonRaw.includes("\"uaa\": {")) {
            credentials = JSON.parse(jsonRaw)["uaa"]
        }
        // xsuaa binding has been selected
        else { 
            credentials = JSON.parse(jsonRaw) 
        }

        clientId = credentials["clientid"]
        clientSecret = credentials["clientsecret"]
        url = credentials["url"]
        uaaDomain = credentials["uaadomain"]
        identityZone = credentials["identityzone"]

        buttonAdded = true
        credentialElement.parentElement.insertAdjacentHTML("beforeend", "<button  style='margin-top: 10px;' id='credentialsJWT'  aria-pressed='true' class='sapMBtnBase sapMBtn sapUiSmallMarginBottom'><span class='sapMBtnInner sapMBtnHoverable sapMFocusable sapMBtnText sapMToggleBtnPressed sapMBtnDefault'><span  class='sapMBtnContent'><bdi >Get JWT Client Credentials Flow</bdi></span></span></button>")
        credentialElement.parentElement.insertAdjacentHTML("beforeend", "<button style='margin-top: 10px; margin-left:20px' id='userJWT'  aria-pressed='true' class='sapMBtnBase sapMBtn sapUiSmallMarginBottom'><span class='sapMBtnInner sapMBtnHoverable sapMFocusable sapMBtnText sapMToggleBtnPressed sapMBtnDefault'><span  class='sapMBtnContent'><bdi >Get JWT Authorization Code Flow</bdi></span></span></button>")

        jwtClientCredentialsButton = document.getElementById('credentialsJWT')
        jwtClientCredentialsButton.addEventListener('click', getJWTClientCredentials)

        jwtUserButton = document.getElementById('userJWT')
        jwtUserButton.addEventListener('click', getJWTUserFlow)

    }
});

function getJWTClientCredentials() {

    var oAuthUrl = url + "/oauth/token?grant_type=client_credentials"

    if (receivedJWTClient == null) {
        chrome.runtime.sendMessage({ 'oAuthURL': oAuthUrl, 'messageType': 'jwtClient', 'user': clientId, 'password': clientSecret }, function (response) {

            receivedJWTClient = response["token"]["access_token"]
            showJWTUI(receivedJWTClient)

        })
        return
    }

    showJWTUI(receivedJWTClient)
}

function getJWTUserFlow(token) {

    let oAuthUrl = url + "/oauth/authorize?response_type=code&redirect_uri=http%3A%2F%2Flocalhost:8080&client_id=" + encodeURI(clientId)
    let authorizeUrl = url + "/oauth/token?redirect_uri=http%3A%2F%2Flocalhost:8080&grant_type=authorization_code&code="
    if (receivedJWTUser == null) {
        chrome.runtime.sendMessage({ 'oAuthURL': oAuthUrl, 'messageType': 'jwtUser', 'user': clientId, 'password': clientSecret, 'authorizeUrl': authorizeUrl }, function (response) {

            receivedJWTUser = response["token"]["access_token"]
            showJWTUI(receivedJWTUser)

        })
        return
    }
    showJWTUI(receivedJWTUser)

}

function showJWTUI(token) {

    if (jwtText != null) {
        jwtText.remove()
        jwtioLink.remove()
    }
    
    let jwtTokenBody = token.split(".")[1];
    parentElement.insertAdjacentHTML("beforeend", "<div id='jwtText' class='sapMInputBaseContentWrapper sapMInputBaseReadonlyWrapper' style='width: 100%; height: 100%'><div class='sapMTextAreaMirror'> " + token + "</div><textarea readonly='readonly' style='height: 200px' rows='30' cols='300' class='sapMInputBaseInner sapMTextAreaInner sapMTextAreaGrow'>" + token + "</textarea></div>")
    parentElement.insertAdjacentHTML("beforeend", "<a id='jwtioLink' class='sapMLnk sapMLnkWrapping sapMLnkMaxWidth' target='_blank' href='https://jwt.io/?value=." + jwtTokenBody + "'>Show on jwt.io</a>")
    jwtText = document.getElementById("jwtText")
    jwtioLink = document.getElementById("jwtioLink")

}


