'use strict';

var Agreement = React.createClass({

	getInitialState : function(){
		return {
			agreed : true
		}
	},

	trigger : function(){
		this.props.onAgreed(!this.state.agreed);
		this.setState({
			agreed : !this.state.agreed
		});
	},

	render : function(){
		var checked = this.state.agreed ? 'checked' : '';
		return (
        	<div className="agreement" onClick={this.trigger}>
        		<div className={"checkbox " + checked } ref="agree" target="start_button">
        			<i></i>
	        	</div>
	        	<lable>I have already read </lable><a id="rule">rules</a>
	        </div>
		)
	}
});

var Car = React.createClass({

	componentDidMount : function(){
		this.agreed = true;
	},

	clickHandler : function(){
		if(this.agreed) {
			this.props.clickStart();
		}
	},

	onAgreed : function(checked){
		this.agreed = checked;
	},

	shouldComponentUpdate : function(nextProps, nextState){
		return this.props.canPlay !== nextProps.canPlay ||
			   this.props.over !== nextProps.over;
	},

	render : function() {

		var footer = [];
		if(this.props.canPlay) {
			footer.push(
				<div className="button permitted" key={this.props.name}
					 onClick={this.clickHandler}>
				</div>
			);
			footer.push(
				<Agreement key={this.props.name + 'agreement'} onAgreed={this.onAgreed}/>
			);
		} else {
			footer.push(<div className={"button close " + (this.props.over ? 'over' : '')} key={this.props.name}></div>)
		}

		return (
			<div className="card">
		        <div className="car">
		            <img src={this.props.img} />
		            <div className="car-name">{this.props.name}</div>
		        </div>
		        <div className="card-footer">
		        	{footer}
		        </div>
		    </div>
		)
	}
});

module.exports = Car;