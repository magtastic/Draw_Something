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
    console.log(this.state.gameID);
    app.firestore()
      .collection(`games/${this.state.gameID}/players`)
      .onSnapshot((snaps) => {
        snaps.docChanges.forEach((snap) => {
          console.log(snap);
          switch (snap.type) {
            case 'added': {
              const newPlayer = snap.doc.data();
              console.log('newplayer: ', newPlayer);
              this.setState(prevState => ({ players: [...prevState.players, newPlayer.uid] }));
              break;
            }
            default:
              console.log(snap.doc.data());
          }
        });
      }, (err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <LobbyContainer>
        <h1>
          Hey this is the lobby
          gameID: {this.state.gameID}
        </h1>
        <h3>
          Here are the players:
          {this.state.players}
        </h3>
      </LobbyContainer>
    );
  }
}

export default Lobby;
