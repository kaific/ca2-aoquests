import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col } from 'react-bootstrap';

// const Genre = props => (
//     <Badge variant="light">{props.genre}</Badge>
// );

export default class NpcEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            npc: {},
            loading: true
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

    // genreList() {
    //     return this.state.npc.genre.map((currentGenre, index) => {
    //         return <Genre genre={currentGenre.name} key={index} />;
    //     });
    // }

    render() {
        const { npc, loading } = this.state;
        const { id } = this.props.match.params;

        if(loading) {
            return (
                <div>
                    <h3>Loading...</h3>
                </div>
            )
        }

        return (
            <div>
                <br/>
                <Card>
                    <Card.Header as="h5">
                        {npc.name} {/* <span className="float-right">{ this.genreList() }</span> */}
                    </Card.Header>
                    <Card.Body>
                        {/* <Card.Title>Synposis</Card.Title>
                        <Card.Text>
                            There is no synopsis in the DB.
                        </Card.Text> */}
                        <Row>
                            <Col sm={3}>
                                Zone:
                            </Col>
                            <Col sm={9}>
                                {npc.zone}
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={3}>
                                Coords:
                            </Col>
                            <Col sm={9}>
                                [{npc.coords.x}, {npc.coords.z}, {npc.coords.pf}]
                            </Col>
                        </Row>
                        <Button as={Link} to="/npcs" variant="primary">View all npcs</Button>
                        <Button as={Link} to={"/npcs/"+id+"/edit"} variant="warning">Edit</Button>
                        <Button as={Link} to={"/npcs/"+id+"/edit"} variant="danger">Delete</Button>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}
