var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
// var movies = require('../movies.json');

// router.get('/', function (req, res, next) {
// });

// req.body의 vmOptions 받아 variable.tf에 저장후 terraform apply -auto-apply 실행
router.post('/', function (req, res, next) {
    // 0. get req.body
    console.log(req.body);
    // 1. read file 
    var terraPath = path.join(__dirname, '..', 'scripts', 'terraform.tfvars');
    var terraNewPath = path.join(__dirname, '..', 'scripts', 'terraform1.tfvars');
    fs.readFile(terraPath, 'utf8', function(err, data) {
        console.log(data);
    });
    // // 2. parse string into JSON
    fs.writeFile(terraNewPath, JSON.stringify(req.body), 'utf8', function(err, data) {
        if(err) {
            console.log(err);
        }
    });
    // 3. input variables into JSON
    // 4. convert JSON to string
    // 5. save string to variables.tf

    // 6. finally run terraform apply -auto-approve
    // 7. del /q terraform.tfstate

    // console.log(req.body);
    res.send({testName: "test"});
});


module.exports = router;