const mongoose = require("mongoose");
const ClusterData = mongoose.Schema({
  project: {
    type: String
  },
  data: {
    type: Object
  }
});
module.exports = mongoose.model("clusterData", ClusterData);
