const os = require('os-utils');
const diskSpace = require('check-disk-space');
const fs = require('fs');
const dateFormat = require('dateformat');
const DB = require('./db.js');

module.exports = {

	sendMsgToManager: function(numArr, callbackNum, msg) {
		for(var i=0; i<numArr.length; i++) {
			DB.sendSMS(numArr[i], callbackNum, msg);
		}
	},

	getServerInfo: function(drive, callback) {
		os.cpuUsage(function(v){
			var cpuUsage = v*100;
			var memUsage = (1-os.freememPercentage())*100;
			var freemem = os.freemem()/1024;
			var totalmem = os.totalmem()/1024;

			diskSpace(drive).then(function(diskSpace) {
				var diskFree = ((diskSpace.free/1024)/1024)/1024;
				var diskTotal = ((diskSpace.size/1024)/1024)/1024;

				callback({
					cpuUsage: Math.floor(cpuUsage),
					memUsage: Math.floor(memUsage),					
					diskFree: Math.floor(diskFree),
					diskTotal: Math.floor(diskTotal),
					freemem: freemem.toFixed(1),
					totalmem: totalmem.toFixed(1),
				});
			});
		});
	},
	
	countNumOfFiles: function(path, idx, callback) {		
		fs.readdir(path, function(err, items) {
			if(items != null && items != undefined) {
				var cnt = 0;
				for (var i=0; i<items.length; i++) {		
					if(items[i].indexOf(".dat") > 0 || items[i].indexOf(".txt") > 0) {
						cnt++;
					}
				}
				
				callback(idx, cnt);			
			}
		});		
	},

	getCurrentDate: function() {
		var now = new Date();
		return dateFormat(now, "yyyy-mm-dd HH:MM:ss");
	},

	mkQuery: function(query, arr) {
		for(var i=0; i<arr.length; i++) {
			var re = new RegExp("\\["+(i+1)+"\\]", "g");
			query = query.replace(re, arr[i]);
		}

		return query;
	},
}