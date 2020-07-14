let showTableBtn = document.getElementById('btnShowTable');
let clearTimeBtn = document.getElementById('btnClearTimes');
let timeTable = document.getElementById('timeTable');
let domain;

chrome.storage.local.get("tabTimesObject", function (dataCont) {
    let dataString = dataCont["tabTimesObject"];
    if (dataString == null) {
        //console.log("data string inside")
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
            if (data.hasOwnProperty(key) && data[key].liked) {
                entries.push(data[key]);
            }
        }

        entries.sort(function (e1, e2) {
            let e1s = e1["trackedSeconds"];
            let e2s = e2["trackedSeconds"];

            if (isNaN(e1s) || isNaN(e2s)) {
                return 0;
            }

            if (e1s > e2s) {
                return 1;
            } else if (e1s < e2s) {
                return -1;
            }

            return 0;
        })
        entries.map(function (urlObject) {
            let newRow = timeTable.insertRow(0);

            let celHostName = newRow.insertCell(0);
            let celTimeMinutes = newRow.insertCell(1);
            let hashTag = newRow.insertCell(2);
            celHostName.innerHTML = urlObject["url"];
            hashTag.innerHTML = urlObject["hashtag"];

            let time_ = urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0;

            celTimeMinutes.innerHTML = secondsToHms(time_)

            function secondsToHms(d) {
                d = Number(d);
                var h = Math.floor(d / 3600);
                var m = Math.floor(d % 3600 / 60);
                var s = Math.floor(d % 3600 % 60);

                var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
                var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
                var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
                return hDisplay + mDisplay + sDisplay;
            }

        });


        let headerRow = timeTable.insertRow(0);
        headerRow.insertCell(0).innerHTML = "URL";
        headerRow.insertCell(1).innerHTML = "Minutes";
        headerRow.insertCell(2).innerHTML = "HashTag";
    } catch (e) {
        const message = "loading the timeObject went wrong " + e.toString();
        console.log(message);


        errorMessage.innerHTML = message;
        errorMessage.innerHTML = dataString;
    }
});


// clearTimeBtn.onclick = function () {
//     chrome.storage.local.set({
//         "tabTimesObject": "{}"
//     }, function () {});
// }

// showTableBtn.onclick = function () {
//     chrome.storage.local.get("tabTimesObject", function (dataCont) {
//         let dataString = dataCont["tabTimesObject"];
//         if (dataString == null) {
//             //console.log("data string inside")
//             return;
//         }


//         try {
//             let data = JSON.parse(dataString);

//             var rowCount = timeTable.rows.length;
//             for (var x = rowCount - 1; x >= 0; x--) {
//                 timeTable.deleteRow(x);
//             }

//             let entries = [];

//             for (var key in data) {
//                 if (data.hasOwnProperty(key)) {
//                     entries.push(data[key]);
//                 }
//             }

//             entries.sort(function (e1, e2) {
//                 let e1s = e1["trackedSeconds"];
//                 let e2s = e2["trackedSeconds"];

//                 if (isNaN(e1s) || isNaN(e2s)) {
//                     return 0;
//                 }

//                 if (e1s > e2s) {
//                     return 1;
//                 } else if (e1s < e2s) {
//                     return -1;
//                 }

//                 return 0;
//             })
//             entries.map(function (urlObject) {
//                 let newRow = timeTable.insertRow(0);

//                 let celHostName = newRow.insertCell(0);
//                 let celTimeMinutes = newRow.insertCell(1);
//                 let celLiked = newRow.insertCell(2);
//                 let celHashtag = newRow.insertCell(3);

//                 celHostName.innerHTML = urlObject["url"];
//                 let time_ = urlObject["trackedSeconds"] != null ? urlObject["trackedSeconds"] : 0;


//                 celLiked.innerHTML = urlObject["liked"]
//                 celHashtag.innerHTML = urlObject["hashtag"]
//                 celTimeMinutes.innerHTML = secondsToHms(time_)

//                 function secondsToHms(d) {
//                     d = Number(d);
//                     var h = Math.floor(d / 3600);
//                     var m = Math.floor(d % 3600 / 60);
//                     var s = Math.floor(d % 3600 % 60);

//                     var hDisplay = h > 0 ? h + (h == 1 ? " hour, " : " hours, ") : "";
//                     var mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes, ") : "";
//                     var sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
//                     return hDisplay + mDisplay + sDisplay;
//                 }

//             });


//             let headerRow = timeTable.insertRow(0);
//             headerRow.insertCell(0).innerHTML = "URL";
//             headerRow.insertCell(1).innerHTML = "Minutes";
//             headerRow.insertCell(2).innerHTML = "Liked";
//             headerRow.insertCell(3).innerHTML = "hashtag";

//         } catch (e) {
//             const message = "loading the timeObject went wrong " + e.toString();
//             console.log(message);


//             errorMessage.innerHTML = message;
//             errorMessage.innerHTML = dataString;
//         }
//     });
// }