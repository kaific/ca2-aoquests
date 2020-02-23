import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, Button, InputGroup, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class NewMission extends Component {
  zoneList = () => {
    return this.props.zones.map((zone, index) => {
      return <Zone zone={zone} key={index}/>
    });
  };

  npcList = () => {
    return this.props.npcs.map((zone) => {
      if(this.props.mission.zone === zone.zone) {
        return zone.npcs.map((npc, index) => {
          return <NPC npc={npc} key={index}/>
        });
      }
      return null;
    });
  };

  messageList = () => {
    if(this.props.newNpcDialogue.messages.length > 0) {
      return this.props.newNpcDialogue.messages.map((msg, index) => {
        return <NPCMessage message={msg} 
          npc={this.props.mission.giver}
          loadEdit={this.props.loadEdit}
          key={index} />
      });
    }
    return "You have not added any messages yet."
  };

  npcTurnList = () => {
    const { mission } = this.props;
    const npcDialogue = mission.dialogue.npcDialogue;
    const npc = mission.giver;

    if(npcDialogue.length > 0) {
      return npcDialogue.map((dlg, index) => {
        return <NPCDialogue dialogue={dlg}
          npc={npc} index={index} loadEdit={this.props.loadEdit} key={index} />
      });
    }
    return <Col>You have not added an NPC turn yet.</Col>
  }

  chatOptionsList = () => {
    const { mission } = this.props;
    const chatOptions = mission.dialogue.chatOptions;

    if(chatOptions.length > 0) {
      return chatOptions.map((opt, index) => {
        return <ChatOption chatOption={opt}
          loadEdit={this.props.loadEdit} index={index} key={index} />
      });
    }
    return "You have not added any chat options yet.";
  }

  formChatOptionsList = () => {
    const { mission } = this.props;
    const chatOptions = mission.dialogue.chatOptions;

    if(chatOptions.length > 0) {
      return chatOptions.map((opt, i) => {
        return <FormChatOption option={opt} key={i} />
      });
    }
    return '';
  };

  render() {
    const {
      handleInputChange, saveEdit, onAddMission, onAddNpcDlg, onAddNpcMsg, onAddChatOption,
      mission, newNpcDialogue, newNpcMessage, newChatOption, editing
    } = this.props;

    return (
      <Card body border="success" className="mx-0">
        <h6 className="text-success">New Mission</h6>
        <InputGroup as={Row} noGutters>

          {/* MISSION NPC */}
          <Form.Group as={Col} sm={12} controlId="formHorizontalMissionNPC">
            <Row>
              <Form.Label column sm="auto" className="pr-0">NPC:</Form.Label>
              <Col className="pr-1">
                <Form.Control as="select"
                  name="mission.zone"
                  onChange={handleInputChange}
                  value={mission.zone}
                >
                  { this.zoneList() }
                </Form.Control>
              </Col>
              <Col className="pl-1">
                <Form.Control as="select"
                  name="mission.giver"
                  onChange={handleInputChange}
                  value={mission.giver._id}
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
          
          {/* MISSION DESCRIPTION */}
          <Form.Group as={Col} sm={12} controlId="formHorizontalMissionDescription">
            <Form.Control as="textarea" placeholder="Mission description"
              name="mission.description"
              value={mission.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          
          {/* MISSION OBJECTIVE */}
          <Form.Group as={Col} sm={12} controlId="formHorizontalMissionObjective">
            <Row>
              <Form.Label column sm={2} className="pr-0">Objective:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" placeholder="Mission objective"
                  name="mission.objective"
                  value={mission.objective}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </Form.Group>
          
          {/* MISSION REWARD */}
          <Form.Group as={Col} sm={12} controlId="formHorizontalMissionReward">
            <Row>
              <Form.Label column sm={2} className="pr-0">Reward:</Form.Label>
              <Col sm={10}>
                <Form.Control type="text" placeholder="Mission reward"
                  name="mission.reward"
                  value={mission.reward}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>
          </Form.Group>
          
          {/* MISSION DIALOGUE */}
          <Form.Group as={Col} sm={12} controlId="formHorizontalMissionDialogue">
            {/***** CHECK *****/}
            <Form.Check
              type='checkbox'
              name='mission.checkDlg'
              onChange={handleInputChange}
              label="This mission has NPC dialogue."
              checked={mission.checkDlg}
            />
            
            {mission.checkDlg ?
            <>
            {/***** NPC DIALOGUE *****/}
            <br/>
            <NewNpcDialogue
              handleInputChange={handleInputChange}
              onAddNpcDlg={onAddNpcDlg}
              onAddNpcMsg={onAddNpcMsg}
              saveEdit={saveEdit}
              messageList={this.messageList}
              formChatOptionsList={this.formChatOptionsList}
              newNpcDialogue={newNpcDialogue}
              newNpcMessage={newNpcMessage}
              editing={editing}
              mission={mission}
            />
            <Col sm={12} className="pt-3 px-0">
              <h5 className="text-info"><u>NPC Turns Added</u></h5>
              <Row>{this.npcTurnList()}</Row>
            </Col>

            {/***** CHAT OPTIONS *****/}
            <br/>
            <NewChatOption handleInputChange={handleInputChange}
              onAddChatOption={onAddChatOption}
              saveEdit={saveEdit}
              formChatOptionsList={this.formChatOptionsList}
              mission={mission}
              newChatOption={newChatOption}
              editing={editing}
            />
            <Col sm={12} className="pt-3 px-0">
              <h5 className="text-option"><u>Player Chat Options Added</u></h5>
              {this.chatOptionsList()}
            </Col>
            </>
            :
            ''}
          </Form.Group>
          
          {/* SAVE/ADD MISSION BUTTON */}
          <InputGroup.Append as={Col} sm={12} className="justify-content-md-center">
            {editing.mission ?
            <Button onClick={() => saveEdit('mission', parseInt(mission.index))} variant="outline-success">
              Save Mission
            </Button>
            :
            <Button onClick={onAddMission} variant="outline-success">
              Add Mission
            </Button>}
          </InputGroup.Append>
          
        </InputGroup>
      </Card>                  
    );
  }
}

NewMission.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  loadEdit: PropTypes.func.isRequired,
  saveEdit: PropTypes.func.isRequired,
  onAddMission: PropTypes.func.isRequired,
  onAddNpcDlg: PropTypes.func.isRequired,
  onAddNpcMsg: PropTypes.func.isRequired,
  onAddChatOption: PropTypes.func.isRequired,
  zones: PropTypes.arrayOf(PropTypes.string).isRequired,
  npcs: PropTypes.arrayOf(PropTypes.object).isRequired,
  mission: PropTypes.object.isRequired,
  newNpcDialogue: PropTypes.object.isRequired,
  newNpcMessage: PropTypes.object.isRequired,
  newChatOption: PropTypes.object.isRequired,
  editing: PropTypes.object.isRequired
};

class NewNpcDialogue extends Component {
  render() {
    const { 
      handleInputChange, onAddNpcDlg, onAddNpcMsg, saveEdit, messageList, formChatOptionsList,
      newNpcDialogue, newNpcMessage, editing
    } = this.props;
    return (
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
                      checked={newNpcMessage.emote}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
                <Col sm={12} className="px-0">
                  <Form.Control as="textarea" placeholder="NPC message excluding 'Speaker Name:', if not an emote."
                    name="newNpcMessage.content"
                    value={newNpcMessage.content}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </Col>
                <InputGroup.Append as={Col} sm={12} className="justify-content-sm-center pt-3 px-0">
                  {editing.npcMessage ?
                  <Button onClick={() => saveEdit('npcMessage', parseInt(newNpcMessage.order))} variant="outline-danger">
                    Save Message
                  </Button>
                  :
                  <Button onClick={onAddNpcMsg} variant="outline-danger">
                    Add Message
                  </Button>}
                </InputGroup.Append>
              </InputGroup>
            </Card>
          </Col>
          <Col sm={12} className="px-0">
            <h5 className="text-danger pt-3"><u>Messages Added</u></h5>
            {messageList()}
          </Col>
          <Col sm={12} className="px-0 pt-3">
            <Form.Group as={Row} controlId="newNpcTurnTrigger">
              <Col sm={3}>
                <Form.Label column sm="auto" className="px-0">Triggered by option:</Form.Label>
              </Col>
              <Col sm={9}>
                <Form.Control as="select"
                  name="newNpcDialogue.trigger"
                  onChange={handleInputChange}
                  value={newNpcDialogue.trigger}
                >
                  <option value="0">0 This is the starting turn.</option>
                  { formChatOptionsList() }
                </Form.Control>
              </Col>
            </Form.Group>
          </Col>
          <InputGroup.Append as={Col} sm={12} className="pt-3 justify-content-md-center">
            {editing.npcDialogue ?
            <Button onClick={() => saveEdit('npcDialogue', parseInt(newNpcDialogue.index))} variant="outline-info">
              Save NPC Turn
            </Button>
            :
            <Button onClick={onAddNpcDlg} variant="outline-info">
              Add NPC Turn
            </Button>}
          </InputGroup.Append>
        </InputGroup>
      </Card>
    );
  }
}

NewNpcDialogue.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  onAddNpcDlg: PropTypes.func.isRequired,
  onAddNpcMsg: PropTypes.func.isRequired,
  saveEdit: PropTypes.func.isRequired,
  messageList: PropTypes.func.isRequired,
  formChatOptionsList: PropTypes.func.isRequired,
  newNpcDialogue: PropTypes.object.isRequired,
  newNpcMessage: PropTypes.object.isRequired,
  editing: PropTypes.object.isRequired,
  mission: PropTypes.object.isRequired
};

class NewChatOption extends Component {
  render() {
    const {
      handleInputChange, onAddChatOption, saveEdit, formChatOptionsList,
      newChatOption, editing
    } = this.props;
    return (
      <Card body border="option">
        <Form.Group controlId="newChatOption" className="m-0">
          <h6 className="text-option">New Player Dialogue Option</h6>
          <Row noGutters>
            <Col sm="auto" as={Card} border="secondary" className="px-3 py-1 my-2 text-secondary">
              <div><strong>Note:</strong>&nbsp;The "Goodbye" dialogue ending option is added at the end automatically.</div>
            </Col>
          </Row>
          <InputGroup as={Row} noGutters>
            <Col sm={12} className="px-0 pb-3">
                <Form.Check type="checkbox"
                  name="newChatOption.reqProgress"
                  label="This option progresses the mission."
                  checked={newChatOption.reqProgress}
                  onChange={handleInputChange}
                />
              
            </Col>
            <Col sm={12} className="px-0">
              <Form.Group controlId="newChatOptionContent" className="m-0">
                <Form.Control as="textarea" placeholder="Dialogue option excluding 'Player Name:'"
                    name="newChatOption.content"
                    value={newChatOption.content}
                    onChange={handleInputChange}
                    rows="3"
                />
              </Form.Group>
            </Col>
            <Col sm={12} className="px-0">
              <Form.Group as={Row} className="pt-3" controlId="newChatOptionReq">
                <Col sm={3}>
                  <Form.Label column sm="auto" className="px-0">Required option:</Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Control as="select"
                    name="newChatOption.reqOption"
                    onChange={handleInputChange}
                    value={newChatOption.reqOption}
                  >
                    <option value="0">0 Available on start.</option>
                    { formChatOptionsList() }
                  </Form.Control>
                </Col>
              </Form.Group>
              <Form.Group as={Row} className="pt-3" controlId="newChatOptionKill">
                <Col sm={3}>
                  <Form.Label column sm="auto" className="px-0">Options which remove it:</Form.Label>
                </Col>
                <Col sm={9}>
                  <Form.Control as="select"
                    multiple={true}
                    name="newChatOption.killOptions"
                    onChange={handleInputChange}
                    value={newChatOption.killOptions}
                  >
                    { formChatOptionsList() }
                  </Form.Control>
                </Col>
              </Form.Group>
            </Col>
            <InputGroup.Append as={Col} sm={12} className="justify-content-sm-center pt-3 px-0">
              {editing.chatOption ?
              <Button onClick={() => saveEdit('chatOption', parseInt(newChatOption.index))} variant="outline-option">
                Save Option
              </Button>
              :
              <Button onClick={onAddChatOption} variant="outline-option">
                Add Option
              </Button>}
            </InputGroup.Append>
          </InputGroup>
        </Form.Group>
      </Card>
    );
  }
}

NewChatOption.propTypes = {
  handleInputChange: PropTypes.func.isRequired,
  onAddChatOption: PropTypes.func.isRequired,
  saveEdit: PropTypes.func.isRequired,
  formChatOptionsList: PropTypes.func.isRequired,
  mission: PropTypes.object.isRequired,
  newChatOption: PropTypes.object.isRequired,
  editing: PropTypes.object.isRequired
};

class Zone extends Component {
  render() {
    return (
      <option value={this.props.zone}>{this.props.zone}</option>
    );
      
  }
}

Zone.propTypes = {
  zone: PropTypes.string.isRequired
};

class NPC extends Component {
  render() {
      return (
          <option value={this.props.npc._id}>{this.props.npc.name}</option>
      );
  }
}

NPC.propTypes = {
  npc: PropTypes.object.isRequired
};

class Mission extends Component {
  render() {
    const { mission, loadEdit, index } = this.props;
    return (
      <>
      <Row as={Col} className="text-success px-0 mb-2">
        <Col sm="auto" className="pr-0">
          <Button size="xs"
            variant="success"
            onClick={() => loadEdit('mission', parseInt(index))}
          >
            Edit
          </Button>
        </Col>
        <Col sm="auto">
          {mission.description.split('\n').slice(0,1).map((line, index) => {
            return (
              <React.Fragment key={index}>{line.slice(0,50)}...<br/></React.Fragment>
            );
          })} from {mission.giver.name}
        </Col>
      </Row><br/>
      </>
    );
  }
}

Mission.propTypes = {
  mission: PropTypes.object.isRequired,
  loadEdit: PropTypes.func.isRequired,
  index: PropTypes.number
};

class NPCDialogue extends Component {
  render() {
    const { dialogue, npc, index, loadEdit } = this.props;
    var messages = dialogue.messages.slice(0,3);
    // console.log(messages);
    return (
      <Col sm={4} className="pt-2">
        <Card body border="info" className="text-info">
          <Row className="position-absolute fixed-top">
            <Col sm={{span: 3, offset: 9}}>
              <Button variant="info"
                size="xs"
                className="position-relative float-right"
                onClick={() => loadEdit('npcDialogue', parseInt(index))}
              >
                Edit
              </Button>
            </Col>
          </Row>
          {messages.map((msg, i) => {
            return (
              <React.Fragment key={i}>
                {!msg.emote ? <><strong>{npc.name}:</strong>&nbsp;</> : ''}
                {msg.content.slice(0,50).trim()}...<br/>
              </React.Fragment>
            )
          })}
        </Card>
      </Col>
    );
  }
}

NPCDialogue.propTypes = {
  dialogue: PropTypes.object.isRequired,
  npc: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  loadEdit: PropTypes.func.isRequired
};

class NPCMessage extends Component {
  render() {
    const { message, npc, loadEdit } = this.props;
    return (
      <Row as={Col} className="text-danger px-0 mb-2">
        <Col sm="auto" className="pr-0">
          <Button size="xs"
            variant="danger"
            onClick={() => loadEdit('npcMessage', parseInt(message.order))}
          >
            Edit
          </Button>
        </Col>
        <Col sm="auto">
          <small>{message.order+1}.&nbsp;</small>
          {
            message.emote ?
              <><small className="text-secondary">(emote)</small>&nbsp;{message.content}</>
            :
              <><strong>{npc.name}:&nbsp;</strong>{message.content}</>
          }
        </Col>
      </Row>
    );
  }
}

NPCMessage.propTypes = {
  message: PropTypes.object.isRequired, 
  npc: PropTypes.object.isRequired,
  loadEdit: PropTypes.func.isRequired
};

class FormChatOption extends Component {
  render() {
    const { option } = this.props;
    return (<option value={option.id}>{option.id}&nbsp;{option.content}</option>);
  }
}

FormChatOption.propTypes = {
  option: PropTypes.object.isRequired
};

class ChatOption extends Component {
  render() {
    const { chatOption, loadEdit, index } = this.props;
    return (
      <Row as={Col} className="text-option">
        <Col sm="auto" className="pr-0">
          <Button size="xs"
            variant="option"
            onClick={() => loadEdit('chatOption', parseInt(index))}
          >
            Edit
          </Button>
        </Col>
        <Col sm="auto">
          {chatOption.id}.&nbsp;
          <><strong>Player:&nbsp;</strong>{chatOption.content}</>
          {chatOption.reqProgress ? <small className="text-secondary">&nbsp;(Mission progress)</small> : "" }
        </Col>
      </Row>
    );
  }
}

ChatOption.propTypes = {
  chatOption: PropTypes.object.isRequired,
  loadEdit: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired
};

export { NewMission, Mission };