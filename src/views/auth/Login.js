import React, { Component } from 'react';
import axios from 'axios';
import { Form, Row, Col, Button } from 'react-bootstrap';

export default class Login extends Component {
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

    // console.log(`Input name ${name}. Input value ${value}.`);

    this.setState({
      [name]: value
    });
  };

  onSubmit = e => {
    e.preventDefault();

    this.props.history.push('/');

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    axios.post((process.env.REACT_APP_BACKEND||'http://localhost:4000/account/') + 'login', user)
      .then(res => {
        // save token in local storage
        localStorage.setItem('jwtToken', res.data.token);
        // save user details in local storage
        var userInfo = {
          email: res.data.user.email,
          role: res.data.user.role
        };
        localStorage.setItem('userInfo', JSON.stringify(userInfo));

        console.log(res.data);
        this.props.history.push('/');
        window.location.reload();
      })
      .catch((err) => {
        if(err.response.status === 401) {
          this.setState({ message: 'Login failed. Username or password not match' });
        }
      });
  };

  render() {

    return (
    <div>
      <h3>Login</h3>
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
            <Button type="submit">Login</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
    )
  }
}