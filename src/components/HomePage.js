import React, { Component } from 'react';
import { Row, Col, Card } from 'react-bootstrap';

export default class HomePage extends Component {
    render() {
        return (
            <>
            <br/>
            <Row>
                <Col sm={{span: 6, offset: 3}}>
                    <Card>
                        <Card.Header as="h5">Welcome</Card.Header>
                        <Card.Body>
                            Ohai there.
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            </>
        );
    }
}