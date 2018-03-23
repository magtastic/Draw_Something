import React, { Component } from 'react';
import styled from 'styled-components';
import app from '../../databases/firestore';
import UserProfile from './UserProfile';
import UserSearch from './UserSearch';

const firestore = app.firestore();

const LobbyContainer = styled.div``;

class Lobby extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
      loading: false,
      players: [],
    };
    this.listenForNewUsers();
  }

  listenForNewUsers() {
    firestore
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
    firestore
      .collection('games')
      .doc(this.state.gameID)
      .set({
        game_started: true,
      }, { merge: true })
      .then(() => {
        this.setState({ loading: true });
        console.log('game created successfully');
      })
      .catch((err) => {
        console.log(`error in creating game: ${err}`);
      });
  }

  addUserToGame(userID) {
    firestore
      .collection('games')
      .doc(this.state.gameID)
      .collection('players')
      .doc(userID)
      .set({ in_room: true })
      .then(() => {
        console.log('player added successfully');
      })
      .catch((err) => {
        console.log('error adding player', err);
      });
  }

  render() {
    return (
      <LobbyContainer>
        <h1>
          Welcome to the lobby.
        </h1>
        <div>
          Here are the players:
          { this.state.players.map(player => <UserProfile key={player} userID={player} />) }
        </div>
        <button onClick={this.startGame.bind(this)}> Start Game </button>
        {
          this.state.loading ?
            <p>Loading...</p>
            :
            null
        }
        <UserSearch userClicked={this.addUserToGame.bind(this)} />
      </LobbyContainer>
    );
  }
}

export default Lobby;
