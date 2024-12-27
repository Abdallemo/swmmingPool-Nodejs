var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.clearCookie("userData");
    console.log('Logout');
    res.redirect('/');
});

module.exports = router;
