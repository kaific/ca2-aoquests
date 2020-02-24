import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';

export default class HomePage extends Component {
  render() {
    return (
      <>
      <br/>
      <Row>
        <Col sm={{span: 6, offset: 3}}>
          <Card bg="sunset">
            <Card.Header as="h5">Welcome</Card.Header>
            <Card.Body>
            This application was created for the second coding assignment of
            the Advanced Javascript Module of the Creative Computing 
            programme (4th year) in the &nbsp;
            <a href="https://iadt.ie">Institute of Art, Design & Technology, Dún Laoghaire.</a>
            <br/><br/>
            This assignment was developed using the MERN JavaScript stack (Mongoose, Express, 
            React, Node), and additional packages such as React-Bootstrap, 
            PropTypes, JSONWebToken, Passport and Bcrypt.<br/><br/>
            Please navigate to the desired page using the navigation bar at the top of the page. 
            For CRUD functionality, please sign in using admin credentials.
            </Card.Body>
          </Card>
        </Col>
      </Row>
      </>
    );
  }
}