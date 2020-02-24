import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';

class MissionInfo extends Component {
  render() {
    const { chosenMission, chosenOptions } = this.props;

    // Create array of chosen option objects if mission has dialogue
    var cOpts = [];
    if(chosenMission.dialogue !== null && chosenMission.dialogue !== undefined){
        chosenMission.dialogue.chatOptions.map(opt => {
            return chosenOptions.map(chosenOpt => {
                if(chosenOpt === opt.id) {
                    return cOpts.push(opt)
                }
                return null;
            });
        });
    }

    if(chosenMission.description === undefined || chosenMission.description === null) {
        return(<Card><Card.Body>This quest has no missions.</Card.Body></Card>)
    }

    return (
        <>
        <Card bg="sunset">
          <Card.Header>{chosenMission.description.split('\n')[0]}</Card.Header>
          <Card.Body>
            {chosenMission.giver ?
            <Row>
              <Col sm={3}>Giver:</Col>
              <Col sm={9}><Link to={`/npcs/${chosenMission.giver._id}`}>{chosenMission.giver.name}</Link></Col>
            </Row>
            : ''
            }
            <Row>
              <Col sm={3}>Description:</Col>
              <Col sm={9}>
                {chosenMission.description.split('\n').map((line, index) => {
                  return (<React.Fragment key={index}>{line}<br/></React.Fragment>);
                })}
              </Col>
            </Row>
            <Row>
              <Col sm={3}>Objective:</Col>
              <Col sm={9}>{chosenMission.objective}</Col>
            </Row>
            <Row>
              <Col sm={3}>Reward:</Col>
              <Col sm={9}>{chosenMission.reward}</Col>
            </Row>
          </Card.Body>
        </Card>
        <br/>
        {chosenMission.dialogue !== null ?
        <>
        <Card bg="sunset">
          <Card.Header>{chosenMission.giver.name}</Card.Header>
          <Card.Body>
          {chosenMission.dialogue.npcDialogue.map((dlg) => {
              if(chosenOptions.includes(dlg.trigger)) return dlg.messages.map((message, index) => {
                return (
                  <React.Fragment key={index}>
                    {/*
                      Display option which triggered following npc dialogue
                      Only above the first message in dialogue
                    */}
                    {(dlg.trigger !== 0 && message.order === 0) ?
                    cOpts.map((opt, index) => {
                      if(opt.id === dlg.trigger) {
                        return (
                          <React.Fragment key={index}>
                            <strong className="text-c2">You: </strong>
                            <span>{opt.content}</span>
                            <br/>
                          </React.Fragment>
                        );
                      }
                      return null;
                    })
                    : ''}
                    {!message.emote ? <strong className="text-c1">{chosenMission.giver.name}: </strong> : ''}
                    <span className={message.emote ? "font-italic" : ''}>{message.content}</span><br/>
                  </React.Fragment>
                );
              });
              return null;
            })}
            {chosenOptions.includes(chosenMission.dialogue.chatOptions.length) ?
              <>
                <strong className="text-c2">You: </strong>
                <span>Goodbye.</span>
              </>
            : ''}
            <br/>
            <Form name="options" onChange={this.props.chooseOption}>
              {chosenMission.dialogue.chatOptions.map((opt, index) => {
                if(
                  !chosenOptions.includes(opt.id) &&
                  chosenOptions.includes(opt.reqOption) &&
                  !opt.killOptions.some(e => chosenOptions.includes(e))
                ) {
                  return (
                    <Form.Check type='radio'
                      id={opt.id}
                      key={index}>
                      <Form.Check.Input type="radio"/>
                      <Form.Check.Label style={opt.reqProgress ? {color: '#c9af47', fontWeight: 'bold'} : {}}>
                        {opt.content}
                      </Form.Check.Label>
                    </Form.Check>
                  );
                }
                return null;
              })}
            </Form>
            <br/>
            <Button onClick={this.props.resetOptions} variant="primary">Reset Chat</Button>
          </Card.Body>
        </Card>
        <br/>
        </>
        : ''
        }
        </>
    );
  }
}

export { MissionInfo };