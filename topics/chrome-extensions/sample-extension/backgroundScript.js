var singleTabListener

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {

        if (request.messageType === 'jwtClient') {

            fetch(request.oAuthURL, {
                headers: new Headers({
                    "Authorization": "Basic " + btoa(request.user + ":" + request.password)
                }
                )
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                    sendResponse({ token: data })
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
        else if (request.messageType === 'jwtUser') {

            chrome.windows.create({ "url": request.oAuthURL, "type": "normal" },
                function (wd) {

                    if(singleTabListener == null)
                        singleTabListener = tabListener(request, wd, sendResponse)

                    chrome.tabs.onUpdated.addListener(singleTabListener)
                }
            )
        }

        return true
    })


function tabListener(request, wd, sendResponse) {

    return function (tabId, info) {

        let _this = this
        let urlFound = false

        if (!urlFound && info.url != null && info.url.startsWith("http://localhost:8080")) {

            urlFound == true

            let code = info.url.slice(info.url.length - 10)
            let codeUrl = request.authorizeUrl + code

            fetch(codeUrl, {
                headers: new Headers({
                    "Authorization": "Basic " + btoa(request.user + ":" + request.password)
                }
                )
            })
                .then(function (response) {
                    return response.json();
                })
                .then(function (data) {
                   
                    sendResponse({ token: data })
                    chrome.tabs.onUpdated.removeListener(singleTabListener)
                    singleTabListener = null
                    chrome.windows.remove(wd.id)

                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    }
}
