'use strict';

React.initializeTouchEvents(true);

var iOS = window.navigator.userAgent.indexOf('iPhone') >= 0;

var MaxDistance = 100,
    MaxScale = 0.5,
	
    RAF = window.requestAnimationFrame || 
          window.webkitRequestAnimationFrame || 
          window.MozRequestAnimationFrame || 
          function(callback){
            setTimeout(callback);
          };

/**
 * [getInitialState description]
 * @param  {[type]} ){		return           {			translate :                                     this.props.translate		};	} [description]
 * @param  {[type]} componentDidMount     :              function(){		this.direction          [description]
 * @param  {[type]} shouldComponentUpdate :              function(){		this.domStyle.transform [description]
 * @return {[type]}                       [description]
 */
var AppView = React.createClass({

	componentWillMount : function(){
		this.direction = this.props.direction || 'Y';
		if(this.props.translate == 0) {
			this.status = 'current';
		} else if(this.props.translate < 0) {
			this.status = 'prev';
		} else if(this.props.translate > 0) {
			this.status = 'next';
		}
	},

	/**
	 * [componentDidMount description]
	 * @return {[type]} [description]
	 */
	componentDidMount : function(){
	    this.domStyle = React.findDOMNode(this).style;
		this.domStyle.transform = this._getPosition();
	},

	/**
	 * This method will not be called for the initial render
	 * @return {[boolean]} [prevent ReactElement to rerender]
	 */
	shouldComponentUpdate : function(){
		this.domStyle.transform = this._getPosition();
		return false;
	},

	_bindTransitionEnd : function(callback){
		var isTransitionEnd = false,
			dom = React.findDOMNode(this);

		function transitionEndCallback() {
			callback();
			isTransitionEnd = true;
			dom.removeEventListener('webkitTransitionEnd', arguments.callee);
		}
		dom.addEventListener('webkitTransitionEnd', transitionEndCallback);

		setTimeout(function(){
	        if (isTransitionEnd) return;
	        isTransitionEnd = null;
	        transitionEndCallback();
	    }, 300 + 30);

	},

	/**
	 * [_getPosition description]
	 * @return {[type]} [description]
	 */
	_getPosition : function(distance){
		var scale = 1,
			translate = distance,
			transform = [],
			offset = this.props.offset;

		if(distance > 0) {
			if(this.status == 'prev') {
				scale = MaxScale + (1 - MaxScale) * Math.abs(distance + offset) / offset;
				// translate = distance - height;
			} else if(this.status == 'current') {
				scale = 1;
				// translate = distance;
			}
		} else {
			if(this.status == 'next') {
				scale = 1;
				// translate = height + distance;
			} else if(this.status == 'current') {
		    	scale = 1 - (1 - MaxScale) * Math.abs(distance) / offset;
				// translate = distance;
			}
		}
			
		transform = ["translate", this.direction, "(", translate, "px) translateZ(0px) scale(", scale, ")"];

		// if( this.status == 'next' ||
		//    (this.status == 'current' & distance > 0) ) {

		// 	transform = ["translate", this.direction, "(", (height + distance), "px) translateZ(0px)"];

		// } else {
		// 	var translate = 0, scale = 1;

		// 	if(this.status == 'current') {
		// 		translate = distance;
		// 	} else if(this.status == 'prev') {
		// 		translate = distance - height;
		// 	}

		// 	if( distance > 0 ) {
		// 	    scale = MaxScale + (1 - MaxScale) * Math.abs(distance) / height
		// 	} else if( distance < 0 ) {
		// 	    scale = 1 - (1 - MaxScale) * Math.abs(distance) / height
		// 	}

		// 	transform = ["translate", this.direction, "(", translate, "px) translateZ(0px) scale(", scale, ")"];
		// }

		return transform.join('');
	}, 

	start : function(startDistance){
		this.startDistance = startDistance;
	    this.domStyle.webkitTransition = '';
	},

	move : function(dragDistance){
		this.domStyle.webkitTransform = this._getPosition(dragDistance);
	},

	restore : function(){
	    this.domStyle.webkitTransition = 'all 300ms ease';
		this.domStyle.webkitTransform = this._getPosition(this.startDistance);
	},

	forward : function(offset){
	    this.domStyle.webkitTransition = 'all 300ms ease';
	    this._bindTransitionEnd(function(){
	    	if(this.status == 'current'){
				this.status = 'prev';
			} else if(this.status == 'next') {
				this.status = 'next';
			}
			// this.props.initial();
	    });

		if(this.status == 'current'){
			this.domStyle.webkitTransform = this._getPosition(-offset);
		} else if(this.status == 'next') {
			this.domStyle.webkitTransform = this._getPosition(0);
		} else if(this.status == 'prev') {
			return false;
		}
	},

	back : function(offset){
	    this.domStyle.webkitTransition = 'all 300ms ease';
	    this._bindTransitionEnd(function(){

			// this.props.dispatch();
	    });

		if(this.status == 'current'){
			this.domStyle.webkitTransform = this._getPosition(offset);
		} else if(this.status == 'prev') {
			this.domStyle.webkitTransform = this._getPosition(0);
		} else {
			return false;
		}
	},

	render : function(){
		var transform = this._getPosition(this.props.translate);
		return (
			<div className="app-view" 
				 style={{
					position : 'absolute',
					top : '0px',
					left : '0px',
					width: '100%',
					height: '100%',
					WebkitTransform: transform
				 }} >

	        	<div class="app-view-content">
					{this.props.children}
				</div>

			</div>
		)
	}
});


/**
 * [componentDidMount description]
 * @param  {[type]} ){	                                                             this.domStyle [description]
 * @param  {[type]} onDragStart :             function(e){		if (this.props.stopped) return;                           var touch [description]
 * @return {[type]}             [description]
 */
var App = React.createClass({

	componentWillMount : function(){
   		this.OverThreshold = false;
   		this.currentIndex = this.props.currentIndex || 0;
   		this.offset = this.offset;
	},

	componentDidMount : function(){

	    this.domStyle = React.findDOMNode(this).style;

		// this.domStyle.transform = 'translateX(-' + this.props.offset * this.props.currentIndex + 'px) translateZ(0)';
		this.domStyle.transition = 'transform 300ms ease';

		this.initialCardStack();

	},

	initialCardStack : function(){
		var length = this.props.children.length;

		if( this.currentIndex <= 0 ) {
			this.prev = null;
		} else {
			this.prev = this.refs['app-view-' + (this.currentIndex - 1)];
		}

		this.current = this.refs['app-view-' + this.currentIndex];

		if( this.currentIndex >= length -1 ) {
			this.next = null;
		} else {
			this.next = this.refs['app-view-' + (this.currentIndex + 1)];
		}
	},

	onDragStart : function(e){

		if (this.props.stopped) return;

        var touch = e.touches.length ? e.touches[0] : e.changedTouches[0];
		this.startY = touch.pageY;
        this.prevPoint = {
            x: touch.pageX,
            y: touch.pageY
        };
        var startDistance = this.props.offset;

	    this.prev && this.prev.start(-startDistance);
	    this.current.start(0);
	    this.next && this.next.start(startDistance);

	},

	onDrag : function(e){

		var touch = e.touches.length ? e.touches[0] : e.changedTouches[0],
			offsetX = touch.pageX - this.prevPoint.x,
			offsetY = touch.pageY - this.prevPoint.y;
    	// if(Math.abs(offsetX) > Math.abs(offsetY)) {
    	// 	e.stopPropagation();
    	// } else {
    	// 	return;
    	// }
        e.preventDefault();

		this.prevPoint = {
		    x: touch.pageX,
		    y: touch.pageY
		};

	    var moveDistance = Math.floor(touch.pageY - this.startY),
	     	dragDistance;

	    if (moveDistance < 0 && this.currentIndex == this.props.maxLength - 1) {
	    	// e.stopPropagation();
	        return;
	    } else if (moveDistance > 0 && this.currentIndex == 0) {
	    	// e.stopPropagation();
	        return;
	    }

	    dragDistance = moveDistance;

	    this.prev && this.prev.move(dragDistance - this.props.offset);
	    this.current.move(dragDistance);
	    this.next && this.next.move(dragDistance + this.props.offset);

	    if (Math.abs(moveDistance) >= MaxDistance) {
	        if (this.OverThreshold == false) {
	            this.OverThreshold = true;
	            this.dragDistance = moveDistance;
	        }
	    } else {
	        this.OverThreshold = false;
	    }
	},

	onDragEnd : function(){

		if (this.props.stopped) return false;

		var me = this,
			offset = this.props.offset;

	    // this.domStyle.webkitTransition = 'all 300ms ease';

        if (this.OverThreshold) {
            this.OverThreshold = false;
            if (this.dragDistance > 0) {
                
			    this.prev && this.prev.back(offset);
			    this.current.back(offset);
			    this.next && this.next.back(offset);

            } else if (this.dragDistance < 0) {
                
			    this.prev && this.prev.forward(offset);
			    this.current.forward(offset);
			    this.next && this.next.forward(offset);
			    // this.next();
            }

        } else {
		    this.prev && this.prev.restore();
		    this.current.restore();
		    this.next && this.next.restore();
        }
	},

	render : function(){

		var currentIndex = this.currentIndex,
			offset = this.props.offset;

		return (
			<div className={ (this.props.className || 'app') + (iOS ? ' ios' : '') } 
				 onTouchStart={this.onDragStart}
				 onTouchMove={this.onDrag}
				 onTouchEnd={this.onDragEnd} >

				{ 
					this.props.children.map(function(item, i){

						var translate = 0;

						if (i < currentIndex) {
							translate = -offset;
						} else if ( i > currentIndex) {
							translate = offset;
						} else {
							translate = 0;
						}

						return (
							<AppView offset={offset} translate={ translate } ref={'app-view-' + i} key={i}>
								{item}
							</AppView>
						)
					})
				}

			</div>
		)
	}

});

module.exports = App;