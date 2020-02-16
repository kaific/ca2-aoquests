import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export default class MyNavbar extends Component {
  logout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userInfo');
    this.props.onLogout();
    window.location = '/';
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
          </Nav>
          <Nav>
            {loggedIn ? (
              <>
              <NavDropdown title={this.props.userInfo.email ? this.props.userInfo.email : ""} id="basic-nav-dropdown">
                <NavDropdown.Item as={Link} to="/npcs/create">Create NPC</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/quests/create">Create Quest</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={this.logout}>Log Out</NavDropdown.Item>
              </NavDropdown>
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
