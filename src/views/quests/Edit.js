import React, { Component } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';

import { Mission, NewMission } from '../../components/quests/Add'

export default class QuestEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      location: 'Rubi-Ka',
      locations: ['Rubi-Ka', 'Shadowlands', 'APF', 'Legacy of the Xan'],
      missions: [],
      mission: {
        _id: '',
        description: ``,
        zone: '',
        giver: {},
        order: 0,
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
      editing: {
        mission: false,
        npcDialogue: false,
        npcMessage: false,
        chatOption: false
      },
      zones: [],
      npcs: [],
      loading: true
    }
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    var name, location;
    var missions = [];

    await axios.get(`http://localhost:4000/quests/${id}`)
      .then(res => {
        console.log(res.data)
        if(res.data.missions.length > 0) {
          res.data.missions.map(m => {
            var checkDlg = false;
            if(m.dialogue !== null) {
              checkDlg = true;
            }
            var zone = m.giver.zone;
            var mission = {
              _id: m._id,
              description: m.description,
              zone: zone,
              giver: m.giver,
              order: m.order,
              objective: m.objective,
              reward: m.reward,
              checkDlg: checkDlg,
              dialogue: m.dialogue
            };
            missions.push(mission);
          });
          console.log(missions)
        }
        name = res.data.name;
        location = res.data.location;
        this.setState({
          name, location, missions
        });
      })
      .catch(error => {
        console.log(error);
      });
    
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
      // console.log(`Input name ${name}. Input value ${value}.`);

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
        // console.log(this.state.mission)
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

        if(objAttr === 'killOptions') {
          var options = target.options;
          var newOptions = [];
          for(var i = 0; i < options.length; i++) {
            if(options[i].selected) {
              newOptions.push(parseInt(options[i].value))
            }
          }
          obj[objAttr] = newOptions;
        }

        if(objAttr === 'trigger' || objAttr === 'reqOption') {
          obj[objAttr] = parseInt(value);
        }

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
          
          var zoneIndex;
          this.state.npcs.map((z, index) => {
            if(z.zone === zone[0].zone) {
              return zoneIndex = index;
            }
            return null;
          });
          
          this.setState(state => {
            const giver = state.npcs[zoneIndex].npcs[0];
            var mission = state.mission;
            mission.giver = giver;
            return {
              mission
            }
          })
          console.log(this.state.mission)
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
          giver: this.state.npcs[0].npcs[0],
          objective: '',
          order: missions.length,
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

  onAddNpcDlg = () => {
      if(this.state.newNpcDialogue.messages.length > 0) {
          this.setState(state => {
              var mission = this.state.mission;
              mission.dialogue.npcDialogue = [...state.mission.dialogue.npcDialogue, state.newNpcDialogue];

              return {
                  mission,
                  newNpcDialogue : {
                    messages: [],
                    trigger: 0
                  },
                  newNpcMessage: {
                    emote: false,
                    order: 0,
                    content: ''
                  }
              }
          });
      }
      return;
  };

  onAddChatOption = () => {
    var { newChatOption } = this.state;
    if(newChatOption.content.length > 0) {
      if(!newChatOption.killOptions.includes(newChatOption.id)) {
        newChatOption.killOptions.push(newChatOption.id);
      }
      this.setState(state => {
        var mission = this.state.mission;
        mission.dialogue.chatOptions = [...mission.dialogue.chatOptions, state.newChatOption];
        var newChatOption = {
          reqOption: 0,
          killOptions: [],
          reqProgress: false,
          id: (state.newChatOption.id + 1),
          content: ''
        };
        
        return {
          mission, newChatOption
        }
      });
    }
    return;
  };

  loadEdit = (type, index) => {
    var { editing, newNpcMessage, newNpcDialogue, newChatOption, missions } = this.state;
    editing[type] = true;

    switch(type) {
      case 'mission':
        var mission = missions[index];
        mission.index = index;
        editing.npcDialogue = false;
        editing.npcMessage = false;
        editing.chatOption = false;
        newNpcMessage = {
          emote: false,
          order: 0,
          content: ''
        };
        newNpcDialogue = {
          messages: [],
          trigger: 0
        };
        newChatOption = {
          reqOption: 0,
          killOptions: [],
          reqProgress: false,
          id: mission.dialogue !== null ? mission.dialogue.chatOptions.length+1 : 1,
          content: ''
        }
        this.setState({ mission, newNpcDialogue, newNpcMessage, newChatOption });
        break;

      case 'npcDialogue':
        newNpcDialogue = this.state.mission.dialogue.npcDialogue[index];
        newNpcDialogue.index = index;
        editing.npcMessage = false;
        newNpcMessage = {
          emote: false,
          order: newNpcDialogue.messages.length,
          content: ''
        }
        this.setState({ newNpcDialogue, editing, newNpcMessage });
        break;

      case 'npcMessage':
        newNpcMessage = this.state.newNpcDialogue.messages[index];
        this.setState({ newNpcMessage, editing });
        break;

      case 'chatOption':
        newChatOption = this.state.mission.dialogue.chatOptions[index];
        newChatOption.index = index;
        this.setState({ newChatOption, editing })
        break;

      default:
        break;
    }
  };

  saveEdit = (type, index) => {
    var { 
      mission, newNpcDialogue, newNpcMessage, newChatOption, editing, missions, npcs, zones
    } = this.state;
    editing[type] = false;

    switch(type) {
      case 'mission':
        missions[index] = mission;
        mission = {
          description: ``,
          zone: zones[0],
          giver: npcs[0].npcs[0],
          order: missions.length,
          objective: '',
          reward: 'None',
          checkDlg: false,
          dialogue: null
        };
        newNpcDialogue = {
          messages: [],
          trigger: 0
        };
        newNpcMessage = {
          emote: false,
          order: 0,
          content: ''
        };
        newChatOption = {
          reqOption: 0,
          killOptions: [],
          reqProgress: false,
          id: 1,
          content: ''
        };
        editing.npcDialogue = false;
        editing.npcMessage = false;
        editing.chatOption = false;
        this.setState({ 
          missions, mission, newNpcDialogue, newNpcMessage, newChatOption, editing 
        });
        break;

      case 'npcDialogue':
        mission.dialogue.npcDialogue[index] = newNpcDialogue;
        newNpcDialogue = {
          messages: [],
          trigger: 0
        };
        newNpcMessage = {
          emote: false,
          order: 0,
          content: ''
        };
        editing.npcMessage = false;
        this.setState({ mission, newNpcDialogue, editing });
        break;

      case 'npcMessage':
        newNpcDialogue.messages[index] = newNpcMessage;
        newNpcMessage = {
          emote: false,
          order: newNpcDialogue.messages.length,
          content: ''
        };
        this.setState({ newNpcDialogue, newNpcMessage, editing });
        break;

      case 'chatOption':
        mission.dialogue.chatOptions[index] = newChatOption;
        newChatOption = {
          reqOption: 0,
          killOptions: [],
          reqProgress: false,
          id: mission.dialogue.chatOptions.length+1,
          content: ''
        };
        this.setState({ mission, newChatOption, editing });
        break;

      default:
        break;
    }
  };

  onSubmit = async e => {
    e.preventDefault();

    const { id } = this.props.match.params;
    var mIds = [];

    const quest = {
      name: this.state.name,
      location: this.state.location,
    };

    if(!quest.name) {
      console.log("No quest name");
      return;
    }

    await axios.put(`http://localhost:4000/quests/${id}`, quest)
    .then(res => {
      console.log(res);
    })
    .catch(err => console.log(err));

    const missions = this.state.missions.map(m => {
      mIds.push(m._id);
      if(m.dialogue === null) {
        return {
          quest: id,
          description: m.description,
          giver: m.giver._id,
          objective: m.objective,
          order: m.order,
          reward: m.reward,
          dialogue: m.dialogue
        };
      }
      var newM = {
        quest: id,
        description: m.description,
        giver: m.giver._id,
        objective: m.objective,
        order: m.order,
        reward: m.reward,
        dialogue: {
          npcDialogue: m.dialogue.npcDialogue.map(d => {
            return {
              messages: d.messages,
              trigger: d.trigger
            };
          }),
          chatOptions: m.dialogue.chatOptions.map(opt => {
            return {
              reqOption: opt.reqOption,
              killOptions: opt.killOptions,
              reqProgress: opt.reqProgress,
              id: opt.id,
              content: opt.content
            };
          })
        }
      };
      return newM;
    });

    await mIds.map(async (mId, i)=> {
      await axios.put(`http://localhost:4000/missions/${mId}`, missions[i])
      .then(res => console.log(res))
      .catch(err => console.log(err))
    });

    window.location = '/quests/' + id;
  };

  missionList = () => {
    if(this.state.missions.length > 0) {
      return this.state.missions.map((mission, index) => {
        return <Mission mission={mission} loadEdit={this.loadEdit} index={index} key={index}/>
      });
    }
    return "You have not added any missions yet."
  };

  render() {
    const {
      loading, locations,
      mission, newNpcDialogue, newNpcMessage, newChatOption, editing
    } = this.state;

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

              {/* QUEST NAME */}
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

              {/* QUEST LOCATION */}
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

              {/* QUEST MISSIONS */}
              <Form.Group as={Row} controlId="formHorizontalMissions">
                <Col sm={2}>
                  <Form.Label column className="px-0">
                    Missions:
                  </Form.Label>
                </Col>
                <Col sm={10}>

                  {/* NEW MISSION */}
                  <NewMission
                    handleInputChange={this.handleInputChange}
                    loadEdit={this.loadEdit}
                    saveEdit={this.saveEdit}
                    onAddMission={this.onAddMission}
                    onAddNpcDlg={this.onAddNpcDlg}
                    onAddNpcMsg={this.onAddNpcMsg}
                    onAddChatOption={this.onAddChatOption}
                    zones={this.state.zones}
                    npcs={this.state.npcs}
                    mission={mission}
                    newNpcDialogue={newNpcDialogue}
                    newNpcMessage={newNpcMessage}
                    newChatOption={newChatOption}
                    editing={editing}
                  />

                  {/* MISSION LIST */}
                  <h5 className="text-success pt-3"><u>Missions Added</u></h5>
                  { this.missionList() }

                </Col>
              </Form.Group>

              <Form.Group as={Row}>
                <Col sm={ { span: 10, offset: 2 } } className="pt-2">
                  <Button type="submit" variant="outline-secondary" className="mr-2"><h5 className="my-2">SAVE QUEST</h5></Button>
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

QuestEdit.propTypes = {
  history: PropTypes.object.isRequired
};