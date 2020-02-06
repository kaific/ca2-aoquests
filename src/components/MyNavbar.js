import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'

export default class MyNavbar extends Component {
  logout = () => {
    localStorage.removeItem('jwtToken');
    this.props.onLogout();
    // window.location = '/';
  };

  render() {
    const loggedIn = this.props.loggedIn;

    return (
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">AO Quests</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/npcs">NPCs</Nav.Link>
            <Nav.Link as={Link} to="/quests">Quests</Nav.Link>
            {loggedIn &&
              <>
              <Nav.Link as={Link} to="/npcs/create">Create NPC</Nav.Link>
              <Nav.Link as={Link} to="/quests/create">Create Quest</Nav.Link>
              </>
            }
          </Nav>
          <Nav>
            {loggedIn ? (
              <>
              <Nav.Link onClick={this.logout}>Logout</Nav.Link>
              </>
            ) : (
              <>
              <Nav.Link as={Link} to="/register">Register</Nav.Link>
              <Nav.Link as={Link} to="/login">Login</Nav.Link>
            </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
