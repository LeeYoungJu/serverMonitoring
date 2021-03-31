module.exports = {
	sendSMSQuery: function(phNum, callbackNum, msg) {
		var query = "";
		query += " INSERT INTO em_tran (tran_phone, tran_callback, tran_status, tran_date, tran_msg, tran_type) ";
		query += " VALUES('"+phNum+"', '"+callbackNum+"', 1, GETDATE(), '"+msg+"', 4); ";
		
		return query;
	},


	testQeury: function() {
		var query = "";
		query += " select COMP_CD, CAR_IDX ";
		query += " from car_info with(nolock) ";
		query += " where comp_cd='test' ";
		
		return query;
	},

	testSMSQuery: function() {
		var query = "";
		query += " select top 1 * ";
		query += " from em_log_201801 with(nolock) ";
		
		return query;
	},
}