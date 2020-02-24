import React, { Component } from 'react';
import axios from 'axios';
import { Row, Col, Table } from 'react-bootstrap'
import { Link } from 'react-router-dom';

const Quest = props => (
  <tr>
    <td>{props.quest.location}</td>
    <td><Link to={`/quests/${props.quest._id}`}>{props.quest.name}</Link></td>
  </tr>
)

export default class QuestIndex extends Component {

  constructor(props) {
    super(props);

    this.state = {
      quests: []
    };
  }

  componentDidMount() {
    axios.get((process.env.REACT_APP_BACKEND||'http://localhost:4000/') + 'quests/')
    .then(response => {
      console.log(response);
      this.setState({
        quests: response.data
      })
    })
    .catch((error) => {
      console.log(error);
    })
  }

  questList() {
    return this.state.quests.map(quest => {
      return <Quest quest={quest} key={quest._id} />;
    })
  }

  render() {
    return (
      <div>
        <br/>
        <h3>Quest List</h3>
        <Table striped bordered hover variant="dark">
          <thead>
            <tr>
              <th>Location</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>
            { this.questList() }
          </tbody>
        </Table>
      </div>
    );
  }
}
