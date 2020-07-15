const users = require("../model/userModel");
const bookmarks = require("../model/userBookmark");

module.exports = (req, res) => {
    Object.entries(req.body).forEach(entry => {
        let str = entry[0].split(".");
        if (!str[0] === "www") {
            //console.log(entry[0]);
        } else {
            // console.log("www." + entry[0]);
        }
    });

    try {
        users
            .findOne({
                email: req.user.email
            })
            .then(user => {
                if (user) {
                    // console.log(user);
                    bookmarks.findOneAndUpdate({
                            email: user.email
                        }, {
                            $set: {
                                email: req.user.email,
                                data: JSON.stringify(req.body)
                            }
                        }, {
                            new: true,
                            upsert: true
                        },
                        function (err, doc) {
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
}