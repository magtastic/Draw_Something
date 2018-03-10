import React, { Component } from 'react';
import styled from 'styled-components';
import app from '../databases/firestore';

const firestore = app.firestore();

const LobbyContainer = styled.div``;

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
    };
    this.listenForNewUsers();
  }

  listenForNewUsers() {
    firestore
      .collection('games')
      .doc(this.state.gameID)
      .collection('players')
      .onSnapshot((docs) => {
        console.log(docs);
        docs.forEach((doc) => {
          console.log(doc.data());
        });
        // const players = doc.data();
        // console.log(players);
        // this.setState({ players });
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
          {this.state.players}
        </h3>
      </LobbyContainer>
    );
  }
}

export default Lobby;
