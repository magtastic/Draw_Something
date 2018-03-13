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
        if (profile.game_ready) {
          this.setState({ gameHasStarted: true });
        } else {
          this.setState({ gameHasStarted: false });
        }
        this.setState({ gameWord: profile.word });
      })
      .then(() => {
        console.log('game data changed');
      })
      .catch((err) => {
        console.log(`error when fetching game data ${err}`);
      });
  }

  gameCreated(gameID) {
    this.setState({ gameID });
    this.listenIfGameHasStarted();
  }

  render() {
    return (
      <HomeContainer>
        <CurrentUserHeader />
        {
          this.state.gameID && this.state.gameWord ?
            <div>
              {
                this.state.gameHasStarted ?
                  <Board gameID={this.state.gameID} userID={this.state.userID} />
                  :
                  <Lobby gameID={this.state.gameID} word={this.state.gameWord} />
              }
            </div>
            :
            <GameCreation
              userID={this.state.userID}
              gameCreated={this.gameCreated.bind(this)}
            />
        }
      </HomeContainer>
    );
  }
}

export default Home;
