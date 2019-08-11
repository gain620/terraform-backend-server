const execSync = require('child_process').execSync;
const fs = require('fs');
const path = require('path');

function testSyncCommand(commandStr) {
	const stdout = execSync(commandStr, {encoding: 'utf8'});

	console.log(`stdout = ${stdout}`);
}


let cmd1 = 'cd /home/john/terraform-backend-server/scripts';
let terraCmd = 'cd /home/john/terraform-backend-server/scripts; terraform apply -auto-approve';
let delCmd = 'cd /home/john/terraform-backend-server/scripts; rm terraform.tfstate';

//let checkFile = false;
//checkFile = testSyncCommand('test /home/john/terraform-scripts/terraform.tfstate');
let cfPath = path.join(__dirname, 'terraform.tfstate');

if(fs.existsSync(cfPath)) {
	testSyncCommand(delCmd);
}

console.log('Please standby while resources are being created :)');
testSyncCommand(terraCmd);
//testSyncCommand(delCmd);
