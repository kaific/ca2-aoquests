import React, { Component } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default class NpcCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      zone: '',
      coords: {
        x: 0,
        z: 0,
        pf: 0
      }
    }
  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log(`Input name ${name}. Input value ${value}.`);

    if(name.includes('.')) {
      let splitName = name.split(".");
      let objName = splitName[0];
      let objAttr = splitName[1];
      let obj = this.state[objName];
      obj[objAttr] = parseInt(value);

      this.setState({
        obj
      });
    }
    else {
      this.setState({
        [name]: value
      });
    }
  };

  onSubmit = e => {
    e.preventDefault();

    const npc = {
      name: this.state.name,
      zone: this.state.zone,
      coords: this.state.coords
    };
    // console.log(npc);

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken')
    axios.post((process.env.REACT_APP_BACKEND||'http://localhost:4000/') + 'npcs', npc)
    .then(res => console.log(res.data))
    .catch(err => {
      console.log(err);
      this.props.history.push("/login");
    });

    // window.location = '/npcs';
    this.props.history.goBack();
    window.location.reload();
  };

  render() {
    // console.log(this.props.history)
    return (
      <>
      <h3>Add new Npc</h3>
      <Form onSubmit={this.onSubmit}>
        <Form.Group as={Row} controlId="formHorizontalName">
          <Form.Label column sm={2}>
            Name of NPC
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="Name"
              name="name"
              value={this.state.name}
              onChange={this.handleInputChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalZone">
          <Form.Label column sm={2}>
            Zone
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="text" placeholder="Zone Name" 
              name="zone"
              value={this.state.zone}
              onChange={this.handleInputChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalCoords">
          <Form.Label column sm={2}>
            Coordinates
          </Form.Label>
          <Col>
            <Form.Control type="number" placeholder="X" 
              name="coords.x"
              value={this.state.coords.x}
              onChange={this.handleInputChange}
            />
          </Col>
          <Col>
            <Form.Control type="number" placeholder="Z" 
              name="coords.z"
              value={this.state.coords.z}
              onChange={this.handleInputChange}
            />
          </Col>
          <Col>
            <Form.Control type="number" placeholder="PF" 
              name="coords.pf"
              value={this.state.coords.pf}
              onChange={this.handleInputChange}
            />
          </Col>
        </Form.Group>

        <br/>
        <Form.Group as={Row}>
          <Col sm={ { span: 10, offset: 2 } }>
            <Button type="submit">Add NPC</Button>&nbsp;
            <Button onClick={this.props.history.goBack}>Cancel</Button>
          </Col>
        </Form.Group>
      </Form>
      </>
    );
  }
}