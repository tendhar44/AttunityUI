//create request 
var req = new XMLHttpRequest();

var aemNonProdServer = 'CH3DW605425';
var user = aemNonProdServer + '\\attunityaem';
var pass = '';

var endpointLink = 'https://'+ aemNonProdServer + '/attunityenterprisemanager/api/v1';
var loginEndpointLink = endpointLink + '/login';
var serverEndpointLink = endpointLink + '/servers';


//open new connection, using GET request and login endpoint
req.open('GET', loginEndpointLink, false, user, pass);
console.log('OPENED', req.status);

req.onload = function(){
	console.log('Inside login Request', req.status);

}

req.send();
var sessionIdHeader = req.getResponseHeader('EnterpriseManager.APISessionID');
console.log(sessionIdHeader);
	

var serverRequest = new XMLHttpRequest();
serverRequest.overrideMimeType('application/json');

serverRequest.open('GET', serverEndpointLink, false);
console.log('OPENED server request', serverRequest.status);
serverRequest.setRequestHeader("EnterpriseManager.APISessionID", sessionIdHeader);	

serverRequest.onload = function(){
	var serverData = JSON.parse(serverRequest.responseText);

	console.log('Inside server req', serverRequest.status);
	createAllServerName(serverData['serverList']);
}
serverRequest.send();

function serChange(){
		document.getElementById("envId1").selectedIndex = "0";
		
		
		for(var i = 1; i < serList.length; i++){
				var e = document.getElementById("serdId");
				var selectSer = e.options[e.selectedIndex].value;	
				
				if(serList[i] == selectSer){
					var taskEndpointLink = serverEndpointLink + '/' + serList[i] + '/tasks';
			
					var taskRequest = new XMLHttpRequest();
					taskRequest.overrideMimeType('application/json');

					taskRequest.open('GET', taskEndpointLink, false);
					console.log('OPENED task request', taskRequest.status);
					taskRequest.setRequestHeader("EnterpriseManager.APISessionID", sessionIdHeader);	

					taskRequest.onload = function(){
						var serverData = JSON.parse(taskRequest.responseText);

						console.log('Inside task req', taskRequest.status);
						//createDevTaskPerServer(serverData['taskList']);
						//createDevTaskPerServerDropDown(serverData['taskList']);
						createAllTaskPerServerDropDown(serverData['taskList']);
					}
				taskRequest.send();
				}//end if
			}//end for loop
}


function envSelectCheck(envSelected){

	if(envSelected){
		
		envOption1Dev = document.getElementById("devOptionSer1").value;
		envOption1Qa = document.getElementById("qaOptionSer1").value;
		envOption1Prod = document.getElementById("prodOptionSer1").value;
		
		if(envOption1Dev == envSelected.value){
			for(var i = 1; i < serList.length; i++){
				var e = document.getElementById("serdId");
				var selectSer = e.options[e.selectedIndex].value;	
				
				if(serList[i] == selectSer){
					var taskEndpointLink = serverEndpointLink + '/' + serList[i] + '/tasks';
			
					var taskRequest = new XMLHttpRequest();
					taskRequest.overrideMimeType('application/json');

					taskRequest.open('GET', taskEndpointLink, false);
					console.log('OPENED task request', taskRequest.status);
					taskRequest.setRequestHeader("EnterpriseManager.APISessionID", sessionIdHeader);	

					taskRequest.onload = function(){
						var serverData = JSON.parse(taskRequest.responseText);

						console.log('Inside task req', taskRequest.status);
						//createDevTaskPerServer(serverData['taskList']);
						createDevTaskPerServerDropDown(serverData['taskList']);
					}
				taskRequest.send();
				}//end if
			}//end for loop
			
		} else if(envOption1Qa == envSelected.value){

			for(var i = 1; i < serList.length; i++){
				var e = document.getElementById("serdId");
				var selectSer = e.options[e.selectedIndex].value;	
				
				if(serList[i] == selectSer){
					var taskEndpointLink = serverEndpointLink + '/' + serList[i] + '/tasks';
			
					var taskRequest = new XMLHttpRequest();
					taskRequest.overrideMimeType('application/json');

					taskRequest.open('GET', taskEndpointLink, false);
					console.log('OPENED task request', taskRequest.status);
					taskRequest.setRequestHeader("EnterpriseManager.APISessionID", sessionIdHeader);	

					taskRequest.onload = function(){
						var serverData = JSON.parse(taskRequest.responseText);

						console.log('Inside task req', taskRequest.status);
						//createQaTaskPerServer(serverData['taskList']);
						createQaTaskPerServerDropDown(serverData['taskList']);
					}
				taskRequest.send();
				}//end if
			}//end for loop
			
		} else if(envOption1Prod == envSelected.value){
			document.getElementById("testThree").innerHTML = "prod selected";
			
		} else{
			document.getElementById("testThree").innerHTML = "none selected";
		}
	} else{
		document.getElementById("testThree").innerHTML = "not selected";
	}
}//envSelectCheck function ends

//get all server name into the dropdown
function createAllServerName(sd){
	var myOptionStr = '<option selected="selected">Select</option>';
	serList = [];
	
	/* create list of all the server names in the dropdown */
	for(var i = 1; i < sd.length; i++){
		serList[i] = sd[i].name;
		myOptionStr += '<option id="dServerOption'+ i +'" value="'+ sd[i].name +'">' + sd[i].name + '</option>';
	}
	document.getElementById("serdId").innerHTML = myOptionStr;
}

//get all QA tasks with selected server and display in table
function createQaTaskPerServer(sd){
	var myTableStr = '<tr><th id="taskNameHeader">Name</th> <th id="taskStateHeader">State</th> <th id="taskStopReaHeader">Stoppage Reason</th></tr> ';
	var i;
	for(i = 0; i < sd.length; i++){
		var str = sd[i].name;
		if(str.match(/-QA\b/) || str.match(/_QA\b/)){
			myTableStr += '<tr><td id="taskName'+ i +'">' + sd[i].name + '</td> <td id="taskState'+ i +'">' + sd[i].state + '</td> <td id="taskStopRea'+ i +'">' + sd[i].stop_reason + '</td></tr>';
		}
	}
	document.getElementById('taskTableBody').innerHTML = myTableStr;
}

//get all DEV tasks with selected server and display in table
function createDevTaskPerServer(sd){
	var myTableStr = '<tr><th id="taskNameHeader">Name</th> <th id="taskStateHeader">State</th> <th id="taskStopReaHeader">Stoppage Reason</th></tr> ';
	var i;
	for(i = 0; i < sd.length; i++){
		var str = sd[i].name;
		if(str.match(/-DEV\b/) || str.match(/_DEV\b/)){
			myTableStr += '<tr><td id="taskName'+ i +'">' + sd[i].name + '</td> <td id="taskState'+ i +'">' + sd[i].state + '</td> <td id="taskStopRea'+ i +'">' + sd[i].stop_reason + '</td></tr>';
		}
	}
	document.getElementById('taskTableBody').innerHTML = myTableStr;
}

//get all tasks with selected server and display in dropdown
function createAllTaskPerServerDropDown(sd){
	var myOptionStr = '<option selected="selected">Select</option>';
	taskList = [];
	
	/* create list of all the task names in the dropdown */
	for(var i = 1; i < sd.length; i++){
		taskList[i] = sd[i].name;
		myOptionStr += '<option id="aTaskOption'+ i +'" value="'+ sd[i].name +'">' + sd[i].name + '</option>';
	}
	document.getElementById("tasAllId").innerHTML = myOptionStr;
}

//get all DEV tasks with selected server and display in dropdown
function createDevTaskPerServerDropDown(sd){
	var myOptionStr = '<option selected="selected">Select</option>';
	
	/* create list of all the task names in the dropdown */
	for(var i = 1; i < sd.length; i++){
		var str = sd[i].name;
		if(str.match(/-DEV\b/) || str.match(/_DEV\b/)){
			myOptionStr += '<option id="dTaskOption'+ i +'" value="'+ sd[i].name +'">' + sd[i].name + '</option>';
		}
	}
	document.getElementById("tasId").innerHTML = myOptionStr;
}

//get all QA tasks with selected server and display in dropdown
function createQaTaskPerServerDropDown(sd){
	var myOptionStr = '<option selected="selected">Select</option>';
	
	/* create list of all the task names in the dropdown */
	for(var i = 1; i < sd.length; i++){
		var str = sd[i].name;
		if(str.match(/-QA\b/) || str.match(/_QA\b/)){
			myOptionStr += '<option id="dTaskOption'+ i +'" value="'+ sd[i].name +'">' + sd[i].name + '</option>';
		}
	}
	document.getElementById("tasId").innerHTML = myOptionStr;
}

