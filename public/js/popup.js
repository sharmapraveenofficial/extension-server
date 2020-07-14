let showTableBtn = document.getElementById('btnShowTable');
let clearTimeBtn = document.getElementById('btnClearTimes');
let errorMessage = document.getElementById('errorMessage');
let timeTable = document.getElementById('timeTable');
let domain;
let likeButton = document.getElementById('likeButton');
let loginButton = document.getElementById('btnLogin');
var button = document.getElementById("btnShowInsight");
likeButton.addEventListener('click', toggle);



loginButton.onclick = function () {
    chrome.runtime.sendMessage({
        "message": "start_oauth",
        login: true
    });
}



button.addEventListener("click", function () {
    chrome.tabs.create({
        url: "options.html"
    });
});

function toggle() {
    let hashTag = document.getElementById('hashtag').value;
    console.log(hashTag)
    chrome.storage.local.get("tabTimesObject", function (dataCont) {
        let dataString = dataCont["tabTimesObject"];
        if (dataString == null) {
            return;
        }

        try {
            let data = JSON.parse(dataString);
            let entries = [];

            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    entries.push(data[key]);
                }
            }

            function _getCurrentTab(extractHostname) {
                chrome.tabs.query({
                    active: true,
                    currentWindow: true
                }, function callback(tabs) {
                    var tab_domain = document.getElementById("tab_domain");
                    var tab_favicon = document.getElementById("tab_favicon");

                    var favicon = tabs[0].favIconUrl;
                    if (favicon === undefined) {
                        favicon = 'chrome://favicon/' + domain;
                    }
                    let url = extractHostname(tabs[0].url);
                    tab_domain.textContent = url;
                    tab_favicon.src = favicon;
                });
            };
            _getCurrentTab(extractHostname);

            function extractHostname(url) {
                var hostname;

                if (url.indexOf("//") > -1) {
                    hostname = url.split('/')[2];
                } else {
                    hostname = url.split('/')[0];
                }

                hostname = hostname.split(':')[0];
                hostname = hostname.split('?')[0];

                for (i = 0; i < entries.length; i++) {
                    //console.log(entries[i].url)
                    if (entries[i].url == hostname) {
                        console.log(entries[i].liked);
                        let val = entries[i].liked;
                        if (val) {
                            chrome.runtime.sendMessage({
                                saveState: !val,
                                hashtag: hashTag
                            });
                            console.log("message send" + !val)
                            likeButton.style.cssText = ' background-position: 2800px 0; transition: background 1s steps(-28); background: url(https://cssanimation.rocks/images/posts/steps/heart.png) no-repeat;'
                        } else {
                            chrome.runtime.sendMessage({
                                saveState: !val,
                                hashtag: hashTag
                            });
                            console.log("message send" + !val)
                            likeButton.style.cssText = ' background-position: -2800px 0; transition: background 1s steps(28);'
                        }

                        break;
                    }
                }
                return hostname;
            }


        } catch (e) {
            const message = "loading the timeObject went wrong " + e.toString();
            console.log(message);
        }
    });
}

chrome.storage.local.get("tabTimesObject", function (dataCont) {
    let dataString = dataCont["tabTimesObject"];
    if (dataString == null) {
        return;
    }
    try {
        let data = JSON.parse(dataString);

        var rowCount = timeTable.rows.length;
        for (var x = rowCount - 1; x >= 0; x--) {
            timeTable.deleteRow(x);
        }

        let entries = [];

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                entries.push(data[key]);
            }
        }


        function _getCurrentTab(extractHostname) {
            chrome.tabs.query({
                active: true,
                currentWindow: true
            }, function callback(tabs) {
                var tab_domain = document.getElementById("tab_domain");
                var tab_favicon = document.getElementById("tab_favicon");

                var favicon = tabs[0].favIconUrl;
                if (favicon === undefined) {
                    favicon = 'chrome://favicon/' + domain;
                }
                let url = extractHostname(tabs[0].url);
                tab_domain.textContent = url;
                tab_favicon.src = favicon;
            });
        };



        _getCurrentTab(extractHostname);

        function extractHostname(url) {
            var hostname;

            if (url.indexOf("//") > -1) {
                hostname = url.split('/')[2];
            } else {
                hostname = url.split('/')[0];
            }

            hostname = hostname.split(':')[0];
            hostname = hostname.split('?')[0];

            for (i = 0; i < entries.length; i++) {
                //console.log(entries[i].url)
                if (entries[i].url == hostname) {
                    var total_time = document.getElementById("total_time");
                    console.log(entries[i].url)
                    let time_ = entries[i].trackedSeconds != null ? entries[i].trackedSeconds : 0;

                    let timer = secondsToHms(time_)

                    function secondsToHms(d) {
                        d = Number(d);
                        var h = Math.floor(d / 3600);
                        var m = Math.floor(d % 3600 / 60);
                        var s = Math.floor(d % 3600 % 60);

                        var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                        var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                        var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                        console.log(hDisplay + " " + mDisplay + " " + sDisplay);
                        return hDisplay + mDisplay + sDisplay;
                    }
                    total_time.textContent = "Time Spend on this Domain : " + timer;

                    var val = entries[i].liked;

                    if (val) {
                        likeButton.style.cssText = 'background-position: -2800px 0; transition: background 1s steps(28);'
                    } else {

                        likeButton.style.cssText = 'background-position: 2800px 0; transition: background 1s steps(-28); background: url(https://cssanimation.rocks/images/posts/steps/heart.png) no-repeat;'
                    }

                    break;
                }
            }
            return hostname;
        }
    } catch (e) {
        const message = "loading the timeObject went wrong " + e.toString();
        console.log(message);


        errorMessage.innerHTML = message;
        errorMessage.innerHTML = dataString;
    }
});