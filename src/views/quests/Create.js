import React, { Component } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, InputGroup, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Zone extends Component {
    render() {
        return (
            <option value={this.props.zone}>{this.props.zone}</option>
        );
    }
}

class NPC extends Component {
    render() {
        return (
            <option value={this.props.npc._id}>{this.props.npc.name}</option>
        );
    }
}

class Mission extends Component {
    render() {
        return (
            <>
            <Row as={Col}>
                {this.props.mission.description.split('\n').map((line, index) => {
                    return (
                        <React.Fragment key={index}>{line}<br/></React.Fragment>
                    );
                })} 
                from {this.props.mission.giver.name}
            </Row><br/>
            </>
        );
    }
}

export default class QuestCreate extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            location: 'Rubi-Ka',
            locations: ['Rubi-Ka', 'Shadowlands', 'APF', 'Legacy of the Xan'],
            missions: [],
            mission: {
                description: ``,
                zone: '',
                giver: '',
                objective: '',
                reward: 'None',
                checkDlg: false,
                dialogue: null
            },
            zones: [],
            npcs: [],
            loading: true
        }
    }

    componentDidMount() {
        axios.get(`http://localhost:4000/npcs`)
        .then(response => {
            var newMission = this.state.mission;
            newMission.giver = response.data[0];
            newMission.zone = response.data[0].zone;

            var npcs = response.data;
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
                    if(zone.zone === npc.zone) {
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
        })
        .catch(error => {
            console.log(error);
        });
    }

    handleInputChange = async e => {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        console.log(`Input name ${name}. Input value ${value}.`);

        if(name.includes('checkDlg')) {
            var mission = this.state.mission;
            if(value) {
                mission.dialogue = {npcDialogue: [], chatOptions: []};
            }
            else {
                mission.dialogue = null;
            }
            mission.checkDlg = value;
            await this.setState({
                mission
            });
            console.log(this.state.mission)
            return;
        }

        //check for nested object attribute e.g. mission.giver (state.mission.giver)
        // if(name.match('[A-z].[A-z]')) {
        if(name.includes('.')) {
            var splitName = name.split(".");
            var objName = splitName[0];
            var objAttr = splitName[1];
            var obj = this.state[objName];
            obj[objAttr] = value;

            if(objAttr === "giver") {
                const npc = this.state.npcs.filter(zone => {
                    if(zone.zone === this.state.mission.zone) {
                        const npcNest = zone.npcs.filter(npc => {
                            if(npc._id === value) return npc;
                            return null;
                        });
                        return npcNest;
                    }
                    return null;
                });
                console.log("npc: ", npc[0])
                obj[objAttr] = npc[0];
            }

            if(objAttr === "zone") {
                const zone = this.state.npcs.filter(zone => {
                    if(zone.zone === value) return zone.zone;

                    return null;
                });
                obj[objAttr] = zone[0].zone;
                // console.log(obj)
            }

            this.setState({
                [objName]: obj
            });

            // console.log(this.state[objName]);
        }
        else {
            this.setState({
                [name]: value
            });
        }
    };

    onAddMission = () => {
        if(this.state.mission.description.length === 0 || this.state.mission.giver.name.length === 0) {
            return;
        }
        var newMish = this.state.mission;
        var newDesc = newMish.description.charAt(0).toUpperCase() + newMish.description.substring(1);
        newMish.description = newDesc;
        this.setState({ mission: newMish });
        this.setState(state => {
            const missions = [...state.missions, state.mission];
            console.log("missions ", missions)
            return {
                missions,
                mission: {
                    description: ``,
                    zone: this.state.npcs[0].zone,
                    giver: this.state.npcs[0],
                    objective: '',
                    reward: 'None',
                    checkDlg: false,
                    dialogue: null
                }
            };
        });
        
    };

    onSubmit = e => {
        e.preventDefault();

        const quest = {
            name: this.state.name,
            location: this.state.location
        };

        console.log(quest);

        // axios.post('http://localhost:4000/quests', quest)
        // .then(res => console.log(res.data))
        // .catch(err => console.log(err));

        // window.location = '/';
    };

    zoneList() {
        return this.state.zones.map((zone, index) => {
            return <Zone zone={zone} key={index}/>
        });
    }

    npcList() {
        return this.state.npcs.map((zone) => {
            if(this.state.mission.zone === zone.zone) {
                return zone.npcs.map((npc, index) => {
                    return <NPC npc={npc} key={index}/>
                });
            }
            return null;
        });
    }

    missionList() {
        return this.state.missions.map((mission, index) => {
            return <Mission mission={mission} key={index}/>
        });
    }

    render() {
        const { loading, locations, mission } = this.state;
        
        if(loading) {
            return (
                <>
                <br/>
                <Card>
                    <Card.Body>
                        Loading...
                    </Card.Body>
                </Card>
                </>
            );
        }

        return (
            <>
            <br/>
            <Col>
                <Card>
                    <Card.Header as="h3">Add new Quest</Card.Header>
                    <Card.Body>
                        <Form onSubmit={this.onSubmit}>
                            {
                            /*
                             *
                             *  QUEST NAME
                             * 
                            */
                            }
                            <Form.Group as={Row} controlId="formHorizontalName">
                                <Form.Label column sm={2}>
                                    Name:
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control type="text" placeholder="Name"
                                        name="name"
                                        value={this.state.name}
                                        onChange={this.handleInputChange}
                                    />
                                </Col>
                            </Form.Group>
                            {
                            /*
                             *
                             *  QUEST LOCATION
                             * 
                            */
                            }
                            <Form.Group as={Row} controlId="formHorizontalLocation">
                                <Form.Label column sm={2}>
                                    Location:
                                </Form.Label>
                                <Col sm={10}>
                                    <Form.Control as="select"
                                        name="location"
                                        onChange={this.handleInputChange}
                                    >
                                        {locations.map((l, index) => { return (<option key={index} value={l}>{l}</option>) })}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            {
                            /*
                             *
                             *  QUEST MISSIONS
                             * 
                            */
                            }
                            <Form.Group as={Row} controlId="formHorizontalMissions">
                                <Form.Label column sm={2}>
                                    Missions:
                                </Form.Label>
                                <Col>
                                    {
                                    /*
                                    *
                                    *  MISSION LIST
                                    * 
                                    */
                                    }
                                    { this.missionList() }
                                    <InputGroup as={Row} noGutters>
                                        {
                                        /*
                                        *
                                        *  MISSION NPC
                                        * 
                                        */
                                        }
                                        <Form.Group as={Col} sm={12} controlId="formHorizontalMissionNPC">
                                            <Row>
                                                <Form.Label column sm="auto" className="pr-0">NPC:</Form.Label>
                                                <Col className="pr-1">
                                                    <Form.Control as="select"
                                                        name="mission.zone"
                                                        onChange={this.handleInputChange}
                                                    >
                                                        { this.zoneList() }
                                                    </Form.Control>
                                                </Col>
                                                <Col className="pl-1">
                                                    <Form.Control as="select"
                                                        name="mission.giver"
                                                        onChange={this.handleInputChange}
                                                    >
                                                        { this.npcList() }
                                                    </Form.Control>
                                                </Col>
                                                <Col sm="auto" className="pl-1">
                                                    <Button as={Link} to={{pathname: "/npcs/create", state: { prevPath: '/quests/create' }}} variant="outline-success">
                                                        New
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                        {
                                        /*
                                        *
                                        *  MISSION DESCRIPTION
                                        * 
                                        */
                                        }
                                        <Form.Group as={Col} sm={12} controlId="formHorizontalMissionDescription">
                                            <Form.Control as="textarea" placeholder="Mission description"
                                                name="mission.description"
                                                value={mission.description}
                                                onChange={this.handleInputChange}
                                            />
                                        </Form.Group>
                                        {
                                        /*
                                        *
                                        *  MISSION OBJECTIVE
                                        * 
                                        */
                                        }
                                        <Form.Group as={Col} sm={12} controlId="formHorizontalMissionObjective">
                                            <Row>
                                            <Form.Label column sm={2} className="pr-0">
                                                Objective:
                                            </Form.Label>
                                            <Col sm={10}>
                                                <Form.Control type="text" placeholder="Mission objective"
                                                    name="mission.objective"
                                                    value={this.state.mission.objective}
                                                    onChange={this.handleInputChange}
                                                />
                                            </Col>
                                            </Row>
                                        </Form.Group>
                                        {
                                        /*
                                        *
                                        *  MISSION REWARD
                                        * 
                                        */
                                        }
                                        <Form.Group as={Col} sm={12} controlId="formHorizontalMissionReward">
                                            <Row>
                                            <Form.Label column sm={2} className="pr-0">
                                                Reward:
                                            </Form.Label>
                                            <Col sm={10}>
                                                <Form.Control type="text" placeholder="Mission reward"
                                                    name="mission.reward"
                                                    value={this.state.mission.reward}
                                                    onChange={this.handleInputChange}
                                                />
                                            </Col>
                                            </Row>
                                        </Form.Group>
                                        {
                                        /*
                                        *
                                        *  MISSION DIALOGUE
                                        * 
                                        */
                                        }
                                        <Form.Group as={Col} sm={12} controlId="formHorizontalMissionDialogue">
                                            {/***** CHECK *****/}
                                            <Form.Check
                                                type='checkbox'
                                                name='mission.checkDlg'
                                                onChange={this.handleInputChange}
                                                label="This mission has NPC dialogue."
                                                checked={this.state.mission.checkDlg}
                                            />
                                            
                                            {/***** NPC DIALOGUE *****/}
                                            {}
                                        </Form.Group>
                                        <InputGroup.Append as={Col} sm={12} className="justify-content-md-center">
                                            <Button onClick={this.onAddMission} variant="outline-success">
                                                Add Mission
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Col sm={ { span: 10, offset: 2 } }>
                                    <Button type="submit">Add Quest</Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            </>
        );
    }
}