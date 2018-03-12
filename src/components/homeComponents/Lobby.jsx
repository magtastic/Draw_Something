import React, { Component } from 'react';
import styled from 'styled-components';
import app from '../../databases/firestore';

const LobbyContainer = styled.div``;

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
      players: [],
    };
    this.listenForNewUsers();
  }

  listenForNewUsers() {
    app.firestore()
      .collection(`games/${this.state.gameID}/players`)
      .onSnapshot((snaps) => {
        snaps.docChanges.forEach((snap) => {
          switch (snap.type) {
            case 'added': {
              this.setState({ players: this.state.players.concat(snap.doc.id) });
              break;
            }
            default:
          }
        });
      }, (err) => {
        console.log(`error in listening for new users ${err}`);
      });
  }

  startGame() {
    app.firestore()
      .collection('games')
      .doc(this.state.gameID)
      .set({
        game_started: true,
      }, { merge: true })
      .then(() => {
        console.log('game created successfully');
      })
      .catch((err) => {
        console.log(`error in creating game: ${err}`);
      });
  }

  render() {
    return (
      <LobbyContainer>
        <h1>
          Hey this is the lobby
          gameID: {this.state.gameID}
        </h1>
        <div>
          Here are the players:
          { this.state.players.map(player => <h2 key={player}> {player} </h2>) }
        </div>
        <button onClick={this.startGame.bind(this)}> Start Game </button>
      </LobbyContainer>
    );
  }
}

export default Lobby;
