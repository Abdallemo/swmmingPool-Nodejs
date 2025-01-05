let express = require('express');
let router = express.Router();
let {inserfeedbackTable} = require('./db-config');
const { error } = require('console');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('feedback');
});


router.post('/',function(req,res){

    const {feeback} = req.body;
    const userrData = JSON.parse(req.cookies.userData);
    email = userrData.email;
    name = userrData.name;

    console.log('name: '+name)
    console.log('email: '+email)
    console.log('feedback: '+feeback) 

    if(!feeback){
        res.status(500).json({error:'please fill all fields'})
    }
    inserfeedbackTable(name,email,feeback);
    res.redirect('/')
})


module.exports = router;
