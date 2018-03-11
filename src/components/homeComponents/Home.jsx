import React, { Component } from 'react';
import styled from 'styled-components';
import Lobby from './Lobby';
import Board from './Board';
import GameCreation from './GameCreation';
import CurrentUserHeader from './CurrentUserHeader';
import app from '../../databases/firestore';

const firestore = app.firestore();

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: props.userID,
      gameHasStarted: false,
    };
  }

  listenIfGameHasStarted() {
    firestore
      .collection('games')
      .doc(this.state.gameID)
      .onSnapshot((snap) => {
        const profile = snap.data();
        console.log(profile);
        if (profile.game_started) {
          this.setState({ gameHasStarted: true });
        } else {
          this.setState({ gameHasStarted: false });
        }
      })
      .then(() => {
        console.log('game data changed');
      })
      .catch((err) => {
        console.log(`error when fetching game data ${err}`);
      });
  }

  startGame() {
    const { userID } = this.state;
    firestore
      .collection('games')
      .add({ creator: userID })
      .then(ref => [ref.collection('players').add({ userID }), ref])
      .then(([, gameRef]) => {
        this.setState({ gameID: gameRef.id });
        this.listenIfGameHasStarted();
      })
      .catch((err) => {
        console.log(err);
      });
  }

  joinGame(gameID) {
    const { userID } = this.state;
    firestore
      .collection('games')
      .doc(gameID)
      .collection('players')
      .add({ userID })
      .then(() => {
        this.setState({ gameID });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <HomeContainer>
        <CurrentUserHeader />
        {
          this.state.gameID ?
            <div>
              {
                this.state.gameHasStarted ?
                  <Board gameID={this.state.gameID} />
                  :
                  <Lobby gameID={this.state.gameID} />
              }
            </div>
            :
            <GameCreation
              startGame={this.startGame.bind(this)}
              joinGame={this.joinGame.bind(this)}
            />
        }
      </HomeContainer>
    );
  }
}

export default Home;
