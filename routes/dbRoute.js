const users = require("../model/userModel");
const bookmarks = require("../model/userBookmark");

module.exports = (req, res) => {
  //   console.log(req.body);
  let entries = [];
  let data = req.body;
  for (var key in data) {
    if (data.hasOwnProperty(key) && data[key].liked) {
      entries.push(data[key]);
    }
  }

  entries.sort(function(e1, e2) {
    let e1s = e1["trackedSeconds"];
    let e2s = e2["trackedSeconds"];

    if (isNaN(e1s) || isNaN(e2s)) {
      return 0;
    }

    if (e1s < e2s) {
      return 1;
    } else if (e1s > e2s) {
      return -1;
    }

    return 0;
  });

  const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
      return {
        ...obj,
        [item[key]]: item
      };
    }, initialValue);
  };

  let objarry = convertArrayToObject(entries, "url");

  //   console.log();
  //   console.log(
  //     "-----------------------------------------------------------------"
  //   );
  //   console.log(JSON.stringify(req.body));

  try {
    users
      .findOne({
        email: req.user.email
      })
      .then(user => {
        if (user) {
          // console.log(user);
          bookmarks.findOneAndUpdate(
            {
              email: user.email
            },
            {
              $set: {
                email: req.user.email,
                data: JSON.stringify(objarry)
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
              console.log("Data refreshed in DB");
              //       console.log(doc);
            }
          );
        } else {
          console.log("please login first...");
        }
      });
  } catch (e) {
    console.log(
      "Something Went wrong May be you are not login please login first..." + e
    );
  }
  res.send({
    message: "Ok"
  });
};
