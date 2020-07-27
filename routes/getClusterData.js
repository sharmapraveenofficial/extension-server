const clusterData = require("../model/clusterDataModel");

module.exports = async function(req, res, next) {
  let data = await clusterData
    .findOne({
      project: "Walkover Insight"
    })
    .then(data => {
      return data;
    })
    .catch(e => {
      console.log(e);
    });
  res.json(data.data);
  next();
};
