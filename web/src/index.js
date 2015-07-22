'use strict';

var App = require('./common/app');
var Page = require('./page/page');
var IO = require('./page/io');

var Data = [
	{
		"img" : "http://gtms02.alicdn.com/tps/i2/TB1dMAjIXXXXXXJXVXXvR3q4VXX-650-480.png",
		"name" : "Honda"
	},
	{
		"img" : "http://gtms04.alicdn.com/tps/i4/TB1wcUsIXXXXXXXXFXXvR3q4VXX-650-480.png",
		"name" : "Sonata L"
	},
	{
		"img" : "http://gtms04.alicdn.com/tps/i4/TB1Hi7AHVXXXXatXFXXKEuMTVXX-520-384.png",
		"name" : "Toyota"
	}
];

function enterGame(callback){
	updateCards(callback);
	// IO({
	// 	url : 'c',
	// 	complete : function(res){
	// 		if(res.code == Can_Start_States_MAP["SUCCESS"]) {
	// 			// Game Start
	// 			alert('play game');
	// 		}
	// 	}
	// });
}

function updateCards(callback){
	IO({
		url : 'c',
		complete : function(res){
			callback(res);
		}
	});
}

IO({
	url : 'c',
	complete : function(res){

		var currentTime = new Date(res.data.serverTime * 1),
			currentIndex = 1,//currentTime.getDate() - 22,
			canPlay = false;

		React.addons.Perf.start();

		React.render(

			<App offset={ document.body.getBoundingClientRect().height }>
				<Page enterGame={enterGame}
					  current={currentIndex}
					  data={Data}
					  code={res.code} /> 

				<div style={{color : 'red'}}> Rank list </div>
			</App>,

			document.getElementById('app')
		);
	}
});
