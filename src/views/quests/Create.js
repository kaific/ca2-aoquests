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
            newNpcDialogue: {
                messages: [],
                trigger: 0
            },
            newNpcMessage: {
                emote: false,
                order: 0,
                content: ''
            },
            newChatOption: {
                reqOption: 0,
                killOptions: [],
                reqProgress: false,
                id: 1,
                content: ''
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

    onAddNpcMsg = () => {
      if(this.state.newNpcMessage.length === 0) {
        return;
      }
      this.setState(state => {
        var newNpcDialogue = state.newNpcDialogue;
        newNpcDialogue.messages.push(state.newNpcMessage);
        var newNpcMessage = {
          emote: false,
          content: '',
          order: (state.newNpcMessage.order + 1)
        }
        return {
          newNpcDialogue,
          newNpcMessage
        }
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
        if(this.state.missions.length > 0) {
            return this.state.missions.map((mission, index) => {
                return <Mission mission={mission} key={index}/>
            });
        }
        return "You have not added any missions yet."
    }

    messageList() {
      if(this.state.newNpcDialogue.messages.length > 0) {
        return;
      }
      return "You have not added any messages yet."
    }

    npcTurnList() {
      if(this.state.mission.dialogue.npcDialogue.length > 0) {
        return;
      }
      return "You have not added an NPC turn yet."
    }

    chatOptionsList() {
      if(this.state.mission.dialogue.chatOptions.length > 0) {
        return;
      }
      return "You have not added any chat options yet."
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
                <Card border="secondary">
                    <Card.Header><h3 className="my-1 text-secondary">Add new Quest</h3></Card.Header>
                    <Card.Body>
                        <Form onSubmit={this.onSubmit}>
                            {
                            /*
                             *
                             *  QUEST NAME
                             * 
                            */
                            }
                            <Form.Group as={Row} controlId="formHorizontalName" noGutters>
                                <Col sm={2}>
                                    <Form.Label column className="px-0">
                                        Name:
                                    </Form.Label>
                                </Col>
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
                            <Form.Group as={Row} controlId="formHorizontalLocation" noGutters>
                                <Col sm={2}>
                                    <Form.Label column className="px-0">
                                        Location:
                                    </Form.Label>
                                </Col>
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
                                <Col sm={2}>
                                <Form.Label column className="px-0">
                                    Missions:
                                </Form.Label>
                                </Col>
                                <Col sm={10}>
                                    <Card body border="success" className="mx-0">
                                    <h6 className="text-success">New Mission</h6>
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
                                                    <Button as={Link} to={{pathname: "/npcs/create", state: { prevPath: '/quests/create' }}} variant="success">
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
                                            
                                            {mission.checkDlg ?
                                            <>
                                            {/***** NPC DIALOGUE *****/}
                                            <br/>
                                            <Card body border="info">
                                            <h6 className="text-info">New NPC Dialogue Turn</h6>
                                            <div>
                                                A single NPC dialogue turn can have multiple messages, one after another, before the player gets to choose another chat option, including "emote" type messages, for example: <br/>
                                                <Row>
                                                  <Col sm="auto">
                                                    <div className="border px-3 py-2 my-3 border-secondary text-secondary">
                                                      <strong>Rex Larson:</strong> I'm not so sure.<br/>
                                                      Rex Larson scratches his head. <small>(emote)</small><br/>
                                                      <strong>Rex Larson:</strong> Have you tried turning it off and on again?<br/>
                                                      You start wondering if this guy can help you at all. <small>(emote)</small>
                                                    </div>
                                                  </Col>
                                                </Row>
                                            </div>
                                            <InputGroup as={Row} noGutters>
                                                <Col>
                                                    <Card body border="danger">
                                                      <h6 className="text-danger">New Message</h6>
                                                      <InputGroup>
                                                        <Col sm={12} className="px-0">
                                                          <Form.Group controlId="newNpcMessageEmote">
                                                            <Form.Check type="checkbox"
                                                              name="newNpcMessage.emote"
                                                              label="This is an emote message."
                                                              checked={this.state.newNpcMessage.emote}
                                                              onChange={this.handleInputChange}
                                                            />
                                                          </Form.Group>
                                                        </Col>
                                                        <Col sm={12} className="px-0">
                                                          <Form.Control as="textarea" placeholder="NPC message excluding 'Speaker Name:', if not an emote."
                                                              name="newNpcMessage.content"
                                                              value={this.state.newNpcMessage.content}
                                                              onChange={this.handleInputChange}
                                                              rows="3"
                                                          />
                                                        </Col>
                                                        <InputGroup.Append as={Col} sm={12} className="justify-content-sm-center pt-3 px-0">
                                                            <Button onClick={this.onAddNpcMsg} variant="outline-danger">
                                                                Add Message
                                                            </Button>
                                                        </InputGroup.Append>
                                                      </InputGroup>
                                                    </Card>
                                                </Col>
                                                <Col sm={12} className="px-0">
                                                  <h6 className="text-danger pt-3">Messages Added</h6>
                                                  {this.messageList()}
                                                </Col>
                                                <InputGroup.Append as={Col} sm={12} className="pt-3 justify-content-md-center">
                                                    <Button onClick={this.onAddNpcDlg} variant="outline-info">
                                                        Add NPC Turn
                                                    </Button>
                                                </InputGroup.Append>
                                            </InputGroup>
                                            </Card>
                                            <Col sm={12} className="pt-3 px-0">
                                              <h6 className="text-info">NPC Turns Added</h6>
                                              {this.npcTurnList()}
                                            </Col>

                                            {/***** CHAT OPTIONS *****/}
                                            <br/>
                                            <Card body border="warning">
                                              <h6 className="text-danger">New Dialogue Option</h6>
                                              <InputGroup>
                                                <Col sm={12} className="px-0">
                                                  <Form.Group controlId="newChatOption">
                                                    <Form.Check type="checkbox"
                                                      name="newNpcMessage.emote"
                                                      label="This is an emote message."
                                                      checked={this.state.newNpcMessage.emote}
                                                      onChange={this.handleInputChange}
                                                    />
                                                  </Form.Group>
                                                </Col>
                                                <Col sm={12} className="px-0">
                                                  <Form.Control as="textarea" placeholder="Dialogue option excluding 'Player Name:"
                                                      name="newChatOption.content"
                                                      value={this.state.newChatOption.content}
                                                      onChange={this.handleInputChange}
                                                      rows="3"
                                                  />
                                                </Col>
                                                <InputGroup.Append as={Col} sm={12} className="justify-content-sm-center pt-3 px-0">
                                                    <Button onClick={this.onAddOption} variant="outline-danger">
                                                        Add Option
                                                    </Button>
                                                </InputGroup.Append>
                                              </InputGroup>
                                            </Card>
                                            <Col sm={12} className="pt-3 px-0">
                                              <h6 className="text-warning">Chat Options Added</h6>
                                              {this.chatOptionsList()}
                                            </Col>
                                            </>
                                            :
                                            ''}
                                        </Form.Group>
                                        <InputGroup.Append as={Col} sm={12} className="justify-content-md-center">
                                            <Button onClick={this.onAddMission} variant="outline-success">
                                                Add Mission
                                            </Button>
                                        </InputGroup.Append>
                                    </InputGroup>
                                    </Card>
                                    <h6 className="text-success pt-3">Missions Added</h6>
                                    {
                                    /*
                                    *
                                    *  MISSION LIST
                                    * 
                                    */
                                    }
                                    { this.missionList() }
                                </Col>
                            </Form.Group>

                            <Form.Group as={Row}>
                                <Col sm={ { span: 10, offset: 2 } } className="pt-2">
                                    <Button type="submit" variant="outline-secondary" className="mr-2"><h5 className="my-2">ADD QUEST</h5></Button>
                                    <Button onClick={this.props.history.goBack} variant="outline-danger"><h5 className="my-2">CANCEL</h5></Button>
                                </Col>
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>
            </Col>
            <br/>
            </>
        );
    }
}