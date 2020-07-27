const fetch = require("node-fetch");
module.exports = async function(req, res) {
  console.log(req.query.similar);
  let json = await getData(`http://13.235.90.61:5000/${req.query.similar}/`);
  res.json({
    success: true,
    keywords: json.keywords,
    websites: json.websites,
    similar: req.body.similar
  });
};

const getData = async url => {
  try {
    const response = await fetch(url);
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(error);
  }
};
