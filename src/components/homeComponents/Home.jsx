import React, { Component } from 'react';
import styled from 'styled-components';
import Lobby from './Lobby';
import UserProfile from './UserProfile';
import app from '../../databases/firestore';

const firestore = app.firestore();

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function signOut() {
  app.auth()
    .signOut()
    .then(() => {
      console.log('sign out succ.');
    })
    .catch((err) => {
      console.log(err);
    });
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: props.userID,
    };
  }

  sendPathToFirebase(path) {
    const pathRef = firestore.collection('game').doc(this.state.gameID).collection('paths');
    pathRef.add({ path }).then(() => console.log('all cool'));
  }

  startGame() {
    const { userID } = this.state;
    app.firestore()
      .collection('games')
      .add({ creator: userID })
      .then(ref => [ref.collection('players').add({ userID }), ref])
      .then(([, gameRef]) => {
        this.setState({ gameID: gameRef.id });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  joinGame() {
    const { userID } = this.state;
    app.firestore()
      .collection('game')
      .doc(this.state.gameToJoin)
      .collection('players')
      .add({ userID })
      .then(() => {
        this.setState({ gameID: this.state.gameToJoin });
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
      <HomeContainer>
        <UserProfile userID={this.state.userID} />
        {
          this.state.gameID ?
            <Lobby gameID={this.state.gameID} />
            :
            <button onClick={this.startGame.bind(this)}> Start a game </button>
        }
        <input type="text" value={this.state.gameToJoin} onChange={this.handleGameToJoinInput.bind(this)} />
        <button onClick={this.joinGame.bind(this)}>join game</button>
        <button onClick={signOut}> Logout </button>
      </HomeContainer>
    );
  }
}

export default Home;
