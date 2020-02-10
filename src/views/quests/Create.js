import React, { Component } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Zone = props => (
    <option value={props.zone}>{props.zone}</option>
);

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
                zone: '',
                giver: '',
            },
            zones: [],
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
            newMission.zone = response.data[0].zone;

            var npcs = response.data;
            console.log(response.data)
            var zones = [];
            var npcsByZone = [];
            npcs.map(npc => {
                if(!zones.includes(npc.zone)) {
                    zones.push(npc.zone);
                    var obj = {zone: npc.zone, npcs: []};
                    npcsByZone.push(obj);
                }
                var simpleNpc = {_id: npc._id, name: npc.name};
                npcsByZone.map(zone => {
                    if(zone.zone == npc.zone) {
                        zone.npcs.push(simpleNpc);
                    }
                    return null;
                });
                return null;
            });

            this.setState({
                zones,
                npcs: npcsByZone,
                loading: false,
                mission: newMission
            });

            console.log(this.state);
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

            if(objAttr === "zone") {

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
        if(this.state.mission.description.length == 0 || this.state.mission.giver.length == 0) {
            return;
        }
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

        const quest = {
            name: this.state.name,
        };

        console.log(quest);

        axios.post('http://localhost:4000/quests', quest)
        .then(res => console.log(res.data))
        .catch(err => console.log(err));

        window.location = '/';
    };

    zoneList() {
        console.log(this.state.zones)
        return this.state.zones.map((zone, index) => {
            return <Zone zone={zone} key={index}/>
        });
    }

    npcList() {
        return this.state.npcs.map((zone) => {
            if(this.state.mission.zone == zone.zone) {
                return zone.npcs.map((npc, index) => {
                    console.log("current npc: ", npc);
                    console.log("current zone: ", zone.zone == this.state.mission.zone);
                    return <NPC npc={npc} key={index}/>
                });
            }
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
                                <Col sm={4}>
                                    <Form.Control as="select"
                                        name="mission.zone"
                                        onChange={this.handleInputChange}
                                    >
                                        { this.zoneList() }
                                    </Form.Control>
                                </Col>
                                <Col sm={4}>
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