const router = require('express').Router();

const authCheck = (req, res, next) => {
    if (!req.user) {
        res.redirect('/auth/google')
    } else {
        next();
    }
}

router.get('/', (req, res) => {
    res.render("options", {
        username: req.user.name
    });
})

module.exports = router;