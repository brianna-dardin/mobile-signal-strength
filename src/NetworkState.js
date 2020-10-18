import React from 'react';
import { Button, Container, Row, Col, InputGroup, Form, Card, CardDeck, Modal } from 'react-bootstrap';
import './signal.css';

class NetworkState extends React.Component {
	constructor(props) {
		super(props);
		
		this.outputRef = React.createRef();
		this.networkRefs = { "one" : React.createRef(),
							 "two" : React.createRef()};
		
		let defaultNetworks = [];
		for (let i = 0; i < 2; i++) {
			let net = {"number" : i+1, 
						"network" : "", 
						"signal" : NaN, 
						"strength" : NaN};
			defaultNetworks.push(net);
		}
		
		this.state = {networks : defaultNetworks,
					  response : [],
					  invalid : false,
					  modalShow : false};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
		this.isInvalid = this.isInvalid.bind(this);
		this.closeModal = this.closeModal.bind(this);
	}
	
	componentDidUpdate(props) {
		let formInvalid = false;
		
		if (this.networkRefs.one.current !== null) {
			let thisInvalid = this.isInvalid(this.networkRefs.one.current.state);
			if (thisInvalid && !formInvalid) {
				formInvalid = thisInvalid;
			}
		}
		
		if (this.networkRefs.two.current !== null) {
			let thisInvalid = this.isInvalid(this.networkRefs.two.current.state);
			if (thisInvalid && !formInvalid) {
				formInvalid = thisInvalid;
			}
		}
		
		if (this.state.invalid !== formInvalid) {
			this.setState({
				invalid : formInvalid
			});
		}
	}
	
	isInvalid(net) {
		return (net.networkInvalid && !net.networkValid) || (net.signalInvalid && !net.signalValid);
	}

	handleChange(net) {
		let newNetworks = this.state.networks;

		let foundIndex = newNetworks.findIndex(x => x.number === net.number);
		newNetworks[foundIndex] = net;

		this.setState({
			networks : newNetworks
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		event.stopPropagation();
		
		let formTag = event.currentTarget;
		
		if (formTag.checkValidity() && !this.state.invalid) {
			let request = {"networks": this.state.networks};
			console.log("request: " + JSON.stringify(request));
			
			postData('http://briannadardin.pythonanywhere.com/api/signal', request)
				.then(data => {
					console.log("response: " + JSON.stringify(data));
					
					this.setState({
						response : data
					});
					
					this.outputRef.current.scrollIntoView({ behavior: 'smooth' });
				})
				.catch((error) => {
					console.error('Error:', error);
			});
		} else {
			this.setState({
				modalShow : true
			});
		}
	}
	
	closeModal() {
		this.setState({
			modalShow : false
		});
	}

	render() {
		let networkInputs = this.state.networks.map((net, index) => {
			let strRef = index ? "two" : "one";
			return (
				<NetworkInput key={net.number.toString()} ref={this.networkRefs[strRef]} network={net} handleChange={this.handleChange}/>
			);
		});
		
		let networkOutputs = this.state.response.map((net, index) => {
			let other = index ? 0 : 1;
			return (
				<NetworkOutput key={this.state.response[index].number.toString()} 
							thisNetwork={this.state.response[index]}
							thatNetwork={this.state.response[other]}/>
			);
		});

		return (
			<div>
				<Container className="networkContainer">
					<Row>
						<Col>
							<p className="h3 text-center someBottomPadding">Compare Signals</p>
						</Col>
					</Row>
					
					<Form noValidate onSubmit={this.handleSubmit}>
						{networkInputs}
						
						<Button type="submit" variant="info" size="lg" block>
							COMPARE STRENGTHS
						</Button>
					</Form>
				</Container>
				
				<Container className="networkContainer">
					<Row>
						<Col>
							<CardDeck>
								{networkOutputs}
							</CardDeck>
							<div ref={this.outputRef} />
						</Col>
					</Row>
				</Container>
				
				<ErrorModal show={this.state.modalShow} onHide={this.closeModal}/>
			</div>
		);
	}
}

async function postData(url = '', data = {}) {
	let body = JSON.stringify(data);
	
	const response = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: body
	});
	
	return response.json();
}

function ErrorModal(props) {
	return (
		<Modal {...props}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
				>
			<Modal.Header closeButton>
				<Modal.Title id="contained-modal-title-vcenter">
					Invalid form data. Please fill out all fields properly and try again.
				</Modal.Title>
			</Modal.Header>
		</Modal>
	);
}

class NetworkInput extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = { signalValid : false, 
						signalInvalid : false,
						networkValid : false,
						networkInvalid : false};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSignalChange = this.handleSignalChange.bind(this);
		this.handleNetworkChange = this.handleNetworkChange.bind(this);
	}

	handleInputChange(name, value) {
		let net = this.props.network;
		net[name] = value;

		this.props.handleChange(net);
	}

	handleSignalChange(event) {
		const name = event.target.name;
		const value = event.target.value;
		
		if (Number.isNaN(value)) {
			this.setState({
				signalValid : false,
				signalInvalid : true
			});
		} else if (value >= -140 && value <= -60) {
			this.setState({
				signalValid : true,
				signalInvalid : false
			});
		} else {
			this.setState({
				signalValid : false,
				signalInvalid : true
			});
		}
		
		this.handleInputChange(name, value);
	}

	handleNetworkChange(event) {
		const value = event.target.value;
		const name = event.target.name;
		
		if (value) {
			this.setState({
				networkValid : true,
				networkInvalid : false
			});
		} else {
			this.setState({
				networkValid : false,
				networkInvalid : true
			});
		}
		
		this.handleInputChange(name, value);
	}

	render() {
		return (
			<Form.Row>
				<Col md="2">
					<p className="someTopPadding">Network {this.props.network.number}:</p>
				</Col>
				
				<Form.Group as={Col} md="6" controlId={"network" + this.props.network.number.toString()}>
					<InputGroup className="mb-3">
						<InputGroup.Prepend>
							<InputGroup.Text>Mobile Network</InputGroup.Text>
						</InputGroup.Prepend>
						<Form.Control as="select" name="network"
								onChange={this.handleNetworkChange}
								isValid={this.state.networkValid}
								isInvalid={this.state.networkInvalid}
								custom required>
							<option value="">Choose...</option>
							<option value="Verizon">Verizon</option>
							<option value="AT&T">AT&T</option>
							<option value="T-Mobile">T-Mobile</option>
						</Form.Control>
						<Form.Control.Feedback type="invalid">
						  You must choose one of the three mobile network providers.
						</Form.Control.Feedback>
					</InputGroup>
				</Form.Group>
				
				<Form.Group as={Col} md="4" controlId={"signal" + this.props.network.number.toString()}>
					<InputGroup className="mb-3">
						<Form.Control name="signal"
							placeholder="Signal strength"
							type="number"
							isValid={this.state.signalValid}
							isInvalid={this.state.signalInvalid}
							onChange={this.handleSignalChange} 
							required/>
						<InputGroup.Append>
							<InputGroup.Text>dBm</InputGroup.Text>
						</InputGroup.Append>
						<Form.Control.Feedback type="invalid">
						  It must be a number between -140 and -60
						</Form.Control.Feedback>
				  </InputGroup>
				</Form.Group>
			</Form.Row>
		);
	}
}

class NetworkOutput extends React.Component {
	render() {
		let thisStrength = this.props.thisNetwork.strength;
		let thatStrength = this.props.thatNetwork.strength;

		if (!thisStrength || !thatStrength) {
			return null;
		}

		let strongerBy = 0;
		let moreOrLess = '';
		
		if (thisStrength > thatStrength) {
			strongerBy = thisStrength / thatStrength;
			moreOrLess = 'more';
		} else {
			strongerBy = thatStrength / thisStrength;
			moreOrLess = 'less';
		}
		
		strongerBy = strongerBy.toFixed(2);

		return (
			<Card>
				<Card.Header>Network {this.props.thisNetwork.number}: {this.props.thisNetwork.network}</Card.Header>
					<Card.Body>
						<Card.Title>Strength: {this.props.thisNetwork.strength}</Card.Title>
						<Card.Text>
							{this.props.thisNetwork.network} is {strongerBy} times {moreOrLess} powerful than {this.props.thatNetwork.network}
						</Card.Text>
				</Card.Body>
			</Card>
		);
	}
}

export default NetworkState;