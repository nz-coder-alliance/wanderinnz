
var data_switch = true;

function mock(cfg){
    if(cfg.url == 'r') {
        var rank_data = {
		    "succ": true,
		    "data": {"rankChart":{"rankList":[{"firstNick":"d**a","firstGameTime":1295.0,"roundId":"20150611-1","roundNum":1,"roundBegin":1433988000000,"roundEnd":1433995200000,"roundState":"over","isFinal":false},{"firstNick":"t**3","firstGameTime":1390.0,"roundId":"20150611-2","roundNum":2,"roundBegin":1433995200000,"roundEnd":1434002400000,"roundState":"over","isFinal":false},{"firstNick":"a**7","firstGameTime":1991.0,"roundId":"20150611-3","roundNum":3,"roundBegin":1434002400000,"roundEnd":1434009600000,"roundState":"over","isFinal":false},{"firstNick":"l**3","firstGameTime":1306.0,"roundId":"20150611-4","roundNum":4,"roundBegin":1434009600000,"roundEnd":1434016800000,"roundState":"over","isFinal":false},{"firstNick":"w**6","firstGameTime":1465.0,"roundId":"20150611-5","roundNum":5,"roundBegin":1434016800000,"roundEnd":1434024000000,"roundState":"over","isFinal":false},{"firstNick":"h**5","firstGameTime":1997.0,"roundId":"20150611-6","roundNum":6,"roundBegin":1434024000000,"roundEnd":1434031200000,"roundState":"over","isFinal":false},{"roundId":"20150611-7","roundNum":7,"roundBegin":1434033000000,"roundEnd":1434034200000,"roundState":"not_begin","isFinal":true}]},"playerStatistic":{"isPromotioned":false,"roundStatisticMap":{}},"rankStatus":"NO_BAR","timeStatus":"GAME_REST","remainingTime":10000}
		};
        cfg.complete(rank_data)
    } else {
		var can_data = {
			"succ" : "true",
			"code" : data_switch ? "0" : "E101",
			"msg" : "play after promotion.",
			"data" : {
				"serverTime" : +new Date,
				"nick" : "jottest01"
			}
		};
		data_switch = !data_switch;
    	cfg.complete(can_data);
    }
    return false;
}

module.exports = function(cfg){
	// if(window.location.search.indexOf('mock') >= 0) {
		mock(cfg);return false;
	// }
	// if(S.UA.mobile) {
	// 	cfg.url = 'mtop.tmw.car.' + cfg.url;
	// } else {
	// 	cfg.url = '//latour.taobao.com/racegame/' + cfg.url + '.do';
	// }

	// Utils.request(cfg);
}