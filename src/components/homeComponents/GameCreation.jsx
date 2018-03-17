import React, { Component } from 'react';
import styled from 'styled-components';
import app from './../../databases/firestore';
import json from './../../databases/words.json';
import CreateGamePopUp from './CreateGamePopUp';

const GameCreationContainer = styled.div`
`;

const { words } = json;

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
      .add({
        creator: userID,
        game_started: false,
        word: words[Math.floor(Math.random() * words.length)],
      })
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
      <GameCreationContainer>
        <button onClick={this.createGame.bind(this)}> Create a game </button>
        <CreateGamePopUp />
        <input type="text" value={this.gameToJoin} onChange={this.handleGameToJoinInput.bind(this)} />
        <button onClick={this.joinGame}>join game</button>
      </GameCreationContainer>
    );
  }
}

export default CurrentUserHeader;
