import React, { Component } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';

import { MissionInfo } from '../../components/quests/Read';

export default class QuestShow extends Component {
  constructor(props) {
      super(props);

      this.state = {
          quest: {},
          loading: true,
          loggedIn: props.loggedIn,
          missionChoice: '',
          chosenMission: {},
          chosenOptions: [0]
      };
  }

  componentDidMount() {
    const { id } = this.props.match.params;

    console.log(this.props);
    axios.get((process.env.REACT_APP_BACKEND||'http://localhost:4000/') + `quests/${id}`)
    .then(response => {
      // console.log("mission 1:", response.data.missions[0]);
      if(response.data.missions.length !== 0) {
        this.setState({
          quest: response.data,
          loading: false,
          missionChoice: response.data.missions[0]["_id"],
          chosenMission: response.data.missions[0]
        });
      }
      else {
        this.setState({
          quest: response.data,
          loading: false
        });
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  changeMission = e => {
    const target = e.target;
    const value = target.value;

    var chosenMission = this.state.quest.missions.map(m => {
      if(m._id === value) return m;
      return null;
    });
    chosenMission.map(m => {
      if(m !== null) chosenMission = m;
      return null;
    })

    // Reset options when mission is changed
    this.resetOptions();

    this.setState({
      missionChoice: value,
      chosenMission: chosenMission,
    });
    return;
  }

  chooseOption = e => {
    const target = e.target;
    const value = target.type === 'radio' ? target.id : target.value;
    
    this.setState(state => {
      const chosenOptions = [...state.chosenOptions, parseInt(value)];
      return {
        chosenOptions
      };
    });
  };

  resetOptions = () => {
    this.setState({
      chosenOptions: [0]
    });
  };

  render() {
    const { quest, loading, loggedIn, chosenMission, chosenOptions } = this.state;
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
      <Card bg="sunset">
        <Card.Header as="h5">
            {quest.name}
        </Card.Header>
        <Card.Body>
          <Row>
            <Col sm={3}>
              Location:
            </Col>
            <Col sm={9}>
              {quest.location}
            </Col>
          </Row>
          <Row>
            <Col sm={3}>
              Start NPC:
            </Col>
            <Col sm={9}>
              {quest.missions.map((m, index) => {
                if(m.order === 0) return <Link to={`/npcs/${m.giver._id}`} key={index}>{m.giver.name}</Link>;
                return null;
              })}
            </Col>
          </Row>
          <br/>
          <div id="buttons" >
            <Button as={Link} to="/quests" variant="primary">View all quests</Button>&nbsp;
            {loggedIn ?
              <>
              <Button as={Link} to={`/quests/${id}/edit`} variant="warning">Edit</Button>&nbsp;
              <Button as={Link} to={`/quests/${id}/edit`} variant="danger">Delete</Button>
              </>
            :
              <>
              </>
            }
          </div>
        </Card.Body>
      </Card>
      <br/>
      <Card bg="sunset">
        <Card.Body>
          <Row>
            <Form.Label column sm={3}>Choose Mission:</Form.Label>
            <Col sm={9}>
              <Form.Control as="select"
                name="missionChoice"
                onChange={this.changeMission}
              >
                {quest.missions.map((m, index) => {
                  return (
                    <option key={index} value={m._id}>{m.order+1}: {m.description.split('\n')[0]}</option>
                  );
                })}
              </Form.Control>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      <br/>
      <MissionInfo
        chosenMission={chosenMission}
        chosenOptions={chosenOptions}
        chooseOption={this.chooseOption}
        resetOptions={this.resetOptions}
      />
      </>
    );
  }
}
