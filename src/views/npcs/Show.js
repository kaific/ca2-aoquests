import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';

// const Genre = props => (
//     <Badge variant="light">{props.genre}</Badge>
// );

export default class NpcShow extends Component {
    constructor(props) {
        super(props);

        this.state = {
            npc: {},
            loading: true,
            loggedIn: props.loggedIn
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;

        console.log(this.props);
        axios.get(`http://localhost:4000/npcs/${id}`)
        .then(response => {
            console.log("response:", response);
            this.setState({
                
                npc: response.data,
                loading: false
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    render() {
        const { npc, loading, loggedIn } = this.state;
        const { id } = this.props.match.params;

        if(loading) {
            return (
                <div>
                    <h3>Loading...</h3>
                </div>
            )
        }

        return (
            <>
            <br/>
            <Col sm={{span: 8, offset: 2}}>
                <Card>
                    <Card.Header as="h5">
                        {npc.name}
                    </Card.Header>
                    <Card.Body>
                        <Row>
                            <Col sm={3} xs={6}>
                                Zone:
                            </Col>
                            <Col sm={9} xs={6}>
                                {npc.zone}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3} xs={6}>
                                Coords:
                            </Col>
                            <Col sm={9} xs={6}>
                                x: {npc.coords.x} &nbsp;&nbsp;z: {npc.coords.z} &nbsp;&nbsp;pf: {npc.coords.pf}
                            </Col>
                        </Row>
                        <Row className="pt-2">
                            <Col sm={{span: 9, offset: 3}} xs={{span: 6, offset: 6}}>
                                <Row className="px-3">
                                    <Col sm={5} className="px-0">
                                        <Form.Control
                                            id="waypoint"
                                            type="text"
                                            value={`/waypoint ${npc.coords.x} ${npc.coords.z} ${npc.coords.pf}`}
                                            readOnly
                                        />
                                    </Col>
                                    <Col sm={7}>
                                        <Button onClick={this.copyWp} variant="success">Copy</Button>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row as={Col} className="pt-3">
                            <Button as={Link} to="/npcs" variant="primary">View all npcs</Button>&nbsp;
                            {loggedIn ?
                                <>
                                <Button as={Link} to={`/npcs/${id}/edit`} variant="warning">Edit</Button>&nbsp;
                                <Button as={Link} to={`/npcs/${id}/edit`} variant="danger">Delete</Button>
                                </>
                            :
                            <></>
                            }
                        </Row>
                    </Card.Body>
                </Card>
            </Col>
            </>
        );
    }
}
