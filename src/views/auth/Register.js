import React, { Component } from 'react';
import axios from 'axios';
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };

  }

  handleInputChange = e => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    console.log(`Input name ${name}. Input value ${value}.`);

    this.setState({
      [name]: value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    console.log(user);

    axios.post((process.env.REACT_APP_BACKEND||'http://localhost:4000/account/') + 'register', user)
      .then(res => console.log(res.data))
      .catch(err => console.log(err));

    window.location = '/login';
  };

  render() {

    return (
    <div>
      <h3>Register user</h3>
      <Form onSubmit={this.onSubmit}>
        <Form.Group as={Row} controlId="formHorizontalIMDB">
          <Form.Label column sm={2}>
            Email
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="email" placeholder="Email"
              name="email"
              value={this.state.email}
              onChange={this.handleInputChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="formHorizontalTitle">
          <Form.Label column sm={2}>
            Password
          </Form.Label>
          <Col sm={10}>
            <Form.Control type="password" placeholder="Password"
              name="password"
              value={this.state.password}
              onChange={this.handleInputChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 10, offset: 2 }}>
            <Button type="submit">Register</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
    )
  }
}