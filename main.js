var CommonFunc = require('./commonFunc.js');
var WebServer = require('./web_server');


// 파일 개수를 알아야 하는 폴더 리스트 
const targetFolderArr = ["D:/_CAR_DATA/", "D:/_CAR_DATA/BULK_DATA/FAIL/"];


//SMS전송 관련 변수
const smsNumArr = ["01055243265"];
const callbackNum = "15992737";
var SMS_CNT = { CPU: 0, MEMORY: 0 }
var FILE_SMS_CNT_ARR = [];
for(var i=0; i<targetFolderArr.length; i++) {
	FILE_SMS_CNT_ARR.push(0);
}


//PUSH 시간간격
const _PUSH_INTERVAL = 5;	//단위 : 초


//웹서버
var webApp = WebServer.listenWeb(6001);

function pushServerInfo() {
	try
	{
		setTimeout(function() {
			CommonFunc.getServerInfo('D:', function(info) {
				webApp.sendDataToAll(info, "SERVER_INFO");	//PUSH
				
				if(info.cpuUsage >= 99) {
					if(SMS_CNT.CPU == 0) 
					{ 
						console.log(info.cpuUsage);
						CommonFunc.sendMsgToManager(smsNumArr, callbackNum, 'CPU 사용률이 99%를 넘었습니다.'); 
						SMS_CNT.CPU++;
					}
					else 
					{ 
						if(SMS_CNT.CPU*_PUSH_INTERVAL >= 600) {
							SMS_CNT.CPU = 0;
						} else {
							SMS_CNT.CPU++;
						}
					}
				} else {
					SMS_CNT.CPU = 0;
				}

				if(info.memUsage > 90) {
					if(SMS_CNT.MEMORY == 0) 
					{ 
						CommonFunc.sendMsgToManager(smsNumArr, callbackNum, '메모리 사용률이 90%를 넘었습니다.');
						SMS_CNT.MEMORY++;
					}
					else
					{
						if(SMS_CNT.MEMORY*_PUSH_INTERVAL >= 600) {
							SMS_CNT.MEMORY = 0;
						} else {
							SMS_CNT.MEMORY++;
						}
					}
				} else {
					SMS_CNT.MEMORY = 0;
				}

				pushServerInfo();
			});
		}, _PUSH_INTERVAL*1000);
	}
	catch (e)
	{
		console.log(e);
	}	
}


function pushFileCnt() {	
	try
	{
		setTimeout(function() {
			var res = {};
			
			for(var i=0; i<targetFolderArr.length; i++) {
				CommonFunc.countNumOfFiles(targetFolderArr[i], i, function(idx, cnt) {
					var res= {
						path: targetFolderArr[idx],
						cnt: cnt
					};

					webApp.sendDataToAll(res, "FILES_CNT");	//PUSH

					if(cnt >= 100) {
						if(FILE_SMS_CNT_ARR[idx] == 0)
						{	 
							var pathArr = targetFolderArr[idx].split("/");
							CommonFunc.sendMsgToManager(smsNumArr, callbackNum, '파일 개수가 100개를 넘었습니다.\r\n'+'['+pathArr[pathArr.length-3]+"/"+pathArr[pathArr.length-2]+']');
							FILE_SMS_CNT_ARR[idx]++;
						}
						else
						{
							if(FILE_SMS_CNT_ARR[idx]*_PUSH_INTERVAL >= 600) {
								FILE_SMS_CNT_ARR[idx] = 0;
							} else {
								FILE_SMS_CNT_ARR[idx]++;
							}
						}
					} else {
						FILE_SMS_CNT_ARR[idx] = 0;
					}
					
					if(idx == (targetFolderArr.length-1)) {
						pushFileCnt();
					}				
				});			
			}
		}, _PUSH_INTERVAL*1000);
	}
	catch (e)
	{
		console.log(e);
	}	
}

pushServerInfo();
pushFileCnt();