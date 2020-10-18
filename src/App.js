import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SiteContent from './SiteContent'
import NetworkState from './NetworkState'
import './signal.css';

function App() {
	return (
		<div>
			<SiteContent/>
			<NetworkState/>
			
			<Container className="networkContainer">
				<Row>
					<Col>
						<footer>
							<p className="text-center small">Site Copyright © <a href="http://briannadardin.com">Brianna Dardin</a> 2020. References: <a href="https://www.signalbooster.com/blogs/news/how-to-measure-signal-strength-in-decibels-on-your-cell-phone">[1]</a> <a href="https://www.boltontechnical.co.za/blogs/news/13-awesome-cell-phone-signal-booster-solutions">[2]</a></p>
						</footer>
					</Col>
				</Row>
			</Container>
		</div>
	);
}

export default App;
