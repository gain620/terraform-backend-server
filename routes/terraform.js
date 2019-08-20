var express = require("express");
var router = express.Router();
var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
var execSync = require("child_process").execSync;
// var movies = require('../movies.json');

// router.get('/', function (req, res, next) {
// });

let vmInst, dbInst;

function testSyncCommand(commandStr) {
  const stdout = execSync(commandStr, { encoding: "utf8" });

  console.log(`stdout = ${stdout}`);
}

// req.body의 vmOptions 받아 variable.tf에 저장후 terraform apply -auto-apply 실행
router.post("/", function(req, res, next) {
  // 0. get req.body
  // console.log(req.body);
  // 1. read file
  // var terraPath = path.join(__dirname, '..', 'scripts', 'terraform.tfvars');
  console.log(__dirname);
  var terraNewPath = path.join(
    __dirname,
    "..",
    "scripts",
    "terraform.tfvars.json"
  );
  // fs.readFile(terraPath, 'utf8', function(err, data) {
  //     console.log(data);
  // });
  // // 2. parse string into JSON

  // parse and manipulate JSON
  vmOptions = req.body.vmOptions;
  vmOptions.vm_ip = vmOptions.vm_ip.slice(0, vmOptions.vm_ip.indexOf("/"));

  delete vmOptions.vCount;
  delete vmOptions.vNetwork;
  delete vmOptions.guest_id;

  vmOptStr = JSON.stringify(vmOptions);
  fs.writeFileSync(terraNewPath, vmOptStr, "utf8", function(err, data) {
    if (err) {
      console.log(err);
    }
  });
  // 3. input variables into JSON
  // 4. convert JSON to string
  // 5. save string to variables.tf
  // 6. finally run terraform apply -auto-approve
  testSyncCommand(
    "cd /home/john/terraform-backend-server/scripts; node createVM.js"
  );
  // 7. del /q terraform.tfstate rm in ubuntu terraform.tfstate
  //const stdout = execSync('cat movies.json');
  //console.log(`stdout: ${stdout}`);
  res.send({ testName: vmOptions.vm_name + " VM 생성 완료!" });
  // console.log(req.body);
});

router.post("/save", function(req, res, next) {
  var infraFileName = req.body.infraName;
  var infraOwner = "admin";
  var currDate = new Date().toDateString();
  // currDate = currDate.replace(" ", "");

  var terraNewPath = path.join(
    __dirname,
    "..",
    "infra",
    `infra.${infraFileName}.${infraOwner}.${currDate}.json`
  );

  // parse and manipulate JSON
  vmInst = req.body.vmInstances;
  nwInst = req.body.nwInstances;
  dbInst = req.body.dbInstances;
  //   vmInst.vm_ip = vmInst.vm_ip.slice(0, vmOptions.vm_ip.indexOf("/"));

  //   delete vmInst.vCount;
  //   delete vmInst.vNetwork;
  //   delete vmInst.guest_id;

  infraStr = JSON.stringify(vmInst);
  infraStr += JSON.stringify(nwInst);
  infraStr += JSON.stringify(dbInst);
  fs.writeFileSync(terraNewPath, infraStr, "utf8", function(err, data) {
    if (err) {
      console.log(err);
    }
  });
  // 3. input variables into JSON
  // 4. convert JSON to string
  // 7. del /q terraform.tfstate rm in ubuntu terraform.tfstate

  res.send();
});

router.get("/loadInfraList", function(req, res, next) {
  var terraLoadListPath = path.join(__dirname, "..", "infra");
  var fileList = [];

  fs.readdir(terraLoadListPath, (err, files) => {
    files.forEach(file => {
      var tokenArr = file.split(".");

      var infraObj = {
        infra_name: tokenArr[1],
        owner: tokenArr[2],
        edit_date: tokenArr[3]
      };

      fileList.push(infraObj);
    });

    res.send(fileList);
  });
});

router.get("/load", function(req, res, next) {
  var infraReqName = "frontTest";
  var terraLoadPath = path.join(
    __dirname,
    "..",
    "infra",
    `infra.${infraReqName}.json`
  );

  // parse and manipulate JSON
  // vmInst = req.body.vmInstances;
  // dbInst = req.body.dbInstances;
  // infraStr = JSON.stringify(vmInst);
  // infraStr += JSON.stringify(dbInst);
  var infraStr = fs.readFileSync(terraLoadPath, "utf8");
  // test를 위해 vmInstances JSON 까지만 cut
  // 그냥 string으로 보내고 front에서 파싱
  infraStr = infraStr.slice(0, infraStr.indexOf("]") + 1);
  var infraJSON = JSON.parse(infraStr);
  console.log(infraJSON);
  res.send(infraJSON);
});

module.exports = router;
