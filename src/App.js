import React, { Component } from 'react';
import Container from 'react-bootstrap/Container';
import { Row, Col } from 'react-bootstrap';
import { BrowserRouter, Route, Switch, Redirect, /*BrowserHistory*/ } from 'react-router-dom';

import Register from './views/auth/Register';
import Login from './views/auth/Login';

import NpcIndex from './views/npcs/Index';
import NpcShow from './views/npcs/Show';
import NpcCreate from './views/npcs/Create';
import NpcEdit from './views/npcs/Edit';

import QuestCreate from './views/quests/Create';

import MyNavbar from './components/MyNavbar'

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: localStorage.getItem('jwtToken') !== null,
      userInfo: JSON.parse(localStorage.getItem('userInfo'))
    }
  };

  authHandler = () => {
    this.setState((state, props) => ({
      loggedIn: state.loggedIn ? false : true
    }));
  };

  render() {
    const loggedIn = this.state.loggedIn;
    const userInfo = this.state.userInfo;
    return (
      <BrowserRouter>
        <MyNavbar loggedIn={loggedIn} userInfo={userInfo} onLogout={this.authHandler} />
        <Container>
          <Row>
          <Col>
            <Switch>
              <Route path="/register" exact component={(props) => <Register {...props} onLogin={this.authHandler} />} />
              <Route path="/login" exact component={(props) => <Login {...props} onLogin={this.authHandler} />}/>
              <Route path="/npcs" exact component={NpcIndex} />
              <Route exact path="/npcs/create">{loggedIn ? <NpcCreate/> : <Redirect to="/" />}</Route>
              <Route path="/npcs/:id" exact component={NpcShow} />
              <Route exact path="/npcs/:id/edit">{loggedIn ? (props) => <NpcEdit {...props} /> : <Redirect to="/" />}</Route>
              <Route path="/quests/create">{loggedIn ? <QuestCreate/> : <Redirect to="/" />}</Route>
            </Switch>
          </Col>
          </Row>
        </Container>
      </BrowserRouter>
    );
  }
}