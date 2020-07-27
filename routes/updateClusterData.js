const fetch = require("node-fetch");
const clusterData = require("../model/clusterDataModel");

module.exports = async function(req, res) {
  let getAllClusterData = await getData(
    `http://13.235.90.61:5000/getAllClusterData/2020-05-03/2020-05-04`
  );
  let getClusterKeyword = [];
  for (i = 1; i <= 100; i++) {
    let json = await getData(
      `http://13.235.90.61:5000/getOneDayClusterData/2020-05-07/${i}`
    );
    getClusterKeyword.push(json[0].keywords);
  }

  for (i = 0; i < 100; i++) {
    getAllClusterData[i].keywords = getClusterKeyword[i];
  }
  clusterData.findOneAndUpdate(
    {
      project: "Walkover Insight"
    },
    {
      $set: {
        project: "Walkover Insight",
        data: getAllClusterData
      }
    },
    {
      new: true,
      upsert: true
    },
    function(err, doc) {
      if (err) {
        console.log("Something wrong when updating data!");
      }
      console.log("Data Stored in DB");
    }
  );
  res.json({
    getAllClusterData
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
