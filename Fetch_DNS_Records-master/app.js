const express = require('express');
const app = express();
const port = process.env.PORT || "8000" ;
const cors=require('cors');
const dig = require('node-dig-dns');
app.use(cors({
	origin: "http://localhost:3000",//frontend server localhost:3000 in dev , 9000 in production
	methods:['GET','POST','PUT','DELETE'],
	credentials: true , // enable set cookie,
	
}));
// app.use(function(req, res, next) {

// 	res.header('Access-Control-Allow-Credentials', true);
// 	res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
// 	res.header("Access-Control-Allow-Origin", process.env.SERVER_URL);
// 	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-   Type, Accept, Authorization");
// 	next();
// });

const { exec,execSync } = require("child_process");
var bodyParser = require('body-parser');
const { reverse } = require('dns');
//const { stdout } = require('process');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/:name/:resourse/:type/:sourceip/:reversedns/:reverseip/:ipversion/:recursion/:protocol/:tracing/:shorten/:port/:timeout/:numtries' , function(req , res) {
	var name = req.params.name ; //name of the server
	var resourse = req.params.resourse ; //name of the specific server if needed
	var type = req.params.type ; //type of the record A,AAAA,MX,CNAME
	var sourceip = req.params.sourceip ; //the IP address of the system through which the DNS request would be made. IP needs to be a valid IP on the network
	var reverseip = req.params.reverseip ;	//If the user wishes to perform a reverse DNS Query, in that case the IP address of the server is needed only
	var reversedns = req.params.reversedns;
	var ipversion = req.params.ipversion ; //We can force the query to be made in a way that data only travels on the IP version 4 or 6.
	var recursion = req.params.recursion ;	//We can enable or disable recursion
	var protocol = req.params.protocol ;	//Default is UDP for the queries except two types of query but we can force the query to be made on TCP only or not.
	var tracing = req.params.tracing ;	//Enable or disable Tracing
	var shorten = req.params.shorten ;	//Shorten the answer to not provide names, class etc in the list of IPs provided
	var port = req.params.port ;	//Port number of the DNS Server, default is 53, but we can check on other port numbers
	var timeout = req.params.timeout ;	//The timeout of a query after which the process is killed can be changed
	var numtries = req.params.numtries ; //Default is 3 UDP tries, but we can change it
	let args = [];
	let array = [] ;
	var final_command = '';

	if (reversedns === "true") {
		final_command = final_command + 'dig ' + reverseip;
	}
	else {
		if ((name !== " ") && (name!== "")) {
			final_command = final_command + 'dig ' + ' @' + name + ' ' + resourse + ' ' + type;
		} else {
			final_command = final_command + 'dig ' + resourse + ' ' + type;
		}
	}

	if (sourceip !== "-b ") {
		final_command = final_command + " " + sourceip; 
	}

	if (ipversion !== " ") {
		final_command = final_command + " " + ipversion; 
	}

	if(port!=="-p "){
		final_command = final_command + " " + port;
	}
	
	if (recursion!==" "){
		final_command = final_command + " " + recursion;
	}

	if (protocol!==" "){
		final_command = final_command + " " + protocol;
	}

	if (tracing!==" "){
		final_command = final_command + " " + tracing;
	}

	if (shorten!==" "){
		final_command = final_command + " " + shorten;
	}


	final_command = final_command + " " + timeout + " " + numtries

	final_command = final_command + " +nocomments +noquestion +noauthority +noadditional +nostats";
	console.log(final_command);
	var display;
 
	//Arya

	
	//final_command = final_command + "| awk '{if (NR>3){print}}'| tr -s '\t' | jq -R 'split('\t') |{Name:.[0],TTL:.[1],Class:.[2],Type:.[3],IpAddress:.[4]}' | jq --slurp .";

	// exec(final_command, (error, stdout, stderr) => {
	// 	if (error) {
	// 		display = `error: ${error.message}`;
	// 		console.log(`error: ${error.message}`);
	// 		return;
	// 	}
	// 	if (stderr) {
	// 		display = `stderr: ${stderr}`
	// 		console.log(`stderr: ${stderr}`);
	// 		return;
	// 	}
	// 	console.log(`stdout: ${stdout}`);
	// 	return 
	// });


	try {
		var stdout = execSync(final_command);
		display = stdout.toString();
		console.log(display);
		res.send(display);
	}
	catch {
		res.send("Invalid Input please check again");
	}
	//Arya

})
app.listen(port, function () {
  console.log('Example app listening on port 8000!');
});