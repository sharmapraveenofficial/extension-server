const fetch = require('node-fetch');
module.exports = async function (req, res) {
    let url = req.originalUrl.split("?");
    let similar = url[1].split("=");

    let json = await getData(`http://13.235.90.61:5000/${similar[0]}/`)
    res.render("similarWebsite", {
        similar: similar[0],
        json: json
    });
}

const getData = async url => {
    try {
        const response = await fetch(url);
        const json = await response.json();
        return json;
    } catch (error) {
        console.log(error);
    }
};