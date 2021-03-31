const sql = require('mssql');
const query = require('./dbQuery.js');


module.exports = {
	pool: null,
	config: {
		user: 'tgeonet_new',
		password: '$xmflvhtmghkdlxld',
		server: '112.216.26.94',
		port: '1433',
		database: 'TGEO_NEW',

		options: {
			encrypt: true // Use this if you're on Windows Azure
		}			
	},

	configSMS: {
		user: 'sms_user',
		password: '$triphos14!',
		server: '112.216.26.94',
		port: '1433',
		database: 'SMS_DB',

		options: {
			encrypt: true // Use this if you're on Windows Azure
		}
	},

	init: function() {
		
	},

	sendSMS: function(hNum, callbackNum, msg) {
		new sql.ConnectionPool(this.configSMS).connect().then(function(pool) {

			return pool.request().query(query.sendSMSQuery(hNum, callbackNum, msg))

		}).then(function(result) {
			var rowsAff = result.rowsAffected;
			if(rowsAff[0] > 0) {
				console.log("send sms! ["+msg+"]");
			}
			sql.close();
	    }).catch(function(err) {
			console.log(err);
			sql.close();
		});
	},






	/**
	 * 테스트 함수
	 */
	connectTest: function() {
		var connection = sql.connect(this.config, function(err) {
			var request = new sql.Request(connection); 

			request.query(query.testQeury(), function(err, recordSet) {
				console.log(recordSet);
			});
		});
	},
	/**
	 * 테스트 함수
	 */
	smsTest: function() {
		new sql.ConnectionPool(this.configSMS).connect().then(function(pool) {
			return pool.request().query(query.testSMSQuery())
		}).then(function(result) {
			console.log(result);			
			sql.close();
	    }).catch(function(err) {
			console.log(err);
			sql.close();
		});
	},
}