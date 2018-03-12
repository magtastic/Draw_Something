import React, { Component } from 'react';
import app from './../../databases/firestore';
import CreateGamePopUp from './CreateGamePopUp';
// import styled from 'styled-components';

const firestore = app.firestore();

class CurrentUserHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: props.userID,
      gameToJoin: 'Insert Game ID',
    };
    this.gameCreated = props.gameCreated;
  }

  createGame() {
    const { userID } = this.state;
    firestore
      .collection('games')
      .add({ creator: userID, game_started: false })
      .then(ref => [ref.collection('players').doc(userID).set({ in_room: true }), ref])
      .then(([, gameRef]) => {
        this.gameCreated(gameRef.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  joinGame() {
    const { userID } = this.state;
    firestore
      .collection('games')
      .doc(this.state.gameToJoin)
      .collection('players')
      .doc(userID)
      .set({ in_room: true })
      .then(() => {
        this.gameCreated(this.state.gameToJoin);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleGameToJoinInput(e) {
    this.setState({ gameToJoin: e.target.value });
  }

  render() {
    return (
      <div>
        <button onClick={this.createGame.bind(this)}> Create a game </button>
        <CreateGamePopUp />
        <input type="text" value={this.gameToJoin} onChange={this.handleGameToJoinInput.bind(this)} />
        <button onClick={this.joinGame}>join game</button>
      </div>
    );
  }
}

export default CurrentUserHeader;
