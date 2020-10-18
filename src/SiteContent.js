import React, { useContext } from 'react';
import { Container, Row, Col, Card, Jumbotron, Accordion, AccordionContext, useAccordionToggle } from 'react-bootstrap';
import './signal.css';

class SiteContent extends React.Component {
	render() {
		return (
			<Container className="networkContainer noBottom">
				<Row>
					<Col>
						<Jumbotron className="jumbo">
							<h1 className="display-4">Comparing Mobile Signal Strength</h1>
							<hr className="my-4"/>
							<p className="lead">Trying to decide between two mobile providers? Want to see which has a better signal? You're in the right place!</p>
						</Jumbotron>
					</Col>
				</Row>
				
				<Row>
					<Col>
						<p className="h3 text-center someTopPadding">How It Works</p>
						<p>The bars at the top of your smartphone screen are unreliable. This is because each mobile provider and even each smartphone have different thresholds for determining what constitutes 5 bars v.s. 4 bars, etc.</p>
						<p>There is however an objective measurement of signal strength, which is measured in decibels (dBm). This is a negative number and the closer it is to zero, the stronger it is. The scale in strength is not linear though: going up or down by 10 means a tenfold difference in strength!</p>
						<p>Follow the instructions for your phone type to record the signal strength provided by your network. Then fill out the form to determine the relative strength compared to another network's reading!</p>
					</Col>
				</Row>
				
				<Row>
					<Col>
						<PhoneAccordion/>
					</Col>
				</Row>
			</Container>
		);
	}
}

class PhoneAccordion extends React.Component {
	render() {
		return (
			<Accordion>
				<PhoneInfo key={1} eventKey={1} phone={"iPhone"}>
					<ul>
						<li>Go into your Settings > WiFi > Turn Off WiFi.</li>
						<li>Check your iOS and:
							<ul>
								<li>For iOS 9.3 and later go to Settings > Cellular > Cellular Data Options > Enable LTE > Turn Off LTE.</li>
								<li>For iOS 9.2 and earlier Settings > Cellular > Enable LTE > Turn Off LTE.</li>
							</ul>
						</li>
						<li>Make a phone call to *3001#12345#* and press call.</li>
						<li>Select Serving Cell Measurements and refer to the top item named Measured RSSI.</li>
					</ul>
				</PhoneInfo>
				
				<PhoneInfo key={2} eventKey={2} phone={"Android"}>
					<ul>
						<li>Settings > More Options or More Settings.</li>
						<li>Tap on About Phone > Mobile Networks > Signal Strength</li>
						<li>Under Signal Strength you will see your dB reading. If you do not see it there you will see it under Network Type or SIM Status.</li>
					</ul>
				</PhoneInfo>
			</Accordion>
		);
	}
}

class PhoneInfo extends React.Component {
	render() {
		return (
			<Card>
				<CustomToggle as={Card.Header} eventKey={this.props.eventKey}>
				  {this.props.phone}
				</CustomToggle>
				<Accordion.Collapse eventKey={this.props.eventKey}>
					<Card.Body>
						{this.props.children}
					</Card.Body>
				</Accordion.Collapse>
			</Card>
		);
	}
}

function CustomToggle({ children, eventKey, callback }) {
	const currentEventKey = useContext(AccordionContext);

	const decoratedOnClick = useAccordionToggle(
		eventKey,
		() => callback && callback(eventKey),
	);

	const iconName = currentEventKey === eventKey ? "oi-minus" : "oi-plus";

	return (
		<div className="card-header" type="button" onClick={decoratedOnClick}>
			{children} Instructions <span className={"float-right icon oi " + iconName} title="open/close" aria-hidden="true"></span>
		</div>
	);
}

export default SiteContent;