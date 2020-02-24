import React, { Component } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button, Card } from 'react-bootstrap';
// import { Link } from 'react-router-dom';

export default class NpcEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      npc: {},
      name: '',
      zone: '',
      coords: {
        x: 0,
        z: 0,
        pf: 0
      },
      loading: true
    }
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    axios.get((process.env.REACT_APP_BACKEND||'http://localhost:4000/') + `npcs/${id}`)
    .then(response => {
      // console.log("response:", response);
      this.setState({
        npc: response.data,
        name: response.data.name,
        id: response.data.id,
        zone: response.data.zone,
        coords: response.data.coords,
        loading: false,
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
    // console.log(`Input name ${name}. Input value ${value}.`);

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
    // console.log(this.state);
  };

  onSubmit = e => {
    e.preventDefault();

    const { id } = this.props.match.params;
    const npc = {
      name: this.state.name,
      zone: this.state.zone,
      coords: this.state.coords
    };
    // console.log(npc);

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.put((process.env.REACT_APP_BACKEND||'http://localhost:4000/') + `npcs/${id}`, npc)
    .then(res => {
      console.log(res.data);
      this.props.history.goBack();
    })
    .catch(err => {
      console.log(err)
      this.props.history.push("/login");
    });
  };

  onDelete() {
    const { id } = this.props.match.params;

    axios.defaults.headers.common['Authorization'] = localStorage.getItem('jwtToken');
    axios.delete((process.env.REACT_APP_BACKEND||'http://localhost:4000/') + 'npcs/' + id)
    .then(res => console.log(res))
    .catch(err => console.log(err));

    window.location = '/npcs';
  }

  render() {
    const { loading } = this.state;

    if(loading) {
      return (
        <div>
          <h3>Loading...</h3>
        </div>
      )
    }

    return (
      <>
      <Card>
        <Card.Header as="h3">Add new NPC</Card.Header>
        <Card.Body>
          <Form onSubmit={this.onSubmit}>
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

            <Form.Group as={Row} controlId="formHorizontalZone">
              <Form.Label column sm={2}>
                Zone:
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
                Coords:
              </Form.Label>
              <Form.Label column sm="auto" className="pr-0">
                x:
              </Form.Label>
              <Col>
                <Form.Control type="number" placeholder="X" 
                  name="coords.x"
                  value={this.state.coords.x}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Form.Label column sm="auto" className="pr-0">
                z:
              </Form.Label>
              <Col>
                <Form.Control type="number" placeholder="Z" 
                  name="coords.z"
                  value={this.state.coords.z}
                  onChange={this.handleInputChange}
                />
              </Col>
              <Form.Label column sm="auto" className="pr-0">
                pf:
              </Form.Label>
              <Col>
                <Form.Control type="number" placeholder="PF" 
                  name="coords.pf"
                  value={this.state.coords.pf}
                  onChange={this.handleInputChange}
                />
              </Col>
            </Form.Group>

            <Form.Group as={Row}>
              <Col sm={ { span: 10, offset: 2 } }>
                <Button type="submit" variant="success">Save</Button>&nbsp;
                <Button onClick={this.props.history.goBack} variant="primary">Cancel</Button>&nbsp;
                <Button onClick={this.onDelete} variant="danger">Delete</Button>
              </Col>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
      </>
    );
  }
}