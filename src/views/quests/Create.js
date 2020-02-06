import React, { Component } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NPC = props => (
    <option value={props.npc._id}>{props.npc.name}</option>
);

const Mission = props => (
    <>
    <Row as={Col}>
        {props.mission.description.split('\n').map((line, index) => {
            return (
                <React.Fragment key={index}>{line}<br/></React.Fragment>
            );
        })} 
        from {props.mission.giver.name}
    </Row><br/>
    </>
);

export default class QuestCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            missions: [],
            mission: {
                description: ``,
                giver: '',
            },
            npcs: [],
            loading: true
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:4000/npcs`)
        .then(response => {
            // console.log("response:", response);
            var newMission = this.state.mission;
            newMission.giver = response.data[0]._id;
            // console.log('mission', newMission);

            var npcs = response.data;
            var npcsByZone = [];
            npcs.map(npc => {
                if(!npcsByZone.includes(npc.zone)) {
                    var obj = {name: npc.zone, npcs: []};
                    npcsByZone.push(obj);
                }
                var simpleNpc = {_id: npc._id, name: npc.name};
                npcsByZone.map(zone => {
                    if(zone.name === npc.zone) {
                        zone.npcs.push(simpleNpc);
                    }
                    return null;
                });
                return null;
            });

            this.setState({
                npcs: npcsByZone,
                loading: false,
                mission: newMission
            });
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleInputChange = e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        console.log(`Input name ${name}. Input value ${value}.`);

        //check for nested object attribute
        if(name.match('[A-z].[A-z]')) {
        // if(name.includes('.')) {
            var splitName = name.split(".");
            var objName = splitName[0];
            var objAttr = splitName[1];
            var obj = this.state[objName];
            obj[objAttr] = value;

            if(objAttr === "giver") {
                const npc = this.state.npcs.filter(npc => {
                    if(npc._id === value) return npc;
                    return null;
                });

                obj[objAttr] = npc[0]._id;
            }

            this.setState({
                obj
            });

            console.log(this.state[objName]);
        }
        else {
            this.setState({
                [name]: value
            });
        }
    };

    onAddMission = () => {
        var newMish = this.state.mission;
        var newDesc = newMish.description.charAt(0).toUpperCase() + newMish.description.substring(1);
        newMish.description = newDesc;
        this.setState({ mission: newMish });
        this.setState(state => {
            const missions = [...state.missions, state.mission];
            return {
                missions,
                mission: {description: ``, giver: this.state.npcs[0]}
            };
        });
        
    };

    onSubmit = e => {
        e.preventDefault();

        // let genreJSON = this.state.genre.map((name, index) => {
        //     return {name};
        // });

        const quest = {
            name: this.state.name,
        };

        console.log(quest);

        axios.post('http://localhost:4000/quests', quest)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));

        window.location = '/';
    };

    npcList() {
        return this.state.npcs.map(npc => {
            return <NPC npc={npc} key={npc._id}/>
        });
    }

    missionList() {
        return this.state.missions.map((mission, index) => {
            return <Mission mission={mission} key={index}/>
        });
    }

    render() {
        return (
            <>
            <h3>Add new Quest</h3>
            <Form onSubmit={this.onSubmit}>
                <Form.Group as={Row} controlId="formHorizontalName">
                    <Form.Label column sm={2}>
                        Name of Quest
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="Name"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleInputChange}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} controlId="formHorizontalMissions">
                    <Form.Label column sm={2}>
                        Missions
                    </Form.Label>
                    <Col>
                        <InputGroup as={Row} noGutters>
                            <Form.Group as={Col} sm={12} controlId="formHorizontalMissions">
                                <Row>
                                <Form.Label column sm={2}>NPC:</Form.Label>
                                <Col sm={8}>
                                    <Form.Control as="select"
                                        name="mission.giver"
                                        onChange={this.handleInputChange}
                                    >
                                        { this.npcList() }
                                    </Form.Control>
                                </Col>
                                <Col sm={2}>
                                    <Button as={Link} to={{pathname: "/npcs/create", state: { prevPath: '/quests/create' }}} variant="outline-success">
                                        New
                                    </Button>
                                </Col>
                                </Row>
                            </Form.Group>
                            <Form.Group as={Col} sm={12} controlId="formHorizontalGenre">
                                <Form.Control as="textarea" placeholder="Mission description"
                                    name="mission.description"
                                    value={this.state.mission.description}
                                    onChange={this.handleInputChange}
                                />
                            </Form.Group>
                            <InputGroup.Append as={Col} sm={12} className="justify-content-md-center">
                                <Button onClick={this.onAddMission} variant="outline-success">
                                    Add Mission
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Col>
                </Form.Group>

                <Row>
                    <Col sm={ { span: 10, offset: 2 } }>
                        { this.missionList() }
                    </Col>
                </Row>

                <Form.Group as={Row}>
                    <Col sm={ { span: 10, offset: 2 } }>
                        <Button type="submit">Add Quest</Button>
                    </Col>
                </Form.Group>
            </Form>
            </>
        );
    }
}