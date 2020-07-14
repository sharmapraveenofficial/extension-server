const tabTimeObjectKey = "tabTimesObject";
const lastActiveTabKey = "lastActiveTab";

chrome.runtime.onInstalled.addListener(function () {
    chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
        chrome.declarativeContent.onPageChanged.addRules([{
            conditions: [new chrome.declarativeContent.PageStateMatcher({
                pageUrl: {},
            })],
            actions: [new chrome.declarativeContent.ShowPageAction()]
        }])
    })
})

setInterval(function () {
    chrome.windows.onFocusChanged.addListener(function (windowId) {
        if (windowId == chrome.windows.WINDOW_ID_NONE) {
            processTabChange(false);
        } else {
            processTabChange(true);
        }
    })
}, 1000);


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    //Login Using Auth Logic
    if (request.login) {
        console.log("inside login")
        if (request.message === "start_oauth") {
            chrome.identity.launchWebAuthFlow({
                    "url": "http://localhost:3000/auth/google",
                    "interactive": true
                },
                function (redirect_url) {
                    console.log(redirect_url + "hello")
                    var auth_token = "http://localhost:3000/auth/google/callback";
                }
            );
        }
    } else {
        console.log("message received" + request.saveState)
        chrome.tabs.query({
            'active': true
        }, function (tabs) {

            if (tabs.length > 0 && tabs[0] != null) {
                let currentTab = tabs[0];
                let url = currentTab.url;
                let title = currentTab.title;
                let hostName = url;

                try {
                    let urlObject = new URL(url);
                    hostName = urlObject.hostname;
                } catch (e) {
                    console.log(`could not construct url from ${currentTab.url}, error${e}`);
                }

                chrome.storage.local.get([tabTimeObjectKey, lastActiveTabKey], function (result) {
                    let lastActiveTabString = result[lastActiveTabKey];
                    let tabTimeObjectString = result[tabTimeObjectKey];

                    console.log('backgroundjs,getresult');

                    console.log(result);
                    tabTimeObject = {};

                    if (tabTimeObjectString != null) {
                        try {
                            tabTimeObject = JSON.parse(tabTimeObjectString);
                        } catch (e) {
                            console.log("exception" + e)
                        }

                    }

                    lastActiveTab = {}
                    if (lastActiveTabString != null) {
                        try {
                            lastActiveTab = JSON.parse(lastActiveTabString)
                        } catch (e) {
                            console.log("exception" + e)
                        }

                    }

                    if (lastActiveTab.hasOwnProperty("url") && lastActiveTab.hasOwnProperty("lastDateVal")) {
                        let lastUrl = lastActiveTab["url"];
                        let currentDateVal_ = Date.now();
                        let passedSecond = (currentDateVal_ - lastActiveTab["lastDateVal"]) * 0.001;

                        if (tabTimeObject.hasOwnProperty(lastUrl)) {
                            let lastUrlObjectInfo = tabTimeObject[lastUrl];

                            if (lastUrlObjectInfo.hasOwnProperty("trackedSeconds")) {
                                lastUrlObjectInfo['trackedSeconds'] = lastUrlObjectInfo['trackedSeconds'] + passedSecond;
                            } else {
                                lastUrlObjectInfo["trackedSeconds"] = passedSecond;
                            }

                            if (lastUrlObjectInfo.hasOwnProperty("liked")) {

                                lastUrlObjectInfo['liked'] = request.saveState;
                            }

                            if (lastUrlObjectInfo.hasOwnProperty("hashtag")) {
                                console.log(request.hashtag)
                                lastUrlObjectInfo['hashtag'] = request.hashtag;
                            }

                            lastUrlObjectInfo["lastDateVal"] = currentDateVal_;
                        } else {
                            let newUrlInfo = {
                                url: lastUrl,
                                trackedSeconds: passedSecond,
                                lastDateVal: currentDateVal_,
                                hashtag: "",
                                liked: false
                            };
                            tabTimeObject[lastUrl] = newUrlInfo;
                        }
                    }


                    let currentDateVal = Date.now();
                    let lastTabInfo = {
                        "url": hostName,
                        "lastDateVal": currentDateVal
                    };

                    let newLastTabObject = {};
                    newLastTabObject[lastActiveTabKey] = JSON.stringify(lastTabInfo);

                    chrome.storage.local.set(newLastTabObject, function () {
                        console.log("lastActiveTab stored:" + hostName);

                        const tabTimeObjectString = JSON.stringify(tabTimeObject);
                        let newTabTimeObject = {};

                        newTabTimeObject[tabTimeObjectKey] = tabTimeObjectString;
                        chrome.storage.local.set(newTabTimeObject, function () {

                        });
                    });
                });

            }
        });
    }
});

function processTabChange(isWindowActive) {
    chrome.tabs.query({
        'active': true
    }, function (tabs) {

        console.log("isWindowActive :" + isWindowActive);
        console.log(tabs);

        if (tabs.length > 0 && tabs[0] != null) {
            let currentTab = tabs[0];
            let url = currentTab.url;
            let title = currentTab.title;
            let hostName = url;

            try {
                let urlObject = new URL(url);
                hostName = urlObject.hostname;
            } catch (e) {
                console.log(`could not construct url from ${currentTab.url}, error${e}`);
            }

            chrome.storage.local.get([tabTimeObjectKey, lastActiveTabKey], function (result) {
                let lastActiveTabString = result[lastActiveTabKey];
                let tabTimeObjectString = result[tabTimeObjectKey];

                console.log('backgroundjs,getresult');

                console.log(result);
                tabTimeObject = {};

                if (tabTimeObjectString != null) {
                    try {
                        tabTimeObject = JSON.parse(tabTimeObjectString);
                    } catch (e) {
                        console.log("exception" + e)
                    }

                }

                lastActiveTab = {}
                if (lastActiveTabString != null) {
                    try {
                        lastActiveTab = JSON.parse(lastActiveTabString)
                    } catch (e) {
                        console.log("exception" + e)
                    }

                }

                if (lastActiveTab.hasOwnProperty("url") && lastActiveTab.hasOwnProperty("lastDateVal")) {
                    let lastUrl = lastActiveTab["url"];
                    let currentDateVal_ = Date.now();
                    let passedSecond = (currentDateVal_ - lastActiveTab["lastDateVal"]) * 0.001;

                    if (tabTimeObject.hasOwnProperty(lastUrl)) {
                        let lastUrlObjectInfo = tabTimeObject[lastUrl];

                        if (lastUrlObjectInfo.hasOwnProperty("trackedSeconds")) {
                            lastUrlObjectInfo['trackedSeconds'] = lastUrlObjectInfo['trackedSeconds'] + passedSecond;
                        } else {
                            lastUrlObjectInfo["trackedSeconds"] = passedSecond;
                        }
                        lastUrlObjectInfo["lastDateVal"] = currentDateVal_;
                    } else {
                        let newUrlInfo = {
                            url: lastUrl,
                            trackedSeconds: passedSecond,
                            lastDateVal: currentDateVal_,
                            hashtag: "",
                            liked: false
                        };
                        tabTimeObject[lastUrl] = newUrlInfo;
                    }
                }


                let currentDateVal = Date.now();
                let lastTabInfo = {
                    "url": hostName,
                    "lastDateVal": currentDateVal
                };

                if (!isWindowActive) {
                    lastTabInfo = {};
                }
                let newLastTabObject = {};
                newLastTabObject[lastActiveTabKey] = JSON.stringify(lastTabInfo);

                chrome.storage.local.set(newLastTabObject, function () {
                    console.log("lastActiveTab stored:" + hostName);

                    const tabTimeObjectString = JSON.stringify(tabTimeObject);
                    let newTabTimeObject = {};

                    newTabTimeObject[tabTimeObjectKey] = tabTimeObjectString;
                    chrome.storage.local.set(newTabTimeObject, function () {

                    });
                });
            });

        }
    });
}

function onTabTrack(activeTabInfo) {
    let tabId = activeTabInfo.tabId;
    let windowId = activeTabInfo.windowId;

    processTabChange(true);
}


chrome.tabs.onActivated.addListener(onTabTrack)
chrome.tabs.onUpdated.addListener(onTabTrack);
chrome.tabs.onRemoved.addListener(onTabTrack);
chrome.tabs.onReplaced.addListener(onTabTrack);