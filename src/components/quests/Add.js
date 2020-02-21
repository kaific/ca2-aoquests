import React, { Component } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';

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
                <strong>{npc.name}:</strong>&nbsp;{msg.content.slice(0,50).trim()}...<br/>
              </React.Fragment>
            )
          })}
        </Card>
      </Col>
    );
  }
}

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

class OptionTrigger extends Component {
  render() {
    const { option } = this.props;
    return (<option value={option.id}>{option.id}&nbsp;{option.content}</option>);
  }
}

class ChatOption extends Component {
  render() {
    const {chatOption} = this.props;
    return (
      <Row as={Col} className="text-option">
        {chatOption.id}.&nbsp;
        <><strong>Player:&nbsp;</strong>{chatOption.content}</>
        {chatOption.reqProgress ? <small className="text-secondary">&nbsp;(Mission progress)</small> : "" }
      </Row>
    );
  }
}

export { Zone, NPC, Mission, NPCDialogue, NPCMessage, OptionTrigger, ChatOption };