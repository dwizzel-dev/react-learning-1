"use strict";


//--------------------------------------
class ProgressBar extends React.Component {
	constructor(props) {
		super(props);
	}
	//just render the bar, depending on the props state
	render(){
		const baseTime = 60;
		//the counter was passed as a property during re-render of his parent component
		const width = ((this.props.counter % baseTime) / baseTime) * 100;
		return(
			<div className="progressbar-outer">
				<div className="progressbar-inner" style={{width: 'calc(' + width + '% - 1px)'}}></div>
			</div>
		)
	};
}

//--------------------------------------

class ClockButton extends React.Component {
	constructor(props) {
		super(props);
		//properties
		this.state = {
			active: true,
			name: props.name
		};
		//when we need a binding right from the start
		this.changeLook = this.changeLook.bind(this);
	}

	//no binding on the button
	changeLook() {
		//set the state and wait for the done callback
		this.setState({
			active: !this.state.active
		}, () => {
			//passed by props
			if(this.props.onButtonClick){
				//call another component method passed in props constructor
				this.props.onButtonClick(this.state.active);
			}
		});
		
	}

	//no binding on the button
	changeLookNoBinding(ev, btn) {
		this.changeLook();
	}

	//with binding on the button
	changeLookWithBinding(btn) {
		this.changeLook();
	}

	//just rendering some text depending on the state.active state
	showMeActive(){
		if(this.state.active){
			return(
				<h3>The clock is active</h3>
			);
		}
		return('');
	}

	//just rendering some text depending on the state condition: ON/OFF
	showMeOff(){
		return(
			<h3>Oh No! The clock is dead...</h3>
		);
	}

	//render the button	
	render() {
		return (
			<div>
				{/* action without binding and arrow function */}
				<button
					className={this.state.active ? "active" : ""}
					onClick={(e) => this.changeLookNoBinding(e, 'button 1')}
				>
					Arrow function
				</button>
				{/* action with binding */}
				<button
					className={this.state.active ? "active" : ""}
					onClick={this.changeLookWithBinding.bind(this, 'button 2')}
				>
					{this.state.name} {this.state.active ? "On" : "Off"}
				</button>
				{/* action with constructor binding */}
				<button
					className={this.state.active ? "active" : ""}
					onClick={this.changeLook}
				>
					No Binding
				</button>
				{/* some conditions render */}
				{this.showMeActive()}
				{!this.state.active ? this.showMeOff() : ''}
			</div>
		);
	}
}

//--------------------------------------

class ClickableButton extends React.Component {

	constructor(props) {
		super(props);
		//properties
		this.state = {
			active: true,
		};
	}

	//on the click of the button call the registered function passed has props args
	onClick(){
		this.setState({
			active: !this.state.active,
		})
		if(this.props.onButtonClick){
			this.props.onButtonClick();
		}
	}

	//render the button	
	render() {
		return (
			<div>
				<button 
					className={this.state.active ? "active" : ""}
					onClick={() => this.onClick()}
				>
				{this.state.active ? 'Rendering' : 'No Render'}
				</button>
			</div>
		);
	}

}
//--------------------------------------

class Clock extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			render: true,
			paused: true,
			counter: 0,
			date: new Date()
		};
		this.timerID = 0;
		this.freq = 100;
	}

	//tell to re-render only if set to render true
	shouldComponentUpdate(nextProps, nextState){
		if(!this.state.render){
			return false;
		}
		return true;
	}
	

	//pause the rendering of the view
	pauseRendering(){
		this.setState({
			render: !this.state.render,
		});
	}

	//on compoenent is loaded
	componentDidMount() {
		this.startStopClock(true);
	}

	//on compoenent unload
	componentWillUnmount() {
		this.startStopClock(false);
	}

	//jus ticking
	tick() {
		this.setState({
			counter: this.state.counter + (this.freq/1000),
			date: new Date()
		});
	}

	//that function can be called by another component by passing it
	startStopClock(status){
		if(this.state.paused && status){
			//restart the timer
			this.timerID = setInterval(() => this.tick(), this.freq);
			this.setState({paused: false})
		}else{
			//stop the timer
			clearInterval(this.timerID);
			this.setState({paused: true})
		}
	}

	//the clock rendering
	render() {
		const counter = Number.parseFloat(this.state.counter).toFixed(2);
		return (
			<div>
				<h1>{this.state.date.toLocaleTimeString()}</h1>
				{/* the progress bar use the counter props to render the new state */}
				<ProgressBar counter={counter} />
				<p>
					Running for <b>{counter} seconds</b>
				</p>
				<div>
					{/* the clock button call a methos from within this compoenent */}
					<ClockButton name="The Clock is" onButtonClick={this.startStopClock.bind(this)} />
				</div>
				<div>
					{/* the clock button call a methos from within this compoenent */}
					<ClickableButton onButtonClick={this.pauseRendering.bind(this)} />
				</div>
			</div>
		);
	}
}

//--------------------------------------

//init the app
ReactDOM.render(<Clock />, document.getElementById("clocking"));
