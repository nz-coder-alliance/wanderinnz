'use strict';

var SlideView = require('../common/slideView');
var Car = require('./car');

var Can_Start_States_MAP = {
	'SUCCESS':	'0',//	正常情况	能
	'PLAY_AFTER_PROMOTION':	'S002',//	已经晋级了，再玩	能
	'PLAY_AFTER_WIN':	'S003',//	已经赢过决赛	能
	'NOT_LOGIN':	'-407',//	未登录	不能
	'POINT_NOT_ENOUGH':	'E001',//	积分不足	不能
	'ALIPAY_VERIFIED_FAILED':	'E003',//	支付宝实名认证失败	不能
	'PHONE_VERIFIED_FAILED':	'E016',//	淘宝账号未绑定手机号	不能
	'ROUND_NOT_FOUND':	'E007',//	轮次获取失败	不能
	'SYSTEM_ERROR':	'E009',//	系统异常	不能
	'FINAL_RACE_RIGHT_FAILED':	'E013',//	没有决赛资格	不能
	'PRE_GAME_NOT_START':	'E101',//	00:00-10:00	不能
	'FINAL_GAME_NOT_START':	'E102',//	22:00-22:30	不能
	'TODAY_GAME_CLOSE':	'E103',//	22:50-24:00	不能
	'ROUND_LAST_MINUTE':	'E104',//	本轮最后一分钟不能开始游戏	不能
}

var Page = React.createClass({

	getInitialState : function(){
		this._analysisData(this.props.data, this.props.code);
		return {
			data : this.props.data
		};
	},

	_analysisData : function(Data, code){
		var canPlay = false,
			currentIndex = this.props.current;

		if( code == Can_Start_States_MAP['PRE_GAME_NOT_START'] ||
			code == Can_Start_States_MAP['TODAY_GAME_CLOSE'] ) {
			canPlay = false;
		} else if ( code == Can_Start_States_MAP['FINAL_GAME_NOT_START'] ) {
			canPlay = false;
		} else {
			canPlay = true;
		}

		for( var i = 0, len = Data.length ; i < len ; i++ ) {
			Data[i].over = false;
			if( i == currentIndex ) {
				Data[i].canPlay = canPlay;
				if(code == Can_Start_States_MAP['TODAY_GAME_CLOSE']) {
					Data[i].over = true;
				}
			} else if( i > currentIndex ) {
				Data[i].over = false;
				Data[i].canPlay = false;
			} else {
				Data[i].over = true;
				Data[i].canPlay = false;
			}
		}
	},

	clickStart : function(){
		var me = this;
		me.props.enterGame(function(res){
			me._analysisData(me.props.data, res.code);
			me.setState({
				data : me.props.data
			});

			React.addons.Perf.printExclusive();
		});
	},
	
	render : function(){
		return (
			<div id="slider">
				<SlideView 
					currentIndex={ this.props.current } 
					offsetX={ 320 } 
					maxLength={ this.state.data.length } >

					{
						this.state.data.map(function(d){
							return (
								<Car clickStart={this.clickStart}
								  img={d.img} name={d.name} canPlay={d.canPlay} over={d.over}
								  key={d.name} />
							);
						}, this)
					}

				</SlideView> 
			</div>
		)
	}

});

module.exports = Page;