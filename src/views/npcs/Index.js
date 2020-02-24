import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Npc = props => (
  <tr>
    <td>{props.npc.zone}</td>
    <td><Link to={`/npcs/${props.npc._id}`}>{props.npc.name}</Link></td>
  </tr>
)

export default class NpcIndex extends Component {

  constructor(props) {
    super(props);

    this.state = {
      npcs: []
    };
  }

  componentDidMount() {
    axios.get((process.env.REACT_APP_BACKEND||'http://localhost:4000/') + 'npcs/')
    .then(response => {
      console.log(response);
      this.setState({
        npcs: response.data
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  npcList() {
    return this.state.npcs.map(currentNpc => {
      return <Npc npc={currentNpc} key={currentNpc._id} />;
    })
  }

  render() {
    return (
      <div>
        <br/>
        <h3>Npc List</h3>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Zone</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            { this.npcList() }
          </tbody>
        </Table>
      </div>
    );
  }
}
